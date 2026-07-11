
-- 1. Revoke public EXECUTE on destructive/admin SECURITY DEFINER functions.
--    These must only be callable by the service_role (edge functions, cron).
REVOKE EXECUTE ON FUNCTION public.run_retention_sweep() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.admin_audit_overview() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.upsert_cron_secret(text) FROM PUBLIC, anon, authenticated;

-- has_role stays callable — RLS policies invoke it as the calling role.
-- plaid_get/set_access_token and _plaid_token_key are already service_role only.

-- 2. Webhook event idempotency: dedupe on (source, external_id) when both present.
CREATE UNIQUE INDEX IF NOT EXISTS webhook_events_source_external_id_key
  ON public.webhook_events (source, external_id)
  WHERE external_id IS NOT NULL;
