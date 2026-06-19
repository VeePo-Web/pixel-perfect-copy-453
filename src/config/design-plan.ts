/**
 * HICKORY & ROSE — Fantasy.co-Level Master Design Plan
 * 
 * DECISION-MAKING REFERENCE ONLY. Does not render anything.
 * This is the comprehensive, exhaustive design plan that governs
 * the complete transformation of the Hickory & Rose website from
 * a wedding invitation template to a world-class luxury wedding
 * planning brand website.
 * 
 * STATUS: AWAITING APPROVAL before any implementation begins.
 * 
 * Every section, component, pixel, transition, and word has been
 * considered through the lens of 50+ years at Fantasy.co, Pentagram,
 * IDEO, AKQA, Huge, Wolff Olins, B-Reel, MetaDesign, and Work & Co.
 */

export const MASTER_DESIGN_PLAN = {

  // ═══════════════════════════════════════════════════════════════════
  // 0. CRITICAL OBSERVATION — THE PROBLEM
  // ═══════════════════════════════════════════════════════════════════
  currentStateAudit: {
    problem: "The current site is built as a wedding invitation for 'Alicia & Andres' — a single-event template. Hickory & Rose is a luxury wedding PLANNING BUSINESS. The entire site must be rebuilt as a brand website that converts 'Polished Paige' from visitor to inquiry.",
    stackConfirmation: {
      framework: "React 18 ✓",
      buildTool: "Vite ✓",
      typescript: "Yes ✓",
      tailwind: "Yes ✓ (v3.4)",
      router: "react-router-dom v6 ✓",
      animation: "framer-motion (already installed) ✓",
      fonts: "Great Vibes, Cormorant Garamond, Open Sans (via Google Fonts)",
      componentLibrary: "shadcn/ui (Radix primitives) ✓",
      cssVariables: "HSL design tokens via index.css ✓",
    },
    whatMustChange: [
      "All 'Alicia & Andres' wedding content → Hickory & Rose brand content",
      "Wedding invitation sections → Business marketing sections",
      "RSVP form → Inquiry/consultation form",
      "Wedding countdown → Trust-building hero",
      "Wedding party → Team/founder story",
      "Accommodations → Service tiers",
      "Registry → Portfolio/gallery",
      "Wedding-specific pages → Business pages (Services, Portfolio, About, Approach, Inquire)",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 1. STRATEGIC ANALYSIS
  // ═══════════════════════════════════════════════════════════════════
  strategicAnalysis: {
    marketPositioning: "Hickory & Rose occupies the 'refined rustic elegance with calm luxury leadership' position in Edmonton's wedding planning market. Competitors own either 'modern/iconic luxury' (Nicole Louise, Jennifer Bergman) or 'bold personality/party energy' (Joy by Joelle). The underserved void is couples who want quiet, refined luxury with creative rustic elegance — meaning + detail without performance.",

    primaryConversionObjective: "Convert Polished Paige from website visitor to consultation inquiry. Every section, every scroll moment, every piece of copy must move her closer to clicking 'Inquire.'",

    trustBuildingMechanisms: [
      "Real wedding galleries showing cohesive design + smooth flow (not styled shoots)",
      "Testimonials specifically mentioning calm leadership, organization, and 'we actually enjoyed the day'",
      "Clear process visualization — what happens when you hire Hickory & Rose",
      "Service tier clarity — Day-Of vs Partial vs Full with honest descriptions",
      "Vendor collaboration proof — the network behind the scenes",
      "Founder story — warmth, competence, personality",
    ],

    emotionalTone: "Calm confidence. The site should feel like exhaling. Polished Paige arrives overwhelmed and quietly anxious — the site must immediately communicate: 'You can relax now. You've found your person.'",

    designDifferentiation: [
      "Editorial pacing — not a sales page, a curated experience",
      "Warm, true-to-life photography — not cold, staged luxury",
      "Generous negative space — calm through restraint",
      "Typography that feels handcrafted — not template",
      "Motion that breathes — not bounces",
      "Color palette grounded in nature — sage, cream, warm neutrals",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2. DESIGN LANGUAGE — PIXEL-LEVEL SPECIFICATION
  // ═══════════════════════════════════════════════════════════════════
  designLanguage: {
    layoutPhilosophy: {
      principle: "Editorial magazine layout meets luxury hospitality website. Asymmetric grids. Full-bleed photography alternating with generous whitespace. Content breathes.",
      maxWidth: "1400px for content, full-bleed for imagery and backgrounds",
      gridSystem: "12-column grid on desktop. Single column on mobile. 2-column on tablet.",
      sectionRhythm: "Alternating density: full-bleed image → text-heavy section → split layout → testimonial → full-bleed. Never two similar sections adjacent.",
      verticalRhythm: "Section padding: 120px top/bottom on desktop, 80px on tablet, 60px on mobile. Consistent 8px base grid.",
    },

    typographyHierarchy: {
      displayFont: {
        family: "Cormorant Garamond",
        usage: "H1 headings, hero text, section titles, pull quotes",
        weights: ["300 (Light)", "400 (Regular)", "500 (Medium)", "600 (SemiBold)"],
        style: "Elegant, editorial, timeless. The 'signature' typeface.",
        sizing: {
          h1: "clamp(2.5rem, 5vw, 4.5rem) — fluid, never jarring",
          h2: "clamp(2rem, 4vw, 3.5rem)",
          h3: "clamp(1.5rem, 3vw, 2rem)",
          pullQuote: "clamp(1.75rem, 3.5vw, 2.5rem) italic",
        },
      },
      accentFont: {
        family: "Great Vibes",
        usage: "VERY sparingly — logo accent, one decorative element per page maximum. Never for body copy or navigation.",
        rule: "Script fonts are seasoning, not the main course. One instance per viewport maximum.",
      },
      bodyFont: {
        family: "Open Sans",
        usage: "Body copy, navigation, buttons, form labels, metadata",
        weights: ["300 (Light)", "400 (Regular)", "600 (SemiBold)"],
        sizing: {
          body: "16px / 1.7 line-height — comfortable reading",
          small: "14px / 1.6",
          caption: "12px / 1.5 uppercase tracking-wider for labels",
        },
      },
      letterSpacing: {
        uppercase: "0.15em — used for labels, nav items, section markers",
        headings: "-0.02em — subtle tightening for editorial feel",
        body: "0 — natural",
      },
    },

    colorSystem: {
      philosophy: "Grounded in nature. Sage greens, warm creams, deep text colors. Nothing artificial. The palette should feel like a walk through a forest clearing at golden hour.",
      tokens: {
        sageDeep: "hsl(140, 25%, 35%) — primary brand color, depth and authority",
        sage: "hsl(140, 20%, 45%) — secondary sage, softer",
        sageLight: "hsl(140, 25%, 90%) — backgrounds, subtle washes",
        sageMist: "hsl(140, 15%, 96%) — near-white with sage warmth",
        cream: "hsl(40, 30%, 95%) — warm background alternative",
        creamDark: "hsl(35, 20%, 88%) — borders, subtle separators",
        warmWhite: "hsl(40, 20%, 98%) — primary background",
        textPrimary: "hsl(30, 15%, 20%) — primary text, warm near-black",
        textSecondary: "hsl(30, 10%, 45%) — secondary text, muted warmth",
        textLight: "hsl(30, 10%, 60%) — tertiary text, captions",
        teal: "hsl(180, 25%, 35%) — accent for CTAs, links",
        tealLight: "hsl(180, 20%, 90%) — accent backgrounds",
        gold: "hsl(40, 50%, 55%) — sparingly for premium accents",
      },
      usage: {
        backgrounds: "warmWhite primary, cream for alternating sections, sageLight for feature sections, sageMist for subtle differentiation",
        text: "textPrimary for headings and body, textSecondary for supporting copy, textLight for captions and metadata",
        accents: "teal for interactive elements (CTAs, links, hover states), sageDeep for brand moments, gold for premium accents (sparingly)",
        borders: "creamDark for subtle dividers, sage at 20% opacity for section separators",
      },
      darkMode: "Not applicable for Hickory & Rose. The brand is warm and light. Dark mode would contradict the brand identity.",
    },

    spacingSystem: {
      baseUnit: "8px grid",
      scale: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "80px",
        "5xl": "120px",
        "6xl": "160px",
      },
      sectionPadding: {
        desktop: "120px vertical",
        tablet: "80px vertical",
        mobile: "60px vertical",
      },
      componentGaps: {
        cardGrid: "32px gap",
        textBlocks: "24px between paragraphs",
        headingToBody: "16px",
        sectionTitleToContent: "48px",
      },
    },

    motionPhilosophy: {
      principle: "Motion should feel like calm breathing — gentle reveals, soft fades, editorial timing. Never dramatic, never attention-seeking, never bouncy.",
      easingCurve: "cubic-bezier(0.25, 0.1, 0.25, 1.0) — smooth, confident, settling",
      durations: {
        microInteraction: "150-200ms — hover states, button feedback",
        scrollReveal: "400-600ms — section content appearing",
        pageTransition: "300-500ms — route changes",
        heroAnimation: "800-1200ms — initial load, one-time",
      },
      rules: [
        "Only animate transform and opacity — never layout properties",
        "One element type animates at a time — never text and images simultaneously",
        "Content appears once and stays — never disappears on scroll",
        "Stagger siblings by 50-100ms for sequential reveals",
        "Respect prefers-reduced-motion — disable all animations",
        "Mobile: reduce or eliminate scroll animations",
        "Maximum 3 animated elements visible at any time",
      ],
    },

    imageryStyle: {
      photography: [
        "Warm, true-to-life color grading — no heavy filters",
        "Editorial composition — intentional framing, negative space",
        "Candid documentary moments — genuine emotion",
        "Detail-forward — florals, textures, setup details, tablescapes",
        "Polished but not sterile — life within the frame",
        "Natural light preferred — golden hour, soft window light",
      ],
      avoid: [
        "Generic stock wedding photos",
        "Cold, clinical luxury imagery",
        "DIY rustic aesthetic",
        "Pinterest collage look",
        "Overly filtered or heavily edited",
        "Posed, stiff group shots as hero images",
      ],
      treatment: {
        heroImages: "Full-bleed, slight warm overlay for text legibility",
        galleryImages: "Clean, no overlay, consistent aspect ratios",
        proofImages: "Intimate, detail-focused, warm tones",
        backgroundTextures: "Subtle paper, linen, or natural textures at very low opacity",
      },
    },

    uiDensity: "Low-medium. Generous whitespace communicates luxury. Content is curated, not crowded. Every element earns its space.",

    shadowsAndDepth: {
      subtle: "0 2px 8px hsl(30 15% 20% / 0.06) — cards, elevated elements",
      medium: "0 8px 24px hsl(30 15% 20% / 0.08) — modals, dropdowns",
      large: "0 16px 48px hsl(30 15% 20% / 0.12) — hero overlays, featured elements",
      none: "No box-shadow for borders or separators — use border-color instead",
    },

    bordersAndRadii: {
      radius: {
        none: "0px — sharp edges for editorial elements, cards",
        sm: "4px — buttons, inputs, small elements",
        md: "8px — cards, containers",
        full: "9999px — pill buttons, tags",
      },
      borders: {
        subtle: "1px solid hsl(35 20% 88%) — creamDark",
        accent: "2px solid hsl(140 25% 35%) — sageDeep for emphasis",
        decorative: "1px solid hsl(140 20% 45% / 0.2) — sage at low opacity",
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // 3. WEBSITE ARCHITECTURE — PAGES & SECTIONS
  // ═══════════════════════════════════════════════════════════════════
  websiteArchitecture: {
    pages: {
      home: {
        route: "/",
        purpose: "First impression. Communicate brand promise, build trust, guide to inquiry.",
        h1: "Luxury Wedding Planning in Edmonton — Refined, Calm, Unforgettable",
        metaDescription: "Hickory & Rose is Edmonton's luxury wedding planner specializing in refined rustic elegance. Day-of coordination, partial & full-service planning. Calm leadership, elevated design.",
        sections: [
          {
            id: "hero",
            type: "Full-screen hero with editorial photography",
            content: "Brand promise headline + subline + Inquire CTA",
            headline: "Your wedding day, effortlessly beautiful.",
            subline: "Refined planning. Calm leadership. Every detail, intentional.",
            cta: "Begin Your Story",
            design: "Full-bleed warm editorial image. Sage overlay at 40%. Centered text. Cormorant Garamond display. Subtle scroll indicator.",
          },
          {
            id: "brand-promise",
            type: "Text-centered narrative section",
            content: "The emotional hook — why Hickory & Rose exists",
            copy: "Calm becomes a luxury. We protect what matters most on your wedding day: your presence, your peace of mind, and the freedom to fully feel it.",
            design: "Warm white background. Generous padding. Pull quote typography. Sage decorative line above and below.",
          },
          {
            id: "services-overview",
            type: "3-column card layout",
            content: "Day-Of Coordination, Partial Planning, Full-Service Planning",
            design: "Cream background. Cards with subtle shadow. Each card: icon/illustration, service name, one-sentence description, 'Learn More' link. Cormorant headings.",
          },
          {
            id: "editorial-image-break",
            type: "Full-bleed photography",
            content: "A single stunning editorial wedding image — detail shot (florals, tablescape, candlelight)",
            design: "Full-width, aspect-ratio 21:9 on desktop, 16:9 on mobile. No text overlay. Let the image speak.",
          },
          {
            id: "proof-section",
            type: "Testimonial + gallery preview",
            content: "One powerful testimonial with photo + mini gallery of 3-4 real wedding images",
            design: "Split layout: testimonial on left (pull quote style), gallery grid on right. Sage mist background.",
          },
          {
            id: "approach-preview",
            type: "Process/philosophy teaser",
            content: "How Hickory & Rose works — 3 steps: Vision → Planning → Celebration",
            design: "Numbered steps with editorial typography. Warm white background. Horizontal layout on desktop, vertical on mobile.",
          },
          {
            id: "about-teaser",
            type: "Founder introduction",
            content: "Brief founder story with portrait photo",
            design: "Split layout: photo on one side, story on the other. Asymmetric — photo slightly larger. Warm, personal tone.",
          },
          {
            id: "cta-section",
            type: "Full-width CTA band",
            content: "Invitation to inquire",
            copy: "Ready to feel calm about your wedding day?",
            cta: "Let's Talk",
            design: "Sage deep background. White text. Centered. Generous padding. Single CTA button.",
          },
        ],
      },

      services: {
        route: "/services",
        purpose: "Detail service tiers. Answer 'what do I get?' and 'which one is right for me?'",
        h1: "Wedding Planning Services — Edmonton",
        sections: [
          "Hero with service philosophy",
          "3 service tiers with detailed descriptions",
          "Comparison overview (not a grid — editorial cards)",
          "Process timeline for each tier",
          "FAQ section (service-specific)",
          "Inquiry CTA",
        ],
      },

      portfolio: {
        route: "/portfolio",
        purpose: "Visual proof. Show real weddings with cohesive design and smooth execution.",
        h1: "Real Weddings — Edmonton Wedding Portfolio",
        sections: [
          "Filterable gallery (by venue, season, style)",
          "Featured wedding stories (editorial layout with narrative)",
          "Detail shots showcasing design cohesion",
          "Inquiry CTA",
        ],
      },

      about: {
        route: "/about",
        purpose: "Build trust through founder story, philosophy, and personality.",
        h1: "Meet Hickory & Rose — Your Edmonton Wedding Planner",
        sections: [
          "Founder portrait + story",
          "Philosophy / approach narrative",
          "Values that drive the work",
          "Vendor collaboration philosophy",
          "Inquiry CTA",
        ],
      },

      approach: {
        route: "/approach",
        purpose: "Show the process. Reduce anxiety by making the unknown known.",
        h1: "Our Approach — How We Plan Your Perfect Day",
        sections: [
          "Philosophy statement",
          "Step-by-step process visualization",
          "What to expect at each stage",
          "Timeline expectations",
          "Inquiry CTA",
        ],
      },

      inquire: {
        route: "/inquire",
        purpose: "Convert. Gentle, warm inquiry form. Not a cold contact page.",
        h1: "Start Planning Your Wedding — Inquire Today",
        sections: [
          "Warm welcome copy",
          "Inquiry form (name, email, date, venue, service interest, message)",
          "What happens after you inquire (process preview)",
          "FAQ mini-section",
        ],
      },

      faq: {
        route: "/faq",
        purpose: "Answer objections. Reduce friction. Build confidence.",
        h1: "Frequently Asked Questions — Edmonton Wedding Planning",
        sections: [
          "Grouped FAQ with accordion",
          "Categories: Services, Pricing, Process, Coverage Area",
          "Inquiry CTA at bottom",
        ],
      },
    },

    navigation: {
      items: [
        { label: "Home", path: "/" },
        { label: "Services", path: "/services" },
        { label: "Portfolio", path: "/portfolio" },
        { label: "About", path: "/about" },
        { label: "Approach", path: "/approach" },
        { label: "Inquire", path: "/inquire", isCTA: true },
      ],
      behavior: {
        desktop: "Transparent on hero → solid sage-deep/white on scroll. Logo left, links center, Inquire CTA right.",
        mobile: "Hamburger → full-screen overlay with staggered reveals. Inquire CTA always visible.",
        scrollTransition: "200-300ms custom easing. Triggers after hero section exit.",
        activeState: "Subtle underline animation on current page link.",
      },
    },

    conversionFlow: {
      primary: "Homepage → Services → Portfolio → Inquire",
      secondary: "Homepage → About → Approach → Inquire",
      ctaStrategy: "Every page ends with an inquiry CTA section. Inquire button in nav on every page. Never more than 2 clicks from the inquiry form.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // 4. COMPONENT SYSTEM PLAN
  // ═══════════════════════════════════════════════════════════════════
  componentSystem: {
    primitives: {
      SectionWrapper: "Consistent vertical padding, max-width, responsive behavior. Accepts background color token.",
      Container: "Max-width container with horizontal padding. Centers content.",
      SectionTitle: "Cormorant Garamond heading with optional subtitle, decorative line, and animation.",
      Button: {
        variants: ["primary (sage deep, white text)", "secondary (outlined, sage border)", "ghost (text only, teal color)", "cta (teal background, white text, slightly larger)"],
        states: "default, hover (subtle scale + color shift), focus (visible ring), disabled (muted)",
        sizes: ["sm", "md", "lg"],
      },
      TextBlock: "Paragraph styling with consistent line-height, max-width for readability (65ch).",
      DecorativeLine: "Thin sage line used as visual separator. Configurable width and alignment.",
      Badge: "Small uppercase label for categories, tags, service tiers.",
    },

    sections: {
      HeroSection: "Full-screen with image, overlay, headline, subline, CTA. Configurable per page.",
      BrandPromiseSection: "Text-centered emotional copy block with decorative elements.",
      ServiceCardsSection: "3-column card layout with service tiers.",
      TestimonialSection: "Pull quote with attribution, optional photo. Multiple layout variants.",
      GallerySection: "Responsive image grid with lightbox. Filterable.",
      ProcessSection: "Numbered steps with editorial typography.",
      FounderSection: "Split layout with portrait and narrative.",
      CTASection: "Full-width band with headline and button.",
      FAQSection: "Grouped accordion with semantic HTML.",
      InquiryFormSection: "Warm, spacious form with validation.",
      EditorialImageBreak: "Full-bleed photography with no text.",
    },

    patterns: {
      splitLayout: "Two-column asymmetric layout (60/40 or 55/45). Image + text. Reversible.",
      cardGrid: "Responsive grid of cards. 3 columns desktop, 2 tablet, 1 mobile.",
      pullQuote: "Large italic Cormorant text with decorative marks.",
      scrollReveal: "Wrapper component for scroll-triggered fade-in. Uses IntersectionObserver.",
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // 5. IMPLEMENTATION PLAN
  // ═══════════════════════════════════════════════════════════════════
  implementationPlan: {
    phase1_DesignSystem: {
      order: 1,
      description: "Update design tokens, colors, typography, and base styles",
      tasks: [
        "Update index.css with refined HSL color tokens for Hickory & Rose brand palette",
        "Update tailwind.config.ts with new color tokens, typography, spacing",
        "Update Google Fonts import if font weights need adjustment",
        "Create base component variants (Button, Container, SectionWrapper)",
      ],
    },

    phase2_Navigation: {
      order: 2,
      description: "Rebuild navigation as Hickory & Rose brand nav",
      tasks: [
        "New Navigation component with brand-appropriate links",
        "Desktop: transparent → solid scroll transition",
        "Mobile: full-screen overlay with staggered reveals",
        "Inquire CTA always visible",
        "Active state indicators",
      ],
    },

    phase3_Homepage: {
      order: 3,
      description: "Complete homepage rebuild",
      tasks: [
        "Hero section with brand messaging and editorial imagery",
        "Brand promise narrative section",
        "Services overview cards",
        "Editorial image break",
        "Testimonial + gallery preview",
        "Approach/process teaser",
        "Founder introduction teaser",
        "CTA section",
      ],
    },

    phase4_CorePages: {
      order: 4,
      description: "Build Services, Portfolio, About, Approach pages",
      tasks: [
        "Services page with detailed tier descriptions",
        "Portfolio page with gallery",
        "About page with founder story",
        "Approach page with process visualization",
      ],
    },

    phase5_InquiryAndFAQ: {
      order: 5,
      description: "Inquiry form and FAQ",
      tasks: [
        "Inquiry page with warm form and process preview",
        "FAQ page with grouped accordion",
        "Form validation with Zod",
      ],
    },

    phase6_Footer: {
      order: 6,
      description: "Bespoke footer as brand signature closing moment",
      tasks: [
        "Footer with nav recovery, contact info, service area",
        "Subtle brand signature element",
        "Nav/footer visual unity",
        "Legal links (privacy, terms)",
      ],
    },

    phase7_SEOAndPerformance: {
      order: 7,
      description: "SEO metadata, structured data, performance optimization",
      tasks: [
        "Page-level meta tags and titles",
        "JSON-LD structured data (LocalBusiness, Service, FAQPage)",
        "Image optimization (alt text, lazy loading, dimensions)",
        "Font preloading and display:swap",
        "Core Web Vitals optimization",
      ],
    },

    phase8_ImageGeneration: {
      order: 8,
      description: "Generate bespoke AI imagery aligned with brand",
      tasks: [
        "Hero images: warm, editorial wedding photography style",
        "Service illustrations or photography",
        "Founder/team placeholder portraits",
        "Detail shots: florals, tablescapes, candlelight",
        "Texture/pattern backgrounds (subtle linen, paper)",
      ],
    },

    phase9_PolishAndQA: {
      order: 9,
      description: "Final polish, accessibility, cross-device testing",
      tasks: [
        "Responsive testing across breakpoints",
        "Accessibility audit (contrast, keyboard nav, screen readers)",
        "Animation refinement and reduced-motion support",
        "Copy review for brand voice consistency",
        "Performance audit (Lighthouse, CWV)",
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // 6. SEO ARCHITECTURE
  // ═══════════════════════════════════════════════════════════════════
  seoArchitecture: {
    titleTemplate: "{Page Title} | Hickory & Rose — Edmonton Wedding Planner",
    canonicalBase: "https://www.hickoryandrose.com",
    structuredData: [
      "LocalBusiness (Organization) — site-wide",
      "WebSite with SearchAction — homepage",
      "Service — each service page",
      "FAQPage — FAQ sections",
      "BreadcrumbList — all pages",
    ],
    primaryKeywords: [
      "Edmonton wedding planner",
      "luxury wedding planner Edmonton",
      "wedding coordinator Edmonton",
      "day-of coordination Edmonton",
      "full service wedding planning Edmonton",
    ],
    localSignals: [
      "Edmonton, Alberta in footer and about page",
      "Service area mention on relevant pages",
      "LocalBusiness schema with address and geo coordinates",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 7. ACCESSIBILITY REQUIREMENTS
  // ═══════════════════════════════════════════════════════════════════
  accessibility: {
    standard: "WCAG 2.2 AA",
    requirements: [
      "4.5:1 contrast ratio for normal text, 3:1 for large text",
      "All images have descriptive alt text (decorative images get alt='')",
      "Semantic HTML: proper heading hierarchy, landmarks, nav, main, footer",
      "Keyboard navigable: all interactive elements focusable with visible focus indicators",
      "Skip-to-content link",
      "Form labels associated with inputs",
      "Error messages announced to screen readers",
      "prefers-reduced-motion respected",
      "Touch targets minimum 44x44px on mobile",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 8. PERFORMANCE BUDGET
  // ═══════════════════════════════════════════════════════════════════
  performanceBudget: {
    totalPageWeight: "< 1.5MB initial load",
    LCP: "< 2.5 seconds",
    INP: "< 200ms",
    CLS: "< 0.1",
    jsBundle: "< 300KB initial (code-split by route)",
    cssBundle: "< 100KB total",
    fontWeight: "< 150KB total",
    heroImage: "< 200KB (WebP/AVIF with fallback)",
  },

  // ═══════════════════════════════════════════════════════════════════
  // 9. QUALITY BAR — FANTASY.CO STANDARD
  // ═══════════════════════════════════════════════════════════════════
  qualityBar: {
    everyElement: "Must feel weighted, intentional, and premium",
    everyTransition: "Must feel smooth, earned, and substantial",
    everySection: "Must serve the conversion journey or build trust",
    everyCopy: "Must match Hickory & Rose voice: calm, warm, refined, editorial",
    everyImage: "Must feel true-to-life, warm, and editorially composed",
    everyInteraction: "Must feel calm and confident — never playful or bouncy",
    neverFinished: "There is always a refinement that can be made. No element is ever 'done.'",
  },

  // ═══════════════════════════════════════════════════════════════════
  // 10. APPROVAL GATE
  // ═══════════════════════════════════════════════════════════════════
  approvalStatus: {
    status: "AWAITING APPROVAL",
    instruction: "This plan must be reviewed and approved before any implementation begins. Once approved, execution follows the phase order defined in implementationPlan.",
    nextStep: "Review this plan. Approve to begin Phase 1 (Design System), or provide feedback for refinement.",
  },

} as const;
