# Motion polish for the briefing panel

Tighten the panel's transitions and loading states to feel cinematic and premium without ever distracting from the copy. All motion respects `prefers-reduced-motion` and uses a shared easing/timing system so nothing feels ad-hoc.

## Motion system (added once, reused)

Add four keyframes to `tailwind.config.ts` and lean on a single easing curve (`cubic-bezier(0.22, 1, 0.36, 1)` — a calm "out-expo"). Durations stay long enough to read as deliberate, short enough to never block:

- `panel-rise` — 600ms: opacity 0 → 1, `translateY(8px) → 0`, `scale(0.985) → 1`. Used for the briefing panel itself when it mounts.
- `section-in` — 500ms staggered: per-section fade + 6px rise. Each of the six briefing sections animates with a 70ms incremental delay so they cascade in like a document being typed out, not a list popping.
- `shimmer` — 1.8s linear infinite: a soft champagne sheen that travels diagonally across loading skeletons.
- `caret-blink` — 1.1s steps(2): a thin champagne caret on the active loading line.

`motion-reduce:` variants disable all transforms and stagger; opacity-only fades remain for state legibility.

## Panel mount + state transitions

- The panel mounts with `panel-rise`. The thin top rim brightens from 0 → 40% champagne over the same 600ms.
- State swaps (`idle` → `loading` → `briefing`) cross-fade the panel body using a 280ms opacity dissolve. A keyed wrapper around the body forces the swap so React unmounts the previous state cleanly.
- The status chip's label (Preview / Preparing / Ready) cross-fades on change (180ms); the dot color animates via `transition-colors` over 400ms instead of swapping instantly.

## Idle state

- Replace the six static empty-state rows with skeleton placeholders: 1px champagne-tinted lines with the `shimmer` keyframe traveling across them at 4% opacity. Section labels stay legible; the line value is a moving sheen suggesting "data not yet read."
- Each row stagger-fades in once on mount (70ms increments).

## Loading state — the most important upgrade

The current loading list jumps between steps. Rework it as a calm progression:

- A thin champagne progress bar at the top of the panel body (1px tall) advances in four equal segments, transitioning width over the same 750ms as the step timer with the shared easing.
- Each line:
  - Pending: 25% opacity, no caret.
  - Active: opacity rises to 100% over 240ms, dot pulses softly (custom slow pulse, 1.6s, opacity 60% → 100%), a thin caret blinks at the end of the line.
  - Done: opacity settles at 55%, dot fills champagne, a 12px hairline tick draws in (`stroke-dashoffset` from 12 → 0 over 220ms).
- Replace the "Preparing" chip with a small inline counter `01 / 04` that ticks with the step, also cross-faded.

## Briefing state

- The full panel body fades in (280ms), then sections cascade via `section-in` with the 70ms stagger. Total cascade: ~6 × 70ms + 500ms ≈ <1s — feels intentional, not slow.
- Section labels animate the underline rim (1px champagne) from `scaleX(0)` → `scaleX(1)` left-origin over 500ms, only on first render.
- Dollar figures in section bodies get a one-time `text-shadow` lift (champagne at 30% → 0%) over 800ms so the eye lands on them without movement.

## Post-demo CTA

- Reveals 250ms after the cascade finishes with `panel-rise` (shorter: 450ms, 6px translate).
- The primary button gets a very slow ambient sheen — the same `shimmer` keyframe at 6s duration, 8% opacity — so it reads as "alive" without flashing. Pauses on hover (replaced by the existing shadow lift).

## Composer + nav (light touches only)

- Composer focus ring transitions border + inner glow over 400ms (already 300ms — bump to 400ms with shared easing).
- The right-side ghost briefing-card silhouette drifts ±4px on a 16s ease-in-out loop. Pauses under `prefers-reduced-motion`.
- Nothing else on the page moves on scroll; this is a hero, not a parallax demo.

## Implementation

- Extend `tailwind.config.ts` `keyframes`/`animation` with the four entries above and a `transition-timing-function` token `--ease-cinema`.
- All changes are inside `src/components/hero/FinanceHero.tsx` (panel, loader, sections, post-demo CTA). No new files.
- No copy changes anywhere. No layout changes. No new dependencies.

## Acceptance

- Panel mount, state swap, loading progression, and briefing cascade all use the same easing and feel like one motion language.
- Loading no longer "jumps" — there's a continuous progress bar plus per-line activation.
- Reduced-motion users see opacity-only transitions, no transforms, no shimmer, no caret blink.
- Total briefing reveal under 1s; nothing loops indefinitely except the very low-amplitude ambient sheen on the primary CTA and ghost card drift.
- No motion competes with reading the copy.
