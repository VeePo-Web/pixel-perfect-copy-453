> **For Claude / Claude Code only:** This is a research and execution handoff report. Do not treat it as public-facing copy or runtime documentation.

# Profit-Driving Report Feature Research

## Research Position

The `$99/mo Auto-Filled Reports` product should not sell "bank data in a spreadsheet." That is a commodity. It should sell a biweekly owner rhythm that helps the business protect cash, spot leakage, and decide what to review before the month closes.

This report executes `09b-profit-driving-report-features-deep-research-prompt.md`.

Research date: 2026-06-22.

## Source Policy

Claims below use primary or near-primary sources where possible. When a recommendation is strategic inference, it is marked as inference and must be tested with customer interviews, sandbox data, or production data before becoming public copy.

Key sources:

- Plaid Transactions: https://plaid.com/docs/transactions/
- Plaid Transactions API: https://plaid.com/docs/api/products/transactions/
- Plaid transaction data details: https://plaid.com/docs/transactions/transactions-data/
- Plaid Personal Finance Categories: https://plaid.com/docs/transactions/pfc-migration/
- Plaid Liabilities: https://plaid.com/docs/liabilities/
- Plaid Liabilities API: https://plaid.com/docs/api/products/liabilities/
- Plaid Balance: https://plaid.com/docs/balance/
- Plaid Statements: https://plaid.com/docs/statements/
- Plaid Link: https://plaid.com/docs/link/
- Plaid Recurring Transactions: https://plaid.com/blog/recurring-transactions/
- Ramp Reporting: https://ramp.com/reporting
- Ramp Spend Management: https://ramp.com/spend-management
- Brex Spend Management: https://www.brex.com/product/spend-management
- Visa Spend Clarity: https://usa.visa.com/products/visa-spend-clarity.html
- Visa Spend Management: https://www.visa.com/en-us/solutions/spend-management
- Goldman Sachs Transaction Banking: https://www.goldmansachs.com/what-we-do/transaction-banking
- Goldman Sachs TxB Developer: https://developer.gs.com/discover/txb
- Mercury Accounting Automations: https://mercury.com/accounting-automations
- Mercury Financial Workflows: https://mercury.com/financial-workflows
- SBA Manage Your Finances: https://www.sba.gov/business-guide/manage-your-business/manage-your-finances
- QuickBooks Cash Flow Planner: https://quickbooks.intuit.com/learn-support/en-us/help-article/budget-forecast-reports/use-cash-flow-planner-quickbooks-online/L2l59mIqe_US_en_US
- QuickBooks Cash Flow Planner FAQ: https://quickbooks.intuit.com/learn-support/en-global/help-article/money-movement/cash-flow-planner/L8kvVEdNC_ROW_en
- Xero Cash Flow: https://www.xero.com/us/accounting-software/analytics/cash-flow/
- Xero Short-Term Cash Flow: https://central.xero.com/s/article/Short-term-cash-flow
- Float Features: https://www.floatapp.com/features
- LivePlan Performance Dashboard: https://www.liveplan.com/features/performance-dashboard

## Executive Finding

The strongest `$99/mo` MVP is a Plaid-first report bundle with light owner settings. It should prioritize:

1. Expense leakage.
2. Recurring charge drift.
3. Card payment and fee risk.
4. Cash movement and upcoming outflows.
5. Revenue/deposit changes with caveats.
6. Owner decision prompts.
7. Bookkeeper/CPA follow-up questions.

The first version should avoid features that require invoice aging, inventory, payroll, true gross margin, ad attribution, or direct Visa commercial data. Those are phase 2 integrations, not first-sale promises.

## Evidence Ledger

