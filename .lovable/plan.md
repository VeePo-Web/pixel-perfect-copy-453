## Goal

Pull the credibility, positioning, and team story from the two pitch decks (`Intro_Deck_vDraft.pptx`, `One_Pager_vDraft.pptx`) into the live site, and expand the offer ladder from two rungs to three.

## What changes

### 1. Offer ladder — now three rungs

| Rung | Name | Price | Purpose |
|---|---|---|---|
| 1 | GoldFin Template Vault | Free | Lead magnet — seven owner templates |
| 2 | GoldFin Reports (Auto-Filled) | **$150/mo** | Plaid-fed bi-weekly Owner Briefing + auto-filled templates |
| 3 | **GoldFin Advisory (Enterprise)** | **Custom** | Standing counsel with Chris Sam — the bi-weekly briefing + direct line + planning sessions. Contact-only, no self-serve checkout. |

The Enterprise tier deliberately has **no fixed price** and **no Stripe product** — CTA is "Request a conversation" → simple contact form / mailto to Chris Sam. This avoids reintroducing a $1,500 SKU and keeps the memory rule ("no $1,500 Advisory Desk with apply funnel") intact in spirit, while giving Chris a premium door for the handful of owners who want him in the room.

Memory (`mem://index.md`) will be updated from "TWO rungs only" → "Free · $150/mo · Enterprise (custom, contact-only). Never a public $1,500 price."

### 2. About page — full rewrite from decks

File: `src/components/about/AboutPage.tsx` (rewrite in place; route already wired).

New section order, all copy drawn from the decks:

1. **Hero** — "A dedicated thought partner for business owners." Sub: "Institutional-grade financial thinking, pointed at your business — every two weeks, in plain English." CTAs: `Auto-fill my reports — $150/mo` + `Talk to Chris about Advisory →`
2. **A note from Chris** — the slide-2 letter ("You built a real business… the numbers started keeping secrets from you… the gap was never the thinking, it was access."), signed *Chris Sam, Founder · ex-Goldman Sachs banker*.
3. **The information gap** — two-column table from slide 4 ($500M company vs. $3M company). Punchline: *"The thinking isn't different. Access to it is."*
4. **What we are** — Analysis · Translation · Judgment (slide 5). "Not your accountant, your bank, or a broker. We don't file, lend, or sell. We think — with you."
5. **Who is behind it** — the flagship section. Two full bios side-by-side:

   **Chris Sam — Founder & Analyst**
   - UT Austin, B.A. Economics, minor in Business (2020)
   - 2021–23 · Bank of America Merrill Lynch — Analyst, Leveraged Finance Credit. Underwrote leveraged finance and structured credit for large-cap insurers, BDCs, and aircraft lessors.
   - 2023–26 · Goldman Sachs & Co. — Senior Associate, Capital Solutions Group. Originated, structured, and underwrote senior credit facilities of $300M–$1.5B+ across media, entertainment, professional sports, and hospitality.
   - 2026 → · Royal Bank of Canada — Vice President, Structured Credit Solutions (Los Angeles). Founder of this practice, built for owner-operated businesses.
   - *"The standard I was trained to, pointed at your numbers."*

   **Parker G — Partner, Operations**
   - Canadian business operations — on the ground.
   - Operator's lens on every file: crews, scheduling, suppliers, seasonality, and the cash rhythm of payroll, HST installments, and CRA deadlines Canadian owners actually live.
   - Walks the shop, the sites, and the books with you so analysis reflects the business as it runs — not as statements flatten it.
   - Turns findings into operating moves: pricing, staffing, scheduling, collections, sequenced so each change holds.

   **The pairing** callout: *"Chris reads the numbers + Parker reads the operation → one answer you can act on by Friday."*

6. **How we think** — Level · Trend · Driver · Distribution (slide 7).
7. **Clear lines — what we don't do** (slide 20): don't file/audit, don't lend, don't buy/sell businesses, don't advise on markets or securities.
8. **Three ways to work with us** — mirrors the new ladder (Free · Reports $150/mo · Advisory custom). Advisory card links to the contact CTA, not checkout.
9. **Final CTA** — "Ready to run your business like the desk sees it?" with the two primary CTAs.

Compliance guardrails preserved: past-tense employment, "Team experience references prior employment. GoldFin Desk is independent and not affiliated with, endorsed by, or a partner of any listed institution." disclaimer under the bios.

### 3. Supporting updates

- **`src/brand.ts`** — add `advisory: "GoldFin Advisory"`, `advisoryPrice: "Custom"` alongside existing vault/reports.
- **`src/components/home/FounderTrustStrip.tsx`** and **`src/components/how-it-works/parts/FounderTrustStrip.tsx`** — update the monogram/team blurb to include Chris + Parker names (short form) and link "Meet the team →" to `/about`. Keep the alumni line ("Goldman Sachs · BofA · RBC · Merrill Lynch") that's already there.
- **`src/components/pricing/parts/PricingLadder.tsx`** + `src/components/pricing/content.ts` — restore a third card ("Advisory — Custom · By conversation") that routes to `#advisory-contact` on the About page instead of Stripe checkout. No new Stripe product created.
- **`public/llms.txt`** — refresh with the three-tier structure and correct $150 price (currently still says $99 / $1,500).
- **`mem://index.md`** — update Core rule: two-rung → three-rung with Enterprise being custom/contact-only; keep the "never a public $1,500 price" guard.

### 4. Explicitly out of scope

- No new Stripe products or prices. Advisory stays contact-only.
- No changes to Plaid, edge functions, portal, or report generation.
- No reintroduction of the retired `/apply` funnel — Advisory contact is a single email/CTA, not a multi-step application.
- Legal, security, and FAQ pages untouched.

### Technical notes

- All copy lives in the component (no i18n layer). Deck-derived quotes are lightly edited for web reading length; the "note from Chris" is kept close to verbatim.
- Advisory CTA target: `mailto:chris@goldfindesk.com` (or existing contact address — will confirm the correct address before writing) with subject "Advisory inquiry". If no address is configured, fall back to an on-page anchor with a short form.
- Image assets from the decks are not extracted — About page stays typographic, matching current site style (no stock chart PNGs).

## Open question

The user said "custom consultation, with Chris Sam". Should Advisory be:
- **(a)** truly custom / "let's talk" with no price shown, or
- **(b)** show an anchor price (e.g. "from $X/mo") on the Advisory card?

The plan above assumes **(a)** — cleanest, avoids resurrecting the $1,500 SKU. If you want an anchor price shown, say the number and I'll fold it in before build.
