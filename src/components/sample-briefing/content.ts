export type ExpenseSlice = { label: string; pct: number; amount: number };

export type DemoBusiness = {
  id: string;
  label: string;
  reportTitle: string;
  period: string;
  prefillPrompt: string;
  cash: number;
  cashDelta: number; // percent
  revenue: number;
  revenueDelta: number;
  expenses: number;
  expensesDelta: number;
  mainRisk: string;
  executiveSummary: string;
  summaryTags: string[];
  cashSeries: number[];
  revenueSeries: number[];
  topClientConcentration: number; // 0..1 share of top 3
  expenseMix: ExpenseSlice[];
  unusualSpend: { title: string; tag: "Review" | "Recurring" | "Timing" | "Ask on call" }[];
  questions: string[];
  decisions: string[];
  monthlyFocus: string[];
  insights: {
    cash: string;
    revenue: string;
    expenses: string;
  };
};

export const demoBusinesses: DemoBusiness[] = [
  {
    id: "agency",
    label: "Agency",
    reportTitle: "Acme Marketing Agency",
    period: "May 15 – May 28, 2024",
    prefillPrompt:
      "I run a 12-person agency doing about $90K/month. Revenue is growing, but cash still feels tight and contractor costs keep changing.",
    cash: 24830,
    cashDelta: 12,
    revenue: 84250,
    revenueDelta: 8,
    expenses: 65430,
    expensesDelta: 15,
    mainRisk: "Contractor and software costs rising faster than margin.",
    executiveSummary:
      "Revenue is trending upward, but cash pressure remains because contractor costs, software subscriptions, and timing of vendor payments are increasing faster than margin. Before adding another fixed payroll expense, review whether current cash flow can support the hire without weakening reserves.",
    summaryTags: ["Revenue up", "Margin pressure", "Hiring decision", "Cash reserve review"],
    cashSeries: [18.2, 19.1, 19.8, 20.4, 21.3, 22.1, 22.6, 23.4, 24.0, 24.8],
    revenueSeries: [62, 66, 70, 71, 74, 76, 78, 80, 82, 84.25],
    topClientConcentration: 0.62,
    expenseMix: [
      { label: "Payroll", pct: 38, amount: 24800 },
      { label: "Software", pct: 18, amount: 11760 },
      { label: "Marketing", pct: 16, amount: 10240 },
      { label: "Operations", pct: 14, amount: 9030 },
      { label: "Other", pct: 14, amount: 9600 },
    ],
    unusualSpend: [
      { title: "Software subscription increased 22%", tag: "Recurring" },
      { title: "Contractor payments clustered in final week", tag: "Timing" },
      { title: "Marketing spend rose without matching cash improvement", tag: "Review" },
      { title: "New recurring tool detected", tag: "Ask on call" },
    ],
    questions: [
      "Why did ad spend increase without a matching cash improvement?",
      "Can the business support another fixed payroll cost?",
      "Are contractor costs reducing margin on recent revenue growth?",
      "Should software subscriptions be consolidated?",
      "Is the current cash reserve enough before the next growth move?",
    ],
    decisions: [
      "Delay hiring until cash flow stability is reviewed.",
      "Review contractor costs before accepting lower-margin work.",
      "Set a software subscription cleanup target this month.",
      "Increase cash reserve target before expanding spend.",
      "Use the monthly strategy call to pressure-test hiring readiness.",
    ],
    monthlyFocus: [
      "Cash movement and reserve target",
      "Revenue quality and concentration",
      "Expense pressure and recurring commitments",
      "Hiring readiness",
      "Decisions for the next 30 days",
    ],
    insights: {
      cash: "Cash increased this period, but most of the gain came from delayed vendor payments rather than stronger operating margin. The business should not treat the full cash increase as available growth capital.",
      revenue:
        "Revenue is growing week over week, but growth is concentrated in a small number of accounts. Review whether the trend is durable before making permanent expense commitments.",
      expenses:
        "Expenses are rising faster than revenue. Contractor costs and software subscriptions should be reviewed before adding another recurring commitment.",
    },
  },
  {
    id: "clinic",
    label: "Clinic",
    reportTitle: "Bayside Family Clinic",
    period: "May 15 – May 28, 2024",
    prefillPrompt:
      "I own a clinic with 8 employees. Payroll is the biggest expense, and I want to know if we can afford another hire.",
    cash: 41200,
    cashDelta: 4,
    revenue: 71800,
    revenueDelta: 3,
    expenses: 58900,
    expensesDelta: 9,
    mainRisk: "Payroll growing faster than patient revenue.",
    executiveSummary:
      "Patient revenue is stable but flat, while payroll has crept up with overtime and a part-time addition. Reserves remain healthy, but a new full-time hire would require visible revenue lift before it pays for itself.",
    summaryTags: ["Stable revenue", "Payroll creep", "Hiring decision", "Reserve healthy"],
    cashSeries: [38.4, 39.1, 39.6, 39.9, 40.2, 40.4, 40.6, 40.8, 41.0, 41.2],
    revenueSeries: [69, 70, 70.5, 70.8, 71, 71.2, 71.4, 71.5, 71.7, 71.8],
    topClientConcentration: 0.34,
    expenseMix: [
      { label: "Payroll", pct: 54, amount: 31800 },
      { label: "Supplies", pct: 14, amount: 8240 },
      { label: "Rent", pct: 12, amount: 7070 },
      { label: "Software", pct: 9, amount: 5300 },
      { label: "Other", pct: 11, amount: 6490 },
    ],
    unusualSpend: [
      { title: "Overtime hours up 18% vs prior period", tag: "Review" },
      { title: "Supplies order placed twice in same week", tag: "Timing" },
      { title: "New EMR add-on auto-renewed", tag: "Recurring" },
      { title: "Cleaning vendor rate increased", tag: "Ask on call" },
    ],
    questions: [
      "Is overtime cheaper than another hire at current volume?",
      "Which appointment types are driving the most margin?",
      "Are supply orders being consolidated efficiently?",
      "Is the EMR stack still right-sized?",
      "What revenue threshold justifies a new full-time clinician?",
    ],
    decisions: [
      "Track overtime weekly before approving a new role.",
      "Audit supply ordering cadence.",
      "Review EMR add-ons for redundancy.",
      "Define the revenue trigger for a hire.",
      "Bring hiring math to the monthly review.",
    ],
    monthlyFocus: [
      "Patient revenue and visit mix",
      "Payroll and overtime trend",
      "Hiring threshold math",
      "Supply and software cost review",
      "Reserve target check",
    ],
    insights: {
      cash: "Cash is steady, which is a good signal — but the trend is flat, not building. Reserves alone do not justify a permanent payroll increase.",
      revenue:
        "Revenue is consistent across visit types. Growth would likely require either more clinician hours or a different appointment mix, not a marketing push.",
      expenses:
        "Payroll is the single largest cost and creeping upward through overtime. Decide whether to convert overtime into a hire or trim it back to protect margin.",
    },
  },
  {
    id: "trades",
    label: "Trades Business",
    reportTitle: "Northgate Electrical",
    period: "May 15 – May 28, 2024",
    prefillPrompt:
      "I run a trades business with seasonal revenue. I want to understand cash flow before slower months.",
    cash: 58400,
    cashDelta: 22,
    revenue: 96300,
    revenueDelta: 18,
    expenses: 71200,
    expensesDelta: 11,
    mainRisk: "Strong season masking a weak shoulder period ahead.",
    executiveSummary:
      "The peak season is producing strong cash and revenue, but the upcoming shoulder months typically drop 30–40%. Protecting reserves now is more valuable than expanding fixed costs while the season looks easy.",
    summaryTags: ["Peak season", "Reserve buildup", "Shoulder risk", "Hold fixed costs"],
    cashSeries: [44, 46, 48, 50, 52, 53, 54.5, 56, 57.2, 58.4],
    revenueSeries: [78, 82, 85, 87, 89, 91, 93, 94, 95, 96.3],
    topClientConcentration: 0.41,
    expenseMix: [
      { label: "Labor", pct: 42, amount: 29900 },
      { label: "Materials", pct: 28, amount: 19940 },
      { label: "Vehicles", pct: 12, amount: 8540 },
      { label: "Insurance", pct: 9, amount: 6410 },
      { label: "Other", pct: 9, amount: 6410 },
    ],
    unusualSpend: [
      { title: "Material order spiked before vendor price change", tag: "Timing" },
      { title: "Fuel costs up 14%", tag: "Review" },
      { title: "Tool subscription auto-renewed", tag: "Recurring" },
      { title: "Subcontractor rate increase request", tag: "Ask on call" },
    ],
    questions: [
      "How many weeks of reserve do we need for the shoulder season?",
      "Which jobs produced the strongest margin this period?",
      "Can material pre-buys be financed without straining cash?",
      "Are subcontractor terms still aligned with our margin?",
      "What is the latest acceptable point to slow hiring?",
    ],
    decisions: [
      "Set a reserve floor before any new equipment purchase.",
      "Lock in subcontractor terms before next quarter.",
      "Pre-stage materials only for confirmed bookings.",
      "Review job-type margin in the monthly call.",
      "Hold off on permanent hires until shoulder season is modeled.",
    ],
    monthlyFocus: [
      "Reserve floor for shoulder season",
      "Job-type margin review",
      "Material pre-buy strategy",
      "Subcontractor terms",
      "Hiring plan for off-peak",
    ],
    insights: {
      cash: "Cash looks strong, but seasonality means a portion of this balance is already committed to the slower months. Treat reserves as protection, not surplus.",
      revenue:
        "Revenue is peaking on schedule. The signal to watch is which job types produced the margin, not the top-line number.",
      expenses:
        "Materials and fuel are climbing. A small pre-buy is reasonable; expanding vehicles or headcount during a peak is usually premature.",
    },
  },
  {
    id: "restaurant",
    label: "Restaurant",
    reportTitle: "Olive & Oak Kitchen",
    period: "May 15 – May 28, 2024",
    prefillPrompt:
      "I operate a restaurant. Sales are decent, but food costs, payroll, and cash timing make it hard to know what is actually profitable.",
    cash: 13600,
    cashDelta: -6,
    revenue: 102400,
    revenueDelta: 5,
    expenses: 94100,
    expensesDelta: 9,
    mainRisk: "Food and labor cost rising while average ticket is flat.",
    executiveSummary:
      "Sales are slightly up, but food cost and labor are absorbing the gain. Cash dipped because vendor terms shortened. The most useful next move is a tight food-cost review, not a marketing push.",
    summaryTags: ["Margin compression", "Cash tight", "Food cost review", "Labor scheduling"],
    cashSeries: [16, 15.6, 15.2, 14.9, 14.7, 14.4, 14.1, 13.9, 13.7, 13.6],
    revenueSeries: [94, 96, 97, 98, 99, 100, 101, 101.5, 102, 102.4],
    topClientConcentration: 0.18,
    expenseMix: [
      { label: "Food cost", pct: 34, amount: 31990 },
      { label: "Labor", pct: 32, amount: 30110 },
      { label: "Rent", pct: 12, amount: 11290 },
      { label: "Utilities", pct: 8, amount: 7530 },
      { label: "Other", pct: 14, amount: 13180 },
    ],
    unusualSpend: [
      { title: "Produce vendor pricing rose 9%", tag: "Review" },
      { title: "Overtime concentrated on weekend shifts", tag: "Timing" },
      { title: "New POS module auto-billed", tag: "Recurring" },
      { title: "Repair invoice above prior baseline", tag: "Ask on call" },
    ],
    questions: [
      "Which menu items are now below target margin?",
      "Can weekend schedules be re-balanced without losing service quality?",
      "Are vendor terms still 30 days, or did they shorten?",
      "Is the POS stack adding cost without adding revenue?",
      "What reserve level keeps payroll safe in a slow week?",
    ],
    decisions: [
      "Re-price or re-spec 3 lowest-margin menu items.",
      "Trim 4–6 hours from weekend over-staffing.",
      "Renegotiate vendor terms back to 30 days.",
      "Cancel or downgrade unused POS modules.",
      "Set a non-negotiable cash floor before any discretionary spend.",
    ],
    monthlyFocus: [
      "Menu margin by item",
      "Labor scheduling adjustments",
      "Vendor terms",
      "POS and software audit",
      "Cash floor and reserve target",
    ],
    insights: {
      cash: "Cash slipped this period — small in dollars, meaningful in pattern. The driver is timing of vendor payments, not a revenue miss.",
      revenue:
        "Top-line sales are climbing slowly, but the margin per ticket is flat. Growth in covers will not fix margin compression.",
      expenses:
        "Food cost and labor together are 66% of revenue. Both are addressable, but require menu and scheduling decisions, not big-picture cuts.",
    },
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    reportTitle: "Northbound Goods Co.",
    period: "May 15 – May 28, 2024",
    prefillPrompt:
      "I run an e-commerce business. Revenue moves up and down, ad spend is high, and I want to understand whether growth is actually producing cash.",
    cash: 31400,
    cashDelta: 9,
    revenue: 128700,
    revenueDelta: 16,
    expenses: 110200,
    expensesDelta: 21,
    mainRisk: "Ad spend scaling faster than contribution margin.",
    executiveSummary:
      "Revenue grew, but ad spend grew faster, and inventory commitments lengthened the cash conversion cycle. Cash is up only because of a timing favor from a supplier. Scale is real; cash health is not yet.",
    summaryTags: ["Revenue up", "Ad spend pressure", "Cash conversion", "Inventory commitment"],
    cashSeries: [27, 28, 28.6, 29.1, 29.7, 30.2, 30.6, 30.9, 31.2, 31.4],
    revenueSeries: [98, 104, 110, 115, 118, 121, 124, 126, 127, 128.7],
    topClientConcentration: 0.22,
    expenseMix: [
      { label: "COGS", pct: 41, amount: 45180 },
      { label: "Ads", pct: 24, amount: 26450 },
      { label: "Fulfillment", pct: 14, amount: 15430 },
      { label: "Platform", pct: 9, amount: 9920 },
      { label: "Other", pct: 12, amount: 13220 },
    ],
    unusualSpend: [
      { title: "Meta ad spend up 31% with flat ROAS", tag: "Review" },
      { title: "Inventory PO placed before peak demand confirmed", tag: "Timing" },
      { title: "Subscription apps added on Shopify", tag: "Recurring" },
      { title: "3PL rate change pending", tag: "Ask on call" },
    ],
    questions: [
      "Is ROAS holding when measured against contribution margin, not revenue?",
      "How much cash is tied up in inventory right now?",
      "Should the next ad scale step be paused?",
      "Are app subscriptions being audited quarterly?",
      "What is the safe cash conversion cycle target?",
    ],
    decisions: [
      "Cap ad spend at current level until ROAS stabilizes.",
      "Pause the next inventory PO for one cycle.",
      "Audit Shopify app stack this month.",
      "Define a target cash conversion cycle.",
      "Bring contribution margin to the monthly call.",
    ],
    monthlyFocus: [
      "Contribution margin by channel",
      "Inventory commitment",
      "Ad efficiency",
      "App and platform audit",
      "Cash conversion cycle",
    ],
    insights: {
      cash: "Cash is up, but only because a supplier extended terms this cycle. Strip out that timing favor and operating cash is roughly flat.",
      revenue:
        "Revenue growth is real, but it is being purchased with ad spend at near break-even contribution margin. That is not durable growth.",
      expenses:
        "Ads and COGS together are most of the spend. The leverage point is contribution margin per order, not gross sales.",
    },
  },
  {
    id: "services",
    label: "Professional Services",
    reportTitle: "Hartwell Advisors",
    period: "May 15 – May 28, 2024",
    prefillPrompt:
      "I run a professional services firm. Revenue is consistent, but I want to understand whether expenses and owner draws are making the business less profitable than it looks.",
    cash: 67200,
    cashDelta: 3,
    revenue: 88500,
    revenueDelta: 2,
    expenses: 61300,
    expensesDelta: 7,
    mainRisk: "Owner draws and software costs quietly eroding margin.",
    executiveSummary:
      "Revenue is steady and predictable. What is moving is owner-discretionary spend and software costs, both up modestly but consistently. Profitability looks fine on the surface; the structural margin has thinned.",
    summaryTags: ["Steady revenue", "Owner draw review", "Software creep", "Margin watch"],
    cashSeries: [63, 63.8, 64.3, 64.9, 65.4, 65.8, 66.2, 66.6, 66.9, 67.2],
    revenueSeries: [85, 85.5, 86, 86.5, 87, 87.4, 87.7, 88, 88.3, 88.5],
    topClientConcentration: 0.48,
    expenseMix: [
      { label: "Payroll", pct: 44, amount: 26970 },
      { label: "Owner draws", pct: 18, amount: 11030 },
      { label: "Software", pct: 14, amount: 8580 },
      { label: "Rent", pct: 10, amount: 6130 },
      { label: "Other", pct: 14, amount: 8590 },
    ],
    unusualSpend: [
      { title: "Owner discretionary spend up 12%", tag: "Review" },
      { title: "Three overlapping research tools active", tag: "Recurring" },
      { title: "Travel costs concentrated in one week", tag: "Timing" },
      { title: "Retainer client renewal pending", tag: "Ask on call" },
    ],
    questions: [
      "Are owner draws aligned with sustainable profit?",
      "Which software tools are duplicates?",
      "How concentrated is revenue across the top three retainers?",
      "Is the firm pricing for current cost levels?",
      "What is the right profit target before bonuses?",
    ],
    decisions: [
      "Set a draw policy tied to monthly profit, not cash.",
      "Cancel overlapping software tools.",
      "Re-price the next two engagements.",
      "Plan retainer renewals 60 days ahead.",
      "Review concentration risk in the monthly call.",
    ],
    monthlyFocus: [
      "Owner draw policy",
      "Software stack audit",
      "Retainer concentration",
      "Pricing review",
      "Profit target",
    ],
    insights: {
      cash: "Cash is building slowly and steadily — a healthy signal. The question is whether the build rate matches what the owner wants to draw.",
      revenue:
        "Revenue is consistent, but heavily weighted to a few retainers. Predictability is a strength; concentration is a risk to plan around.",
      expenses:
        "Software and owner-discretionary spend are the moving line items. Neither is alarming alone, but together they reduce the margin cushion.",
    },
  },
];

