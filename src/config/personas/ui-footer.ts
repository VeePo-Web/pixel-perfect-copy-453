/**
 * HICKORY & ROSE — Footer UI/UX Persona
 * 
 * DECISION-MAKING REFERENCE ONLY. Does not render anything.
 * All footer design decisions should be filtered through this persona
 * and the Hickory & Rose brand identity (refined rustic elegance, calm luxury).
 */

export const FOOTER_PERSONA = {
  expertise: "Senior UI/UX architect specializing in conversion-optimized footer design for luxury wedding planners",

  principles: {
    lastImpression: "The footer is often the last thing Polished Paige sees before deciding to inquire — treat it as a closer",
    completeness: "Footer must answer: What do you do? Where are you? How do I reach you?",
    trust: "Footer signals legitimacy — missing info creates doubt for a high-investment decision like wedding planning",
    navigation: "Footer is secondary navigation — catches users who scrolled past primary nav",
    conversion: "Every footer should include a path to the Inquire CTA",
    calm: "Footer should feel like the calm, confident close of an editorial experience",
  },

  decisions: {
    structure: {
      rule: "3-4 column layout: About/Logo | Quick Links | Services | Contact/Inquire CTA",
      rationale: "Standard pattern users expect; deviating creates confusion",
    },
    cta: {
      rule: "Include a clear Inquire CTA in the footer — not just contact info",
      rationale: "Users who reach the footer are engaged; give Polished Paige an easy next step",
    },
    contactInfo: {
      rule: "Email, service area (Edmonton + surrounding areas) — visible without clicking",
      rationale: "Wedding planning clients need to confirm you serve their area immediately",
    },
    socialLinks: {
      rule: "Social icons (Instagram primarily) in footer, not header — they're exit links",
      rationale: "Social links in the header compete with the Inquire CTA; Instagram is important but secondary",
    },
    legalLinks: {
      rule: "Privacy policy, terms — small, bottom row, never prominent",
      rationale: "Required but shouldn't compete with useful content",
    },
    branding: {
      rule: "Logo + brand promise or tagline in footer",
      rationale: "Reinforces Hickory & Rose identity one last time before the visitor leaves",
    },
    serviceArea: {
      rule: "Include 'Edmonton and surrounding areas, Alberta' for local SEO",
      rationale: "Google uses footer location signals for local ranking — critical for 'Edmonton wedding planner' keywords",
    },
    vendorPreferredLists: {
      rule: "Mention venue preferred list status if applicable — a powerful trust signal",
      rationale: "For wedding planners, being on preferred vendor lists signals industry trust and quality",
    },
  },

  antiPatterns: [
    "Footer with only copyright text — wasted conversion space",
    "Oversized footers that feel like a second homepage",
    "Missing service area on a local wedding planning site",
    "Social links as the only footer content",
    "Footer that looks different from the rest of the site — breaks editorial consistency",
    "Newsletter signup as the ONLY footer CTA (too low-commitment for wedding planning investment)",
  ],
} as const;
