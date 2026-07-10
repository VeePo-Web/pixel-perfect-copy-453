// SANDBOX-ONLY TOOLING. Mints a sandbox public_token for First Platypus Bank.
// Refuses to run in production, and requires PLAID_ENV=sandbox explicitly.
import { corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { plaid, PLAID_PRODUCTS, isProduction, plaidEnv } from "../_shared/plaid.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    if (isProduction() || plaidEnv() !== "sandbox") {
      console.error("plaid-sandbox-public-token rejected: PLAID_ENV=", plaidEnv());
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
