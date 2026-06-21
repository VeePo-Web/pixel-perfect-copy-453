# Plan: Hook Stripe into GoldFin Desk

Use **Lovable's built-in Stripe payments** (seamless, no API key to paste). Test mode is live immediately so you can start collecting payments today; live mode unlocks after you claim/verify the Stripe account. Everything lands in this repo so you (and Claude Code) can keep iterating.

## 1. Eligibility check + enable
- Run `recommend_payment_provider` to confirm Stripe is the right fit for GoldFin (digital/services, US seller, full-compliance handling eligible).
- Enable via `enable_stripe_payments`. This provisions Stripe in test mode, injects the managed Stripe secret, and adds knowledge files for product/checkout/webhook patterns.
- Default tax handling: **full compliance handling (`managed_payments`)** — Stripe handles tax, fraud, disputes, transaction support for buyers in ~80 countries (+3.5%). Toggleable per session later.

## 2. Create the product catalog
Use `batch_create_product` to seed the three SKUs the funnel sells, each with a Stripe Tax code:

| Product | Price | Mode | Tax code |
|---|---|---|---|
| Auto-Fill Monthly (continuity) | $99 / month | subscription | `txcd_10103001` (SaaS) |
| Monthly Finance Desk | $1,500 / month | subscription | `txcd_20030000` (professional services) |
| One-off Clarity Report | $99 | one-time | `txcd_10103001` |

(Names/prices easy to change later — these match the funnel copy.)

## 3. Edge functions (live in the repo, editable in Claude Code)
Create under `supabase/functions/`:

- **`create-checkout/index.ts`** — already referenced by `src/lib/checkout.ts`. Accepts `{ plan: "auto-fill-monthly" | "finance-desk-monthly" | "clarity-report" }`, looks up the price ID from a typed map, creates a Stripe Checkout Session (subscription or payment mode), returns `{ url }`. CORS + Zod validation. Uses `managed_payments: { enabled: true }`.
- **`stripe-webhook/index.ts`** — verifies signature, handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`. Writes to a new `subscriptions` table (see §4) and fires the existing `send-email` function for receipts/dunning.
- **`customer-portal/index.ts`** — returns a Stripe Billing Portal URL for the signed-in customer so subscribers can manage card / cancel without contacting you.

All three: `verify_jwt = false` in `supabase/config.toml`, CORS headers, structured errors. No secrets hardcoded.

## 4. Database (one migration)
```text
public.subscriptions
  id uuid pk
  email text not null
  stripe_customer_id text unique
  stripe_subscription_id text unique
  plan text                  -- 'auto-fill-monthly' | 'finance-desk-monthly' | 'clarity-report'
  status text                -- 'active' | 'past_due' | 'canceled' | 'paid'
  current_period_end timestamptz
  created_at / updated_at
```
- GRANTs: `service_role` ALL; `authenticated` SELECT (own rows by email).
- RLS on; policy = `email = auth.jwt() ->> 'email'`.
- No anon access.

## 5. Frontend wiring (minimal, all existing components)
- `src/lib/checkout.ts` — extend `startAutoFillCheckout` and add `startFinanceDeskCheckout`, `startClarityReportCheckout`. Same try/catch fallback.
- Pricing CTAs (`PricingFinalCTA`, `MobileStickyCTA`, `AutoFillSpotlight`, `RecommendedPlanSpotlight`) — already call `startAutoFillCheckout`, no changes needed. The $1,500 Desk CTA on `/apply` stays as an application (not a direct checkout) per the funnel doc.
- Add `/billing` route → calls `customer-portal` and redirects. Linked from the post-checkout success page.
- Add `/checkout/success` and `/checkout/cancel` thin pages (success reads `session_id`, shows confirmation + "Manage billing" link).

## 6. Email hooks (uses existing Resend `send-email` function)
Webhook handlers fire transactional emails:
- `checkout.session.completed` → "Welcome to Auto-Fill" + how-to-upload-statements walkthrough
- `invoice.payment_failed` → dunning notice with portal link
- `customer.subscription.deleted` → cancellation confirmation

## 7. Repo hygiene for Claude Code parity
- Add `docs/payments.md` documenting: which function does what, env vars used (`STRIPE_SECRET_KEY` managed by Lovable, `STRIPE_WEBHOOK_SECRET`), how to test with Stripe CLI (`stripe listen --forward-to <fn-url>`), and the price-ID map location.
- Centralize price IDs in `supabase/functions/_shared/stripe-catalog.ts` (imported by `create-checkout` and `stripe-webhook`) so adding a SKU is one file.
- No `.env` edits — all secrets remain Lovable-managed and resolved at runtime.

## What you'll do (out of build scope)
- **Claim the Stripe account** from the Lovable dashboard when you're ready to switch from test → live.
- **Add the webhook endpoint** in Stripe Dashboard pointing to the deployed `stripe-webhook` URL, then paste the signing secret via the add-secret prompt I'll trigger.

## Technical notes
- Stripe SDK via `npm:stripe@17` in Deno edge functions.
- Webhook signature uses `stripe.webhooks.constructEventAsync` (Deno-compatible).
- Idempotency keys on subscription creation to survive retries.
- All amounts in cents in the catalog file; never reconstruct prices in the frontend.

Approve and I'll build it in this order: enable → catalog → DB migration → edge functions → frontend wiring → docs.