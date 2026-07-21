// GoldFin Desk - auto-filled spreadsheet templates (the "missing half").
// Pure builders that turn the production metrics snapshot into the named
// templates the marketing sells. Code fills every cell; the model never computes
// workbook values. The export layer verifies every visible number before it
// reaches CSV or XLSX.

import type { FilledTemplate, TemplateRow } from "./types.ts";

export interface ProductMetrics {
  readonly period: { readonly start: string; readonly end: string };
  readonly cashOnHand: number;
  readonly inflow: number;
  readonly outflow: number;
  readonly netCash: number;
  readonly monthlyBurn: number;
  readonly runwayMonths: number | null;
  readonly nonOperatingExcluded?: number;
  readonly revenueVsPriorPct?: number | null;
  readonly profitProxy?: number;
  readonly profitVsPriorPct?: number | null;
  readonly duplicates?: ReadonlyArray<{ readonly merchant: string; readonly amount: number; readonly date: string }>;
  readonly unfamiliar?: ReadonlyArray<{ readonly merchant: string; readonly amount: number; readonly date: string }>;
  readonly biggestMover?: { readonly category: string; readonly from: number; readonly to: number; readonly delta: number } | null;
  readonly ownerPay: {
    readonly profit: number;
    readonly ownerPay: number;
    readonly tax: number;
    readonly opex: number;
  };
  readonly waste: ReadonlyArray<{
    readonly merchant: string;
    readonly annual: number;
    readonly monthly: number;
    readonly lastDate?: string | null;
  }>;
  readonly wasteAnnualTotal: number;
  readonly costCreep: ReadonlyArray<{ readonly merchant: string; readonly from: number; readonly to: number }>;
  readonly coveragePct: number;
  readonly transactionsCount: number;
  readonly profile: { readonly reserve_floor_months: number };
}

const r2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const negate = (n: number): number => (n === 0 ? 0 : -n);
const periodLabel = (m: ProductMetrics): string => `${m.period.start} to ${m.period.end}`;

function section(label: string): TemplateRow {
  return { label, value: null, kind: "section", indent: 0 };
}
function line(label: string, value: number, indent = 1, unit: TemplateRow["unit"] = "usd"): TemplateRow {
  return { label, value, kind: "line", indent, unit };
}
function total(label: string, value: number, indent = 1, unit: TemplateRow["unit"] = "usd"): TemplateRow {
  return { label, value, kind: "total", indent, unit };
}
function memo(label: string, value: number, indent = 1, unit: TemplateRow["unit"] = "usd"): TemplateRow {
  return { label, value, kind: "memo", indent, unit };
}

function daysBetween(a: string, b: string): number {
  const days = Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
  return Number.isFinite(days) && days > 0 ? days : 1;
}

function weeksSpan(m: ProductMetrics): number {
  return Math.max(1, daysBetween(m.period.start, m.period.end) / 7);
}

function monthsSpan(m: ProductMetrics): number {
  return Math.max(1 / 30.4375, daysBetween(m.period.start, m.period.end) / 30.4375);
}

function projectedEndingCash(m: ProductMetrics): number {
  return r2(m.cashOnHand + m.netCash);
}

function reserveFloor(m: ProductMetrics): number {
  return r2(m.monthlyBurn * m.profile.reserve_floor_months);
}

function cashOverReserve(m: ProductMetrics): number {
  return r2(m.cashOnHand - reserveFloor(m));
}

function reviewFlagCount(m: ProductMetrics): number {
  return (m.duplicates?.length ?? 0) + (m.unfamiliar?.length ?? 0) + m.costCreep.length + m.waste.length;
}

function monthlyDepositBaseline(m: ProductMetrics): number {
  return r2(m.inflow / monthsSpan(m));
}

function weeklyInflowBaseline(m: ProductMetrics): number {
  return r2(m.inflow / weeksSpan(m));
}

function weeklyOutflowBaseline(m: ProductMetrics): number {
  return r2(m.outflow / weeksSpan(m));
}

function weeklyNetBaseline(m: ProductMetrics): number {
  return r2(weeklyInflowBaseline(m) - weeklyOutflowBaseline(m));
}

function totalDuplicateAmount(m: ProductMetrics): number {
  return r2((m.duplicates ?? []).reduce((s, d) => s + d.amount, 0));
}

function totalUnfamiliarAmount(m: ProductMetrics): number {
  return r2((m.unfamiliar ?? []).reduce((s, u) => s + u.amount, 0));
}

function totalWasteMonthly(m: ProductMetrics): number {
  return r2(m.wasteAnnualTotal / 12);
}

