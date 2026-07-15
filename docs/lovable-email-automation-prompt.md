# LOVABLE PROMPT — Build the GoldFin Email Automation Engine
## Copy-paste this entire prompt into Lovable as one message.

---

You are working on goldfindesk.com (this repo). The lead-generation funnel is live:
every capture form stores a lead in the `public.leads` table and the
`send-template-email` edge function instantly delivers **Email 1** — the GoldFin
Template Vault as a zip (`/downloads/goldfin-template-vault.zip`).

What does NOT exist yet is the automation that sends everything after Email 1.
The complete, final, approved copy for the whole sequence lives in
**`docs/email-sequence.md`** — Emails 2–10 (the sales spine), Branches A–E, and
Part II (the A1–A4 buyer-ascension track). Your job is to build the engine that
sends the time-based emails reliably, safely, and idempotently. Use the copy
**verbatim** — do not rewrite, "improve", or add a single word to any email body.

## Hard constraints (do not violate any of these)

1. **Do not change what Email 1 says or when it sends.** You may only add the
   unsubscribe footer + headers described below to `send-template-email`.
2. **Do not touch the advisory-report delivery system** (`cron-run-reports`,
   `report-delivery.ts`, `report_email_deliveries`, `email_preferences`). The
   marketing drip is a separate, parallel system for `leads`.
3. **Migrations are additive and forward-only.** Never edit or reorder an existing
   migration file. Follow the defensive `DO $$ ... EXCEPTION` pattern used in
   `supabase/migrations/20260623140000_schedule_reports.sql`.
4. **No secrets in git.** Everything via edge-function secrets / Vault, exactly like
   the existing functions.
5. **Voice discipline:** anything you must generate that isn't in the doc (subject
   prefixes, confirmation pages) stays calm, premium, plain-spoken. Never "unlock",
   "supercharge", emojis, or fake urgency.
6. **A lead must never receive the same email twice, and never two emails within
   48 hours.** Enforce both in the database and in the worker.

## Build piece 1 — Migration: drip state

Create a new migration that adds:

```sql
-- Lead-level drip state
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS unsubscribed_at timestamptz,
  ADD COLUMN IF NOT EXISTS converted_at timestamptz;  -- set when they buy Reports

-- Idempotent send ledger: one row per (email, email_key), ever.
CREATE TABLE IF NOT EXISTS public.lead_email_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,                 -- lowercased
  email_key text NOT NULL,             -- 'seq_2', 'seq_3', ... 'asc_a1', ...
  sent_at timestamptz NOT NULL DEFAULT now(),
  provider_message_id text,
  UNIQUE (email, email_key)
);
```

RLS: deny by default; `service_role` only. Add an index on `leads(email)` and
`leads(created_at)` if missing. The ledger is keyed by **email**, not lead id,
because the same person may submit two forms — they are one contact.

## Build piece 2 — Edge function `email-drip-worker`

A cron-triggered function (gate it with the same `x-cron-secret` header pattern as
`cron-run-reports`). Logic per run:

1. Load all leads, dedup by lowercased email keeping the EARLIEST `created_at`
   (that date anchors the schedule). Skip any email that:
   - has `unsubscribed_at` set on any of its lead rows,
   - appears in `email_suppressions` (the Resend webhook already maintains
     bounces/complaints there — reuse it),
   - has `converted_at` set → they get the ASCENSION matrix instead (below).
2. Compute `days_since_signup`. Find the highest-numbered due email from the
   **SALES MATRIX** not yet in `lead_email_sends`:

   | email_key | day offset | source in docs/email-sequence.md |
   |---|---|---|
   | seq_2  | 2  | Email 2 — bank balance is not a strategy |
   | seq_3  | 3  | Email 3 — clean books still need interpretation |
   | seq_4  | 4  | Email 4 — can you afford the next hire |
   | seq_5  | 5  | Email 5 — revenue grew, cash felt tight |
   | seq_6  | 7  | Email 6 — the direct offer ($150/mo value stack) |
   | seq_7  | 10 | Email 7 — the owner bottleneck |
   | seq_8  | 14 | Email 8 — the $150 decision |
   | seq_9  | 21 | Email 9 — the quiet guarantee |
   | seq_10 | 30 | Email 10 — should I close your file? |

   Send AT MOST ONE email per contact per run, and skip the contact entirely if
   any `lead_email_sends` row for them is newer than 48 hours. If a lead signed
   up long ago, do NOT backfill the whole spine — send only the single next one,
   each run, until caught up or the matrix ends.
