# Free Template Library — Implementation Plan

A new `#/templates` route that mirrors the visual system, motion language, and conversion architecture already established by the Apply funnel, Sample Briefing, and Pricing pages. Static data only, no backend writes — the email capture is a client-side success simulation that hands the user off to `#/sample-briefing` and `#/apply`.

## Route & shell

- Extend `useHashRoute.ts` with `"templates"`.
- Add route in `src/App.tsx` rendering `<FreeTemplateLibraryPage />`.
- Update existing nav/footers and any "Free templates" links currently pointing elsewhere to `#/templates`.
- Add `<MobileStickyTemplateCTA />` mounted by the page (not globally).

## File layout

```text
src/components/templates/
  FreeTemplateLibraryPage.tsx
  content.ts                 // templates[], categories, paths, faq, comparison
  hooks/
    useTemplateFilters.ts    // category + recommended-path state
    useLeadCaptureFlow.ts    // modal open/close, selected template, success state
  parts/
    TemplateLibraryHero.tsx
    PainToValueReframe.tsx
    TemplateCategoryFilters.tsx     // sticky chips, horizontal scroll on mobile
    TemplateGrid.tsx
    TemplateCard.tsx
    TemplatePreviewModal.tsx        // shadcn Sheet (right side, full-screen on mobile)
    TemplateLeadCaptureModal.tsx    // shadcn Dialog with zod-validated form
    TemplateSuccessState.tsx        // rendered inside the capture Dialog
    RecommendedStartingPaths.tsx
    ManualVsMonthlyDesk.tsx
    FeaturedTemplatePreview.tsx     // Cash Flow Forecast detail
    TemplateToFinanceDeskBridge.tsx // 4-step bridge
    TemplateTrustSection.tsx
    TemplateFAQ.tsx                 // native <details>
    TemplateFinalCTA.tsx
    MobileStickyTemplateCTA.tsx
    SpreadsheetPreview.tsx          // lightweight SVG/CSS grid used by cards + modal
```

## Data (`content.ts`)

- `categories`: 11 chips (All + 10 categories from the spec).
- `templates`: 12 entries with `id, name, category, description, bestFor, timeToUse, difficulty, ctaText, painPointTags[], previewRows[]` (rows are static label/value pairs rendered by `SpreadsheetPreview`).
- `recommendedPaths`: 5 question cards, each referencing template ids.
- `comparison`: free-vs-desk feature lists.
- `faq`: 8 Q&A.
- `bridgeSteps`: 4 steps.
- `trustCards`: 4 outcome cards.

## Sections (in order)

1. Hero — eyebrow, headline, sub, 3 CTAs, trust line, layered `SpreadsheetPreview` stack that fans out on scroll (CSS transform driven by `IntersectionObserver`, no Framer needed beyond what's already in the project).
2. Pain → Value reframe with before/after columns.
3. Sticky category filter bar (becomes sticky once scrolled past hero; `position: sticky; top: 0; z-index: 30`).
4. Featured template grid (12 cards, responsive 1/2/3 columns).
5. Recommended Starting Paths (5 question cards; clicking highlights matching cards by scrolling back to grid and flashing the matched cards via `data-highlighted`).
6. Manual vs Monthly Finance Desk comparison.
7. Featured Cash Flow Forecast preview (large `SpreadsheetPreview` + plain-English side notes).
8. Templates → Premium System bridge (4 steps).
9. Trust section (no fake testimonials — proxy cards only).
10. FAQ (native `<details>` for a11y + zero JS cost).
11. Final CTA + disclaimer microcopy.

## Interactions

- Filtering: pure client state, instant; chips have `role="radiogroup"`, arrow-key nav, active chip uses champagne border + subtle glow.
- Card hover: `translate-y-[-2px]`, border brightens to `border-champagne-200/30`, internal preview sheet shifts up 6px, "what this helps you decide" line fades in.
- Preview Sheet: shadcn `Sheet` side="right" on desktop, full-screen on mobile; contains larger `SpreadsheetPreview`, meta, inline lead capture, upgrade bridge.
- Lead capture Dialog: zod schema (firstName 1–60, email valid + ≤120, businessType enum, optional goal chips multi-select). On submit → 700ms simulated send → swap content to `TemplateSuccessState` with Generate Briefing / Apply / Browse More CTAs.
- Sticky mobile CTA: appears after `scrollY > 640`; flips label to "Generate Sample Briefing" once `sessionStorage["mfd.templateDownloaded"]` is set on success.
- Reduced motion: all transforms/transitions short-circuited via `useReducedMotion` hook already present in the codebase (reuse from sample-briefing).

## Analytics

`src/components/templates/analytics.ts` exporting a single `track(event, payload?)` that wraps `window.dataLayer?.push` defensively. Fires the 9 named events from the spec. Never throws.

## Accessibility

- One `<main>` (the page root, since route swaps the whole document body region).
- Each section is a `<section aria-labelledby="...">` with a real heading.
- Modals use shadcn `Dialog` / `Sheet` (Radix, focus-trapped, ESC closes).
- Filter chips and path cards keyboard navigable, `aria-pressed` reflects state.
- All inputs labelled; errors announced via `aria-live="polite"`.
- 44×44 tap targets on chips and card CTAs.
- Color is never the only signal (difficulty has text + dot, status uses icon + label).

## Visual system

Reuse existing tokens — no new colors. Background `bg-charcoal-950`, surfaces `bg-white/[0.02]` with `border-white/[0.07]`, champagne accents `text-champagne-200` / `border-champagne-200/30`, deep green for positive cells, amber for caution, muted blue for automation references. Headlines use the same editorial display font already configured; body in the existing sans stack. No new fonts, no new gradients.

## Performance

- No images — all previews are inline SVG/CSS grids rendered by `SpreadsheetPreview`.
- Templates rendered from a static array; filtering is `useMemo` over ~12 items.
- Below-fold heavy sections (FeaturedTemplatePreview, Bridge, FAQ) wrapped in a tiny `<LazySection>` that mounts on first intersection.
- No new dependencies.

## Files touched outside `templates/`

- `src/components/apply/hooks/useHashRoute.ts` — add `"templates"` route.
- `src/App.tsx` — render the new page.
- `src/components/finance-hero/FinanceHero.tsx` (and any nav/footer with a "templates" link if present) — point existing CTA at `#/templates`.

## Verification

After build, drive Playwright at `localhost:8080/#/templates`:
1. Screenshot hero + grid.
2. Click a category chip → assert filtered count.
3. Click a Recommended Path → assert matching cards get `data-highlighted="true"`.
4. Click "Get Template" → fill modal → submit → assert success state + sticky CTA label flips.
5. Open Preview Sheet, ESC closes, focus returns to card.
6. Mobile viewport (390×844) screenshot.
