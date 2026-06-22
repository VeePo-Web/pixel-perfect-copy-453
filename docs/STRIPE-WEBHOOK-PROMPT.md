# BUILD PROMPT — Stripe Billing Source of Truth (`stripe-webhook`)

> Self-contained engineering spec for **Claude B — Checkout Backend & Analytics**.
> Precursor to implementation in the same session. Owns: `supabase/functions/**`
> (except the Lovable-generated `create-checkout`), money/identity migrations,
> and backend plumbing. Never touches conversion UI (`src/components/**`) or copy.

---

## ROLE & MISSION

You are the principal payments engineer for the GoldFin Desk funnel
(`pixel-perfect-copy-453`). Lovable's built-in Stripe generates `create-checkout`
and charges the card. Your mission is the part Lovable does **not** build: the
**billing source of truth**. A Stripe `create-checkout` redirect and the
optimistic `purchase_completed` analytics event are not proof of payment — only a
**signature-verified webhook** is. Build it.

**The creed:** money is recorded append-only and idempotently; every paying
customer is provable from a row, not from memory; the backend fails **safe and
loud** (throws → Stripe retries) while the buyer-facing app fails soft and kind.

---

## WHAT TO BUILD

1. **Migration** (`supabase/migrations/<ts>_billing.sql`) — additive, forward-only:
   - `billing_events` — the idempotency ledger (one row per Stripe event).
   - `subscriptions` — the customer billing-state source of truth.
   - Both **RLS-enabled, deny-by-default** (no anon/authenticated policies; the
     edge function uses the service role, which bypasses RLS).
2. **Edge function** (`supabase/functions/stripe-webhook/index.ts`) — Deno, matching
   the `send-template-email` idiom: verifies the Stripe signature, records the event
   idempotently, updates `subscriptions`, notifies the operator of a new signup, and
   tracks cancellations/refunds.
3. **`supabase/config.toml`** — add `[functions.stripe-webhook] verify_jwt = false`
   (Stripe calls with no Supabase JWT).
4. **Docs** — operator runbook: how to register the endpoint + which secrets to set.

No frontend change. The optimistic event already ships in `src/lib/analytics.ts`.

---

## HARD CONSTRAINTS

- **Do NOT touch `create-checkout`** — Lovable owns/generates it. Different file,
  no collision.
- **Single Stripe account** (not the dual sandbox/live COG model). One
  `STRIPE_SECRET_KEY`, one `STRIPE_WEBHOOK_SECRET`.
- **Signature verification is mandatory** — use the Stripe SDK's async +
  SubtleCrypto verification (Deno has no Node crypto). Unverified → `400`, reject.
- **Idempotency keyed by Stripe `event.id`** — record into `billing_events` with
  on-conflict-ignore; short-circuit `200` if already `processed_at`. Handlers must
  be safe to run twice (upserts, not blind inserts).
- **Fail loud, retryable:** on handler error, store `processing_error`, clear
  `processed_at`, return **500** so Stripe retries. On success, set `processed_at`,
  return `200`.
- **Never trust client metadata for identity** — resolve the customer/subscription
  from the Stripe objects in the event.
- **RLS deny-by-default** on both tables; only the service role reads/writes.
- **Migration is additive & forward-only** — never reorder/rewrite an existing
  migration; coordinate with Lovable as shared schema owner. Filename timestamp
  must sort **after** the latest existing migration.
- **Email is best-effort** — a missing `RESEND_API_KEY` must NOT fail the webhook;
  the DB row is the source of truth, the email is a notification.
- Repo idioms: Deno `Deno.serve`, `corsHeaders`, graceful-when-unkeyed (see
  `send-template-email`), Resend for email, hash-routed React/Vite frontend.

---

## DATA MODEL

