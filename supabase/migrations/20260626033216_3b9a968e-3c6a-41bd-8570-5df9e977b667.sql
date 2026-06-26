CREATE OR REPLACE FUNCTION public.upsert_cron_secret(p_secret text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault
AS $$
DECLARE
  v_id uuid;
BEGIN
  SELECT id INTO v_id FROM vault.secrets WHERE name = 'cron_secret' LIMIT 1;
  IF v_id IS NULL THEN
    PERFORM vault.create_secret(p_secret, 'cron_secret');
  ELSE
    PERFORM vault.update_secret(v_id, p_secret);
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.upsert_cron_secret(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_cron_secret(text) TO service_role;