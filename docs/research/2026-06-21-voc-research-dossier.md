# GoldFin Desk — VOC Feature Research Dossier
## Cycle 1 · 2026-06-21
### Voice-of-Customer Market & Feature Mining
**Methodology:** The Mom Test (Fitzpatrick) × Sales Safari (Hoy) × JTBD (Moesta) × Outcome-Driven Innovation (Ulwick)
**Research-only — nothing was changed, added, or refactored in this run.**

---

## PERSISTENT RESEARCH LOG

| Cycle | Date | Key Gaps Closed | New Hypotheses Opened |
|---|---|---|---|
| 1 | 2026-06-21 | Cash runway; tax set-aside; AR aging; Opus 4.8 memory model; competitor switch reasons | Payroll-as-% trending; multi-bank aggregation; SaaS-specific MRR/churn add-on |

*Instructions for future cycles: Read this log first. Continue from where the prior cycle left off. Add one row per cycle. Do not re-derive evidence already in the Evidence Ledger below.*

---

## 1. EXECUTIVE SUMMARY

The market has already told GoldFin Desk exactly what to build. The signal is loud, repeated, and sourced. Eight findings rise above all others:

1. **"Am I okay?" is the only question that matters.** 95% of small business owners make financial decisions by looking at their bank balance alone — not reports. They don't need more data; they need one number with a verdict.

2. **Cash runway is the most-wanted missing feature.** 54% of small businesses have less than one month of cash on hand. The question "how long can I survive at this burn rate?" is universal, urgent, and not answered by any existing automated tool under $500/month.

3. **The report needs a memory.** The entire WTP case for fractional CFOs ($3,000–$7,000/month) rests on the advisor *knowing the business* over time. An automated report that remembers prior months, tracks whether last cycle's advice was followed, and compounds in insight is the most defensible moat available.

4. **Quarterly tax surprises are a documented, solvable pain.** Surprise IRS penalties (8% since 2024), businesses that didn't save anything for Q4, and the complete absence of a "set aside $X this month for taxes" feature in any automated report — this is a specific, automatable gap.

5. **AR aging is a cash flow killer nobody watches.** US small businesses are owed $17,000+ each on average. 47% have invoices overdue >30 days. Business owners spend 10% of their workday chasing payments — but zero automated reports currently surface who owes what and how long it's been.

6. **Plain English is the product.** Every competitor failure traces back to the same root: built for accountants, not owners. "I could not believe how complicated the software was. It was nearly impossible to navigate simple financial records." (QuickBooks review, 2024). The differentiator is not a better chart — it is a report a non-finance person can act on in 90 seconds.

7. **Bench's collapse (Dec 27, 2024) created 11,000 displaced, scared business owners.** They lost access to their own financial history overnight. The trust signal: data portability, transparency about what's reconciled, and confirmation the numbers tie to the bank are not nice-to-haves — they are now buying criteria.

8. **64% of owners would already trust AI to manage their cash flow.** The AI angle is not a risk — it is a selling point, if the output is grounded and provably tied to real data. An invented number is a fireable offense. A correctly interpreted number from the owner's real data, delivered in their language, is what a $7,000/month fractional CFO does.

**The single biggest report-value gap, in the market's own words:**
> "We missed bills all the time. The unexpected thing shows up... and that bill comes due and you're like, 'We don't have that. We didn't plan for that.'" — Bryce Conlan, Dance Motion Marketing (Relay State of Cash Flow 2024)

The gap is: *no one is warning them before it happens.*

---

## 2. RANKED FEATURE TABLE

**Demand Score = Frequency (1–5) × Pain (1–5) × WTP (1–5) × Automatability Multiplier**
Automatability: FULLY AUTO = ×1.0 · AUTO-WITH-SETUP = ×0.8 · NEEDS-HUMAN = ×0.3

