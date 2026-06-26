export type OptionId =
  | "diy-templates"
  | "accounting-software"
  | "bookkeeper"
  | "dashboard"
  | "spend-tools"
  | "mfd"
  | "fractional-cfo"
  | "internal-team";

export type SupportOption = {
  id: OptionId;
  label: string;
  shortLabel: string;
  bestWhen: string;
  usuallyMisses: string;
  chooseIf: string;
  ctaText: string;
  ctaHref: string;
  anchorId: string;
  /** 0..1 position on the spectrum from DIY → high-touch */
  position: number;
  isMfd?: boolean;
};

export const options: SupportOption[] = [
  {
    id: "diy-templates",
    label: "DIY Templates",
    shortLabel: "DIY",
    bestWhen: "You need manual structure for cash, expenses, and monthly review.",
    usuallyMisses: "Automation, interpretation, and outside accountability.",
    chooseIf: "You are early-stage or want to start organizing yourself.",
    ctaText: "Get Free Templates",
    ctaHref: "/templates",
    anchorId: "row-diy",
    position: 0.05,
  },
  {
    id: "accounting-software",
    label: "QuickBooks / Accounting Software",
    shortLabel: "Accounting",
    bestWhen: "You need accounting records, reports, and transaction visibility.",
    usuallyMisses: "Plain-English interpretation and what to do next.",
    chooseIf: "You are comfortable reading your own financial reports.",
    ctaText: "Compare QuickBooks",
    ctaHref: "#row-accounting",
    anchorId: "row-accounting",
    position: 0.2,
  },
  {
    id: "bookkeeper",
    label: "Bookkeeper",
    shortLabel: "Bookkeeper",
    bestWhen: "Transactions and records need to be reconciled and clean.",
    usuallyMisses: "Strategic interpretation and a recurring decision rhythm.",
    chooseIf: "Your books are messy, behind, or unreliable.",
    ctaText: "Compare Bookkeeper",
    ctaHref: "#row-bookkeeper",
    anchorId: "row-bookkeeper",
    position: 0.32,
  },
  {
    id: "dashboard",
    label: "Financial Dashboard",
    shortLabel: "Dashboard",
    bestWhen: "You want visual metrics, charts, and KPI tracking.",
    usuallyMisses: "Judgment, context, and decision support.",
    chooseIf: "You already know which numbers matter for your business.",
    ctaText: "Compare Dashboards",
    ctaHref: "#row-dashboard",
    anchorId: "row-dashboard",
    position: 0.44,
  },
  {
    id: "spend-tools",
    label: "Ramp / Spend Tools",
    shortLabel: "Spend Tools",
    bestWhen: "You need spend control, cards, approvals, and expense workflows.",
    usuallyMisses: "Whole-business financial interpretation.",
    chooseIf: "Your main pain is controlling spend operations.",
    ctaText: "Compare Spend Tools",
    ctaHref: "#row-spend",
    anchorId: "row-spend",
    position: 0.55,
  },
  {
    id: "mfd",
    label: "GoldFin Desk",
    shortLabel: "GoldFin Desk",
    bestWhen:
      "You need structure, plain-English interpretation, and a monthly review rhythm.",
    usuallyMisses:
      "Not a replacement for tax, legal, bookkeeping cleanup, or full CFO leadership.",
    chooseIf:
      "You have financial data but need recurring clarity before decisions.",
    ctaText: "Auto-fill my reports — $99/mo",
    ctaHref: "/pricing#auto-fill",
    anchorId: "row-mfd",
    position: 0.66,
    isMfd: true,
  },
  {
    id: "fractional-cfo",
    label: "Fractional CFO",
    shortLabel: "Fractional CFO",
    bestWhen: "You need deeper finance leadership, planning, forecasting, and strategy.",
    usuallyMisses: "Can be heavier or more expensive than some owners need right now.",
    chooseIf: "Your business has complexity that justifies CFO-level involvement.",
    ctaText: "Compare CFO Options",
    ctaHref: "#row-cfo",
    anchorId: "row-cfo",
    position: 0.84,
  },
  {
    id: "internal-team",
    label: "Internal Finance Team",
    shortLabel: "Internal Team",
    bestWhen: "You have the volume and complexity to justify dedicated finance staff.",
    usuallyMisses: "Higher fixed cost, slower to set up, requires management.",
    chooseIf: "Your business runs full-time finance work daily.",
    ctaText: "Read Pricing",
    ctaHref: "/pricing",
    anchorId: "row-internal",
    position: 0.97,
  },
];

