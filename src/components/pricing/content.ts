export type PlanTone = "entry" | "self" | "continuity" | "flagship" | "plus" | "private";

export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  priceSuffix?: string;
  badge?: string;
  positioning: string;
  bestFor: string;
  includes: string[];
  cta: { label: string; href: string };
  tone: PlanTone;
  note?: string;
};

export const plans: PricingPlan[] = [
  {
    id: "templates",
    name: "GoldFin Template Vault",
    price: "Free",
    positioning: "Start organizing your numbers manually.",
    bestFor:
      "Owners who know they need better financial structure but are not ready for a premium monthly system.",
    includes: [
      "Cash Flow Forecast Template",
      "Monthly Financial Review Template",
      "Expense Audit Template",
      "Hiring Affordability Calculator",
      "Subscription Expense Tracker",
      "Tax Reserve Tracker",
    ],
    cta: { label: "Get Free Templates", href: "/templates" },
    tone: "entry",
  },
  {
    id: "autofill",
    name: "GoldFin Reports",
    price: "$99",
    priceSuffix: "/month",
    badge: "Recommended starting point",
    positioning: "The same templates — filled for you every month.",
    bestFor:
      "Owners who want monthly financial clarity without doing the spreadsheet work themselves.",
    includes: [
      "Every template auto-filled from your numbers",
      "Monthly cash-flow summary",
      "Expense-change report",
      "Subscription & recurring-cost tracker",
      "Revenue snapshot",
      "Monthly PDF briefing",
      "Owner action list",
      "Spreadsheet export, always yours",
    ],
    cta: { label: "Auto-fill my reports — $99/mo", href: "/pricing#auto-fill" },
    tone: "continuity",
    note: "Cancel anytime",
  },
  {
    id: "desk",
    name: "GoldFin Advisory",
    price: "$1,500",
    priceSuffix: "/month",
    badge: "Most relevant for serious owner-led businesses",
    positioning:
      "A premium monthly finance rhythm combining structure, automation, interpretation, and review.",
    bestFor:
      "Owner-led businesses that have outgrown bank-balance guessing, messy spreadsheets, and unclear reports.",
    includes: [
      "Expert-built financial spreadsheet system",
      "Plaid-connected bank data after onboarding",
      "AI-assisted organization of financial activity",
      "Bi-weekly plain-English financial briefings",
      "Monthly one-hour strategy review",
      "Questions to review",
      "Decisions to consider",
      "Recurring financial rhythm",
    ],
    cta: { label: "Apply for GoldFin Advisory", href: "/apply" },
    tone: "flagship",
  },
  {
    id: "plus",
    name: "Finance Desk Plus",
    price: "$3,000",
    priceSuffix: "/month",
    positioning: "A deeper monthly finance rhythm for more complex businesses.",
    bestFor:
      "Owners who need additional advisory time, deeper reporting, or more frequent planning support.",
    includes: [
      "Everything in GoldFin Advisory",
      "Expanded monthly review",
      "Deeper KPI tracking",
      "Quarterly planning support",
      "More detailed analysis memos",
      "Additional decision support",
    ],
    cta: { label: "Apply for Plus", href: "/apply" },
    tone: "plus",
    note: "By application",
  },
  {
    id: "private",
    name: "Private Finance Room",
    price: "$5,000–$7,500",
    priceSuffix: "/month",
    positioning: "A higher-touch private finance experience.",
    bestFor:
      "Larger owner-led businesses needing strategic financial visibility and high-touch support.",
    includes: [
      "Everything in Finance Desk Plus",
      "Private strategy memo",
      "Scenario planning",
      "Forecasting support",
      "Deeper monthly/quarterly review",
      "More direct advisory involvement",
    ],
    cta: { label: "Request Private Review", href: "/apply" },
    tone: "private",
    note: "By invitation",
  },
];

