import { useCallback, useEffect, useRef, useState } from "react";
import { demoBusinesses, loaderLines } from "../content";
import { useReducedMotion } from "../../how-it-works/hooks/useReducedMotion";

export type Status = "idle" | "loading" | "ready";

export function useBriefingState() {
  const reduced = useReducedMotion();
  const [businessId, setBusinessId] = useState<string>(demoBusinesses[0].id);
  const [prompt, setPrompt] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [loaderIndex, setLoaderIndex] = useState(0);
  const timers = useRef<number[]>([]);

  const business = demoBusinesses.find((b) => b.id === businessId) ?? demoBusinesses[0];

  const selectBusiness = useCallback((id: string) => {
    const b = demoBusinesses.find((x) => x.id === id);
    if (!b) return;
    setBusinessId(id);
    setPrompt(b.prefillPrompt);
  }, []);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const generate = useCallback(
    (scrollToReport = true) => {
      clearTimers();
      setStatus("loading");
      setLoaderIndex(0);
      const stepMs = reduced ? 0 : 380;
      const totalMs = reduced ? 0 : 1600;
      loaderLines.forEach((_, i) => {
        timers.current.push(
          window.setTimeout(() => setLoaderIndex(i), i * stepMs)
        );
      });
      timers.current.push(
        window.setTimeout(() => {
          setStatus("ready");
          if (scrollToReport) {
            requestAnimationFrame(() => {
              document
                .getElementById("briefing-report")
                ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
            });
          }
        }, totalMs)
      );
    },
    [reduced]
  );

  const reset = useCallback(() => {
    clearTimers();
    setStatus("idle");
    setLoaderIndex(0);
  }, []);

  useEffect(() => () => clearTimers(), []);

  return {
    business,
    businessId,
    selectBusiness,
    prompt,
    setPrompt,
    status,
    loaderIndex,
    generate,
    reset,
  };
}
