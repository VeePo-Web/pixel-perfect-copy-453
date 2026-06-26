# Mobile Conversion Pass 1 — Homepage Thumb-Zone CTA + Hero Touch Optimization

Date: 2026-06-25 · Scope: mobile/tablet (<=1023px) only · Desktop: frozen.
Repo: VeePo-Web/pixel-perfect-copy-453 (GoldFin Desk marketing site).

## Research basis (2026)
- Mobile ~63% of traffic; mobile-first beats responsive-adjusted.
- Sticky bottom CTA = +15-25% conversion on long-scroll pages (slim, dismissible).
- Thumb-zone bottom CTAs beat top-only on long pages.
- Mobile primary CTA 56-64px tall, full-width on phones; 48px WCAG floor.
- Touch replaces hover intentionally (Fantasy.co doctrine); >=44px targets.
Sources: LandingPageFlow, Apexure, Influencers-Time, Lovable, fantasy.co (2026).

## Findings (homepage = LCP landing route) — ALL SHIPPED
1. [Critical] No sticky mobile CTA on homepage (interior pages had one) ->
   new HomeMobileStickyCTA (lg:hidden, scroll>520, safe-area, dismissible -> /templates).
2. [High] Hero CTA not full-width / ~45px -> w-full justify-center sm:w-auto + py-4 sm:py-3.5.
3. [Medium] Hero py-24 crowds mobile fold -> py-16 md:py-32 (desktop unchanged).
4. [Medium] Nav hamburger 36px -> h-11 w-11 (44px), lg:hidden only.

## Desktop-freeze guarantee
Every change gated to sub-lg/md/sm or inside an existing lg:hidden container.
No base rule desktop (>=1024px) reads was changed. tsc -b && vite build: green.

## Next passes
- Pass 2: section rhythm (PainClarity/VaultPreview/EpiphanyBridge/FounderTrustStrip) —
  tighten mobile padding, verify reflow at 320/390, 48px targets, reduced-motion reveals.
- Pass 3: interior sticky-CTA copy A/B (first-person + outcome); persist homepage dismiss.
- Pass 4: hero card stack scale/clip on <360px phones.

## Concurrent-tree note
Repo edited concurrently by Lovable/Codex tooling that resets the working tree
(untracked files wiped mid-session). Always stage by path, commit immediately, never add -A.
