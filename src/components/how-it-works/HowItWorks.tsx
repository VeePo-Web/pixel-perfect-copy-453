import { useEffect, useRef, useState } from "react";
import { HIW_COPY } from "./content";
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
    const obs = new IntersectionObserver(([e]) => onChange(e.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [onChange]);
  return <div ref={ref} />;
}

function Band({
  children,
  className = "",
  divider = true,
  ghost,
}: {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
  ghost?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden px-6 py-20 md:px-10 md:py-28 lg:px-16 ${
        divider ? "border-t border-charcoal-700/50" : ""
      } ${className}`}
    >
      {ghost && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-2 select-none font-robert-medium text-[clamp(7rem,17vw,15rem)] uppercase leading-none text-ink/[0.025] md:right-8 lg:right-12"
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
    <section
      id="how-it-works"
      className="relative isolate bg-white text-ink"
    >

      <Sentinel onChange={(v) => setHeroPassed(!v)} />

      <Band divider={false} ghost="03">
        <HowItWorksIntro />
      </Band>

      <Band className="bg-paper-raised" ghost="04">
        <ProcessTimeline />
      </Band>

      <Band ghost="05">
        <WhatYouDoVsWeDo />
      </Band>

      <Band className="bg-paper-raised" ghost="06">
        <MonthlyCycle />
      </Band>

      <Band ghost="07">
        <BeforeAfter />
      </Band>

      <Band className="bg-paper-raised" ghost="08">
        <SampleBriefingPreview />
        <Sentinel onChange={(v) => setSamplePassed(!v && heroPassed)} />
      </Band>

      <Band ghost="09">
        <DifferenceTable />
      </Band>

      <Band className="bg-paper-raised" ghost="10">
        <WhoNotFor />
      </Band>

      <Band ghost="11">
        <FounderTrustStrip />
      </Band>

      <Band className="bg-paper-raised">
        <TrustSection />
      </Band>

      <Band className="pb-32">
        <FinalCTA />
      </Band>

      {/* Mobile sticky CTA */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-all duration-500 ease-cinema md:hidden ${
          heroPassed ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-3"
        }`}
      >
        <a
          href={samplePassed ? "#/pricing#auto-fill" : "#top"}
          className="relative block overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3.5 text-center text-[13px] font-medium tracking-wide text-navy shadow-[0_10px_40px_-10px_rgba(217,190,130,0.55)] transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2"
        >
          <span className="relative z-10">{samplePassed ? HIW_COPY.sample.cta : "Generate Sample Briefing"}</span>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
        </a>
      </div>
    </section>
  );
}
