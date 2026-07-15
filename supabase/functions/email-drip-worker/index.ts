// Time-based email drip worker for the free-Vault → $150/mo Reports funnel.
// Cron-triggered hourly (see migration schedule_email_drip). Idempotent: one
// row per (email, email_key) in lead_email_sends is the double-send guard.
//
// Rules (see docs/lovable-email-automation-prompt.md):
//  - At most one email per contact per run.
//  - Skip if the contact has any send newer than 48h (throttle).
//  - Skip if unsubscribed_at set, or the email is in email_suppressions.
//  - Converted contacts get the ascension track, never the sales spine.
//  - No backfill of skipped rungs — send only the highest-numbered due rung.

import { createClient } from "npm:@supabase/supabase-js@2.45.0";
import { COPY, SALES_MATRIX, ASCENSION_MATRIX, type EmailKey } from "../_shared/lead-drip-copy.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const DAY_MS = 86_400_000;
const THROTTLE_MS = 48 * 60 * 60 * 1000;

function adminClient() {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(url, key, { auth: { persistSession: false } });
}

function siteUrl(): string {
  return (Deno.env.get("SITE_URL") ?? "https://goldfindesk.com").replace(/\/$/, "");
}

function unsubscribeUrl(token: string): string {
  // Prefer the public custom domain (falls back to Supabase functions URL).
  const explicit = Deno.env.get("LEAD_UNSUBSCRIBE_URL");
  if (explicit) return `${explicit.replace(/\/$/, "")}?token=${token}`;
  const base = Deno.env.get("SUPABASE_URL")!.replace(/\/$/, "");
  return `${base}/functions/v1/lead-unsubscribe?token=${token}`;
}

function renderShell(opts: {
  firstName: string;
  preview: string;
  bodyHtml: string;
  unsubUrl: string;
  site: string;
}): string {
  const { firstName, preview, bodyHtml, unsubUrl, site } = opts;
  const clean = firstName?.trim();
  const hi = clean && clean.toLowerCase() !== "friend" ? `Hi ${clean},` : "Hi,";
  const body = 'font-size:16px;line-height:1.65;margin:0 0 18px';
  const muted = 'font-size:12.5px;line-height:1.55;color:#8A93A3;margin:0 0 8px';
  const rendered = bodyHtml.replaceAll("{{SITE_URL}}", site);
  return `<!doctype html><html><head><meta charset="utf-8"><title>${preview}</title></head>
<body style="margin:0;background:#ffffff;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0B0D12">
  <span style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden">${preview}</span>
  <div style="max-width:560px;margin:0 auto;padding:40px 28px">
    <p style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#B8893A;margin:0 0 20px">GoldFin Desk</p>
    <p style="${body}">${hi}</p>
    ${rendered}
    <p style="font-size:15px;line-height:1.6;margin:0 0 4px">— Chris Sam</p>
    <p style="font-size:13px;line-height:1.5;color:#8A93A3;margin:0 0 28px">GoldFin Desk</p>
    <hr style="border:none;border-top:1px solid #E6E8EC;margin:0 0 20px" />
    <p style="${muted}">You're receiving this because you requested the GoldFin Template Vault. <a href="${unsubUrl}" style="color:#B8893A">Unsubscribe</a>.</p>
  </div>
</body></html>`;
}

// Contact = one earliest lead row per lowercased email, with terminal flags
// resolved across all rows for that email (any unsubscribed_at wins; earliest
// converted_at wins).
type Contact = {
  email: string;
  firstName: string;
  createdAt: string;
  unsubscribedAt: string | null;
  convertedAt: string | null;
  token: string;
};

async function loadContacts(admin: ReturnType<typeof adminClient>): Promise<Contact[]> {
  const { data, error } = await admin
    .from("leads")
    .select("email, first_name, created_at, unsubscribed_at, converted_at, unsubscribe_token")
    .order("created_at", { ascending: true });
  if (error) throw new Error(`load leads: ${error.message}`);
  const map = new Map<string, Contact>();
  for (const row of data ?? []) {
    const email = String(row.email ?? "").trim().toLowerCase();
    if (!email || !email.includes("@")) continue;
    const existing = map.get(email);
    if (!existing) {
      map.set(email, {
        email,
        firstName: (row.first_name as string) ?? "",
        createdAt: row.created_at as string,
        unsubscribedAt: (row.unsubscribed_at as string | null) ?? null,
        convertedAt: (row.converted_at as string | null) ?? null,
        token: row.unsubscribe_token as string,
      });
    } else {
      // Any unsubscribed_at wins; earliest converted_at wins.
      if (row.unsubscribed_at && !existing.unsubscribedAt) existing.unsubscribedAt = row.unsubscribed_at as string;
      if (row.converted_at) {
        const t = row.converted_at as string;
        if (!existing.convertedAt || t < existing.convertedAt) existing.convertedAt = t;
      }
      // Prefer a non-empty, non-"Friend" first name if the earliest row had none.
      if ((!existing.firstName || existing.firstName === "Friend") && row.first_name) {
        existing.firstName = row.first_name as string;
      }
    }
  }
  return [...map.values()];
}

function pickDueKey(daysSince: number, matrix: Array<{ key: EmailKey; day: number }>, alreadySent: Set<string>): EmailKey | null {
  // Highest-numbered due rung not yet sent. Matrix is ordered ascending.
  for (let i = matrix.length - 1; i >= 0; i--) {
    const { key, day } = matrix[i];
    if (daysSince >= day && !alreadySent.has(key)) return key;
  }
  return null;
}

