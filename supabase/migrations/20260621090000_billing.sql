-- billing_events: idempotency ledger — one row per Stripe event.
-- The webhook records every event here before handling it; processed_at is
-- set on success, cleared on retry. RLS-enabled, deny-by-default: only the
-- service role (used by the edge function) can read/write.
CREATE TABLE public.billing_events (
  id                uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id   text        NOT NULL UNIQUE,
  type              text        NOT NULL,
  payload           jsonb       NOT NULL,
  processed_at      timestamptz,
  processing_error  text,
  created_at        timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.billing_events TO service_role;

-- subscriptions: billing-state source of truth — one row per Stripe subscription.
-- Upserted on every subscription lifecycle event. RLS-enabled, deny-by-default.
CREATE TABLE public.subscriptions (
  id                     uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_customer_id     text,
  stripe_subscription_id text        UNIQUE,
  email                  text,
  plan                   text,
  status                 text,
  amount_cents           integer,
  currency               text        NOT NULL DEFAULT 'usd',
  current_period_end     timestamptz,
  canceled_at            timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX subscriptions_customer_id_idx   ON public.subscriptions (stripe_customer_id);
CREATE INDEX subscriptions_status_idx        ON public.subscriptions (status);
CREATE INDEX subscriptions_email_idx         ON public.subscriptions (email);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.subscriptions TO service_role;
