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
            className={`relative rounded-xl border border-ink/[0.06] bg-charcoal-900/40 p-5 transition-all duration-500 ease-cinema hover:border-champagne-200/30 hover:-translate-y-0.5 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: `${80 + i * 80}ms` }}
          >
            <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/30 to-transparent" />
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-champagne-200/60">0{i + 1}</div>
            <p className="mt-3 text-[13.5px] leading-[1.55] text-bone/80">{card}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
