# GoldFin Desk — Security Audit & Stress Test (2026-07-15)
## Live-probed against production (`paarucbnaxorpxqjecrz`) + full code/RLS/edge-authz review

Method: RLS policy trace across all 30 migrations, authorization review of all 27
edge functions + `config.toml`, client-secret scan, and **live black-box probes**
against the deployed API using only the public anon key and throwaway accounts
(read-only / own-resource only — no destructive or third-party side effects).

**Headline:** the data layer is fundamentally sound — every table has RLS on, no
cross-user read/write of financial or PII data exists, and Plaid bank tokens are
encrypted at rest and service-role-only. The problems are in the **edge-function
authorization layer** and one **privilege-escalation column**. One CRITICAL bug
was confirmed exploitable live and is fixed in this commit; the rest are handed to
Lovable with exact fixes (`docs/lovable-security-hardening-prompt.md`).

---

## Findings (most severe first)

### 🔴 CRITICAL — Paywall bypass via self-set `profiles.internal_test_allow` — FIXED HERE
**Confirmed live.** A brand-new account, with no subscription:
1. `POST /generate-advisory-report` → `402 subscription_required` (gate holds).
2. `PATCH /rest/v1/profiles?id=eq.<self>` body `{"internal_test_allow":true}` → `200`,
   read-back shows `internal_test_allow: true`.
3. `POST /generate-advisory-report` again → `422 no_transactions` — **the
   subscription gate was bypassed** (it passed eligibility and reached the
   transaction check). With a connected bank this generates full reports and
   burns AI-gateway credits for free, unlimited across throwaway signups.

