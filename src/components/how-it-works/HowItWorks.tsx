import { useEffect, useRef, useState } from "react";
import HowItWorksIntro from "./parts/HowItWorksIntro";
import ProcessTimeline from "./parts/ProcessTimeline";
import WhatYouDoVsWeDo from "./parts/WhatYouDoVsWeDo";
import MonthlyCycle from "./parts/MonthlyCycle";
import BeforeAfter from "./parts/BeforeAfter";
import SampleBriefingPreview from "./parts/SampleBriefingPreview";
import DifferenceTable from "./parts/DifferenceTable";
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

function Band({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`relative px-6 py-20 md:px-10 md:py-28 lg:px-16 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
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

      <Band>
        <HowItWorksIntro />
      </Band>

      <Band>
        <ProcessTimeline />
      </Band>

      <Band>
        <WhatYouDoVsWeDo />
      </Band>

      <Band>
        <MonthlyCycle />
      </Band>

      <Band>
        <BeforeAfter />
      </Band>

      <Band>
        <SampleBriefingPreview />
        <Sentinel onChange={(v) => setSamplePassed(!v && heroPassed)} />
      </Band>

      <Band>
        <DifferenceTable />
      </Band>

      <Band>
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
          href={samplePassed ? "#/apply" : "#top"}
          className="relative block overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3.5 text-center text-[13px] font-medium tracking-wide text-navy shadow-[0_10px_40px_-10px_rgba(217,190,130,0.55)]"
        >
          <span className="relative z-10">{samplePassed ? "Apply for the GoldFin Desk" : "Generate Sample Briefing"}</span>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
        </a>
      </div>
    </section>
  );
}
