export type Difficulty = "Beginner" | "Intermediate";

export type TemplateCategory =
  | "Owner Dashboard"
  | "Cash Flow"
  | "Profitability"
  | "Expenses";

export type PainTag =
  | "cash-flow"
  | "expenses"
  | "profitability"
  | "monthly-review";

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
  "Owner Dashboard",
  "Cash Flow",
  "Profitability",
  "Expenses",
];

export const templates: TemplateItem[] = [
  {
    id: "owner-command-center",
    name: "Owner Command Center",
    shortName: "Command Center",
    category: "Owner Dashboard",
    description: "A first-tab command center for cash, deposits, outflows, runway, and owner attention.",
    bestFor: "Owners who want the clean answer before opening every detailed worksheet.",
    decisionLine: "Helps you decide whether cash is stable enough to draw, spend, reserve, or slow down.",
    timeToUse: "10 minutes",
    difficulty: "Beginner",
    ctaText: "Get Command Center",
    painPointTags: ["cash-flow", "monthly-review", "profitability"],
    previewRows: [
      { label: "Cash on hand", value: "$84,200", tone: "data" },
      { label: "Money in", value: "$132,400", tone: "positive" },
      { label: "Money out", value: "-$87,540", tone: "neutral" },
      { label: "Net cash movement", value: "$44,860", tone: "positive" },
      { label: "Runway", value: "0.44 months", tone: "caution" },
    ],
  },
  {
    id: "13-week-cash-map",
    name: "13-Week Cash Map",
    shortName: "13-Week Cash Map",
    category: "Cash Flow",
    description: "Turn recent deposits, outflows, burn, and cash on hand into a practical 13-week cash path.",
    bestFor: "Owners asking whether cash will still feel tight over the next quarter.",
    decisionLine: "Helps you decide how much spending room exists before recurring costs and reserves matter.",
    timeToUse: "15 minutes",
    difficulty: "Beginner",
    ctaText: "Get Cash Map",
    painPointTags: ["cash-flow", "profitability"],
    previewRows: [
      { label: "Starting cash", value: "$84,200", tone: "data" },
      { label: "Baseline weekly money in", value: "$66,200", tone: "positive" },
      { label: "Baseline weekly money out", value: "$43,770", tone: "neutral" },
      { label: "Projected cash - week 13", value: "$375,790", tone: "positive" },
      { label: "Reserve floor", value: "$570,000", tone: "caution" },
    ],
  },
  {
    id: "cash-basis-pnl",
    name: "Cash-Basis P&L Review",
    shortName: "Cash P&L",
    category: "Profitability",
    description: "A bank-statement-derived operating view of inflows, outflows, excluded transfers, and profit proxy.",
    bestFor: "Owners who need a practical P&L-style read before full accounting close.",
    decisionLine: "Helps you separate operating activity from transfer noise and understand margin pressure.",
    timeToUse: "18 minutes",
    difficulty: "Intermediate",
    ctaText: "Get Cash P&L",
    painPointTags: ["profitability", "expenses", "monthly-review"],
    previewRows: [
      { label: "Operating deposits", value: "$132,400", tone: "positive" },
      { label: "Operating outflow", value: "-$87,540", tone: "neutral" },
      { label: "Non-operating excluded", value: "$15,500", tone: "data" },
      { label: "Profit proxy", value: "$44,860", tone: "positive" },
      { label: "Profit vs prior", value: "+2.8%", tone: "positive" },
    ],
  },
  {
    id: "expense-vendor-audit",
    name: "Expense And Vendor Audit",
    shortName: "Vendor Audit",
    category: "Expenses",
    description: "Find duplicates, unfamiliar vendors, category movement, and expense lines worth reviewing.",
    bestFor: "Owners who feel expenses are creeping up but do not know which vendors to inspect.",
    decisionLine: "Helps you decide what to cut, renegotiate, or verify before small leaks become habits.",
    timeToUse: "20 minutes",
    difficulty: "Beginner",
    ctaText: "Get Vendor Audit",
    painPointTags: ["expenses"],
    previewRows: [
      { label: "Total outflow", value: "$87,540", tone: "data" },
      { label: "Annual waste flagged", value: "$900", tone: "caution" },
      { label: "Duplicate-like payments", value: "1", tone: "caution" },
      { label: "Unfamiliar merchants", value: "1", tone: "caution" },
      { label: "Biggest mover", value: "Software +$1,500", tone: "caution" },
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
    templateIds: ["owner-command-center", "13-week-cash-map"],
    cta: "Start With Cash",
  },
  {
    id: "profitable",
    question: "Am I actually profitable?",
    templateIds: ["cash-basis-pnl", "owner-command-center"],
    cta: "Review Profitability",
  },
  {
    id: "where-money-goes",
    question: "Where is the money going?",
    templateIds: ["expense-vendor-audit", "cash-basis-pnl"],
    cta: "Audit Expenses",
  },
  {
    id: "what-to-review",
    question: "What should I review first?",
    templateIds: ["owner-command-center", "13-week-cash-map", "expense-vendor-audit"],
    cta: "Open Command Center",
  },
];

export const comparison = {
  free: {
    label: "Do it yourself - Free",
    time: "~2 hrs / month",
    positioning: "Use the four-workbook Vault manually",
    items: [
      "Download the branded XLSX vault",
      "Use the Plaid-fillable worksheet structure",
      "Drop in exported bank-statement metrics",
      "Review hidden methodology and source tabs",
      "Keep the CSV fallback if needed",
    ],
    bestFor: "Owners who want a strong financial operating structure they can update themselves.",
  },
  desk: {
    label: "Done for you - GoldFin Reports - $150/mo",
    time: "0 hrs / month",
    positioning: "Have the four-workbook Vault filled for you",
    items: [
      "Owner Command Center",
      "13-Week Cash Map",
      "Cash-Basis P&L Review",
      "Expense And Vendor Audit",
      "Monthly plain-English PDF briefing",
    ],
    bestFor: "Owners who want monthly clarity without doing spreadsheet work.",
  },
};

export const bridgeSteps = [
  {
    n: "01",
    title: "Download the vault",
    copy: "Start with the four branded XLSX workbooks built around bank-statement-fillable metrics.",
  },
  {
    n: "02",
    title: "Review the structure",
    copy: "Each workbook maps to cash, operating profitability, expenses, or owner-level decision clarity.",
  },
  {
    n: "03",
    title: "Upgrade to auto-fill",
    copy: "After onboarding, GoldFin can connect read-only Plaid activity and populate the same workbooks.",
  },
  {
    n: "04",
    title: "Receive the monthly rhythm",
    copy: "The filled workbooks become the base for plain-English interpretation and owner decisions.",
  },
];

export const trustCards = [
  {
    title: "Cash clarity before surprises",
    copy: "See cash pressure through a 13-week operating view, not only the current balance.",
  },
  {
    title: "Expense clarity before waste grows",
    copy: "Spot duplicate-like payments, unfamiliar merchants, recurring waste, and cost creep.",
  },
  {
    title: "Profitability before guesswork",
    copy: "Separate bank deposits, operating outflows, and below-the-line transfer noise.",
  },
  {
    title: "Owner review before drift",
    copy: "Start each month with a command center that points to the sheet that matters most.",
  },
];

export const faq = [
  {
    q: "Are the templates really free?",
    a: "Yes. The free vault is designed to help you start organizing bank-statement-derived financial metrics manually.",
  },
  {
    q: "Do I need to connect my bank account?",
    a: "No. The free workbook requires no bank connection. GoldFin Reports can fill the same templates from read-only Plaid activity after onboarding.",
  },
  {
    q: "Why only four templates?",
    a: "The launch vault includes only the highest-value spreadsheets that can be filled honestly from business bank and card activity: cash, cash-basis P&L, expense audit, and owner command center.",
  },
  {
    q: "Are these templates a replacement for bookkeeping?",
    a: "No. They are financial organization and planning tools. They do not replace bookkeeping, tax, legal, accounting, credit, or investment advice.",
  },
  {
    q: "Who are these templates best for?",
    a: "Owner-led businesses with real deposits, expenses, recurring spend, and cash-flow questions.",
  },
  {
    q: "What is the difference between the templates and GoldFin Reports?",
    a: "Templates give you the workbook structure. GoldFin Reports fills them from your numbers and sends a plain-English monthly briefing.",
  },
  {
    q: "What if I do not know which template I need?",
    a: "Start with the Owner Command Center. It points you to the detailed sheet that deserves attention first.",
  },
  {
    q: "Will the templates give financial advice?",
    a: "No. They are organizational tools and product previews, not tax, legal, accounting, credit, or investment advice.",
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
  { id: "expenses", label: "Expenses" },
  { id: "profitability", label: "Profitability" },
  { id: "monthly-review", label: "Monthly review" },
  { id: "unsure", label: "I am not sure yet" },
];
