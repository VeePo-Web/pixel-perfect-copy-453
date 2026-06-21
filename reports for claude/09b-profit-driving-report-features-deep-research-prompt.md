# Claude Deep Research Prompt - Profit-Driving Report Features

> **For Claude / Claude Code only:** This is a research, product, and conversion handoff report. Do not treat it as public-facing copy, runtime documentation, or permission to implement code.

## Purpose

This is the companion prompt to `09-plaid-biweekly-auto-fill-deep-research-prompt.md`.

The first Plaid prompt asks whether GoldFin can technically pull and structure the data. This prompt asks the harder business question:

> Which biweekly reports would actually help a business owner make or protect money?

The `$99/mo Auto-Filled Reports` offer should not feel like a cheaper dashboard. It should feel like a money-finding operating rhythm: every two weeks, the owner gets a short report that points to cash leaks, revenue changes, payment risks, margin pressure, and decisions worth making before the month is already over.

The public claim should never be "we guarantee you make money." The product should still be built around practical money outcomes:

- collect cash faster,
- avoid avoidable fees and interest,
- stop unused recurring spend,
- catch vendor and category creep,
- notice revenue drops early,
- protect gross margin,
- time payments more intelligently,
- identify concentration risk,
- make pricing and hiring decisions with more confidence.

## Relationship To The Existing Plaid Prompt

Claude must read both reports:

1. `reports for claude/09-plaid-biweekly-auto-fill-deep-research-prompt.md`
2. `reports for claude/09b-profit-driving-report-features-deep-research-prompt.md`

Use `09` to answer "what data can we pull and how should we automate it?"

Use `09b` to answer "which report features are worth paying `$99/mo` for because they help owners improve cash, profit, and decisions?"

## Guardrails

- Do not write app code.
- Do not touch runtime files.
- Do not claim guaranteed savings, guaranteed profit, or guaranteed revenue lift.
- Do not provide tax, investment, legal, credit, or financial advice.
- Do not position GoldFin as a bank, bookkeeping platform, CPA firm, lender, or card issuer.
- Do not copy Ramp, Visa, Goldman Sachs, Brex, Mercury, QuickBooks, Xero, Float, LivePlan, or any competitor.
- Do not claim direct Visa statement access unless the Plaid/Visa research proves it for the exact implementation path.
- Use competitor research as private product inspiration only.
- Every public-facing claim must be technically supportable from available data.

## Source Pack For Claude To Verify

Claude must browse current sources again before finalizing recommendations.

### Plaid And Data Sources

- Plaid Transactions overview: https://plaid.com/docs/transactions/
- Plaid Transactions API: https://plaid.com/docs/api/products/transactions/
- Plaid transaction data states: https://plaid.com/docs/transactions/transactions-data/
- Plaid Personal Finance Categories migration: https://plaid.com/docs/transactions/pfc-migration/
- Plaid Liabilities overview: https://plaid.com/docs/liabilities/
- Plaid Liabilities API: https://plaid.com/docs/api/products/liabilities/
- Plaid Statements overview: https://plaid.com/docs/statements/
- Plaid Balance overview: https://plaid.com/docs/balance/
- Plaid Recurring Transactions: https://plaid.com/blog/recurring-transactions/

### Spend, Banking, And Treasury Benchmarks

- Ramp Spend Management: https://ramp.com/spend-management
- Ramp Reporting: https://ramp.com/reporting
- Brex Spend Management: https://www.brex.com/product/spend-management
- Visa Spend Clarity: https://usa.visa.com/products/visa-spend-clarity.html
- Visa Spend Management: https://www.visa.com/en-us/solutions/spend-management
- Goldman Sachs Transaction Banking: https://www.goldmansachs.com/what-we-do/transaction-banking
- Goldman Sachs Liquidity Solutions: https://www.goldmansachs.com/what-we-do/transaction-banking/liquidity-solutions
- Goldman Sachs TxB Developer: https://developer.gs.com/discover/txb
- Mercury Accounting Automations: https://mercury.com/accounting-automations
- Mercury Financial Workflows: https://mercury.com/financial-workflows

