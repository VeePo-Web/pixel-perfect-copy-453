import { useEffect } from "react";
import SampleBriefingHero from "./parts/SampleBriefingHero";
import BriefingReportShell from "./parts/BriefingReportShell";
import RawDataVsClarity from "./parts/RawDataVsClarity";
import BriefingTabs from "./parts/BriefingTabs";
import VerticalReferenceReports from "./parts/VerticalReferenceReports";
import WhatThisIsNot from "./parts/WhatThisIsNot";
import PrivacyTrustBlock from "./parts/PrivacyTrustBlock";
import SampleBriefingCTA from "./parts/SampleBriefingCTA";
import TemplateBridge from "./parts/TemplateBridge";
import MobileStickyCTA from "./parts/MobileStickyCTA";
import { useBriefingState } from "./hooks/useBriefingState";

export default function SampleBriefingPage() {
  const s = useBriefingState();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Plain-English Finance Briefing (Sample) | GoldFin Desk";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "See what a plain-English monthly finance briefing looks like for your business — cash movement, revenue, expenses, and decisions. No bank connection required.",
    );
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc) meta.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <div className="relative pb-24 lg:pb-0">

      <SampleBriefingHero
        prompt={s.prompt}
        setPrompt={s.setPrompt}
        businessId={s.businessId}
        selectBusiness={s.selectBusiness}
        onGenerate={() => s.generate(true)}
        business={s.business}
        status={s.status}
        loaderIndex={s.loaderIndex}
      />
      <BriefingReportShell business={s.business} visible={s.status === "ready"} />
      <RawDataVsClarity />
      <BriefingTabs business={s.business} />
      <VerticalReferenceReports />
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
