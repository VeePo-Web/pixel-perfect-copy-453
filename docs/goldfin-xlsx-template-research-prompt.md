# GoldFin Desk - Worldclass Plaid-Filled XLSX Template Prompt

Date: 2026-07-11
Audience: Codex 5.5 Extra High
Objective: build the top four Goldman Sachs-quality, GoldFin-branded Excel workbooks that are original GoldFin assets and can be auto-filled from Plaid business bank and card statement data.

## Research Basis

This prompt is based on internet research plus the current GoldFin codebase.

Primary sources audited:

- Plaid Transactions product and docs: up to 24 months of transaction data, real-time updates, merchant/category/location/payment-channel fields, recurring streams, `/transactions/sync`, PFC v2 taxonomy.
  - https://plaid.com/products/transactions/
  - https://plaid.com/docs/transactions/
  - https://plaid.com/docs/api/products/transactions/
- Plaid Business Financial Management use case: small-business bank support, balances plus up to 24 months of transactions, business-account identification, merchant/category enrichment, recurring vendors.
  - https://plaid.com/use-cases/business-financial-management/
- Plaid Balance product: real-time balance checks.
  - https://plaid.com/products/balance/
- Corporate Finance Institute financial modeling guidelines: output-first model design, modular design, layout/print consistency, transparency, formatting, row/column consistency, protection.
  - https://corporatefinanceinstitute.com/resources/financial-modeling/free-financial-modeling-guide/
- Vertex42 template patterns for cash flow, P&L/income statement, and business budget. These are reference patterns only. Do not copy, redistribute, or derive protected layouts because many are private-use-only.
  - https://www.vertex42.com/ExcelTemplates/cash-flow-statement.html
  - https://www.vertex42.com/ExcelTemplates/profit-and-loss.html
  - https://www.vertex42.com/ExcelTemplates/income-statement.html
  - https://www.vertex42.com/ExcelTemplates/business-budget.html
- SCORE financial projections template scope: useful as a contrast because it includes many elements Plaid-only data cannot fully autofill, such as startup expenses, payroll costs, sales forecasts, balance sheet, break-even, COGS, amortization, and depreciation.
  - https://www.score.org/templates/financial-projections-template/
- QuickBooks Cash Flow Planner: validates the cash-planning pattern from connected bank/card data, manual planning items, thresholds, and XLS/CSV/PDF export.
  - https://quickbooks.intuit.com/learn-support/en-us/help-article/budget-forecast-reports/use-cash-flow-planner-quickbooks-online/L2l59mIqe_US_en_US
- Spreadsheet engineering research: professional spreadsheet methodologies improve maintainability; quality criteria should be explicit, artifact-level, and testable.
  - https://arxiv.org/abs/1008.4174
  - https://arxiv.org/abs/1111.6907
  - https://arxiv.org/abs/1211.7104
- Current GoldFin files that must shape the implementation:
  - `docs/plaid-architect-prompt.md`
  - `docs/plaid-build-plan.md`
  - `docs/plaid-report-templates.md`
  - `src/components/templates/content.ts`
  - `src/lib/finance/productTemplates.ts`
  - `src/lib/finance/productTemplatesCsv.ts`
  - `src/components/report/TemplateDownloadCard.tsx`
  - `supabase/functions/_shared/report-metrics.ts`
  - `reports for claude/17-the-missing-half-autofilled-templates.md`

## The Hard Filter

Only build templates that can be materially auto-filled from Plaid business bank/card statement data and GoldFin's existing deterministic metrics. Do not build templates that require accounting-ledger, payroll, inventory, invoice, tax-jurisdiction, POS, ecommerce, CRM, or ad-platform data unless they degrade to a clearly labeled optional/manual add-on.

Plaid-supported facts:

- Accounts and balances, especially depository cash balances via Balance/accounts.
- Transactions: date, amount, description, merchant, category, payment channel, account, pending/posted state.
- Up to 24 months of history when requested.
- Merchant and category enrichment.
- Recurring inflow/outflow streams via recurring transactions add-on.
- Business cash movement, spend/vendor pattern, revenue/deposit trend, recurring spend, cash runway/burn proxy, bank-statement credit/readiness signals.

Not Plaid-only:

