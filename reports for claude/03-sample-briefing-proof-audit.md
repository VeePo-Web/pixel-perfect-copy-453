# Sample Briefing Proof Page Audit

> **For Claude / Claude Code only:** This is an audit and execution handoff report. Do not treat it as public-facing copy or runtime documentation.

## Current-State Diagnosis

Route: `#/sample-briefing`.

Current implementation has strong demo foundations: industry selector, prompt input, generation state, rendered report modules, privacy block, and mobile sticky CTA. It currently leans toward applying for the `$1,500/mo` Desk in several CTAs. For the new business target, it must prove that `$99/mo` auto-filled reports are valuable and real, while still showing the Desk as the human interpretation ascension.

Primary problem: proof is present, but the close should let visitors choose between free templates and `$99` automation after consuming proof.

## Prompt Requirements To Enforce

- Page job: prove the `$99` product is real and `$1,500` advisory is grounded.
- Page is a demo, not a sale.
- Hero CTA: `Generate sample briefing` or `Generate sample`.
- Loader should honestly name the labor removed by `$99`.
- Briefing report is rendered as product, not screenshot.
- Close has exactly two equal-weight cards: templates and `$99` auto-fill.
- Sticky mobile CTA: `Auto-fill my reports`.

## Required CTA Hierarchy

- Before report generation: `Generate sample briefing`.
- After proof: `Auto-fill my reports` is dominant sticky/mobile action.
- Closing cards: equal weight only between templates and `$99`.
- `$1,500` application should be educational or downstream, not equal in the close.

## Brunson Rationale

This is the proof engine. It creates the `I want my own version of that` moment. The generation sequence sells the hidden labor, the report sells the outcome, and the close lets the visitor self-select: free manual structure or automated monthly reports.

## Section-By-Section Claude Instructions

### 1. Hero

Claude must output the pre-build block before coding.

- Ladder rung: proof/continuity.
- Belief: a finished briefing can be previewed without bank access.
- Primary CTA: `Generate sample briefing`.
- Secondary action: optional `Use demo data`, lower weight.
- Visual format: Pattern A with prompt/industry input and report preview.
- Required headline: `See what a finished monthly briefing actually looks like.`
- Objection killed: `Do I need to connect my bank first?`
- Proof element: preview panel with real modules.

Acceptance:

- One `h1`.
- No bank connection required is visible near the ask.
- No `Apply for the Desk` as primary hero CTA.

### 2. Generation State

Claude must output the pre-build block before coding.

- Ladder rung: continuity.
- Belief: the `$99` plan removes real recurring labor.
- Primary CTA: none during loading.
- Visual format: honest 8-15 second loader with named steps.
- Required steps: categorize transactions, detect expense changes, draft plain-English summary.
- Objection killed: `What am I paying automation to do?`
- Proof element: visible workflow steps.

Acceptance:

- No hype copy.
- No `AI magic`.
- Respects reduced motion.

### 3. Briefing Report

Claude must output the pre-build block before coding.

- Ladder rung: proof/continuity.
- Belief: the output is understandable enough to be worth receiving monthly.
- Primary CTA: none inside the first report modules, except contextual module-level text if needed.
- Visual format: rendered report modules.
- Required modules: Executive Summary, Cash Movement, Revenue Trend, Expense Pattern, Unusual Spend, Concentration, Questions to Review, Decisions to Consider, Monthly Strategy Focus.
- Objection killed: `Is this just a dashboard?`
- Proof element: actual copy, figures, flags, and decisions.

Acceptance:

- Report reads like a product artifact.
- No screenshot-only treatment.
- `Concentration` module is present or explicitly merged into risk with a clear label.

### 4. What This Is Not

Claude must output the pre-build block before coding.

- Ladder rung: continuity trust.
- Belief: the product is honest about boundaries.
- Primary CTA: none.
- Visual format: restrained anti-hype block.
- Required copy: `This is not tax advice. This is not bookkeeping. This is the monthly clarity layer on top of either.`
- Objection killed: legal/accounting confusion.
- Proof element: clear boundaries.

Acceptance:

- Not defensive.
- No long legal dump.

### 5. Privacy And Trust Block

Claude must output the pre-build block before coding.

- Ladder rung: continuity trust.
- Belief: bank connection is controlled, read-only, and not required for preview.
- Primary CTA: optional text link to security FAQ.
- Visual format: three hairline-bordered cards.
- Objection killed: `Is my financial data safe?`
- Proof element: card sequence describing preview, connection, report.

Acceptance:

- Read-only reassurance appears near CTA path.
- No unverified compliance claims.

### 6. Two-Rung Close

Claude must output the pre-build block before coding.

- Ladder rung: bait and continuity.
- Belief: after seeing proof, visitors can choose manual templates or monthly automation.
- Primary CTA A: `Get the free templates`.
- Primary CTA B: `Auto-fill my reports`.
- Visual format: two equal-weight cards; this is the only allowed equal-weight choice.
- Objection killed: `Which next step is right for me?`
- Proof element: both cards refer back to the report just viewed.

Acceptance:

- Card A routes to `#/templates`.
- Card B routes to `#/pricing#auto-fill`.
- No third equal `$1,500` card.
- Sticky mobile CTA says `Auto-fill my reports`.

## Mobile / Sticky CTA Requirements

- Before sample is ready: sticky CTA may say `Generate sample briefing`.
- After sample is ready or after scrolling past report: sticky CTA should say `Auto-fill my reports`.
- Sticky must not switch to application CTA.

## Page Acceptance Checklist

- Proof comes before sale.
- Report modules are visible and readable on mobile.
- The final equal-weight exception is only templates vs `$99`.
- No hard sell to `$1,500`.
- Browser smoke test verifies loader, report reveal, and sticky CTA behavior.
