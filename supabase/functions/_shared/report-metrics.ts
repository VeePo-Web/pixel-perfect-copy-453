// =========================================================================
// DETERMINISTIC METRICS ENGINE  (Layer 1)
// Server-authoritative. Pure, dependency-free. Computes EVERY number the
// advisory report is allowed to state. The model never calculates — it
// interprets these figures. Every figure is registered in `figures` so the
// verification layer (report-verify.ts) can prove the generated text invents
// nothing.
//
// Plaid amount convention: POSITIVE = money OUT (spend), NEGATIVE = money IN.
// =========================================================================

import { computeIndustryPack, type IndustryInputs, type IndustryPack } from "./report-industry.ts";
import { computeGrowthBlock, type GrowthBlock } from "./report-growth.ts";
export type { IndustryInputs, IndustryPack } from "./report-industry.ts";
export type { GrowthBlock } from "./report-growth.ts";

export type Txn = {
  posted_date: string;            // YYYY-MM-DD
  name: string | null;
  merchant_name_norm: string | null;
  amount: number;                 // Plaid sign convention
  category: string | null;
  category_raw?: unknown;         // Plaid PFC { primary, detailed } — drives non-operating exclusion
  confidence: number;             // 0..1
};

export type Account = { current_balance: number | null; type: string | null };

export type RecurringStream = {
  direction: string;              // outflow | inflow
  description: string | null;
  merchant_name: string | null;
  category: string | null;
  frequency: string | null;       // WEEKLY | MONTHLY | ANNUALLY ...
  last_amount: number | null;
  first_amount: number | null;
  last_date: string | null;
  is_active: boolean;
};

export type Profile = {
  business_name: string | null;
  industry: string;
  entity_type: string;
  reserve_floor_months: number;
};

export type LedgerEntry = {
  entry_date: string;
  kind: string;            // revenue | cost
  amount: number;          // positive magnitude
  revenue_line: string | null;
  is_variable: boolean;
};

export type ContributionLine = {
  line: string;
  revenue: number;
  variableCost: number;
  contribution: number;
  marginPct: number | null;
};

export type MetricsInput = {
  accounts: Account[];
  transactions: Txn[];            // current period
  priorTransactions: Txn[];       // prior period (for deltas)
  recurringStreams: RecurringStream[];
  ledger?: LedgerEntry[];         // spreadsheet-template intake (optional)
  industryInputs?: IndustryInputs; // period-scoped vertical inputs (optional)
  profile: Profile;
  periodStart: string;
  periodEnd: string;
  today: string;                  // injected (no Date.now in pure logic)
  confidenceThreshold?: number;   // default 0.6
  unfamiliarThreshold?: number;   // default 200 — first-seen charge to flag for review
};

export type WasteItem = { merchant: string; monthly: number; annual: number; lastDate: string | null };
export type DuplicateItem = { merchant: string; amount: number; date: string; disputeBy: string };
export type UnfamiliarItem = { merchant: string; amount: number; date: string; disputeBy: string };
export type CostCreepItem = { merchant: string; from: number; to: number };
export type MoverItem = { category: string; from: number; to: number; delta: number };

export type MetricsPayload = {
  period: { start: string; end: string };
  // headline
  cashOnHand: number;
  inflow: number;
  outflow: number;
  netCash: number;
  monthlyBurn: number;
  runwayMonths: number | null;
  nonOperatingExcluded: number;   // transfers + card payoffs + owner draws removed from cash flow
  // profit truth (whole-business, bank-feed proxy)
  revenueVsPriorPct: number | null;
  profitProxy: number;            // inflow - outflow over period (cash basis proxy)
  profitVsPriorPct: number | null;
  // money recovered
  waste: WasteItem[];
  wasteAnnualTotal: number;
  duplicates: DuplicateItem[];
  unfamiliar: UnfamiliarItem[];
  costCreep: CostCreepItem[];
  biggestMover: MoverItem | null;
  // owner pay (Profit First)
  ownerPay: { profit: number; ownerPay: number; tax: number; opex: number };
  // profit by line (from spreadsheet-template intake, when present)
  contributionByLine: ContributionLine[];
  bestLine: ContributionLine | null;
  worstLine: ContributionLine | null;
  // industry pack — the vertical lead metric (prime cost / CM-per-order / WIP / GMROI / utilization)
  industry: IndustryPack | null;
  // growth gate — reinvestment budget, only when reserve is secured AND LTV:CAC >= 3:1
  growth: GrowthBlock;
  // trust
  coveragePct: number;
  transactionsCount: number;
  // verification registry — EVERY citable number, flat
  figures: Record<string, number>;
  profile: Profile;
};

const r2 = (n: number) => Math.round(n * 100) / 100;
const outflow = (t: Txn) => (t.amount > 0 ? t.amount : 0);
const inflowOf = (t: Txn) => (t.amount < 0 ? -t.amount : 0);

