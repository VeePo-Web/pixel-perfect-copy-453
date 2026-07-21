# GoldFin Spreadsheet Audit (2026-07-15)
## Do the delivered .xlsx files actually work, and are they world-class?

Method: opened every shipped workbook with **openpyxl** (an Excel-grade OOXML
parser — if it opens there, Excel/Sheets/Numbers open it), dumped every cell +
number format, and checked internal arithmetic. Files audited:
`public/downloads/goldfin-{owner-command-center,13-week-cash-map,cash-basis-p-l-review,expense-and-vendor-audit}-sample.xlsx`
and `goldfin-template-vault.xlsx`.

**Verdict:** they open cleanly and the package structure is valid (they "work"
mechanically). Five quality gaps kept them from being world-class; four are
**fixed in this commit and re-verified**, one is a product decision specced below.

---

## What was verified SOUND
- All five workbooks open with zero repair prompts. Valid OOXML: `[Content_Types]`,
  rels, styles, per-sheet parts all present and consistent.
- Structure is thoughtful: a branded Cover, the template sheet(s), a Methodology
  sheet with honest scope/disclaimers, and hidden `__metrics` / `__mapping` /
  `__checks` audit sheets. The `__checks.net_cash_identity = 0` self-test is a
  genuinely nice touch.
- Native numbers (not pre-formatted strings), so Excel can compute on them.

---

## Fixed in this commit (verified with openpyxl after regeneration)

### 1. Sample data didn't reconcile (trust risk on the first artifact)
The demo's `monthlyBurn` was **6,800** while `outflow` was **41,180 over a
16-day period** — a ~$78k/month run-rate, so the stated burn was ~11× too low.
That understated burn cascaded into a too-low reserve floor (20,400) and a
falsely reassuring "5.6 months runway." A financially-literate prospect who
cross-checks the sample would find numbers that don't add up.
**Fix:** redesigned `SAMPLE_METRICS` as one coherent, healthy business over a
full calendar month where every derived cell reconciles the way the live engine
derives it: `netCash = inflow − outflow`, `monthlyBurn = outflow / span`,
`runway = cash / burn`, `reserveFloor = burn × 3`, `ownerPay = inflow × Profit-First
split`. A new test (`sampleTemplates.test.ts`) locks these relationships so the
sample can't silently drift again.

### 2. Hidden `__metrics` sheet formatted non-dollar values as currency
`runwayMonths 5.6` rendered as **"$6"**, `coveragePct 94` as **"$94"**,
`transactionsCount 118` as **"$118"**, `reserve_floor_months 3` as **"$3"**, and
the percent metrics as "$6"/"$3". Hidden, but shipped — embarrassing if unhidden.
**Fix:** `metricsSheet` now styles each metric by its real unit (percent / months
/ count / money).

### 3. Percents were ambiguous; months could read as dollars
Visible percents showed a bare "94.0" (no % sign); months showed a bare number.
**Fix:** percent format is now `0.0"%"` → **"94.0%"** (a literal suffix, so no
Excel ×100 scaling bug), and months is `0.0" mo"` → **"3.7 mo"**.

### 4. A developer TODO leaked into a shipped (hidden) sheet
`__raw_transactions` shipped the note *"The current frontend report snapshot does
not include raw transaction rows. Server-side XLSX generation can populate this
sheet…"* — an internal note in a customer file.
**Fix:** replaced with customer-appropriate copy.

### 5. (bonus) Cross-surface number inconsistency
The homepage `VaultPreview` showed a *third* different business ($84,200 cash)
from the downloadable file ($38,400) and the test fixture ($84,200).
**Fix:** aligned `VaultPreview` to `SAMPLE_METRICS`, so the numbers a prospect
sees on the site match the file they download.

**Reproducibility:** the shipped files are now regenerated from the single source
of truth via `npx tsx scripts/generate-sample-xlsx.ts` (then re-zip the four
`*-sample.xlsx` into `goldfin-template-vault.zip`), so they can never hand-drift
from the code again.

---

## RESOLVED (v2) — banker's review: from calculators to decision tools

A CFO-lens pass (would a business owner actually *use* these?) found the first
fillable version was mechanically correct but shallow — a couple of formulas per
sheet with no verdict, no ratios, no breakdown. Redesigned each into a real
decision tool, and **verified with a live Excel formula engine** (`formulas`)
that they evaluate correctly and recalculate when an input changes:

- **Owner Command Center** now opens with a plain-English **verdict** computed
  from the numbers (`=IF((in-out)<0,"…act now",IF(cash<reserve,"…build cash",…))`)
  and shows the ratios an owner actually steers by: **profit margin %**, **owner
  pay as % of income**, **cash coverage in months**, reserve floor, cash vs
  reserve. Engine check: margin 25.4%, coverage 3.73mo; edit Money in
  96,400→150,000 and profit recalculates 24,500→78,100, margin→52.07%.