export type ComparisonCard = {
  id: string;
  title: string;
  bestFor: string;
  coreInsight: string;
  ctaText: string;
  anchorId: string;
};

export const comparisonCards: ComparisonCard[] = [
  {
    id: "vs-bookkeeper",
    title: "GoldFin Desk vs Bookkeeper",
    bestFor: "Owners who have clean books but still feel unclear.",
    coreInsight:
      "A bookkeeper records what happened. The GoldFin Desk creates a recurring rhythm for understanding what it means.",
    ctaText: "Compare Bookkeeper",
    anchorId: "row-bookkeeper",
  },
  {
    id: "vs-cfo",
    title: "GoldFin Desk vs Fractional CFO",
    bestFor: "Owners who need more than bookkeeping but not full CFO support.",
    coreInsight:
      "A fractional CFO provides deeper strategic leadership. The GoldFin Desk is the lighter recurring clarity layer before that.",
    ctaText: "Compare Fractional CFO",
    anchorId: "row-cfo",
  },
  {
    id: "vs-quickbooks",
    title: "GoldFin Desk vs QuickBooks",
    bestFor: "Owners using accounting software but still deciding from instinct.",
    coreInsight:
      "QuickBooks shows financial records. The GoldFin Desk turns financial activity into plain-English briefings and monthly review.",
    ctaText: "Compare QuickBooks",
    anchorId: "row-accounting",
  },
  {
    id: "vs-dashboard",
    title: "GoldFin Desk vs Financial Dashboard",
    bestFor: "Owners with dashboards who still do not know what to do next.",
    coreInsight:
      "Dashboards show charts. The GoldFin Desk helps surface questions and decisions worth your attention.",
    ctaText: "Compare Dashboards",
    anchorId: "row-dashboard",
  },
  {
    id: "vs-diy",
    title: "GoldFin Desk vs DIY Spreadsheets",
    bestFor: "Owners tired of rebuilding or ignoring their own spreadsheets.",
    coreInsight:
      "Templates create manual structure. The GoldFin Desk adds automation, interpretation, and rhythm.",
    ctaText: "Compare Spreadsheets",
    anchorId: "row-diy",
  },
  {
    id: "vs-spend",
    title: "GoldFin Desk vs Ramp / Spend Tools",
    bestFor: "Owners who control expenses but still lack financial clarity.",
    coreInsight:
      "Spend tools manage cards and approvals. The GoldFin Desk helps explain the business picture around them.",
    ctaText: "Compare Spend Tools",
    anchorId: "row-spend",
  },
  {
    id: "three-way",
    title: "Bookkeeper vs Fractional CFO vs GoldFin Desk",
    bestFor: "Owners not sure what level of support they actually need.",
    coreInsight:
      "The right choice depends on whether your main gap is records, interpretation, or strategic leadership.",
    ctaText: "Compare All Three",
    anchorId: "/compare/bookkeeper-vs-fractional-cfo-vs-monthly-finance-desk",
  },
  {
    id: "data-vs-clarity",
    title: "Financial Data vs Financial Clarity",
    bestFor: "Owners who have numbers everywhere but still feel blind.",
    coreInsight:
      "Data shows what happened. Clarity helps you understand what deserves attention this month.",
    ctaText: "Learn the Difference",
    anchorId: "missing-middle",
  },
];

export type UseCase = {
  id: string;
  quote: string;
  recommendation: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA: { label: string; href: string };
};

