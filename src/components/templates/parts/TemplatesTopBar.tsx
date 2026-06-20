type Props = { currentPath?: "templates" | "pricing" | "sample-briefing" | "compare" | "home" };

export default function TemplatesTopBar({ currentPath = "templates" }: Props) {
  const link = (label: string, href: string, active = false) => (
    <a
      href={href}
      className={`text-[12px] transition-colors ${
        active ? "text-ink" : "text-ink/55 hover:text-ink"
      }`}
    >
      {label}
    </a>
  );
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink/[0.05] bg-charcoal-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
        <a href="#/" className="group flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-champagne-200 transition-transform duration-400 group-hover:scale-125" />
          <span className="text-[12.5px] uppercase tracking-[0.28em] text-ink/85">
            GoldFin Desk
          </span>
        </a>
        <nav className="flex items-center gap-5">
          {link("Templates", "#/templates", currentPath === "templates")}
          {link("Compare", "#/compare", currentPath === "compare")}
          {link("Sample Briefing", "#/sample-briefing", currentPath === "sample-briefing")}
          {link("Pricing", "#/pricing", currentPath === "pricing")}
          <a
            href="#/apply"
            className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-4 py-1.5 text-[12px] font-medium text-navy transition-all duration-300 hover:shadow-[0_8px_28px_-10px_rgba(217,190,130,0.55)]"
          >
            Apply
          </a>
        </nav>
      </div>
    </header>
  );
}