| Claim | Source basis | Product implication |
|---|---|---|
| Plaid Transactions is the core data source for posted/pending transaction activity, categories, merchant/counterparty fields, account IDs, dates, and amounts. | Plaid Transactions docs and API docs. | Use it for raw ledger, spend, revenue/deposit patterns, duplicate-looking charges, categories, and recurring detection. |
| Plaid transaction signs require careful handling; positive amounts generally represent outflows and negative amounts represent inflows. | Plaid Transactions API docs. | Revenue and cash-in logic must normalize direction and avoid public claims until verified in data tests. |
| Transactions can change from pending to posted, and transaction sync/webhook behavior matters. | Plaid Transactions and transaction data docs. | Reports need data quality notes and should favor posted transactions for final numbers. |
| Plaid Liabilities can support credit-card account data such as balances, due dates, minimum payments, APR, and statement fields where supported. | Plaid Liabilities docs and API docs. | Credit Card / Visa Statement Digest is valuable, but every field must be marked conditional. |
| Plaid Balance provides balance data, with freshness and product usage considerations. | Plaid Balance docs. | Cash Pulse can use balances, but every report must show last refresh time. |
| Plaid Statements can retrieve statements for supported accounts, but it should not be MVP-critical. | Plaid Statements docs. | Do not sell "Visa statement parsing" as core. Use "business bank and credit card accounts" publicly. |
| Recurring transactions can identify repeating inflows and outflows. | Plaid Recurring Transactions source. | Recurring Charge Tracker has strong value, but coverage and pricing must be validated. |
| Ramp, Brex, and Visa frame spend products around visibility, controls, reporting, and action. | Ramp, Brex, Visa official pages. | GoldFin should translate transactions into exceptions and owner decisions, not just charts. |
| Goldman Sachs TxB emphasizes API-first cash visibility and liquidity/reporting rigor. | Goldman Sachs TxB sources. | GoldFin can borrow the operating principle of trustworthy cash visibility, not enterprise complexity or brand claims. |
| QuickBooks, Xero, and Float combine cash flow with expected invoices, bills, and scenarios. | QuickBooks, Xero, Float sources. | True forecast/AR/AP features are phase 2 unless GoldFin integrates accounting systems or captures owner input. |
| SBA guidance treats cash flow, records, budgeting, and financial planning as core business management tasks. | SBA Manage Your Finances. | GoldFin's owner report should focus on cash timing and decision readiness. |

## Cash Lever Taxonomy

| Cash lever | Plain definition | MVP examples |
|---|---|---|
| Revenue protection | Notice when expected money may be missing or slowing. | Deposit trend drop, missing recurring deposit, processor settlement drop. |
| Revenue growth signal | Notice where pricing or demand may need review. | Average deposit size trend, repeat payer trend, revenue flat while costs rise. |
| Expense reduction | Find costs to review or cancel. | New vendor, duplicate-looking charge, recurring charge drift. |
| Margin protection | Detect cost pressure before it becomes invisible. | Vendor/category spend rising faster than deposits, COGS proxy after owner mapping. |
| Cash timing | Help the owner see upcoming cash pressure. | Recurring outflow calendar, card due dates, rent/payroll owner settings. |
| Credit/card cost avoidance | Avoid card fee, interest, or payment-date surprises. | Minimum payment, due date, overdue flag, interest/fee categories. |
| Working capital control | Show how cash, receivables, payables, and timing interact. | Plaid-only proxy now; invoice/bill integrations later. |
| Owner decision speed | Convert data into a ranked review queue. | Top 3 owner decisions, urgency/confidence tags. |
| Bookkeeper/CPA follow-up | Surface questions that need professional or bookkeeping cleanup. | Transfer vs revenue, owner draw, uncategorized vendor, possible duplicate. |
| Data quality/trust | Show where data is strong, stale, missing, or conditional. | Last sync, disconnected account, missing liabilities field. |

## Plaid-Only Vs Integration-Expanded Matrix

| Lane | Best features | Do now? | Caveat |
|---|---|---|---|
| Plaid-only | Cash movement, spend categories, vendor changes, duplicate-looking charges, recurring outflows, deposits, card transaction summaries. | Yes, MVP. | Category and merchant names need review rules and confidence labels. |
| Plaid + owner input | Safe-to-spend calendar, payroll/rent reserve, tax reserve percentage, COGS category mapping, expected recurring deposits. | Yes, MVP-lite. | Requires short onboarding, not complex settings. |
| Plaid + QuickBooks/Xero | Invoice aging, open bills, true AR/AP, chart-of-accounts mapping, gross margin, class/job tracking. | Phase 2. | This is where forecasts become much stronger. |
| Plaid + Stripe/Shopify/POS | Net revenue, refunds, chargebacks, payment processor fees, channel sales, order volume. | Phase 2. | Plaid deposits alone cannot prove customer/order details. |
| Plaid + payroll | Payroll coverage, labor ratio, hiring timing, payroll tax remittance reminders. | Phase 2. | Manual payroll date/reserve can be MVP. |
| Plaid + ad platforms | True marketing ROI, channel CAC, lead-to-cash analysis. | Phase 3. | Plaid can show ad spend only, not attribution. |
| Avoid for now | Real-time treasury, direct Visa commercial controls, card issuing, bill pay, lending, financial advice. | Avoid. | Too much compliance, partner access, or operational burden for `$99/mo`. |

