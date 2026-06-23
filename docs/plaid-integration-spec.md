# GoldFin Desk — Plaid Integration & AI Report Pipeline
## Build-ready architecture, data model, and connect-flow UX spec

> **Status:** discovery + architecture complete; no Plaid code exists yet.
> **Stack:** React 18 + Vite + Tailwind + Supabase (Lovable-managed). Internal name `zentry`/`zendry`.
> **Hand-off:** §A–§E and §10 (UX) → `/feature` (frontend) · §3–§8 (backend, schema, edge functions, security) → `/cog-admin`.
> **Sourcing:** every external claim traces to the five cited research briefs summarized in `docs/` discovery (Plaid docs, Ramp teardown, competitor sweep, Link-conversion brief, AI-pipeline brief). Dollar figures are secondary-source estimates — confirm with a Plaid sales quote.

---

## 0. The one-sentence product

A non-accountant business owner pays **$99/mo**, connects their bank + Visa **once** (via Plaid — which they never see named), and a clean monthly/bi-weekly financial **report + auto-filled spreadsheet** just *arrives* — grounded in their real numbers, smarter every cycle.

**Plaid is the hidden fuel line, not the product.** The product is the report. Optimize Plaid for the cheapest, most reliable path to clean transaction data; spend craft on the connect moment and the report.

---

## 1. What Plaid does in this app (the loop)

```
Owner connects bank/Visa (Plaid Link)
   → transactions auto-pull + stay fresh (/transactions/sync + webhooks)
   → AI resolves the accounting-intent gap Plaid can't (transfers, owner draws, business/personal)
   → deterministic code computes every number
   → spreadsheet template auto-fills (P&L / cash-flow / budget)
   → Opus 4.8 writes the plain-English report ("are you okay, what changed, what to do")
   → it arrives; a report-memory record is stored so next cycle compounds
```

**The "they don't know it's Plaid" framing is correct and should be preserved.** In the UI, never lead with "Plaid." Lead with the outcome ("Connect your bank → your report generates in seconds"). "Powered by Plaid" appears only as a *trust* mark near the button (Plaid is a recognized security signal — it blocks ~3M fraudulent requests/year), never as the headline.

---

## 2. Plaid product selection (what to buy, what to skip)

| Need | Product | Billing | Decision |
|---|---|---|---|
| Connection UI | **Link** (embedded, branded, OAuth-first) + **update mode** | included | **Required** |
| Transaction engine | **Transactions** via **`/transactions/sync`** | subscription, per-Item/mo | **Required — the backbone** |
| Freshness | **`SYNC_UPDATES_AVAILABLE`** webhook | included | **Required** |
| End-of-period cash (the *stock*) | **Balance** (`/accounts/balance/get`) | per-request | **Required** for "cash on hand" |
| Recurring costs + anomalies | **`/transactions/recurring/get`** | add-on | **Phase 3** |
| Debt service in report | **Liabilities** | subscription, per-Item/mo | **Optional / later** |
| Real bank PDF for accountant | **Statements** | per-statement | **Optional / later** |
| ~~Enrich~~ | redundant — enrichment already ships *inside* Transactions | — | **Skip** |
| ~~Assets~~ | lending snapshot, not ongoing reporting | — | **Skip** |
| ~~Signal / Beacon / Monitor~~ | fraud/AML, not our use case | — | **Skip** |

**Two ingest traps that silently corrupt every report:**
1. **`amount` sign is inverted vs accounting** → *positive = money OUT*. **Flip on ingest.**
2. **Plaid dates are POSTED, not transaction date** → a Mar 31 purchase posting Apr 2 lands in April. **Period-close logic must handle boundaries deliberately**, or every month is subtly wrong.

---

## 3. Data model (Supabase / Postgres)

All Plaid tables are **server-side only, RLS deny-by-default**, written exclusively by edge functions using the `service_role`. The browser never sees an `access_token`. Mirrors the existing `applications` RLS pattern but **stricter** (no anon access).

