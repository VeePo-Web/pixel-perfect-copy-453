# Visual System

**DECISION-MAKING REFERENCE ONLY. Does not render anything.**

The token set, type system, and surface treatments. When implementing,
mirror these as semantic CSS variables in `index.css` and as theme
tokens in `tailwind.config.ts` — never hardcode hex values in components.

---

## Color system (HSL)

### Base
- `--background` → `220 18% 5%` (near-black, deep charcoal)
- `--surface` → `220 15% 8%` (raised cards)
- `--surface-elevated` → `220 12% 12%` (modals, the briefing panel)
- `--foreground` → `45 25% 96%` (warm white, primary text)
- `--muted-foreground` → `45 10% 65%` (secondary text)
- `--border` → `45 15% 90% / 0.08` (hairlines)

### Accents
- `--accent-champagne` → `40 55% 70%` — premium cues, CTAs, active states.
- `--accent-green` → `155 35% 45%` — financial steadiness, positive deltas, "cash up" indicators.
- `--accent-blue` → `210 80% 60%` — *only* for subtle AI/data states (e.g., the "analyzing..." pulse).
- `--accent-warning` → `25 80% 60%` — used sparingly for "deserves attention" notes in sample briefings.

### Forbidden
- Generic SaaS bright blue gradients.
- Purple/indigo hero gradients (the default AI-generic look).
- Cartoon yellow, hot pink, neon green.
- Any solid `#fff` background.

---

## Typography

- **Headline face**: an editorial sans-serif (e.g., Söhne, Untitled
  Sans, or Inter Display as a free fallback). Weight 500–600. Tight
  letter-spacing (-0.02em on large sizes).
- **Body face**: a highly readable humanist sans (e.g., Inter, IBM
  Plex Sans). Weight 400 for body, 500 for emphasis.
- **Monospace** (sample briefing numerals, dollar values): IBM Plex
  Mono or JetBrains Mono. Used for *numbers only*, not labels.

### Scale (desktop)
- Display: 72px / line-height 1.05 / weight 500
- H1: 56px / 1.1 / 500
- H2: 40px / 1.15 / 500
- H3: 24px / 1.3 / 500
- Body large: 18px / 1.55 / 400
- Body: 16px / 1.6 / 400
- Caption: 13px / 1.5 / 450
- Eyebrow: 12px uppercase / letter-spacing 0.12em / weight 500

Mobile scales down by ~20% across the board. Headline minimum 32px,
body minimum 16px (never smaller).

---

## Surface treatments

### Glass report card
- Background: `hsl(var(--surface-elevated))` with 1px border
  `hsl(var(--border))`.
- Border-radius: 6px (sharp, not pill).
- Shadow: `0 24px 64px hsl(0 0% 0% / 0.4), 0 1px 0 hsl(45 25% 96% / 0.04) inset`.
- Interior padding: 32px.
- Section dividers inside: 1px hairline `hsl(var(--border))`.

### Input (the hero prompt)
- Background: `hsl(220 15% 7%)`.
- Border: 1px `hsl(var(--border))` at rest → champagne 1px on focus.
- Focus glow: `0 0 0 4px hsl(40 55% 70% / 0.12)` — soft, never bright.
- Placeholder: `hsl(var(--muted-foreground))`, italic off.

### Buttons
- **Primary** — Champagne background, near-black text, sharp 4px corner.
- **Secondary** — Transparent, 1px champagne border, champagne text.
- **Tertiary** — Text only, warm white, hover underline.

No gradient buttons. No pill buttons. No glow ring on hover.

---

## Imagery

- No stock photography of "businesspeople in suits."
- No abstract gradient blobs.
- No 3D financial illustrations.
- Use: real product screenshots (sample briefing, spreadsheet view),
  founder portrait (Chris Sam) in restrained editorial style, and
  thin SVG diagrams when explaining the five-step flow.

---

## Iconography

- Stroke icons only, 1.5px stroke.
- Recommended set: Lucide or Phosphor.
- No filled emoji-style icons. No 3D icons.
- Color: inherit from text, except status icons (use `--accent-green`
  / `--accent-warning`).
