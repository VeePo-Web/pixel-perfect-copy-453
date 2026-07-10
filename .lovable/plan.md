# End-to-end smoke test audit — pre-launch

Goal: verify every system a real customer touches actually works before we flip Plaid/Stripe to production. This is read-only auditing plus controlled sandbox test calls — nothing destructive to real users.

I'll produce a single audit report at the end with pass/fail per section and a prioritized fix list.

---

## Track A — Backend infrastructure (I run, ~10 min)

**A1. Database health & RLS**
- Read all RLS policies on: `profiles`, `user_roles`, `plaid_items`, `plaid_accounts`, `transactions`, `advisory_reports`, `subscriptions`, `login_otps`, `webhook_events`, `cron_runs`, `leads`, `applications`, `email_send_log`, `suppressed_emails`.
- Confirm every user-facing table filters on `auth.uid()` and has `service_role` full access.
- Run `supabase--linter` for security warnings.
- Verify GRANTs match policies (no missing `GRANT SELECT` on tables that need anon or authenticated reads).

**A2. Cron jobs**
- Query `cron.job` and `cron.job_run_details` (last 30 days):
  - `advisory-report-biweekly` — did it run? Any failures? Correct `x-cron-secret` header?
  - `retention-sweep-daily` — same.
- Confirm both jobs schedule matches business intent (Monday 13:00 UTC for reports, daily 09:00 UTC for sweep).

**A3. Edge function health**
- List all deployed functions and their last-modified timestamp.
- Fetch recent logs (last 24h) for the critical ones and grep for errors:
  - `plaid-webhook`, `plaid-create-link-token`, `plaid-exchange-public-token`, `plaid-sync-accounts`, `plaid-sync-transactions`
  - `create-checkout`, `payments-webhook`, `create-portal-session`
  - `send-email`, `send-template-email`, `send-login-otp`, `verify-login-otp`
  - `generate-advisory-report`, `cron-run-reports`, `cron-retention-sweep`
  - `email-unsubscribe`, `resend-webhook`
- Flag any function with unhandled errors or missing env vars.

**A4. Secrets & env vars**
- Read `fetch_secrets` list; confirm all required ones present for the two paths (sandbox now, production later): `PLAID_CLIENT_ID`, `PLAID_SANDBOX_SECRET`, `PLAID_PRODUCTION_SECRET`, `PLAID_WEBHOOK_SECRET`, `CRON_SECRET`, `STRIPE_SANDBOX_API_KEY`, `PAYMENTS_SANDBOX_WEBHOOK_SECRET`, `RESEND_API_KEY`, `LOVABLE_API_KEY`.
- Flag any that are missing or will need to be added before go-live (`PAYMENTS_LIVE_WEBHOOK_SECRET`, `STRIPE_LIVE_API_KEY` — added automatically at Stripe go-live).

---

## Track B — Full sandbox user journey (I drive Playwright, ~15 min)

Real end-to-end run against the live preview using the Plaid sandbox and Stripe sandbox — this is the actual "can a customer plug in and get reports" test.

**B1. Marketing → CTA**
- Land on `/`, verify hero + pricing ladder + FAQ render.
- Click each primary CTA on `/`, `/pricing`, `/about#advisory-contact` — verify each routes to the correct destination (not the retired `/apply`, no `$99`).
- Verify `chris@goldfindesk.com` mailto works from Advisory CTAs.
- Screenshot each page for visual confirmation.

**B2. Portal auth (OTP path)**
- Go to `/portal/login`, enter a test email.
- Verify OTP email is sent — check `email_send_log` for a row with `sent` status.
- Read the OTP from the DB (test-only access via `login_otps` table), submit it.
- Confirm session is created, redirected to `/portal` dashboard.
- Confirm `profiles` and `user_roles` rows created via the `handle_new_user` trigger.

**B3. Portal auth (Google OAuth)**
- Verify Google is listed as a provider on `/portal/login` page (visual).
- I can't complete a real Google OAuth in headless Playwright without credentials, so this is a visual check only. If you have a Google test account you're comfortable using, I can add a full flow — otherwise I'll note "manual verification needed."

