# The Interactive Hero — Built To Sell On Every Frame

The Zentry mechanic stays: a small tile in the center, click it, it explodes to fullscreen, the next one cues underneath. We keep the *physics* of that interaction and replace the gaming spectacle with something Claire has never seen a finance brand do — **a hero that demos the product on click.**

Every reel, every caption, every micro-label below is written to sell. Nothing decorative. Nothing cute. Each line is a hook, a mirror, or a close.

---

## The headline that anchors all of it

Hero headline, fixed, never animates away:

> **You don't need another dashboard.**
> **You need someone reading the numbers with you.**

Sub-line under it:

> The Monthly Finance Desk. A private finance room for owners who've outgrown the bank-balance method.

CTA, always visible, never moves:

> **Generate My Sample Briefing →**
> *No bank connection. No signup. 90 seconds.*

That's the frame. Now the interactive tile lives inside that frame, doing the heavy selling.

---

## The interactive tile — what plays on each click

Four reels. Each is a 4–6 second loop. Each one is a sales argument disguised as a moment.

### Reel 1 — The Mirror *(default, what she lands on)*

A real-looking iPhone notification slides in over a charcoal void:

> **Wells Fargo · 9:14 AM**
> *Available balance: $48,212.07*

It hovers. A single line of champagne text writes itself underneath:

> *This is how most owners check on their business.*

Then the notification dissolves. The glass briefing card from the end-frame fades up in its place. One line of caption:

> *There is a more serious way.*

**Corner label**: `01 — The Method Most Owners Use`

**Why it sells**: It names her exact morning ritual. Recognition is the most powerful emotion a hero can trigger. She thinks: *"That's me. Every morning. That's literally me."*

---

### Reel 2 — The Briefing

The glass card is now full-frame. Inside, a real **Bi-Weekly Finance Briefing** types itself in. Calm. Tabular. Champagne gold on charcoal:

> **Cash Movement** — *Position improved $18,400. Driven by faster client collections, not new revenue.*
>
> **Unusual Spend** — *Software up 34%. Three new subscriptions added in May. None reviewed.*
>
> **The Question This Raises** — *Are we buying tools faster than we're using them?*

**Corner label**: `02 — What Arrives Every Two Weeks`

CTA microcopy fades in below the card for 1.5s, then out:

> *This is roughly what yours would look like.*

**Why it sells**: She doesn't have to imagine the deliverable. She just saw it. The product stopped being abstract.

---

### Reel 3 — The Decision

Three questions stack up, one at a time, in the briefing voice:

> *Can I afford to hire a $75K role in Q3?*
> *Should I raise prices, or hold them through year-end?*
> *Is the agency actually profitable, or does it just feel that way?*

Then a single line resolves underneath, in champagne:

> *These are the questions your Monthly Review answers — in writing, every month.*

**Corner label**: `03 — The Decisions On Your Desk Right Now`

**Why it sells**: Those are her literal thoughts, lifted verbatim from the persona doc. She feels seen, then sold the exact instrument that answers them.

---

### Reel 4 — The Identity Close

No data. No card. Just one slow line writing itself across the charcoal, with the wordmark resolving underneath:

> *Operate like a CEO.*
> *Not like someone duct-taping the finances together.*
>
> **— The Monthly Finance Desk**

**Corner label**: `04 — Why Owners Stay`

**Why it sells**: This is the identity-layer close from the persona's "hidden emotional state ladder." It's not about features anymore. It's about who she becomes by signing up.

---

## The micro-interactions that make it feel award-winning

Every detail below is a sales detail, not a polish detail.

- **The tile itself** carries a permanent, almost-imperceptible label: `Click to see the next briefing →`. After 4 seconds of inactivity, it pulses once, softly, in champagne. One pulse. Not a nag — an invitation.
- **Counter in the corner**: `01 / 04` in tiny monospaced champagne. Tells her there *is* more, which makes the first click inevitable.
- **On click**, the tile doesn't just expand — it *settles*. 800ms ease-out, no bounce. The sound of confidence, visually.
- **Between reels**, a single thin champagne filament draws across the screen for 200ms — the same filament that connects the cards in the end-frame. Visual continuity = brand authority.
- **After reel 4**, the tile resets to reel 1, but the CTA below the hero pulses once. The whole loop has quietly walked her from *recognition* → *product* → *decisions* → *identity* → *click*.
- **Reduced motion**: replace expansions with 400ms crossfades. Copy unchanged. The sell does not depend on motion.

---

## The corner wordmark

Where the Zentry site has `GAMING` bleeding off the bottom-right, we have, etched small and confident in champagne:

> **The Monthly Finance Desk**
> *Los Angeles · Est. by Chris Sam*

The Zentry energy comes from typography that *owns* the corner. We earn the same energy through restraint instead of size.

---

## Why this beats a normal hero (the strategic case)

A normal finance hero says *"We help you understand your numbers."* It's a claim. Claims don't sell.

This hero **demonstrates the deliverable in 20 seconds of clickable cinema**. By the time she reaches the CTA, she has already:

1. Seen herself in reel 1 *(problem agreement)*
2. Seen the actual briefing in reel 2 *(product clarity)*
3. Seen her own questions answered in reel 3 *(value made specific)*
4. Been offered a new identity in reel 4 *(emotional close)*

Four sales arguments. Zero paragraphs. One click each. That's the Zentry mechanic doing real commercial work.

---

## Production path

- **Route B — rendered React/Canvas reels** for all four. Real type, perfect crispness, infinitely editable copy, no video weight, ships in days. Matches the `SampleBriefing` type already specced in `frontend-engineer.md`.
- **Route A — Kling-rendered ambient backdrop** only behind the tile, looping the start-frame → end-frame transition we already prompted. Used as atmosphere, not as the demo itself.

The reels are the salespeople. The Kling backdrop is the room they're standing in.

---

## What I need from you to proceed to build

1. **Approve the 4-reel sequence and the copy above** — or mark any line you want sharpened.
2. **Confirm Route B (rendered reels) + Route A (Kling backdrop)** as the production split.
3. **Confirm the headline + sub-line + CTA copy** stays as written, or give edits.

Once approved, the build plan covers: a `<HeroReel>` component (typed JSON-driven), the Zentry-style expand-on-click mechanic ported to GSAP with calmer easings, the four reel definitions in `/src/content/hero-reels/*.ts`, the Kling backdrop loop wired as the ambient layer, reduced-motion fallback, and the wordmark + counter chrome.
