export type Difficulty = "Beginner" | "Intermediate";

export type TemplateCategory =
  | "Cash Flow"
  | "Monthly Review"
  | "Expenses"
  | "Hiring"
  | "Taxes"
  | "Revenue"
  | "Profitability"
  | "Owner Dashboard"
  | "Subscriptions"
  | "Business Planning";

export type PainTag =
  | "cash-flow"
  | "hiring"
  | "expenses"
  | "taxes"
  | "profitability"
  | "monthly-review"
  | "revenue-growth"
  | "subscriptions";

export type PreviewRow = {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "caution" | "data";
};

export type TemplateItem = {
  id: string;
  name: string;
  shortName: string;
  category: TemplateCategory;
  description: string;
  bestFor: string;
  decisionLine: string;
  timeToUse: string;
  difficulty: Difficulty;
  ctaText: string;
  painPointTags: PainTag[];
  previewRows: PreviewRow[];
};

export const categories: ("All" | TemplateCategory)[] = [
  "All",
  "Cash Flow",
  "Monthly Review",
  "Expenses",
  "Hiring",
  "Taxes",
  "Revenue",
  "Profitability",
  "Owner Dashboard",
  "Subscriptions",
  "Business Planning",
];

export const templates: TemplateItem[] = [
  {
    id: "cash-flow-forecast",
    name: "Cash Flow Forecast Template",
    shortName: "Cash Flow Forecast",
    category: "Cash Flow",
    description: "See upcoming cash pressure before it becomes a surprise.",
    bestFor: "Owners asking, “Will cash still feel tight next month?”",
    decisionLine: "Helps you decide whether next month has room for hiring, spending, or reserves.",
    timeToUse: "15 minutes",
    difficulty: "Beginner",
    ctaText: "Get Cash Flow Template",
    painPointTags: ["cash-flow", "revenue-growth"],
    previewRows: [
      { label: "Starting cash", value: "$84,200", tone: "data" },
      { label: "Expected revenue", value: "$132,400", tone: "positive" },
      { label: "Payroll", value: "−$58,100", tone: "neutral" },
      { label: "Contractor costs", value: "−$14,300", tone: "neutral" },
      { label: "Software subscriptions", value: "−$3,940", tone: "neutral" },
      { label: "Tax reserve", value: "−$11,200", tone: "neutral" },
      { label: "Projected ending cash", value: "$129,060", tone: "positive" },
      { label: "Cash pressure", value: "Low next 30 days", tone: "positive" },
    ],
  },
  {
    id: "monthly-review",
    name: "Monthly Financial Review Template",
    shortName: "Monthly Review",
    category: "Monthly Review",
    description: "Create a repeatable monthly review for revenue, expenses, cash, and decisions.",
    bestFor: "Owners who want a simple monthly finance rhythm.",
    decisionLine: "Helps you decide what to address this month before it compounds.",
    timeToUse: "20 minutes",
    difficulty: "Beginner",
    ctaText: "Get Monthly Review Template",
    painPointTags: ["monthly-review"],
    previewRows: [
      { label: "Revenue vs last month", value: "+6.4%", tone: "positive" },
      { label: "Expenses vs last month", value: "+9.1%", tone: "caution" },
      { label: "Cash on hand", value: "$129,060", tone: "data" },
      { label: "Notable movement", value: "Software spend climbed", tone: "caution" },
      { label: "Decision flag", value: "Audit subscriptions", tone: "neutral" },
    ],
  },
  {
    id: "expense-audit",
    name: "Expense Audit Template",
    shortName: "Expense Audit",
    category: "Expenses",
    description: "Find recurring costs, unusual spend, and expense categories worth reviewing.",
    bestFor: "Owners who feel expenses are creeping up.",
    decisionLine: "Helps you decide what to cut, renegotiate, or keep with intention.",
    timeToUse: "20 minutes",
    difficulty: "Beginner",
    ctaText: "Get Expense Audit Template",
    painPointTags: ["expenses", "subscriptions"],
    previewRows: [
      { label: "Total expenses", value: "$87,540", tone: "data" },
      { label: "Recurring software", value: "$3,940", tone: "neutral" },
      { label: "Vendors > $1K/mo", value: "7", tone: "neutral" },
      { label: "Unusual category spike", value: "Travel +212%", tone: "caution" },
      { label: "Review-worthy line items", value: "12", tone: "caution" },
    ],
  },
  {
    id: "hiring-calculator",
    name: "Hiring Affordability Calculator",
    shortName: "Hiring Calculator",
    category: "Hiring",
    description: "Review whether the business can support a new fixed payroll cost.",
    bestFor: "Owners deciding whether to hire.",
    decisionLine: "Helps you decide if the next hire is safe, premature, or worth phasing.",
    timeToUse: "25 minutes",
    difficulty: "Intermediate",
    ctaText: "Get Hiring Calculator",
    painPointTags: ["hiring", "cash-flow"],
    previewRows: [
      { label: "Proposed salary", value: "$78,000", tone: "data" },
      { label: "Loaded cost (1.25×)", value: "$97,500", tone: "neutral" },
      { label: "Monthly cash impact", value: "−$8,125", tone: "neutral" },
      { label: "Months of runway after hire", value: "6.2", tone: "caution" },
      { label: "Affordability", value: "Tight — phase or delay", tone: "caution" },
    ],
  },
  {
    id: "tax-reserve",
    name: "Tax Reserve Tracker",
    shortName: "Tax Reserve",
    category: "Taxes",
    description: "Track estimated tax reserve targets so tax season does not become a cash shock.",
    bestFor: "Owners who worry about taxes catching them off guard.",
    decisionLine: "Helps you decide how much to set aside each month and when to adjust.",
    timeToUse: "15 minutes",
    difficulty: "Beginner",
    ctaText: "Get Tax Reserve Tracker",
    painPointTags: ["taxes", "cash-flow"],
    previewRows: [
      { label: "Estimated annual tax", value: "$54,000", tone: "data" },
      { label: "Reserve target / month", value: "$4,500", tone: "neutral" },
      { label: "Reserved YTD", value: "$22,400", tone: "positive" },
      { label: "Gap to target", value: "−$3,100", tone: "caution" },
    ],
  },
  {
    id: "subscription-tracker",
    name: "Subscription Expense Tracker",
    shortName: "Subscriptions",
    category: "Subscriptions",
    description: "See software and recurring subscriptions that quietly reduce flexibility.",
    bestFor: "Owners with too many tools and unclear recurring spend.",
    decisionLine: "Helps you decide which tools to consolidate, downgrade, or cancel.",
    timeToUse: "10 minutes",
    difficulty: "Beginner",
    ctaText: "Get Subscription Tracker",
    painPointTags: ["subscriptions", "expenses"],
    previewRows: [
      { label: "Active subscriptions", value: "23", tone: "data" },
      { label: "Monthly recurring", value: "$3,940", tone: "neutral" },
      { label: "Used by 1 person only", value: "8", tone: "caution" },
      { label: "Duplicate tools", value: "3", tone: "caution" },
    ],
  },
  {
    id: "trend-tracker",
    name: "Revenue and Expense Trend Tracker",
    shortName: "Trend Tracker",
    category: "Revenue",
    description: "Compare revenue growth against expense growth to see whether growth is improving cash.",
    bestFor: "Owners asking, “Revenue is up, so why does cash still feel tight?”",
    decisionLine: "Helps you decide whether growth is actually translating into cash.",
    timeToUse: "25 minutes",
    difficulty: "Intermediate",
    ctaText: "Get Trend Tracker",
    painPointTags: ["revenue-growth", "profitability", "cash-flow"],
    previewRows: [
      { label: "Revenue 6-mo trend", value: "+18%", tone: "positive" },
      { label: "Expense 6-mo trend", value: "+27%", tone: "caution" },
      { label: "Cash 6-mo trend", value: "−4%", tone: "caution" },
      { label: "Pattern", value: "Growth outpacing margin", tone: "caution" },
    ],
  },
  {
    id: "owner-dashboard",
    name: "Owner Dashboard Template",
    shortName: "Owner Dashboard",
    category: "Owner Dashboard",
    description: "Track the few numbers an owner should review every month.",
    bestFor: "Owners who want a simpler financial control panel.",
    decisionLine: "Helps you focus on the small set of numbers that drive real decisions.",
    timeToUse: "20 minutes",
    difficulty: "Beginner",
    ctaText: "Get Owner Dashboard",
    painPointTags: ["monthly-review", "profitability"],
    previewRows: [
      { label: "Cash on hand", value: "$129,060", tone: "data" },
      { label: "Revenue MTD", value: "$94,200", tone: "positive" },
      { label: "Gross margin", value: "61%", tone: "positive" },
      { label: "Months of runway", value: "7.4", tone: "neutral" },
      { label: "Top decision flag", value: "Subscription audit", tone: "caution" },
    ],
  },
  {
    id: "pnl-review",
    name: "Profit and Loss Review Template",
    shortName: "P&L Review",
    category: "Profitability",
    description: "Review revenue, cost categories, and margin movement in plain English.",
    bestFor: "Owners who receive P&Ls but do not know what to do with them.",
    decisionLine: "Helps you decide what each line of the P&L is telling you to do.",
    timeToUse: "25 minutes",
    difficulty: "Intermediate",
    ctaText: "Get P&L Review Template",
    painPointTags: ["profitability", "expenses"],
    previewRows: [
      { label: "Revenue", value: "$132,400", tone: "data" },
      { label: "COGS", value: "−$51,200", tone: "neutral" },
      { label: "Gross profit", value: "$81,200", tone: "positive" },
      { label: "Operating expenses", value: "−$62,500", tone: "neutral" },
      { label: "Net margin", value: "14.1%", tone: "positive" },
    ],
  },
  {
    id: "budget",
    name: "Business Budget Template",
    shortName: "Budget",
    category: "Business Planning",
    description: "Plan monthly spending before expenses quietly grow beyond revenue.",
    bestFor: "Owners who want more spending discipline.",
    decisionLine: "Helps you decide your spending limits before the month begins.",
    timeToUse: "20 minutes",
    difficulty: "Beginner",
    ctaText: "Get Budget Template",
    painPointTags: ["expenses", "profitability"],
    previewRows: [
      { label: "Planned revenue", value: "$130,000", tone: "data" },
      { label: "Planned expenses", value: "$84,500", tone: "neutral" },
      { label: "Planned reserve", value: "$11,500", tone: "neutral" },
      { label: "Planned profit", value: "$34,000", tone: "positive" },
    ],
  },
  {
    id: "cash-reserve",
    name: "Cash Reserve Planning Template",
    shortName: "Cash Reserve",
    category: "Cash Flow",
    description: "Estimate how much cash should stay untouched before hiring, spending, or expanding.",
    bestFor: "Owners making growth decisions.",
    decisionLine: "Helps you decide what cash is actually available to deploy.",
    timeToUse: "20 minutes",
    difficulty: "Intermediate",
    ctaText: "Get Cash Reserve Planner",
    painPointTags: ["cash-flow", "hiring"],
    previewRows: [
      { label: "Operating expenses / mo", value: "$84,500", tone: "data" },
      { label: "Target reserve (3 mo)", value: "$253,500", tone: "neutral" },
      { label: "Current reserve", value: "$129,060", tone: "caution" },
      { label: "Deployable cash", value: "$0 until target", tone: "caution" },
    ],
  },
  {
    id: "decision-review",
    name: "Monthly Decision Review Template",
    shortName: "Decision Review",
    category: "Monthly Review",
    description: "Turn financial data into the questions and decisions you need to review this month.",
    bestFor: "Owners who want more than charts.",
    decisionLine: "Helps you turn this month’s numbers into specific decisions.",
    timeToUse: "15 minutes",
    difficulty: "Beginner",
    ctaText: "Get Decision Review Template",
    painPointTags: ["monthly-review", "hiring", "expenses"],
    previewRows: [
      { label: "Questions to review", value: "5", tone: "neutral" },
      { label: "Decisions due this month", value: "3", tone: "neutral" },
      { label: "Owner attention required", value: "Hiring + subscriptions", tone: "caution" },
    ],
  },
];

