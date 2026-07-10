/**
 * Single source of truth for the human-readable price IDs the GoldFin
 * funnel sells. Edit here to add a SKU — both the create-checkout function
 * and the frontend `startCheckout(...)` helper reference these names.
 *
 * The values must match the `price_id` strings registered via
 * `batch_create_product` (see docs/payments.md). They are stable across
 * sandbox and live.
 *
 * As of the current pricing page, the only paid SKU is GoldFin Reports at
 * $150/mo. GoldFin Advisory is contact-only (no Stripe). The free Template
 * Vault has no SKU.
 */
export const PRICE_IDS = {
  "auto-fill-monthly": "auto_fill_monthly",
} as const;

export type PlanKey = keyof typeof PRICE_IDS;

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === "string" && value in PRICE_IDS;
}
