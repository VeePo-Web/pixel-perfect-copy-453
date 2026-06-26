# Plaid MFA Documentation — Downloadable PDF

Create a formal Multi-Factor Authentication policy document for Goldfin Desk that you can download directly from the chat and upload to Plaid's production review.

## What gets built

1. **Canonical markdown source** — `docs/plaid/mfa-policy.md`
   - Version + last-reviewed date header
   - Scope: who/what is covered (all portal users, all admins, all Plaid-linked accounts)
   - MFA mechanism: passwordless Email OTP (6-digit, 10-min TTL, single-use, rate-limited) via Resend, plus Google OAuth as a federated second-factor-equivalent identity provider
   - Enforcement: every sign-in requires OTP or Google OAuth — no password-only path exists
   - Admin access: admin role gated behind same MFA + role check in `user_roles` table
   - Session policy: JWT lifetime, refresh rotation, idle timeout, forced re-auth before Plaid Link
   - Plaid-specific controls: re-authentication required before initiating Plaid Link Token creation and before viewing connected account details
   - Account recovery: OTP-to-verified-email only; no security-question fallback
   - Logging & monitoring: `webhook_events` + auth audit trail in admin dashboard
   - Incident response: lockout, token revocation, user notification runbook
   - Review cadence: quarterly + triggered, with append-only change log

2. **Web page** — `src/pages/legal/MfaPolicy.tsx` at route `/mfa-policy`
   - Renders the policy
   - "Download PDF" button serving the file below
   - Registered in `PortalRouter.tsx` and linked from `GoldFinFooter.tsx`

3. **PDF generator + artifact** — `scripts/build-mfa-policy-pdf.py`
   - Uses `reportlab` (same pattern as the Plaid Operations policy)
   - Outputs `public/downloads/goldfin-mfa-policy.pdf`
   - Run once during build; file committed so the public URL `/downloads/goldfin-mfa-policy.pdf` works immediately

4. **In-chat download**
   - After generation, surface the PDF as an `<artifact>` block so you can download it directly from this conversation and upload to Plaid

## Technical notes

- No schema changes, no new edge functions, no auth changes — this is documentation of the MFA system that already exists (Email OTP via `send-login-otp` / `verify-login-otp` + Google OAuth).
- Footer link added alongside existing "Plaid Operations" and "Data Retention" links.
- PDF styling matches the Plaid Operations policy for visual consistency in Plaid's review packet.

Approve and I'll build it and drop the PDF in the chat.