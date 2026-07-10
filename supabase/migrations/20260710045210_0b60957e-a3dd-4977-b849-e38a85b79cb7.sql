
-- 1. pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Ensure the encryption key exists in Vault; create if missing.
DO $$
DECLARE
  v_id uuid;
BEGIN
  SELECT id INTO v_id FROM vault.secrets WHERE name = 'plaid_token_key' LIMIT 1;
  IF v_id IS NULL THEN
    PERFORM vault.create_secret(encode(gen_random_bytes(32), 'hex'), 'plaid_token_key');
  END IF;
END $$;

-- 3. Encrypted column
ALTER TABLE public.plaid_items
  ADD COLUMN IF NOT EXISTS access_token_encrypted bytea;

-- 4. Internal key accessor (private — only referenced by the two helpers below).
CREATE OR REPLACE FUNCTION public._plaid_token_key()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
DECLARE v_key text;
BEGIN
  SELECT decrypted_secret INTO v_key
    FROM vault.decrypted_secrets
    WHERE name = 'plaid_token_key' LIMIT 1;
  IF v_key IS NULL THEN
    RAISE EXCEPTION 'plaid_token_key vault entry missing';
  END IF;
  RETURN v_key;
END $$;

REVOKE ALL ON FUNCTION public._plaid_token_key() FROM PUBLIC, anon, authenticated;

-- 5. Backfill any existing rows.
UPDATE public.plaid_items
   SET access_token_encrypted = pgp_sym_encrypt(access_token, public._plaid_token_key())
 WHERE access_token_encrypted IS NULL
   AND access_token IS NOT NULL;

-- 6. Service-role-only helpers.
CREATE OR REPLACE FUNCTION public.plaid_get_access_token(_item_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_enc bytea; v_out text;
BEGIN
  SELECT access_token_encrypted INTO v_enc
    FROM public.plaid_items WHERE id = _item_id;
  IF v_enc IS NULL THEN RETURN NULL; END IF;
  v_out := pgp_sym_decrypt(v_enc, public._plaid_token_key());
  RETURN v_out;
END $$;

CREATE OR REPLACE FUNCTION public.plaid_set_access_token(_item_id uuid, _token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.plaid_items
     SET access_token_encrypted = pgp_sym_encrypt(_token, public._plaid_token_key()),
         updated_at = now()
   WHERE id = _item_id;
END $$;

REVOKE ALL ON FUNCTION public.plaid_get_access_token(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.plaid_set_access_token(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.plaid_get_access_token(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.plaid_set_access_token(uuid, text) TO service_role;

-- 7. Make the encrypted column mandatory going forward, then drop plaintext.
ALTER TABLE public.plaid_items
  ALTER COLUMN access_token DROP NOT NULL;

ALTER TABLE public.plaid_items DROP COLUMN access_token;

ALTER TABLE public.plaid_items
  ALTER COLUMN access_token_encrypted SET NOT NULL;

-- 8. Defense-in-depth: no direct table grants to client roles.
REVOKE ALL ON public.plaid_items FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.plaid_items TO service_role;
