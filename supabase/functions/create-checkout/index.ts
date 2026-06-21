import { corsHeaders, createStripeClient, type StripeEnv } from "../_shared/stripe.ts";
import { isPlanKey, PRICE_IDS } from "../_shared/stripe-catalog.ts";

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId?: string },
): Promise<string | undefined> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    if (found.data.length) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (options.userId && customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  if (!options.email && !options.userId) return undefined;
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    ...(options.userId && { metadata: { userId: options.userId } }),
  });
  return created.id;
}

async function createCheckoutSession(opts: {
  plan: keyof typeof PRICE_IDS;
  customerEmail?: string;
  userId?: string;
  returnUrl: string;
  environment: StripeEnv;
}): Promise<string | null> {
  const stripe = createStripeClient(opts.environment);
  const priceLookup = PRICE_IDS[opts.plan];

  const prices = await stripe.prices.list({ lookup_keys: [priceLookup] });
  if (!prices.data.length) throw new Error(`Price not found for plan ${opts.plan}`);
  const stripePrice = prices.data[0];
  const isRecurring = stripePrice.type === "recurring";

  const customerId = await resolveOrCreateCustomer(stripe, {
    email: opts.customerEmail,
    userId: opts.userId,
  });

  let productDescription: string | undefined;
  if (!isRecurring) {
    const productId = typeof stripePrice.product === "string"
      ? stripePrice.product
      : stripePrice.product.id;
    const product = await stripe.products.retrieve(productId);
    productDescription = product.name;
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: stripePrice.id, quantity: 1 }],
    mode: isRecurring ? "subscription" : "payment",
    ui_mode: "embedded_page",
    return_url: opts.returnUrl,
    ...(customerId && { customer: customerId }),
    ...(!isRecurring && { payment_intent_data: { description: productDescription } }),
    metadata: {
      plan: opts.plan,
      ...(opts.userId && { userId: opts.userId }),
    },
    ...(isRecurring && opts.userId && {
      subscription_data: { metadata: { userId: opts.userId, plan: opts.plan } },
    }),
    ...(isRecurring && !opts.userId && {
      subscription_data: { metadata: { plan: opts.plan } },
    }),
    managed_payments: { enabled: true },
  } as any);

  return session.client_secret;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    if (!isPlanKey(body.plan)) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (body.environment !== "sandbox" && body.environment !== "live") {
      return new Response(JSON.stringify({ error: "Invalid environment" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (typeof body.returnUrl !== "string" || !body.returnUrl.startsWith("http")) {
      return new Response(JSON.stringify({ error: "Invalid returnUrl" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const customerEmail = typeof body.customerEmail === "string" && body.customerEmail.includes("@")
      ? body.customerEmail.trim().toLowerCase()
      : undefined;
    const userId = typeof body.userId === "string" && body.userId.length > 0 ? body.userId : undefined;

    const clientSecret = await createCheckoutSession({
      plan: body.plan,
      customerEmail,
      userId,
      returnUrl: body.returnUrl,
      environment: body.environment,
    });

    return new Response(JSON.stringify({ clientSecret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-checkout error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
