## Part 1 — Turn on live payments

I can't flip the switch for you: Stripe requires you to complete the go-live flow yourself. Your current status:

- Step 1 — Claim Stripe account — **in progress**
- Steps 2–5 — locked until step 1 finishes

Sandbox account: `acct_1TkVIMAlTrbMZte6`.

What you need to do (from the Payments dashboard):

1. **Claim the sandbox** — click the claim link, either create a Stripe account or sign in to an existing one, then verify the email Stripe sends.
2. **Complete the go-live form on Stripe** — business verification, bank for payouts, 2FA, submit. When Stripe asks "choose what to copy" from sandbox to live, include the Lovable app and your products.
3. **Install the Lovable app on your LIVE account** (if you didn't copy it in step 2).
4. **Provision live keys** — automated by Lovable once step 3 completes.
5. **Readiness check** — automated verification of live products, prices, and webhooks.

While go-live is running, the site keeps taking test payments. Once live keys land, `pk_live_` is written to `.env.production` and the next publish flips real checkout on. There are no code changes to ship on our side — the `goldfin_reports` / `auto_fill_monthly` catalog we just synced will copy to live automatically.

I'll surface a Payments-tab action for you when this plan is approved.

## Part 2 — Plaid journey audit (read-only, no code changes)

I already read every function on the path (`_shared/plaid.ts`, `plaid-create-link-token`, `plaid-exchange-public-token`, `plaid-webhook`, `plaid-sync-transactions`, `plaid-sync-accounts`, `plaid-remove-item`, `plaid-correct-transaction`), the report pipeline (`_shared/report-core.ts` + `report-metrics/enrich/verify/delivery`), the cron (`cron-run-reports`), and the frontend template filler (`src/lib/finance/*` → `TemplateDownloadCard`). RLS policies on `plaid_items`, `plaid_accounts`, `plaid_transactions`, `recurring_streams`, `transaction_corrections`, `webhook_events` are confirmed via a live DB read.

### End-to-end journey (verified)

```text
User → Link (Plaid Link JS)
  → plaid-create-link-token        [auth required; per-user client_user_id]
  → Plaid returns public_token
  → plaid-exchange-public-token    [auth; stores access_token via service_role]
  → syncAccountsForItem            [seeds plaid_accounts]
Ongoing:
  Plaid → plaid-webhook            [JWT ES256 verified against Plaid JWKS +
                                    request_body_sha256 + ±5min iat skew]
    ├── ITEM.PENDING_EXPIRATION / ERROR / ITEM_LOGIN_REQUIRED → mark reauth
    └── TRANSACTIONS/HOLDINGS *_UPDATE / SYNC_UPDATES_AVAILABLE → resync accounts
User (or client trigger) →
  plaid-sync-transactions          [cursor /transactions/sync + recurring/get,
                                    upsert into plaid_transactions/recurring_streams,
                                    Layer-0 enrichment: owner correction > rule >
                                    Plaid PFC > legacy]
Bi-weekly cron (cron-run-reports, x-cron-secret) →
  generateReportForUser (service role)
    → computeMetrics (deterministic Layer 1)
    → LLM draft (Opus 4.8, tool-forced JSON)
    → verifyReport (Layer 4 — blocks any number not in METRICS)
    → insert advisory_reports
    → deliverReportEmail (idempotent, unsubscribe-aware)
Client: /reports page
  → reads own advisory_reports.metrics_snapshot (RLS)
  → productTemplates.fillAllTemplates → safeTemplatesCsv
     (traceableValues gate: refuses to export any cell not produced by metrics engine)
  → CSV download (Cash Flow, Owner Pay, Subscription Audit, Tax Reserve, Monthly Review, P&L, Cash Flow Forecast)
```

### Does it "auto-fill spreadsheets from bank statements"?

Yes. Transactions land in `plaid_transactions` (server-side, service role), `report-metrics.ts` computes the Layer-1 metrics from those rows, and `src/lib/finance/productTemplates.ts` fills every template cell from that metrics payload. `safeTemplatesCsv` refuses to emit any cell whose value isn't in the traceable allow-list — no LLM writes into the spreadsheet, so hallucinated numbers can't reach the customer's download. Deliverable at present is CSV (Excel / Sheets / Numbers compatible); xlsx is documented as a v2 pass.

### Security posture (findings)

Green — already correct:

- **Read-only Plaid connection** — products `["transactions"]`, no `auth`/`identity`/`assets` requested; can't move money.
- **Webhook verification** in production: Plaid ES256 JWT verified against per-key JWKS with body-hash + iat skew check; falls back to `PLAID_WEBHOOK_SECRET` shared secret only when no JWT header is present, and rejects if that also fails.
- **RLS** on every user-owned Plaid table is `select` restricted to `auth.uid() = user_id`; no `insert/update/delete` policies means only service-role code writes. Confirmed on `plaid_items`, `plaid_accounts`, `plaid_transactions`, `recurring_streams`, `transaction_corrections`.
- **Ownership check** in `plaid-sync-transactions` and `plaid-create-link-token` (update mode): item is re-read and `item.user_id === user.id` verified before the access_token is used.
- **Webhook audit trail** — every inbound Plaid event is written to `webhook_events` (admins-only read via `has_role`), even for unknown items.
- **Grounded auto-fill** — `traceableValues` on the CSV export mirrors the LLM verifier; the LLM never touches spreadsheet cells.
- **Cron eligibility** now correctly matches the single paid SKU (`auto-fill-monthly` / `auto_fill_monthly`) after our earlier sync.

Yellow — worth tightening (not blockers, propose only, no changes yet):

1. **`access_token` at rest is plaintext** in `plaid_items.access_token`. Service-role code reads it; users cannot (no RLS insert/update/delete + no select policy exposes it since the select policy exists but returns the whole row to the owner — the owner can read their own access_token). Recommend either (a) revoking `SELECT` on the `access_token` column from `authenticated` and exposing a `plaid_items_public` view without it, or (b) encrypting the column with `pgcrypto` using a vault secret. Low real-world risk today (owner reading their own token is not a privilege escalation), but it's a defense-in-depth win.
2. **Webhook always returns 401 vs 500** — good. Confirm the shared-secret fallback is not enabled in production: today the code accepts it whenever `PLAID_WEBHOOK_SECRET` is set, even in production. Recommend gating the fallback to `!isProduction()` so production requires a real Plaid JWT.
3. **`plaid-sandbox-*` functions** exist in the tree. Recommend gating both by `isProduction() === false` (return 403 in prod) so they can't be hit against a live Plaid environment.
4. **Cursor safety** — `plaid-sync-transactions` guards the loop at 50 iterations. With `count: 500` that's 25k txns per invocation, which is generous; keep as-is but add a warning log if the guard trips.
5. **Rate-limiting** — none of the Plaid endpoints have per-user throttling. Very low priority for the current user volume; flag for later.
6. **Client-side has no direct Plaid access** — confirmed. All Plaid REST calls run server-side with the secret; the browser only ever holds link/public tokens. Good.

### What I'd change next (queued, awaiting your go-ahead — I'm NOT touching these in this plan)

- Tighten `plaid-webhook` to require JWT in production (drop shared-secret fallback when `isProduction()`).
- Gate `plaid-sandbox-fire-webhook` and `plaid-sandbox-public-token` to non-production.
- Add a `plaid_items_public` view that hides `access_token` and update the owner SELECT policy to `USING (false)` on `access_token` (or move the column encryption to `pgcrypto` with `vault.decrypted_secrets`).

## Deliverable of this plan

1. Publish this audit as the answer.
2. Surface the Payments dashboard action so you can start go-live.

Approve to proceed, and tell me if you also want me to implement the three yellow-findings hardening items in the same follow-up.
