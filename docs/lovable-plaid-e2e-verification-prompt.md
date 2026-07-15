# LOVABLE PROMPT — Fix + Verify the Full Plaid → Paid → Auto-Fill → Bi-Weekly Report Pipeline
## Copy-paste this entire prompt into Lovable as one message.

---

## Context: a live end-to-end audit was just run against production (2026-07-14)

A real test was executed against the deployed project (`paarucbnaxorpxqjecrz`) with a
fake account. Here is exactly what happened, so you do not re-derive it:

| Step | Result |
|---|---|
| Auth signup (`goldfin.e2e.audit@gmail.com`) | ✅ works, auto-confirmed, session minted. User id `35c8c3ef-ba70-494f-98b7-16aa0a9db05a` |
| `plaid-sandbox-public-token` | ✅ 200 — PLAID_ENV=sandbox, keys valid |
| `plaid-exchange-public-token` (First Platypus Bank, ins_109508) | ✅ 200 — item `b54b8d7f-8888-4f97-a93c-d2b9e44bf5a9`, **12 accounts**, token encrypted at rest via RPC |
| `plaid-sync-transactions` | ✅ 200 — **48 transactions added, 8 recurring streams** |
| `generate-advisory-report` `{send:false}` | ❌ **500** — `gateway 400: invalid model: claude-opus-4-8` |

**The one production-breaking bug:** the Lovable AI gateway does not carry Anthropic
models. Its allow-list is Gemini + OpenAI only. The old default `claude-opus-4-8` in
`supabase/functions/_shared/report-core.ts` made **every** advisory-report generation
fail — the bi-weekly cron, the post-payment kickoff in `payments-webhook`, and the
user-facing `generate-advisory-report`. Paying customers would silently get nothing.

The repo has already been patched on `main`: the default model is now
`google/gemini-3.1-pro-preview` (strongest reasoning model on the gateway's
allow-list), overridable via the `ADVISORY_MODEL` secret. The deterministic
verify layer (`report-verify.ts`) remains the anti-hallucination gate regardless
of model.

## Your job, in order

### TASK 1 — Deploy the model fix and prove the report generates

1. Redeploy the edge functions so the patched `report-core.ts` is live (or set the
   `ADVISORY_MODEL` secret to `google/gemini-3.1-pro-preview` — either works; doing
   both is fine).
2. Re-run the exact failing call as the existing test user (or any test user with a
   connected sandbox item): invoke `generate-advisory-report` with `{"send":false}`.
3. **Success =** HTTP 200 with `ok: true`, `verification_passed: true`, and a row in
   `advisory_reports` with `status: "generated"`, a populated `metrics_snapshot`,
   `narrative` sections, and `recommendations`. If `verification_passed` is false,
   read `verification_notes.orphans` and tighten the prompt — do NOT loosen the
   verifier to make it pass.

### TASK 2 — Prove the full paid path with Stripe TEST mode

The live audit could not complete a payment (live Stripe key on the site). Do this
in the sandbox/test Stripe environment the codebase already supports
(`_shared/stripe.ts` `StripeEnv`):

1. As the test user, create a checkout session for the `auto-fill-monthly` plan in
   the **sandbox** environment and complete it with Stripe test card `4242 4242
   4242 4242`.
2. Verify `payments-webhook` fired: a `subscriptions` row exists for the user with
   `status` in (`active`,`trialing`), `price_id` = `auto-fill-monthly` or
   `auto_fill_monthly`, and `environment` = sandbox.
3. Verify the **kickoff report** ran (payments-webhook generates the first report
   immediately when a bank is already connected) — a new `advisory_reports` row and
   a `report_email_deliveries` row for it.
4. Verify the bi-weekly cron picks the user up: invoke `cron-run-reports` with the
   `x-cron-secret` header (or `admin-trigger-cron`) and confirm the response counts
   the user as a candidate and `skipped` (13-day gate — the kickoff report is
   recent). That proves gating works both ways.

### TASK 3 — Prove the email + auto-filled spreadsheets reach the client