async function sendViaResend(opts: {
  to: string;
  subject: string;
  html: string;
  unsubUrl: string;
}): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!lovableKey || !resendKey) return { ok: false, error: "no_api_key" };
  const from = Deno.env.get("RESEND_FROM") ?? "Chris Sam — GoldFin Desk <noreply@goldfindesk.com>";
  const replyTo = Deno.env.get("REPLY_TO_EMAIL");
  const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      ...(replyTo ? { reply_to: replyTo } : {}),
      headers: {
        "List-Unsubscribe": `<${opts.unsubUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, error: `resend ${res.status}: ${text.slice(0, 300)}` };
  }
  const body = await res.json().catch(() => ({} as { id?: string }));
  return { ok: true, messageId: (body as { id?: string })?.id };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const secret = Deno.env.get("CRON_SECRET");
  if (!secret || req.headers.get("x-cron-secret") !== secret) {
    return json({ error: "unauthorized" }, 401);
  }

  const admin = adminClient();
  const site = siteUrl();
  const now = Date.now();

  try {
    // 1. Contacts (deduped by lowercased email; earliest signup wins).
    const contacts = await loadContacts(admin);

    // 2. Suppression list — cover both this run and the throttle check.
    const emails = contacts.map((c) => c.email);
    const [{ data: suppRows }, { data: sendRows }] = await Promise.all([
      admin.from("email_suppressions").select("email").in("email", emails.length ? emails : [""]),
      admin.from("lead_email_sends").select("email, email_key, sent_at").in("email", emails.length ? emails : [""]),
    ]);
    const suppressed = new Set((suppRows ?? []).map((r) => String(r.email).toLowerCase()));
    const sendsByEmail = new Map<string, Array<{ email_key: string; sent_at: string }>>();
    for (const s of sendRows ?? []) {
      const list = sendsByEmail.get(s.email as string) ?? [];
      list.push({ email_key: s.email_key as string, sent_at: s.sent_at as string });
      sendsByEmail.set(s.email as string, list);
    }

    let considered = 0, sent = 0, throttled = 0, skipped = 0, failed = 0;
    const details: Array<{ email: string; key?: EmailKey; result: string }> = [];

    for (const c of contacts) {
      considered++;
      if (c.unsubscribedAt) { skipped++; continue; }
      if (suppressed.has(c.email)) { skipped++; continue; }

      const history = sendsByEmail.get(c.email) ?? [];
      const withinThrottle = history.some((h) => now - Date.parse(h.sent_at) < THROTTLE_MS);
      if (withinThrottle) { throttled++; continue; }
      const alreadySent = new Set(history.map((h) => h.email_key));

      let key: EmailKey | null = null;
      let anchorMs: number;
      if (c.convertedAt) {
        anchorMs = Date.parse(c.convertedAt);
        const days = Math.floor((now - anchorMs) / DAY_MS);
        // Ascension: skip any seq_ sends from prior history (they're irrelevant now).
        key = pickDueKey(days, ASCENSION_MATRIX, alreadySent);
      } else {
        anchorMs = Date.parse(c.createdAt);
        const days = Math.floor((now - anchorMs) / DAY_MS);
        key = pickDueKey(days, SALES_MATRIX, alreadySent);
      }
      if (!key) { skipped++; continue; }

      // Idempotent guard: insert ledger row BEFORE sending. If the unique
      // (email, email_key) conflicts (concurrent worker), skip.
      const { data: claimed, error: claimErr } = await admin
        .from("lead_email_sends")
        .insert({ email: c.email, email_key: key })
        .select("id")
        .maybeSingle();
      if (claimErr) {
        // Unique-violation on concurrent claim: another worker got it. Not a failure.
        if (String(claimErr.code) === "23505" || /duplicate key/i.test(claimErr.message)) {
          details.push({ email: c.email, key, result: "conflict" });
          continue;
        }
        failed++;
        details.push({ email: c.email, key, result: `claim_error: ${claimErr.message}` });
        continue;
      }
      if (!claimed) {
        details.push({ email: c.email, key, result: "conflict" });
        continue;
      }

      const copy = COPY[key];
      const unsubUrl = unsubscribeUrl(c.token);
      const html = renderShell({
        firstName: c.firstName,
        preview: copy.preview,
        bodyHtml: copy.bodyHtml,
        unsubUrl,
        site,
      });

      const result = await sendViaResend({
        to: c.email,
        subject: copy.subject,
        html,
        unsubUrl,
      });
      if (result.ok) {
        sent++;
        details.push({ email: c.email, key, result: "sent" });
        if (result.messageId) {
          await admin.from("lead_email_sends")
            .update({ provider_message_id: result.messageId })
            .eq("id", claimed.id);
        }
      } else {
        // Silent miss — keep the ledger row so we never double-send. Logged for
        // operator inspection; the throttle keeps retries at bay for 48h.
        failed++;
        console.error("drip send failed", c.email, key, result.error);
        details.push({ email: c.email, key, result: `error: ${result.error}` });
      }
    }

    return json({ ok: true, considered, sent, throttled, skipped, failed, details });
  } catch (e) {
    console.error("email-drip-worker fatal", e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
