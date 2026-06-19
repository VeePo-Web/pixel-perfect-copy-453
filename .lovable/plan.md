
# Sample Briefing Page — Implementation Plan

A new product-led page at `#/sample-briefing` that lets Claire interact with a realistic bi-weekly finance briefing, then converts her toward the Monthly Finance Desk application. Built to match the existing dark, editorial system already shipped in the hero, How It Works, and Apply funnel.

## Scope

- Add `#/sample-briefing` to the existing hash router in `src/App.tsx` (no new routing library).
- Build the page as a self-contained module under `src/components/sample-briefing/`.
- Reuse existing tokens (`background`, `foreground`, `green.signal`, `green.deep`, champagne/gold accents) and motion utilities (`fade-in`, `scale-in`, `useInView`, `useReducedMotion`) from the How It Works module — no new dependencies.
- All sample data is static/local. No backend, no AI call. "Generate" is a scripted reveal.
- Update CTAs across hero / How It Works / Apply landing to link to `#/sample-briefing` where the brief specifies "Generate Sample Briefing".

## Page Architecture

Route: `#/sample-briefing`
Top component: `SampleBriefingPage`

```text
SampleBriefingHero            (1) intro + prompt + demo chips
  BusinessPromptInput
  DemoBusinessSelector
  BriefingPanelPreview        (skeleton -> generated)
    BriefingGenerationState   (2) restrained loader
BriefingReportShell           (3) full report with sticky nav
  StickyReportNav              (desktop side rail)
  ExecutiveSummaryCard         (4)
  CashMovementModule           (5) SVG line chart
  RevenueTrendModule           (6) SVG line + concentration meter
  ExpensePatternModule         (7) SVG donut + category cards
  UnusualSpendModule           (8)
  QuestionsToReviewModule      (9)
  DecisionsToConsiderModule    (10)
  MonthlyStrategyFocus         (11)
RawDataVsClarity              (12) scroll-linked left->right transform
BriefingTabs                  (13) Cash / Revenue / Expenses / Risk / Questions / Decisions
WhatThisIsNot                 (14)
PrivacyTrustBlock             (15)
SampleBriefingCTA             (16)
TemplateBridge                (17)
MobileStickyCTA               (state-aware: pre/post generation)
```

## Content & Data

`src/components/sample-briefing/content.ts` exports:

- `demoBusinesses` — 6 industries (Agency, Clinic, Trades, Restaurant, E-commerce, Professional Services). Each carries: `id`, `label`, `prefillPrompt`, `reportTitle`, `period`, `cash`, `revenue`, `expenses`, `cashDelta`, `revenueDelta`, `expensesDelta`, `expenseMix[]`, `executiveSummary`, `unusualSpend[]`, `questions[]`, `decisions[]`, `monthlyFocus[]`, `cashSeries[]`, `revenueSeries[]`, `mainRisk`.
- `tabContent` — per-tab metric, interpretation, why it matters, monthly call question (generated from active business).
- `templateBridgeItems`, `whatThisIsNot`, `privacyCards`, `loaderLines`.

State: `useBriefingState()` hook holds `selectedBusinessId`, `prompt`, `status: 'idle'|'loading'|'ready'`, `revealedAt`. Selecting a chip sets prompt + business; clicking Generate transitions `idle -> loading` (1.6s, scripted loader lines) -> `ready` and scrolls report into view (respects reduced motion).

## Interactions

- **Demo selector**: chip row, keyboard arrow nav, selected state with champagne border.
- **Prompt**: textarea with helper example and inline "Use Demo Business Data" link.
- **Generation**: skeleton panels morph to populated cards; loader lines fade in/out sequentially. No spinners, no emojis.
- **Sticky report nav** (desktop ≥lg): left rail with 8 anchors, active item tracked via IntersectionObserver.
- **Scroll-reveal**: each module fades + 8px rise on first intersect via existing `useInView`.
- **Tabs**: roving tabindex, ArrowLeft/Right, Home/End, `role="tablist"`. Mobile = horizontal scroll pills with snap.
- **Raw vs Clarity**: two columns; on scroll progress 0→1, left "messy" cards desaturate and slide slightly while right "clarity" cards lift and brighten. Pure CSS transform driven by a single scroll listener (no GSAP).
- **CTA timing**: primary "Apply" CTA is muted in hero, becomes prominent after report `status==='ready'` (executive summary onward). Mobile sticky CTA swaps copy on the same trigger.
- **Hover**: cards `translate-y-[-2px]`, hairline border brightens to champagne/20, soft inner glow.
- **Reduced motion**: disables transforms, scroll-linked transitions, and loader timing (jumps straight to ready).

## Charts

All SVG, hand-rolled, no chart library:

- `MiniLineChart` — cash & revenue series, gradient stroke, soft area fill, last-point marker.
- `Donut` — expense mix, 5 slices with thin gaps, center label.
- `ConcentrationMeter` — horizontal bar showing top-3 client share.

Sized to remain legible on mobile (min 280×140), simplified to a single sparkline + KPI on <sm.

## Files to Create

```text
src/components/sample-briefing/
  SampleBriefingPage.tsx
  content.ts
  hooks/useBriefingState.ts
  hooks/useActiveSection.ts
  parts/SampleBriefingHero.tsx
  parts/BusinessPromptInput.tsx
  parts/DemoBusinessSelector.tsx
  parts/BriefingPanelPreview.tsx
  parts/BriefingGenerationState.tsx
  parts/BriefingReportShell.tsx
  parts/StickyReportNav.tsx
  parts/ExecutiveSummaryCard.tsx
  parts/CashMovementModule.tsx
  parts/RevenueTrendModule.tsx
  parts/ExpensePatternModule.tsx
  parts/UnusualSpendModule.tsx
  parts/QuestionsToReviewModule.tsx
  parts/DecisionsToConsiderModule.tsx
  parts/MonthlyStrategyFocus.tsx
  parts/RawDataVsClarity.tsx
  parts/BriefingTabs.tsx
  parts/WhatThisIsNot.tsx
  parts/PrivacyTrustBlock.tsx
  parts/SampleBriefingCTA.tsx
  parts/TemplateBridge.tsx
  parts/MobileStickyCTA.tsx
  charts/MiniLineChart.tsx
  charts/Donut.tsx
  charts/ConcentrationMeter.tsx
```

## Files to Edit

- `src/App.tsx` — add `#/sample-briefing` to hash router (alongside `/`, `/apply`, `/apply/thank-you`).
- `src/components/hero/FinanceHero.tsx` — point "Generate Sample Briefing" CTA to `#/sample-briefing`.
- `src/components/how-it-works/parts/SampleBriefingPreview.tsx` — add deep link to full sample page.
- `src/components/apply/parts/ApplyHeader.tsx` (or equivalent) — "Not ready? Generate Sample Briefing" → `#/sample-briefing`.

## Out of Scope

- No backend, no real AI generation, no Plaid.
- No new dependencies (no Framer Motion, no chart library).
- No SEO meta beyond a basic `<title>` update via existing pattern.
- Free templates remain a CTA only — no downloads wired up.

## Verification

- Build passes.
- Playwright run: load `#/sample-briefing`, click Agency chip, click Generate, screenshot before/after, verify sticky nav active states change on scroll, verify tabs keyboard navigation, verify mobile sticky CTA copy swap at 375×800.
