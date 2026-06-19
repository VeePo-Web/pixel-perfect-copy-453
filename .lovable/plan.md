# Free Template Library — Implementation Plan

> Note: this page already exists at `#/templates` from the previous turn. Re-approving this plan will rebuild/overwrite the same files. If you want changes (different sections, visual direction, copy, interactions), reply with the specifics and I'll plan that instead.

A `#/templates` route mirroring the visual system, motion language, and conversion architecture already established by Apply, Sample Briefing, and Pricing. Static data only — email capture is a client-side success simulation that hands off to `#/sample-briefing` and `#/apply`.

## Route & shell

- `useHashRoute.ts` includes `"templates"`.
- `src/App.tsx` renders `<FreeTemplateLibraryPage />` for that route.
- Existing `#templates` anchors across Apply / Pricing / How-It-Works / Sample Briefing rewritten to `#/templates`.
- `MobileStickyTemplateCTA` mounted by the page.

## File layout

```text
src/components/templates/
  FreeTemplateLibraryPage.tsx
  content.ts                 // templates[], categories, paths, faq, comparison, chips
  analytics.ts               // track(event, payload) → window.dataLayer, never throws
  hooks/
    useTemplateFilters.ts    // category + recommended-path highlight state
    useLeadCaptureFlow.ts    // modal lifecycle + 750ms simulated send + sessionStorage flag
  parts/
    TemplatesTopBar.tsx
    TemplateLibraryHero.tsx          // layered SpreadsheetPreview stack
    PainToValueReframe.tsx           // before/after columns
    TemplateCategoryFilters.tsx      // sticky, role=radiogroup, arrow-key nav
    TemplateGrid.tsx
    TemplateCard.tsx                 // hover lift + decision-line reveal + upgrade bridge
    ModalShell.tsx                   // focus-trap, ESC, click-outside, restore focus
    TemplatePreviewModal.tsx         // right-side panel
    TemplateLeadCaptureModal.tsx     // zod-validated form
    TemplateSuccessState.tsx         // 3 CTAs, Generate Briefing primary
    RecommendedStartingPaths.tsx     // 5 question cards → highlight matching grid cards
    ManualVsMonthlyDesk.tsx
    FeaturedTemplatePreview.tsx      // Cash Flow Forecast detail + plain-English notes
    TemplateToFinanceDeskBridge.tsx  // 4-step bridge
    TemplateTrustSection.tsx
    TemplateFAQ.tsx                  // native <details>
    TemplateFinalCTA.tsx
    MobileStickyTemplateCTA.tsx      // label flips after first download
    SpreadsheetPreview.tsx           // SVG/CSS grid, tone-coded rows
```

## Data (`content.ts`)

12 templates with `id, name, shortName, category, description, bestFor, decisionLine, timeToUse, difficulty, ctaText, painPointTags[], previewRows[]`. 11 chips. 5 recommended paths. Free-vs-Desk comparison. 4 bridge steps. 4 trust cards. 8 FAQ items. Business-type list + goal chips.

## Sections (in order)

Hero → Pain reframe → Sticky filter bar → Grid (12 cards) → Recommended Paths → Manual vs Desk → Featured Cash Flow detail → 4-step bridge → Trust proxies → FAQ + disclaimer → Final CTA.

## Interactions

- Instant client-side category filtering, `role="radiogroup"` + arrow keys.
- Recommended path click → scroll to grid, matching cards get `data-highlighted="true"` + champagne ring.
- Card hover: `-translate-y-0.5`, brighter border, preview shifts up, decision line fades in.
- Preview opens right-side panel (full-screen on mobile via flex layout).
- Lead capture: zod schema (firstName, email, businessType required; goals optional chips). 750ms simulated send → success state with Generate Briefing primary CTA.
- Sticky mobile CTA appears after `scrollY > 640`; flips to "Generate Sample Briefing" once `sessionStorage["mfd.templateDownloaded"]` is set.
- `useReducedMotion` short-circuits transforms via `motion-safe:` Tailwind variants already used across the app.

## Analytics

`analytics.ts` exposes `track(event, payload?)` that defensively pushes to `window.dataLayer`. Fires all 9 named events.

## Accessibility

One `<main>` (route wrapper). Each section `<section aria-labelledby>`. ModalShell traps focus, restores on close, ESC closes. Inputs labelled, errors `role="alert" aria-live="polite"`. 44×44 tap targets on chips, CTAs, card buttons. Difficulty uses dot + text (color is never the only signal).

## Visual system

Reuses existing tokens: `bg-charcoal-950`, `border-white/[0.07]` surfaces, `champagne-100…300` accents, `green-signal` for positive, `champagne-300` for caution. No new fonts, no new gradients, no images, no new deps.

## Performance

All previews are inline SVG/CSS via `SpreadsheetPreview`. Filtering is `useMemo` over 12 items. No new dependencies.

## Files touched outside `templates/`

- `src/components/apply/hooks/useHashRoute.ts` — add `templates` route.
- `src/App.tsx` — render the page.
- All files containing `"#templates"` — rewritten to `"#/templates"`.

## Verification

Playwright at `localhost:8080/#/templates`:
1. Screenshot hero + grid.
2. Click Cash Flow chip → assert card count drops.
3. Click "Why does cash still feel tight?" path → assert 3 cards get `data-highlighted="true"`.
4. Click Get Cash Flow Template → fill form → submit → assert success state visible.
5. Open preview, ESC closes.
6. Mobile viewport screenshot.
