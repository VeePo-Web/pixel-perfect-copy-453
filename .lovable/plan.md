## Plan: "How It Works" page section for Monthly Finance Desk

Build a cinematic, scroll-driven "How It Works" experience that lives directly below the existing `FinanceHero` on the home page. Same dark champagne/green token system, same restrained motion language already established in the hero. No new dependencies — uses Tailwind tokens + IntersectionObserver + existing keyframes (`panel-rise`, `section-in`, `shimmer`, `soft-pulse`).

### Where it goes

`src/App.tsx` renders a new `<HowItWorks />` after `<FinanceHero />`. The section gets `id="how-it-works"` so the hero nav anchor works.

### File structure

New folder `src/components/how-it-works/`:

```text
HowItWorks.tsx              — section orchestrator, scroll progress, sticky mobile CTA
parts/
  SectionHeader.tsx         — eyebrow + headline + subhead primitive
  HowItWorksIntro.tsx       — S1 hero intro with animated rhythm loop
  ProcessTimeline.tsx       — S2 sticky-left 5-step rhythm (desktop scroll-linked, mobile vertical)
  ProcessStepVisual.tsx     — per-step right-rail visual (spreadsheet form, Plaid line, sort, briefing fill, calendar+agenda)
  WhatYouDoVsWeDo.tsx       — S3 two-column comparison
  MonthlyCycle.tsx          — S4 circular 4-week operating loop
  BeforeAfter.tsx           — S5 split-screen with hover/scroll morph
  SampleBriefingPreview.tsx — S6 tabbed briefing report
  DifferenceTable.tsx       — S7 elevated comparison table
  TrustSection.tsx          — S8 calm trust cards
  FinalCTA.tsx              — S9 closing block with drifting report cards
hooks/
  useInViewProgress.ts      — IntersectionObserver + scroll progress helper
  useReducedMotion.ts       — prefers-reduced-motion hook
content.ts                  — all copy strings, step data, tab data, table rows in one file
```

Each part is a small focused component. `content.ts` keeps copy byte-accurate to the brief and easy to edit.

### Section-by-section approach

**S1 Intro** — Left: eyebrow `HOW IT WORKS`, large editorial headline, subhead, primary CTA (`Apply for the Monthly Finance Desk`), secondary ghost link (`Generate Sample Finance Briefing`), trust microcopy. Right: a 4-node looping rhythm strip (Bank → Spreadsheet → Briefing → Review) where the active node glows champagne every 2.4s using `soft-pulse` + a sweeping hairline connector.

**S2 Process Timeline** — Desktop: two-column. Left column sticks (`position: sticky`) with the 5 step labels stacked vertically; the active step is set by IntersectionObserver as each right-column visual scrolls past mid-viewport. Right column is a tall stack of 5 visuals, each ~90vh, with `panel-rise` on enter:
- 01 spreadsheet grid assembling from transaction fragments (CSS grid with staggered `section-in`)
- 02 secure Plaid connection line: bank card on left, desk module on right, animated dashed SVG path drawing in
- 03 rows sorting into category lanes (revenue / payroll / software / contractors / tax reserve / owner draw / subscriptions) — each row translates from a "raw" column to its labeled lane with stagger
- 04 briefing panel that fills line-by-line (reuses the same shimmer/cascade vocabulary as the hero briefing) — visually the most important step
- 05 calendar tile + agenda card side by side
Mobile: collapses to a single-column vertical timeline with a champagne hairline rail and dot markers; visuals shrink but keep the same motion.

**S3 What You Do vs What We Do** — Two glass cards side by side with hairline divider down the middle. Champagne checkmarks on the "Finance Desk" side, neutral dashes on "What you do" side to signal it's lighter work. CTA below: `See a Sample Briefing` (scrolls to S6).

**S4 Monthly Cycle** — Circular SVG ring with 4 nodes at 12/3/6/9 positions, labeled Week 1–4. A champagne arc traces around the ring on scroll (stroke-dashoffset tied to in-view progress). Center label morphs through the four weeks then settles on `Clearer decisions for the next month.` Below: the discipline conversion line.

**S5 Before/After** — Split-screen with a vertical draggable/scroll-linked divider. Left half desaturated cool grey with the "before" bullets; right half full color with champagne accents and "after" bullets. On hover (desktop) or scroll-into-view (mobile), the divider sweeps right to reveal "after." Closing emotional line centered below.

**S6 Sample Briefing Preview** — Full-width premium report card with horizontal tab pills: Cash Movement / Revenue Trend / Expense Pattern / Unusual Spend / Questions to Review / Decisions to Consider. Tab switch fades content with the same 280ms dissolve from the hero. Each panel has a short paragraph + 2–4 hairline rows with sample numbers. CTA inside the card: `Generate My Sample Finance Briefing` (scrolls to hero composer). Mobile: tabs become a horizontal scroll-pill row.

**S7 Difference Table** — Rows: Bookkeeper / Dashboard / Spreadsheet Template / Fractional CFO / **Monthly Finance Desk** (highlighted with a champagne left rim and slightly brighter card background). Columns: What it helps with / What it usually misses / Best fit. Sticky first column on mobile horizontal scroll.

**S8 Trust** — 5 small glass cards in a responsive grid; calm copy, no compliance badges. Subtle champagne hairlines only.

**S9 Final CTA** — Large centered headline + subhead. Background: 3–4 ghost briefing cards drifting slowly using `ghost-drift` at low opacity. Primary CTA (champagne fill, shimmer-slow sheen), secondary CTA (ghost), tertiary text link `Start with Free Templates`. Microcopy underneath.

### Interactions

- **Scroll-linked step progression** — `useInViewProgress` returns the active step index from a list of refs; left sticky column highlights the matching label and animates a champagne progress bar down the rail.
- **Briefing fill animation** — reuses existing `section-in` stagger; triggers once when S2-step-04 or S6 enters viewport.
- **Hover** — cards: `transition-all duration-400 ease-cinema hover:-translate-y-0.5 hover:border-champagne-200/40 hover:shadow-[0_8px_40px_-12px_rgba(217,190,130,0.18)]`.
- **Primary CTA hover** — champagne gradient brightens, `shimmer-slow` sheen sweeps across.
- **Mobile sticky CTA** — fixed bottom bar appears after the hero scrolls out (IntersectionObserver on hero sentinel); shows `Generate Sample Briefing` until S6, then swaps to `Apply for the Monthly Finance Desk`. Hidden on `md:` and up.
- **Reduced motion** — `useReducedMotion` short-circuits all keyframe animations to simple opacity fades; no transforms, no shimmer, no drift.
- **Keyboard a11y** — tabs use `role="tablist"`/`role="tab"` with arrow-key navigation; all CTAs are real `<button>`/`<a>`; focus rings use champagne ring tokens.

### Tokens & styling

All colors, shadows, glows come from existing Tailwind tokens (`charcoal-*`, `champagne-*`, `bone`). One new semantic addition only if needed: a `green-signal` token for the "deep green for healthy financial movement" — added to `tailwind.config.ts` as `green: { signal: "#3F7A5E" }` and used sparingly (cash-positive deltas, after-state accents). No other token changes.

### Out of scope

- No backend wiring; the inline `Generate My Sample Finance Briefing` CTA scrolls to the existing hero composer rather than calling the edge function from S6.
- No new dependencies (no Framer Motion, no GSAP) — restraint matches the established motion vocabulary.
- Existing files outside `src/App.tsx` and `tailwind.config.ts` (one color token) are untouched.
