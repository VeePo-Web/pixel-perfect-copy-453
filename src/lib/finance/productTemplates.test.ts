import { test, assert } from "vitest";

import {
  fillAllTemplates,
  fillCashFlowForecast,
  fillOwnerPay,
  fillSubscriptionAudit,
  traceableValues,
  type ProductMetrics,
} from "./productTemplates.ts";

const M: ProductMetrics = {
  period: { start: "2026-06-01", end: "2026-06-14" },
  cashOnHand: 84200,
  inflow: 132400,
  outflow: 87540,
  netCash: 44860,
  monthlyBurn: 190000,
  runwayMonths: 0.44,
  nonOperatingExcluded: 15500,
  revenueVsPriorPct: 6.4,
  profitProxy: 44860,
  profitVsPriorPct: 2.8,
  duplicates: [{ merchant: "FedEx", amount: 320, date: "2026-06-09" }],
  unfamiliar: [{ merchant: "New equipment vendor", amount: 2400, date: "2026-06-12" }],
  biggestMover: { category: "Software", from: 2400, to: 3900, delta: 1500 },
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

test("template catalog contains the top four Plaid-fillable lead magnets", () => {
  assert.deepEqual(
    fillAllTemplates(M).map((t) => t.title),
    [
      "Owner Command Center",
      "13-Week Cash Map",
      "Cash-Basis P&L Review",
      "Expense And Vendor Audit",
    ],
  );
});

test("13-week cash map derives the weekly baseline and ending path", () => {
  const t = fillCashFlowForecast(M);
  const val = (label: string) => t.rows.find((r) => r.label === label)?.value;
  assert.equal(val("Starting cash"), 84200);
  assert.ok(t.rows.some((r) => r.label === "Projected cash - week 13"));
  assert.equal(val("Runway"), 0.44);
});

test("owner pay reproduces the Profit First split exactly", () => {
  const t = fillOwnerPay(M);
  const val = (label: string) => t.rows.find((r) => r.label === label)?.value;
  assert.equal(val("Money in / deposits"), M.inflow);
  assert.equal(val("Profit"), M.ownerPay.profit);
  assert.equal(val("Owner pay"), M.ownerPay.ownerPay);
  assert.equal(val("Tax reserve target"), M.ownerPay.tax);
  assert.equal(val("Operating expenses"), M.ownerPay.opex);
});

test("subscription tracker lists waste and cost creep without fabricating active vendor counts", () => {
  const t = fillSubscriptionAudit(M);
  const labels = t.rows.map((r) => r.label);
  assert.ok(labels.some((l) => l.startsWith("Adobe")));
  assert.equal(t.rows.find((r) => r.label === "Annual waste flagged")?.value, 900);
  assert.ok(t.rows.find((r) => r.value === 1200));
  assert.ok(t.rows.find((r) => r.value === 1850));
});

test("empty waste renders a calm no-finding row", () => {
  const clean: ProductMetrics = { ...M, waste: [], wasteAnnualTotal: 0, costCreep: [] };
  const t = fillSubscriptionAudit(clean);
  assert.ok(t.rows.some((r) => r.label === "No dormant subscriptions found"));
});

test("verification gate: every filled cell across all templates is traceable", () => {
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
  assert.equal(t.rows.find((r) => r.label === "Runway")?.value, 0);
});
