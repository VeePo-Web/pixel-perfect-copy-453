import { useEffect, useState } from "react";

export type ApplyRoute = "home" | "apply" | "thank-you";

function parse(): ApplyRoute {
  const h = window.location.hash || "";
  if (h.startsWith("#/apply/thank-you")) return "thank-you";
  if (h.startsWith("#/apply")) return "apply";
  return "home";
}

export function useHashRoute(): ApplyRoute {
  const [route, setRoute] = useState<ApplyRoute>(() =>
    typeof window === "undefined" ? "home" : parse()
  );
  useEffect(() => {
    const update = () => setRoute(parse());
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return route;
}

export function navigate(to: string) {
  if (window.location.hash !== to) {
    window.location.hash = to;
  } else {
    // force re-trigger
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}
