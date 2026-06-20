# Security & FAQ Page — Implementation Plan

Build the complete Security & FAQ page for Monthly Finance Desk at `#/security-faq`, matching the architecture of the existing Templates, Compare, and Three-Way-Compare pages. All copy is taken verbatim from the brief. No security claims beyond what the brief allows.

## Route & wiring

- Extend `src/components/apply/hooks/useHashRoute.ts` to add `'security-faq'` to `ApplyRoute`, parsed from `#/security-faq` (and aliases `#/security`, `#/faq`).
- Render `<SecurityFAQPage />` in `src/App.tsx` before the generic `apply` fallback.
- Add "Security & FAQ" links to the existing top bars used on adjacent pages: `TemplatesTopBar`, `PricingTopBar`, `CompareTopBar`, `ThreeWayTopBar`, and the `SampleBriefingPage` nav. New page ships with its own `SecurityFAQTopBar` mirroring the existing pattern (logo, in-page anchors, Apply CTA).

## File structure

All new files under `src/components/security-faq/`:

```text
SecurityFAQPage.tsx              # composes sections, sets <Helmet>, fires page_viewed
content.ts                       # trustFlowSteps, accessSequence, noUpfrontCards,
                                 # afterApplySteps, privacyPrinciples, featuredFAQ,
                                 # faqCategories[], faqItems[], productBoundaries,
                                 # sampleBriefingPreview, ctaRoutes
analytics.ts                     # 11 named event helpers (safe dataLayer/analytics push)
hooks/
  useDocumentHead.ts             # title, meta, canonical, FAQPage JSON-LD
  useFAQState.ts                 # search query, active category, open accordion id,
                                 # filtered items memo, deep-link hash sync
parts/
  SecurityFAQTopBar.tsx
  SecurityFAQHero.tsx            # eyebrow, H1, sub, CTAs, trust microcopy
  TrustFlowDiagram.tsx           # 6-step glass-card flow (Preview → … → Monthly Rhythm)
  AccessSequence.tsx             # Section 2 — 5-step timeline (horizontal desktop / vertical mobile)
  UpfrontRequirementsSection.tsx # Section 3 — 6 trust cards
  AfterApplySection.tsx          # Section 4 — 5-step post-application flow + reassurance card
  PlaidExplanationSection.tsx    # Section 5 — plain-English explanation + data-flow visual
  PrivacyPrinciplesSection.tsx   # Section 6 — 3 principles
  FeaturedFAQPreview.tsx         # Section 7 — 4 large accordion cards
  FAQHub.tsx                     # Section 8 — search + sticky category nav + accordions
  FAQCategoryNav.tsx             # sticky on desktop, horizontal chips on mobile
  FAQSearch.tsx                  # labeled input, instant client-side filter
  FAQAccordion.tsx               # accessible disclosure, one-open-per-category default
  ProductBoundariesSection.tsx   # Section 9 — two-column "does / does not" + disclaimer
  SecuritySampleBriefingPreview.tsx # Section 10 — mini briefing card
  SecurityFinalCTA.tsx           # Section 11
  MobileStickyCTA.tsx            # swaps Sample Briefing → Apply after FAQ scroll-past
```

## Section composition

Page renders, in order: TopBar → Hero (with TrustFlowDiagram) → AccessSequence → UpfrontRequirementsSection → AfterApplySection → PlaidExplanationSection → PrivacyPrinciplesSection → FeaturedFAQPreview → FAQHub → ProductBoundariesSection → SecuritySampleBriefingPreview → SecurityFinalCTA → MobileStickyCTA. Footer reuses whatever the adjacent pages use.

All headlines, subheadlines, eyebrows, CTAs, microcopy, card titles, step copy, FAQ questions/answers, principles, and boundary items are pulled from `content.ts` exactly as written in the brief — no rewording. Where the brief gives "safer language" for unverified topics (FAQ 5, 6, 36), we use the safe variant verbatim and avoid any encryption/certification claims.

## Interactions

- **FAQ search**: controlled input in `useFAQState`, lowercase-includes match across question + answer + category label. Empty query restores full list. No debounce needed — list is ~36 items.
- **Category filter**: chips/links call `setCategory(id)`; "All" option included. Selection updates URL hash (`#/security-faq#faq=security-privacy`) for deep linking without router reload.
- **Accordion**: one open per category by default. Each item has stable id `faq-<n>`; opening an item sets `location.hash` so individual questions are linkable.
- **Sticky desktop nav**: `position: sticky; top: 96px` inside FAQ hub grid (left column desktop, hidden mobile).
- **Mobile sticky CTA**: IntersectionObserver on FAQHub root — before hero out-of-view shows "Generate Sample Briefing"; once user scrolls past FAQ hub end shows "Apply for Monthly Finance Desk".
- **Trust card hover**: `transition` on border + shadow + translate-y-0.5; respects `prefers-reduced-motion` via `motion-safe:` Tailwind variants.
- **Reveal animations**: lightweight IntersectionObserver-driven opacity/translate, gated by `prefers-reduced-motion`.

