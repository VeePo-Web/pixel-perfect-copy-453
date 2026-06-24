# 16 — Connect → First-Report Conversion Audit (the real portal UI on `main`)
## The frictionless, high-conversion moment the whole funnel exists for — audited against the Plaid Link research

> **Target:** the actual product frontend on `origin/main` — `src/pages/portal/{Dashboard,Accounts}.tsx`, `src/components/portal/PlaidLinkButton.tsx`. Audited against report 14 (Plaid Link conversion levers) + the hero-conversion/CXL doctrine.
> **Scope:** read-only audit. Frontend lives on `main` (Lovable-owned) — owner's model is hand-to-Lovable, so this is findings + a prioritized fix list, not edits.

---

## THE ONE FINDING THAT MATTERS MOST: nothing visibly happens at the aha moment

The product's entire promise is *"connect your bank → AI auto-builds your report."* But trace the real code:

1. `Dashboard` empty state → links to `/portal/accounts` (a navigation).
2. `Accounts` → `PlaidLinkButton` → Plaid Link → `plaid-exchange-public-token` → `onConnected` just **reloads the accounts list**.
3. `generate-advisory-report` is **never called from the UI.** `plaid-sync-transactions` is **never called from the UI** either. The Dashboard shows only "Net cash" (sum of balances) + "Connected accounts" count.

**So a user connects their bank and… sees a balance number and an account count. The report — the thing they came for, the thing the $99/mo buys — does not appear, does not start, is not even promised on-screen.** This is the single largest conversion leak in the product. The magic moment is missing.

**Fix (highest priority):** on first successful connect, immediately (a) call `plaid-sync-transactions`, then (b) call `generate-advisory-report`, with a designed "Building your first report…" state, then (c) reveal `AdvisoryReportView`. The aha moment must be: connect → watch it build → read the report. Everything below is secondary to this.

---

## CONNECT-MOMENT FINDINGS (vs report 14 Plaid Link levers)

### 🔴 1 — Link is not pre-initialized; the path to Link is 2 navigations + a token fetch
`PlaidLinkButton` fetches the link token in a `useEffect` on mount, and the button is `disabled` until `ready && linkToken`. The journey is: Dashboard → click "Connect a bank" → **navigate** to Accounts → page mounts → **fetch token** ("Preparing…") → button enables → click → Link opens.
- Report 14's #1 lever is **pre-initialize Link** (lower latency, higher conversion). Here Link isn't even initialized until the user has already navigated to a second page.
- A fast clicker hits a dead, disabled primary CTA ("Preparing…"). On slow connections that's an abandon.
**Fix:** put `PlaidLinkButton` directly in the Dashboard first-run state (skip the Accounts hop), and pre-fetch the link token on Dashboard mount so `open()` is instant. Never render a dead primary CTA — show an active affordance and open Link as soon as the token resolves.

### 🟠 2 — No pre-Link trust/expectation framing at the connect moment
Report 14: "conversion is highest when users have the right expectations going in" — why Plaid, the benefit, bank-level security, read-only, unlink anytime — *adjacent to the button*. The portal connect surfaces have one thin subline ("We never see your bank credentials"). The marketing site already has `TrustReassuranceBlock` + `PlaidExplanationSection` — that exact reassurance is absent at the in-portal connect moment where it matters most.
**Fix:** a compact pre-Link reassurance block beside the connect CTA (read-only · bank-level encryption · unlink anytime · "we never see your login"). Reuse the marketing pattern.

### 🟠 3 — CTA copy is generic, not first-person + outcome
"Connect a bank" / "Add another bank" name the *mechanism*, not the *outcome*. Hero-conversion doctrine: first-person + specific outcome. The payoff (the report) never appears in the CTA.
**Fix:** "Connect my bank & build my first report" (first-run) / "Connect my bank" (returning). The connect-flow-ux spec already calls for this.

### 🟠 4 — `onExit` is not handled: drop-off is neither recovered nor measured
`usePlaidLink({ token, onSuccess })` has **no `onExit`**. Report 14: instrument `onExit` to capture the drop-off step, and use Link Recovery for institution outages. Right now every abandon is invisible and unrecovered.
**Fix:** add `onExit` → log the exit step/error to analytics; offer a calm "pick up where you left off" retry.

