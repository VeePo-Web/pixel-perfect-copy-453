/* ───────── Trust flow (hero) ───────── */

export type TrustFlowStep = {
  id: string;
  label: string;
  trust: string;
};

export const trustFlowSteps: TrustFlowStep[] = [
  { id: "preview", label: "Preview", trust: "Demo data" },
  { id: "apply", label: "Apply", trust: "No bank login" },
  { id: "fit", label: "Fit Review", trust: "Selective" },
  { id: "onboarding", label: "Onboarding", trust: "Clarity first" },
  { id: "plaid", label: "Plaid Connection", trust: "After onboarding" },
  { id: "rhythm", label: "Monthly Rhythm", trust: "Recurring clarity" },
];

/* ───────── Access sequence (Section 2) ───────── */

export type AccessStep = {
  n: number;
  title: string;
  body: string;
  trust: string;
};

export const accessSequence: AccessStep[] = [
  {
    n: 1,
    title: "Preview with demo data",
    body: "Use demo data or rough non-sensitive numbers to experience what a plain-English finance briefing feels like.",
    trust: "No bank connection.",
  },
  {
    n: 2,
    title: "Apply for fit",
    body: "Submit basic business context so we can understand whether the GoldFin Desk is likely to help.",
    trust: "No payment. No documents. No bank login.",
  },
  {
    n: 3,
    title: "Fit review",
    body: "Your business context is reviewed to determine whether the premium desk is the right level of support.",
    trust: "Selective process.",
  },
  {
    n: 4,
    title: "Onboarding",
    body: "If there is a fit, onboarding explains the process, expectations, and next steps before any financial connection is requested.",
    trust: "Clarity before access.",
  },
  {
    n: 5,
    title: "Connect after onboarding",
    body: "Bank data connection through Plaid may happen after onboarding so the system can work from actual financial activity.",
    trust: "After trust is built.",
  },
];

/* ───────── No-upfront cards (Section 3) ───────── */

export type NoUpfrontCard = { title: string; body: string };

export const noUpfrontCards: NoUpfrontCard[] = [
  {
    title: "No bank connection required",
    body: "The public preview and application do not require connecting your bank account.",
  },
  {
    title: "No payment required to apply",
    body: "Applying is not checkout. It is a fit review for the GoldFin Desk.",
  },
  {
    title: "No tax returns required upfront",
    body: "The first step is business context, not a document upload.",
  },
  {
    title: "No sensitive financial documents required for preview",
    body: "Use demo data or rough non-sensitive numbers to experience the briefing concept.",
  },
  {
    title: "No perfect financial language required",
    body: "Explain your situation in plain English. You do not need to sound like a finance expert.",
  },
  {
    title: "No commitment before fit is reviewed",
    body: "The application helps determine whether this is the right level of support for your business.",
  },
];

/* ───────── After-apply (Section 4) ───────── */

export const afterApplySteps: { n: number; title: string; body: string }[] = [
  {
    n: 1,
    title: "Application received",
    body: "You submit business context, current setup, and what you want to understand.",
  },
  {
    n: 2,
    title: "Fit review",
    body: "We review whether the GoldFin Desk is likely to be useful for your stage and needs.",
  },
  {
    n: 3,
    title: "Next steps",
    body: "If there is a potential fit, you receive next-step instructions.",
  },
  {
    n: 4,
    title: "Onboarding",
    body: "The onboarding process explains expectations, rhythm, and any required setup.",
  },
  {
    n: 5,
    title: "Monthly desk begins",
    body: "The system moves toward structured spreadsheets, bi-weekly briefings, and monthly strategy review.",
  },
];

/* ───────── Privacy principles (Section 6) ───────── */

export const privacyPrinciples: { title: string; body: string }[] = [
  {
    title: "Value before access",
    body: "You should be able to understand the experience before sharing sensitive financial access.",
  },
  {
    title: "Context before connection",
    body: "We start with your business situation, not your bank login.",
  },
  {
    title: "Clarity before commitment",
    body: "The process should make the next step obvious before you take it.",
  },
];

/* ───────── Featured FAQ preview (Section 7) ───────── */

export const featuredFAQ: { q: string; a: string }[] = [
  {
    q: "Do I need to connect my bank account?",
    a: "No. You can preview the experience and apply without connecting your bank account. Bank connection through Plaid only becomes relevant after onboarding.",
  },
  {
    q: "Do I need to pay to apply?",
    a: "No. The application is not checkout. It is a fit review for the GoldFin Desk.",
  },
  {
    q: "Do I need to upload financial documents?",
    a: "No financial documents are required to preview or submit the initial application. The first step is business context.",
  },
  {
    q: "Is this financial, tax, legal, or investment advice?",
    a: "No. GoldFin Desk does not replace tax, legal, accounting, bookkeeping cleanup, or investment advice.",
  },
];

/* ───────── FAQ hub (Section 8) ───────── */

export type FAQCategoryId =
  | "security-privacy"
  | "application"
  | "product"
  | "pricing"
  | "fit"
  | "bookkeeping-cfo"
  | "templates"
  | "process";

