// =========================================================================
// Advisory report — shared FRONTEND types.
// Mirrors the server-authoritative metrics payload (supabase/functions/
// _shared/report-metrics.ts) and the advisory_reports row shape. The frontend
// NEVER recomputes financial metrics — it renders the stored snapshot. These
// types are the contract /feature builds the report surface against.
// =========================================================================

export type Industry =
  | "restaurant"
  | "contractor"
  | "retail"
  | "agency"
  | "ecommerce"
  | "saas"
  | "professional_services"
  | "other";

export type EntityType =
  | "sole_proprietor"
  | "llc_sole_prop"
  | "llc_partnership"
  | "s_corp"
  | "c_corp"
  | "unknown";

export type MoneyBucket = "find_cash" | "keep_more" | "earn_new";

export interface BusinessProfile {
  business_name: string | null;
  industry: Industry;
  entity_type: EntityType;
  reserve_floor_months: number;
}

export interface WasteItem { merchant: string; monthly: number; annual: number; lastDate: string | null }
export interface DuplicateItem { merchant: string; amount: number; date: string; disputeBy: string }
export interface CostCreepItem { merchant: string; from: number; to: number }
export interface MoverItem { category: string; from: number; to: number; delta: number }
export interface ContributionLine {
  line: string;
  revenue: number;
  variableCost: number;
  contribution: number;
  marginPct: number | null;
}

/** The vertical lead metric pack (mirrors supabase/functions/_shared/report-industry.ts). */
export type IndustryMetricStatus = "good" | "watch" | "danger" | "info";
export type IndustryMetricUnit = "pct" | "usd" | "ratio" | "x";
export interface IndustryMetric {
  key: string;
  label: string;
  value: number;
  unit: IndustryMetricUnit;
  benchmarkLabel: string | null;
  status: IndustryMetricStatus;
  note: string | null;
}
export interface IndustryPack {
  industry: string;
  leadLabel: string;
  headline: string;
  metrics: IndustryMetric[];
  unlockNote: string | null;
  figures: Record<string, number>;
}

/** The grounded numbers a report is built from (advisory_reports.metrics_snapshot). */
export interface MetricsSnapshot {
  period: { start: string; end: string };
  cashOnHand: number;
  inflow: number;
  outflow: number;
  netCash: number;
  monthlyBurn: number;
  runwayMonths: number | null;
  revenueVsPriorPct: number | null;
  profitProxy: number;
  profitVsPriorPct: number | null;
  waste: WasteItem[];
  wasteAnnualTotal: number;
  duplicates: DuplicateItem[];
  costCreep: CostCreepItem[];
  biggestMover: MoverItem | null;
  ownerPay: { profit: number; ownerPay: number; tax: number; opex: number };
  contributionByLine: ContributionLine[];
  bestLine: ContributionLine | null;
  worstLine: ContributionLine | null;
  industry: IndustryPack | null;
  coveragePct: number;
  transactionsCount: number;
  figures: Record<string, number>;
  profile: BusinessProfile;
}

/** One generated narrative block. */
export interface ReportSection {
  key: string;        // verdict | what_changed | making_money | leaking | tax | free_cash | grow | decisions
  heading: string;
  body: string;
}

export interface Recommendation {
  text: string;
  bucket: MoneyBucket;
  dollar: number | null;
  deadline: string | null;
  acted: boolean | null;
  outcome: string | null;
}

export type ReportStatus = "draft" | "generated" | "failed" | "sent";

/** advisory_reports row as the frontend consumes it. */
export interface AdvisoryReport {
  id: string;
  period_start: string | null;
  period_end: string | null;
  status: ReportStatus;
  metrics_snapshot: MetricsSnapshot | null;
  narrative: ReportSection[] | null;
  recommendations: Recommendation[] | null;
  subject_line: string | null;
  coverage_pct: number | null;
  verification_passed: boolean | null;
  model: string | null;
  generated_at: string | null;
  created_at: string;
}

/** Industry → the make-or-break lead metric label (for the report header). */
export const INDUSTRY_LEAD_METRIC: Record<Industry, string> = {
  restaurant: "Prime cost",
  contractor: "WIP / billing position",
  retail: "Inventory turnover & GMROI",
  agency: "Billable utilization",
  ecommerce: "Contribution margin per order",
  saas: "MRR, churn & LTV:CAC",
  professional_services: "Utilization & margin",
  other: "Cash runway & margin",
};

export const BUCKET_LABEL: Record<MoneyBucket, string> = {
  find_cash: "Find cash",
  keep_more: "Keep more",
  earn_new: "Earn new",
};
