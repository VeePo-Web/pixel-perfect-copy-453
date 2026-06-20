# Pure-White Trust Redesign — Fantasy.co Brief

## The problem

The previous pass swapped tokens to a warm "paper" off-white (`#FAF8F3`) plus low-alpha `bg-charcoal-900/55` panels on top of it. Stacked together, those translucent layers + radial dark gradients still render as muddy beige/grey panels in the preview. The site does not read as a clean, white, trustworthy financial site — it reads as a dimmed dark theme that was tinted.

The user wants what serious finance brands actually do: **pure white pages, ink-black type, gold used only as a hairline accent.** Think Stripe + J.P. Morgan Private Bank + Linear's docs — not "warm paper letterhead."

## Direction (fantasy.co–style creative brief)

**Mood**: institutional confidence. Quiet. Generous whitespace. Type-led. Hairline gold. No glow, no shimmer, no radial washes.

**Reference language**:
- Stripe.com — true white, ink type, restrained color
- Mercury.com — white surfaces, sharp 1px dividers, one accent
- J.P. Morgan Private Bank print — black serif headlines on white, thin gold rule
- Linear docs — white, deep ink, near-invisible borders

**Hard rules**:
1. Page background is **pure white `#FFFFFF`** everywhere. No `#FAF8F3`, no warm paper.
2. Cards/panels are **white on white** — separated by a 1px `#E6E8EC` border, not by a tinted fill. Optional: a near-white `#FAFAFB` for one level of elevation contrast (tables, sticky nav).
3. Text is **`#0B0D12` ink** for body, **`#5A6170` muted** for secondary. Never pure black, never grey-on-grey.
4. Gold is **decoration only**: 1px rules, small dots, single-word emphasis, icon strokes. Never a fill, never a gradient wash, never a glow shadow. Use `#B8893A` (gold-700, AA on white at 4.6:1) for text/icons and `#D4A845` (gold-500) for hairlines.
5. Primary CTA = **deep ink-navy fill `#0F1B3D`** with white text and a 1px `#D4A845` outer hairline. Secondary CTA = white with 1px ink border. No gradient buttons.
6. Shadows are paper-soft: `0 1px 0 rgba(15,23,42,0.04), 0 12px 32px -20px rgba(15,23,42,0.12)`. No `rgba(0,0,0,0.9)` drop shadows. No champagne glow shadows.
7. All radial-gradient backgrounds and dot-matrix overlays are **removed**, not softened.

## Token rewrite (`tailwind.config.ts` + `index.css`)

Re-point the aliases so every existing `bg-charcoal-*` / `bg-champagne-*` / `text-bone` className in the codebase resolves to the new pure-white system without a per-file sweep:

```
charcoal.950  #FFFFFF   page bg (was #FAF8F3)
charcoal.900  #FFFFFF   was tinted card — flatten to white
charcoal.800  #FAFAFB   subtle elevation only
charcoal.700  #E6E8EC   hairline border
charcoal.600  #C9CED6   muted border

champagne.50  #FBF5E4   gold tint hover wash
champagne.100 #ECD8A3   light gold
champagne.200 #D4A845   decorative gold (rules, dots)
champagne.300 #B8893A   accessible gold text/icons
champagne.400 #8A6422   darkest gold

bone          #0B0D12   ink body text
ink.DEFAULT   #0B0D12
ink.muted     #5A6170
paper.DEFAULT #FFFFFF
paper.raised  #FAFAFB
paper.white   #FFFFFF
gold.300/500/700  #ECD8A3 / #D4A845 / #B8893A
navy          #0F1B3D
```

`body` in `index.css`: `background:#FFFFFF; color:#0B0D12;`. `<meta name="theme-color">` → `#FFFFFF`.

Because charcoal-900 also flattens to white, the `/55` `/70` `/40` opacity suffixes on `bg-charcoal-900/55` become `rgba(255,255,255,0.55)` — invisible on white. That removes the muddy translucent panels automatically. Card separation then comes from the existing `border-ink/[0.06]` borders, which we re-tune to `border-ink/[0.09]` for visibility on white.

## Surgical strikes (handwritten, not bulk)

These files have hardcoded dark surfaces or inline radial gradients that the token swap alone won't fix. Each gets edited directly to remove the dark layer:

1. `src/components/hero/FinanceHero.tsx` — remove the two radial-gradient `<div>`s, the dot-matrix layer, the ghost-card blur, the `shadow-[0_30px_80px_-40px_rgba(0,0,0,0.95)]` shadows. Hero becomes white with an ink H1, a single gold hairline under the eyebrow, and a white input panel with `border-ink/[0.09]`.
2. `src/components/how-it-works/HowItWorks.tsx` — strip the radial gradients + dot matrix off the `<section>`.
3. `src/components/apply/ApplicationFunnel.tsx` — same: strip background image styles.
4. `src/components/nav/GlobalTopBar.tsx` — `bg-white/85 backdrop-blur-md border-b border-ink/[0.08]`.
5. `src/components/sample-briefing/parts/ModuleShell.tsx`, `WhatYouDoVsWeDo.tsx`, `TrustSection.tsx`, `SelectableCard.tsx`, `TrustReassuranceBlock.tsx`, `SampleBriefingPreview.tsx`, `ValueStack.tsx`, `WhyItMakesSense.tsx`, all `three-way-compare/parts/*` panels, `ThreeWayComparisonTable.tsx`, `FinancialSupportFitFinder.tsx`, `ScenarioRecommendationCards.tsx`, `OwnerFeelingComparison.tsx`, `FastAnswerCards.tsx`, `MissingMiddleSpectrum.tsx`, `ComparisonHero.tsx`, `MobileStickyCTA.tsx`, `FinalComparisonCTA.tsx`, `DecisionGuideSummary.tsx`, `SoftConversionBridge.tsx` — replace `shadow-[...rgba(217,190,130,0.45)...]` champagne-glow shadows with the soft paper shadow; replace `bg-charcoal-900/70` selected-state with `bg-paper-raised border-gold-500`.
6. Zentry leftovers (`Story.tsx`, `Features.tsx`, `Contact.tsx`) — not routed, skip.

## Out of scope

- Copy, layout, sections, routes, fonts.
- No new components; no Zentry cleanup.

## Validation

- `bunx tsc --noEmit` clean.
- Playwright at 1280×1800 over `/`, `#/how-it-works`, `#/templates`, `#/pricing`, `#/compare`, `#/sample-briefing`, `#/security-faq`, `#/apply`. Verify: no beige cast, no dark panel, body type passes 4.5:1, gold reads as accent only.

Approve and I'll execute: tokens first, surgical strikes second, screenshot pass third.
