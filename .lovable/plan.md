
# Goldfin Portal — Passwordless Auth Rebuild

## Goal

Users sign in with **Google** (one click) or, as a fallback, with a **6-digit code emailed to them**. No passwords, no signup form, no confirmation links. The rest of the system (Plaid bank connect → biweekly Stripe-gated advisory reports) stays exactly as built.

## Reality check on "no Lovable"

Lovable Cloud is the backend (database, edge functions, Stripe webhooks, Plaid token storage). It cannot be removed without rebuilding the entire app on another stack. What we *can* remove is any user-visible trace of it: no Lovable branding, no Lovable login UI, no Supabase email templates. From the user's perspective the auth is "Sign in with Google" on `goldfindesk.com`, full stop.

## Scope of changes

### 1. Auth UX (frontend)

Replace the current `/portal/signup` + `/portal/login` + `/portal/verify` with a **single page** at `/portal/login`:

```text
┌─────────────────────────────────────┐
│  Goldfin Desk                       │
│                                     │
│  [  Continue with Google  ]         │
│                                     │
│  ─────────  or  ─────────           │
│                                     │
│  Email address                      │
│  [____________________]             │
│  [  Email me a code  ]              │
└─────────────────────────────────────┘
```

After "Email me a code" → second step on same route shows 6-digit input → verified → `/portal/accounts`.

- Delete `src/pages/portal/Signup.tsx`
- Rewrite `src/pages/portal/Login.tsx` as the unified entry
- Keep `PortalOtpVerify.tsx` logic but inline it as a step in `Login.tsx`
- Remove all password fields, "forgot password", and "create account" links from the app
- Update any "Sign up" CTAs on marketing pages to point to `/portal/login`

### 2. Google Sign-In

- Use Lovable Cloud managed Google OAuth (zero config, no client ID/secret needed from user)
- Configure via `supabase--configure_social_auth` with `providers: ["google"]` and `disable_providers: ["email"]` … but keep email enabled because OTP path still needs it. So actually: enable `google`, leave `email` enabled (OTP rides on it), do not disable.
- Call `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/portal/accounts" })` — but per Lovable rules `redirect_uri` cannot be a protected route, so use `${window.location.origin}/portal/login` and let the post-session effect navigate to `/portal/accounts`.

### 3. Email OTP (fallback)

Two options for the email-code path:

- **Option A (recommended):** Use Supabase native `signInWithOtp({ email })` — sends a 6-digit code via Supabase Auth (email magic-link/OTP). One built-in mechanism, no custom edge functions, no custom OTP table. Verified with `verifyOtp({ email, token, type: 'email' })`.
- **Option B:** Keep our custom `send-login-otp` / `verify-login-otp` edge functions and `login_otps` table (already built, already wired to Resend with our branded template).

Recommendation: **Option B** — we already have branded emails going through `noreply@goldfindesk.com` via Resend, and the table is in place. Just remove the "password check first" step so it becomes pure passwordless: email → OTP → session. Reuse existing functions, just stop requiring a prior password verification.

### 4. Backend changes

- Drop the password requirement: `send-login-otp` already accepts just an email; remove any caller code that gates it behind a password.
- After OTP verification, mint a Supabase session for that email (the function already does this via admin `generateLink` or magic-link flow — confirm it does, otherwise add it).
- Profile auto-creation trigger (`handle_new_user`) already exists and works for both Google and email-OTP first-time logins. No change needed.
- Keep `ProtectedRoute.tsx` as-is (checks session).

### 5. Wipe existing test users

Run in this order via migration:
1. Delete from `public.plaid_accounts`, `public.plaid_items`, `public.subscriptions`, `public.tos_acceptances`, `public.login_otps`, `public.user_roles`, `public.profiles`
2. Delete all users from `auth.users` (via admin RPC, since we can't touch `auth` schema directly in a normal migration — use a SECURITY DEFINER function calling `auth.admin` or a one-shot edge function with service role)

Cleanest path: one-shot edge function `admin-wipe-users` using `SUPABASE_SERVICE_ROLE_KEY` to call `supabase.auth.admin.listUsers()` + `deleteUser()` for each. Invoked once, then deleted.

### 6. Auth emails

Currently Supabase sends a default confirmation email on signup. After this change there *is* no signup (Google creates the user silently; OTP creates the user on first verified code). So:

- Disable email confirmation requirement for new signups via `configure_auth` (`auto_confirm_email: true`) so OTP-created users are immediately usable.
- Our branded OTP email continues to go via Resend through `send-login-otp` — already on `noreply@goldfindesk.com`, no Lovable branding visible.

### 7. Things that DO NOT change

- Plaid Link button, account sync, webhook handling
- Stripe Checkout, customer portal, subscription gating
- `cron-run-reports` biweekly schedule + instant first-report-on-payment trigger
- All marketing pages, pricing, terms

## End-to-end flow after this change

1. User clicks "Get Started" on marketing site → `/portal/login`
2. User clicks **Continue with Google** → Google popup → returns authenticated → redirected to `/portal/accounts`
   *(or)* enters email → receives 6-digit code from `noreply@goldfindesk.com` → enters code → `/portal/accounts`
3. `/portal/accounts` → clicks "Connect bank" → Plaid Link → accounts synced
4. User goes to `/pricing` → picks plan → Stripe Checkout → returns → `payments-webhook` fires first advisory report within seconds
5. Every 13 days after, `cron-run-reports` emails the next report

Nothing in this flow shows "Lovable" or "Supabase" branding anywhere.

## Technical file list

**Modify:**
- `src/pages/portal/Login.tsx` (rewrite as unified Google + OTP entry)
- `src/components/portal/PortalRouter.tsx` (remove signup/verify routes)
- `src/App.tsx` (remove signup route)
- `supabase/functions/send-login-otp/index.ts` (confirm passwordless, no prior password check)
- `supabase/functions/verify-login-otp/index.ts` (confirm it mints a real session, not just a "verified" flag)
- Any marketing CTA pointing to `/portal/signup`

**Delete:**
- `src/pages/portal/Signup.tsx`
- `src/pages/portal/PortalOtpVerify.tsx` (inline into Login)

**Create:**
- `supabase/functions/admin-wipe-users/index.ts` (one-shot, deleted after run)
- Migration to clear public tables

**Tool calls:**
- `supabase--configure_social_auth` with `providers: ["google"]`
- `supabase--configure_auth` with `auto_confirm_email: true`, `disable_signup: false`, `external_anonymous_users_enabled: false`, `password_hibp_enabled: false`

## Open question I'll need to verify in build mode

Whether `verify-login-otp` currently returns a real Supabase session (access_token + refresh_token the client can set via `supabase.auth.setSession`) or just a custom "verified" flag. If the latter, I'll switch it to use `supabase.auth.admin.generateLink({ type: 'magiclink' })` server-side and complete the session client-side — standard Supabase passwordless pattern. This is small and contained.

## What you'll see when it's done

- `/portal/login` with a Google button and an email field, nothing else
- Old test accounts gone
- Sign in with your Google account in one click → land on Accounts → connect Plaid → pay → first report hits your inbox within ~30 seconds
