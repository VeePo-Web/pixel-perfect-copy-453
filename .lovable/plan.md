# Comparison Hub — Implementation Plan

A `#/compare` route that mirrors the visual system, motion language, and conversion architecture of Apply, Sample Briefing, Pricing, and Templates. Static data only; the Fit Finder is local state, the comparison sub-pages are deferred (linked as section anchors within the hub, not separate routes) so this ships as one fast page without routing sprawl.

## Route & shell

- `useHashRoute.ts` adds `"compare"` to `ApplyRoute`, parses `#/compare`.
- `src/App.tsx` renders `<ComparisonHubPage />` for that route.
- Top bars on Sample Briefing, Pricing, Templates get a "Compare" link to `#/compare`.

## File layout

```text
src/components/compare/
  ComparisonHubPage.tsx
  content.ts                 // options, fitFinder, useCases, faq, comparisonCards, pageIndex
  analytics.ts               // defensive window.dataLayer push, never throws
  hooks/
    useFitFinder.ts          // 3 questions, recommendation derivation
  parts/
    CompareTopBar.tsx
    ComparisonHero.tsx                 // decision-map SVG with MFD highlighted as middle layer
    CoreQuestionSection.tsx            // 3-part job-to-be-done framing
    FitFinderDiagnostic.tsx            // 3-step diagnostic with dynamic recommendation panel
    CategorySpectrum.tsx               // horizontal spectrum, MFD = "missing middle"
    ComparisonCardGrid.tsx
    ComparisonCard.tsx                 // hover lift, preview-line reveal, scroll-to anchor
    FastAnswerTable.tsx                // desktop table + mobile expandable cards
    MissingMiddleSection.tsx           // 3-column too-light / MFD / too-heavy
    UseCasePaths.tsx                   // 6 expanding use-case cards
    SampleBriefingProofBlock.tsx       // condensed briefing modules with one insight
    ComparisonFAQ.tsx                  // native <details> accordion
    ComparisonPageIndex.tsx            // 8 SEO-style index cards (anchor links within hub)
    SoftConversionBridge.tsx           // 3 cards: sample briefing / templates / pricing
    ComparisonFinalCTA.tsx
    MobileStickyCompareCTA.tsx         // label flips after Fit Finder completes
```

## Data (`content.ts`)

- 8 `optionTypes`: DIY templates, bookkeeper, QuickBooks, dashboard, spend tools, fractional CFO, internal team, MFD — each with `{label, bestWhen, usuallyMisses, chooseIf, ctaText, anchorId, position}` driving spectrum, table, and cards.
- `fitFinder`: 3 questions with the exact options from the brief, plus a `recommend(setup, problem, maturity)` function returning one of 4 recommendation states: `bookkeepingFirst`, `mfdFit`, `cfoCompare`, `templatesFirst`. Each state has `{title, summary, primaryCTA, secondaryCTA}`.
- 8 `comparisonCards`: title, bestFor, coreInsight, ctaText, anchorId.
- 6 `useCases`: quote, recommendation, primaryCTA, secondaryCTA, href.
- 8 FAQ items.
- Soft bridge cards + final CTA copy.

## Sections (in order)

Hero → Core Question → Fit Finder → Category Spectrum → Comparison Cards → Fast Answer Table → Missing Middle → Use Case Paths → Sample Briefing Proof → FAQ + disclaimer → Comparison Page Index → Soft Conversion Bridge → Final CTA.

## Interactions

- Fit Finder: 3 radio-style steps (`role="radiogroup"`, arrow-key nav), reveals recommendation card with smooth height transition; recommendation drives the MobileStickyCompareCTA label (Generate Briefing / Apply / Get Templates) and stores completion in sessionStorage.
- Category Spectrum: SVG rail with 8 nodes, MFD node highlighted with champagne ring; on scroll into view, nodes fade in left-to-right via `motion-safe` opacity/translate (no JS scroll listener — pure IntersectionObserver via existing `LazySection` pattern).
- Comparison Card hover: `-translate-y-0.5`, brighter border, preview line fades in, CTA chevron animates. Card click scrolls to a deeper detail anchor inside the Fast Answer Table row for that option.
- Fast Answer Table: real `<table>` on `md+`, expandable `<details>`-based cards on mobile, preserving column meaning via labelled rows.
- Use Case cards: click expands recommended path inline with primary + secondary CTAs.
- FAQ: native `<details>` for keyboard-free accessibility, single-open behavior optional.
- Reduced motion via `motion-safe:` Tailwind variants throughout.

## Analytics

`analytics.ts` exposes `track(event, payload?)` that defensively pushes to `window.dataLayer`. Fires all 10 named events listed in the brief.

## SEO

- Update `index.html` `<title>` and `<meta name="description">` only when no per-route head is in place; since this is a hash-routed SPA, add a small `useDocumentHead` effect inside `ComparisonHubPage` that sets `document.title` and the meta description while the route is active and restores them on unmount.
- Suggested H1 lives in the hero. Section headings use logical h2 → h3 hierarchy.
- FAQ schema added inline as `<script type="application/ld+json">` injected via the same head-effect.

## Accessibility

- One `<main>` (route wrapper), each section `<section aria-labelledby>`.
- Fit Finder is a fieldset per step; selected state uses ring + check icon, not color alone.
- Tap targets ≥44×44 on chips, CTAs, accordion triggers.
- Tables include `<caption class="sr-only">` and `<th scope="col">`.

## Visual system

Reuses existing tokens: `bg-charcoal-950`, `border-white/[0.07]`, `champagne-100…300` accents, `green-signal` for fit/positive, `champagne-300` for caution, `blue/300` muted for software/data references. No new fonts, gradients, images, or dependencies.

## Performance

All visuals are inline SVG/CSS. Fit Finder is `useMemo` over static config. Below-fold sections wrapped in the existing lazy reveal pattern. No new dependencies.

## Files touched outside `compare/`

- `src/components/apply/hooks/useHashRoute.ts` — add `compare` route.
- `src/App.tsx` — render the page.
- `src/components/sample-briefing/parts/*TopBar.tsx`, `src/components/pricing/parts/PricingTopBar.tsx`, `src/components/templates/parts/TemplatesTopBar.tsx` — add Compare link.

## Verification

Playwright at `localhost:8080/#/compare`:
1. Screenshot hero + spectrum.
2. Step through Fit Finder (unclear → cash flow → $30–75K) → assert MFD recommendation visible.
3. Click a comparison card → assert scroll to anchored table row.
4. Expand mobile table card → assert "Best when / Usually misses / Choose this if" visible.
5. Mobile viewport screenshot.
6. Console error scan.