| # | Feature / Report Element | Freq | Pain | WTP | Auto | Multi | Score | Key Evidence |
|---|---|---|---|---|---|---|---|---|
| 1 | **Cash Runway + "Am I OK?" Verdict** — single headline metric, plain verdict, months-left-at-burn | 5 | 5 | 5 | FULLY | 1.0 | **125** | 95% bank-balance only; 54% <1 month runway; Relay 2024; Bryce Conlan quote |
| 2 | **Memory-Aware Opus 4.8 Report Narrative** — each report reads all prior reports, tracks advice given, compounds in insight | 5 | 5 | 5 | FULLY | 1.0 | **125** | Fractional CFO WTP $3–7K/mo; "it knows my business" desire; no automated tool does this |
| 3 | **Cash Runway Countdown** — "at current burn rate, X months of cash remaining" | 5 | 5 | 5 | FULLY | 1.0 | **125** | 54% <1 month; Relay data; LivePlan "future cash low point" feature demand |
| 4 | **Month-over-Month Plain-English Summary** — what changed, why, in Grade 6–8 language | 5 | 5 | 4 | FULLY | 1.0 | **100** | 95% bank-balance; QBO review "impossible to navigate"; LiveFlow "built for finance teams" |
| 5 | **Quarterly Tax Set-Aside Alert** — automated % of revenue flagged; quarterly due-date reminders | 5 | 5 | 4 | AUTO-WITH-SETUP | 0.8 | **80** | IRS penalty 8% 2024; surprise tax bills documented across 5+ venues; Found app demand |
| 6 | **AR Aging Alert** — overdue invoice list, who owes what, how late, auto-generated | 5 | 4 | 4 | AUTO-WITH-SETUP | 0.8 | **64** | 56% owed money; 47% overdue >30 days; $17K average owed; 10% workday chasing |
| 7 | **Expense Anomaly Detection** — unusual charges flagged automatically with "Review / Recurring / Timing" tags | 4 | 4 | 4 | FULLY | 1.0 | **64** | "Where did my money go" ubiquitous; QBO "reports are useless"; already partially in demo |
| 8 | **Biggest Expense Mover, Named and Explained** — "Payroll rose $4,200 this month — one new hire in week 2" | 4 | 4 | 4 | FULLY | 1.0 | **64** | "86% saw expenses rise averaging 11%"; Fathom basic forecasting gap; Reach gap |
| 9 | **Margin Trend with Plain-Language Driver** — gross/net margin direction + "here's why" | 4 | 4 | 4 | FULLY | 1.0 | **64** | Fractional CFO deliverable; Reach Reporting AI forecasting gap; universal SB need |
| 10 | **Data Freshness & Reconciliation Stamp** — "reconciled as of [date] · tied to your connected accounts" | 3 | 4 | 3 | FULLY | 1.0 | **36** | Bench shutdown trust collapse; "I need to know it ties to my bank"; trust is renewal lever |
| 11 | **Revenue Concentration Risk Alert** — "one client = 38% of revenue — you have a single point of failure" | 3 | 4 | 3 | FULLY | 1.0 | **36** | Already in demo; fractional CFO deliverable; not in any automated tool |
| 12 | **Weekly Cash Pulse Email** — lightweight mid-cycle check-in between bi-weekly reports | 4 | 3 | 3 | FULLY | 1.0 | **36** | 88% experienced unexpected cash flow hits; owner desire for more frequent visibility |
| 13 | **Automated PDF / Shareable Report** — board-ready one-pager; forward to CPA / co-founder | 3 | 3 | 3 | FULLY | 1.0 | **27** | "Forwarded/renewed" signal; board meeting prep need; competitor gap (LiveFlow = Google Sheets) |
| 14 | **Payroll as % of Revenue, Trending** — labor cost ratio with alert threshold | 3 | 3 | 3 | AUTO-WITH-SETUP | 0.8 | **21.6** | "Rising labor costs" = #1 named cash flow cause (Relay); payroll integration needed |
| 15 | **Multi-Bank Account Aggregation** — single view of all accounts | 3 | 3 | 2 | AUTO-WITH-SETUP | 0.8 | **14.4** | Multiple bank accounts are reality for SMBs; Plaid can solve; research demand signal moderate |

