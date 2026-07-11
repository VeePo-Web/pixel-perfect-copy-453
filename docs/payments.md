# Payments — GoldFin Desk

Lovable's built-in Stripe integration. Test mode works out of the box; live unlocks after you claim the Stripe account.

## Products (price IDs are stable across test and live)

| Plan key (frontend)      | Stripe price ID         | Amount         |
|--------------------------|-------------------------|----------------|
| `auto-fill-monthly`      | `auto_fill_monthly`     | $150 / month   |
| `finance-desk-monthly`   | `finance_desk_monthly`  | $1,500 / month |
| `clarity-report`         | `clarity_report_once`   | $99 one-time   |

Add new SKUs by:

1. Calling `batch_create_product` (or via the Lovable Payments dashboard).
2. Adding the mapping to `supabase/functions/_shared/stripe-catalog.ts`.
3. Adding the key to `PlanKey` in `src/lib/checkout.ts`.

## Code map

| File | Purpose |
|---|---|
| `src/lib/checkout.ts` | `openCheckout(plan)`, plan keys, edge function call. All CTAs route through here. |
| `src/lib/stripe.ts` | Stripe.js loader. Derives env from `VITE_PAYMENTS_CLIENT_TOKEN` prefix. |
| `src/components/payments/CheckoutOverlay.tsx` | Global modal that mounts `<EmbeddedCheckout/>`. |
| `src/components/payments/CheckoutReturnPage.tsx` | `/checkout/return` — confirmation page after payment. |
| `src/components/payments/BillingPage.tsx` | `/billing` — buyers enter email → Stripe portal. |
| `src/components/payments/PaymentTestModeBanner.tsx` | Top-of-page banner in test mode. |
| `supabase/functions/_shared/stripe.ts` | Gateway-routed Stripe client + webhook verifier. |
| `supabase/functions/_shared/stripe-catalog.ts` | Plan key → Stripe lookup key. |
| `supabase/functions/create-checkout/index.ts` | Creates embedded checkout session, returns `clientSecret`. |
| `supabase/functions/payments-webhook/index.ts` | Handles `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`. |
| `supabase/functions/create-portal-session/index.ts` | Issues a Stripe Billing Portal URL. |

## Database

`public.subscriptions` — one row per Stripe subscription or one-off purchase. Columns: `email`, `stripe_customer_id`, `stripe_subscription_id`, `price_id`, `status`, `current_period_end`, `cancel_at_period_end`, `environment` (`sandbox` | `live`). RLS allows `authenticated` users to read only rows that match their auth email; the service role does all writes from the webhook.

## Environment

- `VITE_PAYMENTS_CLIENT_TOKEN` — public Stripe publishable key. Lovable writes the sandbox token to `.env.development` and the live token to `.env.production` after go-live. Never paste manually.
- `STRIPE_SANDBOX_API_KEY`, `STRIPE_LIVE_API_KEY` — connector-gateway connection IDs. Server-only.
- `PAYMENTS_SANDBOX_WEBHOOK_SECRET`, `PAYMENTS_LIVE_WEBHOOK_SECRET` — webhook signing secrets. Lovable-managed.
- `LOVABLE_API_KEY` — needed by the gateway proxy. Auto-provisioned.

## Webhooks

Already registered by Lovable on enable. Test endpoint:

```
https://paarucbnaxorpxqjecrz.supabase.co/functions/v1/payments-webhook?env=sandbox
```

Live endpoint is created automatically after go-live.

Subscribed events (do not edit in the Stripe dashboard):
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `checkout.session.completed`
- `invoice.payment_failed`

## Test cards

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3DS required: `4000 0025 0000 3155`

Any future expiry, any 3-digit CVC, any ZIP.

## Go live

When ready: open the Payments dashboard in Lovable and complete the five-step go-live flow (claim → verify → install app → keys auto-provision → readiness check). Live webhooks and live keys are wired automatically — no code changes.

## Working in Claude Code

Everything lives in this repo. To extend:

- Add a new SKU → `stripe-catalog.ts` + `PlanKey` (above).
- Trigger checkout from any CTA → `openCheckout("plan-key")`.
- Add a webhook handler → branch in `payments-webhook/index.ts`.
- Change return UX → `CheckoutReturnPage.tsx`.
- Local Stripe CLI for webhook testing: `stripe listen --forward-to https://paarucbnaxorpxqjecrz.supabase.co/functions/v1/payments-webhook?env=sandbox`.
