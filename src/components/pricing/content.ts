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
    price: "$150",
    priceSuffix: "/month",
    badge: "Most owners start here",
    positioning: "The same templates — filled for you, every two weeks.",
    bestFor:
      "Owners who want a recurring, plain-English financial rhythm without doing the spreadsheet work themselves.",
    includes: [
      "Every template auto-filled from your numbers",
      "Bi-weekly Owner Briefing (plain English)",
      "Cash, margin, and payroll-runway read",
      "Concentration & customer profitability tracker",
      "Subscription & recurring-cost audit",
      "Tax reserve ledger",
      "PDF briefing + spreadsheet export",
      "Read-only bank connection via Plaid",
    ],
    cta: { label: "Auto-fill my reports — $150/mo", href: "/pricing#auto-fill" },
    tone: "continuity",
    note: "Cancel anytime",
  },
  {
    id: "advisory",
    name: "GoldFin Advisory",
    price: "Custom",
    badge: "Standing counsel with Chris Sam",
    positioning:
      "A senior finance partner in the room for the decisions that move the business.",
    bestFor:
      "Owner-led businesses roughly $1M–$10M in revenue, past the point where gut feel alone is enough.",
    includes: [
      "Everything in GoldFin Reports",
      "Direct line to Chris Sam for live decisions",
      "Planning sessions on your calendar",
      "Pricing, hiring, and cash calls, discussed",
      "Diagnostic model built and kept current",
      "Senior judgment on every engagement",
    ],
    cta: { label: "Request a conversation", href: "/about#advisory-contact" },
    tone: "flagship",
    note: "By conversation",
  },
];

// $150/mo continuity rung — value-stacked offer (Pattern E).
// Per-item values are deliberately realistic so the stack stays credible
// (premium finance brand: no inflated anchoring).
export const autoFillOffer = {
  eyebrow: "GoldFin Reports · $150 / month",
  name: "GoldFin Reports",
  headline: "Use the templates free. Or have them filled for you every month.",
  sub: "The same financial templates you can download free — except we keep them filled from your numbers, every month, and hand you a plain-English briefing. No spreadsheet work. No catching up at year-end.",
  price: "$150",
  priceSuffix: "/ month",
  stack: [
    { item: "Every template auto-filled from your numbers", value: "$300/mo" },
    { item: "Monthly cash-flow summary", value: "$150/mo" },
    { item: "Expense-change report", value: "$100/mo" },
    { item: "Subscription & recurring-cost tracker", value: "$80/mo" },
    { item: "Revenue snapshot", value: "$80/mo" },
    { item: "Monthly PDF briefing", value: "$170/mo" },
    { item: "Owner action list", value: "$100/mo" },
    { item: "Spreadsheet export — always yours", value: "Included" },
  ] as const,
  totalValueLabel: "Total value",
  totalValue: "$980+/mo",
  cta: "Auto-fill my reports — $150/mo",
  guarantee: "Try one month. Cancel anytime before your next billing cycle.",
  trust: "Secure bank connection via Plaid — read-only, we never move money. Cancel anytime.",
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
    investment: "$150 / month",
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
    a: "Yes. The $150/mo plan is month-to-month. Try one month — if it isn't clearer, cancel before your next billing cycle. No friction, no lock-in.",
  },
  {
    q: "Do I need to connect my bank for the $150 plan?",
    a: "Yes — GoldFin Reports auto-fills from your real numbers, so after onboarding you connect your business bank through Plaid. It is a read-only connection (we can see balances and transactions; we cannot move money), the same bank-grade link used by thousands of finance apps, and you can disconnect anytime from Settings. If you want to trial the rhythm first, start with the free Template Vault or sample briefing — those need no connection.",
  },
  {
    q: "What if I already have a bookkeeper?",
    a: "Keep them. A bookkeeper keeps your records clean. GoldFin Reports turns those records into a monthly plain-English briefing on what changed, what's risky, and what to decide next. They work together.",
  },
  {
    q: "What's the difference between Reports and Advisory?",
    a: "GoldFin Reports ($150/mo) is fully automated — your templates filled from your numbers and a bi-weekly plain-English briefing, delivered to your inbox. GoldFin Advisory (custom, by conversation) adds Chris Sam directly: a senior finance partner in the room for the calls that move the business — pricing, hiring, cash, and planning. Most owners start with Reports and move up when the decisions get bigger.",
  },
  {
    q: "Is this a bookkeeping or CFO replacement?",
    a: "Neither. It does not replace tax, legal, accounting, or bookkeeping. It is the missing clarity layer — more than templates or a dashboard, lighter than a full finance hire.",
  },
  {
    q: "How does GoldFin Advisory pricing work?",
    a: "Advisory is priced by conversation, not by tier. Every business is different in size, complexity, and how often decisions come up — so we scope it together on a short call. There is no application form and no obligation.",
  },
  {
    q: "Who is this best for?",
    a: "Owner-led businesses with real financial movement, recurring expenses, and cash-flow questions — but no full-time finance leader.",
  },
  {
    q: "What happens if I request an Advisory conversation?",
    a: "You email Chris directly at chris@goldfindesk.com. We set a 30-minute call — no charge — to learn your business and see if we're a fit. If we are, we scope the engagement. If we aren't, we'll say so.",
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
    // continuity = gold CTA in PlanFitSection — bread & butter $150/mo
    title: "Choose GoldFin Reports if:",
    bullets: [
      "You want your reports filled for you monthly",
      "You have recurring revenue and real expenses",
      "You want a monthly plain-English briefing",
      "You are ready to stop doing spreadsheet work",
      "You want to cancel anytime with no lock-in",
    ],
    cta: { label: "Auto-fill my reports — $150/mo", href: "/pricing#auto-fill" },
    tone: "continuity" as PlanTone,
  },
  {
    // advisory — border/secondary per value ladder (not gold)
    title: "Talk to us about Advisory if:",
    bullets: [
      "Your business does roughly $1M–$10M in revenue",
      "You want a senior finance partner in the room, not another tool",
      "You have hiring, pricing, or cash decisions coming up",
      "You want standing counsel — not a one-time project",
    ],
    cta: { label: "Request a conversation", href: "/about#advisory-contact" },
    tone: "flagship" as PlanTone,
  },
];

export const trustCards = [
  "No bank connection required for preview",
  "No bank connection required to apply",
  "No payment required to apply",
  "$150/mo connection is read-only via Plaid",
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
      planId: "advisory",
      headline: "Talk to Chris about Advisory.",
      body: "Your size and complexity warrant a senior finance partner in the room, not another tool.",
      cta: { label: "Request a conversation", href: "/about#advisory-contact" },
    };
  }
  if (lowRev) {
    return {
      planId: "autofill",
      headline: "Start with GoldFin Reports.",
      body: "Your templates filled from your numbers, plus a bi-weekly plain-English briefing. $150/mo, cancel anytime.",
      cta: { label: "Auto-fill my reports — $150/mo", href: "/pricing#auto-fill" },
    };
  }
  return {
    planId: "advisory",
    headline: "Talk to Chris about Advisory.",
    body: "Your stage suggests standing counsel — a senior finance partner in the room for the calls that move the business.",
    cta: { label: "Request a conversation", href: "/about#advisory-contact" },
  };
}
