# Re-implement Plaid Sandbox Edge Functions

Restore the five Plaid edge functions under `supabase/functions/` so the sandbox flow works against existing tables `plaid_items` and `plaid_accounts`. Frontend portal pages are out of scope here.

## Files to create

1. `supabase/functions/_shared/plaid.ts` — small Plaid REST client (sandbox by default), reads `PLAID_CLIENT_ID`, `PLAID_SANDBOX_SECRET`, `PLAID_ENV` (default `sandbox`). Helpers: `plaid(path, body)`, plus `getServiceClient()` and `getUserClient(authHeader)` factories using `npm:@supabase/supabase-js@2`.
2. `supabase/functions/plaid-create-link-token/index.ts` — POST. Auth required (`getClaims`). Calls `/link/token/create` with `client_user_id = auth.uid()`, products `["transactions"]`, country `["US"]`, language `en`, webhook URL = `${SUPABASE_URL}/functions/v1/plaid-webhook`. Returns `{ link_token, expiration }`.
3. `supabase/functions/plaid-exchange-public-token/index.ts` — POST `{ public_token, institution?: { institution_id, name } }`. Auth required. Calls `/item/public_token/exchange`, then `/item/get` to capture `item_id`. Inserts into `plaid_items` (service role) with `status='active'`, then immediately invokes the sync logic for that item (shared helper) and returns `{ item_id, accounts }`.
4. `supabase/functions/plaid-sync-accounts/index.ts` — POST `{ plaid_item_id? }`. Auth required. If `plaid_item_id` omitted, syncs all of the user's items. For each: `/accounts/get`, upsert `plaid_accounts` on `(plaid_item_id, account_id)`, update `last_synced_at`. Returns counts.
5. `supabase/functions/plaid-remove-item/index.ts` — POST `{ plaid_item_id }`. Auth required + ownership check. Calls `/item/remove`, deletes `plaid_items` row (cascade clears `plaid_accounts`).
6. `supabase/functions/plaid-webhook/index.ts` — POST, **no JWT** (set `verify_jwt = false` in `supabase/config.toml`). Validates a shared-secret header `x-plaid-webhook-secret` against `PLAID_WEBHOOK_SECRET` (Plaid's JWT verification not implemented in sandbox path — documented in code comment). Branches on `webhook_type`/`webhook_code`:
   - `ITEM` + `ERROR` with `ITEM_LOGIN_REQUIRED` → set `status='login_required'`.
   - `ITEM` + `PENDING_EXPIRATION` → set `status='pending_expiration'`.
   - `TRANSACTIONS` / `HOLDINGS` `*_UPDATE` / `DEFAULT_UPDATE` → call shared sync helper.
   Looks up the owning user via `plaid_items.plaid_item_id`.

## Shared bits

- Reusable `syncAccountsForItem(serviceClient, item)` function imported by `plaid-exchange-public-token`, `plaid-sync-accounts`, and `plaid-webhook`. Lives in `_shared/plaid.ts`.
- All functions: CORS via `npm:@supabase/supabase-js@2/cors`, OPTIONS preflight, Zod validation of inputs, structured `{ ok, error }` JSON responses, full error logging.

## Config changes

- `supabase/config.toml` — add `[functions.plaid-webhook]` block with `verify_jwt = false`. Leave the other four with default JWT verification (we validate via `getClaims` in code as required).

## Verification (after the build)

- `supabase--deploy_edge_functions` for all five.
- `supabase--curl_edge_functions` smoke test:
  - `plaid-create-link-token` returns a `link_token` (uses preview session).
  - Use Plaid sandbox `/sandbox/public_token/create` (via a one-shot script) to get a public token → call `plaid-exchange-public-token` → assert row in `plaid_items` + accounts in `plaid_accounts` (via `supabase--read_query`).
  - Call `plaid-sync-accounts` again → `last_synced_at` advances.
  - POST to `plaid-webhook` with `ITEM_LOGIN_REQUIRED` → `plaid_items.status` flips.
  - Call `plaid-remove-item` → rows gone.
- Capture logs with `supabase--edge_function_logs` if anything fails.

## Out of scope

- Frontend portal pages, AuthContext, ProtectedRoute, PlaidLinkButton (separate task).
- MFA edge functions.
- Production Plaid signature (JWT) verification — sandbox uses shared-secret header; noted in code.
- Transactions sync (only accounts/balances).
