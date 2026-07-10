## Fix P0 blocker: recreate the 9 missing tables, then finish the audit

### The problem

Five past migrations partially applied — `advisory_reports` landed, but nine sibling tables the edge functions depend on never got created. Any bank sync or report generation crashes with `relation does not exist`. DB is a clean slate (0 users), so re-applying is safe.

Missing tables (from source migrations already in `supabase/migrations/`):
- `business_profiles`, `plaid_transactions`, `recurring_streams` (from `20260623120000_advisory_reports.sql`)
- `ledger_entries` (from `20260623130000_ledger_entries.sql`)
- `transaction_corrections`, `business_metric_inputs` (from `20260624120000_layer0_enrichment.sql`)
- `email_preferences`, `report_email_deliveries` (from `20260626120000_report_email_delivery.sql`)
- `email_suppressions` (from `20260626130000_email_suppressions.sql`)

### Step 1 — Consolidated repair migration (P0)

Create one new migration `2026071xxxxxx_repair_missing_tables.sql` that:
- Uses `CREATE TABLE IF NOT EXISTS` for each of the 9 tables (copies the exact column definitions from the original migrations — no schema drift).
- Skips `advisory_reports` (already exists).
- Adds `GRANT SELECT, INSERT, UPDATE, DELETE ... TO authenticated` + `GRANT ALL ... TO service_role` per table (no anon — all are user-scoped).
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` + recreates the original RLS policies (`auth.uid() = user_id`, plus the token-scoped policies for `report_email_deliveries` and `email_suppressions`).
- Recreates the indexes and the `updated_at` triggers from the originals.
- Idempotent throughout (`IF NOT EXISTS` / `DROP POLICY IF EXISTS ... CREATE POLICY`) so re-running is a no-op.

Because the original 5 migration files are already in git but not in `schema_migrations`, I will NOT mark them applied — the new consolidated file is the single source of truth for the repair. The originals stay in the folder as history.

### Step 2 — Verify tables and RLS

After the migration is approved and run:
- `psql \dt public.*` — confirm all 22 tables present.
- Query `pg_policies` — confirm every new table has the expected policies.
- Run `supabase--linter` — flag any new warnings.

### Step 3 — Playwright smoke test (Track B from earlier plan)

Only after Step 2 passes:
- Sign up a test user via OTP → confirm `profiles`, `user_roles` rows.
- Plaid Link sandbox → confirm `plaid_items`, `plaid_accounts`, `plaid_transactions`, `recurring_streams` rows all populate without error.
- Fire `SANDBOX_SYNC_UPDATES_AVAILABLE` webhook → confirm `plaid-sync-transactions` completes cleanly.
- Stripe checkout with test card `4242…` → confirm `subscriptions` row lands via webhook.
- Invoke `generate-advisory-report` → confirm `advisory_reports` row with `status='generated'`, all 6 sections, `verification_passed=true`, and `report_email_deliveries` row appears.
- Extract unsubscribe token from delivered email → hit `email-unsubscribe` → confirm `email_suppressions` row created.
- Cleanup: delete the test user (cascades to all owned rows).

### Step 4 — Final audit report

Update `.lovable/plan.md` with pass/fail per section and any residual fix list. Deliverability (Track D) stays deferred until Resend DNS is verified — I'll flag that as the only remaining pre-launch item.

### Technical notes

- Original migration bodies are all in-repo, so Step 1 is copy-paste with `IF NOT EXISTS` wrappers — no design decisions.
- `report_email_deliveries` has two special policies (user can read their own; service role manages) — preserved verbatim.
- `email_suppressions` is service-role-only for writes; users read via edge function only — preserved.
- No changes to `advisory_reports` (already exists with correct shape per earlier query).
- No frontend changes. No changes to edge functions or `config.toml`.

### What I need from you

Just approval to run. I'll clean up the test user at the end.