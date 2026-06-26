// Daily retention sweep. Calls the SECURITY DEFINER `run_retention_sweep` SQL
// function which purges expired data per the documented schedule, then hard-
// deletes accounts whose 30-day grace window has elapsed. Gated by CRON_SECRET.
import { adminClient, corsHeaders, json } from "../_shared/auth-context.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const secret = Deno.env.get("CRON_SECRET");
    if (!secret || req.headers.get("x-cron-secret") !== secret) {
      return json({ error: "unauthorized" }, 401);
    }
    const admin = adminClient();
    const { data: runRow } = await admin
      .from("cron_runs")
      .insert({ job: "retention-sweep" })
      .select("id")
      .maybeSingle();
    const runId = runRow?.id as string | undefined;

    // 1. Purge expired rows across all tables.
    const { data: sweep, error: sweepErr } = await admin.rpc("run_retention_sweep");
    if (sweepErr) throw new Error(sweepErr.message);

    // 2. Hard-delete users whose 30-day grace window has elapsed.
    const cutoff = new Date(Date.now() - 30 * 86_400_000).toISOString();
    const { data: due } = await admin
      .from("profiles")
      .select("id")
      .lt("deletion_requested_at", cutoff)
      .is("deletion_executed_at", null);

    let deletedUsers = 0;
    for (const row of due ?? []) {
      try {
        // Cascades through profiles/plaid_items/subscriptions via FK ON DELETE CASCADE.
        const { error } = await admin.auth.admin.deleteUser(row.id as string);
        if (error) {
          console.error("hard-delete failed", row.id, error.message);
          continue;
        }
        deletedUsers++;
      } catch (e) {
        console.error("hard-delete exception", row.id, e);
      }
    }

    const summary = { ...(sweep as Record<string, unknown>), hard_deleted_users: deletedUsers };

    if (runId) {
      await admin
        .from("cron_runs")
        .update({
          finished_at: new Date().toISOString(),
          summary,
        })
        .eq("id", runId);
    }

    return json({ ok: true, summary });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown" }, 500);
  }
});
