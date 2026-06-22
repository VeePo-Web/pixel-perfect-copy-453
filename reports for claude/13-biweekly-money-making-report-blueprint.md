> **For Claude / Claude Code only:** This is a research and execution handoff report. Do not treat it as public-facing copy or runtime documentation.

# Biweekly Money-Making Report Blueprint

## Naming Note

The file name uses "money-making" because the internal research prompt requested it. Public-facing copy should avoid that phrase. The safer public framing is:

> Reports that help owners protect cash, catch leakage, and review better decisions every two weeks.

## Product Thesis

The `$99/mo Auto-Filled Reports` offer should become:

> GoldFin Owner Pulse - a biweekly, auto-filled finance briefing that turns linked bank and credit-card activity into cash movement, leakage, card payment, revenue/deposit, and owner decision reports.

The product is valuable because it gives the owner a repeatable review rhythm. Every two weeks, it answers:

1. What changed?
2. What looks unusual?
3. What cash timing issue is coming?
4. What should I review with my bookkeeper, CPA, or team?
5. Which decision matters before month-end?

Sources used for product constraints and benchmark principles:

- Plaid Transactions: https://plaid.com/docs/transactions/
- Plaid Transactions API: https://plaid.com/docs/api/products/transactions/
- Plaid Liabilities: https://plaid.com/docs/liabilities/
- Plaid Balance: https://plaid.com/docs/balance/
- Plaid Statements: https://plaid.com/docs/statements/
- Plaid Link: https://plaid.com/docs/link/
- Plaid Recurring Transactions: https://plaid.com/blog/recurring-transactions/
- Ramp Reporting: https://ramp.com/reporting
- Brex Spend Management: https://www.brex.com/product/spend-management
- Visa Spend Clarity: https://usa.visa.com/products/visa-spend-clarity.html
- Goldman Sachs Transaction Banking: https://www.goldmansachs.com/what-we-do/transaction-banking
- Mercury Accounting Automations: https://mercury.com/accounting-automations
- QuickBooks Cash Flow Planner: https://quickbooks.intuit.com/learn-support/en-us/help-article/budget-forecast-reports/use-cash-flow-planner-quickbooks-online/L2l59mIqe_US_en_US
- Xero Cash Flow: https://www.xero.com/us/accounting-software/analytics/cash-flow/
- Float Features: https://www.floatapp.com/features
- SBA Manage Your Finances: https://www.sba.gov/business-guide/manage-your-business/manage-your-finances

## Final `$99/mo` Bundle

Offer name:

```text
$99/mo Auto-Filled Reports
```

Internal product name:

```text
GoldFin Owner Pulse
```

Public mechanism:

```text
Connect your business bank and credit card accounts once. Every two weeks, GoldFin fills the reports that show your cash movement, recurring charges, card payment dates, vendor changes, and owner decisions to review.
```

Primary CTA:

```text
Auto-fill my reports
```

What the customer receives:

- Biweekly email summary.
- PDF-style owner briefing.
- Auto-filled spreadsheet workbook.
- Data quality log.
- Decision list.
- Bookkeeper/CPA question list.

What the product is not:

- Not bookkeeping.
- Not tax advice.
- Not financial advice.
- Not bill pay.
- Not money movement.
- Not a direct Visa statement product unless future research proves that path.
- Not a replacement for a CPA or bookkeeper.

## Cadence

Recommended cadence:

- Sync window: every other Friday evening or early Monday morning.
- Report delivery: every other Monday morning.
- Lookback: last 14 days, month-to-date, and trailing 90-day comparison where data exists.
- Final month-end version: optional phase 2 monthly close brief.

Why:

- Monday delivery gives the owner a weekly operating rhythm.
- Biweekly delivery is frequent enough to catch leakage before month-end but not so frequent that reports become noise.
- Trailing 90-day comparison helps reduce false alarms from normal weekly lumpiness.

## Email Subject Pattern

Use plain, specific subject lines:

```text
Your GoldFin Owner Pulse: 3 items to review for Jun 10-Jun 23
```

Variants:

- `Your Owner Pulse: deposits down, vendor spend up, card payment due`
- `Your GoldFin report is ready: 2 charges and 1 payment date to review`
- `Your biweekly finance brief: cash movement, recurring charges, next decisions`

Avoid:

- `We found money`
- `Urgent`
- `AI detected savings`
- `Your CFO report`

## PDF / Briefing Table Of Contents

1. Owner Summary
2. Cash Pulse
3. Revenue / Deposit Pulse
4. Expense Leak Finder
5. Recurring Charge Tracker
6. Credit Card Payment Watch
7. Vendor And Margin Watch
8. Data Quality Notes
9. Owner Decision List
10. Bookkeeper/CPA Questions

## Spreadsheet Workbook Tabs

### 1. Raw Transactions

