# Claude Deep Research Prompt - Plaid Biweekly Auto-Filled Reports

> **For Claude / Claude Code only:** This is a research, product, and conversion handoff report. Do not treat it as public-facing copy, runtime documentation, or permission to implement code.

## Purpose

The `$99/mo Auto-Filled Reports` offer only converts if it is a real, useful finance product. This report gives Claude a deep research prompt for validating and designing the Plaid-powered, biweekly auto-fill system that turns linked bank and credit card activity into spreadsheet reports and owner-ready briefings.

The goal is not "connect Plaid and dump transactions into a spreadsheet." The goal is:

> Business owners connect read-only bank and credit card accounts once, then receive decision-ready finance reports every two weeks that show what changed, what matters, and what to do next.

The research must raise the product to the standard implied by Ramp, Visa Spend Clarity, Goldman Sachs Transaction Banking, QuickBooks, Xero, Mercury, and Brex, while keeping GoldFin's offer simpler, calmer, and priced for automated `$99/mo` delivery.

## Guardrails

- Do not implement code from this report.
- Do not change app files from this report.
- Do not claim Plaid, Visa, Goldman Sachs, Ramp, Brex, Mercury, QuickBooks, Xero, or any bank endorses GoldFin.
- Do not call this "Goldman Sachs-level" in public copy. Use those companies only as private product benchmarks.
- Do not promise real-time card authorization alerts unless the technical research proves that capability exists for GoldFin's exact data path.
- Do not rely on statement PDFs as the primary data source unless research proves they are necessary and reliably available.
- Do not phrase `$99/mo` as "bookkeeping," "tax advice," "financial advice," or "CFO advice."
- Keep the public offer language aligned with `docs/conversion-prompt.md`: banker-grade, plain-spoken, no hype, no dark mode, no generic CTA copy.

## Source Pack Already Identified

Claude must browse and verify these again before making final recommendations, because Plaid, Visa, Ramp, and fintech product docs change.

### Plaid Source Pack

- Plaid Transactions overview: https://plaid.com/docs/transactions/
- Plaid Transactions API: https://plaid.com/docs/api/products/transactions/
- Plaid Liabilities overview: https://plaid.com/docs/liabilities/
- Plaid Liabilities API: https://plaid.com/docs/api/products/liabilities/
- Plaid Statements overview: https://plaid.com/docs/statements/
- Plaid Statements API: https://plaid.com/docs/api/products/statements/
- Plaid Balance overview: https://plaid.com/docs/balance/
- Plaid Link overview: https://plaid.com/docs/link/
- Plaid Enrich overview: https://plaid.com/docs/enrich/
- Plaid Enrich API: https://plaid.com/docs/api/products/enrich/
- Plaid trust and safety: https://plaid.com/trust-safety/

### Market Benchmark Source Pack

- Ramp Reporting: https://ramp.com/reporting
- Ramp Expense Management: https://ramp.com/expense-management
- Brex Expense Management: https://www.brex.com/product/expense-management
- Visa Spend Management: https://www.visa.com/en-us/solutions/spend-management
- Visa Spend Clarity: https://usa.visa.com/products/visa-spend-clarity.html
- Visa Developer, small business spend control: https://developer.visa.com/use-cases/small-business-spend-control
- Goldman Sachs Transaction Banking: https://www.goldmansachs.com/what-we-do/transaction-banking
- Goldman Sachs Liquidity Solutions: https://www.goldmansachs.com/what-we-do/transaction-banking/liquidity-solutions
- QuickBooks Cash Flow: https://quickbooks.intuit.com/global/cash-flow/
- QuickBooks Bank Feeds: https://quickbooks.intuit.com/global/bank-feeds/
- Mercury Accounting Automations: https://mercury.com/accounting-automations
- Mercury Financial Workflows: https://mercury.com/financial-workflows
- Xero Bank Feeds: https://www.xero.com/us/accounting-software/connect-your-bank/

## Initial Research Synthesis For Claude

This is the starting hypothesis, not the final answer. Claude must verify every point with current sources before using it.

