
-- Drop old TOTP MFA
DROP FUNCTION IF EXISTS public.mfa_status(uuid);
DROP TABLE IF EXISTS public.mfa_backup_codes;
DROP TABLE IF EXISTS public.mfa_factors;

-- Email OTP store
CREATE TABLE public.login_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  consumed_at timestamptz,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX login_otps_user_active_idx
  ON public.login_otps (user_id, created_at DESC)
  WHERE consumed_at IS NULL;

GRANT ALL ON public.login_otps TO service_role;
-- No grants for anon/authenticated: only edge functions touch this.

ALTER TABLE public.login_otps ENABLE ROW LEVEL SECURITY;
-- No policies = no client access. service_role bypasses RLS.
