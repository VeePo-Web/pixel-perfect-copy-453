# GoldFin Template Vault → GoldFin Reports ($150/mo) Email Sequence

Brunson soap-opera sequence. Job: take a free **GoldFin Template Vault** lead and walk
them, over ~7 days, to the **$150/mo GoldFin Reports** upgrade (the bread-and-butter,
fully-automated rung). Tone: calm, premium, plain-spoken, banker-grade — the persona
voice. **Never** "AI magic", "unlock", "supercharge", "revolutionary", or emojis. Sell
the *rhythm and interpretation*, not spreadsheets. Founder: **Chris Sam**.

## How it runs (Resend)
- **Email 1** is sent automatically on signup by the `send-template-email` edge function
  (delivery + the hook). Triggered the moment the hero capture fires.
- **Emails 2–6** run as a Resend **Broadcast / Automation** keyed to the lead's signup
  date (add the contact to a Resend Audience via `RESEND_AUDIENCE_ID`, then schedule the
  automation: Day 2, 3, 4, 5, 7).
- Links (replace `{{SITE_URL}}` with `https://goldfindesk.com`):
  - **The Vault itself (Email 1 CTA — the zip, not a page):
    `{{SITE_URL}}/downloads/goldfin-template-vault.zip`** — one folder, four .xlsx
    workbooks: Owner Command Center, 13-Week Cash Map, Cash-Basis P&L Review,
    Expense & Vendor Audit. Email 1's only job is that this opens.
  - Template library (secondary/browse): `{{SITE_URL}}/templates`
  - Sample briefing (proof): `{{SITE_URL}}/sample-briefing`
  - **GoldFin Reports $150/mo (primary upgrade): `{{SITE_URL}}/pricing#auto-fill`**
  - GoldFin Advisory (custom-scoped consultation with Chris Sam, priced per
    business): **application by reply** — "Reply with ADVISORY and two sentences
    about the business." The `/apply` page is retired; the reply IS the
    application, and it lands in Chris's inbox as a warm sales conversation.
- One idea, one primary CTA per email. Every email earns the next open.

---

## Email 1 — Deliver the Vault (Day 0, automated)

**Subject:** Your GoldFin Template Vault is inside
**Preview:** Plus the one number most owners check that quietly lies to them.

Hi {{firstName}},

Your GoldFin Template Vault is attached to this link — one zip folder, four Excel
workbooks, ready to open:

- **Owner Command Center** — the first-tab answer: cash, deposits, outflows, runway
- **13-Week Cash Map** — will cash feel tight next quarter?
- **Cash-Basis P&L Review** — is operating activity actually profitable?
- **Expense & Vendor Audit** — where did the money go?

→ **Download my Vault (.zip):** {{SITE_URL}}/downloads/goldfin-template-vault.zip

Four .xlsx files. Opens in Excel, Google Sheets, or Numbers. Drop in your numbers and
you'll see the business more clearly in about ten minutes.

One thing before you go. Most owners check the **bank balance** to feel safe. It's the
fastest number to find — and the most misleading. It tells you what's *left*. It says
nothing about what's *coming*: payroll, taxes, the vendor invoice that hasn't cleared,
the client who pays late.

Over the next five days I'll send one short email showing how owners actually use each
template to make real decisions — hiring, pricing, cash reserves. No spam. Just the
thinking.

— Chris Sam, GoldFin Desk

**P.S.** If you'd rather not fill these in yourself every month, that's exactly what
GoldFin Reports does for $150/mo. More on that later in the week.

---

## Email 2 — Your bank balance is not a strategy (Day 2)

**Subject:** Your bank balance is not a strategy
**Preview:** It tells you what's left. Not what's about to leave.

Hi {{firstName}},

Quick test. When you want to know how the business is doing, what's the first number you
check? For most owners, it's the bank balance.

Here's the problem. The bank balance is a *snapshot of the past*. It doesn't tell you:

- What bills and payroll are coming before the next deposit
- How much of that balance is really taxes you're holding for later
- Whether last month's "good" cash was just a client paying early
- How many weeks of runway you actually have

That's why a month can feel fine in the account and tight by the 20th. The number isn't
lying — it's just answering the wrong question.

The Cash Flow Forecast in your Vault fixes the *what's coming* part. Want to see what the
full picture looks like, interpreted in plain English? Generate a sample briefing — no
bank connection, demo data is fine:

