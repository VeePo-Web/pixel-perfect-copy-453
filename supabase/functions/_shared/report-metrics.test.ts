import { describe, it, expect } from "vitest";
import { computeMetrics, type MetricsInput } from "./report-metrics.ts";

function baseInput(over: Partial<MetricsInput> = {}): MetricsInput {
  return {
    accounts: [{ current_balance: 30000, type: "depository" }],
    transactions: [
      { posted_date: "2026-06-10", name: "Client deposit", merchant_name_norm: "Acme", amount: -10000, category: "Income", confidence: 0.9 },
      { posted_date: "2026-06-12", name: "Payroll", merchant_name_norm: "Gusto", amount: 3000, category: "Payroll", confidence: 0.9 },
      { posted_date: "2026-06-15", name: "Rent", merchant_name_norm: "Landlord", amount: 2000, category: "Rent", confidence: 0.2 },
    ],
    priorTransactions: [
      { posted_date: "2026-05-28", name: "Payroll", merchant_name_norm: "Gusto", amount: 2000, category: "Payroll", confidence: 0.9 },
    ],
    recurringStreams: [],
    profile: { business_name: "Test Co", industry: "agency", entity_type: "llc_sole_prop", reserve_floor_months: 3 },
    periodStart: "2026-06-09",
    periodEnd: "2026-06-23",
    today: "2026-06-23",
    ...over,
  };
}

describe("computeMetrics — cash & runway", () => {
  it("computes inflow/outflow/netCash with Plaid sign convention", () => {
    const m = computeMetrics(baseInput());
    expect(m.cashOnHand).toBe(30000);
    expect(m.inflow).toBe(10000);      // amount -10000 => money IN
    expect(m.outflow).toBe(5000);      // 3000 + 2000 => money OUT
    expect(m.netCash).toBe(5000);
  });

  it("derives runway months from cash / monthly burn", () => {
    const m = computeMetrics(baseInput());
    // 14-day span => ~0.46 months; burn = 5000/0.46 ≈ 10870/mo; runway = 30000/burn
    expect(m.runwayMonths).toBeCloseTo(2.76, 1);
  });

  it("returns null runway when there is no outflow", () => {
    const m = computeMetrics(baseInput({ transactions: [
      { posted_date: "2026-06-10", name: "in", merchant_name_norm: "Acme", amount: -500, category: "Income", confidence: 0.9 },
    ] }));
    expect(m.runwayMonths).toBeNull();
  });
});

describe("computeMetrics — owner pay (Profit First)", () => {
  it("allocates inflow 5/50/15/30", () => {
    const m = computeMetrics(baseInput());
    expect(m.ownerPay).toEqual({ profit: 500, ownerPay: 5000, tax: 1500, opex: 3000 });
  });
});

describe("computeMetrics — recurring waste detector", () => {
  it("flags dormant outflow streams (90+ days) and annualizes", () => {
    const m = computeMetrics(baseInput({
      recurringStreams: [
        { direction: "outflow", description: "Old tool", merchant_name: "OldTool", category: "Software",
          frequency: "MONTHLY", last_amount: 50, first_amount: 50, last_date: "2026-02-01", is_active: true },
      ],
    }));
    expect(m.waste).toHaveLength(1);
    expect(m.waste[0].monthly).toBe(50);
    expect(m.waste[0].annual).toBe(600);
    expect(m.wasteAnnualTotal).toBe(600);
  });

  it("does NOT flag a recently-active stream", () => {
    const m = computeMetrics(baseInput({
      recurringStreams: [
        { direction: "outflow", description: "Live tool", merchant_name: "LiveTool", category: "Software",
          frequency: "MONTHLY", last_amount: 50, first_amount: 50, last_date: "2026-06-15", is_active: true },
      ],
    }));
    expect(m.waste).toHaveLength(0);
  });
});

