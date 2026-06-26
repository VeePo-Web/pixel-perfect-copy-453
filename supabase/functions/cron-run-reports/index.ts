// Bi-weekly automation: generates + emails the advisory report for every user
// who is due (has a connected account and no report in the last 13 days).
// Service-role; gated by a shared CRON_SECRET header so it can't be triggered
// publicly. Invoked on schedule by pg_cron (see migration 20260623140000).
import { adminClient, corsHeaders, json } from "../_shared/auth-context.ts";
import { generateReportForUser } from "../_shared/report-core.ts";

const DUE_AFTER_DAYS = 13;
const MAX_BATCH = 100;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const secret = Deno.env.get("CRON_SECRET");
    if (!secret || req.headers.get("x-cron-secret") !== secret) {
      return json({ error: "unauthorized" }, 401);
    }

    const admin = adminClient();
    const today = new Date().toISOString().slice(0, 10);
    const dueCutoff = new Date(Date.now() - DUE_AFTER_DAYS * 86_400_000).toISOString();

    // Candidate users: an active connected bank AND an active paid subscription
    // on a plan that includes the advisory report.
    const ELIGIBLE_PLANS = ["auto-fill-monthly", "finance-desk-monthly"];
    const ACTIVE_STATUSES = ["active", "trialing"];
    const { data: items } = await admin
      .from("plaid_items").select("user_id").eq("status", "active");
    const itemUserIds = new Set((items ?? []).map((i) => i.user_id as string));
    if (itemUserIds.size === 0) {
      return json({ candidates: 0, generated: 0, sent: 0, skipped: 0, failed: 0, processed: 0 });
    }
    const { data: subs } = await admin
      .from("subscriptions").select("user_id, plan, status")
      .in("user_id", [...itemUserIds])
      .in("status", ACTIVE_STATUSES)
      .in("plan", ELIGIBLE_PLANS);
    const userIds = [...new Set((subs ?? []).map((s) => s.user_id as string).filter(Boolean))];


    let generated = 0, sent = 0, skipped = 0, failed = 0;
    const processed: string[] = [];

    for (const uid of userIds.slice(0, MAX_BATCH)) {
      // Skip if a report was already created within the window.
      const { data: last } = await admin
        .from("advisory_reports").select("created_at")
        .eq("user_id", uid).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (last?.created_at && last.created_at > dueCutoff) { skipped++; continue; }

      try {
        const r = await generateReportForUser(admin, uid, { send: true, today });
        if (!r.ok) { skipped++; continue; }
        generated++;
        if (r.sent) sent++;
        processed.push(uid);
      } catch (e) {
        failed++;
        console.error("cron generate failed for", uid, e instanceof Error ? e.message : e);
      }
    }

    return json({ candidates: userIds.length, generated, sent, skipped, failed, processed: processed.length });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
