# GoldFin Desk — Report & Spreadsheet Template Design
## What the AI auto-fills: the briefing sections, the spreadsheet line items, and the category → line mapping

> **The deterministic contract.** Code computes every number from categorized transactions; the LLM only writes the prose around injected numbers. This doc defines the exact numbers and where they go — so the spreadsheet and the report read from one source and can never disagree.
> **Persona:** `personas/plaid-architect.md` · **Architecture:** `docs/plaid-integration-spec.md` · **Engine:** `src/lib/finance/`
> **Sign convention (ours):** on ingest we flip Plaid's sign so **positive = money IN (inflow), negative = money OUT (outflow)** — the accounting convention, opposite of Plaid raw. Internal transfers and owner-equity moves are excluded from the P&L.

---

## 1. The category taxonomy (Plaid PFC primary → our statement section)

Every transaction resolves to one of our **statement sections**, which drive both the report and the spreadsheet. Plaid PFC v2 primary categories map as the first pass; rules + the AI tail refine the hard cases.

| Statement section | Feeds | Plaid PFC primary (first pass) | Hard-case overrides |
|---|---|---|---|
| `revenue` | P&L income | `INCOME` | refunds-as-negative-expense, not income |
| `cogs` | P&L cost of goods | `GENERAL_MERCHANDISE` (resale), `RENT_AND_UTILITIES` (if direct) | per-business rule |
| `opex` | P&L operating expense | `FOOD_AND_DRINK`, `GENERAL_SERVICES`, `TRANSPORTATION`, `TRAVEL`, `RENT_AND_UTILITIES`, `ENTERTAINMENT`, `PERSONAL_CARE`, `GENERAL_MERCHANDISE` | software, fees, marketing split by merchant |
| `payroll` | P&L payroll | `INCOME` (outflow side), payroll merchants | Gusto/ADP/Rippling detection |
| `tax` | P&L / set-aside | `GOVERNMENT_AND_NON_PROFIT`, tax merchants | estimated-tax detection |
| `owner_equity` | **excluded from P&L** → equity | `TRANSFER_OUT`/`TRANSFER_IN` to a personal account | owner-confirm once → rule |
| `internal_transfer` | **excluded from P&L** | `TRANSFER_*` between own accounts | opposite-signed pair match |
| `debt_service` | cash-flow financing | `LOAN_PAYMENTS` | principal vs interest split |
| `uncategorized` | review queue | `LOW`/`UNKNOWN` confidence | AI tail + one-tap review |

**Rule of precedence:** user/learned rule → Plaid PFC (high confidence) → AI (ambiguous tail). `internal_transfer` and `owner_equity` never touch revenue/expense totals.

---

## 2. The three spreadsheet templates (the .xlsx the customer downloads)

### 2a. Profit & Loss (monthly) — the primary template
```
Row                          Source (deterministic)
─────────────────────────────────────────────────────
REVENUE
  Sales / Services           sum(revenue inflows)
  Other income               sum(other income inflows)
  Total Revenue              = Σ revenue
COST OF GOODS SOLD
  COGS                       sum(cogs outflows)
  Gross Profit               = Revenue − COGS
  Gross Margin %             = Gross Profit / Revenue
OPERATING EXPENSES
  Payroll                    sum(payroll outflows)
  Rent & Utilities           sum(opex: rent/utilities)
  Software & Subscriptions   sum(opex: software)
  Marketing                  sum(opex: marketing)
  Travel & Meals             sum(opex: travel + food)
  Other OpEx                 sum(remaining opex)
  Total OpEx                 = Σ opex + payroll
NET
  Net Operating Income       = Gross Profit − Total OpEx
  Taxes                      sum(tax outflows)
  Net Income                 = Net Operating Income − Taxes
MEMO (below the line, not in P&L)
  Owner Draws                sum(owner_equity outflows)   ← excluded above
  Owner Contributions        sum(owner_equity inflows)    ← excluded above
  Internal Transfers         count + Σ (informational)     ← excluded above
```

### 2b. Cash Flow (monthly)
```
Opening cash               balance at period start (from Plaid Balance / prior close)
+ Net cash from operations  Σ(operating inflows − operating outflows)
− Debt service              Σ debt_service
± Owner equity              Σ owner_equity (draws −, contributions +)
= Closing cash             opening + the above   (reconcile to Plaid Balance at close)
Burn / Build                closing − opening
Runway (months)            closing cash / avg monthly net burn   (only if burning)
```

