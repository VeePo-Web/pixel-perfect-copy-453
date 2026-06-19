# Image SEO

**DECISION-MAKING REFERENCE ONLY. Does not render anything.**

---

## Filename rules

- Kebab-case, descriptive, no random hashes for human-shipped images.
- Lead with the subject. E.g.:
  - `sample-bi-weekly-briefing-agency.webp`
  - `monthly-finance-desk-spreadsheet-view.webp`
  - `chris-sam-founder-portrait.webp`
  - `comparison-bookkeeper-vs-finance-desk.webp`

Bad: `IMG_2843.png`, `screenshot-final-v3.webp`.

## Alt text rules

- Describe the *information*, not the visual.
- Bad: *"Screenshot of a dashboard."*
- Good: *"Sample bi-weekly briefing for a 12-person agency showing
  $92,400 in revenue, $78,900 in expenses, and a flagged increase in
  contractor costs."*
- Founder portrait: *"Chris Sam, founder of the Monthly Finance Desk."*
- Decorative images (textures, dividers): empty alt `alt=""`. Never
  omit the attribute.

## Dimensions and format

- Hero / above-fold artifact images: 2× display resolution, `.webp`
  primary with `.avif` source, < 200KB each.
- Below-fold images: 1.5× display, `.webp`, < 100KB each.
- Always set `width` and `height` attributes to prevent CLS.
- Use `<picture>` with art-directed sources for mobile crops of the
  founder portrait and any wide briefing screenshots.

## OG / social cards

Every page has its own OG image, generated from a consistent template:

- Dark charcoal background.
- Top-left: "Monthly Finance Desk" wordmark in champagne.
- Center: the page's H1 in 56px editorial sans.
- Bottom-right: a small artifact preview (briefing snippet, comparison
  row, or chart) when relevant.

Dimensions: 1200×630. `.jpg` (smaller than `.png`, fine for this design).

`twitter:card` is `summary_large_image`. `og:image:alt` matches the
H1 verbatim.

## Sitemap

- Include all `/templates/*`, `/vs/*`, and primary pages.
- Image sitemap extension for the founder portrait and sample
  briefing/spreadsheet screenshots so they index in Google Images.
