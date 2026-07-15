import { describe, it, expect } from "vitest";
import { computeMetrics, type MetricsInput } from "./report-metrics.ts";
import { verifyReport } from "./report-verify.ts";

// A payload with known figures: cashOnHand 30000, inflow 10000, outflow 5000,
// netCash 5000, ownerPay {500,5000,1500,3000}, runway ~2.76, coverage ~66.67.
const input: MetricsInput = {
  accounts: [{ current_balance: 30000, type: "depository" }],
  transactions: [
    { posted_date: "2026-06-10", name: "in", merchant_name_norm: "Acme", amount: -10000, category: "Income", confidence: 0.9 },
    { posted_date: "2026-06-12", name: "pay", merchant_name_norm: "Gusto", amount: 3000, category: "Payroll", confidence: 0.9 },
    { posted_date: "2026-06-15", name: "rent", merchant_name_norm: "LL", amount: 2000, category: "Rent", confidence: 0.9 },
  ],
  priorTransactions: [],
  recurringStreams: [],
  profile: { business_name: "T", industry: "agency", entity_type: "llc_sole_prop", reserve_floor_months: 3 },
  periodStart: "2026-06-09",
  periodEnd: "2026-06-23",
  today: "2026-06-23",
};
const payload = computeMetrics(input);

describe("verifyReport — passes grounded text", () => {
  it("passes when every figure traces to the metrics", () => {
    const text = "You have $30,000 in cash. Owner pay is $5,000 this period, with 5% set aside for profit.";
    const v = verifyReport(text, payload);
    expect(v.passed).toBe(true);
    expect(v.orphans).toHaveLength(0);
  });

  it("allows structural counts and the 60-day dispute window", () => {
    const text = "Cancel 3 subscriptions and dispute the duplicate within 60 days. Chase 2 invoices this week.";
    const v = verifyReport(text, payload);
    expect(v.passed).toBe(true);
  });

  it("accepts comma- and symbol-formatted figures", () => {
    const v = verifyReport("Net cash was $5,000 and cash on hand is $30,000.", payload);
    expect(v.passed).toBe(true);
  });
});

describe("verifyReport — BLOCKS invented numbers (the fireable offense)", () => {
  it("catches a fabricated dollar amount", () => {
    const v = verifyReport("We found $87,500 in hidden savings you can capture today.", payload);
    expect(v.passed).toBe(false);
    expect(v.orphans.some((o) => o.value === 87500 && o.kind === "money")).toBe(true);
  });

  it("catches a fabricated percentage", () => {
    const v = verifyReport("Your gross margin climbed to 73% this period.", payload);
    expect(v.passed).toBe(false);
    expect(v.orphans.some((o) => o.value === 73 && o.kind === "percent")).toBe(true);
  });

  it("catches a fabricated runway figure", () => {
    const v = verifyReport("At this rate you have 9.4 months of cash left.", payload);
    expect(v.passed).toBe(false);
    expect(v.orphans.some((o) => o.value === 9.4 && o.kind === "months")).toBe(true);
  });

  it("blocks even one invented number amid valid ones", () => {
    const text = "Cash is $30,000 and owner pay $5,000 — but you'll save $19,999 by switching.";
    const v = verifyReport(text, payload);
    expect(v.passed).toBe(false);
    expect(v.orphans.map((o) => o.value)).toContain(19999);
  });
});

describe("verifyReport — benchmark allow-list", () => {
  it("rejects a benchmark number that was not injected", () => {
    const v = verifyReport("Your prime cost is above the 65% danger line.", payload);
    expect(v.passed).toBe(false);
  });

  it("accepts the same benchmark when passed as allowedExtra", () => {
    const v = verifyReport("Your prime cost is above the 65% danger line.", payload, [65]);
    expect(v.passed).toBe(true);
  });
});

describe("verifyReport — separated allow-lists (Tasks 3+5)", () => {
  it("blocks structural counts written as DOLLARS ($60 is not the 60-day window)", () => {
    const v = verifyReport("You could recover $60 by acting today.", payload);
    expect(v.passed).toBe(false);
    expect(v.orphans.some((o) => o.value === 60 && o.kind === "money")).toBe(true);
  });

  it("blocks small structural integers written as dollars ($12)", () => {
    const v = verifyReport("That's only $12 out of pocket.", payload);
    expect(v.passed).toBe(false);
  });

  it("still allows Profit First percents but blocks them as dollars", () => {
    const ok = verifyReport("Set aside 15% for tax and 50% for owner pay.", payload);
    expect(ok.passed).toBe(true);
    const bad = verifyReport("Set aside $15 for tax and $50 for owner pay.", payload);
    expect(bad.passed).toBe(false);
  });

  it("blocks near-miss dollar figures the old ±1% band would have passed", () => {
    // cashOnHand is 30000; $30,300 is within 1% but is NOT the figure.
    const v = verifyReport("You have $30,300 in cash.", payload);
    expect(v.passed).toBe(false);
  });

  it("accepts nearest-dollar rounding of a real figure", () => {
    const v = verifyReport("Runway math uses $30,000 of cash and $5,000 net.", payload);
    expect(v.passed).toBe(true);
  });

  it("catches BARE ungrounded numbers with no $ / % marker", () => {
    const v = verifyReport("You will save 87,500 by switching vendors.", payload);
    expect(v.passed).toBe(false);
    expect(v.orphans.some((o) => o.value === 87500 && o.kind === "bare")).toBe(true);
  });

  it("allows bare numbers that trace to real figures, and years", () => {
    const v = verifyReport("In 2026 your inflow reached 10,000 against 5,000 out.", payload);
    expect(v.passed).toBe(true);
  });

  it("allows narrative integer month durations but blocks fabricated decimals", () => {
    const ok = verifyReport("Over the next 12 months, hold 3 months of reserve.", payload);
    expect(ok.passed).toBe(true);
    const bad = verifyReport("You have 4.5 months of runway.", payload);
    expect(bad.passed).toBe(false);
  });
});