→ **See a sample briefing:** {{SITE_URL}}/sample-briefing

— Chris Sam

**P.S.** Tomorrow: why clean books still leave you guessing.

---

## Email 3 — Clean books still need interpretation (Day 3)

**Subject:** Clean books still don't tell you what to do
**Preview:** Bookkeeping records the past. Decisions live in the future.

Hi {{firstName}},

If you have a bookkeeper or QuickBooks, you already have *clean records*. That's real, and
worth keeping. But clean books answer one question — **what happened** — and owners keep
running into a different one: **what do I do now?**

Bookkeeping tells you that contractor spend was $18,400 last month. It doesn't tell you
that it's grown three months running, faster than revenue, and is quietly eating your
margin before you've felt it.

That gap — between *recorded* and *interpreted* — is where most financial stress lives.
It's not a tool problem. You have tools. It's a **rhythm** problem: no recurring moment
where someone reads the numbers and tells you what deserves attention.

That recurring moment is what GoldFin Reports gives you: your templates filled from your
numbers every month, with a plain-English briefing on what changed and what's worth a
second look.

→ **See how GoldFin Reports works — $150/mo:** {{SITE_URL}}/pricing#auto-fill

— Chris Sam

**P.S.** Tomorrow: the hiring question, and why "I think we can afford it" is not a
cash-flow analysis.

---

## Email 4 — Can you actually afford the next hire? (Day 4)

**Subject:** Can you actually afford the next hire?
**Preview:** Confidence is not a cash-flow analysis.

Hi {{firstName}},

A hire is one of the few decisions that turns into a *fixed* cost the moment you make it.
Revenue flexes. Salaries don't. So "I think we can afford it" is an expensive sentence to
be wrong about.

Before the next hire, three numbers actually matter:

1. **Stable monthly cash** — not last month's spike, the durable floor
2. **Fixed-cost load** — how much of revenue is already committed before this hire
3. **Revenue concentration** — if one or two clients carry the month, a new salary is a
   bet on them staying

The Hiring Affordability template in your Vault runs this. GoldFin Reports keeps it
current *and* flags it for you — so the answer is sitting in your monthly briefing before
you're staring at an offer letter wondering.

→ **Have it filled for you every month — $150/mo:** {{SITE_URL}}/pricing#auto-fill

— Chris Sam

**P.S.** Tomorrow: a real example — revenue grew 14%, and cash still felt tight. Here's
exactly what was happening underneath.

---

## Email 5 — Revenue grew. Cash still felt tight. (Day 5, the case)

**Subject:** Revenue grew 14%. Cash still felt tight.
**Preview:** Here's exactly what was happening underneath.

Hi {{firstName}},

Take a demo agency — call it 12 people, around $90K/month. On paper, a good month:
revenue up 14%. But the owner still felt tight. Here's what a monthly briefing surfaced:

- **Cash *looked* up — but the gain came from delayed vendor payments**, not stronger
  margin. Real operating cash was flat.
- **The 14% growth was concentrated in one client segment.** Durable if it holds; a cliff
  if it doesn't.
- **Software, contractor, and owner-discretionary spend were rising faster than revenue** —
  margin was eroding underneath the growth.

None of that shows up in the bank balance. All of it shows up in a monthly briefing. The
owner's next move stopped being "we grew, let's hire" and became "let's stabilize margin
and concentration first." That's the difference between data and clarity.

This is exactly what GoldFin Reports delivers every month — for your real numbers.

→ **Auto-fill my reports — $150/mo:** {{SITE_URL}}/pricing#auto-fill

— Chris Sam

**P.S.** Tomorrow I'll lay out the offer plainly — what you get, what it costs, and the
no-risk way to try it.

---

## Email 6 — The direct offer (Day 7)

**Subject:** Have your reports filled for you — $150/mo
**Preview:** The Vault, done for you, every month. Cancel anytime.

Hi {{firstName}},

You've had the Vault for a week. If you've used it, you already know two things: it helps,
and keeping it current every month is work you'll quietly stop doing. That's the honest
trap of free templates — the value is real, and so is the maintenance.

**GoldFin Reports** removes the maintenance. For **$150/month** you get, every month:

- Every template **filled from your numbers** — no spreadsheet work *(~$120/mo of work)*
- A monthly **cash-flow summary** *(~$60)*
- An **expense-change report** *(~$45)*
- A **subscription & recurring-cost tracker** *(~$30)*
- A **revenue snapshot** *(~$30)*
- A monthly **plain-English PDF briefing** *(~$75)*
- An **owner action list** *(~$40)*
- **Spreadsheet export — always yours**

