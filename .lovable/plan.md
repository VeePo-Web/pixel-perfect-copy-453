# Plaid MFA Attestation — Downloadable Answer Document

A short, Plaid-review-ready document that directly answers Plaid's question:

> "Is multi-factor authentication (MFA) in place for access to critical systems that store or process consumer financial data?"

This is purpose-built for the Plaid Production Access questionnaire — one declarative answer up front, then the evidence Plaid reviewers expect to see, then a pointer to the full MFA Policy already published at `/mfa-policy`.

## What gets built

1. **Markdown source** — `docs/plaid/mfa-attestation.md`
   - **Answer:** Yes. Every account that can reach a critical system storing or processing consumer financial data authenticates via MFA. There is no password-only path.
   - **Critical systems in scope:** GoldFin portal, admin dashboard, edge functions that call Plaid, the Lovable Cloud database holding Plaid-derived rows, the Plaid Dashboard, Stripe Dashboard, Resend, and the source-code repository.
   - **Per-system control table:** for each critical system → who can access, MFA factors enforced, evidence/reference.
   - **End-user MFA:** Email OTP (6-digit, 10-min TTL, single-use, rate-limited) or Google OAuth with 2-Step Verification required. NIST AAL2.
   - **Privileged/admin MFA:** Same passwordless flow + `has_role()` RLS check; no separate admin password.
   - **Vendor consoles:** Plaid, Stripe, Resend, Lovable Cloud, GitHub — MFA enforced on every operator account; recovery codes stored in a sealed vault.
   - **Enforcement evidence:** no password form exists in the product; legacy `/signup` and `/reset-password` routes redirect to `/portal/login`; every edge function re-verifies `auth.uid()`; Plaid Link requires a fresh-auth assertion within 30 minutes.
   - **Attestation block:** signed by Chris Sam, Founder, with date and version.
   - **Pointer:** "Full policy and quarterly review cadence: `goldfindesk.com/mfa-policy` (downloadable PDF)."

2. **PDF generator** — `scripts/build-mfa-attestation-pdf.py`
   - Same reportlab styling as the existing MFA Policy and Plaid Operations PDFs (navy headings, gold rule, consistent header/footer) so it slots into the same Plaid submission packet.
   - Writes `/mnt/documents/goldfin-mfa-attestation.pdf` and `public/downloads/goldfin-mfa-attestation.pdf`.
   - Visual QA: render every page to JPG and inspect before delivery.

3. **Web page** — `src/pages/legal/MfaAttestation.tsx` at route `/mfa-attestation`
   - Same layout primitives as `MfaPolicy.tsx` (no new design system).
   - Prominent "Download PDF" button.
   - Cross-link back to `/mfa-policy` and `/plaid-operations`.

4. **Wiring**
   - Register the route in `src/portal/PortalRouter.tsx` (lazy import + case branch + `isPortalRoute`).
   - Add a "MFA Attestation" footer link in `src/components/footer/GoldFinFooter.tsx` next to "MFA Policy".

5. **In-chat artifact**
   - Surface the generated PDF as a `<presentation-artifact>` so you can download it from this chat and upload it as the answer to that exact Plaid question.

## What is NOT in scope

- No auth changes, no schema changes, no edge-function changes — the MFA system already exists; this is documentation of it.
- No new design tokens; reuse the existing trust-page styling.

Approve and I'll build it and drop the PDF in chat.