- **13-Week Cash Map** is now a real liquidity model: a **per-week table** (edit
  any week's money in/out), a **running ending-cash** formula that chains week to
  week, and **crunch detection** — `MIN()` lowest week, `COUNTIF()` weeks below
  your floor, and a verdict. Engine check: inject a 200k week-5 outflow and the
  lowest-cash figure drops 273,716→113,357.
- **Cash-Basis P&L** is now **categorized** (materials, payroll, rent, software,
  marketing, owner pay, other) with **each cost as % of revenue**, a SUM total,
  **operating profit**, **profit margin**, and a tax reserve. Engine check:
  operating profit 24,500, margin 25.4%.
- **Expense & Vendor Audit** is now a **cut-decision tool**: per-vendor annual
  drain (`×12`), **% of total**, a Keep/Review/Cut column, and a **SUMIF** that
  totals the annual savings of everything marked "Cut." Engine check: 948/yr.

The `formulas` engine also caught a real defect during verification — a cover
cell emitting `s="undefined"` (a `c()`-vs-`row()` misuse) that would have made
Excel refuse the file; fixed, plus a `sheetXml` guard so an unmapped style can
never emit `s="undefined"` again.

---

## RESOLVED (v1) — the free templates are now genuinely fillable

The "not fillable" gap below is **closed**. The free lead-magnet workbooks are now
interactive, self-contained planning models:
- Each template has a **"Start here"** cover, a shaded-input **Your inputs**
  section, a **Results** section of Excel **formulas** that reference the inputs,
  and an **About** sheet explaining the shaded-vs-computed convention.
- Editing a shaded gold cell recalculates every grey result. Verified against an
  Excel-grade parser: e.g. Owner Command Center `Net cash = $B$8-$B$9`,
  `Reserve floor = $B$9*$B$10`, `Cash over reserve = $B$7-$B$9*$B$10`; the
  13-Week map projects `= $B$7+($B$8-$B$9)*n` for n=1..13; Cash P&L
  `After-tax = ($B$7-$B$8)-$B$7*$B$9/100`; Vendor Audit totals are `SUM()` over
  the editable rows. The coverage formula is `IF($B$9=0,0,$B$7/$B$9)` so clearing
  an input never yields `#DIV/0!`.
- Implemented in `buildWorkbook.ts` (`buildGoldfinFillableVaultXlsx` /
  `buildGoldfinFillableTemplateXlsx`, formula-aware cells + shaded input styles),
  pre-filled from `DEFAULT_FILLABLE_INPUTS`, generated by
  `scripts/generate-sample-xlsx.ts`, and locked by `fillableWorkbook.test.ts` (8
  tests: formulas present, wired to inputs, cached values correct, div-by-zero
  guarded, non-finite still fails loud).
- The **paid** in-portal export keeps the static "closed-month report" builder —
  correct for a verified report of a finished period; the two now serve their two
  distinct jobs deliberately.

The original finding is preserved below for the record.

---

## (RESOLVED) The workbooks were NOT fillable, but the marketing sells them as fillable
Every cell is a **static value — zero formulas** across all five files. The
13-week projection, net cash, weekly baselines, profit proxy, projected ending
cash — all frozen constants. But the funnel copy says: *"Open it, drop in your
numbers, and you'll see the business more clearly in about ten minutes."* If an
owner opens the free template and types their own cash balance, **nothing
recalculates.** It's a static snapshot of a demo business, not a working model.

This is the single biggest "world-class" gap, and it's a genuine product call
because the same builder feeds two very different jobs:
- **Free lead magnet** — sold as a fill-it-yourself template → *should* be a live
  model with formulas + input cells.
- **Paid monthly report** — "your numbers, filled and interpreted" for a closed
  period → a static, verified artifact is correct there.

**Recommended resolution — make the FREE tier a genuine fillable template**, kept
distinct from the paid static report:
1. In `buildWorkbook.ts`, let a `Cell` optionally carry a formula. Emit
   `<c ...><f>FORMULA</f><v>cachedValue</v></c>` — keep the GoldFin-computed value
   as the cached `<v>` (so the anti-fabrication trace gate still passes on the
   cached number), and add the `<f>` so Excel recalculates when inputs change.
2. Mark the handful of true inputs (cash on hand, money in, money out, reserve
   months) with a distinct "input" cell style (shaded) and reference them from the
   computed rows: `Net cash = money_in − money_out`, `Projected cash week N =
   cash + weekly_net × N`, `Reserve floor = burn × reserve_months`, etc. This
   requires tracking cell coordinates in the row builder (today it's a flat
   label|value grid).
3. Add a one-line "How to use — type your numbers in the shaded cells" note and,
   optionally, data validation on the input cells.
4. Keep the paid export static (a report, not a model) OR share the formula
   engine — either is fine, but decide deliberately.
Alternatively (lower effort, lower value): align the marketing copy so it no
longer promises a fill-in-yourself template. The recommended path is #1–4, because
a free tier that actually *works* when the owner types their numbers is a far
stronger proof-of-value for the $150/mo "we keep it filled for you" upsell.

### Minor — the "Runway" label
`Runway = cash / gross monthly outflow` (months of coverage if income stopped) is
a legitimate stress metric, but the bare label "Runway" on a profitable business
can read as alarming/misleading. Consider labeling it "Cash coverage (if income
paused)" or showing it only alongside net-burn context. Engine-level, low priority.

---

## Verification evidence
- openpyxl opens all 5 regenerated files with no repair; hidden-metric currency
  mis-format gone; `netCash = inflow − outflow`, `burn ≈ outflow/span`,
  `runway ≈ cash/burn`, `net_cash_identity = 0` all reconcile; percent cells carry
  `0.0"%"`, months carry `0.0" mo"`.
- `144/144` unit tests + `tsc -b && vite build` green (incl. the previously-dark
  XLSX suite now running under the `**` vitest include, and the new sample-
  coherence test).
