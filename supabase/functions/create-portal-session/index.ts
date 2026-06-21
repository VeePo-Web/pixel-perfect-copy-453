import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, createStripeClient, type StripeEnv } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    if (body.environment !== "sandbox" && body.environment !== "live") {
      return new Response(JSON.stringify({ error: "Invalid environment" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const env: StripeEnv = body.environment;
    const returnUrl: string | undefined = typeof body.returnUrl === "string"
      ? body.returnUrl
      : undefined;
    const email: string | undefined = typeof body.email === "string" && body.email.includes("@")
      ? body.email.trim().toLowerCase()
      : undefined;

    let customerId: string | undefined;

    // Auth path: get signed-in user → look up their customer id.
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("stripe_customer_id")
          .eq("user_id", user.id)
          .eq("environment", env)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        customerId = sub?.stripe_customer_id ?? undefined;
      }
    }

    // Email-only path: site has no auth yet, so let buyers self-serve via the
    // email they paid with.
    if (!customerId && email) {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("stripe_customer_id")
        .eq("email", email)
        .eq("environment", env)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      customerId = sub?.stripe_customer_id ?? undefined;
    }

    if (!customerId) {
      return new Response(JSON.stringify({ error: "No subscription found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = createStripeClient(env);
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      ...(returnUrl && { return_url: returnUrl }),
    });
    return new Response(JSON.stringify({ url: portal.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-portal-session error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