### 🟡 5 — Errors are raw red technical strings
`PlaidLinkButton` renders `{error}` (e.g. "Failed", or a raw edge-function message) in `text-red-600`. Design-bible: human language, never expose technical strings; calm recovery.
**Fix:** map error states to human copy ("We couldn't reach your bank just now — try again in a moment"); never surface the raw edge-function error.

### 🟡 6 — Connect CTA isn't a mobile thumb-zone target
The button is a small inline pill (`px-6 py-2.5`), right-aligned in a flex row on Accounts. Report 14 Law 10 / mobile-craft: the primary connect CTA should be full-width, ≥48px, in the thumb zone on mobile.
**Fix:** full-width 48px primary CTA on `<768px`; keep the inline pill only on desktop.

### 🟡 7 — Frontend enables none of the link-token conversion options
`plaid-create-link-token` is called with only `{mode, itemId}`. Report 14 levers that need frontend/back coordination: pass `user.phone_number` (returning-user, zero data entry), brand the consent pane (logo + colors), embedded institution search. None are wired.
**Fix:** coordinate with the engine handoff (`docs/plaid-engine-fix-handoff.md`) — pass phone for returning users, brand the Link consent pane, enable institution pre-select where known.

---

## DASHBOARD / PAYOFF FINDINGS

### 🟠 8 — The Dashboard shows a balance, not the report
Post-connect, `Dashboard` surfaces "Net cash" (sum of depository balances) + "Connected accounts." Useful, but it is **not the product.** The advisory report (`AdvisoryReportView` exists!) is not surfaced on the home screen. The owner's recurring value moment — "am I okay, what do I do" — is one component away and not shown.
**Fix:** the Dashboard's primary content for a connected user is the latest `AdvisoryReportView` (or its "one number" + verdict + "read full report"). Balances are secondary.

### 🟡 9 — No "report is generating / ready" status anywhere
There's no surface for report state (generating / ready / failed), despite `advisory_reports.status` existing. The user has no idea a report is coming.
**Fix:** a report-status strip ("Your next report builds from your latest sync") + a notification when ready.

---

## PRIORITIZED FIX LIST (for Lovable, all on `main`)

| # | Fix | Files | Why |
|---|---|---|---|
| 1 | **Trigger sync + report on first connect; reveal it** | `PlaidLinkButton` `onSuccess`, `Dashboard` | The aha moment is currently empty — this IS the product |
| 2 | Pre-initialize Link + connect from Dashboard (no Accounts hop) | `Dashboard`, `PlaidLinkButton` | Report-14 #1 conversion lever; removes 2 steps + dead-CTA latency |
| 3 | Pre-Link trust framing at the button | `Dashboard`/`Accounts` + reuse `TrustReassuranceBlock` | Expectation-setting is the top drop-off fix |
| 4 | First-person outcome CTA copy | `PlaidLinkButton` props | Names the payoff, not the mechanism |
| 5 | `onExit` instrumentation + recovery | `PlaidLinkButton` | Abandons are invisible + unrecovered today |
| 6 | Human error copy (no raw strings) | `PlaidLinkButton` | Trust at the most fragile moment |
| 7 | Full-width thumb-zone CTA on mobile | connect surfaces | 58% of traffic; report-14 Law 10 |
| 8 | Surface the report on the Dashboard | `Dashboard` + `AdvisoryReportView` | The recurring value moment is hidden |
| 9 | Link-token conversion options (phone, branded pane, institution search) | `plaid-create-link-token` + button | Documented lifts (report 14) |

---

## BOTTOM LINE

The connect plumbing works, but the **conversion choreography is missing the payoff**: a user connects their bank and the report — the entire reason they're here — is never triggered or shown. Fixing that one thing (sync + generate + reveal on connect), plus pre-initializing Link and framing trust at the button, is the highest-leverage conversion work in the product. It turns "I connected my bank and saw my balance" into "I connected my bank and 60 seconds later read a CFO-grade report about my business" — which is the promise the whole funnel sells.