## Feature Scoring Model

Scores are strategic research scores, not measured customer outcomes. They should be validated with real SMB data and interviews.

Weights:

- Dollar impact potential: 25%.
- Owner actionability: 25%.
- Data reliability: 20%.
- Frequency of usefulness: 15%.
- Conversion proof value: 10%.
- Low support burden: 5%.

Score scale: 1 weak, 5 strong.

Formula:

```text
weighted_score =
  dollar_impact * 0.25
  + actionability * 0.25
  + data_reliability * 0.20
  + frequency * 0.15
  + conversion_proof * 0.10
  + low_support * 0.05
```

## Ranked Top 15 MVP Features

| Rank | Feature | Cash lever | Score | Why MVP |
|---:|---|---|---:|---|
| 1 | Expense Leak Finder | Expense reduction | 4.55 | Strong Plaid fit, concrete owner action, easy to demonstrate in a sample briefing. |
| 2 | Duplicate-Looking Charge Watch | Expense reduction | 4.40 | Simple transaction logic, visible dollar value, low support if framed as "review". |
| 3 | Recurring Charge Tracker | Expense reduction | 4.30 | High perceived value because owners recognize subscription creep. |
| 4 | Bank/Card Fee And Interest Watch | Credit/card cost avoidance | 4.25 | Fees and interest are concrete leakage; needs category/merchant text matching. |
| 5 | Cash Pulse | Cash timing | 4.15 | Core owner question: "what moved and what is left?" |
| 6 | Credit Card Payment Watch | Credit/card cost avoidance | 4.05 | Very valuable if Liabilities coverage provides due dates and minimum payments. |
| 7 | Revenue Pulse | Revenue protection | 3.95 | Helps notice deposit changes; must caveat transfers/refunds. |
| 8 | Owner Decision List | Owner decision speed | 3.90 | Converts reports from data into behavior; depends on upstream features. |
| 9 | Data Quality Log | Data quality/trust | 3.80 | Builds trust and reduces support by showing what refreshed and what did not. |
| 10 | Vendor Spend Increase Watch | Expense reduction | 3.75 | Strong actionability; threshold tuning needed. |
| 11 | Payment Processor Deposit Watch | Revenue protection | 3.65 | Useful for ecommerce/local retail; needs merchant matching and caveats. |
| 12 | Safe-To-Spend Calendar | Cash timing | 3.60 | Valuable with owner inputs for rent/payroll/reserves. |
| 13 | Vendor Concentration Watch | Working capital control | 3.55 | Helps risk review; more strategic than immediate. |
| 14 | Margin Pressure Proxy | Margin protection | 3.45 | Needs owner category mapping; use as review prompt only. |
| 15 | Bookkeeper/CPA Question List | Bookkeeper/CPA follow-up | 3.40 | Reduces ambiguity and positions GoldFin as cooperative, not replacement. |

## Ranked Top 15 Phase 2 Features