### Plaid Reality

- Plaid Transactions is the likely core product for `$99/mo`. It can retrieve transaction history for depository and credit accounts and stay updated through `/transactions/sync` plus webhooks.
- Plaid Transactions can support credit card accounts, including Visa-branded cards when the issuing institution supports the linked account through Plaid. The product is not "Visa statement access" by itself.
- Plaid transaction amounts require careful sign handling. Plaid generally treats positive transaction amounts as money moving out and negative amounts as money moving in.
- Plaid Liabilities is the likely supplement for credit-card value: payment due date, minimum payment, statement balance, APR fields, last payment, overdue flags, and credit account details where available.
- Plaid Statements can retrieve bank-branded PDF statements in supported US cases, but should be treated as optional supporting evidence, not the MVP data foundation.
- Plaid Balance can refresh balances, but Claude must research cost, latency, caching, and whether cached balances from account endpoints are enough for a biweekly report.
- Plaid Enrich is useful if GoldFin later imports non-Plaid transaction data or direct card feeds. It should not be a dependency for the first Plaid-only MVP unless the category/merchant quality gap is material.
- Link, OAuth, update mode, duplicate Item prevention, item removal, consent messaging, and webhook handling are not edge cases. They are required for a subscription product.

### Competitor Reality

- Ramp sells the outcome as decision speed: reporting connected across spend, AP, procurement, budgets, exports, and dashboards.
- Visa Spend Clarity frames the category around control, visibility, cashflow, streamlined reporting, card controls, accounting integrations, receipt upload, and transaction notifications.
- Goldman Sachs Transaction Banking sets the enterprise bar: API-first, cloud-native, instant visibility, granular reporting, liquidity visibility, and treasury-grade workflows. GoldFin should borrow the clarity and rigor, not the enterprise complexity.
- QuickBooks and Xero already own bank feeds and bookkeeping workflows. GoldFin must not compete as "another ledger." It must sit above the ledger as the owner clarity layer.
- Mercury and Brex show the modern expectation: auto-categorization, accounting sync, spend limits, review queues, cards/bills/transactions in one view, and exception handling.

### GoldFin Opportunity

GoldFin's `$99/mo` wedge is not "expense management for employees" and not "full bookkeeping." It is the owner-facing interpretation layer:

- What changed in the last two weeks?
- What recurring charges are creeping up?
- Which card statement or payment date needs attention?
- Which vendors, categories, or deposits are becoming concentrated?
- What can the owner safely decide this month?
- Which spreadsheet tabs are now filled so the owner does not need to wrestle with raw bank exports?

## Exact Prompt For Claude Deep Research

Use the prompt below as Claude's next research task.

