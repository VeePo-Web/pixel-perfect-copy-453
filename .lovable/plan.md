
# Rewrite Persona Docs for Monthly Finance Desk + Fix Build

## Goal
Two narrow changes. No site visuals touched.

1. Replace every Hickory & Rose-specific reference inside `/personas/*.md` with Monthly Finance Desk / Cashflow-Clarity Claire equivalents, using the brand brief you pasted as the source of truth.
2. Add the missing `build:dev` script so the Lovable build stops failing.

The personas remain **reference material only** — they do not render on the site. The Zentry clone visuals stay exactly as they are.

---

## Part 1 — Persona rewrites (`/personas/*.md`)

Each file currently contains a TS module describing a guidance persona for the wedding-venue brand. I will rewrite each one in place, keeping the same filename and the same structural sections (executive summary, demographics, narrative, JTBD, objections, decision filters, etc.), but swap every concept to the new business.

### Global find/replace baseline
- "Hickory & Rose" → "Monthly Finance Desk"
- "Polished Paige" → "Cashflow-Clarity Claire"
- Wedding venue / bride / Edmonton / Meg Wolodko → Owner-led small business / business owner / Chris Sam (founder, institutional finance background — no Goldman Sachs claims)
- "Refined rustic elegance" brand voice → "Calm, premium, institutional-style financial clarity"
- Sage / cream / Cormorant Garamond / Jost / Great Vibes → Deep charcoal, warm white, champagne gold, deep green, electric blue accents; editorial sans-serif headlines, highly readable sans body
- Inquiry wizard / Veepo / venue gallery → Application funnel (3 steps), free template library, sample bi-weekly briefing
- "Inquire" CTA → "Apply for the Monthly Finance Desk" (primary) / "Get Free Templates" (secondary)

### File-by-file intent
- **ideal-customer.md** — Replace Polished Paige with Cashflow-Clarity Claire. Use the full Claire profile from the brief: $30K–$250K/mo revenue, 3–30 team, agencies/clinics/trades/etc., surface vs real problem, buying psychology, internal monologue, awareness stages, objection map.
- **master-visual.md** — Three core filters reframed for a premium finance product. "Private financial operating room" instead of "honor the wedding day." Calm authority over rustic warmth.
- **brand-identity-architect.md** — New positioning ("More than bookkeeping. Lighter than a full CFO."), category name (Financial Clarity-as-a-Service), offer name (The Monthly Finance Desk), tone rules, phrases to use / phrases to avoid from section 26 of the brief.
- **strategic-narrative.md** — Belief chain (7 beliefs from section 9), awareness-stage map (section 8), emotional arc (section 14).
- **discovery-framework.md** — Replace bride-discovery questions with owner financial-discovery questions (revenue range, current stack, biggest frustration, monthly review willingness, $1,500/mo comfort).
- **market-research.md** — Competitor landscape: QuickBooks, Ramp, Mercury, bookkeepers, fractional CFOs. Gap = recurring interpretation + monthly rhythm. Middle-intent search strategy.
- **nav-architect.md / ui-navigation.md** — Nav items: How It Works, What You Get, Sample Report, Pricing, FAQ + "Apply for Premium" CTA. Minimal header, no dropdowns.
- **footer-architect.md / ui-footer.md** — Footer for a serious finance product. Privacy/data handling surfaced (not buried). No external branding except where required.
- **ui-visual.md** — Color tokens (near-black, warm white, champagne, deep green, electric blue), typography scale, motion rules (no AI-chaos animations, calm transitions), "glass-like report card" treatment.
- **scroll-motion.md** — Restrained motion philosophy: soft input glow, cards fill in one-by-one, briefing-generated transition. No confetti, no spinning coins.
- **responsive-mobile.md** — Mobile-first prompt box, demo chips wrap, sample briefing stacks below input. Application flow optimized for mobile.
- **frontend-engineer.md** — Stack rules for the Monthly Finance Desk (React + TS + Tailwind, Plaid integration boundaries, AI assist boundaries, sample briefing rendered from typed JSON).
- **performance-engineer.md** — Perf budgets for a finance product (fast first paint on hero, defer briefing-generation skeleton, avoid heavy media).
- **seo-expert.md / seo-faq.md / image-seo.md** — Keyword set around "fractional CFO alternative," "small business financial clarity," "monthly finance review service." Comparison-page SEO map (vs QuickBooks, vs Ramp, vs bookkeeper, vs CFO). FAQ schema for pricing/security/fit objections.
- **ui-footer.md / ui-navigation.md / ui-visual.md** — see above (visual system).
- **index.md** — Update the table of contents to describe each persona's new role and brand.

Each rewritten file keeps the `DECISION-MAKING REFERENCE ONLY. Does not render anything.` disclaimer at the top so future agent turns treat it correctly.

---

## Part 2 — Fix build

Add one line to `package.json` scripts:

```json
"build:dev": "vite build --mode development"
```

Then re-trigger the build to confirm green.

---

## What I will NOT do

- Touch any file in `src/` or `public/` — the Zentry clone stays visually identical.
- Wire personas into runtime imports — they remain reference docs.
- Add the Plaid / AI / application flow to the actual site (that's the "Full website rebuild" option you declined).

## Notes
- Files: 19 persona `.md` files + `package.json`. Roughly 4–6k words of rewritten persona content total.
- Founder claims will use the safe language from the brief ("institutional finance experience" / "institutional-style financial clarity") — no Goldman Sachs reference.