| Rank | Feature | Required expansion | Score | Why phase 2 |
|---:|---|---|---:|---|
| 1 | Invoice Aging Watch | QuickBooks/Xero | 4.65 | Strong cash value, but Plaid alone cannot see unpaid invoices. |
| 2 | Open Bills Timing Watch | QuickBooks/Xero | 4.50 | Enables real AP timing; Plaid only sees after payment. |
| 3 | True Gross Margin Report | Accounting/POS/COGS mapping | 4.45 | High value, but needs trustworthy revenue and COGS structure. |
| 4 | Payroll Coverage Forecast | Payroll integration or robust owner input | 4.30 | Very actionable, but sensitive and support-heavy. |
| 5 | Scenario Cash Forecast | QuickBooks/Xero/Float-like model | 4.25 | Strong retention feature, but needs future invoices/bills/settings. |
| 6 | Payment Processor Net Revenue | Stripe/Shopify/POS | 4.15 | Strong for ecommerce/local retail; bank deposits alone are incomplete. |
| 7 | Refund/Chargeback Detail | Stripe/Shopify/POS | 4.05 | Important for margin/revenue protection, not visible enough from bank data alone. |
| 8 | Ad Spend ROI Watch | Ad platforms + sales source | 4.00 | High conversion appeal, but Plaid can only show spend, not ROI. |
| 9 | Customer Concentration By Invoice | Accounting/CRM | 3.95 | Better than payer-name inference; needs customer records. |
| 10 | Inventory Reorder Cash Impact | POS/inventory | 3.85 | Useful for retail/restaurants, too specialized for MVP. |
| 11 | Job/Project Profitability | Accounting/job costing | 3.80 | High value for trades/agencies; requires job data. |
| 12 | Sales Tax Reserve Accuracy | POS/accounting/tax settings | 3.70 | Useful but risky; needs disclaimers and correct jurisdiction setup. |
| 13 | Multi-Entity Cash View | Multi-business setup | 3.60 | Valuable for operators, complex for `$99` MVP. |
| 14 | Budget Variance | Owner budget/accounting data | 3.55 | Good management feature, less urgent than leakage. |
| 15 | Peer Benchmarks | External benchmark datasets | 2.80 | Attractive in copy, risky without reliable benchmark source. |

## Feature Catalogue

