import { useEffect, useState } from "react";

// History-API path routing (migrated off hash routing for per-page SEO — each
// route is now a real, crawlable URL: /pricing, /templates, …). The hook name is
// kept to avoid churn across importers.

export type ApplyRoute =
  | "home"
  | "apply"
  | "thank-you"
  | "sample-briefing"
  | "pricing"
  | "templates"
  | "compare"
  | "three-way-compare"
  | "security-faq"
  | "about";

function parse(): ApplyRoute {
  const p = (window.location.pathname || "/").replace(/\/+$/, "") || "/";
  // /apply is retired — redirect any legacy links to /pricing (the $150 offer).
  if (p.startsWith("/apply")) return "pricing";
  if (p.startsWith("/about")) return "about";
  if (p.startsWith("/sample-briefing")) return "sample-briefing";
  if (p.startsWith("/pricing")) return "pricing";
  if (p.startsWith("/templates")) return "templates";
  if (p.startsWith("/compare/bookkeeper-vs-fractional-cfo-vs-monthly-finance-desk"))
    return "three-way-compare";
  if (p.startsWith("/compare")) return "compare";
  if (p.startsWith("/security-faq") || p.startsWith("/security") || p.startsWith("/faq"))
    return "security-faq";
  return "home";
}

export function useHashRoute(): ApplyRoute {
  const [route, setRoute] = useState<ApplyRoute>(() =>
    typeof window === "undefined" ? "home" : parse(),
  );
  useEffect(() => {
    const update = () => setRoute(parse());
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  return route;
}

// SPA navigation via the History API. Accepts "/pricing" (and tolerates a legacy
// "#/pricing"). pushState does not emit popstate, so we dispatch it ourselves so
// every route hook updates. Preserves any in-page "#anchor" for scroll targets.
export function navigate(to: string) {
  const target = to.startsWith("#") ? to.slice(1) : to;
  const current =
    window.location.pathname + window.location.search + window.location.hash;
  if (current !== target) {
    window.history.pushState({}, "", target);
  }
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}