```text
You are Claude, acting as a senior fintech product strategist, Plaid integration architect, finance automation researcher, and direct-response conversion strategist for GoldFin / Monthly Finance Desk.

Your mission is to produce a deep research and product specification for the `$99/mo Auto-Filled Reports` offer.

You are not writing code in this pass. You are researching and creating an implementation-ready strategy report for the team.

Read first:
1. docs/conversion-prompt.md
2. reports for claude/00-funnel-priority-index.md
3. reports for claude/01-pricing-99-continuity-audit.md
4. reports for claude/08-99-checkout-readiness-audit.md
5. reports for claude/09-plaid-biweekly-auto-fill-deep-research-prompt.md

Business target:
Make the `$99/mo Auto-Filled Reports` offer feel so concretely valuable that the Pricing page can convert qualified, problem-aware visitors at a 10%+ primary-offer action rate over time. Do not claim that rate publicly. Design for it through proof, mechanism, specificity, low risk, and a valuable product.

Primary offer:
`$99/mo Auto-Filled Reports`

Primary CTA:
`Auto-fill my reports`

Core product promise:
Connect read-only bank and credit card accounts once. Every two weeks, GoldFin refreshes the owner's finance spreadsheets and sends a plain-English briefing showing what changed, what needs attention, and which decisions are safer to make now.

Critical distinction:
This is not bookkeeping, tax advice, investment advice, lending, bill pay, payment movement, or a replacement for a CPA. It is a monthly and biweekly clarity layer built from the customer's own financial data.

Research rules:
- Browse current official sources. Use primary sources whenever possible.
- Use Plaid official docs for Plaid claims.
- Use official company pages for Ramp, Visa, Goldman Sachs, Brex, Mercury, QuickBooks, Xero, and similar benchmarks.
- Cite every technical and market claim with a source link.
- Do not invent data availability. If a field is conditional, mark it conditional.
- Do not assume every institution supports every Plaid product.
- Separate "MVP now" from "phase 2" and "requires partner access."
- Do not write app code.
- Do not alter public copy unless a later implementation report explicitly asks you to.

Research questions to answer:

1. Plaid product fit
- Which Plaid products are required for the MVP?
- Which Plaid products are optional?
- Which products require additional access, pricing review, or production approval?
- Can Transactions cover depository and credit-card activity for the intended reports?
- Can Liabilities provide credit-card statement, due date, minimum payment, APR, and overdue signals reliably enough to sell a card-focused briefing?
- Should Statements be used at all, or only as optional PDF support?
- What does Plaid provide for recurring inflows/outflows?
- What does Plaid provide for balance freshness, and what is good enough for a biweekly report?
- What webhook and sync patterns are required?
- What Plaid errors and reconnection states will break automated report delivery?

2. Visa statement reality check
- Interpret "Plaid Visa statements" precisely.
- Distinguish Visa-branded credit card accounts linked through banks from direct Visa commercial data products.
- Identify whether direct Visa APIs or Visa Spend Clarity are realistic for GoldFin's MVP, or whether they are issuer/partner/ecosystem products.
- State the safest public phrasing. Example: "Connect your business bank and credit card accounts" may be safer than "Connect your Visa statement."

3. Data availability matrix
Create a table with columns:
- Data field
- Plaid source
- Required for MVP?
- Used in which spreadsheet/report
- Refresh cadence
- Reliability caveat
- Customer value
- Fallback if unavailable

Include at minimum:
- transaction_id
- account_id
- account type/subtype
- transaction date
- authorized date
- posted date/state
- pending flag
- amount
- transaction direction
- merchant_name
- original description
- category / personal finance category
- payment channel
- recurring stream fields
- current balance
- available balance
- credit limit
- statement balance
- next payment due date
- minimum payment amount
- APR / interest fields
- last payment amount and date
- institution name
- item health / last successful update

4. Spreadsheet/report architecture
Design the exact auto-filled spreadsheet pack for `$99/mo`.

Required tabs:
- Raw Transactions
- Categorized Spend
- Cash Flow Snapshot
- Expense Leak Finder
- Recurring Charge Tracker
- Revenue Snapshot
- Credit Card / Visa Statement Digest
- Payment Date Calendar
- Owner Decision List
- Data Quality Log
- Biweekly Briefing Output

For each tab, define:
- Purpose
- Inputs from Plaid
- Columns
- Formula logic
- Flags and thresholds
- Example rows
- What the owner learns
- What makes it worth paying for

5. Biweekly report product
Define the finished deliverable the customer receives every two weeks.

Minimum expected modules:
- One-paragraph owner summary
- Cash movement since last report
- Revenue / deposit trend
- Largest expense changes
- New or changed recurring charges
- Unusual spend and duplicate-looking charges
- Credit card payment and statement watchlist
- Vendor concentration
- Data quality notes
- Three owner decisions to consider
- One "ask your bookkeeper/CPA" question where relevant

Define:
- The email subject line pattern
- The PDF/report title pattern
- The spreadsheet update pattern
- The timing cadence
- How to handle weeks with little activity
- How to handle missing bank data
- How to avoid financial advice claims

6. Competitor benchmark
Study Ramp, Visa Spend Clarity, Goldman Sachs Transaction Banking, Brex, Mercury, QuickBooks, Xero, and one specialist cash-flow tool such as Float.

Create a table with:
- Company
- Product promise
- Data/automation angle
- Reporting angle
- Trust angle
- What GoldFin should borrow
- What GoldFin should avoid
- How GoldFin can win at `$99/mo`

GoldFin should not copy enterprise workflows. GoldFin should extract the strongest product principles:
- Decision speed
- Reliable recurring cadence
- Actionable exceptions
- Owner-friendly language
- Trust and security clarity
- Exportability
- No manual spreadsheet work

7. COGS and margin research
Estimate whether `$99/mo` can be profitable.

Research:
- Plaid billing model for Transactions, Liabilities, Balance, Statements, Recurring Transactions, Refresh, and Enrich.
- Which products are subscription, per-request, add-on, or custom-priced.
- Expected API call pattern per customer per month.
- Spreadsheet/PDF generation costs.
- LLM summarization costs if used.
- Storage/security overhead.
- Support cost assumptions.

Output:
- MVP COGS estimate low/base/high.
- Gross margin estimate.
- Features to avoid in MVP because they hurt margin.
- Features that increase perceived value without increasing variable cost much.

8. Compliance, privacy, and security research
Create a non-legal risk checklist for counsel/product review.

Research and specify:
- Plaid consent and user permission expectations.
- Data minimization: what to request and what not to request.
- Encryption expectations for access tokens and stored financial data.
- Token handling and access-token storage.
- Revocation and account disconnect.
- User data deletion.
- Audit logs.
- Access controls for internal admins.
- Retention policy for raw transactions, generated spreadsheets, PDFs, logs, and emails.
- Whether spreadsheet sharing creates additional risk.
- Public security copy that is true and not overclaimed.
- Required disclaimers around no money movement, no tax advice, no bookkeeping, no financial advice.

9. Conversion research
Translate the product into a high-converting `$99/mo` offer using Ogilvy-style specificity and Brunson-style value stacking, without hype.

Produce:
- The single strongest mechanism statement.
- A value stack for the `$99/mo` spotlight.
- Proof elements needed before checkout.
- Objection killers near the CTA.
- Pricing page copy claims that are technically true.
- Pricing page copy claims that must be avoided until proven.
- Sample briefing modules needed to prove the automation.
- Checkout/onboarding sequence that protects trust.
- Analytics events needed to measure a 10%+ primary-offer action goal.

Approved CTA language remains:
- `Auto-fill my reports`
- `See how auto-fill works`
- `Generate sample briefing`
- `Get the free templates`

Forbidden CTA language remains:
- `Get started`
- `Subscribe`
- `Subscribe now`
- `Buy now`
- `Learn more`
- `Book a demo`

10. Implementation phasing
Recommend a build sequence:

Phase 0: Research validation and customer proof
Phase 1: Plaid sandbox prototype
Phase 2: Real checkout + Link onboarding
Phase 3: Biweekly report generator
Phase 4: Spreadsheet export / Google Sheets delivery
Phase 5: Customer-facing dashboard
Phase 6: Advanced card statement and cash planning

For each phase, specify:
- Goal
- Required data
- Required backend components
- Required user-facing screens
- Test cases
- Failure states
- What not to build yet

11. Final deliverables
Write the research output as:

reports for claude/10-plaid-auto-fill-product-spec.md
reports for claude/11-plaid-market-and-conversion-research.md

Both files must begin with:
> **For Claude / Claude Code only:** This is a research and execution handoff report. Do not treat it as public-facing copy or runtime documentation.

Do not write code.
Do not touch app files.
Do not change public copy yet.
```

