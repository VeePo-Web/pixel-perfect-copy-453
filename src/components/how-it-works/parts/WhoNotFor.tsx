import { useInView } from "../hooks/useInView";

// Qualification section (persona §11). Conversion discipline, not negativity —
// respectfully repelling the wrong buyer raises premium perception and
// pre-qualifies the people who do convert.
const NOT_FOR = [
  "Owners looking for the cheapest spreadsheet",
  "Businesses that never want to review their financials",
  "Companies that only want basic data entry",
  "People who want a one-time template and no ongoing support",
];

export default function WhoNotFor() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  return (
    <div ref={ref} className="mx-auto max-w-4xl">
      <div
        className={`text-[10.5px] uppercase tracking-[0.32em] text-champagne-300 transition-all duration-700 ease-cinema ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        A quiet standard
      </div>
      <h2
        className={`mt-4 font-robert-medium text-[clamp(1.9rem,4.2vw,3rem)] font-black uppercase leading-[1] tracking-tight text-ink transition-all duration-700 ease-cinema ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
        style={{ transitionDelay: "80ms" }}
      >
        This is not for everyone.
      </h2>

      <ul className="mt-9 space-y-3">
        {NOT_FOR.map((item, i) => (
          <li
            key={item}
            className={`flex items-start gap-3 text-[15px] leading-[1.55] text-ink/55 transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: `${160 + i * 80}ms` }}
          >
            <svg viewBox="0 0 16 16" className="mt-1 h-3.5 w-3.5 shrink-0 text-ink/30" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {item}
          </li>
        ))}
      </ul>

      <p
        className={`mt-10 max-w-[52ch] border-l-2 border-champagne-300/60 pl-6 text-[18px] leading-[1.5] text-ink transition-all duration-700 ease-cinema ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: `${160 + NOT_FOR.length * 80 + 100}ms` }}
      >
        GoldFin Desk is for owners who want a recurring, premium financial
        rhythm — and are ready to actually use it.
      </p>
    </div>
  );
}
