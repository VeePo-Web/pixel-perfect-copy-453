import { describe, it, expect } from "vitest";
import { computeGrowthBlock } from "./report-growth.ts";

describe("growth gate", () => {
  it("opens and sizes a 30–50% budget when reserve is secured AND LTV:CAC >= 3", () => {
    const g = computeGrowthBlock({ netProfit: 20000, runwayMonths: 6, reserveFloorMonths: 3, ltv: 900, cac: 200 });
    expect(g.status).toBe("ready");
    expect(g.ltvCacRatio).toBe(4.5);
    expect(g.reinvestLow).toBe(6000);
    expect(g.reinvestHigh).toBe(10000);
    expect(g.figures.growth_reinvest_low).toBe(6000);
    expect(g.figures.growth_reinvest_high).toBe(10000);
  });

  it("withholds growth and says secure the reserve first when runway is below the floor", () => {
    const g = computeGrowthBlock({ netProfit: 20000, runwayMonths: 1.5, reserveFloorMonths: 3, ltv: 900, cac: 200 });
    expect(g.status).toBe("secure_reserve_first");
    expect(g.reinvestLow).toBeNull();
    expect(g.reserveSecured).toBe(false);
  });

  it("withholds growth when unit economics are below 3:1 even with reserve secured", () => {
    const g = computeGrowthBlock({ netProfit: 20000, runwayMonths: 6, reserveFloorMonths: 3, ltv: 400, cac: 200 });
    expect(g.status).toBe("fix_unit_economics");
    expect(g.ltvCacRatio).toBe(2);
    expect(g.reinvestLow).toBeNull();
  });

  it("asks for LTV/CAC when reserve+profit are fine but unit economics are unknown", () => {
    const g = computeGrowthBlock({ netProfit: 20000, runwayMonths: 6, reserveFloorMonths: 3 });
    expect(g.status).toBe("need_unit_economics");
    expect(g.unitEconomicsOk).toBeNull();
    expect(g.reinvestLow).toBeNull();
  });

  it("never recommends growth without profit", () => {
    const g = computeGrowthBlock({ netProfit: -5000, runwayMonths: 12, reserveFloorMonths: 3, ltv: 900, cac: 100 });
    expect(g.status).toBe("not_profitable");
    expect(g.reinvestLow).toBeNull();
  });

  it("registers only grounded figures (no budget figure when the gate is closed)", () => {
    const g = computeGrowthBlock({ netProfit: 20000, runwayMonths: 1, reserveFloorMonths: 3, ltv: 900, cac: 200 });
    expect(g.figures.growth_reinvest_low).toBeUndefined();
    expect(g.figures.growth_ltv_cac).toBe(4.5); // ratio is still a real, citable number
  });
});
