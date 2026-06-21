# Security FAQ Objection-Killer Audit

> **For Claude / Claude Code only:** This is an audit and execution handoff report. Do not treat it as public-facing copy or runtime documentation.

## Current-State Diagnosis

Route: `#/security-faq`.

Current implementation is extensive and trust-oriented. It already covers preview, application, Plaid, privacy, FAQ, product boundaries, and sticky CTA. But it is oriented around applying for the Monthly Finance Desk. Since `$99/mo` auto-filled reports are now the main target, security must remove the bank-access objection specifically for the `$99` continuity step.

Primary problem: security reassurance is broad, but closing behavior should match visitor intent and should support `$99` checkout when the visitor came from pricing.

## Prompt Requirements To Enforce

- Page job: remove bank-access objection.
- Hero sentence: `Read-only. We never move money. Here's exactly how it works.`
- Visual: 4-step trust flow diagram: Connect, Read, Categorize, Brief.
- Closing CTA depends on referrer:
  - From pricing: `Auto-fill my reports`.
  - From apply: `Continue my application`.
  - Default: `Generate sample briefing`.
- Use existing `GlobalTopBar`.

## Required CTA Hierarchy

- Referrer from pricing: primary `Auto-fill my reports`.
- Referrer from apply: primary `Continue my application`.
- Default: primary `Generate sample briefing`.
- Secondary fallback may be `Get the free templates`, but never above primary trust action.

## Brunson Rationale

This is objection handling at the point of highest friction. The visitor is not being persuaded from scratch; they are seeking permission to continue. The page must answer the objection in plain language, then return them to the exact ladder rung they came from.

## Section-By-Section Claude Instructions

### 1. Hero

Claude must output the pre-build block before coding.

- Ladder rung: continuity trust.
- Belief: bank connection is read-only and safe enough to continue.
- Primary CTA: default `Generate sample briefing`; dynamic close handles referrer later.
- Secondary action: optional `Get the free templates`.
- Visual format: Pattern A or trust-flow hero.
- Required headline: `Read-only. We never move money. Here's exactly how it works.`
- Objection killed: `Can you move my money?`
- Proof element: trust-flow preview.

Acceptance:

- No vague security theater.
- No unverified certifications.
- Clear read-only/no-money-movement claim.

### 2. Trust Flow Diagram

Claude must output the pre-build block before coding.

- Ladder rung: continuity trust.
- Belief: the data flow is understandable and bounded.
- Primary CTA: none.
- Visual format: 4-step diagram.
- Required steps: Connect, Read, Categorize, Brief.
- Objection killed: `What happens after I connect?`
- Proof element: each step has one plain-English explanation.

Acceptance:

- Four steps only.
- No complex architecture diagram.
- Mobile stacks cleanly.

### 3. No Upfront Commitment

Claude must output the pre-build block before coding.

- Ladder rung: bait / continuity trust.
- Belief: previewing or applying does not require bank login, payment, or sensitive documents.
- Primary CTA: none.
- Visual format: Pattern C three-card or six-card reassurance grid.
- Objection killed: `What do I need to give you before I know if this helps?`
- Proof element: explicit no bank/no payment/no documents statements.

Acceptance:

- Supports templates, sample briefing, and pricing visitors.
- Does not distract with premium application.

### 4. Plaid / Read-Only Explanation

Claude must output the pre-build block before coding.

- Ladder rung: continuity trust.
- Belief: read-only bank connection is a data pipe, not access to move money.
- Primary CTA: none.
- Visual format: calm explanation with hairline cards.
- Objection killed: credential and money-movement anxiety.
- Proof element: Plaid is read-only in product framing.

Acceptance:

- Do not claim certifications unless verified in repo.
- Do not show bank logos unless legally approved.

### 5. Product Boundaries

Claude must output the pre-build block before coding.

- Ladder rung: trust.
- Belief: GoldFin is honest about what it does and does not do.
- Primary CTA: none.
- Visual format: two-column does/does-not list.
- Objection killed: tax/legal/bookkeeping confusion.
- Proof element: clear boundaries.

Acceptance:

- Includes no tax, legal, investment, or bookkeeping cleanup replacement.
- Tone is calm, not defensive.

### 6. Referrer-Aware Closing CTA

Claude must output the pre-build block before coding.

- Ladder rung: dynamic.
- Belief: now that the objection is answered, return to the visitor's next step.
- Primary CTA:
  - pricing referrer: `Auto-fill my reports`
  - apply referrer: `Continue my application`
  - default: `Generate sample briefing`
- Secondary action: optional `Get the free templates`.
- Visual format: Pattern B centered close.
- Objection killed: final security hesitation.
- Proof element: repeat `Read-only. We never move money.`

Acceptance:

- `document.referrer` or internal navigation state determines CTA when feasible.
- Default must not be application.
- Mobile sticky CTA mirrors this logic.

## Mobile / Sticky CTA Requirements

- From pricing: sticky says `Auto-fill my reports`.
- From apply: sticky says `Continue my application`.
- Default: sticky says `Generate sample briefing`.
- Sticky CTA must not always say application.

## Page Acceptance Checklist

- Bank-access objection answered above the fold.
- Referrer-aware close works or degrades to sample briefing.
- `$99` path is supported directly.
- No unverified compliance or banking claims.
- Browser smoke test checks direct visit and visit from pricing.
