// =========================================================================
// INDUSTRY PACK  (Layer 1 — vertical lead metrics, deterministic)
// Cycle-7 build pack §2 "Industry packs". Computes the ONE make-or-break
// metric per vertical that breaks the "sales = health" illusion in that
// industry's own language:
//   restaurant  -> prime cost & food cost %
//   ecommerce   -> contribution margin (per order when orders are known)
//   contractor  -> WIP under/over-billing (cash trapped in unbilled work)
//   retail      -> inventory turnover & GMROI
//   agency      -> billable utilization & gross margin
//   saas        -> contribution margin (MRR/churn need a revenue feed)
//
// PURE + dependency-free (same discipline as report-metrics.ts) so the same
// figures are registered and the verification layer (report-verify.ts) can
// prove the generated narrative invents nothing. A metric is computed ONLY
// when its denominator exists in the owner's real data — otherwise the pack
// reports what IS computable and names what to connect to unlock the rest.
// No number is ever guessed.
// =========================================================================

import type { LedgerEntry, Profile, ContributionLine } from "./report-metrics.ts";

/** Period-scoped vertical inputs the owner supplies via the template intake
 *  (business_metric_inputs). Every field optional — packs degrade gracefully. */
export type IndustryInputs = {
  orders?: number | null;            // ecommerce: order count this period
  billableHours?: number | null;     // agency: hours billed
  availableHours?: number | null;    // agency: hours available
  avgInventory?: number | null;      // retail: average inventory value at cost
  jobs?: { name: string; pctComplete: number; contract: number; billed: number }[]; // contractor WIP
  ltv?: number | null;               // growth gate: customer lifetime value
  cac?: number | null;               // growth gate: customer acquisition cost
};

export type IndustryMetricStatus = "good" | "watch" | "danger" | "info";
export type IndustryMetricUnit = "pct" | "usd" | "ratio" | "x";

export type IndustryMetric = {
  key: string;
  label: string;
  value: number;
  unit: IndustryMetricUnit;
  benchmarkLabel: string | null;
  status: IndustryMetricStatus;
  note: string | null;
};

export type IndustryPack = {
  industry: string;
  leadLabel: string;             // human label for the lead metric
  headline: string;              // one plain-English line for the report header
  metrics: IndustryMetric[];     // computed lead metrics (may be empty)
  unlockNote: string | null;     // what to connect to unlock the lead metric
  figures: Record<string, number>;
};

const r2 = (n: number) => Math.round(n * 100) / 100;
const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);

const LEAD_LABEL: Record<string, string> = {
  restaurant: "Prime cost",
  contractor: "WIP / billing position",
  retail: "Inventory turnover & GMROI",
  agency: "Billable utilization",
  ecommerce: "Contribution margin per order",
  saas: "Contribution margin",
  professional_services: "Utilization & margin",
  other: "Margin",
};

// Canonical category resolution for ledger lines (owner-typed free text).
// Order matters: labor is checked first so "kitchen labor" / "bar staff" are
// counted as labor, not food/beverage.
function canon(category: string | null): string {
  const c = (category ?? "").toLowerCase();
  if (/\b(labor|labour|payroll|wages|staff|crew)\b/.test(c)) return "labor";
  if (/\b(beverage|bev|liquor|alcohol|wine|beer|soda)\b/.test(c)) return "beverage";
  if (/\b(food|produce|meat|grocery|ingredient)\b/.test(c)) return "food";
  if (/\b(cogs|cost of goods|materials|supplies|product cost)\b/.test(c)) return "cogs";
  if (/\b(ship|freight|fulfillment|fulfilment|pick|pack|3pl)\b/.test(c)) return "shipping";
  if (/\b(ads?|advertis|marketing|cac|meta|google ads|acquisition)\b/.test(c)) return "marketing";
  if (/\b(fee|merchant fee|processing|stripe fee|paypal fee)\b/.test(c)) return "fees";
  return "other";
}

type LedgerRollup = {
  revenue: number;
  variableCost: number;
  fixedCost: number;
  byCanon: Record<string, number>;   // cost magnitude by canonical category
};

function rollup(ledger: LedgerEntry[]): LedgerRollup {
  const byCanon: Record<string, number> = {};
  let revenue = 0, variableCost = 0, fixedCost = 0;
  for (const e of ledger) {
    const amt = Math.abs(e.amount);
    if (e.kind === "revenue") { revenue += amt; continue; }
    if (e.is_variable) variableCost += amt; else fixedCost += amt;
    const k = canon(e.category);
    byCanon[k] = (byCanon[k] ?? 0) + amt;
  }
  return { revenue: r2(revenue), variableCost: r2(variableCost), fixedCost: r2(fixedCost), byCanon };
}

