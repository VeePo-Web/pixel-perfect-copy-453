# Navigation Architecture

**DECISION-MAKING REFERENCE ONLY. Does not render anything.**

---

## Rules

- Minimal. No dropdowns. No mega-menu. Five links max.
- One right-aligned premium CTA.
- Sticky on scroll, shrinks slightly. Always visible.
- Mobile: hamburger with the same five links + CTA at bottom of sheet.

---

## Primary nav

- **How It Works** — anchors to the five-step section.
- **What You Get** — anchors to the offer-stack cards.
- **Sample Report** — anchors to the sample briefing preview.
- **Pricing** — anchors to the pricing section.
- **FAQ** — anchors to the FAQ section.

Right-aligned CTA: **Apply for Premium** (primary button).

Optional secondary, only if it doesn't crowd: *Get Free Templates*
(text link, not a button).

---

## What never goes in the nav

- Login (if/when a portal exists, it lives in the footer or in a
  separate post-auth shell).
- "Blog" or "Resources" unless there is real, owner-grade content.
- "About" — Chris's story belongs inside the homepage proof section,
  not behind another click.
- Social icons.

---

## Anchor scroll behavior

- Smooth scroll with offset for the sticky nav.
- Active link state updates as the corresponding section enters the viewport.
- URL hash updates so links are shareable.

---

## Logo

- Left-aligned wordmark: "Monthly Finance Desk."
- Editorial serif feel — see `ui-visual.md` for the type system.
- Logo always links to `/`.