## Recommended Product Mechanism

The strongest public-facing mechanism to research and prove is:

> Connect your accounts once. Every two weeks, GoldFin pulls the posted transactions, recurring charges, balances, and credit-card payment signals that matter, fills your owner reports, and sends the plain-English briefing most owners wish their spreadsheet would explain.

This works because it is concrete. It names the data, the cadence, the artifact, and the human outcome. Claude should improve it only if the research proves a more accurate mechanism.

## MVP Product Hypothesis

The first `$99/mo` product should include:

1. **Read-only account connection**
   - Bank accounts and credit card accounts through Plaid Link.
   - Transactions as the core data source.
   - Liabilities as the credit-card supplement if access and coverage support it.

2. **Biweekly sync**
   - Pull incremental transaction changes.
   - Update report tables from a canonical database first.
   - Generate spreadsheet output from the database, not directly from raw API responses.

3. **Auto-filled spreadsheet pack**
   - Raw transaction ledger.
   - Categorized spend.
   - Expense leak finder.
   - Recurring charge tracker.
   - Revenue snapshot.
   - Credit card statement digest.
   - Payment calendar.
   - Owner action list.

4. **Plain-English owner briefing**
   - One page or short PDF.
   - Sent every two weeks.
   - Uses specific numbers and careful caveats.
   - Gives "questions to review" instead of regulated advice.

