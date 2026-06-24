# GoldFin Desk — Plaid Engine Build Plan
## Phased, bite-sized implementation plan for the bank-connect → AI-categorize → auto-filled spreadsheet → grounded report pipeline

> **Goal:** ship the financial-data engine the $99/mo actually buys — a frictionless bank-connect, auto-categorized transactions, an auto-filled spreadsheet, and a grounded monthly report — on goldfindesk.com.
> **Architecture:** `docs/plaid-integration-spec.md` · **Persona:** `personas/plaid-architect.md` · **Prompt:** `docs/plaid-architect-prompt.md`
> **Stack:** React 18 + Vite + Tailwind (white/ink/gold) + Supabase (Deno edge fns, migrations, RPCs). Each task verifies with `build` + tests, then commits + pushes its own files.

---

## GUIDING DISCIPLINE

- **Code computes every number; the LLM only narrates.** Verification gate blocks any untraceable figure.
- **Frictionless on the surface only because strict underneath** — token encryption, RLS, dedup, transfer detection.
- **Prove every change in Sandbox before Production.** Plaid retired the Development env; the path is Sandbox → Production.
- Each phase ends shippable: `npm run build` (or `tsc -b`) green, top-2 failure paths confirmed, committed + pushed.

---

## PHASE 0 — SANDBOX SPIKE (prove the engine on your own data)

**Outcome:** connect a Plaid Sandbox bank, sync transactions into Supabase, and see real categorization + the transfer/owner-draw gap on your own test data — *before* designing any UI. De-risks the whole build.

- [ ] Create a Plaid Sandbox account; add `PLAID_CLIENT_ID`, `PLAID_SANDBOX_SECRET`, `PLAID_ENV=sandbox` to Supabase secrets (never client-side).
- [ ] Migration: `plaid_items`, `plaid_accounts`, `transactions` tables (per spec §3), RLS deny-by-default, `service_role`-only writes; `access_token_encrypted` column (pgsodium/Vault).
- [ ] Edge fn `plaid-link-token`: `POST /link/token/create` (products: `transactions`, pass a test `user.phone_number`) → return `link_token`.
- [ ] Edge fn `plaid-exchange-token`: `public_token` → `access_token` → **encrypt + store** → create `plaid_items` row → kick first sync → write `audit_log`.
- [ ] Edge fn `plaid-sync`: `/transactions/sync` loop with stored cursor; **request PFCv2** (`personal_finance_category_version: v2` — +10% primary/+20% detailed accuracy, Dec 2025); upsert `added`/`modified` on `plaid_transaction_id`, delete `removed`; **flip amount sign on ingest**; resolve pending→posted. (Must call `/transactions/sync` once before `SYNC_UPDATES_AVAILABLE` ever fires.)
- [ ] Edge fn `plaid-webhook`: verify Plaid JWT; on `SYNC_UPDATES_AVAILABLE` run sync; on `ITEM_LOGIN_REQUIRED`/`PENDING_EXPIRATION` flag the item; fail loud (500) on transient error.
- [ ] Minimal throwaway test page: open Link with a Sandbox institution, complete connect, watch transactions land in Supabase.
- [ ] **Validate the gap:** eyeball the synced data — confirm `personal_finance_category` quality, and find the self-transfers / owner-draw / business-vs-personal cases that need the AI layer.
- [ ] **Verify:** `build` green; a duplicate webhook re-runs the sync idempotently (no dupes); pending→posted reconciles. Commit + push.

**Decision to confirm before Phase 1:** report cadence (monthly vs bi-weekly), and whether statement-upload fallback is in MVP.

---

## PHASE 1 — CONNECT + FIRST REPORT (the whole demo)

**Outcome:** a branded, frictionless connect flow that produces one auto-filled spreadsheet and one grounded report instantly. This is the sellable demo.

### 1a — Connect-flow UX (frontend, white/ink/gold tokens)
- [ ] Connect screen: report preview *above* the ask; first-person CTA "Connect my bank & generate my report"; friction-reducer line; "Powered by Plaid" trust mark; "Upload a statement instead" fallback link.
- [ ] Embed Plaid Link (branded with GoldFin logo/colors), pre-initialize the SDK, request minimal products, pass `user.phone_number`.
- [ ] Instrument `onExit` → store drop-off step; generate the report on `HANDOFF`.
- [ ] Mobile: full-width thumb-zone button, 48px target, `100dvh`/safe-area, report preview above the ask.

### 1b — Deterministic metrics + spreadsheet
- [ ] Metrics module (code only): revenue, expense-by-category, gross/net, net cash (+ Balance call for end-of-period cash), burn, runway, deltas vs prior; **transfers excluded, posted-only**.
- [ ] Template mapping: categories → P&L / cash-flow / budget line items (config table).
- [ ] `.xlsx` generation: pure function aggregates → cells; numbers injected via `openpyxl`, never model-computed; store in Supabase Storage → `reports.spreadsheet_url`.