- Full accrual balance sheet.
- AR/AP aging.
- Exact tax liability.
- Inventory/COGS by SKU.
- Product-level gross margin.
- Payroll headcount and loaded compensation detail.
- Depreciation/amortization/fixed asset schedules.
- Loan principal vs interest split unless Liabilities or loan statements are added.
- CAC/LTV, sales funnel, ad performance, customer cohorts.
- Job/project profitability.
- Full DCF, valuation, cap table, or investor model.
- Exact break-even by unit economics.

## Recommended GoldFin XLSX Lead Magnet Set

Build only these four for launch. Each should be available as an individual `.xlsx` and as part of a "GoldFin Template Vault" workbook.

1. Owner Command Center
   - Decision it answers: "What should I look at first this month?"
   - Plaid-fillable fields: cash on hand, money in, money out, net cash, monthly burn, runway, top expense mover, recurring spend, categorization coverage, transactions reviewed.
   - Why it leads: best screenshot, strongest trust-builder, premium desk feeling.

2. 13-Week Cash Map
   - Decision it answers: "Will cash get tight soon?"
   - Plaid-fillable fields: current cash, trailing inflow/outflow averages, recurring inflows/outflows, projected weekly cash path, cash floor warning, burn/runway.
   - Keep it honest: this is a bank-statement forecast baseline, not a CFO forecast with invoices and pipeline.

3. Cash-Basis P&L Review
   - Decision it answers: "Did the business actually make money on a cash basis?"
   - Plaid-fillable fields: revenue/deposits, expense buckets, payroll-like vendors, software/subscriptions, rent/utilities, meals/travel, taxes paid, bank fees, net cash profit proxy.
   - Keep it honest: label as "cash-basis operating view" and disclose excluded transfers/owner draws.

4. Expense And Vendor Audit
   - Decision it answers: "Where is money leaking or drifting?"
   - Plaid-fillable fields: vendor totals, category totals, top vendors, category deltas vs prior period, unusual/new large charges, duplicate charges, cost creep.
   - This is one of the highest ROI lead magnets.

Deferred V2 candidates:

5. Subscription And Recurring Spend Tracker
   - Decision it answers: "What am I paying for every month?"
   - Plaid-fillable fields: recurring streams, cadence, last amount, first amount, monthly equivalent, annualized cost, dormant subscriptions, cost increases.
   - Use Plaid recurring data when available; fall back to deterministic merchant/date/amount recurrence detection.

6. Revenue And Deposit Trend Tracker
   - Decision it answers: "Is growth translating into cash?"
   - Plaid-fillable fields: monthly inflows, prior-period deltas, concentration by depositor/description when safe, volatility, largest deposit days, refunds/chargebacks if identifiable.
   - Keep it honest: bank deposits are not the same as recognized revenue.

7. Owner Pay And Tax Reserve Planner
   - Decision it answers: "How much should I set aside before I spend?"
   - Plaid-fillable fields: period inflow, Profit First-style allocation, tax reserve target percentage, owner pay bucket, operating expense bucket, reserve floor months.
   - Keep it honest: this is a planning reserve, not tax advice.

8. Bank Statement Health / Lender Readiness Snapshot
   - Decision it answers: "Would this bank feed look strong to a lender?"
   - Plaid-fillable fields: average deposits, deposit consistency, average cash balance, cash low points, NSF/overdraft/fee signals if detectable, debt-service cash outflows, recurring revenue signals, volatility, negative-balance risk.
   - Keep it honest: not a credit decision and not a formal underwriting score.

Do not build these in V1:

- Hiring Affordability Calculator: can auto-fill baseline cash/runway/fixed-cost pressure, but proposed salary and start date require user assumptions.
- Business Budget Template: can auto-generate a baseline from trailing averages, but true budget is an owner decision. Treat as V2 "Auto-Baseline Budget" if needed.
- Cash Reserve Planner: can be rolled into Owner Command Center and Owner Pay/Tax Reserve.
- Full Balance Sheet, break-even, inventory, COGS, depreciation, and exact tax templates: not Plaid-only.

## Prompt For Codex 5.5 Extra High

You are Codex 5.5 Extra High operating as a worldclass financial spreadsheet architect, senior TypeScript engineer, Excel model auditor, and premium product designer for GoldFin Desk.

