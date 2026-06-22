// Mints a Plaid Link token for the calling user.
// Pass { mode: "update", itemId } to get an update-mode token for re-auth.
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { plaid, PLAID_COUNTRY_CODES, PLAID_PRODUCTS } from "../_shared/plaid.ts";

const Body = z.object({
  mode: z.enum(["create", "update"]).default("create"),
  itemId: z.string().uuid().optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const user = await getUserFromRequest(req);
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);
    const { mode, itemId } = parsed.data;

    const baseReq: Record<string, unknown> = {
      user: { client_user_id: user.id },
      client_name: "Goldfin Desk",
      language: "en",
      country_codes: PLAID_COUNTRY_CODES,
      webhook: `${Deno.env.get("SUPABASE_URL")}/functions/v1/plaid-webhook`,
    };

    if (mode === "update") {
      if (!itemId) return json({ error: "itemId required" }, 400);
      const admin = adminClient();
      const { data: item, error } = await admin
        .from("plaid_items")
        .select("access_token, user_id")
        .eq("id", itemId)
        .single();
      if (error || !item || item.user_id !== user.id) {
        return json({ error: "Item not found" }, 404);
      }
      baseReq.access_token = item.access_token;
    } else {
      baseReq.products = PLAID_PRODUCTS;
    }

    const data = await plaid<{ link_token: string; expiration: string }>(
      "/link/token/create",
      baseReq,
    );
    return json({ linkToken: data.link_token, expiration: data.expiration });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
