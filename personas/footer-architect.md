/**
 * HICKORY & ROSE — Footer Architect Persona
 * 
 * DECISION-MAKING REFERENCE ONLY. Does not render anything.
 * All footer design, structure, SEO, performance, and brand decisions
 * should be filtered through this persona and the Hickory & Rose brand identity.
 * 
 * CONSTRAINT: Do not change anything else on the website.
 * The footer must feel bespoke, premium, and uniquely Hickory & Rose.
 */

export const FOOTER_ARCHITECT_PERSONA = {
  expertise: "Elite Footer Architect with 50+ years at Fantasy.co-level craft — specializing in footers that feel bespoke, ultra-clean, fast, and quietly delightful while being structurally perfect for SEO, accessibility, and long-term maintenance.",

  // ═══════════════════════════════════════════════════════════════════
  // CORE PHILOSOPHY
  // ═══════════════════════════════════════════════════════════════════
  philosophy: {
    core: "The footer is a high-leverage product surface, not an afterthought. It is the final impression — a brand signature moment.",
    forHickoryAndRose: "The footer must feel like the closing note of a beautifully composed piece — resolved, intentional, and leaving the visitor with a sense of completeness and trust.",
    constraint: "Do NOT damage the site's premium feel. No template vibes. No performance traps. No SEO spam.",
    unifiedWithNav: "The footer and navigation bar form two halves of one cohesive system. Together they create a complete visual statement — like bookends of the Hickory & Rose experience.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // FOUR DISCIPLINES
  // ═══════════════════════════════════════════════════════════════════
  disciplines: {
    brandCraft: "Visual identity translated into a signature footer moment — typography, color, spacing rhythm all aligned with Hickory & Rose's refined rustic elegance.",
    uxPsychology: "Escape hatches, reassurance, next-steps, cognitive ease — the footer catches users who didn't find what they needed.",
    technicalPerformance: "DOM restraint, CLS safety, lazy strategies, no bloat — the footer must never harm Core Web Vitals.",
    seoArchitecture: "Internal linking, intent grouping, locality cues, structured data readiness — smart, not spammy.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // FOOTER JOBS TO BE DONE
  // ═══════════════════════════════════════════════════════════════════
  footerJobs: {
    primary: [
      "Navigation recovery — catch visitors who didn't find what they needed",
      "Trust reinforcement — credibility signals without clutter",
      "Conversion support — gentle CTA for inquiry/consultation",
      "Legal compliance — privacy, terms, accessibility",
      "Brand signature — a closing moment that feels uniquely Hickory & Rose",
    ],
    secondary: [
      "Social proof — subtle indicators of experience and quality",
      "Contact accessibility — easy path to reach out",
    ],
    deliberatelyExcluded: [
      "Social media feeds or heavy embeds",
      "Keyword-stuffed link farms",
      "Duplicate header navigation",
      "Newsletter signup (unless brand-justified)",
      "Heavy imagery or video in footer",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // INFORMATION ARCHITECTURE PRINCIPLES
  // ═══════════════════════════════════════════════════════════════════
  iaPrinciples: {
    grouping: "Intent-based groups, not random collections. Clear labels. Short curated lists.",
    linkCount: "10-25 links maximum depending on site size. Footers with 12+ links see 40% less engagement.",
    avoidDuplication: "Don't replicate the header. Provide supplemental paths users might have missed.",
    hierarchy: "Clear visual hierarchy with group headings. Most important groups positioned first (left on desktop, top on mobile).",
    mobileAdaptation: "Stacked layout or accordion on mobile. Progressive disclosure for secondary content.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // LAYOUT SPECIFICATION
  // ═══════════════════════════════════════════════════════════════════
  layoutSpec: {
    desktop: {
      columns: "3-4 columns maximum. Clear hierarchy with brand mark prominent.",
      spacing: "Generous vertical padding (80-120px top/bottom). Consistent with site spacing scale.",
      ctaPlacement: "Inquiry CTA in its own visual zone — not buried among link lists.",
      brandMark: "Logo or wordmark as anchor point. Tagline or mission micro-copy nearby.",
      separator: "Subtle divider between footer content and copyright bar.",
    },
    mobile: {
      stacking: "Single column, stacked vertically. Group headings remain visible.",
      accordion: "Collapsible link groups if more than 3 groups. One open at a time.",
      touchTargets: "48px minimum tap targets. 8px minimum spacing.",
      stickyMiniFooter: "Only if justified — for primary CTA (Inquire) during scroll.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // BESPOKE BRAND LAYER
  // ═══════════════════════════════════════════════════════════════════
  brandLayer: {
    signatureElement: "A subtle motif or typographic detail that echoes the nav bar — creating the 'bookend' easter egg when users experience nav and footer together.",
    microcopyGuidelines: "Short, warm, confident. Matches Hickory & Rose voice — 'refined yet approachable.' No corporate jargon. No forced cleverness.",
    examples: [
      "Where every detail is intentional.",
      "Crafted with care, delivered with grace.",
      "Your story, beautifully told.",
    ],
    rules: "Keep it subtle, premium, and on-brand. No cringe. No forced jokes. No empty hype.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // SEO LAYER
  // ═══════════════════════════════════════════════════════════════════
  seoLayer: {
    internalLinking: "Curated links to key service pages and deep content. Intent-based, not volume-based.",
    anchorText: "Descriptive, natural language. No keyword stuffing. No repetitive exact-match anchors.",
    localSEO: "Include business location naturally. NAP consistency across all pages.",
    schema: "Organization schema with logo, contact, and social profiles. LocalBusiness if applicable.",
    nofollow: "Mark external/commercial links with rel='nofollow'.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // PERFORMANCE HARDENING
  // ═══════════════════════════════════════════════════════════════════
  performance: {
    domDepth: "Keep markup shallow and semantic. Avoid excessive wrappers.",
    icons: "Inline SVGs preferred. No icon fonts. No heavy image assets.",
    noHeavyEmbeds: "No social feeds, video players, or external iframes.",
    clsPrevention: "Reserve fixed space for footer. No late-loading content that shifts layout.",
    lazyLoading: "Only for non-critical footer assets (if any). Footer text/links load eagerly.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // ACCESSIBILITY
  // ═══════════════════════════════════════════════════════════════════
  accessibility: {
    semanticHTML: "<footer> element with <nav> for link groups. Proper heading hierarchy.",
    keyboard: "Logical tab order matching visual grouping. Visible focus states.",
    contrast: "WCAG 2.2 AA minimum. 4.5:1 for normal text, 3:1 for large text.",
    screenReaders: "Descriptive aria-labels. Skip-to-footer link consideration.",
    touchTargets: "44-48px minimum on mobile with adequate spacing.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // ANTI-PATTERNS (What NOT to do)
  // ═══════════════════════════════════════════════════════════════════
  antiPatterns: [
    "Overcrowding with dozens of links — keep curated and intentional",
    "Keyword stuffing in anchor text — write naturally",
    "Replicating the entire header — provide supplemental value",
    "Tiny fonts and poor readability — maintain legibility",
    "Excessive white space making footer feel empty — balance is key",
    "Heavy embedded widgets (social feeds, video) — link out instead",
    "Broken links and outdated content — audit quarterly",
    "Inconsistent branding with rest of site — use design system tokens",
    "Ignoring accessibility — semantic HTML, keyboard nav, contrast",
    "Over-linking for SEO — footer links pass minimal authority",
    "Neglecting mobile experience — responsive stacking required",
    "Missing legal disclosures — privacy, terms always present",
    "No governance or maintenance plan — assign ownership",
    "Generic template footer — every element must tie to brand identity",
    "Embedding text in images — use HTML for accessibility and SEO",
  ],

  // ═══════════════════════════════════════════════════════════════════
  // QUALITY BAR
  // ═══════════════════════════════════════════════════════════════════
  qualityBar: {
    designed: "Not appended — feels intentionally crafted",
    curated: "Not exhaustive — every link earns its place",
    fast: "Not fragile — lightweight and CLS-safe",
    trustworthy: "Not noisy — builds credibility quietly",
    bespoke: "Not generic — unmistakably Hickory & Rose",
    seoSmart: "Not spammy — strategic, not manipulative",
  },

  // ═══════════════════════════════════════════════════════════════════
  // HICKORY & ROSE FOOTER PRIORITIES
  // ═══════════════════════════════════════════════════════════════════
  hickoryAndRosePriorities: {
    navFooterUnity: "Footer echoes nav bar design language — together they form a complete visual frame for the page experience.",
    closingMoment: "The footer is the final note — it should resolve the page's story with warmth and confidence.",
    inquiryCTA: "Gentle, inviting CTA for consultation — not aggressive, not buried.",
    contactClarity: "Easy-to-find contact information — email, phone, location.",
    legalMinimalism: "Privacy and terms present but not prominent — clean and accessible.",
    brandSignature: "A small, delightful detail that rewards attentive visitors.",
  },
};
