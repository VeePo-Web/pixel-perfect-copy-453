import { useEffect, useState } from "react";
import { track } from "../analytics";

type Props = { downloaded: boolean };

export default function MobileStickyTemplateCTA({ downloaded }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640 && window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const href = downloaded ? "/pricing#auto-fill" : "#vault-capture";
  const label = downloaded ? "Auto-fill my reports — $99/mo" : "Send me the Vault";

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transform border-t border-ink/[0.08] bg-charcoal-950/95 backdrop-blur-md transition-all duration-500 ease-cinema lg:hidden ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 pt-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink/50">
          {downloaded ? "Next step" : "Free · no bank required"}
        </p>
        <a
          href={href}
          onClick={() => {
            if (downloaded) track("autofill_clicked_from_templates", { source: "mobile-sticky" });
          }}
          className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[13px] font-medium text-navy transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