export const useCases: UseCase[] = [
  {
    id: "bookkeeper-but-unclear",
    quote: "I have a bookkeeper, but I still feel like I’m guessing.",
    recommendation:
      "Bookkeeping keeps records clean, but does not interpret them. The GoldFin Desk adds a recurring layer of plain-English review on top of your existing bookkeeper.",
    primaryCTA: { label: "Generate Sample Briefing", href: "/sample-briefing" },
    secondaryCTA: { label: "Auto-fill my reports — $99/mo", href: "/pricing#auto-fill" },
  },
  {
    id: "cash-still-tight",
    quote: "Revenue is up, but cash still feels tight.",
    recommendation:
      "This is usually a clarity problem, not a math problem. A sample briefing makes cash movement, revenue trend, and expense pattern visible in one view.",
    primaryCTA: { label: "Generate Sample Briefing", href: "/sample-briefing" },
    secondaryCTA: { label: "Browse Free Templates", href: "/templates" },
  },
  {
    id: "hiring-decision",
    quote: "I am deciding whether to hire.",
    recommendation:
      "Pair the Hiring Affordability template with a GoldFin Desk briefing to see whether current cash flow can support another fixed payroll cost.",
    primaryCTA: { label: "Review Hiring Readiness", href: "/templates" },
    secondaryCTA: { label: "Auto-fill my reports — $99/mo", href: "/pricing#auto-fill" },
  },
  {
    id: "considering-cfo",
    quote: "I am considering a CFO, but I am not sure I am ready.",
    recommendation:
      "Many owner-led businesses get most of the value from a recurring clarity rhythm before they ever need full CFO leadership.",
    primaryCTA: { label: "Compare CFO Options", href: "#row-cfo" },
    secondaryCTA: { label: "Auto-fill my reports — $99/mo", href: "/pricing#auto-fill" },
  },
  {
    id: "structure-first",
    quote: "I just need structure first.",
    recommendation:
      "The Free Template Library gives you a manual starting structure for cash, expenses, hiring, and monthly review.",
    primaryCTA: { label: "Get Free Templates", href: "/templates" },
    secondaryCTA: { label: "Read Pricing", href: "/pricing" },
  },
  {
    id: "dashboards-no-decisions",
    quote: "I have dashboards but no decisions.",
    recommendation:
      "Dashboards visualize data. The GoldFin Desk turns that data into questions to review and decisions to consider every two weeks.",
    primaryCTA: { label: "Generate Sample Briefing", href: "/sample-briefing" },
    secondaryCTA: { label: "Auto-fill my reports — $99/mo", href: "/pricing#auto-fill" },
  },
];

/* ───────── Fit Finder ───────── */

export type FitChoice<Value extends string = string> = {
  value: Value;
  label: string;
};

export const fitSetup: FitChoice[] = [
  { value: "messy", label: "My books are messy or behind" },
  { value: "bk-unclear", label: "I have a bookkeeper but still feel unclear" },
  { value: "quickbooks", label: "I use QuickBooks or accounting software" },
  { value: "spreadsheets", label: "I track things in spreadsheets" },
  { value: "bank-balance", label: "I check the bank balance to make decisions" },
  { value: "dashboard-stuck", label: "I have dashboards but do not know what to do next" },
  { value: "considering-cfo", label: "I am considering a fractional CFO" },
  { value: "decision-help", label: "I need help deciding if I can hire, spend, or grow" },
];

export const fitProblem: FitChoice[] = [
  { value: "cleanup", label: "Clean up records" },
  { value: "cash-flow", label: "Understand cash flow" },
  { value: "hiring", label: "Know if I can hire" },
  { value: "expenses", label: "Control expenses" },
  { value: "profit", label: "Review revenue and profit" },
  { value: "interpretation", label: "Get plain-English interpretation" },
  { value: "rhythm", label: "Build a monthly review rhythm" },
  { value: "strategy", label: "Plan strategically with finance support" },
];

export const fitMaturity: FitChoice[] = [
  { value: "early", label: "Early-stage / under $10K/month" },
  { value: "growing", label: "Growing / $10K–$30K/month" },
  { value: "serious", label: "Serious owner-led / $30K–$75K/month" },
  { value: "established", label: "Established / $75K–$150K/month" },
  { value: "scaling", label: "Scaling / $150K–$250K/month" },
  { value: "complex", label: "More complex / $250K+/month" },
];

export type RecommendationKey =
  | "bookkeepingFirst"
  | "mfdFit"
  | "cfoCompare"
  | "templatesFirst";