### 2c. Budget vs Actual (when a budget exists)
```
Per line item: Budget | Actual (from 2a) | Variance $ | Variance %  →  flag if |variance%| > threshold
```

### 2d. Transactions ledger (supporting tab)
Every posted transaction: date · merchant · amount (signed) · statement section · category · source (rule/plaid/ai/user) · confidence · is_transfer · is_owner_equity. This is the audit trail that lets the customer tie any number back to their bank.

**Generation:** `.xlsx` via `openpyxl` in the report edge function — **numbers injected from §metrics, never computed by the model.** Tabs: P&L · Cash Flow · Budget vs Actual · Transactions.

---

## 3. The briefing report (the six sections — grounded)

Reuse the existing labels from `generate-briefing`, but grounded in computed numbers + memory. Opens with the "one number."

```
0. SUBJECT          "Cash: $X · ↑/↓ vs last month" — the open-me line.
1. THE ONE NUMBER   Net cash position (or runway) + plain verdict + delta vs last period + 1-sentence why.
2. CASH MOVEMENT    Opening → closing cash, burn/build, runway. (from 2b)
3. REVENUE TREND    Total revenue, vs last period, the driver. (from 2a)
4. EXPENSE PATTERN  Total OpEx + top movers by line, margin trend. (from 2a)
5. UNUSUAL SPEND    Anomalies: a line up >X%, a new large merchant, a doubled subscription.
6. QUESTIONS TO REVIEW   Low-confidence categories + transfers/owner-draws to confirm (one-tap).
7. DECISIONS TO CONSIDER 2–3 grounded actions for this period (tax set-aside $, an AR chase, a cut).
8. TRUST FOOTER     "Data as of <date> · reconciled to your connected accounts."
```

Every figure in sections 1–7 is injected from §metrics and **verified back to the metrics layer before send** (an untraceable number blocks delivery). Section 7 always ends in action.

---

## 4. The metrics object (the single source both templates read)

```
PeriodMetrics {
  periodStart, periodEnd, dataAsOf
  revenue, otherIncome, totalRevenue
  cogs, grossProfit, grossMarginPct
  payroll, opexByLine{}, totalOpex
  netOperatingIncome, taxes, netIncome
  openingCash, netCashFromOps, debtService, ownerEquityNet, closingCash, burn, runwayMonths
  ownerDraws, ownerContributions, internalTransferCount   // memo (excluded from P&L)
  deltas{ vs prior period for every headline }
  anomalies[]   // line/merchant flags for "Unusual Spend"
  reviewQueue[] // low-confidence + transfers/owner-draws to confirm
}
```

This is what `src/lib/finance/metrics.ts` produces deterministically, what fills the spreadsheet (`fillTemplate.ts`), and what Opus narrates (forbidden to recompute).

---

## 5. Implemented now

`src/lib/finance/` ships the deterministic core of this design as pure, typed, dependency-free TypeScript:

- **`categoryTaxonomy.ts`** — Plaid PFC primary → statement section first-pass map (§1).
- **`metrics.ts`** — `computePeriodMetrics`: every P&L/cash-flow number, deltas, anomalies, and the review queue (§4). Internal transfers and owner-equity are excluded from the P&L by construction.
- **`templates.ts`** — `fillProfitAndLoss` (§2a) and `fillCashFlow` (§2b) build the `FilledTemplate` rows the spreadsheet/report render; `traceableValues` is the verification-gate allow-list (any rendered number not in it is untraceable and must not ship).
- **`metrics.test.ts`** — the anti-hallucination contract in code: 11 `node:test` cases proving transfers/owner-equity never touch P&L totals, the cash-flow identity holds, pending rows are excluded, the review queue is correct, and every template cell traces back to a metrics field.

Verified by `npm run build` (`tsc -b` + vite) and `npm run test` (Node 24 native TS, **zero new dependencies**). Reusable by the future product app, the report edge function, and the marketing demo. The Plaid wiring (Phase 0) and the `.xlsx`/Opus layers (Phase 1c) consume this core unchanged.
