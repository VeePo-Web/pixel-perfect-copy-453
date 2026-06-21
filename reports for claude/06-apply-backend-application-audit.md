# Apply Backend Application Audit

> **For Claude / Claude Code only:** This is an audit and execution handoff report. Do not treat it as public-facing copy or runtime documentation.

## Current-State Diagnosis

Route: `#/apply`.

Current implementation has a real 5-step application funnel, local draft state, validation, Supabase insert into `applications`, progress, and sticky finance preview. This is the strongest candidate for minimal changes. Since `$99/mo` is the primary target, the apply page should not become louder; it should remain selective and protect the premium `$1,500/mo` backend.

Primary problem: current copy still frames the application as a primary site conversion in too many upstream places. On the apply page itself, only small selectivity and success-page language changes are needed.

## Prompt Requirements To Enforce

- Keep the existing 5-step funnel structure.
- Step 1 headline: `Tell us about your business so we can decide if the Desk is a fit.`
- Add quiet line above Step 1: `We accept a limited number of owners per month.`
- Sticky finance preview stays on the right.
- Success page: `We'll review your application within 2 business days.`
- No instant booking.

## Required CTA Hierarchy

- Primary CTA on apply: continue/submit application actions.
- Secondary escape hatch: templates or sample briefing only for low-readiness visitors.
- No `$99` checkout on this page.

## Brunson Rationale

This is the backend application funnel. Scarcity here should be selectivity, not false urgency. The page qualifies, protects Chris's time, and makes the premium Desk feel considered. It should not compete with the `$99` automated offer; users arrive here only when ready for human interpretation.

## Section-By-Section Claude Instructions

### 1. Landing

Claude must output the pre-build block before coding.

- Ladder rung: backend.
- Belief: the Desk is selective and fit-based.
- Primary CTA: start application.
- Secondary action: `Generate sample briefing` or `Get the free templates`.
- Visual format: current application landing with restrained selectivity polish.
- Objection killed: `Is this checkout?`
- Proof element: no bank connection, no payment, fit review.

Acceptance:

- Do not expand into a long sales page.
- Add limited-owner line calmly.
- Keep sticky finance preview.

### 2. Step 1 - Fit

Claude must output the pre-build block before coding.

- Ladder rung: backend qualification.
- Belief: GoldFin decides fit with the owner.
- Primary CTA: continue.
- Secondary action: back.
- Required headline: `Tell us about your business so we can decide if the Desk is a fit.`
- Objection killed: `Will I be sold to immediately?`
- Proof element: fit questions and revenue stage.

Acceptance:

- The word `decide` is present.
- Low-fit path still points to templates without shaming.

### 3. Steps 2-4 - Business Context, Decisions, Readiness

Claude must output the pre-build block before coding each step if changing them.

- Ladder rung: backend qualification.
- Belief: the Desk is for owners with real financial decisions and monthly review willingness.
- Primary CTA: continue.
- Secondary action: back.
- Visual format: keep existing form structure.
- Objections killed: budget fit, current tools, monthly review discipline.
- Proof element: right-side finance preview reinforces value.

Acceptance:

- No extra fields unless necessary.
- No checkout language.
- Keep validation clear and human.

### 4. Review And Submit

Claude must output the pre-build block before coding.

- Ladder rung: backend qualification.
- Belief: submission starts a fit review, not payment.
- Primary CTA: submit application.
- Secondary action: edit answers.
- Objection killed: `What happens after I submit?`
- Proof element: next-step trust list.

Acceptance:

- Submit language can remain application-specific, but never `buy` or `checkout`.
- No booking calendar.

### 5. Success Page

Claude must output the pre-build block before coding.

- Ladder rung: backend trust.
- Belief: GoldFin reviews and responds within a bounded window.
- Primary CTA: optional `Generate sample briefing`.
- Secondary action: `Explore free templates`.
- Required message: `We'll review your application within 2 business days.`
- Objection killed: `What now?`
- Proof element: timeline with fit review.

Acceptance:

- No instant booking.
- No payment ask.
- Keep selective tone.

## Mobile / Sticky CTA Requirements

- Application funnel does not need the same marketing sticky CTA.
- Sticky finance preview can remain desktop/right rail.
- On mobile, prioritize form completion and clear progress.

## Page Acceptance Checklist

- Existing 5-step structure remains.
- Application remains backend, not main funnel sale.
- Success page gives 2-business-day review expectation.
- Low-fit visitors can return to templates.
- Supabase insert behavior is not broken.
