// STRESS TEST — computeMetrics is the deterministic heart of every report. It
// runs on whatever a real connected bank hands over, which is never clean. This
// suite proves it NEVER produces a non-finite figure, NEVER divides by zero, and
// NEVER throws — on the ugly inputs a paying customer will actually feed it.
import { describe, it, expect } from "vitest";
import { computeMetrics, type MetricsInput, type Txn } from "./report-metrics.ts";

const tx = (over: Partial<Txn>): Txn => ({
  posted_date: "2026-06-10", name: "x", merchant_name_norm: "M",
  amount: 100, category: "Ops", confidence: 0.9, ...over,
});

const base = (over: Partial<MetricsInput>): MetricsInput => ({
  accounts: [{ current_balance: 10000, type: "depository" }],
  transactions: [tx({})],
  priorTransactions: [],
  recurringStreams: [],
  profile: { business_name: "T", industry: "other", entity_type: "unknown", reserve_floor_months: 3 },
  periodStart: "2026-06-09", periodEnd: "2026-06-23", today: "2026-06-23",
  ...over,
});

// Every numeric field the engine emits — asserted finite on every scenario.
function assertAllFinite(m: ReturnType<typeof computeMetrics>) {
  const scalars = [
    m.cashOnHand, m.inflow, m.outflow, m.netCash, m.monthlyBurn,
    m.nonOperatingExcluded, m.profitProxy, m.wasteAnnualTotal,
    m.coveragePct, m.transactionsCount,
    m.ownerPay.profit, m.ownerPay.ownerPay, m.ownerPay.tax, m.ownerPay.opex,
  ];
  for (const n of scalars) expect(Number.isFinite(n), `scalar ${n}`).toBe(true);
  // Nullable ratios/runway: null is allowed, but never NaN/Infinity.
  for (const n of [m.runwayMonths, m.revenueVsPriorPct, m.profitVsPriorPct]) {
    if (n !== null) expect(Number.isFinite(n as number)).toBe(true);
  }
  // The whole verification registry the report/XLSX cite from.
  for (const [k, v] of Object.entries(m.figures)) {
    expect(Number.isFinite(v), `figure ${k}=${v}`).toBe(true);
  }
}

describe("computeMetrics — the Tuesday (adversarial real-world data)", () => {
  it("period with only internal transfers (all non-operating) → zeros, not NaN", () => {
    const m = computeMetrics(base({
      transactions: [
        tx({ amount: 5000, category_raw: { detailed: "TRANSFER_OUT_ACCOUNT_TRANSFER" } }),
        tx({ amount: -5000, category_raw: { detailed: "TRANSFER_IN_ACCOUNT_TRANSFER" } }),
      ],
    }));
    assertAllFinite(m);
    expect(m.inflow).toBe(0);
    expect(m.outflow).toBe(0);
    expect(m.runwayMonths).toBeNull(); // no burn → runway undefined, not Infinity
  });

  it("single transaction, one-day period → no divide-by-zero", () => {
    const m = computeMetrics(base({
      transactions: [tx({ amount: 250 })],
      periodStart: "2026-06-23", periodEnd: "2026-06-23",
    }));
    assertAllFinite(m);
  });

  it("overdraft: negative balances sum to negative cash, stays finite", () => {
    const m = computeMetrics(base({
      accounts: [
        { current_balance: -4200.5, type: "depository" },
        { current_balance: -100, type: "depository" },
      ],
    }));
    assertAllFinite(m);
    expect(m.cashOnHand).toBeLessThan(0);
  });

  it("all inflow, zero outflow → runway null, coverage finite", () => {
    const m = computeMetrics(base({
      transactions: [tx({ amount: -9000, category: "Income" }), tx({ amount: -1000, category: "Income" })],
    }));
    assertAllFinite(m);
    expect(m.outflow).toBe(0);
    expect(m.runwayMonths).toBeNull();
  });

  it("null categories and null merchant names do not crash or leak NaN", () => {
    const m = computeMetrics(base({
      transactions: [
        tx({ amount: 300, category: null, merchant_name_norm: null }),
        tx({ amount: -800, category: null, merchant_name_norm: null }),
      ],
    }));
    assertAllFinite(m);
  });

  it("duplicate storm: 200 identical charges do not explode or throw", () => {
    const many: Txn[] = Array.from({ length: 200 }, () =>
      tx({ amount: 49.99, merchant_name_norm: "SAAS TOOL", category: "Software" }));
    const m = computeMetrics(base({ transactions: many }));
    assertAllFinite(m);
    // Consumed-pairs logic: at most 100 pairs from 200 identical charges.
    expect(m.duplicates.length).toBeLessThanOrEqual(100);
  });

  it("huge single transaction stays finite (no overflow to Infinity)", () => {
    const m = computeMetrics(base({
      accounts: [{ current_balance: 1_000_000_000, type: "depository" }],
      transactions: [tx({ amount: 987_654_321.55, category: "Capex" })],
    }));
    assertAllFinite(m);
  });

  it("prior period all-zero → percent deltas are null, never NaN/Infinity", () => {
    const m = computeMetrics(base({
      transactions: [tx({ amount: -5000, category: "Income" }), tx({ amount: 2000 })],
      priorTransactions: [], // zero prior → division guarded to null
    }));
    assertAllFinite(m);
    expect(m.revenueVsPriorPct).toBeNull();
    expect(m.profitVsPriorPct).toBeNull();
  });

  it("confidence all below threshold → coverage 0, still finite", () => {
    const m = computeMetrics(base({
      transactions: [tx({ amount: 100, confidence: 0.1, category: "Ops" }), tx({ amount: 200, confidence: 0.2, category: null })],
    }));
    assertAllFinite(m);
    expect(m.coveragePct).toBe(0);
  });

  it("reversed period (end before start) does not produce negative span math", () => {
    const m = computeMetrics(base({
      periodStart: "2026-06-23", periodEnd: "2026-06-09",
      transactions: [tx({ amount: 100 })],
    }));
    assertAllFinite(m);
  });
});
