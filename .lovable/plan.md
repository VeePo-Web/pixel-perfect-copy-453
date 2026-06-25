## Goal
Prove the Plaid sandbox connect flow works end-to-end in the live preview: sign in → mint link token → complete Plaid Link → exchange public token → see the account render in `/portal/accounts` and rows in `plaid_items` + `plaid_accounts`.

## Steps

1. **Preflight (read-only checks)**
   - `supabase--read_query` to confirm a usable preview user exists (or note we need one created).
   - `supabase--curl_edge_functions` against `plaid-create-link-token` using the preview session to confirm a `linkToken` is returned.

2. **Sign in via Playwright**
   - Launch headless Chromium against `http://localhost:8080`.
   - Restore the managed Supabase session from `LOVABLE_BROWSER_SUPABASE_*` env vars (per browser-use rules) so we land authenticated.
   - If `LOVABLE_BROWSER_AUTH_STATUS=signed_out`, stop and ask the user to sign in once in the preview so the session injects on the next turn.
   - Satisfy the OTP gate by writing `gf_otp_verified_at` into `localStorage` (the gate this app uses), then navigate to `/portal/accounts`.

3. **Drive Plaid Link (primary path)**
   - Click "Connect a bank" → wait for Plaid Link iframe → select "First Platypus Bank" → credentials `user_good` / `pass_good` → MFA `1234` if prompted → continue → submit.
   - Screenshot each step into `/tmp/browser/plaid-e2e/screenshots/`.
   - Assert the new institution card renders in the Accounts list.

4. **Fallback if the Plaid iframe is flaky in headless Chromium**
   - Call `plaid-sandbox-public-token` edge function to mint a sandbox public token server-side.
   - POST it to `plaid-exchange-public-token` with the preview session.
   - Reload `/portal/accounts` and assert the card appears. This proves exchange + sync + render without depending on the modal.

5. **Verify persistence**
   - `supabase--read_query` on `plaid_items` and `plaid_accounts` filtered to the test user — confirm an item row exists with `status=active` and at least one account row.

6. **Report**
   - Final status: link-token OK, modal (or fallback) OK, exchange OK, DB rows present, UI updated, with screenshot paths. Any failure gets one targeted fix and a re-run.

## Out of scope
- Transactions sync UI, production Plaid env, update-mode reauth flow.
- No code changes unless a failure in step 3/4 requires a targeted fix.