Purpose: preserve the source ledger used for every report.

Columns:

- report_period
- plaid_item_id_hash
- account_id_hash
- institution_name
- account_name
- account_type
- account_subtype
- transaction_id_hash
- date
- authorized_date
- pending
- amount_raw
- normalized_direction
- normalized_amount
- merchant_name
- original_description
- personal_finance_category_primary
- personal_finance_category_detailed
- payment_channel
- iso_currency_code
- confidence_note
- included_in_report

### 2. Categorized Spend

Purpose: show where outflows went and what changed.

Columns:

- category
- current_14_day_spend
- prior_14_day_spend
- trailing_90_day_avg_14_day_spend
- change_amount
- change_percent
- top_merchants
- flag
- owner_note

### 3. Cash Pulse

Purpose: show cash movement and linked-account balance context.

Columns:

- account
- starting_balance_source
- ending_balance_source
- last_refresh_time
- cash_in
- cash_out
- net_cash_movement
- known_upcoming_outflows
- owner_reserve_setting
- review_note

### 4. Expense Leak Finder

Purpose: show review-worthy leakage.

Columns:

- flag_type
- merchant
- account
- current_amount
- comparison_amount
- difference_amount
- difference_percent
- first_seen_date
- confidence
- why_this_appeared
- suggested_review
- owner_status

### 5. Recurring Charge Tracker

Purpose: show repeating inflows/outflows and amount drift.

Columns:

- merchant_or_source
- type
- cadence_detected
- last_amount
- prior_amount
- amount_drift
- expected_next_date
- category
- account
- confidence
- owner_status
- review_note

### 6. Revenue Snapshot

Purpose: show deposit/inflow movement without pretending every inflow is revenue.

Columns:

- source
- likely_revenue
- current_14_day_deposits
- prior_14_day_deposits
- trailing_90_day_avg
- change_amount
- change_percent
- transfer_review_needed
- concentration_percent
- owner_review_note

### 7. Credit Card / Visa Statement Digest

Purpose: summarize credit-card activity and payment signals.

Columns:

- card_account
- brand_if_available
- current_balance
- available_credit
- credit_limit
- statement_balance
- minimum_payment
- next_payment_due_date
- last_payment_amount
- last_payment_date
- apr_or_interest_field_available
- top_merchants
- top_categories
- data_available_note

Caveat:

Use "Visa" only when the linked account itself indicates a Visa-branded card. Do not imply direct Visa data access.

### 8. Payment Date Calendar

Purpose: show known upcoming payment pressure.

Columns:

- date
- item
- source
- amount
- confidence
- account
- type
- owner_status
- review_note

### 9. Vendor And Margin Watch

Purpose: surface vendor concentration and cost pressure.

Columns:

- vendor
- category
- current_period_spend
- prior_period_spend
- trailing_average
- concentration_percent
- mapped_as_cogs
- deposits_change_percent
- pressure_signal
- owner_review_note

### 10. Owner Decision List

Purpose: make the report actionable.

Columns:

- rank
- decision_to_review
- cash_lever
- estimated_dollar_context
- urgency
- confidence
- ease
- why_this_appeared
- what_to_check
- owner_status

### 11. Bookkeeper/CPA Questions

Purpose: turn uncertainty into professional follow-up.

Columns:

- question
- source_flag
- transaction_or_vendor
- amount
- category
- why_it_matters
- suggested_recipient
- owner_status

### 12. Data Quality Log

Purpose: make trust visible.

Columns:

- institution
- account
- last_successful_sync
- product_used
- field_missing
- stale_data_warning
- reconnect_required
- report_impact
- user_action_needed

## Top 10 Data Cards

These cards should appear near the top of the report.

1. Net cash movement.
2. Cash in.
3. Cash out.
4. Largest expense increase.
5. New vendor spend.
6. Recurring charges changed.
7. Upcoming card payment.
8. Deposits vs trailing average.
9. Top vendor concentration.
10. Data freshness.

## Top 10 Flags

1. New vendor over threshold.
2. Possible duplicate-looking charge.
3. Vendor spend up vs trailing average.
4. Recurring amount drift.
5. Annual renewal window.
6. Bank/card fee or interest charge.
7. Card payment due soon.
8. Deposit source dropped.
9. COGS-mapped category rising faster than deposits.
10. Account sync stale or disconnected.

## Top 10 Owner Decisions

Write these as review prompts, not directives.

1. Review whether this recurring charge still belongs.
2. Confirm whether this vendor increase was intentional.
3. Check whether this possible duplicate-looking charge is legitimate.
4. Review card payment timing before payroll/rent.
5. Confirm whether this deposit source should have arrived.
6. Decide whether this new vendor should become a recurring cost.
7. Review whether prices still cover mapped cost increases.
8. Confirm whether this transfer should be excluded from revenue.
9. Decide whether to pause discretionary spend until expected deposits clear.
10. Review this fee/interest pattern before the next billing cycle.

