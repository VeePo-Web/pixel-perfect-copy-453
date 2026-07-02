/* ───────── Hero columns ───────── */

export type HeroColumn = {
  id: "bookkeeper" | "mfd" | "cfo";
  label: string;
  role: string;
  isMfd?: boolean;
};

export const heroColumns: HeroColumn[] = [
  { id: "bookkeeper", label: "Bookkeeper", role: "Clean records" },
  { id: "mfd", label: "GoldFin Desk", role: "Recurring clarity rhythm", isMfd: true },
  { id: "cfo", label: "Fractional CFO", role: "Strategic finance leadership" },
];

/* ───────── Fast answer cards ───────── */

export type FastAnswerCard = {
  id: "bookkeeper" | "mfd" | "cfo";
  title: string;
  body: string;
  bestFor: string;
  caveatLabel: string;
  caveat: string;
  isMfd?: boolean;
};

export const fastAnswerCards: FastAnswerCard[] = [
  {
    id: "bookkeeper",
    title: "Choose a bookkeeper if…",
    body: "Your transactions are messy, your books are behind, or you need someone to keep records clean and organized.",
    bestFor: "Clean records and basic reporting.",
    caveatLabel: "Usually not enough when",
    caveat: "You already have reports but still do not know what decisions to make.",
  },
  {
    id: "mfd",
    title: "Choose GoldFin Desk if…",
    body: "Your books and tools exist, but you still feel unclear about cash flow, expenses, hiring, revenue quality, and what deserves attention each month.",
    bestFor: "Recurring financial clarity, plain-English briefings, and monthly review.",
    caveatLabel: "Usually not enough when",
    caveat: "You need full CFO-level forecasting, fundraising, complex modeling, or deep finance leadership.",
    isMfd: true,
  },
  {
    id: "cfo",
    title: "Choose a fractional CFO if…",
    body: "Your business needs deeper strategic finance leadership, forecasting, scenario planning, board/investor reporting, or high-level financial strategy.",
    bestFor: "Complex strategic planning and CFO-level leadership.",
    caveatLabel: "Usually too much when",
    caveat: "You mainly need a clearer monthly rhythm before making owner-led decisions.",
  },
];

/* ───────── Job-to-be-done map ───────── */

export type JobMap = {
  id: "bookkeeper" | "mfd" | "cfo";
  label: string;
  job: string;
  output: string;
  question: string;
  isMfd?: boolean;
};

export const jobMap: JobMap[] = [
  {
    id: "bookkeeper",
    label: "Bookkeeper",
    job: "Record what happened.",
    output: "Clean books, reconciliations, transaction categorization, basic reports.",
    question: "“Are my records organized?”",
  },
  {
    id: "mfd",
    label: "GoldFin Desk",
    job: "Explain what deserves attention.",
    output: "Organized spreadsheet system, bi-weekly plain-English briefing, questions to review, monthly strategy rhythm.",
    question: "“What is happening in my business, and what should I review next?”",
    isMfd: true,
  },
  {
    id: "cfo",
    label: "Fractional CFO",
    job: "Lead financial strategy.",
    output: "Forecasts, strategic planning, deeper financial modeling, board/investor support, scenario planning.",
    question: "“What financial strategy should guide the next stage of the business?”",
  },
];

/* ───────── Fit Finder ───────── */

export type FitChoice<V extends string = string> = { value: V; label: string };

export type SetupValue =
  | "messy"
  | "bk-unclear"
  | "bank-balance"
  | "cash-tight"
  | "hire-decision"
  | "forecasting"
  | "investor-ready"
  | "templates-only";

export type ProblemValue =
  | "clean-records"
  | "cash-flow"
  | "expense-review"
  | "hiring-support"
  | "monthly-rhythm"
  | "interpretation"
  | "cfo-planning"
  | "forecasting-modeling";

export type StageValue =
  | "under-10k"
  | "10-30k"
  | "30-75k"
  | "75-150k"
  | "150-250k"
  | "250k-plus";

export const fitSetup: FitChoice<SetupValue>[] = [
  { value: "messy", label: "My books are messy or behind" },
  { value: "bk-unclear", label: "I have a bookkeeper, but I still feel unclear" },
  { value: "bank-balance", label: "I check the bank balance before decisions" },
  { value: "cash-tight", label: "Revenue is growing, but cash still feels tight" },
  { value: "hire-decision", label: "I need to know if I can afford to hire" },
  { value: "forecasting", label: "I need deeper forecasting and planning" },
  { value: "investor-ready", label: "I need investor, board, or lender-ready finance support" },
  { value: "templates-only", label: "I just want free templates to start" },
];

