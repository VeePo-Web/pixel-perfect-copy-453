
# Goldfin Portal — Auth, Plaid, Aggressive ToS

Lift VeePo's portal login / MFA / email pattern, restyle it in the Goldfin champagne-on-charcoal system, and bolt a Plaid sandbox connector on top. New routes live behind `/portal/*` and do not touch the existing marketing site.

## 1. Database (one migration)

New public tables, all RLS-locked, all with `GRANT ... TO authenticated` + `service_role`:

- `profiles` — `id` (= `auth.users.id`), `email`, `first_name`, `last_name`, `phone`. Auto-created by trigger on `auth.users` insert.
- `user_roles` — `user_id`, `role` (`admin` | `member`). Separate table + `has_role()` security-definer function (per Lovable user-roles rule).
- `mfa_factors` — `user_id`, `totp_secret` (encrypted via pgsodium), `enabled_at`, `last_used_at`.
- `mfa_backup_codes` — `user_id`, `code_hash`, `used_at`.
- `plaid_items` — `user_id`, `item_id`, `access_token` (encrypted), `institution_name`, `institution_logo`, `status` (`active` | `reauth_required` | `disconnected`), `last_synced_at`, `cursor`.
- `plaid_accounts` — `plaid_item_id`, `account_id`, `name`, `mask`, `type`, `subtype`, `currency`, `current_balance`, `available_balance`.
- `tos_acceptances` — `user_id`, `tos_version`, `plaid_consent_version`, `accepted_at`, `ip`, `user_agent`. Required before Plaid Link can open.

RLS: every row scoped by `user_id = auth.uid()`. Service role does all writes from edge functions.

## 2. Auth + Email

- Enable email/password auth. Leaked-password (HIBP) ON. Auto-confirm email OFF (real verification flow).
- Scaffold auth email templates via the managed Lovable flow (domain `goldfindesk.com` is already verified) — signup confirm, magic link, recovery, invite, email-change, reauthentication — restyled in the Goldfin palette (champagne `#E8D9B8` CTA on `#0B0D10`, light serif headings).
- Sender: `Goldfin Desk <noreply@goldfindesk.com>`.

## 3. Frontend routes (all new, under `/portal/*`)

| Route | Purpose |
|---|---|
| `/portal/login` | Email + password. Link to forgot password. |
| `/portal/signup` | Email + password + ToS checkbox (links to `/terms` + `/plaid-consent`). |
| `/portal/forgot-password` | Sends Supabase recovery email. |
| `/portal/reset-password` | Handles `type=recovery` hash, updates password. |
| `/portal/mfa-setup` | Forced after first login. TOTP QR + 8 backup codes (shown once). |
| `/portal/mfa-verify` | 6-digit TOTP entry on every subsequent login. |
| `/portal` (dashboard) | Greeting, net cash tile, "Connect a bank" CTA when no accounts. |
| `/portal/accounts` | Connected-accounts UI: each Plaid item is a card with institution logo, account list, status badge, "Re-authenticate" + "Disconnect" buttons. "Add another account" opens Plaid Link again. |
| `/portal/settings` | Profile, change password, MFA management, sign out everywhere. |
| `/terms` | Aggressive financial-data ToS (see §5). |
| `/plaid-consent` | Separate Plaid end-user data consent page. |
| `/privacy` | Companion privacy policy. |

Shared `PortalLayout` with sidebar (Dashboard, Accounts, Settings, Sign out) + `ProtectedRoute` wrapper that:
1. Requires session.
2. Requires `mfa_factors.enabled_at IS NOT NULL` — else redirect to `/portal/mfa-setup`.
3. Requires latest `tos_acceptances` row matches current `TOS_VERSION` — else show acceptance modal.

`AuthContext` mirrors VeePo's pattern: `onAuthStateChange` listener registered first, then `getUser()` for trusted reads.

## 4. Plaid (sandbox)

Per-account re-auth, exactly like Wave's pattern. No data leaves edge functions.