| Feature | Owner question answered | Cash lever | Required data | Plaid-only? | Logic / thresholds to test | False-positive risk | Report should say | Must not say | Owner action | Phase |
|---|---|---|---|---|---|---|---|---|---|---|
| Cash Pulse | How did cash move in the last 2 weeks? | Cash timing | Transactions, balances, account names, last refresh. | Yes, stronger with Balance. | Cash in, cash out, net movement, starting/ending balance where reliable. | Balance staleness; transfers double-counted. | "Cash moved down by X; largest drivers were Y and Z." | "You can safely spend X" without settings. | Review largest drivers and upcoming outflows. | MVP |
| Safe-To-Spend Calendar | Can I absorb known upcoming payments? | Cash timing | Recurring outflows, liabilities due dates, owner-entered reserves. | Partly. | Current balance minus known recurring outflows and manual reserves over 14/30 days. | Missing invoices, payroll, taxes. | "After known items, review whether X reserve is enough." | "Spend this amount." | Confirm hold/buy/hire timing. | MVP-lite |
| Revenue Pulse | Are deposits slowing or changing? | Revenue protection | Inflow transactions, merchant/counterparty, history. | Yes. | Compare 14-day, MTD, prior period, trailing 90-day average. | Transfers/refunds mistaken as revenue. | "Deposits are down X vs trailing average; review source list." | "Revenue is down" unless revenue mapping is verified. | Check missing customers/processors. | MVP |
| Missing Recurring Deposit | Did an expected inflow not arrive? | Revenue protection | Recurring inflows, owner-confirmed expected deposits. | Partly. | Expected inflow not seen by expected date + grace period. | Seasonal revenue, late bank posting. | "Expected deposit pattern not seen yet." | "Customer did not pay." | Follow up or confirm timing. | MVP-lite |
| Payment Processor Deposit Watch | Are processor deposits unusual? | Revenue protection | Inflows from Stripe/Square/Shopify/etc. | Yes, with matching. | Processor deposits down >20% vs trailing 4-period average. | Processor batching changes. | "Processor deposits changed; compare with sales system." | "Sales dropped by X." | Check POS/Stripe/Shopify. | MVP |
| New Vendor Over Threshold | Did we start paying someone new? | Expense reduction | Outflow transactions, merchant identity, 90-day history. | Yes. | Merchant absent 90 days and current spend > $250. | Renamed merchant, one-time tax/payment. | "New vendor to review: X for Y." | "Cancel this." | Decide whether expected. | MVP |
| Vendor Spend Increase | Which vendor cost more than usual? | Expense reduction | Merchant outflows, history. | Yes. | Current 14-day vendor spend >130% trailing 3-period average and +$100. | Timing lumpiness. | "Vendor spend increased; check whether intentional." | "Vendor overcharged you." | Review invoice/contract. | MVP |
| Duplicate-Looking Charge | Did the same charge happen twice? | Expense reduction | Merchant, amount, account, date. | Yes. | Same merchant + same amount + same account within 3 days. | Legitimate multiple purchases. | "Possible duplicate-looking charge." | "Duplicate charge confirmed." | Check receipt/card statement. | MVP |
| Bank/Card Fee Watch | Are fees/interest leaking cash? | Credit/card cost avoidance | Categories, descriptions, merchant names. | Yes. | Match fees, overdraft, late fee, interest, service charge terms/categories. | Description ambiguity. | "Fees/interest to review this period: X." | "We can recover these fees." | Review bank/card behavior. | MVP |
| Recurring Charge Tracker | Which subscriptions repeat or drift? | Expense reduction | Transaction history, recurring streams, merchant, amount. | Yes, stronger with Recurring product. | Similar merchant/amount at weekly/monthly/annual cadence; drift >10%. | Merchant aliases, annual charges. | "Recurring charge changed from X to Y." | "Unused subscription." | Keep/cancel/reassign owner. | MVP |
| Annual Renewal Watch | Which annual charges are coming? | Expense reduction | Prior-year transactions and merchant. | Partly. | Merchant charged 10-13 months ago; upcoming window. | Insufficient history. | "Possible annual renewal window." | "Renewal will happen." | Confirm contract before renewal. | MVP-lite |
| Credit Card Payment Watch | What card payment dates matter? | Credit/card cost avoidance | Liabilities due date, minimum payment, balance, card account. | Conditional. | Due date within 14/30 days; minimum due; overdue flag where supported. | Missing liabilities fields. | "Card payment signal available: due date X, minimum Y." | "We guarantee no fees." | Schedule/review cash timing. | MVP if coverage |
| Card Spend Acceleration | Is card spend moving faster than normal? | Working capital control | Credit card transactions, history. | Yes. | Current card spend >125% trailing average. | Seasonality. | "Card spend is running higher than usual." | "You are overspending." | Review top card merchants. | MVP |
| Vendor Concentration | Are we too dependent on a few vendors? | Working capital control | Vendor spend by merchant. | Yes. | Top vendor >25% of outflows or top 3 >50%. | Industry-specific normal behavior. | "Spend is concentrated with X vendors." | "This is risky" without context. | Review supplier dependence. | MVP |
| Margin Pressure Proxy | Are costs rising faster than deposits? | Margin protection | Deposits, mapped cost categories, category spend. | Owner input required. | Cost categories up >20% while deposits flat/down. | Revenue/cost mapping error. | "Costs you mapped as COGS rose faster than deposits." | "Gross margin is X" without accounting data. | Review pricing/costs. | MVP-lite |
| Ad Spend Watch | Is marketing spend changing? | Revenue growth signal | Merchant/category matches for ad platforms/agencies. | Yes for spend only. | Ad vendor spend change >20%; compare to deposits with caveat. | Agencies/merchant names ambiguous. | "Marketing spend changed; compare against leads/sales." | "ROI increased/decreased." | Check ad platform and pipeline. | MVP-lite |
| AR Collections Watch | Who owes us money? | Revenue protection | Invoice data. | No. | Invoice aging, expected payment date, customer. | Not possible from Plaid alone. | "Phase 2 with QuickBooks/Xero." | "Plaid sees unpaid invoices." | Follow up on overdue invoices. | Phase 2 |
| AP Bill Timing Watch | What bills are coming? | Cash timing | Open bills, vendor due dates. | No, except recurring proxy. | Upcoming bills by due date. | Plaid sees paid bills after the fact. | "Open bills require accounting integration." | "All bills included" from Plaid. | Time payments. | Phase 2 |
| True Gross Margin | Are products/jobs profitable? | Margin protection | Revenue, COGS, chart of accounts, POS/inventory/job data. | No. | Gross profit / revenue by period/job/product. | Bad mappings. | "Available after accounting/POS mapping." | "Plaid calculates margin." | Price/cost review. | Phase 2 |
| Tax Reserve Reminder | How much should I set aside? | Cash timing | Owner-defined percentage, deposits, tax dates. | Owner input required. | Deposits * owner reserve percent; date reminders. | Tax complexity. | "Based on your chosen reserve setting." | "Tax advice" or exact liability. | Transfer/review reserve. | MVP-lite |
| Bookkeeper/CPA Questions | What needs professional cleanup? | Bookkeeper/CPA follow-up | Exceptions, uncertain categories, transfers, owner inputs. | Yes. | Generate questions from uncertainty and flags. | Too many generic questions. | "Ask your bookkeeper whether..." | "We classified this as tax/accounting fact." | Forward questions. | MVP |

