# 15 — Plaid Engine Reconciliation & Correctness Audit (the REAL production pipeline)
## Lovable already built the full Plaid → metrics → Opus → verify → persist pipeline on `main`. This audits it.

> **What changed:** the owner confirmed "Plaid is hooked in already — webhook and all — in Lovable." It is. The full integration lives on **`origin/main`**, not on this `codex/claude-funnel-reports` branch. This audit reads that production code, reconciles it against the `src/lib/finance/` engine built here, and ranks the correctness gaps that decide whether the $99/mo report is *trustworthy*.
> **Scope:** read-only audit + decision. No production code on `main` is touched (Concurrent-Tree Protocol — `main` is Lovable's).

---

## THE HEADLINE: there are now TWO engines for the same numbers

| | **Lovable (`origin/main`) — PRODUCTION** | **This branch (`src/lib/finance/`)** |
|---|---|---|
| Wired to Plaid + DB + frontend | ✅ yes (`plaid-*` edge fns, `plaid_transactions`, `advisory_reports`) | ❌ no (pure, disconnected) |
| Deterministic metrics | `_shared/report-metrics.ts` `computeMetrics` | `metrics.ts` `computePeriodMetrics` |
| Verification gate | `_shared/report-verify.ts` `verifyReport` | `report.ts` `verifyNarrative` |
| Opus 4.8 grounded generation | ✅ `generate-advisory-report` (5-layer, memory, retry) | spec only |
| Unit tests | ❌ none | ✅ 18 (`*.test.ts`) |
| **Sign convention** | **Plaid raw: positive = money OUT** | **flipped: positive = money IN** |
| Transfer / owner-equity exclusion | ❌ **not handled** | ✅ excluded from P&L |
| Memory / benchmarks / waste / tax flag | ✅ rich | ❌ not built |

**The doctrine says there must be ONE source of truth for every number. There are two, and they disagree on sign.** Continuing to grow the branch engine in parallel makes this worse. **Decision: the production engine on `main` is the keeper** (it's wired, richer, and memory-aware). The branch engine's value is its *tested rigor* and its *transfer-exclusion logic* — both of which should be ported INTO `report-metrics.ts`, not maintained separately. Recommend retiring `src/lib/finance/` as a runtime engine once its logic lands on `main` (keep it only if a marketing-demo needs an in-browser calculator).

---

## CORRECTNESS FINDINGS (production `report-metrics.ts` / `report-verify.ts`), severity-ranked

### 🔴 CRITICAL 1 — Internal transfers & owner draws are counted as real cash flow
`computeMetrics` sums `inflow`/`outflow` over **every** transaction. It never excludes transfers between the owner's own connected accounts, or owner draws/contributions.

- A $5,000 checking→savings transfer (both accounts connected) books **$5,000 outflow** (inflated burn) **and** $5,000 inflow on the other account.
- This corrupts **`outflow`, `monthlyBurn`, `runwayMonths`, `netCash`, `profitProxy`, `biggestMover`, `ownerPay`**, and the annualized **tax flag** below.
- Plaid already gives the signal: `personal_finance_category.primary` = `TRANSFER_IN` / `TRANSFER_OUT` / `LOAN_PAYMENTS`, and the sync stores it in `plaid_transactions.category`. The metrics engine just doesn't filter on it.
- **Fix:** exclude `TRANSFER_IN`/`TRANSFER_OUT` (and flag owner-equity) from inflow/outflow, exactly as `src/lib/finance/metrics.ts` does (`PNL_EXCLUDED` set + opposite-signed pair matching). This is the single highest-impact correctness fix in the whole product. A "money truth" report that counts a savings transfer as burn is wrong on its primary number.

### 🔴 CRITICAL 2 (security) — `access_token` stored and used in plaintext
`_shared/plaid.ts` reads `item.access_token` directly; the migration stores it as a plain column. The integration spec requires server-side encryption (pgsodium/Vault). A leaked DB = every customer's bank feed. **Backend/Lovable's lane — flag, don't edit here.** Treat as a launch-gate.

### 🟠 HIGH 3 — The verification gate leaks money figures through the "structural" whitelist
`report-verify.ts` `structuralAllowed` returns `{60, 5, 50, 15, 30, 0, 100, …}` **plus every integer 1–12**, and that same set is checked against **dollar** and **percent** matches (`structural.includes(value)`).

- Consequence: the model can state **"$60"**, **"$5"**, **"$12"**, **"$100"**, **"30%"**, **"15%"**, **"50%"** with *no* grounding — they're auto-allowed. `$60` passes because 60 is the dispute-window constant. Small dollar claims ($1–$12) all pass.
- Counts ("3 subscriptions") and dollars ("$3") are conflated by one numeric set.
- **Fix:** separate the *count* whitelist (applies only to bare integers / "N subscriptions") from the *currency* and *percent* allow-lists. Never let dispute-window/Profit-First constants satisfy a `$` match. Drop blanket 1–12 for dollar amounts.

### 🟠 HIGH 4 — Tax/S-corp flag is extrapolated from a 14-day cash window
`annualNet = profitProxy * (365/14)`, then S-corp eligibility fires at `annualNet ≥ $60k`. One large deposit or transfer (see CRITICAL 1) in a fortnight swings `annualNet` by tens of thousands and toggles a **tax recommendation routed to the owner's CPA**. **Fix:** compute the annualization off a trailing 90–180 day window (or YTD), *after* transfer exclusion; widen the estimate band and label the sample window explicitly.

### 🟡 MEDIUM 5 — Verifier tolerance is loose enough to pass materially-wrong numbers
`matches()` allows `±max(1, |a|×0.01)` for dollars and `×0.02` for percents, against a *dense* registry. On a $50,000 figure that's ±$500; with dozens of registered figures the union of tolerance bands is wide, so a fabricated number near any real one passes. **Fix:** tighten to nearest-dollar/nearest-cent exact-after-rounding for currency; reserve percentage tolerance for genuine rounding only.

### 🟡 MEDIUM 6 — Bare numbers (no `$`/`%`/"months") are never checked
The verifier only scans `$…`, `…%`, and `… months`. "revenue of 12,000" or "about 12 thousand" escapes entirely. The system prompt asks for `$`, but the gate must not depend on the model's compliance. **Fix:** also scan large bare numerics (≥ ~100, excluding 4-digit years and the period dates) against the currency allow-list.

### 🟡 MEDIUM 7 — PFCv2 not requested in the sync
`plaid-sync-transactions` calls `/transactions/sync` without `personal_finance_category_version: "v2"` (+10% primary / +20% detailed accuracy, per report 14). Higher first-pass accuracy = smaller ambiguous tail = better coverage and fewer miscategorized transfers. **Fix:** add the flag to the sync body (and to `/transactions/recurring/get`).

### 🟢 LOW 8 — Duplicate-charge detector can double-count & flag legitimate recurrings
O(n²) with an inner `break` pairs (0,1) then (1,2) across iterations; and a real twice-monthly subscription billed 2 days apart is flagged as a "duplicate to dispute." **Fix:** mark matched indices consumed; exclude merchants present in `recurring_streams`.

### 🟢 LOW 9 — `profitProxy = netCash` is labeled "profit"
Cash-basis inflow−outflow over 14 days is not profit (no accrual, no COGS split). The prompt hedges ("proxy"), but the field name invites the model to say "profit." Acceptable for a cash-truth product **only after** transfer exclusion; consider renaming to `netCashFlow` to stop the model conflating cash with profit.

---

## WHAT LOVABLE GOT RIGHT (keep, don't touch)

- The **5-layer grounded pipeline** is exactly the advisory-report doctrine: deterministic metrics → memory injection (prior recommendations, accountability callback) → Opus 4.8 tool-call → **verify-and-retry-once** → persist with `verification_passed`/`coverage_pct`. This is genuinely strong.
- **`figures` registry**: every citable number registered flat for the verifier — the right pattern.
- **Memory store** in `advisory_reports` (`metrics_snapshot` + `recommendations[]` carried forward) — the compounding moat, already modeled.
- **Merchant normalization** (AMZN/Amazon.com→"Amazon"), **recurring/waste detection**, **industry benchmarks**, **Profit-First owner-pay**, **60-day dispute window** — all high-value, all grounded.
- **Server-authoritative** writes (service_role), RLS deny-by-default, owner corrections via edge function — correct security posture (modulo the token-encryption gap).

This is a well-architected backend. The findings above are about *numeric correctness at the edges*, not a rebuild.

---

## THE RECONCILIATION DECISION (what "next" should be)

1. **One engine.** Port the branch engine's two assets into production `report-metrics.ts`: (a) **transfer/owner-equity exclusion** (CRITICAL 1), (b) **a unit-test harness** (Deno `deno test`, mirroring the 18 branch tests) so the money math is regression-proof. Then retire `src/lib/finance/` as runtime.
2. **Harden the gate** (HIGH 3, MEDIUM 5/6): separate count/currency/percent allow-lists; tighten tolerance; catch bare numbers.
3. **Fix the tax window** (HIGH 4) and **request PFCv2** (MEDIUM 7).
4. **Encrypt the access token** (CRITICAL 2) — Lovable/backend launch-gate.

**Ownership:** `_shared/report-metrics.ts`, `report-verify.ts`, and `plaid-sync-transactions` live on `main` (Lovable's tree). Per the Concurrent-Tree Protocol this audit does **not** edit them. The fixes should land either (a) by Lovable on `main`, or (b) by an explicit hand-off where this engine ports the logic onto `main` with the owner's go-ahead. **Recommend:** owner decides whether to (a) hand these findings to Lovable, or (b) authorize this engine to implement CRITICAL 1 + the test harness directly on `main`.

---

## BOTTOM LINE

The product is much further along than the branch suggested — Lovable shipped the whole grounded pipeline, wired to real Plaid data. It is well-built. But its primary numbers are **not yet transfer-aware**, so a customer who moves money between their own accounts gets an inflated-burn, wrong-runway report — and the verification gate currently lets small/round money figures through ungrounded. Those two fixes (transfer exclusion + a tighter gate), plus a test harness, are what turn a sophisticated pipeline into a *trustworthy* one. That is the highest-leverage work remaining, and it belongs on `main`.
