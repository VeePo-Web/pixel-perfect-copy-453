# End-to-end smoke test plan

Goal: prove the full user journey works today, before you touch Stripe go-live.

## What I'll run (Playwright + Supabase tooling, no code changes)

1. **Auth + ToS gate**
   - Sign up a fresh test user via email/password on `/portal/login`.
   - Confirm redirect into `/portal/accept-terms`, submit acceptance, verify a row lands in `tos_acceptances` and `ProtectedRoute` releases into `/portal/dashboard`.

2. **Plaid Link (sandbox)**
   - From the dashboard, launch Plaid Link and complete the sandbox `user_good / pass_good` flow against "First Platypus Bank".
   - Verify: `plaid-create-link-token` → `plaid-exchange-public-token` succeed, `plaid_items` row exists with **no plaintext `access_token`** and a populated `access_token_encrypted`, `plaid_accounts` rows appear.

3. **Transaction sync + spreadsheet auto-fill**
   - Trigger `plaid-sync-transactions` (curl the edge function as the logged-in user).
   - Confirm `plaid_transactions` populates, `recurring_streams` detects at least one stream, and the Report page (`/portal/report`) renders the auto-filled monthly template with real numbers instead of placeholders.

4. **Webhook hardening check**
   - Hit `plaid-webhook` in production mode without a JWT → expect 401.
   - Hit it with a valid Plaid JWT → expect 200 and a `webhook_events` row.
   - Hit `plaid-sandbox-fire-webhook` — expect 200 in preview, would-be 403 in prod.

5. **Stripe sandbox checkout ($150/mo)**
   - Click "Auto-fill my reports — $150/mo" on `/pricing`, complete Embedded Checkout with `4242 4242 4242 4242`.
   - Verify `subscriptions` row for the test user with `status=active`, `environment=sandbox`, `price_id=goldfin_reports_monthly` (or equivalent lookup key), and that `payments-webhook` logged the `customer.subscription.created` event.

6. **Report gating**
   - Confirm the paid report surfaces only after the subscription row is `active` (RLS + `has_active_subscription` check).

## Deliverable

A pass/fail table for the six steps above, with:
- Screenshots at each checkpoint (`/tmp/browser/smoke/`)
- The relevant `webhook_events`, `plaid_items`, `plaid_transactions`, `subscriptions` row snapshots
- Any yellow/red findings that surface, with a proposed fix

## Not in scope for this run

- Flipping Stripe to **live**. That's the separate 5-step go-live flow (claim sandbox → Stripe onboarding → install Lovable app on live account → auto key provisioning → readiness check). I'll walk you through it as a follow-up once this smoke passes.
- Google OAuth path (email/password is enough to prove the ToS + Plaid + Stripe chain).

Approve and I'll execute the smoke test and report back.
