
## Full Plaid Journey Audit

Goal: prove end-to-end that a signed-in user can (1) mint a Link token, (2) exchange a sandbox public token into a stored `plaid_items` row with encrypted access token, (3) sync accounts + balances, (4) sync transactions + recurring streams, (5) receive webhooks, (6) reconnect on reauth, and (7) disconnect. Report status, findings, and any breakage — no code changes unless a defect blocks the journey.

## Journey map (what we're testing)

```text
/portal/login
      │
      ▼
/portal/accounts  ──►  PlaidLinkButton (mode=create)
      │                       │
      │                       ▼
      │              plaid-create-link-token  →  Plaid Link modal (sandbox)
      │                       │
      │                       ▼
      │              onSuccess(publicToken)
      │                       │
      │                       ▼
      │              plaid-exchange-public-token
      │                 • /item/public_token/exchange
      │                 • INSERT plaid_items (status=active, no plaintext token)
      │                 • setAccessToken RPC (pgp_sym_encrypt at rest)
      │                 • syncAccountsForItem → plaid_accounts rows
      │                       │
      ▼                       ▼
AccountCard (Active)   /portal/report ──► plaid-sync-transactions
      │                       • /transactions/sync (cursor) → plaid_transactions
      │                       • /transactions/recurring/get → recurring_streams
      │
      ├─ Refresh balances  →  plaid-sync-accounts
      ├─ Re-auth (if flagged) → plaid-create-link-token mode=update → onSuccess → plaid-sync-accounts
      └─ Disconnect        →  plaid-remove-item (/item/remove + DELETE row)

Plaid → plaid-webhook
   • prod: verify ES256 JWT vs JWKS + body sha256
   • sandbox: shared secret fallback
   • ITEM.PENDING_EXPIRATION / ERROR / ITEM_LOGIN_REQUIRED → status=reauth_required
   • TRANSACTIONS/HOLDINGS *_UPDATE → syncAccountsForItem
   • Every event → webhook_events audit row
```

## Preflight

- Confirm all required secrets are present: `PLAID_CLIENT_ID`, `PLAID_SANDBOX_SECRET`, `PLAID_PRODUCTION_SECRET`, `PLAID_WEBHOOK_SECRET`. (`fetch_secrets` already shows all four ✓.)
- Confirm `PLAID_ENV` default = sandbox (unset ⇒ sandbox by design).
- Confirm `LOVABLE_BROWSER_AUTH_STATUS` before running the browser-driven checks — if it's `signed_out`, ask the user to sign in at `/portal/login` and stop; if `injected`, proceed.

## Test matrix

### A. Unauthenticated edge-function calls (should reject)

Run via `supabase--curl_edge_functions` with an empty `Authorization` header:

| Function | Expected |
| --- | --- |
| `plaid-create-link-token` | 401 |
| `plaid-exchange-public-token` | 401 |
| `plaid-sync-accounts` | 401 |
| `plaid-sync-transactions` | 401 |
| `plaid-remove-item` | 401 |
| `plaid-webhook` (no header) | 401 |
| `plaid-webhook` (wrong `x-plaid-webhook-secret`) | 401 |
| `plaid-webhook` (correct shared secret, JSON body for unknown item) | 200 `{received:true, unknown_item:true}` + `webhook_events` row |

### B. Signed-in end-to-end (authenticated user, sandbox)

Runs against the deployed sandbox — real Plaid `/sandbox/*` endpoints, no UI Link modal needed.

1. **Mint link token** — `POST plaid-create-link-token { mode: "create" }` → assert `linkToken` starts with `link-sandbox-`.
2. **Sandbox public token** — `POST plaid-sandbox-public-token { institution_id: "ins_109508" /* First Platypus */, products:["transactions"] }` (existing helper function) → returns `public_token`.
3. **Exchange** — `POST plaid-exchange-public-token { publicToken }` → returns `itemId`, `accountCount ≥ 1`.
4. **DB assertions** via `supabase--read_query`:
   - `plaid_items` row exists for that `itemId`, `status='active'`, `access_token_encrypted IS NOT NULL`, no plaintext `access_token` column value exposed.
   - `plaid_accounts` rows exist with `plaid_item_id = itemId`.
5. **Refresh balances** — `POST plaid-sync-accounts { itemId }` → 200; `plaid_items.last_synced_at` advances.
6. **Sync transactions** — `POST plaid-sync-transactions { itemId }` → 200 with `{ added, modified, removed, streams }`. Assert `plaid_transactions` rows with populated `category`, `merchant_name_norm`, `confidence`.
7. **Fire sandbox webhook** — `POST plaid-sandbox-fire-webhook { itemId, code: "DEFAULT_UPDATE" }`. Then assert a new `webhook_events` row for `TRANSACTIONS.DEFAULT_UPDATE` and that `plaid_items.last_synced_at` advanced again.
8. **Force reauth path** — fire sandbox webhook `ITEM.ERROR` (or `PENDING_EXPIRATION`). Assert `plaid_items.status = 'reauth_required'` and that a subsequent `plaid-create-link-token { mode: "update", itemId }` returns a fresh link token.
9. **Disconnect** — `POST plaid-remove-item { itemId }` → 200; assert row deleted from `plaid_items` (and cascade-deleted `plaid_accounts` / `plaid_transactions`).

### C. Cross-user isolation (RLS + service-role guard)

- Create/borrow a second test user token if available; call `plaid-sync-accounts`, `plaid-sync-transactions`, `plaid-remove-item`, `plaid-create-link-token mode=update` with User A's `itemId` while authed as User B → expect 404 "Item not found" on every one. This is the guardrail in each function (`item.user_id !== user.id`).
- `read_query` sanity check: `plaid_get_access_token`/`plaid_set_access_token` are `EXECUTE` for `service_role` only.

### D. UI smoke (Playwright, only if `LOVABLE_BROWSER_AUTH_STATUS=injected`)

- `/portal/accounts` empty state renders "Connect your bank to build your first report".
- Click "Connect my bank" → Plaid Link iframe mounts (assert `#plaid-link-iframe-*` or iframe from `cdn.plaid.com`). We stop here to avoid driving the third-party UI; sandbox exchange was already covered in B.
- After step B completes, refresh `/portal/accounts` → institution card shows, "Active" badge, N accounts, "Synced …" timestamp. Screenshot.
- `/portal/report` → "Sync transactions" button → success line `Pulled N new transaction(s)…` or "up to date". Screenshot.
- Trigger reauth via B.8, refresh `/portal/accounts` → badge flips to "Re-auth required", "Re-authenticate" button appears. Screenshot.
- Click Disconnect → confirm modal → card gone.

## Deliverable

A single findings report with:
- **Green** rows (pass, evidence: response code / row id / screenshot path)
- **Yellow** rows (works but drift — e.g. the `MfaPolicy` / `MfaAttestation` docs claim `plaid-create-link-token` requires an AAL2 assertion within 30 min, but the function currently doesn't enforce that; also `PLAID_REDIRECT_URI` isn't set, so OAuth-only banks like Chase/Capital One won't complete in production even though sandbox works)
- **Red** rows (broken — will fix in a follow-up turn after your review)

No production changes unless a Red is found. If a Red is found, I'll stop, describe it, and wait for approval before editing.
