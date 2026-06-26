## Internal audit dashboard

Add `/portal/admin/audit` — an admin-only page that shows the full lifecycle health of every user on one screen. Useful for you to confirm at a glance "did sign-in fire, is their bank connected, are they paying, did the last report send".

### Access control

- Route guarded by `has_role(auth.uid(), 'admin')`. Non-admins get a 404-style "not found".
- Seed your own user as admin via a one-time SQL insert into `user_roles` (`role = 'admin'`). I'll ask for your email after the plan is approved.

### Data shown (one row per user)

| Column | Source | Meaning |
|---|---|---|
| Email / created_at | `auth.users` via service-role RPC | When they signed up |
| Last sign-in | `auth.users.last_sign_in_at` | Confirms Google or OTP worked |
| Sign-in method | `auth.identities.provider` (`google` / `email`) | Which path they used |
| Plaid status | `plaid_items` count + latest `status` | `connected` / `none` / `error` |
| # accounts | `plaid_accounts` count | Sanity check |
| Stripe plan | `subscriptions.price_id` (latest active) | `auto-fill-monthly` / `finance-desk-monthly` / `clarity-report` / `none` |
| Sub status | `subscriptions.status` | active / trialing / past_due / canceled |
| Last report | `advisory_reports.created_at` max | Confirms automation runs |
| Report status | `advisory_reports.status` latest | `generated` / `sent` / `failed` |
| Last webhook event | new `webhook_events` log table | Most recent Stripe/Plaid event + timestamp |

Plus a top strip with system-wide counts: total users, % with bank connected, % paying, reports sent in last 14 days, last cron run timestamp.

### One small backend addition

Create `public.webhook_events` (id, source `'stripe'|'plaid'`, event_type, user_id nullable, payload_summary jsonb, received_at). Insert one row from `payments-webhook` and `plaid-webhook` on every event. This is the only way to surface "did the webhook actually fire" — right now we only see side-effects.

Also extend `cron-run-reports` to write a `cron_runs` row (started_at, candidates, generated, sent, skipped, failed) so the dashboard can show last cron run + outcome.

### Edge function

`admin-audit-overview` (POST, JWT-verified, checks `has_role('admin')` server-side):
- Returns `{ users: [...rows], summary: {...}, lastCronRun: {...} }`.
- Joins `auth.users` (service role), `auth.identities`, `plaid_items`, `plaid_accounts`, `subscriptions`, `advisory_reports`, `webhook_events`, `cron_runs`.
- Server-side pagination (50/page) + email search.

### UI

- `src/pages/portal/admin/Audit.tsx` — table with sticky header, filter chips (`bank: any|connected|none`, `paying: any|yes|no`, `report: any|<14d|stale`), search box, manual "Run cron now" button (calls cron with x-cron-secret server-side), "Re-send last report" per-row button.
- Same Goldfin Desk visual language (white/gold, ink text). No dark theme.
- Lives under `/portal/admin/audit`; add a tiny "Admin" link in `Settings.tsx` shown only to admins.

### Files

**New**
- `supabase/migrations/<ts>_audit_dashboard.sql` — `webhook_events`, `cron_runs`, indexes, RLS (admin-only read; service-role write).
- `supabase/functions/admin-audit-overview/index.ts`
- `supabase/functions/admin-trigger-cron/index.ts` (wraps `cron-run-reports` with admin JWT instead of `x-cron-secret`)
- `src/pages/portal/admin/Audit.tsx`
- `src/components/portal/admin/StatusBadge.tsx`, `UserRow.tsx`, `SummaryStrip.tsx`

**Modified**
- `supabase/functions/payments-webhook/index.ts` — insert into `webhook_events`.
- `supabase/functions/plaid-webhook/index.ts` — insert into `webhook_events`.
- `supabase/functions/cron-run-reports/index.ts` — insert into `cron_runs`.
- `src/portal/PortalRouter.tsx` — route `/portal/admin/audit`.
- `src/pages/portal/Settings.tsx` — conditional admin link.

### Out of scope

- No multi-tenant org concept; this is single-team internal.
- No charts, just numbers + table (you said "audit", not "BI dashboard").
- No drill-down log viewer per user yet — `webhook_events` payload preview only.

### Quick question before I build

1. What's the email address that should be the first admin? (I'll seed it into `user_roles` so you can actually open the dashboard.)
2. Want a "Run cron now" + "Re-send last report" admin action, or read-only first pass?
