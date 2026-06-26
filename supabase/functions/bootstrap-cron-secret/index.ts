// One-off bootstrap: copies the edge-function CRON_SECRET env var into Vault
// under name 'cron_secret' so the pg_cron 'advisory-report-biweekly' job can
// authenticate calls to cron-run-reports. Idempotent.
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async () => {
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret) return new Response(JSON.stringify({ ok: false, error: "CRON_SECRET not set" }), { status: 500 });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { error } = await admin.rpc("upsert_cron_secret", { p_secret: cronSecret });
  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
});
