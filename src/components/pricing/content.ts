export type PlanTone = "entry" | "self" | "flagship" | "plus" | "private";

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
    name: "Free Templates",
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
    cta: { label: "Get Free Templates", href: "#/templates" },
    tone: "entry",
  },
  {
    id: "toolkit",
    name: "Financial Clarity Toolkit",
    price: "$99–$299",
    priceSuffix: "one-time",
    positioning: "A stronger self-guided starting point.",
    bestFor: "Owners who want to organize manually before upgrading.",
    includes: [
      "Enhanced financial templates",
      "Video walkthroughs",
      "Monthly review checklist",
      "Cash-flow planning guide",
      "Hiring affordability worksheet",
      "Expense cleanup workflow",
    ],
    cta: { label: "Start With Toolkit", href: "#/templates" },
    tone: "self",
    note: "Optional self-guided layer",
  },
  {
    id: "desk",
    name: "Monthly Finance Desk",
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
    cta: { label: "Apply for the Monthly Finance Desk", href: "#/apply" },
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
      "Everything in Monthly Finance Desk",
      "Expanded monthly review",
      "Deeper KPI tracking",
      "Quarterly planning support",
      "More detailed analysis memos",
      "Additional decision support",
    ],
    cta: { label: "Apply for Plus", href: "#/apply" },
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
    cta: { label: "Request Private Review", href: "#/apply" },
    tone: "private",
    note: "By invitation",
  },
];

export const monthlyRhythm = [
  { week: "Week 1", title: "Financial activity organized" },
  { week: "Week 2", title: "Plain-English briefing delivered" },
  { week: "Week 3", title: "Patterns and questions reviewed" },
  { week: "Week 4", title: "Monthly strategy call" },
];

export const whyCards = [
  {
    title: "Less than hiring a CFO",
    body: "A full-time finance leader can be out of reach for many owner-led businesses. The Monthly Finance Desk gives you a lighter recurring rhythm before you need a full internal team.",
  },
  {
    title: "More strategic than a template",
    body: "Templates create structure. The Monthly Finance Desk adds automation, interpretation, and a monthly review process.",
  },
  {
    title: "More personal than a dashboard",
    body: "Dashboards show charts. The Monthly Finance Desk helps translate financial activity into plain-English questions and decisions.",
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
    alternative: "Monthly Finance Desk",
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
    q: "Why does this cost $1,500/month?",
    a: "Because it is not just a spreadsheet or software dashboard. The Monthly Finance Desk combines structure, automation, plain-English written briefings, and a monthly strategy review.",
  },
  {
    q: "Is this a bookkeeping service?",
    a: "No. It is designed to work alongside your existing financial setup. A bookkeeper helps keep records clean. The Monthly Finance Desk helps create a recurring rhythm for understanding what the numbers mean.",
  },
  {
    q: "Do I still need my bookkeeper or CPA?",
    a: "Usually, yes. This does not replace tax, legal, accounting, or bookkeeping responsibilities. It adds a financial clarity layer around the business.",
  },
  {
    q: "Is this a fractional CFO replacement?",
    a: "No. It is the missing layer before a full CFO: more than templates or bookkeeping, lighter than a full finance department.",
  },
  {
    q: "Do I need to connect my bank account to apply?",
    a: "No. You can apply without connecting a bank account. Data connection happens only after onboarding.",
  },
  {
    q: "What if I am not ready for $1,500/month?",
    a: "Start with the free templates or self-guided toolkit. The premium desk is best for owners ready to build a recurring financial rhythm.",
  },
  {
    q: "Who is this best for?",
    a: "Owner-led businesses with real financial movement, recurring expenses, cash-flow questions, and no full-time finance leader.",
  },
  {
    q: "What happens after I apply?",
    a: "Your application is reviewed for fit. If there is a potential match, you receive next steps. No payment or bank connection is required to apply.",
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
    cta: { label: "Get Free Templates", href: "#/templates" },
    tone: "entry" as PlanTone,
  },
  {
    title: "Apply for Monthly Finance Desk if:",
    bullets: [
      "Your business has real monthly revenue",
      "You feel unclear even with tools or a bookkeeper",
      "You want plain-English interpretation",
      "You have hiring, cash flow, or expense decisions",
      "You want a monthly financial rhythm",
    ],
    cta: { label: "Apply for the Monthly Finance Desk", href: "#/apply" },
    tone: "flagship" as PlanTone,
  },
  {
    title: "Request Private Finance Room if:",
    bullets: [
      "Your business has higher complexity",
      "You need deeper planning",
      "You want more strategic support",
      "You are considering larger financial decisions",
      "You want a more private, high-touch process",
    ],
    cta: { label: "Request Private Review", href: "#/apply" },
    tone: "private" as PlanTone,
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
      cta: { label: "Get Free Templates", href: "#/templates" },
    };
  }
  if (veryHighRev && wantsStrategy) {
    return {
      planId: "private",
      headline: "Request a Private Finance Room review.",
      body: "Your size and complexity warrant a more direct, higher-touch arrangement.",
      cta: { label: "Request Private Review", href: "#/apply" },
    };
  }
  if (lowRev) {
    return {
      planId: "toolkit",
      headline: "Start with the Financial Clarity Toolkit.",
      body: "A self-guided layer between free templates and a monthly subscription.",
      cta: { label: "Start With Toolkit", href: "#/templates" },
    };
  }
  return {
    planId: "desk",
    headline: "Apply for the Monthly Finance Desk.",
    body: "Your stage suggests the recurring rhythm is exactly what is missing — more than a tool, lighter than a full finance team.",
    cta: { label: "Apply for the Monthly Finance Desk", href: "#/apply" },
  };
}
