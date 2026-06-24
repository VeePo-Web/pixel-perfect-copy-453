-- =========================================================================
-- BI-WEEKLY REPORT AUTOMATION — schedule the cron-run-reports edge function.
-- Defensive + additive: wrapped so a missing extension / vault secret never
-- breaks the migration chain. The function itself gates each user to ~one
-- report per 13 days, so a weekly trigger yields a bi-weekly cadence per user.
--
-- OPERATOR SETUP (one-time, outside this migration — secrets never live in git):
--   1. Set edge-function secrets: CRON_SECRET, RESEND_API_KEY, RESEND_FROM,
--      ADVISORY_MODEL (or rely on LOVABLE_API_KEY default claude-opus-4-8).
--   2. Store the same CRON_SECRET in Vault:
--        select vault.create_secret('<the-cron-secret>', 'cron_secret');
--   3. Confirm the project ref in the URL below matches this project.
-- =========================================================================
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  CREATE EXTENSION IF NOT EXISTS pg_net;

  -- Replace any prior schedule of the same name (idempotent re-run).
  PERFORM cron.unschedule('advisory-report-biweekly')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'advisory-report-biweekly');

  PERFORM cron.schedule(
    'advisory-report-biweekly',
    '0 13 * * 1',  -- Mondays 13:00 UTC; per-user 13-day gate => bi-weekly per user
    $job$
      SELECT net.http_post(
        url := 'https://paarucbnaxorpxqjecrz.supabase.co/functions/v1/cron-run-reports',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-cron-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret' LIMIT 1)
        ),
        body := '{}'::jsonb
      );
    $job$
  );
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Report cron not scheduled (extension/vault not ready): %', SQLERRM;
END $$;
