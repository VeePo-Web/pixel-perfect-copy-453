// =========================================================================
// GROUNDED ADVISORY REPORT PIPELINE  (claude-opus-4-8)
// SEPARATE from generate-briefing (Gemini marketing DEMO, which invents
// numbers). This pipeline NEVER lets the model invent a figure:
//   Layer 1  compute every number deterministically (report-metrics)
//   Layer 2  inject prior-report memory (accountability callback)
//   Layer 3  Opus 4.8 interprets the injected facts only
//   Layer 4  verify every output number traces to the metrics (report-verify)
//   Layer 5  persist report + memory record
// =========================================================================
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { computeMetrics, type MetricsPayload, type Txn } from "../_shared/report-metrics.ts";
import { verifyReport } from "../_shared/report-verify.ts";

const Body = z.object({ periodEnd: z.string().optional() }).default({});

// Vertical benchmarks injected as facts (also fed to the verifier as allowed).
const BENCHMARKS: Record<string, { label: string; nums: number[]; text: string }> = {
  restaurant: { label: "Prime cost", nums: [55, 65, 28, 35], text: "Prime cost target 55–65% of sales; food cost 28–35%." },
  agency: { label: "Utilization", nums: [75, 85], text: "Billable utilization target 75%+; gross margin target 85%+." },
  ecommerce: { label: "LTV:CAC", nums: [3], text: "Healthy LTV:CAC ratio is 3:1 or better." },
  saas: { label: "LTV:CAC", nums: [3], text: "Healthy LTV:CAC ratio is 3:1 or better." },
  contractor: { label: "WIP", nums: [], text: "Underbilling is the #1 reason profitable contractors run out of cash." },
  retail: { label: "GMROI", nums: [1], text: "GMROI above 1 means inventory sells for more than it costs." },
  professional_services: { label: "Net margin", nums: [15, 25], text: "Professional services net margin typically 15–25%." },
  other: { label: "Net margin", nums: [], text: "" },
};

const SYSTEM_PROMPT =
  `You are GoldFin Desk — a senior CFO/CPA-grade advisor writing a bi-weekly financial advisory report for a small business owner. You write like a trusted human CFO, not a SaaS dashboard.

ABSOLUTE GROUNDING RULES (non-negotiable):
- Use ONLY the figures in the METRICS payload. Never state, estimate, round to, or invent a number that is not in METRICS.
- If a figure is missing or coverage is below threshold, say so plainly and scope the claim. Never fill a gap with a guess.
- Every recommendation must cite a specific figure and end in a concrete action with a dollar amount and a timeframe.
- For any tax/entity opportunity, present it as an ESTIMATE to discuss with their CPA, never tax advice or a filing instruction; always say "ask your CPA before [date]".

VOICE: plain English, Grade 6–8, short sentences, calm and premium. No hype, no exclamation marks, no emojis in the body, never the words "AI", "magic", "leverage", "supercharge". Use standard accounting terms AND translate them in plain English.

STRUCTURE (story-first — answer before detail):
1. verdict ("Am I OK?"): open with the single most important truth, even if it contradicts the owner's optimism. If revenue rose but profit or cash fell, SAY THAT FIRST. Reconcile revenue vs profit vs cash.
2. accountability: if MEMORY has a prior recommendation, follow up — "Last cycle I recommended X; here's what happened / it's still open."
3. what_changed: the 2–4 biggest moves since last cycle, each "from -> to, because [driver]".
4. making_money: lead with the owner's INDUSTRY metric; name what's working and the dollar opportunity.
5. leaking: dormant subscriptions, duplicate/gray card charges (+ the 60-day dispute deadline), cost-creep — each with the dollar figure.
6. tax: the entity/tax estimate from METRICS, routed to their CPA (only if present).
7. free_cash: collections / cash trapped.
8. grow: ONLY if reserve is secured, recommend a reinvestment budget; otherwise say "not yet, secure the reserve first." Growth is the least-certain money bucket.
9. decisions: 2–4 ranked actions, each a dollar impact, a deadline, and a bucket tag [find_cash | keep_more | earn_new].

CONTEXT RULE: anchor every number to history, the benchmark, or the plan. FIVE-SECOND RULE: a reader grasps any sentence in five seconds. Return via the return_report tool. Do not output any figure absent from METRICS.`;

