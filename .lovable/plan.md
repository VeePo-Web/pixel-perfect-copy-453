## Goal

Make Stripe exactly match the current pricing page. The updated table sells only one paid SKU — **GoldFin Reports at $150/mo** (`auto-fill-monthly`). GoldFin Advisory is contact-only (no Stripe). There are no add-ons on the pricing page, so no add-on SKUs should exist in checkout.

Right now the code still carries two stale plans (`finance-desk-monthly` at $149, `clarity-report` at $49) from a previous funnel. They aren't linked from the pricing page but remain wired through checkout, the webhook allowlist, and the cron eligibility filter — a live risk for drift.

## Changes

### 1. Sync Stripe catalog

Call `payments--batch_create_product` (idempotent by product/price ID) to guarantee sandbox matches the page:

- `goldfin_reports` → price `auto_fill_monthly`, **$15000 cents USD, recurring monthly**, quantity 1–1, tax code `txcd_10103001` (SaaS).

Live is synced automatically at publish. No add-on products are created.

### 2. Prune legacy price IDs from the catalog file

`supabase/functions/_shared/stripe-catalog.ts` — keep only:

```ts
export const PRICE_IDS = {
  "auto-fill-monthly": "auto_fill_monthly",
} as const;
```

Remove `finance-desk-monthly` and `clarity-report` entries.

### 3. Prune legacy plans from the frontend

`src/lib/checkout.ts`:
- `PlanKey` becomes `"auto-fill-monthly"` only.
- `PLAN_PRICE_USD` keeps just `"auto-fill-monthly": 150`.
- Delete `startClarityReportCheckout` and `startFinanceDeskCheckout` (no callers found).

### 4. Tighten webhook allowlist

`supabase/functions/payments-webhook/index.ts` — change the eligible plans list to `["auto-fill-monthly", "auto_fill_monthly"]` (accepting both slug and lookup-key forms, matching the cron pattern).

### 5. Tighten cron eligibility

`supabase/functions/cron-run-reports/index.ts` — `ELIGIBLE_PRICES` becomes just `["auto-fill-monthly", "auto_fill_monthly"]`.

## Out of scope

- No changes to pricing copy, page layout, or advisory contact flow.
- No changes to Plaid, auth, or report generation.
- `.env` and `src/integrations/supabase/*` untouched.

## Verification

- `bun run build` passes after removing the legacy `PlanKey` union members.
- `rg` shows no remaining references to `finance-desk`, `clarity-report`, `finance_desk_monthly`, or `clarity_report_once` in `src/` or `supabase/`.
- Sandbox checkout of "Auto-fill my reports — $150/mo" resolves to a Stripe session at $150.00/month.