## Top 10 Bookkeeper/CPA Prompts

1. Should this transfer be excluded from revenue?
2. Should this owner draw/contribution be categorized separately?
3. Is this vendor mapped to COGS or operating expense?
4. Is this possible duplicate charge legitimate?
5. Should this bank fee/interest charge be tracked separately?
6. Should this processor deposit be split into gross sales, fees, and refunds?
7. Does this recurring charge belong to software, contractor, loan, or personal?
8. Are these tax reserve settings still appropriate?
9. Should this reimbursement/refund be treated differently?
10. Does this card payment date affect payroll, rent, or vendor timing?

## Required Onboarding Questions

Keep onboarding short. Each question must make the report more valuable.

1. What type of business do you run?
2. Which linked accounts belong to this business?
3. Which account is the main operating account?
4. Which account is the main credit card?
5. What day is payroll usually due, if any?
6. What day is rent or mortgage usually due, if any?
7. What minimum cash floor do you prefer to keep?
8. Which categories should count as cost of goods or direct service costs?
9. Which deposit sources are true customer revenue?
10. Which deposits are transfers, loans, owner contributions, or tax refunds?
11. What reserve percentage do you want GoldFin to use for planning prompts?
12. Who should receive the report?

## Required Customer Settings

- Report day.
- Business timezone.
- Main operating account.
- Main card account.
- Minimum cash floor.
- Known payroll/rent dates.
- Owner reserve percentage.
- COGS/direct-cost category mapping.
- Expected recurring deposits.
- Email recipients.
- Data deletion preference on cancellation.

## Required Disclaimers

Use these in onboarding and report footers.

```text
GoldFin uses linked account data to prepare owner review reports. It does not move money, pay bills, provide bookkeeping, provide tax advice, or provide financial advice.
```

```text
Some fields depend on institution support and data freshness. Review flagged items with your records, bookkeeper, CPA, or financial professional before acting.
```

```text
Card payment fields are shown only when supported by the linked institution. Visa-branded card accounts do not imply direct Visa statement access.
```

## Sample Briefing Output Shape

### Owner Summary

```text
For Jun 10-Jun 23, linked accounts show cash down $4,820. The largest drivers were a $2,900 supplier payment, $1,140 in software and ad spend, and a card payment due next week. Three items are worth review: one possible duplicate card charge, one recurring software charge that rose 18%, and one expected processor deposit pattern that did not appear yet.
```

### Cash Pulse

```text
Cash in: $18,420
Cash out: $23,240
Net movement: -$4,820
Known upcoming items: $2,100 card minimum/due-date signal where supported, $6,000 owner-entered payroll reserve.
Data note: balances last refreshed Jun 23 at 6:14 AM.
```

### Expense Leak Finder

```text
Possible duplicate-looking charge:
Merchant: Adobe
Amount: $249
Why this appeared: same merchant, same amount, same card account, two posted charges within 2 days.
What to check: confirm whether both charges match receipts.
```

### Revenue Pulse

```text
Payment processor deposits were 22% below the trailing 90-day biweekly average. This may reflect timing, refunds, processor batching, or lower sales. Compare against Stripe/Shopify/POS before treating it as a revenue drop.
```

### Decision List

```text
1. Review the duplicate-looking Adobe charge before the card cycle closes.
2. Confirm whether the Meta Ads spend increase was planned.
3. Check whether the expected Stripe deposit delay is timing or a sales issue.
```

## Conversion Translation

### Ogilvy-Style Mechanism Headline

```text
Every two weeks, GoldFin fills the reports that show your cash movement, recurring charges, card payment dates, vendor increases, and owner decisions to review.
```

Why it works:

- Specific artifacts.
- Specific cadence.
- Specific business value.
- No hype.
- No guarantee.

### Brunson-Style Value Stack

Use this inside the `$99` spotlight after product validation.

| Stack item | Plain value |
|---|---|
| Cash Pulse | See what moved in and out before the month is over. |
| Expense Leak Finder | Review duplicate-looking charges, new vendors, fees, and cost creep. |
| Recurring Charge Tracker | Watch subscriptions and recurring vendors before they quietly compound. |
| Credit Card Payment Watch | See card payment dates and balances where supported. |
| Revenue Pulse | Notice deposit changes and missing expected patterns. |
| Vendor And Margin Watch | Review vendor pressure and mapped direct-cost changes. |
| Owner Decision List | Get 3-7 review prompts ranked by amount, urgency, and confidence. |
| Bookkeeper/CPA Questions | Turn unclear items into clean follow-up. |
| Spreadsheet Export | Keep the filled workbook for your records. |
| Data Quality Log | See exactly what refreshed and what needs attention. |

### Pricing Page Proof Block

