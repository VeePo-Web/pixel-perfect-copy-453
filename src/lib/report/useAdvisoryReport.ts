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

  // Accountability loop: mark a recommendation acted-on (+ outcome). Optimistic;
  // persisted via the server (advisory_reports is SELECT-only for the client).
  const markRecommendation = useCallback(
    async (reportId: string, index: number, acted: boolean | null, outcome: string | null = null) => {
      setState((s) =>
        s.report && s.report.id === reportId
          ? {
              ...s,
              report: {
                ...s.report,
                recommendations: (s.report.recommendations ?? []).map((r, i) =>
                  i === index ? { ...r, acted, outcome } : r,
                ),
              },
            }
          : s,
      );
      const { error } = await supabase.functions.invoke("report-mark-recommendation", {
        body: { reportId, index, acted, outcome },
      });
      if (error) await fetchLatest(); // revert to server truth on failure
    },
    [fetchLatest],
  );

  useEffect(() => {
    void fetchLatest();
  }, [fetchLatest]);

  return { ...state, refetch: fetchLatest, generate, markRecommendation };
}
