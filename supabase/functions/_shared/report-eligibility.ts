// Shared eligibility constants for the advisory report pipeline. Kept in
// sync between cron-run-reports (bi-weekly automation) and
// generate-advisory-report (user-triggered) so a subscription check can
// never drift between the two entry points.
export const ELIGIBLE_PRICES = ["auto-fill-monthly", "auto_fill_monthly"] as const;
export const ACTIVE_STATUSES = ["active", "trialing"] as const;

import type { SupabaseClient } from "npm:@supabase/supabase-js@2.45.0";

/** Returns true if the user has an active advisory-eligible subscription
 *  OR is flagged as an internal test account (profiles.internal_test_allow). */
export async function hasReportAccess(admin: SupabaseClient, userId: string): Promise<boolean> {
  const { data: prof } = await admin
    .from("profiles").select("internal_test_allow").eq("id", userId).maybeSingle();
  if (prof && (prof as { internal_test_allow?: boolean }).internal_test_allow === true) return true;
  const { data: sub } = await admin
    .from("subscriptions").select("id")
    .eq("user_id", userId)
    .in("status", ACTIVE_STATUSES as unknown as string[])
    .in("price_id", ELIGIBLE_PRICES as unknown as string[])
    .limit(1).maybeSingle();
  return !!sub;
}

/** Returns the number of advisory_reports rows for user_id in the last 24h. */
export async function reportsInLast24h(admin: SupabaseClient, userId: string): Promise<number> {
  const cutoff = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await admin
    .from("advisory_reports").select("id", { count: "exact", head: true })
    .eq("user_id", userId).gte("created_at", cutoff);
  return count ?? 0;
}
