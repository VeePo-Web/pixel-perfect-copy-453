-- =========================================================================
-- BI-WEEKLY REPORT — EMAIL DELIVERY LAYER (additive, forward-only)
-- Makes the emailed advisory report world-class on the delivery side:
--   * report_email_deliveries — one ledger row per report (UNIQUE report_id).
--       Idempotency: the cron can re-run and never double-emails a report.
--       Durability: every attempt is recorded; failures retried with backoff.
--       Observability: status + provider_message_id + last_error per report.
--   * email_preferences — per-user advisory-email opt-out + an unguessable
--       unsubscribe_token (CAN-SPAM List-Unsubscribe one-click).
-- RLS deny-by-default: a user may READ their own delivery/preference rows;
-- ALL writes go through edge functions (service_role). The unsubscribe edge
-- function flips the flag by token (no session required).
-- =========================================================================

-- EMAIL PREFERENCES (opt-out + unsubscribe token)
CREATE TABLE public.email_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  advisory_report_enabled BOOLEAN NOT NULL DEFAULT true,
  unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_email_pref_token ON public.email_preferences (unsubscribe_token);
GRANT SELECT ON public.email_preferences TO authenticated;
GRANT ALL ON public.email_preferences TO service_role;
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own email preferences" ON public.email_preferences
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER email_preferences_set_updated_at BEFORE UPDATE ON public.email_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- REPORT EMAIL DELIVERIES (delivery ledger — idempotency + retry + log)
-- status: pending | sent | failed | suppressed
-- UNIQUE(report_id): exactly one delivery record per report, so a duplicate
-- cron run can NEVER email the same report twice.
CREATE TABLE public.report_email_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL UNIQUE REFERENCES public.advisory_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  provider_message_id TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  last_attempt_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.report_email_deliveries TO authenticated;
GRANT ALL ON public.report_email_deliveries TO service_role;
ALTER TABLE public.report_email_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own report deliveries" ON public.report_email_deliveries
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX idx_report_deliveries_retry
  ON public.report_email_deliveries (status, last_attempt_at)
  WHERE status = 'failed';
CREATE INDEX idx_report_deliveries_user ON public.report_email_deliveries (user_id, created_at DESC);
CREATE TRIGGER report_email_deliveries_set_updated_at BEFORE UPDATE ON public.report_email_deliveries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