export type RecommendedPath = {
  id: string;
  question: string;
  templateIds: string[];
  cta: string;
};

export const recommendedPaths: RecommendedPath[] = [
  {
    id: "cash-tight",
    question: "Why does cash still feel tight?",
    templateIds: ["cash-flow-forecast", "trend-tracker", "cash-reserve"],
    cta: "Start with Cash Flow",
  },
  {
    id: "can-i-hire",
    question: "Can I afford to hire?",
    templateIds: ["hiring-calculator", "cash-reserve", "decision-review"],
    cta: "Review Hiring Readiness",
  },
  {
    id: "where-money-goes",
    question: "Where is the money going?",
    templateIds: ["expense-audit", "subscription-tracker", "budget"],
    cta: "Audit Expenses",
  },
  {
    id: "what-to-review",
    question: "What should I review every month?",
    templateIds: ["monthly-review", "owner-dashboard", "decision-review"],
    cta: "Build Monthly Review",
  },
  {
    id: "profitable",
    question: "Am I actually profitable?",
    templateIds: ["pnl-review", "trend-tracker", "budget"],
    cta: "Review Profitability",
  },
];

export const comparison = {
  free: {
    label: "Free Templates",
    positioning: "Manual financial structure",
    items: [
      "Downloadable spreadsheets",
      "Self-guided organization",
      "Manual updates",
      "Owner interpretation",
      "Great starting point",
    ],
    bestFor: "Owners who want to begin organizing their numbers themselves.",
  },
  desk: {
    label: "Monthly Finance Desk",
    positioning: "Automated monthly financial clarity",
    items: [
      "Expert-built spreadsheet system",
      "Plaid connection after onboarding",
      "AI-assisted organization",
      "Bi-weekly plain-English briefings",
      "Monthly strategy review",
      "Questions to review",
      "Decisions to consider",
    ],
    bestFor: "Owners who want their financial activity organized, interpreted, and reviewed monthly.",
  },
};

