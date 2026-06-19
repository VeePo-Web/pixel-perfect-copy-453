## Plan: Application Funnel — `/apply`

Build a 6-screen premium application funnel (landing + 5 steps + success) that lives on the existing site and matches the established dark/champagne/green token system. Same restraint as the hero and "How It Works" — no new heavyweight dependencies (no Framer Motion, no router library), reuses the existing `panel-rise` / `section-in` / `ease-cinema` motion vocabulary.

### Routing

The project has no router today. To keep the dependency footprint flat, the funnel is mounted via a **hash route**: when `window.location.hash` starts with `#/apply`, the new `<ApplicationFunnel />` component renders full-screen and the home content (`FinanceHero` + `HowItWorks`) is hidden. `#/apply/thank-you` renders the success state. A tiny `useHashRoute` hook listens to `hashchange`. All existing CTAs that point to `#apply` are updated to `#/apply` so they enter the funnel.

This avoids `react-router-dom` install while still giving real, shareable URLs.

### File structure

New folder `src/components/apply/`:

```text
ApplicationFunnel.tsx         — page shell, step state machine, layout
content.ts                    — all copy, option lists, chips
hooks/
  useHashRoute.ts             — tiny hash router
  useApplicationState.ts      — controlled form state + localStorage persistence + validation
parts/
  ApplicationHeader.tsx       — minimal top bar (logo + "Application" label + secondary link)
  FunnelProgress.tsx          — premium 5-step indicator (numbered, hairline rail, active glow)
  ApplicationStepShell.tsx    — left-column layout primitive (eyebrow, headline, sub, slot, footer nav)
  StickyFinancePreview.tsx    — right-column sticky preview panel that updates per step
  SelectableCard.tsx          — single-select large card (keyboard, aria-pressed, glow on select)
  MultiSelectCardGroup.tsx    — multi-select cards (checkbox semantics)
  TextField.tsx               — labeled text/email input with calm error
  TextAreaWithChips.tsx       — textarea + suggested chips that append to text
  FitSignalCard.tsx           — small reassurance card (used for low-revenue + non-budget paths)
  ApplicationSummary.tsx      — review cards with edit links
  TrustReassuranceBlock.tsx   — "what happens after you apply" block
  StepLanding.tsx             — Step 0 hero
  StepFit.tsx                 — Step 1
  StepSetup.tsx               — Step 2
  StepDecisions.tsx           — Step 3
  StepReadiness.tsx           — Step 4
  StepReview.tsx              — Step 5 + submit
  SubmissionLoading.tsx       — premium loader (3 rotating status lines, hairline progress)
  SuccessPage.tsx             — /apply/thank-you
schema.ts                     — zod schemas per step + full submission
```

### Backend

Add one migration that creates `public.applications`:

- columns: `id uuid pk default gen_random_uuid()`, `created_at timestamptz default now()`, `first_name text`, `email text`, `business_name text`, `business_type text`, `revenue_range text`, `current_tools text[]`, `clarity_gap text`, `decisions text[]`, `clarity_outcome text`, `monthly_review text`, `budget_fit text`, `worth_it text`, `timeline text`, `consent boolean`
- `GRANT INSERT ON public.applications TO anon, authenticated`; `GRANT ALL TO service_role`
- RLS enabled; single policy `FOR INSERT TO anon, authenticated WITH CHECK (true)` (write-only public form). No `SELECT` policy — applications are not readable from the client.
- Light input length caps enforced both client-side (zod) and server-side (column `text` is fine; zod caps long fields at 2000 chars, emails at 255).

Submission path: client-side zod validation → `supabase.from('applications').insert(...)` → on success, navigate to `#/apply/thank-you`. No edge function needed (keeps scope minimal). Errors surface in the calm `ApplicationErrorMessage` style.

### Layout & visual

**Desktop (≥ lg)** — Two-column grid inside a max-w-7xl shell:
- Left (7/12): `ApplicationStepShell` — eyebrow `APPLICATION · 0X / 05`, large editorial headline, sub, fields, footer with Back / Continue
- Right (5/12): sticky `StickyFinancePreview` that morphs per step (landing shows the $1,500/month rhythm card; Step 1 shows "Likely fit signal"; Step 2 shows "Financial Clarity Gap"; Step 3 shows "First Briefing Focus" personalized by selected decisions; Step 4 shows "Readiness Signals"; Step 5 shows full mini-summary).

