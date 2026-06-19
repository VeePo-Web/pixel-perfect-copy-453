import { useCallback, useEffect, useState } from "react";

export type ApplicationState = {
  first_name: string;
  email: string;
  business_name: string;
  business_type: string;
  revenue_range: string;
  current_tools: string[];
  clarity_gap: string;
  decisions: string[];
  clarity_outcome: string;
  monthly_review: string;
  budget_fit: string;
  worth_it: string;
  timeline: string;
  consent: boolean;
};

export const EMPTY_STATE: ApplicationState = {
  first_name: "",
  email: "",
  business_name: "",
  business_type: "",
  revenue_range: "",
  current_tools: [],
  clarity_gap: "",
  decisions: [],
  clarity_outcome: "",
  monthly_review: "",
  budget_fit: "",
  worth_it: "",
  timeline: "",
  consent: false,
};

const KEY = "mfd:application:v1";
const STEP_KEY = "mfd:application:step:v1";

export function useApplicationState() {
  const [state, setState] = useState<ApplicationState>(() => {
    if (typeof window === "undefined") return EMPTY_STATE;
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return EMPTY_STATE;
      return { ...EMPTY_STATE, ...JSON.parse(raw) };
    } catch {
      return EMPTY_STATE;
    }
  });
  const [step, setStep] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const n = Number(localStorage.getItem(STEP_KEY));
    return Number.isFinite(n) && n >= 0 && n <= 5 ? n : 0;
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  useEffect(() => {
    try {
      localStorage.setItem(STEP_KEY, String(step));
    } catch {}
  }, [step]);

  const update = useCallback(<K extends keyof ApplicationState>(k: K, v: ApplicationState[K]) => {
    setState((s) => ({ ...s, [k]: v }));
  }, []);

  const reset = useCallback(() => {
    setState(EMPTY_STATE);
    setStep(0);
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(STEP_KEY);
    } catch {}
  }, []);

  const hasDraft = useCallback(() => {
    return Boolean(
      state.first_name ||
        state.email ||
        state.business_name ||
        state.business_type ||
        state.revenue_range ||
        state.current_tools.length ||
        state.clarity_gap ||
        state.decisions.length
    );
  }, [state]);

  return { state, update, setState, step, setStep, reset, hasDraft };
}
