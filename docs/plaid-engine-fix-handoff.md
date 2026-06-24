# GoldFin Engine — Fix Handoff for Lovable
## Precise, prioritized fixes for the production Plaid → report pipeline on `main`

> **Context:** the grounded advisory pipeline on `main` is well-built. This brief lists the numeric-correctness + security fixes that make the report *trustworthy*, in priority order, each as a discrete task with exact file + change. Full reasoning: `reports for claude/15-plaid-engine-reconciliation-audit.md`.
> **All changes are on `main` (Lovable-owned).** Each task is independent and shippable on its own.

---

### TASK 1 — 🔴 Exclude internal transfers & owner draws from cash flow (highest impact)
**File:** `supabase/functions/_shared/report-metrics.ts`
**Problem:** `inflow`/`outflow` sum every transaction, so a transfer between the owner's own connected accounts (e.g. checking→savings) is counted as burn, and owner draws distort profit. This corrupts `outflow`, `monthlyBurn`, `runwayMonths`, `netCash`, `profitProxy`, `biggestMover`, `ownerPay`, and the tax flag.
**Fix:**
1. Plaid's category is already stored on each txn (`plaid_transactions.category`, from `personal_finance_category.detailed ?? primary`). Treat a txn as an **internal transfer** when its Plaid primary category is `TRANSFER_IN` or `TRANSFER_OUT`, **and** (stronger signal) it has an opposite-signed match (same abs amount, within ~3 days) on another of the user's connected accounts.
2. Add an `isExcluded(t)` predicate; filter excluded txns OUT of `inflow`, `outflow`, `monthlyBurn`, `netCash`, `profitProxy`, `biggestMover`, and the prior-period equivalents.
3. Surface the excluded sums separately as memo figures (`transfersExcluded`, `ownerDraws`) so the report can say "we set aside $X of transfers between your own accounts."
**Reference implementation:** the section model + `PNL_EXCLUDED` exclusion in this repo's `src/lib/finance/metrics.ts` (branch `codex/claude-funnel-reports`) does exactly this — port that logic. Note that branch uses the *flipped* sign convention (positive = money IN); production uses Plaid raw (positive = OUT), so invert the comparisons when porting.
**Verify:** a $5,000 checking→savings transfer with both accounts connected must NOT change `monthlyBurn` or `runwayMonths`.

---

### TASK 2 — 🔴 Encrypt the Plaid `access_token` at rest (security launch-gate)
**Files:** `supabase/functions/_shared/plaid.ts`, the `plaid_items` migration.
**Problem:** `access_token` is stored and read as a plaintext column. A DB leak exposes every customer's bank connection.
**Fix:** encrypt with Supabase Vault / pgsodium; store ciphertext; decrypt server-side only inside the edge function right before the Plaid call. Never return it to the client. Treat this as required before any production (non-sandbox) launch.

---

### TASK 3 — 🟠 Separate the verifier's count / currency / percent allow-lists
**File:** `supabase/functions/_shared/report-verify.ts`
**Problem:** `structuralAllowed` returns `{60, 5, 50, 15, 30, 0, 100, 1..12, …}` and that one set is checked against **both** `$` matches and `%` matches via `structural.includes(value)`. So the model can write `$60`, `$5`, `$12`, `$100`, `30%`, `15%`, `50%` ungrounded — `$60` passes only because 60 is the dispute-window constant.
**Fix:**
1. Build three distinct allow-lists: `countAllowed` (bare small integers / "N subscriptions"), `currencyAllowed` (figure registry + injected `allowedExtra` dollar values only), `percentAllowed` (figure-derived percents + benchmark percents only).
2. The `$…` regex checks **only** `currencyAllowed`. The `…%` regex checks **only** `percentAllowed`. Bare integers check `countAllowed`.
3. Remove the dispute-window/Profit-First constants and the blanket `1..12` from the currency path — those are counts or window-days, never dollar grounding.

---

### TASK 4 — 🟠 Annualize the tax flag off a longer window
**File:** `supabase/functions/generate-advisory-report/index.ts`
**Problem:** `annualNet = profitProxy * (365/14)` extrapolates 14 days to a year; one big deposit (or, pre-Task-1, a transfer) flips the S-corp recommendation routed to the CPA.
**Fix:** compute `annualNet` from a trailing 90–180 day (or YTD) inflow−outflow **after** Task 1's exclusions; widen the savings band; in the injected `TAX_FLAG`, state the sample window so Opus narrates it honestly ("based on your last N days").

---

### TASK 5 — 🟡 Tighten verifier tolerance + catch bare numbers
**File:** `supabase/functions/_shared/report-verify.ts`
**Fix:**
1. Currency: require match to nearest dollar/cent after rounding, not `±max(1, |a|×0.01)` (that ±1% band passes materially-wrong figures on large numbers).
2. Add a bare-number scan: numbers ≥ ~100 without `$`/`%`/"months", excluding 4-digit years (2000–2100) and the period's own dates, checked against `currencyAllowed`. The gate must not depend on the model remembering to prefix `$`.

---

### TASK 6 — 🟡 Request PFCv2 in the transaction sync
**File:** `supabase/functions/plaid-sync-transactions/index.ts`
**Fix:** add `personal_finance_category_version: "v2"` to the `/transactions/sync` body (and `/transactions/recurring/get`). +10% primary / +20% detailed categorization accuracy (Plaid, Dec 2025) → smaller ambiguous tail, fewer mis-tagged transfers, higher `coveragePct`.

---

### TASK 7 — 🟢 Duplicate-charge detector: consume matches + skip recurrings
**File:** `supabase/functions/_shared/report-metrics.ts`
**Fix:** mark matched indices consumed so 3 identical charges don't double-report; exclude merchants that appear in `recurring_streams` (a twice-monthly subscription is not a duplicate to dispute).

---

## Suggested order
`TASK 1` (correctness) → `TASK 3` + `TASK 5` (gate) → `TASK 4` (tax) → `TASK 6` (accuracy) → `TASK 2` (security, before live) → `TASK 7` (polish).

Each is independently verifiable. After Task 1, re-run a report for a user who moved money between their own accounts and confirm burn/runway are unchanged by the transfer.
