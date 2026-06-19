# FAQ — Content & Schema

**DECISION-MAKING REFERENCE ONLY. Does not render anything.**

The FAQ section's job is to handle every objection in `ideal-customer.md`
with direct, honest answers. Each Q&A is also emitted as `FAQPage`
JSON-LD structured data.

---

## Rules

- Use Claire's exact phrasing in the questions. If she would think
  *"Is this a CFO replacement?"*, the FAQ question reads exactly that.
- Lead the answer with the conclusion. Then 1–2 sentences of context.
- Never duck a price or fit question. Premium products are honest
  about who they aren't for.
- No marketing puffery in FAQ answers. This is the credibility section.

---

## The canonical FAQ set

### Q: Is this a CFO replacement?
A: No. The Monthly Finance Desk is the layer before a full CFO. It's
built for owners who need more than bookkeeping and once-a-year tax
conversations, but aren't ready to hire a full-time finance leader.

### Q: How is this different from QuickBooks?
A: QuickBooks records what happened. The Monthly Finance Desk turns
that activity into a recurring review process — structured
spreadsheets, written interpretation every two weeks, and a monthly
strategy conversation.

### Q: Do I have to fire my bookkeeper?
A: No. Keep your bookkeeper. This sits on top of clean books and adds
interpretation and rhythm. If you don't have a bookkeeper yet, we'll
tell you when you need one.

### Q: Why $1,500 a month?
A: Less than hiring a fractional CFO ($3K–$10K+/month). More strategic
than a template. More personal than a dashboard. More consistent than
waiting until tax season.

### Q: Will I have to connect my bank account?
A: Not to try it. The sample briefing on the homepage uses demo data,
and you can use rough non-sensitive numbers in the prompt. Bank
connection (via Plaid) only happens after you've applied, been
accepted, and started onboarding.

### Q: Is my financial data safe?
A: Bank data is connected through Plaid, which is read-only and uses
tokens — we never see or store your bank login. We don't sell, share,
or use your data to train AI models. Full details on the Privacy & Data
Handling page.

### Q: What does AI actually do here?
A: AI helps organize and categorize financial activity inside the
spreadsheet structure faster than doing it manually. It does not write
your monthly briefing alone — Chris reviews every briefing before it
goes out.

### Q: Who is Chris Sam?
A: Founder of the Monthly Finance Desk. Institutional finance
background. Built the offer for the businesses he wished had a real
finance rhythm — the ones too big for templates, too small for a CFO.

### Q: How big does my business need to be?
A: Best fit is roughly $30K–$250K/month in revenue, 3–30 team members,
and an existing accounting setup that you've outgrown. Smaller than
that, start with the free templates.

### Q: What happens in the monthly call?
A: One hour. Review the last month's briefings, look at the questions
the data raised, and talk through the financial decisions coming up
in the next 30–60 days. No deck. No theatre. A serious conversation
about your business.

### Q: What if I cancel?
A: Month-to-month. Cancel any time before the next billing cycle.
We'll send a final wrap-up briefing and you keep all your spreadsheets.

### Q: How long does onboarding take?
A: Typically 7–14 days. We map your existing setup, connect Plaid,
seed your spreadsheet system, and send your first briefing in the
second week.

---

## Structured data

Emit `FAQPage` JSON-LD with every Q&A above. Validate via Google's
Rich Results Test before each deploy. Never include answers that
contradict marketing copy elsewhere on the site.
