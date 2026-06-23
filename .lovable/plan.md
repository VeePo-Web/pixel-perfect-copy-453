# Plaid Sandbox E2E Verification Plan

Goal: prove the full Plaid sandbox loop works — link token → public token exchange → account sync → dashboard render → webhook-driven refresh — and capture evidence at each step.

## 1. Pre-flight checks
- Confirm secrets present: `PLAID_CLIENT_ID`, `PLAID_SANDBOX_SECRET`, `PLAID_WEBHOOK_SECRET` (already set).
- Verify edge functions deployed: `plaid-create-link-token`, `plaid-exchange-public-token`, `plaid-sync-accounts`, `plaid-remove-item`, `plaid-webhook`.
- Confirm `plaid-webhook` has `verify_jwt = false` in `supabase/config.toml`.
- Inspect `plaid_items` / `plaid_accounts` tables for RLS + service-role grants.

## 2. Auth bootstrap (Playwright)
- Launch headless Chromium against `http://localhost:8080/portal/signup`.
- Create a throwaway test user (random email + password), accept ToS + Plaid consent, complete MFA setup using `otpauth` to generate the TOTP code in-script.
- Screenshot each step; persist session in localStorage for reuse.

## 3. Link token + public token exchange
- From `/portal/accounts`, click "Connect a bank" → assert `plaid-create-link-token` returns a `link_token` (network log).
- Drive Plaid Link iframe with sandbox credentials `user_good` / `pass_good`, select Chase, complete the flow.
- Assert `plaid-exchange-public-token` 200s and inserts a row into `plaid_items` (verify via `supabase--read_query`).
- Assert `plaid-sync-accounts` runs and populates `plaid_accounts` with masked balances.

## 4. Dashboard render
- Navigate to `/portal/dashboard` and `/portal/accounts`.
- Screenshot. Assert each account card shows institution, mask, balance, currency, and a re-auth/disconnect control.

## 5. Webhook-driven sync
- POST a synthetic Plaid webhook to `/functions/v1/plaid-webhook` for the new `item_id` with `webhook_type=TRANSACTIONS`, `webhook_code=SYNC_UPDATES_AVAILABLE`, signed with `PLAID_WEBHOOK_SECRET` (JWT in `Plaid-Verification` header — use the documented sandbox verification shortcut).
- Also send `ITEM: ERROR` (`ITEM_LOGIN_REQUIRED`) and assert `plaid_items.status` flips to `login_required`.
- Re-fetch `/portal/accounts`; assert the affected card now shows "Reconnect required".
- Send `HOLDINGS`/`DEFAULT_UPDATE` and assert `last_synced_at` advances and balances refresh.

## 6. Disconnect path
- Click "Disconnect" on the account card → assert `plaid-remove-item` 200s, row removed from `plaid_items`, cascade clears `plaid_accounts`, dashboard empty state returns.

## 7. Evidence + report
- Save all Playwright screenshots under `/tmp/browser/plaid-e2e/screenshots/`.
- Capture edge function logs for each function via `supabase--edge_function_logs`.
- Produce a short pass/fail table per step; on failure, attach the failing log + screenshot and stop.

## Out of scope
- Live (non-sandbox) Plaid keys.
- Transactions ledger UI.
- Load / concurrency testing.

## Risks
- Plaid Link iframe selectors can shift; fallback is the Plaid `sandbox/public_token/create` API to skip the UI and feed the token straight to `plaid-exchange-public-token`. Recommended primary path for determinism — use the UI run only as a secondary smoke test if time permits.
- Webhook signature verification: if `Plaid-Verification` JWT signing isn't fully implemented server-side, the test will instead post with the shared `PLAID_WEBHOOK_SECRET` header the function expects, and we'll note any gap.
