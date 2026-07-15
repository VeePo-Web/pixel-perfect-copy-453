
-- =========================================================================
-- EMAIL DRIP AUTOMATION — schedule email-drip-worker hourly.
-- Additive + defensive; wrapped so a missing extension / vault secret never
-- breaks the migration chain. The worker itself is idempotent (unique
-- (email, email_key) in lead_email_sends) and enforces a 48h throttle.
-- OPERATOR SETUP:
--   1. Edge-function secrets: CRON_SECRET, RESEND_API_KEY, RESEND_FROM,
--      SITE_URL (optional), REPLY_TO_EMAIL (optional),
--      LEAD_UNSUBSCRIBE_URL (optional — defaults to the functions URL).
--   2. Vault entry cron_secret must equal CRON_SECRET (already provisioned
--      for the advisory-report cron).
-- =========================================================================
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  CREATE EXTENSION IF NOT EXISTS pg_net;

  PERFORM cron.unschedule('email-drip-hourly')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'email-drip-hourly');

  PERFORM cron.schedule(
    'email-drip-hourly',
    '5 * * * *',
    $job$
      SELECT net.http_post(
        url := 'https://paarucbnaxorpxqjecrz.supabase.co/functions/v1/email-drip-worker',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-cron-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret' LIMIT 1)
        ),
        body := '{}'::jsonb
      );
    $job$
  );
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Email drip cron not scheduled (extension/vault not ready): %', SQLERRM;
END $$;
