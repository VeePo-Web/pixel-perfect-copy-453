// GoldFin Desk — tests for the filled-template CSV export (the missing half, v1).
// Proves: spreadsheet-native numbers (not "$" strings), RFC-4180 escaping, and the
// grounding gate — a cell the metrics engine didn't produce can never be exported.

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

// Production-shaped metrics, with a comma in a merchant name to exercise CSV escaping.
const M: ProductMetrics = {
  period: { start: "2026-06-01", end: "2026-06-14" },
  cashOnHand: 84200,
  inflow: 132400,
  outflow: 87540,
  netCash: 44860,
  monthlyBurn: 190000,
  runwayMonths: 0.44,
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
  assert.equal(lines[0], "Cash Flow Forecast");
  assert.equal(lines[1], "2026-06-01 → 2026-06-14");
  assert.equal(lines[2], "Item,Amount");
  // Raw number, not "$84,200" — the cell must be computable in a spreadsheet.
  assert.ok(csv.includes("Starting cash,84200"));
  // Money out is a real negative number.
  assert.ok(csv.includes("Money out,-87540"));
});

test("money values are never formatted as currency strings", () => {
  const csv = templatesToCsv(fillAllTemplates(M));
  assert.ok(!csv.includes("$"));
  assert.ok(!/\d,\d{3}/.test(csv.replace(/Item,Amount/g, ""))); // no thousands "," in numbers
});

test("fields with commas are RFC-4180 quoted", () => {
  const csv = templateToCsv(fillSubscriptionAudit(M));
  // "Acme, Inc. (annual)" contains a comma → must be quoted as one field.
  assert.ok(csv.includes('"Acme, Inc. (annual)",720'));
});

test("section header rows have an empty value cell", () => {
  const csv = templateToCsv(fillSubscriptionAudit(M));
  assert.ok(csv.includes("Dormant subscriptions (no activity 90+ days),"));
});

test("combined CSV contains every named template", () => {
  const csv = templatesToCsv(fillAllTemplates(M));
  for (const title of [
    "Monthly Review",
    "Cash Flow Forecast",
    "Owner Pay (Profit First)",
    "Subscription & Waste Audit",
    "Tax Reserve",
  ]) {
    assert.ok(csv.includes(title), `missing ${title}`);
  }
});

test("safe export passes when every cell is traceable to the engine", () => {
  const templates = fillAllTemplates(M);
  const csv = safeTemplatesCsv(templates, traceableValues(M));
  assert.ok(csv.includes("Cash Flow Forecast"));
});

test("safe export REFUSES an invented number not produced by the engine", () => {
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
  assert.equal(templateFileName(fillCashFlowForecast(M)), "cash-flow-forecast.csv");
  assert.equal(templateFileName(fillSubscriptionAudit(M)), "subscription-waste-audit.csv");
});