// --- NON-OPERATING FILTER -------------------------------------------------
// A bank-feed sum is not cash flow until you remove money that only moved
// between the owner's own accounts (internal transfers), paid down a credit
// card (the underlying card spend is already counted — a double-count), or paid
// the owner (draws/distributions — equity, not expense). Including these is the
// #1 reason naive bank-feed reports overstate burn and understate runway. We
// exclude ONLY unambiguous non-operating flows, so real revenue/expense is
// never dropped (e.g. a customer deposit via TRANSFER_IN_DEPOSIT still counts).
const NON_OPERATING_DETAILED = new Set([
  "TRANSFER_IN_ACCOUNT_TRANSFER",
  "TRANSFER_OUT_ACCOUNT_TRANSFER",
  "TRANSFER_OUT_INVESTMENT_AND_RETIREMENT_FUNDS",
  "LOAN_PAYMENTS_CREDIT_CARD_PAYMENT",
]);
// Conservative name fallback when Plaid's detailed category is absent — only
// phrases that cannot be customer revenue or an operating expense.
const NON_OPERATING_NAME =
  /\b(owner'?s?\s+draw|owner\s+distribution|member\s+draw|shareholder\s+distribution|capital\s+contribution|internal\s+transfer|transfer\s+to\s+(savings|checking|brokerage)|credit\s+card\s+payment|cardmember\s+(payment|pmt)|amex\s+epayment)\b/i;

function plaidDetailed(t: Txn): string {
  const raw = (t as { category_raw?: unknown }).category_raw;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return String((raw as { detailed?: unknown }).detailed ?? "").toUpperCase();
  }
  return "";
}

/** True when a transaction is an internal transfer, credit-card payoff, or
 *  owner draw — i.e. NOT operating cash flow. Exported for unit tests. */
export function isNonOperating(t: Txn): boolean {
  const detailed = plaidDetailed(t);
  if (detailed && NON_OPERATING_DETAILED.has(detailed)) return true;
  const name = `${t.name ?? ""} ${t.merchant_name_norm ?? ""}`;
  return NON_OPERATING_NAME.test(name);
}

function daysBetween(a: string, b: string): number {
  const ms = Date.parse(b) - Date.parse(a);
  return Math.round(ms / 86_400_000);
}
function addDays(date: string, days: number): string {
  const d = new Date(Date.parse(date) + days * 86_400_000);
  return d.toISOString().slice(0, 10);
}
function monthsSpan(start: string, end: string): number {
  const d = daysBetween(start, end);
  return d > 0 ? d / 30.4375 : 1;
}

// Profit First default allocation (Michalowicz benchmark).
const PROFIT_FIRST = { profit: 0.05, ownerPay: 0.5, tax: 0.15, opex: 0.3 };

