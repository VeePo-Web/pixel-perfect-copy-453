# Build: The Monthly Finance Desk — Hero (Final Copy Lock)

Replace the existing gaming Hero with a calm, premium, two-column finance hero using the user's exact copy verbatim. No "AI magic" language, no confetti, no gradient orbs.

## Layout

Two-column desktop, single-column mobile. Anchored inside the existing dark page shell.

```text
┌─────────────────────────────────────────────────────────────┐
│ EYEBROW · For serious small business owners                 │
│                                                             │
│ Stop Running Your Business        ┌────────────────────┐    │
│ From Your Bank Balance            │ Sample Bi-Weekly   │    │
│                                   │ Finance Briefing   │    │
│ [subheadline paragraph]           │                    │    │
│                                   │ • Cash Movement    │    │
│ ┌──────────────────────────────┐  │ • Revenue Trend    │    │
│ │ Describe your business…      │  │ • Expense Pattern  │    │
│ └──────────────────────────────┘  │ • Unusual Spend    │    │
│ Example: "I run a 12-person…"     │ • Questions to …   │    │
│                                   │ • Decisions to …   │    │
│ [Generate Sample Finance Brief.]  │                    │    │
│ [Use Demo Business Data]          └────────────────────┘    │
│                                   [badge][badge][badge]     │
│ No bank connection required…                                │
└─────────────────────────────────────────────────────────────┘
```

On click of either CTA → the right panel fades through the 4-line loading sequence, then renders the full Sample Bi-Weekly Finance Briefing inline (replacing empty-state sections). After the briefing settles, a post-demo conversion block reveals beneath the briefing panel.

## Copy lock (verbatim from user message)

Every line — eyebrow, slogan, headline, subheadline, prompt placeholder, example prompt, both CTAs, trust microcopy, panel label, six empty-state sections, three badges, four loading lines, the five briefing sections, the post-demo headline + body + two CTAs + microcopy, and the tighter mobile variant — used exactly as written. No paraphrasing.

## Components to create

- `src/components/hero/FinanceHero.tsx` — orchestrates state (`idle` → `loading` → `briefing`), holds copy constants, responsive layout.
- `src/components/hero/BriefingPanel.tsx` — right column. Renders empty-state sections, loading sequence, or filled briefing based on state. Calm fade transitions (300ms), no bounce.
- `src/components/hero/PromptComposer.tsx` — textarea + example caption + primary/secondary CTAs + trust microcopy.
- `src/components/hero/PostDemoCTA.tsx` — reveals after briefing renders.
- `src/content/hero-copy.ts` — single source of truth for all strings (desktop + mobile variants).

## Wiring

- Replace `<Hero />` in `src/App.tsx` with `<FinanceHero />`. Remove old `Hero.tsx`, gaming video assets stay untouched (other sections still reference theme; out of scope).
- Mobile (<768px): swap to the tighter mobile copy block from the spec; stack composer above the briefing panel; briefing panel collapses to a single card preview until CTA clicked.
- Reduced motion: replace fades with instant swaps; loading lines render as a static list, then briefing.

## Visual system

- Background: existing dark charcoal page surface.
- Type: existing site fonts; headline uses the display weight, body uses the regular sans. No serif.
- Accent: champagne gold for the primary CTA, eyebrow underline, and briefing dollar figures. Bronze rim on the briefing panel edge. No purple, no neon, no gradient blobs.
- Inputs/buttons: shadcn primitives, semantic tokens only (no hardcoded hex in components).
- Briefing panel: smoked-glass card (`bg-card/60 backdrop-blur`), thin 1px champagne-tinted border, soft inner shadow.

## Out of scope (this build)

- The Kling backdrop loop, the 4-reel Zentry-style click-to-expand mechanic, real backend submission of the prompt, application/onboarding flow, About/Features/Story/Contact section rewrites. Those land in follow-up turns.

## Acceptance

- Every string on the new hero matches the user's copy block character-for-character.
- Clicking either CTA runs the 4-line loading sequence then renders the full sample briefing in the right panel.
- Post-demo CTA block appears beneath the briefing once it's rendered.
- Mobile <768px uses the tighter mobile copy variant.
- No "AI," "magic," "supercharge," confetti, or gradient-orb language anywhere on the hero.