```sql
-- One Plaid connection per institution per user
plaid_items (
  id uuid pk,
  user_id uuid not null references auth.users,
  item_id text not null unique,            -- Plaid item_id
  access_token_encrypted text not null,    -- pgsodium / Vault encrypted; NEVER plaintext, NEVER client
  institution_id text,
  institution_name text,
  status text not null default 'active',   -- active | login_required | pending_expiration | removed
  sync_cursor text,                        -- /transactions/sync cursor; persist after every call
  consent_expiration_time timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)

plaid_accounts (
  id uuid pk,
  item_id uuid not null references plaid_items,
  account_id text not null unique,         -- Plaid account_id
  name text, mask text, type text, subtype text,
  current_balance numeric, available_balance numeric,
  balance_as_of timestamptz
)

transactions (
  id uuid pk,
  user_id uuid not null,
  account_id uuid not null references plaid_accounts,
  plaid_transaction_id text not null unique,   -- upsert key (idempotency)
  pending boolean not null,
  pending_transaction_id text,                 -- dedup link pending->posted
  amount numeric not null,                     -- store SIGN-FLIPPED (accounting convention)
  iso_currency_code text,
  date date not null,                          -- posted date
  authorized_date date,
  merchant_name text, raw_name text,
  merchant_entity_id text, logo_url text,
  plaid_pfc_primary text, plaid_pfc_detailed text,
  plaid_pfc_confidence text,                   -- VERY_HIGH|HIGH|MEDIUM|LOW|UNKNOWN
  -- OUR resolved layer:
  category_id uuid references categories,
  is_internal_transfer boolean default false,  -- excluded from P&L
  is_owner_equity boolean default false,       -- draw/contribution; equity, not P&L
  is_business boolean,                          -- business vs personal (commingled accounts)
  category_source text,                        -- rule | plaid | llm | user
  category_confidence numeric,
  needs_review boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)

categories (                                  -- maps to template line items + chart of accounts
  id uuid pk, user_id uuid, name text,
  statement_section text,                     -- revenue | cogs | opex | equity | transfer | excluded
  template_line text
)

categorization_rules (                        -- the LEARNING loop (deterministic)
  id uuid pk, user_id uuid,
  match_merchant text,                        -- normalized merchant/counterparty
  match_amount_sign text,                     -- optional
  category_id uuid references categories,
  is_internal_transfer boolean, is_owner_equity boolean, is_business boolean,
  created_at timestamptz default now()        -- written on every user correction
)

reports (
  id uuid pk, user_id uuid,
  period_start date, period_end date,
  metrics jsonb,                              -- the deterministic numbers (source of truth)
  narrative jsonb,                            -- the six sections (Opus output, verified)
  spreadsheet_url text,                       -- generated .xlsx in storage
  data_as_of timestamptz, status text,
  created_at timestamptz default now()
)

report_memory (                               -- compounding moat: prior cycles
  id uuid pk, user_id uuid, report_id uuid references reports,
  metrics_snapshot jsonb, narrative_summary text,
  recommendations jsonb, recommendation_outcomes jsonb,
  created_at timestamptz default now()
)

audit_log (                                   -- append-only; who/what/when on every privileged action
  id uuid pk, user_id uuid, actor text, action text,
  before jsonb, after jsonb, reason text, created_at timestamptz default now()
)
```

**RLS:** users `SELECT` only their own `transactions`/`reports`/`categories` (UI reads); **all writes** to Plaid/transaction/report tables go through `service_role` edge functions only. `plaid_items.access_token_encrypted` is never selectable by `anon`/`authenticated`.

---

## 4. Edge functions (Supabase, Deno) — backend surface

| Function | Job |
|---|---|
| `plaid-link-token` | `POST /link/token/create` → returns short-lived `link_token`. Pass `user.phone_number` (unlocks returning-user flow). Request **minimal products** (`transactions`). Brand it. |
| `plaid-exchange-token` | Exchange `public_token` → `access_token`; **encrypt + store**; create `plaid_items` row; kick first sync; write `audit_log`. |
| `plaid-webhook` | Verify JWT signature → on `SYNC_UPDATES_AVAILABLE` run sync; on `ITEM_LOGIN_REQUIRED`/`PENDING_EXPIRATION` flag item + notify user. **Fail loud (500 → Plaid retries).** |
| `plaid-sync` | `/transactions/sync` loop with stored cursor; upsert `added`/`modified`, delete `removed` (keyed on `plaid_transaction_id`); resolve pending→posted; persist `next_cursor`. Idempotent. |
| `categorize-batch` | The 3-tier engine (§6). Claude Haiku for the ambiguous tail. Batch ≤120 txns; validate every returned ID. |
| `generate-report` | The 5-layer grounded pipeline (§7). **Replaces the demo `generate-briefing`'s invent-numbers behavior with computed + verified numbers.** |
| `plaid-update-link-token` | Link token in **update mode** for re-auth (same `access_token`, no duplicate Item). |

