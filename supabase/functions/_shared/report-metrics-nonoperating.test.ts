import { describe, it, expect } from "vitest";
import { computeMetrics, isNonOperating, type Txn } from "./report-metrics.ts";

const tx = (over: Partial<Txn>): Txn => ({
  posted_date: "2026-06-12", name: null, merchant_name_norm: null,
  amount: 0, category: null, confidence: 0.9, ...over,
});

function metricsFor(transactions: Txn[], priorTransactions: Txn[] = []) {
  return computeMetrics({
    accounts: [{ current_balance: 10000, type: "depository" }],
    transactions, priorTransactions,
    recurringStreams: [],
    profile: { business_name: "X", industry: "other", entity_type: "llc_sole_prop", reserve_floor_months: 3 },
    periodStart: "2026-06-09", periodEnd: "2026-06-23", today: "2026-06-23",
  });
}

describe("isNonOperating", () => {
  it("flags Plaid internal account transfers (both directions)", () => {
    expect(isNonOperating(tx({ amount: 5000, category_raw: { primary: "TRANSFER_OUT", detailed: "TRANSFER_OUT_ACCOUNT_TRANSFER" } }))).toBe(true);
    expect(isNonOperating(tx({ amount: -5000, category_raw: { primary: "TRANSFER_IN", detailed: "TRANSFER_IN_ACCOUNT_TRANSFER" } }))).toBe(true);
  });

  it("flags credit-card payoffs (double-count guard)", () => {
    expect(isNonOperating(tx({ amount: 1500, category_raw: { primary: "LOAN_PAYMENTS", detailed: "LOAN_PAYMENTS_CREDIT_CARD_PAYMENT" } }))).toBe(true);
  });

  it("flags owner draws / distributions by name when PFC is absent", () => {
    expect(isNonOperating(tx({ amount: 2000, name: "Owner Draw" }))).toBe(true);
    expect(isNonOperating(tx({ amount: 2000, name: "Shareholder Distribution" }))).toBe(true);
    expect(isNonOperating(tx({ amount: 5000, name: "Transfer to Savings" }))).toBe(true);
  });

  it("does NOT flag real revenue or real expenses (no over-exclusion)", () => {
    // A customer deposit that arrives as a transfer-in is still revenue.
    expect(isNonOperating(tx({ amount: -3000, name: "Customer Payment", category_raw: { primary: "TRANSFER_IN", detailed: "TRANSFER_IN_DEPOSIT" } }))).toBe(false);
    // An ordinary operating expense.
    expect(isNonOperating(tx({ amount: 149, name: "Adobe", merchant_name_norm: "Adobe", category: "Software" }))).toBe(false);
    // Payroll is an expense, not an owner draw — must not be excluded.
    expect(isNonOperating(tx({ amount: 8000, name: "Gusto Payroll", merchant_name_norm: "Gusto" }))).toBe(false);
  });
});

describe("computeMetrics — non-operating exclusion", () => {
  it("removes transfers, card payoffs and owner draws from operating cash flow", () => {
    const m = metricsFor([
      tx({ amount: 1000, name: "Rent", category: "Rent" }),                                   // real expense
      tx({ amount: 5000, name: "Transfer to Savings", category_raw: { detailed: "TRANSFER_OUT_ACCOUNT_TRANSFER" } }),
      tx({ amount: 2000, name: "Owner Draw" }),
      tx({ amount: 1500, name: "AMEX EPAYMENT", category_raw: { detailed: "LOAN_PAYMENTS_CREDIT_CARD_PAYMENT" } }),
    ]);
    expect(m.outflow).toBe(1000);              // only the real expense survives
    expect(m.nonOperatingExcluded).toBe(8500); // 5000 + 2000 + 1500
  });

  it("keeps customer deposits as operating revenue", () => {
    const m = metricsFor([
      tx({ amount: -3000, name: "Customer Payment", category_raw: { detailed: "TRANSFER_IN_DEPOSIT" } }),
    ]);
    expect(m.inflow).toBe(3000);
    expect(m.nonOperatingExcluded).toBe(0);
  });

  it("does not let an internal transfer become a flagged 'unfamiliar' charge", () => {
    const m = metricsFor([
      tx({ amount: 9000, name: "Transfer to Savings", merchant_name_norm: "Savings", category_raw: { detailed: "TRANSFER_OUT_ACCOUNT_TRANSFER" } }),
    ]);
    expect(m.unfamiliar.length).toBe(0);
    expect(m.outflow).toBe(0);
  });
});