export type Recommendation = {
  key: RecommendationKey;
  eyebrow: string;
  title: string;
  summary: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA: { label: string; href: string };
  mobileCTA: { label: string; href: string };
};

export const recommendations: Record<RecommendationKey, Recommendation> = {
  bookkeepingFirst: {
    key: "bookkeepingFirst",
    eyebrow: "Start here",
    title: "Bookkeeping cleanup first.",
    summary:
      "The GoldFin Desk works best on financial activity that is already organized. Start with bookkeeping cleanup through your current accountant or bookkeeper, then come back when records are caught up.",
    primaryCTA: { label: "Start With Free Templates", href: "/templates" },
    secondaryCTA: { label: "See how GoldFin Desk works", href: "/pricing" },
    mobileCTA: { label: "Get Free Templates", href: "/templates" },
  },
  mfdFit: {
    key: "mfdFit",
    eyebrow: "Likely fit",
    title: "The GoldFin Desk is likely the missing layer.",
    summary:
      "You already have financial data — bookkeeper, software, dashboards, or spreadsheets — but lack a recurring way to understand what it means. The GoldFin Desk adds structure, plain-English bi-weekly briefings, and a monthly strategy review.",
    primaryCTA: { label: "Generate Sample Finance Briefing", href: "/sample-briefing" },
    secondaryCTA: { label: "Auto-fill my reports — $99/mo", href: "/pricing#auto-fill" },
    mobileCTA: { label: "Generate Sample Briefing", href: "/sample-briefing" },
  },
  cfoCompare: {
    key: "cfoCompare",
    eyebrow: "Compare carefully",
    title: "Compare GoldFin Desk against a fractional CFO.",
    summary:
      "A fractional CFO provides deeper strategic leadership. The GoldFin Desk is the lighter recurring clarity layer many owners find sufficient before that step. Compare both before committing.",
    primaryCTA: { label: "Compare Fractional CFO", href: "#row-cfo" },
    secondaryCTA: { label: "Auto-fill my reports — $99/mo", href: "/pricing#auto-fill" },
    mobileCTA: { label: "Auto-fill my reports — $99/mo", href: "/pricing#auto-fill" },
  },
  templatesFirst: {
    key: "templatesFirst",
    eyebrow: "Start light",
    title: "Start with the Free Template Library.",
    summary:
      "At this stage, the most useful step is building a manual financial structure you can review on your own. The free templates cover cash flow, expenses, hiring, and monthly review.",
    primaryCTA: { label: "Get Free Templates", href: "/templates" },
    secondaryCTA: { label: "Read Pricing", href: "/pricing" },
    mobileCTA: { label: "Get Free Templates", href: "/templates" },
  },
};

export function recommend(
  setup: string | null,
  problem: string | null,
  maturity: string | null
): RecommendationKey {
  if (setup === "messy" || problem === "cleanup") return "bookkeepingFirst";
  if (
    setup === "considering-cfo" ||
    maturity === "complex" ||
    problem === "strategy"
  )
    return "cfoCompare";
  if (
    maturity === "early" ||
    (setup === "bank-balance" && (maturity === "growing" || maturity === null))
  )
    return "templatesFirst";
  return "mfdFit";
}

/* ───────── FAQ ───────── */

export const faq: { q: string; a: string }[] = [
  {
    q: "Do I still need a bookkeeper?",
    a: "Usually, yes. A bookkeeper keeps records clean. The GoldFin Desk adds structure, interpretation, briefings, and monthly review rhythm around the business.",
  },
  {
    q: "Is this a fractional CFO replacement?",
    a: "No. It is the missing layer before a full CFO: more than bookkeeping or dashboards, lighter than a full finance department.",
  },
  {
    q: "Why not just use QuickBooks?",
    a: "QuickBooks shows accounting records and reports. The GoldFin Desk helps turn financial activity into plain-English briefings and decisions to review.",
  },
  {
    q: "Why not just use a dashboard?",
    a: "Dashboards are useful if you already know what to look for. The GoldFin Desk helps surface what changed, what looks risky, and what deserves attention.",
  },
  {
    q: "Is this just spreadsheet templates?",
    a: "No. Templates are the starting structure. The premium desk adds automation, interpretation, and monthly review.",
  },
  {
    q: "What if my books are messy?",
    a: "You may need bookkeeping cleanup first. The GoldFin Desk works best when there is enough organized financial activity to review.",
  },
  {
    q: "Do I need to connect my bank account to compare or apply?",
    a: "No. You can preview and apply without connecting your bank. Connection happens only after onboarding.",
  },
  {
    q: "Who is this best for?",
    a: "Owner-led businesses with real monthly revenue, recurring expenses, cash-flow questions, and no full-time finance leader.",
  },
];

