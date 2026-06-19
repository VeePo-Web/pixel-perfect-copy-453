/**
 * HICKORY & ROSE — Website Discovery Framework
 * 
 * This file is a DECISION-MAKING REFERENCE ONLY. It does not render anything.
 * It encodes the depth of thinking behind every website decision —
 * from positioning and client psychology to conversion architecture.
 * 
 * Adapted from the Hickory & Rose Wedding and Event Planning discovery form.
 * All decision criteria are specific to refined rustic elegance weddings
 * and calm luxury leadership positioning.
 * 
 * HOW TO USE:
 * - When making UI/UX decisions, reference the relevant section
 * - Each section maps to a functional area of the website
 * - The "decisionCriteria" in each section guide implementation choices
 */

export const DISCOVERY_FRAMEWORK = {

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 1: IDENTITY, POSITIONING, AND THE NAMED PROMISE
  // Guides: Homepage hero, taglines, meta descriptions, about page
  // ═══════════════════════════════════════════════════════════════════
  identity: {
    purpose: "Define what Hickory & Rose communicates in every pixel",
    decisionCriteria: {
      brandName: "Hickory & Rose Wedding and Event Planning (short: Hickory & Rose)",
      positioningLine: "One sentence that anchors homepage and SEO. Must pass the 'say it to a stranger' test",
      namedPromise: "Hickory & Rose exists to protect presence — this drives every CTA",
      calmAsLuxury: "Calm becomes a luxury — the actions taken to create calm, not just the vibe",
      protectingPresence: "What protecting presence looks like across planning and on the wedding day — absorbing, deciding, preventing, managing so the couple can feel the day",
      coreValues: "6-12 words: calm, editorial, warm, polished, grounded, intentional, elevated, personal",
      differentiators: "Calm leadership under pressure, luxury that still feels personal, seamless logistics + elevated design, trusted vendor collaboration, tailored planning support",
    },
    voiceGuidance: {
      purpose: "Voice defines how every word on the site sounds",
      toneOptions: [
        "Calm and editorial",
        "Warm and refined",
        "Quiet confidence (minimal words, maximum authority)",
        "Collaborative and conversational",
      ],
      boundaries: "", // TODO: From Section 1.16 — never snarky, never overly trendy, no hard-sell
      reinforcementWords: ["calm", "presence", "intentional", "cohesive", "elevated", "protected", "refined"],
      prohibitedWords: [], // TODO: From Section 1.18
    },
    brandPersona: {
      purpose: "If Hickory & Rose were a guest at a wedding, how would she show up?",
      behavioralCues: "Calm leadership, warmth, discretion, precision, hospitality",
      manifesto: "", // TODO: From Section 1.19 — what weddings deserve, what she refuses to compromise on
    },
    refinedRusticElegance: {
      is: "", // TODO: From Section 1.10 — textures, palette, mood, restraint, execution standards
      isNot: "", // TODO: From Section 1.11 — never "DIY rustic," "Pinterest collage," or "performative luxury"
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 2: IDEAL CLIENT PROFILE ("POLISHED PAIGE")
  // Guides: Copy tone, imagery selection, objection handling, CTA language
  // ═══════════════════════════════════════════════════════════════════
  idealClient: {
    purpose: "Every design and copy decision should attract Polished Paige and filter out misfits",
    archetype: "Polished Paige — design-forward, detail-driven, strong taste, wants calm leadership without losing creative involvement",
    decisionCriteria: {
      clientDescription: "", // TODO: From Section 2.1 — describe Polished Paige in own words
      clientContext: "", // TODO: From Section 2.2 — her life outside wedding planning
      fears: "", // TODO: From Section 2.3 — regret, chaos, family tension, disjointed design, feeling rushed, missed moments
      desires: "", // TODO: From Section 2.4 — guest experience, meaning, story, intimacy, aesthetic, hosting, legacy
      weddingFeelForGuests: "", // TODO: From Section 2.5 — flow, warmth, hospitality, pacing
      weddingLookDescription: "", // TODO: From Section 2.6 — magazine paragraph: light, texture, restraint, cohesion, mood
      pressures: [
        "Loss aversion — she'll remember mistakes forever",
        "Social evaluation pressure — people who know taste",
        "Decision fatigue — too many choices",
        "Control paradox — wants involvement but not operational weight",
        "Family dynamics/opinions",
        "Budget ambiguity/hidden costs",
        "Vendor uncertainty — who's actually good?",
        "Timeline stress — how does a day flow?",
      ],
    },
    firstImpressions: {
      fiveSeconds:
        "Calm, elevated, immediately understood. A single beautiful image, a quiet headline, no noise — her shoulders drop before she reads a word.",
      thirtySeconds:
        "Galleries that show real weddings. Professionalism in every detail. Clarity about what we do and how we work.",
      byInquiry: "Understanding. Excitement. Confidence.",
    },
    objections: {
      purpose: "Address these gently throughout the site — not on a single FAQ page",
      common: [
        "My venue has a coordinator",
        "I don't want to lose control",
        "Is it worth the investment?",
        "How do I know you'll handle pressure?",
      ], // From Section 2.11 examples; TODO: populate with actual responses
    },
    misfitProfile: {
      purpose: "Messaging should gently filter these out without being exclusionary",
      signals: "Style mismatch, communication mismatch, expectations mismatch, budget mismatch, control issues",
      // TODO: From Section 2.12 — specific misfit descriptions
    },
    qualificationSignals: {
      greenFlags: "", // TODO: From Section 2.17
      redFlags: "", // TODO: From Section 2.18
      bestQualifyingQuestion: "", // TODO: From Section 2.19
      wantMoreOf: "", // TODO: From Section 2.14 — season, venue type, guest count, mood, aesthetic
      wantLessOf: "", // TODO: From Section 2.15
      commonMisfitInquiry: "", // TODO: From Section 2.16
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 3: SERVICES AND "CALM LUXURY LEADERSHIP" PROCESS
  // Guides: Services page structure, pricing display, process visualization
  // ═══════════════════════════════════════════════════════════════════
  services: {
    purpose: "Eliminate confusion, create confidence, set expectations, justify investment",
    coreServices: [
      "Day-of coordination",
      "Partial planning",
      "Full-service planning",
      "Event planning (non-wedding)",
    ],
    decisionCriteria: {
      serviceClarity: "Each service must be understood in 10 seconds — what it includes and why it matters",
      misunderstoodService: "", // TODO: From Section 3.2 — e.g., "day-of" vs "wedding day management" vs "month-of"
      scopeBoundaries: "What each service explicitly does NOT include — prevents scope creep messaging",
      rightMoment: "When/why someone chooses each service level — drives self-qualification",
      processVisibility: "End-to-end process from first contact to execution — builds trust through transparency",
      pricingStrategy: "", // TODO: From Section 3.22/3.23 — public vs private, expectation-setting
    },
    dayOfCoordination: {
      tenSecondPitch: "", // TODO: From Section 3.3
      process: "", // TODO: From Section 3.4 — timeline, vendor confirmations, walkthroughs, rehearsal, floorplan, contingency
      scopeBoundaries: "", // TODO: From Section 3.5
    },
    partialPlanning: {
      rightMoment: "", // TODO: From Section 3.6 — started but needs clarity, cohesion, direction
      deliverables: "", // TODO: From Section 3.7
      flexibility: "", // TODO: From Section 3.8
    },
    fullServicePlanning: {
      endToEndProcess: "", // TODO: From Section 3.9 — vision refinement → vendor team → design cohesion → production timeline → day execution
      designAndLogisticsBalance: "", // TODO: From Section 3.10
    },
    designDirection: {
      providesDesign: null as boolean | null, // TODO: From Section 3.11
      deliverables: "", // TODO: From Section 3.12 — design deck, palette, textures, rental/linen guidance
    },
    experienceDesign: {
      purpose: "The service experience itself is a trust signal",
      tailoredPlanningSupport: "", // TODO: From Section 3.13
      vendorCollaboration: "", // TODO: From Section 3.14 — trusted vendor collaboration, communication standards
      vendorCoordination: "", // TODO: From Section 3.15 — confirmations, timelines, handoffs, day-of leadership
      contingencyMindset: "", // TODO: From Section 3.16 — weather pivots, timeline delays, vendor issues, family dynamics
      effortlessWeddingDay: "", // TODO: From Section 3.17 — pacing, transitions, invisible structure, guest flow
      calmLeadershipExamples: [], // TODO: From Section 3.18 — 2-4 real stories
      familyDynamics: "", // TODO: From Section 3.19
      collaborationApproach: "", // TODO: From Section 3.20
    },
    capacity: {
      purpose: "Scarcity and quality signals",
      constraints: "", // TODO: From Section 3.21 — limited weddings, max per weekend, travel limits
      upgrades: "", // TODO: From Section 3.25 — rehearsal coordination, extra meetings, design enhancements
    },
    pricing: {
      structure: "", // TODO: From Section 3.22
      displayStrategy: "", // TODO: From Section 3.23 — public starting prices / ranges / private / private with minimum
      expectationLanguage: "", // TODO: From Section 3.24 — if private, what language sets expectations
    },
    faqs: [], // TODO: From Section 3.26 — top 10 per service tier
    proofPerService: "", // TODO: From Section 3.27 — what proof supports each service
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 4: EXPERIENCE ENGINEERING (GUEST JOURNEY + FEELING)
  // Guides: Micro-interactions, page transitions, content pacing, UX flow
  // ═══════════════════════════════════════════════════════════════════
  experience: {
    purpose: "The website itself must FEEL like the Hickory & Rose service experience",
    decisionCriteria: {
      coupleFeeling: "", // TODO: From Section 4.1 — 3-5 words
      guestFeeling: "", // TODO: From Section 4.2 — 3-5 words
      weddingEnergy: "", // TODO: From Section 4.3 — arrival to last dance: pacing, warmth, music, lighting, transitions
      luxuryGuestExperience: "", // TODO: From Section 4.4 — beyond aesthetics: comfort, clarity, hospitality, flow, timing
      personalNotGeneric: "", // TODO: From Section 4.5 — story-driven moments, intentional decisions, restraint, cohesion
    },
    microMoments: {
      purpose: "Small details that create outsized trust and delight",
      protect: [], // TODO: From Section 4.6 — first look pacing, private moment after ceremony, family photo flow, reception room reveal, meaningful toasts
      prevent: [], // TODO: From Section 4.7 — guest confusion, long gaps, rushed moments, missed food, late vendors, awkward transitions
    },
    standards: {
      purpose: "Non-negotiable execution details reflected in website quality",
      items: [], // TODO: From Section 4.8 — timeline discipline, vendor punctuality, communication clarity, setup precision
    },
    venueCoordinatorDifference: "", // TODO: From Section 4.9 — 2-3 paragraph answer
    riskRemoval: {
      purpose: "The single biggest risk Hickory & Rose removes for clients",
      primaryRisk: "", // TODO: From Section 4.10 — chaos, regret, disjointed design, mental load, family stress
      proofStories: [], // TODO: From Section 4.11 — 3 stories through proof (galleries/testimonials)
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 5: BRAND STORY AND TRUST SIGNALS
  // Guides: About page, testimonials placement, credibility architecture
  // ═══════════════════════════════════════════════════════════════════
  brandStory: {
    purpose: "Trust is built through proof, not claims",
    decisionCriteria: {
      founderStory: "", // TODO: From Section 5.1 — why this work, why now, why you
      personality: "", // TODO: From Section 5.2 — bubbly, calm, warm, organized
      onlinePresence: "", // TODO: From Section 5.3 — warmth through language, authority through structure, calm through spacing
      assumptions: "", // TODO: From Section 5.4 — what should never be assumed
    },
    credibility: {
      existingSignals: [], // TODO: From Section 5.5 — Google reviews, testimonials, galleries, vendor referrals, venue lists, press, awards, styled shoots, years
      heroProofs: "", // TODO: From Section 5.7 — 5-10 testimonials mentioning calm leadership, organization, enjoying the day
      provableClaims: [], // TODO: From Section 5.9 — 10 specific claims the site must prove
      missingProof: "", // TODO: From Section 5.10 — what social proof would elevate instantly
    },
    brandPhotos: {
      hasPhotos: null as boolean | null, // TODO: From Section 5.11
      wishList: "", // TODO: From Section 5.13 — editorial headshots, planning moments, venue walk-throughs, detail flat-lays
    },
    partnerships: {
      purpose: "Association with quality partners builds trust by proxy",
      venues: [], // TODO: From Section 5.14 — venues that match refined rustic elegance
      vendors: [], // TODO: From Section 5.15 — photographers, florists, rentals to feature/credit
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 6: PORTFOLIO / PROOF SYSTEM
  // Guides: Gallery design, case study structure, filtering, proof hierarchy
  // ═══════════════════════════════════════════════════════════════════
  portfolio: {
    purpose: "The portfolio is the website's most important sales engine",
    decisionCriteria: {
      curationRule: "", // TODO: From Section 6.4 — what makes a wedding worthy of featuring
      tenSecondProof: "", // TODO: From Section 6.5 — refined rustic elegance, cohesive design, elevated execution, personalization
      organization: "", // TODO: From Section 6.6 — wedding stories, gallery grid, or both
      filterTags: [
        "Venue",
        "Season",
        "Service level (day-of/partial/full)",
        "Aesthetic tags (refined rustic elegance)",
        "Indoor/outdoor",
        "Guest count range",
        "Color palette",
        "Cultural elements",
      ],
    },
    storyElements: {
      purpose: "Each featured wedding should include these written elements",
      elements: [
        "Couple story/vision",
        "Design notes (palette/textures)",
        "Planning scope (service tier)",
        "Vendor credits",
        "Calm moments we protected",
        "Timeline/flow highlights",
        "Guest experience notes",
      ],
    },
    imageStrategy: {
      editingStyle: "", // TODO: From Section 6.15 — warm, true-to-life, film, etc.
      behindTheScenes: "Images showing calm leadership and execution in action",
      creditFormat: "", // TODO: From Section 6.14 — vendor credits per story, single list, or both
    },
    galleryStorage: "", // TODO: From Section 6.2 — Drive, Pixieset, photographer galleries
    portfolioMix: "", // TODO: From Section 6.3 — real weddings vs styled shoots ratio
    featuredWeddings: [], // TODO: From Section 6.11 — 5-10 weddings by couple/date/venue
    privacyRestrictions: "", // TODO: From Section 6.13
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 7: WEBSITE STRATEGY AND CONVERSION ARCHITECTURE
  // Guides: Page structure, navigation, CTA placement, conversion flow
  // ═══════════════════════════════════════════════════════════════════
  websiteStrategy: {
    purpose: "Turn visitors into qualified leads with minimal friction",
    decisionCriteria: {
      primaryAction: "", // TODO: From Section 7.1 — inquire, book consult, view services then inquire, etc.
      secondaryActions: [
        "Read approach/process",
        "Understand service differences",
        "View reviews",
        "View full galleries",
        "Learn your story",
        "Get pricing context",
        "Follow on Instagram",
        "Join email list",
      ],
      instagramGap: "", // TODO: From Section 7.3 — qualify leads, show full galleries, explain process, elevate trust
      homepageTruth: "", // TODO: From Section 7.4 — "She gets my taste," "I'm safe," "This feels calm," "This is worth the investment"
    },
    navigation: {
      pages: [], // TODO: From Section 7.5 — Home, About, Services, Portfolio, etc.
      topMenu: "", // TODO: From Section 7.6
      criticalPath: "", // TODO: From Section 7.7 — if someone reads only 3 pages before inquiring
    },
    homepage: {
      aboveTheFold: "Named promise + supporting line + CTA + proof snippet + portfolio image + Edmonton cue",
      storyArc: "", // TODO: From Section 7.10 — reassurance → aesthetic proof → process → services → reviews → CTA
      trustSignals: "", // TODO: From Section 7.9 — 3 most important trust signals
    },
    servicesPage: {
      purpose: "Eliminate confusion, create confidence, set expectations, justify investment",
      betterThan: "", // TODO: From Section 7.11 — what this page does better than competitors
    },
    approachPage: {
      proves: "", // TODO: From Section 7.12 — calm organized method, how you protect presence
      namedFramework: null as boolean | null, // TODO: From Section 7.13
      frameworkName: "", // TODO: From Section 7.14 — e.g., "Calm, Organized, Elevated"
      processOutline: "", // TODO: From Section 7.15
    },
    reviewsPage: {
      emphasis: "", // TODO: From Section 7.16 — calm leadership, organization, vendor management, enjoying the day
    },
    faqPage: {
      purpose: "", // TODO: From Section 7.17 — filter objections, set expectations, reduce consult time
    },
    inquiryPage: {
      emotionalTone: "", // TODO: From Section 7.18 — relief, professionalism, warmth, clarity, confidence
      formFields: [
        "Wedding date",
        "Venue",
        "Guest count",
        "Service tier",
        "Budget range",
        "Aesthetic notes",
        "City",
        "How they found you",
      ],
      responseExpectation: "", // TODO: From Section 7.20 — "Replies within 24-48 business hours"
    },
    leadMagnet: {
      enabled: null as boolean | null, // TODO: From Section 7.21
      options: [
        "Edmonton wedding planning checklist",
        "Wedding timeline template",
        "Wedding budget breakdown (Edmonton/Alberta)",
        "Vendor tipping guide (Canada)",
        "Rainy-day wedding plan",
        "Refined rustic elegance style guide",
        "Planner vs venue coordinator guide",
      ],
    },
    ctaLanguage: {
      primary: "", // TODO: From Section 7.23 — e.g., "Get your calm back"
      promise: "", // TODO: From Section 7.24 — clarity, relief, confident plan, fit confirmation
      capacityMessage: "", // TODO: From Section 7.25/7.26 — limited weddings each season
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 8: SEO AND CONTENT STRATEGY
  // Guides: Meta tags, page titles, content hierarchy, blog topics
  // ═══════════════════════════════════════════════════════════════════
  seo: {
    purpose: "Rank locally in Edmonton and build topical authority in wedding planning",
    decisionCriteria: {
      localKeywords: [
        "Edmonton wedding planner",
        "Luxury wedding planner Edmonton",
        "Wedding coordinator Edmonton",
        "Day-of coordination Edmonton",
        "Wedding day management Edmonton",
        "Partial wedding planning Edmonton",
        "Full-service wedding planning Edmonton",
      ],
      targetKeywords: [], // TODO: From Section 8.3
      contentTopics: [], // TODO: From Section 8.4 — checklist, timeline template, budget breakdown, vendor tipping, rainy day plan, winter wedding Edmonton, refined rustic ideas Alberta
    },
    blog: {
      launchStrategy: "", // TODO: From Section 8.5 — "launch with posts", "structure only", "no blog"
      postCount: 0, // TODO: From Section 8.6
      areaGuides: null as boolean | null, // TODO: From Section 8.7 — venue highlights, seasonal planning
    },
    listings: {
      googleBusiness: "", // TODO: From Section 8.9/8.10
      directories: [], // TODO: From Section 8.11 — WeddingWire, The Knot, venue preferred lists
    },
    terminology: "", // TODO: From Section 8.2 — "Day-of coordination" vs "wedding day management"
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 9: DESIGN DIRECTION
  // Guides: Every visual decision — typography, color, spacing, motion
  // ═══════════════════════════════════════════════════════════════════
  designDirection: {
    purpose: "Visual execution must match brand promise — refined rustic elegance with quiet luxury",
    decisionCriteria: {
      referenceWebsites: {
        like: [], // TODO: From Section 9.1 — 5-10 URLs with notes on what's liked
        dislike: [], // TODO: From Section 9.2 — 2-3 URLs and why
      },
      firstFiveSeconds: "", // TODO: From Section 9.3 — calm, trust, taste, warmth, professionalism
      visualNonNegotiables: [], // TODO: From Section 9.4 — warm neutrals, natural textures, candlelight, refined florals, restraint, editorial whitespace
      visualAvoid: [], // TODO: From Section 9.5 — clutter, overly trendy fonts, loud colors, heavy patterns, "Pinterest collage"
    },
    balance: {
      modernVsTimeless: 0, // TODO: From Section 9.6 — 1=very timeless, 5=very modern
      warmthVsMinimalism: 0, // TODO: From Section 9.7 — 1=very minimal, 5=very warm/romantic
      typographyDirection: "", // TODO: From Section 9.8 — "elegant serif-led", "clean sans-serif-led", "balanced serif + sans"
      motionLevel: 0, // TODO: From Section 9.14 — 1=minimal, 5=refined motion
    },
    logo: {
      status: "", // TODO: From Section 9.9 — "final", "needs refinement", "needs creation"
    },
    brandGuidelines: {
      status: "", // TODO: From Section 9.11 — "full", "some basics", "none"
    },
    accessibility: {
      preferences: [], // TODO: From Section 9.15 — larger text, high contrast, minimal animation
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 10: CONTENT AND ASSETS
  // Guides: Content creation priorities, asset sourcing, launch phasing
  // ═══════════════════════════════════════════════════════════════════
  content: {
    purpose: "Know what exists, what's needed, and what's urgent",
    existingSources: [], // TODO: From Section 10.1 — Instagram captions, Google Docs, Notes app, Pinterest, pricing guide PDF, old website
    copyStatus: "", // TODO: From Section 10.3 — "ready", "rough notes", "will write internally", "a mix"
    urgentPages: [], // TODO: From Section 10.4 — pages where articulation is hardest
    launchMustHaves: [], // TODO: From Section 10.7 — core services, portfolio proof, reviews, inquiry flow
    phaseTwo: [], // TODO: From Section 10.8 — blog volume, venue guides, additional galleries
    migration: null as boolean | null, // TODO: From Section 10.9
    policiesReady: null as boolean | null, // TODO: From Section 10.11
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 11: TECHNICAL AND INTEGRATIONS
  // Guides: Platform choices, CRM routing, analytics, embedded tools
  // ═══════════════════════════════════════════════════════════════════
  technical: {
    domain: "", // TODO: From Section 11.2
    brandedEmail: null as boolean | null, // TODO: From Section 11.3
    editableContent: [], // TODO: From Section 11.6 — portfolio, testimonials, blog, FAQs, services, about
    crm: {
      platform: "", // TODO: From Section 11.8 — HoneyBook, Dubsado, Aisle Planner
      autoRoute: null as boolean | null, // TODO: From Section 11.9
    },
    scheduling: {
      enabled: null as boolean | null, // TODO: From Section 11.10
      tool: "", // TODO: From Section 11.11 — Calendly, HoneyBook scheduler, Dubsado scheduler
    },
    email: {
      enabled: null as boolean | null, // TODO: From Section 11.12
      platform: "", // TODO: From Section 11.13 — Flodesk, Mailchimp, ConvertKit
    },
    analytics: [], // TODO: From Section 11.14 — Google Analytics, Search Console, Meta pixel, Google Ads tag
    embeddedTools: [], // TODO: From Section 11.15
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECTION 12: LAUNCH AND SUCCESS METRICS
  // Guides: Priority decisions, quality benchmarks, KPI tracking
  // ═══════════════════════════════════════════════════════════════════
  launch: {
    targetDate: "", // TODO: From Section 12.1
    hardDeadlines: null as boolean | null, // TODO: From Section 12.2
    budgetRange: "", // TODO: From Section 12.4
    decisionMaker: "", // TODO: From Section 12.5
    feedbackTurnaround: "", // TODO: From Section 12.7
    success: {
      thirtyDays: "", // TODO: From Section 12.8 — more qualified inquiries, clarity, stronger trust, fewer misfit leads
      sixMonths: "", // TODO: From Section 12.9 — consistent bookings, improved SEO in Edmonton, portfolio-driven conversions
      kpis: [
        "Inquiry volume",
        "Inquiry quality/fit",
        "Consult bookings",
        "Conversion rate",
        "Portfolio engagement",
        "SEO rankings",
        "Website traffic",
        "Email signups",
      ],
    },
    stopDoing: "", // TODO: From Section 12.11 — explaining day-of vs partial vs full, justifying investment
    oneTruth: "", // TODO: From Section 12.12 — if the website could only communicate ONE truth
  },
} as const;
