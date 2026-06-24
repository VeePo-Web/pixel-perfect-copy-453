# Goldfin Desk portal — port VeePo's auth flow + harden Terms

## 1. Research synthesis (informs the build, not delivered as a doc)

I'll align the auth UX and the legal text with what serious read-only finance tools actually ship:

- **Plaid (the data conduit itself):** their End User Privacy Policy and Acceptable Use Policy disclaim warranty, cap aggregator liability, and make the financial institution the source of truth. Every downstream app inherits this framing.
- **Wave Accounting:** password + email-OTP second factor for portal sign-in; per-bank reconnect only when the bank's token breaks. No periodic forced reauth.
- **Mercury / Ramp / Brex:** password + TOTP (we're going email-OTP per your choice), Plaid Link reauth is event-driven on `ITEM_LOGIN_REQUIRED` / `PENDING_EXPIRATION`. Status badges per account: Connected / Action needed / Disconnected.
- **Copilot Money, Monarch, Rocket Money:** identical Plaid event-driven reauth model; "Fix connection" CTA on each account card.
- **ToS patterns common to all of the above:** read-only disclaimer, "we are not your fiduciary," third-party-breach disclaimer (Plaid, FI, cloud, subprocessors), no warranty of data accuracy, limitation of liability capped at fees paid in the last 3 months or $100, mandatory arbitration + class-action waiver, indemnification, user-responsibility-for-credentials clause.

The current `src/pages/legal/Terms.tsx` already covers most of this — I'll tighten it with the missing patterns (force-majeure, aggregator-specific carve-outs, data-export-on-termination, no-SLA, beta/sandbox disclaimer, AI-generated-content disclaimer for the briefings).

## 2. What gets replaced

**Removed:**
- `src/pages/portal/MfaSetup.tsx`, `MfaVerify.tsx`
- `supabase/functions/mfa-enroll/`, `mfa-verify/`
- `mfa_factors`, `mfa_backup_codes` tables + `mfa_status()` RPC (kept only if you want them archived — default: drop)

**Ported from VeePo (rebranded Goldfin Desk, light "paper" theme not VeePo's dark — unless you say otherwise):**
- `PortalLogin` — email + password, caps-lock detection, 5-attempt lockout w/ 30s cooldown, then transitions to OTP screen
- `PortalOtpVerify` — 6-digit InputOTP, masked email, resend cooldown, remaining-attempts counter
- `useLoginOtp` hook — calls `send-login-otp` edge function
- `PortalProtectedRoute` — checks session + OTP-verified flag, redirects with `from` location
- `AuthLoadingScreen` — branded spinner while session resolves
- `PortalLayout` shell adapted to Goldfin's `bg-paper / text-ink` tokens
- `ForgotPassword` + `ResetPassword` pages

## 3. New backend

**Edge functions:**
- `send-login-otp` — generates 6-digit code, hashes (bcrypt), stores in `login_otps` with 10-min TTL + attempts counter, enqueues branded email
- `verify-login-otp` — checks hash, increments attempts, on success sets a `portal_sessions.otp_verified_at`, returns OK; locks after 5 wrong codes

**DB migration:**
- `login_otps(user_id, code_hash, expires_at, attempts, consumed_at)` + RLS (service-role only)
- `portal_sessions(user_id, session_id, otp_verified_at, ip, user_agent)` + RLS (user reads own)
- Drop `mfa_factors`, `mfa_backup_codes`, `mfa_status()`

**Branded email template (one new transactional template):**
- `login-otp.tsx` in `_shared/transactional-email-templates/` — Goldfin-branded, plain, the 6-digit code prominently, "expires in 10 minutes," "didn't request this? change your password" footer
- Registered in `registry.ts`; sent via existing `send-transactional-email` infra (will scaffold email infra if not yet present)

## 4. Plaid behavior (unchanged from current sandbox flow)

- Initial connect: existing `PlaidLinkButton` create-mode
- Reauth: only when webhook delivers `ITEM_LOGIN_REQUIRED` (sets `status='reauth_required'`); Accounts page shows "Reconnect" CTA that opens Plaid Link in update mode for that specific item
- No periodic force-reauth, no per-session reauth — matches Mercury/Ramp/Copilot/Wave

## 5. Terms rewrite (`src/pages/legal/Terms.tsx`)

Keep current 16 sections, harden with:
- New §6a force majeure (acts of God, cyberattacks, cloud-provider failure, regulatory action)
- Tightened §6 third-party clause to enumerate Plaid, Lovable Cloud, Supabase, Stripe, Resend, OpenAI/Anthropic
- New §11a beta/sandbox disclaimer (Plaid sandbox produces synthetic data; not real)
- New §3a AI-generated content disclaimer (briefings are LLM output, may hallucinate, must be verified)
- Tightened §8 cap: greater of (a) 3 months' fees or (b) $100, plus exclusion of consequential damages even for gross negligence where law allows
- New §7a no-SLA clause
- New §11b data export on termination (30-day window to export, then purged)
- Bump `TOS_VERSION` in `src/lib/portal/tos.ts` → forces all existing users to re-accept

## 6. Files changed

```text
DELETE
  src/pages/portal/MfaSetup.tsx
  src/pages/portal/MfaVerify.tsx
  supabase/functions/mfa-enroll/
  supabase/functions/mfa-verify/

REPLACE
  src/pages/portal/Login.tsx
  src/pages/portal/ForgotPassword.tsx
  src/pages/portal/ResetPassword.tsx
  src/components/portal/ProtectedRoute.tsx
  src/components/portal/PortalLayout.tsx
  src/components/portal/AuthShell.tsx
  src/portal/PortalRouter.tsx
  src/pages/legal/Terms.tsx
  src/lib/portal/tos.ts  (version bump)

CREATE
  src/components/portal/PortalOtpVerify.tsx
  src/components/portal/AuthLoadingScreen.tsx
  src/hooks/useLoginOtp.ts
  supabase/functions/send-login-otp/index.ts
  supabase/functions/verify-login-otp/index.ts
  supabase/functions/_shared/transactional-email-templates/login-otp.tsx
  (migration: login_otps, portal_sessions, drop mfa_*)
```

## 7. Verification

Reuse the existing Playwright harness under `/tmp/browser/plaid-e2e/`:
1. Signup → confirmation
2. Login with password → email OTP screen
3. Read OTP from `email_send_log` (sandbox shortcut) → submit → land on `/portal`
4. Wrong OTP 5× → locked
5. Accept new ToS version → `tos_acceptances` row at bumped version
6. Plaid Link → connect → accounts visible
7. Fire `ITEM_LOGIN_REQUIRED` webhook → "Reconnect" CTA appears on that item only
8. Remove item → cascade clean

## Out of scope

- Periodic forced reauth (you chose event-driven)
- TOTP / authenticator app support (dropped per your choice)
- Marketing emails, password complexity meters, social login (Google) — say the word and I'll add Google after this lands
- Visual/design overhaul of marketing site

## Open assumption — say if wrong

Goldfin Desk's portal stays on the current **light "paper" theme**, not VeePo's dark `portal-theme`. The structure, lockout, OTP screen, and protected-route logic are ported; the visual tokens stay Goldfin. If you want the literal VeePo dark look in the portal too, tell me and I'll port the `portal-theme` CSS variables as well.