### Cash Flow, Forecasting, And Business Metrics

- SBA manage your finances: https://www.sba.gov/business-guide/manage-your-business/manage-your-finances
- SBA cash flow strategy event summary: https://www.sba.gov/event/85255
- QuickBooks Cash Flow Planner FAQ: https://quickbooks.intuit.com/learn-support/en-global/help-article/money-movement/cash-flow-planner/L8kvVEdNC_ROW_en
- QuickBooks cash flow planner setup: https://quickbooks.intuit.com/learn-support/en-us/help-article/budget-forecast-reports/use-cash-flow-planner-quickbooks-online/L2l59mIqe_US_en_US
- QuickBooks late payments report: https://quickbooks.intuit.com/r/small-business-data/small-business-late-payments-report-2025/
- Xero cash flow forecasting: https://www.xero.com/us/accounting-software/analytics/cash-flow/
- Xero short-term cash flow: https://central.xero.com/s/article/Short-term-cash-flow
- Float cash flow features: https://www.floatapp.com/features
- LivePlan performance dashboard: https://www.liveplan.com/features/performance-dashboard

## Market Research Synthesis To Validate

This is the working hypothesis Claude must test.

### What The Best Companies Teach

- Ramp teaches that spend data becomes valuable when it creates visibility, controls, and faster action, not when it merely records transactions.
- Brex teaches that business owners and operators value real-time spend, budgets, policy exceptions, and AI-assisted insights when those insights point to savings or ROI.
- Visa Spend Clarity teaches that card data becomes valuable through spend visibility, controls, cashflow optimization, reporting, receipt capture, and transaction notifications.
- Goldman Sachs Transaction Banking teaches that serious financial products organize cash visibility, liquidity, and reporting with API-first rigor.
- QuickBooks and Xero teach that cash flow features matter when they combine bank data with invoices, bills, recurring income, and expected payment dates.
- Float teaches that scenario planning and forward-looking cash views are more valuable than rear-view reports alone.
- Mercury teaches that modern owners expect accounting automations, transaction rules, and workflows that reduce repeated manual cleanup.

### GoldFin's Strategic Opening

The competitors are either too enterprise, too accounting-heavy, too card-platform-dependent, or too operationally deep for a small owner who wants quick financial clarity.

GoldFin can win at `$99/mo` by becoming:

> The biweekly owner report that fills itself and shows the cash decisions worth checking now.

That means every report module should answer one of four questions:

1. Where did we lose or waste money?
2. Where might we make more money?
3. What cash timing problem is coming?
4. What decision should the owner review before it becomes expensive?

## Exact Prompt For Claude Deep Research

Use the prompt below as Claude's next research task after completing the Plaid feasibility prompt.