Root cause: `internal_test_allow` was added as a plain column on `profiles`
(`20260715032157`), whose UPDATE policy is own-row (`auth.uid() = id`) with a
table-wide column grant — so users can write their own flag — and
`report-eligibility.ts` trusted it. A security decision was placed on a
user-writable row (violates "privilege is server-authoritative, never
client-trusted").

**Fix (this commit):** `hasReportAccess` no longer reads the column; the
internal-test bypass is now the server secret `ADVISORY_TEST_EMAILS` (matched
against the verified JWT email). Migration `20260715230000` adds DB
defense-in-depth: resets any self-granted flags and a BEFORE UPDATE trigger pins
the column against non-service_role writes. Nothing else in the codebase reads
the column (verified by grep), so removing the trust fully closes the hole.
**Still needs a Lovable/Supabase redeploy of the edge functions + migration to
take effect in production.**

### 🔴 HIGH — `send-email` is an open, unauthenticated email relay
`send-email` has no `getUserFromRequest`, no secret, no signature — only the
public anon key (embedded in the frontend) is needed. It accepts arbitrary
`from`, `to`, `subject`, `html`. Anyone can send mail as `noreply@goldfindesk.com`
to any recipient → phishing/spam from your domain, sender-reputation destruction
(which also drops the funnel + report emails into spam). Confirmed by code review;
I did **not** fire a live test (would send real mail). `send-email/index.ts:18-58`.

### 🔴 HIGH — `create-checkout` is unauthenticated and trusts body identity
`verify_jwt = false` with no `getUserFromRequest`. `userId` and `customerEmail`
come straight from the request body. An attacker can: create unlimited Stripe
customers/sessions (API-spend + clutter), mutate an existing customer's metadata
by email, and inject an arbitrary `userId` into session metadata — which
`payments-webhook` then writes as `subscriptions.user_id` and uses to kick off
report generation. Result: spoofed subscription attribution / report generation
against another user id. `create-checkout/index.ts:90-127`.

### 🟠 MEDIUM-HIGH — `admin-wipe-users`: destructive, secret-reuse, no role check
Deletes ALL rows in 7 tables and every auth user. Its only guard is `CRON_SECRET`
reused as the admin secret — the same value sent as `x-cron-secret` to cron
functions and stored in Vault (broad leak surface) — with a non-constant-time
compare and no `has_role` check. Its own comment says "delete after launch."
`admin-wipe-users/index.ts:8-43`.

### 🟠 MEDIUM — `send-template-email`: open send + audience poisoning
Same open-relay shape as `send-email` (no auth). Fixed content limits blast
radius to spam/Resend-audience-list poisoning, but it should still be gated.
`send-template-email/index.ts:50-101`.

### 🟠 MEDIUM — `send-login-otp`: no rate limit (email bombing) + lookup bug
No rate limiting → an attacker can email-bomb any address and auto-create/confirm
accounts for arbitrary emails. Separate correctness bug: `findOrCreateUser` only
lists page 1 (200 users), so past 200 users it creates duplicate accounts.
`send-login-otp/index.ts:41,55-86`.

### 🟠 MEDIUM — `leads` / `applications`: unconstrained anonymous INSERT
Both grant INSERT to `anon` with `WITH CHECK (true)` and no DB-layer rate limit —
the standard public-form pattern, and **not** a read exposure (no client SELECT),
but an unauthenticated actor can flood the marketing tables with arbitrary PII
rows. Mitigate at the edge (captcha / rate limit / hCaptcha token).
`20260619120000_leads.sql:21-25`, `20260619055049_*.sql:25-29`.

### 🟡 LOW-MEDIUM — `bootstrap-cron-secret`: no role check
Any anon-key caller can trigger the Vault upsert of `CRON_SECRET`. Idempotent and
does not disclose the secret, so low impact, but it is an unguarded admin
bootstrap. `bootstrap-cron-secret/index.ts:6-15`.

### 🟡 LOW — non-constant-time secret comparisons
`cron-run-reports` and `cron-retention-sweep` compare the shared secret with `!==`.
Timing-attack surface is small (network-noise-dominated) but the webhook functions
already use a `timingSafeEqual` helper — reuse it. `cron-run-reports/index.ts:16`.

### 🟡 LOW / informational
- **First-signup auto-admin:** `handle_new_user()` promotes the *first* user to
  `admin`, and admins can read every user's `advisory_reports` / `webhook_events`
  / `cron_runs`. Intended for the operator — confirm the intended admin is seeded
  and no stray early signup holds it.
- **`subscriptions` email-scoped SELECT:** the `auth.jwt() ->> 'email' = email`
  branch is looser than `user_id`-only, but safe (verified unique JWT email).
- **Dead config:** `[functions.stripe-webhook]` in `config.toml:12-13` points at a
  function that doesn't exist — remove it.

---

## What was verified SOUND (the good news)
- Every table has RLS enabled; no cross-user read/write of user data in the final
  schema. Live anon-key reads of `leads`, `subscriptions`, `plaid_*`,
  `advisory_reports`, `profiles`, `login_otps` all returned empty/denied.
- Live privilege-escalation probes all blocked: forge `subscriptions` row → 403,
  forge `advisory_reports` → 403, cross-user `profiles` read (IDOR) → empty,
  cross-user `leads` UPDATE/DELETE → 0 rows.
- Plaid `access_token` dropped as plaintext, stored `pgp_sym_encrypt`-encrypted,
  all client grants revoked, readable only via service-role RPC.
- Webhooks (payments/Stripe-HMAC, resend/Svix, plaid/ES256-JWT) all verify
  signatures and **fail closed** when the secret is unset.
- All `getUserFromRequest`-guarded Plaid/report/account functions enforce
  ownership before side effects.
- No server secrets (service-role key, Plaid secret, Stripe secret) exposed in the
  client bundle — only the intended public anon + Stripe publishable keys.

---

## Test artifacts to clean up (owner)
Throwaway probe accounts created during the audit (no real data attached; the
`internal_test_allow` flags they set are reset by migration `20260715230000`):
`goldfin.sec.*@gmail.com`, `goldfin.gate.probe@gmail.com`,
`goldfin.exploit.*@gmail.com`. Delete via `admin-wipe`/auth admin at convenience.

Fixes for everything above CRITICAL-excluded are specified in
`docs/lovable-security-hardening-prompt.md`.
