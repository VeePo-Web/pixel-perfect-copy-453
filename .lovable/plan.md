## Problem

All the new pages already exist and render correctly at their hash routes (`#/templates`, `#/security-faq`, `#/pricing`, `#/compare`, `#/sample-briefing`, `#/apply`). They're invisible to visitors because:

1. The **home page** (`FinanceHero` + `HowItWorks`) has no top navigation at all — nothing links out to Templates, Pricing, Compare, or Security & FAQ from the landing screen.
2. The existing per-page top bars (`TemplatesTopBar`, `CompareTopBar`, `SecurityFAQTopBar`) are inconsistent — different link sets, no Security & FAQ link anywhere.

## Plan: Single shared GlobalTopBar on every page

### 1. Create `src/components/nav/GlobalTopBar.tsx`

One reusable header, matching the existing premium aesthetic from `TemplatesTopBar` (fixed, `bg-charcoal-950/80` blur, champagne dot + "Monthly Finance Desk" wordmark, champagne gradient Apply pill).

Props: `currentPath?: "home" | "how-it-works" | "templates" | "pricing" | "compare" | "sample-briefing" | "security-faq" | "apply"`.

Link set (left → right, after the wordmark):
- How It Works → `#/` (anchors to HowItWorks section on home, or use `#how-it-works` hash)
- Templates → `#/templates`
- Compare → `#/compare`
- Sample Briefing → `#/sample-briefing`
- Pricing → `#/pricing`
- Security & FAQ → `#/security-faq`
- Apply (champagne pill CTA) → `#/apply`

Mobile (<lg): condense to wordmark + hamburger that opens a full-screen sheet with the same links stacked. Keep the Apply pill always visible.

Accessibility: `nav aria-label="Primary"`, focus-visible rings, current page marked with `aria-current="page"`.

### 2. Wire it into every route in `src/App.tsx`

Render `<GlobalTopBar currentPath={...} />` inside each route's `<main>`, above the page component, passing the matching `currentPath`. The hero/home route gets it too (with `currentPath="home"`).

Add top padding (`pt-14`) on the home `<main>` and any page that doesn't already account for the fixed bar so the hero doesn't slide under it.

### 3. Retire the per-page top bars

Remove `TemplatesTopBar`, `CompareTopBar`, `SecurityFAQTopBar` usage from their respective pages so we don't end up with two stacked headers. Delete the now-unused components.

### 4. Verify

- `bunx tsc --noEmit`
- Playwright smoke: load `#/`, screenshot, click each nav link, confirm the right page renders and `aria-current` flips.

## Out of scope

- No footer (can be a follow-up if you want one).
- No copy/content changes inside the existing pages.
- No new routes.
