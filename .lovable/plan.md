# Smoke-Test Audit — Final Report

## P0 blocker fixed

Nine missing tables recreated via `repair_missing_tables` migration (idempotent, `IF NOT EXISTS`). All 22 public tables now present with correct RLS.

Verified live:
- `business_profiles`, `plaid_transactions`, `recurring_streams`, `ledger_entries`, `transaction_corrections`, `business_metric_inputs`, `email_preferences`, `report_email_deliveries`, `email_suppressions` — created, GRANTs applied, RLS enabled, policies restored per original migrations.
- Existing tables untouched (`advisory_reports`, `plaid_items`, `plaid_accounts`, `profiles`, `subscriptions`, etc.).
- 20 tables with policies + 2 service-role-only ops tables (`login_otps`, `email_suppressions`) — correct.

## Audit results

| Section          | Result   | Notes                                                                                             |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------- |
| A1 RLS           | PASS     | Every user table scopes on `auth.uid()`; ops tables service-role only.                            |
| A2 Cron          | PASS*    | Jobs configured; can't read `cron.job` from psql (perm) — verified earlier via cron_runs history. |
| A3 Edge funcs    | PASS     | Deploy list matches expectations; all callable from client via `supabase.functions.invoke`.       |
| A4 Secrets       | PASS     | Plaid prod secret, Stripe sandbox, Resend, cron all present.                                      |
| B1 Public routes | PASS     | `/`, `/pricing`, `/about`, `/templates`, `/sample-briefing`, `/security-faq`, `/portal/login` all render 200, zero console errors. |
| B2 OTP auth      | READY    | Table + edge function wired; requires real email to fully verify — user should smoke this manually or provide a test inbox. |
| B3 Google OAuth  | MANUAL   | Requires Google test account (can't do headless).                                                 |
| B4 Plaid link    | READY    | Sandbox flow now unblocked — `plaid_transactions` + `recurring_streams` exist.                    |
| B5 Stripe        | READY    | Sandbox key present; checkout wiring intact.                                                      |
| B6 Report gen    | READY    | All required tables exist; `generate-advisory-report` can now execute end-to-end.                 |
| B7 Unsubscribe   | READY    | `email_preferences` + token index present.                                                        |
| B8 Retention     | PASS     | `run_retention_sweep` function exists and lists all target tables.                                |
| C1 Report cron   | READY    | Was previously destined to crash on missing tables — now unblocked.                               |
| D Deliverability | DEFERRED | Blocked on Resend DNS verification.                                                               |
| E Security       | PASS     | Linter warnings are pre-existing (extensions in public, security-definer function perms) — none introduced by repair. |

## Remaining pre-launch items

1. **Resend DNS verified** → update FROM addresses, redeploy 4 email functions, send a real OTP for DKIM/SPF/DMARC verification.
2. **Manual OTP + Plaid + Stripe run-through** — the code path is unblocked but requires a real inbox + Plaid sandbox click-through + Stripe test card (`4242…`). I can drive this via Playwright if you provide a throwaway inbox.
3. **`PLAID_ENV=production` flip** — waits on your confirmation that Plaid dashboard shows Production access approved and webhook + redirect URI set.

## Retired route note

`/apply` still returns the SPA shell (200 with home title) rather than a 404. Not a blocker; consider adding a redirect to `/pricing` in `vercel.json` or `_redirects` when you have a moment.

Nothing else stands between the code and go-live.
