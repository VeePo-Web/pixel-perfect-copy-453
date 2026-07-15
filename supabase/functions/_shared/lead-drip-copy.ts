// Verbatim email copy for the GoldFin sales spine (seq_2..seq_10) and
// buyer-ascension track (asc_a1..asc_a4). Bodies come from
// docs/email-sequence.md — do not paraphrase, "improve", or shorten. The HTML
// shell that renders these lives in email-drip-worker; this file is only the
// copy per key.

export type EmailKey =
  | "seq_2" | "seq_3" | "seq_4" | "seq_5" | "seq_6"
  | "seq_7" | "seq_8" | "seq_9" | "seq_10"
  | "asc_a1" | "asc_a2" | "asc_a3" | "asc_a4";

export type EmailCopy = {
  subject: string;
  preview: string;
  // HTML body without the outer shell, greeting, or sign-off — those are
  // rendered by the worker so voice/layout stay identical across the sequence.
  bodyHtml: string;
};

// Day offsets from the anchoring event (created_at for seq_, converted_at for asc_).
export const SALES_MATRIX: Array<{ key: EmailKey; day: number }> = [
  { key: "seq_2",  day: 2  },
  { key: "seq_3",  day: 3  },
  { key: "seq_4",  day: 4  },
  { key: "seq_5",  day: 5  },
  { key: "seq_6",  day: 7  },
  { key: "seq_7",  day: 10 },
  { key: "seq_8",  day: 14 },
  { key: "seq_9",  day: 21 },
  { key: "seq_10", day: 30 },
];

export const ASCENSION_MATRIX: Array<{ key: EmailKey; day: number }> = [
  { key: "asc_a1", day: 0  },
  { key: "asc_a2", day: 3  },
  { key: "asc_a3", day: 17 },
  { key: "asc_a4", day: 45 },
];

const P  = 'font-size:16px;line-height:1.65;margin:0 0 18px';
const LI = 'font-size:15px;line-height:1.7;margin:0 0 6px;color:#0B0D12';
const OL = 'margin:0 0 20px;padding:0 0 0 22px';
const UL = 'margin:0 0 20px;padding:0 0 0 20px';
const CTA = (href: string, label: string) =>
  `<p style="margin:0 0 18px"><a href="${href}" style="display:inline-block;background:#D4A845;color:#0F1B3D;text-decoration:none;font-weight:600;font-size:14px;padding:13px 24px;border-radius:9999px">${label}</a></p>`;
const A = (href: string, text: string) => `<a href="${href}" style="color:#B8893A">${text}</a>`;

// {{SITE_URL}} placeholder is replaced at render time. Never build a URL that
// depends on run-time state here — the copy must be identical across renders.
const SITE = "{{SITE_URL}}";

