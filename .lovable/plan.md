
## How I'll self-test the Plaid journey

Your portal uses passwordless **email OTP** (with Google OAuth as the alternate). Both require an inbox I don't have, and OTP codes are stored as SHA-256 hashes in `login_otps` — I can't read the plaintext code from the database. So to run Track B/C/D myself I need one of these:

**Path I recommend (approve this):** Add a temporary, secret-gated **audit-bootstrap** edge function that uses the admin API to mint sessions for me, use it to run the whole audit end-to-end, then **delete the function and the test users** in the same turn. Nothing about it survives the audit.

## Scope of the temporary bootstrap

**New file** (deleted at end of the audit):
`supabase/functions/audit-bootstrap/index.ts`

Gated by a random `AUDIT_BOOTSTRAP_SECRET` I'll mint via `generate_secret` (32 chars, service-side only, never echoed to the user or logs). Any call missing or mismatching the `x-audit-bootstrap-secret` header → 401.

Supported actions:
- `mint` — `admin.auth.admin.createUser({ email, email_confirm: true })` (idempotent), then `admin.auth.admin.generateLink({ type:"magiclink", email })`, then `POST /auth/v1/verify { type:"magiclink", token_hash }` to convert the hashed token into a real session. Returns `{ user_id, access_token, refresh_token }` in memory only — never persisted.
- `cleanup` — for each email, `admin.auth.admin.deleteUser(user_id)`. Cascade drops any `plaid_items` / `plaid_accounts` / `plaid_transactions` / `webhook_events` rows.

Two audit users, both throwaway:
- `audit-a+<random>@goldfindesk.test`
- `audit-b+<random>@goldfindesk.test`

`.test` is a reserved TLD that never routes to a real inbox, so no email is delivered and no user of yours is affected.

## Audit run (unchanged from the previously-approved audit plan)

**Track B — signed-in E2E as user A, sandbox:**
1. `plaid-create-link-token { mode:"create" }` → `link-sandbox-…`
2. `plaid-sandbox-public-token { institution_id:"ins_109508", initial_products:["transactions"] }` → sandbox public_token
3. `plaid-exchange-public-token { publicToken }` → `itemId`, `accountCount ≥ 1`
4. DB assertions: `plaid_items` row present, `access_token_encrypted IS NOT NULL`, ≥1 `plaid_accounts` row
5. `plaid-sync-accounts { itemId }` → 200, `last_synced_at` advances
6. `plaid-sync-transactions { itemId }` → 200 with `{added, modified, removed, streams}` and populated `plaid_transactions` rows (category, merchant_name_norm, confidence)
7. `plaid-sandbox-fire-webhook { itemId, code:"DEFAULT_UPDATE" }` → `webhook_events` `TRANSACTIONS.DEFAULT_UPDATE` row + `last_synced_at` advances again
8. Fire `ITEM.ERROR` → `plaid_items.status='reauth_required'`; then `plaid-create-link-token { mode:"update", itemId }` returns a fresh link token
9. `plaid-remove-item { itemId }` → row gone (cascade)

**Track C — cross-user isolation:**
- As user B, hit `plaid-sync-accounts`, `plaid-sync-transactions`, `plaid-remove-item`, `plaid-create-link-token mode=update` with user A's `itemId` → all 404 "Item not found"
- Confirm `plaid_get_access_token` / `plaid_set_access_token` / `_plaid_token_key` EXECUTE grants are service_role only (already verified in interim report; re-check)

**Track D — Playwright UI as user A:**
Inject the minted session into localStorage against `http://localhost:8080`, then:
- `/portal/accounts` empty state renders correctly → screenshot
- Click **Connect my bank** → Plaid Link iframe from `cdn.plaid.com` mounts (we stop at iframe — the exchange path is already covered in B) → screenshot
- After B.3, refresh `/portal/accounts` → institution card, Active badge, N accounts, "Synced …" timestamp → screenshot
- `/portal/report` → **Sync transactions** → success line → screenshot
- After B.8, refresh `/portal/accounts` → "Re-auth required" + "Re-authenticate" button → screenshot
- Click **Disconnect** → confirm → card gone → screenshot

## Cleanup (same turn)

1. Call `audit-bootstrap { action:"cleanup" }` to delete user A + user B (cascades all Plaid rows).
2. `rm supabase/functions/audit-bootstrap/index.ts`.
3. `delete_secret AUDIT_BOOTSTRAP_SECRET`.
4. Verify: `select count(*) from auth.users where email like 'audit-%@goldfindesk.test'` returns 0; `plaid_items` back to 0; the function is gone.

## Deliverable

Final green/yellow/red report with response codes, DB row evidence, and Playwright screenshots. I'll flag anything red before touching code, per the earlier plan.

### Why this is safe
- Bootstrap function is protected by a random 32-char secret; without it every call is 401.
- Test emails use the reserved `.test` TLD, so no real inbox is touched.
- Function file and secret both removed at the end of the audit — leaves no back door.
- Only test users are created; your real `auth.users` rows are untouched.
