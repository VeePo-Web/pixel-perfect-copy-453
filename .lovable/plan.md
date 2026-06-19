# Hero rebuild to match the master prompt

The current hero already nails most of this spec — exact copy, charcoal/champagne palette, two-column composition, briefing panel, loading sequence, AI-backed sample briefing, post-demo CTA. This plan only ships the deltas that bring it to the master-prompt bar.

## Deltas

### 1. Top navigation (new)
Minimal, quiet, sits above the hero in the same dark surface. No CTA in the nav.
- Left: `Monthly Finance Desk` wordmark
- Right: `How It Works` · `Sample Briefing` · `Pricing` · `FAQ` as anchor links to `#how`, `#sample`, `#pricing`, `#faq` (sections don't exist yet — links scroll harmlessly, real sections land in later turns)
- Mobile: wordmark + hamburger that opens a sheet with the same four links
- Built as `src/components/hero/HeroNav.tsx`

### 2. Single primary CTA above the fold
Master prompt is explicit: only `Generate Sample Finance Briefing` shows in the initial hero.
- Remove the visible `Use Demo Business Data` button from the hero
- Keep the demo-prefill behavior available as a small, low-emphasis ghost link beneath the example text: `Try demo business data` (looks like a text link, not a button). This preserves the useful affordance without competing as a second CTA. If you'd rather drop it entirely, say so and I will.

### 3. Command-style prompt input with attached CTA
Today the textarea and the CTA are separate blocks. Rebuild as one unified "finance command interface":
- Single rounded container, dark translucent fill, thin champagne-tinted border, soft inner glow, faint outer radial highlight under the CTA corner
- Textarea fills the left, CTA button sits attached on the right (desktop) or full-width below (mobile)
- Focus state: border brightens to champagne, inner glow intensifies subtly
- Placeholder and example/trust microcopy unchanged — exact copy preserved

### 4. Cinematic background
Layer behind the whole hero section, fixed to the section, pointer-events none:
- Base: near-black `#08080A` → charcoal radial wash
- Faint 40px dot-matrix grid at ~4% opacity, masked to fade at edges
- Two soft radial glows: champagne top-left, deep-green bottom-right, both very low alpha
- One very faint blurred "floating UI fragment" — a single ghosted briefing-card silhouette behind the right column, ~6% opacity, no text legibility
- No animation on the background beyond a slow 20s opacity drift on the glows (respects `prefers-reduced-motion`)

### 5. Briefing panel polish
Current panel is good; tighten to "private financial briefing room":
- Add a top-left meta row inside the panel: `MFD · BRIEFING 001` in tiny tracked uppercase, plus a date stamp `Period · Sample`
- Replace the small green "Ready/Preparing/Preview" dot with a slimmer champagne-on-charcoal status chip
- Dollar figures in the briefing body render in champagne weight-medium so the eye lands on numbers first
- Thin 1px champagne rim on hover/focus within panel; no other motion

### 6. Mobile copy variant wired up
The `COPY.mobile` block already exists but isn't used. Switch to it under `md`:
- Mobile headline stays full ("Stop Running…")
- Subheadline swaps to the shorter mobile version
- CTA label swaps to `Generate Sample Briefing`
- Trust line swaps to `No bank connection required.`
- Briefing panel renders below the composer (already does), collapses to a single preview card with a "Tap to expand" affordance until the CTA is clicked

### 7. Section ID + scroll target
Wrap the hero in `<section id="top">` and add `#sample` anchor on the briefing panel so the nav links resolve.

## Out of scope

- How It Works / Pricing / FAQ / Sample Briefing pages or sections (links scroll to `#` for now)
- Real backend, application form, About/Story/Contact rewrites
- Any 4-reel mechanic or video backdrop
- Changing any of the locked copy strings

## Acceptance

- Above the fold shows exactly one primary CTA button
- Nav renders with the four links and no nav CTA, both desktop and mobile
- The prompt input and CTA read as a single unified command bar
- Background reads as cinematic dark with dot grid + soft glows, no bright gradients
- Mobile <768px uses the `COPY.mobile` strings for sub, CTA, trust
- All existing copy strings remain byte-identical to what was approved
- Briefing fetch + loading sequence + post-demo CTA continue to work
