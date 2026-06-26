// =========================================================================
// RESEND (Svix) WEBHOOK — email lifecycle ingestion for the advisory report.
//   1. Stamps delivered/opened/clicked/bounced/complained timestamps on the
//      matching report_email_deliveries row (by provider_message_id).
//   2. Auto-suppresses hard bounces + spam complaints (email_suppressions) so
//      the delivery engine never emails a dead/complaining address again —
//      this is what protects sender reputation. A complaint also hard opts the
//      user out of advisory emails.
// Signature-verified (Svix/HMAC-SHA256) and FAIL-CLOSED: an unconfigured or
// invalid signature is rejected, so forged events cannot poison the list.
// Public route (verify_jwt = false in config.toml); the signature is the auth.
// =========================================================================
import { adminClient, corsHeaders, json } from "../_shared/auth-context.ts";
import { suppressionReasonForEvent, deliveryTimestampField } from "../_shared/report-delivery.ts";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

// Verify a Svix signature (the scheme Resend uses): the signed content is
// `${id}.${timestamp}.${body}`, HMAC-SHA256 with the base64 secret after
// "whsec_", compared (base64) against any `v1,<sig>` entry in svix-signature.
async function verifySvix(secret: string, id: string, ts: string, body: string, header: string): Promise<boolean> {
  try {
    const raw = secret.startsWith("whsec_") ? secret.slice(6) : secret;
    const keyBytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
    const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const buf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(id + "." + ts + "." + body));
    const expected = btoa(String.fromCharCode(...new Uint8Array(buf)));
    return header.split(" ").some((part) => {
      const comma = part.indexOf(",");
      const sig = comma >= 0 ? part.slice(comma + 1) : part;
      return !!sig && timingSafeEqual(sig, expected);
    });
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const secret = Deno.env.get("RESEND_WEBHOOK_SECRET");
  if (!secret) return json({ error: "webhook_not_configured" }, 503);

  const body = await req.text();
  const id = req.headers.get("svix-id") ?? "";
  const ts = req.headers.get("svix-timestamp") ?? "";
  const sig = req.headers.get("svix-signature") ?? "";
  if (!id || !ts || !sig || !(await verifySvix(secret, id, ts, body, sig))) {
    return json({ error: "invalid_signature" }, 401);
  }

  let event: { type?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(body);
  } catch {
    return json({ error: "bad_json" }, 400);
  }

  const type = event.type ?? "";
  const data = event.data ?? {};
  const messageId = (data.email_id as string | undefined) ?? (data.id as string | undefined) ?? null;
  const toField = data.to;
  const recipient = Array.isArray(toField) ? String(toField[0] ?? "") : ((toField as string | undefined) ?? "");

  const admin = adminClient();
  const nowIso = new Date().toISOString();

  // 1. Stamp the lifecycle timestamp (by provider message id).
  const field = deliveryTimestampField(type);
  if (field && messageId) {
    await admin.from("report_email_deliveries").update({ [field]: nowIso }).eq("provider_message_id", messageId);
  }

  // 2. Suppress hard bounces + complaints; a complaint also opts the user out.
  const reason = suppressionReasonForEvent(type);
  if (reason && recipient) {
    const email = recipient.toLowerCase();
    await admin.from("email_suppressions").upsert(
      { email, reason, detail: type },
      { onConflict: "email", ignoreDuplicates: false },
    );
    if (reason === "complaint") {
      const { data: del } = await admin
        .from("report_email_deliveries").select("user_id").ilike("recipient_email", email).limit(1).maybeSingle();
      if (del?.user_id) {
        await admin.from("email_preferences").upsert(
          { user_id: del.user_id, advisory_report_enabled: false, unsubscribed_at: nowIso },
          { onConflict: "user_id" },
        );
      }
    }
  }

  return json({ ok: true });
});
