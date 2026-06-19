import { z } from "zod";

const txt = (max = 500) => z.string().trim().max(max);
const req = (max = 200) => z.string().trim().min(1, "required").max(max);

export const step1Schema = z.object({
  first_name: req(80),
  email: z.string().trim().email().max(255),
  business_name: req(160),
  business_type: req(80),
  revenue_range: req(60),
});

export const step2Schema = z.object({
  current_tools: z.array(z.string()).min(1, "required"),
  clarity_gap: txt(2000),
});

export const step3Schema = z.object({
  decisions: z.array(z.string()).min(1, "required"),
  clarity_outcome: txt(2000),
});

export const step4Schema = z.object({
  monthly_review: req(80),
  budget_fit: req(80),
  worth_it: txt(2000),
  timeline: req(80),
});

export const fullSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .extend({ consent: z.literal(true) });

export type StepKey = 1 | 2 | 3 | 4;

export function validateStep(
  step: StepKey,
  data: Record<string, unknown>
): { ok: true } | { ok: false; errors: Record<string, string> } {
  const schemas = { 1: step1Schema, 2: step2Schema, 3: step3Schema, 4: step4Schema };
  const r = schemas[step].safeParse(data);
  if (r.success) return { ok: true };
  const errors: Record<string, string> = {};
  r.error.issues.forEach((i) => {
    const k = String(i.path[0] ?? "_");
    if (!errors[k]) errors[k] = i.message;
  });
  return { ok: false, errors };
}