```text
You are Claude, acting as a senior fintech product strategist, treasury product researcher, SMB finance analyst, Plaid data architect, and direct-response conversion strategist for GoldFin / Monthly Finance Desk.

Your task is to produce a deep research report on which auto-filled biweekly finance reports would be genuinely valuable enough for business owners to pay `$99/mo`.

You are not writing code. You are researching product features, data requirements, spreadsheet designs, report modules, and conversion claims.

Read first:
1. docs/conversion-prompt.md
2. reports for claude/00-funnel-priority-index.md
3. reports for claude/08-99-checkout-readiness-audit.md
4. reports for claude/09-plaid-biweekly-auto-fill-deep-research-prompt.md
5. reports for claude/09b-profit-driving-report-features-deep-research-prompt.md

Business objective:
Make the `$99/mo Auto-Filled Reports` offer materially valuable because the reports help owners find cash leaks, protect margins, time payments, notice revenue changes, and make better decisions. Do not promise guaranteed profit or guaranteed savings.

Research rules:
- Browse current primary sources where possible.
- Cite every technical or market claim.
- Separate what Plaid alone can support from what requires QuickBooks, Xero, Stripe, Shopify, payroll, POS, CRM, invoice, inventory, or manual owner input.
- Mark every feature as MVP, phase 2, or avoid.
- Tie every feature to a business cash lever.
- Do not recommend features that sound impressive but create no owner action.
- Do not write app code.

Define the "cash lever" taxonomy first:
- Revenue protection
- Revenue growth signal
- Expense reduction
- Margin protection
- Cash timing
- Credit/card cost avoidance
- Working capital control
- Owner decision speed
- Bookkeeper/CPA follow-up
- Data quality/trust

For each proposed report feature, produce a table:
- Feature name
- Owner question answered
- Cash lever served
- Required data
- Plaid-only possible?
- Other integration needed?
- Formula or detection logic
- Thresholds to test
- False positive risk
- What the report should say
- What the report must not say
- Expected owner action
- Why this is worth paying for
- MVP or phase 2

Research and design these report categories:

1. Cash Pulse
- Starting balance, ending balance, net cash movement, cash in, cash out.
- Safe-to-spend estimate using recurring outflows, upcoming card payments, payroll/rent/manual reserves where available.
- Payroll/rent coverage indicator.
- Cash runway proxy for negative-cash-flow businesses.
- Data caveat when balances are stale or only transaction-derived.

2. Revenue Pulse
- Deposit trend over last 2 weeks, month-to-date, and trailing 90 days.
- New, missing, or shrinking deposit sources.
- Largest customer/payer concentration if payer names are reliable.
- Payment processor deposit trend.
- Refund, reversal, and chargeback-like signals where detectable.
- Warning when revenue cannot be distinguished from transfers without owner/bookkeeper review.

3. Expense Leak Finder
- New vendors above threshold.
- Vendor spend increases.
- Category creep.
- Duplicate-looking charges.
- Bank fees, overdraft fees, late fees, interest charges.
- Small recurring charges that compound.
- SaaS/subscription spend that rose, duplicated, or stopped being used, with owner review required.

4. Recurring Charge And Subscription Tracker
- Recurring inflows and outflows.
- Amount drift.
- Renewal risk.
- Annual charges coming due.
- Duplicate tools by category.
- Owner cancellation/review queue.
- Which recurring logic can be done from Plaid vs which needs invoice/vendor metadata.

5. Credit Card / Visa Statement Digest
- Card spend by merchant and category.
- Current balance, statement balance, credit limit, available credit, utilization proxy.
- Minimum payment, due date, last payment, APR, late/overdue state where available.
- Payment calendar and interest/fee risk.
- Statement-like digest from transactions and liabilities.
- Explicit caveat: "Visa" often means a Visa-branded card account linked through the issuing institution, not direct Visa statement data.

6. Vendor And Margin Watch
- Vendor concentration.
- Core supplier spend trend.
- Cost of goods proxy by category if owner maps categories.
- Gross margin proxy only when revenue and COGS mapping are good enough.
- Price pressure signal: expenses rising faster than deposits.
- Hiring/vendor decision prompt: "Review before adding another fixed monthly cost."

7. Marketing And ROI Watch
- Ad platform spend trend if merchant/category data identifies Meta, Google, TikTok, Yelp, agencies, etc.
- Revenue correlation warning: do not claim ROI without attribution.
- Prompt owner to compare spend changes against lead/revenue sources.
- Phase 2 integrations for true ROI: Stripe, Shopify, POS, CRM, ad platforms.

8. Accounts Receivable And Collections Watch
- What can be inferred from bank deposits alone.
- What cannot be inferred without invoice data.
- Phase 2 QuickBooks/Xero invoice aging integration.
- Late-payment risk report.
- Customer payment pattern changes.
- Prompt owner to follow up on expected deposits, without pretending Plaid can see unpaid invoices.

9. Accounts Payable And Bill Timing Watch
- Recurring vendor payments.
- Known upcoming card payments.
- Manual owner-entered future expenses.
- Phase 2 accounting integration for open bills.
- Pay/hold decision support without moving money or giving financial advice.

10. Tax And Reserve Reminder
- Owner-defined reserve percentage.
- Estimated set-aside based on deposits.
- Sales tax/payroll tax reminders only if data supports it or owner inputs it.
- Must include no-tax-advice disclaimer.
- Use as a planning prompt, not a calculation guarantee.

11. Decision List
- 3 to 7 owner actions every two weeks.
- Must be ranked by estimated dollar impact, urgency, confidence, and ease.
- Must include "why this appeared" and "what to check."
- Avoid generic advice.

12. Bookkeeper/CPA Question List
- Questions generated from data uncertainty.
- Examples: transfer vs revenue, owner draw, uncategorized vendor, possible duplicate charge, tax reserve settings, payment processor fees.
- This makes GoldFin cooperative with existing finance professionals, not competitive.

Build a feature scoring model:
- Dollar impact potential: 1 to 5
- Frequency of usefulness: 1 to 5
- Data reliability: 1 to 5
- Owner actionability: 1 to 5
- Low support burden: 1 to 5
- Conversion proof value: 1 to 5
- MVP score = weighted total

Weights:
- Dollar impact potential: 25%
- Owner actionability: 25%
- Data reliability: 20%
- Frequency: 15%
- Conversion proof value: 10%
- Low support burden: 5%

Use this scoring model to rank the top 15 MVP features and top 15 phase 2 features.

Create a "Plaid-only vs integration-expanded" matrix:
- Plaid-only feature
- Plaid + owner input feature
- Plaid + QuickBooks/Xero feature
- Plaid + Stripe/Shopify/POS feature
- Plaid + payroll feature
- Plaid + ad platform feature
- Avoid for now

Create an industry matrix for:
- Professional services
- Agencies and consultants
- Trades and home services
- Local retail
- Ecommerce
- Restaurants and cafes
- Medical/wellness practices
- SaaS or subscription businesses
- Real estate operators

For each industry, define:
- Highest-value report modules
- Which Plaid data is enough
- What extra integration would unlock more value
- Top owner decisions
- Best conversion proof angle

Design the final `$99/mo` report bundle:
- Report name
- Biweekly email subject pattern
- PDF/table-of-contents pattern
- Spreadsheet tab list
- Top 10 data cards
- Top 10 flags
- Top 10 owner decisions
- Top 10 "ask your bookkeeper/CPA" prompts
- Required onboarding questions
- Required customer settings
- Required disclaimers

Create the conversion translation:
- One Ogilvy-style mechanism headline.
- One Brunson-style value stack.
- One Pricing page proof block.
- One Sample Briefing proof module list.
- One checkout page trust block.
- One onboarding promise.
- One retention email after first report.
- One cancellation-save angle based on report value, not guilt.

CTA language must stay:
- Auto-fill my reports
- See how auto-fill works
- Generate sample briefing
- Get the free templates

Forbidden public language:
- Guaranteed savings
- Guaranteed profit
- AI magic
- CFO in your pocket
- Goldman Sachs-level
- Visa-backed
- Plaid-backed
- Tax advice
- Financial advice
- We find money automatically
- Get started
- Subscribe
- Buy now

Final deliverables:
Write:
1. reports for claude/12-profit-driving-report-feature-research.md
2. reports for claude/13-biweekly-money-making-report-blueprint.md

Both files must begin with:
> **For Claude / Claude Code only:** This is a research and execution handoff report. Do not treat it as public-facing copy or runtime documentation.

Do not write code.
Do not edit app files.
```

