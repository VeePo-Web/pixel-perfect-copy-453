## Goal

Add a single new persona file: **`personas/brand-identity-and-decisions-filter.md`** that consolidates the 5 uploaded PDFs into one authoritative "decisions filter" doc the agent uses to evaluate every future copy, UI, and structural choice for the Monthly Finance Desk site.

No other files change. No site code changes. Existing `/personas/*.md` files stay as-is.

## File: `personas/brand-identity-and-decisions-filter.md`

Structure (one doc, ~700–900 lines, agent-reference only — never rendered):

1. **Purpose & how to use**
   - This is the master decisions filter. Before approving any copy block, section, color, CTA, or interaction, the agent runs it through Section 12 (the decision checklist).
   - Source of truth: 5 uploaded PDFs (market research, business description, ideal design, ideal customer, brand identity). Where docs conflict, the brand identity + ideal design docs win for tone/visual; business description wins for offer facts; market research wins for competitive positioning.

2. **Category & offer (locked facts)**
   - Category: **Financial Clarity-as-a-Service**
   - Offer name: **The Monthly Finance Desk**
   - Price: **$1,500/month USD**
   - Stack: expert-built spreadsheets → Plaid bank connection → AI-assisted organization → bi-weekly plain-English briefings → monthly 1-hour strategy call with Chris Sam.
   - Free tier: spreadsheet template library (lead capture, SEO engine).
   - Founder: Chris Sam, described as VP at Goldman Sachs in LA. Public copy never says "Goldman Sachs for small businesses"; use "institutional-style" / "investment-bank-style".

3. **Positioning between four worlds** (ASCII diagram)
   - Spend management (Ramp/Brex/Mercury) | AI bookkeeping (Pilot/Zeni/Puzzle/QBO/LiveFlow) | Fractional CFO ($3k+/mo) | DIY spreadsheets.
   - The Monthly Finance Desk sits in the gap: "more than bookkeeping, lighter than a CFO."
   - Counter-positioning lines per competitor (one each for Ramp, Brex, Mercury, Pilot, Puzzle, Runway, QuickBooks, fractional CFOs).

4. **Master persona: Cashflow-Clarity Claire**
   - Business profile: $300k–$3M/yr, $30k–$250k/mo, 3–30 people, recurring expenses, has bookkeeper/QuickBooks/payroll/CPA, no full-time finance hire.
   - Surface problem → real problem → private fear → emotional desire → identity desire (the 5-layer stack from PDF 1.4).
   - Ideal industries (agencies, clinics, trades, pro services, e-comm, hospitality, creative studios, small law/accounting) and disqualifiers (pre-revenue, hobby, needs full bookkeeping cleanup, already has CFO/FP&A).
   - Internal-dialogue bank (12+ verbatim thoughts she has *before* landing) — pulled from PDF 1.4 §4.

5. **Awareness stages & belief chain**
   - 5 belief stages she must move through (problem-aware → solution-aware → product-aware → trust → desire).
   - The 5 emotional states the hero must trigger in order: Recognition → Discomfort → Curiosity → Safety → Desire.

6. **Voice & tone**
   - Tone: executive clarity, calm, premium, plain-spoken. Never hype, never "AI magic," never "supercharge," never "revolutionize," never confetti/orbs.
   - Mandatory words: clarity, rhythm, plain-English, review, serious, owner-led, finance desk, monthly, briefing, decisions, cash movement, spending patterns, financial discipline, more than bookkeeping, lighter than a full CFO.
   - Forbidden phrases (exact list from PDF 1.5 §13 + PDF 1.4 §13): "AI-powered spreadsheet automation," "Unlock AI magic," "Revolutionize your finances," "Goldman Sachs for small businesses," "Get started," "Learn more," "Submit," "Book now," "Contact us."
   - Approved tagline bank: "Stop running your business from your bank balance.", "Institutional-style financial clarity for owner-led businesses.", "Your monthly finance desk.", "Software shows numbers. We help you understand what they mean.", "More than bookkeeping. Lighter than a full CFO."

