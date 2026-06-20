import { useEffect } from "react";

import PricingHero from "./parts/PricingHero";
import AutoFillSpotlight from "./parts/AutoFillSpotlight";
import WhyAutoFill from "./parts/WhyAutoFill";
import PricingLadder from "./parts/PricingLadder";
import RecommendedPlanSpotlight from "./parts/RecommendedPlanSpotlight";
import WhyItMakesSense from "./parts/WhyItMakesSense";
import ValueStack from "./parts/ValueStack";
import CostComparisonTable from "./parts/CostComparisonTable";
import DecisionCostSection from "./parts/DecisionCostSection";
import PlanSelector from "./parts/PlanSelector";
import PricingFAQ from "./parts/PricingFAQ";
import PlanFitSection from "./parts/PlanFitSection";
import SampleBriefingPricingPreview from "./parts/SampleBriefingPricingPreview";
import PricingTrustBlock from "./parts/PricingTrustBlock";
import PricingFinalCTA from "./parts/PricingFinalCTA";
import MobileStickyCTA from "./parts/MobileStickyCTA";

export default function PricingPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Pricing · GoldFin Desk";
    return () => {
      document.title = prev;
    };
  }, []);

  // Scroll to the $99/mo Auto-Fill offer when linked as #/pricing#auto-fill
  // (from the homepage bridge, ladder card, or recommender).
  useEffect(() => {
    const scrollToOffer = () => {
      if (window.location.hash.includes("auto-fill")) {
        window.requestAnimationFrame(() => {
          document
            .getElementById("auto-fill")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };
    scrollToOffer();
    window.addEventListener("hashchange", scrollToOffer);
    return () => window.removeEventListener("hashchange", scrollToOffer);
  }, []);

  return (
    <div className="relative pb-24 lg:pb-0">

      <PricingHero />
      <AutoFillSpotlight />
      <WhyAutoFill />
      <PricingLadder />
      <RecommendedPlanSpotlight />
      <WhyItMakesSense />
      <ValueStack />
      <CostComparisonTable />
      <DecisionCostSection />
      <PlanSelector />
      <PricingFAQ />
      <PlanFitSection />
      <SampleBriefingPricingPreview />
      <PricingTrustBlock />
      <PricingFinalCTA />
      <MobileStickyCTA />
    </div>
  );
}
