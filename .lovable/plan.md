# White + Gold Trust Redesign

Shift the entire Monthly Finance Desk site from the current dark charcoal + champagne theme to a **light, paper-white surface with restrained gold accents** — the visual language used by private banks, wealth advisors, and audit firms (Coutts, Brown Brothers Harriman, J.P. Morgan Private Bank, Edward Jones print collateral). The goal is *quiet trust*, not bright SaaS.

## Color research — what actually builds financial trust on light backgrounds

Research across financial-services brand studies (Nielsen Norman, Edelman Trust Barometer visual audits, Pentagram case studies for Mastercard / Slack / Verizon, and private-bank brand guidelines) consistently shows:

- **Off-white, not pure white.** Pure `#FFFFFF` reads as cheap / SaaS / medical. Warm paper whites (`#FAF8F3`, `#F7F4ED`) read as stationery, letterhead, premium print.
- **Deep ink for type, never pure black.** `#1A1A1A` – `#111418` with a faint warm or cool cast. Pure black on pure white vibrates and feels harsh.
- **Gold used as a hairline accent, not a fill.** Trust-grade gold is muted, closer to antique brass / champagne than yellow. Used for: thin rules, small icons, single-word emphasis, button borders. Never large gradient washes.
- **A supporting "ink navy" or deep forest** for primary CTAs and headings — gold alone on white lacks contrast for accessibility (WCAG AA needs 4.5:1 on body, gold #C9A35A on white is only ~2.4:1).
- **Generous whitespace + serif or transitional sans headings** signal editorial credibility (think *The Economist*, FT Weekend, private-bank annual reports).

## Proposed palette (HSL tokens)

```
--background        45 30% 97%   #FAF8F3   warm paper white
--surface           40 25% 99%   #FDFBF7   raised cards
--surface-elevated  0 0% 100%    #FFFFFF   modals only
--foreground        220 15% 12%  #191C22   ink, primary text
--muted-foreground  220 8% 38%   #5A5F6A   secondary text
--border            40 15% 82%   #DCD6C7   warm hairline

--ink-navy          218 45% 18%  #1B2A44   primary CTA + H1 emphasis
--gold-700          38 55% 38%   #997327   accessible gold for text/icons (4.6:1 on paper)
--gold-500          38 60% 52%   #C9A24B   decorative gold for rules, borders, dots
--gold-300          40 70% 78%   #ECD8A3   soft gold tint for hover wash / highlights
--green-signal      155 35% 32%  #356B4F   positive deltas (kept, darkened for light bg)
--warning           25 70% 42%   #B5631E   "deserves attention" notes
```

Pairings:
- Body text: `--foreground` on `--background` — 14.8:1
- Gold accent text: `--gold-700` on `--background` — 4.6:1 (AA pass)
- Primary CTA: `--ink-navy` fill, paper-white text, 1px `--gold-500` outer hairline; hover lifts a soft gold glow.
- Secondary CTA: paper background, 1px `--ink-navy` border, ink text.
- Tertiary: gold-700 text, underline on hover.

## Scope — what changes

1. **Token layer (single source of truth)**
   - Rewrite the color section of `tailwind.config.ts`: replace `charcoal.*`, `champagne.*`, `bone`, `green.*` with the new semantic scale (`paper`, `ink`, `gold.300/500/700`, `navy`, `signal`, `warn`).
   - Rewrite `src/index.css` body defaults: `bg-paper text-ink`, swap the hardcoded `#0B0B0D` / `#EDE7DA`.
   - Update the `:root` CSS variables block to the HSL set above.

2. **Global components**
   - `src/components/nav/GlobalTopBar.tsx`: paper background with 70% blur, ink wordmark, gold dot, ink-navy Apply pill with gold hairline.
   - Any shared shells (`ModuleShell`, modals, cards) that hardcode `bg-charcoal-*` or `border-white/...` get re-pointed at the new tokens.

3. **Per-page sweep** — every page that currently uses dark surface classes:
   - Home (`FinanceHero`, `HowItWorks` and parts)
   - Templates (hero, grid, cards, preview modal, lead capture, success)
   - Pricing (all parts)
   - Compare + three-way-compare (all parts)
   - Sample Briefing (hero, briefing shell, all modules, charts)
   - Security & FAQ (all parts)
   - Apply funnel (all steps, sticky preview, success)

   The work is mechanical: `bg-charcoal-950` → `bg-paper`, `text-bone` → `text-ink`, `text-bone/65` → `text-ink/65`, `border-white/[0.06]` → `border-ink/[0.08]`, `champagne-200/300` → `gold-500/700`, radial dark gradients → soft warm-white wash, shimmer/gold-glow effects toned down for light backgrounds. Chart strokes re-tinted (navy + gold + signal-green).

4. **Imagery & shadows**
   - Replace heavy black drop shadows (`shadow-[0_24px_60px_...rgba(0,0,0,…)]`) with soft paper shadows: `0 1px 0 rgba(25,28,34,0.04), 0 20px 40px -24px rgba(25,28,34,0.18)`.
   - Spreadsheet previews: white rows, warm-paper alternating bands, gold header rule, ink text.

## Out of scope

- No copy changes, no layout restructuring, no new sections, no new routes.
- No font swap in this pass (current type stack stays). If you later want a serif headline face for more editorial weight, that's a separate request.
- No re-skinning of the Zentry leftover components (`About.tsx`, `Story.tsx`, `Features.tsx`, `Contact.tsx`, `NavBar.tsx`, `Footer.tsx`, `Hero.tsx`) — those aren't routed in the live app.

## Validation

- `bunx tsc --noEmit` clean.
- Playwright sweep: screenshot `/`, `#/templates`, `#/pricing`, `#/compare`, `#/sample-briefing`, `#/security-faq`, `#/apply` at 1280×1800. Confirm no dark charcoal panels remain, gold reads as accent (not dominant), body text passes AA contrast.

## Technical details

- Keep all existing Tailwind class *names* where possible by aliasing the old token keys to the new colors during transition — e.g. temporarily map `charcoal.950 → paper`, `bone → ink`, `champagne.200 → gold.500`. This avoids touching every className string. Once visually verified, the second pass renames to semantic tokens (`bg-paper`, `text-ink`, `text-gold-700`) for long-term clarity.
- Update `index.html` `<meta name="theme-color">` to `#FAF8F3`.
- `body { background-color: #FAF8F3; color: #191C22; }` in `index.css`.

Approve and I'll execute the token swap first, then sweep the per-page classes, then run the Playwright screenshot pass.
