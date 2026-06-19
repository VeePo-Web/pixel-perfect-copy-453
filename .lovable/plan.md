## Goal

Produce a complete prompt package for a Zentry-style 3D hero video reskinned for **The Monthly Finance Desk**, then generate the **starting frame** and **ending frame** with Nano Banana (Gemini 3.1 Flash Image, premium tier) and deliver them as downloadable artifacts in chat.

No project code changes. No persona doc changes. Output lives in `/mnt/documents/`.

## Creative direction (locked from `personas/brand-identity-and-decisions-filter.md`)

- **Feel target:** private finance room · executive reporting environment · high-trust command center. *Never* SaaS-cute, never neon, never confetti.
- **Palette:** deep charcoal/near-black background (`hsl(220 18% 5%)`), warm off-white type, champagne gold primary accent (`hsl(40 55% 70%)`), restrained institutional deep-green secondary, soft warm-gray 1px borders. No purple, no cyan, no gradient orbs.
- **Materials:** brushed obsidian, smoked glass, polished bronze edges, frosted acrylic, holographic data-mesh, thin gold filament linework.
- **Forbidden:** stock people, cartoon coins, dollar-bill clipart, isometric SaaS illustrations, jittery counters, "AI magic" energy bursts.
- **Emotional arc the video must carry:** Recognition → Discomfort → Curiosity → Safety → Desire.
- **Single visual thesis:** *"A private finance room materializing around the viewer."*

## Deliverable 1 — Master Kling 3.0 video prompt (5–10s hero loop)

A long-form cinematic prompt (~350 words) describing camera movement, scene transformation from frame 1 → frame N, materials, lighting, motion design, and forbidden elements. Includes:

- **Shot:** slow dolly-in + slight orbit-right, 35mm equivalent, shallow depth of field, anamorphic flares restrained.
- **Scene state:** opens on a single floating glass "Bi-Weekly Finance Briefing" card suspended in volumetric charcoal mist with one champagne god-ray; resolves into a curved arc of 5–7 glass briefing cards (Cash Movement, Revenue Trend, Expense Pattern, Unusual Spend, Questions, Decisions) connected by thin gold cash-flow filaments, with a faint ticker-tape ribbon arcing overhead and a subtle hex/grid floor plane catching specular light.
- **Motion design:** cards drift in with calm 600–1000ms easing (no snap), gold filaments draw on like ink, particulate dust drifts slowly, no UI animation, no text typewriter effects.
- **Lighting:** key light = warm champagne from upper-left, fill = cool institutional steel from below-right at 15% intensity, rim = soft bronze on card edges, volumetric haze, subtle bloom.
- **Audio cue note** (for later sound pass): low cinematic sub-drone, single resonant brass swell at the resolve, no ticking, no synth pads.
- **Negative prompt:** no neon, no purple/indigo, no glowing orbs, no people, no cartoon icons, no text scrambles, no glitch, no chromatic aberration, no cyberpunk, no spaceship UI, no Iron-Man HUD, no Wall-Street bull, no dollar signs, no stock charts going up.

## Deliverable 2 — Starting-frame image prompt (Nano Banana)

Tight, image-specific prompt (~180 words) describing the *exact composition* Kling will be told to animate **from**:

- Single hero glass briefing card floating dead-center-left, 30% of frame, tilted 8° toward camera.
- Title bar on card reads **"Bi-Weekly Finance Briefing"** in a refined serif/grotesk; six section labels visible but muted (Cash Movement, Revenue Trend, Expense Pattern, Unusual Spend, Questions, Decisions); figures rendered as tabular monospaced gold-on-charcoal.
- Background: deep charcoal volumetric mist, one diagonal champagne god-ray, faint hex-grid floor disappearing into haze, single soft bronze rim-light on the card edge.
- Mood: quiet, anticipatory, "before the room turns on."
- Aspect 16:9, cinematic, photoreal CGI, octane-render quality, restrained, no text artifacts beyond the named labels.

## Deliverable 3 — Ending-frame image prompt (Nano Banana)

Tight, image-specific prompt (~180 words) describing the resolved hero composition Kling animates **to**:

- 5–7 glass briefing cards arranged in a gentle concave arc wrapping the camera, the original hero card still slightly forward-left, depth falloff blurring rear cards.
- Thin champagne-gold filament lines connecting cards like a cash-flow graph; small particulate gold dust drifting; ticker-tape ribbon arcing overhead at low opacity.
- Floor: dark mirrored obsidian with the cards' reflections; subtle hex-grid catching specular light.
- A discreet wordmark "**The Monthly Finance Desk**" etched in champagne on the lower-right floor plane (small, premium, never billboard).
- Same lighting rig as starting frame but +20% bloom and added bronze rim on every card edge.
- Aspect 16:9, photoreal CGI, octane-render quality, executive, calm, expensive.

## Generation step

Run two Nano Banana generations in parallel (`model: premium.gemini`):

1. `/mnt/documents/monthly-finance-desk_hero_start.jpg` (16:9, 1920×1088)
2. `/mnt/documents/monthly-finance-desk_hero_end.jpg` (16:9, 1920×1088)

JPG keeps file size light for chat download.

## Delivery

In the build-mode reply you'll see:

- The full master Kling 3.0 video prompt (copy-paste ready).
- The two image prompts (copy-paste ready if you want to re-roll).
- Two `<presentation-artifact>` cards — one per frame — that the chat renders as click-to-download tiles.

## Out of scope

- No Remotion / no in-browser video.
- No site code changes.
- No Kling API call (you'll paste the prompts into Kling yourself).
- No audio generation.
- No motion test renders.