```sql
-- billing_events: idempotency ledger, one row per Stripe event
id                uuid pk default gen_random_uuid()
stripe_event_id   text unique not null     -- idempotency key
type              text not null
payload           jsonb not null
processed_at      timestamptz              -- null until handled OK
processing_error  text
created_at        timestamptz default now()

-- subscriptions: billing-state source of truth, one row per Stripe subscription
id                     uuid pk default gen_random_uuid()
stripe_customer_id     text
stripe_subscription_id text unique          -- upsert key
email                  text
plan                   text                 -- "auto-fill-monthly"
status                 text                 -- active | trialing | past_due | canceled | ...
amount_cents           integer
currency               text default 'usd'
current_period_end     timestamptz
canceled_at            timestamptz
created_at             timestamptz default now()
updated_at             timestamptz default now()
-- indexes: stripe_customer_id, status, email
-- RLS enabled, NO policies (deny-by-default; service role bypasses)
```

---

## EVENT HANDLING

| Stripe event | Action |
|---|---|
| `checkout.session.completed` | Resolve customer email + subscription id; **upsert** `subscriptions` (status `active`/`trialing`); fire **operator "new paying customer" email** (best-effort). |
| `customer.subscription.updated` | Upsert `status`, `current_period_end`, `canceled_at` (from `cancel_at`/`canceled_at`). |
| `customer.subscription.deleted` | Mark `status='canceled'`, set `canceled_at` (churn). |
| `invoice.paid` | Update `current_period_end` (renewal); keep `status='active'`. |
| `invoice.payment_failed` | `status='past_due'` (dunning signal, not instant cancel). |
| `charge.refunded` | Note refund for churn/finance (best-effort log). |
| _other_ | Recorded in `billing_events`, no-op handler, `200`. |

---

## WEBHOOK ALGORITHM (exact order)

```
1. OPTIONS  -> 200 cors
2. method != POST -> 405
3. body = await req.text()              // raw text REQUIRED for signature
4. sig  = header "stripe-signature"
5. event = await stripe.webhooks.constructEventAsync(
             body, sig, STRIPE_WEBHOOK_SECRET,
             undefined, Stripe.createSubtleCryptoProvider())
   // throws -> 400 (loud, rejected)
6. insert billing_events {event.id, type, payload} on-conflict(stripe_event_id) ignore
   - if existing row has processed_at -> return 200 (idempotent short-circuit)
7. try { handle(event) ; set processed_at=now() ; return 200 }
   catch { set processing_error=msg ; clear processed_at ; return 500 } // Stripe retries
```

---

## SECRETS (operator sets in Supabase/Lovable; never in repo)

| Secret | Who sets | Purpose |
|---|---|---|
| `STRIPE_SECRET_KEY` | Lovable (on connect) | Stripe API |
| `STRIPE_WEBHOOK_SECRET` | Operator (after registering endpoint) | `whsec_…` signature verify |
| `RESEND_API_KEY`, `RESEND_FROM` | Operator (already used for email) | operator notification |
| `OPERATOR_EMAIL` | Operator | where "new customer" alerts go |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Auto (Supabase) | service-role DB writes |

**Endpoint to register in Stripe:**
`https://<project-ref>.supabase.co/functions/v1/stripe-webhook`
Events: `checkout.session.completed`, `customer.subscription.updated`,
`customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`,
`charge.refunded`.

---

## VERIFICATION GATE (before "done")

- `npx tsc -p tsconfig.app.json --noEmit` green (frontend unaffected).
- `npx vite build` green.
- Edge function: read-through confirms the algorithm order, idempotent upsert,
  signature-verify-before-trust, 500-on-error-for-retry, graceful email.
- State honestly what cannot be verified locally (real Stripe delivery, Deno
  runtime) and give the operator an exact test script (Stripe CLI `stripe listen`
  + `stripe trigger checkout.session.completed`).

## OUT OF SCOPE (other lanes)

- The `create-checkout` function (Lovable).
- Any pricing/checkout **UI** or success **screen** (Claude A — conversion).
- A full admin/reconciliation console (future; the rows are query-ready now).
