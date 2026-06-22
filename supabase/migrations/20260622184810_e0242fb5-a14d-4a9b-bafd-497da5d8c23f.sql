
-- =========================================================================
-- ROLES ENUM
-- =========================================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

-- =========================================================================
-- PROFILES
-- =========================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- =========================================================================
-- USER ROLES
-- =========================================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- =========================================================================
-- AUTO-CREATE PROFILE + DEFAULT ROLE ON SIGNUP
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- MFA FACTORS (TOTP)
-- secret column is service-role-only via column-less RLS (no SELECT policy)
-- =========================================================================
CREATE TABLE public.mfa_factors (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  totp_secret TEXT NOT NULL,
  enabled_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.mfa_factors TO service_role;
ALTER TABLE public.mfa_factors ENABLE ROW LEVEL SECURITY;
-- No policies for authenticated => no client access. All reads/writes via edge functions.

CREATE TABLE public.mfa_backup_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  used_at TIMESTAMPTZ
);
GRANT ALL ON public.mfa_backup_codes TO service_role;
ALTER TABLE public.mfa_backup_codes ENABLE ROW LEVEL SECURITY;

-- Lightweight read for the user (count of unused codes) — no hash exposure
CREATE OR REPLACE FUNCTION public.mfa_status(_user_id UUID)
RETURNS TABLE(enabled BOOLEAN, unused_backup_codes INTEGER)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    EXISTS(SELECT 1 FROM public.mfa_factors WHERE user_id = _user_id AND enabled_at IS NOT NULL),
    (SELECT COUNT(*)::int FROM public.mfa_backup_codes WHERE user_id = _user_id AND used_at IS NULL);
$$;
GRANT EXECUTE ON FUNCTION public.mfa_status(UUID) TO authenticated;

-- =========================================================================
-- PLAID ITEMS & ACCOUNTS
-- access_token hidden from clients (no SELECT policy on token column)
-- We expose a view-style policy: clients can SELECT all rows minus token
-- by using a separate column-level grant pattern via a view.
-- =========================================================================
CREATE TABLE public.plaid_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plaid_item_id TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  institution_id TEXT,
  institution_name TEXT,
  institution_logo TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active | reauth_required | disconnected
  last_synced_at TIMESTAMPTZ,
  cursor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.plaid_items TO service_role;
-- Authenticated users can read everything EXCEPT access_token (column grants)
GRANT SELECT (id, user_id, plaid_item_id, institution_id, institution_name, institution_logo, status, last_synced_at, created_at, updated_at)
  ON public.plaid_items TO authenticated;
ALTER TABLE public.plaid_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own plaid items" ON public.plaid_items
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.plaid_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plaid_item_id UUID NOT NULL REFERENCES public.plaid_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL UNIQUE,
  name TEXT,
  official_name TEXT,
  mask TEXT,
  type TEXT,
  subtype TEXT,
  iso_currency_code TEXT,
  current_balance NUMERIC,
  available_balance NUMERIC,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plaid_accounts TO authenticated;
GRANT ALL ON public.plaid_accounts TO service_role;
ALTER TABLE public.plaid_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own plaid accounts" ON public.plaid_accounts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- =========================================================================
-- TOS ACCEPTANCES
-- =========================================================================
CREATE TABLE public.tos_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tos_version TEXT NOT NULL,
  plaid_consent_version TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.tos_acceptances TO authenticated;
GRANT ALL ON public.tos_acceptances TO service_role;
ALTER TABLE public.tos_acceptances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own acceptances" ON public.tos_acceptances
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can record own acceptance" ON public.tos_acceptances
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- UPDATED_AT TRIGGER
-- =========================================================================
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER mfa_factors_set_updated_at BEFORE UPDATE ON public.mfa_factors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER plaid_items_set_updated_at BEFORE UPDATE ON public.plaid_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER plaid_accounts_set_updated_at BEFORE UPDATE ON public.plaid_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
