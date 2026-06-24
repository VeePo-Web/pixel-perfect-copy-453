# GoldFin Desk — Advisory Report BUILD PACK
## Cycle 7 · 2026-06-23
### The consolidation: production Opus 4.8 prompt + master metrics list + vertical reference reports
**Compounds on Cycles 1–6.** This cycle adds little *new research* — it **consolidates six cycles into the concrete artifacts engineers build from**, and adds three vertical reference reports (restaurant, ecommerce, contractor) to sit alongside the agency report from Cycle 6. Everything here is build-ready specification. **Still research/spec only — no product code was changed.**

**Hand-off intent:** `/feature` and `/cog-admin` should be able to build the report from THIS document + the Cycle-6 Reference Report, without re-reading all six dossiers.

---

## 1. THE PRODUCTION OPUS 4.8 SYSTEM PROMPT (copy-ready spec)

> Model: `claude-opus-4-8`. Numbers are **computed deterministically and injected**; the model only interprets. Use prompt-caching on this system prompt + the report template (stable); only the per-customer metrics JSON + memory varies per call.

```
You are GoldFin Desk — a senior CFO/CPA-grade advisor writing a bi-weekly financial
advisory report for a small business owner. You write like a trusted human CFO, not a
SaaS dashboard.

ABSOLUTE GROUNDING RULES (non-negotiable):
- Use ONLY the figures provided in the METRICS payload. Never state, estimate, round to,
  or invent a number that is not in the payload.
- If a figure is missing or its coverage is below threshold, say so plainly and scope the
  claim. Never fill a gap with a guess.
- Every recommendation must cite a specific figure from the payload and end in a concrete
  action with a dollar amount and a timeframe.
- For any tax or entity opportunity: present it as an ESTIMATE to discuss with their CPA,
  never as tax advice or a filing instruction. Always say "ask your CPA before [date]".

VOICE:
- Plain English, Grade 6–8. Short sentences. Calm, serious, premium. No hype, no
  exclamation marks, no emojis in the body, never the words "AI", "magic", "leverage",
  "supercharge", "unlock potential".
- Use standard accounting terms (Income Statement, Gross Margin, AR/AP Aging, Contribution
  Margin) AND translate them in plain English, so the report is correct to the owner's CPA
  and clear to the owner.

STRUCTURE (story-first — answer before detail):
1. THE VERDICT ("Am I OK?"): open with the single most important truth, even if it
   contradicts the owner's optimism. If revenue rose but profit or cash fell, SAY THAT
   FIRST — rising sales can hide a failing business. Reconcile revenue vs profit vs cash.
2. ACCOUNTABILITY CALLBACK: if memory contains a prior recommendation, follow up on it —
   "Last cycle I recommended X; here's what happened / it's still open."
3. WHAT CHANGED: the 2–4 biggest moves since last cycle, each "from → to, because [driver]".
4. WHAT'S MAKING MONEY: contribution margin by line/channel; name the best and worst and
   the dollar opportunity in fixing the laggard. Lead with the owner's INDUSTRY metric
   (restaurant: prime cost; contractor: WIP/underbilling; retail: GMROI; agency:
   utilization; ecom: contribution margin per order).
5. MONEY RECOVERED (when present): dormant subscriptions, duplicate/gray card charges
   (+ the 60-day dispute deadline), and the tax/entity flag — each with the dollar figure.
6. FREE UP CASH: cash conversion cycle / collections (DSO) — dollars trapped and how to free.
7. WHERE TO GROW: ONLY if the cash reserve is secured AND unit economics support it,
   recommend a reinvestment budget (30–50% of profit) and the highest-ROI area. Otherwise
   say "not yet, secure the reserve first." Label growth as the least-certain money move.
8. WHAT TO DO NOW: 2–4 ranked actions. Each: a dollar impact, a deadline, and a bucket tag
   [find cash / keep more / earn new]. Carry forward any still-open prior action.

CONTEXT RULE: every number must be anchored to history (last cycle), a benchmark (the
industry figure in the payload), or the owner's plan/baseline. A number without a
comparison is not allowed.

FIVE-SECOND RULE: a reader must grasp the point of any sentence or figure in five seconds.

You will receive:
  METRICS: { ...all computed figures, with coverage_pct and benchmarks... }
  MEMORY:  { prior_metrics_summary, prior_recommendations[], outcomes[] }
  PROFILE: { business_name, industry, entity_type, reserve_floor_months }

Return the report as structured sections via the provided tool schema. Do not output any
figure absent from METRICS.
```

