import { useEffect, useState } from "react";
import type { Recommendation } from "../content";
import { track } from "../analytics";

type Props = { recommendation: Recommendation | null };

export default function MobileStickyCompareCTA({ recommendation }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640 && window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const label = recommendation?.mobileCTA.label ?? "Find My Best Fit";
  const href = recommendation?.mobileCTA.href ?? "#fit-finder";
  const eyebrow = recommendation ? "Your next step" : "60-second diagnostic";

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transform border-t border-ink/[0.08] bg-charcoal-950/95 backdrop-blur-md transition-all duration-500 ease-cinema lg:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 pt-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink/50">{eyebrow}</p>
        <a
          href={href}
          onClick={() => {
            if (href === "/sample-briefing")
              track("sample_briefing_clicked_from_compare", { source: "mobile-sticky" });
            else if (href === "/apply")
              track("apply_clicked_from_compare", { source: "mobile-sticky" });
            else if (href === "/templates")
              track("templates_clicked_from_compare", { source: "mobile-sticky" });
          }}
          className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[13px] font-medium text-navy"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
