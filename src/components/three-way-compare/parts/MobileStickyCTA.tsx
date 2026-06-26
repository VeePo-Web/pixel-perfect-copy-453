import { useEffect, useState } from "react";
import type { Recommendation } from "../content";
import { trackCtaByHref } from "../analytics";

type Props = { recommendation: Recommendation | null };

export default function MobileStickyCTA({ recommendation }: Props) {
  const [visible, setVisible] = useState(false);
  const [pastBriefing, setPastBriefing] = useState(false);

  useEffect(() => {
    const briefingEl = document.getElementById("sample-briefing");
    const onScroll = () => {
      setVisible(window.scrollY > 640 && window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 200);
      if (briefingEl) {
        const r = briefingEl.getBoundingClientRect();
        setPastBriefing(r.bottom < window.innerHeight * 0.4);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // After Sample Briefing section → apply
  // After fit finder if MFD recommendation → sample briefing
  // Default → Find My Best Fit
  let label = "Find My Best Fit";
  let href = "#fit-finder";
  let eyebrow = "60-second diagnostic";

  if (pastBriefing) {
    label = "Auto-fill my reports — $99/mo";
    href = "/pricing#auto-fill";
    eyebrow = "Your next step";
  } else if (recommendation) {
    label = recommendation.mobileCTA.label;
    href = recommendation.mobileCTA.href;
    eyebrow = "Your recommendation";
  }

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
          onClick={() => trackCtaByHref(href, "mobile-sticky")}
          className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[13px] font-medium text-navy transition-all duration-300 ease-cinema active:scale-[0.97] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
