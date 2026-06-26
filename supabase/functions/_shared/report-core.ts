// =========================================================================
// REPORT CORE — the grounded generation+send pipeline, callable by service
// role for any user_id (so BOTH the user-facing function and the bi-weekly
// cron share one implementation). Server-authoritative.
//   Layer 1 metrics (deterministic)  Layer 2 memory  Layer 3 Opus 4.8
//   Layer 4 verify (block invented numbers)  Layer 5 persist + email
// =========================================================================
import type { SupabaseClient } from "npm:@supabase/supabase-js@2.45.0";
import { computeMetrics, type MetricsPayload, type Txn } from "./report-metrics.ts";
import { verifyReport } from "./report-verify.ts";
import { deliverReportEmail } from "./report-delivery.ts";

const BENCHMARKS: Record<string, { nums: number[]; text: string }> = {
  restaurant: { nums: [55, 65, 28, 35], text: "Prime cost target 55–65% of sales; food cost 28–35%." },
  agency: { nums: [75, 85], text: "Billable utilization target 75%+; gross margin target 85%+." },
  ecommerce: { nums: [3], text: "Healthy LTV:CAC ratio is 3:1 or better." },
  saas: { nums: [3], text: "Healthy LTV:CAC ratio is 3:1 or better." },
  contractor: { nums: [], text: "Underbilling is the #1 reason profitable contractors run out of cash." },
  retail: { nums: [1], text: "GMROI above 1 means inventory sells for more than it costs." },
  professional_services: { nums: [15, 25], text: "Professional services net margin typically 15–25%." },
  other: { nums: [], text: "" },
};

export const SYSTEM_PROMPT =
  `You are GoldFin Desk — a senior CFO/CPA-grade advisor writing a bi-weekly financial advisory report for a small business owner. You write like a trusted human CFO, not a SaaS dashboard.

ABSOLUTE GROUNDING RULES (non-negotiable):
- Use ONLY the figures in the METRICS payload. Never state, estimate, round to, or invent a number that is not in METRICS.
- If a figure is missing or coverage is below threshold, say so plainly and scope the claim. Never fill a gap with a guess.
- Every recommendation must cite a specific figure and end in a concrete action with a dollar amount and a timeframe.
- For any tax/entity opportunity, present it as an ESTIMATE to discuss with their CPA, never tax advice; always say "ask your CPA before [date]".

VOICE: plain English, Grade 6–8, short sentences, calm and premium. No hype, no exclamation marks, no emojis in the body, never the words "AI", "magic", "leverage", "supercharge". Use standard accounting terms AND translate them plainly.

STRUCTURE (story-first — answer before detail):
1. verdict ("Am I OK?"): open with the single most important truth, even if it contradicts the owner's optimism. If revenue rose but profit or cash fell, SAY THAT FIRST. Reconcile revenue vs profit vs cash.
2. accountability: if MEMORY has a prior recommendation, follow up — "Last cycle I recommended X; here's what happened / it's still open."
3. what_changed: 2–4 biggest moves, each "from -> to, because [driver]".
4. making_money: lead with the owner's INDUSTRY metric; name what's working and the dollar opportunity (use contributionByLine when present).
5. leaking: dormant subscriptions, duplicate/gray card charges (+ the 60-day dispute deadline), cost-creep — each with the dollar figure.
6. tax: the entity/tax estimate from METRICS, routed to their CPA (only if present).
7. free_cash: collections / cash trapped.
8. grow: ONLY if reserve is secured, recommend a reinvestment budget; otherwise "not yet, secure the reserve first." Growth is the least-certain bucket.
9. decisions: 2–4 ranked actions, each a dollar impact, a deadline, and a bucket tag [find_cash | keep_more | earn_new].

CONTEXT RULE: anchor every number to history, the benchmark, or the plan. FIVE-SECOND RULE: a reader grasps any sentence in five seconds. Return via the return_report tool. Do not output any figure absent from METRICS.`;