export const bridgeSteps = [
  {
    n: "01",
    title: "Download templates",
    copy: "Start with a clearer structure for cash, expenses, hiring, and monthly review.",
  },
  {
    n: "02",
    title: "Organize manually",
    copy: "Use the templates to see where your current financial visibility feels weak.",
  },
  {
    n: "03",
    title: "Upgrade to the Monthly Finance Desk",
    copy: "After onboarding, the system can connect to real activity through Plaid and AI-assisted organization.",
  },
  {
    n: "04",
    title: "Receive recurring briefings and review",
    copy: "Every two weeks, plain-English interpretation. Every month, a one-hour strategy review.",
  },
];

export const trustCards = [
  {
    title: "Cash flow before surprises",
    copy: "See cash pressure 30–60 days out, not after it happens.",
  },
  {
    title: "Expense clarity before waste grows",
    copy: "Spot the recurring spend and category drift that quietly compounds.",
  },
  {
    title: "Hiring review before fixed costs",
    copy: "Check whether the next role is safe before it becomes payroll.",
  },
  {
    title: "Monthly rhythm before year-end panic",
    copy: "Trade quarterly scrambles for a calm monthly review.",
  },
];

export const faq = [
  {
    q: "Are the templates really free?",
    a: "Yes. The free templates are designed to help you start organizing your numbers manually.",
  },
  {
    q: "Do I need to connect my bank account?",
    a: "No. The templates require no bank connection. The Monthly Finance Desk preview and application also require no bank connection.",
  },
  {
    q: "Are these templates a replacement for bookkeeping?",
    a: "No. They are self-guided financial organization tools. They do not replace bookkeeping, tax, legal, or accounting advice.",
  },
  {
    q: "Who are these templates best for?",
    a: "Owner-led businesses that want a clearer way to review cash flow, expenses, hiring decisions, taxes, and monthly financial patterns.",
  },
  {
    q: "What is the difference between the templates and the Monthly Finance Desk?",
    a: "Templates give you manual structure. The Monthly Finance Desk adds automation, plain-English briefings, and a monthly strategy review.",
  },
  {
    q: "What if I do not know which template I need?",
    a: "Use the “Not sure where to start?” section or start with the Monthly Financial Review Template.",
  },
  {
    q: "Can I apply for the Monthly Finance Desk after downloading?",
    a: "Yes. The templates are a starting point. If you want this system automated and reviewed monthly, apply for the Monthly Finance Desk.",
  },
  {
    q: "Will the templates give financial advice?",
    a: "No. They are organizational tools and product previews. They are not tax, legal, accounting, or investment advice.",
  },
];

export const businessTypes = [
  "Agency or studio",
  "Professional services",
  "E-commerce",
  "Restaurant or hospitality",
  "Trades or field services",
  "Clinic or practice",
  "Other owner-led business",
];

export const goalChips: { id: PainTag | "unsure"; label: string }[] = [
  { id: "cash-flow", label: "Cash flow" },
  { id: "hiring", label: "Hiring" },
  { id: "expenses", label: "Expenses" },
  { id: "taxes", label: "Taxes" },
  { id: "profitability", label: "Profitability" },
  { id: "monthly-review", label: "Monthly review" },
  { id: "revenue-growth", label: "Revenue growth" },
  { id: "unsure", label: "I am not sure yet" },
];
