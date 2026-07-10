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
      className="bg-charcoal-950 py-20 lg:py-24"
      aria-label="About the founder"
    >
      <div
        className={[
          "mx-auto max-w-3xl px-6 text-center transition-all duration-700 ease-cinema",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        ].join(" ")}
      >
        {/* Eyebrow */}
        <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.2em] text-champagne-300/70">
          Who built GoldFin Desk
        </p>

        {/* Team row */}
        <div className="flex items-start gap-5 text-left">
          <div
            className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full border border-champagne-200/30 bg-navy shadow-[0_10px_28px_-12px_rgba(15,27,61,0.55)]"
            aria-hidden="true"
          >
            <span className="text-[16px] font-medium tracking-wide text-champagne-100">GF</span>
          </div>

          <div>
            <p className="text-[18px] font-light text-ink">
              Chris Sam &amp; Parker G — the GoldFin Desk team
            </p>
            <p className="mt-1 max-w-[54ch] text-[14px] leading-relaxed text-ink/65">
              Chris — ex-Goldman Sachs, ex-Bank of America Merrill Lynch, now VP of
              Structured Credit Solutions at RBC — reads the numbers. Parker reads
              the operation. Built for owners who needed better answers than their
              accountant was giving them.
            </p>
            <a
              href="/about"
              className="mt-2 inline-block text-[12.5px] text-champagne-300/80 transition-colors hover:text-champagne-300"
            >
              Meet the team →
            </a>
          </div>
        </div>

        {/* Security note card */}
        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-ink/[0.07] bg-ink/[0.02] px-6 py-5">
          <div className="flex items-start gap-3">
            <span
              className="mt-[3px] h-2 w-2 shrink-0 rounded-full bg-green-signal"
              aria-hidden="true"
            />
            <div className="text-left">
              <p className="text-[14px] text-ink/75">
                Read-only bank connection. GoldFin Desk never moves, withdraws, or transfers
                your money.
              </p>
              <a
                href="/security-faq"
                className="mt-2 block text-[12.5px] text-champagne-300/70 transition-colors duration-300 hover:text-champagne-300"
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