export const faqCategories: { id: FAQCategoryId; label: string }[] = [
  { id: "security-privacy", label: "Security & Privacy" },
  { id: "application", label: "Application" },
  { id: "product", label: "Product" },
  { id: "pricing", label: "Pricing" },
  { id: "fit", label: "Fit" },
  { id: "bookkeeping-cfo", label: "Bookkeeping / CFO" },
  { id: "templates", label: "Templates" },
  { id: "process", label: "Process" },
];

export type FAQItem = {
  id: string;
  category: FAQCategoryId;
  q: string;
  a: string;
};

export const faqItems: FAQItem[] = [
  // Security & Privacy
  {
    id: "faq-1",
    category: "security-privacy",
    q: "Do I need to connect my bank account to preview the product?",
    a: "No. The sample briefing preview can be used with demo data or rough non-sensitive numbers.",
  },
  {
    id: "faq-2",
    category: "security-privacy",
    q: "Do I need to connect my bank account to apply?",
    a: "No. Applying does not require bank connection. Bank connection becomes relevant only after onboarding.",
  },
  {
    id: "faq-3",
    category: "security-privacy",
    q: "When does Plaid connection happen?",
    a: "Plaid connection may happen after onboarding, once the process and next steps have been explained.",
  },
  {
    id: "faq-4",
    category: "security-privacy",
    q: "Can I use demo data?",
    a: "Yes. Demo data is available for previews so you can understand the experience without sharing sensitive numbers.",
  },
  {
    id: "faq-5",
    category: "security-privacy",
    q: "Do you store my bank login?",
    a: "The public preview and application do not ask for bank login. Any later bank-data connection follows the Plaid integration process used by the product.",
  },
  {
    id: "faq-6",
    category: "security-privacy",
    q: "Is my information secure?",
    a: "The product is designed to avoid asking for sensitive financial access before it is needed. Specific certifications or protocols are not claimed here.",
  },
  // Application
  {
    id: "faq-7",
    category: "application",
    q: "What happens after I apply?",
    a: "Your application is reviewed for fit. If there is a potential match, you receive next steps. No payment or bank connection is required to apply.",
  },
  {
    id: "faq-8",
    category: "application",
    q: "How long does the application take?",
    a: "The initial application is designed to take only a few minutes.",
  },
  {
    id: "faq-9",
    category: "application",
    q: "What information do I need to apply?",
    a: "Basic business context, current financial setup, approximate revenue range, and what you want to understand better about your numbers.",
  },
  {
    id: "faq-10",
    category: "application",
    q: "Can I apply if my books are messy?",
    a: "You can apply, but GoldFin Desk works best when your financial activity can be reviewed consistently. If books are far behind or unusable, bookkeeping cleanup may be the first step.",
  },
  {
    id: "faq-11",
    category: "application",
    q: "What if I am not a fit?",
    a: "You can still use the free templates or sample briefing experience as a starting point.",
  },
  // Product
  {
    id: "faq-12",
    category: "product",
    q: "What is GoldFin Desk?",
    a: "GoldFin Desk is a premium financial clarity system for owner-led businesses. It combines structured spreadsheets, bank-data connection after onboarding, AI-assisted organization, bi-weekly plain-English briefings, and a monthly strategy review.",
  },
  {
    id: "faq-13",
    category: "product",
    q: "What do I get every month?",
    a: "The core rhythm includes structured financial organization, bi-weekly written briefings, and a monthly one-hour strategy review.",
  },
  {
    id: "faq-14",
    category: "product",
    q: "What is a bi-weekly briefing?",
    a: "A plain-English written report that helps explain cash movement, revenue trends, expense patterns, questions to review, and decisions that may deserve attention.",
  },
  {
    id: "faq-15",
    category: "product",
    q: "Is this just a spreadsheet?",
    a: "No. Spreadsheets are the structure. The premium desk adds automation, interpretation, and monthly review rhythm.",
  },
  {
    id: "faq-16",
    category: "product",
    q: "Is AI the main product?",
    a: "No. AI assists with organization. The core value is financial clarity, plain-English interpretation, and recurring review.",
  },
  // Pricing
  {
    id: "faq-17",
    category: "pricing",
    q: "How much does GoldFin Desk cost?",
    a: "The core GoldFin Desk offer is $1,500/month.",
  },
  {
    id: "faq-18",
    category: "pricing",
    q: "Why does it cost $1,500/month?",
    a: "Because the offer is not just software or templates. It combines structure, automation, plain-English written briefings, and a monthly strategy review.",
  },
  {
    id: "faq-19",
    category: "pricing",
    q: "Do I need to pay to apply?",
    a: "No. Applying does not require payment.",
  },
  {
    id: "faq-20",
    category: "pricing",
    q: "What if I am not ready for $1,500/month?",
    a: "Start with the free templates or generate a sample briefing. The premium desk is best for owners ready for a recurring monthly finance rhythm.",
  },
  // Fit
  {
    id: "faq-21",
    category: "fit",
    q: "Who is this best for?",
    a: "Owner-led businesses with real monthly revenue, recurring expenses, cash-flow questions, and no full-time finance leader.",
  },
  {
    id: "faq-22",
    category: "fit",
    q: "What revenue stage is usually the best fit?",
    a: "The strongest fit is often businesses with enough monthly revenue and complexity to need financial rhythm, commonly around $30K–$250K/month. This is not a strict rule.",
  },
  {
    id: "faq-23",
    category: "fit",
    q: "Who is this not for?",
    a: "It is usually not the right fit for hobby businesses, pre-revenue ideas, owners only looking for the cheapest template, or companies that already have a full finance team.",
  },
  {
    id: "faq-24",
    category: "fit",
    q: "What industries does this work for?",
    a: "It can fit agencies, clinics, trades businesses, professional services, restaurants, e-commerce operators, local service companies, consultants, and other owner-led businesses with recurring financial complexity.",
  },
  // Bookkeeping / CFO
  {
    id: "faq-25",
    category: "bookkeeping-cfo",
    q: "Is this bookkeeping?",
    a: "No. Bookkeeping helps keep records clean. GoldFin Desk adds a recurring clarity layer around structure, briefings, and monthly review.",
  },
  {
    id: "faq-26",
    category: "bookkeeping-cfo",
    q: "Do I still need my bookkeeper?",
    a: "Usually, yes. GoldFin Desk does not replace bookkeeping responsibilities.",
  },
  {
    id: "faq-27",
    category: "bookkeeping-cfo",
    q: "Is this a fractional CFO replacement?",
    a: "No. It is the missing layer before a full CFO: more than bookkeeping or dashboards, lighter than a full finance department.",
  },
  {
    id: "faq-28",
    category: "bookkeeping-cfo",
    q: "When should I choose a fractional CFO instead?",
    a: "Choose a fractional CFO if you need advanced forecasting, fundraising support, board reporting, investor materials, or deeper strategic finance leadership.",
  },
  // Templates
  {
    id: "faq-29",
    category: "templates",
    q: "Are the templates free?",
    a: "Yes. Free templates are available as a starting point for organizing your financial view manually.",
  },
  {
    id: "faq-30",
    category: "templates",
    q: "What is the difference between templates and GoldFin Desk?",
    a: "Templates give manual structure. GoldFin Desk adds automation, plain-English briefings, and a monthly review rhythm.",
  },
  {
    id: "faq-31",
    category: "templates",
    q: "Do templates require bank connection?",
    a: "No.",
  },
  // Process
  {
    id: "faq-32",
    category: "process",
    q: "How does onboarding work?",
    a: "After fit is reviewed, onboarding explains the process, expectations, and any setup required before the monthly rhythm begins.",
  },
  {
    id: "faq-33",
    category: "process",
    q: "How often do I receive reports?",
    a: "The premium offer includes bi-weekly plain-English financial briefings.",
  },
  {
    id: "faq-34",
    category: "process",
    q: "How often do we meet?",
    a: "The premium offer includes a monthly one-hour strategy review.",
  },
  {
    id: "faq-35",
    category: "process",
    q: "What should I expect from the monthly call?",
    a: "The call is designed to review the financial picture, questions surfaced in the briefings, and decisions that may need attention.",
  },
  {
    id: "faq-36",
    category: "process",
    q: "Can I cancel?",
    a: "Cancellation and subscription terms are clarified in the client agreement before onboarding.",
  },
];