Your mission is to replace the current CSV-only auto-filled template surface with the four highest-value original, beautiful, GoldFin-branded `.xlsx` workbooks that feel institutional, precise, and premium. The workbooks must be powerful lead magnets and trust artifacts. They must be auto-filled only from Plaid business bank/card statement data and the deterministic GoldFin metrics engine. Code computes every number. The LLM never invents or computes a number.

### Ground Rules

1. Read these files before editing:
   - `docs/plaid-architect-prompt.md`
   - `docs/plaid-build-plan.md`
   - `docs/plaid-report-templates.md`
   - `src/components/templates/content.ts`
   - `src/lib/finance/productTemplates.ts`
   - `src/lib/finance/productTemplatesCsv.ts`
   - `src/components/report/TemplateDownloadCard.tsx`
   - `supabase/functions/_shared/report-metrics.ts`
   - `reports for claude/17-the-missing-half-autofilled-templates.md`

2. Do not copy any third-party workbook, protected layout, copyrighted worksheet, or Goldman Sachs asset. The target is Goldman Sachs-quality craft, not Goldman Sachs IP. This must be original GoldFin Desk intellectual property.

3. Use the official GoldFin brand:
   - Name: GoldFin Desk
   - Palette: white/paper, ink/charcoal, champagne/gold accents.
   - Use existing brand tokens and logo assets from the repo where possible.
   - Every workbook must feel like an official GoldFin Desk artifact.

4. Plaid sign discipline:
   - Inspect the actual current metrics sign convention in code and tests.
   - Raw Plaid convention is usually positive = money out, negative = money in.
   - GoldFin metrics may normalize this. Do not assume. Write tests that prove the workbook signs are correct.

5. No fake "complete" financial statements:
   - Use "cash-basis operating view", "bank-statement-derived", "planning estimate", or "reserve target" language where appropriate.
   - Exclude internal transfers, credit-card payoffs, and owner draws from operating P&L.
   - Memo owner draws and internal transfers below the line where useful.

### Build Scope

Build an `.xlsx` generation layer that can produce:

1. One combined GoldFin Template Vault workbook.
2. One individual workbook per launch template:
   - Owner Command Center
   - 13-Week Cash Map
   - Cash-Basis P&L Review
   - Expense And Vendor Audit

Do not add more than these four launch templates. Preserve V2 ideas in notes only. If the existing metrics object does not yet contain enough source data for one of the four, build the template contract and a graceful "needs metric" implementation with tests, then identify the exact metrics fields that must be added. Do not fill from fabricated placeholders in real customer exports.

### Recommended Technical Approach

Use the existing GoldFin `.xlsx` generation layer or a real `.xlsx` library with styling support. Visual quality matters:

- Cell fills, borders, font, alignment, number formats.
- Freeze panes.
- Sheet protection.
- Tab colors.
- Merged title blocks.
- Hidden audit/source sheets.
- Workbook metadata.

If package installation is needed, request approval and add the smallest justified dependency set. Avoid a huge front-end bundle by lazy-loading the xlsx exporter only when the user clicks download.

Create a clean module boundary:

- `src/lib/finance/xlsx/workbookTheme.ts`
  - GoldFin colors, fonts, border recipes, row heights, number formats.
- `src/lib/finance/xlsx/templateCatalog.ts`
  - Template IDs, titles, decision lines, required metric fields, sheet names, lead-magnet metadata.
- `src/lib/finance/xlsx/buildWorkbook.ts`
  - `buildGoldfinTemplateVaultXlsx(metrics, options): Promise<ArrayBuffer>`
  - `buildGoldfinTemplateXlsx(templateId, metrics, options): Promise<ArrayBuffer>`
- `src/lib/finance/xlsx/sheets/*.ts`
  - One pure builder per visible sheet/template.
- `src/lib/finance/xlsx/trace.ts`
  - Cell provenance and allow-list verification.
- `src/lib/finance/xlsx/download.ts`
  - Browser download helpers, lazy-imported from the UI.

Do not place business logic inside React components.

### Workbook Architecture

Each workbook must include:

1. Cover
   - GoldFin Desk wordmark/logo.
   - Workbook title.
   - Period.
   - "Bank-statement-derived planning workbook."
   - Data-as-of timestamp.
   - Connection coverage and transaction count.

2. Summary / decision sheet
   - The first useful sheet. No blank intro page after the cover.
   - 5 to 8 KPI tiles, but in Excel cells, not images.
   - One "Watch this" section and one "Next review" section.

