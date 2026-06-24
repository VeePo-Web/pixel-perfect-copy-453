// GoldFin Desk — deterministic period metrics.
// Code computes EVERY number here. The LLM never recomputes a figure; it only narrates
// the numbers this module produces. Internal transfers and owner-equity are excluded from
// the P&L by construction.

import type {
  Anomaly,
  HeadlineDeltas,
  NormalizedTransaction,
  OpexLine,
  PeriodMetrics,
  ReviewItem,
  StatementSection,
} from "./types.ts";

export interface ComputeMetricsOptions {
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly dataAsOf: string;
  /** Cash at period start (from Plaid Balance or the prior close). */
  readonly openingCash?: number;
  /** Prior period metrics, to compute deltas + line-spike anomalies. */
  readonly prior?: PeriodMetrics | null;
  /** A category at/below this confidence goes to the review queue. Default 0.7. */
  readonly lowConfidence?: number;
  /** Flag an opex line that grew by more than this fraction vs prior. Default 0.3 (30%). */
  readonly anomalyThresholdPct?: number;
}

const OPEX_LINES: readonly OpexLine[] = [
  "rent_utilities",
  "software",
  "marketing",
  "travel_meals",
  "other",
];

const PNL_EXCLUDED: ReadonlySet<StatementSection> = new Set<StatementSection>([
  "internal_transfer",
  "owner_equity",
]);

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Net signed sum for a section (inflows + outflows). */
function sectionNet(txns: readonly NormalizedTransaction[], section: StatementSection): number {
  let sum = 0;
  for (const t of txns) if (t.section === section) sum += t.amount;
  return sum;
}

/** Outflow magnitude for an expense-type section: positive number; refunds (inflows) reduce it. */
function expenseMagnitude(txns: readonly NormalizedTransaction[], section: StatementSection): number {
  return round2(-sectionNet(txns, section));
}