function contributionMarginPct(r: LedgerRollup): number | null {
  if (r.revenue <= 0) return null;
  return r2(((r.revenue - r.variableCost) / r.revenue) * 100);
}
function grossMarginPct(r: LedgerRollup): number | null {
  if (r.revenue <= 0) return null;
  const cogs = (r.byCanon.cogs ?? 0) + (r.byCanon.food ?? 0) + (r.byCanon.beverage ?? 0) + (r.byCanon.shipping ?? 0);
  return r2(((r.revenue - cogs) / r.revenue) * 100);
}

function band(value: number, danger: (v: number) => boolean, watch: (v: number) => boolean): IndustryMetricStatus {
  if (danger(value)) return "danger";
  if (watch(value)) return "watch";
  return "good";
}

export function computeIndustryPack(
  industry: string,
  ledger: LedgerEntry[],
  inputs: IndustryInputs | undefined,
  contributionByLine: ContributionLine[],
  _profile: Profile,
): IndustryPack | null {
  const r = rollup(ledger);
  const figures: Record<string, number> = {};
  const metrics: IndustryMetric[] = [];
  let unlockNote: string | null = null;
  const leadLabel = LEAD_LABEL[industry] ?? LEAD_LABEL.other;
  const reg = (k: string, v: number | null): number | null => {
    if (v == null || Number.isNaN(v)) return null;
    figures[`industry_${k}`] = v;
    return v;
  };

  switch (industry) {
    case "restaurant": {
      if (r.revenue > 0) {
        const foodBev = (r.byCanon.food ?? 0) + (r.byCanon.beverage ?? 0);
        const labor = r.byCanon.labor ?? 0;
        const foodPct = reg("food_cost_pct", r2((foodBev / r.revenue) * 100));
        const prime = reg("prime_cost", r2(((foodBev + labor) / r.revenue) * 100));
        if (prime != null) {
          metrics.push({
            key: "prime_cost", label: "Prime cost", value: prime, unit: "pct",
            benchmarkLabel: "55–65% of sales",
            status: band(prime, (v) => v > 65, (v) => v >= 60),
            note: prime > 65 ? "Past the line where full-service restaurants stop making money." : "Food + labor as a share of sales.",
          });
        }
        if (foodPct != null) {
          metrics.push({
            key: "food_cost_pct", label: "Food cost", value: foodPct, unit: "pct",
            benchmarkLabel: "28–35% of sales",
            status: band(foodPct, (v) => v > 35, (v) => v >= 32),
            note: null,
          });
        }
        if (labor === 0) unlockNote = "Tag labor costs in your template to complete prime cost.";
      } else {
        unlockNote = "Add sales and food/labor costs (template) to unlock prime cost.";
      }
      break;
    }

    case "ecommerce":
    case "saas": {
      const cm = contributionMarginPct(r);
      if (cm != null) {
        reg("contribution_margin_pct", cm);
        metrics.push({
          key: "contribution_margin_pct", label: "Contribution margin", value: cm, unit: "pct",
          benchmarkLabel: "positive after all variable costs",
          status: band(cm, (v) => v < 0, (v) => v < 15),
          note: "Revenue left after shipping, COGS, fees and acquisition.",
        });
        const orders = inputs?.orders ?? null;
        if (orders && orders > 0) {
          const cmPerOrder = reg("cm_per_order", r2((r.revenue - r.variableCost) / orders));
          if (cmPerOrder != null) {
            metrics.push({
              key: "cm_per_order", label: "Contribution / order", value: cmPerOrder, unit: "usd",
              benchmarkLabel: "positive per order",
              status: band(cmPerOrder, (v) => v < 0, (v) => v < 5),
              note: cmPerOrder < 0 ? "You lose money on every order at this blend." : null,
            });
          }
        } else {
          unlockNote = "Add this period's order count to see contribution margin per order.";
        }
      } else {
        unlockNote = "Add revenue and variable costs (template) to unlock contribution margin.";
      }
      break;
    }

    case "contractor": {
      const jobs = inputs?.jobs ?? [];
      if (jobs.length > 0) {
        const earned = sum(jobs.map((j) => Math.max(0, j.pctComplete) / 100 * Math.max(0, j.contract)));
        const billed = sum(jobs.map((j) => Math.max(0, j.billed)));
        const underbilled = r2(Math.max(0, earned - billed));
        const overbilled = r2(Math.max(0, billed - earned));
        reg("wip_earned", r2(earned));
        reg("wip_billed", r2(billed));
        if (underbilled > 0) {
          reg("underbilled", underbilled);
          metrics.push({
            key: "underbilled", label: "Underbilled (cash trapped)", value: underbilled, unit: "usd",
            benchmarkLabel: "underbilling = #1 cash killer",
            status: "danger",
            note: "You've paid for work you haven't billed yet. Submit the next draws.",
          });
        } else {
          reg("overbilled", overbilled);
          metrics.push({
            key: "overbilled", label: "Overbilled (deferred)", value: overbilled, unit: "usd",
            benchmarkLabel: "clean WIP supports bonding",
            status: overbilled > 0 ? "watch" : "good",
            note: "You're billed ahead of work completed — keep delivering to earn it.",
          });
        }
      } else {
        const gm = grossMarginPct(r);
        if (gm != null) {
          reg("gross_margin_pct", gm);
          metrics.push({
            key: "gross_margin_pct", label: "Gross margin", value: gm, unit: "pct",
            benchmarkLabel: null, status: band(gm, (v) => v < 10, (v) => v < 20), note: null,
          });
        }
        unlockNote = "Add active jobs (% complete, contract, billed) to unlock WIP / underbilling.";
      }
      break;
    }

    case "retail": {
      const cogs = (r.byCanon.cogs ?? 0) + (r.byCanon.food ?? 0) + (r.byCanon.beverage ?? 0);
      const avgInv = inputs?.avgInventory ?? null;
      if (avgInv && avgInv > 0 && cogs > 0) {
        const turnover = reg("inventory_turnover", r2(cogs / avgInv));
        const gmDollars = r.revenue - cogs;
        const gmroi = reg("gmroi", r2(gmDollars / avgInv));
        if (turnover != null) {
          metrics.push({
            key: "inventory_turnover", label: "Inventory turnover", value: turnover, unit: "x",
            benchmarkLabel: "higher = inventory not sitting", status: band(turnover, (v) => v < 1, (v) => v < 2), note: null,
          });
        }
        if (gmroi != null) {
          metrics.push({
            key: "gmroi", label: "GMROI", value: gmroi, unit: "ratio",
            benchmarkLabel: "above 1.0", status: band(gmroi, (v) => v < 1, (v) => v < 1.5),
            note: gmroi < 1 ? "Inventory is selling for less than it costs to carry." : null,
          });
        }
      } else {
        const gm = grossMarginPct(r);
        if (gm != null) {
          reg("gross_margin_pct", gm);
          metrics.push({ key: "gross_margin_pct", label: "Gross margin", value: gm, unit: "pct", benchmarkLabel: null, status: band(gm, (v) => v < 10, (v) => v < 25), note: null });
        }
        unlockNote = "Add average inventory value to unlock turnover and GMROI.";
      }
      break;
    }

    case "agency":
    case "professional_services": {
      const bh = inputs?.billableHours ?? null;
      const ah = inputs?.availableHours ?? null;
      if (bh != null && ah && ah > 0) {
        const util = reg("utilization_pct", r2((bh / ah) * 100));
        if (util != null) {
          metrics.push({
            key: "utilization_pct", label: "Billable utilization", value: util, unit: "pct",
            benchmarkLabel: "75%+ healthy", status: band(util, (v) => v < 60, (v) => v < 75), note: null,
          });
        }
      } else {
        unlockNote = "Add billable and available hours to unlock utilization.";
      }
      const gm = grossMarginPct(r);
      if (gm != null) {
        reg("gross_margin_pct", gm);
        metrics.push({
          key: "gross_margin_pct", label: "Gross margin", value: gm, unit: "pct",
          benchmarkLabel: industry === "agency" ? "85%+ healthy" : "15–25% net typical",
          status: band(gm, (v) => v < 50, (v) => v < 70), note: null,
        });
      }
      break;
    }

    default: {
      const cm = contributionMarginPct(r);
      if (cm != null) {
        reg("contribution_margin_pct", cm);
        metrics.push({
          key: "contribution_margin_pct", label: "Contribution margin", value: cm, unit: "pct",
          benchmarkLabel: null, status: band(cm, (v) => v < 0, (v) => v < 15), note: null,
        });
      } else if (contributionByLine.length > 0) {
        // nothing extra; the contribution-by-line table carries it
      } else {
        unlockNote = "Upload your spreadsheet template to unlock margin by line.";
      }
    }
  }

  if (metrics.length === 0 && !unlockNote) return null;

  const lead = metrics[0];
  const headline = lead
    ? `${leadLabel}: ${formatMetric(lead)}${lead.benchmarkLabel ? ` (target ${lead.benchmarkLabel})` : ""}.`
    : `${leadLabel}: connect more data to unlock this number.`;

  return { industry, leadLabel, headline, metrics, unlockNote, figures };
}

function formatMetric(m: IndustryMetric): string {
  switch (m.unit) {
    case "pct": return `${m.value}%`;
    case "usd": return `$${Math.round(m.value).toLocaleString("en-US")}`;
    case "x": return `${m.value}x`;
    case "ratio": return `${m.value}`;
  }
}