3. The template analysis sheet
   - Stable rows.
   - Clear source labels.
   - Premium formatting, restrained gold accents.
   - Frozen headers.
   - Print-ready.

4. Methodology sheet
   - What Plaid data is used.
   - What is excluded.
   - What this workbook is not.
   - Tax/accounting disclaimer.

5. Transactions Ledger sheet
   - Date, account, merchant, description, amount, direction, Plaid category, GoldFin section, source, confidence, flags.
   - Use a proper Excel table with filters.
   - This sheet can be hidden in individual lead magnets if too large, but must exist in the full vault.

6. Hidden audit sheets:
   - `__metrics`
   - `__raw_transactions`
   - `__mapping`
   - `__checks`
   These exist so every number can be audited and so tests can read the workbook back.

### Visual Standard

The workbook must look like it came from a serious finance desk:

- White paper background.
- Ink header band.
- Champagne/gold hairlines, not loud gradients.
- No cartoon icons.
- No emoji.
- No neon.
- No giant decorative shapes.
- 8px-or-less visual radius equivalent where Excel shapes are used.
- Sparse typography, strong alignment, quiet hierarchy.
- Professional number formats:
  - Currency: `$#,##0;[Red]($#,##0);-`
  - Decimal currency only where cents matter.
  - Percent: `0.0%`
  - Months: `0.0x` or `0.0`
  - Counts: `#,##0`
- Use cell styles consistently:
  - Plaid-derived values: champagne-tinted source cells or a source marker.
  - Formulas/derived outputs: ink text.
  - User-editable assumptions, if any in future: blue fill and blue font.
  - Warnings: restrained red text/fill.
- Add a small legend on methodology/audit sheets.

### Anti-Fabrication Contract

Every visible numeric cell must be one of:

1. A direct metric value from the deterministic metrics object.
2. A deterministic value computed in TypeScript and registered in `figures` or the workbook trace map.
3. An Excel formula that references only audited source cells in `__metrics`, `__raw_transactions`, or other visible source cells.
4. A zero or blank cell representing "not available" with explicit label.

If any visible numeric cell cannot be traced, the exporter must throw and refuse to download.

Do not use rounded/display strings as source values. Store numbers as native Excel numbers with number formats.

### Template-Specific Requirements

#### 1. Owner Command Center

Visible sections:

- Cash position.
- Money in / money out / net cash.
- Runway and monthly burn.
- Top expense mover.
- Recurring spend.
- Largest review flags.
- Data confidence.

Source metrics:

- `cashOnHand`
- `inflow`
- `outflow`
- `netCash`
- `monthlyBurn`
- `runwayMonths`
- `biggestMover`
- `wasteAnnualTotal`
- `coveragePct`
- `transactionsCount`

#### 2. 13-Week Cash Map

Visible sections:

- Starting cash.
- Weekly baseline inflow.
- Weekly baseline outflow.
- Recurring inflows/outflows where available.
- Projected ending cash by week.
- Cash floor warning.

Implementation rule:

- If true recurring stream data is missing, use trailing averages and label it "baseline from trailing bank activity."
- Do not pretend to know invoice collections or bill due dates unless present in source data.

#### 3. Cash-Basis P&L Review

Visible sections:

- Revenue/deposits.
- Operating expenses by category.
- Payroll-like spend.
- Software/subscriptions.
- Rent/utilities.
- Travel/meals.
- Bank fees.
- Taxes paid.
- Cash profit proxy.
- Below-the-line exclusions: transfers, credit-card payments, owner draws/contributions.

Implementation rule:

- Use GoldFin statement-section mapping.
- Never let internal transfers inflate revenue or expenses.

#### 4. Expense And Vendor Audit

Visible sections:

- Total outflow.
- Top 10 vendors.
- Top expense categories.
- Biggest mover vs prior period.
- Duplicate charge candidates.
- Unfamiliar large charges.
- Cost creep.

Implementation rule:

- If data for vendors/categories is not yet exposed in the current metrics object, extend the metrics object deterministically and add tests.

### Deferred V2 Template Specs - Do Not Implement In Launch

#### 5. Subscription And Recurring Spend Tracker

Visible sections:

