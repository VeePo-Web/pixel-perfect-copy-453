# GoldFin Desk — Advisory Report Research Dossier
## Cycle 3 · 2026-06-22
### The CFO/CPA Analytical-Depth & Profit-Strategy Cycle
**Compounds on Cycles 1–2.** Prior findings (cash runway/"Am I OK", AR aging, tax set-aside, plain-English, memory model, competitor switch gaps, email subject line, SaaS MRR) are **proven** and not re-derived. This cycle answers a different question: what makes a report CFO/CPA-GRADE and money-making, built from raw Visa/bank + spreadsheet templates.

**Methodology:** Mom Test × Sales Safari × JTBD × Demand Score × fractional-CFO method
**Research + architecture-spec only — nothing was changed in this run.**

**Cycle-3 mandate (user):** real CFO/CPA-quality reports from real data (Visa/bank + spreadsheet templates) giving insights + data + strategy so owners **actually make money**.

---

## 1. EXECUTIVE SUMMARY

Cycles 1–2 answered **survival** — *"Am I okay?"* Cycle 3 answers **wealth** — *"How do I make more money?"* — which separates a finance *summary* from a CFO/CPA-grade *advisory report*, and justifies the price vs. the $3K–$12K/mo fractional CFO.

Defining structural insight: **a real CFO report is built around four decisions, not four statements** — *"help you decide whether to hire, raise prices, cut costs, or tighten collections… built around decisions"* ([MyOfficeOps](https://myofficeops.com/resources/cfo-report-example/)).

Eight findings:
1. **"Profit" beats "cash" as the depth differentiator — almost nobody automates it.** True contribution margin is *"20–30 points lower than gross margin… uncovering $200,000–$800,000 in hidden profit"* ([CFO Pro Analytics](https://cfoproanalytics.com/cfo-wiki/fractional-cfo/how-cfos-improve-unit-economics-across-business-models/) · [Phoenix Strategy Group](https://www.phoenixstrategy.group/blog/contribution-margin-impacts-unit-economics)).
2. **Highest-ROI new feature is FULLY AUTO from data already wired: a Recurring-Spend Waste Detector.** *"47% of subscriptions continue billing after last use… $135,000 annually"*; SMBs waste *"$25,000 to $50,000"* a year ([Linkenheimer](https://www.linkcpa.com/the-great-subscription-creep-how-software-costs-are-quietly-eating-your-budget/) · [Spendesk](https://www.spendesk.com/blog/subscription-management/)). **Plaid `/transactions/recurring/get`** already *"groups all transactions that occur on a recurring basis"* ([Plaid](https://plaid.com/blog/recurring-transactions/)). Found money on report #1.
3. **"Is this normal?" benchmark question goes unanswered.** *"A 10% net margin might be exceptional in retail but signal trouble in professional services where 20%+ is common"* ([Vena](https://www.venasolutions.com/blog/average-profit-margin-by-industry)).
4. **Owners don't know how much to pay themselves.** Profit First (Profit 5 / Owner 50 / Tax 15 / OpEx 30) is computable from inflows ([Relay](https://relayfi.com/blog/profit-first-method/)).
5. **Underpricing is the common leak.** *"A 10–15% raise meaningfully improves the bottom line"*; CFOs model the tradeoff — *"5% price up / 3% volume down increases profit, but most don't model it"* ([Small Business Charter](https://smallbusinesscharter.org/news-and-insights/news/the-hidden-cost-of-under-pricing-why-your-business-deserves-more)).
6. **13-week cash forecast + scenario is THE flagship CFO deliverable** — automatable from recurring streams ([Whipplewood](https://whipplewood.com/insights/13-week-cash-flow-forecast-guide/)).
7. **Competitor gap named: software shows numbers, doesn't interpret them.** *"Accounting software alone isn't enough — need a financial analysis solution"* ([Coefficient](https://coefficient.io/quickbooks/limitations-in-quickbooks-online-reporting) · [Fishbowl](https://www.fishbowlinventory.com/blog/xero-vs-quickbooks-online)).
8. **Every analytical section must end in a dollar-quantified decision** — the Decision Memo. The Bench failure was *"no recommendations despite premium service."*

**Biggest gap, in market's words:**
> *"Accounting software alone isn't enough—businesses need a financial analysis solution… insights that actually help make decisions."* ([Coefficient](https://coefficient.io/quickbooks/limitations-in-quickbooks-online-reporting))

---

## 2. RANKED FEATURE TABLE — CYCLE 3 (profit layer)

**Demand Score = Freq × Pain × WTP × Auto-multiplier** (FULLY ×1.0 · AUTO-SETUP ×0.8 · NEEDS-HUMAN ×0.3).

| # | Feature | Freq | Pain | WTP | Auto | Score | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | **The Decision Memo (synthesis)** — ends in hire/raise/cut/collect, each $-impact | 5 | 5 | 5 | FULLY | **125** | CFO report "built around decisions"; Bench failed on "no recommendations" |
| 2 | **Recurring-Spend Waste Detector** — dormant/duplicate/creep + $/yr recovered | 5 | 4 | 4 | FULLY | **80** | 47% bill after last use; $135K/yr; Plaid recurring already available |
| 3 | **Contribution Margin / "What's Profitable"** — by product/service/channel | 4 | 5 | 5 | AUTO-SETUP | **80** | "20–30 pts below gross"; "$200K–$800K hidden"; "one blended number" |
| 4 | **13-Week Forecast + Scenario** | 4 | 4 | 5 | FULLY | **80** | "primary CFO tool… strategy not panic" |
| 5 | **Industry Benchmark / "Is This Normal?"** | 5 | 4 | 4 | AUTO-SETUP | **64** | "10% net = great in retail, trouble in services" |
| 6 | **Owner Pay & Profit Allocation (Profit First)** | 4 | 4 | 4 | FULLY | **64** | "owners pay themselves what's left = nothing" |
| 7 | **Pricing / Margin-Lift Opportunity** | 4 | 4 | 4 | AUTO-SETUP | **51.2** | "10–15% raise improves bottom line"; "5% up/3% down still wins" |
| 8 | **Spreadsheet-Template Intake** | 4 | 4 | 3 | AUTO-SETUP | **38.4** | owners "rely heavily on spreadsheets" for analysis QBO won't give |
| 9 | **Breakeven + Margin of Safety** | 3 | 4 | 4 | AUTO-SETUP | **38.4** | core CFO/CPA deliverable |
| 10 | **Vendor / Cost-Creep Watch** | 3 | 4 | 3 | FULLY | **36** | price creep; FULLY AUTO from recurring streams |

---

## 3. WHAT MAKES A REPORT CFO/CPA-GRADE

### The Four-Decision Spine ([MyOfficeOps](https://myofficeops.com/resources/cfo-report-example/))
| Decision | Analysis | Computable from |
|---|---|---|
| Hire? | runway incl. new payroll; breakeven shift | Bank feed + payroll |
| Raise prices? | contribution margin by line; price/volume tradeoff | Revenue categories + template |
| Cut costs? | recurring waste; expense vs benchmark; biggest mover | Bank/Visa (Plaid recurring) |
| Tighten collections? | AR aging + cash-conversion timing | Invoice/AR or template |

### Profitability depth: gross → contribution → net
Go past gross margin to contribution margin (after all variable costs: shipping, fulfillment, processing, channel fees). Never present one blended margin — name best/worst line + the $ opportunity ([Phoenix Strategy Group](https://www.phoenixstrategy.group/blog/contribution-margin-impacts-unit-economics)).

### Forward, not just backward
13-week rolling cash forecast with best/expected/worst scenarios, grounded in Plaid recurring streams, labeled "at your current recurring pattern" — never a fabricated projection ([Whipplewood](https://whipplewood.com/insights/13-week-cash-flow-forecast-guide/)).

### Context (benchmarks + ratios)
Standard CFO ratio set (gross/net margin, operating cash flow, current ratio, revenue growth), each paired with an industry benchmark + plain verdict ([NetSuite](https://www.netsuite.com/portal/resource/articles/accounting/financial-kpis-metrics.shtml)). Use standard accounting vocabulary so the report survives the forward to the owner's CPA.

### Strategy (the money-moves)
Stop the leak (recurring waste) · reprice (10–15%) · reallocate (owner pay/profit).

---

## 4. REPORT-VALUE FINDINGS — CYCLE 3

**UNDERSTOOD:** depth lives behind the verdict (one number + verdict on top; analytical proof below). *"Cleanest reports are short, readable, built around decisions… doesn't impress with volume"* ([MyOfficeOps](https://myofficeops.com/resources/cfo-report-example/)).
**TRUSTED:** analysis must be accountant-compatible — standard ratio names + formula on hover; spreadsheet-template intake is where owners already do analysis.
**ACTED ON:** every analytical claim carries a dollar + deadline (not "subscriptions are high" but *"3 tools ($612/mo) no activity 90+ days — cancel to recover ~$7,344/yr"*).

---

## 5. JOBS & TRIGGERS — CYCLE 3

| Trigger | Motivation | Outcome |
|---|---|---|
| "Working harder but no money left" | which products/clients make money | fire unprofitable work |
| "Charges I don't recognize" | every recurring charge surfaced + ranked | stop the silent drain |
| "My buddy's margins are better" | is my number normal for my industry | know pricing vs cost problem |
| "Haven't paid myself properly" | how much can I safely take | get paid like the business should fund my life |
| "Charging too little but scared to raise" | what a 10% raise does + volume I can lose | raise with a number not a guess |
| "Just bank statements + a spreadsheet" | real report from data I have | CFO analysis without redoing books |

---

## 6. COMPETITOR SWITCH MAP — CYCLE 3

| Competitor | "Can't do" | Implies |
|---|---|---|
| QBO | plain-English health verdict; reporting limits "cost you money"; forces spreadsheets | interpreted advisory + template intake |
| QBO/Xero | "shows numbers, no meaning" | number→meaning→money-move layer |
| Xero | "too basic for meaningful analysis" | contribution margin + benchmark + decision memo |
| Float | cash-only, no P&L | combined cash + profit + per-line CM |
| Fathom/Jirav/Mosaic/Cube | need finance team to configure | pre-built, zero-setup CFO analysis |
| Bench | "no recommendations despite premium" | the Decision Memo |
| Fractional CFO $3K–$12K/mo | unaffordable under $1M | same 4-decision analysis at $99/mo |

---

## 7. CUSTOMER LEXICON — CYCLE 3

"which products/clients make money" · "leaving money on the table" · "is this normal / good margin for my industry" · "where is my money going" · "subscription creep / still being billed / forgot to cancel" · "pay myself / how much can I take" · "shows numbers but doesn't tell me what they mean" · "built around decisions" · "what's actually profitable" · "raise prices without losing customers" · "break even / how much do I need to make".

---

## 8. AUTOMATION RISK REGISTER — CYCLE 3

| Feature | Verdict | Path |
|---|---|---|
| Recurring-Spend Waste | FULLY AUTO | Plaid `/transactions/recurring/get`; flag no-activity/duplicate/creep; 180+ days history |
| Vendor Cost-Creep | FULLY AUTO | recurring last_amount vs earlier |
| Decision Memo | FULLY AUTO | synthesis over computed metrics; Opus 4.8 interpretation |
| 13-Week Forecast | FULLY AUTO (label honestly) | project recurring streams; "at current pattern"; ± bands |
| Owner Pay/Profit First | FULLY AUTO | Profit First % on actual inflow |
| Contribution Margin by line | AUTO-SETUP | revenue split via template; variable costs from bank |
| Industry Benchmark | AUTO-SETUP | industry in onboarding + benchmark dataset |
| Pricing/Margin-Lift | AUTO-SETUP | per-line revenue + variable cost |
| Spreadsheet-Template Intake | AUTO-SETUP | fixed-schema CSV; schema IS the setup |
| Breakeven | AUTO-SETUP | fixed vs variable split |

**Principle:** bank-feed-only → ships FULLY AUTO on report #1; revenue-split features unlock when the owner provides the spreadsheet template.

---

## 9. ARCHITECTURE SPEC (build-ready)

**Anatomy:** Survival tier (C1–2: one number + verdict, what-changed, money in/out, watch list) → **Profit tier (NEW): what's making money (contribution margin) · where it's leaking (waste detector) · is this normal (benchmark) · what you can take (owner pay) · forward view (13-week)** → **Decision Memo** (ranked moves, each $ + deadline). Depth sits behind the verdict.

**Opus 4.8:** 4-layer anti-hallucination — Layer 1 deterministic metrics (compute every number) · Layer 2 memory (recent verbatim, older summarized; did owner cancel flagged subs? take repricing?) · Layer 3 interpretation (`claude-opus-4-8`, *"use only provided figures, never invent, every recommendation cites a figure + ends in action + dollar + timeframe"*, Grade 6–8, standard terms, no hype) · Layer 4 verification (every output number checked to Layer 1; orphan blocks send; Decision-Memo items must cite a figure).

> Note: the live `generate-briefing` demo runs `google/gemini-2.5-flash` and INVENTS numbers (marketing sample only). The real grounded report is a SEPARATE `claude-opus-4-8` pipeline. Do not extend the demo into it.

**Memory adds:** `contribution_margin_by_line[]`, `recurring_streams_flagged[]`, `benchmark_percentile`, `owner_pay_recommended`, `price_change_recommended`, `decisions_issued[]` (+ acted? + outcome).

**Build via /feature (report surface + waste-detector module + template intake UI + decision-memo block) or /cog-admin (metrics layer, Plaid recurring pipeline, benchmark dataset, memory fields, scheduled generation).**

---

## 10. HYPOTHESES — CYCLE 3

- Per-channel CAC/LTV is must-have for ecom → mine r/ecommerce/PPC.
- Owners will upload a template if it unlocks "what's profitable" → prototype + measure intake.
- Waste detector alone justifies the subscription → A/B "find $X waste or it's free".
- "What-if I hire" auto-proxy from recurring streams → compute runway delta for +$X recurring.
- Quarterly strategy deep-dive a distinct artifact → search "quarterly business review finances".

---

## 11. SOURCES — CYCLE 3
MyOfficeOps (CFO report = decisions) · CFO Pro Analytics + Phoenix Strategy Group (contribution margin, $200K–$800K) · NetSuite + insightsoftware (KPI/ratio set) · Whipplewood + Preferred CFO + Intuit (13-week forecast) · Vena + Eagle Rock CFO (margin benchmarks) · Linkenheimer + Spendesk (subscription waste $135K/yr) · Plaid (recurring transactions) · Relay + NorthOne (Profit First) · Small Business Charter + Patrick Accounting (underpricing/raise prices) · Coefficient + Fishbowl (QBO/Xero "shows numbers, no meaning"). Full URLs in Cycle-7 build pack + inline above.

**Could NOT verify:** Reddit/FB raw threads (blocked); G2/Trustpilot/Capterra (403); no deployed-report engagement yet; benchmark-dataset licensing terms.

---

## 12. HANDOFF
- **Build next:** Recurring-Spend Waste Detector (FULLY AUTO via wired Plaid; found money on report #1).
- **Cycle-4 questions:** ecom CAC/LTV; template-intake completion; quarterly deep-dive.
- **Hands to:** `/feature` (profit-tier surface, waste detector, template intake, decision memo); `/cog-admin` (metrics layer, Plaid recurring, benchmark dataset, memory, cron); `/hero`+`/convert` ("shows numbers, doesn't tell you what they mean", "leaving money on the table", "$3K–$12K CFO anchor").

*End of Cycle 3 Dossier — 2026-06-22 (restored 2026-06-23 after concurrent-tooling wipe)*
