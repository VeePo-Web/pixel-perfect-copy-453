
# Plan — Fix + Verify Plaid → Paid → Auto-Fill → Bi-Weekly Report Pipeline

Executed in six tasks, in order. Each task ends with observed values written into the final checklist.

---

## Task 1 — Deploy the model fix, prove report generation

1. Confirm `supabase/functions/_shared/report-core.ts` on `main` defaults to `google/gemini-3.1-pro-preview` and reads `ADVISORY_MODEL`. Set `ADVISORY_MODEL=google/gemini-3.1-pro-preview` as a belt-and-braces secret.
2. Redeploy: `generate-advisory-report`, `cron-run-reports`, `payments-webhook`, `admin-trigger-cron` (any function that imports `report-core.ts`).
3. Invoke `generate-advisory-report` `{send:false}` as test user `35c8c3ef-…`.
4. Success gate: HTTP 200, `ok:true`, `verification_passed:true`, `advisory_reports` row `status='generated'` with populated `metrics_snapshot`, `narrative`, `recommendations`. If verifier flags orphans, tighten prompt (not verifier).

## Task 2 — Prove the paid path in Stripe sandbox

1. Create a sandbox checkout session for `auto-fill-monthly`, pay with `4242 4242 4242 4242`.
2. Assert `subscriptions` row: `user_id=<test>`, `environment='sandbox'`, `status ∈ (active,trialing)`, `price_id` matches auto-fill-monthly slug.
3. Assert `payments-webhook` kickoff report: new `advisory_reports` row + `report_email_deliveries` row for it (bank already connected from previous audit).
4. Invoke `cron-run-reports` with `x-cron-secret`; assert user counted as candidate and `skipped` (13-day gate). Proves gating both directions.

## Task 3 — Prove email + auto-filled workbook delivery

1. Update `profiles.email` to a reachable inbox for the test user. Invoke `generate-advisory-report` `{send:true}`.
2. Confirm email arrives; `resend-webhook` flips `report_email_deliveries` to `delivered`.
3. In portal, open report → confirm `TemplateDownloadCard` renders auto-filled templates on-screen; download `.xlsx` and `.csv`. Spot-check workbook numbers match `metrics_snapshot`. `UntraceableWorkbookCellError` must not fire.

## Task 4 — Close abuse hole on `generate-advisory-report`

Edit `supabase/functions/generate-advisory-report/index.ts`:
1. Add subscription eligibility check (reuse `ELIGIBLE_PRICES` + `ACTIVE_STATUSES` from `cron-run-reports`). Bypass if `profiles.internal_test_allow = true`.
2. Add per-user 24h rate limit: `SELECT count(*) FROM advisory_reports WHERE user_id=$1 AND created_at > now()-interval '24 hours'`; reject if ≥3.
3. Migration: `ALTER TABLE profiles ADD COLUMN internal_test_allow boolean NOT NULL DEFAULT false;` (additive, defensive `IF NOT EXISTS`).
4. Audit `generate-briefing`: add IP-based rate limit if missing (in-memory or ledger table keyed by IP + hour).

## Task 5 — Handoff tasks 3–7 (correctness)

**Task 3+5 verifier split** — `supabase/functions/_shared/report-verify.ts`:
- Replace single `structuralAllowed` set with three: `countAllowed` (integer counts), `currencyAllowed` (dollar amounts), `percentAllowed` (percentages).
- Match `$X` against `currencyAllowed` with tolerance = max($1, 0.5% of value); match `X%` against `percentAllowed` ±0.5pp; match bare integers against `countAllowed`.
- Add bare-number scan: any number ≥100 without `$`, `%`, or "months"/"days" trailing token flagged, excluding 4-digit years 2000–2099.

**Task 4 trailing tax window** — `report-core.ts`:
- Replace `annualNet = profitProxy * (365/14)` with trailing 180-day (fallback 90-day if <180d history) window after transfer/owner-draw exclusion.
- Include window length in `TAX_FLAG` output (e.g. `"based on trailing 180 days"`).

**Task 6 PFCv2** — `plaid-sync-transactions/index.ts`:
- Add `personal_finance_category_version: "v2"` to `/transactions/sync` and `/transactions/recurring/get` request bodies.

**Task 7 duplicate detector** — same file:
- Track matched indices; do not re-match. Skip merchants already present in `recurring_streams` for the item.

## Task 6 — Cleanup

1. Call `plaid-remove-item` for test user's `plaid_items` (removes at Plaid).
2. Call `admin-wipe-users` (or admin RPC) for `35c8c3ef-…`.
3. Verify: no rows in `plaid_items`, `plaid_accounts`, `plaid_transactions`, `advisory_reports`, `subscriptions`, `report_email_deliveries`, `recurring_streams` for that user.
4. `plaid_get_access_token(<old item id>)` returns null.

---

## Technical notes

- Verifier changes must include unit tests in `supabase/functions/_shared/__tests__/report-verify.test.ts` covering: `$60` unlisted → fail; `$60.30` when snapshot has `$60.00` → pass; `30%` unlisted → fail; bare `250` unlisted → fail; `2026` year → pass.
- Tax window change: add tests for 200-day and 45-day histories.
- Rate limit: return HTTP 429 with `Retry-After` header.
- All migrations use `IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` per project convention.
- Preserve existing `ELIGIBLE_PRICES` set — do not narrow.

## Final deliverable

A checklist mirroring Tasks 1–6 with observed values: report id from Task 1, subscription id + kickoff report id from Task 2, delivery id + workbook file hashes from Task 3, 429 response body from Task 4 rate-limit smoke test, verifier test output from Task 5, and empty-row confirmations from Task 6.
