-- =========================================================================
-- REPAIR MIGRATION — recreates 9 tables missing due to partial apply.
-- Idempotent (IF NOT EXISTS + DROP POLICY IF EXISTS). Safe to re-run.
-- =========================================================================

-- 1) business_profiles
CREATE TABLE IF NOT EXISTS public.business_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  industry TEXT NOT NULL DEFAULT 'other',
  entity_type TEXT NOT NULL DEFAULT 'unknown',
  reserve_floor_months NUMERIC NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.business_profiles TO authenticated;
GRANT ALL ON public.business_profiles TO service_role;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own business profile" ON public.business_profiles;
CREATE POLICY "Users can view own business profile" ON public.business_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can upsert own business profile" ON public.business_profiles;
CREATE POLICY "Users can upsert own business profile" ON public.business_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own business profile" ON public.business_profiles;
CREATE POLICY "Users can update own business profile" ON public.business_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP TRIGGER IF EXISTS business_profiles_set_updated_at ON public.business_profiles;
CREATE TRIGGER business_profiles_set_updated_at BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) plaid_transactions
CREATE TABLE IF NOT EXISTS public.plaid_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plaid_item_id UUID NOT NULL REFERENCES public.plaid_items(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  plaid_transaction_id TEXT NOT NULL UNIQUE,
  posted_date DATE NOT NULL,
  name TEXT,
  merchant_name_raw TEXT,
  merchant_name_norm TEXT,
  amount NUMERIC NOT NULL,
  iso_currency_code TEXT,
  pending BOOLEAN NOT NULL DEFAULT false,
  category_raw JSONB,
  category TEXT,
  confidence NUMERIC NOT NULL DEFAULT 0,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  owner_corrected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plaid_transactions TO authenticated;
GRANT ALL ON public.plaid_transactions TO service_role;
ALTER TABLE public.plaid_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.plaid_transactions;
CREATE POLICY "Users can view own transactions" ON public.plaid_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_plaid_tx_user_date ON public.plaid_transactions (user_id, posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_plaid_tx_user_merchant ON public.plaid_transactions (user_id, merchant_name_norm);
DROP TRIGGER IF EXISTS plaid_transactions_set_updated_at ON public.plaid_transactions;
CREATE TRIGGER plaid_transactions_set_updated_at BEFORE UPDATE ON public.plaid_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) recurring_streams
CREATE TABLE IF NOT EXISTS public.recurring_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plaid_item_id UUID NOT NULL REFERENCES public.plaid_items(id) ON DELETE CASCADE,
  stream_id TEXT NOT NULL UNIQUE,
  direction TEXT NOT NULL DEFAULT 'outflow',
  description TEXT,
  merchant_name TEXT,
  category TEXT,
  frequency TEXT,
  last_amount NUMERIC,
  average_amount NUMERIC,
  first_amount NUMERIC,
  last_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.recurring_streams TO authenticated;
GRANT ALL ON public.recurring_streams TO service_role;
ALTER TABLE public.recurring_streams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own recurring streams" ON public.recurring_streams;
CREATE POLICY "Users can view own recurring streams" ON public.recurring_streams
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_user ON public.recurring_streams (user_id);
DROP TRIGGER IF EXISTS recurring_streams_set_updated_at ON public.recurring_streams;
CREATE TRIGGER recurring_streams_set_updated_at BEFORE UPDATE ON public.recurring_streams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) ledger_entries
CREATE TABLE IF NOT EXISTS public.ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  kind TEXT NOT NULL DEFAULT 'cost',
  amount NUMERIC NOT NULL,
  revenue_line TEXT,
  category TEXT,
  is_variable BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  source TEXT NOT NULL DEFAULT 'template',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.ledger_entries TO authenticated;
GRANT ALL ON public.ledger_entries TO service_role;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own ledger" ON public.ledger_entries;
CREATE POLICY "Users can view own ledger" ON public.ledger_entries
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own ledger" ON public.ledger_entries;
CREATE POLICY "Users can insert own ledger" ON public.ledger_entries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own ledger" ON public.ledger_entries;
CREATE POLICY "Users can delete own ledger" ON public.ledger_entries
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_ledger_user_date ON public.ledger_entries (user_id, entry_date DESC);