That's **$400+/month of work and interpretation for $150.** Try one month. If it's not
clearer, cancel before your next billing cycle — no friction. No bank connection required
to start; when you connect, it's read-only and we never move money.

→ **Auto-fill my reports — $150/mo:** {{SITE_URL}}/pricing#auto-fill

— Chris Sam, GoldFin Desk

**P.S.** Running something larger and want Chris Sam reading the numbers *with* you,
turning the patterns into real decisions each month? That's GoldFin Advisory —
consultation scoped and priced uniquely to each business. **Reply to this email with
"ADVISORY" and two sentences about the business**, and Chris will tell you honestly
whether it's a fit.

---

## After the sequence (optional)
- Non-openers of Email 6 → resend with a new subject 3 days later ("One number worth $150").
- Clicked $150 but didn't subscribe → a single cart-style nudge with the guarantee restated.
- Subscribed → stop the sequence, start onboarding.

---

## Conversion Upgrade Layer (additive)

Keep Emails 1–6 exactly as the canonical spine. This layer makes the automation more
valuable without diluting the core promise: owners do not need another spreadsheet; they
need a monthly finance rhythm that turns numbers into decisions.

### The Big Idea

Every email should move the lead through one belief:

1. **My bank balance is not enough.**
2. **My templates are useful, but only if they stay current.**
3. **Interpretation is the missing layer.**
4. **$150/mo is a low-friction way to stop guessing.**
5. **If the business is bigger or more complex, Chris Sam's consultation is the premium
   next step.**

The automation should never feel like a newsletter. It should feel like Chris is walking
beside the owner for one week, pointing at the few financial details that actually change
decisions.

### Conversion Rules

- **One CTA per send.** Never split attention between templates, Reports, and Advisory in
  the same email.
- **Plain-English pain before feature language.** "You are guessing before payroll" beats
  "automated reporting dashboard."
- **Always sell the next decision, not the whole company.** Email 2 sells seeing a sample.
  Email 3 sells interpretation. Email 6 sells trying one paid month.
- **Use numbers as proof, not decoration.** Every example should connect a number to a
  decision: hire, wait, cut spend, raise price, build reserve.
- **Advisory is selective.** Do not price it in the sequence. Position it as custom
  consultation for owners who need Chris Sam reading the numbers with them.
- **Avoid hype words.** No "unlock," "supercharge," "revolutionize," "AI magic," emojis,
  fake scarcity, or loud urgency.

### Lead Stages

| Stage | Trigger | Primary belief to sell | Automation action |
| --- | --- | --- | --- |
| New Vault lead | Submitted template capture | "The Vault is useful today." | Send Email 1 immediately. |
| Curious but unproven | Opened Email 1 or 2, no click | "The bank balance misses what is coming." | Continue spine; no extra send yet. |
| Proof-seeker | Clicked `/sample-briefing` | "This is what interpretation looks like." | Add proof nudge if no pricing click in 24h. |
| High-intent Reports lead | Clicked `/pricing#auto-fill` | "$150/mo removes the maintenance." | Add checkout nudge if no purchase in 12–24h. |
| Checkout abandon | Started checkout, no payment | "No bank connection required to start." | Send short reassurance email. |
| Advisory-fit lead | Replied "ADVISORY", or reply mentions larger-business signals | "This is Chris Sam consultation, scoped to the business." | Chris replies personally within one business day; do not push checkout. |
| Cold lead | No opens after two sends | "One specific question may wake them up." | One plain-text resend, then pause. |

### Lead Scoring

Use scoring to decide when to send a branch email or suppress the rest of the sequence.

| Event | Score |
| --- | ---: |
| Opens any sequence email | +3 |
| Clicks templates | +8 |
| Clicks sample briefing | +15 |
| Clicks pricing | +25 |
| Starts checkout | +35 |
| Replies to any email | +40 |
| Replies "ADVISORY" (application) | +45 |
| No open after resend | -10 |
| Unsubscribes | Suppress |
| Subscribes to Reports | Suppress sales sequence; start onboarding |

**Hot lead:** 35+ points. Send one focused objection-removal email.  
**Advisory lead:** 45+ points or any direct reply that mentions hiring, payroll, taxes,
cash crunch, revenue concentration, or a large upcoming decision.

