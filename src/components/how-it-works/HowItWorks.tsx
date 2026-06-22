import { useEffect, useRef, useState } from "react";
import HowItWorksIntro from "./parts/HowItWorksIntro";
import ProcessTimeline from "./parts/ProcessTimeline";
import WhatYouDoVsWeDo from "./parts/WhatYouDoVsWeDo";
import MonthlyCycle from "./parts/MonthlyCycle";
import BeforeAfter from "./parts/BeforeAfter";
import SampleBriefingPreview from "./parts/SampleBriefingPreview";
import DifferenceTable from "./parts/DifferenceTable";
import WhoNotFor from "./parts/WhoNotFor";
import FounderTrustStrip from "./parts/FounderTrustStrip";
import TrustSection from "./parts/TrustSection";
import FinalCTA from "./parts/FinalCTA";

function Sentinel({ onChange }: { onChange: (visible: boolean) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => onChange(e.isIntersecting), {
      threshold: 0,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [onChange]);
  return <div ref={ref} />;
}

interface BandProps {
  children: React.ReactNode;
  className?: string;
  ghost?: string;
  divider?: boolean;
  extraBottom?: boolean;
}

function Band({
  children,
  className = "",
  ghost,
  divider = true,
  extraBottom = false,
}: BandProps) {
  return (
    <section
      className={`relative overflow-hidden px-6 py-20 md:px-10 md:py-28 lg:px-16 ${
        extraBottom ? "pb-32 md:pb-40" : ""
      } ${divider ? "border-t border-charcoal-700/50" : ""} ${className}`}
    >
      {ghost && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-2 select-none font-robert-medium text-[clamp(7rem,17vw,15rem)] font-black uppercase leading-none text-ink/[0.025]"
        >
          {ghost}
        </span>
      )}
      <div className="relative mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export default function HowItWorks() {
  const [heroPassed, setHeroPassed] = useState(false);
  const [samplePassed, setSamplePassed] = useState(false);

  return (
    <section id="how-it-works" className="relative isolate bg-white text-ink">
      <Sentinel onChange={(v) => setHeroPassed(!v)} />

      {/* Band 03 — white */}
      <Band divider={false} ghost="03">
        <HowItWorksIntro />
      </Band>

      {/* Band 04 — raised */}
      <Band className="bg-paper-raised" ghost="04">
        <ProcessTimeline />
      </Band>

      {/* Band 05 — white */}
      <Band ghost="05">
        <WhatYouDoVsWeDo />
      </Band>

      {/* Band 06 — raised */}
      <Band className="bg-paper-raised" ghost="06">
        <MonthlyCycle />
      </Band>

      {/* Band 07 — white */}
      <Band ghost="07">
        <BeforeAfter />
      </Band>

      {/* Band 08 — raised */}
      <Band className="bg-paper-raised" ghost="08">
        <SampleBriefingPreview />
        <Sentinel onChange={(v) => setSamplePassed(!v && heroPassed)} />
      </Band>

      {/* Band 09 — white */}
      <Band ghost="09">
        <DifferenceTable />
      </Band>

      {/* Band 10 — raised */}
      <Band className="bg-paper-raised" ghost="10">
        <WhoNotFor />
      </Band>

      {/* Band 11 — white */}
      <Band ghost="11">
        <FounderTrustStrip />
      </Band>

      {/* Band 12 — raised */}
      <Band className="bg-paper-raised" ghost="12">
        <TrustSection />
      </Band>

      {/* Band 13 — white, dark FinalCTA card inside */}
      <Band extraBottom ghost="13">
        <FinalCTA />
      </Band>

      {/* Mobile sticky CTA */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-all duration-500 ease-cinema md:hidden ${
          heroPassed
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <a
          href={samplePassed ? "#/pricing#auto-fill" : "#/sample-briefing"}
          className="relative block overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3.5 text-center text-[13px] font-medium tracking-wide text-navy shadow-[0_10px_40px_-10px_rgba(212,168,69,0.45)]"
        >
          <span className="relative z-10">
            {samplePassed ? "Auto-fill my reports — $99/mo" : "Generate Sample Briefing"}
          </span>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
        </a>
      </div>
    </section>
  );
}
