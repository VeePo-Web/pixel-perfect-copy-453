import { reportSections } from "../content";
import { useActiveSection } from "../hooks/useActiveSection";

type Props = { active: boolean };

export default function StickyReportNav({ active }: Props) {
  const ids = reportSections.map((s) => s.id);
  const current = useActiveSection(ids, active);
  return (
    <nav aria-label="Briefing sections" className="hidden lg:block">
      <div className="sticky top-28">
        <div className="text-[10px] uppercase tracking-[0.28em] text-bone/45">In this briefing</div>
        <ul className="mt-4 space-y-1.5">
          {reportSections.map((s) => {
            const isActive = current === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`group flex items-center gap-3 py-1.5 text-[12.5px] transition-colors duration-300 ${
                    isActive ? "text-bone" : "text-bone/45 hover:text-bone/80"
                  }`}
                >
                  <span
                    className={`h-px transition-all duration-300 ${
                      isActive ? "w-6 bg-champagne-200" : "w-3 bg-ink/15 group-hover:w-5 group-hover:bg-ink/30"
                    }`}
                  />
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
