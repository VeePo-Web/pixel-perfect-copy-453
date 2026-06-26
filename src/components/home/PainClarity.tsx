import { useInView } from "../how-it-works/hooks/useInView";

// Homepage Section 2 — Pain Clarification (belief-chain step 1).
// Belief sold: "You have financial data. You do not have financial clarity."
// One soft action: scroll into How It Works. Brunson: agitate the gap, then
// hand the visitor the next step. Copy is the persona's tested language.
const LINES: { tool: string; says: string }[] = [
  { tool: "Your bank account", says: "tells you what's left." },
  { tool: "Your bookkeeping", says: "tells you what happened." },
  { tool: "Your spreadsheets", says: "tell you what someone had time to update." },
  { tool: "Your dashboard", says: "shows charts." },
];

export default function PainClarity() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section
      aria-labelledby="pain-clarity-title"
      className="relative border-y border-ink/[0.06] bg-white"
    >
      <div ref={ref} className="mx-auto max-w-4xl px-6 py-16 md:py-28 lg:px-10">
        <div
          className={`text-[10.5px] uppercase tracking-[0.32em] text-champagne-300 transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          The real problem
        </div>

        <h2
          id="pain-clarity-title"
          className={`mt-5 max-w-[20ch] font-robert-medium text-[clamp(2rem,4.6vw,3.5rem)] font-black uppercase leading-[0.98] tracking-tight text-ink transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "80ms" }}
        >
          You have financial data. You do not have financial clarity.
        </h2>

        {/* The data lines — each tool, and the narrow thing it actually tells you */}
        <ul className="mt-12 divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
          {LINES.map((l, i) => (
            <li
              key={l.tool}
              className={`flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-4 transition-all duration-700 ease-cinema ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: `${200 + i * 90}ms` }}
            >
              <span className="w-[15ch] shrink-0 text-[15px] font-medium text-ink">
                {l.tool}
              </span>
              <span className="text-[15px] leading-[1.6] text-ink/70">{l.says}</span>
            </li>
          ))}
        </ul>

        {/* The gap reveal — lands after the data lines (sequential arrival) */}
        <p
          className={`mt-10 max-w-[58ch] text-[18px] leading-[1.6] text-ink/70 transition-all duration-700 ease-cinema sm:text-[20px] ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: `${200 + LINES.length * 90 + 120}ms` }}
        >
          But none of it tells you{" "}
          <em className="font-medium not-italic text-ink underline decoration-champagne-300/60 decoration-2 underline-offset-4">
            what changed
          </em>
          ,{" "}
          <em className="font-medium not-italic text-ink underline decoration-champagne-300/60 decoration-2 underline-offset-4">
            what's risky
          </em>
          , or{" "}
          <em className="font-medium not-italic text-ink underline decoration-champagne-300/60 decoration-2 underline-offset-4">
            what decision deserves your attention next.
          </em>{" "}
          That's the gap GoldFin Desk fills.
        </p>
      </div>
    </section>
  );
}