### Subject & Preview Testing Matrix

Run tests one email at a time. Keep the body stable until a subject winner is clear.

| Email | Current subject | Test A | Test B | Winner metric |
| --- | --- | --- | --- | --- |
| 1 | Your GoldFin Template Vault is inside | Your templates are inside | The Vault is yours | Open rate, then template clicks |
| 2 | Your bank balance is not a strategy | The number owners trust too much | What your bank balance misses | Sample briefing clicks |
| 3 | Clean books still don't tell you what to do | Clean books. Still guessing. | The missing layer above bookkeeping | Pricing clicks |
| 4 | Can you actually afford the next hire? | Before you make the next hire | The hiring question your bank balance cannot answer | Pricing clicks |
| 5 | Revenue grew 14%. Cash still felt tight. | The month looked good. Cash felt wrong. | Why growth can still feel tight | Pricing clicks |
| 6 | Have your reports filled for you — $150/mo | The Vault, done for you | Want this filled in every month? | Checkout starts |

Preview-line tests:

- "One number can look safe and still mislead you."
- "The issue usually is not the spreadsheet. It is the monthly rhythm."
- "A clean report should tell you what to do next."
- "Try one month. Keep the exports. Cancel anytime."

### Behavioral Branches

#### Branch A — Opened but did not click sample briefing

**Timing:** 18–24 hours after Email 2 if opened but no sample click.  
**Subject:** The sample is the important part  
**CTA:** `{{SITE_URL}}/sample-briefing`

Hi {{firstName}},

Quick note. The useful part is not that GoldFin can make a report.

The useful part is seeing how a normal month gets translated into decisions: what changed,
what deserves attention, and what the owner should not overreact to.

That is what the sample briefing shows.

→ **See the sample briefing:** {{SITE_URL}}/sample-briefing

— Chris Sam

#### Branch B — Clicked sample briefing but did not click pricing

**Timing:** 24 hours after sample click.  
**Subject:** What to look for in the sample  
**CTA:** `{{SITE_URL}}/pricing#auto-fill`

Hi {{firstName}},

If you opened the sample briefing, look for three things:

1. It explains what changed.
2. It separates real movement from noise.
3. It turns the month into a short owner action list.

That is the paid product. Not prettier spreadsheets. A repeatable moment each month where
the numbers get read and translated.

→ **Have this filled for you every month:** {{SITE_URL}}/pricing#auto-fill

— Chris Sam

#### Branch C — Clicked pricing but did not start checkout

**Timing:** 12–24 hours after pricing click.  
**Subject:** The simple way to decide  
**CTA:** `{{SITE_URL}}/pricing#auto-fill`

Hi {{firstName}},

The clean way to decide is this:

If you will actually update the Vault every month yourself, keep using the free version.
That is a good outcome.

If you know it will slip the moment client work gets busy, GoldFin Reports is the cheaper
move. For $150/mo, the templates stay current and you get the plain-English briefing
without turning finance review into another task on your calendar.

→ **Start one month of Reports:** {{SITE_URL}}/pricing#auto-fill

— Chris Sam

#### Branch D — Checkout started but no payment

**Timing:** 2–4 hours after checkout start, then one final reminder 24 hours later.  
**Subject:** You can start without connecting a bank  
**CTA:** `{{SITE_URL}}/pricing#auto-fill`

Hi {{firstName}},

One quick clarification in case this was the hesitation: you do not need to connect a bank
account to start.

You can begin with basic business context and sample/demo data, then connect read-only
bank data later if you want the monthly reports automated from real activity. GoldFin
never moves money.

→ **Finish starting Reports:** {{SITE_URL}}/pricing#auto-fill

— Chris Sam

#### Branch E — Advisory-fit signal

**Timing:** Trigger immediately after a high-intent reply (hiring, payroll, taxes,
cash crunch, revenue concentration, "big decision").  
**Subject:** For bigger decisions  
**CTA:** Reply-based application.

Hi {{firstName}},

If you are dealing with a bigger decision — hiring, pricing, cash reserves, margin
pressure, taxes, or a month where the numbers are technically fine but still hard to read
— Reports may not be the whole answer.

That is where GoldFin Advisory fits. It is custom-scoped consultation with Chris Sam:
your numbers read with you, the actual tradeoffs named, and the next decision made
clearer. It is scoped and priced per business, after a short conversation — not off a
pricing page.

