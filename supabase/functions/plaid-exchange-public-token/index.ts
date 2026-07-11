// Exchanges a Plaid public token for an access token, persists the item,
// and pulls the initial account list.
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { plaid, syncAccountsForItem } from "../_shared/plaid.ts";

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
    // Atomic insert with encrypted-at-rest access token (service-role-only RPC).
    const { data: newId, error: rpcErr } = await admin.rpc("plaid_create_item", {
      _user_id: user.id,
      _plaid_item_id: exch.item_id,
      _institution_id: institutionId,
      _institution_name: institution?.name ?? null,
      _status: "active",
      _token: exch.access_token,
    });
    if (rpcErr || !newId) throw new Error(rpcErr?.message || "Insert failed");
    const itemRow = { id: newId as string, user_id: user.id };

    const sync = await syncAccountsForItem(admin, {
      ...itemRow,
      access_token: exch.access_token,
    });
    return json({ itemId: itemRow.id, accountCount: sync.updated });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
