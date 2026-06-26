import { useEffect } from "react";
import PricingFAQSchema from "./parts/PricingFAQSchema";

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
    const prevTitle = document.title;
    document.title = "Monthly Financial Reports — $99/mo | GoldFin Desk";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "GoldFin Reports fills your financial templates from your numbers and sends a plain-English monthly briefing — $99/mo, no spreadsheet work, cancel anytime. GoldFin Advisory ($1,500/mo) available by application.",
    );
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc) meta.setAttribute("content", prevDesc);
    };
  }, []);

  // Scroll to the $99/mo Auto-Fill offer when linked as /pricing#auto-fill
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

      <PricingFAQSchema />
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
