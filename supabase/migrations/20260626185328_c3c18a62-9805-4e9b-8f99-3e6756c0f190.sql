
-- 1. Soft-delete fields on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS deletion_requested_at timestamptz,
  ADD COLUMN IF NOT EXISTS deletion_executed_at  timestamptz;

-- 2. Quarterly review log
CREATE TABLE IF NOT EXISTS public.retention_policy_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_version text NOT NULL,
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  reviewer_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text
);

GRANT SELECT, INSERT ON public.retention_policy_reviews TO authenticated;
GRANT ALL ON public.retention_policy_reviews TO service_role;

ALTER TABLE public.retention_policy_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read reviews"
  ON public.retention_policy_reviews FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins record reviews"
  ON public.retention_policy_reviews FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND reviewer_user_id = auth.uid());

-- 3. Retention sweep function (idempotent, returns counts)
CREATE OR REPLACE FUNCTION public.run_retention_sweep()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_otps int := 0;
  v_webhooks int := 0;
  v_crons int := 0;
  v_reports int := 0;
  v_leads int := 0;
  v_apps int := 0;
  v_plaid_items int := 0;
BEGIN
  -- Expired login OTPs older than 24h past expiry
  DELETE FROM public.login_otps
    WHERE expires_at < now() - interval '24 hours';
  GET DIAGNOSTICS v_otps = ROW_COUNT;

  -- Webhook event log: 90 days
  DELETE FROM public.webhook_events
    WHERE received_at < now() - interval '90 days';
  GET DIAGNOSTICS v_webhooks = ROW_COUNT;

  -- Cron run log: 90 days
  DELETE FROM public.cron_runs
    WHERE started_at < now() - interval '90 days';
  GET DIAGNOSTICS v_crons = ROW_COUNT;

  -- Advisory reports: 24 months
  DELETE FROM public.advisory_reports
    WHERE created_at < now() - interval '24 months';
  GET DIAGNOSTICS v_reports = ROW_COUNT;

  -- Leads with no conversion: 18 months
  DELETE FROM public.leads
    WHERE created_at < now() - interval '18 months';
  GET DIAGNOSTICS v_leads = ROW_COUNT;

  -- Applications: 24 months
  DELETE FROM public.applications
    WHERE created_at < now() - interval '24 months';
  GET DIAGNOSTICS v_apps = ROW_COUNT;

  -- Removed Plaid items: 30 days after status flipped
  DELETE FROM public.plaid_items
    WHERE status IN ('removed','reauth_required')
      AND updated_at < now() - interval '30 days';
  GET DIAGNOSTICS v_plaid_items = ROW_COUNT;

  RETURN jsonb_build_object(
    'login_otps', v_otps,
    'webhook_events', v_webhooks,
    'cron_runs', v_crons,
    'advisory_reports', v_reports,
    'leads', v_leads,
    'applications', v_apps,
    'plaid_items', v_plaid_items,
    'ran_at', now()
  );
END;
$$;

REVOKE ALL ON FUNCTION public.run_retention_sweep() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.run_retention_sweep() TO service_role;
