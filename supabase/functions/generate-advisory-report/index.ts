// User-facing entry point for the grounded advisory report. Thin wrapper over
// the shared core (report-core.ts) — auth, then generate for the caller.
// SEPARATE from generate-briefing (Gemini marketing DEMO, which invents numbers).
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";
import { generateReportForUser } from "../_shared/report-core.ts";

const Body = z.object({ periodEnd: z.string().optional(), send: z.boolean().optional() }).default({});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const user = await getUserFromRequest(req);
    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);

    const today = new Date().toISOString().slice(0, 10);
    const result = await generateReportForUser(adminClient(), user.id, {
      periodEnd: parsed.data.periodEnd,
      send: parsed.data.send ?? false,
      today,
    });

    if (!result.ok) {
      const status = result.reason === "no_transactions" ? 422 : 500;
      return json({ error: result.reason }, status);
    }
    return json(result);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
