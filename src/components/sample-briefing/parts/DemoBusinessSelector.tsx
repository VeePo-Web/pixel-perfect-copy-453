import { demoBusinesses, type DemoBusiness } from "../content";

type Props = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function DemoBusinessSelector({ selectedId, onSelect }: Props) {
  return (
    <div role="radiogroup" aria-label="Demo business" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 md:flex-wrap md:overflow-visible">
      {demoBusinesses.map((b: DemoBusiness) => {
        const active = b.id === selectedId;
        return (
          <button
            key={b.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(b.id)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-[12.5px] tracking-wide transition-all duration-300 ease-cinema ${
              active
                ? "border-champagne-200/50 bg-charcoal-800/80 text-ink shadow-[0_0_0_1px_rgba(217,190,130,0.18)]"
                : "border-ink/[0.08] bg-transparent text-ink/60 hover:text-ink hover:border-ink/20"
            }`}
          >
            {b.label}
          </button>
        );
      })}
    </div>
  );
}