**Verification layer (deterministic, post-generation — outside the model):** parse every number in the output; assert each exists in the METRICS payload (within rounding tolerance); any orphan number or any Decision-Memo item without a cited figure **blocks send** and logs. This is what makes "never invented" structurally true, not just instructed.

---

## 2. THE MASTER METRICS LIST (Layer-1 deterministic computation — what engineers code)

Everything the model receives. Grouped by data source so `/cog-admin` can sequence the pipeline. All computed in code BEFORE the model runs.

### From the bank + Visa card feed (Plaid) — FULLY AUTO, ships first
| Metric | Computation |
|---|---|
| Cash on hand | Sum of connected account balances |
| Burn / build rate | Trailing 13-week avg net cash outflow |
| Cash runway (months) | Cash on hand ÷ monthly burn |
| Net cash this cycle | Inflows − outflows for the period |
| Recurring streams | Plaid `/transactions/recurring/get` → list w/ cadence, last_amount |
| Dormant subscriptions | Recurring streams with no occurrence in 90+ days → $/yr |
| Vendor cost-creep | Recurring stream last_amount > earlier occurrences |
| Duplicate charges | Same merchant + amount + within N days |
| Unfamiliar/large charges | First-seen merchant above threshold |
| Dispute deadline | Statement date + 60 days |
| Expense by category | Enriched + categorized (Layer 0) → category totals |
| Biggest expense mover | Category with largest Δ vs prior cycle, named |
| Owner-pay capacity | Profit First % applied to actual inflow |
| Coverage % | Categorized $ and count above confidence ÷ total |

### From revenue data (Stripe / template) — AUTO-WITH-SETUP
| Metric | Computation |
|---|---|
| Revenue trend | Period revenue vs prior (history) |
| Gross / net margin | Revenue − COGS / − all expense |
| Contribution margin by line/channel | Revenue line − its variable costs |
| AR aging / DSO | Days from invoice to payment; overdue buckets |
| Budget-vs-actual variance | Actual vs trailing-3-mo auto-baseline; flag large/recurring/growing |
| Tax/entity flag | Net income + entity_type → SE-tax-savings estimate range |
| Cash conversion cycle | DSO + DIO − DPO (DIO only if inventory) |
| Reinvestment budget | 30–50% of net profit, gated on reserve_floor + LTV:CAC ≥ 3:1 |

### Industry packs (the lead metric per vertical)
| Vertical | Lead metric(s) computed | Benchmark injected |
|---|---|---|
| Restaurant | Prime cost = (food+bev COGS + labor) ÷ sales; food cost % | Prime 55–65%; food 28–35%; CM 35–45% |
| Ecommerce | Contribution margin/order = shipping income − discounts − COGS − merchant fees − shipping cost − pick&pack; CAC/order; LTV:CAC by channel | LTV:CAC ≥ 3:1; CM positive per order |
| Contractor | WIP: earned (% complete × contract) vs billed → over/under-billed $; job margin vs bid | Underbilling = cash risk; clean WIP = bonding |
| Retail | Inventory turnover = COGS ÷ avg inventory; GMROI | GMROI > 1; turnover by category |
| Agency | Billable utilization; gross margin; CLV | Utilization 75%+; GM 85%+ |
| SaaS | MRR, churn, net revenue retention, runway | LTV:CAC ≥ 3:1 |

---

## 3. VERTICAL REFERENCE REPORTS (build targets — 3 new, joining the C6 agency report)

*Illustrative of structure, not real businesses. Each leads with its industry's make-or-break metric and breaks the "sales = health" illusion in its own way.*

### 3A — RESTAURANT · "Harbor & Vine" (full-service · S-corp · ~$92K/mo sales)

**📧 Subject:** `Harbor & Vine: prime cost hit 68% — above the danger line`

**Am I OK? — Act now on cost, not sales.**
Sales were strong at $92,400 (up 6%), but **your prime cost hit 68% — past the 65% line where full-service restaurants stop making money.** Busy month, thinner plate. Cash runway is 2.9 months; this is the cycle to fix cost, not chase covers.

**What changed**
- **Food cost rose to 34%** (was 30%) — within the 28–35% range but climbing; one supplier ("US FOODS") is up 11% on the same order pattern.
- **Labor hit 34% of sales** — overtime in weeks 2–3. Food + labor = your 68% prime cost.

