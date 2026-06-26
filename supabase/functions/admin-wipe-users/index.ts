// One-shot admin endpoint to wipe ALL users + dependent rows. Guarded by a
// shared secret header so it can only be invoked deliberately. Delete this
// function after launch.
import { adminClient, corsHeaders, json } from "../_shared/auth-context.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const expected = Deno.env.get("CRON_SECRET");
  const got = req.headers.get("x-admin-secret");
  if (!expected || got !== expected) return json({ error: "Forbidden" }, 403);

  const admin = adminClient();

  // Public tables first (FK cascades on auth.users delete handle most, but be explicit).
  const tables = [
    "plaid_accounts",
    "plaid_items",
    "subscriptions",
    "tos_acceptances",
    "login_otps",
    "user_roles",
    "profiles",
  ];
  for (const t of tables) {
    const { error } = await admin.from(t).delete().not("id", "is", null);
    if (error) console.error(`wipe ${t}`, error);
  }

  let page = 1;
  let deleted = 0;
  // Paginate through users and delete each.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data?.users?.length) break;
    for (const u of data.users) {
      const { error: dErr } = await admin.auth.admin.deleteUser(u.id);
      if (dErr) console.error("deleteUser", u.id, dErr);
      else deleted++;
    }
    if (data.users.length < 200) break;
    page++;
  }

  return json({ ok: true, deleted });
});