export const COPY: Record<EmailKey, EmailCopy> = {
  seq_2: {
    subject: "Your bank balance is not a strategy",
    preview: "It tells you what's left. Not what's about to leave.",
    bodyHtml: `
<p style="${P}">Quick test. When you want to know how the business is doing, what's the first number you check? For most owners, it's the bank balance.</p>
<p style="${P}">Here's the problem. The bank balance is a <em>snapshot of the past</em>. It doesn't tell you:</p>
<ul style="${UL}">
  <li style="${LI}">What bills and payroll are coming before the next deposit</li>
  <li style="${LI}">How much of that balance is really taxes you're holding for later</li>
  <li style="${LI}">Whether last month's "good" cash was just a client paying early</li>
  <li style="${LI}">How many weeks of runway you actually have</li>
</ul>
<p style="${P}">That's why a month can feel fine in the account and tight by the 20th. The number isn't lying — it's just answering the wrong question.</p>
<p style="${P}">The Cash Flow Forecast in your Vault fixes the <em>what's coming</em> part. Want to see what the full picture looks like, interpreted in plain English? Generate a sample briefing — no bank connection, demo data is fine:</p>
${CTA(`${SITE}/sample-briefing`, "See a sample briefing")}
<p style="${P}"><strong>P.S.</strong> Tomorrow: why clean books still leave you guessing.</p>`,
  },

  seq_3: {
    subject: "Clean books still don't tell you what to do",
    preview: "Bookkeeping records the past. Decisions live in the future.",
    bodyHtml: `
<p style="${P}">If you have a bookkeeper or QuickBooks, you already have <em>clean records</em>. That's real, and worth keeping. But clean books answer one question — <strong>what happened</strong> — and owners keep running into a different one: <strong>what do I do now?</strong></p>
<p style="${P}">Bookkeeping tells you that contractor spend was $18,400 last month. It doesn't tell you that it's grown three months running, faster than revenue, and is quietly eating your margin before you've felt it.</p>
<p style="${P}">That gap — between <em>recorded</em> and <em>interpreted</em> — is where most financial stress lives. It's not a tool problem. You have tools. It's a <strong>rhythm</strong> problem: no recurring moment where someone reads the numbers and tells you what deserves attention.</p>
<p style="${P}">That recurring moment is what GoldFin Reports gives you: your templates filled from your numbers every month, with a plain-English briefing on what changed and what's worth a second look.</p>
${CTA(`${SITE}/pricing#auto-fill`, "See how GoldFin Reports works — $150/mo")}
<p style="${P}"><strong>P.S.</strong> Tomorrow: the hiring question, and why "I think we can afford it" is not a cash-flow analysis.</p>`,
  },

  seq_4: {
    subject: "Can you actually afford the next hire?",
    preview: "Confidence is not a cash-flow analysis.",
    bodyHtml: `
<p style="${P}">A hire is one of the few decisions that turns into a <em>fixed</em> cost the moment you make it. Revenue flexes. Salaries don't. So "I think we can afford it" is an expensive sentence to be wrong about.</p>
<p style="${P}">Before the next hire, three numbers actually matter:</p>
<ol style="${OL}">
  <li style="${LI}"><strong>Stable monthly cash</strong> — not last month's spike, the durable floor</li>
  <li style="${LI}"><strong>Fixed-cost load</strong> — how much of revenue is already committed before this hire</li>
  <li style="${LI}"><strong>Revenue concentration</strong> — if one or two clients carry the month, a new salary is a bet on them staying</li>
</ol>
<p style="${P}">The Hiring Affordability template in your Vault runs this. GoldFin Reports keeps it current <em>and</em> flags it for you — so the answer is sitting in your monthly briefing before you're staring at an offer letter wondering.</p>
${CTA(`${SITE}/pricing#auto-fill`, "Have it filled for you every month — $150/mo")}
<p style="${P}"><strong>P.S.</strong> Tomorrow: a real example — revenue grew 14%, and cash still felt tight. Here's exactly what was happening underneath.</p>`,
  },

  seq_5: {
    subject: "Revenue grew 14%. Cash still felt tight.",
    preview: "Here's exactly what was happening underneath.",
    bodyHtml: `
<p style="${P}">Take a demo agency — call it 12 people, around $90K/month. On paper, a good month: revenue up 14%. But the owner still felt tight. Here's what a monthly briefing surfaced:</p>
<ul style="${UL}">
  <li style="${LI}"><strong>Cash <em>looked</em> up — but the gain came from delayed vendor payments</strong>, not stronger margin. Real operating cash was flat.</li>
  <li style="${LI}"><strong>The 14% growth was concentrated in one client segment.</strong> Durable if it holds; a cliff if it doesn't.</li>
  <li style="${LI}"><strong>Software, contractor, and owner-discretionary spend were rising faster than revenue</strong> — margin was eroding underneath the growth.</li>
</ul>
<p style="${P}">None of that shows up in the bank balance. All of it shows up in a monthly briefing. The owner's next move stopped being "we grew, let's hire" and became "let's stabilize margin and concentration first." That's the difference between data and clarity.</p>
<p style="${P}">This is exactly what GoldFin Reports delivers every month — for your real numbers.</p>
${CTA(`${SITE}/pricing#auto-fill`, "Auto-fill my reports — $150/mo")}
<p style="${P}"><strong>P.S.</strong> Tomorrow I'll lay out the offer plainly — what you get, what it costs, and the no-risk way to try it.</p>`,
  },

  seq_6: {
    subject: "Have your reports filled for you — $150/mo",
    preview: "The Vault, done for you, every month. Cancel anytime.",
    bodyHtml: `
<p style="${P}">You've had the Vault for a week. If you've used it, you already know two things: it helps, and keeping it current every month is work you'll quietly stop doing. That's the honest trap of free templates — the value is real, and so is the maintenance.</p>
<p style="${P}"><strong>GoldFin Reports</strong> removes the maintenance. For <strong>$150/month</strong> you get, every month:</p>
<ul style="${UL}">
  <li style="${LI}">Every template <strong>filled from your numbers</strong> — no spreadsheet work <em>(~$120/mo of work)</em></li>
  <li style="${LI}">A monthly <strong>cash-flow summary</strong> <em>(~$60)</em></li>
  <li style="${LI}">An <strong>expense-change report</strong> <em>(~$45)</em></li>
  <li style="${LI}">A <strong>subscription &amp; recurring-cost tracker</strong> <em>(~$30)</em></li>
  <li style="${LI}">A <strong>revenue snapshot</strong> <em>(~$30)</em></li>
  <li style="${LI}">A monthly <strong>plain-English PDF briefing</strong> <em>(~$75)</em></li>
  <li style="${LI}">An <strong>owner action list</strong> <em>(~$40)</em></li>
  <li style="${LI}"><strong>Spreadsheet export — always yours</strong></li>
</ul>
<p style="${P}">That's <strong>$400+/month of work and interpretation for $150.</strong> Try one month. If it's not clearer, cancel before your next billing cycle — no friction. No bank connection required to start; when you connect, it's read-only and we never move money.</p>
${CTA(`${SITE}/pricing#auto-fill`, "Auto-fill my reports — $150/mo")}
<p style="${P}"><strong>P.S.</strong> Running something larger and want Chris Sam reading the numbers <em>with</em> you, turning the patterns into real decisions each month? That's GoldFin Advisory — consultation scoped and priced uniquely to each business. <strong>Reply to this email with "ADVISORY" and two sentences about the business</strong>, and Chris will tell you honestly whether it's a fit.</p>`,
  },

  seq_7: {
    subject: "The report is not the bottleneck",
    preview: "The bottleneck is getting yourself to look at it every month.",
    bodyHtml: `
<p style="${P}">Most owners do not have a finance problem because the spreadsheet is impossible.</p>
<p style="${P}">They have a finance problem because the spreadsheet requires a quiet hour, clean numbers, and enough mental energy to interpret what changed. That hour keeps losing to clients, payroll, hiring, delivery, and the hundred small fires that feel more urgent.</p>
<p style="${P}">So the report never becomes a rhythm.</p>
<p style="${P}">GoldFin Reports exists for that bottleneck. The templates get filled. The month gets summarized. You get the few things worth looking at, in plain English, without rebuilding the whole process yourself.</p>
${CTA(`${SITE}/pricing#auto-fill`, "Auto-fill my reports — $150/mo")}`,
  },

  seq_8: {
    subject: "When $150 is obviously worth it",
    preview: "One avoided bad decision pays for a lot of reporting.",
    bodyHtml: `
<p style="${P}">The reason $150/mo works is not because spreadsheets are expensive.</p>
<p style="${P}">It works because unclear numbers make normal decisions more expensive:</p>
<ul style="${UL}">
  <li style="${LI}">Hiring one month too early</li>
  <li style="${LI}">Keeping a subscription stack no one owns</li>
  <li style="${LI}">Mistaking delayed vendor payments for better cash flow</li>
  <li style="${LI}">Thinking a strong revenue month means margin improved</li>
  <li style="${LI}">Waiting too long to build a tax reserve</li>
</ul>
<p style="${P}">GoldFin Reports is priced to be an easy yes if it prevents even one of those decisions from happening blindly.</p>
${CTA(`${SITE}/pricing#auto-fill`, "Start with one month")}`,
  },

  seq_9: {
    subject: "Try it for one reporting cycle",
    preview: "If the month is not clearer, cancel before the next bill.",
    bodyHtml: `
<p style="${P}">You do not need to decide whether GoldFin belongs in your business forever.</p>
<p style="${P}">Just decide whether one reporting cycle would be useful.</p>
<p style="${P}">Send the numbers, get the templates filled, read the briefing, and ask one question:</p>
<p style="${P}"><strong>"Do I understand the month faster than I did before?"</strong></p>
<p style="${P}">If the answer is no, cancel before the next billing cycle. Keep your exports. No drama.</p>
${CTA(`${SITE}/pricing#auto-fill`, "Try one month of Reports")}`,
  },

  seq_10: {
    subject: "Should I close your file?",
    preview: "A simple yes/no is enough.",
    bodyHtml: `
<p style="${P}">I do not want to keep sending you finance emails if this is not relevant.</p>
<p style="${P}">Should I close the loop here, or would it still be useful to have your templates filled and interpreted every month?</p>
<p style="${P}">If you want the automated monthly version, start here:</p>
${CTA(`${SITE}/pricing#auto-fill`, "Auto-fill my reports — $150/mo")}
<p style="${P}">If the business is larger and you want Chris Sam reading the numbers with you, reply with <strong>"ADVISORY"</strong> and two sentences about the business.</p>
<p style="${P}">Either way, the goal is the same: fewer owner decisions made from a bank balance alone.</p>`,
  },

  asc_a1: {
    subject: "Your first briefing is in motion",
    preview: "What happens now, and when to expect it.",
    bodyHtml: `
<p style="${P}">Welcome — you're in. Here's exactly what happens now:</p>
<ol style="${OL}">
  <li style="${LI}">We prepare your first monthly cycle (connect read-only data when you're ready — demo data works to start).</li>
  <li style="${LI}">Your four workbooks get filled from your numbers.</li>
  <li style="${LI}">You get a plain-English briefing: what changed, what deserves attention, what to not overreact to.</li>
</ol>
<p style="${P}">Nothing for you to maintain. The rhythm is the product.</p>
<p style="${P}">One expectation to set: the briefing will <em>tell you what changed</em>. Some months, what changed will raise a real decision — a hire, a price, a reserve, a client risk. When that happens, you'll want more than a report. Hold that thought; I'll show you what I mean once your first briefing lands.</p>`,
  },

  asc_a2: {
    subject: "How to read your first briefing",
    preview: "And the one question no report can answer.",
    bodyHtml: `
<p style="${P}">Your first briefing is out. Read it in this order: the one number up top, then "what changed," then the action list. Ten minutes, no more.</p>
<p style="${P}">Here's the honest limit of what you now have. The briefing tells you <strong>what happened</strong> and <strong>what's moving</strong>. It cannot tell you what <em>you</em> should do about it — because that depends on things only visible in conversation: your risk tolerance, your plans, the client you already suspect is wobbling, the hire you've been circling for two months.</p>
<p style="${P}">A report flags the pattern. Judgment makes the call. That second layer is what I do with a small number of businesses each quarter — it's called GoldFin Advisory, and I'll tell you how it works after you've had a couple of cycles. For now: read the briefing, and reply if anything in it surprises you. I read every reply.</p>`,
  },

  asc_a3: {
    subject: "The month the report wasn't enough",
    preview: "A true pattern, and the decision underneath it.",
    bodyHtml: `
<p style="${P}">A pattern I've seen more than once. An owner's briefing showed the same thing three months running: revenue steady, margin drifting down about a point a month. Small enough to ignore. The report flagged it every time.</p>
<p style="${P}">What the report couldn't say: the drift was two underpriced legacy clients, and the owner had been avoiding the repricing conversation because one of them was a friend. The numbers weren't the problem. The <em>decision</em> was.</p>
<p style="${P}">We scoped it in one working session: which client, what number, what to say, what to do if they walked. Margin recovered in two cycles. The report found the pattern; the conversation made the call.</p>
<p style="${P}">That's GoldFin Advisory: me, reading your numbers with you, turning what the briefing flags into the steps forward — scoped to your business, priced to your business.</p>
<p style="${P}">If there's a decision like that sitting in your briefing right now, reply with <strong>"ADVISORY"</strong> and two sentences about it. I'll tell you honestly whether it needs a session or just a sharper look at next month's report.</p>`,
  },

  asc_a4: {
    subject: "An invitation, plainly",
    preview: "For the decisions the briefing keeps pointing at.",
    bodyHtml: `
<p style="${P}">You've had a few briefings now, so you know what the rhythm does — and where it stops.</p>
<p style="${P}">Here's the invitation, plainly. <strong>GoldFin Advisory</strong> is me working with you directly:</p>
<ul style="${UL}">
  <li style="${LI}">A working session on your actual numbers — not a template, your ledger</li>
  <li style="${LI}">The analysis behind the pattern: pricing, margin, cash, concentration, hiring</li>
  <li style="${LI}">The steps forward, written down: what to do, in what order, and what to watch next</li>
  <li style="${LI}">Follow-through in your monthly briefings — we track whether it worked</li>
</ul>
<p style="${P}">It is not for everyone, and I keep it to a small number of businesses each quarter so the reading stays real. There's no pricing page: scope and price depend on the size and shape of the business, and I'd rather tell you "you don't need this yet" than sell you a session you don't need.</p>
<p style="${P}"><strong>${A(`${SITE}/about#advisory-contact`, `Reply with "ADVISORY" and two sentences about the business.`)}</strong> I'll come back within one business day with either a scoped proposal or an honest "not yet."</p>`,
  },
};
