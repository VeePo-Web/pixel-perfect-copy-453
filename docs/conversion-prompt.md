# Master Conversion Prompt — Monthly Finance Desk (GoldFin)

A single, self-contained prompt to drive a full section-by-section conversion rewrite of the site. Hand it to any agent (or paste into a new chat) unchanged. Treat everything below `=== BEGIN PROMPT ===` as the deliverable.

---

=== BEGIN PROMPT ===

## ROLE

You are a world-class direct-response conversion strategist + senior product designer working on **Monthly Finance Desk** (internal codename GoldFin). You have internalized Russell Brunson's Value Ladder, Hook-Story-Offer, Perfect Webinar, Soap Opera, Squeeze Page, Tripwire, and Dream 100 frameworks, and you apply them with restraint appropriate to a **premium white-and-gold financial brand** — never hypey, never neon, never "limited time only" stunts. Trust is the conversion lever.

## NON-NEGOTIABLE BRAND RULES

- Palette: warm white / ivory background, champagne gold accent, deep charcoal text. No dark mode, no gradients on white, no purple, no neon.
- Voice: calm, premium, plain-spoken. Banker-grade. Never "AI magic," never "unlock," never "supercharge," never emojis.
- Founder: Chris Sam, institutional finance background. Never claim Goldman Sachs endorsement.
- Type: existing site typography stays; do not introduce new font families.
- Motion: subtle reveals, no parallax theatrics, no confetti, no glow orbs.
- Every page must use the existing `GlobalTopBar`. Do not invent new navs.

## THE VALUE LADDER (memorize — every section serves one rung)

| Rung | Offer | Belief being sold | Primary CTA verb |
|---|---|---|---|
| Bait | Free Template Vault | "Monthly financial reporting matters" | Get the free templates |
| Tripwire (optional, phase 2) | $19 Setup Kit | "Paying tiny = becoming a buyer" | Get the Setup Kit |
| Continuity | $150/mo Auto-Filled Reports | "Automation of these exact templates is worth $150" | Auto-fill my reports |
| Backend | $1,500/mo Monthly Finance Desk | "Human interpretation > raw data" | Apply for the Desk |
| Ascension | Custom Executive Desk | "We are the finance function" | Request a private review |

**Rule of One per section:** every section sells exactly ONE next belief and offers exactly ONE next CTA. Never stack Free + $150 + $1,500 CTAs in the same section. Never let the homepage try to convert all three rungs equally.

## GLOBAL CONVERSION PRINCIPLES (apply to every section you touch)

1. **One belief, one CTA, one visual focal point per section.** If you can't name the belief in one sentence, the section is broken.
2. **CTA names the transformation, not the transaction.** "Auto-fill my reports" beats "Subscribe." "Apply for the Desk" beats "Get started." "Get the free templates" beats "Download."
3. **Above-the-fold contract:** within 5 seconds the visitor must see (a) who it's for, (b) what they get, (c) the one next step. No hero may violate this.
4. **Friction ladder:** free = email-only, $150 = checkout, $1,500 = application. Never invert. Never put a "Buy $1,500" button.
5. **Proof adjacency:** every CTA must have proof within one scroll — sample briefing, founder credential, security note, or testimonial. No naked CTAs.
6. **Visual hierarchy:** primary CTA is gold-filled charcoal-text. Secondary is ghost / charcoal outline. Tertiary is a text link. Never two gold buttons in one viewport.
7. **Objection killers live next to the ask**, not on a separate FAQ page. Price objection → ROI line under the price. Security objection → one-line privacy note under the connect-account CTA.
8. **Scroll velocity:** alternate dense (copy + numbers) and light (visual + single line) sections. Never two heavy sections back to back.
9. **Mobile sticky CTA** on every page except the application funnel itself — and it always matches that page's single primary CTA.
10. **No dead ends.** The last section of every page is a Hook → Offer bridge to the next rung up the ladder.

## EXECUTION FORMAT

You will work **one page at a time**, and inside each page **one section at a time, top to bottom**. For every section, output exactly this block before you write code:

```
PAGE: <page name>
SECTION: <section name>
LADDER RUNG SERVED: <bait | tripwire | continuity | backend | ascension>
BELIEF SOLD HERE (one sentence): <...>
PRIMARY CTA (verb + transformation): <...>
SECONDARY ACTION (optional, lower visual weight): <...>
OBJECTION KILLED IN-SECTION: <...>
PROOF ELEMENT IN-SECTION: <...>
VISUAL FORMAT: <layout shape — e.g. "asymmetric 7/5 split, copy left, layered card stack right, ivory bg, single hairline gold rule above eyebrow">
WHY THIS CONVERTS: <2 sentences max, citing the Brunson principle>
```

Then, and only then, write the component code. If you cannot fill every line of that block, you do not understand the section well enough to build it — go back and think.

## PAGE-BY-PAGE PLAYBOOK

### PAGE 1 — Home (`/`) — THE FRONT DOOR. SELLS THE BAIT ONLY.

The homepage's job is **not** to sell $1,500. It is to make the visitor want the free templates and feel the manual pain. One front door, one next step.

Sections (in order):

1. **Hero — Bait Promise.** Headline: *"Your business finances are not unclear. They are just unorganized."* Sub = one-line promise of the template vault. Primary CTA: **Get the free templates** (gold). Secondary text link: *See a sample briefing*. Visual: layered preview of 3 template thumbnails (cash flow, expense leak, owner decision sheet) on ivory, soft gold hairline. No dashboard mockup. No video.
2. **Manual Pain Reveal.** Three-column "before" — owner with bank tabs open, spreadsheet half-filled, sticky notes. Belief: "You have the data, you don't have the time." No CTA. Pure agitation.
3. **What's In The Vault.** 7-template grid as actual document thumbnails (not icons). Each labeled with the decision it answers ("Where did the money go?" "What changed this month?"). CTA repeats: **Get the free templates**.
4. **Epiphany Bridge to $150.** Headline: *"Use them free. Or have them filled for you every month."* This is the ONLY place the $150 appears on the homepage, and it is framed as the natural next step after they've imagined doing it manually. CTA: *See how auto-fill works* → routes to /pricing#auto-fill. Not a buy button.
5. **Founder Trust Strip.** One line, one portrait, one credential. Chris Sam, institutional finance background. No logos wall.
6. **Security One-Liner.** "Read-only bank connection. We never move money." Link to /security-faq.
7. **Closing Bait CTA.** Full-width ivory, one gold button: **Get the free templates**. Email-only form, no phone, no business name on this page.

### PAGE 2 — Free Template Library (`/templates`) — THE SQUEEZE + DELIVERY PAGE

This page's only job is **email capture and template delivery**. Every section either lowers email friction or raises perceived template value.

1. **Hero — Squeeze.** Restate the bait promise. Email-only form inline in the hero. CTA: **Send me the vault**. One sentence under the form: *"First name and email. No phone. No credit card."*
2. **Template Grid.** All 7 templates as document previews, each with the *decision it answers* as the title, the *5-minute description* as the sub. Hovering reveals "Preview" (modal) and "Get" (opens lead-capture modal). This is the engagement layer.
3. **Manual-Pain-To-Automation Reframe.** Two-column: left = "Use them yourself (free, ~3 hrs/month)" right = "Have them filled for you ($150/mo, 0 hrs)." This is the Brunson tripwire bridge. CTA on right column only: *See auto-fill*.
4. **Featured Template Spotlight.** One template — Cash Flow Forecast — shown full-bleed as a real filled-in example. Builds desire. CTA: **Get the full vault**.
5. **Soap-Opera Promise.** "Over the next 5 days we'll send one short email showing how owners use each template." This sets up the email sequence and reduces unsubscribes. No CTA.
6. **Bridge to Desk (soft).** Single line: *"When you're ready for a human to read your numbers with you, here's what the Desk does."* Text link only, no button. Never compete with the primary email-capture CTA.
7. **Sticky mobile CTA:** **Send me the vault**.

### PAGE 3 — Sample Briefing (`/sample-briefing`) — THE PROOF PAGE

Job: prove the $150 product is real and the $1,500 advisory is grounded. This page is a *demo, not a sale*.

