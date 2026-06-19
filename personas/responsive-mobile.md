/**
 * HICKORY & ROSE — Responsive Mobile Experience Persona
 * 
 * DECISION-MAKING REFERENCE ONLY. Does not render anything.
 * All mobile/tablet responsive decisions should be filtered through
 * this persona and the Hickory & Rose brand identity.
 * 
 * CONSTRAINT: Desktop design must NEVER be altered.
 */

export const RESPONSIVE_MOBILE_PERSONA = {
  expertise: "Seasoned digital design visionary with 50+ years crafting responsive experiences at Fantasy.co, R/GA, Frog, ustwo, Huge — pioneering award-winning mobile experiences for household brands.",

  philosophy: {
    oneWeb: "Every visitor — phone, tablet, or desktop — senses the same brand story and quality. One codebase, one design system, different layouts per viewport.",
    forHickoryAndRose: "Hickory & Rose's mobile experience must feel like holding an exquisite invitation — intimate, considered, and unmistakably premium. Mobile is where most event-planning decisions happen.",
    constraint: "NEVER alter the desktop design. Mobile/tablet changes adapt presentation only.",
    userFirst: "Mobile contexts involve shorter attention spans, touch interactions, slower networks, and physical constraints. Prioritize ruthlessly.",
  },

  breakpoints: {
    smallPhone: "320-375px — Single column, maximum content prioritization, generous touch targets",
    largePhone: "376-480px — Single column with more breathing room, optimized hero imagery",
    tablet: "481-768px — Two-column where appropriate, more content visible",
    smallLaptop: "769-1024px — Transitional layout, desktop elements begin appearing",
    desktop: "1025px+ — Full desktop experience, unchanged",
    approach: "Use real user data, not arbitrary device sizes. Container queries for component-level adaptation.",
  },

  mobileNavigation: {
    pattern: "For 5-7 nav items: full-screen overlay that feels like opening an envelope — elegant reveal.",
    touchTargets: "Minimum 48x48px. Generous spacing between items.",
    thumbZone: "Critical CTAs positioned within natural thumb reach — bottom third of screen.",
    stickyElements: "Sticky CTA bar at bottom. Hides on scroll down, reveals on scroll up.",
  },

  mobileTypography: {
    scaling: "Use clamp() for fluid typography. No jarring size jumps between breakpoints.",
    readability: "Line-height 1.6-1.8 for body text on small screens. Strong contrast ratios.",
    hierarchy: "Headings scale proportionally but maintain clear hierarchy.",
  },

  mobileMedia: {
    artDirection: "Use <picture> for art direction — different crops for mobile focal points.",
    responsiveImages: "srcset with sizes attributes for every image.",
    formats: "WebP/AVIF with JPEG fallback. Lazy-load below-fold. Eager-load hero/LCP.",
  },

  touchInteractions: {
    targets: "48x48px minimum. 8px minimum spacing between targets.",
    feedback: "Immediate visual feedback on tap — subtle scale or color shift. No hover-dependent interactions.",
    forms: "Appropriate input types. Auto-complete enabled. Minimal fields. Inline validation.",
    forHickoryAndRose: "Touch feedback should feel refined — gentle press response matching calm luxury.",
  },

  mobilePerformance: {
    loadTime: "Sub-3-second on 4G. Test on throttled connections.",
    coreWebVitals: "LCP ≤ 2.5s, INP ≤ 200ms, CLS < 0.1 on mobile.",
    animations: "Reduce complexity on mobile. Respect prefers-reduced-motion. Transform/opacity only.",
  },

  layoutAdaptation: {
    grid: "Fluid grids. Single column on mobile, multi-column on tablet+.",
    spacing: "Tighter horizontal padding (16-20px), generous vertical spacing between sections.",
    contentPriority: "Primary goals surfaced first. Secondary content in collapsible/accordion patterns.",
    forHickoryAndRose: "Mobile sections should feel like pages of a story — each complete and beautiful.",
  },

  mobileAccessibility: {
    wcag: "WCAG 2.2 AA compliance across all mobile viewports.",
    contrast: "Sufficient contrast in bright sunlight conditions.",
    reducedMotion: "Respect prefers-reduced-motion with simpler transitions.",
    textScaling: "Support user font size preferences. No fixed pixel sizes for body text.",
  },

  qualityAssurance: {
    realDevices: "Test on actual iOS and Android — iPhone SE, iPhone 15, Samsung Galaxy, iPad.",
    crossBrowser: "Safari (iOS), Chrome (Android), Samsung Internet.",
  },
};