/** Owner Command Center - the executive one-pager and strongest lead magnet. */
export function fillOwnerCommandCenter(m: ProductMetrics): FilledTemplate {
  const mover = m.biggestMover;
  return {
    title: "Owner Command Center",
    periodLabel: periodLabel(m),
    rows: [
      section("Cash position"),
      line("Cash on hand", m.cashOnHand),
      line("Money in", m.inflow),
      line("Money out", negate(m.outflow)),
      total("Net cash", m.netCash),
      memo("Monthly burn", m.monthlyBurn),
      memo("Runway", m.runwayMonths ?? 0, 1, "months"),
      section("Watch this"),
      memo(mover ? `Biggest mover: ${mover.category}` : "Biggest mover unavailable", mover?.delta ?? 0),
      memo("Annual recurring waste flagged", m.wasteAnnualTotal),
      memo("Review flags", reviewFlagCount(m), 1, "count"),
      section("Data confidence"),
      memo("Categorization coverage", m.coveragePct, 1, "percent"),
      memo("Transactions reviewed", m.transactionsCount, 1, "count"),
    ],
  };
}

/** 13-week bank-statement cash baseline, not an AR/AP or pipeline forecast. */
export function fillCashFlowForecast(m: ProductMetrics): FilledTemplate {
  const weeklyNet = weeklyNetBaseline(m);
  const rows: TemplateRow[] = [
    section("Baseline from trailing bank activity"),
    line("Starting cash", m.cashOnHand),
    line("Baseline weekly money in", weeklyInflowBaseline(m)),
    line("Baseline weekly money out", negate(weeklyOutflowBaseline(m))),
    total("Baseline weekly net cash", weeklyNet),
    memo("Cash floor target", reserveFloor(m)),
    section("13-week cash path"),
  ];
  for (let week = 1; week <= 13; week += 1) {
    rows.push(line(`Projected cash - week ${week}`, r2(m.cashOnHand + weeklyNet * week)));
  }
  rows.push(memo("Runway", m.runwayMonths ?? 0, 0, "months"));
  return {
    title: "13-Week Cash Map",
    periodLabel: periodLabel(m),
    rows,
  };
}

/** Cash-basis P&L review: bank-statement-derived operating view, not accrual accounting. */
export function fillCashBasisPnl(m: ProductMetrics): FilledTemplate {
  const profitProxy = m.profitProxy ?? m.netCash;
  return {
    title: "Cash-Basis P&L Review",
    periodLabel: periodLabel(m),
    rows: [
      section("Operating activity"),
      line("Deposits / money in", m.inflow),
      line("Operating cash out", negate(m.outflow)),
      total("Cash profit proxy", profitProxy),
      memo("Profit vs prior period", m.profitVsPriorPct ?? 0, 1, "percent"),
      section("Below the line"),
      memo("Internal transfers, card payments, owner equity excluded", m.nonOperatingExcluded ?? 0),
      memo("Tax reserve planning target", m.ownerPay.tax),
      memo("Projected ending cash", projectedEndingCash(m)),
    ],
  };
}

/** Expense and Vendor Audit - review-worthy spend patterns from bank/card data. */
export function fillExpenseAudit(m: ProductMetrics): FilledTemplate {
  const rows: TemplateRow[] = [
    section("Spend overview"),
    line("Total operating outflow", negate(m.outflow)),
    memo("Annual recurring waste flagged", m.wasteAnnualTotal),
    memo("Monthly recurring waste flagged", totalWasteMonthly(m)),
    memo("Review flags", reviewFlagCount(m), 1, "count"),
  ];
  if (m.biggestMover) {
    rows.push(section("Biggest category movement"));
    rows.push(line(`${m.biggestMover.category} - prior`, m.biggestMover.from));
    rows.push(line(`${m.biggestMover.category} - current`, m.biggestMover.to));
    rows.push(total(`${m.biggestMover.category} - change`, m.biggestMover.delta));
  }
  if ((m.duplicates?.length ?? 0) > 0) {
    rows.push(section("Duplicate charge candidates"));
    for (const d of m.duplicates ?? []) rows.push(line(`${d.merchant} on ${d.date}`, d.amount));
    rows.push(total("Duplicate candidates total", totalDuplicateAmount(m)));
  }
  if ((m.unfamiliar?.length ?? 0) > 0) {
    rows.push(section("Unfamiliar large charges"));
    for (const u of m.unfamiliar ?? []) rows.push(line(`${u.merchant} on ${u.date}`, u.amount));
    rows.push(total("Unfamiliar charges total", totalUnfamiliarAmount(m)));
  }
  if (m.costCreep.length > 0) {
    rows.push(section("Cost creep"));
    for (const c of m.costCreep) {
      rows.push(line(`${c.merchant} - was`, c.from));
      rows.push(line(`${c.merchant} - now`, c.to));
    }
  }
  return { title: "Expense And Vendor Audit", periodLabel: periodLabel(m), rows };
}

/** Subscription and recurring spend: Plaid recurring data where present, waste/creep fallback. */
export function fillSubscriptionAudit(m: ProductMetrics): FilledTemplate {
  const rows: TemplateRow[] = [
    section("Recurring spend flags"),
    memo("Dormant subscriptions flagged", m.waste.length, 1, "count"),
    memo("Monthly waste flagged", totalWasteMonthly(m)),
    memo("Annual waste flagged", m.wasteAnnualTotal),
  ];
  if (m.waste.length === 0) {
    rows.push(memo("No dormant subscriptions found", 0));
  } else {
    rows.push(section("Dormant subscriptions (no activity 90+ days)"));
    for (const w of m.waste) {
      rows.push(line(`${w.merchant} - monthly`, w.monthly));
      rows.push(line(`${w.merchant} - annual`, w.annual));
    }
  }
  if (m.costCreep.length > 0) {
    rows.push(section("Cost increases"));
    for (const c of m.costCreep) {
      rows.push(line(`${c.merchant} - first seen`, c.from));
      rows.push(line(`${c.merchant} - latest`, c.to));
    }
  }
  return { title: "Subscription And Recurring Spend Tracker", periodLabel: periodLabel(m), rows };
}

