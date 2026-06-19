# Scroll & Motion

**DECISION-MAKING REFERENCE ONLY. Does not render anything.**

---

## Philosophy

This is a finance product. Calm beats excitement. Motion should feel
like *the room settling*, not like the page performing.

The site is a **calm financial command center**, not a marketing
animation reel. Motion exists to:

1. Confirm the system is thinking (briefing generation).
2. Reveal structure as the visitor scrolls (one section at a time).
3. Reward intent (CTA settles into place after value is shown).

If a motion doesn't serve one of those three, cut it.

---

## Allowed motion

- **Hero prompt focus** — input glow expands from 0 → 4px over 220ms ease-out.
- **Briefing generation** — right panel fades from skeleton to filled state, each section reveals with a 60ms stagger.
- **Section reveal on scroll** — fade + 12px translate-up, 480ms ease-out, triggered when section is 20% into the viewport. Once only, no replay on scroll up.
- **CTA settle** — after the sample briefing renders, the primary CTA scales from 0.96 → 1.0 with opacity 0 → 1 over 320ms.
- **Nav blur** — backdrop-blur transitions in over 180ms when scrollY > 24px.
- **Hover** — buttons lift 1px and add shadow over 160ms.

## Forbidden motion

- Confetti. Spinning coins. Bouncing dollar signs.
- "AI sparkle" particles, gradient orbs, animated mesh backgrounds.
- Parallax layered hero images.
- Auto-playing carousels.
- Letter-by-letter typewriter on headlines.
- Anything that loops indefinitely (drains battery, signals "toy").
- Page-load preloader animations.
- Smooth scrolling via Lenis or similar libraries — use native scroll.
  The motion should feel like an editorial document, not a scroll-jacked landing page.

---

## Generation loading microcopy

When the sample briefing is being prepared:

- "Reading revenue movement…"
- "Reviewing expense pattern…"
- "Checking cash pressure…"
- "Preparing plain-English briefing…"

Total duration: 1.2–1.8s. Long enough to feel considered, short enough
not to test patience. Each line displays for ~400ms then crossfades.

Never use:
- "Unlocking AI magic…"
- "Supercharging your data…"
- "Crunching the numbers…" (cliché)
- "Revolutionizing your finances…"

---

## Reduced motion

Respect `prefers-reduced-motion`. When set:

- Disable section-reveal translation; keep fades at 120ms.
- Disable CTA settle scale; just fade in.
- Disable nav blur transition; toggle instantly.
- Briefing generation still shows the loading lines (they're functional, not decorative).

---

## Performance ceiling

- All scroll-triggered animations use `transform` and `opacity` only.
- No layout-thrashing animations (no `height`, `top`, `margin` transitions).
- Animations target 60fps on a 2019 MacBook Air and 30fps minimum on
  a mid-tier 2022 Android phone.
