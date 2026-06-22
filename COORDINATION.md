# COORDINATION — Two-Claude Boundary

Two Claude instances work this repo concurrently. We stay fast **only** because we
never edit the same files. This doc is the single source of truth for who owns what.
Read it before starting any change.

---

## The two lanes

### Claude A — Conversion / Persuasion (the visible funnel)
Owns every selling surface: copy, offer, hero, sections, layout, CTA wording, the
checkout **UI**, pricing tables. Runs `/hero`, `/convert`, `/polish`.

### Claude B — Checkout Backend & Analytics (the invisible plumbing)
Owns the money + measurement layer: how the funnel charges cards, captures leads,
and proves what converts. Never touches copy, layout, or selling surfaces.

---

## Ownership map

| Concern | Owner | Files |
|---|---|---|
| Copy, offer, CTA text | **A** | `src/components/**`, page sections |
| Hero / sections / layout | **A** | `src/components/**` |
| Checkout **UI** (button, form, styling) | **A** | `src/components/pricing/**`, `src/components/Button.tsx` |
| Conversion strategy docs | **A** | `docs/conversion-*.md`, `docs/email-sequence.md` |
| Checkout **logic** / Stripe session | **B** | `src/lib/checkout.ts` |
| Lead capture logic | **B** | `src/lib/leads.ts` |
| Analytics / event tracking | **B** | `src/lib/analytics.ts` (to be created) |
| Edge functions (checkout, webhooks, email) | **B** | `supabase/functions/**` |
| Post-purchase / fail-state **logic** | **B** | `src/lib/**` |
| Supabase client | **shared (read-coordinate-write)** | `src/integrations/supabase/client.ts` |
| Brand tokens | **shared — B maintains, A consumes** | `src/brand.ts`, `src/index.css`, `tailwind.config.ts` |

---

## The handoff seam — "A calls, B provides"

A and B meet through **exported functions only**. A renders the UI and calls B's
function; B owns what the function does. Neither edits the other's side.

- Checkout: A's button calls `startAutoFillCheckout()` from `src/lib/checkout.ts`.
  A styles the button; B owns the Stripe/edge-function call and the dead-click fallback.
- Leads: A's form calls `captureLead(payload)` from `src/lib/leads.ts`.
  A styles the form + success screen; B owns the insert + Resend delivery.
- Analytics: A fires `track(event, props)`; B owns the analytics module + dedup.

If a function's **signature** needs to change, that's a coordination point — flag it,
don't silently rename. Internal behavior behind a stable signature is B's alone.

---

## Hard rules

**Claude A never edits:** `src/lib/checkout.ts`, `src/lib/leads.ts`,
`src/lib/analytics.ts`, `supabase/functions/**`.

**Claude B never edits:** any `src/components/**` selling surface, page copy, layout,
or the checkout form's visual markup.

**Both:** before editing a shared file (`brand.ts`, `index.css`, `tailwind.config.ts`,
`integrations/supabase/client.ts`), check `git status` + recent commits first.

---

## Git protocol (concurrent tree)

1. Stage by path — `git add src/lib/checkout.ts …` — **never** `git add -A`.
2. Check `git branch --show-current` immediately before commit **and** before push.
3. Rebase, don't merge: `git -c core.autocrlf=false pull --rebase origin main`.
4. Never force-push or rewrite a shared branch. A duplicated commit is fine;
   destroyed work is not.
5. If the tree holds the other Claude's uncommitted work: `git stash push -u` →
   rebase → `git stash pop`. Never absorb their changes into your commit.

---

*Owner of this doc: Claude B (Checkout Backend & Analytics). Last updated: 2026-06-21.*
