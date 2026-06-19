import { useState, forwardRef } from "react";
import { Instagram } from "lucide-react";

const serviceAreas = [
  { name: "Edmonton", note: "Home base" },
  { name: "Greater Edmonton", note: "No travel fees" },
  { name: "Surrounding Alberta", note: "Travel fees apply" },
];

const FooterServiceAreas = forwardRef<HTMLDivElement>((_, ref) => {
  const [hoveredArea, setHoveredArea] = useState<number | null>(null);

  return (
    <div ref={ref}>
      <p className="font-overline text-background/50 mb-5">
        Follow
      </p>
      <a
        href="https://www.instagram.com/hickoryandrose"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 font-sans-wedding text-sm text-background/60 hover:text-background transition-colors duration-200 font-light group/social relative overflow-hidden"
      >
        <Instagram size={14} strokeWidth={1.5} className="text-background/40 group-hover/social:text-background/60 transition-colors duration-300" />
        <span className="relative">
          @hickoryandrose
          <span
            className="absolute inset-0 -translate-x-full group-hover/social:translate-x-[200%] transition-transform duration-700 ease-out pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.2), transparent)", width: "60%" }}
          />
        </span>
      </a>

      <div className="mt-8">
        <p className="font-overline text-background/50 mb-3">
          Serving
        </p>
        <div className="flex flex-wrap gap-x-1.5 gap-y-1">
          {serviceAreas.map((area, i) => (
            <span
              key={area.name}
              className="inline-flex items-center gap-1 group/area cursor-default"
              onMouseEnter={() => setHoveredArea(i)}
              onMouseLeave={() => setHoveredArea(null)}
            >
              <span className="font-sans-wedding text-caption text-background/50 font-light group-hover/area:text-background/70 transition-colors duration-300">
                {area.name}
              </span>
              <span
                className={`font-serif-wedding text-caption italic text-background/40 overflow-hidden whitespace-nowrap transition-all duration-200 ${
                  hoveredArea === i ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0"
                }`}
              >
                ({area.note})
              </span>
              {i < serviceAreas.length - 1 && (
                <span className="text-background/30 mx-0.5">·</span>
              )}
            </span>
          ))}
        </div>
        <p className="font-sans-wedding text-[0.6rem] text-background/35 font-light italic mt-3 leading-relaxed">
          Travel fees apply outside Greater Edmonton.
        </p>
      </div>
    </div>
  );
});

FooterServiceAreas.displayName = "FooterServiceAreas";

export default FooterServiceAreas;
