# Templates Page Squeeze And `$99` Upsell Audit

> **For Claude / Claude Code only:** This is an audit and execution handoff report. Do not treat it as public-facing copy or runtime documentation.

## Current-State Diagnosis

Route: `#/templates`.

Current implementation has useful assets: template data, cards, preview modal, lead-capture modal, category filters, recommended paths, comparison sections, FAQ, and mobile sticky CTA. But it is too broad. It gives `Generate Sample Finance Briefing` and `Apply for the Monthly Finance Desk` too much early visibility, which weakens the page job: email capture and vault delivery.

Primary problem: the page is acting like a resource hub plus premium pitch. It must become a squeeze/delivery page that naturally creates the `$99` auto-fill epiphany.

## Prompt Requirements To Enforce

- Page job: email capture and template delivery.
- Hero must use centered squeeze format.
- Primary CTA: `Send me the vault`.
- Form friction: first name and email only in hero; no phone, no credit card.
- Template grid: all templates appear as document previews with decision-answer titles.
- Manual-to-automation reframe: free/manual vs `$99/mo`/0 hours.
- Sticky mobile CTA: `Send me the vault`.

## Required CTA Hierarchy

- Primary page CTA: `Send me the vault`.
- Secondary / bridge action: `See how auto-fill works`, text link or right-column-only CTA.
- Tertiary action: soft Desk link only near bottom.
- Never show `Apply for the Desk` as a primary templates-page CTA.

## Brunson Rationale

This is the squeeze page plus first Soap Opera setup. The visitor must receive value before being asked to upgrade. The manual use of the templates creates contrast: they now understand the structure, and the `$99` offer becomes relief from the work of maintaining it.

## Section-By-Section Claude Instructions

### 1. Hero - Squeeze

Claude must output the pre-build block before coding.

- Ladder rung: bait.
- Belief: the free vault gives the missing monthly finance structure.
- Primary CTA: `Send me the vault`.
- Secondary action: none above fold.
- Visual format: Pattern B centered squeeze, max-width 56ch.
- Form: first name and email only.
- Required microcopy: `First name and email. No phone. No credit card.`
- Objection killed: email friction.
- Proof element: name the vault contents in a concise line.

Acceptance:

- No `Apply for the Desk` above fold.
- No sample briefing button above fold.
- Form is inline and visually calm.
- One `h1`.

### 2. Template Grid

Claude must output the pre-build block before coding.

- Ladder rung: bait.
- Belief: each template answers a real owner decision.
- Primary CTA: `Get` or `Send me the vault` depending modal state.
- Secondary action: `Preview`.
- Visual format: Pattern C grid using document thumbnails, not icons.
- Each card title should be the decision it answers, such as `Where did the money go?`
- Objection killed: `Will these be useful to me?`
- Proof element: filled-in preview rows from existing template data.

Acceptance:

- Cards show concrete document-like previews.
- Hover/focus reveals `Preview` and `Get`.
- Keyboard users can access preview and get actions.
- Filters must not bury the seven core templates.

### 3. Manual-Pain-To-Automation Reframe

Claude must output the pre-build block before coding.

- Ladder rung: continuity bridge.
- Belief: using the templates manually proves why auto-fill is worth `$99/mo`.
- Primary CTA: `See how auto-fill works` on the right column only.
- Secondary action: none.
- Visual format: Pattern D two-column reframe.
- Left: `Use them yourself`, free, about 3 hours/month.
- Right: `Have them filled for you`, `$99/mo`, 0 hours.
- Objection killed: `Why pay after getting free templates?`
- Proof element: manual time estimate and repeated template names.

Acceptance:

- Left column has no CTA.
- Right column has the only action.
- The `$99` offer is framed as relief, not pressure.

### 4. Featured Template Spotlight

Claude must output the pre-build block before coding.

- Ladder rung: bait.
- Belief: the Cash Flow Forecast is valuable enough to want the full vault.
- Primary CTA: `Get the full vault`.
- Secondary action: none.
- Visual format: large filled-in document preview.
- Objection killed: `Are these just blank spreadsheets?`
- Proof element: real-looking filled cash flow example.

Acceptance:

- Treat the template as the product, not an icon.
- No premium Desk pitch in this section.

### 5. Soap-Opera Promise

Claude must output the pre-build block before coding.

- Ladder rung: bait.
- Belief: after opting in, the owner will learn how to use each template.
- Primary CTA: none.
- Secondary action: none.
- Visual format: light trust strip or simple sequence.
- Required copy idea: `Over the next 5 days we'll send one short email showing how owners use each template.`
- Objection killed: unsubscribe anxiety and `Will I know what to do with these?`
- Proof element: five-day email rhythm described plainly.

Acceptance:

- No CTA.
- No fake urgency.
- This sets up nurture without implementing emails.

### 6. Bridge To Desk / `$99` Soft Close

Claude must output the pre-build block before coding.

- Ladder rung: continuity, with backend awareness.
- Belief: when templates are too much to maintain manually, auto-fill is the next step; human review comes later.
- Primary CTA: text link `See how auto-fill works`.
- Secondary action: optional text link `Apply for the Desk`, lower weight and only after `$99` bridge.
- Visual format: simple line or restrained bridge block.
- Required copy idea: `When you're ready for a human to read your numbers with you, here's what the Desk does.`
- Objection killed: `Am I supposed to apply now?`
- Proof element: link to sample briefing or pricing.

Acceptance:

- Do not compete with `Send me the vault`.
- Desk is a soft educational path, not the page close.

### 7. Final CTA And Sticky Mobile CTA

Claude must output the pre-build block before coding.

- Ladder rung: bait.
- Belief: the right next step is receiving the vault.
- Primary CTA: `Send me the vault`.
- Secondary action: none.
- Visual format: Pattern B centered closing CTA.
- Objection killed: final email friction.
- Proof element: `No phone. No credit card.`

Acceptance:

- Sticky mobile CTA says `Send me the vault`.
- Sticky CTA opens the hero form or lead-capture modal.
- Do not change sticky label to sample briefing after download unless user has already opted in.

## Mobile / Sticky CTA Requirements

- Label before opt-in: `Send me the vault`.
- Target: hero form or lead modal.
- Avoid `Generate Sample Briefing` as default sticky label; that belongs on proof page.

## Page Acceptance Checklist

- Page has exactly one dominant CTA: `Send me the vault`.
- `$99` appears only after the visitor understands manual use.
- `$1,500` is text-level and late, if present at all.
- Email capture asks only for first name and email in the main squeeze.
- Browser smoke test confirms modal access on mobile and desktop.
