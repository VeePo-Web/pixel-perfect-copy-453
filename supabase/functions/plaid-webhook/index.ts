// Receives Plaid webhooks.
// - Production: verifies the `plaid-verification` JWT (ES256) against Plaid's
//   per-key JWKS via /webhook_verification_key/get, with a small in-memory key
//   cache and ±5min iat skew check. Also verifies sha256(body) === claims.request_body_sha256.
// - Sandbox / internal callers: falls back to a shared-secret header
//   (`x-plaid-webhook-secret` === PLAID_WEBHOOK_SECRET) when no JWT is present.
// - Branches on webhook_type/code: marks items needing reauth, and re-syncs
//   accounts/balances on TRANSACTIONS/HOLDINGS update events.
import { adminClient, corsHeaders, json } from "../_shared/auth-context.ts";
import { plaid, syncAccountsForItem, isProduction } from "../_shared/plaid.ts";

type Webhook = {
  webhook_type: string;
  webhook_code: string;
  item_id: string;
  error?: { error_code?: string } | null;
};

type Jwk = {
  kty: string;
  kid: string;
  alg: string;
  crv: string;
  x: string;
  y: string;
  use?: string;
};

const keyCache = new Map<string, { key: CryptoKey; expiresAt: number }>();

function b64urlToBytes(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function getPlaidKey(kid: string): Promise<CryptoKey> {
  const cached = keyCache.get(kid);
  if (cached && cached.expiresAt > Date.now()) return cached.key;
  const resp = await plaid<{ key: Jwk }>("/webhook_verification_key/get", { key_id: kid });
  const jwk = resp.key;
  if (jwk.alg !== "ES256" || jwk.kty !== "EC" || jwk.crv !== "P-256") {
    throw new Error(`unexpected jwk: ${jwk.alg}/${jwk.kty}/${jwk.crv}`);
  }
  const key = await crypto.subtle.importKey(
    "jwk",
    { kty: "EC", crv: "P-256", x: jwk.x, y: jwk.y },
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["verify"],
  );
  keyCache.set(kid, { key, expiresAt: Date.now() + 60 * 60 * 1000 });
  return key;
}

async function verifyPlaidJwt(jwt: string, rawBody: string): Promise<boolean> {
  const parts = jwt.split(".");
  if (parts.length !== 3) return false;
  const [h, p, s] = parts;
  let header: { alg?: string; kid?: string };
  let payload: { iat?: number; request_body_sha256?: string };
  try {
    header = JSON.parse(new TextDecoder().decode(b64urlToBytes(h)));
    payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(p)));
  } catch {
    return false;
  }
  if (header.alg !== "ES256" || !header.kid) return false;
  const now = Math.floor(Date.now() / 1000);
  if (!payload.iat || Math.abs(now - payload.iat) > 5 * 60) return false;
  const bodyHash = await sha256Hex(rawBody);
  if (payload.request_body_sha256 !== bodyHash) return false;
  const key = await getPlaidKey(header.kid);
  const sig = b64urlToBytes(s);
  const data = new TextEncoder().encode(`${h}.${p}`);
  return await crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    sig,
    data,
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const rawBody = await req.text();
    const jwt = req.headers.get("plaid-verification");

    if (jwt) {
      const ok = await verifyPlaidJwt(jwt, rawBody).catch((e) => {
        console.error("plaid jwt verify error", e);
        return false;
      });
      if (!ok) return json({ error: "unauthorized" }, 401);
    } else {
      // Fallback: shared-secret header (sandbox/internal tooling).
      // In production with no JWT present, require the shared secret.
      const expected = Deno.env.get("PLAID_WEBHOOK_SECRET");
      const got = req.headers.get("x-plaid-webhook-secret");
      if (!expected || got !== expected) {
        if (isProduction()) console.warn("prod webhook missing plaid-verification and bad shared secret");
        return json({ error: "unauthorized" }, 401);
      }
    }

    const body = JSON.parse(rawBody) as Webhook;
    const admin = adminClient();

    const { data: item } = await admin
      .from("plaid_items")
      .select("id, user_id, access_token")
      .eq("plaid_item_id", body.item_id)
      .maybeSingle();

    // Audit log: record every inbound Plaid event, even for unknown items.
    try {
      await admin.from("webhook_events").insert({
        source: "plaid",
        event_type: `${body.webhook_type}.${body.webhook_code}`,
        user_id: item?.user_id ?? null,
        external_id: body.item_id ?? null,
        summary: { error: body.error ?? null, item_id: body.item_id },
      });
    } catch (e) { console.error("webhook_events log failed", e); }

    if (!item) return json({ received: true, unknown_item: true });

    const isReauth =
      body.webhook_type === "ITEM" &&
      (body.webhook_code === "PENDING_EXPIRATION" ||
        body.webhook_code === "ERROR" ||
        body.error?.error_code === "ITEM_LOGIN_REQUIRED");

    const isUpdate =
      (body.webhook_type === "TRANSACTIONS" || body.webhook_type === "HOLDINGS") &&
      (body.webhook_code.endsWith("_UPDATE") || body.webhook_code === "DEFAULT_UPDATE" ||
        body.webhook_code === "SYNC_UPDATES_AVAILABLE");

    if (isReauth) {
      await admin
        .from("plaid_items")
        .update({ status: "reauth_required" })
        .eq("id", item.id);
    } else if (isUpdate) {
      await syncAccountsForItem(admin, item);
    }

    return json({ received: true });
  } catch (e) {
    console.error("plaid-webhook error", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
