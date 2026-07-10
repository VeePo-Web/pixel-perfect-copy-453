# Heavy stress + security audit plan

Two tracks. Track A runs without you touching anything. Track B needs you signed into the preview first — say the word once and I'll do it in one pass.

## Track A — unauthenticated, I run it now

### A1. Static security scan
- `security--run_security_scan` across the whole project → flag any yellow/red.
- Supabase linter pass (`supabase--linter`).

### A2. RLS + GRANTs audit (read-only SQL)
For every public table in your app (`profiles`, `user_roles`, `plaid_items`, `plaid_accounts`, `plaid_transactions`, `recurring_streams`, `subscriptions`, `advisory_reports`, `applications`, `leads`, `business_profiles`, `business_metric_inputs`, `ledger_entries`, `tos_acceptances`, `email_preferences`, `email_suppressions`, `login_otps`, `webhook_events`, `cron_runs`, `report_email_deliveries`, `retention_policy_reviews`, `transaction_corrections`, `plaid_items`):
- confirm RLS enabled
- list policies (owner-scoped vs public)
- list role grants (no stray `anon SELECT` on user data)
- confirm no residual plaintext `access_token` column on `plaid_items`; only `access_token_encrypted` (bytea) plus SECURITY DEFINER RPCs `plaid_get_access_token`/`plaid_set_access_token` limited to `service_role`.

### A3. Anon-key probe (simulates attacker with your published anon key)
- Attempt `SELECT` on each sensitive table with the anon JWT → must return 0 rows / 401 / 403.
- Attempt `INSERT` on `tos_acceptances`, `subscriptions`, `plaid_items` as anon → must fail.
- Attempt `UPDATE plaid_items` bumping `access_token_encrypted` as anon → must fail.

### A4. Edge function boundary tests (no user session needed)
- `plaid-webhook`: no auth → 401 ✅ (already confirmed), wrong shared secret → 401 ✅, missing body → 400, malformed JWT → 401, JWT with mismatched `request_body_sha256` → 401.
- `plaid-sandbox-fire-webhook`: with a forged bearer → 401; unauth → 401; would-403 in production.
- `plaid-sandbox-public-token`: same gating.
- `payments-webhook`: no signature → 400; wrong signature → 400; missing `?env=` → 200 with `ignored:"invalid env"`.
- `create-checkout`: called without server-known priceId → 400; called with SQL-injection-shaped priceId → 400.
- `create-portal-session`: no bearer → 401.
- `account-delete-request`, `send-template-email`: unauth behavior review.
- CORS preflight sanity check on every function.

### A5. Cron + retention sweep sanity
- Confirm `run_retention_sweep()` still callable (SECURITY DEFINER).
- Read last 30 rows of `cron_runs` and `webhook_events` — look for repeated failures.

### A6. Code review, secure-by-design
- Grep every `.select("access_token")` / `.eq("access_token"...)` in `src/` and `supabase/functions/` — must be zero.
- Confirm all Plaid access-token reads go through `getAccessToken()` RPC.
- Confirm all sandbox-only fns use `isProduction()===false && plaidEnv()==="sandbox"` (both).
- Confirm no `SUPABASE_SERVICE_ROLE_KEY` reachable from client code.
- Confirm no Stripe secret keys embedded — everything routes through `_shared/stripe.ts` gateway.

### A7. Stress inputs
- Send oversized bodies (1 MB JSON) to `plaid-webhook`, `payments-webhook`, `plaid-sandbox-fire-webhook` → expect graceful 4xx, not 5xx.
- Send 20 rapid webhooks in parallel → confirm no duplicate `webhook_events` rows (idempotency by `event_id`).
- Send malformed UTF-8 / control chars → expect 400.

### Deliverable for Track A
A single audit report with a **pass / warn / fail** per check, the offending query or curl for each fail, and a recommended fix. Findings that are agent-fixable get shipped in the same build-mode turn after you approve.

## Track B — needs your signed-in preview session

Currently `LOVABLE_BROWSER_AUTH_STATUS=signed_out`, so Playwright can't drive authenticated flows. As soon as you sign in once on `/portal/login`, I run:

- **B1. Auth + ToS gate**: signup → forced `/portal/accept-terms` → row lands in `tos_acceptances` → dashboard unlocks.
- **B2. Plaid sandbox Link**: `user_good / pass_good` on First Platypus Bank → `plaid_items` row with encrypted token, `plaid_accounts` rows populated.
- **B3. Transaction sync**: trigger `plaid-sync-transactions` → confirm `plaid_transactions` rows, `recurring_streams` detection, and the `/portal/report` page auto-filling the monthly template with real numbers (not placeholders).
- **B4. Multi-account edge cases**: connect a second sandbox item, delete one, confirm re-auth flag path.
- **B5. Stripe sandbox checkout**: `4242 4242 4242 4242` on `/pricing` $150/mo → `subscriptions` row `status=active, environment=sandbox` → `payments-webhook` logs `customer.subscription.created`.
- **B6. Report gating**: verify report is inaccessible before active sub, unlocks after webhook fires, re-locks on cancel.
- **B7. Portal flow**: `create-portal-session` opens Stripe hosted portal in new tab.
- **B8. Account deletion**: `account-delete-request` end-to-end, confirm Plaid `item/remove` fires and encrypted tokens are wiped.

Each step gets a screenshot in `/tmp/browser/stress/` and a DB row snapshot.

## Not in scope

- Flipping Stripe to **live**. That's a separate 5-step user-driven go-live flow — I'll walk you through it after this stress test is green.
- Load testing beyond ~50 requests (I'm not going to burn real Plaid/Stripe rate limits on the sandbox).

Approve and I'll run Track A immediately; Track B unlocks the moment you sign in on the preview.