const TOOL = {
  type: "function",
  function: {
    name: "return_report",
    description: "Return the grounded advisory report.",
    parameters: {
      type: "object",
      properties: {
        subject_line: { type: "string" },
        sections: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key: { type: "string", enum: ["verdict", "accountability", "what_changed", "making_money", "leaking", "tax", "free_cash", "grow", "decisions"] },
              heading: { type: "string" }, body: { type: "string" },
            },
            required: ["key", "heading", "body"], additionalProperties: false,
          },
        },
        recommendations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string" }, bucket: { type: "string", enum: ["find_cash", "keep_more", "earn_new"] },
              dollar: { type: ["number", "null"] }, deadline: { type: ["string", "null"] },
            },
            required: ["text", "bucket"], additionalProperties: false,
          },
        },
      },
      required: ["subject_line", "sections", "recommendations"], additionalProperties: false,
    },
  },
};

function periodRange(end: string, days: number) {
  const e = Date.parse(end);
  return { start: new Date(e - days * 86_400_000).toISOString().slice(0, 10), end };
}

export type GenerateResult =
  | { ok: true; id: string; status: string; verification_passed: boolean; coverage_pct: number; sent: boolean }
  | { ok: false; reason: string };

export async function generateReportForUser(
  admin: SupabaseClient,
  userId: string,
  opts: { periodEnd?: string; send?: boolean; today: string },
): Promise<GenerateResult> {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  if (!lovableKey) return { ok: false, reason: "missing_api_key" };
  const model = Deno.env.get("ADVISORY_MODEL") ?? "claude-opus-4-8";

  const periodEnd = opts.periodEnd ?? opts.today;
  const cur = periodRange(periodEnd, 14);
  const prior = periodRange(cur.start, 14);

  const [profileRes, acctRes, txRes, streamRes, ledgerRes, priorReportRes, profEmailRes, inputsRes] = await Promise.all([
    admin.from("business_profiles").select("business_name, industry, entity_type, reserve_floor_months").eq("user_id", userId).maybeSingle(),
    admin.from("plaid_accounts").select("current_balance, type").eq("user_id", userId),
    admin.from("plaid_transactions").select("posted_date, name, merchant_name_norm, amount, category, confidence").eq("user_id", userId).gte("posted_date", prior.start).lte("posted_date", cur.end),
    admin.from("recurring_streams").select("direction, description, merchant_name, category, frequency, last_amount, first_amount, last_date, is_active").eq("user_id", userId),
    admin.from("ledger_entries").select("entry_date, kind, amount, revenue_line, category, is_variable").eq("user_id", userId).gte("entry_date", cur.start).lte("entry_date", cur.end),
    admin.from("advisory_reports").select("metrics_snapshot, recommendations, period_end").eq("user_id", userId).eq("status", "generated").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    admin.from("profiles").select("email, first_name").eq("id", userId).maybeSingle(),
    admin.from("business_metric_inputs").select("inputs").eq("user_id", userId).gte("period_end", cur.start).order("period_end", { ascending: false }).limit(1).maybeSingle(),
  ]);

  const profile = profileRes.data ?? { business_name: null, industry: "other", entity_type: "unknown", reserve_floor_months: 3 };
  const allTx = (txRes.data ?? []) as Txn[];
  const transactions = allTx.filter((t) => t.posted_date >= cur.start);
  const priorTransactions = allTx.filter((t) => t.posted_date < cur.start);
  if (transactions.length === 0) return { ok: false, reason: "no_transactions" };

  const metrics: MetricsPayload = computeMetrics({
    accounts: acctRes.data ?? [], transactions, priorTransactions,
    recurringStreams: streamRes.data ?? [], ledger: ledgerRes.data ?? [],
    industryInputs: (inputsRes.data?.inputs as Record<string, unknown> | undefined) ?? undefined,
    profile, periodStart: cur.start, periodEnd: cur.end, today: opts.today,
  });

  const annualNet = metrics.profitProxy * (365 / 14);
  const taxEligible = ["sole_proprietor", "llc_sole_prop"].includes(profile.entity_type) && annualNet >= 60_000;
  const taxLow = taxEligible ? Math.round(annualNet * 0.06) : 0;
  const taxHigh = taxEligible ? Math.round(annualNet * 0.09) : 0;
  const bench = BENCHMARKS[profile.industry] ?? BENCHMARKS.other;
  const allowedExtra = [...bench.nums, taxLow, taxHigh, Math.round(annualNet)];

  const priorRpt = priorReportRes.data;
  const injected = {
    METRICS: metrics,
    MEMORY: { prior_period_end: priorRpt?.period_end ?? null, prior_recommendations: priorRpt?.recommendations ?? [] },
    PROFILE: profile, BENCHMARK: bench.text,
    TAX_FLAG: taxEligible ? { eligible: true, annualNet: Math.round(annualNet), savingsLow: taxLow, savingsHigh: taxHigh, note: "S-corp election estimate — route to CPA before year-end." } : { eligible: false },
  };

  async function callModel(extra?: string) {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${lovableKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: SYSTEM_PROMPT + (extra ?? "") }, { role: "user", content: JSON.stringify(injected) }],
        tools: [TOOL], tool_choice: { type: "function", function: { name: "return_report" } },
      }),
    });
    if (!res.ok) throw new Error(`gateway ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    return typeof args === "string" ? JSON.parse(args) : args;
  }

  let report = await callModel();
  const concat = (r: { subject_line?: string; sections?: { body: string }[] }) =>
    (r?.subject_line ?? "") + " " + (r?.sections ?? []).map((s) => s.body).join(" ");
  let verify = verifyReport(concat(report), metrics, allowedExtra);
  if (!verify.passed) {
    const orphanList = verify.orphans.map((o) => o.raw).join(", ");
    report = await callModel(`\n\nCORRECTION: your draft contained figures not present in METRICS: ${orphanList}. Remove or replace every such number with a figure from METRICS. Do not introduce any new number.`);
    verify = verifyReport(concat(report), metrics, allowedExtra);
  }

  const recs = (report?.recommendations ?? []).map((r: Record<string, unknown>) => ({ ...r, acted: null, outcome: null }));
  const { data: saved, error: insErr } = await admin.from("advisory_reports").insert({
    user_id: userId, period_start: cur.start, period_end: cur.end,
    status: verify.passed ? "generated" : "failed",
    metrics_snapshot: metrics, narrative: report?.sections ?? null, recommendations: recs,
    subject_line: report?.subject_line ?? null, coverage_pct: metrics.coveragePct,
    verification_passed: verify.passed,
    verification_notes: verify.passed ? null : { orphans: verify.orphans, checked: verify.checked },
    model, generation_error: verify.passed ? null : "verification_failed_after_retry",
    generated_at: new Date().toISOString(),
  }).select("id").single();
  if (insErr) throw new Error(insErr.message);

  // Layer 5: email — idempotent, compliant, durable delivery (report-delivery.ts).
  // Only a verified report is ever sent; deliverReportEmail records the attempt
  // in report_email_deliveries, never double-sends, respects unsubscribe, and
  // flips advisory_reports.status to 'sent' on success.
  let sent = false;
  if (opts.send && verify.passed) {
    const email = profEmailRes.data?.email as string | undefined;
    if (email) {
      const res = await deliverReportEmail(admin, {
        reportId: saved.id, userId, email,
        render: {
          subjectLine: report?.subject_line ?? null, sections: report?.sections ?? [],
          metrics, recommendations: report?.recommendations ?? [], coveragePct: metrics.coveragePct,
          periodEnd: cur.end, model, businessName: profile.business_name,
        },
      });
      sent = res.status === "sent";
    }
  }

  return { ok: true, id: saved.id, status: verify.passed ? (sent ? "sent" : "generated") : "failed", verification_passed: verify.passed, coverage_pct: metrics.coveragePct, sent };
}