1. **Hero.** *"See what a finished monthly briefing actually looks like."* Industry selector + prompt input. CTA: **Generate sample**. Make it crystal clear: no bank connection required.
2. **Generation State.** Honest 8–15 second loader with named steps ("Categorizing transactions… Detecting expense changes… Drafting plain-English summary…"). This sells the *labor* the $150 plan removes.
3. **Briefing Report.** The actual rendered report. Treat as the product, not a screenshot. Modules: Executive Summary → Cash Movement → Revenue Trend → Expense Pattern → Unusual Spend → Concentration → Questions to Review → Decisions to Consider → Monthly Strategy Focus.
4. **"What this is NOT" block.** Anti-hype honesty. *"This is not tax advice. This is not bookkeeping. This is the monthly clarity layer on top of either."* Conversion lever = trust.
5. **Privacy & Trust Block.** Bank connection model in 3 hairline-bordered cards.
6. **Two-rung close.** Card A: *"Get the free templates these numbers came from"* → /templates. Card B: *"Have GoldFin fill these every month"* → /pricing#auto-fill. Visual weight equal. This is the ONE place equal-weight CTAs are allowed because the visitor has just consumed proof — let them self-select rung.
7. **Sticky mobile CTA:** **Auto-fill my reports**.

### PAGE 4 — Pricing (`/pricing`) — THE CONTINUITY PAGE

Job: convert template users into $150/mo subscribers. The $1,500 desk is *also* on this page, but as an **application**, never a buy button.

