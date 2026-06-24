// GoldFin Desk — finance engine types
// Sign convention (ours): amount > 0 = money IN (inflow), amount < 0 = money OUT (outflow).
// This is the accounting convention — the OPPOSITE of Plaid's raw `amount` (flip on ingest).
// Internal transfers and owner-equity moves are EXCLUDED from the P&L.

export type StatementSection =
  | "revenue"
  | "cogs"
  | "opex"
  | "payroll"
  | "tax"
  | "debt_service"
  | "owner_equity"
  | "internal_transfer"
  | "uncategorized";

export type OpexLine =
  | "rent_utilities"
  | "software"
  | "marketing"
  | "travel_meals"
  | "other";

export type CategorySource = "rule" | "plaid" | "ai" | "user";

export interface NormalizedTransaction {
  /** Stable internal id (never the bank's identifier). */
  readonly id: string;
  /** Posted date, ISO YYYY-MM-DD. */
  readonly date: string;
  readonly pending: boolean;
  /** OUR sign: positive = inflow, negative = outflow. */
  readonly amount: number;
  readonly merchantName: string | null;
  readonly section: StatementSection;
  /** Finer line within `opex` only. */
  readonly opexLine?: OpexLine;
  readonly source: CategorySource;
  /** 0..1 — how sure the categorizer is. */
  readonly confidence: number;
}

export interface Anomaly {
  readonly kind: "line_spike" | "large_transaction" | "new_large_merchant";
  readonly label: string;
  readonly amount: number;
  readonly detail: string;
}

export interface ReviewItem {
  readonly transactionId: string;
  readonly reason: "low_confidence" | "confirm_transfer" | "confirm_owner_equity" | "uncategorized";
  readonly merchantName: string | null;
  readonly amount: number;
}

export interface HeadlineDeltas {
  readonly totalRevenue: number;
  readonly netIncome: number;
  readonly closingCash: number;
  readonly grossMarginPct: number;
}

export interface PeriodMetrics {
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly dataAsOf: string;

  // P&L
  readonly revenue: number;
  readonly otherIncome: number;
  readonly totalRevenue: number;
  readonly cogs: number;
  readonly grossProfit: number;
  readonly grossMarginPct: number;
  readonly payroll: number;
  readonly opexByLine: Readonly<Record<OpexLine, number>>;
  readonly totalOpex: number;
  readonly netOperatingIncome: number;
  readonly taxes: number;
  readonly netIncome: number;

  // Cash flow
  readonly openingCash: number;
  readonly netCashFromOps: number;
  readonly debtService: number;
  readonly ownerEquityNet: number;
  readonly closingCash: number;
  readonly burn: number;
  /** null when not burning (build or break-even). */
  readonly runwayMonths: number | null;

  // Memo (excluded from P&L)
  readonly ownerDraws: number;
  readonly ownerContributions: number;
  readonly internalTransferCount: number;

  readonly deltas: HeadlineDeltas | null;
  readonly anomalies: readonly Anomaly[];
  readonly reviewQueue: readonly ReviewItem[];
}

export type TemplateRowKind = "section" | "line" | "total" | "memo";

export interface TemplateRow {
  readonly label: string;
  /** Currency value, or null for a section header row. */
  readonly value: number | null;
  readonly kind: TemplateRowKind;
  readonly indent: number;
  /** True for percentage rows (e.g. Gross Margin %). */
  readonly isPercent?: boolean;
}

export interface FilledTemplate {
  readonly title: string;
  readonly periodLabel: string;
  readonly rows: readonly TemplateRow[];
}
