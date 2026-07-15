-- =========================================================================
-- SECURITY FIX (2026-07-15): profiles.internal_test_allow was self-settable.
-- The profiles UPDATE policy is own-row (auth.uid() = id) with a table-wide
-- column grant, so any authenticated user could PATCH internal_test_allow=true
-- and bypass the advisory-report paywall — confirmed exploitable live.
--
-- Primary fix is in code (report-eligibility.ts no longer trusts this column;
-- the internal-test bypass is now the ADVISORY_TEST_EMAILS server secret).
-- This migration is defense-in-depth at the DB layer: a BEFORE UPDATE trigger
-- forces internal_test_allow to keep its prior value unless the write comes
-- from a role that bypasses RLS (service_role / postgres). Idempotent + additive.
-- =========================================================================
DO $$
BEGIN
  -- Reset any values a user may have already self-granted before this fix.
  UPDATE public.profiles SET internal_test_allow = false WHERE internal_test_allow = true;
EXCEPTION WHEN undefined_column THEN
  RAISE NOTICE 'internal_test_allow column absent; nothing to reset';
END $$;

CREATE OR REPLACE FUNCTION public.protect_internal_test_allow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only privileged, RLS-bypassing roles may change this flag. Regular
  -- authenticated/anon requests come through PostgREST as 'authenticated' /
  -- 'anon'; for those, silently pin the column to its existing value.
  IF NEW.internal_test_allow IS DISTINCT FROM OLD.internal_test_allow
     AND current_setting('request.jwt.claims', true) IS NOT NULL
     AND coalesce(current_setting('request.jwt.claim.role', true),
                  (current_setting('request.jwt.claims', true)::json ->> 'role'),
                  '') <> 'service_role'
  THEN
    NEW.internal_test_allow := OLD.internal_test_allow;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS profiles_protect_internal_test_allow ON public.profiles;
CREATE TRIGGER profiles_protect_internal_test_allow
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_internal_test_allow();
