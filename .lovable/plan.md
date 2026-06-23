# Plaid Sandbox E2E Verification Plan

All `/portal/*` pages and Plaid edge functions already exist on disk. This plan **verifies** the full flow end-to-end — no code changes unless a real defect surfaces.

## What gets verified

1. Marketing route still loads; `/portal/login` and `/portal/signup` render the AuthShell.
2. New user can sign up, confirm (auto-confirm in sandbox), and sign in.
3. MFA enrollment: `mfa-enroll` returns otpauth + 8 backup codes; TOTP verifies via `mfa-verify`; `mfa_status` flips to enabled.
4. Terms acceptance writes `tos_acceptances` row at the current `TOS_VERSION`.
5. Dashboard renders; `plaid-create-link-token` returns a `link_token`.
6. Plaid Link sandbox flow: open Link, pick "First Platypus Bank", credentials `user_good` / `pass_good`, complete handoff, receive `public_token`.
7. `plaid-exchange-public-token` swaps it, inserts `plaid_items` row, and `syncAccountsForItem()` populates `plaid_accounts`.
8. Dashboard / Accounts page shows the freshly synced accounts with balances.
9. `plaid-webhook` driven by a simulated `TRANSACTIONS / DEFAULT_UPDATE` (with `x-plaid-webhook-secret`) re-runs sync; `last_synced_at` advances.
10. `ITEM / ITEM_LOGIN_REQUIRED` webhook marks the item `reauth_required`.
11. `plaid-remove-item` calls `/item/remove`; row + cascaded accounts disappear; UI reflects it.

## How (technical)

- **Preflight (read-only):**
  - `supabase--read_query` on `plaid_items`, `plaid_accounts`, `mfa_factors`, `tos_acceptances` to confirm schemas.
  - `supabase--curl_edge_functions` unauthenticated smoke: `plaid-create-link-token` → expect 401; `plaid-webhook` with bad secret → expect 401.
  - Confirm `supabase/config.toml` has `verify_jwt = false` for `plaid-webhook` only.
- **Browser drive (Playwright via shell):**
  - Launch Chromium against `http://localhost:8080`, viewport 1280×1800, headless.
  - Scripts under `/tmp/browser/plaid-e2e/`, screenshots per step.
  - Sign up a fresh `e2e+<ts>@example.com` user, then sign in.
  - Enroll MFA: read otpauth secret from the page, generate the TOTP in Python with `pyotp`, submit. Save backup codes from DOM.
  - Accept Terms.
  - Click "Connect bank" → wait for Plaid Link iframe → drive sandbox flow → confirm redirect back to `/portal/accounts`.
  - Read DOM for account names/balances; cross-check with `supabase--read_query` on `plaid_accounts`.
- **Webhook simulation:** `supabase--curl_edge_functions` to `plaid-webhook` with the real `PLAID_WEBHOOK_SECRET` header and a synthetic `{webhook_type, webhook_code, item_id}` body for each branch; re-query `plaid_items.last_synced_at` and `status`.
- **Teardown:** click "Disconnect" in UI, confirm row removal via SQL.
- **Logs:** `supabase--edge_function_logs` after each step for `plaid-create-link-token`, `plaid-exchange-public-token`, `plaid-sync-accounts`, `plaid-webhook`, `mfa-enroll`, `mfa-verify`.

## Defect handling

If a step fails, I'll stop, surface the error + screenshot + relevant log, and propose a minimal fix as a new plan rather than patching mid-run.

## Out of scope

- Stripe / payments
- Production Plaid environment
- Transactions sync beyond the accounts-level upsert that `syncAccountsForItem()` performs
- Visual / design changes

## Deliverable

A summary report with: pass/fail per numbered step, screenshots from key states (login, MFA, Link handoff, populated dashboard, post-disconnect empty state), and any SQL evidence.
