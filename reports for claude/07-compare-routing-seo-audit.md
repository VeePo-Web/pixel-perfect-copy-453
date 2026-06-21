# Compare Pages Routing And SEO Audit

> **For Claude / Claude Code only:** This is an audit and execution handoff report. Do not treat it as public-facing copy or runtime documentation.

## Current-State Diagnosis

Routes: `#/compare` and `#/compare/bookkeeper-vs-fractional-cfo-vs-monthly-finance-desk`.

Current implementation has rich comparison content, fit finders, tables, proof blocks, and mobile sticky CTAs. However, many CTAs push directly to `Apply for the Monthly Finance Desk`. For the new funnel priority, comparison pages should route by intent and send most visitors through templates or sample briefing before the `$1,500` application.

Primary problem: education pages are acting like sales pages. They should be routers.

## Prompt Requirements To Enforce

- Page job: capture problem-aware traffic and route to the right rung.
- Every section ends in a routing card, not a sales pitch.
- Bookkeeper-curious routes to templates.
- Dashboard-curious routes to sample briefing.
- Fractional-CFO-curious may route to apply, but only after a proof-page stop when possible.
- Never push `$1,500` without sample briefing as conversion accelerator.

## Required CTA Hierarchy

- DIY/bookkeeper uncertainty: `Get the free templates`.
- Dashboard/no-decision frustration: `Generate sample briefing`.
- CFO-ready/high-complexity: `Apply for the Desk`, lower frequency and ideally after proof.
- Pricing curiosity: `See how auto-fill works` to `#/pricing#auto-fill`.

## Brunson Rationale

Compare pages catch problem-aware and solution-aware traffic. They should diagnose the visitor's current belief, then route to the next belief-building asset. This is Dream 100/education traffic behavior: don't sell the backend before the visitor has consumed proof.

## Section-By-Section Claude Instructions For `#/compare`

### 1. Hero

Claude must output the pre-build block before coding.

- Ladder rung: education/router.
- Belief: the right support depends on whether the gap is structure, interpretation, or strategy.
- Primary CTA: `Find my best fit` or equivalent diagnostic action.
- Secondary action: `Generate sample briefing`.
- Visual format: Pattern A or restrained comparison spectrum.
- Objection killed: `I don't know what I need.`
- Proof element: clear category map.

Acceptance:

- No hard premium CTA as primary.
- One `h1`.

### 2. Fit Finder / Diagnostic

Claude must output the pre-build block before coding.

- Ladder rung: router.
- Belief: GoldFin can route the visitor without forcing a sale.
- Primary CTA is dynamic by result:
  - templates-first: `Get the free templates`
  - proof-needed: `Generate sample briefing`
  - continuity: `See how auto-fill works`
  - backend-ready: `Apply for the Desk`
- Visual format: compact diagnostic.
- Objection killed: `Am I too early or too advanced?`
- Proof element: recommendation logic explained in plain English.

Acceptance:

- Default recommendation should not be application.
- Result copy says why the route fits.

### 3. Comparison Cards / Table

Claude must output the pre-build block before coding.

- Ladder rung: education/router.
- Belief: each option has a role and a missing piece.
- Primary CTA varies by row.
- Visual format: scannable comparison rows.
- Objection killed: `Why not just QuickBooks/bookkeeper/dashboard?`
- Proof element: honest where each option wins.

Acceptance:

- Bookkeeper path routes to templates or sample briefing.
- Dashboard path routes to sample briefing.
- CFO path can route to apply only after proof framing.

### 4. Missing Middle Section

Claude must output the pre-build block before coding.

- Ladder rung: continuity bridge.
- Belief: `$99` auto-filled reports are the missing middle before human advisory.
- Primary CTA: `See how auto-fill works`.
- Secondary action: `Generate sample briefing`.
- Visual format: middle-of-spectrum visual.
- Objection killed: `Do I need a CFO or just better reporting?`
- Proof element: `$99` sits between DIY templates and Desk.

Acceptance:

- Introduce `$99` as the practical middle step.
- Do not overtake comparison intent with a hard close.

### 5. Final Routing CTA

Claude must output the pre-build block before coding.

- Ladder rung: router.
- Belief: pick the next belief-building asset.
- Primary routing cards:
  - `Get the free templates`
  - `Generate sample briefing`
  - `See how auto-fill works`
- Secondary: `Apply for the Desk`, only for high-complexity copy.
- Visual format: routing cards.
- Objection killed: `What do I do next?`
- Proof element: each route states who it is for.

Acceptance:

- Final section is a router, not a sales close.
- Sticky mobile CTA follows diagnostic recommendation.

## Section-By-Section Claude Instructions For Three-Way Compare

### 1. Hero And Fast Answer

Claude must output the pre-build block before coding.

- Ladder rung: education/router.
- Belief: bookkeeper, fractional CFO, and GoldFin solve different gaps.
- Primary CTA: `Generate sample briefing`.
- Secondary action: `Get the free templates`.
- Visual format: comparison hero plus fast answer cards.
- Objection killed: `Which category am I shopping for?`
- Proof element: concise role distinctions.

Acceptance:

- Do not make application the default CTA.
- Apply appears only for fractional-CFO-ready visitors.

### 2. Three-Way Table

Claude must output the pre-build block before coding.

- Ladder rung: education.
- Belief: records, recurring clarity, and strategic finance are separate jobs.
- Primary CTA by row:
  - bookkeeper: templates or cleanup guidance
  - GoldFin `$99`: `See how auto-fill works`
  - Desk/backend: `Apply for the Desk`
- Visual format: table with one recommended next step per row.
- Objection killed: category confusion.
- Proof element: honest differences.

Acceptance:

- `$99` gets a visible middle-rung path.
- `$1,500` remains application-only.

### 3. Scenario Cards And Final Router

Claude must output the pre-build block before coding.

- Ladder rung: router.
- Belief: the user's situation determines the next step.
- Primary CTAs route to templates, sample briefing, pricing auto-fill, or apply.
- Visual format: Pattern C scenario cards.
- Objection killed: `What should someone like me do?`
- Proof element: scenario-specific recommendations.

Acceptance:

- At least one scenario routes to `#/pricing#auto-fill`.
- Application route is not the majority path.

## Mobile / Sticky CTA Requirements

- Sticky CTA should follow diagnostic result when available.
- Default sticky CTA should be `Generate sample briefing` or `Get the free templates`, not application.
- If `$99` has been introduced as best fit, sticky may say `See how auto-fill works`.

## Page Acceptance Checklist

- Compare pages route; they do not close cold traffic.
- No section hard-pushes `$1,500` before proof.
- `$99` middle rung is present.
- SEO content remains helpful and honest.
- Browser smoke test verifies fit finder, table CTA links, mobile sticky CTA.
