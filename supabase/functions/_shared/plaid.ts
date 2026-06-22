// Thin Plaid REST client. Sandbox by default.
const PLAID_HOSTS: Record<string, string> = {
  sandbox: "https://sandbox.plaid.com",
  development: "https://development.plaid.com",
  production: "https://production.plaid.com",
};

function plaidEnv(): string {
  return (Deno.env.get("PLAID_ENV") || "sandbox").toLowerCase();
}

function host(): string {
  return PLAID_HOSTS[plaidEnv()] ?? PLAID_HOSTS.sandbox;
}

export async function plaid<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const clientId = Deno.env.get("PLAID_CLIENT_ID");
  const secret = Deno.env.get("PLAID_SANDBOX_SECRET");
  if (!clientId || !secret) throw new Error("Plaid credentials missing");
  const res = await fetch(`${host()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, secret, ...body }),
  });
  const text = await res.text();
  let parsed: unknown;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    parsed = { raw: text };
  }
  if (!res.ok) {
    const err = (parsed as { error_message?: string; error_code?: string }) || {};
    throw new Error(
      `Plaid ${path} ${res.status}: ${err.error_code || ""} ${err.error_message || text}`,
    );
  }
  return parsed as T;
}

export const PLAID_PRODUCTS = ["transactions"];
export const PLAID_COUNTRY_CODES = ["US", "CA"];
