import { type ReactNode } from "react";

type Props = {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  cta?: ReactNode;
  className?: string;
};

export default function ModuleShell({ id, eyebrow, title, children, cta, className }: Props) {
  return (
    <section
      id={id}
      className={`group relative scroll-mt-28 rounded-2xl border border-ink/[0.06] bg-charcoal-900/55 p-7 backdrop-blur-sm transition-all duration-500 ease-cinema hover:-translate-y-0.5 hover:border-champagne-200/25 hover:shadow-[0_24px_60px_-30px_rgba(217,190,130,0.25)] sm:p-9 ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {eyebrow && (
        <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">{eyebrow}</div>
      )}
      <h3 className="mt-2 font-display font-medium text-ink text-[26px] leading-[1.15] tracking-[-0.02em] sm:text-[30px]">
        {title}
      </h3>
      <div className="mt-6">{children}</div>
      {cta && <div className="mt-7">{cta}</div>}
    </section>
  );
}
