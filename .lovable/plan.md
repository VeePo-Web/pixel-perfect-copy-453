## Goal

Stand up a defined, enforced, periodically-reviewed Data Retention & Deletion Policy for Goldfin Desk that meets GDPR Art. 5(1)(e) / 17, CCPA §1798.105, PIPEDA Principle 5, and Plaid's End User Data Disposal obligations — and expose it at a stable public URL.

## 1. Public policy page (the link)

New route `/data-retention` rendered by `PortalRouter` (treated like `/terms`, `/privacy`, `/plaid-consent`).

File: `src/pages/legal/DataRetention.tsx`. Sections:
- Effective date + version (`RETENTION_POLICY_VERSION` in `src/lib/portal/tos.ts`).
- Scope & legal basis (GDPR, CCPA, PIPEDA, Plaid EUDPA).
- Retention schedule table (see §3).
- How to request deletion (in-portal button + `privacy@goldfindesk.com`).
- Automated enforcement summary + review cadence (quarterly, owner: Founder/CTO).
- Sub-processor list pointer (Supabase, Stripe, Plaid, Resend).

Linked from:
- `GoldFinFooter.tsx` legal nav.
- `Terms.tsx` and `PlaidConsent.tsx` cross-links.
- `Settings.tsx` ("Your data" section, next to Delete button).

## 2. User-facing deletion (CCPA/GDPR right to erasure)

- New edge function `account-delete-request` (JWT-verified): marks `profiles.deletion_requested_at = now()`, revokes Plaid items via `/item/remove`, cancels Stripe subscription at period end, queues hard-delete in 30 days (grace window).
- New edge function `account-delete-execute` (CRON_SECRET gated): hard-deletes rows for users whose `deletion_requested_at < now() - interval '30 days'`. Uses `auth.admin.deleteUser` then cascades.
- Settings UI: "Delete my account & data" button → confirmation modal → calls `account-delete-request`. Shows pending-deletion banner with cancel option.

## 3. Automated retention enforcement

New scheduled function `cron-retention-sweep` (daily 09:00 UTC via pg_cron, CRON_SECRET gated). Applies:

| Data | Table | Retention | Action |
|---|---|---|---|
| Expired login OTPs | `login_otps` | 24h after expiry | DELETE |
| Webhook event log | `webhook_events` | 90 days | DELETE |
| Cron run log | `cron_runs` | 90 days | DELETE |
| Advisory reports | `advisory_reports` | 24 months | DELETE (or anonymize if user opts in) |
| Plaid accounts/transactions for disconnected items | `plaid_accounts`, `plaid_items` (status=`removed`) | 30 days | DELETE + Plaid `/item/remove` |
| Leads (no conversion) | `leads` | 18 months | DELETE |
| Applications (rejected/abandoned) | `applications` | 24 months | DELETE |
| Soft-deleted users | `auth.users` via profiles flag | 30 days post-request | hard DELETE |
| ToS acceptances | `tos_acceptances` | 7 years (legal evidence) | RETAIN |
| Subscriptions (financial record) | `subscriptions` | 7 years | RETAIN, then DELETE |

Implementation: single SQL function `public.run_retention_sweep()` (SECURITY DEFINER) invoked by the edge function; each step wrapped in a try/log block writing to `cron_runs` for auditability.

## 4. Schema additions (one migration)

- `profiles`: add `deletion_requested_at timestamptz`, `deletion_executed_at timestamptz`.
- New table `retention_policy_reviews` (id, version, reviewed_at, reviewer_user_id, notes) — records the quarterly review for audit. Admin-only RLS via `has_role(auth.uid(),'admin')`. Standard GRANT block.
- pg_cron entry: `select cron.schedule('retention-sweep-daily','0 9 * * *', $$ select net.http_post(...cron-retention-sweep, header CRON_SECRET) $$);`

## 5. Admin review surface

Extend `src/pages/portal/admin/Audit.tsx` with a "Retention" tab:
- Last sweep run + counts deleted per table (from `cron_runs.summary`).
- Pending deletion requests list.
- "Record quarterly review" button → inserts into `retention_policy_reviews` with current `RETENTION_POLICY_VERSION`.

## 6. Versioning + periodic review

- `RETENTION_POLICY_VERSION = "2026-06-26"` in `src/lib/portal/tos.ts`.
- Bumping the version triggers a re-acceptance banner in `AcceptTerms` flow (same pattern as TOS).
- Quarterly cadence enforced by `cron-retention-sweep` writing a `webhook_events` warning row if no `retention_policy_reviews` entry in the last 100 days.

## 7. Out of scope

- Storage bucket cleanup (none configured yet).
- Per-jurisdiction (state-by-state CCPA-equivalent) variations — the single policy covers the strictest baseline.
- Stripe data export to user (covered separately under data-portability if requested).

## Deliverable link

After implementation, the public policy will live at: `https://goldfindesk.com/data-retention` (and on preview at `/data-retention`).

Approve and I'll execute steps 1–6 in one pass: migration, edge functions, cron schedule, public page, footer link, Settings delete flow, admin review tab.