/* ───────── Product boundaries (Section 9) ───────── */

export const productBoundaries = {
  does: [
    "Creates structured financial organization",
    "Helps turn activity into recurring review",
    "Provides bi-weekly plain-English briefings",
    "Supports a monthly strategy review rhythm",
    "Helps surface questions and decisions",
    "Helps owners see financial movement more clearly",
  ],
  doesNot: [
    "Does not replace bookkeeping cleanup",
    "Does not replace a CPA",
    "Does not provide tax advice",
    "Does not provide legal advice",
    "Does not provide investment advice",
    "Does not act as a full CFO replacement",
    "Does not guarantee outcomes or savings",
  ],
};

/* ───────── Sample briefing preview (Section 10) ───────── */

export const sampleBriefingPreview = {
  rows: [
    { label: "Cash Movement", value: "Steady inflow, larger outflows mid-month." },
    { label: "Revenue Trend", value: "Up 11% vs prior 90-day average." },
    { label: "Expense Pattern", value: "Software and contractor spend climbing." },
    { label: "Questions to Review", value: "Is the new hire fully ramped?" },
    { label: "Decisions to Consider", value: "Hold off on second hire one cycle." },
  ],
  insight:
    "Revenue is growing, but expenses are rising faster than margin. Before hiring again, review whether current cash flow can support another fixed payroll cost.",
};

/* ───────── Top-nav anchors ───────── */

export const topNavSections = [
  { id: "trust-flow", label: "Trust Flow" },
  { id: "sequence", label: "Sequence" },
  { id: "plaid", label: "Plaid" },
  { id: "faq", label: "FAQ" },
  { id: "boundaries", label: "Boundaries" },
  { id: "apply", label: "Apply" },
];