1. Point the test user's `profiles.email` at an inbox you can open, then invoke
   `generate-advisory-report` with `{"send":true}` (or wait for TASK 2's kickoff).
   Confirm the briefing email arrives, renders, and its `report_email_deliveries`
   row flips to delivered via the `resend-webhook`.
2. Log into the portal as the test user, open the report, and confirm the
   **auto-filled templates** render on-screen and download as `.xlsx` and `.csv`
   (`TemplateDownloadCard` → `fillAllTemplates` → `buildWorkbook`). Confirm the
   numbers in the workbook match the report's `metrics_snapshot` — the trace gate
   (`UntraceableWorkbookCellError`) must not fire.

### TASK 4 — Close the abuse hole found in the audit

`generate-advisory-report` requires only a logged-in user — and signup is open and
auto-confirmed. Anyone can script signups and burn unlimited AI-gateway credits.
Fix without breaking the product:

1. In `generate-advisory-report`, require an eligible subscription (same
   `ELIGIBLE_PRICES` + `ACTIVE_STATUSES` check as `cron-run-reports`) OR an
   explicit allowlist flag on the profile for internal test users.
2. Add a per-user rate limit (e.g. max 3 generations per 24h) — a simple count on
   `advisory_reports.created_at` is enough.
3. The marketing demo (`generate-briefing`) stays public — it is the sample
   funnel step — but give it an IP-based rate limit if it lacks one.

### TASK 5 — Remaining correctness fixes from `docs/plaid-engine-fix-handoff.md`

The audit verified current status of the 7 handoff tasks. Already DONE: Task 1
(transfer/owner-draw exclusion, with tests) and Task 2 (token encryption at rest).
Still OPEN — implement in this order:

1. **Task 3 + 5 (the verifier):** `report-verify.ts` still shares one
   `structuralAllowed` set across `$` and `%` matches with ±1% tolerance, so
   ungrounded `$60`, `$5`, `$100`, `30%`, `15%`, `50%`, and `$1..$12` pass. Split
   into `countAllowed` / `currencyAllowed` / `percentAllowed`, tighten currency
   tolerance to nearest dollar, and add the bare-number scan (numbers ≥100 without
   `$`/`%`/"months", excluding years).
2. **Task 4 (tax flag):** `report-core.ts` still computes
   `annualNet = profitProxy * (365/14)` — a 14-day extrapolation that can flip the
   S-corp recommendation on one big deposit. Use a trailing 90–180 day window after
   exclusions and state the window in `TAX_FLAG`.
3. **Task 6 (PFCv2):** add `personal_finance_category_version: "v2"` to the
   `/transactions/sync` and `/transactions/recurring/get` bodies in
   `plaid-sync-transactions` — it is still missing.
4. **Task 7 (duplicates):** consume matched indices and skip `recurring_streams`
   merchants in the duplicate detector.

### TASK 6 — Clean up the audit artifacts

When all green: delete the test user `35c8c3ef-ba70-494f-98b7-16aa0a9db05a`
(`admin-wipe-users` or auth admin), which should cascade/remove its `plaid_items`
(call `plaid-remove-item` first so the sandbox Item is also removed at Plaid), its
`plaid_accounts`, `plaid_transactions`, `advisory_reports`, and any `subscriptions`
test rows. Confirm `plaid_get_access_token` rows are gone.

## Hard constraints

- Never loosen `report-verify.ts` to make a report pass — the verifier is the
  product's trust guarantee. Fix the prompt or the metrics, never the gate.
- No secrets in git; `ADVISORY_MODEL`, Stripe sandbox keys, `CRON_SECRET` are
  edge-function secrets only.
- Migrations additive + forward-only, defensive pattern as in
  `20260623140000_schedule_reports.sql`.
- Do not touch the marketing funnel (`send-template-email`, `leads`, templates
  pages) — it was audited separately and works.
- Report your results as a checklist mirroring TASKS 1–6 with the actual observed
  values (report id, subscription row, delivery status), not "should work".

## The acceptance bar (the whole system, one sentence each)

1. A stranger signs up, connects a sandbox bank, pays with a test card → a
   verified, grounded briefing email arrives without human intervention.
2. Their portal shows the same report with GoldFin-branded auto-filled `.xlsx`
   templates whose every number traces to `metrics_snapshot`.
3. Thirteen+ days later the cron sends the next one, automatically, and a canceled
   subscription stops it.
4. Nobody without an active subscription can burn AI credits.
5. No report containing an ungrounded number can ever be sent.
