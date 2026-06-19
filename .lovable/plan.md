
# Pricing Page — Implementation Plan

A new product-led pricing page at `#/pricing` that frames the $1,500/month Monthly Finance Desk as the obvious serious option, anchored by a 5-tier ladder, value reframing, comparison table, decision-cost framing, guided plan selector, FAQ, and trust block. Built to match the existing dark/editorial system already shipped in the hero, How It Works, Apply funnel, and Sample Briefing.

## Scope

- Add `#/pricing` to the existing hash router (`useHashRoute.ts`) and `src/App.tsx`.
- Build the page as a self-contained module under `src/components/pricing/`.
- Reuse existing tokens (`charcoal-950/900`, `champagne-100/200/300`, `green.signal/deep`, `bone`), motion utilities (`panel-rise`, `section-in`, `shimmer-slow`, `soft-pulse`), and existing `useInView` + `useReducedMotion` hooks.
- All pricing data static. No backend, no Stripe, no checkout — every CTA points to existing routes (`#/apply`, `#/sample-briefing`, `#templates`).
- No new dependencies.

## Page Architecture

Route: `#/pricing`
Top component: `PricingPage`

```text
PricingTopBar                  (reused-style nav with Apply CTA)
PricingHero                    (1) eyebrow / headline / 3 layered preview cards
PricingLadder                  (2) 5-tier offer ladder; tier 3 visually dominant
  PricingCard x5
RecommendedPlanSpotlight       (3) cinematic $1,500/mo card + 4-week rhythm
WhyItMakesSense                (4) 4 reframing cards + closing line
ValueStack                     (5) 5 stacked items (scroll-revealed)
CostComparisonTable            (6) desktop table / mobile expandable cards
DecisionCostSection            (7) 4 decision-risk cards
PlanSelector                   (8) 3-question guided recommendation
PricingFAQ                     (9) accessible accordion (8 Qs)
PlanFitSection                 (10) 3-column self-select with per-column CTA
SampleBriefingPricingPreview   (11) condensed briefing card + dual CTA
PricingTrustBlock              (12) 6 privacy cards
PricingFinalCTA                (13) cinematic close with layered cards
MobileStickyCTA                (post-ladder, hash-aware)
```

## Files to Create

```text
src/components/pricing/
  PricingPage.tsx
  content.ts                    (plans, comparison rows, faq, selector logic, decision cards, value stack)
  hooks/usePlanSelector.ts      (3-question state + recommendation logic)
  parts/PricingTopBar.tsx
  parts/PricingHero.tsx
  parts/PricingLadder.tsx
  parts/PricingCard.tsx
  parts/RecommendedPlanSpotlight.tsx
  parts/WhyItMakesSense.tsx
  parts/ValueStack.tsx
  parts/CostComparisonTable.tsx
  parts/DecisionCostSection.tsx
  parts/PlanSelector.tsx
  parts/PricingFAQ.tsx
  parts/PlanFitSection.tsx
  parts/SampleBriefingPricingPreview.tsx
  parts/PricingTrustBlock.tsx
  parts/PricingFinalCTA.tsx
  parts/MobileStickyCTA.tsx
```

## Files to Edit

- `src/components/apply/hooks/useHashRoute.ts` — add `pricing` route.
- `src/App.tsx` — render `PricingPage` when route === `pricing`.
- `src/components/hero/FinanceHero.tsx` and `src/components/how-it-works/HowItWorks.tsx` — add a "Pricing" link in nav/secondary CTAs where appropriate (single-line additions, no structural change).
- `src/components/sample-briefing/SampleBriefingPage.tsx` — add "Pricing" link in `TopBar`.

## Content

`content.ts` exports:
- `plans: PricingPlan[]` — 5 tiers with `id`, `name`, `price`, `priceSuffix`, `badge?`, `positioning`, `bestFor`, `includes[]`, `cta: { label, href }`, `tone: 'entry'|'self'|'flagship'|'plus'|'private'`, `note?`.
- `comparisonRows` — 6 alternatives × 5 columns (role / helps with / misses / investment / best fit).
- `faq` — 8 Q/A.
- `decisionCards` — 4 items.
- `valueStack` — 5 items with `title`, `value`, `why`, `trust?`.
- `whyCards` — 4 reframing cards.
- `planFit` — 3 columns with bullets + CTA target.
- `selector` — questions, options, and a `recommend(answers)` pure function returning a `planId` + headline + CTA.

