# GoldFin Desk — Connect-Flow UX & Microcopy Spec
## The build-ready design for the highest-conversion bank-connect moment

> **The connect is the conversion.** Connecting a bank is the highest-fear, highest-effort act in the product; it sits on the activation path. Every detail here exists to make the customer *want* it.
> **Persona:** `personas/plaid-architect.md` · **Architecture:** `docs/plaid-integration-spec.md` · **Setup:** `docs/plaid-sandbox-setup.md`
> **Where it lives:** the *future* authenticated product app (today GoldFin Desk is a marketing site; the connect surface ships when the app/dashboard exists). Built on the GoldFin white/ink/gold tokens.

---

## 1. The sequence (value before the credential)

The single biggest lever is ordering. Never ask for the bank before the customer has seen the value.

```
1. PREVIEW    Show the report they'll get (the "one number" verdict + a sample briefing).
              GoldFin already has SampleBriefingPage — reuse it as the pre-connect hook.
2. SIGN UP    Lightweight: phone or email only. (Pass user.phone_number to Plaid → +11% returning-user conv.)
3. UNLOCK     Frame connect as the reward: "Connect your bank and your first report generates in seconds."
4. CONNECT    Plaid Link — embedded, branded (gold), minimal products, SDK pre-initialized.
5. PAYOFF     Generate the report the instant HANDOFF fires. Close the loop immediately.
```

The connection is now the customer's *desire*, not the product's demand.

---

## 2. The connect screen (tokens, layout, copy)

