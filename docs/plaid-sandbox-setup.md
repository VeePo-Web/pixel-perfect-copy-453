# GoldFin Desk — Plaid Sandbox Setup & Provisioning Runbook
## The exact steps to provision Plaid before any integration code can run

> **This is the hard blocker.** No Plaid edge function, sync, or connect flow can run until a Plaid account exists and these env vars are set. Do this first; then `docs/plaid-build-plan.md` Phase 0 becomes mechanical.
> **Persona:** `personas/plaid-architect.md` · **Architecture:** `docs/plaid-integration-spec.md`
> **Product reality:** GoldFin Desk is today a marketing site (no product app/auth/dashboard yet). The bank-connect lives in the *future* authenticated product surface — but the Plaid account, keys, and Sandbox testing can be set up and validated now.

---

## 0. What you (the human) must do — the 10-minute checklist

- [ ] **Create a Plaid account** at [dashboard.plaid.com/signup](https://dashboard.plaid.com/signup). Sandbox is free and unlimited for testing; no credit card.
- [ ] In the dashboard, grab **Client ID** + **Sandbox secret** (Team Settings → Keys).
- [ ] Enable the **Transactions** product (Products page). For later: Balance, Liabilities, Statements.
- [ ] Add the env vars below to **Supabase → Project Settings → Edge Functions → Secrets** (server-side only — never in `.env` that ships to the client, never `VITE_`-prefixed).
- [ ] Decide **report cadence** (monthly vs bi-weekly) and **whether statement-upload fallback ships in MVP** — these gate Phase 0/1.
- [ ] When ready for live data: complete **Production access** request in the dashboard (Plaid reviews use-case + security). Sandbox → Production is the path; the old Development env is retired.

> Plaid publishes **no public list pricing** — Transactions is a per-connected-Item monthly subscription negotiated on volume. Get a sales quote before modeling unit economics. Sandbox is free, so all of Phase 0–2 can be built and tested at $0.

---

## 1. Environment variables (Supabase Edge Function secrets)

```
PLAID_CLIENT_ID          = <from dashboard>
PLAID_SECRET             = <Sandbox secret>      # swap to Production secret at go-live
PLAID_ENV                = sandbox               # sandbox → production
PLAID_WEBHOOK_URL        = https://<project-ref>.functions.supabase.co/plaid-webhook
PLAID_REDIRECT_URI       = https://app.goldfindesk.com/connect/oauth   # for OAuth banks (register in dashboard)
TOKEN_ENCRYPTION_KEY     = <pgsodium/Vault key id or 32-byte key>      # encrypts access_token at rest
```

- **Never** expose `PLAID_SECRET` or `access_token` to the browser. The only thing the client ever sees is a short-lived `link_token` (Phase 1) — never the `access_token`.
- `PLAID_REDIRECT_URI` must be **registered in the Plaid dashboard** (API → Allowed redirect URIs) and must match exactly, or OAuth banks fail.
- `PLAID_WEBHOOK_URL` points at the `plaid-webhook` edge function; Plaid posts `SYNC_UPDATES_AVAILABLE` / `ITEM_LOGIN_REQUIRED` there.

---

## 2. Dashboard configuration

| Setting | Where | Value |
|---|---|---|
| Allowed redirect URIs | API page | `https://app.goldfindesk.com/connect/oauth` (+ a localhost one for dev) |
| Webhook URL | API page / per-Item | the `plaid-webhook` function URL (signature-verified in code) |
| Enabled products | Products page | Transactions (Phase 0); Balance, Liabilities, Statements later |
| Link customization | Link → Customization | upload GoldFin logo + set primary to **gold** (`#D4A845`); this is an explicit conversion lift |
| Account select | Link customization | enable, default to "credit + depository" so a Visa card and a checking account both connect |

---

## 3. Sandbox test credentials (for Phase 0 end-to-end)

When you open Plaid Link in Sandbox, use these:

- **Institution:** search any (e.g. "First Platypus Bank", "Tartan Bank" for OAuth testing).
- **Username:** `user_good`  ·  **Password:** `pass_good`
- **MFA code (if prompted):** `1234`
- **Force specific states for testing:** username `user_custom` lets you inject a custom transactions JSON; `error_*` usernames force error paths (great for testing the never-dead-end recovery UX).
- **Webhook firing:** in Sandbox, use `/sandbox/item/fire_webhook` or `/transactions/refresh` to trigger `SYNC_UPDATES_AVAILABLE` on demand.

---

## 4. The first-call sanity test (proves the keys work before any UI)

A throwaway Sandbox check the architect runs first — confirms credentials before building anything:

```
POST https://sandbox.plaid.com/sandbox/public_token/create
  { client_id, secret, institution_id: "ins_109508", initial_products: ["transactions"] }
→ public_token
POST /item/public_token/exchange  { client_id, secret, public_token }  → access_token
POST /transactions/sync           { client_id, secret, access_token }  → added[] transactions
```

If `added[]` returns transactions, the keys, env, and product access are correct → Phase 0 can proceed. If it errors, the message names the exact misconfig (bad key, product not enabled, wrong env).

---

## 5. Verification checklist (Plaid env is ready)

- [ ] `PLAID_CLIENT_ID` / `PLAID_SECRET` / `PLAID_ENV=sandbox` set in Supabase secrets.
- [ ] Transactions product enabled.
- [ ] Redirect URI + webhook URL registered in the dashboard.
- [ ] The §4 sanity test returns `added[]` transactions.
- [ ] Link customization: GoldFin logo + gold primary uploaded.

When all five are ✓, fire: **"Plaid Architect — build Phase 0 sandbox spike"** (`docs/plaid-build-plan.md`).

---

## 6. Why this is the blocker (the honest constraint)

A world-class Plaid build does not write integration code before the Sandbox exists, because every edge function (`plaid-link-token`, `plaid-exchange-token`, `plaid-sync`, `plaid-webhook`) needs these secrets to run and be verified — and the persona's Law 10 forbids claiming "done" without running it. Provisioning the Sandbox (free, ~10 minutes) turns Phase 0 from "unverifiable scaffold" into "runnable, testable, shippable." This runbook is the one thing only the account owner can do; everything after it is the architect's job.

---

## 7. Going to production

The codebase supports production with **one env flip**, no code changes. Order matters:

1. **Request Production access** in the Plaid dashboard. Plaid reviews use-case + security; approval typically 1–3 business days.
2. **Add `PLAID_PRODUCTION_SECRET`** as an edge function secret (do NOT delete `PLAID_SANDBOX_SECRET` — sandbox regression tests still use it).
3. **Add `PLAID_REDIRECT_URI`** as an edge function secret — full public URL of the OAuth return route, e.g. `https://app.goldfindesk.com/portal/accounts`. Must be registered verbatim in Plaid dashboard → API → Allowed redirect URIs, including the exact scheme, host, and path. Required for OAuth banks (Chase, Wells, Capital One, etc.); harmless in sandbox.
4. **Register the webhook URL** in the Plaid dashboard (API → Webhooks): `https://<project-ref>.functions.supabase.co/plaid-webhook`. With this set, Plaid signs each webhook with a `plaid-verification` JWT — the function verifies it against Plaid's JWKS automatically. `PLAID_WEBHOOK_SECRET` remains the fallback for internal/sandbox tooling.
5. **Flip `PLAID_ENV=production`**. The shared client switches host + secret on the next invocation. No deploy needed beyond the secret update.
6. **Smoke test**: as a real user, mint a link token via the app's "Connect a bank" button and confirm the Plaid Link modal opens against a real institution list (not the Platypus sandbox set). Do not exchange unless you intend a real connection.
7. **Existing sandbox `plaid_items` will not work** against production (different access tokens). If any test users have sandbox connections, expect them to reconnect.

The sandbox-only edge functions (`plaid-sandbox-public-token`, `plaid-sandbox-fire-webhook`) refuse to run when `PLAID_ENV !== "sandbox"` and log a warning if called, so production cannot accidentally mint fake tokens.

