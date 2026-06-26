import { test, assert } from "vitest";
import { nextRetryDue, decideDelivery, unsubscribeHeaders, BACKOFF_MS, MAX_DELIVERY_ATTEMPTS } from "./report-delivery.ts";

test("decideDelivery suppresses when the recipient has opted out", () => {
  assert.equal(decideDelivery(false, null), "suppress");
  assert.equal(decideDelivery(false, "pending"), "suppress");
});

test("decideDelivery skips an already-sent report (idempotency)", () => {
  assert.equal(decideDelivery(true, "sent"), "skip");
});

test("decideDelivery sends when enabled and not yet delivered", () => {
  assert.equal(decideDelivery(true, null), "send");
  assert.equal(decideDelivery(true, "pending"), "send");
  assert.equal(decideDelivery(true, "failed"), "send");
});

test("nextRetryDue: a brand-new delivery is immediately due", () => {
  assert.equal(nextRetryDue(0, null, Date.now()), true);
});

test("nextRetryDue: respects the exponential backoff window", () => {
  const t0 = 1_000_000_000_000;
  const last = new Date(t0).toISOString();
  assert.equal(nextRetryDue(1, last, t0 + BACKOFF_MS[1] - 1), false);
  assert.equal(nextRetryDue(1, last, t0 + BACKOFF_MS[1]), true);
});

test("nextRetryDue: gives up after MAX_DELIVERY_ATTEMPTS", () => {
  assert.equal(nextRetryDue(MAX_DELIVERY_ATTEMPTS, new Date(0).toISOString(), Date.now()), false);
});

test("nextRetryDue: an unparseable timestamp retries rather than stalls", () => {
  assert.equal(nextRetryDue(1, "not-a-date", Date.now()), true);
});

test("unsubscribeHeaders are RFC 8058 one-click", () => {
  const h = unsubscribeHeaders("https://x.co/u?token=abc");
  assert.equal(h["List-Unsubscribe"], "<https://x.co/u?token=abc>");
  assert.equal(h["List-Unsubscribe-Post"], "List-Unsubscribe=One-Click");
});