export function computeMetrics(input: MetricsInput): MetricsPayload {
  const conf = input.confidenceThreshold ?? 0.6;
  const span = monthsSpan(input.periodStart, input.periodEnd);

  const cashOnHand = r2(
    input.accounts
      .filter((a) => (a.type ?? "depository") === "depository")
      .reduce((s, a) => s + (a.current_balance ?? 0), 0),
  );

  // Operating activity only (exclude internal transfers / card payoffs / owner
  // draws) for every cash figure — current and prior, apples-to-apples.
  const operating = input.transactions.filter((t) => !isNonOperating(t));
  const priorOperating = input.priorTransactions.filter((t) => !isNonOperating(t));
  const nonOperatingExcluded = r2(
    input.transactions.filter(isNonOperating).reduce((s, t) => s + Math.abs(t.amount), 0),
  );

  const inflow = r2(operating.reduce((s, t) => s + inflowOf(t), 0));
  const outflowSum = r2(operating.reduce((s, t) => s + outflow(t), 0));
  const netCash = r2(inflow - outflowSum);
  const monthlyBurn = r2(outflowSum / span);
  const runwayMonths = monthlyBurn > 0 ? r2(cashOnHand / monthlyBurn) : null;

  // prior-period comparisons
  const priorInflow = priorOperating.reduce((s, t) => s + inflowOf(t), 0);
  const priorOutflow = priorOperating.reduce((s, t) => s + outflow(t), 0);
  const revenueVsPriorPct =
    priorInflow > 0 ? r2(((inflow - priorInflow) / priorInflow) * 100) : null;
  const profitProxy = netCash;
  const priorProfit = priorInflow - priorOutflow;
  const profitVsPriorPct =
    priorProfit !== 0 ? r2(((profitProxy - priorProfit) / Math.abs(priorProfit)) * 100) : null;

  // --- WASTE: dormant outflow streams (no activity 90+ days) ---
  const toMonthly = (amt: number, freq: string | null): number => {
    switch ((freq ?? "MONTHLY").toUpperCase()) {
      case "WEEKLY": return amt * 4.333;
      case "BIWEEKLY": return amt * 2.1667;
      case "SEMI_MONTHLY": return amt * 2;
      case "ANNUALLY": return amt / 12;
      default: return amt; // MONTHLY
    }
  };
  const waste: WasteItem[] = input.recurringStreams
    .filter((s) => s.direction === "outflow" && s.last_amount != null && s.last_date)
    .filter((s) => daysBetween(s.last_date as string, input.today) >= 90)
    .map((s) => {
      const monthly = r2(toMonthly(Math.abs(s.last_amount as number), s.frequency));
      return {
        merchant: s.merchant_name ?? s.description ?? "Unknown",
        monthly,
        annual: r2(monthly * 12),
        lastDate: s.last_date,
      };
    })
    .sort((a, b) => b.annual - a.annual);
  const wasteAnnualTotal = r2(waste.reduce((s, w) => s + w.annual, 0));

  // --- COST CREEP: same stream now charging >5% more than first seen ---
  const costCreep: CostCreepItem[] = input.recurringStreams
    .filter(
      (s) =>
        s.direction === "outflow" &&
        s.first_amount != null &&
        s.last_amount != null &&
        Math.abs(s.last_amount) > Math.abs(s.first_amount as number) * 1.05,
    )
    .map((s) => ({
      merchant: s.merchant_name ?? s.description ?? "Unknown",
      from: r2(Math.abs(s.first_amount as number)),
      to: r2(Math.abs(s.last_amount as number)),
    }));

  // --- CARD AUDIT: duplicate charges (same merchant + amount within 2 days) ---
  const duplicates: DuplicateItem[] = [];
  const spends = operating
    .filter((t) => outflow(t) > 0 && t.merchant_name_norm)
    .sort((a, b) => a.posted_date.localeCompare(b.posted_date));
  for (let i = 0; i < spends.length; i++) {
    for (let j = i + 1; j < spends.length; j++) {
      const a = spends[i], b = spends[j];
      if (a.merchant_name_norm !== b.merchant_name_norm) continue;
      if (Math.abs(a.amount - b.amount) > 0.001) continue;
      const gap = daysBetween(a.posted_date, b.posted_date);
      if (gap < 0 || gap > 2) continue;
      duplicates.push({
        merchant: a.merchant_name_norm as string,
        amount: r2(a.amount),
        date: b.posted_date,
        disputeBy: addDays(b.posted_date, 60), // 60-day federal dispute window
      });
      break;
    }
  }

  // --- CARD AUDIT: unfamiliar/large charges (first-seen merchant this period
  //     above threshold). Completes the card-statement audit — a merchant that
  //     never appeared before, charging real money, is the classic gray/
  //     unauthorized charge to verify. Same 60-day federal dispute window. ---
  const unfamiliarThreshold = input.unfamiliarThreshold ?? 200;
  const priorMerchants = new Set(
    priorOperating.map((t) => t.merchant_name_norm).filter(Boolean) as string[],
  );
  const unfamiliar: UnfamiliarItem[] = [];
  const seenUnfamiliar = new Set<string>();
  for (const t of operating) {
    const m = t.merchant_name_norm;
    if (!m || outflow(t) < unfamiliarThreshold) continue;
    if (priorMerchants.has(m) || seenUnfamiliar.has(m)) continue;
    seenUnfamiliar.add(m);
    unfamiliar.push({
      merchant: m,
      amount: r2(t.amount),
      date: t.posted_date,
      disputeBy: addDays(t.posted_date, 60),
    });
  }
  unfamiliar.sort((a, b) => b.amount - a.amount);

  // --- BIGGEST EXPENSE MOVER: category with largest outflow delta vs prior ---
  const catNow = new Map<string, number>();
  const catPrior = new Map<string, number>();
  for (const t of operating) {
    if (outflow(t) > 0) catNow.set(t.category ?? "Uncategorized", (catNow.get(t.category ?? "Uncategorized") ?? 0) + outflow(t));
  }
  for (const t of priorOperating) {
    if (outflow(t) > 0) catPrior.set(t.category ?? "Uncategorized", (catPrior.get(t.category ?? "Uncategorized") ?? 0) + outflow(t));
  }
  let biggestMover: MoverItem | null = null;
  for (const [cat, now] of catNow) {
    const prior = catPrior.get(cat) ?? 0;
    const delta = now - prior;
    if (!biggestMover || Math.abs(delta) > Math.abs(biggestMover.delta)) {
      biggestMover = { category: cat, from: r2(prior), to: r2(now), delta: r2(delta) };
    }
  }

  // --- OWNER PAY (Profit First on period inflow) ---
  const ownerPay = {
    profit: r2(inflow * PROFIT_FIRST.profit),
    ownerPay: r2(inflow * PROFIT_FIRST.ownerPay),
    tax: r2(inflow * PROFIT_FIRST.tax),
    opex: r2(inflow * PROFIT_FIRST.opex),
  };

  // --- CONTRIBUTION MARGIN BY LINE (spreadsheet-template intake) ---
  const lineMap = new Map<string, { rev: number; varCost: number }>();
  for (const e of input.ledger ?? []) {
    const line = e.revenue_line ?? "Unassigned";
    const cur = lineMap.get(line) ?? { rev: 0, varCost: 0 };
    if (e.kind === "revenue") cur.rev += Math.abs(e.amount);
    else if (e.is_variable) cur.varCost += Math.abs(e.amount);
    lineMap.set(line, cur);
  }
  const contributionByLine: ContributionLine[] = [...lineMap.entries()]
    .filter(([, v]) => v.rev > 0)
    .map(([line, v]) => {
      const contribution = r2(v.rev - v.varCost);
      return {
        line,
        revenue: r2(v.rev),
        variableCost: r2(v.varCost),
        contribution,
        marginPct: v.rev > 0 ? r2((contribution / v.rev) * 100) : null,
      };
    })
    .sort((a, b) => (b.marginPct ?? -Infinity) - (a.marginPct ?? -Infinity));
  const bestLine = contributionByLine[0] ?? null;
  const worstLine = contributionByLine.length > 1 ? contributionByLine[contributionByLine.length - 1] : null;

  // --- INDUSTRY PACK: the vertical lead metric (Layer 1, deterministic) ---
  const industry = computeIndustryPack(
    input.profile.industry,
    input.ledger ?? [],
    input.industryInputs,
    contributionByLine,
    input.profile,
  );

  // --- GROWTH GATE: reinvestment budget, only when affordable (Layer 1) ---
  const growth = computeGrowthBlock({
    netProfit: profitProxy,
    runwayMonths,
    reserveFloorMonths: input.profile.reserve_floor_months,
    ltv: input.industryInputs?.ltv ?? null,
    cac: input.industryInputs?.cac ?? null,
  });

  // --- COVERAGE (over ALL transactions — categorization quality of the feed) ---
  const transactionsCount = input.transactions.length;
  const categorized = input.transactions.filter((t) => t.confidence >= conf && t.category).length;
  const coveragePct = transactionsCount > 0 ? r2((categorized / transactionsCount) * 100) : 0;

  // --- VERIFICATION REGISTRY: every citable number, flat ---
  const figures: Record<string, number> = {
    cashOnHand, inflow, outflow: outflowSum, netCash, monthlyBurn,
    nonOperatingExcluded,
    profitProxy, wasteAnnualTotal, coveragePct, transactionsCount,
    ownerPay_profit: ownerPay.profit, ownerPay_ownerPay: ownerPay.ownerPay,
    ownerPay_tax: ownerPay.tax, ownerPay_opex: ownerPay.opex,
  };
  if (runwayMonths != null) figures.runwayMonths = runwayMonths;
  if (revenueVsPriorPct != null) figures.revenueVsPriorPct = revenueVsPriorPct;
  if (profitVsPriorPct != null) figures.profitVsPriorPct = profitVsPriorPct;
  waste.forEach((w, i) => { figures[`waste_${i}_annual`] = w.annual; figures[`waste_${i}_monthly`] = w.monthly; });
  duplicates.forEach((d, i) => { figures[`dup_${i}_amount`] = d.amount; });
  unfamiliar.forEach((u, i) => { figures[`unfam_${i}_amount`] = u.amount; });
  costCreep.forEach((c, i) => { figures[`creep_${i}_from`] = c.from; figures[`creep_${i}_to`] = c.to; });
  if (biggestMover) { figures.mover_from = biggestMover.from; figures.mover_to = biggestMover.to; figures.mover_delta = biggestMover.delta; }
  contributionByLine.forEach((c, i) => {
    figures[`line_${i}_revenue`] = c.revenue;
    figures[`line_${i}_contribution`] = c.contribution;
    if (c.marginPct != null) figures[`line_${i}_margin`] = c.marginPct;
  });
  if (industry) Object.assign(figures, industry.figures);
  Object.assign(figures, growth.figures);

  return {
    period: { start: input.periodStart, end: input.periodEnd },
    cashOnHand, inflow, outflow: outflowSum, netCash, monthlyBurn, runwayMonths,
    nonOperatingExcluded,
    revenueVsPriorPct, profitProxy, profitVsPriorPct,
    waste, wasteAnnualTotal, duplicates, unfamiliar, costCreep, biggestMover,
    ownerPay, contributionByLine, bestLine, worstLine,
    industry, growth,
    coveragePct, transactionsCount,
    figures, profile: input.profile,
  };
}