// $99/mo continuity rung — value-stacked offer (Pattern E).
// Per-item values are deliberately realistic so the stack stays credible
// (premium finance brand: no inflated anchoring).
export const autoFillOffer = {
  eyebrow: "GoldFin Reports · $99 / month",
  name: "GoldFin Reports",
  headline: "Use the templates free. Or have them filled for you every month.",
  sub: "The same financial templates you can download free — except we keep them filled from your numbers, every month, and hand you a plain-English briefing. No spreadsheet work. No catching up at year-end.",
  price: "$99",
  priceSuffix: "/ month",
  stack: [
    { item: "Every template auto-filled from your numbers", value: "$120/mo" },
    { item: "Monthly cash-flow summary", value: "$60/mo" },
    { item: "Expense-change report", value: "$45/mo" },
    { item: "Subscription & recurring-cost tracker", value: "$30/mo" },
    { item: "Revenue snapshot", value: "$30/mo" },
    { item: "Monthly PDF briefing", value: "$75/mo" },
    { item: "Owner action list", value: "$40/mo" },
    { item: "Spreadsheet export — always yours", value: "Included" },
  ] as const,
  totalValueLabel: "Total value",
  totalValue: "$400+/mo",
  cta: "Auto-fill my reports — $99/mo",
  guarantee: "Try one month. Cancel anytime before your next billing cycle.",
  trust: "No bank connection required to start. When you connect, it is read-only — we never move money.",
  microbridge: "Not ready for done-for-you? The same templates are free →",
};

export const monthlyRhythm = [
  { week: "Week 1", title: "Financial activity organized" },
  { week: "Week 2", title: "Plain-English briefing delivered" },
  { week: "Week 3", title: "Patterns and questions reviewed" },
  { week: "Week 4", title: "Monthly strategy call" },
];

export const whyCards = [
  {
    title: "Less than hiring a CFO",
    body: "A full-time finance leader can be out of reach for many owner-led businesses. The GoldFin Desk gives you a lighter recurring rhythm before you need a full internal team.",
  },
  {
    title: "More strategic than a template",
    body: "Templates create structure. The GoldFin Desk adds automation, interpretation, and a monthly review process.",
  },
  {
    title: "More personal than a dashboard",
    body: "Dashboards show charts. The GoldFin Desk helps translate financial activity into plain-English questions and decisions.",
  },
  {
    title: "More consistent than tax-season advice",
    body: "You should not wait until year-end to understand what has been happening. The Desk creates a recurring review rhythm.",
  },
];

export const valueStack = [
  {
    title: "Expert-Built Financial Spreadsheet System",
    value:
      "A structured spreadsheet environment designed to organize business activity into a clearer operating view.",
    why: "You stop rebuilding financial structure every time you need to understand the business.",
  },
  {
    title: "Plaid Bank Connection After Onboarding",
    value:
      "Business bank data can be connected after onboarding so the system can work from actual financial activity.",
    why: "Less manual updating and more consistent financial visibility.",
    trust: "No bank connection required to preview or apply.",
  },
  {
    title: "AI-Assisted Financial Organization",
    value:
      "AI assists with placing financial activity into the right spreadsheet structure.",
    why: "The system becomes easier to maintain without making AI the main value promise.",
  },
  {
    title: "Bi-Weekly Plain-English Briefings",
    value:
      "Every two weeks, you receive a written briefing explaining cash movement, revenue trends, expense pressure, unusual spend, and questions to review.",
    why: "You get interpretation, not just data.",
  },
  {
    title: "Monthly One-Hour Strategy Review",
    value:
      "A focused monthly conversation to review the financial picture, questions, and next decisions.",
    why: "The owner gets a recurring moment to step out of daily operations and review the business with more clarity.",
  },
];

export type ComparisonRow = {
  alternative: string;
  role: string;
  helps: string;
  misses: string;
  investment: string;
  bestFit: string;
  flagship?: boolean;
};

