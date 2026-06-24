# GoldFin Desk — Advisory Report Research Dossier
## Cycle 4 · 2026-06-22
### The CPA-Method & "Find Real Money" Cycle
**Compounds on Cycles 1–3.** Survival tier (C1), competitor/WTP/format (C2), profit layer (C3) are **proven**. Cycle 4 goes deeper into the **CPA/CFO methods that find the largest dollar amounts**, and confirms the ecom CAC/LTV and spreadsheet-template hypotheses from C3.

**Methodology:** Mom Test × Sales Safari × JTBD × Demand Score × CPA method
**Research + architecture-spec only — nothing was changed.**

**Cycle-4 mandate (user):** real CFO/CPA-quality reports from real data (Visa/bank + templates) → insights + data + strategy so owners **actually make money**.

---

## 1. EXECUTIVE SUMMARY

C3 found the *profit* layer. C4 finds the **largest single dollar amounts** — and the ranking shifted once dollar sizes were sourced: **a tax/entity move can be worth more than a year of every other optimization combined.**

1. **Tax/entity strategy is the single highest-dollar lever — almost no automated report flags it.** A sole proprietor netting $80K has *"likely overpaid $24K+ in self-employment taxes"*; the QBI deduction saves a $150K-QBI owner *"$30,000"* and is permanent at 23% for 2026 ([SDO CPA](https://www.sdocpa.com/small-business-tax-deductions/) · [TurboTax](https://turbotax.intuit.com/tax-tips/small-business-taxes/how-an-s-corp-can-reduce-your-self-employment-taxes/L4abUcaRn)). GoldFin can't file (NEEDS-HUMAN) but can **flag with a dollar estimate** from entity type + net income, routed to the CPA.
2. **Cash Conversion Cycle = "found money already earned".** `CCC = DIO + DSO − DPO` ([Edgewater CPA](https://edgewatercpa.com/blog/understanding-the-cash-conversion-cycle/)). Collect faster, pay smarter, hold less inventory → cash freed without a new dollar.
3. **Channel + cohort CAC:LTV for ecom — confirms C3 Hypothesis #1.** *"Blended metrics hide that you're subsidizing an unprofitable channel"*; cohort LTV is gold standard; *"20% improvement = millions in enterprise value"* ([Eightx](https://eightx.co/blog/ltv-cac-ratio-guide) · [Luca](https://ask-luca.com/blogs/ecommerce-kpis)). **CONFIRMED** (ecom segment).
4. **Budget-vs-Actual variance** answers "why am I not hitting my numbers" — focus on *"large, recurring, and growing variances"* ([CFO Share](https://cfoshare.org/blog/how-to-compare-budget-vs-actual-report)). Most SMBs have no budget → auto-baseline from trailing 3-month average.
5. **Spreadsheet-template intake CONFIRMED + schema known.** Owners run ledger→P&L sheets; *"accountants prefer clean spreadsheets to messy QuickBooks files"* ([Spreadsheet Point](https://spreadsheetpoint.com/google-sheet-accounting-template//)).
6. **"Make money" splits into 3 honest buckets:** find cash you already have (working capital/waste/tax) · keep more (margin/pricing/cost) · earn new (channel mix). Label which is which.
7. **Depth stays behind the verdict** — every C4 method is high-dollar but high-complexity.

**Biggest dollar-gap, in market's words:**
> *"If you've been making $80K net for three years as a sole proprietor, you've likely overpaid $24K+ in self-employment taxes."* ([SDO CPA](https://www.sdocpa.com/small-business-tax-deductions/))

---

## 2. RANKED FEATURE TABLE — CYCLE 4

| # | Feature | Freq | Pain | WTP | Auto | Score | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | **Tax-Strategy / Entity Flag** — "sole prop netting $X → S-corp saves ~$Y; ask your CPA" + QBI/retirement prompts | 4 | 5 | 5 | AUTO-SETUP | **80** | "$24K+ overpaid"; S-corp saves 15.3% SE tax; QBI 23% 2026 |
| 2 | **Channel + Cohort CAC:LTV (ecom)** | 3 | 5 | 5 | AUTO-SETUP | **60** | "blended hides losers"; cohort LTV; "20% = millions" |
| 3 | **Cash Conversion Cycle / Working-Capital Unlock** — DSO/DPO/DIO + "$X freed by 30 not 52 days" | 4 | 4 | 4 | AUTO-SETUP | **51.2** | CCC formula; "shorter cycle generates cash" |
| 4 | **Budget-vs-Actual Variance (auto-baseline)** | 4 | 4 | 3 | AUTO-SETUP | **38.4** | "growing variance = early warning"; auto-baseline removes setup |
| 5 | **Spreadsheet-Template Intake (canonical schema)** | 4 | 4 | 3 | AUTO-SETUP | **38.4** | owners run ledger→P&L sheets |
| 6 | **Best/Worst Customer & Concentration** — top clients by profit not revenue | 3 | 4 | 3 | AUTO-SETUP | **28.8** | "fire unprofitable clients"; needs revenue-by-customer |
| 7 | **What-If I Hire (auto-proxy)** — runway/breakeven w/ +$X payroll | 3 | 4 | 3 | FULLY | **36** | recurring-stream math; universal trigger |

> #1 (tax flag) carries the **largest single dollar impact per owner** of anything across four cycles — lower frequency, highest $/hit. Surface prominently when data conditions are met.

---

## 3. THE CPA/CFO METHOD LIBRARY

**3.1 Tax & Entity Strategy (highest $/hit):** entity election (sole prop/LLC netting >~$60–70K → S-corp saves 15.3% SE tax on distributions ([RCReports](https://rcreports.com/blog/s-corp-tax-deductions-list/))); QBI/retirement/equipment-timing (need year-end planning); boundary — **flags + estimates only, never files**, always "ask your CPA before year-end".
**3.2 Cash Conversion Cycle:** `CCC = DIO+DSO−DPO`; compute DSO from receivables/deposit timing; frame in dollars ("collect 22 days faster → free ~$X"); service businesses use DSO/DPO only ([JPMorgan](https://www.jpmorgan.com/insights/treasury/receivables/understanding-and-optimizing-your-cash-conversion-cycle)).
**3.3 Channel + Cohort Unit Economics (ecom):** CM and LTV:CAC by channel + cohort; name the laggard + $ drag; from Stripe + ad spend + bank fees; target LTV:CAC ≥ 3:1 ([Luca](https://ask-luca.com/blogs/ecommerce-kpis)).
**3.4 Budget-vs-Actual:** auto-baseline from trailing 3-month avg; flag large/recurring/growing; avoid category-mismatch false variance ([CFO Share](https://cfoshare.org/blog/how-to-compare-budget-vs-actual-report)).
**3.5 Canonical Spreadsheet-Template Schema:**
```
Tab 1 Ledger:  date | description | amount(+in/−out) | category | revenue_line/channel(optional)
Tab 2 derived: auto-built P&L (revenue by line, COGS, OpEx, net)
```
Providing the template is the setup that unlocks AUTO-WITH-SETUP profit features — the bridge from "bank-feed only" to "full CFO depth" ([FinancialAha](https://www.financialaha.com/spreadsheet-templates/)).

---

## 4. JOBS & TRIGGERS — CYCLE 4

| Trigger | Motivation | Outcome |
|---|---|---|
| "CPA said I should've been an S-corp years ago" | biggest tax move before year-end | stop overpaying thousands |
| "Profitable on paper but always cash-tight" | where is cash trapped | free cash already earned without borrowing |
| "Ad spend up but which channel makes money" | margin + LTV:CAC by channel | cut losers, pour into winners |
| "Set goals in January, no idea if on track" | planned-vs-actual + reasons | course-correct mid-year |
| "Just bank statements + a spreadsheet" | real CFO report from what I have | analysis without redoing books |

---

## 5. COMPETITOR SWITCH MAP — CYCLE 4

| Competitor | "Can't do" | Implies |
|---|---|---|
| QBO/Xero | show the tax/entity opportunity | tax-strategy flag + "ask your CPA" |
| Float | compute CCC / quantify trapped working capital | DSO/DPO/DIO + "$X freed" |
| Baremetrics | channel+cohort CAC:LTV w/ whole-business P&L | ecom/SaaS unit economics module |
| Bookkeeping templates | interpret / recommend | upload same ledger → analysis + decisions |
| Fractional CFO/CPA | be there at $99/mo, year-round | same 4-decision analysis + tax flag, automated |

---

## 6. CUSTOMER LEXICON — CYCLE 4
"should I be an S-corp / overpaying taxes" · "profitable but always broke / cash tight" · "money tied up / waiting to get paid" · "which channel actually makes money / blended ROAS" · "am I on track / hitting my numbers" · "I just have a spreadsheet / no real books" · "free up cash / found money".

---

## 7. AUTOMATION RISK REGISTER — CYCLE 4

| Feature | Verdict | Path |
|---|---|---|
| Tax-Strategy/Entity Flag | AUTO-SETUP (flag only; execution NEEDS-HUMAN) | net income + entity type → threshold → estimate range; NEVER files; routes to CPA; Q4 escalates |
| Cash Conversion Cycle | AUTO-SETUP | DSO from AR/deposit; DPO from payables; DIO needs inventory; "at current pattern" |
| Channel+Cohort CAC:LTV | AUTO-SETUP (ecom) | Stripe + ad-platform connector + bank fees; cohort in metrics layer |
| Budget-vs-Actual | AUTO-SETUP (auto-baseline) | trailing-3-mo baseline; normalize categories |
| Spreadsheet-Template Intake | AUTO-SETUP | fixed-schema CSV; unlocks per-line profit |
| Best/Worst Customer | AUTO-SETUP | revenue-by-customer; rank by profit |
| What-If I Hire | FULLY AUTO | runway/breakeven delta for +$X recurring |

**Principle:** tax flag is highest-value but is a *flag + estimate routed to a human*, never automated execution.

---

## 8. ARCHITECTURE SPEC ADDITIONS

**Anatomy inserts** into Profit tier + Decision Memo: 5b channel/cohort CAC:LTV (ecom) · 6b Cash Conversion Cycle ("$X cash you can pull forward") · 7b Budget-vs-Actual vs auto-baseline · **8c THE BIG TAX MOVE** (entity/QBI flag + $ estimate + "ask your CPA before [date]") · Decision Memo now spans hire/raise/cut/collect/free-working-capital/fix-entity, each $ + deadline + bucket.

**Opus 4.8 deltas:** metrics layer adds CCC, variance, CAC:LTV, net income + tax estimate, what-if-hire; interpretation prompt — *"present tax/entity as an estimate to discuss with a CPA, never tax advice; label every move by bucket (find-cash/keep-more/earn-new) and say which is surest"*; verification — tax estimate must be a bounded range tied to net income + stated rate assumption or dropped; memory adds `tax_flag_raised`, `ccc_days`, `variance_vs_baseline`, `channel_ltv_cac[]`.

**The honesty label:** tag every recommendation with its bucket + confidence note.

**Build via /feature (tax-flag block, CCC + variance + cohort modules, template intake UI) or /cog-admin (metrics layer, ad-platform connector, tax-threshold logic, memory fields).**

---

## 9. HYPOTHESES — CYCLE 4
- Tax-strategy flag = single best conversion hook → A/B "the tax move your CPA hasn't shown you".
- Quarterly "Strategy Deep-Dive" = distinct higher-priced artifact → test Pro tier.
- "Find money or it's free" guarantee on waste + tax flag → model + measure lift.
- Ad-platform connector worth building for ecom → size segment, scope read-only ads connector.

---

## 10. SOURCES — CYCLE 4
Edgewater CPA + CFI + JPMorgan (CCC) · SDO CPA + RCReports + TurboTax (tax/S-corp, $24K overpaid, QBI) · Eightx + Luca + Saras (CAC:LTV cohort) · CFO Share + Teamprocure (variance) · FinancialAha + Spreadsheet Point (template schema) · Spendesk/Linkenheimer (waste, cross-ref).

**Could NOT verify:** Reddit/FB raw threads (blocked); S-corp/QBI thresholds general 2025–26 (estimate must be bounded + route to CPA); no deployed data; ad-platform connector cost.

---

## 11. HANDOFF
- **Build next (dollar-per-owner):** Tax-Strategy/Entity Flag — pair with C3 Waste Detector as the two "we found you real money" moments.
- **Then:** CCC unlock + spreadsheet-template intake.
- **Cycle-5 questions:** tax flag as hook?; quarterly deep-dive Pro tier?; ads connector?; engagement.
- **Hands to:** `/feature` (tax-flag, CCC/variance/cohort modules, template UI, bucket-labeled Decision Memo); `/cog-admin` (metrics for CCC/variance/CAC:LTV/tax-threshold, ads connector, memory); `/hero`+`/convert`.

*End of Cycle 4 Dossier — 2026-06-22 (restored 2026-06-23 after concurrent-tooling wipe)*