export const fitProblem: FitChoice<ProblemValue>[] = [
  { value: "clean-records", label: "Clean records" },
  { value: "cash-flow", label: "Cash-flow clarity" },
  { value: "expense-review", label: "Expense review" },
  { value: "hiring-support", label: "Hiring decision support" },
  { value: "monthly-rhythm", label: "Monthly financial review rhythm" },
  { value: "interpretation", label: "Plain-English interpretation" },
  { value: "cfo-planning", label: "CFO-level planning" },
  { value: "forecasting-modeling", label: "Forecasting and strategic modeling" },
];

export const fitStage: FitChoice<StageValue>[] = [
  { value: "under-10k", label: "Under $10K/month" },
  { value: "10-30k", label: "$10K–$30K/month" },
  { value: "30-75k", label: "$30K–$75K/month" },
  { value: "75-150k", label: "$75K–$150K/month" },
  { value: "150-250k", label: "$150K–$250K/month" },
  { value: "250k-plus", label: "$250K+/month" },
];

export type RecommendationKey =
  | "bookkeepingFirst"
  | "mfdLikely"
  | "mfdBuiltFor"
  | "cfo"
  | "templatesFirst";

export type Recommendation = {
  key: RecommendationKey;
  eyebrow: string;
  title: string;
  body: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA: { label: string; href: string };
  mobileCTA: { label: string; href: string };
};

export const recommendations: Record<RecommendationKey, Recommendation> = {
  bookkeepingFirst: {
    key: "bookkeepingFirst",
    eyebrow: "Start here",
    title: "Start with bookkeeping cleanup first.",
    body: "GoldFin Desk works best when your financial activity can be reviewed consistently. If the books are unusable or far behind, cleanup may be the first step.",
    primaryCTA: { label: "Start With Free Templates", href: "/templates" },
    secondaryCTA: { label: "See how GoldFin Desk works", href: "/pricing" },
    mobileCTA: { label: "Get Free Templates", href: "/templates" },
  },
  mfdLikely: {
    key: "mfdLikely",
    eyebrow: "Likely fit",
    title: "GoldFin Desk may be the right next layer.",
    body: "You may already have records. The missing piece is recurring interpretation and monthly decision rhythm.",
    primaryCTA: { label: "Generate Sample Finance Briefing", href: "/sample-briefing" },
    secondaryCTA: { label: "Auto-fill my reports — $150/mo", href: "/pricing#auto-fill" },
    mobileCTA: { label: "Generate Sample Briefing", href: "/sample-briefing" },
  },
  mfdBuiltFor: {
    key: "mfdBuiltFor",
    eyebrow: "Built for this",
    title: "GoldFin Desk is built for this.",
    body: "If the bank balance has become your decision dashboard, you likely need a clearer recurring financial view.",
    primaryCTA: { label: "Generate Sample Finance Briefing", href: "/sample-briefing" },
    secondaryCTA: { label: "Auto-fill my reports — $150/mo", href: "/pricing#auto-fill" },
    mobileCTA: { label: "Generate Sample Briefing", href: "/sample-briefing" },
  },
  cfo: {
    key: "cfo",
    eyebrow: "Consider CFO support",
    title: "Consider fractional CFO support.",
    body: "If you need advanced forecasting, investor reporting, board support, or complex strategic finance leadership, a fractional CFO may be the better fit.",
    primaryCTA: { label: "Compare CFO Options", href: "/compare" },
    secondaryCTA: { label: "See GoldFin Desk Pricing", href: "/pricing" },
    mobileCTA: { label: "Compare CFO Options", href: "/compare" },
  },
  templatesFirst: {
    key: "templatesFirst",
    eyebrow: "Start light",
    title: "Start with the Free Templates.",
    body: "The free templates may be the best starting point until the business has more recurring financial complexity.",
    primaryCTA: { label: "Get Free Templates", href: "/templates" },
    secondaryCTA: { label: "Generate Sample Briefing", href: "/sample-briefing" },
    mobileCTA: { label: "Get Free Templates", href: "/templates" },
  },
};

export function recommend(
  setup: SetupValue | null,
  problem: ProblemValue | null,
  stage: StageValue | null
): RecommendationKey {
  // CFO signals dominate
  if (
    setup === "forecasting" ||
    setup === "investor-ready" ||
    problem === "cfo-planning" ||
    problem === "forecasting-modeling"
  ) {
    return "cfo";
  }
  // Records must be clean before MFD adds value
  if (setup === "messy" || problem === "clean-records") return "bookkeepingFirst";

  // Templates-first signals
  if (
    setup === "templates-only" ||
    stage === "under-10k" ||
    (stage === "10-30k" && setup !== "bk-unclear")
  ) {
    return "templatesFirst";
  }

  // Built-for-this: bank-balance guessing
  if (setup === "bank-balance" || setup === "cash-tight") return "mfdBuiltFor";

  // Default: MFD likely
  return "mfdLikely";
}