## Recommended MVP Feature Set To Research First

Claude should validate, score, and improve these as the likely first `$99/mo` modules.

| Module | Cash lever | Why owners pay | Plaid-only status |
|---|---|---|---|
| Cash Pulse | Cash timing | Know whether the business can absorb upcoming payments | Possible with Transactions + Balance, stronger with owner reserves |
| Expense Leak Finder | Expense reduction | Catch rising vendors, duplicates, fees, and forgotten subscriptions | Strong Plaid MVP |
| Recurring Charge Tracker | Expense reduction | Stop "small" recurring spend from quietly compounding | Strong with Transactions, stronger with Recurring |
| Credit Card Payment Watch | Credit/card cost avoidance | Avoid late fees, interest surprises, and payment-date blind spots | Needs Liabilities coverage |
| Revenue Pulse | Revenue protection | Notice deposit drops, missing payers, concentration, processor changes | Plaid MVP with caveats |
| Vendor Concentration Watch | Working capital control | Understand which vendors can hurt cash if costs change | Plaid MVP |
| Margin Pressure Proxy | Margin protection | See whether costs are rising faster than deposits | Plaid + owner mapping |
| Safe-To-Spend Calendar | Cash timing | Decide whether to hire, buy equipment, or wait | Plaid + owner input MVP |
| Owner Decision List | Owner decision speed | Turns data into action instead of another dashboard | Derived from above |
| Bookkeeper/CPA Questions | Professional follow-up | Makes cleanup easier and reduces ambiguity | Derived from exceptions |