export const loaderLines = [
  "Reading sample revenue movement…",
  "Reviewing expense patterns…",
  "Checking cash pressure…",
  "Preparing plain-English briefing…",
];

export const reportSections = [
  { id: "executive-summary", label: "Executive Summary" },
  { id: "cash-movement", label: "Cash Movement" },
  { id: "revenue-trend", label: "Revenue Trend" },
  { id: "expense-pattern", label: "Expense Pattern" },
  { id: "unusual-spend", label: "Unusual Spend" },
  { id: "questions", label: "Questions to Review" },
  { id: "decisions", label: "Decisions to Consider" },
  { id: "monthly-focus", label: "Monthly Strategy Focus" },
];

export const whatThisIsNot = [
  {
    title: "Not a dashboard",
    body: "Dashboards show charts. They do not automatically explain which decision deserves attention.",
  },
  {
    title: "Not bookkeeping",
    body: "Bookkeeping records what happened. The Monthly Finance Desk helps turn financial activity into a review rhythm.",
  },
  {
    title: "Not a spreadsheet template",
    body: "Templates give structure. The premium desk adds automation, interpretation, and monthly review.",
  },
  {
    title: "Not a full CFO replacement",
    body: "This is the missing layer before a full CFO: more than bookkeeping, lighter than a finance department.",
  },
];

