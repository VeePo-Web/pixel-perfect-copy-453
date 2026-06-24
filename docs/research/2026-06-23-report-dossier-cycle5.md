# GoldFin Desk — Advisory Report Research Dossier
## Cycle 5 · 2026-06-23
### The Real-Data Pipeline & Industry-Adaptive Cycle
**Compounds on Cycles 1–4.** All prior layers **proven**. Cycle 5 answers what the prior four assumed away: **how does a messy Visa statement / bank CSV become CFO-grade analysis a CPA would trust — and how does the report adapt to the owner's industry?**

**Research + architecture-spec only — nothing was changed.**

**Cycle-5 mandate (user):** real CFO/CPA-quality reports **based off real data, Visa statements, spreadsheet templates** → insights + data + strategy so owners **actually make money**.

---

## 1. EXECUTIVE SUMMARY

Prior cycles specced *what* goes in the report. Cycle 5 confronts the truth underneath: **a CFO-grade report is only as trustworthy as the categorization of the raw transactions — and raw Visa/bank data is genuinely messy.**

1. **Raw bank/card data is messy; merchant normalization is the hidden foundation of trust.** Same merchant appears as *"AMZN, Amazon.com, AMAZON MARKETPLACE, AMZ*Digital"*; bank MCC codes are *"broad and often misleading"* ([Quadratic](https://www.quadratichq.com/blog/bank-transaction-categorization-rules-ai-review) · [Neontri](https://neontri.com/blog/ai-transaction-categorization/)). One wrong number is the "fireable offense" that destroys trust. **The enrichment/categorization layer is the load-bearing wall.**
2. **Proven method: hybrid rules → AI enrichment → human review — and Plaid ships enrichment.** *"The most reliable way… moves from strict logic to AI enrichment and ends with human review"* ([Quadratic](https://www.quadratichq.com/blog/bank-transaction-categorization-rules-ai-review)). **Plaid Enrich** returns *"merchant names, logos, locations, and refined industry classifications"* ([Plaid Enrich](https://plaid.com/products/enrich/)). "Human review" = a lightweight owner "is this right?" correction that **self-trains** the categorizer.
3. **A generic report is inferior to one that knows the industry — the make-or-break metric changes by vertical.** Restaurants: **prime cost** 55–65%, food 28–35% ([Lightspeed](https://www.lightspeedhq.com/blog/restaurant-kpis/)). Contractors: **WIP / over-under-billing** ([Premier CS](https://premiercs.com/blog/financial-kpis-every-construction-business-should-monitor)). Retail: **inventory turnover, GMROI** ([NetSuite Retail](https://www.netsuite.com/portal/resource/articles/financial-management/retail-kpis.shtml)). Agencies: **utilization, 85% GM, CLV** ([NetSuite Agency](https://www.netsuite.com/portal/resource/articles/erp/marketing-agency-kpis.shtml)). The benchmark must be vertical-specific.
4. **The Visa statement hides recoverable money: duplicate, gray, unauthorized charges.** Scan for *"charged twice… never received"* with a hard **60-day dispute window** ([CFPB](https://www.consumerfinance.gov/consumer-tools/credit-cards/how-to-fix-mistakes-in-your-credit-card-bill/) · [FTC](https://consumer.ftc.gov/articles/using-credit-cards-and-disputing-charges)). Almost nobody audits manually.
5. **Data foundation determines which features ship — sequencing follows trust:** (1) enrichment + coverage stamp → (2) bank-feed-only (survival, waste, card audit, owner-pay) → (3) industry pack + benchmarks → (4) template-unlocked per-line profit.
6. **Quarterly "Strategy Deep-Dive" emerges as a Pro-tier artifact** — re-packaging C3–C5 depth on a quarterly cadence, no new research.

**Biggest trust-gap, in market's words:**
> *"Banks assign each transaction an MCC, but those codes are broad and often misleading — AI looks at the actual merchant name and groups transactions into categories that reflect your real spending."* ([Quadratic](https://www.quadratichq.com/blog/bank-transaction-categorization-rules-ai-review))

---

## 2. RANKED FEATURE TABLE — CYCLE 5

| # | Feature / Layer | Freq | Pain | WTP | Auto | Score | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | **Transaction Enrichment & Categorization Layer** — merchant normalization + GL mapping + coverage/confidence stamp | 5 | 5 | 4 | FULLY | **100** | same merchant 4 ways; MCC misleading; Plaid Enrich available |
| 2 | **Industry-Adaptive KPI Pack** — lead with vertical's make-or-break metric + vertical benchmark | 4 | 5 | 4 | AUTO-SETUP | **64** | each vertical has a distinct survival metric |
| 3 | **Card-Statement Audit** — duplicate/gray/unfamiliar/unauthorized + 60-day dispute clock | 4 | 4 | 4 | FULLY | **64** | "charged twice/never received"; 60-day window |
| 4 | **Owner Correction Loop (self-training)** — "is this right?" 1-tap fix | 4 | 3 | 3 | FULLY | **36** | the "human review" step; trust + accuracy compounding |
| 5 | **Quarterly Strategy Deep-Dive (Pro tier)** | 3 | 3 | 4 | FULLY | **36** | CFOs mix cadences; re-packaging of C3–C5 |

---

## 3. THE REAL-DATA PIPELINE (Visa statement → CFO report)

```
STAGE 0 INGEST     Plaid transactions (bank + Visa) and/or template upload (C4 schema). ≥180 days.
STAGE 1 NORMALIZE  Merchant normalization (collapse AMZN/Amazon.com → one); Plaid Enrich; rules for known payees.
STAGE 2 CATEGORIZE Map to category/GL. Rules for known; ML for long tail. Ignore misleading MCC.
STAGE 3 REVIEW     Coverage/confidence score; surface low-confidence/large items to owner "is this right?"; self-trains; remembered.
STAGE 4 METRICS    Deterministic metrics (C1–C4) run ONLY on normalized+categorized data.
STAGE 5 STAMP      Footer: "Based on X of Y transactions categorized (Z% coverage), reconciled as of [date]."
```
The coverage stamp turns "do I believe this?" into "I can see exactly how complete this is."

---

## 4. THE INDUSTRY-ADAPTIVE KPI PACK

| Vertical | Lead metric | Benchmark | Computed from |
|---|---|---|---|
| Restaurant/food | Prime cost = (food+bev+labor)/rev; food cost % | Prime 55–65%; food 28–35% | card feed + payroll |
| Contractor/construction | WIP / over-under-billing; job margin; cost variance | job margin vs bid | template (job costing) + bank |
| Retail/product | Inventory turnover; GMROI; sales/sq ft | GMROI > 1 | template (inventory/COGS) + revenue |
| Agency/services | Billable utilization; gross margin; CLV; CAC | GM 85%+, util 75%+ | Stripe/revenue + payroll + time |
| SaaS | MRR, churn, LTV:CAC, runway | LTV:CAC ≥ 3:1 | Stripe + ads |
| Generic | C3 ratio spine | cross-industry | bank feed + template |

**Design rule:** never show a restaurant "expenses rose 4%" — show *"prime cost hit 67% — above the 65% danger line; driver was labor up $3,100."*

---

## 5. THE CARD-STATEMENT AUDIT

| Flag | Detection | Money-move |
|---|---|---|
| Duplicate | same merchant + amount + within N days | dispute within 60 days |
| Gray charge | post-trial jump; tiny fee creep | cancel/dispute |
| Unfamiliar/unauthorized | first-seen merchant > threshold | verify; dispute if fraud |
| Dispute-window clock | flagged charge + statement date | "dispute by [date] (60-day federal window)" |

Money owed back, with a legal deadline; FULLY AUTO from the card feed; third "we recovered you real dollars" moment alongside waste + tax flag.

---

## 6. JOBS & TRIGGERS — CYCLE 5

| Trigger | Motivation | Outcome |
|---|---|---|
| "Half my transactions say 'SQ *' codes" | group spending into real categories | see where money goes |
| "Generic tools don't get that I run a restaurant" | lead with prime cost | advice fits my business |
| "Think I got double-charged but never check" | catch duplicates automatically | dispute in time, get money back |
| "Don't fully trust the auto-numbers" | see how much data was categorized | know whether to trust conclusions |

---

## 7. COMPETITOR SWITCH MAP — CYCLE 5

| Competitor | "Can't do" | Implies |
|---|---|---|
| QBO/Xero auto-categorization | normalize messy merchants; owners still recategorize | enrichment + self-training loop |
| Float/Fathom | adapt KPIs to the vertical | industry-adaptive pack |
| Personal/bank apps | surface billing errors for a business + dispute clock | card-statement audit |
| Bookkeeping templates | catch miscategorized/owed-back | enrichment + audit on uploaded ledger |

---

## 8. CUSTOMER LEXICON — CYCLE 5
"I don't recognize this charge / what is this charge" · "categorize my transactions / where it actually goes" · "double charged / charged twice" · "doesn't get my industry / built for my business" · "prime cost / food cost / WIP / utilization / turnover" · "how much of this is right / can I trust it".

---

## 9. AUTOMATION RISK REGISTER — CYCLE 5

| Feature | Verdict | Path |
|---|---|---|
| Enrichment & Categorization | FULLY AUTO | Plaid Enrich + rules + ML long tail; ignore MCC; confidence score per txn |
| Coverage/Confidence Stamp | FULLY AUTO | % of $ and count categorized above threshold |
| Card-Statement Audit | FULLY AUTO | card feed; duplicate/unfamiliar/dispute clock |
| Owner Correction Loop | FULLY AUTO | surface low-confidence; store correction; re-apply (self-train) |
| Industry-Adaptive Pack | AUTO-SETUP | vertical in onboarding; some verticals need payroll/template; fallback to generic |
| Quarterly Deep-Dive | FULLY AUTO (packaging) | re-run C3–C5 quarterly |

**Principle:** enrichment is the PREREQUISITE to every prior cycle's profit math. Build first or the smartest features produce untrustworthy numbers.

---

## 10. ARCHITECTURE SPEC ADDITIONS

```
Layer 0 INGEST+ENRICH+CATEGORIZE+CONFIDENCE  ← NEW, prerequisite (Plaid Enrich + rules + ML + correction memory)
Layer 1 METRICS (C1–C4)  runs ONLY on Layer-0 output
Layer 2 MEMORY  + owner category corrections (self-training)
Layer 3 OPUS 4.8  interpretation, unchanged grounding contract
Layer 4 VERIFICATION  + must not assert a number whose source txns are below confidence without flagging coverage
Layer 5 DELIVERY  + coverage/confidence stamp in footer
```
**Anatomy inserts:** top = industry-adaptive lead metric; profit tier += Card-Statement Audit; footer = coverage stamp; Pro tier = Quarterly Strategy Deep-Dive.
**Opus 4.8:** *"You may only assert a figure if its underlying transactions are categorized above the confidence threshold. When coverage is partial, say so. Lead with the metric that defines this owner's industry."* Memory adds `category_corrections[]`, `vertical`, `coverage_pct`, `card_audit_flags[]`.
**Onboarding:** capture **industry/vertical** + **entity type** — two questions that unlock the highest-value features.

**Build via /feature (enrichment review UI, card-audit block, industry KPI surface, coverage stamp) or /cog-admin (Plaid Enrich pipeline, categorization rules+ML, confidence scoring, vertical benchmark datasets, correction memory).**

---

## 11. HYPOTHESES — CYCLE 5
- Categorization accuracy = #1 trust + retention driver → track correction usage + churn vs coverage.
- Owners self-correct if it improves next report → measure completion + accuracy lift.
- Card audit alone recovers > subscription cost → measure flagged + disputed + recovered $.
- Vertical reports convert better than generic → A/B vertical landing pages.
- 4–6 verticals cover majority of signups (restaurant, trades, retail, agency, ecom, prof-services) → segment signups.

---

## 12. SOURCES — CYCLE 5
Quadratic + Neontri + DocuClipper (categorization, merchant normalization, MCC misleading) · Plaid Enrich · Lightspeed + Whipplewood (restaurant prime cost) · Premier CS (contractor WIP) · NetSuite Retail (GMROI) · NetSuite Agency + Fuelfinance (agency utilization/85% GM) · CFPB + FTC + NerdWallet (dispute/duplicate/60-day window).

**Could NOT verify:** SMB-specific categorization accuracy rates (pilot needed); Plaid Enrich pricing for business feeds; Reddit/FB raw threads; per-vertical benchmark dataset licensing.

---

## 13. HANDOFF
- **Build next (prerequisite):** Transaction Enrichment & Categorization Layer + coverage stamp (Plaid Enrich, FULLY AUTO). Build before contribution margin/benchmarks.
- **Then (FULLY AUTO, recover real money):** Card-Statement Audit + C3 Waste Detector + C4 Tax Flag — the three "found/recovered real dollars" moments.
- **Then:** Industry-Adaptive KPI Pack (capture vertical + entity at onboarding).
- **Cycle-6 questions:** categorization coverage % on real feeds; Plaid Enrich cost; which 4–6 verticals first; does card audit recover > sub cost; deployed data.
- **Hands to:** `/feature` (enrichment review UI, card-audit, vertical KPI surface, coverage stamp, deep-dive layout); `/cog-admin` (Plaid Enrich pipeline, categorizer, confidence scoring, benchmark datasets, correction memory, onboarding capture); `/hero`+`/geomatrix` (vertical landing pages).

*End of Cycle 5 Dossier — 2026-06-23 (restored after concurrent-tooling wipe)*
