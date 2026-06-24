# 14 — Plaid Competitor & Pattern Research (Ramp · Digits · Puzzle · Plaid)
## What the best bank-data → AI-report products actually do, and what it means for GoldFin Desk

> **Method:** primary-source research (June 2026) on the products that already turn linked bank data into automated categorization, spreadsheets, and reports. Every finding is sourced. The goal is decision-ready: what to copy, what to avoid, and the exact deltas to the existing `docs/plaid-build-plan.md`.
> **Engine under test:** `src/lib/finance/` (deterministic metrics + verification gate) · **Persona:** `personas/plaid-architect.md`

---

## THE ONE FINDING THAT MATTERS MOST

**Digits — the most direct competitor — independently validates GoldFin's core architecture.** Digits' CEO Jeff Seibert, on how they keep AI accurate enough to trust with money:

> "LLMs are generative. They hallucinate. Predictive models don't, they can't." … "we use LLMs to orchestrate our agents. The agents have access to tools which are all predictive." … *The LLMs are not doing the calculations themselves, and in fact are specifically prevented from doing so.*

Digits runs **18 production models, almost all custom-trained predictive models**; the LLM is reserved for orchestration and communication. In a test against CPAs from 12 outsourcing firms they claim **98% accuracy vs 80% for humans**, at **40ms/transaction vs 34s** — *with the honest caveat that the test set had "relatively fewer edge cases" than real data.*

**This is exactly GoldFin's doctrine**, already shipped in `src/lib/finance/`:
- `metrics.ts` (code) computes every number → the "predictive/deterministic" layer.
- Opus only narrates the injected facts (`report.ts → buildReportFacts`).
- `verifyNarrative()` blocks any number the model states that doesn't trace back to a metric.

We do not need to take this on faith or "hope the prompt holds." The market leader is telling us, in public, that **separating the math from the language is the whole game.** Our verification gate goes one step further than Digits describes: we *mechanically check the generated prose* before delivery. That is our defensible edge to lean into, not soften.

