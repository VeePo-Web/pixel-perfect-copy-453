// GoldFin Desk — grounded-report fact builder + verification gate.
// This is the anti-hallucination centerpiece. Two pure functions the report edge function
// (Phase 1c) consumes unchanged:
//
//   buildReportFacts(m)      → the labeled, pre-formatted numbers we INJECT into the Opus
//                              prompt. Opus narrates these; it is forbidden to compute its own.
//   verifyNarrative(text, m) → scans Opus's prose for currency/percent figures and BLOCKS any
//                              that does not trace back to a metrics-derived value. An
//                              untraceable number must never reach the customer.
//
// See docs/plaid-report-templates.md §3 and docs/plaid-integration-spec.md.

import type { PeriodMetrics } from "./types.ts";

export type FactKind = "currency" | "percent" | "count" | "months";

export interface ReportFact {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  /** Pre-formatted exactly as it should appear in prose (Opus copies this string). */
  readonly display: string;
  readonly kind: FactKind;
}

export interface OneNumber {
  readonly metric: "closing_cash" | "runway_months";
  readonly value: number;
  readonly display: string;
  readonly verdict: "healthy" | "watch" | "critical";
  readonly deltaDisplay: string | null;
}

export interface ReportFacts {
  readonly periodLabel: string;
  readonly dataAsOf: string;
  readonly oneNumber: OneNumber;
  readonly facts: readonly ReportFact[];
  readonly anomalyCount: number;
  readonly reviewCount: number;
}

function fmtCurrency(n: number): string {
  const abs = Math.abs(n);
  const body = abs.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return `${n < 0 ? "-" : ""}$${body}`;
}

function fmtPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

