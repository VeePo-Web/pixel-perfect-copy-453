import { describe, it, expect } from "vitest";
import { enrichTransaction, buildCorrectionMap, coveragePct, type EnrichInput } from "./report-enrich.ts";

const base = (over: Partial<EnrichInput> = {}): EnrichInput => ({
  merchantNorm: "AMAZON", pfcDetailed: "GENERAL_MERCHANDISE_OTHER",
  pfcPrimary: "GENERAL_MERCHANDISE", confidenceLevel: "HIGH", legacyFirst: null, ...over,
});

describe("enrichTransaction — trust hierarchy", () => {
  it("owner correction wins over everything with confidence 1.0", () => {
    const corrections = buildCorrectionMap([{ merchant_name_norm: "ADOBE", category: "Design Tools" }]);
    const r = enrichTransaction(base({ merchantNorm: "ADOBE" }), corrections);
    expect(r.source).toBe("owner");
    expect(r.category).toBe("Design Tools");
    expect(r.confidence).toBe(1);
    expect(r.ownerCorrected).toBe(true);
  });

  it("deterministic rule beats Plaid's broad category", () => {
    const r = enrichTransaction(base({ merchantNorm: "ADOBE CREATIVE CLOUD" }), new Map());
    expect(r.source).toBe("rule");
    expect(r.category).toBe("Software & Subscriptions");
    expect(r.confidence).toBeGreaterThan(0.9);
  });

  it("falls back to Plaid PFC with mapped confidence", () => {
    const r = enrichTransaction(base({ merchantNorm: "LOCAL DINER", confidenceLevel: "MEDIUM" }), new Map());
    expect(r.source).toBe("plaid");
    expect(r.category).toBe("GENERAL_MERCHANDISE_OTHER");
    expect(r.confidence).toBe(0.6);
  });

  it("falls back to legacy when no PFC", () => {
    const r = enrichTransaction(base({ merchantNorm: "X", pfcDetailed: null, pfcPrimary: null, legacyFirst: "Travel" }), new Map());
    expect(r.source).toBe("legacy");
    expect(r.category).toBe("Travel");
    expect(r.confidence).toBe(0.3);
  });

  it("returns uncategorized (low confidence) when nothing resolves", () => {
    const r = enrichTransaction(base({ merchantNorm: "MYSTERY LLC", pfcDetailed: null, pfcPrimary: null, legacyFirst: null }), new Map());
    expect(r.source).toBe("none");
    expect(r.category).toBeNull();
    expect(r.confidence).toBeLessThan(0.6);
  });

  it("correction lookup is case-insensitive on merchant", () => {
    const corrections = buildCorrectionMap([{ merchant_name_norm: "Stripe", category: "Fees" }]);
    const r = enrichTransaction(base({ merchantNorm: "STRIPE" }), corrections);
    expect(r.category).toBe("Fees");
    expect(r.source).toBe("owner");
  });
});

describe("coveragePct", () => {
  it("counts only transactions at/above the confidence floor", () => {
    const txns = [
      { category: "A", confidence: 0.9 },
      { category: "B", confidence: 0.6 },
      { category: "C", confidence: 0.3 },   // below floor
      { category: null, confidence: 0.95 }, // no category
    ];
    expect(coveragePct(txns, 0.6)).toBe(50); // 2 of 4
  });

  it("returns 0 for no transactions", () => {
    expect(coveragePct([], 0.6)).toBe(0);
  });
});