**Sources:** [Accounting Today — Digits AI agents](https://www.accountingtoday.com/news/digits-says-its-new-ai-agents-can-automate-95-of-bookkeeping-tasks) · [Beancount — Digits trust analysis](https://beancount.io/blog/2025/08/05/digits-ai-accountant-balancing-brilliant-dashboards-with-the-need-for-human-trust)

---

## COMPETITOR TEARDOWN

### Ramp — the categorization + learning-loop benchmark
- AI predicts the GL code from transaction memo, receipt, user, location; suggestions appear in a dropdown; **the system learns from every accepted/corrected coding** and improves. Accounting *rules* automate the repeat cases.
- Bank-feed reconciliation auto-matches imported transactions to synced records on **date, amount, and transaction type** — the same signal we use for internal-transfer pair detection.
- **Takeaway for GoldFin:** Ramp's moat is the correction-learning loop (Phase 2 of our plan). Our wedge vs Ramp: Ramp is a *card/spend* platform for funded companies; GoldFin reads *any* connected bank via Plaid and produces an owner-readable report — no card issuance, no ERP required.
- **Sources:** [Ramp — Accounting overview](https://support.ramp.com/hc/en-us/articles/4434982407443-Overview-of-Ramp-Accounting) · [Ramp — Accounting rules & automation](https://support.ramp.com/hc/en-us/articles/7317831293203-Accounting-rules-and-automation) · [Ramp — AI coding & review](https://support.ramp.com/hc/en-us/articles/44042877702291-AI-Coding-and-Review-of-Accounting-Fields)

### Digits — the AI-report + accuracy benchmark (see above)
- A **vector-graph model links every vendor, invoice, and account** so the AI reasons about financial *flows*, not text strings. Worth noting as a Phase 3+ idea (entity graph for better categorization context), but heavy.
- Exceptions the AI is unsure about go to **an inbox** for human confirmation — identical to our `reviewQueue`. Human final approval before close is standard.
- **Takeaway:** beautiful dashboards + an exception inbox + "we prevent the LLM from doing math" is the winning shape. We already have all three in design.

### Puzzle — AI accounting for startups
- Positions as AI-first GL/bookkeeping for startups & firms; competes with Digits on automation depth. Confirms the category is real and venture-backed, but aimed at startups with accountants. **GoldFin's lane is the owner who has no accountant and just wants "am I okay?"** — a different, underserved buyer (matches `personas/ideal-customer.md`).
- **Sources:** [Puzzle vs Digits](https://puzzle.io/blog/puzzle-vs-digits) · [Puzzle — AI accounting for startups](https://puzzle.io/blog/ai-accounting-software-startups)

### QuickBooks / Xero (incumbents)
- Built-in AI auto-codes **80–95% of transactions**; learns from corrections; surfaces partial/combined matches. Guidance to users: *connect all accounts* (completeness) and *confirm categories weekly* (don't let errors compound).
- **Takeaway:** ~85–95% auto-categorization is table stakes. **The differentiator is the ambiguous 5–20% tail** — how fast and pleasant the one-tap review is, and whether a correction *sticks* forever. That is precisely our Phase 2 "trust loop." Also: "expenses up 40% is a flag, not a verdict" — our report must *flag and ask*, never assert causation it can't ground.
- **Sources:** [QuickBooks — AI suggestions for categorization](https://quickbooks.intuit.com/learn-support/en-us/help-article/bank-transactions/ai-suggestions-help-match-categorize-bank/L8FHOh4AD_US_en_US) · [business.com — AI agents for financial reporting](https://www.business.com/articles/ai-agents-financial-reporting/)

---

## PLAID PRODUCT FINDINGS (apply directly)

### Categorization — adopt PFCv2 (released Dec 2025)
- Personal Finance Category **v2**: 16 primary / 104 detailed categories, **+10% primary and +20% detailed accuracy** over v1. Opt in by setting `personal_finance_category_version: v2` on `/transactions/sync`, `/transactions/get`, `/transactions/enrich`, `/transactions/recurring/get`.
- **Action:** our `categoryTaxonomy.ts` maps PFC primaries — make sure the sync edge fn requests **v2** so the first pass is as accurate as possible (fewer rows fall to the AI tail = lower cost + faster trust).
- **Sources:** [Plaid — biggest categorization update](https://plaid.com/blog/transactions-categorization-taxonomy/) · [Plaid — AI-enhanced categories](https://plaid.com/blog/ai-enhanced-transaction-categorization/) · [Plaid — PFC migration](https://plaid.com/docs/transactions/pfc-migration/)

### Sync + webhooks — correctness rules
- **You must call `/transactions/sync` at least once before `SYNC_UPDATES_AVAILABLE` will ever fire** for an Item. (Our Phase 0 must kick an initial sync right after token exchange — the plan already does this; keep it.)
- Persist the **cursor**; pass it to only get changes since last sync. Handle **duplicates, retries, and out-of-order delivery** — they *will* happen. Branch on `error_type`/`error_code`, not just HTTP status.
- **Sources:** [Plaid — Transactions webhooks](https://plaid.com/docs/transactions/webhooks/) · [Plaid — Add Transactions to your app](https://plaid.com/docs/transactions/add-to-app/) · [Fintegration — webhooks done wrong](https://www.fintegrationfs.com/post/plaid-webhooks-implementation-why-most-teams-get-it-wrong-and-how-to-fix-it)

### Cost control — Transactions is a per-Item monthly subscription
- Transactions bills a **monthly subscription per live Item** (not per call for sync). **Delete unused Items** (`/item/remove`) to stop charges; use **update-mode** for re-auth so you never create a duplicate billable Item; prefer **webhook-driven sync over `/transactions/refresh`** (refresh is the one metered call). Unofficial figures cited around $0.30–$0.60/call for non-subscription usage; **Plaid publishes no list price — get a sales quote** before unit-economics modeling.
- **Action:** our cross-cutting cost rules already say this; the new precision is "delete dead Items on cancel/inactivity" — add to the churn/offboard path.
- **Sources:** [Plaid — billing docs](https://plaid.com/docs/account/billing/) · [Plaid — pricing](https://plaid.com/pricing/) · [Plaid help — pricing models](https://support.plaid.com/hc/en-us/articles/16194632655895-How-much-does-Plaid-cost-and-what-are-the-pricing-models)

---

## PLAID LINK CONVERSION — THE FRICTIONLESS CONNECT (ordered tactics, sourced)

The connect screen is where the $99/mo is won or lost. Average onboarding drop-off runs **20–88%**; the fix is "trust + UX + timing," not just code. Concrete, primary-sourced levers, in build priority:

1. **Pre-initialize Link** on view load (`create()` web / `PlaidLinkSession` iOS / `PlaidHandler` Android) → lower latency, higher conversion.
2. **Pre-Link explainer above the ask** — why Plaid, the benefit ("your report, instantly"), security ("bank-level, read-only, unlink anytime"). "Conversion is highest when users have the right expectations going in."
3. **Brand the consent pane** — upload the GoldFin logo, match colors → measurable lift.
4. **Pass `user.phone_number`** in `/link/token/create` → unlocks the **Returning User Experience with no data entry**.
5. **Request the minimum product set** (`transactions` only at first) → "increases conversion *and* reduces cost."
6. **Embedded institution search** in our own UI → "increases the percentage of customers who choose Plaid over an alternative flow."
7. **Mobile OAuth / app-to-app** (Chase, Chime) → "very large" conversion gains for eligible users; a mobile-web **OAuth pop-up flow showed ~11% relative lift**.
8. **Personalized institution list** → ~**1–2%** relative lift.
9. **Update Mode for re-auth** — never tell a user to "start over"; repair the Item in place (also avoids a duplicate billable Item).
10. **Link Recovery (beta)** + small-bank fallbacks (micro-deposit / Database Auth) → recapture outage/abandon drop-offs. Even **tiny UI tweaks drove ~5% in Plaid's own Layer.**

**Action:** fold this ordered checklist into `docs/plaid-connect-flow-ux.md` as the implementation spec for Phase 1a.
**Sources:** [Plaid — Optimizing Link conversion](https://plaid.com/docs/link/best-practices/) · [Plaid — 4 ways to improve Link conversion](https://plaid.com/blog/4-ways-to-improve-link-conversion/) · [Plaid — Layer UI conversion gains](https://plaid.com/blog/layer-ui-updates-conversion-gains/) · [Fintegration — Link best practices](https://medium.com/@FintegrationFS/plaid-link-best-practices-ux-conversion-tips-that-reduce-drop-off-in-bank-linking-c3b5fddf8930)

---

## DELTAS TO THE BUILD PLAN (decision-ready)

| # | Change | Where | Why |
|---|---|---|---|
| 1 | Request **PFCv2** (`personal_finance_category_version: v2`) on every sync/enrich call | Phase 0 `plaid-sync`; cross-cutting | +10%/+20% categorization accuracy → smaller AI tail, lower cost |
| 2 | Adopt the **ordered Link-conversion checklist** above as the 1a spec | Phase 1a / `plaid-connect-flow-ux.md` | The connect screen is the conversion choke point (20–88% drop-off) |
| 3 | **Delete dead Items** on cancel/inactivity; never `/transactions/refresh` for routine sync | Cross-cutting cost + offboard path | Transactions is a per-Item monthly subscription |
| 4 | Lean **harder** into the verification gate as the public trust story | Marketing + `report.ts` | Digits validates "LLM never does math"; our *mechanical* number-check is a step beyond — make it a selling point |
| 5 | Position vs competitors: **"the report for the owner with no accountant"** | `personas/ideal-customer.md` alignment | Ramp = funded-co cards; Puzzle/Digits = startups w/ accountants; QBO = DIY ledger. Our lane is the un-served owner who just needs "am I okay?" |
| 6 | Frame anomalies as **"a flag, not a verdict"** — ask, don't assert causation | Phase 1c report prompt | Industry guidance + avoids ungroundable claims the gate would (rightly) block |

None of these change the architecture — they sharpen it. The core (deterministic metrics + verification gate) is already correct and now externally validated.

---

## BOTTOM LINE

The category is real, venture-funded, and converging on one pattern: **deterministic models do the math, the LLM communicates, an exception inbox handles the ambiguous tail, and the connect step is engineered for trust.** GoldFin Desk already ships the hardest, most-defensible part of that pattern (the metrics engine + a mechanical verification gate competitors only describe aspirationally). The work ahead is execution: Plaid wiring on PFCv2 (Phase 0), the conversion-tuned connect flow (Phase 1a), the grounded `.xlsx`/Opus report (Phase 1c), and the one-tap learning review loop that is the real wedge (Phase 2).
