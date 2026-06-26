## Honest end‑to‑end status

Short answer: **the pipes are connected, but a few production switches aren't flipped yet, and one assumption in your message is off.** Here's exactly what happens today vs. what's missing.

### Quick correction
Auth *is* Lovable — Lovable Cloud is the backend (Supabase under the hood). There is no separate auth system. What we built on top of it:
- Email + password signup via Lovable Cloud auth
- Supabase sends a confirmation link email (default template)
- On every login: password → then a 6‑digit OTP we email via Resend (`send-login-otp` / `verify-login-otp`), valid 24h on that device

So a new user actually gets **two** auth emails on day one: confirmation link, then login OTP. That's fine, but it's not the "no signup, just a code" flow you described — worth deciding which you want.

### What works end‑to‑end right now
1. `/portal/signup` → Supabase creates user → confirmation email link → `/portal/login`
2. Login: password check → OTP emailed → `PortalOtpVerify` → 24h verified flag
3. `/portal/accounts` → `PlaidLinkButton` → `plaid-create-link-token` → Plaid Link → `plaid-exchange-public-token` → accounts + balances synced (verified via Playwright + sandbox API)
4. Plaid webhooks → `plaid-webhook` (JWT verified in prod) → transactions resync / reauth flag
5. Stripe checkout + portal + webhook → `subscriptions` table populated
6. `cron-run-reports` edge function exists, generates a report from `plaid_accounts` + `ledger_entries` and emails it via Resend; gated to one per user per 13 days

### What's NOT verified / missing for "real biweekly reports start landing"
| Gap | Impact | Fix |
|---|---|---|
| `CRON_SECRET` not in the visible secret list, and Vault entry `cron_secret` is set inside a `DO` block that swallows errors | Cron may be running but `cron-run-reports` rejects with 401, silently | Confirm both, or re‑run the schedule migration after secrets are set |
| `RESEND_FROM` not in secret list | Report emails fall back to `noreply@goldfindesk.com` (fine if domain verified) or fail | Confirm Resend domain `goldfindesk.com` is verified, set `RESEND_FROM` |
| No link between `subscriptions.status='active'` and report eligibility | Free users would also get reports | Add a `status = 'active'` filter in `cron-run-reports` user query |
| No per‑user cadence preference | Everyone gets the same Monday 13:00 UTC pass | Add `report_cadence_days` column on `profiles` if you want flexibility; otherwise leave |
| No "first report on day 1 of subscription" trigger | New paying users wait up to 13 days for their first report | Call `generate-advisory-report` from `payments-webhook` on `checkout.session.completed` |
| `PLAID_ENV` still `sandbox` | All bank data is fake | Flip to `production` after Plaid grants access |

### Proposal — pick one
Tell me which path and I'll switch to build mode:

- **A. Verify only.** I run the cron function manually with the secret, confirm it sends a real report email to a test account, and report what breaks. No code changes.
- **B. Verify + close the gaps above** (Stripe gating in cron, kickoff report on first payment, confirmed `RESEND_FROM`). Code changes are small and contained.
- **C. Also rework signup to passwordless** (email → OTP only, no password, no confirmation link) — closer to what your message described. Bigger change; touches `Signup.tsx`, `Login.tsx`, and the OTP functions.

Which one?