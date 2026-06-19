import { useMemo, useState } from "react";
import { recommend, selectorQuestions, type SelectorAnswers } from "../content";

export function usePlanSelector() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SelectorAnswers>({});
  const total = selectorQuestions.length;
  const done = step >= total;

  const recommendation = useMemo(() => (done ? recommend(answers) : null), [done, answers]);

  const setAnswer = (key: keyof SelectorAnswers, val: string) => {
    setAnswers((p) => ({ ...p, [key]: val }));
    setStep((s) => Math.min(s + 1, total));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  return { step, total, answers, done, recommendation, setAnswer, back, reset };
}
