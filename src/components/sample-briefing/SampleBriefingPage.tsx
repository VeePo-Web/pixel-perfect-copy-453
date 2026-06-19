import { useEffect } from "react";
import SampleBriefingHero from "./parts/SampleBriefingHero";
import BriefingReportShell from "./parts/BriefingReportShell";
import RawDataVsClarity from "./parts/RawDataVsClarity";
import BriefingTabs from "./parts/BriefingTabs";
import WhatThisIsNot from "./parts/WhatThisIsNot";
import PrivacyTrustBlock from "./parts/PrivacyTrustBlock";
import SampleBriefingCTA from "./parts/SampleBriefingCTA";
import TemplateBridge from "./parts/TemplateBridge";
import MobileStickyCTA from "./parts/MobileStickyCTA";
import { useBriefingState } from "./hooks/useBriefingState";

export default function SampleBriefingPage() {
  const s = useBriefingState();

  useEffect(() => {
    const prev = document.title;
    document.title = "Sample Bi-Weekly Finance Briefing · Monthly Finance Desk";
    return () => {
      document.title = prev;
    };
  }, []);

  const useDemo = () => {
    s.selectBusiness(s.businessId);
    s.generate(true);
  };

  return (
    <div className="relative pb-24 lg:pb-0">
      <TopBar />
      <SampleBriefingHero
        prompt={s.prompt}
        setPrompt={s.setPrompt}
        businessId={s.businessId}
        selectBusiness={s.selectBusiness}
        onGenerate={() => s.generate(true)}
        onUseDemo={useDemo}
        business={s.business}
        status={s.status}
        loaderIndex={s.loaderIndex}
      />
      <BriefingReportShell business={s.business} visible={s.status === "ready"} />
      <RawDataVsClarity />
      <BriefingTabs business={s.business} />
      <WhatThisIsNot />
      <PrivacyTrustBlock />
      <SampleBriefingCTA
        onAnother={() => {
          s.reset();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
      <TemplateBridge />
      <MobileStickyCTA status={s.status} onGenerate={() => s.generate(true)} />
    </div>
  );
}

function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.05] bg-charcoal-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-10">
        <a href="#/" className="group flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-champagne-200 transition-transform duration-400 group-hover:scale-125" />
          <span className="text-[12.5px] uppercase tracking-[0.28em] text-bone/85">
            Monthly Finance Desk
          </span>
        </a>
        <nav className="flex items-center gap-5 text-[12px]">
          <a
            href="#/"
            className="hidden text-bone/55 transition-colors hover:text-bone sm:inline"
          >
            Home
          </a>
          <a
            href="#briefing-report"
            className="hidden text-bone/55 transition-colors hover:text-bone md:inline"
          >
            Sample Briefing
          </a>
          <a
            href="#/apply"
            className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-4 py-1.5 text-[12px] font-medium text-charcoal-950 transition-all duration-300 hover:shadow-[0_8px_28px_-10px_rgba(217,190,130,0.55)]"
          >
            Apply
          </a>
        </nav>
      </div>
    </header>
  );
}