export const comparisonRows: ComparisonRow[] = [
  {
    alternative: "Spreadsheet template",
    role: "Manual structure",
    helps: "Basic organization",
    misses: "Automation, interpretation, accountability",
    investment: "Low one-time cost",
    bestFit: "Early-stage DIY owners",
  },
  {
    alternative: "Bookkeeper",
    role: "Recordkeeping",
    helps: "Clean transactions and reports",
    misses: "Decision rhythm and strategic interpretation",
    investment: "Monthly service cost",
    bestFit: "Owners who need clean books",
  },
  {
    alternative: "Dashboard / accounting software",
    role: "Data visibility",
    helps: "Charts, reports, transactions",
    misses: "Plain-English judgment and monthly review",
    investment: "Low to mid monthly software cost",
    bestFit: "Owners comfortable interpreting data themselves",
  },
  {
    alternative: "Fractional CFO",
    role: "Strategic finance leadership",
    helps: "Forecasting, planning, financial strategy",
    misses: "Can be heavier or more expensive than needed",
    investment: "Often higher monthly cost",
    bestFit: "Larger or more complex businesses",
  },
  {
    alternative: "Internal finance hire",
    role: "Dedicated finance team capacity",
    helps: "Ongoing internal ownership",
    misses: "Expensive before the business is ready",
    investment: "Salary, benefits, management overhead",
    bestFit: "Businesses ready to build a department",
  },
  {
    alternative: "GoldFin Desk",
    role: "Recurring financial clarity system",
    helps: "Structure, automation, plain-English briefings, monthly strategy rhythm",
    misses: "Not a replacement for tax, legal, or full bookkeeping cleanup",
    investment: "$1,500 / month",
    bestFit:
      "Owner-led businesses that need more than tools, but are not ready for a full finance team",
    flagship: true,
  },
];

export const decisionCards = [
  {
    title: "Hiring too early",
    body: "A new fixed payroll cost can create pressure if cash flow is not stable.",
  },
  {
    title: "Ignoring creeping expenses",
    body: "Software, contractors, and subscriptions can slowly reduce flexibility.",
  },
  {
    title: "Mistaking revenue growth for cash strength",
    body: "Revenue can be up while cash still feels tight.",
  },
  {
    title: "Waiting until tax season",
    body: "By the time reports are reviewed once a year, the decision window may have passed.",
  },
];

export const faq = [
  {
    q: "Can I cancel GoldFin Reports anytime?",
    a: "Yes. The $99/mo plan is month-to-month. Try one month — if it isn't clearer, cancel before your next billing cycle. No friction, no lock-in.",
  },
  {
    q: "Do I need to connect my bank for the $99 plan?",
    a: "No bank connection is required to start. When you do connect, it is read-only through a secure connection — we never move money. You can also start with rough, non-sensitive numbers.",
  },
  {
    q: "What if I already have a bookkeeper?",
    a: "Keep them. A bookkeeper keeps your records clean. GoldFin Reports turns those records into a monthly plain-English briefing on what changed, what's risky, and what to decide next. They work together.",
  },
  {
    q: "What's the difference between $99 Reports and $1,500 Advisory?",
    a: "GoldFin Reports ($99/mo) fills your reports and briefs you every month — fully automated. GoldFin Advisory ($1,500/mo) adds a person who interprets them with you on a monthly strategy call. Most owners start with $99 and move up when the decisions get bigger.",
  },
  {
    q: "Is this a bookkeeping or CFO replacement?",
    a: "Neither. It does not replace tax, legal, accounting, or bookkeeping. It is the missing clarity layer — more than templates or a dashboard, lighter than a full finance hire.",
  },
  {
    q: "Why does GoldFin Advisory cost $1,500/month?",
    a: "Because it is not just software. Advisory combines structure, automation, plain-English briefings, and a monthly one-hour strategy review with a finance professional. It is by application.",
  },
  {
    q: "Who is this best for?",
    a: "Owner-led businesses with real financial movement, recurring expenses, and cash-flow questions — but no full-time finance leader.",
  },
  {
    q: "What happens after I apply for Advisory?",
    a: "Your application is reviewed for fit. If there's a potential match, you receive next steps. No payment or bank connection is required to apply.",
  },
];

