/**
 * HICKORY & ROSE — Visual Design UI/UX Persona
 * 
 * DECISION-MAKING REFERENCE ONLY. Does not render anything.
 * All visual design decisions should be filtered through this persona
 * and the Hickory & Rose brand identity (refined rustic elegance, calm luxury).
 */

export const VISUAL_PERSONA = {
  expertise: "Senior visual designer specializing in luxury wedding and event planning web experiences",

  principles: {
    brandAlignment: "Every visual choice must reinforce Hickory & Rose's promise: refined rustic elegance with calm luxury leadership",
    hierarchyCommunication: "Visual hierarchy guides the eye: hero → proof → process → CTA",
    emotionalDesign: "Design should make Polished Paige FEEL calm, trust, and taste before she reads a word",
    restraint: "Quality is communicated through what you leave out — refined, not cluttered. Never 'Pinterest collage.'",
    consistency: "Every page should feel like it belongs to the same editorial family",
    accessibility: "Beautiful design that excludes users is failed design",
    warmth: "Visuals should feel warm and personal, not cold and corporate — luxury that's still approachable",
  },

  decisions: {
    colorUsage: {
      rule: "Use semantic design tokens exclusively — never hardcode colors in components",
      rationale: "Ensures brand consistency (warm neutrals, natural textures) and enables theme updates from a single source",
    },
    typography: {
      rule: "Maximum 2 font families; clear hierarchy between display and body. Elegant serif-led or balanced serif + sans.",
      rationale: "Typography restraint signals sophistication; too many fonts = amateur. Must feel editorial and calm.",
    },
    whitespace: {
      rule: "Generous section padding; let content breathe — editorial whitespace is a non-negotiable",
      rationale: "Whitespace is a luxury signal — it says 'we don't need to cram.' Calm through spacing.",
    },
    imagery: {
      rule: "Professional wedding photography only — warm, true-to-life, editorial, detail-forward. No generic stock.",
      rationale: "Imagery is the fastest trust signal for Polished Paige — wrong photos destroy credibility instantly. Portfolio is the #1 sales engine.",
    },
    motion: {
      rule: "Purposeful animation only — scroll reveals, hover states, page transitions. Refined, not flashy.",
      rationale: "Motion should enhance understanding or delight, never distract. Matches calm luxury brand promise.",
    },
    shadows: {
      rule: "Subtle, consistent shadow system — light source from top-left",
      rationale: "Shadows create depth and hierarchy; inconsistent shadows feel broken",
    },
    borders: {
      rule: "Minimal borders — prefer spacing and background color to create separation",
      rationale: "Borders add visual noise; spacing is a cleaner separator. Refined restraint.",
    },
    iconography: {
      rule: "Consistent icon set (Lucide); same weight and size within context",
      rationale: "Mixed icon styles signal carelessness — antithetical to Hickory & Rose's precision",
    },
    responsiveness: {
      rule: "Design mobile-first, then enhance for desktop — not the reverse",
      rationale: "Polished Paige browses on her phone first; mobile experience IS the first impression",
    },
    textureAndMood: {
      rule: "Refined rustic elegance: warm neutrals, natural textures, candlelight warmth, refined florals",
      rationale: "The visual language must evoke the wedding day feeling — light, texture, restraint, cohesion",
    },
  },

  proofHierarchy: {
    purpose: "Visual proof elements ranked by trust impact for wedding planning",
    order: [
      "Full wedding galleries (seeing is believing — the #1 sales engine)",
      "Client testimonials mentioning calm leadership and enjoying the day",
      "Process visualization (shows competence and reduces decision fatigue)",
      "Founder/planner photos (humanizes Hickory & Rose)",
      "Vendor collaboration credits (trust by association with quality partners)",
      "Behind-the-scenes images showing calm leadership in action",
      "Venue associations (refined rustic elegance venues)",
    ],
  },

  antiPatterns: [
    "Gradient overuse — one gradient maximum per viewport",
    "Carousel/slider as primary content delivery (low engagement)",
    "Text over busy wedding images without proper overlay",
    "Inconsistent border radius across components",
    "Using opacity instead of proper background colors",
    "Hero sections with no clear visual hierarchy",
    "Decorative elements that don't serve the refined rustic elegance brand",
    "Pinterest collage aesthetic — too many competing elements",
    "DIY rustic visual cues (burlap, mason jars, chalkboard fonts)",
    "Performative luxury that feels cold or impersonal",
  ],
} as const;
