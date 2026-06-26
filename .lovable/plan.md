# Plan: Production Plaid environment path (secrets already set)

Code changes are already in place from the previous build turn. No further secret prompts — you confirmed `PLAID_PRODUCTION_SECRET` and `PLAID_REDIRECT_URI` are set.

## What's already shipped
1. **`supabase/functions/_shared/plaid.ts`** — picks `PLAID_PRODUCTION_SECRET` when `PLAID_ENV=production`, else `PLAID_SANDBOX_SECRET`. Clear error if the right one is missing. Dropped retired `development` host. Exported `isProduction()`.
2. **`plaid-create-link-token`** — includes `redirect_uri: PLAID_REDIRECT_URI` when set (required for OAuth banks in prod, harmless in sandbox).
3. **`PlaidLinkButton.tsx`** — persists link token in `sessionStorage` before `open()`, detects `?oauth_state_id=` on return, passes `receivedRedirectUri`, auto-resumes Link, cleans storage on success/exit.
4. **`plaid-webhook`** — verifies Plaid's `plaid-verification` JWT (ES256) against `/webhook_verification_key/get` with in-memory key cache + ±5min `iat` skew + sha256 body hash. Falls back to `PLAID_WEBHOOK_SECRET` header when no JWT is present (sandbox/internal tooling). Production with neither → 401.
5. **Sandbox-only functions** (`plaid-sandbox-public-token`, `plaid-sandbox-fire-webhook`) — already guarded by `PLAID_ENV !== "sandbox"`, now also log a warning on rejected calls.
6. **`docs/plaid-sandbox-setup.md`** — added §7 "Going to production" runbook.

## Remaining steps (yours, in the Plaid dashboard)
- Register `PLAID_REDIRECT_URI` verbatim under API → Allowed redirect URIs.
- Register webhook URL `https://paarucbnaxorpxqjecrz.functions.supabase.co/plaid-webhook` under API → Webhooks.
- When Plaid grants Production access, flip `PLAID_ENV=production` in edge function secrets. No redeploy needed.

## Verification I'll run on approval
- Sandbox regression with the existing E2E (link-token → exchange → accounts render) to confirm nothing broke under `PLAID_ENV=sandbox`.
- Report back with status.

## Out of scope
- Migrating existing sandbox `plaid_items` to production (different access tokens; users reconnect).
- Statements/Liabilities products — Transactions only, as today.
