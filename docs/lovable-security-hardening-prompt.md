# LOVABLE PROMPT — Security Hardening (edge-function authorization)
## Copy-paste into Lovable. Full context: `docs/security-audit-2026-07-15.md`.

A security audit + live pentest of the deployed project found the data layer
sound (RLS on everywhere, bank tokens encrypted, webhooks fail-closed) but the
**edge-function authorization layer** has holes. One CRITICAL paywall-bypass was
already fixed in the repo (`report-eligibility.ts` + migration
`20260715230000_lock_internal_test_allow.sql`) and needs deploying. Fix the rest
below, in order. Do not change RLS or the Plaid token encryption — those are good.

## Hard constraints
- No secret in git. New guards read edge-function secrets / Vault.
- Do not break internal callers: `payments-webhook` and `cron-run-reports` invoke
  `send-email` via `supabase.functions.invoke` using the **service-role** client —
  any new guard on `send-email` must still let a service-role caller through.
- Migrations additive + forward-only, defensive `DO $$ ... EXCEPTION` pattern.
- Reuse the existing `timingSafeEqual` helper (in `resend-webhook`) for all
  shared-secret comparisons.
- Report results as a checklist with the actual observed status codes from a
  re-test, not "should work".

### TASK 1 — Deploy the CRITICAL paywall-bypass fix (already in repo)
1. Redeploy edge functions so `report-eligibility.ts` (no longer trusts
   `profiles.internal_test_allow`) is live, and apply migration
   `20260715230000_lock_internal_test_allow.sql`.
2. Set the `ADVISORY_TEST_EMAILS` secret (comma-separated internal test emails)
   if you want an internal-test bypass; otherwise leave it unset (paywall-only).
3. **Re-test:** fresh signup → `PATCH /rest/v1/profiles {"internal_test_allow":true}`
   → confirm read-back is still `false` (trigger pinned it) → `generate-advisory-report`
   → must be `402 subscription_required`. Before the fix this returned `422`.

### TASK 2 — 🔴 Lock down `send-email` (open relay)
`send-email` currently sends arbitrary `from`/`to`/`subject`/`html` to anyone with
the public anon key. Require a service-role/internal caller:
- Verify the caller's JWT role is `service_role` (decode the `Authorization`
  bearer and check the `role` claim), OR require a shared `X-Internal-Secret`
  header matching a new `INTERNAL_FN_SECRET` (timing-safe). Reject otherwise (401).
- Keep `from` pinned to your verified domain — do not let callers set an arbitrary
  `from` even when authorized; use a fixed `RESEND_FROM`.
- Confirm `payments-webhook` (welcome email) and any report-delivery path still
  succeed after the guard (they call with the service-role client).
- **Re-test:** the raw anon-key call must now return 401.

### TASK 3 — 🔴 Authenticate `create-checkout`; derive identity server-side
- Flip to real auth: require `getUserFromRequest`; derive `userId` and
  `customerEmail` from the **verified JWT**, not the request body. The body should
  carry only the `plan` and `returnUrl`.
- If anonymous (logged-out) checkout is a product requirement, keep it but then do
  NOT accept a body `userId` at all — create a customer purely from the
  Stripe-collected email, and let `payments-webhook` link `user_id` later by email.
- **Re-test:** a call with a spoofed body `userId` must not attach that id to the
  session/subscription.

### TASK 4 — 🟠 `admin-wipe-users`: stop reusing CRON_SECRET, add role check (or delete)
- Preferred: delete the function (its comment says "delete after launch").
- If kept: gate on `getUserFromRequest` + `has_role(auth.uid(),'admin')` AND a
  dedicated `ADMIN_WIPE_SECRET` (not `CRON_SECRET`), timing-safe compared.

### TASK 5 — 🟠 Gate `send-template-email` + `bootstrap-cron-secret`
- `send-template-email`: same treatment as TASK 2 (service-role / internal secret).
  It's invoked server-side from `lib/leads.ts` via the client — confirm that path
  still works, or move the invocation server-side.
- `bootstrap-cron-secret`: require `has_role(...,'admin')` or an internal secret.

### TASK 6 — 🟠 Rate-limit `send-login-otp` + fix the 200-user lookup bug
- Add per-email + per-IP rate limiting (e.g. max 3 OTP sends per email per 15 min,
  and a per-IP cap) — reuse or mirror the `generate-briefing` limiter, but back it
  with a table (in-memory resets per edge instance).
- Fix `findOrCreateUser`: it only lists page 1 (200 users) so it creates duplicate
  accounts past 200 users. Look the user up by email via
  `admin.auth.admin.listUsers` pagination or a `profiles` email query, not a single
  200-row page.

### TASK 7 — 🟠 Rate-limit the public `leads` / `applications` INSERT
- Add a lightweight abuse control at the edge: an hCaptcha/Turnstile token check on
  the capture forms, or move the insert behind an edge function that rate-limits by
  IP. Keep the RLS `WITH CHECK (true)` (it's a public form) but stop unlimited
  scripted PII flooding.

### TASK 8 — 🟡 Cleanups
- Replace `!==` secret compares in `cron-run-reports` and `cron-retention-sweep`
  with `timingSafeEqual`.
- Remove the dead `[functions.stripe-webhook]` block from `config.toml`.
- Confirm the intended operator holds the sole `admin` role (first-signup
  auto-admin) and no stray early test account did.
- Delete the audit's throwaway accounts: `goldfin.sec.*`, `goldfin.gate.probe`,
  `goldfin.exploit.*` @gmail.com.

## Acceptance bar
1. No edge function performs a side effect (send mail, spend Stripe/AI credits,
   move money, mutate another user's data) without either a verified user JWT
   scoped to that user, a verified webhook signature, or a server-only secret.
2. The paywall cannot be bypassed by any client-writable value.
3. Public forms cannot be scripted into unbounded writes.