3. For converted contacts (`converted_at` set), use the **ASCENSION MATRIX**
   (offsets from `converted_at`), copy from Part II of the doc:

   | email_key | day offset | source |
   |---|---|---|
   | asc_a1 | 0  | A1 — welcome + the seed |
   | asc_a2 | 3  | A2 — the gap the report can't close |
   | asc_a3 | 17 | A3 — the Epiphany Bridge case |
   | asc_a4 | 45 | A4 — the direct invitation |

   Converted contacts never receive seq_* emails; sales-spine history is irrelevant.
4. Render each email in the same minimal HTML shell used by
   `send-template-email/index.ts` (same fonts, colors, GoldFin Desk eyebrow,
   `— Chris Sam` signature). Replace `{{firstName}}` with the lead's first name
   (omit the comma-name form if it's empty or "Friend") and `{{SITE_URL}}` with
   the `SITE_URL` secret, defaulting to `https://goldfindesk.com`.
5. Send through the same Lovable Resend connector gateway
   (`https://connector-gateway.lovable.dev/resend`) with `RESEND_FROM`
   (default `Chris Sam — GoldFin Desk <noreply@goldfindesk.com>`), and set
   `reply_to` to Chris's real inbox secret `REPLY_TO_EMAIL` if present —
   replies ARE the Advisory application, they must reach a human.
6. Record the send in `lead_email_sends` BEFORE treating it as delivered (insert
   with `ON CONFLICT DO NOTHING`; if the insert conflicts, skip the send — that is
   the double-send guard under concurrent runs).
7. Every email includes:
   - a footer link: `You're receiving this because you requested the GoldFin
     Template Vault. <a href="{{SITE_URL}}/functions-or-route-to/lead-unsubscribe?token={{token}}">Unsubscribe</a>`
     (use the real edge-function URL),
   - `List-Unsubscribe` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click`
     headers pointing at the same endpoint (mirror how the advisory system does
     RFC 8058 in `email-unsubscribe`).

## Build piece 3 — Edge function `lead-unsubscribe`

Clone the shape of the existing `email-unsubscribe` function, but for `leads`:
GET renders the small branded confirmation page; POST is the RFC 8058 one-click.
It sets `unsubscribed_at = now()` on **every** lead row matching the token's
email (unsubscribe is per-person, not per-form-submission). Public route
(`verify_jwt = false` in `config.toml`), token is the auth.

## Build piece 4 — Conversion wiring

Wherever the Stripe checkout completion for the $150/mo GoldFin Reports
subscription is handled server-side, add: look up all `leads` rows by the
customer email and set `converted_at = now()` (only if null). That single flag
stops the sales spine and starts the ascension track. If there is no reliable
server-side hook available today, add the flag-setting to the checkout return
handling and say so plainly in your summary.

## Build piece 5 — Cron schedule

New migration following the `schedule_reports.sql` defensive pattern:
`cron.schedule('email-drip-hourly', '5 * * * *', ...)` → `net.http_post` to
`/functions/v1/email-drip-worker` with the Vault `cron_secret` header. Hourly is
correct: the worker is idempotent and cheap, and hourly keeps day-offsets tight
across timezones.

## Acceptance checklist (verify before you claim done)

- [ ] A brand-new lead receives ONLY Email 1 (existing behavior untouched).
- [ ] Simulate `created_at = now() - interval '2 days'` → worker sends seq_2 once;
      running the worker again sends nothing.
- [ ] A lead with a send < 48h old is skipped even if another email is due.
- [ ] Setting `unsubscribed_at` (or an `email_suppressions` row) stops everything.
- [ ] Setting `converted_at` stops seq_* and sends asc_a1 on the next run.
- [ ] Every sent email contains the unsubscribe footer + one-click headers, and
      GET/POST on `lead-unsubscribe` flips the flag and confirms.
- [ ] All email bodies match `docs/email-sequence.md` verbatim (spot-check seq_6's
      value stack and asc_a4's invitation).
- [ ] Migrations run clean on a fresh shadow DB; existing tests still pass.

## Secrets the operator sets (list them in your summary; never hardcode)

`RESEND_API_KEY`, `RESEND_FROM`, `REPLY_TO_EMAIL`, `SITE_URL`, `CRON_SECRET`
(+ Vault `cron_secret`), `RESEND_WEBHOOK_SECRET` (already used by the webhook).

## Out of scope (do not build now)

Behavioral branches A–E (need click-tracking joins), lead scoring, subject-line
A/B tests, and the churn-save email. The time-based spine + ascension track +
suppression is the whole job. Ship that, verified, and stop.