export const planFit = [
  {
    title: "Start with Free Templates if:",
    bullets: [
      "You are early-stage",
      "You need structure but not monthly support",
      "You want to organize manually",
      "You are not ready for a premium subscription",
    ],
    cta: { label: "Send me the Vault", href: "/templates" },
    tone: "entry" as PlanTone,
  },
  {
    // continuity = gold CTA in PlanFitSection — bread & butter $99/mo
    title: "Choose GoldFin Reports if:",
    bullets: [
      "You want your reports filled for you monthly",
      "You have recurring revenue and real expenses",
      "You want a monthly plain-English briefing",
      "You are ready to stop doing spreadsheet work",
      "You want to cancel anytime with no lock-in",
    ],
    cta: { label: "Auto-fill my reports — $99/mo", href: "/pricing#auto-fill" },
    tone: "continuity" as PlanTone,
  },
  {
    // advisory — border/secondary per value ladder (not gold)
    title: "Apply for GoldFin Advisory if:",
    bullets: [
      "Your business has real monthly financial movement",
      "You feel unclear even with tools or a bookkeeper",
      "You want plain-English interpretation plus a strategy call",
      "You have hiring, cash flow, or expense decisions to make",
      "You want a recurring monthly financial rhythm",
    ],
    cta: { label: "Apply for the GoldFin Desk", href: "/apply" },
    tone: "flagship" as PlanTone,
  },
];

export const trustCards = [
  "No bank connection required for preview",
  "No bank connection required to apply",
  "No payment required to apply",
  "Plaid connection happens after onboarding",
  "Use demo data or rough non-sensitive numbers first",
  "Clear process before any financial connection",
];

// Plan selector
export type SelectorAnswers = {
  stage?: string;
  revenue?: string;
  need?: string;
};

export const selectorQuestions = [
  {
    key: "stage" as const,
    label: "What best describes your business?",
    options: [
      { id: "starting", label: "I am just starting to organize my numbers" },
      { id: "messy", label: "I have revenue, but my financial view is messy" },
      { id: "bookkeeper", label: "I have a bookkeeper but still feel unclear" },
      { id: "decisions", label: "I need help making hiring or spending decisions" },
      { id: "deeper", label: "I want deeper strategic finance support" },
    ],
  },
  {
    key: "revenue" as const,
    label: "Approximate monthly revenue?",
    options: [
      { id: "u10", label: "Under $10K" },
      { id: "10-30", label: "$10K–$30K" },
      { id: "30-75", label: "$30K–$75K" },
      { id: "75-150", label: "$75K–$150K" },
      { id: "150-250", label: "$150K–$250K" },
      { id: "250+", label: "$250K+" },
    ],
  },
  {
    key: "need" as const,
    label: "What do you need most?",
    options: [
      { id: "templates", label: "Templates" },
      { id: "reporting", label: "Better reporting" },
      { id: "interpretation", label: "Plain-English interpretation" },
      { id: "rhythm", label: "Monthly review rhythm" },
      { id: "strategy", label: "Higher-touch strategic planning" },
    ],
  },
];

export type Recommendation = {
  planId: string;
  headline: string;
  body: string;
  cta: { label: string; href: string };
};

export function recommend(a: SelectorAnswers): Recommendation {
  const lowRev = a.revenue === "u10" || a.revenue === "10-30";
  const veryHighRev = a.revenue === "250+";
  const wantsStrategy = a.need === "strategy";
  const wantsTemplates = a.need === "templates";

  if (wantsTemplates || (lowRev && a.stage === "starting")) {
    return {
      planId: "templates",
      headline: "Start with Free Templates.",
      body: "You have a real shot at meaningful clarity with a stronger self-guided foundation first.",
      cta: { label: "Get Free Templates", href: "/templates" },
    };
  }
  if (veryHighRev && wantsStrategy) {
    return {
      planId: "private",
      headline: "Request a Private Finance Room review.",
      body: "Your size and complexity warrant a more direct, higher-touch arrangement.",
      cta: { label: "Request Private Review", href: "/apply" },
    };
  }
  if (lowRev) {
    return {
      planId: "autofill",
      headline: "Start with Auto-Filled Monthly Reports.",
      body: "The bridge between free templates and the full Desk — your templates filled for you every month, at $99.",
      cta: { label: "Auto-fill my reports — $99/mo", href: "/pricing#auto-fill" },
    };
  }
  return {
    planId: "desk",
    headline: "Apply for the GoldFin Desk.",
    body: "Your stage suggests the recurring rhythm is exactly what is missing — more than a tool, lighter than a full finance team.",
    cta: { label: "Apply for the GoldFin Desk", href: "/apply" },
  };
}
