// GoldFin Desk — verification suite for the deterministic finance engine.
// Runs on Node 24's native TypeScript stripping, zero dependencies:  npm run test
// (node --test). These tests ARE the anti-hallucination contract in code form: they prove
// internal transfers and owner-equity never touch P&L totals, that the cash-flow identity
// holds, and that every template cell traces back to a metrics field.

import { test, assert } from "vitest";

import { computePeriodMetrics } from "./metrics.ts";
import { fillCashFlow, fillProfitAndLoss, traceableValues } from "./templates.ts";
import type { NormalizedTransaction } from "./types.ts";

let nextId = 0;
function txn(
  partial: Partial<NormalizedTransaction> & Pick<NormalizedTransaction, "amount" | "section">,
): NormalizedTransaction {
  return {
    id: `t${nextId++}`,
    date: "2026-06-15",
    pending: false,
    merchantName: partial.merchantName ?? "Test Merchant",
    source: partial.source ?? "plaid",
    confidence: partial.confidence ?? 0.95,
    opexLine: partial.opexLine,
    ...partial,
  };
}

// A representative month: revenue in, expenses out across every section, a self-transfer
// pair, an owner draw, and one uncategorized row for the review queue.
function sampleMonth(): NormalizedTransaction[] {
  return [
    txn({ amount: 10000, section: "revenue", merchantName: "Stripe Payout" }),
    txn({ amount: 2000, section: "revenue", merchantName: "Client Invoice" }),
    txn({ amount: -3000, section: "cogs", merchantName: "Supplier Co" }),
    txn({ amount: -4000, section: "payroll", merchantName: "Gusto" }),
    txn({ amount: -1200, section: "opex", opexLine: "rent_utilities", merchantName: "Landlord" }),
    txn({ amount: -300, section: "opex", opexLine: "software", merchantName: "Figma" }),
    txn({ amount: -500, section: "opex", opexLine: "marketing", merchantName: "Meta Ads" }),
    txn({ amount: -250, section: "opex", opexLine: "travel_meals", merchantName: "Delta" }),
    txn({ amount: -150, section: "opex", opexLine: "other", merchantName: "Misc" }),
    txn({ amount: -800, section: "tax", merchantName: "IRS EFTPS" }),
    txn({ amount: -600, section: "debt_service", merchantName: "SBA Loan" }),
    // self-transfer pair — must be excluded from P&L
    txn({ amount: -5000, section: "internal_transfer", merchantName: "Transfer to Savings" }),
    txn({ amount: 5000, section: "internal_transfer", merchantName: "Transfer from Checking" }),
    // owner draw — excluded from P&L, lands in memo + review queue
    txn({ amount: -2500, section: "owner_equity", merchantName: "Owner Draw" }),
    // uncategorized — review queue
    txn({ amount: -75, section: "uncategorized", merchantName: "Unknown" }),
  ];
}

const OPTS = {
  periodStart: "2026-06-01",
  periodEnd: "2026-06-30",
  dataAsOf: "2026-06-30",
  openingCash: 20000,
};

test("P&L totals follow the documented formulas", () => {
  const m = computePeriodMetrics(sampleMonth(), OPTS);
  assert.equal(m.totalRevenue, 12000);
  assert.equal(m.cogs, 3000);
  assert.equal(m.grossProfit, 9000);
  assert.equal(m.grossMarginPct, 0.75);
  assert.equal(m.payroll, 4000);
  assert.equal(m.totalOpex, 4000 + 1200 + 300 + 500 + 250 + 150);
  assert.equal(m.netOperatingIncome, m.grossProfit - m.totalOpex);
  assert.equal(m.taxes, 800);
  assert.equal(m.netIncome, m.netOperatingIncome - m.taxes);
});

test("internal transfers and owner-equity are excluded from revenue and expenses", () => {
  const m = computePeriodMetrics(sampleMonth(), OPTS);
  // the +5000 transfer-in must NOT inflate revenue
  assert.equal(m.totalRevenue, 12000);
  // the -5000 transfer-out and -2500 owner draw must NOT appear in any expense total
  assert.equal(m.totalOpex, 6400);
  // they surface only in the memo block
  assert.equal(m.ownerDraws, 2500);
  assert.equal(m.ownerContributions, 0);
  assert.equal(m.internalTransferCount, 2);
});

test("cash-flow identity holds: opening + ops − debt ± equity = closing", () => {
  const m = computePeriodMetrics(sampleMonth(), OPTS);
  const expectedClosing = m.openingCash + m.netCashFromOps - m.debtService + m.ownerEquityNet;
  assert.equal(m.closingCash, expectedClosing);
  assert.equal(m.burn, m.closingCash - m.openingCash);
});

