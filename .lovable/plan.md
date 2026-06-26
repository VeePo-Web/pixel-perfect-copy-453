# Plaid Operational Policy — Documented, Maturing, Downloadable

Goal: Stand up a formal **Plaid Integration Operations & Maturity Policy** (POMP) for Goldfin Desk, published at a public URL and available as a one-click PDF download in the chat. Include a defined review/maturity cadence so it is "constantly matured," not static.

## What gets built

### 1. Source-of-truth policy document
`docs/plaid/plaid-operations-policy.md` — single canonical markdown file covering:
- Scope & system description (Plaid Link, Items, Accounts, Transactions, Auth, Webhooks)
- Roles & responsibilities (Owner: Chris Sam; Engineering; Support)
- Environments (sandbox → production), secret management, rotation cadence
- Data flow diagram (ASCII) + data classes touched (account, balance, tx, identity)
- Access control: who can read Plaid data, RLS posture, admin audit trail
- Token lifecycle: link token → public token exchange → access token storage (encrypted at rest), revocation on user delete
- Webhook handling: signature verification, retry, dead-letter logging in `webhook_events`
- Incident response runbook: detection → containment (rotate `PLAID_*` secrets, revoke items) → notification SLAs
- Change management: every Plaid-affecting PR must update this doc + bump `POLICY_VERSION`
- Vendor management: Plaid as sub-processor, EUDPA + DPA references
- Retention alignment (links to `/data-retention`)
- Maturity model: levels 1–5 (Initial → Optimizing) with current self-assessed level and target
- Review cadence: quarterly review logged in `retention_policy_reviews` (reused table, new `policy_type` filter) — surfaced on admin Audit dashboard
- Change log table at bottom (version, date, author, summary)

### 2. Public web page
`src/pages/legal/PlaidOperations.tsx` route `/plaid-operations` — renders the policy as styled HTML with TOC, "Last reviewed" badge, "Download PDF" button.

### 3. Downloadable PDF (chat-deliverable)
Generate `/mnt/documents/goldfin-plaid-operations-policy.pdf` from the markdown via `reportlab` so the user can download it directly from this chat, and host the same file at `/downloads/goldfin-plaid-operations-policy.pdf` (copied into `public/`) so the web page's Download button works.

### 4. Constant maturity wiring
- New row in admin Audit dashboard: "Plaid Operations Policy — last reviewed: <date> — [Record review]"
- Reuse existing `retention_policy_reviews` table by adding a `policy_type` text column (default `'retention'`); insert `'plaid_ops'` rows on review
- Sign-in time check: if `PLAID_OPS_POLICY_VERSION` in `src/lib/portal/tos.ts` is newer than the user's last-acknowledged version AND user is admin, show a banner prompting re-review

### 5. Discoverability
- Footer legal nav: add "Plaid Operations"
- Link from `/data-retention` and `/terms`
- Link from Portal Settings → Compliance section

## Technical notes
- One small migration: `alter table public.retention_policy_reviews add column policy_type text not null default 'retention';`
- PDF generation script: `scripts/build-plaid-policy-pdf.ts` (run once during this turn; output committed to `public/downloads/`)
- No new edge functions, no new secrets
- No changes to Plaid runtime code paths

## Deliverables in chat after build
- Public link: `/plaid-operations`
- `<presentation-artifact>` for `goldfin-plaid-operations-policy.pdf` so you can download it directly here
