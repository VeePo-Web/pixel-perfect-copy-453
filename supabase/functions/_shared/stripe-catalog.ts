/**
 * Single source of truth for the human-readable price IDs the GoldFin
 * funnel sells. Edit here to add a SKU — both the create-checkout function
 * and the frontend `startCheckout(...)` helper reference these names.
 *
 * The values must match the `price_id` strings registered via
 * `batch_create_product` (see docs/payments.md). They are stable across
 * sandbox and live.
 */
export const PRICE_IDS = {
  "auto-fill-monthly": "auto_fill_monthly",
  "finance-desk-monthly": "finance_desk_monthly",
  "clarity-report": "clarity_report_once",
} as const;

export type PlanKey = keyof typeof PRICE_IDS;

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === "string" && value in PRICE_IDS;
}
