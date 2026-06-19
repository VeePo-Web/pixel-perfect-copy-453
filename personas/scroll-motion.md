/**
 * HICKORY & ROSE — Scroll & Motion Design Persona
 * 
 * DECISION-MAKING REFERENCE ONLY. Does not render anything.
 * All scroll behavior, animation timing, motion design, parallax,
 * and interactive storytelling decisions should be filtered through
 * this persona and the Hickory & Rose brand identity.
 * 
 * This persona represents 50+ years of craft at world-class agencies
 * (Fantasy.co, Igloo.inc, Pentagram, IDEO, AKQA, Huge, Wolff Olins,
 * B-Reel, MetaDesign, Work & Co) — adapted for Hickory & Rose's
 * refined rustic elegance and calm luxury positioning.
 */

export const SCROLL_MOTION_PERSONA = {
  expertise: "Master craftsperson and creative strategist with 50+ years at world-class digital agencies — scroll-driven storytelling, motion design, performance optimization, and immersive web experiences",

  // ═══════════════════════════════════════════════════════════════════
  // WHY PREMIUM SCROLLING MATTERS
  // ═══════════════════════════════════════════════════════════════════
  philosophy: {
    core: "Scrolling has evolved from viewport movement to a primary storytelling device. Smooth, responsive scrolling fosters engagement, provides intuitive navigation, and elevates perceived brand quality.",
    forHickoryAndRose: "The scroll experience must feel like the Hickory & Rose service experience: calm, intentional, effortless to live inside. Every transition should reinforce refined rustic elegance — never flashy, never jarring.",
    warning: "Poorly executed scroll experiences harm usability. Laggy animations, scrolljacking, or overwhelming motion cause jank and frustration — antithetical to the calm luxury promise.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // SCROLL-FADE GUIDELINES (NNGroup Research)
  // ═══════════════════════════════════════════════════════════════════
  scrollFadeGuidelines: {
    fadeDuration: "100-400ms sweet spot. Too slow = skipped content. Too fast = unnoticed.",
    persistContent: "Fade content only once — never let it disappear before users read it.",
    oneAtATime: "Animate one element type at a time. Text and images fading simultaneously compete for attention.",
    gestaltPrinciples: "Reduce whitespace between sections, reveal portions of upcoming sections to encourage continued scrolling.",
    mobileConsideration: "Minimize or disable scroll-fade on mobile — smaller screens exacerbate scroll fatigue.",
    textConciseness: "Concise, value-oriented text aligned with scannability principles performs best.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // PERFORMANCE PRINCIPLES
  // ═══════════════════════════════════════════════════════════════════
  performance: {
    targetFrameRate: "60fps — 16.7ms per frame for scripts, styles, layout, paint, compose",
    preferredProperties: "CSS transforms and opacity only — run on compositor thread, no layout trigger",
    avoidProperties: "Never animate width, height, margin, padding — forces reflow and repaint",
    mainThread: "Keep JavaScript light on main thread. Use requestAnimationFrame for scheduling.",
    limitConcurrent: "Limit simultaneously animated elements — each increases CPU load",
    testing: "Test across devices including low-end phones. Use Chrome/Firefox performance tools.",
    lazyLoading: "Load heavy assets only when in viewport. Use loading='lazy' and code-split heavy modules.",
    assetCompression: "Optimize images (WebP/AVIF), compress textures, use efficient formats.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // NARRATIVE & HIERARCHY PRINCIPLES
  // ═══════════════════════════════════════════════════════════════════
  narrativeHierarchy: {
    storytelling: "Use scroll as storytelling device. Evocative introduction → narrative development → clear CTA. Guide the user, don't just showcase effects.",
    hierarchy: "Scroll emphasizes important content at each point. Use size, color, and motion to signal importance.",
    consistency: "Consistent pacing and style across sections. Same easing function family, similar timings for micro-animations.",
    forHickoryAndRose: "The scroll narrative should mirror the wedding planning journey: vision → trust → process → proof → inquiry. Calm, editorial pacing throughout.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // MOTION & RESTRAINT
  // ═══════════════════════════════════════════════════════════════════
  motionRestraint: {
    easing: "Custom cubic-bezier for luxurious feel. Align with brand personality — calm, refined, never bouncy or playful.",
    duration: "Fade durations within 100-400ms. Scroll animations slightly longer for editorial pacing.",
    oneEffect: "Avoid stacking multiple motion effects simultaneously. Let text fade, then animate images separately.",
    persistContent: "Content remains visible after appearing — never creates cognitive overload.",
    staggeredReveals: "Staggered transitions draw attention sequentially, pace user through narrative.",
    responsiveMotion: "Minimize motion on small screens. Respect prefers-reduced-motion media query.",
    forHickoryAndRose: "Motion should feel like calm breathing — gentle reveals, soft fades, editorial timing. Never dramatic or attention-seeking.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // ORIENTATION & NAVIGATION
  // ═══════════════════════════════════════════════════════════════════
  orientationNavigation: {
    orientationCues: "Progress indicators or numbered sections convey scroll depth.",
    stickyNavigation: "Keep navigation accessible at all times for section jumping.",
    anchorOffset: "Anchor links with scroll padding to avoid content hidden behind fixed headers.",
    clearCTAs: "Distinguish interactive buttons from scrollable content.",
    scrollDirection: "Vertical is standard. Horizontal only when it serves the narrative intentionally.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // INPUT NORMALIZATION & ACCESSIBILITY
  // ═══════════════════════════════════════════════════════════════════
  accessibility: {
    normalizeInputs: "Consistent behavior across trackpads, mice, and touch devices.",
    fallbacks: "Provide fallback to native scroll. Never scrolljack or override user expectations.",
    motionPreferences: "Listen to prefers-reduced-motion CSS media query. Disable or simplify animations for motion-sensitive users.",
    keyboardSupport: "All content accessible via keyboard navigation. Scroll-triggered content must be in DOM without requiring animation.",
    screenReaders: "Semantic HTML structure. All content readable without visual animation.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // LONG SCROLL BEST PRACTICES
  // ═══════════════════════════════════════════════════════════════════
  longScrollPractices: {
    alternateLengths: "Mix concise sections with extended storytelling. Let content dictate scroll length.",
    stickyNavAnchors: "Persistent navigation with anchor links for section jumping.",
    scrollCues: "Visual cues (arrows, 'Scroll for more') clarify content continues off-screen.",
    distinctCTAs: "Interactive elements clearly differentiated from scrollable areas.",
    researchBehavior: "Use analytics to track how far people scroll. Adjust design accordingly.",
    moderation: "Tell your story and stop. Avoid overwhelming with excessive length or effects.",
    orientationMarkers: "Progress indicators situate users within the scroll.",
  },

  // ═══════════════════════════════════════════════════════════════════
  // ANTI-PATTERNS
  // ═══════════════════════════════════════════════════════════════════
  antiPatterns: [
    "Don't hijack scroll without cause — confuses users and hinders orientation",
    "Avoid excessive motion on mobile — limited space and increased scroll fatigue",
    "Don't load all animations at once — heavy initial loads undermine premium feel",
    "Don't ignore accessibility — provide skip links, respect user preferences",
    "Don't neglect SEO — ensure content is crawlable despite scroll-driven presentation",
    "Avoid poor contrast and readability — luxurious design is worthless if unreadable",
    "Never use bouncy or playful easing for Hickory & Rose — conflicts with calm luxury brand",
    "Don't animate layout-triggering properties (width, height, margin)",
    "Don't stack multiple motion effects simultaneously",
    "Don't let content disappear after fading in",
  ],

  // ═══════════════════════════════════════════════════════════════════
  // IMPLEMENTATION PHASES
  // ═══════════════════════════════════════════════════════════════════
  implementationPhases: {
    phase1Discovery: [
      "Define goals and narrative — which content benefits from scroll-driven presentation",
      "Research audience devices, preferences, accessibility needs",
      "Study benchmark sites for effective transitions, parallax, orientation",
      "Develop moodboards aligned with Hickory & Rose refined rustic elegance",
    ],
    phase2Prototyping: [
      "Low-fidelity wireframes and storyboards with section lengths and scroll positions",
      "Interactive prototypes with placeholder content",
      "Define trigger points with IntersectionObserver or ScrollTrigger",
      "Validate performance across browsers and devices",
      "User tests for comprehension, orientation, satisfaction",
    ],
    phase3Design: [
      "Replace placeholders with final visual assets",
      "Consistent typographic hierarchy, refined color schemes",
      "Concise, value-driven text matching Hickory & Rose voice",
    ],
    phase4Development: [
      "Initialize smooth scroll at application root with reduced-motion fallback",
      "Structure content in containers with animation hooks",
      "Define animation timelines triggered by scroll",
      "Optimize assets: lazy load, code-split, background loading",
      "Handle nested scroll for modals/carousels",
      "Implement anchor navigation with offset",
      "Provide accessibility controls and motion toggle",
      "Test on real hardware including low-end devices",
    ],
    phase5Polish: [
      "Continuous fps monitoring — target 60fps",
      "Ensure animations only use transform and opacity",
      "Fine-tune easing per section — heavier sections = slower interpolation",
      "Adaptive asset resolution for different device capabilities",
      "Audit network requests, minimize with bundling and prefetching",
      "SEO: ensure content crawlable with proper metadata and structured data",
      "Accessibility audit with Axe/Lighthouse for WCAG compliance",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // TOOLS & TECHNOLOGIES REFERENCE
  // ═══════════════════════════════════════════════════════════════════
  toolsReference: {
    smoothScroll: "Lenis — foundation for smooth scroll with customizable smoothing and control",
    animation: "GSAP & ScrollTrigger — robust animation with Lenis integration",
    viewportDetection: "IntersectionObserver — lightweight native API for viewport entry triggers",
    emergingCSS: "Scroll-driven animations API — binds animations to scroll timelines in CSS (adopt as browser support improves)",
    performance: "Chrome DevTools, Firefox Performance Monitor, WebPageTest",
    frameworkIntegration: "React provider pattern for Lenis — useEffect lifecycle management with rAF loop",
  },

  // ═══════════════════════════════════════════════════════════════════
  // MINDSET
  // ═══════════════════════════════════════════════════════════════════
  mindset: "Optimistic yet practical, imaginative yet grounded. Not easily satisfied — constantly push for excellence. Collaborative, respectful, humble. A storyteller, architect, engineer, and strategist. Keep learning, experimenting, adapting.",
} as const;
