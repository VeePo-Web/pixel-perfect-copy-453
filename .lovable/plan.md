
## Problem

The site currently repeats "No bank connection required" everywhere — including next to the **$150/mo GoldFin Reports** buttons. That's misleading for the paid product: connecting your business bank through **Plaid** *is* the mechanism that lets us auto-fill your templates and briefing. Saying "no bank connection" next to the paid CTA reads as either dishonest or as "this product doesn't actually do what it says."

The fix is to keep the honest "no bank connection required" language on the **preview / free / apply / sample** surfaces (where it's true), and swap it for a **trust-forward Plaid line** wherever the copy sits directly under the **$150/mo** offer.

## Scope

Copy-only. No logic, routing, or component changes.

### New standard $150/mo trust line (used in place of "no bank connection required to start")

> **Secure bank connection via Plaid — read-only, we never move money. Cancel anytime.**

Short variants for tight spots (nav / sticky CTA / micro rows):
- `Read-only Plaid connection · Cancel anytime`
- `Bank-grade Plaid · Read-only · Cancel anytime`

### Files to edit (targeted to $150/mo surfaces only)

1. **`src/components/pricing/content.ts`**
   - Line 106 (`autoFill.trust`, the $150/mo card): replace "No bank connection required to start. When you connect, it is read-only — we never move money." → new standard line.
   - Line 259 (FAQ "Do I need to connect my bank for the $150 plan?"): rewrite answer to *"Yes — GoldFin Reports auto-fills from your real numbers, so after onboarding you connect your business bank through **Plaid**. It's a read-only connection (we can see balances and transactions; we cannot move money), used by thousands of finance apps, and you can disconnect anytime from Settings. If you want to trial the rhythm first, start with the free Template Vault or sample briefing — those need no connection."*
   - Lines 327–328 (`trustCards`): keep "preview" / "apply" bullets, but add a new $150-tier bullet: `"$150/mo connection is read-only via Plaid"`.
   - Leave line 148 (`valueStack` "Plaid Bank Connection After Onboarding" — preview/apply framing) unchanged.

2. **`src/components/pricing/parts/PricingHero.tsx`**
   - Line 44 micro: `No contracts · Cancel anytime · No bank connection required to start` → `No contracts · Cancel anytime · Read-only Plaid connection`.
   - Line 94 bullet: `"No bank connection to start"` → `"Read-only Plaid connection · never moves money"`.

3. **`src/components/pricing/parts/PricingFinalCTA.tsx`**
   - Line 68: `No contracts · Cancel anytime · No bank connection required` → new standard line.

4. **`src/components/hero/FinanceHero.tsx`**
   - Line 90 (`postDemo.micro`, directly under the $150/mo CTA): `$150/mo · No contracts · Cancel anytime · No bank connection required.` → `$150/mo · No contracts · Cancel anytime · Read-only Plaid connection.`
   - Line 359 (desktop $150/mo CTA row): `No bank connection · Cancel anytime` → `Read-only Plaid · Cancel anytime`.
   - Keep lines 37, 98, 303 (preview/demo trust lines) unchanged — those describe the demo, not the paid product.

5. **`src/components/compare/parts/ComparisonFinalCTA.tsx`**
   - Line 50: `$150/mo. No bank connection required to start. Cancel anytime.` → `$150/mo. Secure read-only Plaid connection. Cancel anytime.`

6. **`src/components/three-way-compare/parts/FinalComparisonCTA.tsx`**
   - Line 59: same change as above.

7. **`src/components/security-faq/parts/SecurityFinalCTA.tsx`**
   - Line 71: `$150/mo. Read-only connection. No bank connection required to start.` → `$150/mo. Read-only bank connection via Plaid — we never move money. Cancel anytime.`

8. **`src/components/nav/GlobalTopBar.tsx`**
   - Line 237 (banner under $150/mo CTA): `No bank connection required · Cancel anytime` → `Read-only Plaid · Cancel anytime`.
   - Lines 479 & 519 (mobile drawer, under the $150 CTA): `No bank connection · Cancel anytime` → `Read-only Plaid · Cancel anytime`.
   - Line 54 (top-of-page trust chip that also fronts the free preview): leave as `No bank connection required` — this chip sits next to the free preview, not the paid CTA.

9. **`src/components/footer/GoldFinFooter.tsx`**
   - Lines 35 & 41 (`No bank connection required`): keep one entry, add a paired `Read-only Plaid connection for GoldFin Reports` bullet so the footer honestly represents both tiers.

### Intentionally **not changed** (preview / free / apply / sample surfaces where "no bank connection" is accurate)

- `src/components/templates/**` (free Template Vault — genuinely no bank)
- `src/components/sample-briefing/**` (sample generator — no bank)
- `src/components/apply/content.ts` (Advisory application — no bank at apply time)
- `src/components/how-it-works/**` (explains preview vs. post-onboarding split, already accurate)
- `src/components/security-faq/**` except the $150 final CTA above
- `src/components/home/HomeHero.tsx`, `HomeMobileStickyCTA.tsx` — those front the free preview / templates
- `src/components/hero/FinanceHero.tsx` lines 37, 98, 303 — demo/preview trust lines

## Verification

- Grep after edits: `rg -i "no bank connection" src/` should return **only** preview/template/apply/sample surfaces — zero hits within 5 lines of a `$150` string or an `Auto-fill my reports` CTA.
- Visual pass on `/`, `/pricing`, `/compare`, `/security-faq`, `/how-it-works` at desktop + mobile widths to confirm every $150/mo CTA is now paired with the Plaid trust line.
- No functional changes → no test/DB/edge-function work required.