7. **Locked hero spec**
   - Eyebrow: "For serious small business owners"
   - Headline: "Stop Running Your Business From Your Bank Balance"
   - Subheadline: per PDF 1.3 §3 ("Most owners have bank statements… recurring finance rhythm…").
   - Primary CTA: "Generate My Sample Finance Briefing" | Secondary: "Get Free Templates" | Premium CTA (header): "Apply for Premium".
   - Interactive prompt box + 6 demo chips (Agency, Clinic, Trades, Consultant, E-commerce, Local Service).
   - Right-panel: "Sample Bi-Weekly Finance Briefing" with sections Cash Movement / Revenue Trend / Expense Pattern / Unusual Spend / Questions to Review / Decisions to Consider.
   - Trust microcopy: "No bank connection required for the preview. Use demo data or enter rough non-sensitive numbers."
   - 4 hero variants (A Pain-First, B Premium Authority, C Outcome-First, D Category-Creation) preserved as A/B options.

8. **Locked homepage section order** (11 sections from PDF 1.1 §5)
   Hero → Pain → Category gap → How it works (5 steps) → What you get (5-part stack) → Why not software → Why not CFO → Sample report preview → Pricing → Application CTA → Free template fallback CTA.

9. **Visual system (decisions filter)**
   - Feel target: private finance room / premium SaaS / executive reporting / high-trust command center. Never: bookkeeping app, cheap template store, consumer-app, tax-season service.
   - Palette: deep charcoal/black background, warm white type, subtle champagne-gold or deep-green accent, restrained electric blue only for AI/data states, soft gray borders. No purple/indigo gradients. No neon. No confetti.
   - Type: serif-influenced or premium grotesk for headlines; clean sans body. No playful fonts, no rounded consumer-app type.
   - Imagery: product UI mockups, report previews, spreadsheet fragments, glass-like cards, thin grid lines. No stock-photo people pointing at laptops. No cartoon finance icons.
   - Motion: calm, slow, intentional. No loading theatrics, no jittery counters.

10. **Objection bank (with on-page response)**
    8 objections from PDF 1.5 §15 each paired with the exact page element that answers it: "I already have QuickBooks," "I already have a bookkeeper," "Is my business too big/small?," "Is my data safe?," "Who is Chris Sam?," "Why $1,500?," "Do I still need a CPA?," "Will I still need monthly review time?"

11. **Application qualification logic (3 steps)**
    Step 1 contact/revenue/goal → Step 2 business context → Step 3 fit (comfort with $1,500, willing to review monthly, has bank to connect via Plaid).

12. **The decisions filter — 12 yes/no questions**
    Before shipping any copy block, section, color, CTA, or component, the agent must answer YES to all 12:
    1. Does it speak to Claire's *real* problem (interpretation), not her surface problem (more data)?
    2. Does it use approved vocabulary and avoid forbidden phrases?
    3. Does it feel like a private finance room, not a SaaS landing page?
    4. Does it respect the four-world positioning (not bookkeeping, not dashboard, not CFO, not template store)?
    5. Does it use calm, premium motion/visuals (no hype, no orbs, no confetti)?
    6. Does it preserve the locked hero spec (Section 7)?
    7. Does it preserve the locked homepage section order (Section 8)?
    8. Does it route low-intent visitors to free templates and high-intent to the application?
    9. Does it avoid overclaiming Goldman Sachs affiliation publicly?
    10. Does it advance Claire through the belief chain (Section 5)?
    11. Does it qualify hard — respectfully repelling non-fit buyers?
    12. Does it answer at least one objection from the objection bank (Section 10)?

13. **Conflict-resolution rules**
   - If new user feedback conflicts with this doc → ask before overriding, and update this file in the same turn so it stays the single source of truth.
   - If two PDFs conflict → see Section 1 precedence rule.

## Out of scope
- No changes to other persona files.
- No site code changes (Zentry clone keeps rendering until you ask for the rebuild).
- No memory index changes (already points to the personas folder).