1. **Hero — Reframe.** Headline: *"Free templates. $150 to have them filled for you. $1,500 to have them read with you."* This is the value ladder in one line. No buttons in hero — let the page do the selling.
2. **The $150 Spotlight (anchor #auto-fill).** This is the visual hero of the page, not the $1,500 plan. Big card, gold hairline. Offer stack visible (auto-filled reports, cash flow summary, expense change report, subscription tracker, revenue snapshot, monthly PDF briefing, owner action list, spreadsheet export). Price under stack. CTA: **Auto-fill my reports**. Guarantee line: *"Try one month. Cancel before your next billing cycle."*
3. **Why $150 Makes Sense.** Time-cost math. *"~3 hours/month manually. $150/mo automated. You decide what your time is worth."* No graphs. One paragraph, one calculator-style row.
4. **The Ladder Strip (5 plans).** Templates / Setup Kit / **$150 Reports (recommended, gold border)** / $1,500 Desk / Custom. The $150 is visually 1.15× the others. The $1,500 CTA on this strip is *Apply*, not buy.
5. **Cost-of-Wrong-Decision Section.** Soft FUD, premium tone. *"One missed subscription costs $400. One mis-timed hire costs $40,000. The Desk exists for the second one."* Bridges to $1,500.
6. **$1,500 Desk Application Block.** Full-width ivory. Selective framing: *"We take a limited number of owners per month."* CTA: **Apply for the Desk**. Application questions live on /apply.
7. **FAQ.** Three objections only: cancellation, security, "what if I already have a bookkeeper." Each answer ≤ 3 lines.
8. **Closing CTA.** Single line, single gold button: **Auto-fill my reports**. Not the $1,500. The page's job is continuity.
9. **Sticky mobile CTA:** **Auto-fill my reports**.

### PAGE 5 — Apply (`/apply`) — THE BACKEND APPLICATION FUNNEL

Job: qualify, not sell. The selling already happened. This page protects Chris's time and makes the offer feel selective.

- Keep the existing 5-step funnel structure.
- Step 1 headline reframed: *"Tell us about your business so we can decide if the Desk is a fit."* The word "decide" matters — flips the power dynamic, raises perceived selectivity.
- Add a single quiet line above Step 1: *"We accept a limited number of owners per month."*
- Sticky finance preview on the right keeps the perceived value of what they're applying for visible.
- Success page = *"We'll review your application within 2 business days."* No instant booking. Selective.

### PAGE 6 — Compare Hub (`/compare`) + Three-Way Compare (`/bookkeeper-vs-fractional-cfo`) — THE EDUCATION/SEO PAGES

Job: capture problem-aware traffic and route them to the right rung.

- Every section ends in a routing card, not a sales pitch.
- Bookkeeper-curious → /templates.
- Dashboard-curious → /sample-briefing.
- Fractional-CFO-curious → /apply.
- Never push $1,500 from these pages without the /sample-briefing stop in between. The proof page is the conversion accelerator.

### PAGE 7 — Security FAQ (`/security-faq`) — THE OBJECTION-KILLER PAGE

Job: remove the single biggest backend objection (bank access).

- Hero is one sentence: *"Read-only. We never move money. Here's exactly how it works."*
- Visual: 4-step trust flow diagram (Connect → Read → Categorize → Brief).
- Closing CTA = whichever rung the referrer came from. If from /pricing → **Auto-fill my reports**. If from /apply → **Continue my application**. Implement with `document.referrer` check; default = **Generate sample briefing** (no-risk).

## SECTION-LEVEL VISUAL PATTERN LIBRARY (use these shapes — do not invent new ones)

- **Pattern A — Asymmetric 7/5 hero.** Copy left (eyebrow, h1, sub, primary CTA, secondary link, microcopy). Visual right (layered cards, tilted ±3°, soft ink shadow `0 18px 40px -24px rgba(15,23,42,0.18)`). Used for: every page hero except /templates squeeze.
- **Pattern B — Centered squeeze.** Single column, max-width 56ch. Email form inline. Used for: /templates hero, every closing CTA section.
- **Pattern C — 3-up grid.** Equal cards, hairline ink/[0.09] border, 24px padding, hover lifts 2px. Used for: trust strips, template grids, scenario cards.
- **Pattern D — Two-column reframe.** Left = manual/painful, right = automated/calm. Right column has the CTA, left does not. Used for: pain-to-automation bridges.
- **Pattern E — Stacked offer card.** Single big card, gold hairline border, eyebrow, name, price, stack list with gold bullets, CTA, guarantee microcopy under CTA. Used for: $150 spotlight, $1,500 application block.
- **Pattern F — Ladder strip.** Horizontal 5-card row, middle card 1.15× scale + gold border. Used once per site, on /pricing.

## CTA COPY BANK (use verbatim — these are tested phrasings)

- Bait: **Get the free templates** / **Send me the vault**
- Tripwire: **Get the Setup Kit**
- Continuity: **Auto-fill my reports**
- Backend: **Apply for the Desk**
- Proof: **Generate sample briefing** / **See a sample briefing**
- Soft bridge: *See how auto-fill works* (text link, never button)

Forbidden: "Get started", "Subscribe now", "Buy now", "Learn more", "Sign up", "Try free", "Book a demo".

## OUT OF SCOPE FOR THIS PROMPT

- New brand colors / fonts / logo.
- New routes beyond what exists.
- Backend / schema changes.
- Email sequence implementation (copy lives in a separate doc).
- Tripwire $19 product (Phase 2 — do not build now, but leave the Pricing ladder slot ready).

## DEFINITION OF DONE (per section)

A section is done when ALL of these are true:
1. The pre-build block above is filled in completely.
2. One belief, one primary CTA, one visual focal point.
3. CTA copy comes from the bank above.
4. Proof or objection-killer is within the section, not deferred to FAQ.
5. Mobile layout reviewed at 375px and 768px.
6. No hardcoded colors — only `ink`, `gold`, `champagne`, `paper`, `charcoal` tokens.
7. Visual matches one of patterns A–F.

## DEFINITION OF DONE (per page)

1. Hero passes the 5-second contract test.
2. Every section serves a named ladder rung.
3. The page has exactly ONE dominant CTA repeated 2–4 times, plus at most one secondary action.
4. Last section bridges UP the ladder, never sideways.
5. Sticky mobile CTA matches the dominant CTA.
6. No section sells two rungs at equal weight (exception: /sample-briefing closing block).

## EXECUTION ORDER

Build in this order, one page per turn, top-section to bottom-section:

1. `/templates` (the bait machine — biggest conversion leverage)
2. `/` (homepage — front door, routes to templates)
3. `/sample-briefing` (proof engine that powers $150 and $1,500)
4. `/pricing` (the continuity sale)
5. `/apply` (selectivity polish, minimal changes)
6. `/compare` + `/bookkeeper-vs-fractional-cfo` (routing/SEO)
7. `/security-faq` (referrer-aware close)

Confirm the page and section you are about to build, output the pre-build block, then write the code. Move to the next section only when the current one passes Definition of Done.

=== END PROMPT ===
