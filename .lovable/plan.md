## Audit result: does the whole loop work?

**Short answer: yes, end-to-end.** Sign-in is *not* a Lovable-branded screen, Plaid syncs, and the bi-weekly cron is live and verified active.

---

### 1. Sign-in — no Lovable Cloud-branded UI

`src/pages/portal/Login.tsx` is the only entry point. Two options:

- **Google** — `lovable.auth.signInWithOAuth("google", …)`. Consent screen is Google's, showing the Goldfin Desk app name (managed OAuth credentials, no "Lovable" branding visible to the user).
- **Email code** — `send-login-otp` edge function generates a 6-digit code, emails via Resend from `noreply@goldfindesk.com`. User enters code on the same page; `verify-login-otp` exchanges it for a session via Supabase `generateLink` server-side. No password, no Lovable-hosted page, no signup screen.

Legacy `/portal/signup`, `/portal/forgot-password`, `/portal/reset-password` all redirect to `/portal/login`.

**Verdict:** ✅ Users never see a Lovable-branded auth screen.

> Technical note (non-user-facing): the backend identity store is Lovable Cloud (Supabase Auth). That is infrastructure — the user-facing surface is 100% Goldfin Desk.

---

### 2. Plaid bank connection

- `PlaidLinkButton` calls `plaid-create-link-token` → opens Plaid Link → `plaid-exchange-public-token` writes `plaid_items` + `plaid_accounts` rows.
- Production-vs-sandbox switched by `PLAID_ENV` in `_shared/plaid.ts`. Sandbox secret is set; production secret slot exists.
- Webhook `plaid-webhook` logs every event to `webhook_events`.

**Verdict:** ✅ Works end-to-end; only requires flipping `PLAID_ENV=production` once Plaid grants prod access.

---

### 3. Bi-weekly reports

- Cron job `advisory-report-biweekly` confirmed **active**, schedule `0 13 * * 1` (Mondays 13:00 UTC), authenticated via Vault `cron_secret`.
- `cron-run-reports` filters users with: active subscription (`auto-fill-monthly` or `finance-desk-monthly` `price_id`) **AND** at least one active `plaid_items` row. Logs each run to `cron_runs`.
- `payments-webhook` fires an instant first report on `checkout.session.completed` if the user already has a Plaid connection — no 7-day wait.

**Verdict:** ✅ Automated, gated by both payment + bank connection.

---

### 4. Audit dashboard

`/portal/admin/audit` shows every user's sign-in providers, last sign-in, Plaid status, Stripe plan, last report, and last webhook event. First signed-in user is auto-promoted to admin. "Run cron now" button calls `admin-trigger-cron`.

---

### What's left before real launch

1. **Flip `PLAID_ENV` to `production`** once Plaid approves the production app (you said the secrets are already in).
2. **Stripe go-live** — currently sandbox. Switch when ready; webhooks auto-register for live.
3. **Custom domain** — point `goldfindesk.com` at the project so the Google consent screen and OTP emails match the URL bar.

Nothing in the code blocks launch. Do you want me to switch to build mode and (a) flip `PLAID_ENV`, (b) prepare the Stripe go-live checklist, or (c) something else?