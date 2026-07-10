// Exchanges a Plaid public token for an access token, persists the item,
// and pulls the initial account list.
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { plaid, syncAccountsForItem, setAccessToken } from "../_shared/plaid.ts";

const Body = z.object({
  publicToken: z.string().min(1),
  institution: z
    .object({ id: z.string().optional(), name: z.string().optional() })
    .optional(),
});

type ExchangeResp = { access_token: string; item_id: string };
type ItemGetResp = { item: { institution_id: string | null } };

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

    let institutionId = institution?.id ?? null;
    if (!institutionId) {
      try {
        const info = await plaid<ItemGetResp>("/item/get", { access_token: exch.access_token });
        institutionId = info.item.institution_id;
      } catch (e) {
        console.warn("item/get failed", e);
      }
    }

    const admin = adminClient();
    const { data: itemRow, error: itemErr } = await admin
      .from("plaid_items")
      .insert({
        user_id: user.id,
        plaid_item_id: exch.item_id,
        access_token: exch.access_token,
        institution_id: institutionId,
        institution_name: institution?.name ?? null,
        status: "active",
      })
      .select("id, user_id, access_token")
      .single();
    if (itemErr || !itemRow) throw new Error(itemErr?.message || "Insert failed");

    const sync = await syncAccountsForItem(admin, itemRow);
    return json({ itemId: itemRow.id, accountCount: sync.updated });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