**Mobile** — Single column. `FunnelProgress` at top, fields in the middle, sticky bottom `Continue` bar (champagne fill). The right-side preview collapses into an expandable "What happens next?" disclosure between fields and the sticky bar.

**Header** — Tiny: "Monthly Finance Desk" wordmark left, "Application" label center (hidden on mobile), `Not ready? Generate Sample Briefing` link right (points to `#top`).

**Progress** — 5 numbered chips on a hairline rail. Completed = champagne dot; active = champagne ring + glow; upcoming = bone/15 dot. Step labels visible on ≥ md.

### Step behavior

- **Step 0 Landing** — Hero copy + primary CTA (`Start Application` → advances to step 1) + secondary (`Generate Sample Finance Briefing` → `#top`) + tertiary (`Start with Free Templates` → `#templates` placeholder).
- **Step 1 Fit** — First name, work email, business name (text), business type (10 selectable cards in a 2-col grid), revenue (6 cards). Sub-$30K shows `FitSignalCard` with two CTAs (`Continue Application`, `Start With Free Templates`). ≥$30K shows positive note.
- **Step 2 Setup** — Multi-select tools (10 cards) + `TextAreaWithChips` for clarity gap (chip click appends as a new sentence if not already present).
- **Step 3 Decisions** — 10 decision cards + `clarity outcome` textarea. After ≥1 decision, the right preview re-renders the "First Briefing Focus" list dynamically.
- **Step 4 Readiness** — 4 question groups; certain answers trigger inline reassurance text under the option group (no modal).
- **Step 5 Review** — `ApplicationSummary` cards with "Edit" link per section (jumps back to that step preserving state). Consent checkbox required. `TrustReassuranceBlock` and submit button. `Save and Finish Later` button copies a resumable URL to clipboard (`#/apply?step=N`) and shows a toast.

### Persistence

`useApplicationState` keeps the whole form object in React state and mirrors it to `localStorage` under `mfd:application:v1`. On hash route enter, state hydrates from storage. If a returning visitor lands on `#/apply` with persisted data, the landing step shows a small `Welcome back. Continue your Monthly Finance Desk application.` banner with a `Resume` button.

### Motion

- Step transitions: 320ms cross-fade + 6px translate using a keyed wrapper (same dissolve as the hero state swaps).
- Card hover: `hover:-translate-y-0.5 hover:border-champagne-200/40 hover:shadow-[0_8px_40px_-12px_rgba(217,190,130,0.18)]`.
- Card selected: champagne 200/30 border + inner champagne 200/[0.04] tint + small champagne dot in the corner.
- Submit loader: keyed status lines cycle through the three loading strings every 900ms while the insert is in flight; a 1px champagne hairline progresses left→right under the status.
- All animations gated behind `motion-safe:` to honor `prefers-reduced-motion`.

### Accessibility

- All inputs have visible labels; cards use `role="radio"` (single) or `role="checkbox"` (multi) inside `role="radiogroup"`/`role="group"` with arrow-key + space activation; selected state communicated via `aria-checked` plus visual ring (not color alone).
- Errors rendered with `role="alert"` and warm amber (not red) hairline + text; copy from the spec.
- Tab order: progress → fields top-to-bottom → back / continue.
- Sticky mobile continue bar respects `env(safe-area-inset-bottom)`.

### Success page

`#/apply/thank-you` renders `SuccessPage`: large headline, confirmation card (4 lines), 5-step timeline (vertical hairline + champagne dot for the completed first step), primary CTA `Generate a Sample Finance Briefing` (→ `#top`), secondary `Explore Free Templates`. Optional `Schedule Intro Call` button omitted (no scheduling integration exists). "While You Wait" section with three quiet text-link cards. On mount, clears the persisted draft.

### Out of scope

- No email send on submission (relies on the row insert; future edge function can subscribe).
- No real "Save and Finish Later" email link — `localStorage` resume + clipboard URL only.
- No "Schedule Intro Call" CTA (no calendar integration).
- No analytics events wired (component structure is event-ready).
- No router library installed; hash routing only.

### Files touched outside the new folder

- `src/App.tsx` — when hash route starts with `#/apply`, render `<ApplicationFunnel />` and skip `FinanceHero`/`HowItWorks`.
- `src/components/how-it-works/parts/FinalCTA.tsx`, `src/components/how-it-works/HowItWorks.tsx`, hero CTAs — update `#apply` → `#/apply`.
- New Supabase migration for `applications` table.

Nothing else changes.
