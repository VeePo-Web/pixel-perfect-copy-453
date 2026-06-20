import { useEffect } from "react";

import PricingHero from "./parts/PricingHero";
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
    document.title = "Pricing · Monthly Finance Desk";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="relative pb-24 lg:pb-0">
      
      <PricingHero />
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
