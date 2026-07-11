export const BLOG_HOST = "https://goldfindesk.com";
export const BLOG_BYLINE = "GoldFin Editorial";
export const BLOG_PUBLISHED = "2026-07-10";
export const BLOG_UPDATED = "2026-07-10";

export type BlogBlock =
  | { type: "p"; html: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; caption?: string; columns: string[]; rows: string[][] }
  | { type: "callout"; title: string; html: string }
  | { type: "cta"; label: string; href: string; text: string };

export type BlogSection = {
  heading: string;
  blocks: BlogBlock[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogPost = {
  id: string;
  hubSlug: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  primaryQuery: string;
  readTime: string;
  intent: string;
  leadMagnet: string;
  moneyTarget: string;
  answer: string;
  proof: string;
  cta: { label: string; href: string; text: string };
  sections: BlogSection[];
  faqs: BlogFaq[];
};

export type BlogHub = {
  slug: string;
  title: string;
  description: string;
  primaryQuery: string;
  promise: string;
  leadMagnet: string;
};

export const blogHub: BlogHub = {
  slug: "monthly-financial-reporting",
  title: "Monthly Financial Clarity and Reporting",
  description:
    "Plain-English monthly financial reporting guides for owner-led businesses that want clearer numbers, better questions, and a repeatable review rhythm.",
  primaryQuery: "monthly financial reporting for small business",
  promise:
    "Help owner-led businesses understand what changed, why it matters, and what to review next without turning finance into accounting school.",
  leadMagnet: "Owner's Monthly Money Review Kit",
};

const sharedDisclaimer =
  "GoldFin content is educational and uses simplified examples. It is not tax, legal, accounting, payroll, or investment advice.";

export const blogPosts: BlogPost[] = [
  {
    id: "H1-01",
    hubSlug: blogHub.slug,
    slug: "what-small-business-monthly-financial-report-should-include",
    title: "What Should a Small-Business Monthly Financial Report Include?",
    shortTitle: "Monthly report contents",
    description:
      "A plain-English guide to the monthly financial report sections an owner-led business should review: cash, revenue, expenses, profit, obligations, and decisions.",
    primaryQuery: "what should a small business monthly financial report include",
    readTime: "8 min read",
    intent: "Informational awareness",
    leadMagnet: "Monthly Money Review Kit",
    moneyTarget: "/sample-briefing",
    answer:
      "A useful small-business monthly financial report should show what changed in cash, revenue, expenses, profit, obligations, and owner decisions. The best version does not only list numbers. It explains what moved, why it may matter, what looks unusual, and which questions the owner should review before spending, hiring, or changing prices.",
    proof:
      "Original proof element: an owner-focused monthly report map with the question each section should answer.",
    cta: {
      label: "See a sample monthly briefing",
      href: "/sample-briefing",
      text:
        "Want to see the same structure in action? Review the GoldFin sample briefing before building your own report.",
    },
    sections: [
      {
        heading: "The owner version of a monthly financial report",
        blocks: [
          {
            type: "p",
            html:
              "A tax-ready report and an owner-ready report are not the same thing. Tax and accounting reports are built for records, compliance, and professional review. An owner-ready monthly report is built for decisions: can we spend, hire, wait, raise prices, slow expenses, or keep going as planned?",
          },
          {
            type: "p",
            html:
              "That is why the report should start with plain-English movement before it gets into detail. A business owner should be able to scan the first page and understand the month without needing to decode accounting labels.",
          },
          {
            type: "callout",
            title: "No invented benchmark",
            html:
              "This guide does not claim a universal profit margin, reserve target, or expense ratio. Those depend on business model, timing, owner pay, debt, taxes, and growth stage.",
          },
        ],
      },
      {
        heading: "The six sections every owner should review",
        blocks: [
          {
            type: "table",
            caption: "Monthly financial report map",
            columns: ["Section", "Owner question", "What to include"],
            rows: [
              [
                "Cash movement",
                "Did cash go up or down, and why?",
                "Starting cash, ending cash, major inflows, major outflows, and upcoming obligations.",
              ],
              [
                "Revenue",
                "What actually drove sales this month?",
                "Revenue by product, service, channel, customer type, or another useful owner view.",
              ],
              [
                "Expenses",
                "Which costs changed enough to review?",
                "Recurring costs, one-time costs, contractor spend, software, payroll, and unusual charges.",
              ],
              [
                "Profitability",
                "Did the business keep enough of what it earned?",
                "Gross margin, net profit, and plain-English notes about what changed.",
              ],
              [
                "Obligations",
                "What cash is already spoken for?",
                "Bills, payroll, debt payments, tax reserves, subscriptions, deposits, and near-term commitments.",
              ],
              [
                "Questions and decisions",
                "What should the owner decide next?",
                "A short list of questions, risks, and actions that should be reviewed before the next month.",
              ],
            ],
          },
          {
            type: "p",
            html:
              "The order matters. If an owner starts with profit but ignores obligations, the business can look healthier than it feels. If the owner starts with the bank balance but ignores unpaid bills, the business can feel safer than it is.",
          },
        ],
      },
      {
        heading: "A fictional example",
        blocks: [
          {
            type: "p",
            html:
              "Fictional example: Brightline Studio ends May with $42,000 in the bank, up from $37,000. A raw bank-balance view says cash improved by $5,000. The monthly report adds the missing context: $18,000 of client deposits arrived early, $9,500 of contractor invoices are due next week, and two software renewals hit in June.",
          },
          {
            type: "table",
            columns: ["View", "What the owner sees", "Decision risk"],
            rows: [
              [
                "Bank balance only",
                "$42,000 available",
                "Owner may spend as if the full balance is flexible.",
              ],
              [
                "Monthly report",
                "$42,000 cash, minus near-term obligations and early deposits",
                "Owner sees the amount that is actually safer to use.",
              ],
            ],
          },
          {
            type: "p",
            html:
              "The numbers are simple on purpose. The value is not complexity. The value is seeing the timing and obligations beside the headline balance.",
          },
        ],
      },
      {
        heading: "What does not belong in the first page",
        blocks: [
          {
            type: "ul",
            items: [
              "Every transaction from the month.",
              "A wall of accounting categories with no owner explanation.",
              "Charts that look polished but do not answer a decision question.",
              "Generic advice copied from a finance textbook.",
              "Unsupported claims about what every business should spend or save.",
            ],
          },
          {
            type: "p",
            html:
              "Detail still matters, but it belongs after the summary. The first page should help the owner decide where to look, not force them to inspect every row.",
          },
          {
            type: "cta",
            label: "See the briefing format",
            href: "/sample-briefing",
            text:
              "GoldFin's sample briefing shows how monthly numbers can become an owner-ready explanation instead of a raw export.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Should a monthly financial report include every transaction?",
        answer:
          "Not on the first page. Every transaction can live in the backup detail, but the owner view should summarize movement, exceptions, obligations, and decisions.",
      },
      {
        question: "Is a monthly financial report the same as bookkeeping?",
        answer:
          "No. Bookkeeping keeps records clean. A monthly financial report turns those records into a clearer owner review.",
      },
      {
        question: "Can I build this without accounting software?",
        answer:
          "Yes, for a simplified owner review. Use a spreadsheet, label the assumptions, and avoid treating it as a replacement for professional accounting records.",
      },
    ],
  },
  {
    id: "H1-03",
    hubSlug: blogHub.slug,
    slug: "monthly-financial-review-checklist",
    title: "Monthly Financial Review Checklist: A 30-Minute Owner Routine",
    shortTitle: "30-minute review checklist",
    description:
      "A 30-minute monthly financial review checklist for business owners who want to understand cash, revenue, expenses, obligations, and decisions without overbuilding the process.",
    primaryQuery: "monthly financial review checklist",
    readTime: "7 min read",
    intent: "Informational awareness",
    leadMagnet: "Monthly Money Review Kit",
    moneyTarget: "/templates",
    answer:
      "A monthly financial review should take an owner from cash to decisions in about 30 minutes: check cash movement, compare revenue and expenses, review upcoming obligations, identify unusual changes, and write down the next three questions. The goal is not perfect accounting. The goal is a repeatable owner rhythm.",
    proof:
      "Original proof element: a 30-minute review agenda with owner questions and stop rules.",
    cta: {
      label: "Get the free templates",
      href: "/templates",
      text:
        "Use the free GoldFin templates to turn the checklist into a repeatable monthly review.",
    },
    sections: [
      {
        heading: "The 30-minute monthly review agenda",
        blocks: [
          {
            type: "table",
            caption: "Owner review checklist",
            columns: ["Time", "Review step", "Question to answer"],
            rows: [
              ["0-5 min", "Cash movement", "Did cash rise or fall, and what caused most of the change?"],
              ["5-10 min", "Revenue", "Which offer, customer group, or channel drove the month?"],
              ["10-15 min", "Expenses", "Which costs changed enough to deserve a question?"],
              ["15-20 min", "Obligations", "What bills, payroll, debt, taxes, or renewals are already spoken for?"],
              ["20-25 min", "Decision checks", "Can we safely spend, hire, wait, collect, raise prices, or cut something?"],
              ["25-30 min", "Owner notes", "What are the three questions to review before next month?"],
            ],
          },
          {
            type: "p",
            html:
              "The routine works because it forces a small number of decisions. If a review turns into a transaction audit every month, the owner stops doing it. If it stays too high level, it becomes a ritual with no decision value.",
          },
        ],
      },
      {
        heading: "What to prepare before the review",
        blocks: [
          {
            type: "ul",
            items: [
              "Bank balance at the start and end of the month.",
              "Revenue for the month, preferably grouped by offer or customer type.",
              "Expense totals, with recurring costs separated from one-time costs.",
              "Known obligations due in the next 30 to 60 days.",
              "Any owner decisions currently on the table.",
            ],
          },
          {
            type: "callout",
            title: "Stop rule",
            html:
              "If a number cannot be known exactly in the review window, write the assumption beside it and keep moving. A useful monthly rhythm beats a perfect report that never ships.",
          },
        ],
      },
      {
        heading: "A fictional 30-minute review in practice",
        blocks: [
          {
            type: "p",
            html:
              "Fictional example: North Ridge Electric reviews June. Revenue is up 14 percent from May, but cash is only up $1,200. The checklist points to two questions: receivables increased, and a vehicle repair hit expenses. The owner does not need a 40-page report to know the next action: review late invoices before approving a new equipment purchase.",
          },
          {
            type: "table",
            columns: ["Signal", "What changed", "Owner question"],
            rows: [
              ["Revenue", "Up from May", "Was the growth collected or still sitting in receivables?"],
              ["Cash", "Barely up", "Which outflows offset the revenue increase?"],
              ["Expenses", "Vehicle repair spike", "Was this one-time or likely to repeat?"],
            ],
          },
        ],
      },
      {
        heading: "Questions to write down every month",
        blocks: [
          {
            type: "ol",
            items: [
              "What changed most this month?",
              "Which change is temporary, and which may repeat?",
              "What cash is already committed?",
              "What decision should wait until the numbers are clearer?",
              "What decision can move forward safely?",
            ],
          },
          {
            type: "cta",
            label: "Download the template vault",
            href: "/templates",
            text:
              "The free GoldFin Template Vault gives you spreadsheet structure for the monthly review without starting from a blank page.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "How long should a monthly financial review take?",
        answer:
          "A focused owner review can take 30 minutes if the inputs are prepared. Deeper cleanup, reconciliation, or professional review is separate work.",
      },
      {
        question: "Should I review finances weekly or monthly?",
        answer:
          "Weekly reviews are useful for cash timing. Monthly reviews are better for patterns, expenses, profitability, and decisions.",
      },
      {
        question: "What if my numbers are messy?",
        answer:
          "Use a simplified review with clear assumptions. The first goal is to spot decisions and questions, not to replace clean books.",
      },
    ],
  },
  {
    id: "H1-04",
    hubSlug: blogHub.slug,
    slug: "sample-monthly-finance-briefing",
    title: "Sample Monthly Finance Briefing: From Numbers to Decisions",
    shortTitle: "Sample monthly briefing",
    description:
      "See what a plain-English monthly finance briefing should do: translate cash, revenue, expenses, and obligations into owner decisions.",
    primaryQuery: "sample monthly financial report for small business",
    readTime: "8 min read",
    intent: "Commercial consideration",
    leadMagnet: "Sample Briefing PDF",
    moneyTarget: "/sample-briefing",
    answer:
      "A sample monthly finance briefing should show the owner what changed, why it matters, and what to decide next. It should not just paste accounting reports into a PDF. The strongest briefing turns cash movement, revenue trends, expense changes, and upcoming obligations into plain-English notes and owner questions.",
    proof:
      "Original proof element: side-by-side raw numbers and owner-ready interpretation using a fictional business.",
    cta: {
      label: "Open the full sample briefing",
      href: "/sample-briefing",
      text:
        "Review the live GoldFin sample briefing to see how the format works beyond this article.",
    },
    sections: [
      {
        heading: "What a sample briefing should prove",
        blocks: [
          {
            type: "p",
            html:
              "A sample report should not be decoration. It should prove the service or process can turn financial activity into decisions. If the sample only shows attractive charts, it may still leave the owner asking the same question: what should I do with this?",
          },
          {
            type: "ul",
            items: [
              "Cash movement should explain timing, not just balances.",
              "Revenue should identify what drove the month.",
              "Expenses should separate recurring pressure from one-time noise.",
              "Obligations should show what cash is already spoken for.",
              "The ending section should name questions and decisions.",
            ],
          },
        ],
      },
      {
        heading: "Raw numbers vs owner-ready interpretation",
        blocks: [
          {
            type: "table",
            caption: "Fictional example: Harbor Lane Design",
            columns: ["Raw number", "Plain-English briefing note", "Owner question"],
            rows: [
              [
                "Cash increased by $6,400",
                "Cash improved, but most of the increase came from deposits for work not yet delivered.",
                "How much of this balance is safe to use before delivery costs arrive?",
              ],
              [
                "Revenue was $58,000",
                "Revenue was concentrated in two large projects, so next month may not repeat automatically.",
                "Which pipeline items replace those projects?",
              ],
              [
                "Software expense rose by $740",
                "Three annual renewals hit in the same month. This may be a timing issue, not a new monthly baseline.",
                "Should these renewals stay, move, or be renegotiated?",
              ],
            ],
          },
          {
            type: "p",
            html:
              "The interpretation is not pretending to know the future. It is making the next review clearer. The owner still decides. The briefing narrows the questions.",
          },
        ],
      },
      {
        heading: "The briefing sections to expect",
        blocks: [
          {
            type: "ol",
            items: [
              "Executive summary: the short answer for the month.",
              "Cash movement: what changed in available cash and timing.",
              "Revenue trend: what drove sales and whether it looks repeatable.",
              "Expense changes: what increased, decreased, or looks unusual.",
              "Obligations: what the current balance does not reveal.",
              "Questions to review: what the owner should inspect next.",
              "Decisions to consider: where the numbers may affect action.",
            ],
          },
          {
            type: "callout",
            title: "No fake certainty",
            html:
              "A good briefing should say when something is an assumption, a pattern, or a question. It should not turn incomplete numbers into overconfident advice.",
          },
        ],
      },
      {
        heading: "How GoldFin uses this format",
        blocks: [
          {
            type: "p",
            html:
              "GoldFin Reports is built around this owner-readable layer. The point is not to replace tax, legal, accounting, payroll, or bookkeeping work. The point is to make the monthly financial picture easier to read before the owner makes decisions.",
          },
          {
            type: "cta",
            label: "See the sample briefing",
            href: "/sample-briefing",
            text:
              "Open the sample briefing to inspect the actual owner-facing structure.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between a report and a briefing?",
        answer:
          "A report presents numbers. A briefing explains what changed, why it may matter, and what the owner should review next.",
      },
      {
        question: "Should a sample report use real customer data?",
        answer:
          "Only with permission and appropriate privacy controls. Fictional examples are acceptable when they are clearly labeled.",
      },
      {
        question: "Does GoldFin replace a bookkeeper?",
        answer:
          "No. GoldFin is a clarity layer. Bookkeeping, tax, legal, payroll, and accounting responsibilities remain separate.",
      },
    ],
  },
  {
    id: "H1-09",
    hubSlug: blogHub.slug,
    slug: "how-monthly-financial-reporting-service-works",
    title: "How a Monthly Financial Reporting Service Works",
    shortTitle: "How reporting service works",
    description:
      "A transparent walkthrough of how a monthly financial reporting service turns business activity into owner-ready reports and plain-English briefings.",
    primaryQuery: "how does monthly financial reporting service work",
    readTime: "8 min read",
    intent: "Commercial consideration",
    leadMagnet: "GoldFin Process Guide",
    moneyTarget: "/pricing#auto-fill",
    answer:
      "A monthly financial reporting service gathers financial inputs, organizes them into a consistent structure, checks for unusual movement, prepares owner-ready reports, and delivers a plain-English briefing. The best services also explain scope clearly: what they do, what they do not do, what data is needed, and where professional accounting or tax advice remains separate.",
    proof:
      "Original proof element: transparent workflow from inputs to monthly briefing.",
    cta: {
      label: "See GoldFin Reports pricing",
      href: "/pricing#auto-fill",
      text:
        "GoldFin Reports fills your templates and sends a plain-English monthly briefing for $150/mo.",
    },
    sections: [
      {
        heading: "The workflow from inputs to briefing",
        blocks: [
          {
            type: "table",
            caption: "Monthly reporting service workflow",
            columns: ["Step", "What happens", "Owner benefit"],
            rows: [
              ["1. Inputs", "The service collects or receives business activity data.", "The owner is not starting from a blank spreadsheet."],
              ["2. Organization", "Activity is grouped into useful owner categories.", "The month becomes easier to scan."],
              ["3. Checks", "Large changes, missing context, and timing issues are flagged.", "The owner sees what deserves attention."],
              ["4. Reports", "The same report structure is filled each month.", "The owner can compare months consistently."],
              ["5. Briefing", "A plain-English summary explains the movement.", "The owner gets context, not just rows."],
              ["6. Next review", "Questions and decisions are captured for follow-up.", "The report turns into a rhythm."],
            ],
          },
        ],
      },
      {
        heading: "What the service should clarify before you buy",
        blocks: [
          {
            type: "ul",
            items: [
              "Which inputs are required and which are optional.",
              "Whether bank connection is required to start.",
              "Whether the service moves money. GoldFin does not move money.",
              "What is automated and what is human-reviewed.",
              "Whether bookkeeping, tax, payroll, and legal work are included.",
              "How cancellation, data handling, and exports work.",
            ],
          },
          {
            type: "p",
            html:
              "Scope clarity matters because financial products can sound broader than they are. A trustworthy reporting service should make its boundaries easy to find.",
          },
        ],
      },
      {
        heading: "How GoldFin Reports fits",
        blocks: [
          {
            type: "p",
            html:
              "GoldFin Reports is the lighter monthly reporting layer: your templates are filled from your numbers and turned into a plain-English monthly briefing. It is designed for owners who want recurring clarity without managing another dashboard or hiring a CFO too early.",
          },
          {
            type: "table",
            columns: ["GoldFin Reports does", "GoldFin Reports does not"],
            rows: [
              ["Organize financial activity into recurring report views.", "Replace tax, legal, accounting, payroll, or bookkeeping responsibilities."],
              ["Create plain-English monthly briefings.", "Move money or make payments from your accounts."],
              ["Help owners see cash movement, expenses, revenue, and questions.", "Promise a universal profit target or cash reserve number."],
            ],
          },
          {
            type: "callout",
            title: "Current pricing source of truth",
            html:
              "GoldFin Reports is currently positioned in this repo as the $150/mo continuity product. If pricing changes, every page, schema, email, and sitemap-adjacent description should be updated together.",
          },
        ],
      },
      {
        heading: "When a service is a better fit than DIY",
        blocks: [
          {
            type: "ul",
            items: [
              "You download templates but do not keep them current.",
              "You look at the bank balance before every decision.",
              "You have a bookkeeper but still do not know what changed.",
              "You want a consistent monthly report, not a one-time cleanup.",
              "You are not ready for a full fractional CFO engagement.",
            ],
          },
          {
            type: "cta",
            label: "Review GoldFin Reports",
            href: "/pricing#auto-fill",
            text:
              "See the $150/mo GoldFin Reports offer and how it sits between free templates and higher-touch advisory.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does a reporting service replace accounting software?",
        answer:
          "Usually no. It sits on top of records, exports, spreadsheets, or connected data and turns them into an owner-ready review.",
      },
      {
        question: "Do I need to connect a bank account?",
        answer:
          "Not always. GoldFin says no bank connection is required to start. When a connection is used, it should be read-only and clearly explained.",
      },
      {
        question: "What should a monthly reporting service cost?",
        answer:
          "Cost depends on scope. GoldFin Reports is positioned at $150/mo in this repo, while higher-touch GoldFin Advisory is $1,500/mo by application.",
      },
    ],
  },
  {
    id: "H1-12",
    hubSlug: blogHub.slug,
    slug: "bank-balance-vs-financial-report",
    title: "Bank Balance vs Financial Report: Why They Tell Different Stories",
    shortTitle: "Bank balance vs report",
    description:
      "Why a business bank balance can mislead owners, and how a monthly financial report adds timing, obligations, profit, and decision context.",
    primaryQuery: "bank balance vs financial statements",
    readTime: "7 min read",
    intent: "Informational awareness",
    leadMagnet: "Available-Cash Worksheet",
    moneyTarget: "/sample-briefing",
    answer:
      "A bank balance shows how much cash is in the account at one moment. A financial report explains what that cash means. The balance does not show unpaid bills, upcoming payroll, deposits collected early, taxes to reserve, inventory needs, or whether the month was actually profitable.",
    proof:
      "Original proof element: available-cash waterfall using a clearly fictional business.",
    cta: {
      label: "See the complete monthly picture",
      href: "/sample-briefing",
      text:
        "The sample briefing shows how cash, revenue, expenses, and obligations fit together.",
    },
    sections: [
      {
        heading: "Why the bank balance feels useful",
        blocks: [
          {
            type: "p",
            html:
              "The bank balance is visible, current, and emotionally powerful. Owners check it because it feels like the fastest answer to a hard question: can the business afford this?",
          },
          {
            type: "p",
            html:
              "The problem is that the bank balance is only a snapshot. It does not explain timing, commitments, profitability, or whether the cash belongs to work that still has costs attached.",
          },
        ],
      },
      {
        heading: "The missing context",
        blocks: [
          {
            type: "table",
            columns: ["Bank balance shows", "Financial report adds"],
            rows: [
              ["Cash in the account today", "Cash movement over the month"],
              ["Money received", "Whether the money is tied to future delivery"],
              ["Payments already made", "Bills, payroll, taxes, renewals, and debt still coming"],
              ["A feeling of safety or pressure", "A clearer view of spendable cash and decision risk"],
              ["No profit explanation", "Revenue, expenses, margin, and profit movement"],
            ],
          },
        ],
      },
      {
        heading: "A fictional available-cash waterfall",
        blocks: [
          {
            type: "p",
            html:
              "Fictional example: Maple Street Agency has $64,000 in its operating account on July 31. That looks comfortable until the owner maps the next 30 days.",
          },
          {
            type: "table",
            caption: "Available-cash worksheet",
            columns: ["Item", "Amount"],
            rows: [
              ["Current bank balance", "$64,000"],
              ["Payroll due next week", "-$18,000"],
              ["Contractor invoices approved", "-$9,500"],
              ["Sales tax and income-tax reserve placeholder", "-$7,000"],
              ["Software renewals due", "-$2,800"],
              ["Client deposit for work not delivered", "-$12,000"],
              ["Simplified available cash for decisions", "$14,700"],
            ],
          },
          {
            type: "p",
            html:
              "The exact reserve categories vary by business and jurisdiction. The point is the method: subtract obligations and timing constraints before treating a balance as spendable.",
          },
        ],
      },
      {
        heading: "How to stop running the business from the balance",
        blocks: [
          {
            type: "ol",
            items: [
              "Keep the bank balance visible, but do not let it be the whole answer.",
              "List obligations due in the next 30 to 60 days.",
              "Separate early deposits or restricted cash from flexible cash.",
              "Review revenue and expenses beside cash movement.",
              "Write the decision in plain English before spending.",
            ],
          },
          {
            type: "cta",
            label: "View the sample briefing",
            href: "/sample-briefing",
            text:
              "GoldFin's sample briefing shows a monthly view built for owners who need context before decisions.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is my bank balance ever useful?",
        answer:
          "Yes. It is useful as a starting point for cash timing. It becomes risky when it is treated as the full financial picture.",
      },
      {
        question: "Why can profit and cash move differently?",
        answer:
          "Timing differences, receivables, deposits, debt payments, inventory, taxes, owner draws, and unpaid bills can all make cash and profit tell different stories.",
      },
      {
        question: "What should I review before spending from the business account?",
        answer:
          "Review near-term obligations, restricted or early cash, expected inflows, and whether the spending decision changes your operating flexibility.",
      },
    ],
  },
];

export const featuredBlogPostIds = ["H1-01", "H1-03", "H1-04", "H1-09", "H1-12"];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getCanonical(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BLOG_HOST}${cleanPath.replace(/\/?$/, "/")}`;
}

export function getBlogIndexMeta() {
  return {
    path: "/blog/",
    title: "GoldFin Desk Blog - Monthly Financial Clarity for Owners",
    description:
      "Guides, templates, checklists, and plain-English financial reporting examples for owner-led businesses.",
    h1: "Monthly financial clarity for owner-led businesses",
  };
}

export function getBlogHubMeta() {
  return {
    path: `/blog/${blogHub.slug}/`,
    title: "Monthly Financial Reporting for Small Business | GoldFin Desk",
    description: blogHub.description,
    h1: blogHub.title,
  };
}

export function getBlogPostMeta(post: BlogPost) {
  return {
    path: `/blog/${post.slug}/`,
    title: `${post.title} | GoldFin Desk`,
    description: post.description,
    h1: post.title,
  };
}

export function getAllBlogRouteMetas() {
  return [
    getBlogIndexMeta(),
    getBlogHubMeta(),
    ...blogPosts.map((post) => getBlogPostMeta(post)),
  ];
}

export const blogDisclaimer = sharedDisclaimer;
