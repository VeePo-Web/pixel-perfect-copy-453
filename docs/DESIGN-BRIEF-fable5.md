# GoldFin Desk — World-Class Visual Pass
## Audit + execution brief, written for Claude Fable 5

> **Mission.** Take a site that is already well-engineered for conversion and raise its *visual and interaction* quality to the standard of Apple's UX restraint, Stripe's surface craft, and fantasy.co's editorial art direction. **Zero content changes** — every word, link, price, and destination stays exactly as it is. Visual classes, composition, typography, color, elevation, and motion only. Performance must stay instant: no new dependencies, no new network requests, no heavier JS.

---

## Part 1 — Audit (what a world-class eye sees today)

Captured full-page + viewport screenshots of all 11 routes at 1440px and 390px. Findings, ordered by severity:

### A. Typography (the defining problem)
1. **The body font of the entire site is a monospace label font.** `src/index.css` sets `body { font-family: "general" }` — and `general.woff2` is a mono grotesque. Every paragraph, nav link, button, and form on the site renders in it.
2. **Interior H1s render in mono at display size.** Heroes on /pricing, /templates, /sample-briefing, /compare, /security-faq set `font-light text-[58px]` *with no font family*, so they inherit the mono body. They were clearly designed for a light humanist sans. At 58px, mono reads "terminal," not "private bank."
3. **The homepage H1 is `uppercase font-black`** on a medium-weight display font (`robert-medium`) — synthesized weight, shouting case. Apple headlines never shout.
4. **`zentry.woff2` (a heavy condensed novelty font) is used for the wordmark** on the portal auth shell, portal layout, and all seven legal pages — it renders like a broken faux-black and carries none of the brand.
5. Meanwhile the repo already ships two genuinely premium faces, barely used: **`circular-web`** (Circular Book — ideal body) and **`robert-medium/regular`** (clean neo-grotesque — ideal display).

### B. Signature defects (visible on screenshots)
6. **Dark shimmer sweeps across gold CTAs forever.** 51 instances of `animate-shimmer(-slow)`, many with `via-ink/40` — a *dark* band endlessly crossing the primary buttons, which is why they photograph muddy/bronze. World-class UIs have zero infinite attention animations.
7. **Muddy gold gradient.** The canonical CTA is `from-champagne-100 to-champagne-300` (pale straw → dark bronze, 77 instances). The ramp is too wide; ends read dirty.
8. **Nav bar has text hanging below its edge.** Absolutely-positioned `-bottom-5` social-proof/friction-killer spans float under the CTA, over page content — looks like a rendering glitch. Plus a pulsing gold dot on "Sample Briefing", plus a duplicated "Free Templates" link 100px from the identical nav item.
9. **Home hero card stack is cramped and clipped** — three rotated translucent cards overlap into a blur; on mobile they clip off-canvas right.
10. **Pricing hero composition** — back card clips mid-word ("Template Va…"), a third ghost card sits mostly empty; reads accidental.
11. **Dark closing sections have illegible chips** (dark text on dark translucent pills at the bottom of the homepage).
12. **Beige washes** (`#FAF8F3`, champagne tints on large surfaces) read "old luxury hotel" next to the pure white sections — the palette loses its crispness.

### C. Systemic polish gaps
13. Elevation is inconsistent: some cards float on heavy permanent glows, others are flat; hover states vary per file.
14. Focus rings, active states, and easing are good in places (cinema cubic-bezier is a strength) — but infinite `soft-pulse`/`ghost-drift` loops undercut the calm.
15. Portal + legal pages are unbranded (black faux wordmark, gray disabled pills, no gold anywhere).
16. Vertical rhythm varies (py-16/20/24/28/32 mixed without logic); some heroes are 6 lines tall from mono line-breaking.

**What is already strong (keep):** the white/ink/gold palette concept, hairline borders, mono used for *data rows* (genuinely good), in-view fade-ups with `ease-cinema`, the conversion architecture, pill buttons, the adaptive nav concept, reduced-motion support.

