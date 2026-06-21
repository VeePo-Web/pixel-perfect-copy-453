# `$99/mo` Checkout Readiness Audit

> **For Claude / Claude Code only:** This is an audit and execution handoff report. Do not treat it as public-facing copy or runtime documentation.

## Current-State Diagnosis

This report is for Claude after the Pricing page has been rewritten around the `$99/mo Auto-Filled Reports` offer.

The repo currently has no real `$99/mo` checkout path.

Evidence from the current codebase:

- No Stripe or payment dependency appears in `package.json`.
- No checkout route exists in `src/App.tsx` or `useHashRoute`.
- The only existing thank-you route is `#/apply/thank-you`.
- Supabase currently stores `applications`, not subscriptions, purchases, customers, or checkout sessions.
- Existing pricing CTAs mostly route to `#/apply`, `#/templates`, `#/sample-briefing`, or `#/pricing`.
- `docs/conversion-prompt.md` says `$99 = checkout`, but also marks backend/schema changes and new routes as out of scope for that prompt.

Primary blocker: `Auto-fill my reports` cannot be a real revenue event until product/payment flow decisions are made. Claude must not pretend the `$99` subscription works if it only routes to an application or dead anchor.

## Funnel Risk

If Claude rebuilds Pricing perfectly but leaves `Auto-fill my reports` without a real next step, the page will create desire and then leak it. In Brunson terms, this breaks the Value Ladder at the buyer conversion point: the lead is ready to become a continuity buyer, but the funnel sends them sideways.

The immediate goal is not to build payments blindly. The goal is to make the next required decisions explicit and prevent Claude from hiding the gap behind copy.

## Required Claude Behavior

Claude must treat checkout as a separate implementation phase, not part of the Pricing UI rewrite unless explicitly authorized.

Before implementing any checkout code, Claude must output this pre-build block:

```text
PAGE:
SECTION:
LADDER RUNG SERVED:
BELIEF SOLD HERE:
PRIMARY CTA:
SECONDARY ACTION:
OBJECTION KILLED IN-SECTION:
PROOF ELEMENT IN-SECTION:
VISUAL FORMAT:
WHY THIS CONVERTS:
```

Claude must also state which checkout path is being implemented:

- External hosted checkout link.
- Embedded Stripe Checkout / Payment Link.
- Supabase Edge Function that creates checkout sessions.
- Temporary waitlist/application fallback.

If the choice is unknown, Claude must stop and ask. Do not invent a payment provider or subscription backend.

## Recommended `$99` Funnel Shape

Target path:

```text
Templates lead capture
→ Pricing #auto-fill
→ $99 checkout
→ $99 thank-you page
→ onboarding expectation
→ soft ascension to Apply for the Desk
```

This keeps the funnel clean:

- Free = email-only.
- `$99` = checkout.
- `$1,500` = application.

Never invert this by sending `$99` buyers through the `$1,500` application funnel.

## Phase 1 - Pricing CTA Interim Rule

Until real checkout exists, Claude should make the gap visible in the implementation notes and choose one temporary behavior.

Recommended temporary behavior:

- `Auto-fill my reports` routes to a stable placeholder anchor or route only if clearly labeled in comments as pending checkout.
- Better: route to a temporary `#/pricing#auto-fill` capture module if one already exists.
- Do not route `Auto-fill my reports` to `#/apply`; that teaches visitors that `$99` is actually a sales/application flow.

Acceptance:

- Every `Auto-fill my reports` CTA has an explicit destination.
- No `$99` CTA points to `#/apply`.
- Claude notes that checkout remains unimplemented.

## Phase 2 - Minimum Checkout Spec For Later Implementation

When the user authorizes payment implementation, Claude should build the smallest real subscription path:

- Payment provider: Stripe, unless the user gives another provider.
- Product: `$99/mo Auto-Filled Reports`.
- Button text remains `Auto-fill my reports`.
- Checkout type: hosted checkout is preferred for speed and trust.
- Success path: dedicated `$99` thank-you page, not `#/apply/thank-you`.
- Cancel path: return to `#/pricing#auto-fill`.
- Post-purchase copy: confirm purchase, explain what happens next, and softly bridge to the `$1,500` Desk application.

The `$99` thank-you page should not upsell aggressively. It should use the Brunson “thank-you page offer bridge” calmly:

- Confirm the buyer made the right decision.
- Set expectation for report setup.
- Offer a single soft ascension: `Want a human to read these with you? Apply for the Desk.`

## `$99` Thank-You Page Requirements

If Claude is later asked to build the thank-you page, use this structure:

1. **Purchase Confirmation**
   - Belief: the owner has taken the first serious step toward monthly financial rhythm.
   - Primary CTA: none.
   - Proof/objection killer: receipt/setup expectation.

2. **What Happens Next**
   - Belief: reports will be filled monthly through a clear setup process.
   - Primary CTA: setup/account action, if a real onboarding flow exists.
   - If onboarding does not exist, provide honest expectation copy rather than fake setup.

3. **Soft Desk Ascension**
   - Belief: automation organizes reports; the Desk helps interpret decisions.
   - Primary CTA: `Apply for the Desk`.
   - This is lower visual weight than the confirmation.

Acceptance:

- Does not introduce a second paid offer as if required.
- Does not imply human advisory is included in `$99`.
- Does not use urgency, scarcity, or pressure.

## Data And Backend Questions Claude Must Not Guess

Claude must ask before implementation if these are not already provided:

- Stripe account/product/price IDs.
- Whether the app is allowed to add a new route.
- Whether Supabase should store customer/subscription records.
- Whether webhook handling is required in this repo or handled externally.
- What happens operationally after purchase: manual onboarding, email automation, or dashboard.
- Whether buyer emails should enter an email sequence.

If answers are missing, Claude should produce an implementation plan and stop, not fake checkout.

## Conversion Copy Guardrails

Approved `$99` language:

- `Auto-fill my reports`
- `$99/mo Auto-Filled Reports`
- `Have these reports filled for you every month.`
- `Try one month. Cancel before your next billing cycle.`
- `Use them free. Or have them filled for you every month.`

Forbidden checkout language:

- `Subscribe now`
- `Buy now`
- `Get started`
- `Unlock`
- `Limited time`
- `Only X spots`
- Any implication that `$99` includes Chris reading the numbers personally.

## Stress-Test Checklist For Claude

Before claiming the `$99` funnel is ready:

- `Auto-fill my reports` has a real destination.
- Destination is not `#/apply`.
- Price and billing cadence are visible before payment.
- Cancellation reassurance appears next to the `$99` CTA.
- Security reassurance is within one scroll of the ask.
- Thank-you/success experience exists for `$99` buyers.
- `$1,500` ascension remains optional and application-based.
- `npm run build` passes.
- `npm run lint` passes or any pre-existing lint errors are explicitly documented.
- Browser test covers pricing CTA, checkout/success/cancel paths, and mobile sticky CTA.

## Final Recommendation

Claude should not build checkout in the same pass as the Pricing UI rewrite unless the user explicitly authorizes payment work.

Correct next operational sequence:

1. Rebuild Pricing around `$99`.
2. Audit Pricing against `01-pricing-99-continuity-audit.md`.
3. Decide the real checkout mechanism.
4. Build `$99` checkout and thank-you page.
5. Then rebuild Templates to feed the now-working `$99` path.
