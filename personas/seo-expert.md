# SEO Strategy

**DECISION-MAKING REFERENCE ONLY. Does not render anything.**

---

## Strategic stance

Don't try to outrank QuickBooks, Ramp, or Mercury on their own brand
terms. Compete on **middle-intent confusion queries** — the moments
when an owner is searching from pain, not from a feature shopping list.

---

## Primary keyword clusters

### Cluster 1 — Fractional CFO alternative
- fractional CFO alternative
- cheaper than fractional CFO
- do I need a CFO at $1M revenue
- small business CFO services
- part-time CFO for small business

Page: `/vs/fractional-cfo`

### Cluster 2 — Beyond bookkeeping
- more than bookkeeping
- bookkeeping vs CFO
- bookkeeper not enough
- when to hire a CFO
- financial reporting for small business owners

Page: `/vs/bookkeeper`, anchor section on homepage.

### Cluster 3 — Plain-English financial reporting
- plain-English financial reports for small business
- what do my financial statements mean
- financial reporting for non-finance owners
- monthly finance review service
- monthly financial check-in for business owners

Page: `/sample-report`, homepage hero.

### Cluster 4 — Cash flow clarity
- small business cash flow tight
- revenue is up but cash is tight
- cash flow forecast template (lead capture)
- when can I afford to hire (lead capture)

Pages: template library, calculator pages.

### Cluster 5 — Comparison long-tail
- Monthly Finance Desk vs QuickBooks
- Monthly Finance Desk vs Ramp
- Monthly Finance Desk vs Mercury
- bookkeeper vs fractional CFO vs Monthly Finance Desk

One comparison page per pair. Strong opinion, clear table, honest
about where each tool wins.

---

## On-page SEO rules

- One `<h1>` per page, contains the primary cluster keyword.
- `<title>` under 60 characters, leads with the keyword phrasing the
  buyer would type, ends with `| Monthly Finance Desk`.
- `<meta description>` under 160 characters, written as a sentence the
  buyer would say out loud, not a feature list.
- Internal linking: every page links to the homepage, the pricing
  section, and one related comparison page.
- Breadcrumb schema on `/vs/*` and `/templates/*` pages.

---

## Structured data

- `Organization` schema in the root layout (name, founder Chris Sam,
  URL, sameAs LinkedIn if applicable).
- `Service` schema on the homepage (offer name, price $1,500/month,
  description).
- `FAQPage` schema on the FAQ section (see `seo-faq.md`).
- `BreadcrumbList` on nested pages.

Do NOT add `Review`, `AggregateRating`, or `Product` schema until
genuine reviews exist. False structured data is a manual penalty risk.

---

## Content velocity

- One comparison page per month (4 priority: CFO, bookkeeper, QuickBooks, Ramp).
- One free template + landing page per month.
- One owner-grade essay per month (e.g., "How to know if you can
  afford to hire," "What revenue growth hides," "Why your bank balance
  is not a strategy"). 1,200–2,000 words, no fluff.

---

## Anti-patterns

- Don't generate AI-only "comparison" content with no original
  perspective — Google's helpful-content update will flag it.
- Don't keyword-stuff the homepage hero. The hero is for humans.
- Don't add a blog index until there are at least 6 essays.
- Don't link out to competitors with `dofollow` on comparison pages
  unless citing a specific factual claim.