/** Revenue and deposit trend: bank deposits/inflows, not recognized accrual revenue. */
export function fillRevenueTrend(m: ProductMetrics): FilledTemplate {
  return {
    title: "Revenue And Deposit Trend Tracker",
    periodLabel: periodLabel(m),
    rows: [
      section("Bank deposits / inflows"),
      line("Money in this period", m.inflow),
      memo("Average monthly deposits", monthlyDepositBaseline(m)),
      memo("Revenue vs prior period", m.revenueVsPriorPct ?? 0, 1, "percent"),
      memo("Profit proxy vs prior period", m.profitVsPriorPct ?? 0, 1, "percent"),
      section("Cash conversion"),
      line("Money out this period", negate(m.outflow)),
      total("Net cash from bank activity", m.netCash),
      memo("Projected ending cash", projectedEndingCash(m)),
    ],
  };
}

/** Owner Pay and Tax Reserve - Profit First allocation of the period's money in. */
export function fillOwnerPay(m: ProductMetrics): FilledTemplate {
  return {
    title: "Owner Pay And Tax Reserve Planner",
    periodLabel: periodLabel(m),
    rows: [
      line("Money in / deposits", m.inflow, 0),
      section("Allocate"),
      line("Profit", m.ownerPay.profit),
      line("Owner pay", m.ownerPay.ownerPay),
      line("Tax reserve target", m.ownerPay.tax),
      line("Operating expenses", m.ownerPay.opex),
      section("Reserve posture"),
      memo("Reserve floor target", reserveFloor(m)),
      memo("Cash over / (under) reserve floor", cashOverReserve(m)),
      memo("Reserve floor", m.profile.reserve_floor_months, 1, "months"),
    ],
  };
}

/** Bank Statement Health - informational lender-readiness snapshot, not a score. */
export function fillBankStatementHealth(m: ProductMetrics): FilledTemplate {
  return {
    title: "Bank Statement Health Snapshot",
    periodLabel: periodLabel(m),
    rows: [
      section("Statement posture"),
      line("Cash on hand", m.cashOnHand),
      line("Average monthly deposits", monthlyDepositBaseline(m)),
      line("Monthly operating outflow", negate(m.monthlyBurn)),
      memo("Runway", m.runwayMonths ?? 0, 1, "months"),
      memo("Cash over / (under) reserve floor", cashOverReserve(m)),
      section("Review signals"),
      memo("Duplicate candidates", m.duplicates?.length ?? 0, 1, "count"),
      memo("Unfamiliar large charges", m.unfamiliar?.length ?? 0, 1, "count"),
      memo("Cost increases", m.costCreep.length, 1, "count"),
      memo("Categorization coverage", m.coveragePct, 1, "percent"),
    ],
  };
}

/** Monthly Review - retained for compact on-screen summary surfaces. */
export function fillMonthlyReview(m: ProductMetrics): FilledTemplate {
  return {
    title: "Monthly Review",
    periodLabel: periodLabel(m),
    rows: [
      line("Cash on hand", m.cashOnHand, 0),
      line("Money in", m.inflow, 0),
      line("Money out", negate(m.outflow), 0),
      total("Net cash", m.netCash, 0),
      memo("Monthly burn", m.monthlyBurn, 0),
      memo("Runway", m.runwayMonths ?? 0, 0, "months"),
      memo("Categorization coverage", m.coveragePct, 0, "percent"),
      memo("Transactions this period", m.transactionsCount, 0, "count"),
    ],
  };
}

/** Top four Plaid-fillable lead-magnet templates, in display order. */
export function fillAllTemplates(m: ProductMetrics): readonly FilledTemplate[] {
  return [
    fillOwnerCommandCenter(m),
    fillCashFlowForecast(m),
    fillCashBasisPnl(m),
    fillExpenseAudit(m),
  ];
}

/**
 * Every numeric value the current builders can emit. The export/render layer
 * uses this as the verification-gate allow-list: a filled cell whose value
 * is not here is untraceable and must not ship.
 */
export function traceableValues(m: ProductMetrics): ReadonlySet<number> {
  const out = new Set<number>([0]);
  for (const tpl of [...fillAllTemplates(m), fillMonthlyReview(m)]) {
    for (const row of tpl.rows) {
      // Only finite values are legitimately citable; a non-finite value in the
      // allow-set would let a corrupt NaN cell pass the workbook trace gate.
      if (row.value !== null && Number.isFinite(row.value)) out.add(row.value);
    }
  }
  return out;
}