**Money recovered now — $4,560/yr + $612 back**
- **2 unused SaaS tools ($380/mo)** — a reservation add-on and a former POS module, no activity 90+ days → **$4,560/yr**.
- **Card audit:** a **$612 duplicate** from "SYSCO" on Jun 9 and Jun 10 — dispute by **Aug 8**.

**What to do now**
1. **[Keep more]** Re-bid the US FOODS lines up 11% or shift volume → prime cost back under 65% (~$2,700/mo). 
2. **[Keep more]** Trim the week-2/3 overtime with one schedule change → labor toward 30%.
3. **[Find cash]** Cancel the 2 dormant tools + dispute the Sysco duplicate → **$5,172**.

*📎 96% of transactions categorized · reconciled Jun 22 · no figures invented · model claude-opus-4-8.*

---

### 3B — ECOMMERCE · "Trailhead Goods" (DTC · LLC sole prop · ~$140K/mo rev)

**📧 Subject:** `Trailhead Goods: you're losing money on Meta orders`

**Am I OK? — Your blended numbers are hiding a loser.**
Revenue looked great at $141,000, but **your blended ROAS is masking that Meta orders lose money after all costs.** On a per-order basis your contribution margin is positive on Google and email — **negative on Meta paid.** You're scaling the channel that costs you.

**What's actually making money — per order, fully loaded**
- Contribution margin/order = shipping income − discounts − COGS − merchant fees − shipping − pick&pack.
- **Google: +$18/order. Email: +$24/order. Meta paid: −$6/order** after a $41 CAC.
- **LTV:CAC — Google 3.4:1, Email 6:1, Meta 1.8:1** (below the 3:1 floor).

**Money recovered now — $3,360/yr**
- 4 app subscriptions ($280/mo) with no use 90+ days → **$3,360/yr**.

**Where to grow — yes, but redirect**
You have the margin and reserve to reinvest ~$8,400 (30–50% of profit). **Move it out of Meta into Google + email**, where LTV:CAC clears 3:1. Don't add spend to a channel losing $6/order.

**What to do now**
1. **[Earn new]** Shift the Meta budget to Google/email until Meta CAC drops below $30 → stops the per-order loss.
2. **[Keep more]** Renegotiate pick&pack — it's $1.40 over benchmark per order.
3. **[Find cash]** Cancel 4 dormant apps → **$3,360/yr**.

*📎 98% categorized · Stripe + bank reconciled Jun 22 · no figures invented · model claude-opus-4-8.*

---

### 3C — CONTRACTOR · "Granite Ridge Builders" (S-corp · ~$210K/mo rev)

**📧 Subject:** `Granite Ridge: you're underbilled $138K — that's why cash is tight`

**Am I OK? — Profitable on paper, starving for cash.**
You're profitable, but **cash is tight because you're underbilled $138,000 across active jobs** — you've paid for labor and materials you haven't billed for yet. Underbilling is the #1 reason profitable builders run out of cash. This is a billing problem, not a profit problem.

**WIP — where the cash is trapped**
- **Job "Cedar Lofts": 60% complete on $500K, billed only $200K → underbilled $100K.** Bill the next draw now.
- Two smaller jobs underbilled a combined $38K.
- **Job margins holding** vs bid except "Maple St" — actual labor is 9% over estimate; check the crew hours.

**Money recovered now — $5,880/yr + $740 back**
- Equipment-tracking + 2 software subs unused 90+ days ($490/mo) → **$5,880/yr**.
- Card audit: **$740 duplicate** from "HOME DEPOT PRO" Jun 14/15 — dispute by **Aug 13**.

**What to do now**
1. **[Find cash]** Submit the Cedar Lofts draw + the two underbilled jobs → recover **$138K** in owed cash.
2. **[Keep more]** Review Maple St labor — 9% over bid is eroding the job's margin.
3. **[Find cash]** Cancel dormant tools + dispute the Home Depot duplicate → **$6,620**.

*📎 95% categorized · job costs via template · reconciled Jun 22 · no figures invented · model claude-opus-4-8.*

---

## 4. BUILD SEQUENCE & ACCEPTANCE CRITERIA (for /feature + /cog-admin)

