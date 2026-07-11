ALTER FUNCTION public.plaid_get_access_token(uuid) SET search_path = public, extensions;
ALTER FUNCTION public.plaid_set_access_token(uuid, text) SET search_path = public, extensions;
-- rewrite bodies to qualify functions defensively
CREATE OR REPLACE FUNCTION public.plaid_get_access_token(_item_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, extensions
AS $function$
DECLARE v_enc bytea; v_out text;
BEGIN
  SELECT access_token_encrypted INTO v_enc
    FROM public.plaid_items WHERE id = _item_id;
  IF v_enc IS NULL THEN RETURN NULL; END IF;
  v_out := extensions.pgp_sym_decrypt(v_enc, public._plaid_token_key());
  RETURN v_out;
END $function$;

CREATE OR REPLACE FUNCTION public.plaid_set_access_token(_item_id uuid, _token text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, extensions
AS $function$
BEGIN
  UPDATE public.plaid_items
     SET access_token_encrypted = extensions.pgp_sym_encrypt(_token, public._plaid_token_key()),
         updated_at = now()
   WHERE id = _item_id;
END $function$;