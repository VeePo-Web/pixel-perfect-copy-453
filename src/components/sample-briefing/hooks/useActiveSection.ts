import { useEffect, useState } from "react";

export function useActiveSection(ids: string[], active: boolean) {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    if (!active) return;
    const observers: IntersectionObserver[] = [];
    const visible = new Map<string, number>();
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            visible.set(id, e.isIntersecting ? e.intersectionRatio : 0);
          });
          let best = ids[0];
          let bestRatio = 0;
          visible.forEach((ratio, key) => {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              best = key;
            }
          });
          if (bestRatio > 0) setActiveId(best);
        },
        { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids, active]);
  return activeId;
}