**Build order (trust-first, from C5):**
1. **Layer 0 — Enrichment/categorization + coverage stamp** (Plaid Enrich + rules + ML + confidence). *Prerequisite.*
2. **Bank-feed-only FULLY AUTO** features + the 3 money-recovery moments (waste, card audit, tax flag).
3. **Opus 4.8 generation pipeline** (Section 1 prompt) + the deterministic verification layer.
4. **Memory** (metrics snapshot + recommendations + outcomes; accountability callback).
5. **Industry packs** (capture vertical + entity at onboarding) + benchmarks.
6. **Template intake** → per-line contribution margin, pricing, breakeven, WIP.
7. **Growth/reinvestment** block (gated) + **quarterly Strategy Deep-Dive** (Pro tier).

**Acceptance criteria (definition of done for the report engine):**
- [ ] Every number in any generated report traces to the METRICS payload (verification layer passes; zero orphan numbers).
- [ ] No report asserts a figure whose source transactions are below the confidence threshold without flagging coverage.
- [ ] The verdict reconciles revenue vs profit vs cash (breaks "sales = health").
- [ ] Tax/entity content always routes to "ask your CPA," never gives filing advice.
- [ ] Card-audit duplicates always include the 60-day dispute deadline.
- [ ] Growth is recommended only when reserve_floor is met AND LTV:CAC ≥ 3:1.
- [ ] Every Decision-Memo item has a dollar, a deadline, and a bucket tag.
- [ ] Memory callback fires when a prior recommendation exists.
- [ ] Footer shows coverage % + reconciliation date + "no figures invented" + CPA-export note.
- [ ] Reading level Grade 6–8; no banned words; standard accounting terms translated.
- [ ] The grounded report pipeline is SEPARATE from the marketing demo (`generate-briefing` Gemini), which may keep inventing demo numbers.

---

## 5. SOURCES — CYCLE 7

| Source | URL | Contributed |
|---|---|---|
| SpotOn — Read a Restaurant P&L | https://www.spoton.com/blog/how-to-read-a-restaurant-pnl/ | Restaurant P&L line items |
| RestaurantOwner — Why Prime Cost Matters | https://www.restaurantowner.com/public/Why-Prime-Cost-Is-the-Most-Important-Number-That-Should-Be-on-Your-PL.cfm | Prime cost = COGS+labor; the key number |
| getmeez — Food Cost vs Contribution Margin | https://www.getmeez.com/blog/food-cost-percentage-vs-contribution-margin | Food 28–35%; CM 35–45%; prime 55–65% |
| Saras Analytics — Ecommerce Contribution Margin | https://www.sarasanalytics.com/blog/ecommerce-contribution-margin | CM/order = shipping inc − disc − COGS − fees − shipping − pick&pack |
| ShipBob — Cost Per Order | https://www.shipbob.com/blog/calculating-cost-per-order/ | Cost-per-order formula (CAC+packaging+fulfillment+shipping+COGS+storage)/orders |
| Edgestrat Finance — WIP Schedule Example | https://www.edgestratfinance.com/contractor-resources/wip-schedule-example-for-contractors-step-by-step-guide | "Why your cash doesn't match your profit"; underbilling example |
| Steph's Books — WIP Accounting | https://stephsbooks.com/blog/construction-wip-accounting | Over/underbilling; underbilling = #1 cash killer |
| ChainLink CFO — WIP Guide | https://www.wip-insights.com/learn/guides/complete-wip-guide | 60% complete/$500K billed $200K = underbilled $100K; bonding |

---

## 6. HANDOFF

- **This Build Pack + the Cycle-6 Reference Report are the complete spec to build the report engine.** No further research is required to start.
- **Start with Layer 0 (enrichment) → bank-feed FULLY-AUTO features + the 3 money-recovery moments → the Opus 4.8 pipeline with the verification layer.**
- **Hands off to:** `/cog-admin` (Section 2 metrics layer, Plaid Enrich pipeline, verification layer, memory, onboarding vertical/entity capture) and `/feature` (report surface to match Sections 3 + C6, the 4 vertical layouts, coverage stamp, growth block, accountability callback; put a Reference Report on the marketing site).
- **Research program status: 7 cycles complete and comprehensive.** Future cycles should be triggered by **deployed-report data** (categorization coverage achieved, recovered-$ per owner, recommendation take-rate, churn vs coverage) — i.e., resume research once there are real reports to learn from, not before.

*End of Cycle 7 Build Pack — 2026-06-23*