---

## Part 2 — The design system to execute ("Private-bank editorial")

The taste target: **fantasy.co art direction** (mono micro-labels + big quiet grotesque display + generous air) with **Stripe surface engineering** (hairlines, tabular numbers, one perfect button recipe) and **Apple restraint** (sentence case, no loops, nothing moves unless the user did something).

### 2.1 Type roles (the one-line revolution)
- **Body/UI** — `circular-web`, with system fallback: `"circular-web", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`. Set on `body` in `index.css`, alias as Tailwind `font-sans` and `font-text`. Preload it in `index.html` (it is now critical path). 15.5–17px, `leading-[1.6–1.7]`.
- **Display** — `robert-medium` (`font-display` alias, keep `font-robert-medium` working). All H1/H2 display moments: `font-display tracking-[-0.02em]` with tight leading (1.02–1.12), **sentence case** — remove `uppercase` + `font-black` from display headings (the words themselves never change).
- **Mono** — `general` (`font-general`, alias `font-mono-label`). ONLY for: eyebrows/labels (10–11.5px, uppercase, tracking ≥ 0.2em), data rows/figures (with `tabular-nums`), tiny meta lines. Never for paragraphs, buttons, nav links, or headings.
- **zentry** — never in UI. Replace wordmark usages with the standard logo treatment (mono caps wordmark `text-[12.5px] uppercase tracking-[0.26em]` like GlobalTopBar, or GoldFinLogo component).

### 2.2 Color discipline
- Paper `#FFFFFF`; ink `#0B0D12` with tints `/70 /55 /40`; hairlines `border-ink/[0.08]` (light) and `border-white/[0.10]` (dark).
- Gold is **one disciplined accent**: `champagne-200 #D4A845` for fills/dots/rules; `champagne-300 #B8893A` for gold *text on white* (AA); gradients only `champagne-100 → champagne-200`.
- Large tinted sections: replace beige `#FAF8F3`-style washes with white + hairline top border, or at most `#FCFBF9`.
- Dark sections stay `#0B0D12` — chips/pills on dark must be `border-white/[0.14] bg-white/[0.06] text-white/75` minimum.

### 2.3 The canonical button recipes (replace all variants)
- **Primary (gold):** `rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-3.5 text-[13.5px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98]` + existing focus-visible ring. **No shimmer span, ever.**
- **Secondary:** `rounded-full border border-ink/[0.12] bg-white px-6 py-3.5 text-[13.5px] text-ink/80 hover:border-ink/[0.25] hover:text-ink` (dark surfaces: `border-white/[0.16] text-white/80 hover:border-white/[0.32] hover:text-white`).
- **Tertiary:** text link, `text-ink/60 hover:text-ink` with `underline-offset-4`, gold only on true accents.
- **Portal primary:** `bg-ink text-white hover:bg-ink/90`, same radii/transitions.

### 2.4 Surfaces & elevation
- Card: `rounded-2xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(11,13,18,0.04)]`; hover (interactive only): `hover:shadow-[0_16px_40px_-20px_rgba(11,13,18,0.18)] hover:-translate-y-0.5`.
- Focal object (one per page max): may carry a large soft shadow + gold hairline top edge.
- Dark card: `border-white/[0.09] bg-white/[0.05]`.

### 2.5 Motion rules
- Entrances: opacity + `translate-y-3` → 0, `duration-500/700 ease-cinema`, stagger ≤ 100ms, fire once on in-view. (Already the house style — keep.)
- **Zero infinite animations.** Neutralize `shimmer`, `shimmer-slow`, `soft-pulse`, `ghost-drift` (loading/progress states may keep a *subtle* pulse).
- Hover/active transitions 200–300ms. Nothing autoplays attention.

### 2.6 Layout rhythm
- Container `max-w-7xl px-6 lg:px-10`. Sections `py-20 md:py-28` (hero `pt-32+`). Eyebrow → `mt-5` heading → `mt-6` sub → `mt-9/10` CTA row. Let display type breathe: H1 `max-w-[17ch]`-ish, subcopy `max-w-[52–60ch]`.

