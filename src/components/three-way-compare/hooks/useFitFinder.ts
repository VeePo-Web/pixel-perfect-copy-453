import { useCallback, useMemo, useState } from "react";
import {
  recommend,
  recommendations,
  type ProblemValue,
  type RecommendationKey,
  type SetupValue,
  type StageValue,
} from "../content";
import { track } from "../analytics";

export type FitState = {
  setup: SetupValue | null;
  problem: ProblemValue | null;
  stage: StageValue | null;
};

export function useFitFinder() {
  const [state, setState] = useState<FitState>({ setup: null, problem: null, stage: null });
  const [started, setStarted] = useState(false);

  const set = useCallback(
    <K extends keyof FitState>(key: K, value: FitState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
      if (!started) {
        setStarted(true);
        track("fit_finder_started");
      }
    },
    [started]
  );

  const reset = useCallback(() => {
    setState({ setup: null, problem: null, stage: null });
  }, []);

  const completed = !!(state.setup && state.problem && state.stage);
  const key: RecommendationKey | null = useMemo(() => {
    if (!completed) return null;
    return recommend(state.setup, state.problem, state.stage);
  }, [completed, state.setup, state.problem, state.stage]);

  const recommendation = key ? recommendations[key] : null;

  return { state, set, reset, completed, recommendation, key };
}