→ **Reply with "ADVISORY" and two sentences about the business**, and Chris will tell
you honestly whether it's a fit.

— Chris Sam

### Add-On Emails After Day 7

These are only for non-buyers who have not unsubscribed. They extend the sequence without
weakening the original offer.

---

## Email 7 — The owner bottleneck (Day 10)

**Subject:** The report is not the bottleneck  
**Preview:** The bottleneck is getting yourself to look at it every month.

Hi {{firstName}},

Most owners do not have a finance problem because the spreadsheet is impossible.

They have a finance problem because the spreadsheet requires a quiet hour, clean numbers,
and enough mental energy to interpret what changed. That hour keeps losing to clients,
payroll, hiring, delivery, and the hundred small fires that feel more urgent.

So the report never becomes a rhythm.

GoldFin Reports exists for that bottleneck. The templates get filled. The month gets
summarized. You get the few things worth looking at, in plain English, without rebuilding
the whole process yourself.

→ **Auto-fill my reports — $150/mo:** {{SITE_URL}}/pricing#auto-fill

— Chris Sam

---

## Email 8 — The $150 decision (Day 14)

**Subject:** When $150 is obviously worth it  
**Preview:** One avoided bad decision pays for a lot of reporting.

Hi {{firstName}},

The reason $150/mo works is not because spreadsheets are expensive.

It works because unclear numbers make normal decisions more expensive:

- Hiring one month too early
- Keeping a subscription stack no one owns
- Mistaking delayed vendor payments for better cash flow
- Thinking a strong revenue month means margin improved
- Waiting too long to build a tax reserve

GoldFin Reports is priced to be an easy yes if it prevents even one of those decisions
from happening blindly.

→ **Start with one month:** {{SITE_URL}}/pricing#auto-fill

— Chris Sam

---

## Email 9 — The quiet guarantee (Day 21)

**Subject:** Try it for one reporting cycle  
**Preview:** If the month is not clearer, cancel before the next bill.

Hi {{firstName}},

You do not need to decide whether GoldFin belongs in your business forever.

Just decide whether one reporting cycle would be useful.

Send the numbers, get the templates filled, read the briefing, and ask one question:

**"Do I understand the month faster than I did before?"**

If the answer is no, cancel before the next billing cycle. Keep your exports. No drama.

→ **Try one month of Reports:** {{SITE_URL}}/pricing#auto-fill

— Chris Sam

---

## Email 10 — The clean break (Day 30)

**Subject:** Should I close your file?  
**Preview:** A simple yes/no is enough.

Hi {{firstName}},

I do not want to keep sending you finance emails if this is not relevant.

Should I close the loop here, or would it still be useful to have your templates filled
and interpreted every month?

If you want the automated monthly version, start here:

→ **Auto-fill my reports — $150/mo:** {{SITE_URL}}/pricing#auto-fill

If the business is larger and you want Chris Sam reading the numbers with you, reply
with **"ADVISORY"** and two sentences about the business.

Either way, the goal is the same: fewer owner decisions made from a bank balance alone.

— Chris Sam

### Resend Logic

- Resend Email 1 to non-openers after 24 hours with subject: "Your templates are inside".
- Resend Email 6 to non-openers after 72 hours with subject: "The Vault, done for you".
- Do not resend branch emails unless they are checkout-related.
- Never send more than two emails in a 48-hour window.
- Suppress anyone who clicks unsubscribe, buys Reports, or books/apply-submits for
  Advisory.

### Reply Prompts

Reply prompts create sales conversations without sounding like sales pressure. Use them
sparingly.

- Email 2 reply prompt: "If you want, reply with the number you check first each week."
- Email 4 reply prompt: "If you are considering a hire, reply with 'hire' and I will send
  the three checks I would run first."
- Email 6 reply prompt: "If you are unsure whether Reports or Advisory fits, reply with
  'fit' and I will point you to the simpler path."
- Email 10 reply prompt: "Reply 'close' and I will stop the follow-up."

### UTM & Event Tags

Use stable tags so results can be read without guessing.

| Link type | UTM source | UTM campaign | UTM content |
| --- | --- | --- | --- |
| Template Vault | `email` | `vault_to_reports` | `email_1_vault` |
| Sample briefing | `email` | `vault_to_reports` | `email_2_sample` |
| Pricing | `email` | `vault_to_reports` | `email_3_pricing`, `email_4_pricing`, etc. |
| Checkout nudge | `email` | `checkout_recovery` | `bank_optional_reassurance` |
| Advisory | `email` | `advisory_fit` | `custom_consultation` |