**Cost/safety levers baked in:** minimal product set (lower conversion friction *and* per-Item cost) · webhook-driven sync (not polling) · `/transactions/refresh` only behind a manual "refresh now" button · update mode so re-auth never creates duplicate billable Items.

---

## 5. The categorization-intent gap (where AI earns its keep)

Plaid's native `personal_finance_category` (**use v2**, shipped Dec 2025; opt in via `personal_finance_category_version`) is ~90%+ accurate and does merchant cleanup for free. It **structurally cannot** solve the three SMB-book killers — and these are exactly what the report must get right:

| Gap | Why Plaid can't | Our handling |
|---|---|---|
| **Self-transfers** (checking↔savings, card payments) | shows as outflow *and* inflow → double-counts revenue & expense | detect opposite-signed matching pairs across the user's own linked accounts → tag `is_internal_transfer` → **exclude from P&L** |
| **Owner draws / contributions** | Plaid has no "owner's equity" concept | candidate-flag (transfer to/from personal, round-number recurring) → user confirms once → `is_owner_equity` → flows to equity, never P&L; also feeds tax set-aside |
| **Business vs personal** (commingled account) | bank can't know intent | set once per merchant/account → ruled forever |

This is the AI's *real* job: not "categorize" (Plaid mostly does that) but **resolve accounting intent and learn every correction so it never asks twice.**

---

## 6. Categorization pipeline (3-tier hybrid)

```
1. RULES (deterministic, user-learned)     → final.  categorization_rules match first, always.
2. PLAID PFC v2                             → auto-accept when confidence VERY_HIGH/HIGH.
3. CLAUDE (claude-haiku-4-5)               → only MEDIUM/LOW/UNKNOWN + business-context calls.
```

