// Admin-only proxy to run the bi-weekly cron on demand. Validates the caller
// is an admin via the user_roles table, then hits cron-run-reports with the
// server-side CRON_SECRET.
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const user = await getUserFromRequest(req);
    const admin = adminClient();
    const { data: roles } = await admin
      .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!roles) return json({ error: "forbidden" }, 403);

    const secret = Deno.env.get("CRON_SECRET");
    const url = Deno.env.get("SUPABASE_URL");
    if (!secret || !url) return json({ error: "server misconfigured" }, 500);

    const resp = await fetch(`${url}/functions/v1/cron-run-reports`, {
      method: "POST",
      headers: {
        "x-cron-secret": secret,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: "{}",
    });
    const text = await resp.text();
    return json({ status: resp.status, body: safeParse(text) });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function safeParse(s: string) { try { return JSON.parse(s); } catch { return s; } }
