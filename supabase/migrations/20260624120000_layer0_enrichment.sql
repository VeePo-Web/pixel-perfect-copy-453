-- =========================================================================
-- LAYER 0 ENRICHMENT — correction memory + vertical metric inputs
-- Cycle-7 build pack §4 step 1 (enrichment is the prerequisite to every
-- profit metric) and §2 (industry packs need vertical inputs).
-- Additive, forward-only. RLS deny-by-default. No destructive change to any
-- existing money/identity table.
--
-- Tables:
--   transaction_corrections  — owner "this is actually X" memory; SELF-TRAINS
--                              the categorizer (highest-precedence enrichment).
--   business_metric_inputs   — period-scoped vertical inputs (orders, billable
--                              hours, avg inventory, WIP jobs) that unlock the
--                              industry lead metric (prime cost / CM-per-order /
--                              underbilling / GMROI / utilization).
-- =========================================================================

-- -------------------------------------------------------------------------
-- TRANSACTION CORRECTIONS  (correction memory — the self-training loop)
-- One row per (user, normalized merchant). When the owner re-categorizes a
-- merchant, every future transaction from that merchant inherits the fix.
-- Writes go through the plaid-correct-transaction edge function (service_role)
-- so the correction AND the back-fill of existing rows happen atomically.
-- -------------------------------------------------------------------------
CREATE TABLE public.transaction_corrections (
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
CREATE POLICY "Users can view own corrections" ON public.transaction_corrections
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
-- INSERT/UPDATE only via edge function (service_role) — keeps the back-fill atomic.
CREATE INDEX idx_corrections_user_merchant ON public.transaction_corrections (user_id, merchant_name_norm);
CREATE TRIGGER transaction_corrections_set_updated_at BEFORE UPDATE ON public.transaction_corrections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- -------------------------------------------------------------------------
-- BUSINESS METRIC INPUTS  (period-scoped vertical inputs)
-- The owner's OWN business data (like ledger_entries), so authenticated users
-- may manage their own rows directly. The report engine reads it (service_role)
-- and computes the industry lead metric ONLY when the needed inputs exist —
-- never guesses a vertical number.
-- inputs JSON shape (all optional):
--   { orders, billableHours, availableHours, avgInventory,
--     jobs: [{ name, pctComplete, contract, billed }] }
-- -------------------------------------------------------------------------
CREATE TABLE public.business_metric_inputs (
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
CREATE POLICY "Users can view own metric inputs" ON public.business_metric_inputs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own metric inputs" ON public.business_metric_inputs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own metric inputs" ON public.business_metric_inputs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own metric inputs" ON public.business_metric_inputs
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX idx_metric_inputs_user_period ON public.business_metric_inputs (user_id, period_end DESC);
CREATE TRIGGER business_metric_inputs_set_updated_at BEFORE UPDATE ON public.business_metric_inputs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