export function computePeriodMetrics(
  input: readonly NormalizedTransaction[],
  options: ComputeMetricsOptions,
): PeriodMetrics {
  const lowConfidence = options.lowConfidence ?? 0.7;
  const anomalyThresholdPct = options.anomalyThresholdPct ?? 0.3;
  const openingCash = options.openingCash ?? 0;

  // Report on POSTED transactions only — pending rows reconcile away on posting.
  const txns = input.filter((t) => !t.pending);

  // --- P&L ---
  const revenue = round2(sectionNet(txns, "revenue"));
  const otherIncome = 0; // no separate signal yet; folded into revenue when one exists
  const totalRevenue = round2(revenue + otherIncome);
  const cogs = expenseMagnitude(txns, "cogs");
  const grossProfit = round2(totalRevenue - cogs);
  const grossMarginPct = totalRevenue > 0 ? round2(grossProfit / totalRevenue) : 0;

  const payroll = expenseMagnitude(txns, "payroll");

  const opexByLine: Record<OpexLine, number> = {
    rent_utilities: 0,
    software: 0,
    marketing: 0,
    travel_meals: 0,
    other: 0,
  };
  for (const t of txns) {
    if (t.section !== "opex") continue;
    const line: OpexLine = t.opexLine ?? "other";
    opexByLine[line] -= t.amount; // outflow (negative) -> positive expense
  }
  for (const line of OPEX_LINES) opexByLine[line] = round2(opexByLine[line]);

  const opexSum = OPEX_LINES.reduce((acc, line) => acc + opexByLine[line], 0);
  const totalOpex = round2(opexSum + payroll);
  const netOperatingIncome = round2(grossProfit - totalOpex);
  const taxes = expenseMagnitude(txns, "tax");
  const netIncome = round2(netOperatingIncome - taxes);

  // --- Cash flow ---
  const opsSections: readonly StatementSection[] = ["revenue", "cogs", "opex", "payroll", "tax"];
  let netCashFromOps = 0;
  for (const t of txns) if (opsSections.includes(t.section)) netCashFromOps += t.amount;
  netCashFromOps = round2(netCashFromOps);

  const debtService = expenseMagnitude(txns, "debt_service");
  const ownerEquityNet = round2(sectionNet(txns, "owner_equity"));
  const closingCash = round2(openingCash + netCashFromOps - debtService + ownerEquityNet);
  const burn = round2(closingCash - openingCash);
  const runwayMonths =
    burn < 0 && closingCash > 0 ? round2(closingCash / Math.abs(burn)) : null;

  // --- Memo (excluded from P&L) ---
  let ownerDraws = 0;
  let ownerContributions = 0;
  let internalTransferCount = 0;
  for (const t of txns) {
    if (t.section === "owner_equity") {
      if (t.amount < 0) ownerDraws += -t.amount;
      else ownerContributions += t.amount;
    } else if (t.section === "internal_transfer") {
      internalTransferCount += 1;
    }
  }
  ownerDraws = round2(ownerDraws);
  ownerContributions = round2(ownerContributions);

  // --- Deltas vs prior ---
  const prior = options.prior ?? null;
  const deltas: HeadlineDeltas | null = prior
    ? {
        totalRevenue: round2(totalRevenue - prior.totalRevenue),
        netIncome: round2(netIncome - prior.netIncome),
        closingCash: round2(closingCash - prior.closingCash),
        grossMarginPct: round2(grossMarginPct - prior.grossMarginPct),
      }
    : null;

  // --- Anomalies ---
  const anomalies: Anomaly[] = [];
  if (prior) {
    for (const line of OPEX_LINES) {
      const now = opexByLine[line];
      const before = prior.opexByLine[line];
      if (before > 0 && now > before * (1 + anomalyThresholdPct) && now - before >= 50) {
        anomalies.push({
          kind: "line_spike",
          label: line,
          amount: round2(now - before),
          detail: `${line} rose from ${before} to ${now}`,
        });
      }
    }
  }
  const outflows = txns.filter((t) => t.amount < 0).map((t) => -t.amount);
  if (outflows.length > 0) {
    const avg = outflows.reduce((a, b) => a + b, 0) / outflows.length;
    for (const t of txns) {
      if (t.amount < 0 && -t.amount > avg * 3 && -t.amount >= 250) {
        anomalies.push({
          kind: "large_transaction",
          label: t.merchantName ?? "Unknown merchant",
          amount: round2(-t.amount),
          detail: `Single charge of ${round2(-t.amount)} — larger than usual`,
        });
      }
    }
  }

  // --- Review queue ---
  const reviewQueue: ReviewItem[] = [];
  for (const t of txns) {
    if (t.source === "user") continue;
    if (t.section === "uncategorized") {
      reviewQueue.push({ transactionId: t.id, reason: "uncategorized", merchantName: t.merchantName, amount: t.amount });
    } else if (t.section === "internal_transfer") {
      reviewQueue.push({ transactionId: t.id, reason: "confirm_transfer", merchantName: t.merchantName, amount: t.amount });
    } else if (t.section === "owner_equity") {
      reviewQueue.push({ transactionId: t.id, reason: "confirm_owner_equity", merchantName: t.merchantName, amount: t.amount });
    } else if (t.confidence <= lowConfidence) {
      reviewQueue.push({ transactionId: t.id, reason: "low_confidence", merchantName: t.merchantName, amount: t.amount });
    }
  }

  return {
    periodStart: options.periodStart,
    periodEnd: options.periodEnd,
    dataAsOf: options.dataAsOf,
    revenue,
    otherIncome,
    totalRevenue,
    cogs,
    grossProfit,
    grossMarginPct,
    payroll,
    opexByLine,
    totalOpex,
    netOperatingIncome,
    taxes,
    netIncome,
    openingCash: round2(openingCash),
    netCashFromOps,
    debtService,
    ownerEquityNet,
    closingCash,
    burn,
    runwayMonths,
    ownerDraws,
    ownerContributions,
    internalTransferCount,
    deltas,
    anomalies,
    reviewQueue,
  };
}

// Make sure excluded sections are never summed into P&L totals — referenced for clarity/guarding.
export function isExcludedFromPnl(section: StatementSection): boolean {
  return PNL_EXCLUDED.has(section);
}