test("pending transactions are excluded; posting reconciles", () => {
  const base = sampleMonth();
  const withPending = [
    ...base,
    txn({ amount: 9999, section: "revenue", pending: true, merchantName: "Pending Deposit" }),
  ];
  const a = computePeriodMetrics(base, OPTS);
  const b = computePeriodMetrics(withPending, OPTS);
  assert.equal(a.totalRevenue, b.totalRevenue, "pending revenue must not be counted");
});

test("review queue captures uncategorized, transfers, owner-equity, and low confidence", () => {
  const txns = [
    ...sampleMonth(),
    txn({ amount: -40, section: "opex", opexLine: "other", confidence: 0.5, merchantName: "Fuzzy" }),
  ];
  const m = computePeriodMetrics(txns, OPTS);
  const reasons = m.reviewQueue.map((r) => r.reason).sort();
  assert.ok(reasons.includes("uncategorized"));
  assert.ok(reasons.includes("confirm_transfer"));
  assert.ok(reasons.includes("confirm_owner_equity"));
  assert.ok(reasons.includes("low_confidence"));
});

test("user-confirmed rows are never re-queued for review", () => {
  const txns = [txn({ amount: -40, section: "uncategorized", source: "user", confidence: 0.2 })];
  const m = computePeriodMetrics(txns, OPTS);
  assert.equal(m.reviewQueue.length, 0);
});

test("deltas and line-spike anomalies are computed against the prior period", () => {
  const prior = computePeriodMetrics(sampleMonth(), OPTS);
  const spiked = sampleMonth().map((t) =>
    t.section === "opex" && t.opexLine === "software" ? txn({ ...t, amount: -900 }) : t,
  );
  const now = computePeriodMetrics(spiked, { ...OPTS, prior });
  assert.ok(now.deltas, "deltas exist when a prior period is supplied");
  assert.equal(now.deltas?.totalRevenue, 0);
  const spike = now.anomalies.find((a) => a.kind === "line_spike" && a.label === "software");
  assert.ok(spike, "a >30% software jump is flagged as an anomaly");
});

test("runway is null when building cash and positive when burning", () => {
  // genuinely cash-positive month: revenue exceeds every outflow, no owner draw
  const buildingTxns = [
    txn({ amount: 10000, section: "revenue" }),
    txn({ amount: -2000, section: "payroll" }),
  ];
  const building = computePeriodMetrics(buildingTxns, { ...OPTS, openingCash: 10000 });
  assert.equal(building.runwayMonths, null, "net positive month does not report runway");

  const burningTxns = [
    txn({ amount: 1000, section: "revenue" }),
    txn({ amount: -6000, section: "payroll" }),
  ];
  const burning = computePeriodMetrics(burningTxns, { ...OPTS, openingCash: 10000 });
  assert.ok(burning.runwayMonths && burning.runwayMonths > 0, "a burning month reports runway");
});

test("filled P&L mirrors the metrics fields exactly (one source of truth)", () => {
  const m = computePeriodMetrics(sampleMonth(), OPTS);
  const pnl = fillProfitAndLoss(m);
  const get = (label: string) => pnl.rows.find((r) => r.label === label)?.value;
  assert.equal(get("Total Revenue"), m.totalRevenue);
  assert.equal(get("Gross Profit"), m.grossProfit);
  assert.equal(get("Total OpEx"), m.totalOpex);
  assert.equal(get("Net Income"), m.netIncome);
  // owner draw lives in the memo block, not in any expense line
  assert.equal(get("Owner Draws"), m.ownerDraws);
});

test("filled cash-flow lines sum to the closing total", () => {
  const m = computePeriodMetrics(sampleMonth(), OPTS);
  const cf = fillCashFlow(m);
  const val = (label: string) => cf.rows.find((r) => r.label === label)?.value ?? 0;
  const opening = val("Opening Cash");
  const ops = val("Net Cash from Operations");
  const debt = val("Debt Service");
  const equity = val("Owner Equity (draws − / contributions +)");
  const closing = cf.rows.find((r) => r.label === "Closing Cash")?.value;
  assert.equal(opening + ops + debt + equity, closing);
});

test("verification gate: every template number traces back to a metrics field", () => {
  const m = computePeriodMetrics(sampleMonth(), OPTS);
  const allowed = traceableValues(m);
  const cells: number[] = [];
  for (const tpl of [fillProfitAndLoss(m), fillCashFlow(m)]) {
    for (const row of tpl.rows) if (row.value !== null) cells.push(row.value);
  }
  for (const value of cells) {
    assert.ok(allowed.has(value), `untraceable number in a template cell: ${value}`);
  }
});
