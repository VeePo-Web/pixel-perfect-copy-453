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
- Links (replace `{{SITE_URL}}` with the live domain):
  - Vault / templates: `{{SITE_URL}}/templates`
  - Sample briefing (proof): `{{SITE_URL}}/sample-briefing`
  - **GoldFin Reports $150/mo (primary upgrade): `{{SITE_URL}}/pricing#auto-fill`**
  - GoldFin Advisory (custom-scoped consultation, by application): `{{SITE_URL}}/apply`
- One idea, one primary CTA per email. Every email earns the next open.

---

## Email 1 — Deliver the Vault (Day 0, automated)

**Subject:** Your GoldFin Template Vault is inside
**Preview:** Plus the one number most owners check that quietly lies to them.

Hi {{firstName}},

Here's your GoldFin Template Vault — cash flow, monthly review, expense audit, hiring
affordability, subscription tracker, and tax reserve. Open it, drop in your numbers, and
you'll see the business more clearly in about ten minutes.

→ **Open my Vault:** {{SITE_URL}}/templates

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
consultation scoped and priced uniquely to the business after application:
{{SITE_URL}}/apply

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
| Advisory-fit lead | Clicked `/apply`, replied, or selected larger-business signals | "This is Chris Sam consultation, scoped to the business." | Invite application; do not push checkout. |
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
| Clicks apply | +45 |
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

**Timing:** Trigger immediately after `/apply` click or high-intent reply.  
**Subject:** For bigger decisions  
**CTA:** `{{SITE_URL}}/apply`

Hi {{firstName}},

If you are dealing with a bigger decision — hiring, pricing, cash reserves, margin
pressure, taxes, or a month where the numbers are technically fine but still hard to read
— Reports may not be the whole answer.

That is where GoldFin Advisory fits. It is custom-scoped consultation with Chris Sam:
your numbers read with you, the actual tradeoffs named, and the next decision made
clearer.

→ **Apply for GoldFin Advisory:** {{SITE_URL}}/apply

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

If the business is larger and you want Chris Sam reading the numbers with you, use this:

→ **Apply for GoldFin Advisory:** {{SITE_URL}}/apply

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
