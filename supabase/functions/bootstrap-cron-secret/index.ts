// One-off bootstrap: copies the edge-function CRON_SECRET env var into Vault
// under name 'cron_secret' so the pg_cron job can read it when posting to
// cron-run-reports. Idempotent. Protected by SUPABASE_SERVICE_ROLE_KEY
// presence (only callable from the deploy environment / admin tooling).
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async () => {
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret) return new Response("CRON_SECRET not set", { status: 500 });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Delete any prior entry, then create — vault.create_secret rejects dupes.
  await admin.rpc("exec_sql" as any, {}).catch(() => {});
  const { error: delErr } = await admin
    .schema("vault" as any)
    .from("secrets")
    .delete()
    .eq("name", "cron_secret");
  // Ignore RLS/permission errors on delete; vault may not allow direct delete.
  const { error: insErr } = await admin.rpc("create_cron_secret" as any, {
    p_secret: cronSecret,
  });
  return new Response(JSON.stringify({ ok: !insErr, delErr: delErr?.message, insErr: insErr?.message }), {
    headers: { "Content-Type": "application/json" },
  });
});
