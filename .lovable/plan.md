# Close the portal-email enumeration vector

Tighten `create-portal-session` so an attacker who knows a paying customer's email can't retrieve their Stripe billing portal URL.

## Change

In `supabase/functions/create-portal-session/index.ts`:

1. **Require a valid Supabase bearer token.** If `Authorization` is missing or `supabase.auth.getUser(token)` returns no user, respond `401 unauthorized` immediately.
2. **Remove the email-only fallback branch** (lines ~50–62). The customer id is resolved solely from `subscriptions.user_id = user.id` scoped to the requested environment.
3. Keep the existing `.order('created_at', desc).limit(1).maybeSingle()` shape so returning customers with historical rows still resolve.
4. Keep the 404 for authenticated users who genuinely have no subscription in that env.

## Why this is safe for real users

- The billing portal is only reachable from the authenticated `/portal` area today (no public "manage billing by email" surface exists in `src/`).
- Post-checkout, Stripe itself emails receipts and manage-subscription links; users don't need an unauthenticated portal path.
- If you later want pre-auth self-serve, the correct pattern is a signed magic link emailed to the customer — not a public JSON endpoint that returns portal URLs by email.

## Verification after ship

- `curl POST /create-portal-session` with no bearer → **401** (was 404 leaking existence).
- `curl` with a valid bearer for a user with no sub → **404 "No subscription found"**.
- `curl` with a valid bearer for a user with an active sub → **200 `{ url }`**.

I'll run the three curls after deploy and post the results.