**B4. Plaid Link (sandbox)**
- Signed in as the test user, navigate to `/portal/accounts`.
- Click "Connect a bank" → Plaid Link modal opens.
- Complete Sandbox flow with `user_good` / `pass_good` at "First Platypus Bank."
- Confirm: `plaid_items` row created (encrypted `access_token`), `plaid_accounts` rows populated, transactions row count > 0.
- Fire `plaid-sandbox-fire-webhook` for `SYNC_UPDATES_AVAILABLE` — confirm webhook function accepts it, `plaid-sync-transactions` runs, log row lands in `webhook_events`.

**B5. Stripe checkout (sandbox)**
- From `/pricing`, click "Auto-fill my reports — $150/mo."
- Verify checkout session opens.
- Complete with Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC.
- Confirm redirect to `/portal/billing/return` shows success.
- Confirm `subscriptions` row created via webhook: `status='active'`, `price_id='auto_fill_monthly'`, `environment='sandbox'`.
- Verify `hasPaymentsConfigured()` still returns false in dev (correct — the sandbox key isn't `pk_live_…`).

**B6. Advisory report generation**
- With the test user connected and subscribed, invoke `generate-advisory-report` manually.
- Confirm: report row in `advisory_reports` with `status='ready'`, all 6 sections populated, no verification gate failures.
- Confirm email delivered — row in `email_send_log` with `sent` status for template `advisory-report`.
- Read the delivered HTML from the log — visual check for template correctness and unsubscribe link.

**B7. Unsubscribe flow**
- Click the unsubscribe link (extract token from the delivered email).
- Confirm token validates, row appears in `suppressed_emails`, subsequent sends to that address are blocked.

**B8. Portal settings & account deletion**
- Verify `/portal/settings` loads, shows current plan, Plaid item, unsubscribe status.
- Trigger `account-delete-request` — confirm it enqueues, doesn't delete immediately (24h grace).

---

## Track C — Cron & long-running (I audit, no execution)

**C1. Bi-weekly report cron**
- Verify `cron-run-reports` gate logic: only users with active `auto_fill_monthly` subscription AND at least one `active` plaid_item AND last report >13 days old.
- Read the last 5 runs from `cron_runs` — confirm each has a `success` outcome and processed the expected user count.

**C2. Retention sweep**
- Verify `run_retention_sweep()` function logic matches the retention memory rules.
- Read last 5 runs from `cron_runs`.

---

## Track D — Deliverability & branding (waits on Resend DNS verification)

Cannot fully execute until you confirm Resend shows the domain as Verified. What I audit now:
- Confirm no code sends from `onboarding@resend.dev` (the Resend test sender) — that will fail for real recipients.
- Confirm the `FROM_DEFAULT` constant in `send-email` and `send-template-email` is consistent.
- Verify `List-Unsubscribe` header wiring in `report-delivery.ts`.

After you say "Resend verified" I'll:
- Update FROM addresses to your chosen A or B option.
- Redeploy the 4 email functions.
- Send a real OTP to a test address you provide → I read the raw headers (via Playwright accessing the delivered mail) or you paste the headers, and I confirm `dkim=pass spf=pass dmarc=pass`.

---

## Track E — Security scan

- Run `security--run_security_scan`.
- Cross-reference findings against the retention/RLS work already done.
- Flag any Critical or High.

---

## Deliverable

A single audit report I paste into chat covering:

```text
Section          Result      Notes / Action
--------------- ----------- --------------------------------
A1 RLS          pass/fail
A2 Cron         pass/fail
A3 Functions    pass/fail
A4 Secrets      pass/fail
B1 CTAs         pass/fail
B2 OTP          pass/fail
B3 Google       manual
B4 Plaid        pass/fail
B5 Stripe       pass/fail
B6 Report       pass/fail
B7 Unsub        pass/fail
B8 Settings     pass/fail
C1 Report cron  pass/fail
C2 Retention    pass/fail
D  Deliverab.   deferred to post-Resend-verify
E  Security     pass/fail
```

Plus a prioritized fix list ordered blocker → nit.

---

## One thing to confirm before I start

The Playwright flow (Track B) will create real rows in your dev database: a test user (`smoke-test-<timestamp>@goldfindesk.com`), a sandbox Plaid item, a sandbox Stripe subscription. All are in `environment='sandbox'` and never touch real money, but they're persistent.

**OK to proceed?** If yes I run the full audit. If you want me to wipe the smoke-test user afterward, say so and I'll add a cleanup step (delete the test user + cascade).