**Claude call spec (from the ANNA production case study + Anthropic docs):**
- **Structured outputs / strict tool use** with an `enum` of valid categories — don't prompt "return JSON."
- **Batch ≤120 transactions/request.** Beyond ~120 the model starts **hallucinating transaction IDs** — validate every returned ID exists in the input; re-route mismatches.
- **Batch API** (50% cost, ≤24h latency — monthly work isn't latency-sensitive). Results are **unordered — key by `custom_id`.**
- **Prompt caching** for the category taxonomy + per-business rulebook + few-shot examples (stable cached prefix; only the per-batch transactions vary).
- **Model:** `claude-haiku-4-5` ($1/$5 per MTok) — the cost/speed tier for classification.

**Confidence-tiered UI (steal from Ramp):** auto-fill high confidence; surface medium/low for **one-tap review**; never auto-commit on confidence alone — gate "ready" on *completeness + rule/policy + confidence*. **Show the "why"** (confidence + rationale) on every coding — it's the #1 trust mechanism. **Every user correction writes a durable `categorization_rules` row** and visibly stops re-asking (Ramp: 70% fewer corrections in month one). Ship **bulk edit + "always code X→Y"** early — "fix each one individually" is a top competitor complaint.

---

## 7. Grounded report generation (anti-hallucination — the core discipline)

**Iron law: code computes every number; the LLM only labels and narrates. A number the model invented is a fireable offense.** Five layers:

```
LAYER 1 — METRICS (deterministic code)   revenue, expense-by-category, gross/net, net cash,
                                         burn, runway, AR/AP aging, deltas vs prior, tax set-aside.
                                         Transfers excluded; owner-equity routed to equity. Posted-only.
LAYER 2 — MEMORY (retrieval)             load report_memory: prior metrics, narrative, recommendations
                                         + outcomes (recent verbatim, older summarized).
LAYER 3 — INTERPRETATION (claude-opus-4-8)  receives metrics + memory + strict system prompt.
                                         "Use ONLY the figures provided. Never state a number not in
                                         the data. If a figure is missing, say so — never estimate."
LAYER 4 — VERIFICATION (deterministic)   extract every number in the output; trace each back to Layer 1.
                                         Any untraceable figure BLOCKS the send + logs.
LAYER 5 — DELIVERY                       render six sections + .xlsx; stamp "data as of <date>,
                                         reconciled to connected accounts"; write report_memory.
```

**Reuse the existing six-section shape** (`generate-briefing` already defines these labels — keep them, but ground them):
`Cash Movement · Revenue Trend · Expense Pattern · Unusual Spend · Questions to Review · Decisions to Consider`.
End every report in **2–3 specific, grounded actions** ("What to do now"), each tied to a real figure and tracked next cycle.

- **Model:** `claude-opus-4-8` (the report *is* the product). Prompt-cache the system prompt + template; only metrics + memory vary.
- **Spreadsheet:** the `.xlsx` is a *projection* of Layer-1 aggregates — generate via code-execution + `openpyxl` with **numbers injected, never computed by the model**. The spreadsheet and the report read the same aggregates, so they can't disagree.
- **Routing note:** the demo currently calls `ai.gateway.lovable.dev` with `google/gemini-2.5-flash`. For the *real* grounded report, route to **Claude Opus 4.8** (via the Lovable gateway if it exposes Anthropic models, else direct Anthropic API). Confirm current model availability via the `claude-api` reference before wiring.

---

## 8. Security & compliance (the `/cog-admin` doctrine)

- **`access_token` encrypted at rest** (pgsodium/Vault), **server-side only**, never in client/localStorage/logs. Plaid client_id/secret in Supabase secrets, never in code.
- **Verify webhook JWT signatures** — never act on a spoofed `SYNC_UPDATES_AVAILABLE`.
- **PII minimization to the LLM:** send merchant string, amount, date, direction, internal token ID. **Do NOT send** names, account/routing numbers, SSNs, raw Plaid `account_id`s, or access tokens. For the report, send **aggregates**, not the raw ledger, where possible. Single redaction enforcement point before any data leaves your infra.
- **Anthropic retention:** commercial API does **not** train on inputs/outputs. If you pursue Zero Data Retention, note `claude-fable-5` requires 30-day retention and is **not ZDR-eligible** — `claude-opus-4-8` is fine. Resolve before picking the report model.
- **RLS deny-by-default**, `audit_log` row on every privileged action (token exchange, category override, report send, payout-style events), data-deletion path via `/item/remove`. Market the **clean export / data portability** explicitly — it's a trust feature (remember Bench locking 12,000 customers out of their books).

---

## 9. Competitive wedge (positioning the build serves)

Every competitor — Puzzle, Digits, QBO, even Ramp — stops at a **raw P&L the owner can't verify**. The unserved user is **the non-accountant who can't tell whether the books are even right.** Four defensible wedges, each hitting a documented competitor failure:

1. **Correctable, explainable categorization** (vs "AI gets it wrong and it's impossible to fix" — the universal #1 complaint).
2. **Interpreted plain-English report**, not a raw P&L ("are you okay + what to do" — no one auto-delivers this).
3. **All-accounts Plaid consolidation** (Mercury/Brex only see their own money).
4. **Transparent flat $99 + portable data** (vs pricing opacity + Bench-style lock-in).

Positioning line: **"You didn't fail at bookkeeping — the tools were built for accountants, not for you."**

---

## 10. The frictionless connect flow (highest conversion lever) → `/feature`

**Principle: show the value before you ask for the credential.** The connect is the highest-fear action on the activation path; make the user *want* it.

**Sequence:**
1. **Preview the report first** — the "one number" verdict + sample (the site already has `sample-briefing`; let it run *before* any ask).
2. **Lightweight signup** — phone or email only. (Pass `user.phone_number` to Plaid → +11% returning-user conversion.)
3. **Frame connect as the unlock:** *"Connect your bank and your first report generates in seconds."*
4. **Plaid Link** — embedded, branded (white/ink/gold), minimal products, SDK pre-initialized.
5. **Instant payoff** — generate the report the moment `HANDOFF` fires.

**The connect screen (on the existing white/ink/gold trust palette):**
```
   See your full financial picture — securely connect your bank
   ┌───────────────────────────────────────────────┐
   │   🔒  Connect my bank & generate my report     │   gold-500 fill, ink text, first-person + outcome
   └───────────────────────────────────────────────┘
   Bank-grade encryption. We never see your login — you connect
   read-only. Takes about 30 seconds.

   Powered by Plaid · trusted by thousands of financial apps
   Bank not listed? Upload a statement instead →
```

**Conversion levers (Plaid's own A/B data):** App2App biometric **+10–15%** · mobile-web OAuth pop-up **+11%** · pass phone number **+11%** · more institution logos **+5%** · **Plaid Layer** instant onboarding **+5–25%** · brand Link (explicit lift). **Instrument `onExit`**, benchmark with Premium Link Analytics, segment recovery emails by drop-off step.

**Never dead-end** (your reporting product has a fallback most apps lack): **"Upload a CSV/PDF statement and we'll build your report anyway."** Plus **update mode** for re-auth (proactive nudge on `PENDING_EXPIRATION`: *"Your bank needs a 15-second re-verify to keep your reports accurate"*), micro-deposit Auth for small banks, multi-aggregator redundancy later (Monarch runs Plaid+MX+Finicity).

**Don'ts:** credentials before value · any unexplained step · every Plaid product "just in case" · desktop OAuth pop-up shipped unchanged to mobile · "Link account" / "Submit" labels.

**Update the existing `security-faq/PlaidExplanationSection`** with the stronger read-only framing and the "Plaid blocks ~3M fraudulent requests/year / ~750k daily connections" trust stats.

---

## 11. Build phases

| Phase | Scope | Owner |
|---|---|---|
| **0 — Sandbox spike** | Link → `/transactions/sync` → Supabase → see real categorization on your own data; **validate the transfer/owner-draw gap against reality** before designing UI | `/cog-admin` |
| **1 — Connect + first report** | embedded branded Link, webhook sync, deterministic metrics, one auto-filled template, one Opus report with the verification gate. *This is the whole demo.* | both |
| **2 — Trust loop** | confidence-tiered review UI, one-tap correction → durable rule, bulk edit, "show the why" | both |
| **3 — Compounding** | report_memory, recurring-transaction anomalies, multi-account consolidation, re-auth nudges, Liabilities, Statements, CSV fallback | both |

Each phase ships under brainstorm-first → spec → TDD → verify (`tsc --noEmit` + `vite build` green) per the engineering-methodology doctrine. Money/identity tables are append-only, forward-only migrations.

---

## 12. Cost model (confirm with Plaid sales)

- **Plaid Transactions:** ~$0.30–$2.00 per connected Item/month (sliding down by volume). At $99/mo revenue per client with 1–3 connected accounts, Plaid is a small COGS line — but **per-Item subscriptions multiply with accounts**, so don't over-connect, and implement update mode (no duplicate Items).
- **Balance:** per-request — call once per period close, not continuously.
- **Claude:** Haiku for categorization (Batch API, 50% off, prompt-cached) is cents/client/month; Opus for the report (prompt-cached) is the main AI cost and is small per report.
- **Plaid publishes no list price** — everything is negotiated on usage forecast. Get a quote before modeling unit economics.

---

## 13. Open decisions (need your call before/during Phase 0)

1. **Report cadence:** monthly vs the bi-weekly the personas/demo imply? (Affects sync + memory cadence.)
2. **Manual fallback in MVP?** CSV/statement upload is cheap insurance against Link failures and unsupported banks — include in Phase 1 or defer to Phase 3?
3. **Plaid Layer now or later?** +5–25% onboarding lift but added integration; likely Phase 2+.
4. **AI routing:** keep the Lovable AI gateway (confirm it serves Claude Opus 4.8) or call Anthropic directly for the grounded report?
5. **Confirm the Plaid environment path:** Sandbox → Production (Plaid retired the old Development env).

---

### Key sources
Plaid: [Transactions](https://plaid.com/docs/transactions/) · [`/transactions/sync` migration](https://plaid.com/docs/transactions/sync-migration/) · [PFC v2 / AI categorization](https://plaid.com/blog/ai-enhanced-transaction-categorization/) · [Link best practices / conversion](https://plaid.com/docs/link/best-practices/) · [measuring conversion / `onExit`](https://plaid.com/docs/link/measuring-conversion/) · [update mode](https://plaid.com/docs/link/update-mode/) · [Layer](https://plaid.com/blog/layer-ui-updates-conversion-gains/) · [billing](https://plaid.com/docs/account/billing/) · [security](https://security.plaid.com/).
Ramp: [accounting automation](https://ramp.com/accounting-automation-software) · [Accounting Agent launch](https://www.prnewswire.com/news-releases/ramp-launches-accounting-agent-to-automate-bookkeeping-with-real-time-close-302686214.html).
Pipeline: [ANNA LLM categorization case study](https://www.zenml.io/llmops-database/cost-effective-llm-transaction-categorization-for-business-banking) · [Anthropic structured outputs](https://docs.claude.com/en/docs/build-with-claude/structured-outputs) · [Anthropic data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention).
Competitive/UX: Puzzle/Digits/QBO/Mercury/Brex sweep + Plaid Link conversion brief (see discovery streams).

*Spec compiled 2026-06-22. Numbers from secondary sources flagged; validate Plaid pricing, rate limits, and current model IDs (`claude-api` reference) before build.*
