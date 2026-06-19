# Navigation — Visual Rules

**DECISION-MAKING REFERENCE ONLY. Does not render anything.**

---

## Surface

- Background: translucent near-black (`hsl(220 15% 6% / 0.7)`) with
  backdrop-blur 12px when scrolled past 24px. Fully transparent at
  top of page.
- Bottom border: 1px hairline `hsl(45 15% 90% / 0.06)` only when
  scrolled.
- Height: 72px desktop, 64px tablet, 56px mobile.
- Max content width: 1280px, centered, with 32px horizontal padding
  (16px on mobile).

## Logo

- Wordmark in editorial sans (see `ui-visual.md`).
- 16px desktop, weight 500, letter-spacing -0.01em.
- Color: warm white `hsl(45 25% 96%)`.

## Links

- 14px, weight 450, letter-spacing 0.02em.
- Color: `hsl(45 10% 75%)` resting → `hsl(45 25% 96%)` hover.
- Active section: 1px underline 4px below baseline, champagne
  `hsl(40 55% 70%)`, animates in over 180ms.
- Gap: 32px between links desktop, stacked on mobile.

## Primary CTA — "Apply for Premium"

- Background: champagne `hsl(40 55% 70%)`.
- Text: near-black `hsl(220 15% 8%)`, weight 500, 13px, uppercase, letter-spacing 0.08em.
- Padding: 12px 20px. Border-radius: 4px (sharp, not pill).
- Hover: lift 1px, shadow `0 8px 24px hsl(40 55% 70% / 0.25)`.
- No glow, no gradient, no shimmer.

## Mobile sheet

- Slide-in from right, 320px wide, near-black background.
- Links stack with 24px gap, 18px font size.
- CTA pinned to bottom of sheet.
- Close button top-right, no icon, just "Close" in 13px.

## Motion

- Nav fade-in on first paint over 240ms.
- Background blur transition on scroll: 180ms ease-out.
- Never animate on hover beyond opacity/transform — no color shimmer,
  no slide-underline-on-hover.