## Visual system

Reuse existing tokens already established on Compare/Three-Way pages:

- Background: charcoal (`bg-background` deep charcoal token already set globally)
- Text: warm-white `text-foreground`, secondary `text-muted-foreground`
- Champagne/gold accents: existing `champagne` / `gold` tokens used on Compare
- Deep green for verified/safe states, blue for Plaid/data, amber for caution — all via existing semantic tokens (`text-deep-green`, `text-info`, `text-amber` if present; otherwise add HSL tokens to `index.css` and Tailwind config, never hardcoded hex in components)
- Glass trust cards: `bg-foreground/[0.02] border border-foreground/10 rounded-2xl backdrop-blur-sm`
- No new heavy assets. Trust-flow + Plaid data-flow are inline SVG.

## SEO

`useDocumentHead` sets:
- `<title>Security & FAQ | Monthly Finance Desk</title>`
- meta description verbatim from brief
- canonical → `https://pixel-perfect-copy-453.lovable.app/#/security-faq`
- og:title / og:url / og:type
- JSON-LD `FAQPage` schema generated from `faqItems` (all 36 Q&A)

Internal links rendered in `SoftConversionBridge`-style block and inline across sections to `#/sample-briefing`, `#/pricing`, `#/templates`, `#/apply`, `#/compare`. (`how-it-works` and `about` routes don't exist yet — those links are omitted to avoid 404s; noted as a TODO.)

## Analytics

`analytics.ts` exports 11 named helpers, each guarded `try { window.dataLayer?.push(...); window.analytics?.track(...); } catch {}`:

`security_faq_page_viewed, trust_flow_viewed, faq_search_used, faq_category_selected, faq_opened, plaid_section_viewed, sample_briefing_clicked_from_security_faq, apply_clicked_from_security_faq, templates_clicked_from_security_faq, compare_clicked_from_security_faq, final_security_cta_clicked`.

`trust_flow_viewed` and `plaid_section_viewed` fire via IntersectionObserver (once).

## Accessibility

- Single `<h1>` in hero, semantic `<section>` + `<h2>` per block
- Accordions: button with `aria-expanded`, `aria-controls`, panel with `role="region"` + `aria-labelledby`
- Search input has visible `<label>` (visually hidden if needed via `sr-only`)
- Category nav uses `role="tablist"` with arrow-key navigation, or simple buttons with `aria-pressed` (chosen: `aria-pressed` for simpler semantics with deep linking)
- All CTAs min 44px touch target via `min-h-11`
- Focus rings via existing `focus-visible:ring-2 focus-visible:ring-champagne` pattern
- Reduced motion: all reveal/hover transitions wrapped in `motion-safe:`
- Color is never the sole signal — active category has bg + border + text-weight change

## Performance

- 100% static content, no fetches
- All SVG inline (no image requests)
- No new dependencies — uses existing React, Tailwind, lucide-react icons already in project
- Search is in-memory `.filter()` over 36 items — no virtualization or debounce needed
- Single IntersectionObserver per visibility concern, disconnected after fire

## Constraints honored

- **No invented certs/claims**: every security statement is verbatim from brief's "safer language" list.
- **No fake badges**: trust visuals are typographic + iconographic only (lucide icons like `ShieldCheck`, `Lock`, `Eye`, `FileText` used semantically).
- **Disclaimer** appears subtly in ProductBoundariesSection and FAQ 25–28, never in hero.
- **Brand voice** preserved: calm, premium, plain-spoken — no "AI magic," no urgency, no fear.

## Verification

After implementation:

1. Confirm build passes (harness auto-runs).
2. Playwright smoke under `/tmp/browser/security-faq/`:
   - Navigate to `#/security-faq`, screenshot hero + check H1 text.
   - Type "plaid" into FAQ search, screenshot filtered list, assert ≥1 result.
   - Click "Pricing" category chip, assert URL hash updates and only pricing FAQs render.
   - Open FAQ 1, assert `aria-expanded="true"` and answer visible.
   - Mobile viewport (390×844): screenshot hero, scroll past FAQ, verify sticky CTA label swap.
   - Capture console errors (expect 0).
