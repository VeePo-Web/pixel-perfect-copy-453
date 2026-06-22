import { HIW_COPY } from "../content";
import SectionHeader from "./SectionHeader";
import { useInView } from "../hooks/useInView";

export default function TrustSection() {
  const c = HIW_COPY.trust;
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div>
      <SectionHeader headline={c.headline} />
      <div ref={ref} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {c.cards.map((card, i) => (
          <div
            key={card}
            className={`relative rounded-xl border border-charcoal-700 bg-white p-5 shadow-[0_1px_2px_0_rgba(11,13,18,0.05)] transition-all duration-500 ease-cinema hover:border-champagne-200/40 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_-4px_rgba(11,13,18,0.08)] ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: `${80 + i * 80}ms` }}
          >
            <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/30 to-transparent" />
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-champagne-300/70">0{i + 1}</div>
            <p className="mt-3 text-[13.5px] leading-[1.55] text-ink/80">{card}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