-- 5) transaction_corrections
CREATE TABLE IF NOT EXISTS public.transaction_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  merchant_name_norm TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, merchant_name_norm)
);
GRANT SELECT ON public.transaction_corrections TO authenticated;
GRANT ALL ON public.transaction_corrections TO service_role;
ALTER TABLE public.transaction_corrections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own corrections" ON public.transaction_corrections;
CREATE POLICY "Users can view own corrections" ON public.transaction_corrections
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_corrections_user_merchant ON public.transaction_corrections (user_id, merchant_name_norm);
DROP TRIGGER IF EXISTS transaction_corrections_set_updated_at ON public.transaction_corrections;
CREATE TRIGGER transaction_corrections_set_updated_at BEFORE UPDATE ON public.transaction_corrections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) business_metric_inputs
CREATE TABLE IF NOT EXISTS public.business_metric_inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_end DATE NOT NULL,
  inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, period_end)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_metric_inputs TO authenticated;
GRANT ALL ON public.business_metric_inputs TO service_role;
ALTER TABLE public.business_metric_inputs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own metric inputs" ON public.business_metric_inputs;
CREATE POLICY "Users can view own metric inputs" ON public.business_metric_inputs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own metric inputs" ON public.business_metric_inputs;
CREATE POLICY "Users can insert own metric inputs" ON public.business_metric_inputs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own metric inputs" ON public.business_metric_inputs;
CREATE POLICY "Users can update own metric inputs" ON public.business_metric_inputs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own metric inputs" ON public.business_metric_inputs;
CREATE POLICY "Users can delete own metric inputs" ON public.business_metric_inputs
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_metric_inputs_user_period ON public.business_metric_inputs (user_id, period_end DESC);
DROP TRIGGER IF EXISTS business_metric_inputs_set_updated_at ON public.business_metric_inputs;
CREATE TRIGGER business_metric_inputs_set_updated_at BEFORE UPDATE ON public.business_metric_inputs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7) email_preferences
CREATE TABLE IF NOT EXISTS public.email_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  advisory_report_enabled BOOLEAN NOT NULL DEFAULT true,
  unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_pref_token ON public.email_preferences (unsubscribe_token);
GRANT SELECT ON public.email_preferences TO authenticated;
GRANT ALL ON public.email_preferences TO service_role;
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own email preferences" ON public.email_preferences;
CREATE POLICY "Users can view own email preferences" ON public.email_preferences
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP TRIGGER IF EXISTS email_preferences_set_updated_at ON public.email_preferences;
CREATE TRIGGER email_preferences_set_updated_at BEFORE UPDATE ON public.email_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8) report_email_deliveries (with lifecycle columns from later migration)
CREATE TABLE IF NOT EXISTS public.report_email_deliveries (
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
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  complained_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.report_email_deliveries TO authenticated;
GRANT ALL ON public.report_email_deliveries TO service_role;
ALTER TABLE public.report_email_deliveries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own report deliveries" ON public.report_email_deliveries;
CREATE POLICY "Users can view own report deliveries" ON public.report_email_deliveries
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_report_deliveries_retry
  ON public.report_email_deliveries (status, last_attempt_at)
  WHERE status = 'failed';
CREATE INDEX IF NOT EXISTS idx_report_deliveries_user ON public.report_email_deliveries (user_id, created_at DESC);
DROP TRIGGER IF EXISTS report_email_deliveries_set_updated_at ON public.report_email_deliveries;
CREATE TRIGGER report_email_deliveries_set_updated_at BEFORE UPDATE ON public.report_email_deliveries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9) email_suppressions (service-role-only ops table)
CREATE TABLE IF NOT EXISTS public.email_suppressions (
  email TEXT PRIMARY KEY,
  reason TEXT NOT NULL,
  detail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.email_suppressions TO service_role;
ALTER TABLE public.email_suppressions ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (bypasses RLS) reads/writes.
