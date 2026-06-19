# Responsive & Mobile

**DECISION-MAKING REFERENCE ONLY. Does not render anything.**

---

## Mobile-first principle

Roughly 50% of Claire's first visit happens on mobile (Instagram link,
forwarded text, between meetings). The mobile experience cannot be a
shrunken desktop. It is the primary surface for the recognition moment.

---

## Hero on mobile

Stack order, top to bottom:

1. Eyebrow (12px uppercase champagne).
2. Headline (*Stop Running Your Business From Your Bank Balance*) — 36px, weight 500, tight line-height.
3. Subhead — 16px, muted.
4. Prompt input — full-width, 56px min height, 16px font (prevents iOS zoom on focus).
5. Demo chips — horizontal scroll, 1.5 chips peek on the right edge to suggest more.
6. Primary CTA *Generate Sample Finance Briefing* — full-width, 52px tall.
7. Secondary CTA *Use Demo Business Data* — full-width text link below.
8. Trust microcopy — 13px muted, two lines max.
9. **Sample briefing preview** — stacks BELOW the input, not hidden. The user should be able to scroll one screen down and see what's coming.

### Critical mobile rules

- Never hide the briefing preview behind a "tap to expand" button. The
  point of the hero is to make value visible before commitment.
- Hero total height on mobile: ~140vh. Long is fine; the first viewport
  shows recognition + input, the second shows the artifact.
- Input must be focusable without keyboard auto-popping until tapped.
- Demo chips: tap-to-prefill, never tap-to-submit. The user always
  reviews their prompt before tapping the generate button.

---

## Section behavior on mobile

- All multi-column sections collapse to single column.
- Five-step "How It Works" becomes a vertical list with numbered
  connectors. No horizontal scroll.
- Offer-stack cards stack with 16px gap.
- Comparison table converts to per-row mobile cards (one card per
  competitor with header + bullet list), not a horizontally scrolling table.
- Sample report preview uses a tabbed mini-nav for the briefing
  sections (Cash, Revenue, Expenses, Questions) so a single viewport
  feels readable.

---

## Application flow on mobile

- Each step is its own screen with a sticky top progress bar
  (1 of 3 / 2 of 3 / 3 of 3).
- One question per visual group. Never cram all fields onto one screen.
- Primary button sticky at the bottom edge with safe-area padding.
- "Back" link top-left, "Save & exit" top-right (returns to homepage,
  preserves draft in localStorage for 24h).

---

## Touch targets

- Minimum 44×44px (Apple HIG).
- Spacing between tappable elements: 8px minimum.
- Demo chips: 36px tall minimum, 12px horizontal padding minimum.

---

## What is intentionally NOT in mobile

- No custom cursor (desktop only, and even there it's optional).
- No hover-only interactions. Every desktop hover state has a tap
  equivalent or is purely decorative.
- No autoplay video backgrounds in the hero. Mobile data, battery, and
  reduced motion concerns.
