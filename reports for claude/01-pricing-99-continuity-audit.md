# Pricing Page `$99/mo` Continuity Audit

> **For Claude / Claude Code only:** This is an audit and execution handoff report. Do not treat it as public-facing copy or runtime documentation.

## Current-State Diagnosis

Route: `#/pricing`.

Current implementation is spread across `src/components/pricing/PricingPage.tsx`, `src/components/pricing/content.ts`, and pricing parts. The page currently gives major weight to the `$1,500/mo Monthly Finance Desk`, including CTAs like `Apply for the Monthly Finance Desk`. That conflicts with the new priority: convert template and proof-page visitors into `$99/mo Auto-Filled Reports`.

Primary problem: the page is selling the backend offer too early. It must instead sell the continuity belief: automation of the same templates is worth `$99/mo`.

## Prompt Requirements To Enforce

- Page job: convert template users into `$99/mo` subscribers.
- Hero line: `Free templates. $99 to have them filled for you. $1,500 to have them read with you.`
- The `$99 Spotlight` is the visual hero of the page.
- CTA copy for the dominant action: `Auto-fill my reports`.
- `$1,500` appears only as an application block or ladder slot.
- Do not use `Buy now`, `Subscribe`, `Get started`, or `Apply for the Monthly Finance Desk` as the page-dominant CTA.
- Sticky mobile CTA: `Auto-fill my reports`.

## Required CTA Hierarchy

- Primary page CTA: `Auto-fill my reports`.
- Secondary action: `Apply for the Desk`, only inside the `$1,500` application block and ladder strip.
- Tertiary action: `Get the free templates`, only as fallback or ladder entry.
- Never place `$99` and `$1,500` as equal-weight cards above the fold.

## Brunson Rationale

This is the Value Ladder conversion step where a lead becomes a buyer. The free vault creates ownership of the manual workflow. Pricing must create the epiphany that the obvious next step is not advice yet, but automation of the templates the visitor already understands. The `$1,500` offer should make the `$99` plan feel practical, not distract from it.

## Section-By-Section Claude Instructions

### 1. Hero - Reframe

Claude must output the pre-build block before coding.

- Ladder rung: continuity.
- Belief: there is a clear ladder from free structure, to `$99` automation, to human interpretation.
- Primary CTA: none in hero.
- Secondary action: none.
- Visual format: Pattern A, but with no hero buttons; use a calm value-ladder visual or three-line pricing thesis.
- Objection killed: `Which offer is right for me?`
- Proof element: simple ladder framing with prices and roles.

Acceptance:

- Exactly one `h1`.
- No button above the fold.
- `$99` is visually centered as the next logical step.
- `$1,500` reads as ascension, not checkout.

### 2. `$99 Spotlight` - Anchor `#auto-fill`

Claude must output the pre-build block before coding.

- Ladder rung: continuity.
- Belief: automation of these exact templates is worth `$99/mo`.
- Primary CTA: `Auto-fill my reports`.
- Secondary action: optional text link to sample briefing only.
- Visual format: Pattern E stacked offer card.
- Offer stack must include: auto-filled reports, cash flow summary, expense change report, subscription tracker, revenue snapshot, monthly PDF briefing, owner action list, spreadsheet export.
- Objection killed: `Will this save enough time to justify $99?`
- Proof element: the stack is specific and tied back to templates.

Acceptance:

- This is the most visually important section on the page.
- CTA is gold-filled and says exactly `Auto-fill my reports`.
- Guarantee line appears directly under CTA: `Try one month. Cancel before your next billing cycle.`
- No `$1,500` CTA in this section.

### 3. Why `$99` Makes Sense

Claude must output the pre-build block before coding.

- Ladder rung: continuity.
- Belief: paying `$99` is cheaper than spending owner time rebuilding reports manually.
- Primary CTA: none or a tertiary in-section text return to `#auto-fill`.
- Visual format: compact calculator-style row, not a chart.
- Required copy idea: `~3 hours/month manually. $99/mo automated. You decide what your time is worth.`
- Objection killed: price/value.
- Proof element: time-cost comparison.

