CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'advisory-report-biweekly') THEN
    PERFORM cron.unschedule('advisory-report-biweekly');
  END IF;
END $$;

SELECT cron.schedule(
  'advisory-report-biweekly',
  '0 13 * * 1',
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