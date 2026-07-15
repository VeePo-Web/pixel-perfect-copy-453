ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS internal_test_allow boolean NOT NULL DEFAULT false;