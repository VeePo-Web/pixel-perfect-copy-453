import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// business_metric_inputs lags the auto-generated Database types (migration
// 20260624120000). Cast at the boundary; remove when types regenerate.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export interface WipJob {
  name: string;
  pctComplete: number;
  contract: number;
  billed: number;
}

/** Period-scoped vertical inputs that unlock the industry lead metric + growth
 *  gate. Mirrors IndustryInputs on the server (report-industry.ts). */
export interface MetricInputs {
  orders?: number | null;
  billableHours?: number | null;
  availableHours?: number | null;
  avgInventory?: number | null;
  ltv?: number | null;
  cac?: number | null;
  jobs?: WipJob[];
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useMetricInputs() {
  const [inputs, setInputs] = useState<MetricInputs>({});
  const [periodEnd, setPeriodEnd] = useState<string>(todayISO());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db
      .from("business_metric_inputs")
      .select("period_end, inputs")
      .order("period_end", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) setError(error.message);
    if (data) {
      setInputs((data.inputs as MetricInputs) ?? {});
      setPeriodEnd((data.period_end as string) ?? todayISO());
    }
    setLoading(false);
  }, []);

  const save = useCallback(async (next: MetricInputs) => {
    setSaving(true);
    setError(null);
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    if (!uid) {
      setError("Not signed in");
      setSaving(false);
      return;
    }
    // Always write to the current period so the latest report picks it up.
    const period = todayISO();
    const { error } = await db
      .from("business_metric_inputs")
      .upsert({ user_id: uid, period_end: period, inputs: next }, { onConflict: "user_id,period_end" });
    if (error) setError(error.message);
    else {
      setInputs(next);
      setPeriodEnd(period);
      setSavedAt(new Date().toISOString());
    }
    setSaving(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { inputs, periodEnd, loading, saving, savedAt, error, save, reload: load };
}
