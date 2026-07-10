# Resend domain setup on Vercel DNS for goldfindesk.com

Vercel DNS handles this cleanly — no proxy toggles like Cloudflare, no legacy record-type limits like Shopify. The steps are mechanical.

---

## Step 1 — Resend: add the domain (you, 2 min)

1. Resend dashboard → **Domains → Add Domain** → `goldfindesk.com`.
2. Region: **US East** (lowest latency for North American recipients; can't be changed later without re-verifying).
3. Toggle **"Use a subdomain (recommended)"** ON, subdomain = `send`. This makes Resend generate records for `send.goldfindesk.com` — the standard for transactional isolation.
4. Resend displays 3 records to add: **MX**, **SPF TXT**, **DKIM TXT**. Leave that tab open.

---

## Step 2 — Vercel: add the DNS records (you, 5 min)

1. Vercel dashboard → **Domains → goldfindesk.com → DNS records**.
2. For each row Resend shows, click **Add** in Vercel and paste it. Vercel's UI:
   - **MX** → Type MX, Name `send`, Value `feedback-smtp.us-east-1.amazonses.com` (whatever Resend shows), Priority `10`, TTL `60`.
   - **SPF TXT** → Type TXT, Name `send`, Value `v=spf1 include:amazonses.com ~all`, TTL `60`.
   - **DKIM TXT** → Type TXT, Name `resend._domainkey` (Resend will give the exact name — could be `resend._domainkey.send` — copy verbatim), Value = the long `p=MIGf...` string, TTL `60`.
3. Add DMARC manually — Resend doesn't generate this one:
   - Type TXT, Name `_dmarc`, Value `v=DMARC1; p=none; rua=mailto:chris@goldfindesk.com; adkim=s; aspf=s`, TTL `60`.
   - `p=none` for the first 30 days to observe; we tighten to `p=quarantine` after we confirm no legitimate mail is failing.

Vercel-specific gotchas:
- **Do not include `goldfindesk.com` in the Name field.** Vercel appends the domain automatically. If Resend says `send.goldfindesk.com`, you type `send` in Vercel. If it says `resend._domainkey.goldfindesk.com`, type `resend._domainkey`.
- Vercel accepts TXT values without wrapping quotes — paste the raw string.
- If a record already exists (rare, but sometimes an old SPF on root), don't create a duplicate; edit the existing one and merge includes.

---

## Step 3 — Verify (you, 2–15 min)

1. Resend → domain page → **Verify DNS records**.
2. Vercel DNS usually propagates in under 5 minutes. If any row is still red after 15 min, click Verify again. Occasionally DKIM lags — up to 1 hour is normal, 72 hours is the outer bound.
3. When all three (MX, SPF, DKIM) are green, the domain shows **Verified** — mail can send.

---

## Step 4 — Resend deliverability settings (you, 1 min)

While in the Resend domain settings:
- **Click tracking: OFF** for transactional. Rewritten links hurt inbox placement.
- **Open tracking: OFF** for transactional. Same reason + privacy.
- **Custom Return-Path**: enable if offered — improves SPF alignment.

---

## Step 5 — Codebase updates (me, in build mode, after you say verified)

1. Update `supabase/functions/send-email/index.ts`: `FROM_DEFAULT` → **still pending your answer** (see question below).
2. Update `supabase/functions/send-template-email/index.ts` same way.
3. Update `supabase/functions/send-login-otp/index.ts` sender to `Goldfin Desk <login@…>`.
4. Update `_shared/report-delivery.ts` / `report-email.ts` sender for bi-weekly briefings to `Goldfin Desk <reports@…>`.
5. Add `List-Unsubscribe` + `List-Unsubscribe-Post` headers to briefing emails (unsubscribe function already exists at `email-unsubscribe`).
6. Redeploy: `send-email`, `send-template-email`, `send-login-otp`, `cron-run-reports`, `resend-webhook`.
7. Smoke test: send myself an OTP + trigger a sample report; check raw headers show `dkim=pass spf=pass dmarc=pass` and inbox placement (not Promotions, not Spam).

---

## One question I still need answered before I can wire the FROM address

Which visible sender do you want in the recipient's inbox?

**Option A (recommended):** `Goldfin Desk <desk@goldfindesk.com>`
- Looks like it came from the root domain. Cleaner, more premium.
- Sent through the verified `send.` subdomain under the hood (Return-Path is `bounces@send.goldfindesk.com`) — recipient never sees this.
- Requires one extra SPF record on the root: TXT at name `@` value `v=spf1 include:amazonses.com ~all`. I'll add this to the Vercel steps if you pick A.

**Option B:** `Goldfin Desk <desk@send.goldfindesk.com>`
- Literally shows the `send.` subdomain to recipients. Less pretty but zero extra DNS.
- Every other pro shop (Stripe, Linear, Notion) uses Option A. I'd pick A.

Tell me A or B and I'll switch to build mode and execute Step 5.
