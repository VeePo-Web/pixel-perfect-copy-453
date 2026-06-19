## Goal

Ship the dedicated three-way comparison page — Bookkeeper vs Fractional CFO vs Monthly Finance Desk — as a premium, conversion-focused decision guide. It lives alongside the existing Comparison Hub but stands on its own as the highest-intent comparison route.

## Route & shell

- Extend `src/components/apply/hooks/useHashRoute.ts` with a `three-way-compare` route matching `#/compare/bookkeeper-vs-fractional-cfo-vs-monthly-finance-desk`.
- In `src/App.tsx`, render the new `BookkeeperVsFractionalCFOPage` when that route is active (kept before the generic `compare` match).
- Add a "Bookkeeper vs CFO vs MFD" link inside the existing `CompareTopBar` and the Comparison Hub's `ComparisonCardGrid` so the hub points into this page.

## New files (`src/components/three-way-compare/`)

```text
BookkeeperVsFractionalCFOPage.tsx   # composes all sections, sets <Helmet> head + FAQ JSON-LD
analytics.ts                         # 11 named event helpers (no-op if window.analytics missing)
content.ts                           # config: fast answer, jobs map, table rows, scenarios,
                                     #         feelings, briefing modules, value stack, FAQ
hooks/
  useFitFinder.ts                    # 3-question state + recommendation engine
  useDocumentHead.ts                 # title / meta / canonical / og:* / JSON-LD updater
parts/
  ThreeWayTopBar.tsx                 # sticky desktop section nav (Fast Answer → Apply)
  ComparisonHero.tsx                 # eyebrow, H1, sub, 3-col card hero w/ MFD centered
  FastAnswerCards.tsx                # 3 "Choose X if…" cards
  RealDifferenceSection.tsx          # job-to-be-done 3-col map
  FinancialSupportFitFinder.tsx      # interactive 3-question diagnostic
  ThreeWayComparisonTable.tsx        # premium table → mobile expandable cards
  MissingMiddleSpectrum.tsx          # horizontal maturity rail (SVG)
  ScenarioRecommendationCards.tsx    # 6 expandable scenario cards
  OwnerFeelingComparison.tsx         # before/after emotional cards
  SampleBriefingProof.tsx            # sample briefing modules w/ scroll reveal
  PricingValueContext.tsx            # value stack + framing for $1,500/mo
  ComparisonFAQ.tsx                  # accessible accordion, 8 Q&A
  DecisionGuideSummary.tsx           # 3-line rule of thumb
  SoftConversionBridge.tsx           # sample briefing / templates / pricing cards
  FinalComparisonCTA.tsx             # apply + sample briefing + templates link
  MobileStickyCTA.tsx                # adaptive CTA (Find Fit → Sample → Apply)
```

All copy comes verbatim from the brief; nothing is hardcoded inside JSX.

## Interaction & UX

- **Fit Finder**: local React state, instant recommendation. Routing matrix per brief (messy → templates; bookkeeper-but-unclear → sample briefing; bank-balance → sample briefing; CFO-level → pricing + compare; early stage → templates). Keyboard accessible radio groups, selected state uses border + check icon (not color alone).
- **Comparison column hover**: hovering a column lifts it (`shadow`, `border-champagne`) and surfaces the role label. MFD column has a permanent subtle glow.
- **Mobile table**: same row data rendered as `<details>` accordions, preserving header semantics.
- **Scenario cards**: button-based accordions (`aria-expanded`).
- **Sample briefing**: each module fades+rises on intersection using IntersectionObserver; gated by `prefers-reduced-motion`.
- **Sticky nav**: desktop top bar (Fast Answer / Compare / Fit Finder / Sample Briefing / FAQ / Apply) with active-section underline via IntersectionObserver. Mobile uses bottom `MobileStickyCTA` whose label changes based on Fit Finder state and scroll position past the Sample Briefing section.
- All animations honor `prefers-reduced-motion: reduce`.

## Visual system

Reuses existing charcoal background, warm-white type, champagne/gold accent, deep-green clarity, blue data, amber caution tokens already defined in `index.css` and tailwind config. No new colors, no new dependencies. Glass cards via existing `bg-foreground/[0.02]` + `border-foreground/10` pattern used by the Comparison Hub.

## SEO

- `<title>`: Bookkeeper vs Fractional CFO vs Monthly Finance Desk
- meta description per brief
- canonical + og:url self-reference the route
- JSON-LD `FAQPage` built from `content.ts` FAQ array
- Internal links to `#/compare`, `#/sample-briefing`, `#/pricing`, `#/templates`, `#/apply`
- Single H1; semantic `<section>` + `<h2>` hierarchy

## Analytics

`analytics.ts` exports: `threeWayComparisonViewed`, `fitFinderStarted`, `fitFinderCompleted`, `fitFinderRecommendationShown`, `scenarioSelected`, `sampleBriefingClickedFromThreeWayCompare`, `applyClickedFromThreeWayCompare`, `templatesClickedFromThreeWayCompare`, `pricingClickedFromThreeWayCompare`, `comparisonFaqOpened`, `finalCtaClicked`. Each wraps a safe `window.dataLayer?.push` / `window.analytics?.track` call.

## Performance & accessibility

- Static rendering; no network calls; no images beyond inline SVG.
- IntersectionObserver only for reveal/active-section — single observer per concern.
- 44px touch targets, focus-visible rings, ARIA on accordions and the diagnostic.
- Disclaimer line ("Monthly Finance Desk does not replace tax, legal…") lives inside the FAQ section and the page footer microcopy.

## Verification

- Build passes (harness runs typecheck).
- Playwright headless smoke: visit `#/compare/bookkeeper-vs-fractional-cfo-vs-monthly-finance-desk`, screenshot hero + fit finder + table, exercise Fit Finder selection, click an FAQ, confirm zero console errors and that recommendation CTAs route to the correct hashes.
