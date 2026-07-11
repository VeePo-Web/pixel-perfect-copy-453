import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function FounderTrustStrip() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="border-t border-ink/[0.06] bg-white py-20 lg:py-24"
      aria-label="About the founder"
    >
      <div
        className={[
          "mx-auto max-w-3xl px-6 text-center transition-all duration-700 ease-cinema",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        ].join(" ")}
      >
        {/* Eyebrow */}
        <p className="mb-6 font-general text-[11px] uppercase tracking-[0.2em] text-champagne-300">
          Who built GoldFin Desk
        </p>

        {/* Founder card */}
        <div className="mx-auto max-w-xl rounded-2xl border border-ink/[0.08] bg-white p-6 text-left shadow-[0_1px_2px_rgba(11,13,18,0.04)] sm:p-7">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-champagne-200/30 bg-navy shadow-[0_6px_16px_-8px_rgba(15,27,61,0.35)]"
              aria-hidden="true"
            >
              <span className="text-[15px] font-medium tracking-wide text-champagne-100">CS</span>
            </div>

            {/* Name + credential */}
            <div>
              <p className="text-[16px] font-medium text-ink">Chris Sam</p>
              <p className="mt-1.5 max-w-[52ch] text-[15px] leading-relaxed text-ink/75">
                10 years in institutional finance, built this for owners who needed better answers
                than their accountant was giving them.
              </p>
            </div>
          </div>
        </div>

        {/* Security note card */}
        <div className="mx-auto mt-4 max-w-xl rounded-2xl border border-ink/[0.08] bg-[#FCFBF9] px-6 py-5">
          <div className="flex items-start gap-3">
            <span
              className="mt-[3px] h-2 w-2 shrink-0 rounded-full bg-green-signal"
              aria-hidden="true"
            />
            <div className="text-left">
              <p className="text-[14px] leading-relaxed text-ink/75">
                Read-only bank connection. GoldFin Desk never moves, withdraws, or transfers
                your money.
              </p>
              <a
                href="/security-faq"
                className="mt-2 block text-[12.5px] text-champagne-300 transition-colors duration-300 hover:text-champagne-400"
              >
                How does the connection work? →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}