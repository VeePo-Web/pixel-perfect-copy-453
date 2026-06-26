// The accountability loop (the compounding-memory moat). Lets an owner mark a
// recommendation from a prior report as acted-on (with an optional outcome), so
// the NEXT report's accountability section is grounded in what actually happened
// ("Last cycle I recommended X; you did it — here's the result / it's still
// open."). advisory_reports is SELECT-only for authenticated, so the write goes
// through this function (service_role), owner-scoped and validated.
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";

const Body = z.object({
  reportId: z.string().uuid(),
  index: z.number().int().min(0).max(50),
  acted: z.boolean().nullable(),
  outcome: z.string().max(500).nullable().optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const user = await getUserFromRequest(req);
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);
    const { reportId, index, acted } = parsed.data;
    const outcome = parsed.data.outcome ?? null;

    const admin = adminClient();
    const { data: rpt, error } = await admin
      .from("advisory_reports")
      .select("recommendations, user_id")
      .eq("id", reportId)
      .single();
    if (error || !rpt || rpt.user_id !== user.id) return json({ error: "Report not found" }, 404);

    const recs = Array.isArray(rpt.recommendations) ? [...rpt.recommendations] : [];
    if (index >= recs.length) return json({ error: "Index out of range" }, 400);
    recs[index] = { ...recs[index], acted, outcome };

    const { error: upErr } = await admin
      .from("advisory_reports")
      .update({ recommendations: recs })
      .eq("id", reportId)
      .eq("user_id", user.id);
    if (upErr) throw new Error(upErr.message);

    return json({ ok: true, index, acted, outcome });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
