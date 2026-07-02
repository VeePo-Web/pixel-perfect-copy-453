import { useEffect, useState } from "react";
import { startAutoFillCheckout } from "../../../lib/checkout";
type Props = {
  status: "idle" | "loading" | "ready";
  onGenerate: () => void;
};

export default function MobileStickyCTA({ status, onGenerate }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480 && window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ready = status === "ready";
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transform border-t border-ink/[0.08] bg-charcoal-950/95 backdrop-blur-md transition-all duration-500 ease-cinema lg:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 pt-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink/50">
          {ready ? "Make it real" : "Try the briefing"}
        </p>
        {ready ? (
          <button
            type="button" onClick={startAutoFillCheckout}
            className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[13px] font-medium text-navy transition-all duration-300 ease-cinema active:scale-[0.97] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Auto-fill my reports — $150/mo
          </button>
        ) : (
          <button
            type="button"
            onClick={onGenerate}
            className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[13px] font-medium text-navy transition-all duration-300 ease-cinema active:scale-[0.97] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Generate Sample Briefing
          </button>
        )}
      </div>
    </div>
  );
}
