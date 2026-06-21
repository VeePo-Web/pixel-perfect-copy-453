# Claude Funnel Priority Index

> **For Claude / Claude Code only:** This is an audit and execution handoff report. Do not treat it as public-facing copy or runtime documentation.

## Purpose

This folder is the handoff package for Claude. Its job is to audit, stress test, and instruct the rebuild of the GoldFin / Monthly Finance Desk funnel without guessing. Treat `docs/conversion-prompt.md` as the source of truth where it conflicts with older persona docs or current implementation.

The business target is the `$99/mo Auto-Filled Reports` continuity offer. The `$1,500/mo Monthly Finance Desk` remains an ascension/application offer, not the main conversion event.

## Non-Negotiable Claude Rules

Before writing or changing any code for a section, Claude must output this block:

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

Claude must not move to the next section until the current section passes:

- One belief.
- One dominant CTA.
- Proof or objection-killer in or near the section.
- CTA copy from the approved bank in `docs/conversion-prompt.md`.
- Existing `GlobalTopBar` only; no invented page navs.
- Warm white / ivory, champagne gold, deep ink.
- No dark mode, no neon, no purple, no hype.
- No generic CTAs like `Get started`, `Buy now`, `Subscribe now`, `Learn more`, or `Book a demo`.
- Mobile review at 375px and 768px.

## Adapted Execution Order

The original prompt starts with `/templates`, then `/`, then `/sample-briefing`, then `/pricing`. Because the primary business target is now `$99/mo`, execute in the order below.

1. `#/pricing`
   - Rebuild first because it is the continuity-sale page.
   - Make `$99/mo Auto-Filled Reports` the visual hero.
   - Keep `$1,500/mo` as an application ascension, never a checkout offer.

2. `#/templates`
   - Rebuild second because it feeds the `$99` offer.
   - Make email capture and template delivery the page job.
   - Bridge template users to `See how auto-fill works`.

3. `#/sample-briefing`
   - Rebuild third because it proves the automation and interpretation layer.
   - Make the finished briefing feel like the artifact the `$99` plan produces.
   - Close with equal weight only between templates and `$99`.

4. `#/`
   - Rebuild fourth because the homepage should be the free-template front door.
   - Stop selling `$1,500` above the fold.
   - Include only one soft `$99` bridge after manual pain is established.

5. `#/security-faq`
   - Rebuild fifth because bank-access trust affects the `$99` checkout.
   - Default close should be low-risk unless referrer implies otherwise.

6. `#/apply`
   - Polish sixth because it is backend qualification.
   - Do not turn it into the main sale.

7. `#/compare` and three-way compare
   - Rework last because these are education and SEO routers.
   - Route problem-aware users to templates, sample briefing, or apply based on intent.

## Current System Diagnosis

- Current app is Vite + React + Tailwind with hash routes.
- `src/App.tsx` wraps pages with `GlobalTopBar`, but the home hero also contains a custom `HeroNav`; Claude should remove that during the home rebuild.
- Pricing and many CTAs still favor `$1,500/mo Monthly Finance Desk`.
- Template lead capture appears front-end only; this reporting pass does not add backend behavior, but Claude should design the page copy as if the vault delivery is real.
- Homepage currently renders more than one `h1`; Claude must fix when rebuilding home.
- Sample briefing page is local demo/proof content; it should be positioned as proof for `$99` and `$1,500`, not a hard sell.

## Universal Test Plan For Claude After Each Page

Run:

```bash
npm run build
npm run lint
```

Then browser-check:

- Desktop primary viewport.
- Mobile 375px.
- Tablet 768px.
- Exactly one `h1` on the page.
- Sticky mobile CTA matches the page dominant CTA.
- No section presents free, `$99`, and `$1,500` as equal choices except the sample briefing close.
- `$99` action language says `Auto-fill my reports`, not `Subscribe`, `Buy now`, or `Get started`.
- `GlobalTopBar` is present and no page-specific replacement nav is added.
- No console errors on the rebuilt route.

## Report Map

- `01-pricing-99-continuity-audit.md`: first implementation target and main revenue page.
- `02-templates-squeeze-and-upsell-audit.md`: lead capture and `$99` bridge.
- `03-sample-briefing-proof-audit.md`: proof engine for automated reports.
- `04-home-bait-front-door-audit.md`: front door that sells the bait only.
- `05-security-objection-killer-audit.md`: bank-access and trust objections.
- `06-apply-backend-application-audit.md`: selective `$1,500` backend.
- `07-compare-routing-seo-audit.md`: education and SEO routing pages.
- `08-99-checkout-readiness-audit.md`: post-pricing blocker report for turning `Auto-fill my reports` into a real `$99/mo` subscription path.
- `09-plaid-biweekly-auto-fill-deep-research-prompt.md`: deep research prompt for Plaid, biweekly spreadsheet auto-fill, competitor benchmarks, and making the `$99/mo` product materially valuable.
- `09b-profit-driving-report-features-deep-research-prompt.md`: companion prompt for finding report features that help owners protect cash, improve margins, catch leakage, and make higher-value decisions.