- Active recurring vendors.
- Monthly equivalent.
- Annualized cost.
- Cadence.
- Last amount.
- First amount.
- Dormant/waste flags.
- Cost increase flags.

Implementation rule:

- Prefer Plaid `/transactions/recurring/get`.
- Add deterministic fallback recurrence detection if recurring data is unavailable.

#### 6. Revenue And Deposit Trend Tracker

Visible sections:

- Monthly inflow trend.
- Prior period delta.
- Deposit volatility.
- Largest deposit days.
- Recurring deposit streams.
- Concentration / top deposit descriptions when safe.

Implementation rule:

- Label as "deposits/inflows", not accrual revenue.

#### 7. Owner Pay And Tax Reserve Planner

Visible sections:

- Inflow.
- Profit bucket.
- Owner pay bucket.
- Tax reserve bucket.
- Operating expense bucket.
- Reserve-floor comparison.

Implementation rule:

- Default to existing Profit First allocation from metrics.
- Label tax reserve as a planning target, not advice.

#### 8. Bank Statement Health / Lender Readiness Snapshot

Visible sections:

- Average monthly deposits.
- Deposit consistency.
- Average cash balance.
- Lowest cash point.
- Debt-service-like outflows.
- NSF/overdraft/fee signals if categories/merchant names support detection.
- Recurring revenue signal.
- Volatility.
- Overall "review posture" as informational, not a score.

Implementation rule:

- Do not call it credit approval, underwriting approval, or formal score.

### UI Integration

Upgrade `TemplateDownloadCard` so:

- The user sees "Download all (.xlsx)" and "Download this workbook (.xlsx)".
- CSV can remain as a secondary fallback if useful.
- XLSX generation is lazy-loaded only after a click.
- The UI still renders the current on-screen filled template tables.
- Errors from the trace gate show a calm user-facing message and log a developer-readable error.

Update marketing sample downloads:

- The sample/template vault lead magnet should offer a polished sample `.xlsx`.
- Sample data must come from `SAMPLE_METRICS` or another deterministic sample fixture.
- Never ship fake dynamic values outside the sample fixture.

### Tests And Verification

Add tests for:

1. Every template exports a non-empty `.xlsx` buffer.
2. The exported workbook can be read back by the same library.
3. Required sheets exist.
4. Required hidden audit sheets exist.
5. Visible numeric cells are traceable.
6. A tampered/untraceable value throws before export.
7. Transfers/owner draws are excluded from operating P&L.
8. Raw Plaid positive-spend sign convention is handled correctly.
9. The generated workbook contains native numbers, not currency strings.
10. The sample workbook passes the same anti-fabrication gate.

Run:

- `npm run build`
- `npm run test`

If adding `exceljs` makes tests slow, scope tests to the xlsx modules and keep at least one full integration test.

### Deliverables

By the end of the pass:

1. `xlsx` exporter modules exist.
2. Individual and vault workbook downloads work.
3. Workbook visual system is GoldFin-branded and premium.
4. Every workbook is print-ready and audit-ready.
5. Every visible number traces to deterministic metrics.
6. The UI offers `.xlsx` downloads.
7. Tests prove the anti-fabrication contract.
8. The final response lists:
   - Files changed.
   - Templates built.
   - What is fully Plaid-filled now.
   - What is intentionally excluded because Plaid-only data cannot support it.
   - Verification commands and results.

### Do Not Do

- Do not copy Goldman Sachs, Vertex42, SCORE, QuickBooks, CFI, or any third-party template.
- Do not build a balance sheet.
- Do not build exact tax liability.
- Do not build inventory/COGS by SKU.
- Do not build AR/AP aging.
- Do not build hiring affordability as a V1 Plaid-only workbook.
- Do not emit numbers as formatted text.
- Do not let the LLM calculate workbook values.
- Do not add macros.
- Do not add password-dependent workflows.
- Do not expose raw Plaid tokens or PII in workbook metadata.

## Product Positioning

These workbooks are not "free spreadsheets." They are the visible proof that GoldFin Desk turns bank activity into an owner-ready finance desk.

The free lead magnet teaches the shape of the decision. The paid product fills that shape from live data every month.

The winner here is not the workbook with the most tabs. It is the workbook an owner forwards to a partner, accountant, lender, or future self because it is clear, calm, traceable, and obviously built from their real numbers.
