# Make the Generate button actually use the prompt

Right now "Generate Sample Finance Briefing" always renders the same hardcoded sample. This plan makes it read whatever the owner typed (or the placeholder example if empty), send it to a server-side AI call, and render the response in the existing briefing panel — same six-section structure, same calm voice, no hype.

## Behavior

1. User types into the composer (or clicks **Use Demo Business Data** to prefill the agency example, unchanged).
2. On **Generate Sample Finance Briefing**:
   - If the textarea is empty, fall back to the `Example:` sentence already shown under the input ("I run a 12-person agency doing $90K/month…") so the button never feels broken.
   - Switch panel to `loading`, run the existing 4-line loading sequence on a timer.
   - In parallel, call a new edge function with the prompt text.
   - When the response arrives AND the loading sequence has finished, switch to `briefing` and render the returned sections.
3. If the call fails or returns malformed data, fall back to the current hardcoded `COPY.briefing` so the hero never shows an error state. A small muted line under the panel notes "Showing sample briefing." Reduced-motion users skip the fade.

The post-demo CTA block still reveals once `state === "briefing"`, unchanged.

## Briefing shape (locked)

The AI must return exactly these six sections in this order, matching the empty-state list and the current sample's tone:

```text
Cash Movement
Revenue Trend
Expense Pattern
Unusual Spend
Questions to Review
Decisions to Consider
```

Each section: one short paragraph, 2–4 sentences, plain English, no emojis, no exclamation marks, no "AI," no "supercharge," no advice to "leverage" anything. Dollar figures allowed and encouraged when the prompt implies a size; otherwise qualitative. If the prompt is vague, the model invents reasonable demo numbers and labels the panel state as "Sample" (already the case).

## Backend

Requires Lovable Cloud (for the edge function + Lovable AI Gateway). If not yet enabled, enable it as part of this build.

- New edge function `generate-briefing`:
  - Input: `{ prompt: string }`.
  - Calls Lovable AI Gateway with `google/gemini-2.5-flash` (fast, cheap, good enough for this).
  - System prompt locks: persona (calm senior finance operator briefing a small business owner), the six-section structure, tone rules (no hype, no AI talk), and the JSON output contract.
  - Uses tool/structured output so the response is guaranteed JSON: `{ sections: [{ label, body }, …] }` with `label` constrained to the six allowed strings.
  - Returns the parsed JSON. No auth required (public hero demo). Rate-limit via the gateway's built-in 429 — surface as the hardcoded fallback.
- No DB tables, no storage, no user accounts. Nothing is persisted.

## Frontend changes

- `src/components/hero/FinanceHero.tsx`:
  - Add `briefingData` state (defaults to `COPY.briefing`).
  - `startDemo()` becomes async: kicks off the loader timers AND the fetch in parallel, awaits both, then sets state to `briefing` with either the AI response or the fallback.
  - Disable both CTAs while `state === "loading"`.
  - `BriefingPanel` reads sections from props instead of `COPY.briefing` directly.
- No copy changes anywhere else. Eyebrow, slogan, headline, subheadline, placeholder, example, CTAs, trust line, badges, post-demo block — all untouched.

## Out of scope

- Saving briefings, accounts, real bank connection, streaming the response token-by-token, editing the prompt mid-stream, the 4-reel mechanic, other page sections.

## Acceptance

- Typing a custom business description and clicking Generate produces a briefing whose numbers and details reflect what was typed.
- Empty textarea + Generate uses the on-screen example sentence and still produces a coherent briefing.
- All six section labels render in the fixed order, every time.
- Network failure or malformed model output falls back silently to the current hardcoded sample; no error UI.
- Loading sequence still plays for its full duration even if the AI responds faster, so the panel never flashes.