/* ───────── Page index (in-page anchors) ───────── */

export const pageIndex: { id: string; title: string; who: string; diff: string; href: string }[] = [
  {
    id: "idx-bookkeeper",
    title: "GoldFin Desk vs Bookkeeper",
    who: "Owners with clean books who still feel unclear.",
    diff: "Records vs recurring interpretation.",
    href: "#row-bookkeeper",
  },
  {
    id: "idx-cfo",
    title: "GoldFin Desk vs Fractional CFO",
    who: "Owners between bookkeeping and full finance leadership.",
    diff: "Recurring clarity rhythm vs strategic finance leadership.",
    href: "#row-cfo",
  },
  {
    id: "idx-quickbooks",
    title: "GoldFin Desk vs QuickBooks",
    who: "Owners using accounting software but still guessing.",
    diff: "Accounting records vs plain-English briefings.",
    href: "#row-accounting",
  },
  {
    id: "idx-dashboard",
    title: "GoldFin Desk vs Financial Dashboard",
    who: "Owners with charts but no decisions.",
    diff: "Visualization vs questions and decisions.",
    href: "#row-dashboard",
  },
  {
    id: "idx-diy",
    title: "GoldFin Desk vs DIY Spreadsheets",
    who: "Owners maintaining their own templates manually.",
    diff: "Manual structure vs automated structure plus review.",
    href: "#row-diy",
  },
  {
    id: "idx-spend",
    title: "GoldFin Desk vs Ramp / Spend Tools",
    who: "Owners controlling spend but missing the wider picture.",
    diff: "Spend operations vs whole-business interpretation.",
    href: "#row-spend",
  },
  {
    id: "idx-three",
    title: "Bookkeeper vs Fractional CFO vs GoldFin Desk",
    who: "Owners unsure what level of support they actually need.",
    diff: "Records vs recurring clarity vs strategic leadership.",
    href: "/compare/bookkeeper-vs-fractional-cfo-vs-monthly-finance-desk",
  },
  {
    id: "idx-data",
    title: "Financial Data vs Financial Clarity",
    who: "Owners with numbers everywhere but still feeling blind.",
    diff: "What happened vs what deserves attention.",
    href: "#missing-middle",
  },
];

/* ───────── Missing middle ───────── */

export const missingMiddle = {
  tooLight: {
    label: "Too light",
    items: ["Bank balance", "DIY spreadsheets", "Basic dashboard", "Once-a-year tax review"],
    problem: "Not enough interpretation or rhythm.",
  },
  mfd: {
    label: "GoldFin Desk",
    items: [
      "Structured spreadsheet system",
      "AI-assisted organization",
      "Bi-weekly plain-English briefing",
      "Monthly strategy review",
    ],
    outcome: "Recurring financial clarity.",
  },
  tooHeavy: {
    label: "Too heavy",
    items: ["Full CFO", "Internal finance team", "Complex FP&A tools", "High-touch advisory firm"],
    problem: "More than many owner-led businesses need right now.",
  },
};

/* ───────── Sample briefing proof ───────── */

export const sampleBriefingProof = {
  modules: [
    { title: "Cash Movement", note: "What changed in available cash." },
    { title: "Revenue Trend", note: "Direction and pace of revenue." },
    { title: "Expense Pattern", note: "Where spend is rising or shifting." },
    { title: "Questions to Review", note: "Specific things worth a second look." },
    { title: "Decisions to Consider", note: "Plain-English options for this month." },
  ],
  insight:
    "Revenue is growing, but contractor and software costs are rising faster than margin. Before hiring again, review whether current cash flow can support another fixed payroll cost.",
};
