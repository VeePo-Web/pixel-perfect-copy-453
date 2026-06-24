# GoldFin Desk — Advisory Report Research Dossier
## Cycle 6 · 2026-06-23
### The Reference Report & Growth-Strategy Cycle
**Compounds on Cycles 1–5.** All prior layers **proven**. Cycle 6 (1) establishes the **growth/reinvestment strategy layer** (the "now make MORE money" forward move), and (2) produces the **fully-worked Reference Report** — the gold-standard build target.

**Research + architecture-spec only — nothing was changed.**

**Cycle-6 mandate (user):** real CFO/CPA-quality reports from real data / Visa / templates → insights + data + **strategy so owners actually make money** — **implemented into the website**.

---

## 1. EXECUTIVE SUMMARY

Five cycles specced every layer. Cycle 6 closes two implementation-blocking gaps: (a) a forward "grow profitably" move completing survive → optimize → grow, and (b) one concrete example showing how the layers render into words an owner reads. The Reference Report (Section 6) is the centerpiece + hand-off.

1. **The report must break the "sales up = healthy" illusion — the deadliest belief in small business.** *"Most owners believe if sales are increasing the business must be healthy — an assumption that has put thousands of profitable companies out of business… many never saw a margin report and didn't realize their problem was gross profit, not overhead"* ([Crossroad Coach](https://crossroadcoach.com/financial-reporting/) · [American Receivable](https://americanreceivable.com/5-financial-red-flags-small-business-owners-ignore-until-its-too-late/)). The verdict must reconcile revenue vs profit vs cash.
2. **A CFO report is a story with the answer first (Deloitte "Three Ts": Takeoff).** *"Open with the most critical insight… what matters, why, what to do next"*; *"context always beats content — anchor to history, benchmarks, or plan"* ([Deloitte](https://www.deloitte.com/us/en/programs/chief-financial-officer/articles/cfo-insights-storytelling-with-data.html) · [Workday](https://blog.workday.com/en-us/cfo-as-storyteller-weaving-compelling-narratives-from-financial-data.html)). The **five-second rule** governs the whole report.
3. **The missing strategy layer is reinvestment.** Healthy SMBs reinvest *"30–50% of net profit"* (startups 50–70%) into *"marketing/CAC, automation, talent, product"*, keeping a reserve ([Crestmont](https://www.crestmontcapital.com/blog/how-to-reinvest-profits-into-your-small-business) · [Hiscox](https://www.hiscox.com/blog/5-best-ways-reinvest-your-businesss-profits)). Completes the arc: find cash → keep more → deploy to earn more.
4. **The report is the accountability mechanism owners lack.** *"Most owners don't have boards… lead with little to no accountability"* ([SmartBrief](https://www.smartbrief.com/original/business-owners-need-be-accountable-too)). Memory makes the report a board substitute: "did you do last cycle's move?"
5. **One worked example > ten more spec sections.** The Reference Report renders the full stack for one business — the spec `/feature` builds to.

**Biggest truth, in market's words:**
> *"Many business owners have never seen a margin report and didn't realize that their problem was gross profit, not overhead."* ([Crossroad Coach](https://crossroadcoach.com/financial-reporting/))

---

## 2. RANKED FEATURE TABLE — CYCLE 6

| # | Feature | Freq | Pain | WTP | Auto | Score | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | **"Sales-Up vs Profit-Down" Truth Verdict** | 5 | 5 | 4 | FULLY | **100** | "sales=healthy" illusion "put thousands out of business" |
| 2 | **Growth / Reinvestment Recommendation** — "reinvest ~$X (30–50%), highest-ROI [area], keep $Y reserve" | 4 | 4 | 4 | FULLY | **64** | 30–50% reinvest; 4 high-ROI areas |
| 3 | **"Did You Do It?" Accountability Callback** | 4 | 4 | 4 | FULLY | **64** | owners lack boards; memory = board substitute; retention moat |
| 4 | **Story-First Structure (Three Ts + 5-sec rule)** | 5 | 4 | 3 | FULLY | **60** | Deloitte Three Ts; "context beats content" |
| 5 | **The Reference Report (build target)** | — | — | — | — | **spec** | Section 6 |

---

## 3. THE CFO STORYTELLING STRUCTURE
1. **Takeoff — answer first** (the verdict), never bury the lede.
2. **Context always beats content** — every number anchored to history / benchmark / plan.
3. **What → Why → What-to-do** — no section ends in a number.
4. **Five-second rule** — any figure yields its takeaway in 5 seconds.
5. **Helicopter view then detail** — survival tier leads; CPA depth collapsed beneath.
6. **Audience-aware forward** — owner plain-English; CPA-compatible export.

---

## 4. THE GROWTH / REINVESTMENT STRATEGY LAYER

| Element | Logic | Source |
|---|---|---|
| Reinvestment budget | 30–50% of net profit (50–70% early-stage) | [Crestmont](https://www.crestmontcapital.com/blog/how-to-reinvest-profits-into-your-small-business) |
| Cash-reserve floor | never deploy below the runway floor | [Hiscox](https://www.hiscox.com/blog/5-best-ways-reinvest-your-businesss-profits) |
| Highest-ROI target | marketing/CAC · automation · talent · product | Crestmont |
| Tie to unit economics | only recommend marketing reinvestment when LTV:CAC ≥ 3:1 | C4 |

**Honesty rule:** reinvestment is the "earn new dollars" bucket — least certain. Gated behind secured reserve + proven unit economics. Never tells a cash-tight or thin-margin owner to spend.

---

## 5. ARCHITECTURE SPEC ADDITIONS
- **The One Number** now reconciles revenue vs margin vs cash + memory callback ("Last cycle I recommended X — here's what happened").
- **WHERE TO GROW** block (after profit tier, before Decision Memo, ONLY if reserve secured): reinvestment budget + highest-ROI area + reserve floor, gated on LTV:CAC ≥ 3:1.
- Decision Memo spans hire/raise/cut/collect, bucket-labeled, each carries last-cycle accountability where applicable.
- **Opus 4.8:** *"Open with the single most important truth, even if it contradicts the owner's optimism. Anchor every figure to history/benchmark/plan. Every figure passes the five-second rule. Always follow up on the prior cycle's recommendation. Only recommend reinvestment when the reserve is secured and unit economics support it; label it least-certain."* Memory adds `prior_recommendation` + `acted?` + `outcome`; `reinvestment_recommended` + `area`.

---

## 6. THE REFERENCE REPORT (build target — worked example)

> **Business:** Northlight Creative — 4-person marketing agency · LLC taxed as sole proprietor · ~$48K/mo revenue · connected: business checking + Visa business card (Plaid) + Stripe.

---

**📧 Subject:** `Northlight Creative: 5.1 months of cash · ↓ from 6.0 — read this one`

### Am I OK? — Watch this closely.
**Your revenue is up 9% this cycle, but your profit fell 14%.** You're busier and making less. Cash runway slipped from 6.0 to 5.1 months — not an emergency, but the wrong direction for the third straight cycle. *(Last cycle I recommended raising the retainer on your two oldest clients — that hasn't happened; see the Decision Memo.)*

### What changed
- **Revenue $48,200, up $4,000** — entirely one new project client (one-time, not retainer).
- **Profit $6,300, down $1,050** — labor rose $3,100 (contractor hours) faster than the revenue it brought in.
- **Cash −$3,800 for the cycle** — two client invoices ($11,400) are 40+ days late.

### What's actually making money
Your **billable utilization is 61%** — below the 75%+ that defines a healthy agency, and the real reason profit is thin. By line: **retainers carry a 71% contribution margin; one-off projects only 22%** after contractor hours. You're winning the work that pays least. *(Benchmark: agency gross margin target 85%+ — you're under because of project mix, not rates.)*

### Where it's leaking — $7,344/yr we can recover now
- **3 software subscriptions ($612/mo), no logins 90+ days** → recover **$7,344/yr**.
- **Card audit:** a **duplicate $149 charge** from "ADOBE *CREATIVE" on Jun 12 and Jun 13. **Dispute by Aug 11 (60-day window).**
- "SHUTTERSTOCK" **rose $29 → $49/mo** with no plan change — verify.

### The big tax move (worth ~$8,000/yr — ask your CPA)
You're an **LLC taxed as a sole proprietor netting ~$96K/yr**. An **S-corp election** could save roughly **$7,000–$9,000/yr** in self-employment tax. Estimate, not tax advice — **raise it with your CPA before year-end.**

### Free up cash you already earned
**Collections are running 41 days (DSO).** Pulling to 30 would free ~**$5,300**. Two invoices ($11,400) cross the 40-day line now.

### Where to grow — not yet
You *could* reinvest ~$1,900–$3,150 (30–50% of profit), but **not this cycle.** Secure the reserve first: collect the late invoices and fix the project-vs-retainer mix. Once utilization is back above 75% and the late AR is in, marketing reinvestment makes sense — your retainer LTV:CAC supports it.

### ✅ What to do now (ranked)
1. **[Collect — find cash]** Call the two clients on the $11,400 in 40+ day invoices **this week** → frees ~$5,300.
2. **[Tax — find cash]** Ask your CPA about an **S-corp election** before year-end → ~$7K–$9K/yr. *(Carried — still open.)*
3. **[Cut — keep more]** Cancel the 3 dormant subscriptions + dispute the Adobe duplicate → **$7,344/yr + $149**.
4. **[Reprice — keep more]** Raise the retainer on your two oldest clients **(recommended last cycle — not done)**; retainers are your profit engine.

*📎 Based on 1,184 of 1,210 transactions categorized (97.8% coverage), reconciled to your connected accounts as of Jun 22, 2026. No figures invented — every number comes from your bank, card, and Stripe data. Generated by GoldFin Desk · model claude-opus-4-8. Standard terms available for your accountant.*

**Why it works (build annotation):** Takeoff (revenue up/profit down) · context everywhere (history/benchmark/plan) · three money-recovery moments (waste $7,344 + card audit $149 + tax $7–9K) · accountability callback · growth gated honestly · ranked bucket-labeled Decision Memo · trust stamp.

---

## 7. JOBS & TRIGGERS — CYCLE 6

| Trigger | Motivation | Outcome |
|---|---|---|
| "Sales up but somehow less money" | why revenue & profit move opposite | stop celebrating revenue, fix it |
| "Finally have profit — what do I do?" | how much to reinvest + where | deploy to grow not leak |
| "Nobody holds me accountable" | remember what I committed to | follow through |

---

## 8. CUSTOMER LEXICON — CYCLE 6
"sales up but no money / busier but broke" · "what do I do with the profit / reinvest" · "hold me accountable / follow through" · "just tell me the one thing / what matters" · "my problem was margin not overhead".

---

## 9. HYPOTHESES — CYCLE 6
- "Sales up, profit down" = strongest hero hook → A/B "Your sales are up. Is your profit?"
- Accountability callback = #1 retention driver → track recommendation take-rate vs churn.
- Owners trust the tool more for "don't reinvest yet" honesty → measure trust/NPS where growth gated.
- On-site Reference Report lifts conversion → A/B the sample on the landing page.

---

## 10. SOURCES — CYCLE 6
Deloitte + Workday + Runway (CFO storytelling, Three Ts, context beats content, 5-sec rule) · Crossroad Coach + American Receivable (sales≠health, margin-not-overhead) · SmartBrief (owners lack accountability) · Crestmont + Hiscox + Unleash Your Power (reinvestment 30–50%).

**Could NOT verify:** Reference Report numbers are illustrative; no deployed engagement data; Reddit/FB raw threads.

---

## 11. HANDOFF
- **Build next:** use the Reference Report (Section 6) as the literal build target; put a version on the marketing site.
- **Sharpen the verdict:** "Am I OK" must reconcile revenue vs profit vs cash.
- **Add memory-driven moves:** accountability callback + growth/reinvestment (gated).
- **Cycle-7 questions:** hero hook; accountability→retention; on-site sample→conversion; deployed take-rate.
- **Hands to:** `/feature` (report surface to match Section 6; sample on-site); `/cog-admin` (reinvestment + reserve-floor logic, memory follow-up fields); `/hero`+`/convert`.

*End of Cycle 6 Dossier — 2026-06-23 (restored after concurrent-tooling wipe)*