### 1c — Grounded report (replace the demo's invent-numbers behavior)
- [ ] Edge fn `generate-report`: 5-layer pipeline — metrics (code) → memory (none yet) → interpretation (`claude-opus-4-8`, strict prompt) → **verification gate** (every number traced back to metrics or block) → delivery (6 sections + "data as of / reconciled" stamp).
- [ ] Reuse the six section labels already in `generate-briefing` (Cash Movement · Revenue Trend · Expense Pattern · Unusual Spend · Questions to Review · Decisions to Consider); end in 2–3 grounded actions.
- [ ] **Verify:** `build` green; a fabricated number is blocked by the gate; the spreadsheet totals equal the report totals (same metrics source). Commit + push.

---

## PHASE 2 — THE TRUST LOOP (correctable, explainable, learning)

**Outcome:** the wedge against every competitor — categorization the non-accountant can fix in one tap, that explains itself, and that learns.

- [ ] Migration: `categories`, `categorization_rules` (the learning loop), add `category_*`, `is_internal_transfer`, `is_owner_equity`, `is_business`, `needs_review` to `transactions`.
- [ ] Edge fn `categorize-batch`: 3-tier engine — rules → Plaid PFC v2 (auto-accept high-conf) → `claude-haiku-4-5` for the ambiguous tail; structured outputs (enum), **batch ≤120 (validate every returned ID)**, Batch API, prompt-cache the taxonomy + rulebook.
- [ ] Transfer detection: opposite-signed matching pairs across the customer's own accounts → `is_internal_transfer` (excluded from P&L).
- [ ] Owner-draw / business-vs-personal: candidate-flag → one-tap confirm → write a durable rule.
- [ ] Review UI (white/ink/gold): auto-filled rows shown with confidence + **rationale ("why")**; low-confidence rows surfaced for **one-tap review**; **bulk edit + "always code X→Y"**; every correction writes a `categorization_rules` row and visibly stops re-asking.
- [ ] **Verify:** `build` green; a correction creates a rule that auto-applies next sync; a transfer is excluded from the P&L. Commit + push.

---

## PHASE 3 — COMPOUNDING + HARDENING

**Outcome:** the report gets smarter every cycle; the connection self-heals; coverage widens.

- [ ] Migration: `report_memory` (metrics snapshot, narrative summary, recommendations + outcomes); inject prior reports (recent verbatim, older summarized) into the report's MEMORY layer.
- [ ] Recurring transactions (`/transactions/recurring/get`): "your subscriptions" section + anomaly alerts ("this jumped").
- [ ] Re-auth: edge fn `plaid-update-link-token` (update-mode, same access_token, no dup Item); proactive nudge on `PENDING_EXPIRATION`.
- [ ] Multi-account consolidation at the metrics layer; net cash summed across accounts.
- [ ] Statement-upload fallback (if deferred from MVP): CSV/PDF → Plaid Enrich (non-Plaid source) or parse → same pipeline.
- [ ] Optional: Liabilities (debt service in the report), Statements (source PDFs), Plaid Layer (instant onboarding, +5–25%).
- [ ] **Verify:** `build` green; re-auth uses update-mode (no duplicate billable Item); a second cycle references the prior report. Commit + push.

---

## CROSS-CUTTING (every phase)

- **Security:** access_token encrypted server-side only; PII minimized to the LLM (merchant/amount/date/direction/token-ID only); RLS deny-by-default; audit row on every privileged action; webhook signature verified.
- **Cost control:** minimal product set; webhook-driven sync (not `/transactions/refresh` — the one metered call); update-mode (no duplicate Items); **`/item/remove` dead Items on cancel/inactivity** (Transactions is a per-Item monthly subscription); Batch API + prompt caching for AI. (Plaid publishes no list price — get a sales quote. See `reports for claude/14-plaid-competitor-and-pattern-research.md`.)
- **Tokens:** frontend strictly on white/ink/gold (`paper`/`ink`/`gold`); no foreign hex; components < ~250 lines.
- **Verification:** `npm run build` (or `tsc -b`) green + relevant tests + top-2 failure paths confirmed before any "done"; name what couldn't be verified (Sandbox/live) + the exact user test.

---

## OPEN DECISIONS (resolve as they arise)

1. Report cadence — monthly vs bi-weekly (affects sync + memory cadence).
2. Statement-upload fallback — MVP (Phase 1) or later (Phase 3)?
3. Plaid Layer — Phase 2+ (added integration for +5–25% onboarding lift)?
4. AI routing — Lovable gateway (confirm it serves Claude Opus 4.8) vs direct Anthropic API.
5. Plaid pricing — get a sales quote before modeling unit economics (no public list price).

---

## SEQUENCE AT A GLANCE

```
Phase 0  Sandbox spike      → prove sync + see the gap on your own data
Phase 1  Connect + report   → the sellable demo (branded Link → metrics → .xlsx → grounded report)
Phase 2  Trust loop         → confidence-tiered, explainable, learning categorization (the wedge)
Phase 3  Compounding        → report-memory, recurring/anomalies, re-auth, multi-account, fallbacks
```

Fire each slice via `docs/plaid-architect-prompt.md`. Every successful pass commits + pushes its own files.
