## Flip Plaid to production

### What I'll change

1. **Set `PLAID_ENV=production`** as a runtime secret. Currently absent, so `plaidEnv()` defaults to `sandbox`. Once set, all edge functions (`plaid-create-link-token`, `plaid-exchange-public-token`, `plaid-webhook`, `cron-run-reports` account refresh) route to `https://production.plaid.com` and read `PLAID_PRODUCTION_SECRET`.

2. **Verify `PLAID_PRODUCTION_SECRET` is present.** The current secrets listing shows `PLAID_SANDBOX_SECRET` and `PLAID_CLIENT_ID` only — no `PLAID_PRODUCTION_SECRET`. If it's actually missing despite your earlier note, I'll request it via the secure form (one-time paste, never echoed).

3. **Update `PlaidLinkButton.tsx` env hint.** The component currently shows a "Sandbox" banner when `PLAID_ENV !== production`. After the flip, the banner disappears automatically — no code change needed, but I'll double-check the conditional reads from a fresh server call.

4. **Smoke test in production.**
   - Call `plaid-create-link-token` and confirm the returned `link_token` starts with `link-production-…` (sandbox tokens start with `link-sandbox-…`).
   - Confirm the `plaid-webhook` URL registered on Plaid's production dashboard matches our edge function URL. If not, I'll show you the exact URL to paste into Plaid Dashboard → Team Settings → Webhooks.

5. **Document the rollback.** Add a one-liner to `docs/plaid-sandbox-setup.md`: set `PLAID_ENV=sandbox` to revert instantly; no code redeploy required.

### What I will NOT change

- No schema changes. `plaid_items` / `plaid_accounts` already store production data identically.
- No client code paths beyond removing the sandbox banner (which auto-hides).
- Stripe stays in sandbox until you say otherwise.

### Open question before I execute

`PLAID_PRODUCTION_SECRET` does not appear in the current secrets listing. Two possibilities:
- (a) It's set in the **production** environment slot, not the dev one I can see → flipping `PLAID_ENV` will just work.
- (b) It was never added → I'll need you to paste it once via the secure form.

I'll attempt the flip; if Plaid returns `INVALID_API_KEYS`, I'll prompt for the secret. Approve and I'll proceed.