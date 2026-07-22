# Founder test bypass — one code, full pipeline

## Goal
You (and anyone you hand the code to) can log into the live site, connect a bank via Plaid, and get a real auto-filled spreadsheet + advisory report — **without** a $150/mo subscription and without exposing a free tier to the public.

## How the bypass will work
The paywall (`hasReportAccess` in `supabase/functions/_shared/report-eligibility.ts`) already honors a server-side allowlist secret called `ADVISORY_TEST_EMAILS` (comma-separated emails). It was built exactly for this — the previous DB-column bypass was a security hole, this one is not user-writable.

So the "founder code" is really: **your email on the allowlist**. Anyone on the list gets unlimited generation, real Plaid connect, real spreadsheets, real emails — bypassing Stripe entirely. Removing them is one secret edit.

## Plan

### 1. Add a "Founder Test" panel to the portal
New card on `/portal/dashboard` (only visible when `hasRole('admin')` is true) with three buttons wired to existing edge functions:

1. **Connect sandbox bank** — calls `plaid-sandbox-public-token` then `plaid-exchange-public-token` (creates a Plaid item using `user_good` / `pass_good` — First Platypus Bank test data). Skips Plaid Link UI so it's one click.
2. **Sync now** — calls `plaid-sync-accounts` + `plaid-sync-transactions`.
3. **Generate report now** — calls `generate-advisory-report` with `send: true`.

Each button shows the raw JSON result inline so you can see what happened.

The panel is admin-only because `handle_new_user()` already grants admin to the first user; anyone else signing up gets `member` and never sees it.

### 2. Add your email(s) to `ADVISORY_TEST_EMAILS`
One `set_secret` call. Comma-separated. Never rendered in the UI, never leaked to the client.

### 3. Document the flow
Short section in `docs/plaid-sandbox-setup.md` covering: sign in → open portal → click the three founder buttons → check your inbox → open the auto-filled `.xlsx` from the report page.

## Technical notes
- No new edge functions — reuses `plaid-sandbox-public-token`, `plaid-sandbox-fire-webhook`, `plaid-exchange-public-token`, `plaid-sync-*`, `generate-advisory-report`.
- Sandbox functions are already gated to `PLAID_ENV=sandbox` (currently true), so this panel simply won't work once you flip to production — which is what you want.
- No Stripe changes. No schema changes. No new RLS.
- Removing bypass = remove email from the secret. Instant.

## One question before I build

**Which emails should I put on the allowlist?** Please paste them (comma-separated). I'll assume your login email at minimum; add Chris/Parker if you want them in too.
