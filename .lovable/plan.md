# Plan: Production Plaid environment path

Goal: same code runs against Plaid Production once `PLAID_ENV=production` and a production secret are set, with no sandbox-only escape hatches reachable in prod.

## 1. Secrets
Add (via `add_secret`, you paste the values):
- `PLAID_PRODUCTION_SECRET` — your prod Plaid secret from the dashboard.
- `PLAID_REDIRECT_URI` — full URL of the OAuth return page, e.g. `https://app.goldfindesk.com/portal/accounts` (must be registered verbatim in Plaid dashboard → API → Allowed redirect URIs).
- (already present) `PLAID_CLIENT_ID`, `PLAID_WEBHOOK_SECRET`, `PLAID_SANDBOX_SECRET`.

`PLAID_ENV` stays `sandbox` until you flip it to `production` in the dashboard. One env var is the only switch.

## 2. `supabase/functions/_shared/plaid.ts`
- Pick secret by env: `production` → `PLAID_PRODUCTION_SECRET`, else `PLAID_SANDBOX_SECRET`. Throw a clear error if the required one is missing.
- Drop the retired `development` host entry; keep `sandbox` + `production`.
- Export a small `isProduction()` helper.

## 3. `plaid-create-link-token`
- Always include `webhook: <SUPABASE_URL>/functions/v1/plaid-webhook`.
- Include `redirect_uri: PLAID_REDIRECT_URI` when set (required for OAuth banks in production; harmless in sandbox).
- No behavior change to update-mode.

## 4. OAuth return handling (client)
- `PlaidLinkButton`: on mount, detect `?oauth_state_id=` in the URL and pass `receivedRedirectUri: window.location.href` plus the **previously stored** `link_token` into `usePlaidLink` so the OAuth handoff resumes. Persist the link token in `sessionStorage` keyed by mode/itemId before `open()`, read it back on return, then clear it.
- Route `/portal/accounts` already exists and is auth-gated — that's the redirect target. No new route needed.

## 5. Lock down sandbox-only endpoints in production
- `plaid-sandbox-public-token` and `plaid-sandbox-fire-webhook`: keep the existing `PLAID_ENV !== "sandbox"` 403 guard (already there) and add a one-line log so accidental prod calls are visible. No deletion — useful for sandbox regression tests.

## 6. Webhook hardening for production
- Keep current shared-secret header check (`PLAID_WEBHOOK_SECRET`) as the default.
- Add Plaid JWT verification path: when header `plaid-verification` is present, verify it against Plaid's JWKS (`/webhook_verification_key/get`) with a small in-memory key cache and 5-minute `iat` skew check. If verification fails → 401. If the header is absent, fall back to the shared-secret check (so sandbox tooling keeps working).
- Document that in production you should register the function URL in the Plaid dashboard so Plaid signs requests; the shared-secret header is the belt-and-suspenders for internal callers.

## 7. Docs
- Update `docs/plaid-sandbox-setup.md` with a "Going to production" section: request prod access in Plaid dashboard, paste `PLAID_PRODUCTION_SECRET`, register `PLAID_REDIRECT_URI`, set webhook URL, flip `PLAID_ENV=production`, run the §4 sanity test against production with one real institution, then enable for users.

## 8. Verification
- Sandbox regression: re-run the existing E2E (link-token → exchange → accounts render) with `PLAID_ENV=sandbox` to prove no regression.
- Production smoke (after you flip the env): mint a link token via curl as a real user, confirm response shape; do not exchange unless you intend a real connection.

## Out of scope
- Migrating existing sandbox `plaid_items` to production (different access tokens; users must reconnect).
- Item-level rotation of access tokens.
- Statements/Liabilities products — Transactions only, as today.

## Files touched
- `supabase/functions/_shared/plaid.ts`
- `supabase/functions/plaid-create-link-token/index.ts`
- `supabase/functions/plaid-webhook/index.ts`
- `src/components/portal/PlaidLinkButton.tsx`
- `docs/plaid-sandbox-setup.md`
