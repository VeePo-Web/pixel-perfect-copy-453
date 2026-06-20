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
  const href = showApply ? "#/apply" : "#/sample-briefing";
  const label = showApply
    ? "Apply for Monthly Finance Desk"
    : "Generate Sample Briefing";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-charcoal-950/95 px-4 py-3 backdrop-blur-md lg:hidden">
      <a
        href={href}
        onClick={() => trackCtaByHref(href, "security_faq_mobile_sticky")}
        className="flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 text-[14px] font-medium text-charcoal-950"
      >
        {label}
      </a>
    </div>
  );
}
