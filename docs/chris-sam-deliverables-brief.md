# Chris Sam — GoldFin Desk Deliverables Brief

**To:** Chris Sam, VP Finance (LA)
**From:** GoldFin Desk
**Purpose:** One doc you can open on your time off and start building from. Every sheet doubles as a sales asset because it's engineered against a specific offer-psychology framework (Hormozi + Brunson) before a single formula is written.

---

## Part 1 — The Prompt to Run Before You Build Each Sheet

Paste this into your AI of choice (or use it as a mental checklist) before you build any of the 7 sheets. It forces every deliverable to earn the next rung of the ladder.

> **Role:** You are a world-class direct-response offer strategist trained on Alex Hormozi's *$100M Offers / $100M Leads* and Russell Brunson's *DotCom Secrets / Expert Secrets / Traffic Secrets*. You are also a fractional CFO who talks like an owner, not an accountant.
>
> **Context:** The product is **GoldFin Desk** — a plain-English financial briefing service for owner-led SMBs doing **$250k–$5M** in revenue (trades, agencies, clinics, e-com, professional services). Data comes in via **Plaid** (bank + card feeds), not QuickBooks exports. The value ladder is:
>   1. **Free Vault** — downloadable spreadsheets. Purpose: prove competence, create the epiphany, capture email.
>   2. **$99/mo Auto-Filled Reports** — the same sheets, but Plaid-populated on a bi-weekly cadence. Purpose: continuity.
>   3. **$1,500/mo Advisory Desk** — human-in-the-loop modeling and a monthly owner call. Purpose: backend.
>
> **Your task:** For the sheet named `<SHEET>`, return the following in this exact structure:
>
> **A. Grand Slam Offer lens (Hormozi Value Equation)**
> - Dream Outcome (in the owner's literal words, not CFO words)
> - Perceived Likelihood of Achievement (what specifically in the sheet makes the number believable — cite the input)
> - Time Delay (how many minutes until the owner sees the one number that matters)
> - Effort & Sacrifice (what we removed vs. the status quo of "ask my bookkeeper")
> - Value score, before vs. after this sheet exists
> - Bonus stack (what naturally bolts onto this sheet at each ladder rung)
> - Guarantee this sheet earns us the right to make
>
> **B. Hook / Story / Offer lens (Brunson)**
> - Hook — one-line curiosity headline that lives on the sheet's cover tab
> - Story — 60-second narrative the owner tells themselves as they scroll
> - Offer — the exact CTA the sheet earns (upgrade, book call, etc.)
> - Ladder rung — Free Vault / $99 / $1,500
> - Epiphany — the false belief this sheet breaks (e.g. "profit = the number my accountant tells me in April")
>
> **C. Owner-Language Filter**
> - Every label, tab name, and callout must pass: *"Would a plumber, dentist, or agency owner say this out loud to their spouse?"*
> - CFO jargon (EBITDA, DSO, working capital) is only allowed if it's translated in parentheses on the same line.
>
> **D. Build spec**
> - Inputs (Plaid-derived vs. owner-entered — mark each)
> - Outputs (tabs, in order)
> - **The One Number** — the single figure on the cover tab in 48pt
> - Formulas that matter (name + plain-English definition)
> - Upgrade trigger — the condition inside the sheet that surfaces the next-rung CTA
> - Build complexity: **S** (half day), **M** (1–2 days), **L** (3–5 days)
>
> **Verification gate:** Every filled cell must trace to either a Plaid-derivable input or an owner-entered input. No fabricated benchmarks, no "industry average" numbers we can't source. If a cell needs an assumption, expose it as an editable yellow input, never a hardcoded constant.

Run that prompt seven times — once per sheet below — and you'll have a build spec plus a sales narrative for each in the same pass.

---

## Part 2 — The 7 Deliverables

Ordered by ladder rung so the set doubles as a funnel. Free Vault sheets are designed to be shareable and to surface a specific "oh shit" moment that makes the $99 subscription feel inevitable. The $99 sheets are designed to make the $1,500 Advisory feel like the only sane next step. The Advisory sheet is designed to be the artifact of the monthly call.

---

### FREE VAULT — Lead magnets (prove competence, create the epiphany)

#### 1. Owner's Cash Clarity Sheet   `S`

- **Owner one-liner:** *"How many Fridays of payroll do you actually have in the bank?"*
- **Inputs:**
  - Owner-entered: starting cash, weekly payroll $, expected inflows next 14 days, must-pay outflows next 14 days
  - Plaid-derived (in $99 version): all of the above, auto-filled
- **Outputs (tabs):** Cover · 14-Day Cash Map · Runway
- **The One Number:** **Fridays of runway** (integer, on the cover)
- **Hook:** *"How many Fridays of payroll do you actually have?"*
- **Epiphany it breaks:** "My bank balance = my cash position." (It doesn't — pending payroll, tax, and card autopay are invisible.)
- **Ladder rung:** Free Vault
- **Upgrade trigger:** Cover tab CTA — *"Want this filled in automatically every other Monday? → $99/mo"*
- **Guarantee it earns:** *"If your first briefing doesn't surface at least one number that changes what you do this week, it's free."*

#### 2. Profit First Split Calculator   `S`

- **Owner one-liner:** *"Pay yourself first — on paper, in 60 seconds."*
- **Inputs:**
  - Owner-entered: last month's real revenue (deposits, not invoiced), current % splits, target % splits
- **Outputs (tabs):** Cover · Current Splits · Target Splits · Gap
- **The One Number:** **Owner Pay this month** (in dollars, on the cover)
- **Hook:** *"The paycheck you should have written yourself last month."*
- **Epiphany it breaks:** "I'll pay myself whatever is left over." (Nothing is ever left over.)
- **Ladder rung:** Free Vault
- **Upgrade trigger:** *"Auto-fill your real revenue from your bank — never guess again → $99/mo"*

#### 3. Subscription & Waste Audit   `S`

- **Owner one-liner:** *"The money you're bleeding on tools you forgot you signed up for."*
- **Inputs:**
  - Owner-entered: paste last 90 days of card charges (CSV), or owner marks recurring vs. one-off
  - $99 version: Plaid auto-detects recurring merchants and price creep
- **Outputs (tabs):** Cover · Recurring · Creep (price ↑ vs. 6 mo ago) · Cancel List
- **The One Number:** **Annual waste, $** (annualized recurring the owner flags as "kill" or "unsure")
- **Hook:** *"The $X you're paying every year for software you forgot about."*
- **Epiphany it breaks:** "My software spend is fine, it's just $20 here and there." (It's usually 4–6% of OpEx.)
- **Ladder rung:** Free Vault
- **Upgrade trigger:** *"We'll flag every new recurring charge before it renews → $99/mo"*

---

### $99 REPORTS — Continuity (the "auto-filled" promise)

These three sheets are what actually get emailed every 2 weeks. Each one is a tab in one master workbook, but Chris should build them as standalone sheets first so each has its own cover, its own One Number, and can be sent standalone as a "sample briefing" during sales conversations.

#### 4. Bi-Weekly Owner Briefing Workbook   `L`

- **Owner one-liner:** *"Your 2-week gut check, in the same 5 tabs, every time."*
- **Inputs:**
  - 100% Plaid-derived: transactions, balances, merchant categories, recurring detection
  - Owner-entered once at onboarding: payroll cadence, tax rate, top-5 client names for tagging
- **Outputs (tabs):**
  1. **Summary** — 5 bullet callouts, plain English (e.g. "Cash is down $X since last briefing. Biggest driver: Q3 tax payment.")
  2. **Cash** — starting → in → out → ending, with the 3 biggest ins and outs
  3. **Revenue & Concentration** — deposits this period, by client tag
  4. **OpEx** — top 10 outflows, sorted; flags anything > 20% vs. prior period
  5. **Watchlist** — anomalies, late-paying clients, new recurring charges
- **The One Number:** **Net cash this period, $** (on Summary tab, 48pt)
- **Hook:** *"Five tabs. Ten minutes. No accountant required."*
- **Epiphany it breaks:** "I need a full P&L to know how the business is doing." (No — you need 5 numbers, every 2 weeks.)
- **Ladder rung:** $99/mo
- **Upgrade trigger:** If Watchlist surfaces the same anomaly in 2 consecutive briefings, Summary tab auto-inserts: *"This is the second time we've flagged this. Want a human to model it? → Book Advisory Desk."*
- **Guarantee:** *"Delivered every other Monday by 9am your time, or that briefing is free."*

#### 5. Client / Revenue Concentration Tracker   `M`

- **Owner one-liner:** *"How exposed are you to losing one client?"*
- **Inputs:**
  - Plaid-derived: deposits tagged by client (via merchant name + owner-defined rules at onboarding)
  - Owner-entered: top-5 client aliases
- **Outputs (tabs):** Cover · Top 3 · All Clients · 6-Month Trend
- **The One Number:** **Top-3 client share, %** (on cover)
- **Hook:** *"If your biggest client fires you tomorrow, how much of your revenue walks out the door?"*
- **Epiphany it breaks:** "I have lots of clients, I'm diversified." (Most owners are 60%+ concentrated in 3 accounts and don't know it.)
- **Ladder rung:** $99/mo
- **Threshold alert:** Cover flips red at Top-3 > 40%. Copy: *"This is a concentration risk, not a client list. Book the Advisory Desk to build a de-risk plan."*

#### 6. Tax Reserve Ledger   `M`

- **Owner one-liner:** *"Are you actually setting aside enough for taxes — or writing a scary check in April?"*
- **Inputs:**
  - Plaid-derived: revenue deposits this period, transfers to a designated tax-reserve account
  - Owner-entered: effective tax rate, target reserve %
- **Outputs (tabs):** Cover · Reserve vs. Target · Deposits by Period · Suggested Transfer
- **The One Number:** **Under/over-reserved, $** (green if over, red if under)
- **Hook:** *"The April surprise, cancelled."*
- **Epiphany it breaks:** "My accountant handles taxes." (They calculate them — they don't reserve for them.)
- **Ladder rung:** $99/mo
- **Upgrade trigger:** If under-reserved for 2 consecutive briefings, cover surfaces: *"Book Advisory to build a catch-up plan that doesn't break payroll."*

---

### $1,500 ADVISORY — Backend (modeling, not tracking)

#### 7. Pricing & Margin Simulator   `L`

- **Owner one-liner:** *"What a 7% price increase actually does to your take-home."*
- **Inputs (all owner-entered on the call):**
  - Service or product line name
  - Unit cost (materials + direct labor)
  - Current price
  - Current monthly volume
  - Proposed new price (single input, everything else recalcs)
- **Outputs (tabs):** Cover · Current State · Proposed · Sensitivity (price × volume grid) · Break-even
- **The One Number:** **Monthly profit delta at new price, $** (on cover)
- **Hook:** *"7% up in price ≠ 7% up in profit. It's usually 30–50% up in profit. Here's why."*
- **Epiphany it breaks:** "If I raise prices, I'll lose customers." (The sensitivity grid shows how many you can afford to lose and still come out ahead.)
- **Ladder rung:** $1,500/mo Advisory (delivered as the artifact of the monthly modeling call)
- **Advisory value proof:** The sheet is co-built live on Zoom, so the owner *watches* their profit change as we change assumptions. That's the moment they become a lifer.

---

## Part 3 — WhatsApp / Email Reply to Chris

Paste-ready. Keep it in one block so he can scroll it on his phone.

```
Chris — thanks again for jumping on this while you're off. Here's the 7-sheet
build list, in ladder order. Each sheet has one number on the cover in 48pt —
that's the whole design philosophy.

FREE VAULT (lead magnets)
1. Owner's Cash Clarity Sheet    → Fridays of runway
2. Profit First Split Calculator → Owner Pay this month, $
3. Subscription & Waste Audit    → Annual waste, $

$99/MO AUTO-FILLED REPORTS (bi-weekly, Plaid-fed)
4. Bi-Weekly Owner Briefing (5 tabs)   → Net cash this period, $
5. Client Concentration Tracker        → Top-3 client share, %
6. Tax Reserve Ledger                  → Under/over-reserved, $

$1,500/MO ADVISORY (built live on the monthly call)
7. Pricing & Margin Simulator          → Monthly profit delta, $

Full brief with the offer-psychology spec for each is in the shared doc —
Hormozi Value Equation + Brunson hook/story/offer applied per sheet, plus
inputs, outputs, upgrade triggers, and build size (S/M/L).

Call tomorrow evening — want to walk 1, 4, and 7 first since those are the
anchor sheets of each rung. If those three are right, the other four fall
out of them.
```

---

## Notes for Chris on execution style

- **Every cover tab is identical structure:** sheet name, one-line owner hook, the One Number in 48pt, a "what this means for you this week" sentence, then the CTA to the next rung. Same layout across all 7 = brand.
- **Yellow = owner input, white = formula, gray = Plaid-derived.** No exceptions. Owners learn the color code in one sheet and know how to use every other sheet.
- **No charts on cover tabs.** Charts on the inside tabs only. Cover is the number, in 48pt, in black on white. The whole product is a promise that we removed the dashboard theater.
- **Every sheet ships with a 90-second Loom** where you (Chris) explain the One Number. That Loom is the actual lead magnet — the sheet is the artifact. This is the Brunson move: story wraps the offer.