/* ───────── Comparison table rows ───────── */

export type TableRow = {
  id: string;
  label: string;
  bookkeeper: string;
  mfd: string;
  cfo: string;
};

export const tableRows: TableRow[] = [
  {
    id: "primary-role",
    label: "Primary role",
    bookkeeper: "Clean and organize records.",
    mfd: "Create recurring financial clarity.",
    cfo: "Lead financial strategy.",
  },
  {
    id: "best-for",
    label: "Best for",
    bookkeeper: "Messy records, reconciliations, transaction categorization.",
    mfd: "Owner-led businesses with reports/tools but unclear decisions.",
    cfo: "More complex businesses needing deeper strategic finance leadership.",
  },
  {
    id: "typical-output",
    label: "Typical output",
    bookkeeper: "Clean books, reconciliations, P&L, balance sheet, basic reports.",
    mfd: "Organized financial system, bi-weekly briefing, questions to review, monthly strategy call.",
    cfo: "Forecasts, models, planning, strategic guidance, investor/board support.",
  },
  {
    id: "owner-experience",
    label: "Owner experience",
    bookkeeper: "“I know the records are maintained.”",
    mfd: "“I understand what deserves attention.”",
    cfo: "“I have senior finance leadership.”",
  },
  {
    id: "usually-misses",
    label: "What it usually misses",
    bookkeeper: "Plain-English decision interpretation.",
    mfd: "Not a replacement for tax/legal/bookkeeping cleanup/full CFO leadership.",
    cfo: "Can be heavier or more expensive than needed.",
  },
  {
    id: "best-timing",
    label: "Best timing",
    bookkeeper: "When records are messy or behind.",
    mfd: "When the business has grown beyond bank-balance guessing but is not ready for a full CFO.",
    cfo: "When complexity requires CFO-level finance strategy.",
  },
];

export const tableCTAs = {
  bookkeeper: { label: "Clean up records", href: "/templates" },
  mfd: { label: "Auto-fill my reports — $150/mo", href: "/pricing#auto-fill" },
  cfo: { label: "Consider CFO support", href: "/compare" },
};

/* ───────── Maturity spectrum ───────── */

export type SpectrumStop = {
  id: string;
  label: string;
  position: number; // 0..1
  isCenter?: boolean;
};

export const spectrumStops: SpectrumStop[] = [
  { id: "records", label: "Basic records", position: 0.05 },
  { id: "bookkeeping", label: "Bookkeeping", position: 0.27 },
  { id: "mfd", label: "GoldFin Desk", position: 0.5, isCenter: true },
  { id: "cfo", label: "Fractional CFO", position: 0.73 },
  { id: "team", label: "Internal finance team", position: 0.95 },
];

/* ───────── Scenario cards ───────── */

export type Scenario = {
  id: string;
  quote: string;
  recommendation: string;
  explanation: string;
  cta: { label: string; href: string };
};

export const scenarios: Scenario[] = [
  {
    id: "messy-books",
    quote: "My books are messy.",
    recommendation: "Bookkeeper first.",
    explanation: "If your records are behind, clean bookkeeping may be the first priority.",
    cta: { label: "Start With Free Templates", href: "/templates" },
  },
  {
    id: "clean-but-unclear",
    quote: "I have clean reports but still feel unclear.",
    recommendation: "GoldFin Desk.",
    explanation: "This is the exact gap: you have data, but not plain-English interpretation and monthly review.",
    cta: { label: "Generate Sample Briefing", href: "/sample-briefing" },
  },
  {
    id: "can-i-hire",
    quote: "I need to know if I can hire.",
    recommendation: "GoldFin Desk.",
    explanation: "Hiring decisions require cash flow, expense pressure, and recurring cost review — not just a bank balance.",
    cta: { label: "Auto-fill my reports — $150/mo", href: "/pricing#auto-fill" },
  },
  {
    id: "fundraising",
    quote: "I need fundraising, board reporting, or complex forecasts.",
    recommendation: "Fractional CFO.",
    explanation: "Those needs often require deeper CFO-level support.",
    cta: { label: "Compare Against Fractional CFO", href: "/compare" },
  },
  {
    id: "not-ready",
    quote: "I am not ready for $1,500/month.",
    recommendation: "Free Templates.",
    explanation: "Start manually with templates, then upgrade when the financial complexity justifies a monthly rhythm.",
    cta: { label: "Get Free Templates", href: "/templates" },
  },
  {
    id: "serious-monthly",
    quote: "I want someone serious looking at my numbers monthly.",
    recommendation: "GoldFin Desk.",
    explanation: "That is what the monthly strategy review and bi-weekly briefings are built for.",
    cta: { label: "Auto-fill my reports — $150/mo", href: "/pricing#auto-fill" },
  },
];

