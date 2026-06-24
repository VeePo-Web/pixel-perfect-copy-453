import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessProfile } from "./types";

// business_profiles lags the auto-generated Database types (created in
// migration 20260623120000). Cast at the boundary; remove when types regenerate.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const DEFAULT: BusinessProfile = {
  business_name: null,
  industry: "other",
  entity_type: "unknown",
  reserve_floor_months: 3,
};

export function useBusinessProfile() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db
      .from("business_profiles")
      .select("business_name, industry, entity_type, reserve_floor_months")
      .maybeSingle();
    if (error) setError(error.message);
    setProfile((data as BusinessProfile) ?? null);
    setLoading(false);
  }, []);

  const save = useCallback(async (patch: Partial<BusinessProfile>) => {
    setSaving(true);
    setError(null);
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    if (!uid) {
      setError("Not signed in");
      setSaving(false);
      return;
    }
    const next = { ...(profile ?? DEFAULT), ...patch };
    const { error } = await db
      .from("business_profiles")
      .upsert({ user_id: uid, ...next }, { onConflict: "user_id" });
    if (error) setError(error.message);
    else setProfile(next);
    setSaving(false);
  }, [profile]);

  useEffect(() => {
    void load();
  }, [load]);

  return { profile, loading, saving, error, save, reload: load };
}