## Category Recommendations

### 1. Cash Pulse

MVP: yes.

Build from transactions, account balances, account names, and last sync. Use balance data only with a visible freshness note. The most valuable version adds owner settings for rent, payroll, tax reserve, and minimum cash floor.

Must say: "Known cash movement and linked-account balance as of [timestamp]."

Must not say: "Safe to spend" without reserve settings and caveats.

### 2. Revenue Pulse

MVP: yes, with caveats.

Use inflows/deposits and counterparty names. Group payment processor deposits separately. Do not call every inflow "revenue." Mark likely transfers, refunds, loan proceeds, and owner contributions for review.

Must say: "Deposits GoldFin marked for review."

Must not say: "Revenue is exactly X" without accounting/customer mapping.

### 3. Expense Leak Finder

MVP: strongest feature.

Use outflows, merchant names, categories, recurring patterns, description matching, and historical averages. It creates tangible value because every flag can trigger an owner review.

Must say: "Possible duplicate-looking charge" or "vendor spend changed."

Must not say: "Fraud" or "overcharge confirmed."

### 4. Recurring Charge And Subscription Tracker

MVP: yes.

Use Plaid transaction history and, if available, Recurring Transactions. Include amount drift, renewal windows, and owner review status.

Must say: "Recurring pattern detected."

Must not say: "Unused subscription" unless the owner marked it unused.

### 5. Credit Card / Visa Statement Digest

MVP: conditional on Liabilities coverage.

Use credit-card transactions and liabilities fields where available. "Visa" should be treated as card brand, not a direct Visa data relationship. Public copy should say "business bank and credit card accounts."

Must say: "Card payment signal available where supported."

Must not say: "Direct Visa statement integration" or "Visa-backed."

### 6. Vendor And Margin Watch

MVP-lite.

Vendor spend is Plaid-friendly. Margin is not Plaid-only unless the owner maps cost categories and accepts a proxy. True gross margin belongs to phase 2 with accounting/POS data.

Must say: "Cost pressure proxy."

Must not say: "Gross margin" as an accounting fact unless source data supports it.

### 7. Marketing And ROI Watch

MVP-lite for spend only.

Plaid can identify ad-platform spend if merchant names are good. It cannot determine ROI without ad/sales attribution.

Must say: "Marketing spend changed; compare against leads and sales."

Must not say: "ROI changed."

### 8. Accounts Receivable And Collections Watch

Phase 2.

Plaid can infer deposit patterns but cannot see unpaid invoices. The MVP can show missing expected deposits only after owner confirmation.

Must say: "Expected deposit pattern not seen."

Must not say: "Invoice overdue" without accounting integration.

### 9. Accounts Payable And Bill Timing Watch

Phase 2, with MVP proxy.

MVP can show recurring payments and known card payment dates. Open bills require QuickBooks/Xero or manual owner input.

Must say: "Known upcoming recurring items."

Must not say: "All bills due."

### 10. Tax And Reserve Reminder

MVP-lite with strict disclaimers.

Only use owner-defined reserve percentages and dates. Do not calculate tax liability.

Must say: "Based on the reserve setting you chose."

Must not say: "You owe."

### 11. Decision List

MVP: yes.

This is the highest conversion wrapper. Rank flags by estimated dollar amount, urgency, confidence, and ease. Keep it to 3-7 items.

