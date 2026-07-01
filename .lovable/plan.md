
Three coordinated changes across Stripe, code, copy, and docs. Every step is auditable so nothing slips through as `$99` or `$1,500` after we ship.

---

## 1. Reprice: $99/mo → $150/mo (one number, everywhere)

### 1a. Stripe (source of truth)

- Current live SKU: `auto_fill_monthly` at $99/mo (`supabase/functions/_shared/stripe-catalog.ts`).
- Stripe **prices are immutable**. We cannot edit `$99` → `$150`. We create a new price on the same product.
- Action: use `payments--create_price` to add a new price on the existing `auto_fill_monthly` product.
  - `id`: `auto_fill_monthly_v2` (or keep the same `id` if the platform allows retiring the old one; if not, `_v2` and update the catalog constant to point to the new id).
  - `amount`: `15000`
  - `currency`: `usd`
  - `recurring_interval`: `month`
  - `quantity_min: 1, quantity_max: 1`
- Update `supabase/functions/_shared/stripe-catalog.ts` so `"auto-fill-monthly"` maps to the new price id. Existing subscribers keep the $99 price they signed up on (Stripe never re-prices active subs on its own). New checkouts flow to $150.
- Delete `"finance-desk-monthly"` and `"clarity-report"` catalog entries (see §2).

### 1b. Frontend price display audit

Grep-driven, zero-tolerance sweep. Every one of these gets `$99` → `$150` and any "per month" / "monthly" wording preserved:

- `src/components/pricing/**` — all parts (Hero, PricingCard, ValueStack, PlanSelector, RecommendedPlanSpotlight, AutoFillSpotlight, WhyAutoFill, WhyItMakesSense, PricingFAQ, PricingFinalCTA, PricingTrustBlock, MobileStickyCTA, PlanFitSection, content.ts)
- `src/components/home/**` — HomeHero, EpiphanyBridge, FounderTrustStrip, HomeMobileStickyCTA, HomeSchema (JSON-LD `Offer.price`), ClosingBaitCTA, VaultPreview
- `src/components/hero/FinanceHero.tsx`
- `src/components/how-it-works/**` (content.ts + parts)
- `src/components/compare/**` (content.ts + parts)
- `src/components/sample-briefing/**`
- `src/components/security-faq/**`
- `src/components/templates/content.ts`
- `src/components/nav/GlobalTopBar.tsx`
- `src/components/footer/GoldFinFooter.tsx`
- `src/components/apply/content.ts`
- `src/components/portal/ActivationChecklist.tsx`
- `src/components/report/AdvisoryReportView.tsx`, `ReportBlocks.tsx`
- `src/brand.ts`
- `index.html` (title, meta description, OG description if they cite price)
- Email templates: `docs/email-sequence.md` copy + any `send-*` edge function template strings

### 1c. Value math re-anchoring

Anywhere the current pricing pages say "$99 vs $1,500 fractional CFO", rewrite to "$150 vs $1,500+ fractional CFO / $300–$500 bookkeeper". Do NOT keep the old anchor unchanged with the new price — the framing needs to still justify $150.

- `PricingCard`, `ValueStack`, `WhyAutoFill`, `WhyItMakesSense`, `AutoFillSpotlight`, `PricingFinalCTA` all get their "you'd pay X for a CFO" line audited so the delta still lands.

### 1d. JSON-LD / SEO