5. **Exception workflow**
   - If a vendor/category is uncertain, mark it as `Needs review`.
   - If Plaid data is stale, say exactly when data last refreshed.
   - If Liabilities fields are missing, omit the claim and show a softer fallback.

## Data To Report Mapping

| Report artifact | Primary data source | Value to customer | Caveat Claude must research |
|---|---|---|---|
| Raw Transactions | Plaid Transactions | Stops CSV export/manual entry | Pending/posted changes can modify history |
| Categorized Spend | Plaid Transactions categories + GoldFin rules | Shows where money went | Plaid categories are good, not perfect |
| Cash Flow Snapshot | Transactions + balances | Shows net cash movement | Real-time balance may require Balance product |
| Expense Leak Finder | Transactions + historical baseline | Finds cost creep and unusual spend | Needs enough transaction history |
| Recurring Charge Tracker | Recurring Transactions or GoldFin detection | Finds subscriptions and recurring vendors | Recurring endpoint may be add-on/coverage-limited |
| Revenue Snapshot | Deposit/inflow transactions | Shows revenue concentration and trend | Need owner review for transfers vs revenue |
| Credit Card / Visa Statement Digest | Transactions + Liabilities + optional Statements | Shows card spend, due dates, statement balance | "Visa" means card brand only unless direct Visa access exists |
| Payment Date Calendar | Liabilities due dates + recurring outflows | Prevents surprises | Missing due dates need fallback prompts |
| Owner Decision List | Derived insights | Makes report worth paying for | Must be phrased as review prompts, not advice |
| Data Quality Log | Plaid item status + sync logs | Builds trust | Must be honest and visible |

## Spreadsheet Logic Claude Should Research

Claude should validate and improve these formulas/flags.

### Expense Leak Finder

- Flag vendor spend if current biweekly spend is greater than 130% of trailing 3-period average and the dollar difference is greater than `$100`.
- Flag new vendor if no spend in prior 90 days and current spend is greater than `$250`.
- Flag duplicate-looking transaction if same merchant, same amount, same account, within 3 days.
- Flag category creep if category spend is up greater than 20% month-over-month and greater than `$500`.

### Recurring Charge Tracker

- Detect same merchant at similar amount within weekly, monthly, quarterly, or annual cadence.
- Show last charge, expected next charge, amount drift, category, and account.
- Flag amount drift greater than 10%.
- Flag a new recurring stream after 2 or 3 matching cycles.

### Revenue Snapshot

- Treat negative Plaid amounts as inflows, subject to source verification.
- Group by payer/merchant/counterparty where reliable.
- Flag customer concentration if one source is greater than 30% of inflows.
- Separate refunds, transfers, loans, and owner contributions where possible.

### Credit Card / Visa Statement Digest

- Show current card balance, available credit, credit limit, last statement balance, minimum payment, payment due date, and overdue state where available.
- Summarize top card merchants and top card categories.
- Flag card spend acceleration if current period card spend exceeds trailing average by threshold.
- Never promise direct Visa statement parsing unless direct statement support is proven for the user's institution.

### Owner Decision List

Write decision prompts, not directives:

