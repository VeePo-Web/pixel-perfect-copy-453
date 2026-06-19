# Performance Engineering

**DECISION-MAKING REFERENCE ONLY. Does not render anything.**

---

## Budgets (desktop, 4G simulated)

- LCP: ≤ 1.8s
- FID / INP: ≤ 100ms
- CLS: ≤ 0.02
- Total JS shipped to first route: ≤ 180KB gzipped
- Total CSS: ≤ 30KB gzipped
- Total image weight on first viewport: ≤ 250KB
- No third-party scripts on first paint.

## Budgets (mobile, mid-tier Android, 3G fast)

- LCP: ≤ 2.5s
- INP: ≤ 200ms
- Total JS: ≤ 140KB gzipped (same bundle, code-split heavier surfaces)

---

## Load priorities

1. Hero text and primary CTA — render server-side (or pre-rendered)
   so the recognition moment lands before any JS hydrates.
2. Hero prompt input — interactive within 1s.
3. Sample briefing skeleton — visible immediately as static markup,
   filled in once the user generates.
4. Below-the-fold sections — lazy-loaded via `IntersectionObserver` or
   route-based code splitting.

---

## What to defer

- Any animation library (GSAP, Framer Motion) — load only on routes
  that actually use it, or replace with CSS keyframes where possible.
- Analytics (after consent, after first interaction).
- The Plaid SDK (only loads inside the authenticated onboarding flow).
- The application form's validation library — split off into the
  `/apply` route bundle.

---

## Image rules

- All static images: `.webp` or `.avif`, never `.png` for photos.
- Hero/founder photo: served at 2× max display size, `loading="eager"`
  + `fetchpriority="high"`.
- Below-fold images: `loading="lazy"` + `decoding="async"`.
- Use `<picture>` with art-direction sources for the founder portrait
  on mobile (tighter crop).
- Never autoplay video in the hero on mobile.

---

## Font loading

- Use `@fontsource` packages, not Google Fonts CDN links.
- `font-display: swap` for all custom faces.
- Preload only the two faces used above the fold (headline 500 +
  body 400).
- Subset to Latin-1 for the marketing site.

---

## Caching

- Static assets: immutable, 1-year cache.
- HTML: short cache (5 min) + stale-while-revalidate.
- Sample briefing JSON: edge-cached for 1h, content-hashed for cache busting.

---

## Monitoring

- Real-user metrics via Vercel Analytics or equivalent (consent-gated).
- Synthetic monitoring of the hero render + briefing generation flow
  daily.
- Alert if LCP regresses above 2.5s desktop or 3.5s mobile.
