// Exchanges a Plaid public token for an access token, persists the item,
// and pulls the initial account list.
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { plaid } from "../_shared/plaid.ts";

const Body = z.object({
  publicToken: z.string().min(1),
  institution: z
    .object({ id: z.string().optional(), name: z.string().optional() })
    .optional(),
});

type ExchangeResp = { access_token: string; item_id: string };
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const user = await getUserFromRequest(req);
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);
    const { publicToken, institution } = parsed.data;

    const exch = await plaid<ExchangeResp>("/item/public_token/exchange", {
      public_token: publicToken,
    });

    const accounts = await plaid<AccountsResp>("/accounts/get", {
      access_token: exch.access_token,
    });

    const admin = adminClient();
    const { data: itemRow, error: itemErr } = await admin
      .from("plaid_items")
      .insert({
        user_id: user.id,
        plaid_item_id: exch.item_id,
        access_token: exch.access_token,
        institution_id: institution?.id ?? accounts.item.institution_id,
        institution_name: institution?.name ?? null,
        status: "active",
        last_synced_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (itemErr || !itemRow) throw new Error(itemErr?.message || "Insert failed");

    if (accounts.accounts.length) {
      const rows = accounts.accounts.map((a) => ({
        plaid_item_id: itemRow.id,
        user_id: user.id,
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
      const { error: accErr } = await admin
        .from("plaid_accounts")
        .upsert(rows, { onConflict: "account_id" });
      if (accErr) throw new Error(accErr.message);
    }

    return json({ itemId: itemRow.id, accountCount: accounts.accounts.length });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
