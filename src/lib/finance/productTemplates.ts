// GoldFin Desk — auto-filled spreadsheet templates (the "missing half").
// Pure builders that turn the PRODUCTION metrics object (Lovable's computeMetrics
// → MetricsPayload on main) into the named templates the marketing sells, as
// FilledTemplate rows. Code fills every cell; nothing is recomputed or invented.
// Every emitted number is registered in traceableValues() so the same verification
// gate that protects the report can protect the spreadsheet.  See report 17.
//
// ProductMetrics mirrors the fields this module reads from the production
// `MetricsPayload` (supabase/functions/_shared/report-metrics.ts). Keep in sync.
// In that payload inflow/outflow/cashOnHand/etc. are already positive magnitudes
// (Plaid raw sign is normalized away upstream), so there is no sign ambiguity here.

import type { FilledTemplate, TemplateRow } from "./types.ts";

export interface ProductMetrics {
  readonly period: { readonly start: string; readonly end: string };
  readonly cashOnHand: number;
  readonly inflow: number;
  readonly outflow: number;
  readonly netCash: number;
  readonly monthlyBurn: number;
  readonly runwayMonths: number | null;
  readonly ownerPay: {
    readonly profit: number;
    readonly ownerPay: number;
    readonly tax: number;
    readonly opex: number;
  };
  readonly waste: ReadonlyArray<{ readonly merchant: string; readonly annual: number; readonly monthly: number }>;
  readonly wasteAnnualTotal: number;
  readonly costCreep: ReadonlyArray<{ readonly merchant: string; readonly from: number; readonly to: number }>;
  readonly coveragePct: number;
  readonly transactionsCount: number;
  readonly profile: { readonly reserve_floor_months: number };
}

const r2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const periodLabel = (m: ProductMetrics): string => `${m.period.start} → ${m.period.end}`;

function section(label: string): TemplateRow {
  return { label, value: null, kind: "section", indent: 0 };
}
function line(label: string, value: number, indent = 1): TemplateRow {
  return { label, value, kind: "line", indent };
}
function total(label: string, value: number, indent = 1): TemplateRow {
  return { label, value, kind: "total", indent };
}
function memo(label: string, value: number, indent = 1, unit: TemplateRow["unit"] = "usd"): TemplateRow {
  return { label, value, kind: "memo", indent, unit };
}

/** Projected ending cash = cash on hand + net cash flow this period (derived, registered). */
function projectedEndingCash(m: ProductMetrics): number {
  return r2(m.cashOnHand + m.netCash);
}

/** Cash Flow Forecast — the primary template ("will cash feel tight next month?"). */
export function fillCashFlowForecast(m: ProductMetrics): FilledTemplate {
  return {
    title: "Cash Flow Forecast",
    periodLabel: periodLabel(m),
    rows: [
      line("Starting cash", m.cashOnHand, 0),
      line("Expected money in", m.inflow, 0),
      line("Money out", -m.outflow, 0),
      total("Net cash this period", m.netCash, 0),
      total("Projected ending cash", projectedEndingCash(m), 0),
      memo("Monthly burn", m.monthlyBurn, 0),
      memo("Runway (months)", m.runwayMonths ?? 0, 0, "months"),
    ],
  };
}

/** Owner Pay — Profit First allocation of the period's real revenue (inflow). */
export function fillOwnerPay(m: ProductMetrics): FilledTemplate {
  return {
    title: "Owner Pay (Profit First)",
    periodLabel: periodLabel(m),
    rows: [
      line("Real revenue (money in)", m.inflow, 0),
      section("Allocate"),
      line("Profit", m.ownerPay.profit),
      line("Owner pay", m.ownerPay.ownerPay),
      line("Tax", m.ownerPay.tax),
      line("Operating expenses", m.ownerPay.opex),
    ],
  };
}

/** Subscription & Waste Audit — dormant recurring outflows + cost-creep. */
export function fillSubscriptionAudit(m: ProductMetrics): FilledTemplate {
  const rows: TemplateRow[] = [section("Dormant subscriptions (no activity 90+ days)")];
  if (m.waste.length === 0) {
    rows.push(memo("None found", 0));
  } else {
    for (const w of m.waste) rows.push(line(`${w.merchant} (annual)`, w.annual));
    rows.push(total("Total annual waste", m.wasteAnnualTotal));
  }
  if (m.costCreep.length > 0) {
    rows.push(section("Cost creep (now charging more than before)"));
    for (const c of m.costCreep) {
      rows.push(line(`${c.merchant} — was`, c.from));
      rows.push(line(`${c.merchant} — now`, c.to));
    }
  }
  return { title: "Subscription & Waste Audit", periodLabel: periodLabel(m), rows };
}

/** Tax Reserve — the Profit-First tax set-aside for the period. */
export function fillTaxReserve(m: ProductMetrics): FilledTemplate {
  return {
    title: "Tax Reserve",
    periodLabel: periodLabel(m),
    rows: [
      line("Set aside for tax this period", m.ownerPay.tax, 0),
      memo("Reserve floor (months)", m.profile.reserve_floor_months, 0, "months"),
    ],
  };
}

/** Monthly Review — the headline one-pager. */
export function fillMonthlyReview(m: ProductMetrics): FilledTemplate {
  return {
    title: "Monthly Review",
    periodLabel: periodLabel(m),
    rows: [
      line("Cash on hand", m.cashOnHand, 0),
      line("Money in", m.inflow, 0),
      line("Money out", -m.outflow, 0),
      total("Net cash", m.netCash, 0),
      memo("Monthly burn", m.monthlyBurn, 0),
      memo("Runway (months)", m.runwayMonths ?? 0, 0, "months"),
      memo("Categorization coverage %", m.coveragePct, 0, "percent"),
      memo("Transactions this period", m.transactionsCount, 0, "count"),
    ],
  };
}

/** All named templates the product offers, in display order. */
export function fillAllTemplates(m: ProductMetrics): readonly FilledTemplate[] {
  return [
    fillMonthlyReview(m),
    fillCashFlowForecast(m),
    fillOwnerPay(m),
    fillSubscriptionAudit(m),
    fillTaxReserve(m),
  ];
}

/**
 * Every numeric value any builder can emit. The export/render layer uses this as
 * the verification-gate allow-list: a filled cell whose value isn't here is
 * untraceable and must not ship.
 */
export function traceableValues(m: ProductMetrics): ReadonlySet<number> {
  const out = new Set<number>([
    m.cashOnHand,
    m.inflow,
    -m.outflow,
    m.netCash,
    projectedEndingCash(m),
    m.monthlyBurn,
    m.runwayMonths ?? 0,
    m.ownerPay.profit,
    m.ownerPay.ownerPay,
    m.ownerPay.tax,
    m.ownerPay.opex,
    m.wasteAnnualTotal,
    m.coveragePct,
    m.transactionsCount,
    m.profile.reserve_floor_months,
    0,
  ]);
  for (const w of m.waste) out.add(w.annual);
  for (const c of m.costCreep) {
    out.add(c.from);
    out.add(c.to);
  }
  return out;
}
