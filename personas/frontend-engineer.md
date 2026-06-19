# Frontend Engineering Guardrails

**DECISION-MAKING REFERENCE ONLY. Does not render anything.**

---

## Stack

- React 18, TypeScript strict, Vite, Tailwind v3.
- shadcn/ui for primitives, restyled to the visual system in `ui-visual.md`.
- No CSS-in-JS runtime (no Emotion, no styled-components). Tailwind + CSS variables only.
- No state library beyond React's built-ins + URL state. Add Zustand only if a feature genuinely needs cross-tree state.

---

## Sample briefing rendering

The hero's right-side briefing is **rendered from typed JSON**, not
free-form HTML. Define:

```ts
type BriefingSection = {
  id: 'cash-movement' | 'revenue-trend' | 'expense-pattern' | 'unusual-spend' | 'questions' | 'decisions';
  label: string;
  body: string;          // plain-English paragraph
  delta?: { value: number; direction: 'up' | 'down' | 'flat' };
};

type SampleBriefing = {
  generatedFrom: 'demo' | 'user-prompt';
  industry: string;
  sections: BriefingSection[];
};
```

Demo briefings live in `/src/content/briefings/*.ts` so the marketing
team can iterate without engineering involvement.

---

## Plaid integration boundaries

- Plaid is **never** invoked in the marketing pages or the hero.
- Plaid Link is only loaded after a user has applied, been accepted, and
  is on the authenticated onboarding flow.
- The Plaid client ID is a public publishable key. The secret key lives
  only server-side (Lovable Cloud edge function).
- Never log access tokens, never store credentials, never echo bank
  account numbers in client state.

---

## AI integration boundaries

- The "AI-assisted organization" feature is server-side. The browser
  never sends raw financial data to an LLM directly.
- All LLM calls are made via Lovable Cloud edge functions that:
  - Use the Lovable AI Gateway (default model).
  - Strip identifiers before sending.
  - Cache deterministic outputs.
- Do not market AI as the primary value. AI is plumbing.

---

## Forms & application flow

- Use `react-hook-form` + `zod` for validation.
- Persist draft state to `localStorage` keyed by a session UUID, expire after 24h.
- Submission posts to a Lovable Cloud edge function that writes to a
  `applications` table with RLS scoped to `service_role` only (no
  client reads — the founder reviews via a separate dashboard).

---

## Accessibility

- Color contrast ≥ 4.5:1 for body text against the dark surface.
  Champagne on near-black tests around 8.2:1 — safe.
- Focus rings: 2px champagne outline at 2px offset, never removed.
- All interactive elements reachable by keyboard in DOM order.
- `aria-live="polite"` on the briefing generation panel so screen
  readers announce the result.
- Respect `prefers-reduced-motion` per `scroll-motion.md`.

---

## SEO infrastructure

- One `<h1>` per page.
- Each route has its own `<title>` and `<meta name="description">`,
  managed via `react-helmet-async` or equivalent.
- Open Graph + Twitter card meta on every page.
- JSON-LD `Organization` schema in the root layout and `FAQPage`
  schema on the FAQ section — see `seo-faq.md`.

---

## Don't

- Don't import any persona file into runtime code. Personas are
  reference docs.
- Don't add analytics that fire on page load before consent — use a
  consent gate even if the legal jurisdiction doesn't require it.
- Don't add a cookie banner unless analytics or tracking actually exists.