GoldFin tokens: page bg `paper`/`charcoal-950` (white), text `ink` (#0B0D12), muted `ink/60`, primary action `gold-500` (#D4A845), hairline `border-ink/[0.05]`, accessible gold text `gold-700`/`champagne-300`. Serif display for the headline.

```
┌──────────────────────────────────────────────────────────────┐
│  [ small: GoldFin mark ]                                       │
│                                                                │
│  See your full financial picture —                            │  ← serif display, ink
│  securely connect your bank                                    │
│                                                                │
│  We read your transactions to build your monthly briefing.     │  ← ink/60, one line
│  Read-only. We never move money.                               │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  🔒  Connect my bank & generate my report            │    │  ← gold-500 fill, ink text,
│  └──────────────────────────────────────────────────────┘    │     56–64px tall, first-person
│                                                                │
│  Bank-grade encryption · we never see your login · ~30 sec     │  ← friction-reducer, ink/50, small
│                                                                │
│  Powered by Plaid · trusted by thousands of financial apps     │  ← trust mark, ink/40
│                                                                │
│  Bank not listed?  Upload a statement instead →                │  ← fallback, gold-700 link
└──────────────────────────────────────────────────────────────┘
```

**Rules:** one primary CTA (no competing buttons). First-person + outcome ("Connect my bank & generate my report" — never "Link account" / "Submit"). The friction-reducer sits *directly under the button*, at the decision moment. The "why" ("We read your transactions to build your briefing") is stated before the ask — unexplained steps create anxiety.

---

## 3. The state machine (every state designed, never a dead end)

| State | Trigger | UI | Copy |
|---|---|---|---|
| **idle** | screen load | the connect screen above | as above |
| **opening** | tap CTA | button → spinner-in-place, `aria-busy` | "Opening your bank…" |
| **in_link** | Link open | Plaid Link takes over (branded) | Plaid-owned |
| **mfa / oauth** | bank requires it | Plaid-owned; we show nothing competing | Plaid-owned |
| **exchanging** | HANDOFF → token exchange | full-card calm loader (skeleton, not spinner) | "Securing your connection…" |
| **building** | sync + categorize + report | progress with reassurance | "Reading your transactions and building your first briefing… this takes about a minute." |
| **success** | report ready | reveal the report (gold accent on the headline number) | "Your briefing is ready." |
| **exit_no_connect** | onExit, no Item | recovery (see §4) | segmented by drop-off |
| **error** | exchange/sync fails | calm retry, take is never lost | "Something interrupted the connection — let's try again." (never a raw error string) |
| **reauth** | ITEM_LOGIN_REQUIRED later | gentle in-app + email nudge | "Your bank needs a quick 15-second re-verify to keep your briefings accurate." |

Motion: GPU-only (transform/opacity), `prefers-reduced-motion` safe, skeletons over spinners, the success reveal is a calm settle (no confetti).

---

## 4. Recovery by drop-off step (instrument `onExit`, segment the message)

Plaid's `onExit` gives `metadata.status` — the exact abandonment point. Segment recovery; a generic "try again" wastes the highest-intent moment.

| `onExit` status | What happened | Recovery copy + action |
|---|---|---|
| `requires_credentials` / `institution_not_found` | couldn't find/enter bank | "Can't find your bank? You can **upload a statement** instead and we'll still build your briefing." → statement upload |
| `institution_no_longer_supported` | unsupported | offer statement upload + "we'll let you know when your bank is supported" |
| `requires_oauth` / OAuth abandon | bailed at the bank handoff | "Connecting through your bank's secure login is the safest way — **try again**, it takes 30 seconds." → reopen Link |
| MFA abandon | OTP fatigue | "Didn't get your bank's code? **Resend** and try once more." → reopen Link |
| user closed early | changed mind | soft: "No rush — your briefing is waiting whenever you're ready to connect." keep CTA visible |

**Never dead-end.** Always one of: reopen Link (update/normal), statement upload, or a calm "come back later" with the CTA persistent. Send a segmented recovery email by drop-off step.

---

## 5. The statement-upload fallback (GoldFin's unfair advantage)

Because the product is a *report*, a failed Plaid connection still has a path to value most apps lack: **upload a CSV/PDF statement → we build the briefing anyway.** This preserves the activation payoff when Link fails or the bank is unsupported. (Pipeline: parse/Enrich → same categorization → same metrics → same report.) Surface it as the always-present secondary path, not a buried last resort.

---

## 6. Mobile (the primary battlefield)

- Report preview **above** the connect ask (the CTA is too important to push below a large hero).
- Full-width gold CTA in the bottom thumb arc, ≥48px target (primary 56–64px), `100dvh`/`svh` + `env(safe-area-inset-*)`.
- App2App biometric (Chase/Chime) where available (+10–15%); mobile-web OAuth pop-up implemented correctly (+11%) — don't ship the desktop pop-up unchanged.
- 16px+ inputs (prevent iOS zoom), correct keyboards for phone/email at signup.

---

## 7. Trust copy library (reduce the bank-connect fear)

The #1 hesitation is "why do you need my bank login / is this safe?" Answer it everywhere it arises:

- **Read-only framing:** "You connect read-only. We can see transactions to build your briefing — we can never move money."
- **Credential safety:** "We never see your bank password. Your bank verifies you directly through Plaid."
- **Scale/authority:** "Powered by Plaid — the same secure connection used by thousands of financial apps; ~3M fraudulent requests blocked each year."
- **Data control:** "Your data is yours. Disconnect anytime and export everything."
- Reuse + upgrade the existing `security-faq/PlaidExplanationSection` with this language (it already lists the flow: bank activity → Plaid → spreadsheet → briefing → review).

---

## 8. Conversion levers (Plaid's own A/B data — apply all that fit)

| Lever | Lift | Apply |
|---|---|---|
| Brand Link (logo + gold primary) | explicit | §2 setup |
| Pass `user.phone_number` | +11% returning | at signup |
| App2App biometric | +10–15% | mobile OAuth banks |
| Mobile-web OAuth pop-up | +11% | mobile |
| More institution logos (skip search) | +5% | Link config |
| Plaid Layer (instant onboarding) | +5–25% | later phase |
| Minimal product set | conv + cost | request `transactions` only |

---

## 9. Component map (when the product app exists)

```
src/app/connect/ConnectScreen.tsx      — the screen (§2), state machine (§3)
src/app/connect/usePlaidLink.ts        — load Plaid Link (CDN script, no npm dep needed),
                                          fetch link_token from edge fn, handle onSuccess/onExit
src/app/connect/StatementUpload.tsx    — fallback (§5)
src/app/connect/recovery.ts            — onExit → segmented recovery (§4)
src/integrations/plaid/client.ts       — typed wrappers calling the edge fns
(edge fns live in supabase/functions/: plaid-link-token, plaid-exchange-token, plaid-sync, plaid-webhook)
```

Dependency note: Plaid Link can load via the hosted `link-initialize.js` script (no new npm dependency) — preferred for a zero-dep, fast path. `react-plaid-link` is the alternative if a React wrapper is wanted; justify before adding.

---

## 10. Definition of done (connect flow)

- One first-person + outcome CTA; friction-reducer directly beneath; trust mark + fallback present.
- Value (report preview) shown before the ask.
- Every state in §3 designed; no dead end; `onExit` instrumented + segmented recovery (§4).
- Statement-upload fallback wired.
- Mobile: thumb-zone CTA, 48px, dvh + safe-area, OAuth pop-up/app2app handled.
- White/ink/gold tokens only; motion GPU-only + reduced-motion safe; `build` green.
