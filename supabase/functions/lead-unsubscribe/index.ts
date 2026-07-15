// Public one-click unsubscribe for the free-Vault marketing drip. Token-gated.
//   GET  -> flips unsubscribed_at on every lead row for the token's email,
//           returns a small branded confirmation page.
//   POST -> RFC 8058 List-Unsubscribe one-click; same flag flip, returns 200.
// The drip worker (email-drip-worker) reads leads.unsubscribed_at and skips
// anyone with it set, so this is the single authority for opt-out.
import { adminClient, corsHeaders } from "../_shared/auth-context.ts";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function page(title: string, body: string): Response {
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
  <body style="margin:0;background:#ffffff;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0B0D12">
    <div style="max-width:480px;margin:0 auto;padding:64px 24px;text-align:center">
      <p style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#B8893A;margin:0 0 12px">GoldFin Desk</p>
      <h1 style="font-size:22px;font-weight:400;margin:0 0 10px">${title}</h1>
      <p style="font-size:14.5px;line-height:1.7;color:#3A4150;margin:0">${body}</p>
    </div></body></html>`;
  return new Response(html, { status: 200, headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } });
}

// Apply to every lead row sharing the token's email — one person, one opt-out,
// regardless of how many capture forms they submitted.
async function applyUnsubscribe(token: string): Promise<boolean> {
  const admin = adminClient();
  const { data: lookup, error: lookupErr } = await admin
    .from("leads")
    .select("email")
    .eq("unsubscribe_token", token)
    .limit(1)
    .maybeSingle();
  if (lookupErr || !lookup?.email) return false;
  const email = String(lookup.email);
  const { error: updateErr } = await admin
    .from("leads")
    .update({ unsubscribed_at: new Date().toISOString() })
    .ilike("email", email)
    .is("unsubscribed_at", null);
  return !updateErr;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  let token = url.searchParams.get("token") ?? "";
  if (!token && req.method === "POST") {
    try {
      const ct = req.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) token = (await req.json())?.token ?? "";
      else { const f = await req.formData(); token = String(f.get("token") ?? ""); }
    } catch { /* ignore malformed body */ }
  }

  const invalid = "This unsubscribe link is invalid or has expired. If you keep receiving emails you didn't ask for, reply to any GoldFin Desk email and we'll take you off the list manually.";
  if (!UUID_RE.test(token)) {
    if (req.method === "POST") return new Response("invalid token", { status: 400, headers: corsHeaders });
    return page("Link not recognized", invalid);
  }

  const ok = await applyUnsubscribe(token);
  if (req.method === "POST") return new Response(ok ? "ok" : "not found", { status: ok ? 200 : 404, headers: corsHeaders });
  return ok
    ? page("You are unsubscribed", "You will no longer receive the GoldFin Template Vault follow-up emails. Your paid subscription notifications, if any, are not affected.")
    : page("Link not recognized", invalid);
});
