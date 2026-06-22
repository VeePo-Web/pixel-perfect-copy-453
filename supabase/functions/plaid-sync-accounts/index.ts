// Refreshes account list + balances for one Plaid item.
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { plaid } from "../_shared/plaid.ts";

const Body = z.object({ itemId: z.string().uuid() });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const user = await getUserFromRequest(req);
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

    const admin = adminClient();
    const { data: item, error } = await admin
      .from("plaid_items")
      .select("id, access_token, user_id")
      .eq("id", parsed.data.itemId)
      .single();
    if (error || !item || item.user_id !== user.id) {
      return json({ error: "Item not found" }, 404);
    }

    const accounts = await plaid<{
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
    }>("/accounts/get", { access_token: item.access_token });

    const rows = accounts.accounts.map((a) => ({
      plaid_item_id: item.id,
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
    if (rows.length) {
      const { error: accErr } = await admin
        .from("plaid_accounts")
        .upsert(rows, { onConflict: "account_id" });
      if (accErr) throw new Error(accErr.message);
    }

    await admin
      .from("plaid_items")
      .update({ last_synced_at: new Date().toISOString(), status: "active" })
      .eq("id", item.id);

    return json({ updated: rows.length });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
