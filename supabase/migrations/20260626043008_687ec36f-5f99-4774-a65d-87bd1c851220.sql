-- One-shot wipe of all users + dependent data
DELETE FROM public.plaid_accounts;
DELETE FROM public.plaid_items;
DELETE FROM public.subscriptions;
DELETE FROM public.tos_acceptances;
DELETE FROM public.login_otps;
DELETE FROM public.user_roles;
DELETE FROM public.profiles;
DELETE FROM auth.users;