Minimum event tags:

- `vault_email_sent`
- `vault_email_opened`
- `vault_template_clicked`
- `sample_briefing_clicked`
- `pricing_clicked`
- `checkout_started`
- `reports_subscribed`
- `advisory_clicked`
- `advisory_applied`

### Weekly Optimization Review

Review every Monday:

1. Which email produced the most pricing clicks?
2. Which subject line lifted opens without lowering click rate?
3. Where did people stop: sample, pricing, checkout, or apply?
4. Which branch created replies?
5. Did any email produce unsubscribes above normal?

Optimization priority:

1. Improve Email 2 sample click rate.
2. Improve Email 6 checkout start rate.
3. Improve Branch C checkout recovery.
4. Improve Advisory-fit routing without distracting Reports buyers.

### Conversion Benchmarks

Early targets for a warm template lead list:

- Email 1 open rate: 45%+
- Email 1 template click rate: 25%+
- Email 2 sample briefing click rate: 8–15%
- Email 3–6 pricing click rate: 3–8%
- Pricing click to checkout start: 20%+
- Checkout start to paid Reports: 35%+
- Reply rate across sequence: 1–3%

If a benchmark misses, fix the closest belief gap. Do not add more emails just because
the sequence underperforms.

### Operator Notes

- The most valuable sentence in the whole sequence is any sentence that helps the owner
  say: "I have been looking at the wrong number."
- The paid conversion moment is when the owner admits they will not maintain the Vault
  every month by themselves.
- The Advisory conversion moment is when the owner wants Chris Sam's judgment, not just
  the automated rhythm.
- The best tone is calm certainty. No pressure. No fake urgency. Just the feeling that a
  serious finance person has finally made the next step obvious.

---

# PART II — BUYER ASCENSION: GoldFin Reports → GoldFin Advisory

This is the top rung of the value ladder, sold **only to paying Reports subscribers**.
The moment someone subscribes at $150/mo, the sales sequence above is suppressed and
this track begins. It sells one thing: **Chris Sam himself** — consultation, analysis,
and the steps forward, scoped and priced uniquely per business after application.

## The Brunson mechanics at this rung

- **New opportunity, not improvement.** Advisory is never "more reports." Reports
  answers *what changed*. Advisory answers *what should I do* — with Chris's judgment
  applied to the owner's actual decision. Different product, different belief.
- **Status, not information.** The buyer at this rung is buying certainty and a named
  person in their corner. Sell the relationship ("Chris reads your numbers with you"),
  never the deliverable ("a call").
- **Application, not checkout.** No price appears anywhere in this track. Price is
  scoped per business after the application reply. The application is one email reply —
  friction low enough to act on, high enough to filter.
- **Real scarcity only.** Chris's reading time is genuinely finite. State the true
  capacity ("a small number of businesses each quarter") and never invent a countdown.
- **The briefing is the seed.** Every monthly briefing is the proof-of-work that makes
  Advisory feel inevitable: the report shows the pattern; Advisory decides what to do
  about it.

## Ascension triggers (any one starts or accelerates the track)

| Trigger | Action |
| --- | --- |
| Subscribes to Reports | Suppress sales sequence. Send A1 (welcome). Schedule A2–A4. |
| First monthly briefing delivered | Send A2 within 48h of delivery. |
| Opens the same briefing 3+ times, or forwards it | Send A3 early. |
| Reply mentions hire / payroll / taxes / cash crunch / concentration / "big decision" | Send Branch E immediately; flag for Chris personally. |
| 2+ briefing cycles completed, no Advisory reply | Send A4 (the direct invitation). |
| Replies "ADVISORY" | Stop all automation. Chris replies personally within one business day. |

## Email A1 — Welcome + the seed (Day 0 of subscription)

**Subject:** Your first briefing is in motion  
**Preview:** What happens now, and when to expect it.

Hi {{firstName}},

Welcome — you're in. Here's exactly what happens now:

1. We prepare your first monthly cycle (connect read-only data when you're ready — demo
   data works to start).
2. Your four workbooks get filled from your numbers.
3. You get a plain-English briefing: what changed, what deserves attention, what to not
   overreact to.

Nothing for you to maintain. The rhythm is the product.

