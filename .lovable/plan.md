
## Context

The Plaid Link flow is already wired:

- `src/components/portal/PlaidLinkButton.tsx` mints a link token via `plaid-create-link-token`, opens Plaid Link via `react-plaid-link`, and posts the public token to `plaid-exchange-public-token`.
- `plaid-create-link-token` builds a `/link/token/create` request (create or update mode), with the webhook URL pointing at `plaid-webhook`.
- `plaid-exchange-public-token` swaps the public token for an access token, inserts a `plaid_items` row, then calls `syncAccountsForItem` to populate `plaid_accounts`.
- `src/pages/portal/Accounts.tsx` already renders `<PlaidLinkButton onConnected={load} />` in both the header and the empty state, and reloads on success.

So the feature exists. What's missing for a clean E2E is verification, a couple of UX gaps, and a sandbox-only helper to drive the flow without clicking through Plaid's modal.

## Plan

1. **Harden `PlaidLinkButton`**
   - Add `onExit` to `usePlaidLink` so user-cancelled or errored sessions surface a message instead of silently doing nothing.
   - Re-mint the link token after a successful exchange or exit so the same button can be reused without a page reload.
   - Show a clear success state (brief "Connected" label) before `onConnected` callback fires.

2. **Confirm edge-function wiring**
   - Verify `PLAID_CLIENT_ID` and `PLAID_SANDBOX_SECRET` secrets are present (they are).
   - Confirm `plaid-create-link-token` and `plaid-exchange-public-token` are deployed; redeploy if needed.
   - Smoke-test `plaid-create-link-token` via `supabase--curl_edge_functions` with the preview session to confirm a `linkToken` comes back.

3. **Sandbox E2E verification (Playwright)**
   - Script: sign in as the preview user → navigate to `/portal/accounts` → click "Connect a bank" → in Plaid Link sandbox iframe pick "First Platypus Bank" → credentials `user_good` / `pass_good` → continue through account select → confirm.
   - Assert a new card appears in the Accounts list with at least one account row, and that `plaid_items` + `plaid_accounts` got rows for the user (via `supabase--read_query`).
   - Capture screenshots at each step into `/tmp/browser/plaid-e2e/screenshots/`.

4. **Fallback: programmatic sandbox path**
   - If the Plaid Link iframe is flaky in headless Chromium (common), use the already-existing `plaid-sandbox-public-token` edge function to mint a sandbox public token server-side and POST it to `plaid-exchange-public-token`, then reload `/portal/accounts` and assert the UI updates. This proves the exchange + sync + render path without depending on the modal.

5. **Report**
   - Summarize: token mint OK, modal completed (or sandbox fallback used), exchange OK, rows in DB, UI shows the institution. Any failures get a targeted fix and a re-run.

## Out of scope

- Transactions sync UI (separate `plaid-sync-transactions` function already exists).
- Production Plaid environment (`PLAID_ENV` stays `sandbox`).
- Reauth/update-mode flow beyond confirming the create path; update-mode is already wired and covered by the `ITEM_LOGIN_REQUIRED` work.