## High-Value Report Features By Money Lever

### Collect Faster

Plaid alone cannot see unpaid invoices. It can still detect deposit patterns and missing expected deposits. The report should frame these as review prompts, not AR certainty.

- Missing recurring deposit alert.
- Payment processor settlement drop.
- Expected deposit not seen by date.
- Customer/payer concentration.
- Phase 2: QuickBooks/Xero invoice aging and expected payment dates.

### Spend Less

This is the strongest Plaid-only value path.

- New vendor over threshold.
- Duplicate-looking charge.
- Vendor amount drift.
- Category creep.
- Recurring charges by vendor/category.
- Bank fees, card fees, overdraft fees, interest charges.
- Annual renewal watch.

### Avoid Fees And Interest

Credit cards make the `$99` offer more tangible if Liabilities coverage is reliable.

- Statement balance and minimum payment watch.
- Payment due date calendar.
- APR/interest-bearing account warning.
- Utilization proxy.
- Late/overdue flag where available.
- "Review this payment date before payroll" prompt.

### Protect Margin

Margin is harder from Plaid alone, but owners will value it if GoldFin asks the right onboarding questions.

- Owner maps cost categories once.
- Cost categories rising faster than deposits.
- Vendor increase against flat revenue.
- Refunds or chargebacks rising.
- Payment processor fees rising as percentage of deposits.
- Phase 2: accounting/POS integration for true gross margin.

### Price Better

Plaid cannot directly calculate pricing power. It can show pressure that suggests a pricing review.

- Average deposit size trend.
- Repeat customer/payer trend.
- Revenue flat while supplier/payroll/software costs rise.
- Category cost inflation.
- "Review whether prices still cover these cost increases" prompt.

### Time Payments Better

GoldFin must not move money. It can still help owners see timing.

- Upcoming recurring outflows.
- Credit card due dates.
- Rent/payroll/reserve dates from owner inputs.
- Cash low point estimate.
- "Hold discretionary spend until after expected deposits" prompt, phrased as review not advice.

## Report Feature Acceptance Checks

A report feature is not valuable enough for `$99/mo` unless it passes all checks:

- It answers a painful owner question in one sentence.
- It has a visible cash lever.
- It can be produced from reliable data or clearly marked caveats.
- It tells the owner what to review next.
- It avoids regulated advice.
- It can appear in a sample briefing as proof.
- It can be explained on Pricing in plain English.
- It has a low support burden for the first version.
- It can trigger a useful retention moment after the first report.

## Conversion Notes For Claude

The strongest Ogilvy-style angle is specificity:

> "Every two weeks, GoldFin fills the reports that show your cash movement, recurring charges, card payment dates, vendor increases, and owner decisions to review."

The strongest Brunson-style stack is not a pile of dashboards. It is a stack of decisions:

- "Find the recurring charges worth reviewing."
- "See which vendor costs changed."
- "Catch duplicate-looking card charges."
- "Know which payment dates are coming."
- "See whether deposits are slowing down."
- "Get the owner decision list before the month closes."

Avoid "make money automatically." Use "find the decisions that protect cash and profit."

## Definition Of Done

This prompt is successful when Claude can create the two research outputs without guessing:

- `reports for claude/12-profit-driving-report-feature-research.md`
- `reports for claude/13-biweekly-money-making-report-blueprint.md`

No app code should change during this research stage.