- `HomeSchema.tsx` `Offer.price = "150"`.
- `index.html` meta description if it mentions price.
- `public/llms.txt` if it mentions price.
- `public/sitemap.xml` — no change needed unless price is in URLs (it isn't).

### 1e. Docs & internal comms

- `docs/payments.md`, `docs/STRIPE-CHECKOUT-CONTRACT.md`, `docs/email-sequence.md`, `docs/conversion-prompt.md`, `docs/conversion-build-plan.md`, `.lovable/plan.md`, `personas/*.md`, `reports for claude/*.md`, `docs/chris-sam-deliverables-brief.md` — replace `$99` with `$150` for accuracy so future agents don't reintroduce $99.
- `mem://index.md` — Core rule: "Offer is $150/mo Auto-Filled Reports. Never write $99. No $1,500 tier."

### 1f. Copy verification

After the sweep, run:
```
grep -rn --include=\*.tsx --include=\*.ts --include=\*.md --include=\*.html \
  -E '\$?99(/mo|\.00| ?USD|/month)?' .
```
Expected result: zero matches (except historical dossier notes explicitly dated pre-repricing, which we prefix with `# [historical]`).

---

## 2. Remove the $1,500/mo Advisory Desk tier (kill the ascension rung)

We are collapsing the ladder to two rungs: **Free Vault** + **$150/mo Auto-Filled Reports**. Nothing else.

### 2a. Stripe

- Retire `finance-desk-monthly` and `clarity-report` prices via Stripe archive (dashboard step — since we can't do it from here, we simply remove them from the catalog constant so nothing in the app can reference them; the user can archive in Stripe at their leisure).
- Update `supabase/functions/_shared/stripe-catalog.ts` `PRICE_IDS` to hold only `"auto-fill-monthly"`.
- Delete/refactor all typescript usages of `finance-desk-monthly` and `clarity-report` (frontend `startCheckout(...)` calls, plan-selector logic).

### 2b. Remove the Apply funnel from the sales path

The application funnel (`src/components/apply/**`, route `#/apply`) exists solely to qualify $1,500/mo leads. Actions:

- Remove `/apply` from `GlobalTopBar.tsx` and `GoldFinFooter.tsx`.
- Route `#/apply` → `#/pricing` (redirect in `App.tsx` / `useHashRoute`) so any stale link lands on the $150 offer.
- Delete or hide (behind a build flag) `src/components/apply/**`. Preferred: **delete**, since we're not keeping the tier. Retain the Supabase `applications` table (harmless) but stop writing to it.
- Delete `src/components/pricing/parts/PlanSelector.tsx` toggles that switch between tiers; PricingPage becomes single-plan.
- Delete `src/components/pricing/parts/RecommendedPlanSpotlight.tsx` if it's tier-comparison; keep `AutoFillSpotlight` and simplify.
- Delete `PlanFitSection.tsx` if it exists to route between tiers.

### 2c. Purge $1,500 copy across the site

Every one of these mentions the advisory desk / $1,500 / "book a call" / "monthly finance desk premium tier". Audit and rewrite so only Free → $150 exists:

- Pricing: `content.ts`, `PricingHero`, `PricingCard`, `PricingFAQ`, `PricingFinalCTA`, `WhyItMakesSense`, `MobileStickyCTA`, `PlanSelector`
- Home: `HomeHero`, `EpiphanyBridge`, `ClosingBaitCTA`, `VaultPreview`, `HomeSchema` (offerCatalog → single offer)
- Compare pages: `ComparisonHero`, `ComparisonFinalCTA`, `MissingMiddleSection`, `SoftConversionBridge`, `content.ts`
- How it works: `content.ts`, all step parts referencing a call/advisory rung
- Sample briefing: `SampleBriefingCTA`, `MobileStickyCTA`
- Security FAQ: `SecurityFinalCTA`, `MobileStickyCTA`
- Templates: `content.ts` upsell CTA
- Three-way-compare: `BookkeeperVsFractionalCFOPage` (this page's whole thesis is "we are the middle"; rewrite so the middle rung IS the $150 offer, not a $1,500 advisory)
- Report views: `AdvisoryReportView`, `ReportBlocks` — remove "book advisory" upgrade triggers; keep the report itself
- Portal: `ActivationChecklist` — remove "book a call" checkbox if present
- Emails: `docs/email-sequence.md` — kill all advisory-upsell emails; keep onboarding + weekly report + payment receipt only

### 2d. CTA vocabulary lock

New allowed primary CTAs across the site:
- `Auto-fill my reports` (paid)
- `Get the free templates` (lead magnet)
- `See a sample briefing` (proof)

Forbidden after this pass: `Book advisory`, `Talk to the desk`, `Apply for the Desk`, `Book a call`, `Book intro call`.

### 2e. Docs

- `docs/conversion-prompt.md`, `docs/conversion-build-plan.md`, `docs/chris-sam-deliverables-brief.md`, `reports for claude/*.md`: annotate top of each with `> **Update 2026-07-01:** Ladder collapsed to Free + $150/mo. Ignore any references to a $1,500 Advisory Desk below.` We do not delete the reports — they contain durable UX guidance — we just neutralize the tier references.
- `.lovable/plan.md` updated to reflect the two-rung ladder.

### 2f. Verification

```
grep -rn --include=\*.tsx --include=\*.ts --include=\*.md \
  -E '(\$?1,?500|advisory desk|Monthly Finance Desk\b|book (a )?call|apply for the desk)' .
```
Expected: only in `[historical]`-prefixed doc blocks.

---

## 3. New About page — "A mini Goldman Sachs, built for the people"

### 3a. Route + file

- New file: `src/pages/About.tsx`
- New route: `#/about`
- Add to `GlobalTopBar` and `GoldFinFooter` nav
- One `<h1>`, semantic sections, meta title `About GoldFin Desk — Wall Street playbooks for owner-led businesses`, meta description <160 chars, JSON-LD `Organization`.

### 3b. Voice + framing rules

- **Do NOT use "Chris" or any personal name.** Speak as "we" / "the team" / "the desk". First person plural throughout.
- **Do NOT claim Goldman Sachs endorsement or partnership.** Legal-safe phrasing only: "Our team's experience includes leadership and finance roles at Goldman Sachs, Bank of America, Royal Bank of Canada, and Merrill Lynch." (Note: the user wrote "Mayor Fynch" — read as **Merrill Lynch**; confirm during build if ambiguous.)
- Positioning line: **"A mini Goldman Sachs — built for the people who make Main Street run."**
- Tone: calm confidence + underdog warmth. Not hype, not stuffy. Every "we did this at a big bank" line is immediately followed by "here's what that means for your Tuesday morning."

### 3c. Section-by-section outline

Each section gets the Brunson block before build:

1. **Hero**
   - H1: `Wall Street built these tools for hedge funds. We rebuilt them for you.`
   - Sub: `We spent years inside Goldman Sachs, Bank of America, RBC, and Merrill Lynch — running the models that ran the money. Now we're pointing that firepower at the businesses those banks were never built for: yours.`
   - Primary CTA: `Auto-fill my reports — $150/mo`
   - Secondary: `Get the free templates`
   - No hero image of a person. Abstract skyline-to-Main-Street SVG.

2. **The origin (no names)**
   - "The idea started on a trading floor. Someone on the desk watched a family friend — a plumber doing $600k in revenue — pay $18,000 for an audit that told him nothing he didn't already know. That was the moment: the tools inside the bank were 100× better than anything a plumber, dentist, or agency owner could ever buy."
   - "So we took the frameworks used to brief institutional clients — cash clarity, concentration risk, waste analysis, tax reserving — and rebuilt them in plain English, auto-filled from your bank feed, delivered every two weeks. No jargon. No 40-page decks. No $18,000 invoice."

3. **The credentials strip (legally safe)**
   - Small monochrome logos of Goldman Sachs, Bank of America, RBC, Merrill Lynch, with the caption: **"Where our team learned the craft."** (Not "Where we work" — past tense, learning frame, no endorsement claim.)
   - Micro-disclaimer footnote: `Team experience references prior employment. GoldFin Desk is an independent company and is not affiliated with, endorsed by, or a partner of any listed institution.`

4. **What "mini Goldman Sachs" actually means**
   - Three-column block, plain English:
     - **Institutional discipline** → "Every number traces to a bank transaction. No estimates, no vibes."
     - **Owner-language delivery** → "Five bullets on a Monday morning. No dashboards to log into."
     - **Fair pricing** → "$150/mo, not $1,500/hr. Because you're building a business, not a hedge fund."

5. **For the people (the manifesto)**
   - Short, punchy paragraph block:
     - "We're for the plumber who wonders every Friday if payroll clears."
     - "For the dentist whose books are two months behind."
     - "For the agency owner who hasn't paid herself a salary in three quarters."
     - "For the contractor who thinks 'good year' means the bank account didn't go red."
     - "Big banks were never going to build this for you. So we did."

6. **What you get for $150/mo** (recap block, single ladder rung)
   - The 6 things a subscriber receives (Plaid-fed briefing, cash clarity, concentration tracker, waste audit, tax reserve, profit-first split).
   - Primary CTA: `Auto-fill my reports — $150/mo`
   - Secondary: `See a sample briefing`

7. **The promise**
   - `If your first briefing doesn't surface at least one number that changes what you do this week, it's free.`

8. **Final CTA**
   - Big centered `Auto-fill my reports — $150/mo` on white, thin gold rule, one line of trust copy: "Read-only bank access via Plaid. Cancel anytime. No sales calls."

### 3d. Design system compliance

- White background, ink text, champagne/gold accents.
- Serif for h1/h2, sans for body.
- No stock photos. Abstract institutional-to-main-street illustration only.
- Mobile sticky CTA matches page primary CTA.

### 3e. SEO

- Title <60 chars. Meta desc <160 chars. Single h1. Semantic sections. Alt text on the illustration. `Organization` JSON-LD listing founders as "GoldFin Desk Team" (no names). Canonical `/about`.

---

## 4. World-class prompt (for the section-by-section execution pass)

Once the plan is approved and we're in build mode, we run this prompt against every section that changes (About page + every repriced/detiered page). Kept here so it stays with the plan:

> **Role:** You are a world-class direct-response funnel operator trained on Hormozi (Grand Slam Offer, Value Equation) and Brunson (Hook / Story / Offer, Epiphany Bridge). You are also a founder-brand voice specialist.
>
> **Context:** GoldFin Desk. Two-rung ladder: **Free Vault** (spreadsheets) and **$150/mo Auto-Filled Reports** (Plaid-fed, bi-weekly, emailed). No third rung. No advisory desk. No "book a call." No personal founder name.
>
> **Positioning:** *A mini Goldman Sachs, built for the people.* Team experience at Goldman Sachs, Bank of America, Royal Bank of Canada, Merrill Lynch — never claim endorsement, always past-tense learning framing.
>
> **For the section `<SECTION>` on the page `<PAGE>`, output before writing any code:**
> - Ladder rung served (Free / $150 — nothing else)
> - Belief being sold in this section (one line)
> - Primary CTA (must be one of: `Auto-fill my reports — $150/mo`, `Get the free templates`, `See a sample briefing`)
> - Secondary CTA (or none)
> - Objection killed here
> - Proof element used here (Plaid read-only, cancel anytime, prior-employer strip, "first briefing free if it doesn't help")
> - Visual format (short — layout, headline size, key micro-copy)
> - The one line that gets remembered
> - Why this converts (in Hormozi Value Equation terms: dream outcome ↑, likelihood ↑, time delay ↓, effort ↓)
>
> **Hard rules:**
> 1. Never write `$99`, `$1,500`, `advisory desk`, `book a call`, `apply for the desk`, or any founder's first name.
> 2. Never claim Goldman/BofA/RBC/Merrill endorsement — only prior team experience.
> 3. Every CTA must ladder to Free or $150. Nothing else.
> 4. Plain English. Owner-language filter: "Would a plumber, dentist, or agency owner say this out loud?"
> 5. White background, ink text, gold accent, serif headings. No dark mode. No gradients. No hype.

We run this prompt per section, get the block, then implement.

---

## 5. Execution order (build-mode sequencing)

1. **Stripe** — create new $150 price, update `stripe-catalog.ts`, remove obsolete SKUs.
2. **Purge $1,500 tier** — delete apply funnel, PlanSelector, advisory copy, update GlobalTopBar/Footer.
3. **Reprice sweep** — run grep, replace `$99` → `$150`, rewrite value math anchors.
4. **About page** — new route, sections 1–8, nav + footer link, SEO.
5. **JSON-LD + email templates** — update prices + remove advisory CTAs.
6. **Docs** — annotate historical reports, update `.lovable/plan.md`, update `mem://index.md`.
7. **Verification** — run both grep checks (§1f, §2f) and confirm zero non-historical matches. Playwright a $150 checkout end-to-end in sandbox. Screenshot the About page mobile + desktop.

## 6. Out of scope

- Migrating existing $99 subscribers to $150. That is a separate business decision; default is grandfather them. If the user later says "raise everyone," we run a Stripe subscription update pass then.
- Redesigning the pricing card layout beyond price + copy changes.
- Adding new lead magnets or new report features.
