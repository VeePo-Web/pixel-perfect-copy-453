// GoldFin Desk — tests for the grounded-report fact builder + verification gate.
// node --test (Node 24 native TS). The gate tests prove a faithful narrative passes and a
// fabricated figure is blocked before it can reach a customer.

import { test } from "node:test";
import assert from "node:assert/strict";

import { computePeriodMetrics } from "./metrics.ts";
import { buildReportFacts, verifyNarrative } from "./report.ts";
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

const OPTS = { periodStart: "2026-06-01", periodEnd: "2026-06-30", dataAsOf: "2026-06-30", openingCash: 20000 };

// Net positive month: revenue 12000, opex 1000, no owner draw → builds cash.
function month(): NormalizedTransaction[] {
  return [
    txn({ amount: 12000, section: "revenue" }),
    txn({ amount: -3000, section: "cogs" }),
    txn({ amount: -1000, section: "opex", opexLine: "software" }),
  ];
}

test("one number is closing cash with a verdict when building cash", () => {
  const m = computePeriodMetrics(month(), OPTS);
  const facts = buildReportFacts(m);
  assert.equal(facts.oneNumber.metric, "closing_cash");
  assert.equal(facts.oneNumber.display, "$28,000");
  assert.equal(facts.oneNumber.verdict, "healthy");
});

test("one number flips to runway with a watch/critical verdict when burning", () => {
  const burning = computePeriodMetrics(
    [txn({ amount: 1000, section: "revenue" }), txn({ amount: -5000, section: "payroll" })],
    { ...OPTS, openingCash: 10000 },
  );
  const facts = buildReportFacts(burning);
  assert.equal(facts.oneNumber.metric, "runway_months");
  assert.ok(["watch", "critical"].includes(facts.oneNumber.verdict));
});

test("a faithful narrative passes the verification gate", () => {
  const m = computePeriodMetrics(month(), OPTS);
  const narrative =
    "Your closing cash is $28,000, up from an opening balance of $20,000. " +
    "Revenue was $12,000 and gross margin held at 75%. " +
    "As of 2026-06-30, you have 0 items to review.";
  const result = verifyNarrative(narrative, m);
  assert.equal(result.ok, true, JSON.stringify(result.violations));
});

test("a fabricated dollar figure is blocked", () => {
  const m = computePeriodMetrics(month(), OPTS);
  const narrative = "Your closing cash is $28,000, and you also have a hidden reserve of $50,000.";
  const result = verifyNarrative(narrative, m);
  assert.equal(result.ok, false);
  assert.ok(result.violations.some((v) => v.token.includes("50,000")));
});

test("a fabricated percentage is blocked", () => {
  const m = computePeriodMetrics(month(), OPTS);
  const narrative = "Gross margin was 75%, an improvement of 120% over last month.";
  const result = verifyNarrative(narrative, m);
  assert.equal(result.ok, false);
  assert.ok(result.violations.some((v) => v.kind === "percent" && v.normalized === 120));
});

test("dates, years, and small counts are not treated as financial figures", () => {
  const m = computePeriodMetrics(month(), OPTS);
  const narrative = "As of 2026-06-30 you have 3 items to review and 2 anomalies this period.";
  const result = verifyNarrative(narrative, m);
  assert.equal(result.ok, true, JSON.stringify(result.violations));
});

test("a negative/expense figure that matches a metric passes", () => {
  const m = computePeriodMetrics(month(), OPTS);
  // COGS magnitude is 3000; the prose may state it with a dollar sign
  const narrative = "You spent $3,000 on cost of goods and $1,000 on software.";
  const result = verifyNarrative(narrative, m);
  assert.equal(result.ok, true, JSON.stringify(result.violations));
});
