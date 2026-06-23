// Refreshes account list + balances for one Plaid item.
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { syncAccountsForItem } from "../_shared/plaid.ts";

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

    const result = await syncAccountsForItem(admin, item);
    return json(result);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
