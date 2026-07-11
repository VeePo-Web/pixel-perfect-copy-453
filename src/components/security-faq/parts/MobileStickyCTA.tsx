import { useEffect, useState } from "react";
import { trackCtaByHref } from "../analytics";

export default function MobileStickyCTA() {
  const [pastFAQ, setPastFAQ] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("trust-flow");
    const faq = document.getElementById("faq");
    if (!hero && !faq) return;

    const heroIo = hero
      ? new IntersectionObserver(
          ([entry]) => setPastHero(!entry.isIntersecting),
          { threshold: 0 }
        )
      : null;
    if (hero && heroIo) heroIo.observe(hero);

    const faqIo = faq
      ? new IntersectionObserver(
          ([entry]) => {
            // Once the bottom of the FAQ leaves the viewport (scrolled past)
            if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
              setPastFAQ(true);
            } else if (entry.isIntersecting) {
              setPastFAQ(false);
            }
          },
          { threshold: 0 }
        )
      : null;
    if (faq && faqIo) faqIo.observe(faq);

    return () => {
      heroIo?.disconnect();
      faqIo?.disconnect();
    };
  }, []);

  if (!pastHero) return null;

  const showApply = pastFAQ;
  const href = showApply ? "/pricing#auto-fill" : "/sample-briefing";
  const label = showApply
    ? "Auto-fill my reports — $150/mo"
    : "Generate Sample Briefing";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/[0.08] bg-white/95 px-4 pt-3 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <a
        href={href}
        onClick={() => trackCtaByHref(href, "security_faq_mobile_sticky")}
        className="flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-5 text-[14px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        {label}
      </a>
    </div>
  );
}
