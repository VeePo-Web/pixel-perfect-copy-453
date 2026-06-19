# Sitewide Minimum Text Size — Readability Pass

Right now, body text is set to 15px and dozens of components use Tailwind's `text-xs` (12px), arbitrary `text-[11px]`/`text-[13px]`, and ultra-thin font weights (300). On a real screen, captions, labels, footer text, badges, and form helper copy fall below comfortable reading size. This plan establishes a **hard floor of 14px** (16px on body) and raises everything that falls under it — without altering the editorial hierarchy or desktop layout.

## The Rule (sitewide)

| Role                  | Old        | New (minimum)  |
| --------------------- | ---------- | -------------- |
| Body / paragraphs     | 15px / 300 | **16px / 400** |
| Body large            | 17px       | 18px           |
| Body small            | 13px / 300 | **14px / 400** |
| Captions              | 13px       | **14px**       |
| Labels / overlines    | 13px       | **14px**       |
| Badges / chips        | 12px       | **13px**       |
| Footer / nav meta     | 12–13px    | **14px**       |
| Form helper / errors  | 12px       | **14px**       |
| Min font-weight (body)| 300        | **400**        |

Display / serif headings (Cormorant) are unchanged — they're already large.

## What changes

1. **`src/index.css` — base body**
   - `body { font-size: 16px; font-weight: 400; line-height: 1.7; }`
   - Add an enforcement layer that re-floors anything tiny:
     ```css
     @layer base {
       p, li, span, a, button, input, textarea, select, label,
       small, figcaption, blockquote, td, th { font-size: max(1em, 14px); }
       .font-overline, .font-caption { font-size: 14px; letter-spacing: 0.18em; }
     }
     ```
   - Bump `.font-overline` from 0.8125rem → **0.875rem (14px)**.
   - Drop-cap and decorative styles untouched.

2. **`tailwind.config.ts` — token scale**
   - `body-lg`: 1.0625 → **1.125rem (18px)**, weight 400
   - `body`: 0.9375 → **1rem (16px)**, weight 400
   - `body-sm`: 0.8125 → **0.875rem (14px)**, weight 400
   - `label`: 0.8125 → **0.875rem (14px)**
   - `caption`: 0.8125 → **0.875rem (14px)**
   - Add custom utility override so `text-xs` resolves to **0.8125rem (13px)** instead of 0.75rem (12px) — catches every legacy usage in one shot without touching 60+ files.

3. **shadcn primitives** (`button.tsx`, `badge.tsx`, `input.tsx`, `label.tsx`, `form.tsx`)
   - Replace `text-xs` on badges/form-messages with `text-[0.8125rem]` (13px) where chips need to stay compact, `text-sm` (14px) everywhere else.
   - Inputs/textarea: `text-sm` → **text-base** (16px) — also stops iOS Safari from auto-zooming on focus.

4. **High-traffic wedding components** — sweep `text-xs` → `text-sm` (or `text-[13px]` for true micro-labels) in:
   - `Footer.tsx`, `FooterNewsletter.tsx`, `FooterServiceAreas.tsx`
   - `Navigation.tsx`, `NavigationMobileMenu.tsx`
   - `TrustBarSection.tsx`, `StatsSection.tsx`, `PressMentionsSection.tsx`
   - `ServicesOverviewSection.tsx`, `ServicesInvestmentPhilosophy.tsx`, `ServicesVendorPartners.tsx`
   - `VendorShowcaseSection.tsx`, `GallerySection.tsx`, `TestimonialSection.tsx`, `BrandManifestoSection.tsx`, `FounderTeaserSection.tsx`, `NowBookingSection.tsx`, `TravelSection.tsx`, `ThingsToDoSection.tsx`, `FullWidthImage.tsx`
   - Page files: `FAQ`, `About`, `Services`, `Journal`, `Portfolio`, `Inquire`

5. **Weight floor**: any `font-light` / `font-weight: 300` applied to body copy (not display headings) → `font-normal` (400). Cormorant display text keeps its editorial weight.

6. **Persona doc** — update `src/config/personas/responsive-mobile.ts` and `src/config/personas/ui-visual.ts` with the new rule: "No body text under 14px sitewide; body default is 16px/400."

## Out of scope
- No changes to Cormorant display headings, drop-cap, script font, or section spacing.
- No layout/grid changes.
- No new dependencies.

## Verification
- Build passes.
- `browser--view_preview` at 1440 and 375 — confirm footer, badges, captions, form helper text all read at ≥14px; inputs no longer trigger iOS zoom.
- Quick `rg "text-xs"` sweep after — only intentional micro-labels remain (and even those now resolve to 13px via the token override).
