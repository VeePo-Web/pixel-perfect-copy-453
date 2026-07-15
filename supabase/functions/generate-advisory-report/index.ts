// User-facing entry point for the grounded advisory report. Thin wrapper over
// the shared core (report-core.ts) — auth, subscription gate, per-user rate
// limit, then generate for the caller.
// SEPARATE from generate-briefing (Gemini marketing DEMO, which invents numbers).
//
// Abuse hole closed 2026-07-15 (Task 4 of the pipeline audit): signup is open
// + auto-confirmed on this project, so requiring only a logged-in user let
// anyone script signups and burn unlimited AI-gateway credits. Now the caller
// must (a) hold an eligible active subscription OR (b) be flagged
// profiles.internal_test_allow=true, AND (c) not exceed 3 generations per 24h.
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { generateReportForUser } from "../_shared/report-core.ts";
import { hasReportAccess, reportsInLast24h } from "../_shared/report-eligibility.ts";

const Body = z.object({ periodEnd: z.string().optional(), send: z.boolean().optional() }).default({});
const DAILY_LIMIT = 3;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const user = await getUserFromRequest(req);
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

    const admin = adminClient();

    // (a/b) Subscription or internal-test bypass.
    const allowed = await hasReportAccess(admin, user.id);
    if (!allowed) {
      return json({
        error: "subscription_required",
        message: "An active Auto-Fill Monthly subscription is required to generate reports.",
      }, 402);
    }

    // (c) Per-user 24h rate limit.
    const recent = await reportsInLast24h(admin, user.id);
    if (recent >= DAILY_LIMIT) {
      return new Response(
        JSON.stringify({
          error: "rate_limited",
          message: `Report generation is limited to ${DAILY_LIMIT} per 24 hours.`,
          limit: DAILY_LIMIT,
          window_hours: 24,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "3600" },
        },
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const result = await generateReportForUser(admin, user.id, {
      periodEnd: parsed.data.periodEnd,
      send: parsed.data.send ?? false,
      today,
    });

    if (!result.ok) {
      const status = result.reason === "no_transactions" ? 422 : 500;
      return json({ error: result.reason }, status);
    }
    return json(result);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
