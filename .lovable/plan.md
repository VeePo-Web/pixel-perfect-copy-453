## Goal

Close the three yellow findings from the Plaid audit so the end-to-end Plaid journey is defense-in-depth secure for every user.

## 1. JWT-only webhook in production

**File:** `supabase/functions/plaid-webhook/index.ts`

Today: if `plaid-verification` (Plaid's signed JWT) is missing, the handler falls back to an `x-plaid-webhook-secret` shared-secret header in every environment. Plaid does not use that fallback — only our sandbox test tool does.

Change: gate the shared-secret fallback on `isProduction() === false`. In production, missing/invalid JWT ⇒ 401, no exceptions. Result: production webhook accepts exactly one authentication mode (Plaid's signed JWT). Sandbox behavior unchanged.

## 2. Sandbox function gating (belt-and-suspenders)

**Files:** `supabase/functions/plaid-sandbox-fire-webhook/index.ts`, `supabase/functions/plaid-sandbox-public-token/index.ts`

Today: both reject when `PLAID_ENV !== "sandbox"`. If `PLAID_ENV` is ever unset or misconfigured in production, they'd default to sandbox and pass the guard.

Change: switch both to the positive assertion `if (isProduction()) return 403` AND require `plaidEnv() === "sandbox"` (both conditions). Import from `_shared/plaid.ts` so the definition is single-sourced. Also add an explicit console.error breadcrumb naming the env, and a top-of-file comment marking these as sandbox-only tooling.

## 3. Access token: no plaintext at rest, service-role-only read path

**Migration (new):** `pgcrypto`-backed encryption, keyed by a Vault secret.

Structure:

1. `CREATE EXTENSION IF NOT EXISTS pgcrypto`.
2. Store the encryption key in Vault (via `upsert_cron_secret`-style helper: `plaid_token_key`). If Vault entry is missing, migration generates a 32-byte random key and stores it.
3. Add `plaid_items.access_token_encrypted bytea`.
4. Backfill: `UPDATE plaid_items SET access_token_encrypted = pgp_sym_encrypt(access_token, <key>)` inside a `SECURITY DEFINER` function that reads the key from Vault.
5. Two helper functions, both `SECURITY DEFINER`, `SET search_path = public`, granted **EXECUTE to `service_role` only** (revoked from PUBLIC / anon / authenticated):
   - `plaid_get_access_token(_item_id uuid) returns text` — decrypts and returns.
   - `plaid_set_access_token(_item_id uuid, _token text) returns void` — encrypts and stores.
6. Once backfill verified, `ALTER TABLE plaid_items DROP COLUMN access_token`.
7. Explicit `REVOKE ALL ON public.plaid_items FROM PUBLIC, anon, authenticated;` (defense-in-depth — RLS SELECT policy stays; no client GRANTs exist today, this makes that intentional and permanent).

**Edge function updates:** every function that reads or writes `access_token` switches to the RPC:

- `plaid-exchange-public-token/index.ts` — on insert, call `plaid_set_access_token` after row create (or wrap as one call).
- `plaid-webhook/index.ts` — replace `.select("id, user_id, access_token")` with `.select("id, user_id")` + `admin.rpc("plaid_get_access_token", { _item_id: item.id })`.
- `plaid-sync-transactions/index.ts`, `plaid-sync-accounts/index.ts`, `plaid-remove-item/index.ts`, `plaid-create-link-token/index.ts`, `account-delete-request/index.ts` — same pattern.
- `_shared/plaid.ts` — add a small `getAccessToken(admin, itemLocalId)` helper so callers don't repeat the RPC boilerplate.

Ownership checks (`item.user_id === user.id`) stay exactly where they are — this change is transport, not authorization.

## Verification

- `rg "access_token" supabase/functions` shows only the shared helper referencing the column name; no `.select("access_token")` remains.
- `psql -c "SELECT column_name FROM information_schema.columns WHERE table_name='plaid_items' AND column_name='access_token'"` returns 0 rows after the drop step.
- `psql -c "\dp public.plaid_items"` shows no grants to anon/authenticated.
- Deploy `plaid-webhook`, `plaid-sync-transactions`, `plaid-sync-accounts`, `plaid-exchange-public-token`, `plaid-create-link-token`, `plaid-remove-item`, `plaid-sandbox-fire-webhook`, `plaid-sandbox-public-token`, `account-delete-request`. Check logs for one successful `plaid-sync-transactions` run against the existing sandbox item — proves encrypt/decrypt roundtrip works end-to-end.
- Fire a webhook via `plaid-sandbox-fire-webhook` (still sandbox) → 200. Send a webhook without JWT and without shared-secret against the prod URL simulation → 401.

## What is out of scope

- No change to RLS policies on `plaid_items` (they already scope by `auth.uid()`).
- No change to Plaid product scope, ownership checks, or grounded-auto-fill flow.
- No new secrets requested from the user — the token encryption key is generated inside the migration and stored in Vault.
