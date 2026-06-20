# GoldFin Template Vault → GoldFin Reports ($99/mo) Email Sequence

Brunson soap-opera sequence. Job: take a free **GoldFin Template Vault** lead and walk
them, over ~7 days, to the **$99/mo GoldFin Reports** upgrade (the bread-and-butter,
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
  - Vault / templates: `{{SITE_URL}}/#/templates`
  - Sample briefing (proof): `{{SITE_URL}}/#/sample-briefing`
  - **GoldFin Reports $99/mo (primary upgrade): `{{SITE_URL}}/#/pricing#auto-fill`**
  - GoldFin Advisory ($1,500, application): `{{SITE_URL}}/#/apply`
- One idea, one primary CTA per email. Every email earns the next open.

---

## Email 1 — Deliver the Vault (Day 0, automated)

**Subject:** Your GoldFin Template Vault is inside
**Preview:** Plus the one number most owners check that quietly lies to them.

Hi {{firstName}},

Here's your GoldFin Template Vault — cash flow, monthly review, expense audit, hiring
affordability, subscription tracker, and tax reserve. Open it, drop in your numbers, and
you'll see the business more clearly in about ten minutes.

→ **Open my Vault:** {{SITE_URL}}/#/templates

One thing before you go. Most owners check the **bank balance** to feel safe. It's the
fastest number to find — and the most misleading. It tells you what's *left*. It says
nothing about what's *coming*: payroll, taxes, the vendor invoice that hasn't cleared,
the client who pays late.

Over the next five days I'll send one short email showing how owners actually use each
template to make real decisions — hiring, pricing, cash reserves. No spam. Just the
thinking.

— Chris Sam, GoldFin Desk

**P.S.** If you'd rather not fill these in yourself every month, that's exactly what
GoldFin Reports does for $99/mo. More on that later in the week.

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

→ **See a sample briefing:** {{SITE_URL}}/#/sample-briefing

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

→ **See how GoldFin Reports works — $99/mo:** {{SITE_URL}}/#/pricing#auto-fill

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

→ **Have it filled for you every month — $99/mo:** {{SITE_URL}}/#/pricing#auto-fill

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

→ **Auto-fill my reports — $99/mo:** {{SITE_URL}}/#/pricing#auto-fill

— Chris Sam

**P.S.** Tomorrow I'll lay out the offer plainly — what you get, what it costs, and the
no-risk way to try it.

---

## Email 6 — The direct offer (Day 7)

**Subject:** Have your reports filled for you — $99/mo
**Preview:** The Vault, done for you, every month. Cancel anytime.

Hi {{firstName}},

You've had the Vault for a week. If you've used it, you already know two things: it helps,
and keeping it current every month is work you'll quietly stop doing. That's the honest
trap of free templates — the value is real, and so is the maintenance.

**GoldFin Reports** removes the maintenance. For **$99/month** you get, every month:

- Every template **filled from your numbers** — no spreadsheet work *(~$120/mo of work)*
- A monthly **cash-flow summary** *(~$60)*
- An **expense-change report** *(~$45)*
- A **subscription & recurring-cost tracker** *(~$30)*
- A **revenue snapshot** *(~$30)*
- A monthly **plain-English PDF briefing** *(~$75)*
- An **owner action list** *(~$40)*
- **Spreadsheet export — always yours**

That's **$400+/month of work and interpretation for $99.** Try one month. If it's not
clearer, cancel before your next billing cycle — no friction. No bank connection required
to start; when you connect, it's read-only and we never move money.

→ **Auto-fill my reports — $99/mo:** {{SITE_URL}}/#/pricing#auto-fill

— Chris Sam, GoldFin Desk

**P.S.** Running something larger and want a person reading the numbers *with* you each
month? That's GoldFin Advisory — by application: {{SITE_URL}}/#/apply

---

## After the sequence (optional)
- Non-openers of Email 6 → resend with a new subject 3 days later ("One number worth $99").
- Clicked $99 but didn't subscribe → a single cart-style nudge with the guarantee restated.
- Subscribed → stop the sequence, start onboarding.
