
-- 1. Webhook events log (one row per inbound Stripe/Plaid event)
CREATE TABLE public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL CHECK (source IN ('stripe','plaid')),
  event_type text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  external_id text,
  summary jsonb DEFAULT '{}'::jsonb,
  received_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.webhook_events TO authenticated;
GRANT ALL ON public.webhook_events TO service_role;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read webhook_events"
  ON public.webhook_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_webhook_events_received_at ON public.webhook_events(received_at DESC);
CREATE INDEX idx_webhook_events_user ON public.webhook_events(user_id, received_at DESC);

-- 2. Cron runs log
CREATE TABLE public.cron_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  candidates int DEFAULT 0,
  generated int DEFAULT 0,
  sent int DEFAULT 0,
  skipped int DEFAULT 0,
  failed int DEFAULT 0,
  error text
);
GRANT SELECT ON public.cron_runs TO authenticated;
GRANT ALL ON public.cron_runs TO service_role;
ALTER TABLE public.cron_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read cron_runs"
  ON public.cron_runs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_cron_runs_started ON public.cron_runs(started_at DESC);

-- 3. advisory_reports table (referenced by report-core + cron but missing).
-- Lightweight schema sufficient for the audit dashboard + cron skip logic.
CREATE TABLE IF NOT EXISTS public.advisory_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start date,
  period_end date,
  metrics_snapshot jsonb DEFAULT '{}'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'generated',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.advisory_reports TO authenticated;
GRANT ALL ON public.advisory_reports TO service_role;
ALTER TABLE public.advisory_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own advisory_reports"
  ON public.advisory_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE INDEX IF NOT EXISTS idx_advisory_reports_user ON public.advisory_reports(user_id, created_at DESC);

-- 4. Auto-promote the first user as admin (so the audit page is reachable
-- without a manual SQL step). After someone is admin, normal members are
-- created as 'member' via the existing handle_new_user logic.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_admin boolean;
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  )
  ON CONFLICT (id) DO NOTHING;

  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO v_has_admin;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN v_has_admin THEN 'member'::app_role ELSE 'admin'::app_role END)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 5. RPC for admin dashboard: pulls one consolidated row per user.
-- SECURITY DEFINER + explicit admin check; returns auth.users fields the
-- service role can see but the admin client cannot read directly.
CREATE OR REPLACE FUNCTION public.admin_audit_overview()
RETURNS TABLE (
  user_id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  providers text[],
  plaid_item_count int,
  plaid_status text,
  plaid_account_count int,
  sub_plan text,
  sub_status text,
  sub_period_end timestamptz,
  last_report_at timestamptz,
  last_report_status text,
  last_webhook_source text,
  last_webhook_type text,
  last_webhook_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email::text,
    u.created_at,
    u.last_sign_in_at,
    COALESCE(ARRAY(SELECT DISTINCT i.provider FROM auth.identities i WHERE i.user_id = u.id), ARRAY[]::text[]),
    (SELECT count(*)::int FROM public.plaid_items pi WHERE pi.user_id = u.id),
    (SELECT pi.status FROM public.plaid_items pi WHERE pi.user_id = u.id ORDER BY pi.created_at DESC LIMIT 1),
    (SELECT count(*)::int FROM public.plaid_accounts pa WHERE pa.user_id = u.id),
    (SELECT s.price_id FROM public.subscriptions s WHERE s.user_id = u.id ORDER BY s.created_at DESC LIMIT 1),
    (SELECT s.status FROM public.subscriptions s WHERE s.user_id = u.id ORDER BY s.created_at DESC LIMIT 1),
    (SELECT s.current_period_end FROM public.subscriptions s WHERE s.user_id = u.id ORDER BY s.created_at DESC LIMIT 1),
    (SELECT r.created_at FROM public.advisory_reports r WHERE r.user_id = u.id ORDER BY r.created_at DESC LIMIT 1),
    (SELECT r.status FROM public.advisory_reports r WHERE r.user_id = u.id ORDER BY r.created_at DESC LIMIT 1),
    (SELECT w.source FROM public.webhook_events w WHERE w.user_id = u.id ORDER BY w.received_at DESC LIMIT 1),
    (SELECT w.event_type FROM public.webhook_events w WHERE w.user_id = u.id ORDER BY w.received_at DESC LIMIT 1),
    (SELECT w.received_at FROM public.webhook_events w WHERE w.user_id = u.id ORDER BY w.received_at DESC LIMIT 1)
  FROM auth.users u
  ORDER BY u.created_at DESC
  LIMIT 500;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_audit_overview() TO authenticated;
