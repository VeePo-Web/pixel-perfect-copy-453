// =========================================================================
// GROWTH / REINVESTMENT GATE  (Layer 1 — the "now make MORE money" move)
// Cycle-6 §4 + Cycle-7 acceptance: growth is the LEAST-certain money move and
// is recommended ONLY when the business can afford it. The gate is computed
// deterministically (not merely instructed) so "secure the reserve first" is
// structurally true and the reinvestment budget is a grounded figure the
// verification layer can prove.
//
// Gate (both must hold to open):
//   1. Cash reserve secured   — runway >= reserve_floor_months
//   2. Unit economics support — LTV:CAC >= 3:1
// Budget when open: 30–50% of period net profit. Never when profit <= 0.
// PURE + dependency-free (same discipline as the rest of Layer 1).
// =========================================================================

export type GrowthStatus =
  | "ready"                 // gate open — reinvest within the budget
  | "secure_reserve_first"  // profitable but runway below the floor
  | "fix_unit_economics"    // reserve ok but LTV:CAC below 3:1
  | "need_unit_economics"   // reserve ok, profit ok, but LTV/CAC not provided
  | "not_profitable";       // no surplus to reinvest

export type GrowthBlock = {
  status: GrowthStatus;
  reserveSecured: boolean;
  runwayMonths: number | null;
  reserveFloorMonths: number;
  ltvCacRatio: number | null;
  unitEconomicsOk: boolean | null;
  netProfit: number;
  reinvestLow: number | null;
  reinvestHigh: number | null;
  headline: string;
  figures: Record<string, number>;
};

const r2 = (n: number) => Math.round(n * 100) / 100;
const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export function computeGrowthBlock(args: {
  netProfit: number;            // period net (profitProxy)
  runwayMonths: number | null;
  reserveFloorMonths: number;
  ltv?: number | null;
  cac?: number | null;
}): GrowthBlock {
  const { netProfit, runwayMonths, reserveFloorMonths } = args;
  const ltv = args.ltv ?? null;
  const cac = args.cac ?? null;

  const ltvCacRatio = ltv != null && cac != null && cac > 0 ? r2(ltv / cac) : null;
  const reserveSecured = runwayMonths != null && runwayMonths >= reserveFloorMonths;
  const unitEconomicsOk = ltvCacRatio == null ? null : ltvCacRatio >= 3;

  const figures: Record<string, number> = {};
  if (ltvCacRatio != null) figures.growth_ltv_cac = ltvCacRatio;

  let status: GrowthStatus;
  let reinvestLow: number | null = null;
  let reinvestHigh: number | null = null;
  let headline: string;

  if (netProfit <= 0) {
    status = "not_profitable";
    headline = "Not yet. You're not generating a surplus to reinvest — focus on cash and margin first.";
  } else if (!reserveSecured) {
    status = "secure_reserve_first";
    const floorTxt = `${reserveFloorMonths}-month`;
    headline = `Not yet. Secure your ${floorTxt} cash reserve before reinvesting — growth is the least-certain money move.`;
  } else if (unitEconomicsOk === false) {
    status = "fix_unit_economics";
    headline = `Hold. Your reserve is secured, but LTV:CAC is ${ltvCacRatio}:1 — below the 3:1 floor. Fix unit economics before scaling spend.`;
  } else if (unitEconomicsOk == null) {
    status = "need_unit_economics";
    headline = "Reserve secured. Add your LTV and CAC to size a safe reinvestment budget before scaling.";
  } else {
    status = "ready";
    reinvestLow = r2(netProfit * 0.3);
    reinvestHigh = r2(netProfit * 0.5);
    figures.growth_reinvest_low = reinvestLow;
    figures.growth_reinvest_high = reinvestHigh;
    headline = `Reserve secured and unit economics support it (LTV:CAC ${ltvCacRatio}:1). Reinvest ${usd(reinvestLow)}–${usd(reinvestHigh)} of this period's profit into your highest-ROI channel.`;
  }

  return {
    status, reserveSecured, runwayMonths, reserveFloorMonths,
    ltvCacRatio, unitEconomicsOk, netProfit: r2(netProfit),
    reinvestLow, reinvestHigh, headline, figures,
  };
}
