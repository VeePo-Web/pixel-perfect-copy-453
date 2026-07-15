
## What we're building

An automated, idempotent, time-based email drip that fires after Email 1 (already live). Nothing about Email 1's copy or timing changes. Advisory-report emails are untouched.

The engine has five moving parts, all following patterns already in the repo (`cron-run-reports`, `email-unsubscribe`, `schedule_reports.sql`).

---

## 1. Migration — drip state (additive)

New migration file `supabase/migrations/<ts>_lead_drip_state.sql`:

- `ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS` for `unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid()`, `unsubscribed_at timestamptz`, `converted_at timestamptz`.
- `CREATE TABLE IF NOT EXISTS public.lead_email_sends` with `(id, email text, email_key text, sent_at, provider_message_id, UNIQUE(email, email_key))`.
- Indexes: `leads(lower(email))`, `leads(created_at)`, `lead_email_sends(email)`.
- GRANTs: `service_role` full; NO grants to `anon`/`authenticated`.
- RLS enabled, no policies (deny-all outside service_role).
- Wrapped in defensive `DO $$ ... EXCEPTION` block per existing convention.

## 2. Edge function `lead-unsubscribe`

`supabase/functions/lead-unsubscribe/index.ts`, mirroring `email-unsubscribe`:

- GET `?token=<uuid>` → sets `unsubscribed_at = now()` on ALL leads matching the token's email (find email by token, then update by email), returns branded HTML page ("You are unsubscribed").
- POST → RFC 8058 one-click (JSON `{token}` or form body); flips flag, returns 200 `ok`.
- Invalid/missing token → branded "Link not recognized".
- Register `[functions.lead-unsubscribe] verify_jwt = false` in `supabase/config.toml`.

## 3. Edge function `email-drip-worker`

`supabase/functions/email-drip-worker/index.ts`:

- Header gate: reject unless `x-cron-secret` matches `CRON_SECRET` env (same pattern as `cron-run-reports`).
- Query `leads`, group by `lower(email)` keeping earliest `created_at`, join to `unsubscribed_at` and `converted_at` (any set counts).
- For each contact, filter out: `unsubscribed_at` set, or email in `email_suppressions`, or has send within 48h in `lead_email_sends`.
- Decide track:
  - `converted_at` set → **ASCENSION** (asc_a1@0d, asc_a2@3d, asc_a3@17d, asc_a4@45d from `converted_at`).
  - else → **SALES** (seq_2@2, seq_3@3, seq_4@4, seq_5@5, seq_6@7, seq_7@10, seq_8@14, seq_9@21, seq_10@30 from earliest `created_at`).
- Pick highest-numbered due `email_key` NOT already in `lead_email_sends` for that email. Send at most one per contact per run; no backfill of skipped rungs.
- Guard: INSERT into `lead_email_sends` with `ON CONFLICT DO NOTHING` BEFORE hitting Resend. If insert returns 0 rows, skip (concurrent-run guard).
- Render via a shared HTML shell that matches `send-template-email` (GoldFin eyebrow, body/muted styles, `— Chris Sam` sig). Copy for each of 13 emails imported verbatim from `docs/email-sequence.md` into a `_shared/lead-drip-copy.ts` module (subject + HTML body per key). No paraphrasing.
- `{{firstName}}` replacement: omit greeting name when firstName empty/"Friend". `{{SITE_URL}}` from `SITE_URL` secret, default `https://goldfindesk.com`.
- Send via Resend gateway `https://connector-gateway.lovable.dev/resend/emails`, `from` = `RESEND_FROM`, `reply_to` = `REPLY_TO_EMAIL` if set, headers:
  - `List-Unsubscribe: <https://<project>.supabase.co/functions/v1/lead-unsubscribe?token=<uuid>>`
  - `List-Unsubscribe-Post: List-Unsubscribe=One-Click`
- Every email body appends a footer with the unsubscribe link.
- If Resend fails after ledger insert: log error; do NOT delete the ledger row (better a silent miss than a double-send). Provider message_id is patched into the ledger row on success.
- Return `{ ok: true, considered, sent }` summary.
- Register `[functions.email-drip-worker] verify_jwt = false` in `supabase/config.toml`.

## 4. Conversion wiring (Stripe)

Edit `supabase/functions/payments-webhook/index.ts` `handleCheckoutCompleted`:

- After the existing subscription handling, when `email` is set and plan is one of `["auto-fill-monthly","auto_fill_monthly"]`, run:
  ```
  UPDATE public.leads SET converted_at = now()
   WHERE lower(email) = lower($1) AND converted_at IS NULL;
  ```
- Wrapped in try/catch — never fails the webhook. This is a reliable server-side hook (Stripe → webhook), so no client-side fallback is needed.

## 5. Cron schedule migration

`supabase/migrations/<ts>_schedule_email_drip.sql`, cloned defensively from `schedule_reports.sql`:

- `cron.schedule('email-drip-hourly', '5 * * * *', ...)`
- `net.http_post` to `https://paarucbnaxorpxqjecrz.supabase.co/functions/v1/email-drip-worker` with `x-cron-secret` from Vault `cron_secret` (already provisioned).

---

## Copy source

All 13 email bodies (seq_2 … seq_10, asc_a1 … asc_a4) will be extracted verbatim from `docs/email-sequence.md` and stored in `supabase/functions/_shared/lead-drip-copy.ts` as `{ subject, html }` entries. I will not alter a word. HTML shell only adds the header eyebrow, sign-off, footer, and unsubscribe link — matching Email 1's visual language.

## Secrets (operator sets — never in code)

`RESEND_API_KEY` ✅ present, `RESEND_FROM`, `REPLY_TO_EMAIL`, `SITE_URL`, `CRON_SECRET` ✅ present (+ Vault `cron_secret`), `RESEND_WEBHOOK_SECRET` (already in use by suppression webhook).

## Explicitly NOT doing

- Not editing Email 1 content/timing (only adding drip-related additions — Email 1 stays as-is; footer/one-click apply to seq_/asc_ only per the doc, since Email 1 is transactional delivery).
- Not building behavioral branches A–E, lead scoring, or A/B tests.
- Not touching `cron-run-reports`, `report-delivery.ts`, `report_email_deliveries`, or `email_preferences`.

## Acceptance verification (post-build)

1. Manually invoke `email-drip-worker` with a lead where `created_at = now() - '2 days'` → confirm one seq_2 row appears in `lead_email_sends`, a second invocation adds nothing.
2. Insert a `lead_email_sends` row with `sent_at = now() - '10 hours'` → confirm worker skips that contact.
3. Set `unsubscribed_at` → confirm skip. Insert into `email_suppressions` → confirm skip.
4. Set `converted_at = now()` → confirm next run sends asc_a1 (not any seq_).
5. GET `/functions/v1/lead-unsubscribe?token=…` → confirmation page renders, `unsubscribed_at` set on all matching leads. POST → returns 200.
6. Grep `docs/email-sequence.md` vs `_shared/lead-drip-copy.ts` for seq_6 value stack + asc_a4 invitation verbatim.
7. `bun run test` — existing tests still pass; migrations apply clean.
