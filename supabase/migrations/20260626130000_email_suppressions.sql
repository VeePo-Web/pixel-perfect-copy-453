-- =========================================================================
-- EMAIL DELIVERABILITY / SENDER-REPUTATION LAYER (additive, forward-only)
-- Fed by the Resend (Svix) webhook (supabase/functions/resend-webhook):
--   * email_suppressions — global do-not-send list. Hard bounces and spam
--       complaints are recorded here; the delivery engine never emails a
--       suppressed address again. This is what protects domain reputation —
--       repeatedly emailing dead/complaining addresses gets the sender blocked.
--   * report_email_deliveries gains lifecycle timestamps (delivered/opened/
--       clicked/bounced/complained) for full per-report observability and the
--       engagement feedback loop.
-- email_suppressions is an ops table: service_role only (RLS on, no policies).
-- =========================================================================

CREATE TABLE public.email_suppressions (
  email TEXT PRIMARY KEY,
  reason TEXT NOT NULL,            -- bounce | complaint | manual
  detail TEXT,                     -- originating event type / note
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.email_suppressions TO service_role;
ALTER TABLE public.email_suppressions ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (which bypasses RLS) may read/write.

-- Full email-lifecycle observability on each delivery.
ALTER TABLE public.report_email_deliveries
  ADD COLUMN delivered_at TIMESTAMPTZ,
  ADD COLUMN opened_at TIMESTAMPTZ,
  ADD COLUMN clicked_at TIMESTAMPTZ,
  ADD COLUMN bounced_at TIMESTAMPTZ,
  ADD COLUMN complained_at TIMESTAMPTZ;
