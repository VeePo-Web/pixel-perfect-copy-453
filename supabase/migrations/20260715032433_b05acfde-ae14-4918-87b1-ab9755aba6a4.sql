ALTER TABLE public.advisory_reports
  ADD COLUMN IF NOT EXISTS narrative jsonb,
  ADD COLUMN IF NOT EXISTS subject_line text,
  ADD COLUMN IF NOT EXISTS coverage_pct numeric,
  ADD COLUMN IF NOT EXISTS verification_passed boolean,
  ADD COLUMN IF NOT EXISTS verification_notes jsonb,
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS generation_error text,
  ADD COLUMN IF NOT EXISTS generated_at timestamptz;