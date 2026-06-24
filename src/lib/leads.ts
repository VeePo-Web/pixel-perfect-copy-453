import { supabase } from "../integrations/supabase/client";
import { analytics } from "./analytics";

/**
 * Single integration point for free-template lead capture.
 *
 * 1. Insert the lead into Supabase (`leads`) — the owned source of truth.
 *    A captured lead must never be lost, so this is awaited and is what the
 *    UI's success state depends on.
 * 2. Fire-and-forget a Resend delivery email via the `send-template-email`
 *    edge function. Never blocks or fails capture — if Resend isn't keyed yet,
 *    the lead is still stored and can be emailed later.
 */
export type LeadSubmitPayload = {
  firstName: string;
  email: string;
  businessType: string;
  goals: string[];
};

export type LeadPayload = LeadSubmitPayload & {
  templateId: string;
  templateName: string;
};

export async function captureLead(p: LeadPayload): Promise<{ ok: boolean }> {
  const { error } = await supabase.from("leads").insert({
    first_name: p.firstName,
    email: p.email,
    business_type: p.businessType,
    goals: p.goals,
    template_id: p.templateId,
    template_name: p.templateName,
    source: "templates",
    consent: true,
  });

  void supabase.functions
    .invoke("send-template-email", {
      body: { email: p.email, firstName: p.firstName, templateName: p.templateName },
    })
    .catch(() => {});

  if (!error) analytics.leadCaptured(p.templateId);

  return { ok: !error };
}

/**
 * Lightweight homepage form capture — email-only entry point.
 * Stores with source: "homepage" so we can segment later.
 */
export async function captureHomepageLead(email: string): Promise<{ ok: boolean }> {
  const { error } = await supabase.from("leads").insert({
    first_name: "Friend",
    email,
    business_type: "unknown",
    goals: ["templates"],
    template_id: "vault",
    template_name: "Template Vault",
    source: "homepage",
    consent: true,
  });

  void supabase.functions
    .invoke("send-template-email", {
      body: { email, firstName: "Friend", templateName: "Template Vault" },
    })
    .catch(() => {});

  if (!error) analytics.leadCaptured("vault");

  return { ok: !error };
}