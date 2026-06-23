// TEST-ONLY: mints a sandbox public_token for First Platypus Bank.
// Removed before production. Returns 403 outside sandbox.
import { corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { plaid, PLAID_PRODUCTS } from "../_shared/plaid.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    if ((Deno.env.get("PLAID_ENV") || "sandbox").toLowerCase() !== "sandbox") {
      return json({ error: "sandbox only" }, 403);
    }
    await getUserFromRequest(req);
    const data = await plaid<{ public_token: string }>(
      "/sandbox/public_token/create",
      {
        institution_id: "ins_109508",
        initial_products: PLAID_PRODUCTS,
      },
    );
    return json({ publicToken: data.public_token });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "unknown" }, 500);
  }
});
