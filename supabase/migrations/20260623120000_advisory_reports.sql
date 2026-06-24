-- =========================================================================
-- ADVISORY REPORT BACKEND — data model
-- Additive, forward-only. RLS deny-by-default; users read OWN rows only;
-- all writes go through edge functions (service_role). No client writes to
-- financial data — the report engine is server-authoritative.
--
-- Tables:
--   business_profiles   — industry + entity type (drives KPI pack + tax flag)
--   plaid_transactions  — the raw Visa/bank feed, enriched + categorized (Layer 0)
--   recurring_streams   — Plaid recurring outflow/inflow streams (waste detector)
--   advisory_reports    — generated reports + the compounding MEMORY store
-- =========================================================================

-- -------------------------------------------------------------------------
-- BUSINESS PROFILE  (two onboarding answers that unlock the highest-value
-- features: industry → KPI pack + benchmark; entity_type → tax/entity flag)
-- -------------------------------------------------------------------------
CREATE TABLE public.business_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  -- restaurant | contractor | retail | agency | ecommerce | saas | professional_services | other
  industry TEXT NOT NULL DEFAULT 'other',
  -- sole_proprietor | llc_sole_prop | llc_partnership | s_corp | c_corp | unknown
  entity_type TEXT NOT NULL DEFAULT 'unknown',
  reserve_floor_months NUMERIC NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.business_profiles TO authenticated;
GRANT ALL ON public.business_profiles TO service_role;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own business profile" ON public.business_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own business profile" ON public.business_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own business profile" ON public.business_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER business_profiles_set_updated_at BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- -------------------------------------------------------------------------
-- PLAID TRANSACTIONS  (Layer 0: raw feed + enrichment + categorization)
-- amount convention follows Plaid: POSITIVE = money OUT (outflow/spend),
-- NEGATIVE = money IN (inflow/deposit) for depository accounts.
-- merchant_name_norm + category + confidence are the enrichment output.
-- -------------------------------------------------------------------------
CREATE TABLE public.plaid_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plaid_item_id UUID NOT NULL REFERENCES public.plaid_items(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  plaid_transaction_id TEXT NOT NULL UNIQUE,
  posted_date DATE NOT NULL,
  name TEXT,
  merchant_name_raw TEXT,          -- Plaid merchant_name as-given
  merchant_name_norm TEXT,         -- normalized (AMZN/Amazon.com -> "Amazon")
  amount NUMERIC NOT NULL,         -- Plaid sign convention (see header)
  iso_currency_code TEXT,
  pending BOOLEAN NOT NULL DEFAULT false,
  category_raw JSONB,              -- Plaid personal_finance_category / category[]
  category TEXT,                   -- our resolved GL/category bucket
  confidence NUMERIC NOT NULL DEFAULT 0, -- 0..1 categorization confidence
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  owner_corrected BOOLEAN NOT NULL DEFAULT false, -- set when owner fixes the category
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plaid_transactions TO authenticated;
GRANT ALL ON public.plaid_transactions TO service_role;
ALTER TABLE public.plaid_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.plaid_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
-- Owner category corrections go through an edge function (service_role), not direct write.
CREATE INDEX idx_plaid_tx_user_date ON public.plaid_transactions (user_id, posted_date DESC);
CREATE INDEX idx_plaid_tx_user_merchant ON public.plaid_transactions (user_id, merchant_name_norm);
CREATE TRIGGER plaid_transactions_set_updated_at BEFORE UPDATE ON public.plaid_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- -------------------------------------------------------------------------
-- RECURRING STREAMS  (Plaid /transactions/recurring/get — waste detector)
-- -------------------------------------------------------------------------
CREATE TABLE public.recurring_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plaid_item_id UUID NOT NULL REFERENCES public.plaid_items(id) ON DELETE CASCADE,
  stream_id TEXT NOT NULL UNIQUE,
  direction TEXT NOT NULL DEFAULT 'outflow', -- outflow | inflow
  description TEXT,
  merchant_name TEXT,
  category TEXT,
  frequency TEXT,                  -- WEEKLY | MONTHLY | ANNUALLY ...
  last_amount NUMERIC,
  average_amount NUMERIC,
  first_amount NUMERIC,            -- earliest known amount (cost-creep detection)
  last_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  status TEXT,                     -- MATURE | EARLY_DETECTION
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.recurring_streams TO authenticated;
GRANT ALL ON public.recurring_streams TO service_role;
ALTER TABLE public.recurring_streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own recurring streams" ON public.recurring_streams
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX idx_recurring_user ON public.recurring_streams (user_id);
CREATE TRIGGER recurring_streams_set_updated_at BEFORE UPDATE ON public.recurring_streams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- -------------------------------------------------------------------------
-- ADVISORY REPORTS  (generated report + the compounding MEMORY store)
-- metrics_snapshot: the exact deterministic numbers the report was built on
--   (every figure in `narrative` MUST be present here — verification layer).
-- recommendations: [{ text, bucket, dollar, deadline, acted, outcome }]
--   carried forward so the next report can ask "did you do it?"
-- -------------------------------------------------------------------------
CREATE TABLE public.advisory_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start DATE,
  period_end DATE,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | generated | failed | sent
  metrics_snapshot JSONB,               -- the grounded numbers (source of truth)
  narrative JSONB,                      -- [{ key, heading, body }] generated sections
  recommendations JSONB,                -- [{ text, bucket, dollar, deadline, acted, outcome }]
  subject_line TEXT,
  coverage_pct NUMERIC,
  verification_passed BOOLEAN,
  verification_notes JSONB,             -- orphan numbers / coverage flags if any
  model TEXT,                           -- claude-opus-4-8
  generation_error TEXT,
  generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.advisory_reports TO authenticated;
GRANT ALL ON public.advisory_reports TO service_role;
ALTER TABLE public.advisory_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reports" ON public.advisory_reports
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX idx_reports_user_created ON public.advisory_reports (user_id, created_at DESC);
