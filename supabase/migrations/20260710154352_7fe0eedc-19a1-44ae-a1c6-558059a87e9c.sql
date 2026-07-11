CREATE OR REPLACE FUNCTION public.plaid_create_item(
  _user_id uuid,
  _plaid_item_id text,
  _institution_id text,
  _institution_name text,
  _status text,
  _token text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.plaid_items (
    user_id, plaid_item_id, institution_id, institution_name, status, access_token_encrypted
  ) VALUES (
    _user_id, _plaid_item_id, _institution_id, _institution_name, _status,
    pgp_sym_encrypt(_token, public._plaid_token_key())
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.plaid_create_item(uuid, text, text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.plaid_create_item(uuid, text, text, text, text, text) TO service_role;