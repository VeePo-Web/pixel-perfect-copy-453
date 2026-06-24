// GoldFin Desk — fill the spreadsheet/report templates from deterministic metrics.
// These builders ONLY read fields off `PeriodMetrics`; they never compute a figure of
// their own (a derived total is asserted to equal the metrics field it mirrors in tests).
// That is the deterministic contract: the spreadsheet and the report read one source and
// can never disagree. See docs/plaid-report-templates.md §2.

import { OPEX_LINE_LABELS } from "./categoryTaxonomy.ts";
import type { FilledTemplate, PeriodMetrics, TemplateRow } from "./types.ts";

function periodLabel(m: PeriodMetrics): string {
  return `${m.periodStart} → ${m.periodEnd}`;
}

function section(label: string): TemplateRow {
  return { label, value: null, kind: "section", indent: 0 };
}
function line(label: string, value: number, indent = 1): TemplateRow {
  return { label, value, kind: "line", indent };
}
function total(label: string, value: number, indent = 1): TemplateRow {
  return { label, value, kind: "total", indent };
}
function percent(label: string, value: number, indent = 1): TemplateRow {
  return { label, value, kind: "line", indent, isPercent: true };
}
function memo(label: string, value: number, indent = 1): TemplateRow {
  return { label, value, kind: "memo", indent };
}

/**
 * Profit & Loss (docs/plaid-report-templates.md §2a).
 * Internal transfers and owner-equity appear only in the MEMO block — never in P&L totals.
 */
export function fillProfitAndLoss(m: PeriodMetrics): FilledTemplate {
  const rows: TemplateRow[] = [
    section("REVENUE"),
    line("Sales / Services", m.revenue),
    line("Other income", m.otherIncome),
    total("Total Revenue", m.totalRevenue),

    section("COST OF GOODS SOLD"),
    line("COGS", m.cogs),
    total("Gross Profit", m.grossProfit),
    percent("Gross Margin %", m.grossMarginPct),

    section("OPERATING EXPENSES"),
    line("Payroll", m.payroll),
    line(OPEX_LINE_LABELS.rent_utilities, m.opexByLine.rent_utilities),
    line(OPEX_LINE_LABELS.software, m.opexByLine.software),
    line(OPEX_LINE_LABELS.marketing, m.opexByLine.marketing),
    line(OPEX_LINE_LABELS.travel_meals, m.opexByLine.travel_meals),
    line(OPEX_LINE_LABELS.other, m.opexByLine.other),
    total("Total OpEx", m.totalOpex),

    section("NET"),
    total("Net Operating Income", m.netOperatingIncome),
    line("Taxes", m.taxes),
    total("Net Income", m.netIncome),

    section("MEMO — excluded from P&L"),
    memo("Owner Draws", m.ownerDraws),
    memo("Owner Contributions", m.ownerContributions),
    memo("Internal Transfers (count)", m.internalTransferCount),
  ];
  return { title: "Profit & Loss", periodLabel: periodLabel(m), rows };
}

/**
 * Cash Flow (docs/plaid-report-templates.md §2b).
 * Line values carry their signed cash impact, so Opening + the three lines === Closing.
 */
export function fillCashFlow(m: PeriodMetrics): FilledTemplate {
  const rows: TemplateRow[] = [
    line("Opening Cash", m.openingCash, 0),
    line("Net Cash from Operations", m.netCashFromOps, 0),
    line("Debt Service", -m.debtService, 0),
    line("Owner Equity (draws − / contributions +)", m.ownerEquityNet, 0),
    total("Closing Cash", m.closingCash, 0),
    memo("Burn / Build", m.burn, 0),
    memo("Runway (months)", m.runwayMonths ?? 0, 0),
  ];
  return { title: "Cash Flow", periodLabel: periodLabel(m), rows };
}

/**
 * Every numeric cell across the filled templates, paired with the metrics field it must
 * equal. The report/spreadsheet layer uses this as a cheap verification gate: any rendered
 * number not present here is untraceable and must not ship.
 */
export function traceableValues(m: PeriodMetrics): ReadonlySet<number> {
  return new Set<number>([
    m.revenue,
    m.otherIncome,
    m.totalRevenue,
    m.cogs,
    m.grossProfit,
    m.grossMarginPct,
    m.payroll,
    m.opexByLine.rent_utilities,
    m.opexByLine.software,
    m.opexByLine.marketing,
    m.opexByLine.travel_meals,
    m.opexByLine.other,
    m.totalOpex,
    m.netOperatingIncome,
    m.taxes,
    m.netIncome,
    m.openingCash,
    m.netCashFromOps,
    -m.debtService,
    m.ownerEquityNet,
    m.closingCash,
    m.burn,
    m.runwayMonths ?? 0,
    m.ownerDraws,
    m.ownerContributions,
    m.internalTransferCount,
  ]);
}