/* ───────── Owner feeling ───────── */

export type FeelingCard = {
  id: "bookkeeper" | "mfd" | "cfo";
  label: string;
  before: string;
  after: string;
  isMfd?: boolean;
};

export const feelingCards: FeelingCard[] = [
  {
    id: "bookkeeper",
    label: "Bookkeeper",
    before: "“My records are messy.”",
    after: "“My books are cleaner.”",
  },
  {
    id: "mfd",
    label: "GoldFin Desk",
    before: "“I have numbers, but I still feel blind.”",
    after: "“I know what changed, what looks risky, and what to review next.”",
    isMfd: true,
  },
  {
    id: "cfo",
    label: "Fractional CFO",
    before: "“We need financial leadership.”",
    after: "“We have strategic finance guidance.”",
  },
];

/* ───────── Sample briefing modules ───────── */

export const briefing = {
  title: "Sample Bi-Weekly Finance Briefing",
  modules: [
    { title: "Cash Movement", note: "What changed in available cash." },
    { title: "Revenue Trend", note: "Direction and pace of revenue." },
    { title: "Expense Pattern", note: "Where spend is rising or shifting." },
    { title: "Questions to Review", note: "Specific things worth a second look." },
    { title: "Decisions to Consider", note: "Plain-English options for this month." },
  ],
  insight:
    "Revenue is growing, but contractor and software costs are rising faster than margin. Before adding another fixed payroll cost, review whether current cash flow can support the hire without weakening reserves.",
};

/* ───────── Value stack ───────── */

export const valueStack: string[] = [
  "Expert-built spreadsheet system",
  "Plaid-connected data after onboarding",
  "AI-assisted organization",
  "Bi-weekly plain-English briefing",
  "Monthly one-hour strategy review",
  "Questions to review",
  "Decisions to consider",
];

export const priceFraming: string[] = [
  "Less than hiring a full-time finance leader.",
  "Lighter than many CFO engagements.",
  "More strategic than a template.",
  "More personal than a dashboard.",
  "More consistent than waiting until tax season.",
];

/* ───────── FAQ ───────── */

export const faq: { q: string; a: string }[] = [
  {
    q: "Do I still need a bookkeeper?",
    a: "Usually, yes. A bookkeeper helps keep your records clean. The GoldFin Desk adds a recurring layer of structure, plain-English interpretation, and monthly review around your financial activity.",
  },
  {
    q: "Is GoldFin Desk a fractional CFO replacement?",
    a: "No. It is the missing layer before a full CFO. It is designed for owners who need more clarity than bookkeeping or dashboards provide, but who are not ready for full CFO-level finance leadership.",
  },
  {
    q: "When should I choose a bookkeeper instead?",
    a: "Choose a bookkeeper first if your transactions are messy, your books are behind, or your accounting records are not usable.",
  },
  {
    q: "When should I choose a fractional CFO instead?",
    a: "Choose a fractional CFO if you need advanced forecasting, complex strategic planning, investor or board reporting, fundraising support, or CFO-level leadership.",
  },
  {
    q: "When should I choose GoldFin Desk?",
    a: "Choose GoldFin Desk if your business has active financial movement, tools or reports already exist, but you still feel unclear about cash flow, expenses, hiring, revenue quality, or what decisions deserve attention.",
  },
  {
    q: "Do I need to connect my bank account to apply?",
    a: "No. You can preview and apply without connecting your bank. Data connection happens only after onboarding.",
  },
  {
    q: "Is this financial, tax, legal, or investment advice?",
    a: "No. GoldFin Desk does not replace tax, legal, accounting, bookkeeping cleanup, or investment advice.",
  },
  {
    q: "What if I am not ready for $1,500/month?",
    a: "Start with the free templates or generate a sample briefing. The premium desk is best for owners ready to build a recurring monthly finance rhythm.",
  },
];

/* ───────── Decision summary ───────── */

export const decisionSummary = [
  { need: "Need clean records?", answer: "Start with a bookkeeper.", href: "/templates" },
  { need: "Need senior finance strategy?", answer: "Consider a fractional CFO.", href: "/compare" },
  {
    need: "Need recurring clarity between the two?",
    answer: "Have it done for you — GoldFin Reports, $150/mo.",
    href: "/pricing#auto-fill",
  },
];

/* ───────── Top-nav anchors ───────── */

export const topNavSections = [
  { id: "fast-answer", label: "Fast Answer" },
  { id: "compare", label: "Compare" },
  { id: "fit-finder", label: "Fit Finder" },
  { id: "sample-briefing", label: "Sample Briefing" },
  { id: "faq", label: "FAQ" },
  { id: "apply", label: "Apply" },
];
