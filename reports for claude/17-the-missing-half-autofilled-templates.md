# 17 — The Missing Half: Auto-Filled Spreadsheet Templates
## The product sells "your templates filled from your numbers" — and only builds the narrative report

> **Discovery:** GoldFin's vision (and its marketing) promises TWO outputs from the connected bank data: (1) a plain-English **advisory report**, and (2) **auto-filled spreadsheet templates** ("your templates filled from your numbers"). The report is built and wired on `main`. **The auto-filled templates are not built at all.** This audit documents the gap and lays the verifiable foundation for it.

---

## THE EVIDENCE: the promise is explicit; the delivery is absent

**The product promises auto-filled templates, repeatedly:**
- `send-template-email` (the lead-magnet) ships a *blank* vault — "Open it, **drop in your numbers**" — and its P.S. sells the upgrade verbatim: *"Prefer not to fill these in yourself every month? That's exactly what GoldFin Reports does for $99/mo — **your templates filled from your numbers**, with a plain-English briefing."*
- The marketing template library (`src/components/templates/content.ts`) is a full catalog the site sells: **Cash Flow Forecast, Monthly Review, Expense Audit, Hiring Affordability, Subscription Tracker, Tax Reserve, Owner Dashboard, Profitability** — each with filled-in preview rows ($84,200 starting cash, −$58,100 payroll, …).
- Pricing links to a `#auto-fill` anchor. The whole funnel's payoff is "filled from your numbers."

**The product delivers only the narrative report:**
- `generate-advisory-report` → `AdvisoryReportView` produces grounded prose sections. Good — but it is *not* a filled spreadsheet.
- **No xlsx/CSV generation exists** anywhere on `main` (no `exceljs`/`sheetjs`, no workbook builder, no export edge function).
- `AdvisoryReportView` has **no download/export**; the portal has **no "your filled templates" surface**.
- `send-template-email` emails a static/blank template, not a Plaid-filled one.

**Conclusion:** a customer pays $99/mo for "templates filled from your numbers" and receives a narrative briefing instead. The second half of the core promise — arguably the more tangible, screenshot-able, forward-able artifact — does not exist.

---

## WHY THIS IS THE HIGH-LEVERAGE GAP

1. **It's sold but not delivered** — the single clearest expectation-vs-reality gap in the product (a refund/churn risk, and a trust gap the advisory-report doctrine warns against).
2. **It's the forwardable artifact.** Report-value research (the `/report` dossiers) weights "FORWARDED & RENEWED" heavily — owners forward a clean filled P&L / cash-flow sheet to a partner, board, or accountant. A narrative email is less forwardable than a filled spreadsheet.
3. **The deterministic foundation already exists** on the branch: `src/lib/finance/templates.ts` (`fillProfitAndLoss`, `fillCashFlow`, `traceableValues`). For the *report* it duplicated main's engine; for the *spreadsheet* it has **no competitor on main** — it is the natural seed of the missing half.

---

## THE BUILD SPEC (auto-filled templates, grounded)

Same doctrine as the report: **code fills every cell; the model never invents a number; every value traces to the metrics.** The spreadsheet and the report read the *same* metrics source, so they can never disagree.

```
Production metrics (Lovable's computeMetrics → MetricsPayload, the source of truth)
        │
        ▼
Template builders (pure)  → one builder per marketed template:
   • Cash Flow Forecast    (cashOnHand → inflow − outflow → projected ending cash)
   • Owner Pay / Profit First (inflow split: profit/ownerPay/tax/opex)
   • Subscription & Waste Audit (recurring_streams → dormant + cost-creep, $ annual)
   • Tax Reserve           (Profit-First tax bucket + entity flag)
   • Monthly Review        (the headline P&L/cash one-pager)
        │
        ▼
FilledTemplate { title, periodLabel, rows[] }  +  traceableValues(set)
        │
        ├──► in-portal view  (render rows; "download" affordance)
        └──► .xlsx export    (rows → workbook cells; numbers injected, never model-computed)
```

**Rules:**
- Builders are **pure functions of the metrics object** — no recomputation, no model. (A row value that isn't in `traceableValues` is a bug, enforced by tests — the same verification-gate property the report uses.)
- The template set maps 1:1 to the **named templates the marketing already sells** (don't invent new ones; fill the ones on the pricing page).
- **.xlsx generation** needs a library. Recommendation: **SheetJS (`xlsx`)** for breadth, or **`exceljs`** for styling; **alternative**: server-side CSV (zero-dep) for v1, xlsx in v2. Justify + pick before adding the dep (per the no-new-deps rule).
- Grounding stays intact: the filled cells come straight from `MetricsPayload.figures` — the same registry the verifier already trusts.

---

## WHAT I BUILT THIS PASS (foundation, on the branch, verifiable, zero-dep)

`src/lib/finance/productTemplates.ts` — pure builders that consume the **production `MetricsPayload` shape** (declared as `ProductMetrics`, kept in sync with `_shared/report-metrics.ts`) and emit the named, auto-filled templates the site sells, as `FilledTemplate` rows + a `traceableValues` allow-list. Plus `productTemplates.test.ts` (node:test, zero new deps) proving every filled cell traces to a metrics field. This is the deterministic core of the missing half — ready to wire into the report pipeline and an xlsx/CSV export.

It is **net-new** (no equivalent on `main`), so unlike the engine/connect fixes it doesn't require editing Lovable's tree — it's a clean foundation the product can adopt.

---

## DECISION / NEXT

The auto-filled-template feature is the missing half of the core promise. Two paths:
1. **Wire it into the real pipeline** (on `main`, Lovable): have `generate-advisory-report` (or a sibling fn) also emit the filled templates from the same `MetricsPayload`, persist them, and add a download + in-portal view to `AdvisoryReportView`. Add a CSV (v1) or xlsx (v2) exporter.
2. **Keep maturing the branch foundation** until it's a drop-in module Lovable imports.

The branch foundation built this pass de-risks either path. Recommend the owner decide whether to (a) hand this spec to Lovable to wire on `main`, or (b) authorize building the full feature (export + portal surface) — and if so, where.

---

## BOTTOM LINE

The report half is built and good. The **spreadsheet auto-fill half — the thing the marketing literally names "templates filled from your numbers" — is missing.** It's sold, it's the forwardable artifact, and its deterministic core now exists on the branch. Building it is the highest-leverage way to make the product *deliver what it promises*.
