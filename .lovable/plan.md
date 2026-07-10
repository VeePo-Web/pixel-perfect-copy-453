# Launch prep: Plaid production secret + Resend domain for goldfindesk.com

Two independent tracks. Track 1 is a single secret entry in Lovable. Track 2 is DNS work you do at your domain registrar plus a verification click in the Resend dashboard — I can't add DNS records for you, but I'll give you the exact records to paste.

---

## Track 1 — Plaid production secret

### What you do in the Plaid dashboard
1. Log in at dashboard.plaid.com → top-left environment switcher → **Production**.
2. If Production shows "Request access": submit the access request (use-case + security review). Approval is typically 1–3 business days. You cannot get a Production secret until this is approved.
3. Once approved: **Team Settings → Keys → Production**. Copy the **Production secret** (not the sandbox one, not the client ID).
4. While you're there, on the API page confirm:
   - **Allowed redirect URIs** contains `https://goldfindesk.com/portal/accounts` (exact match, https, no trailing slash).
   - **Webhook URL** is set to `https://paarucbnaxorpxqjecrz.supabase.co/functions/v1/plaid-webhook`.
   - **Link customization** has the GoldFin logo and gold primary `#D4A845`.

### What I do in Lovable (build mode)
1. Open a secure secret form for `PLAID_PRODUCTION_SECRET` — you paste the Production secret from step 3 above. It never appears in code or chat.
2. **Do not flip `PLAID_ENV` to `production` yet.** We keep sandbox on until Stripe go-live is also ready, so we can smoke-test one thing at a time. When you say "flip it," I'll update `PLAID_ENV=production`; the shared client picks the new host + secret on the next invocation — no redeploy.
3. Smoke test: mint a link token from the portal → confirm real institution list (Chase/BofA/etc., not the Platypus sandbox banks). Do not exchange a token unless you intend a real connection.

The sandbox secret stays configured so regression tests still work.

---

## Track 2 — Resend domain: goldfindesk.com

Right now `send-email` sends from `Goldfin Desk <noreply@goldfindesk.com>` but the domain isn't verified in Resend, so mail lands in spam or is rejected outright.

### What you do
1. **Buy/own goldfindesk.com** — I assume you already do. If not, tell me and I'll add domain purchase as a step.
2. **Resend dashboard → Domains → Add domain** → enter `goldfindesk.com`. Choose region closest to your users (US East is fine for North America).
3. Resend shows you 4–6 DNS records. Copy each one exactly. They will look like this (values will differ — use Resend's exact output, not these):
   - **MX** `send.goldfindesk.com` → `feedback-smtp.us-east-1.amazonses.com` priority `10`
   - **TXT (SPF)** `send.goldfindesk.com` → `v=spf1 include:amazonses.com ~all`
   - **TXT (DKIM)** `resend._domainkey.goldfindesk.com` → long `p=MIGfMA0...` value
   - **TXT (DMARC, recommended)** `_dmarc.goldfindesk.com` → `v=DMARC1; p=none; rua=mailto:dmarc@goldfindesk.com`
4. **At your DNS provider** (Cloudflare, GoDaddy, Namecheap, wherever `goldfindesk.com` is hosted): add every record. If using Cloudflare, set proxy to **DNS only** (grey cloud) for these — proxied MX/TXT will fail.
5. Back in Resend → click **Verify DNS records**. Propagation is usually minutes; can take up to 72 hours. Wait until all rows are green.
6. In Resend → **Domain settings** → set the domain to **verified / primary**. Turn on **Click tracking** off and **Open tracking** off for transactional (they hurt deliverability). Turn on **DMARC alignment**.

### What I do in Lovable (build mode)
1. Update `supabase/functions/send-email/index.ts` and `send-template-email/index.ts` so `FROM_DEFAULT` is `Goldfin Desk <desk@send.goldfindesk.com>` (uses the verified `send.` subdomain — best-practice for transactional so a hard bounce doesn't damage the root domain's reputation). OTP login mail from `Goldfin Desk <login@send.goldfindesk.com>`. Advisory replies keep `Reply-To: chris@goldfindesk.com`.
2. Add unsubscribe headers on marketing-adjacent mail (`List-Unsubscribe`, `List-Unsubscribe-Post`) — the report unsubscribe function already exists, we just need to wire the header.
3. Re-deploy `send-email`, `send-template-email`, `cron-run-reports` (uses report-delivery), and the auth OTP function so they pick up the new sender.
4. Smoke test: send yourself an OTP and a sample report; verify (a) inbox not spam, (b) DKIM=pass, SPF=pass, DMARC=pass in the raw headers, (c) unsubscribe link works.

### Why the `send.` subdomain
- Isolates transactional reputation from anything you might do on the root (marketing, sales replies).
- Standard pattern used by Stripe (`stripe.com` sends from `bounces.stripe.com`), Linear, Notion.
- Zero deliverability cost — mail still shows as "from goldfindesk.com" in the reply-to and display name.

---

## Order of operations

```text
Now       You: request Plaid Production access (starts 1–3 day clock)
Now       You: add goldfindesk.com in Resend, copy DNS records
Now       You: paste DNS records at registrar
+15 min   You: click Verify in Resend
+15 min   Me:  update FROM addresses in email functions, redeploy, smoke-test OTP + report
+1–3 day  You: Plaid Production approved → copy Production secret
Then      Me:  open secret form for PLAID_PRODUCTION_SECRET; you paste it
Then      Me:  (on your go-ahead) flip PLAID_ENV=production, smoke-test real bank connect
```

## What I need from you to switch to build mode

Just approve the plan. On approval I'll:
1. Open the secure form for `PLAID_PRODUCTION_SECRET` (you can paste it whenever Plaid approves you — the form waits).
2. Update the email `FROM_DEFAULT` values and redeploy the functions so they're ready the moment Resend shows "Verified."

If `goldfindesk.com` is not yet purchased or is hosted somewhere unusual (Shopify DNS can't add MX/TXT freely — we'd need a workaround), tell me now so I can adjust the plan.