Acceptance:

- No heavy graph.
- No second gold CTA.
- Feels banker-grade, not SaaS growth-hacky.

### 4. Ladder Strip

Claude must output the pre-build block before coding.

- Ladder rung: continuity with ascension context.
- Belief: `$99 Reports` is the recommended middle step.
- Primary CTA: `Auto-fill my reports` on the `$99` card only.
- Secondary action: `Apply for the Desk` on the `$1,500` card, lower visual weight.
- Visual format: Pattern F.
- Cards: Templates, Setup Kit, `$99 Reports`, `$1,500 Desk`, Custom.
- Objection killed: `Should I skip to the premium Desk?`
- Proof element: each card states the role it plays.

Acceptance:

- `$99 Reports` is 1.15x visual emphasis with gold border.
- `$1,500` CTA says `Apply for the Desk`, not buy/checkout.
- Setup Kit slot stays present but clearly phase 2.

### 5. Cost Of Wrong Decision

Claude must output the pre-build block before coding.

- Ladder rung: backend bridge.
- Belief: automation catches small leaks; human review is for bigger decisions.
- Primary CTA: none or tertiary `See how auto-fill works`.
- Visual format: light/dense contrast section with two concise cost examples.
- Required copy idea: `One missed subscription costs $400. One mis-timed hire costs $40,000. The Desk exists for the second one.`
- Objection killed: `Why does the Desk exist if $99 exists?`
- Proof element: concrete risk examples.

Acceptance:

- This bridges to `$1,500` without making it the page's main sale.
- No fearmongering or exaggerated urgency.

### 6. `$1,500 Desk` Application Block

Claude must output the pre-build block before coding.

- Ladder rung: backend.
- Belief: some decisions need a human to read the numbers with you.
- Primary CTA: `Apply for the Desk`.
- Visual format: Pattern E, but lower dominance than `$99 Spotlight`.
- Required framing: `We take a limited number of owners per month.`
- Objection killed: `Is this a checkout?`
- Proof element: application questions live on `#/apply`.

Acceptance:

- No payment language.
- CTA routes to `#/apply`.
- This section feels selective and calm.

### 7. FAQ

Claude must output the pre-build block before coding.

- Ladder rung: continuity.
- Belief: `$99` is low-friction, cancellable, and compatible with existing bookkeepers.
- Primary CTA: none.
- Visual format: concise three-question FAQ.
- Required objections: cancellation, security, existing bookkeeper.
- Proof element: direct answers under 3 lines each.

Acceptance:

- Exactly three core objections.
- No sprawling FAQ that steals attention from `$99`.

### 8. Closing CTA

Claude must output the pre-build block before coding.

- Ladder rung: continuity.
- Belief: the next step is having the reports filled monthly.
- Primary CTA: `Auto-fill my reports`.
- Secondary action: none.
- Visual format: Pattern B centered squeeze/close.
- Objection killed: final price friction with guarantee microcopy.
- Proof element: repeat offer stack in compressed form or security note.

Acceptance:

- Single gold button.
- No `$1,500` CTA.
- Sticky mobile CTA also says `Auto-fill my reports`.

## Mobile / Sticky CTA Requirements

- Mobile sticky CTA appears after hero scroll.
- Label: `Auto-fill my reports`.
- Link target: `#/pricing#auto-fill` or equivalent hash/anchor behavior.
- Do not switch sticky CTA to application later on the page.

## Page Acceptance Checklist

- Dominant page CTA repeated 2-4 times: `Auto-fill my reports`.
- `$99` is the hero product.
- `$1,500` is clearly ascension/application only.
- Free templates are fallback, not a competing main choice.
- Build and lint run after changes.
- Browser smoke test confirms no console errors and one `h1`.
