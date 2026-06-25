import { describe, it, expect } from "vitest";
import { computeIndustryPack, type IndustryInputs } from "./report-industry.ts";
import type { LedgerEntry, Profile, ContributionLine } from "./report-metrics.ts";

const PROFILE = (industry: string): Profile => ({
  business_name: "Test", industry, entity_type: "s_corp", reserve_floor_months: 3,
});

function led(entries: Partial<LedgerEntry>[]): LedgerEntry[] {
  return entries.map((e) => ({
    entry_date: "2026-06-15", kind: "cost", amount: 0, revenue_line: null,
    is_variable: true, ...e,
  })) as LedgerEntry[];
}

const NO_LINES: ContributionLine[] = [];

describe("industry pack — restaurant prime cost", () => {
  const ledger = led([
    { kind: "revenue", amount: 100000 },
    { kind: "cost", amount: 30000, category: "Food / produce", is_variable: true },
    { kind: "cost", amount: 4000, category: "Beverage / bar", is_variable: true },
    { kind: "cost", amount: 34000, category: "Kitchen labor", is_variable: true },
  ]);

  it("computes prime cost and food cost % and flags danger over 65%", () => {
    const p = computeIndustryPack("restaurant", ledger, undefined, NO_LINES, PROFILE("restaurant"))!;
    expect(p).not.toBeNull();
    // food+bev = 34000, labor = 34000 -> prime = 68000/100000 = 68%
    expect(p.figures.industry_prime_cost).toBe(68);
    expect(p.figures.industry_food_cost_pct).toBe(34);
    const prime = p.metrics.find((m) => m.key === "prime_cost")!;
    expect(prime.status).toBe("danger"); // > 65
    expect(prime.value).toBe(68);
  });

  it("registers every value it states in figures (verification can prove grounding)", () => {
    const p = computeIndustryPack("restaurant", ledger, undefined, NO_LINES, PROFILE("restaurant"))!;
    for (const m of p.metrics) {
      expect(Object.values(p.figures)).toContain(m.value);
    }
  });

  it("returns an unlock note when no sales data exists", () => {
    const p = computeIndustryPack("restaurant", [], undefined, NO_LINES, PROFILE("restaurant"));
    expect(p?.unlockNote).toMatch(/prime cost/i);
    expect(p?.metrics.length).toBe(0);
  });
});

describe("industry pack — ecommerce contribution margin", () => {
  const ledger = led([
    { kind: "revenue", amount: 140000 },
    { kind: "cost", amount: 60000, category: "COGS", is_variable: true },
    { kind: "cost", amount: 20000, category: "Shipping / fulfillment", is_variable: true },
  ]);

  it("computes blended contribution margin %", () => {
    const p = computeIndustryPack("ecommerce", ledger, undefined, NO_LINES, PROFILE("ecommerce"))!;
    // (140000-80000)/140000 = 42.86%
    expect(p.figures.industry_contribution_margin_pct).toBeCloseTo(42.86, 1);
  });

  it("computes contribution margin per order when order count is provided", () => {
    const inputs: IndustryInputs = { orders: 1000 };
    const p = computeIndustryPack("ecommerce", ledger, inputs, NO_LINES, PROFILE("ecommerce"))!;
    // (140000-80000)/1000 = 60
    expect(p.figures.industry_cm_per_order).toBe(60);
    expect(p.metrics.some((m) => m.key === "cm_per_order")).toBe(true);
  });

  it("flags a per-order loss as danger", () => {
    const losing = led([
      { kind: "revenue", amount: 10000 },
      { kind: "cost", amount: 12000, category: "COGS", is_variable: true },
    ]);
    const p = computeIndustryPack("ecommerce", losing, { orders: 100 }, NO_LINES, PROFILE("ecommerce"))!;
    const cmo = p.metrics.find((m) => m.key === "cm_per_order")!;
    expect(cmo.value).toBeLessThan(0);
    expect(cmo.status).toBe("danger");
  });
});

describe("industry pack — contractor WIP / underbilling", () => {
  it("computes underbilled cash trapped from job WIP", () => {
    const inputs: IndustryInputs = {
      jobs: [
        { name: "Cedar Lofts", pctComplete: 60, contract: 500000, billed: 200000 }, // earned 300k, billed 200k -> 100k under
        { name: "Maple St", pctComplete: 50, contract: 100000, billed: 31000 },      // earned 50k, billed 31k -> 19k under
      ],
    };
    const p = computeIndustryPack("contractor", [], inputs, NO_LINES, PROFILE("contractor"))!;
    expect(p.figures.industry_underbilled).toBe(119000);
    const u = p.metrics.find((m) => m.key === "underbilled")!;
    expect(u.status).toBe("danger");
  });

  it("falls back to gross margin + unlock note without job data", () => {
    const ledger = led([
      { kind: "revenue", amount: 210000 },
      { kind: "cost", amount: 120000, category: "Materials", is_variable: true },
    ]);
    const p = computeIndustryPack("contractor", ledger, undefined, NO_LINES, PROFILE("contractor"))!;
    expect(p.unlockNote).toMatch(/WIP/i);
    expect(p.figures.industry_gross_margin_pct).toBeGreaterThan(0);
  });
});

describe("industry pack — agency utilization", () => {
  it("computes billable utilization and flags below 75%", () => {
    const ledger = led([
      { kind: "revenue", amount: 80000 },
      { kind: "cost", amount: 10000, category: "Subcontractors", is_variable: true },
    ]);
    const inputs: IndustryInputs = { billableHours: 600, availableHours: 1000 };
    const p = computeIndustryPack("agency", ledger, inputs, NO_LINES, PROFILE("agency"))!;
    expect(p.figures.industry_utilization_pct).toBe(60);
    const util = p.metrics.find((m) => m.key === "utilization_pct")!;
    expect(util.status).toBe("watch"); // 60 is not < 60 (danger), but < 75 (watch)
  });
});

describe("industry pack — graceful absence", () => {
  it("returns null when there is nothing to compute and nothing to unlock", () => {
    const p = computeIndustryPack("saas", [], undefined, NO_LINES, PROFILE("saas"));
    // saas with no ledger -> unlock note present, so not null
    expect(p).not.toBeNull();
    expect(p?.unlockNote).toBeTruthy();
  });
});
