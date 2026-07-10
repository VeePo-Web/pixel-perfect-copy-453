## Problem

Trust pills at the bottom of the site render as invisible/near-black on the dark `#080A0E` band. Root cause: they use `text-white/42`, and Tailwind's default opacity scale doesn't include `/42` — the class isn't emitted, text inherits `text-ink` (near-black), and the pill sits invisible on a dark band. Same failure mode appears in a few sibling nodes.

## Fix (scoped, presentation-only)

Swap non-standard white-opacity utilities to the nearest standard value that is clearly legible on `#080A0E`.

**`src/components/footer/GoldFinFooter.tsx`**
- Trust pills (line ~132): `text-white/42` → `text-white/75`.
- Sub-headline (line ~99): `text-white/45` → `text-white/60`.

**`src/components/home/HomeHero.tsx`** — same `text-white/42` / `/45` classes on the dark hero:
- Micro CTA line: `text-white/45` → `text-white/70`.
- Italic caption: `text-white/42` → `text-white/70`.

**`src/components/home/HomeMobileStickyCTA.tsx`** — mobile sticky bar eyebrow:
- `text-white/45` → `text-white/70`.

No other content, layout, or logic changes. Icons (`text-champagne-300/70`) stay as-is — they already render.

## Verification

- `rg "text-white/(42|45|36|38)" src` returns no matches after the edit.
- Visual check on `/` and any page rendering `GoldFinFooter` shows all three trust pills legible against the dark band; hero sub-copy also legible.
