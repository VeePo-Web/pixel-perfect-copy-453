
-- Lead drip state: unsubscribe token + terminal flags on leads,
-- and idempotent send ledger keyed by (email, email_key).
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS unsubscribed_at timestamptz,
  ADD COLUMN IF NOT EXISTS converted_at timestamptz;

CREATE INDEX IF NOT EXISTS leads_lower_email_idx ON public.leads ((lower(email)));
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at);
CREATE INDEX IF NOT EXISTS leads_unsubscribe_token_idx ON public.leads (unsubscribe_token);

CREATE TABLE IF NOT EXISTS public.lead_email_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  email_key text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  provider_message_id text,
  UNIQUE (email, email_key)
);

CREATE INDEX IF NOT EXISTS lead_email_sends_email_idx ON public.lead_email_sends (email);
CREATE INDEX IF NOT EXISTS lead_email_sends_sent_at_idx ON public.lead_email_sends (sent_at);

GRANT ALL ON public.lead_email_sends TO service_role;
ALTER TABLE public.lead_email_sends ENABLE ROW LEVEL SECURITY;
-- Intentionally no policies: service_role bypasses RLS; all other roles denied.