function fmtSignedCurrency(n: number): string {
  return `${n >= 0 ? "+" : "-"}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;
}

/** The structured facts Opus narrates. Every number the report may mention lives here. */
export function buildReportFacts(m: PeriodMetrics): ReportFacts {
  const burning = m.runwayMonths !== null;
  const verdict: OneNumber["verdict"] = burning
    ? m.runwayMonths! < 3
      ? "critical"
      : m.runwayMonths! < 6
        ? "watch"
        : "healthy"
    : "healthy";

  const oneNumber: OneNumber = burning
    ? {
        metric: "runway_months",
        value: m.runwayMonths!,
        display: `${m.runwayMonths!.toFixed(1)} months`,
        verdict,
        deltaDisplay: m.deltas ? fmtSignedCurrency(m.deltas.closingCash) : null,
      }
    : {
        metric: "closing_cash",
        value: m.closingCash,
        display: fmtCurrency(m.closingCash),
        verdict,
        deltaDisplay: m.deltas ? fmtSignedCurrency(m.deltas.closingCash) : null,
      };

  const facts: ReportFact[] = [
    f("closing_cash", "Closing cash", m.closingCash, "currency"),
    f("opening_cash", "Opening cash", m.openingCash, "currency"),
    f("burn", "Burn / build", m.burn, "currency"),
    f("net_cash_from_ops", "Net cash from operations", m.netCashFromOps, "currency"),
    f("total_revenue", "Total revenue", m.totalRevenue, "currency"),
    f("gross_profit", "Gross profit", m.grossProfit, "currency"),
    fp("gross_margin", "Gross margin", m.grossMarginPct),
    f("total_opex", "Total operating expenses", m.totalOpex, "currency"),
    f("payroll", "Payroll", m.payroll, "currency"),
    f("net_income", "Net income", m.netIncome, "currency"),
    f("taxes", "Taxes", m.taxes, "currency"),
    f("debt_service", "Debt service", m.debtService, "currency"),
    f("owner_draws", "Owner draws", m.ownerDraws, "currency"),
  ];
  if (m.runwayMonths !== null) {
    facts.push({ key: "runway", label: "Runway", value: m.runwayMonths, display: `${m.runwayMonths.toFixed(1)} months`, kind: "months" });
  }

  return {
    periodLabel: `${m.periodStart} → ${m.periodEnd}`,
    dataAsOf: m.dataAsOf,
    oneNumber,
    facts,
    anomalyCount: m.anomalies.length,
    reviewCount: m.reviewQueue.length,
  };

  function f(key: string, label: string, value: number, kind: FactKind): ReportFact {
    return { key, label, value, display: fmtCurrency(value), kind };
  }
  function fp(key: string, label: string, value: number): ReportFact {
    return { key, label, value, display: fmtPercent(value), kind: "percent" };
  }
}

// ---- Verification gate -------------------------------------------------------------------

export interface NarrativeViolation {
  readonly token: string;
  readonly normalized: number;
  readonly kind: "currency" | "percent";
}

export interface VerifyResult {
  readonly ok: boolean;
  readonly violations: readonly NarrativeViolation[];
}

const CURRENCY_TOLERANCE = 0.5; // dollars
const PERCENT_TOLERANCE = 0.5; // percentage points

function nearestMiss(value: number, allowed: ReadonlySet<number>, tol: number): boolean {
  for (const a of allowed) if (Math.abs(value - a) <= tol) return true;
  return false;
}

/** Currency figures the prose is allowed to state (raw, absolute, and dollar-rounded forms). */
function allowedCurrency(m: PeriodMetrics): Set<number> {
  const out = new Set<number>();
  const add = (n: number) => {
    out.add(n);
    out.add(Math.abs(n));
    out.add(Math.round(n));
    out.add(Math.abs(Math.round(n)));
  };
  for (const fact of buildReportFacts(m).facts) if (fact.kind === "currency") add(fact.value);
  add(m.revenue);
  add(m.otherIncome);
  add(m.cogs);
  add(m.netOperatingIncome);
  add(m.ownerContributions);
  for (const line of Object.values(m.opexByLine)) add(line);
  for (const a of m.anomalies) add(a.amount);
  if (m.deltas) {
    add(m.deltas.totalRevenue);
    add(m.deltas.netIncome);
    add(m.deltas.closingCash);
  }
  return out;
}

/** Percentage points the prose may state (gross margin and its delta, ×100). */
function allowedPercent(m: PeriodMetrics): Set<number> {
  const out = new Set<number>();
  out.add(Math.round(m.grossMarginPct * 100));
  if (m.deltas) out.add(Math.round(m.deltas.grossMarginPct * 100));
  return out;
}

const NUMBER_RE = /(-?\$?\s?\d[\d,]*(?:\.\d+)?\s?%?)/g;

/**
 * Scan generated prose and return any currency/percent figure that does not trace back to a
 * metrics-derived value. Bare small integers (≤ 31: dates, counts, "3 months") and 4-digit
 * years are ignored — the gate guards *financial figures*, the numbers a customer would
 * distrust if wrong, not every digit. A non-empty `violations` list MUST block delivery.
 */
export function verifyNarrative(text: string, m: PeriodMetrics): VerifyResult {
  const currency = allowedCurrency(m);
  const percent = allowedPercent(m);
  const violations: NarrativeViolation[] = [];

  for (const match of text.matchAll(NUMBER_RE)) {
    const token = match[0].trim();
    const isCurrency = token.includes("$");
    const isPercent = token.includes("%");
    const cleaned = token.replace(/[$,%\s]/g, "");
    const value = Number(cleaned);
    if (!Number.isFinite(value)) continue;

    if (isPercent) {
      if (!nearestMiss(Math.abs(value), percent, PERCENT_TOLERANCE)) {
        violations.push({ token, normalized: value, kind: "percent" });
      }
      continue;
    }
    if (isCurrency) {
      if (!nearestMiss(Math.abs(value), currency, CURRENCY_TOLERANCE)) {
        violations.push({ token, normalized: value, kind: "currency" });
      }
      continue;
    }
    // bare number — ignore dates/years/counts/small ordinals; flag only large bare figures
    const abs = Math.abs(value);
    if (abs <= 31) continue; // day-of-month, month count, small ordinal
    if (abs >= 2000 && abs <= 2100 && Number.isInteger(value)) continue; // calendar year
    if (!nearestMiss(abs, currency, CURRENCY_TOLERANCE)) {
      violations.push({ token, normalized: value, kind: "currency" });
    }
  }

  return { ok: violations.length === 0, violations };
}
