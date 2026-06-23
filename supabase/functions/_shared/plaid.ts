// Thin Plaid REST client + shared account-sync helper. Sandbox by default.
import type { SupabaseClient } from "npm:@supabase/supabase-js@2.45.0";

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

type AccountsResp = {
  accounts: Array<{
    account_id: string;
    name: string;
    official_name: string | null;
    mask: string | null;
    type: string;
    subtype: string | null;
    balances: {
      current: number | null;
      available: number | null;
      iso_currency_code: string | null;
    };
  }>;
  item: { institution_id: string | null };
};

export type PlaidItemRow = {
  id: string;
  user_id: string;
  access_token: string;
};

/** Fetches /accounts/get for an item and upserts plaid_accounts. */
export async function syncAccountsForItem(
  admin: SupabaseClient,
  item: PlaidItemRow,
): Promise<{ updated: number }> {
  const accounts = await plaid<AccountsResp>("/accounts/get", {
    access_token: item.access_token,
  });

  const rows = accounts.accounts.map((a) => ({
    plaid_item_id: item.id,
    user_id: item.user_id,
    account_id: a.account_id,
    name: a.name,
    official_name: a.official_name,
    mask: a.mask,
    type: a.type,
    subtype: a.subtype,
    iso_currency_code: a.balances.iso_currency_code,
    current_balance: a.balances.current,
    available_balance: a.balances.available,
  }));

  if (rows.length) {
    const { error } = await admin
      .from("plaid_accounts")
      .upsert(rows, { onConflict: "account_id" });
    if (error) throw new Error(error.message);
  }

  await admin
    .from("plaid_items")
    .update({ last_synced_at: new Date().toISOString(), status: "active" })
    .eq("id", item.id);

  return { updated: rows.length };
}