Use a small sample report card near `Auto-fill my reports`:

```text
Biweekly Owner Pulse sample

Cash moved down $4,820.
2 recurring charges changed.
1 possible duplicate-looking card charge.
1 card payment date to review.
3 owner decisions before month-end.

Read-only connection. GoldFin never moves money.
```

### Sample Briefing Proof Modules

The sample briefing page should demonstrate these modules:

- Cash Pulse.
- Expense Leak Finder.
- Recurring Charge Tracker.
- Credit Card Payment Watch.
- Revenue Pulse.
- Owner Decision List.
- Bookkeeper/CPA Questions.
- Data Quality Log.

Loader steps should mirror the real product:

```text
Syncing posted transactions...
Checking recurring charge patterns...
Reviewing card payment signals...
Comparing vendor and category changes...
Drafting owner decisions...
```

### Checkout Trust Block

Use near the `$99` checkout CTA:

```text
Read-only account connection.
GoldFin never moves money.
You can disconnect access.
Some fields depend on institution support.
Try one month. Cancel before your next billing cycle.
```

### Onboarding Promise

```text
Connect your accounts, confirm your main business settings, and GoldFin will prepare your first Owner Pulse from the transactions and card signals your institutions provide.
```

### First Report Retention Email

Subject:

```text
Your first Owner Pulse is ready: 4 items to review
```

Body direction:

```text
Your first report is attached. Start with the Owner Decision List, then check the Data Quality Log so you know which accounts refreshed cleanly. If a category or deposit source looks wrong, mark it for review; GoldFin gets more useful as your business rules get cleaner.
```

### Cancellation-Save Angle

Use value reminder, not guilt:

```text
Before canceling, download your latest filled workbook and review the recurring charge tracker. If the report missed something important, tell us which account or category was wrong so we can improve the next run.
```

Do not use:

- fake scarcity,
- shame,
- countdowns,
- "but you will lose money."

## Analytics Events Needed For 10%+ Primary-Offer Action Goal

Do not publicly claim a 10% conversion rate. Measure toward it.

Events:

- `pricing_auto_fill_cta_viewed`
- `pricing_auto_fill_cta_clicked`
- `pricing_sample_report_expanded`
- `security_note_viewed_near_auto_fill`
- `checkout_started`
- `checkout_completed`
- `plaid_link_started`
- `plaid_link_completed`
- `onboarding_settings_started`
- `onboarding_settings_completed`
- `first_report_delivered`
- `first_report_opened`
- `decision_list_clicked`
- `data_quality_log_viewed`
- `cancel_started`
- `cancel_saved`

Key rates:

- Pricing visitor to `Auto-fill my reports` click.
- CTA click to checkout start.
- Checkout start to paid.
- Paid to Plaid Link completion.
- Paid to first report delivered.
- First report opened.
- First report retained after 30 days.

## Implementation Boundaries

MVP should build:

- Plaid Link account connection.
- Transactions sync.
- Liabilities/card signal support where approved and available.
- Balance freshness where needed.
- Canonical transaction store.
- Biweekly report generator.
- Spreadsheet export.
- PDF/email delivery.
- Data quality log.
- Owner settings.

MVP should not build:

- Direct Visa commercial data.
- Bill pay.
- Money movement.
- Lending.
- Tax calculations.
- True invoice AR/AP.
- True gross margin.
- Ad ROI.
- Payroll forecasts beyond owner settings.
- Enterprise treasury dashboard.

## Acceptance Checks For Claude Before Public Copy

Claude must verify:

- Every public claim maps to a real data field or supported owner input.
- Every conditional field says "where supported" or has fallback copy.
- "Visa" never implies direct Visa statement access.
- No report module gives regulated advice.
- No report module claims guaranteed savings.
- The pricing value stack names reports and decisions, not vague "AI insights."
- The sample briefing proves the actual `$99` modules.
- The checkout and onboarding copy set honest expectations.

## Next Research Iterations

When the user repeats this prompt, deepen in this order:

1. Create exact synthetic report examples for three industries.
2. Map every report field to exact Plaid API fields and null-state copy.
3. Design the first onboarding questionnaire and business-rule model.
4. Research QuickBooks/Xero phase 2 field mapping.
5. Research Stripe/Shopify/POS revenue, refund, and processor-fee mapping.
6. Mine customer pain language from reviews/forums/interviews for better copy.
7. Turn the top modules into sample briefing content for `#/sample-briefing`.

## Final Strategic Recommendation

The first `$99/mo` product should sell a concrete owner rhythm:

```text
Every two weeks, review the cash movement, leakage, recurring charges, card payment dates, and decisions that matter before month-end.
```

That is the lane between raw bookkeeping and expensive advisory. It is specific enough to convert, narrow enough to automate, and valuable enough to make `$99/mo` feel sensible.
