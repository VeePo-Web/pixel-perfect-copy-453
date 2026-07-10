// Disconnects a Plaid item: revokes access at Plaid, deletes locally.
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { plaid, getAccessToken } from "../_shared/plaid.ts";

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
      .select("id, user_id")
      .eq("id", parsed.data.itemId)
      .single();
    if (error || !item || item.user_id !== user.id) {
      return json({ error: "Item not found" }, 404);
    }

    try {
      const accessToken = await getAccessToken(admin, item.id);
      await plaid("/item/remove", { access_token: accessToken });
    } catch (e) {
      // Continue even if remote remove fails; we still delete locally.
      console.error("plaid /item/remove failed:", e);
    }

    await admin.from("plaid_items").delete().eq("id", item.id);
    return json({ removed: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
