// Shared eligibility constants for the advisory report pipeline. Kept in
// sync between cron-run-reports (bi-weekly automation) and
// generate-advisory-report (user-triggered) so a subscription check can
// never drift between the two entry points.
export const ELIGIBLE_PRICES = ["auto-fill-monthly", "auto_fill_monthly"] as const;
export const ACTIVE_STATUSES = ["active", "trialing"] as const;

import type { SupabaseClient } from "npm:@supabase/supabase-js@2.45.0";

/** Server-side internal-test allowlist. MUST be an edge-function secret
 *  (comma-separated emails), never a user-writable DB column.
 *
 *  SECURITY (2026-07-15): the previous implementation trusted
 *  `profiles.internal_test_allow`, but the profiles UPDATE policy is own-row
 *  (`auth.uid() = id`) with a table-wide column grant, so ANY authenticated
 *  user could PATCH `internal_test_allow=true` on their own row and bypass the
 *  paywall — confirmed exploitable live (402 → 422 after self-setting the
 *  flag). The bypass is now keyed to a server secret the user cannot write. */
function isInternalTestEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allow = (Deno.env.get("ADVISORY_TEST_EMAILS") ?? "")
    .toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
  return allow.includes(email.toLowerCase());
}

/** Returns true if the user has an active advisory-eligible subscription
 *  OR their email is on the server-side internal-test allowlist. The caller
 *  passes the email from the verified JWT (getUserFromRequest), never from a
 *  client-writable source. */
export async function hasReportAccess(
  admin: SupabaseClient,
  userId: string,
  email?: string | null,
): Promise<boolean> {
  if (isInternalTestEmail(email)) return true;
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
