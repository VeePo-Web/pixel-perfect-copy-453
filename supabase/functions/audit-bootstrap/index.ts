// TEMPORARY audit-only edge function. Mints sessions for throwaway test users
// so the assistant can run the Plaid E2E audit end-to-end without an inbox.
// This file is deleted after the audit run — do not depend on it.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SECRET = Deno.env.get("AUDIT_BOOTSTRAP_SECRET")!;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (req.headers.get("x-audit-bootstrap-secret") !== SECRET) {
    return json({ error: "unauthorized" }, 401);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let body: any = {};
  try { body = await req.json(); } catch {}
  const action = body?.action;

  if (action === "mint") {
    const email = String(body.email || "");
    if (!email) return json({ error: "email required" }, 400);

    // Idempotent create
    let userId: string | null = null;
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    if (createErr && !/registered|exists/i.test(createErr.message)) {
      return json({ error: `createUser: ${createErr.message}` }, 500);
    }
    if (created?.user) userId = created.user.id;
    if (!userId) {
      // fetch existing
      const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      userId = list?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id ?? null;
    }
    if (!userId) return json({ error: "could not resolve user id" }, 500);

    const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkErr || !link?.properties?.hashed_token) {
      return json({ error: `generateLink: ${linkErr?.message || "no token"}` }, 500);
    }
    const tokenHash = link.properties.hashed_token;

    // Exchange hashed token for a real session via /auth/v1/verify
    const verifyRes = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON,
      },
      body: JSON.stringify({ type: "magiclink", token: tokenHash }),
    });
    const verifyText = await verifyRes.text();
    let session: any = null;
    try { session = JSON.parse(verifyText); } catch {}

    if (!verifyRes.ok || !session?.access_token) {
      // Fall back to verifyOtp-shaped POST
      const alt = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ANON },
        body: JSON.stringify({ type: "magiclink", token_hash: tokenHash }),
      });
      const altText = await alt.text();
      try { session = JSON.parse(altText); } catch {}
      if (!alt.ok || !session?.access_token) {
        return json({ error: "verify failed", detail: verifyText, alt: altText }, 500);
      }
    }

    return json({
      user_id: userId,
      email,
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_in: session.expires_in,
    });
  }

  if (action === "cleanup") {
    const emails: string[] = Array.isArray(body.emails) ? body.emails : [];
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 500 });
    const deleted: string[] = [];
    for (const email of emails) {
      const u = list?.users.find((x) => x.email?.toLowerCase() === email.toLowerCase());
      if (u) {
        const { error } = await admin.auth.admin.deleteUser(u.id);
        if (!error) deleted.push(email);
      }
    }
    return json({ deleted });
  }

  return json({ error: "unknown action" }, 400);
});
