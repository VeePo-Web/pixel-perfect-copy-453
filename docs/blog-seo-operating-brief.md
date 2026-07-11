# GoldFin Desk Blog SEO Operating Brief

Last researched: 2026-07-11

Source strategy: `C:/Users/Business/Downloads/GoldFin_Desk_World_Class_SEO_AI_SEO_Blog_Hub_Strategy.docx`

## Strategic Thesis

GoldFin Desk should own "plain-English monthly financial clarity" for owner-led businesses: organized spreadsheets, a recurring finance rhythm, and decision-ready context before the business needs a full CFO engagement.

The blog is not a content factory. Every page needs one searcher job, one keyword family, one proof artifact, one lead magnet, and one commercial next step.

## Hub System

1. Monthly Financial Clarity and Reporting
2. Cash Flow, Runway and Reserves
3. Expenses, Pricing and Profitability
4. Financial Decisions for Growth
5. Choosing Financial Support

Do not create a generic "templates" blog hub. `/templates` should stay a conversion asset library that supports articles from every hub.

## Static HTML Standard

The current Vite app already prerenders marketing route shells. For blog posts, use real static HTML article bodies served at `/blog/.../index.html`, not JS-only React content.

Each blog page should ship:

- Full article HTML in the first response.
- A single canonical URL.
- Unique title, meta description, OG/Twitter tags, and `datePublished`/`dateModified`.
- `BlogPosting` or `Article` JSON-LD, plus `BreadcrumbList`.
- FAQ structured data only when the FAQ is visible on the page and genuinely useful.
- Crawlable internal links using normal `<a href="">` anchors.
- Updated XML sitemap entries with accurate `lastmod`.
- Minimal JS; calculators can progressively enhance a visible HTML/table fallback.
- Image dimensions, descriptive alt text, and compressed WebP/AVIF where images add real proof.

Performance target: pass Core Web Vitals comfortably. Aim for LCP under 2.5s, INP under 200ms, and CLS under 0.1 on mobile.

## AI Search Standard

For Google AI Overviews and AI Mode, treat AI visibility as strong SEO, not a separate hack. Google says generative AI features use core Search ranking and quality systems, and that Google does not require special AI files, special schema, or AI-only markup.

For ChatGPT Search, keep public pages available to `OAI-SearchBot` and make sure CDN/hosting rules do not block OpenAI's published crawler IPs. Keep the distinction clear: search discovery crawlers and model-training crawlers are separate business/legal decisions.

`llms.txt` can remain as an extra discovery aid for non-Google systems, but it should not be treated as a Google ranking lever.

## Article Formula

Every post should include:

- Answer-first opening: 40-60 words or a compact table/list when that fits the query better.
- Clear audience statement: owner-led business, non-finance founder, or decision-maker.
- One primary keyword family; no synonym-splitting unless intent is materially different.
- A first-hand proof block: worksheet, calculator, annotated sample, formula table, decision tree, example model, or transparent process artifact.
- Method notes: assumptions, formulas, limitations, date of benchmarks, and jurisdiction caveats.
- Finance-safe language: educational, not tax/legal/accounting advice; route geo-sensitive topics to qualified review.
- Consistent product language: GoldFin Reports is $150/mo; GoldFin Advisory is $1,500/mo by application unless pricing changes everywhere.
- Until a dedicated `/reports` page exists, live GoldFin Reports CTAs should route to `/pricing#auto-fill`.
- CTA rhythm: contextual CTA after intro, exact tool mid-article, commercial next step at end, and one softer related-reading link.
- Internal links: hub link, two to four sibling links, one money-page link, and retro-links from existing pages after publish.

## Editorial Gate

Do not publish until all are true:

- The searcher job can be stated in one sentence.
- The page format matches intent and expected SERP format.
- The article adds original proof beyond commodity advice.
- The opening answer is extractable and self-contained.
- Headings are descriptive and useful without reading the whole page.
- Claims about taxes, employment, legal duties, or benchmarks cite primary/authoritative sources.
- CTA and lead magnet match the article promise.
- No cannibalization with an existing GoldFin page.
- Static HTML, canonical, sitemap, structured data, and visible dates are correct.

## First 31-Page Launch Order

1. H1-01 - What Should a Small-Business Monthly Financial Report Include?
2. H1-03 - Monthly Financial Review Checklist: A 30-Minute Owner Routine
3. H1-04 - Sample Monthly Finance Briefing: From Numbers to Decisions
4. H1-09 - How a Monthly Financial Reporting Service Works
5. H1-12 - Bank Balance vs Financial Report: Why They Tell Different Stories
6. H1-13 - Monthly Financial Report Template for Owner-Led Businesses
7. H5-01 - Bookkeeper vs Accountant vs Controller vs CFO: Who Does What?
8. H5-03 - What Should a Monthly Financial Reporting Service Include?
9. H5-04 - Financial Dashboard vs Plain-English Monthly Briefing
10. H5-06 - When a Small Business Needs a CFO-and When It Does Not
11. H5-08 - DIY Spreadsheets vs Managed Monthly Reporting
12. H5-12 - What GoldFin Desk Does-and Does Not Do
13. H5-14 - Monthly Financial Reporting Service Cost: What Changes the Price?
14. H2-01 - Cash Flow Forecast Template for Owner-Led Businesses
15. H2-03 - Cash Flow vs Profit: Why a Profitable Business Can Feel Broke
16. H2-04 - Revenue Is Up but Cash Is Down: What to Check First
17. H2-06 - Business Cash Runway: Formula, Calculator, and Warning Signs
18. H2-15 - How Much Cash Is Actually Available After Obligations?
19. H4-01 - Can My Business Afford to Hire an Employee?
20. H4-02 - The True Cost of Hiring: Salary Is Only One Part
21. H4-03 - How Much Revenue Must a New Hire Generate to Break Even?
22. H4-06 - Can the Business Afford New Software or Equipment?
23. H4-13 - Financial Scenario Planning Template for Small Businesses
24. H4-14 - The Owner's Financial Decision Checklist
25. H3-01 - Business Expense Tracker Template for Owner-Led Companies
26. H3-03 - Markup vs Margin: The Pricing Difference That Changes Profit
27. H3-04 - How to Calculate a Small-Business Break-Even Point
28. H3-05 - Gross Margin vs Net Profit: What Owners Need to Watch
29. H3-08 - Which Products or Services Are Actually Profitable?
30. H3-09 - Revenue Is Growing but Profit Is Not: Seven Places to Look
31. H3-14 - Small-Business Pricing Calculator: Cost, Margin, and Capacity

## Research Sources

- Google Search Central, SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Central, optimizing for generative AI features: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google Search Central, AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- Google Search Central, helpful reliable people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central, crawlable links and anchor text: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google Search Central, article structured data: https://developers.google.com/search/docs/appearance/structured-data/article
- Google Search Central, sitemap creation and submission: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- OpenAI Help, ChatGPT Search and OAI-SearchBot availability: https://help.openai.com/en/articles/9237897-chatgpt-search
- OpenAI developer docs, crawler overview: https://developers.openai.com/api/docs/bots
- IndexNow documentation: https://www.indexnow.org/documentation
- web.dev, Core Web Vitals thresholds: https://web.dev/articles/vitals