Must say: "Review this because..."

Must not say: "Do this" as advice.

### 12. Bookkeeper/CPA Question List

MVP: yes.

This makes GoldFin cooperative with existing professionals. It also protects against overclaiming.

Must say: "Ask your bookkeeper whether..."

Must not say: "GoldFin replaced your bookkeeper."

## Industry Matrix

| Industry | Highest-value modules | Plaid data enough? | Extra integration unlock | Top owner decisions | Best conversion proof angle |
|---|---|---|---|---|---|
| Professional services | Revenue Pulse, Cash Pulse, recurring charges, tax reserve. | Mostly. | QuickBooks/Xero invoices for AR. | Follow up on missing retainers, review contractor/software costs. | "See whether deposits and fixed costs are drifting before payroll." |
| Agencies and consultants | Marketing spend watch, contractor/vendor trend, revenue concentration. | Partly. | CRM/project accounting for client margin. | Review client concentration, contractor spend, ad/software stack. | "Know which clients and tools are carrying the month." |
| Trades and home services | Vendor/material spend, cash timing, payment processor deposits, job-cost phase 2. | Partly. | Job costing, invoice aging, payroll. | Review supplier increases, upcoming card payments, customer deposits. | "Catch material cost pressure before the next quote." |
| Local retail | Card spend, processor deposits, recurring rent/utilities, fee watch. | Partly. | POS/inventory for SKU margin. | Review processor deposits, fees, rent/payroll timing. | "See cash and card costs without opening three systems." |
| Ecommerce | Processor deposits, ad spend, refunds/chargebacks phase 2, inventory phase 2. | Partly. | Shopify/Stripe/ad platforms. | Compare ad spend and deposits, inspect refund spikes. | "Spot spend and deposit changes before the month-end close." |
| Restaurants and cafes | Vendor spend, payroll/rent settings, fee watch, cash pulse. | Partly. | POS/payroll/inventory. | Review food vendor increases, card fees, payroll timing. | "See vendor creep and payment timing in one brief." |
| Medical/wellness practices | Recurring tools, processor deposits, payroll/rent, professional fees. | Mostly. | Practice management for AR. | Review processor deposits, appointment revenue proxy, fixed costs. | "Know whether fixed costs are rising faster than deposits." |
| SaaS/subscription businesses | Revenue Pulse, processor deposits, recurring vendor stack, marketing spend. | Partly. | Stripe, analytics, ad platforms. | Review MRR proxy, tool stack, CAC spend. | "Catch subscription stack and processor changes early." |
| Real estate operators | Mortgage/debt payments, rent deposits, vendor/property spend. | Partly. | Property management/accounting. | Review rent deposits, repairs, debt payment dates. | "See property cash pressure before the next payment cycle." |

## Public Claim Safety

Safe after implementation proof:

- "Connect business bank and credit card accounts."
- "Every two weeks, GoldFin fills cash movement, spend, recurring charge, card payment, and owner decision reports."
- "Read-only account connection. We never move money."
- "Some fields depend on institution support."
- "Use this as an owner review layer, not bookkeeping or tax advice."

Unsafe until proven:

- "Plaid Visa statements."
- "Direct Visa statements."
- "Guaranteed savings."
- "We find money automatically."
- "Real-time cash control."
- "CFO in your pocket."
- "Goldman Sachs-level."
- "Your exact gross margin from bank data."
- "All unpaid invoices and bills included."

## Research Gaps For Next Iteration

Run these next when the user asks to repeat and deepen the research:

1. Pull exact Plaid API field examples for `transactions`, `liabilities.credit`, `accounts.balance`, and recurring streams into a field-by-field schema.
2. Build synthetic examples for 5 industries and test every flag manually.
3. Research Stripe/Shopify/POS data availability for phase 2 revenue and refund modules.
4. Research QuickBooks/Xero API objects for invoices, bills, chart of accounts, and cash flow forecast integration.
5. Research customer interviews and review mining for SMB finance pain language.

## Acceptance Result

This report answers the feature research prompt at a strategy level. It does not claim measured customer savings, exact Plaid coverage, or conversion outcomes. Claude must keep using source-backed caveats before turning any of this into public funnel copy.
