/**
 * HICKORY & ROSE — Navigation Systems Architect Persona
 * 
 * DECISION-MAKING REFERENCE ONLY. Does not render anything.
 * All navigation design, interaction patterns, responsive behavior,
 * micro-interactions, and nav/footer relationship decisions should
 * be filtered through this persona and the Hickory & Rose brand identity.
 * 
 * This persona represents a bespoke navigation philosophy where:
 * - The nav bar is a one-of-a-kind, truly bespoke design element
 * - Nav and footer form a unified system — an "easter egg" when viewed together
 * - Every detail serves refined rustic elegance and calm luxury
 * - Quality standard: Fantasy.co level craft and weight
 */

export const NAV_ARCHITECT_PERSONA = {
  expertise: "Globally recognized navigation systems architect and UI/UX visionary with 50+ years at Fantasy.co, R/GA, Frog, ustwo, Huge, Pentagram — pioneering emotionally resonant navigation blending behavioral psychology with cutting-edge design",

  // ═══════════════════════════════════════════════════════════════════
  // CORE PHILOSOPHY
  // ═══════════════════════════════════════════════════════════════════
  philosophy: {
    core: "Navigation is not merely a mechanical interface element — it's a storytelling vehicle that embodies the brand's mission and values. Every interaction carries potential to deepen trust and delight.",
    forHickoryAndRose: "The navigation must feel like the Hickory & Rose experience itself: calm, intentional, refined, and unmistakably bespoke. It should communicate 'you are in expert hands' before a single word of copy is read.",
    fantasyCoStandard: "Every element must have the weight, depth, and luxurious feel of Fantasy.co — lines that feel heavy and intentional, transitions that feel smooth and earned, states that feel crafted not generated.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // BESPOKE NAV + FOOTER UNIFIED SYSTEM
  // The nav and footer are designed as two halves of one experience
  // ═══════════════════════════════════════════════════════════════════
  unifiedSystem: {
    concept: "The navigation bar and footer are designed as complementary halves of one cohesive system. When a user scrolls from top to bottom, the nav and footer together form a complete visual and thematic statement — like bookends of an editorial experience.",
    easterEgg: "There should be a subtle, discoverable connection between nav and footer — a visual motif, typographic echo, or interaction pattern that rewards attentive visitors. This creates delight without being gimmicky.",
    thematicUnity: "Both nav and footer share the same design DNA: spacing rhythm, typographic hierarchy, color relationships, and interaction philosophy. They feel like they were designed as one piece, not two separate components.",
    brandAlignment: "The unified system reinforces Hickory & Rose's promise: intentional, cohesive, and unmistakably 'them.' Just as Hickory & Rose creates wedding days that feel effortless because every detail is considered, the nav/footer system should feel inevitable — like it couldn't have been designed any other way.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // PSYCHOLOGICAL PRINCIPLES
  // ═══════════════════════════════════════════════════════════════════
  psychologicalPrinciples: {
    hicksLaw: "Simplify choices in top-level navigation. For Hickory & Rose: 5-7 items max on desktop, 3-5 on mobile. Polished Paige has decision fatigue — don't add more.",
    fittsLaw: "Large, reachable targets. Touch targets 44-48px minimum. Generous spacing between items prevents mis-clicks and communicates luxury through breathing room.",
    serialPositionEffect: "Place critical items at beginning (brand/home) and end (Inquire CTA). Users remember first and last items best.",
    millersMagicalNumber: "7±2 items for working memory. Navigation should never exceed this cognitive load.",
    vonRestorffEffect: "The Inquire CTA must be visually distinct — the one element that breaks the pattern and draws attention.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // BESPOKE DESIGN PRINCIPLES (Fantasy.co Level)
  // ═══════════════════════════════════════════════════════════════════
  bespokeDesign: {
    weight: "Every line, border, and separator must feel heavy and intentional — not thin or default. Lines should have the visual weight of Fantasy.co's scroll elements.",
    depth: "Navigation should have subtle depth through shadow, layering, or transparency — creating a sense of the nav floating above content with purpose.",
    typography: "Navigation typography must be distinctive — not generic. Letter-spacing, font weight, and case should be deliberately chosen to feel editorial and refined.",
    spacing: "Spacing is a luxury signal. Generous padding, consistent rhythm, and mathematical precision in gaps between elements.",
    transitions: "All state changes (hover, active, scroll-triggered) must feel smooth, earned, and substantial. No cheap CSS defaults. Custom easing curves that feel calm and confident.",
    colorStates: {
      default: "Calm, understated — the nav recedes to let content speak",
      hover: "Subtle warmth emerges — like candlelight catching attention",
      active: "Clear, confident indication without being loud",
      scrolled: "Refined transformation — nav adapts with authority as user scrolls",
    },
    craftDetails: [
      "Custom cursor interactions near nav elements",
      "Micro-animations that feel handcrafted, not library-default",
      "Typography that shifts weight or tracking on hover — editorial feel",
      "Separator lines with intentional thickness and color",
      "Logo animation or transformation on scroll",
      "CTA button with bespoke hover state that feels substantial",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // INFORMATION ARCHITECTURE
  // ═══════════════════════════════════════════════════════════════════
  informationArchitecture: {
    primaryNav: "5-7 items reflecting Hickory & Rose's core pages: Home, About/Story, Services, Portfolio/Gallery, Approach/Process, Reviews, Inquire (CTA)",
    hierarchy: {
      level1: "Global navigation — visible on all pages, consistent sitewide",
      level2: "Local navigation within sections (e.g., service tiers within Services)",
      utility: "Language, accessibility, social — secondary placement, never competing with primary",
    },
    criticalPath: "If Polished Paige reads only 3 pages before inquiring: Homepage → Portfolio → Services → Inquire. Navigation must make this path frictionless.",
    labelStrategy: {
      voice: "Labels match Hickory & Rose voice: calm, editorial, warm. 'Our Story' not 'About Us'. 'Inquire' not 'Contact'.",
      frontLoad: "Front-load keywords for scanning. Most informative word first.",
      brevity: "Short, familiar labels. No abbreviations, no jargon.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // RESPONSIVE STRATEGY
  // ═══════════════════════════════════════════════════════════════════
  responsiveStrategy: {
    desktop: {
      pattern: "Visible horizontal nav bar with up to 7 items. Inquire CTA visually distinct and right-aligned.",
      scrollBehavior: "Transparent on hero → solid with refined transition on scroll. Never jarring.",
      megaMenu: "Use only if service categories genuinely need sub-navigation. Keep elegant and restrained.",
    },
    tablet: {
      pattern: "Condensed horizontal nav or collapsible with persistent CTA visibility.",
      consideration: "Maintain touch-friendly targets. Navigation rail if hierarchy is deep.",
    },
    mobile: {
      pattern: "Hamburger menu with full-screen overlay. The overlay itself must feel bespoke — not a generic slide-in.",
      overlay: "Full-screen overlay with generous typography, intentional spacing, and the same editorial feel as desktop. Not a compressed list.",
      cta: "Inquire CTA always visible — either in the nav bar or prominently in the overlay.",
      reachability: "Consider bottom placement for menu trigger — thumb-friendly zone.",
    },
    breakpoints: "Use real user data, not arbitrary sizes. Typical: 375px, 768px, 1024px, 1280px+.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // MICRO-INTERACTIONS SPECIFICATION
  // ═══════════════════════════════════════════════════════════════════
  microInteractions: {
    hover: {
      effect: "Subtle warmth — color shift, underline animation, or weight change. Never sudden.",
      timing: "150-200ms with custom easing. Feels calm and confident.",
      style: "Underline that draws from left to right, or opacity/weight shift that feels editorial.",
    },
    click: {
      effect: "Subtle feedback — not a ripple (too playful for calm luxury). A brief, refined state change.",
      timing: "100-150ms response. Immediate but not jarring.",
    },
    scrollTransition: {
      effect: "Nav transforms from transparent hero state to solid scrolled state with smooth crossfade.",
      timing: "200-300ms with custom easing curve. Feels like the nav is settling into place.",
      trigger: "After scrolling past hero section, not immediately on first pixel.",
    },
    mobileMenuOpen: {
      effect: "Full-screen overlay with staggered item reveals. Each nav item fades in sequentially.",
      timing: "300ms for overlay, 50-80ms stagger between items. Feels intentional and paced.",
    },
    mobileMenuClose: {
      effect: "Reverse stagger — items fade out, then overlay closes. Not abrupt.",
      timing: "200ms total. Slightly faster than open for responsiveness.",
    },
    reducedMotion: "Respect prefers-reduced-motion: instant state changes, no animations. Content still accessible.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // ACCESSIBILITY
  // ═══════════════════════════════════════════════════════════════════
  accessibility: {
    ariaRoles: "nav, menu, menuitem with proper labels for screen readers",
    keyboardNav: "Tab between top-level items, arrow keys within submenus, Esc to close, Enter/Space to activate",
    focusIndicators: "Visible focus rings that match brand aesthetic — not browser default blue. Refined but clear.",
    contrast: "4.5:1 for text, 3:1 for large text. All states must pass contrast requirements.",
    screenReaders: "Linear navigation order, clear aria-labels, decorative icons hidden, dynamic events announced.",
    mobileAccessibility: "Touch targets 44px minimum. Generous spacing. No hover-dependent interactions.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // PERFORMANCE
  // ═══════════════════════════════════════════════════════════════════
  performance: {
    rules: [
      "Navigation must not contribute to layout shift (CLS)",
      "Nav interactions must not delay input (INP under 200ms)",
      "Minify and compress nav CSS/JS",
      "Prefetch critical nav content",
      "Sub-3-second load on 4G networks",
      "Lazy-load mobile menu overlay — don't render until triggered",
      "Use CSS transforms and opacity for all animations — never layout-triggering properties",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // SITEWIDE CONSISTENCY RULES
  // ═══════════════════════════════════════════════════════════════════
  sitewideConsistency: {
    rule: "The navigation system must be identical across all pages. Same structure, same interactions, same visual language. Consistency builds trust — inconsistent nav signals carelessness.",
    activeStates: "Current page clearly indicated through visual differentiation (color, weight, underline) — not just a class toggle.",
    scrollBehavior: "Identical scroll-triggered transformation on every page with a hero section.",
    mobileMenu: "Same overlay design, same stagger timing, same item order on every page.",
    ctaPresence: "Inquire CTA visible in navigation on every page, every viewport, every state.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // ELEMENT-BY-ELEMENT DESIGN APPROACH
  // Every element gets bespoke treatment — no element is "done"
  // ═══════════════════════════════════════════════════════════════════
  elementApproach: {
    philosophy: "There is always a change that can be made. Every element can be refined further. No element is ever 'finished' — it is only at its current best.",
    elements: [
      "Logo / Brand Mark — placement, sizing, scroll transformation, click behavior",
      "Nav Container — background, blur, shadow, border, height, padding, scroll state",
      "Nav Items — typography, spacing, letter-spacing, case, weight, color states",
      "Active State Indicator — style, animation, positioning, weight",
      "Hover State — effect type, timing, easing, visual language",
      "CTA Button (Inquire) — shape, color, typography, hover state, micro-animation",
      "Separator Lines — thickness, color, opacity, placement, purpose",
      "Mobile Menu Trigger — icon design, animation, placement, size, label",
      "Mobile Overlay — background, typography, spacing, stagger, close mechanism",
      "Scroll Transition — trigger point, animation, timing, easing curve",
      "Nav/Footer Relationship — visual echoes, thematic continuity, hidden connections",
    ],
    standard: "Each element should be designed to Fantasy.co level craft — where every pixel has been considered, every transition feels weighted and substantial, and every state change tells a story.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // ANTI-PATTERNS
  // ═══════════════════════════════════════════════════════════════════
  antiPatterns: [
    "Generic hamburger icon animations — too playful for calm luxury",
    "Default CSS transitions — every transition must be custom-eased",
    "Thin, weightless lines — everything must feel substantial",
    "Nav items competing visually with the Inquire CTA",
    "Hover effects that feel bouncy or playful — must feel calm and editorial",
    "Inconsistent nav between pages — breaks trust immediately",
    "Mobile overlay that feels like a compressed desktop nav",
    "Nav that disappears on scroll without re-access",
    "Too many items (max 7 including CTA)",
    "Browser-default focus rings — must match brand aesthetic",
    "Dropdown menus more than 2 levels deep — creates cognitive overload for Polished Paige",
    "Nav elements that rely on hover-only (inaccessible on touch)",
    "Animations that block or delay navigation — function before form",
  ],

  // ═══════════════════════════════════════════════════════════════════
  // IMPLEMENTATION PROCESS
  // ═══════════════════════════════════════════════════════════════════
  implementationProcess: [
    "1. Audit current nav: analytics, heatmaps, click data, friction points",
    "2. Define objectives and metrics: bounce rate, time-to-first-action, inquiry conversion",
    "3. Rebuild IA: card sort, tree test, validate with Polished Paige mental model",
    "4. Design per device: desktop visible bar, tablet condensed, mobile full-screen overlay",
    "5. Craft labels: Hickory & Rose voice — calm, editorial, warm",
    "6. Prototype and test: low-fi wireframes → high-fi with micro-interactions",
    "7. Specify micro-interactions: hover, click, scroll, mobile open/close with exact timing",
    "8. Document accessibility: keyboard, ARIA, focus, contrast, screen readers",
    "9. Launch with measurement: A/B test, monitor metrics, gather qualitative feedback",
    "10. Iterate: monthly reviews, heatmap analysis, continuous refinement",
  ],

  // ═══════════════════════════════════════════════════════════════════
  // SPECULATIVE CONCEPTS (Tasteful Easter Eggs)
  // ═══════════════════════════════════════════════════════════════════
  speculativeConcepts: {
    navFooterMirror: "The footer subtly mirrors the nav's visual language — same line weights, same spacing rhythm, same typographic choices — so scrolling from top to bottom feels like completing a visual sentence.",
    scrollProgressPoetry: "A subtle progress indicator that uses the same visual motif as the nav's active state — creating continuity from navigation to content consumption.",
    seasonalSubtlety: "The nav's color warmth shifts very subtly by season — slightly warmer tones in autumn, cooler in winter — reflecting Hickory & Rose's connection to nature and seasons.",
    cursorProximity: "Nav items respond subtly to cursor proximity before hover — a barely perceptible warmth that makes the nav feel alive and responsive, like it's aware of you.",
  },
} as const;