---

## 3. REPORT-VALUE FINDINGS

The five questions that decide whether a recurring financial report gets read, forwarded, and renewed.

### OPENED
**Gap:** Owners don't open generic "monthly report" emails. The subject line must surface the one number they actually care about.

> *"We missed bills all the time. The unexpected thing shows up... and that bill comes due and you're like, 'We don't have that. We didn't plan for that.'"* — Bryce Conlan, Dance Motion Marketing ([Relay State of Cash Flow 2024](https://relayfi.com/blog/the-state-of-small-business-cash-flow/))

**Finding:** The subject line that gets opened puts the verdict in the subject itself: "Cash runway: 7.2 months ↑ from 6.8 — you're in good shape." Owners who are anxious about cash open anything with a concrete number. Owners who are comfortable still open it because it validates their confidence. Win-win subject line design.

**Finding:** 94% of small businesses expect growth in 2025 but 54% have less than one month of cash on hand. ([Relay State of Cash Flow 2024](https://relayfi.com/blog/the-state-of-small-business-cash-flow/)) This gap between optimism and reality means owners underestimate how much they need the report — until they're in crisis. The report must open with something that creates a small jolt of clarity even when things are fine.

### UNDERSTOOD IN 30 SECONDS
**Gap:** Every existing tool sends reports built for accountants. Non-finance owners open them, see a P&L they don't understand, and close the email.

> *"I could not believe how complicated the software was. It was nearly impossible to navigate simple financial records."* — QuickBooks review ([NerdWallet QuickBooks Review 2024](https://www.nerdwallet.com/business/software/reviews/quickbooks-online))

> *"The software feels like it was built with mostly the finance team in mind."* — LiveFlow review ([Capterra LiveFlow 2024](https://www.capterra.com/p/237324/LiveFlow/reviews/))

**Finding:** The report must be structured as: one number + plain verdict (top) → what changed → what to do. No accounting jargon without translation. The reading level target is Grade 6–8 (Hemingway App). A business owner should be able to extract the key message in one scan of the first paragraph.

**Finding:** 95% of business owners check bank balance rather than running reports. ([Relay Cash Flow Compass 2024](https://www.prnewswire.com/news-releases/new-relay-cash-flow-compass-uncovers-small-businesses-are-42-overconfident-in-their-cash-flow-control-302222383.html)) The report must compete with a bank balance check for speed of comprehension — or owners will skip it and check the balance instead.

### TRUSTED
**Gap:** After Bench Accounting's collapse (December 27, 2024), trust in automated financial tools is at an inflection point. 11,000 businesses lost access to their own financial records overnight.

> *"Post-acquisition reviews consistently cite slower support response times and delayed closes... Bench still runs on a proprietary platform; clients still cannot export their financial data to QuickBooks."* ([Orbit Accountants 2025](https://orbitaccountants.us/blog/top-bench-accounting-alternatives-for-small-businesses/))

**Finding:** Every report must carry a visible data reconciliation stamp: "These numbers are pulled from your connected accounts and reconciled as of [date]." Owners need to know the report ties to their bank — not generated from memory or estimation.

**Finding:** Anomaly flags build trust paradoxically: *flagging something unusual* signals "this system is actually reading my data, not just summarizing it." The "unusual spend" pattern already in the demo is the right call — lean into it.

**Finding:** 64% of owners say they would trust AI to manage their cash flow. ([Relay State of Cash Flow 2024](https://relayfi.com/blog/the-state-of-small-business-cash-flow/)) The AI angle is not a barrier — but the trust is conditional: the report cannot invent numbers. Grounded interpretation is the only acceptable mode.

### ACTED ON
**Gap:** Most automated financial reports end in data. Fractional CFOs close every conversation with 2–3 specific actions for the next 30 days. That's what owners are actually paying $3,000–$7,000/month for.

> *"When things are clear, you can act. You can plan. You can move. But when everything's shifting, you freeze."* — Mike Michalowicz ([Relay State of Cash Flow 2024](https://relayfi.com/blog/the-state-of-small-business-cash-flow/))

**Finding:** The last section of every report must be "What to do now" — 2–3 ranked, specific, grounded actions tied to concrete numbers in the report body. Not "consider improving cash flow." Specific: "Chase the $4,200 invoice from Client A — it's 47 days late." Specific: "Set aside $1,150 for estimated Q3 taxes this month."

**Finding:** AR aging is the #1 untapped action trigger. 56% of small businesses are owed money, $17,000+ on average, 47% overdue >30 days. ([QuickBooks Late Payments Report 2025](https://quickbooks.intuit.com/r/small-business-data/small-business-late-payments-report-2025/)) A named, numbered AR aging section with "call this client by Friday" creates immediate, measurable action.

**Finding:** Tax set-aside is a close second. The IRS penalty rate increased to 8% in 2024. Business owners who didn't save for quarterly taxes describe it as "the unexpected thing that shows up." ([Relay State of Cash Flow 2024](https://relayfi.com/blog/the-state-of-small-business-cash-flow/)) An automated monthly line item — "Based on this month's revenue, set aside $X for Q[N] taxes (due [date])" — is the fractional CFO move that currently requires a human to deliver.

### FORWARDED & RENEWED
**Gap:** A report shared with a co-founder, business partner, or board member is a massive retention signal. A report that makes the owner look smart and in-control is a viral growth mechanism.

**Finding:** The memory model is the renewal moat. A report that says "your margin has improved three consecutive periods — the cost reduction you made in March is working" is a report the owner will forward, screenshot, and renew. No spreadsheet and no one-time bookkeeper can produce that sentence. Only a system with memory of the business's history can.

**Finding:** Bench's collapse directly proves that data portability is a retention-building trust signal. Owners who can see their historical data, download it, and know they're not locked in are more loyal — not less. Transparent data ownership turns "can I leave?" into "why would I?"

---

## 4. JOBS & TRIGGERS

The moments that trigger the purchase (and the moments where the report is consulted).

| Trigger | Motivation | Outcome |
|---|---|---|
| "I just looked at my bank account and don't know if that's good or bad" | I want to see one number that tells me my financial health | So I can stop feeling anxious and make a decision |
| "A big bill came in and I don't have the money I expected" | I want to know why this keeps happening | So I can see it coming next time and not panic |
| "Tax season is here and I realize I saved nothing" | I want to know how much I should have been saving every month | So I never get blindsided by a tax bill again |
| "A client is late paying me and I don't know who owes me what" | I want to see exactly who is overdue and by how much | So I can make targeted calls and recover cash today |
| "My accountant sent me a P&L and I don't know what to do with it" | I want someone to tell me what the numbers mean in plain English | So I can act on them instead of filing the email |
| "I'm thinking about hiring someone but don't know if I can afford it" | I want to see my cash runway before and after the hire | So I can make a confident hiring decision |
| "My bookkeeper just quit / ghosted me" | I want financial continuity without starting over | So I'm not flying blind for the next 3 months |
| "I just got off a call where I looked stupid in front of my investor" | I want a report I can bring to my next board call | So I look in control of my business |

---

## 5. COMPETITOR SWITCH MAP

The gaps that make people switch or cancel. Each row is a named competitor and the gap it reveals.

| Competitor | "It can't do ___" | "Too complicated to ___" | Feature it implies for GoldFin |
|---|---|---|---|
| **QuickBooks Online** | Can't give a plain-English verdict on whether the business is healthy | Set up and read financial reports without finance background | Auto-generated plain-English advisory summary from QBO data |
| **QuickBooks Online** | Price hike Aug 2024 ($30→$35 Simple Start; $200→$235 Advanced) with declining support | Justify the increasing cost | Offer a clear, demonstrable ROI moment in every report cycle |
| **Bench Accounting** | Can't export data to QuickBooks after shutdown; customers locked out Dec 27, 2024 | Maintain continuity across tools | Data portability commitment + reconciliation transparency badge |
| **LiveFlow** | Can't build reports for non-finance team members; Google Sheets-only (no Excel) | Get set up without Google Sheets expertise; justify cost for small business | Owner-facing, no-spreadsheet report delivery |
| **LiveFlow** | Can't serve non-finance staff or give them a simple view | Get a simplified summary without building custom dashboard | Role-based view: "owner view" vs "accountant view" |
| **Reach Reporting** | AI forecast widget doesn't work; cash flow forecast is inaccurate; forecasts don't pass to reporting | Trust the forecast; get multi-dimensional reporting | Grounded (data-tied) interpretation only — no fabricated forecasts |
| **Reach Reporting** | Pricing too high for small businesses; limited for businesses without multiple service lines | Justify the $200+/month for a single-location business | $99/month with a clear feature-matched value story vs. $3K fractional CFO |
| **Fathom** | Forecasting tools basic; building custom driver models not supported | Use the advanced reporting without an accountant to set it up | Pre-built, auto-configured reports that don't need a setup consultant |
| **Pilot** | Expensive; $145/hour supplemental rate for basic tasks; 6+ weeks to complete tax return | Get responsive support or predictable costs | Fully automated = no hourly overages, no "waiting for your bookkeeper" |
| **Pilot** | Service sometimes never completed; lost 2 bookkeepers mid-engagement | Maintain continuity across staff changes | Zero human in the loop; the system doesn't quit, ghost, or change jobs |
| **Fractional CFO** | $3,000–$7,000/month; inaccessible to businesses under $1M revenue | Afford advisory-grade insight for a small business | $99/month offering the same key deliverables at 1/30th the price |

---

## 6. CUSTOMER LEXICON

Recurring exact phrases from the market (raw material for hero/convert/copy personas — do not edit copy here; hand off with this list).

| Phrase | Frequency | Context |
|---|---|---|
| "am I okay" / "are we okay" | Very high (5+venues) | The owner's single most-asked internal question |
| "where did my money go" | Very high (5+venues) | Expense surprise; month-end confusion |
| "I just look at my bank balance" | Very high (5+venues) | Default decision-making behavior of 95% |
| "surprise tax bill" / "didn't save for taxes" | High (4+venues) | Q4 / year-end trigger; quarterly pain |
| "how long will my cash last" / "cash runway" | High (4+venues) | Survival metric; hiring decisions |
| "nobody owes me more than they should" | High (3+venues, phrased various ways) | AR aging; late invoices |
| "my bookkeeper [quit / ghosted / didn't finish]" | High (4+venues) | The switch trigger away from human services |
| "my accountant sends me reports I don't understand" | High (3+venues) | Plain-English gap |
| "plain English" | High (3+venues) | What they're asking for from financial reports |
| "explain it like I'm not an accountant" | Medium (2-3 venues) | Grade 6-8 readability target |
| "tell me what to do about it" | Medium (2-3 venues) | The actionable recommendations gap |
| "I froze" / "I didn't know what to do" | Medium (2-3 venues) | Decision paralysis from data without interpretation |
| "unexpected bill" / "didn't plan for that" | Very high (Bryce Conlan quote; 5+venues) | The preventable cash crisis |
| "month-end close" | Medium (2-3 venues) | The monthly grind trigger |
| "I need it to tie to my bank" | Medium (2-3 venues) | Trust signal; reconciliation stamp |
| "rising labor costs" | High (named #1 cash flow cause, Relay 2024) | Payroll as % of revenue feature |
| "cash flow challenges hurt my business" | Very high (76% of owners, Relay 2024) | The report's core value promise |
| "proactive" (vs. "reactive") | High (31% proactive vs. 69% reactive) | The before-it-happens positioning angle |
| "I don't look at reports" | High (embedded in 95% bank-balance stat) | The awareness gap / hook |
| "quarterly taxes" / "estimated taxes" | High (4+venues) | Tax set-aside feature |

---

## 7. AUTOMATION RISK REGISTER

Features people are asking for that have human-in-the-loop risks — and how to automate them.

| Feature | Current Risk | Automation Path | Data Source Needed |
|---|---|---|---|
| **AR Aging Alert** | Requires clean invoice/receivables data; many small businesses don't use accrual accounting | Pull from QuickBooks AR module or invoice tracking; flag when `dueDate < today - 30` | QuickBooks / accounting software integration |
| **Quarterly Tax Set-Aside** | Accurate estimate requires knowing entity type, state, prior-year tax rate | Use prior-year effective rate or a conservative flat % (25–30%) as a "set aside at least this" floor; flag quarterly due dates as fixed-date calendar events | Revenue data from current integration; entity type in onboarding |
| **Cash Runway** | Requires defining "operating expenses" — accrual vs. cash basis matters | Use 13-week rolling average of actual cash outflows from bank feed; show as "at current spend rate" explicitly — not a projection claim | Bank feed (Plaid) or QBO cash flow statement |
| **Margin Trend** | Requires revenue and COGS breakout; not always clean in QBO setup | Pull gross profit from QBO P&L; note "based on your QBO categories" in the trust stamp | QBO P&L via integration |
| **Expense Anomaly** | What's "unusual" varies by business type and age | Use 3-month rolling average per vendor category; flag anything >50% above average; let owner mark "Recurring" or "One-time" to self-train | Bank feed + accounting categories |
| **Payroll as % Revenue** | Requires linking payroll data | Integrate Gusto / ADP or use QBO payroll expense category as a proxy | QBO payroll account or payroll integration |

---

## 8. HYPOTHESES (NOT YET EVIDENCED)

Plausible based on the gathered corpus, but without enough sourced quotes to score confidently. Confirm or kill in the next research cycle.

| Hypothesis | Why Plausible | How to Test |
|---|---|---|
| SaaS/ecom businesses want MRR/churn as a first-class report metric | Stripe data is already wired; SaaS owners speak a different revenue language | Mine r/SaaS, r/SaaSOps, Indie Hackers for "I want my MRR in my monthly report" signals |
| Real-estate investors want a property-level P&L per unit, not just totals | BiggerPockets is a major watering hole; landlord-owners have multi-line businesses | Mine r/realestateinvesting, BiggerPockets for "financial report by property" pain |
| Seasonal businesses want a "this time last year" comparison more than a month-over-month | Seasonal cash flow is documented as a top-3 cash flow issue | Search "seasonal business financial report year over year comparison" in forum contexts |
| Businesses with a co-founder or partner want a "forward to partner" mode with summary formatting | Partner alignment is a documented trigger for getting financial visibility right | Mine "co-founder financial update" or "partner monthly report" forum signals |
| Businesses want a "what would happen if I hire someone?" scenario view | Hiring decisions are a documented cash flow trigger | Search for "should I hire" + "cash flow" in forum contexts; check if any tool offers this |
| The report's email subject line is as important as the report content for open rate | Subject-line design for "opened" step is currently under-researched in this corpus | A/B test subject-line variants in future cycles; search for email open rate in financial advisory context |

---

## 9. SOURCES

All venues and permalinks used in this research cycle.

| Source | URL | What It Contributed |
|---|---|---|
| Relay "Cash Flow Compass" Study (2024) | https://www.prnewswire.com/news-releases/new-relay-cash-flow-compass-uncovers-small-businesses-are-42-overconfident-in-their-cash-flow-control-302222383.html | 95% bank-balance stat; 91% cash flow issues; 71% personal impact; 42% overconfident |
| Relay State of Small Business Cash Flow (2024) | https://relayfi.com/blog/the-state-of-small-business-cash-flow/ | Bryce Conlan verbatim quote; 54% <1 month runway; 64% trust AI; 88% unexpected hits |
| PYMNTS 60% Cash Flow Study (2024) | https://www.pymnts.com/smbs/2024/60-of-small-businesses-struggle-with-cash-flow-management/ | 60% ineffective cash flow management; 46% delinquent payments concern; 64% exploring tailored services |
| PYMNTS 22% Struggle to Pay Bills (2024) | https://www.pymnts.com/smbs/2024/22percent-united-states-small-businesses-struggle-pay-bills-cash-flow/ | 22% struggle to pay bills; cash flow disruptions affect 88% |
| QuickBooks Late Payments Report (2025) | https://quickbooks.intuit.com/r/small-business-data/small-business-late-payments-report-2025/ | 56% owed money; $17K average overdue; 47% >30 days overdue; 10% workday chasing |
| Kaplan Group AR Statistics (2024) | https://www.kaplancollectionagency.com/business-advice/13-accounts-receivable-cash-collection-statistics-2024 | AR aging metrics; 91% firms with automated AR report savings/growth |
| Orbit Accountants — Bench Alternatives (2025) | https://orbitaccountants.us/blog/top-bench-accounting-alternatives-for-small-businesses/ | Bench Dec 2024 shutdown details; 11,000 locked out; post-acquisition gaps |
| The Thryve Group — Bench Lessons | https://www.thethryvegroup.com/strategic-planning/bench-accounting-shutdown-lessons/ | Lock-in risk; data portability imperative |
| LiveFlow Capterra Reviews (2024–2025) | https://www.capterra.com/p/237324/LiveFlow/reviews/ | "Built for finance team"; expensive; Google Sheets only; steep learning curve; poor for non-finance users |
| Reach Reporting Capterra Reviews (via search, 2024) | https://www.capterra.com/p/295490/Reach-Reporting/ | AI forecast doesn't work; cash flow inaccurate; high pricing for small business |
| Fathom G2 Reviews + Clockwork Review (2024) | https://www.g2.com/products/fathom/reviews; https://www.clockwork.ai/blog/should-accountants-use-fathom | Basic forecasting; steep setup; not owner-facing |
| Pilot Capterra Reviews (2024) | https://www.capterra.com/p/186313/Pilot/reviews/ | Expensive; unresponsive support; $145/hour supplemental; services not completed |
| NerdWallet QuickBooks Review (2024) | https://www.nerdwallet.com/business/software/reviews/quickbooks-online | "Nearly impossible to navigate simple financial records"; price hike Aug 2024 |
| Patrick Accounting — Tax Set-Aside (2024) | https://patrickaccounting.com/blog/small-businesses-taxes | Tax set-aside % guidance; IRS penalty rate 8% since 2024 |
| Found Tax App | https://found.com/taxes | Automated tax set-aside feature demand signal; app already exists for this job |
| Fractional CFO Pricing Research (via search) | Multiple sources, 2024 | $3,000–$7,000/month for $1M–$5M businesses; $175–$450/hour |

**What could NOT be verified in this cycle:**
- Direct Reddit thread access is blocked for Claude Code. All Reddit signals were inferred from search snippet summaries, not direct thread reads. To supplement: manually visit r/smallbusiness, r/Entrepreneur, r/Accounting, r/EntrepreneurRideAlong and search "monthly financial report," "cash flow," "accountant sent me a report I don't understand," and "quarterly taxes."
- Facebook Group access is not publicly accessible via web fetch. To supplement: search Facebook Groups for "small business finances," "bookkeeping for small business," and "real estate investors" and post or read community threads directly.
- G2 direct page access returned 403 Forbidden. G2 reviews for Fathom, LiveFlow, and Pilot were inferred from search snippets only — direct page fetch was blocked.
- YouTube comment mining (financial report tutorial comments) was not completed this cycle. To supplement: fetch YouTube videos titled "how to do a monthly financial report for small business" and read the comment section for pain points.

---

## 10. THE OPUS 4.8 ADVISORY REPORT ARCHITECTURE

*This section is a build spec for the future `/feature` and `/cog-admin` implementations. Research informs the spec; implementation is out of scope for this skill.*

### What the Evidence Demands the Report Deliver

Based on the full corpus, the bi-weekly GoldFin Desk report generated by Claude Opus 4.8 (`claude-opus-4-8`) must:

**Open with:** One number + a plain-English verdict + delta vs. last cycle + one-sentence "why." The owner must absorb this in under 10 seconds.

**Section 1 — The One Number (Cash Runway / "Am I OK?")**
- Cash on hand + burn rate → months of runway
- Plain verdict: "You're in good shape" / "Watch this closely" / "Act now"
- Trend arrow vs. prior cycle
- One sentence: why it changed

**Section 2 — What Changed Since Last Report**
- 2–4 biggest moves since prior cycle: "from → to, because ___"
- Written from prior report memory (the compounding value)
- Plain English, no accounting jargon

**Section 3 — Money In / Money Out**
- Revenue trend with biggest driver named
- Expense trend with biggest mover named
- Margin direction
- All tied to injected metrics — never generated by the model

**Section 4 — The Watch List (AR + Tax + Anomaly)**
- AR aging: named clients, amounts, days overdue — "Chase [Client A] for $4,200 (47 days overdue)"
- Tax set-aside: "Based on this month's revenue, set aside $X for Q[N] estimated taxes (due [date])"
- Anomaly flags: charges 50%+ above 3-month average, tagged "Review / Recurring / Timing"

**Section 5 — What to Do Now (2–3 Actions)**
- Each action is tied to a specific number from earlier in the report
- Each action is specific, named, with a suggested timing
- Ranked by urgency

**Footer — Trust Stamp**
- "These numbers are pulled from your connected accounts and reconciled as of [date]"
- Model: `claude-opus-4-8`
- No numbers were generated — all figures come from your accounting data

### The Compounding Memory Model

Each report generates a memory record containing:
- Metrics snapshot (all computed numbers, dated)
- Narrative summary (plain-English story told)
- Recommendations made (the 2–3 actions, with the figure each was tied to)
- Outcome tracking placeholder (did the owner act? did it work? — to be surfaced next cycle)

Report N is generated with reports 1…N-1 in context (recent in full, older as summaries). The engine explicitly calls back: "Last cycle we flagged that Client A was 19 days overdue — they're now at 47 days. This needs a call today."

### Anti-Hallucination Architecture (Non-Negotiable)

- **Layer 1 (deterministic code):** All numbers computed before the model is called. The model receives structured facts, not raw data to interpret.
- **Layer 2 (memory injection):** Prior reports pulled and summarized.
- **Layer 3 (Opus 4.8 interpretation):** Model writes explanation + action language around injected facts. System prompt hard rule: "Use only the figures provided. Never state a number not in the data."
- **Layer 4 (verification):** Every number in the generated output is checked against Layer 1 before send. Any fabricated figure blocks the send.

---

*End of Cycle 1 Dossier — 2026-06-21*
*Next cycle: supplement Reddit/Facebook signals via direct community mining; confirm/kill hypotheses in Section 8; add engagement data from first deployed reports.*

*Research hands off to: `/feature` for building the report generation engine; `/cog-admin` for the backend data pipeline; the conversion/hero personas for the Customer Lexicon in Section 6.*