One expectation to set: the briefing will *tell you what changed*. Some months, what
changed will raise a real decision — a hire, a price, a reserve, a client risk. When
that happens, you'll want more than a report. Hold that thought; I'll show you what I
mean once your first briefing lands.

— Chris Sam, GoldFin Desk

## Email A2 — The gap the report can't close (48h after first briefing)

**Subject:** How to read your first briefing  
**Preview:** And the one question no report can answer.

Hi {{firstName}},

Your first briefing is out. Read it in this order: the one number up top, then "what
changed," then the action list. Ten minutes, no more.

Here's the honest limit of what you now have. The briefing tells you **what happened**
and **what's moving**. It cannot tell you what *you* should do about it — because that
depends on things only visible in conversation: your risk tolerance, your plans, the
client you already suspect is wobbling, the hire you've been circling for two months.

A report flags the pattern. Judgment makes the call. That second layer is what I do
with a small number of businesses each quarter — it's called GoldFin Advisory, and I'll
tell you how it works after you've had a couple of cycles. For now: read the briefing,
and reply if anything in it surprises you. I read every reply.

— Chris Sam

## Email A3 — The Epiphany Bridge case (after 2nd briefing, or early on high engagement)

**Subject:** The month the report wasn't enough  
**Preview:** A true pattern, and the decision underneath it.

Hi {{firstName}},

A pattern I've seen more than once. An owner's briefing showed the same thing three
months running: revenue steady, margin drifting down about a point a month. Small
enough to ignore. The report flagged it every time.

What the report couldn't say: the drift was two underpriced legacy clients, and the
owner had been avoiding the repricing conversation because one of them was a friend.
The numbers weren't the problem. The *decision* was.

We scoped it in one working session: which client, what number, what to say, what to do
if they walked. Margin recovered in two cycles. The report found the pattern; the
conversation made the call.

That's GoldFin Advisory: me, reading your numbers with you, turning what the briefing
flags into the steps forward — scoped to your business, priced to your business.

If there's a decision like that sitting in your briefing right now, reply with
**"ADVISORY"** and two sentences about it. I'll tell you honestly whether it needs a
session or just a sharper look at next month's report.

— Chris Sam

## Email A4 — The direct invitation (after 2+ cycles, no reply)

**Subject:** An invitation, plainly  
**Preview:** For the decisions the briefing keeps pointing at.

Hi {{firstName}},

You've had a few briefings now, so you know what the rhythm does — and where it stops.

Here's the invitation, plainly. **GoldFin Advisory** is me working with you directly:

- A working session on your actual numbers — not a template, your ledger
- The analysis behind the pattern: pricing, margin, cash, concentration, hiring
- The steps forward, written down: what to do, in what order, and what to watch next
- Follow-through in your monthly briefings — we track whether it worked

It is not for everyone, and I keep it to a small number of businesses each quarter so
the reading stays real. There's no pricing page: scope and price depend on the size and
shape of the business, and I'd rather tell you "you don't need this yet" than sell you
a session you don't need.

→ **Reply with "ADVISORY" and two sentences about the business.** I'll come back within
one business day with either a scoped proposal or an honest "not yet."

— Chris Sam, GoldFin Desk

## Ascension rules

- Never send A-track emails to non-subscribers; never send the sales spine to
  subscribers.
- No more than one A-track email per week. The monthly briefing itself is the main
  touch; the A-track rides alongside it, never over it.
- Every A-track email may mention only ONE offer: Advisory. Reports is already bought;
  the Vault is history.
- The reply is the application. Chris answers every "ADVISORY" reply personally within
  one business day. Speed of the personal reply is the highest-converting element in
  the entire ladder — protect it.
- If an Advisory conversation ends in "not yet," schedule a single follow-up keyed to
  the specific decision ("when the hire comes back on the table, reply HIRE").
- Churn save: if a Reports subscriber cancels, send one email offering the exports and
  asking one question — "what did the briefing not answer?" Route any decision-shaped
  answer to the Advisory conversation.

## Ascension benchmarks

- A1 open rate: 70%+ (it's transactional-adjacent)
- Briefing → A2 click/read: 40%+
- ADVISORY reply rate from A3+A4 combined: 3–8% of subscribers
- Advisory conversation → scoped proposal: 50%+ (the reply filter does the qualifying)
- Proposal → close: 40%+ (custom-scoped, warm, personal)
