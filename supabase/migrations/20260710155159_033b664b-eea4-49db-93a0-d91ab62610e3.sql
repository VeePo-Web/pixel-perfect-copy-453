GRANT SELECT (id, user_id, plaid_item_id, institution_id, institution_name, institution_logo, status, last_synced_at, cursor, created_at, updated_at)
  ON public.plaid_items TO authenticated;