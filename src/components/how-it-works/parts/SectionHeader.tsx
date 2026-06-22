import { useInView } from "../hooks/useInView";

type Props = { eyebrow?: string; headline: string; sub?: string; align?: "left" | "center" };

export default function SectionHeader({ eyebrow, headline, sub, align = "left" }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const a = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div ref={ref} className={`max-w-3xl ${a}`}>
      {eyebrow && (
        <div
          className={`mb-5 inline-block text-[11px] uppercase tracking-[0.28em] text-champagne-200/70 transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <span className="mr-3 inline-block h-px w-8 align-middle bg-champagne-200/40" />
          {eyebrow}
        </div>
      )}
      <h2
        className={`font-robert-medium text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.05] tracking-tight text-ink transition-all duration-700 ease-cinema ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
        style={{ transitionDelay: "80ms" }}
      >
        {headline}
      </h2>
      {sub && (
        <p
          className={`mt-5 max-w-2xl text-[15px] leading-[1.7] text-ink/65 transition-all duration-700 ease-cinema ${align === "center" ? "mx-auto" : ""} ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "160ms" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
