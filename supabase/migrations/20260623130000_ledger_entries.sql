-- =========================================================================
-- LEDGER ENTRIES — spreadsheet-template intake (Cycle-4 canonical schema)
-- For businesses without a clean accounting feed: the owner uploads a simple
-- template (date, kind, amount, revenue_line, category, variable). This unlocks
-- the per-line PROFIT features (contribution margin by line / "what's actually
-- profitable") that the bank feed alone can't produce.
--
-- This is the owner's OWN business data (like tos_acceptances), so authenticated
-- users may insert/delete their own rows directly (RLS own-row). It is NOT our
-- money ledger — it never touches billing/reward state.
-- =========================================================================
CREATE TABLE public.ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  kind TEXT NOT NULL DEFAULT 'cost',     -- revenue | cost
  amount NUMERIC NOT NULL,               -- positive magnitude
  revenue_line TEXT,                     -- product / service / channel
  category TEXT,
  is_variable BOOLEAN NOT NULL DEFAULT true, -- variable cost? (for contribution margin)
  description TEXT,
  source TEXT NOT NULL DEFAULT 'template',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.ledger_entries TO authenticated;
GRANT ALL ON public.ledger_entries TO service_role;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own ledger" ON public.ledger_entries
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ledger" ON public.ledger_entries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own ledger" ON public.ledger_entries
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX idx_ledger_user_date ON public.ledger_entries (user_id, entry_date DESC);
