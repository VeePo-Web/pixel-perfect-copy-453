// GoldFin Desk — tests for the auto-filled spreadsheet templates (the missing half).
// node --test (Node 24 native TS, zero deps). Proves every filled cell traces back to
// a production-metrics field — the verification-gate property that keeps the spreadsheet
// grounded, identical to the report's contract.

import { test, assert } from "vitest";

import {
  fillAllTemplates,
  fillCashFlowForecast,
  fillOwnerPay,
  fillSubscriptionAudit,
  traceableValues,
  type ProductMetrics,
} from "./productTemplates.ts";

// A representative production MetricsPayload (positive magnitudes, as upstream emits).
const M: ProductMetrics = {
  period: { start: "2026-06-01", end: "2026-06-14" },
  cashOnHand: 84200,
  inflow: 132400,
  outflow: 87540,
  netCash: 44860,
  monthlyBurn: 190000,
  runwayMonths: 0.44,
  ownerPay: { profit: 6620, ownerPay: 66200, tax: 19860, opex: 39720 },
  waste: [
    { merchant: "Adobe", annual: 720, monthly: 60 },
    { merchant: "Zoom Old Seat", annual: 180, monthly: 15 },
  ],
  wasteAnnualTotal: 900,
  costCreep: [{ merchant: "AWS", from: 1200, to: 1850 }],
  coveragePct: 92.5,
  transactionsCount: 143,
  profile: { reserve_floor_months: 3 },
};

test("cash flow forecast ties to the metrics and derives ending cash correctly", () => {
  const t = fillCashFlowForecast(M);
  const val = (label: string) => t.rows.find((r) => r.label === label)?.value;
  assert.equal(val("Starting cash"), 84200);
  assert.equal(val("Net cash this period"), 44860);
  // projected ending cash = cash on hand + net cash
  assert.equal(val("Projected ending cash"), 84200 + 44860);
});

test("owner pay reproduces the Profit First split exactly", () => {
  const t = fillOwnerPay(M);
  const val = (label: string) => t.rows.find((r) => r.label === label)?.value;
  assert.equal(val("Real revenue (money in)"), M.inflow);
  assert.equal(val("Profit"), M.ownerPay.profit);
  assert.equal(val("Owner pay"), M.ownerPay.ownerPay);
  assert.equal(val("Tax"), M.ownerPay.tax);
  assert.equal(val("Operating expenses"), M.ownerPay.opex);
});

test("subscription audit lists each waste item and totals them", () => {
  const t = fillSubscriptionAudit(M);
  const labels = t.rows.map((r) => r.label);
  assert.ok(labels.some((l) => l.startsWith("Adobe")));
  assert.equal(t.rows.find((r) => r.label === "Total annual waste")?.value, 900);
  // cost creep surfaces both the old and new amounts
  assert.ok(t.rows.find((r) => r.value === 1200));
  assert.ok(t.rows.find((r) => r.value === 1850));
});

test("empty waste renders a calm 'None found', never a fabricated number", () => {
  const clean: ProductMetrics = { ...M, waste: [], wasteAnnualTotal: 0, costCreep: [] };
  const t = fillSubscriptionAudit(clean);
  assert.ok(t.rows.some((r) => r.label === "None found"));
  assert.ok(!t.rows.some((r) => r.label === "Total annual waste"));
});

test("verification gate: every filled cell across ALL templates traces to a metric", () => {
  const allowed = traceableValues(M);
  for (const tpl of fillAllTemplates(M)) {
    for (const row of tpl.rows) {
      if (row.value === null) continue;
      assert.ok(allowed.has(row.value), `untraceable cell "${row.label}" = ${row.value} in ${tpl.title}`);
    }
  }
});

test("runway null is rendered as 0, never invented", () => {
  const building: ProductMetrics = { ...M, runwayMonths: null };
  const t = fillCashFlowForecast(building);
  assert.equal(t.rows.find((r) => r.label === "Runway (months)")?.value, 0);
});
