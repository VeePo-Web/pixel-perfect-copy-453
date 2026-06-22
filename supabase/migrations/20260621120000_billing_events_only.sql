-- billing_events: idempotency ledger for stripe-webhook.
--
-- CONTEXT: Migration 20260621090000_billing.sql conflicted with Lovable's subscriptions
-- table (20260621075235 — which Lovable already owns) because it tried to CREATE TABLE
-- public.subscriptions with different column names (plan, amount_cents, currency,
-- canceled_at). Supabase runs each migration as a single transaction, so that conflict
-- caused the ENTIRE 090000 migration to roll back — meaning billing_events was NEVER
-- created on the Supabase instance. This migration creates it safely.
--
-- ALSO: Lovable's subscriptions schema omits a UNIQUE constraint on stripe_session_id,
-- which breaks ON CONFLICT upserts for one-off payments (Clarity Report). We add a
-- partial unique index here (NULL rows = subscription rows that have no session_id are
-- excluded, so the index only enforces uniqueness where the column is non-null).

CREATE TABLE IF NOT EXISTS public.billing_events (
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

-- Performance indexes matching expected query patterns in stripe-webhook.
CREATE INDEX IF NOT EXISTS billing_events_processed_at_idx
  ON public.billing_events (processed_at)
  WHERE processed_at IS NULL;  -- quickly find unprocessed events for retry tooling

-- Partial unique index: allows NULL (subscription rows have no session_id) but
-- enforces uniqueness for one-off payment rows (Clarity Report).
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_stripe_session_id_unique
  ON public.subscriptions(stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;
