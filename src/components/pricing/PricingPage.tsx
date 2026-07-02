import { useEffect } from "react";
import PricingFAQSchema from "./parts/PricingFAQSchema";

import PricingHero from "./parts/PricingHero";
import AutoFillSpotlight from "./parts/AutoFillSpotlight";
import WhyAutoFill from "./parts/WhyAutoFill";
import ValueStack from "./parts/ValueStack";
import CostComparisonTable from "./parts/CostComparisonTable";
import DecisionCostSection from "./parts/DecisionCostSection";
import PricingFAQ from "./parts/PricingFAQ";
import SampleBriefingPricingPreview from "./parts/SampleBriefingPricingPreview";
import PricingTrustBlock from "./parts/PricingTrustBlock";
import PricingFinalCTA from "./parts/PricingFinalCTA";
import MobileStickyCTA from "./parts/MobileStickyCTA";

export default function PricingPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Monthly Financial Reports — $150/mo | GoldFin Desk";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "GoldFin Reports fills your financial templates from your bank feed and sends a plain-English briefing every two weeks — $150/mo, no spreadsheet work, cancel anytime.",
    );
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc) meta.setAttribute("content", prevDesc);
    };
  }, []);

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
      <ValueStack />
      <CostComparisonTable />
      <DecisionCostSection />
      <PricingFAQ />
      <SampleBriefingPricingPreview />
      <PricingTrustBlock />
      <PricingFinalCTA />
      <MobileStickyCTA />
    </div>
  );
}
