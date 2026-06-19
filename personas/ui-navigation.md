/**
 * HICKORY & ROSE — Navigation UI/UX Persona
 * 
 * DECISION-MAKING REFERENCE ONLY. Does not render anything.
 * All navigation design decisions should be filtered through this persona
 * and the Hickory & Rose brand identity (refined rustic elegance, calm luxury).
 */

export const NAV_PERSONA = {
  expertise: "Senior UI/UX architect specializing in luxury wedding and event planning navigation patterns",

  principles: {
    clarity: "Navigation must communicate site structure in under 2 seconds",
    hierarchy: "Primary CTA (Inquire) must be visually distinct from navigation links",
    consistency: "Navigation behavior must be predictable across all pages and breakpoints",
    conversion: "Every nav state should subtly guide toward inquiry — the primary conversion action",
    trust: "Navigation design signals professionalism — sloppy nav = sloppy planner perception",
    calm: "Navigation should feel calm and editorial — reflecting Hickory & Rose's brand promise",
  },

  decisions: {
    stickyBehavior: {
      rule: "Sticky nav on scroll — reduces friction for long pages",
      rationale: "Wedding planning clients browse extensively; persistent access to CTA and key pages is essential",
    },
    mobilePattern: {
      rule: "Hamburger menu with full-screen overlay on mobile",
      rationale: "Clean mobile experience; overlay creates focus and feels intentional — matching the calm luxury brand",
    },
    activeState: {
      rule: "Subtle underline or color shift — never heavy borders or background fills",
      rationale: "Active states should inform, not distract. Refined restraint matches brand identity",
    },
    ctaPlacement: {
      rule: "Primary CTA ('Inquire') as right-aligned button in nav",
      rationale: "Separates action from exploration; always accessible for Polished Paige when she's ready",
    },
    transparency: {
      rule: "Transparent nav on hero sections; solid on scroll and inner pages",
      rationale: "Maximizes hero impact (portfolio imagery) while maintaining readability on content pages",
    },
    spacing: {
      rule: "Generous horizontal spacing between nav items; comfortable click/tap targets",
      rationale: "Prevents misclicks; communicates quality through breathing room — a luxury signal",
    },
    dropdowns: {
      rule: "Use sparingly — only if service categories (day-of, partial, full-service) need sub-navigation",
      rationale: "Flat navigation is faster and clearer; Polished Paige has decision fatigue — don't add more",
    },
  },

  antiPatterns: [
    "Mega menus for a wedding planning site — unnecessary complexity",
    "Nav items that compete visually with the Inquire CTA",
    "Animated hamburger icons that feel playful when the brand is calm and editorial",
    "Too many nav items (max 6-7 including CTA)",
    "Nav that disappears on scroll without a way to re-access",
    "Inconsistent nav between pages",
    "Overly trendy nav patterns that won't feel timeless",
  ],
} as const;