function periodRange(end: string, days: number): { start: string; end: string } {
  const e = Date.parse(end);
  return { start: new Date(e - days * 86_400_000).toISOString().slice(0, 10), end };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const user = await getUserFromRequest(req);
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

    const admin = adminClient();
    const today = new Date().toISOString().slice(0, 10);
    const periodEnd = parsed.data.periodEnd ?? today;
    const cur = periodRange(periodEnd, 14);
    const prior = periodRange(cur.start, 14);

    // ---- load grounding data ----
    const [profileRes, acctRes, txRes, streamRes, ledgerRes, priorReportRes] = await Promise.all([
      admin.from("business_profiles").select("business_name, industry, entity_type, reserve_floor_months").eq("user_id", user.id).maybeSingle(),
      admin.from("plaid_accounts").select("current_balance, type").eq("user_id", user.id),
      admin.from("plaid_transactions").select("posted_date, name, merchant_name_norm, amount, category, confidence").eq("user_id", user.id).gte("posted_date", prior.start).lte("posted_date", cur.end),
      admin.from("recurring_streams").select("direction, description, merchant_name, category, frequency, last_amount, first_amount, last_date, is_active").eq("user_id", user.id),
      admin.from("ledger_entries").select("entry_date, kind, amount, revenue_line, is_variable").eq("user_id", user.id).gte("entry_date", cur.start).lte("entry_date", cur.end),
      admin.from("advisory_reports").select("metrics_snapshot, recommendations, period_end").eq("user_id", user.id).eq("status", "generated").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    const profile = profileRes.data ?? { business_name: null, industry: "other", entity_type: "unknown", reserve_floor_months: 3 };
    const allTx = (txRes.data ?? []) as Txn[];
    const transactions = allTx.filter((t) => t.posted_date >= cur.start);
    const priorTransactions = allTx.filter((t) => t.posted_date < cur.start);

    if (transactions.length === 0) {
      return json({ error: "no_transactions", message: "No transactions in period — connect an account and sync first." }, 422);
    }

    // ---- Layer 1: deterministic metrics ----
    const metrics: MetricsPayload = computeMetrics({
      accounts: acctRes.data ?? [],
      transactions, priorTransactions,
      recurringStreams: streamRes.data ?? [],
      ledger: ledgerRes.data ?? [],
      profile, periodStart: cur.start, periodEnd: cur.end, today,
    });

    // ---- tax/entity flag (bounded estimate; flag only, routed to CPA) ----
    const annualNet = metrics.profitProxy * (365 / 14);
    const taxEligible = ["sole_proprietor", "llc_sole_prop"].includes(profile.entity_type) && annualNet >= 60_000;
    const taxLow = taxEligible ? Math.round(annualNet * 0.06) : 0;
    const taxHigh = taxEligible ? Math.round(annualNet * 0.09) : 0;

    // ---- benchmark + allowed-extra numbers for the verifier ----
    const bench = BENCHMARKS[profile.industry] ?? BENCHMARKS.other;
    const allowedExtra = [...bench.nums, taxLow, taxHigh, Math.round(annualNet)];

    // ---- Layer 2: memory ----
    const priorRpt = priorReportRes.data;
    const memory = {
      prior_period_end: priorRpt?.period_end ?? null,
      prior_recommendations: priorRpt?.recommendations ?? [],
      prior_metrics_summary: priorRpt?.metrics_snapshot
        ? { runwayMonths: (priorRpt.metrics_snapshot as Record<string, unknown>).runwayMonths, netCash: (priorRpt.metrics_snapshot as Record<string, unknown>).netCash }
        : null,
    };

    const injected = {
      METRICS: metrics,
      MEMORY: memory,
      PROFILE: profile,
      BENCHMARK: bench.text,
      TAX_FLAG: taxEligible
        ? { eligible: true, annualNet: Math.round(annualNet), savingsLow: taxLow, savingsHigh: taxHigh, note: "S-corp election estimate — route to CPA before year-end." }
        : { eligible: false },
    };

    // ---- Layer 3: Opus 4.8 generation (env-configurable model + endpoint) ----
    const model = Deno.env.get("ADVISORY_MODEL") ?? "claude-opus-4-8";
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "missing_api_key" }, 500);

    const tool = {
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
                  heading: { type: "string" },
                  body: { type: "string" },
                },
                required: ["key", "heading", "body"], additionalProperties: false,
              },
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  bucket: { type: "string", enum: ["find_cash", "keep_more", "earn_new"] },
                  dollar: { type: ["number", "null"] },
                  deadline: { type: ["string", "null"] },
                },
                required: ["text", "bucket"], additionalProperties: false,
              },
            },
          },
          required: ["subject_line", "sections", "recommendations"], additionalProperties: false,
        },
      },
    };

    async function callModel(extraInstruction?: string) {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT + (extraInstruction ?? "") },
            { role: "user", content: JSON.stringify(injected) },
          ],
          tools: [tool],
          tool_choice: { type: "function", function: { name: "return_report" } },
        }),
      });
      if (!res.ok) throw new Error(`gateway ${res.status}: ${await res.text()}`);
      const data = await res.json();
      const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      return typeof args === "string" ? JSON.parse(args) : args;
    }

    // ---- Layer 4: verify; retry once if any number is ungrounded ----
    let report = await callModel();
    let concat = (report?.subject_line ?? "") + " " + (report?.sections ?? []).map((s: { body: string }) => s.body).join(" ");
    let verify = verifyReport(concat, metrics, allowedExtra);
    if (!verify.passed) {
      const orphanList = verify.orphans.map((o) => o.raw).join(", ");
      report = await callModel(`\n\nCORRECTION: your draft contained figures not present in METRICS: ${orphanList}. Remove or replace every such number with a figure from METRICS. Do not introduce any new number.`);
      concat = (report?.subject_line ?? "") + " " + (report?.sections ?? []).map((s: { body: string }) => s.body).join(" ");
      verify = verifyReport(concat, metrics, allowedExtra);
    }

    // ---- Layer 5: persist ----
    const recs = (report?.recommendations ?? []).map((r: Record<string, unknown>) => ({
      ...r, acted: null, outcome: null,
    }));
    const insertRow = {
      user_id: user.id,
      period_start: cur.start, period_end: cur.end,
      status: verify.passed ? "generated" : "failed",
      metrics_snapshot: metrics,
      narrative: report?.sections ?? null,
      recommendations: recs,
      subject_line: report?.subject_line ?? null,
      coverage_pct: metrics.coveragePct,
      verification_passed: verify.passed,
      verification_notes: verify.passed ? null : { orphans: verify.orphans, checked: verify.checked },
      model,
      generation_error: verify.passed ? null : "verification_failed_after_retry",
      generated_at: new Date().toISOString(),
    };
    const { data: saved, error: insErr } = await admin
      .from("advisory_reports").insert(insertRow).select("id").single();
    if (insErr) throw new Error(insErr.message);

    return json({
      id: saved.id,
      status: insertRow.status,
      verification_passed: verify.passed,
      coverage_pct: metrics.coveragePct,
      orphans: verify.passed ? [] : verify.orphans,
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