### 2.7 Hard constraints (non-negotiable)
1. **No copy changes** — not a word, not a price, not a label. (Removing a `uppercase`/`font-black` class is fine; rewriting a string is not.)
2. **No link/handler/analytics changes**; keep every `href`, `onClick`, aria-* and role. (Exception: `aria-hidden` *decorations* may be removed/replaced.)
3. **No new dependencies, no new font files, no external requests.**
4. **No slower:** no new blocking resources; keep lazy route splitting; keep IntersectionObserver patterns; CSS-only where possible.
5. Keep `prefers-reduced-motion` behavior global.
6. TypeScript must compile; `npm run build` must pass.

---

## Part 3 — Execution map (file-level)

**Phase A — global tokens (do first, everything inherits):**
- `src/index.css`: body font → circular stack; keep fonts self-hosted.
- `tailwind.config.ts`: add `sans`/`display`/`text` aliases; tighten gold ramp guidance; **delete `soft-pulse`, `ghost-drift`, `shimmer-slow` animations** (classes then no-op harmlessly; shimmer spans rest at `-translate-x-full`, invisible).
- `index.html`: preload `circularweb-book.woff2` alongside `robert-medium.woff2`.

**Phase B — mechanical sweeps (whole `src/`):**
- `from-champagne-100 to-champagne-300` → `from-champagne-100 to-champagne-200` (all 77).
- Remove every shimmer overlay `<span aria-hidden … animate-shimmer(-slow) …/>` inside buttons; add the inset-highlight shadow recipe to those buttons.
- `text-navy` on gold buttons → `text-ink`.
- Display headings: add `font-display`/`font-robert-medium tracking-[-0.02em]`; homepage H1 drops `uppercase font-black`.

**Phase C — composition (per page group):**
1. **Nav + Footer** (`nav/GlobalTopBar.tsx`, `footer/GoldFinFooter.tsx`): delete the `-bottom-5` floaters; remove pulsing dots (static 1.5px gold dot ok); drop the duplicated right-slot "Free Templates" text link (the identical link remains in primary nav); calm the trust strip (10.5px mono, ink/45, no ✦ glyph spam); refine mobile sheet type to circular; footer link columns to circular with mono column labels.
2. **Home** (`home/*`): rebuild hero right-column stack — no rotation>2°, no backdrop-blur stacking, cards fully inside bounds, tasteful fan (translate/scale only), mobile: single neat card peek; fix dark-section chip legibility; beige section → white+hairline.
3. **Pricing** (`pricing/*`): hero focal card composition (no mid-word clipping — ghost cards become clean, smaller, fully-visible chips), plan cards to canonical card recipe, tables to mono-data style with hairlines.
4. **Templates + Sample-briefing** (`templates/*`, `sample-briefing/*`): centered mono H1s become `font-display`; input/textarea focus rings standardized; ghost template cards below hero must not clip labels.
5. **Compare + Three-way** (`compare/*`, `three-way-compare/*`): same display-type fix; spectrum/map cards to canonical recipe; tables hairline+tabular.
6. **Security-FAQ + How-it-works** (`security-faq/*`, `how-it-works/*`): same treatment; step strips to mono-label + circular body.
7. **Apply funnel + payments + portal + legal** (`apply/*`, `payments/*`, `portal/*`, `pages/portal/*`, `pages/legal/*`): zentry wordmarks → brand wordmark treatment; portal buttons/fields to canonical recipes; funnel cards/selects to canonical card + gold selected state (`border-champagne-200 bg-champagne-50/40` + ink text); billing/checkout surfaces to card recipe.

**Phase D — verify:** `npm run build` + full-page re-screenshots of all 11 routes at both widths; compare against Part 1 findings; fix regressions; remove any scratch files; commit + push.

*Written by and for Claude Fable 5 — execute with taste, restraint, and total content fidelity.*