## Visual System

- Page bg: `bg-charcoal-950` with soft champagne radial wash behind hero and final CTA, faint 80px grid overlay at ~6% opacity.
- Cards: `rounded-2xl border border-white/[0.07] bg-charcoal-900/55 backdrop-blur-sm`. Hover: `-translate-y-0.5`, border → `champagne-200/25`, top hairline fades in, soft shadow `0_24px_60px_-30px_rgba(217,190,130,0.25)`.
- Flagship Monthly Finance Desk card: `border-champagne-200/40`, larger scale on lg (`lg:scale-[1.04]`), animated hairline at top, subtle pulsing accent dot, premium gradient CTA button (champagne-100 → champagne-300) with shimmer.
- Other tiers: muted borders, no glow. Free Templates uses `border-white/[0.06]` only.
- Comparison table: thin dividers, sticky first column on desktop, monthly desk row highlighted with `bg-champagne-300/[0.04]` + champagne left rail.
- Decision-cost cards: amber-leaning champagne caution accent.
- Trust block: green-signal dot bullets.

## Motion

- `panel-rise` on hero preview cards staggered by 80ms.
- `useInView` triggers `section-in` on each major section.
- Value stack reveals item-by-item via incremental `IntersectionObserver` thresholds (no scroll listener thrash).
- Plan selector step transitions: 320ms cross-fade.
- FAQ accordion: native `<details>` styled with chevron rotate + max-height transition.
- `useReducedMotion` short-circuits transforms and stagger delays.

## Interactions

- **Plan ladder**: 5 cards in a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-5`). Flagship spans full width on md, sits in column 3 on lg. Each card focusable; CTA is a real `<a>`.
- **Plan selector**: 3 sequential question screens with previous/next, progress dots, and a final recommendation panel with dynamic headline + CTA. Keyboard arrow nav inside each option group; `role="radiogroup"`.
- **Comparison table**: real `<table>` on `md+` with `<th scope>`; on `<md` rendered as a list of `<details>` cards (one per alternative) with the 5 columns inside.
- **FAQ**: `<details><summary>` — accessible by default, no JS focus traps.
- **Sticky mobile CTA**: appears after `window.scrollY > 720`; swaps CTA target if the selector recommendation is for templates vs apply.
- **Reduced motion**: disables transforms, scroll-linked stagger, and shimmer.

## Accessibility

- One `<main>` per route (already enforced by `App.tsx`).
- Semantic `<section>` with `aria-labelledby` on every major block.
- Plan cards use `<article>` with `<h3>` titles; CTAs are real `<a>` with descriptive accessible names ("Apply for the Monthly Finance Desk").
- Plan selector: `role="radiogroup"` per question; arrow keys move focus; `aria-checked` on options.
- FAQ: native `<details>` for built-in keyboard support.
- All decorative SVG/radial gradients marked `aria-hidden`.
- Min 44×44 tap targets on mobile CTAs.
- Color is never the only signal — flagship tier uses badge text + border + size + label, not just color.

## Out of Scope

- No real payment flow, Stripe, or checkout.
- No monthly/annual toggle (no real annual price to honor).
- No CMS, no backend, no analytics events.
- No new dependencies.

## Verification

- Build passes.
- Playwright run at desktop (1280×1800) and mobile (390×844):
  - Load `#/pricing` → screenshot hero + ladder.
  - Scroll to comparison table → confirm flagship row highlighted on desktop and expandable cards on mobile.
  - Run the plan selector with answers that should recommend the Monthly Finance Desk → confirm recommendation panel + CTA target.
  - Open one FAQ item via keyboard → confirm expansion.
  - Scroll to bottom on mobile → confirm sticky CTA visible.
