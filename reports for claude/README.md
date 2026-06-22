# Claude Start Here

> **For Claude / Claude Code only:** This folder is a conversion audit and execution handoff. These files are not public-facing content, not product copy, and not runtime documentation.

## Mission

Use these reports to rebuild the GoldFin / Monthly Finance Desk funnel around the `$99/mo Auto-Filled Reports` continuity offer, while keeping the `$1,500/mo Monthly Finance Desk` as a selective application-based ascension offer.

Claude should work page by page, section by section, using `docs/conversion-prompt.md` as the source of truth.

## What Claude Must Read First

Read these in order before changing code:

1. `docs/conversion-prompt.md`
2. `reports for claude/00-funnel-priority-index.md`
3. `reports for claude/01-pricing-99-continuity-audit.md`
4. `reports for claude/08-99-checkout-readiness-audit.md`

Before implementing Plaid, checkout, onboarding, or report automation, also read:

5. `reports for claude/09-plaid-biweekly-auto-fill-deep-research-prompt.md`
6. `reports for claude/09b-profit-driving-report-features-deep-research-prompt.md`
7. `reports for claude/12-profit-driving-report-feature-research.md`
8. `reports for claude/13-biweekly-money-making-report-blueprint.md`

## First Execution Target

Start with `#/pricing`.

The first implementation pass should rebuild Pricing around:

- Hero ladder reframe.
- `$99/mo Auto-Filled Reports` spotlight.
- `$99` value math.
- Ladder strip with `$99` emphasized.
- `$1,500` application block as ascension only.
- FAQ and close focused on `Auto-fill my reports`.

Do not start with Templates. The `$99` conversion page must exist before upstream pages feed it.

## Hard Rules

- Do not route `Auto-fill my reports` to `#/apply`.
- Do not make `$1,500/mo` the dominant page offer.
- Do not use `Get started`, `Subscribe now`, `Buy now`, `Learn more`, or `Book a demo`.
- Do not invent new page navs; use `GlobalTopBar`.
- Do not introduce dark mode, neon, purple, hype, countdowns, or false scarcity.
- Do not claim Stripe/payment/subscription readiness until a real checkout path exists.

## Required Section Block

Before Claude writes code for any section, output:

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

Claude must not move to the next section until the current section passes its report acceptance checks.

## Report Index

- `00-funnel-priority-index.md` - start here; execution order and universal rules.
- `01-pricing-99-continuity-audit.md` - first implementation target.
- `02-templates-squeeze-and-upsell-audit.md` - lead capture after Pricing works.
- `03-sample-briefing-proof-audit.md` - proof engine for `$99`.
- `04-home-bait-front-door-audit.md` - homepage as free-template front door.
- `05-security-objection-killer-audit.md` - trust and bank-access objections.
- `06-apply-backend-application-audit.md` - selective `$1,500` backend.
- `07-compare-routing-seo-audit.md` - education and routing pages.
- `08-99-checkout-readiness-audit.md` - blocker report for real `$99` checkout.
- `09-plaid-biweekly-auto-fill-deep-research-prompt.md` - deep research prompt for Plaid, biweekly spreadsheet auto-fill, and `$99` product value.
- `09b-profit-driving-report-features-deep-research-prompt.md` - companion prompt for business-value report features that help owners protect cash, profit, and decisions.
- `12-profit-driving-report-feature-research.md` - executed research output ranking the report features most likely to create business value.
- `13-biweekly-money-making-report-blueprint.md` - executed blueprint for the biweekly `$99/mo` report bundle and conversion translation.

## Verification After Claude Changes Code

For every changed page:

```bash
npm run build
npm run lint
```

Then browser-check:

- Desktop viewport.
- Mobile 375px.
- Tablet 768px.
- Exactly one `h1`.
- Sticky mobile CTA matches the page's dominant CTA.
- No console errors.
- No section presents free, `$99`, and `$1,500` as equal choices except the sample briefing close.
