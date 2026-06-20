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
    document.title = "Sample Bi-Weekly Finance Briefing · GoldFin Desk";
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