Edge functions:
- `plaid-create-link-token` — mints a Link token for new connection or for `update` mode (re-auth of a specific item).
- `plaid-exchange-public-token` — public→access token, stores encrypted in `plaid_items`, pulls initial accounts.
- `plaid-sync-accounts` — refreshes balances + account list for one item.
- `plaid-remove-item` — calls `/item/remove`, deletes row.
- `plaid-webhook` — handles `ITEM_LOGIN_REQUIRED` → sets `status = 'reauth_required'`; handles transactions updates.

Secrets requested via `add_secret`: `PLAID_CLIENT_ID`, `PLAID_SANDBOX_SECRET`, `PLAID_ENV` (`sandbox`), `PLAID_WEBHOOK_SECRET`.

Frontend uses `react-plaid-link`. Link only opens after the user has accepted ToS + Plaid consent in this session.

## 5. Aggressive ToS (`/terms`) + Plaid consent (`/plaid-consent`)

Drafted as long-form legal copy, displayed in the Goldfin editorial style. Key clauses, in plain English headers with formal body:

- **Read-only access.** Goldfin Desk never initiates transactions, transfers, or trades.
- **Plaid is the data conduit.** Credentials are entered on Plaid's interface; Goldfin never sees or stores bank passwords. Plaid's privacy policy governs that exchange.
- **No fiduciary, no advice.** Information shown is for organizational purposes only; not investment, tax, or legal advice.
- **No warranty.** Service provided "AS IS." No warranty of accuracy, completeness, fitness, or availability.
- **Limitation of liability.** Maximum aggregate liability capped at fees paid in the prior 3 months. No liability for indirect, incidental, consequential, special, exemplary, or punitive damages.
- **Third-party breach disclaimer.** Goldfin is not liable for any breach, hack, outage, data loss, or unauthorized access affecting Plaid, the user's financial institution, Lovable Cloud (Supabase), Stripe, Resend, or any other subprocessor.
- **Account compromise.** User is solely responsible for credentials, devices, and MFA enrollment. Losses from compromised user accounts are not Goldfin's responsibility.
- **No guarantee of data accuracy.** Balances and categorizations may lag, error, or be wrong; user must verify against source-of-truth bank statements before any decision.
- **Indemnification.** User indemnifies Goldfin for misuse, illegal activity, or breach of these terms.
- **Termination.** Goldfin may suspend or terminate at any time, with or without notice.
- **Mandatory arbitration + class-action waiver.** Disputes resolved in binding arbitration; jury trial waived; class actions waived.
- **Governing law.** Placeholder (you fill the jurisdiction).
- **Versioning.** Material changes bump `TOS_VERSION`; user must re-accept before next portal use.

Separate Plaid consent screen lists exactly what Plaid pulls (account, balance, transactions, account/routing for one product if enabled) and requires an explicit checkbox before Link opens. Acceptance written to `tos_acceptances`.

## Technical details

- File map: `src/pages/portal/*`, `src/components/portal/*` (Layout, Sidebar, AccountCard, PlaidLinkButton, ReauthBanner), `src/components/auth/*` (ProtectedRoute, MfaSetup, MfaVerify, BackupCodes), `src/contexts/AuthContext.tsx`, `src/lib/plaid.ts`, `src/lib/tos.ts` (TOS_VERSION constant + helpers).
- Edge functions in `supabase/functions/` named above + `_shared/plaid.ts` client + `_shared/crypto.ts` for token encryption.
- `react-plaid-link`, `otpauth`, `qrcode` added via `bun add`. TOTP secrets encrypted server-side with pgsodium.
- Routing: extend `src/App.tsx` with a `/portal/*` subtree using react-router; marketing routes untouched.
- Brand styling: champagne `#E8D9B8` primary, charcoal `#0B0D10` bg, ink `#F4EFE6`; reuse existing tokens from `src/index.css`. No purple, no orbs, no SaaS gradients — same restraint as the marketing site.
- Security memory updated to note the read-only fintech posture, Plaid as conduit, RLS-locked per-user data, and that hack-liability disclaimer is intentional and legally surfaced.

## Out of scope (call out before building)

- Transactions ledger UI, categorization, reporting — Plaid items + balances only this round.
- Admin dashboard / multi-user orgs.
- Stripe linkage to portal accounts (kept on marketing site for now).
- Live Plaid (production) keys — sandbox only until you say go.
