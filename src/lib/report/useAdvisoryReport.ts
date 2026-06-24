import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AdvisoryReport } from "./types";

// NOTE: `advisory_reports` is created in migration 20260623120000 but the
// auto-generated Supabase `Database` types lag the migration, so the table is
// cast at the query boundary and re-typed to the AdvisoryReport contract. When
// types.ts is regenerated this cast can be removed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

type State = {
  report: AdvisoryReport | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
};

export function useAdvisoryReport() {
  const [state, setState] = useState<State>({
    report: null,
    loading: true,
    generating: false,
    error: null,
  });

  const fetchLatest = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    const { data, error } = await db
      .from("advisory_reports")
      .select(
        "id, period_start, period_end, status, metrics_snapshot, narrative, recommendations, subject_line, coverage_pct, verification_passed, model, generated_at, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setState((s) => ({ ...s, loading: false, error: error.message }));
      return;
    }
    setState((s) => ({ ...s, loading: false, report: (data as AdvisoryReport) ?? null }));
  }, []);

  const generate = useCallback(async () => {
    setState((s) => ({ ...s, generating: true, error: null }));
    const { error } = await supabase.functions.invoke("generate-advisory-report", { body: {} });
    if (error) {
      setState((s) => ({ ...s, generating: false, error: error.message }));
      return;
    }
    await fetchLatest();
    setState((s) => ({ ...s, generating: false }));
  }, [fetchLatest]);

  useEffect(() => {
    void fetchLatest();
  }, [fetchLatest]);

  return { ...state, refetch: fetchLatest, generate };
}
