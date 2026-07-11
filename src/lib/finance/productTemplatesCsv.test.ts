import { test, assert } from "vitest";

import {
  fillAllTemplates,
  fillCashFlowForecast,
  fillSubscriptionAudit,
  traceableValues,
  type ProductMetrics,
} from "./productTemplates.ts";
import {
  templateToCsv,
  templatesToCsv,
  safeTemplatesCsv,
  templateFileName,
  UntraceableCellError,
} from "./productTemplatesCsv.ts";

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
  waste: [{ merchant: "Acme, Inc.", annual: 720, monthly: 60 }],
  wasteAnnualTotal: 720,
  costCreep: [{ merchant: "AWS", from: 1200, to: 1850 }],
  coveragePct: 92.5,
  transactionsCount: 143,
  profile: { reserve_floor_months: 3 },
};

test("a template renders title, period, header, and spreadsheet-native numbers", () => {
  const csv = templateToCsv(fillCashFlowForecast(M));
  const lines = csv.split("\r\n");
  assert.equal(lines[0], "13-Week Cash Map");
  assert.equal(lines[1], "2026-06-01 to 2026-06-14");
  assert.equal(lines[2], "Item,Amount");
  assert.ok(csv.includes("Starting cash,84200"));
});

test("money values are never formatted as currency strings", () => {
  const csv = templatesToCsv(fillAllTemplates(M));
  assert.ok(!csv.includes("$"));
});

test("fields with commas are RFC-4180 quoted", () => {
  const csv = templateToCsv(fillSubscriptionAudit(M));
  assert.ok(csv.includes('"Acme, Inc. - annual",720'));
});

test("section header rows have an empty value cell", () => {
  const csv = templateToCsv(fillSubscriptionAudit(M));
  assert.ok(csv.includes("Recurring spend flags,"));
});

test("combined CSV contains every named template", () => {
  const csv = templatesToCsv(fillAllTemplates(M));
  for (const title of [
    "Owner Command Center",
    "13-Week Cash Map",
    "Cash-Basis P&L Review",
    "Expense And Vendor Audit",
  ]) {
    assert.ok(csv.includes(title), `missing ${title}`);
  }
});

test("safe export passes when every cell is traceable to the engine", () => {
  const templates = fillAllTemplates(M);
  const csv = safeTemplatesCsv(templates, traceableValues(M));
  assert.ok(csv.includes("13-Week Cash Map"));
});

test("safe export refuses an invented number not produced by the engine", () => {
  const tampered = fillAllTemplates(M).map((t, i) =>
    i === 0
      ? { ...t, rows: [...t.rows, { label: "Made-up line", value: 999999, kind: "line" as const, indent: 0 }] }
      : t,
  );
  let caught: unknown;
  try {
    safeTemplatesCsv(tampered, traceableValues(M));
  } catch (err) {
    caught = err;
  }
  assert.ok(caught instanceof UntraceableCellError, "expected UntraceableCellError");
  assert.equal((caught as UntraceableCellError).value, 999999);
});

test("download file names are slugged and safe", () => {
  assert.equal(templateFileName(fillCashFlowForecast(M)), "13-week-cash-map.csv");
  assert.equal(templateFileName(fillSubscriptionAudit(M)), "subscription-and-recurring-spend-tracker.csv");
});

const ZERO: ProductMetrics = {
  period: { start: "2026-06-01", end: "2026-06-14" },
  cashOnHand: 0,
  inflow: 0,
  outflow: 0,
  netCash: 0,
  monthlyBurn: 0,
  runwayMonths: null,
  ownerPay: { profit: 0, ownerPay: 0, tax: 0, opex: 0 },
  waste: [],
  wasteAnnualTotal: 0,
  costCreep: [],
  coveragePct: 0,
  transactionsCount: 0,
  profile: { reserve_floor_months: 3 },
};

test("a zero-outflow period never emits negative zero", () => {
  const moneyOut = fillCashFlowForecast(ZERO).rows.find((r) => r.label === "Baseline weekly money out");
  assert.equal(moneyOut?.value, 0);
  assert.equal(Object.is(moneyOut?.value, -0), false);
});

test("sparse metrics still pass the grounding gate", () => {
  const csv = safeTemplatesCsv(fillAllTemplates(ZERO), traceableValues(ZERO));
  assert.ok(csv.includes("Baseline weekly money out,0"));
  assert.ok(csv.includes("Expense And Vendor Audit"));
  assert.ok(!csv.includes("Subscription And Recurring Spend Tracker"));
});