- "Review whether this recurring charge still belongs."
- "Ask your bookkeeper whether this transfer should be excluded from revenue."
- "Check whether this card payment date affects payroll timing."
- "Decide whether this vendor increase is intentional before the next billing cycle."

## Product Architecture Questions Claude Must Answer

Claude's research spec should answer:

- Should GoldFin deliver Google Sheets, downloadable `.xlsx`, embedded web tables, or all three?
- Should the spreadsheet be regenerated every run or updated incrementally?
- How should historical snapshots be preserved?
- How should generated reports be versioned?
- Which data lives in Supabase, which data stays only in generated artifacts, and which data should never be stored?
- What is the minimum admin view needed to debug failed syncs without exposing unnecessary customer data?
- How does a user disconnect accounts?
- How does a user cancel and request data deletion?
- What happens if Plaid sync fails for one account but succeeds for another?
- What happens if a customer has multiple businesses or multiple bank Items?
- What happens if the linked account is personal rather than business?

## Conversion Implications For The Website

Once the product is validated, Claude should feed these changes back into the conversion reports before app implementation:

### Pricing `#/pricing`

- The `$99` spotlight should sell the mechanism, not the subscription.
- Required proof near CTA: a miniature "Biweekly Owner Pulse" sample.
- Required trust line: "Read-only bank connection. We never move money."
- Required specificity: "Every two weeks" and the exact report artifacts.
- CTA remains `Auto-fill my reports`.

### Sample Briefing `#/sample-briefing`

- The generated sample should include the same modules the real report will deliver.
- Add a visible "data source" legend: Transactions, Recurring charges, Card payment signals, Owner inputs.
- Loader steps should mirror the real pipeline: syncing transactions, categorizing spend, detecting recurring charges, checking card payment signals, drafting owner briefing.

### Security FAQ `#/security-faq`

- Add a Plaid explanation only after technical claims are verified.
- Avoid "we cannot see credentials" unless Plaid's exact current flow supports that statement for the implementation path.
- Strong default: "Read-only. No money movement. You can disconnect access."

### Templates `#/templates`

- Bridge free templates to automation with the strongest contrast:
  - "Use the templates yourself."
  - "Or let GoldFin fill the same reports every two weeks."

## Conversion Copy Bank To Research And Refine

Claude should use these as candidate copy, not final copy:

- "The spreadsheet is not the product. The finished decision is."
- "Every two weeks, your reports get filled before you have to ask where the money went."
- "See the charges, deposits, due dates, and changes that matter before the month is over."
- "Your bookkeeper keeps the books. GoldFin shows the owner what changed."
- "Connect accounts once. Review the owner briefing every two weeks."
- "Built for owners who already have the data, but not the time to turn it into a decision."

Claude must reject any copy that sounds like:

- AI magic.
- Guaranteed savings.
- Tax, investment, or legal advice.
- Enterprise treasury claims.
- A bank endorsement.
- Generic SaaS language.

## Acceptance Checks For Claude's Research Output

Claude's research is not complete until both output reports answer:

- What exact Plaid products are required for MVP?
- What exact fields make the `$99/mo` product valuable?
- Which fields are reliable vs conditional?
- What is the safest wording around "Visa statements"?
- What reports are generated every two weeks?
- What spreadsheet tabs exist and what columns do they contain?
- How does the product remain useful even when some Plaid data is missing?
- What competitor principles were borrowed from Ramp, Visa, Goldman Sachs, Brex, Mercury, QuickBooks, and Xero?
- Why GoldFin is not just a bookkeeping tool.
- Why the product is worth `$99/mo`.
- What claims can be safely made on the Pricing page?
- What claims must not be made yet?
- What metrics prove the funnel is moving toward a 10%+ qualified primary-offer action rate?
- What engineering phases should happen after research?

## Definition Of Done

This report's job is done when Claude can produce `10-plaid-auto-fill-product-spec.md` and `11-plaid-market-and-conversion-research.md` without guessing.

No app code should change during this research stage.
