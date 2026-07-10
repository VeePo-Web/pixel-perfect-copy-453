## Pricing Value Anchor Update

### Goal
Replace the "$400+/mo" total value anchor on the pricing page with "$980+/mo" so the $150/mo price looks more valuable. Scale the individual value-stack line items so they sum credibly to ~$980.

### Files to change
- `src/components/pricing/content.ts`

### Detailed changes

**`autoFillOffer.stack` — rescale each line item to round numbers summing to $980:**

| Item | Current | New |
|---|---|---|
| Every template auto-filled from your numbers | $120/mo | $300/mo |
| Monthly cash-flow summary | $60/mo | $150/mo |
| Expense-change report | $45/mo | $100/mo |
| Subscription & recurring-cost tracker | $30/mo | $80/mo |
| Revenue snapshot | $30/mo | $80/mo |
| Monthly PDF briefing | $75/mo | $170/mo |
| Owner action list | $40/mo | $100/mo |
| Spreadsheet export — always yours | Included | Included |

**`autoFillOffer.totalValue`** — change from `"$400+/mo"` to `"$980+/mo"`.

No other copy, logic, or pricing changes. The actual checkout price remains $150/mo.