import { useInView } from "../hooks/useInView";

// Founder Trust Strip (conversion-prompt PAGE 1 §5 / personas E-E-A-T proof).
// Safe public language per brand-identity-architect.md: "institutional finance
// background" — never a named institution. No portrait asset yet, so a premium
// monogram carries the credential.
export default function FounderTrustStrip() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  return (
    <div ref={ref} className="mx-auto max-w-5xl">
      <div
        className={`text-[10.5px] uppercase tracking-[0.32em] text-champagne-300 transition-all duration-700 ease-cinema ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        Who's behind the desk
      </div>

      <div className="mt-8 grid gap-10 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-14">
        <div
          className={`flex flex-col items-center text-center transition-all duration-700 ease-cinema sm:items-start sm:text-left ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "80ms" }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-champagne-300/50 bg-ink/[0.02] text-[24px] font-light tracking-tight text-champagne-300">
            CS
          </div>
          <div className="mt-4 text-[16px] text-ink">Chris Sam</div>
          <div className="mt-1 text-[11.5px] uppercase tracking-[0.18em] text-ink/45">
            Institutional finance · Los Angeles
          </div>
        </div>

        <div
          className={`transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "160ms" }}
        >
          <p className="max-w-[56ch] text-[18px] leading-[1.6] text-ink/80 sm:text-[20px]">
            Chris Sam founded GoldFin Desk after years inside institutional finance —
            building the finance rhythm he wished his own clients had.{" "}
            <span className="text-ink">Too big for templates, too small for a full-time CFO.</span>
          </p>
          <p className="mt-6 max-w-[52ch] border-l-2 border-champagne-300/60 pl-5 text-[15px] italic leading-[1.55] text-ink/65">
            “Software shows you numbers. GoldFin Desk helps you understand what they mean.”
          </p>
        </div>
      </div>
    </div>
  );
}
