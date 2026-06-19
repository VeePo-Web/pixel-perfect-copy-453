/**
 * HICKORY & ROSE — Brand Identity Reference
 *
 * This file is a DECISION-MAKING REFERENCE ONLY. It does not render anything.
 * All UI/UX decisions (navigation, footer, visuals, layout, copy, interactions)
 * should be filtered through these brand constants.
 *
 * STATUS: Updated from owner questionnaire responses.
 * Items marked TBC are still awaiting owner input.
 */

export const BRAND_IDENTITY = {
  name: {
    full: "Hickory & Rose Wedding and Event Planning",
    short: "Hickory & Rose",
    monogram: "H&R", // decorative watermark only — never used as a readable label
    tagline: "Seamless, stress-free execution. Luxury, personalized planning. Thoughtfully bringing your vision to life.",
  },

  positioning: {
    oneSentence:
      "Hickory & Rose is an Edmonton-based wedding and event planning studio guiding refined couples through seamless, stress-free celebrations with calm leadership and thoughtful design.",
    namedPromise:
      "Hickory & Rose exists to protect the beauty, intention, and experience behind every celebration.",
    positioningOptions: [
      "Seamless, stress-free execution",
      "Luxury, personalized planning",
      "Thoughtfully bringing your vision to life",
    ],
    differentiators: [
      "Seamless, elegant wedding planning",
      "Friendly, caring planning and coordination",
      "Calm leadership under pressure",
      "Thoughtful preparation that anticipates challenges",
      "Trusted vendor collaboration as a team",
    ],
    knownFor:
      "Seamless, elegant wedding planning paired with friendly, caring coordination.",
    refinedRusticEleganceIs:
      "The harmony of natural beauty, thoughtful design, and elevated details that feel both effortless and timeless.",
    refinedRusticEleganceIsNot:
      "Not rustic-country, not barnyard, not boho-casual. Never cluttered, themed, or kitsch. Never cold or clinical minimalism.",
  },

  voice: {
    tone: ["luxury", "friendly", "caring", "seamless", "calming"],
    boundaries: [
      "Never pushy or sales-y",
      "Never casual to the point of unprofessional",
      "Never cold, clinical, or corporate",
      "Never trend-chasing or buzzword-heavy",
      "Never minimize the couple's vision or feelings",
    ],
    repeatWords: [
      "seamless",
      "calm",
      "thoughtful",
      "intentional",
      "elevated",
      "presence",
      "personalized",
    ],
    avoidWords: [
      "rustic (without 'refined' modifier)",
      "barn",
      "boho",
      "cheap",
      "budget",
      "DIY",
      "chaos",
      "drama",
      "girl boss",
      "babe",
      "obsessed",
      "literally",
      "vibes",
    ],
    manifesto: [
      "We believe every celebration deserves presence.",
      "We believe calm is a form of luxury.",
      "We believe the most beautiful weddings feel inevitable — never forced.",
      "We believe in protecting the joy, not just the timeline.",
      "We believe in showing up, fully, so you can too.",
    ].join("\n"),
    personaIfGuest:
      "The trusted older sister who happens to be exquisitely organized. Calm, warm, never flustered. Quietly fixes problems before anyone notices. Genuinely delighted to be there. Knows when to step in and when to step back.",
  },

  visual: {
    palette: {
      primary: "", // TBC
      secondary: "",
      accent: "",
      background: "",
      text: "",
    },
    typography: {
      display: "",
      body: "",
      accent: "",
    },
    photographyStyle: ["warm", "true-to-life", "editorial", "polished", "candid documentary", "detail-forward"],
    motionLevel: 3, // From 9.14 — owner answered 3
    nonNegotiables: [], // TBC — Section 9.4
    avoid: [], // TBC — Section 9.5
    balance: {
      modernVsTimeless: 3, // From 9.6
      warmthVsMinimalism: 4, // From 9.7
    },
  },

  industry: {
    sector: "Wedding and Event Planning",
    services: [
      "Day-of coordination",
      "Partial planning",
      "Full-service planning",
      "Tailored planning options",
      "Event planning (non-wedding)",
    ],
    serviceArea:
      "Edmonton-based, serving surrounding areas within Alberta. Travel fees apply outside Greater Edmonton.",
    terminology: {
      preferDayOf: "Day-of coordination", // From 8.2
    },
  },

  idealClient: {
    archetype: "Polished Paige",
    description:
      "Design-forward, detail-driven, strong taste, wants calm leadership without losing creative involvement.",
    pressures: [
      "Pressure to deliver a wedding that lives up to her own design taste",
      "Pressure from family expectations and competing opinions",
      "Pressure of a demanding career — limited time and mental bandwidth",
      "Fear of losing creative control to a planner with a different aesthetic",
      "Fear of the day feeling rushed, chaotic, or not 'them'",
      "Fear of being the one fielding vendor questions on the day",
    ],
    firstFiveSeconds:
      "Calm, elevated, immediately understood. A single beautiful image. A confident, quiet headline. No noise, no popups, no 'book now' pressure. She should feel her shoulders drop before she reads a word.",
    firstThirtySeconds:
      "Galleries that show real weddings. Professionalism in every detail. Clarity about what we do and how we work.",
    byInquiry: "Understanding. Excitement. Confidence.",
    weddingFeelForCouple: ["dream vision", "love", "comfort", "luxury", "calm"], // From 4.1
    weddingFeelForGuests: ["structured", "smooth", "calm", "love", "enjoyable"], // From 4.2
  },

  credibility: {
    // From Section 5.5
    signals: [
      "Styled shoot — August 15, 2026",
      "Summer 2026 season — fully booked",
      "Fall 2026 season — fully booked",
      "Growing vendor referral network",
    ],
  },

  capacity: {
    // From 3.25 — owner intends two-person team standard for 2027
    twoPersonTeamFrom2027: true,
  },

  services: {
    dayOf: {
      leadTime: "6–8 weeks before the wedding",
      communication: "Unlimited communication from intake through the day",
      scopeBoundaries: "", // TBC — 3.5
    },
    partial: {
      coreAddition: "Remaining vendor sourcing and curation",
      deliverables: "", // TBC — 3.7
      flexibilityRules: "", // TBC — 3.8
    },
    fullService: {
      entryPoint: "From the moment of engagement",
      scope: "Design, vision, vendor sourcing, end-to-end execution",
      designLogisticsBalance: "", // TBC — 3.10
    },
    pricing: {
      displayMode: "starting-at-inquire", // 3.23
      pricesFinalized: false, // 3.22 — pending owner confirmation
      privatePricingLanguage: "", // TBC — 3.24
    },
    vendorPhilosophy: "We work as a team with every vendor — always.",
    contingency: "Emergency kit on hand; calm leadership protects the room.",
    upgrades2027: "Two-person planning team standard for every 2027 wedding.",
  },

  experience: {
    // From Section 4
    coupleFeel: ["dream vision", "love", "comfort", "luxury", "calm"], // 4.1
    guestFeel: ["structured", "smooth", "calm", "love", "enjoyable"], // 4.2
    feelOverLook: "We design for how it feels — not just how it looks.", // 2.5 + 4.5
    personalizationPrinciples: [
      "Story-driven planning",
      "Their love story made visible",
      "Personalized elements throughout",
      "Family and friends woven into the experience",
    ], // 4.5
    venueCoordinatorVsPlanner:
      "A venue coordinator manages the venue. A wedding day coordinator works for you — managing every vendor, every in-between moment, and the rhythm of the day from start to finish.", // 4.9
    // TBC by owner
    idealEnergyArc: "", // 4.3
    luxuryGuestExperience: "", // 4.4
    microMomentsProtected: [], // 4.6
    experienceFailures: [], // 4.7
    nonNegotiables: [], // 4.8
    biggestRiskRemoved: "", // 4.10
    proofStoriesToTell: [], // 4.11
  },

  founder: {
    // From Section 5
    name: "Meg Wolodko",
    role: "Founder & Lead Planner",
    personality: ["Organized", "Friendly", "Calming", "Detailed", "Experienced"], // 5.2 — owner's exact words
    story: "", // TBC — 5.1, Meg Wolodko to write her own founder story
    personalityOnline: "", // TBC — 5.3
    neverAssume: "", // TBC — 5.4
    credentialsVerified: false, // 5.5 — no WPIC or year claims until owner confirms
    professionalPhotosAvailable: false, // 5.11 — owner: "Not yet"
    reviewLinks: [], // TBC — 5.6
    heroTestimonials: [], // TBC — 5.7 — current site testimonials are placeholders
    vendorListReceived: false, // 5.15 — owner sending separately
  },

  portfolio: {
    // From Section 6
    purpose: "Primary sales engine — proves aesthetic + execution",
    tenSecondProof: "Refined rustic elegance · cohesive design · elevated execution · calm in the room", // 6.5
    contentStatus: {
      realWeddings: 0,                          // 6.3
      styledShoots: 0,
      upcomingShoots: ["2026-08-15"],           // 5.5
      professionalBrandPhotosAvailable: false,  // 5.11
      namedTestimonialsAvailable: false,        // 5.7
      pressFeaturesAvailable: false,            // 5.6 — PressMentionsSection hidden on homepage until true
      sampleDataAnonymized: true,               // Portfolio.tsx couple names replaced with aesthetic labels
    },
    // TBC owner
    galleryStorage: "",        // 6.2
    curationRule: "",          // 6.4
    organization: "",          // 6.6 — wedding stories, grid, or both
    privacyRestrictions: "",   // 6.13
    vendorCreditFormat: "",    // 6.14
    editingStyle: "",          // 6.15
    featuredWeddings: [] as string[], // 6.11
  },

  websiteStrategy: {
    // From Section 7
    primaryAction: "inquire",                                     // 7.1 ✅
    criticalPath: ["Home", "Services", "Inquire"],                // 7.7
    pages: ["Home", "About", "Approach", "Services", "Portfolio", "Journal", "FAQ", "Inquire"], // 7.5
    homepageRhythm: {
      pressMentionsEnabled: false,            // off until real press (5.6)
      statsQualitativeOnly: true,             // softened post Section 5
      testimonialsAttribution: "anonymized",  // sample data; swap on real reviews (5.7)
    },
    inquiryTone: ["warm", "clear", "confident"],                  // 7.18 ✅
    responseSLA: "Replies within 24–48 business hours",           // 7.20 ✅
    leadMagnet: { enabled: false },                               // 7.21
    // TBC owner
    homepageStoryArc: "",                                          // 7.10
    servicesPageAdvantage: "",                                     // 7.11
    approachProves: "",                                            // 7.12
    namedFramework: null as boolean | null,                         // 7.13
    frameworkName: "",                                             // 7.14
    ctaPrimaryLanguage: "",                                        // 7.23
    ctaPromise: "",                                                // 7.24
  },

  seo: {
    // From Section 8
    terminology: "Wedding Day Coordination (industry standard); Day-Of accepted alias", // 8.2
    localKeywords: [                                                                     // 8.1 / 8.3
      "Edmonton wedding planner",
      "Luxury wedding planner Edmonton",
      "Wedding coordinator Edmonton",
      "Day-of coordination Edmonton",
      "Wedding day management Edmonton",
      "Partial wedding planning Edmonton",
      "Full-service wedding planning Edmonton",
      "Alberta wedding planner",
      "Canadian Rockies wedding planner",
    ],
    structuredData: {
      source: "index.html",                          // single source of truth — no runtime injection
      aggregateRatingEnabled: false,                  // honest — no fake reviews
      foundingDateClaimed: false,                     // owner never claimed 2018
    },
    sitemapPath: "/sitemap.xml",                      // 8.8 ✅
    // TBC owner
    targetKeywords: [] as string[],                   // 8.3
    contentTopics: [] as string[],                    // 8.4
    blog: {
      launchStrategy: "structure-only",               // 8.5 — Journal page exists, 0 posts
      postCount: 0,                                   // 8.6
      areaGuides: null as boolean | null,             // 8.7
    },
    listings: {
      googleBusiness: "",                             // 8.9 / 8.10
      directories: [] as string[],                    // 8.11
    },
  },

  designDirection: {
    // From Section 9 — most already implemented in mem://design/* + index.css + tailwind.config.ts
    firstFiveSeconds: "calm · warm · refined · in good hands",      // 9.3
    visualNonNegotiables: [                                          // 9.4
      "Warm neutrals",
      "Natural textures",
      "Candlelight glow",
      "Refined florals",
      "Restraint",
      "Editorial whitespace",
    ],
    visualAvoid: [                                                   // 9.5
      "Clutter",
      "Trendy display fonts",
      "Loud saturated colors",
      "Heavy patterns",
      "Pinterest-collage stacks",
    ],
    balance: {
      modernVsTimeless: 2,                                            // 9.6 (1=timeless, 5=modern)
      warmthVsMinimalism: 4,                                          // 9.7 (1=minimal, 5=warm)
      typographyDirection: "elegant serif-led",                       // 9.8
      motionLevel: 4,                                                 // 9.14
    },
    logo: { status: "in-use" },                                       // 9.9
    brandGuidelines: { status: "some-basics" },                       // 9.11
    // TBC owner
    referenceWebsitesLike: [] as string[],                            // 9.1
    referenceWebsitesDislike: [] as string[],                         // 9.2
    accessibilityPreferences: [] as string[],                          // 9.15
  },

  content: {
    // From Section 10 — mostly TBC owner
    launchMustHaves: ["Home", "About", "Services", "Portfolio", "FAQ", "Inquire"], // currently shipped
    phaseTwo: ["Journal volume", "Venue/area guides", "Additional galleries", "Lead magnet"],
    existingSources: [] as string[],                                  // 10.1
    copyStatus: "",                                                   // 10.3
    urgentPages: [] as string[],                                      // 10.4
    migration: null as boolean | null,                                // 10.9
    policiesReady: null as boolean | null,                            // 10.11
  },

  technical: {
    // From Section 11
    domain: "hickoryandrose.com",                                     // 11.2 (final TBC)
    brandedEmail: true,                                                // sales@hickoryandrose.com in use
    editableContent: ["portfolio", "testimonials", "journal", "FAQs", "services", "about"], // 11.6
    crm: { platform: "", autoRoute: null as boolean | null },         // 11.8 / 11.9
    scheduling: { enabled: null as boolean | null, tool: "" },        // 11.10 / 11.11
    email: { enabled: null as boolean | null, platform: "" },         // 11.12 / 11.13
    analytics: [] as string[],                                        // 11.14
    embeddedTools: [] as string[],                                    // 11.15
  },

  launch: {
    // From Section 12 — TBC owner
    decisionMaker: "Meg Wolodko (owner)",                             // 12.5
    kpis: [
      "Inquiry volume",
      "Inquiry quality/fit",
      "Conversion rate",
      "Portfolio engagement",
      "Edmonton SEO rankings",
    ],
    targetDate: "",                                                   // 12.1
    hardDeadlines: null as boolean | null,                            // 12.2
    budgetRange: "",                                                  // 12.4
    feedbackTurnaround: "",                                           // 12.7
    successThirtyDays: "",                                            // 12.8
    successSixMonths: "",                                             // 12.9
    stopDoing: "",                                                    // 12.11
    oneTruth: "",                                                     // 12.12
  },
} as const;
