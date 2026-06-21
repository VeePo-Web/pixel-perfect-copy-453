# Home Page Bait Front Door Audit

> **For Claude / Claude Code only:** This is an audit and execution handoff report. Do not treat it as public-facing copy or runtime documentation.

## Current-State Diagnosis

Route: `#/`.

Current home is built from `FinanceHero` plus `HowItWorks`. It currently leads with sample briefing/application energy and contains a custom hero nav in addition to `GlobalTopBar`. It also has duplicate `h1` output. This conflicts with the conversion prompt: the homepage must sell the free template vault only and route visitors into the funnel.

Primary problem: the homepage is trying to sell proof and premium too early. It must become a bait-first front door.

## Prompt Requirements To Enforce

- Page job: make visitors want the free templates and feel the manual pain.
- Do not sell `$1,500` on the homepage.
- Primary CTA: `Get the free templates`.
- Secondary text link: `See a sample briefing`.
- `$99` appears only once in the epiphany bridge.
- Every page must use existing `GlobalTopBar`; no custom `HeroNav`.
- Closing CTA: email-only form for free templates.

## Required CTA Hierarchy

- Dominant page CTA: `Get the free templates`.
- Secondary action: `See a sample briefing`, text link only.
- Soft bridge: `See how auto-fill works`, only in the `$99` epiphany section.
- No application CTA except perhaps footer-level tertiary after the page is rebuilt, and only if it does not compete.

## Brunson Rationale

The homepage is the front door and squeeze-preframe. Its job is not to close the most expensive offer; it is to name the manual pain, give the visitor a low-friction win, and create a path where the `$99` offer feels like the next step after they imagine maintaining templates manually.

## Section-By-Section Claude Instructions

### 1. Hero - Bait Promise

Claude must output the pre-build block before coding.

- Ladder rung: bait.
- Belief: the business is not unclear; the financial view is unorganized.
- Primary CTA: `Get the free templates`.
- Secondary action: `See a sample briefing`.
- Visual format: Pattern A with layered previews of three template thumbnails.
- Required headline: `Your business finances are not unclear. They are just unorganized.`
- Objection killed: `I already have data, so why do I need this?`
- Proof element: cash flow, expense leak, owner decision sheet thumbnails.

Acceptance:

- Remove custom `HeroNav`; rely on `GlobalTopBar`.
- One `h1` only.
- No dashboard mockup.
- No video.
- No `Apply for the Desk` above fold.

### 2. Manual Pain Reveal

Claude must output the pre-build block before coding.

- Ladder rung: bait.
- Belief: the owner has the data but not the time or structure.
- Primary CTA: none.
- Secondary action: none.
- Visual format: Pattern C three-column before state.
- Required scenarios: bank tabs open, spreadsheet half-filled, sticky notes.
- Objection killed: `Maybe I just need to work harder.`
- Proof element: familiar manual finance mess.

Acceptance:

- Pure agitation.
- No CTA.
- Calm, not shaming.

### 3. What's In The Vault

Claude must output the pre-build block before coding.

- Ladder rung: bait.
- Belief: the vault contains the practical monthly finance structure.
- Primary CTA: `Get the free templates`.
- Secondary action: none.
- Visual format: Pattern C grid with seven document thumbnails.
- Each template title states the decision it answers.
- Objection killed: `What exactly am I getting?`
- Proof element: visible template thumbnails with decision labels.

Acceptance:

- Document thumbnails, not icons.
- CTA repeats once.
- No `$99` yet unless the user has seen the manual value.

### 4. Epiphany Bridge To `$99`

Claude must output the pre-build block before coding.

- Ladder rung: continuity bridge.
- Belief: once you see the templates, the next step is having them filled monthly.
- Primary CTA: `See how auto-fill works`.
- Secondary action: none.
- Visual format: Pattern D or light bridge section.
- Required headline: `Use them free. Or have them filled for you every month.`
- Objection killed: `Why would I pay after getting templates?`
- Proof element: before/after manual vs auto-filled templates.

Acceptance:

- This is the only homepage place `$99` appears.
- CTA routes to `#/pricing#auto-fill`.
- Not a buy button.

### 5. Founder Trust Strip

Claude must output the pre-build block before coding.

- Ladder rung: bait trust.
- Belief: the templates come from a serious finance operator.
- Primary CTA: none.
- Visual format: one-line strip with one portrait placeholder if available.
- Required credential: Chris Sam, institutional finance background.
- Objection killed: `Who made this?`
- Proof element: founder credential.

Acceptance:

- No logos wall.
- No Goldman endorsement claim.

### 6. Security One-Liner

Claude must output the pre-build block before coding.

- Ladder rung: continuity trust.
- Belief: future bank connection is read-only and controlled.
- Primary CTA: text link to `#/security-faq`.
- Visual format: simple trust line.
- Required copy: `Read-only bank connection. We never move money.`
- Objection killed: bank access anxiety.
- Proof element: link to security FAQ.

Acceptance:

- Does not overtake bait CTA.
- No unverified compliance badges.

### 7. Closing Bait CTA

Claude must output the pre-build block before coding.

- Ladder rung: bait.
- Belief: the right next step is getting the free vault.
- Primary CTA: `Get the free templates`.
- Secondary action: none.
- Visual format: Pattern B full-width ivory close.
- Form: email-only or first-name/email depending existing template lead flow; no phone, no business name.
- Objection killed: final friction.
- Proof element: `No phone. No credit card.`

Acceptance:

- Single gold button.
- No application CTA.
- Sticky mobile CTA says `Get the free templates`.

## Mobile / Sticky CTA Requirements

- Sticky CTA: `Get the free templates`.
- Sticky should appear after hero scroll.
- It should not rotate to sample briefing or application.

## Page Acceptance Checklist

- Homepage sells bait only.
- `$99` appears once, in the epiphany bridge.
- `$1,500` is absent or footer-level only.
- One `h1`.
- Existing `GlobalTopBar` only.
- No legacy game/video assets remain in the active home experience.