describe("computeMetrics — card audit (duplicate charges + 60-day dispute clock)", () => {
  it("detects same merchant + amount within 2 days and sets disputeBy = +60d", () => {
    const m = computeMetrics(baseInput({
      transactions: [
        { posted_date: "2026-06-12", name: "Adobe", merchant_name_norm: "Adobe", amount: 149, category: "Software", confidence: 0.9 },
        { posted_date: "2026-06-13", name: "Adobe", merchant_name_norm: "Adobe", amount: 149, category: "Software", confidence: 0.9 },
      ],
    }));
    expect(m.duplicates).toHaveLength(1);
    expect(m.duplicates[0].amount).toBe(149);
    expect(m.duplicates[0].disputeBy).toBe("2026-08-12"); // 2026-06-13 + 60 days
  });

  it("does NOT flag the same amount from different merchants", () => {
    const m = computeMetrics(baseInput({
      transactions: [
        { posted_date: "2026-06-12", name: "A", merchant_name_norm: "MerchantA", amount: 149, category: "x", confidence: 0.9 },
        { posted_date: "2026-06-13", name: "B", merchant_name_norm: "MerchantB", amount: 149, category: "x", confidence: 0.9 },
      ],
    }));
    expect(m.duplicates).toHaveLength(0);
  });
});

describe("computeMetrics — contribution margin by line (spreadsheet template)", () => {
  it("computes margin per revenue_line and names best/worst", () => {
    const m = computeMetrics(baseInput({
      ledger: [
        { entry_date: "2026-06-10", kind: "revenue", amount: 4200, revenue_line: "Retainers", is_variable: false },
        { entry_date: "2026-06-11", kind: "cost", amount: 300, revenue_line: "Retainers", is_variable: true },
        { entry_date: "2026-06-12", kind: "revenue", amount: 1800, revenue_line: "Projects", is_variable: false },
        { entry_date: "2026-06-12", kind: "cost", amount: 640, revenue_line: "Projects", is_variable: true },
      ],
    }));
    expect(m.contributionByLine).toHaveLength(2);
    expect(m.bestLine?.line).toBe("Retainers");
    expect(m.bestLine?.contribution).toBe(3900);
    expect(m.bestLine?.marginPct).toBeCloseTo(92.86, 1);
    expect(m.worstLine?.line).toBe("Projects");
    expect(m.worstLine?.marginPct).toBeCloseTo(64.44, 1);
  });

  it("ignores fixed costs in variable-cost contribution", () => {
    const m = computeMetrics(baseInput({
      ledger: [
        { entry_date: "2026-06-10", kind: "revenue", amount: 1000, revenue_line: "Line", is_variable: false },
        { entry_date: "2026-06-11", kind: "cost", amount: 200, revenue_line: "Line", is_variable: false }, // fixed -> ignored
      ],
    }));
    expect(m.contributionByLine[0].contribution).toBe(1000);
  });
});

describe("computeMetrics — coverage", () => {
  it("counts only categorized txns above the confidence threshold", () => {
    const m = computeMetrics(baseInput()); // 2 of 3 txns at 0.9 w/ category, 1 at 0.2
    expect(m.coveragePct).toBeCloseTo(66.67, 1);
    expect(m.transactionsCount).toBe(3);
  });
});

describe("computeMetrics — card audit: unfamiliar charges", () => {
  it("flags a first-seen merchant above threshold with a 60-day dispute date", () => {
    const m = computeMetrics(baseInput()); // Landlord (2000 out) is new; Gusto recurs
    const landlord = m.unfamiliar.find((u) => u.merchant === "Landlord");
    expect(landlord).toBeDefined();
    expect(landlord!.amount).toBe(2000);
    expect(landlord!.disputeBy).toBe("2026-08-14"); // 2026-06-15 + 60 days
    expect(m.unfamiliar.some((u) => u.merchant === "Gusto")).toBe(false); // recurring -> not flagged
    expect(Object.values(m.figures)).toContain(2000); // registered for verification
  });

  it("ignores first-seen charges below the threshold and inflows", () => {
    const m = computeMetrics(baseInput({
      transactions: [
        { posted_date: "2026-06-12", name: "Coffee", merchant_name_norm: "NewCafe", amount: 50, category: "Meals", confidence: 0.8 },
        { posted_date: "2026-06-13", name: "Deposit", merchant_name_norm: "NewClient", amount: -5000, category: "Income", confidence: 0.9 },
      ],
      priorTransactions: [],
    }));
    expect(m.unfamiliar.length).toBe(0); // $50 below threshold; deposit is inflow
  });
});