export const privacyCards = [
  "No bank connection required for this sample.",
  "Use demo data or rough non-sensitive numbers.",
  "Application requires no payment or bank login.",
  "Plaid connection happens only after onboarding.",
  "The preview is designed to show the experience before commitment.",
];

export const rawDataItems = [
  "Bank statements",
  "QuickBooks reports",
  "Spreadsheets",
  "Credit card transactions",
  "Payroll exports",
  "CPA notes",
  "Memory and instinct",
];

export const clarityItems = [
  "Organized spreadsheet structure",
  "Bi-weekly plain-English briefing",
  "Questions to review",
  "Decisions to consider",
  "Monthly strategy rhythm",
];

export const templateBridgeItems = [
  { title: "Cash Flow Forecast Template", body: "Plan cash 8–13 weeks ahead." },
  { title: "Monthly Financial Review Template", body: "A repeatable monthly review agenda." },
  { title: "Expense Audit Template", body: "Find recurring costs worth trimming." },
  { title: "Hiring Affordability Calculator", body: "Pressure-test the next hire." },
];

export type TabKey = "cash" | "revenue" | "expenses" | "risk" | "questions" | "decisions";

export function buildTabContent(b: DemoBusiness): Record<TabKey, {
  metric: string;
  interpretation: string;
  why: string;
  callQuestion: string;
}> {
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  return {
    cash: {
      metric: `Cash balance ${b.cashDelta >= 0 ? "increased" : "decreased"} ${Math.abs(b.cashDelta)}% to ${fmt(b.cash)}`,
      interpretation: b.insights.cash,
      why: "Owners can mistake timing relief for true financial strength.",
      callQuestion: "How much cash should remain untouched before hiring or increasing marketing spend?",
    },
    revenue: {
      metric: `Revenue ${b.revenueDelta >= 0 ? "up" : "down"} ${Math.abs(b.revenueDelta)}% to ${fmt(b.revenue)}`,
      interpretation: b.insights.revenue,
      why: "Top-line growth without margin or concentration context can drive the wrong next move.",
      callQuestion: "Is this growth durable enough to commit to a new fixed cost?",
    },
    expenses: {
      metric: `Expenses ${b.expensesDelta >= 0 ? "up" : "down"} ${Math.abs(b.expensesDelta)}% to ${fmt(b.expenses)}`,
      interpretation: b.insights.expenses,
      why: "Quiet recurring increases reduce flexibility before they show up as a problem.",
      callQuestion: "Which recurring commitments should be reviewed before the next quarter?",
    },
    risk: {
      metric: b.mainRisk,
      interpretation:
        "The main risk this period is not catastrophic — it is the kind of pattern that compounds if left unreviewed.",
      why: "Most business pain comes from drift, not events. Catching drift early is the point of the rhythm.",
      callQuestion: "What single decision this month would most reduce this risk?",
    },
    questions: {
      metric: `${b.questions.length} questions surfaced this period`,
      interpretation:
        "The briefing surfaces the questions an owner should ask before the next decision, not just the numbers behind them.",
      why: "Better questions produce better decisions. The briefing is designed to put the right ones in front of you.",
      callQuestion: "Which of these questions deserves the most time on the monthly call?",
    },
    decisions: {
      metric: `${b.decisions.length} decisions to consider`,
      interpretation:
        "Each suggested decision is paired with the reasoning behind it. None are mandatory; all are reviewable.",
      why: "Action without context creates regret. Context without action creates stagnation. The desk is built for both.",
      callQuestion: "Which decision is the highest-leverage move for the next 30 days?",
    },
  };
}
