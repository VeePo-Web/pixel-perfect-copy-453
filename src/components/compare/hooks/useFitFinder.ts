import { useCallback, useMemo, useState } from "react";
import { recommend, recommendations, type RecommendationKey } from "../content";
import { track } from "../analytics";

export type FitState = {
  setup: string | null;
  problem: string | null;
  maturity: string | null;
};

export function useFitFinder() {
  const [state, setState] = useState<FitState>({
    setup: null,
    problem: null,
    maturity: null,
  });
  const [started, setStarted] = useState(false);

  const set = useCallback(
    <K extends keyof FitState>(key: K, value: FitState[K]) => {
      setState((prev) => {
        const next = { ...prev, [key]: value };
        if (!started) {
          setStarted(true);
          track("comparison_fit_finder_started");
        }
        return next;
      });
    },
    [started]
  );

  const reset = useCallback(() => {
    setState({ setup: null, problem: null, maturity: null });
  }, []);

  const completed = !!(state.setup && state.problem && state.maturity);
  const key: RecommendationKey | null = useMemo(() => {
    if (!completed) return null;
    return recommend(state.setup, state.problem, state.maturity);
  }, [completed, state.setup, state.problem, state.maturity]);

  const recommendation = key ? recommendations[key] : null;

  return { state, set, reset, completed, recommendation, key };
}
