import { useEffect } from "react";
import ThreeWayTopBar from "./parts/ThreeWayTopBar";
import ComparisonHero from "./parts/ComparisonHero";
import FastAnswerCards from "./parts/FastAnswerCards";
import RealDifferenceSection from "./parts/RealDifferenceSection";
import FinancialSupportFitFinder from "./parts/FinancialSupportFitFinder";
import ThreeWayComparisonTable from "./parts/ThreeWayComparisonTable";
import MissingMiddleSpectrum from "./parts/MissingMiddleSpectrum";
import ScenarioRecommendationCards from "./parts/ScenarioRecommendationCards";
import OwnerFeelingComparison from "./parts/OwnerFeelingComparison";
import SampleBriefingProof from "./parts/SampleBriefingProof";
import PricingValueContext from "./parts/PricingValueContext";
import ComparisonFAQ from "./parts/ComparisonFAQ";
import DecisionGuideSummary from "./parts/DecisionGuideSummary";
import SoftConversionBridge from "./parts/SoftConversionBridge";
import FinalComparisonCTA from "./parts/FinalComparisonCTA";
import MobileStickyCTA from "./parts/MobileStickyCTA";
import { useFitFinder } from "./hooks/useFitFinder";
import { useDocumentHead } from "./hooks/useDocumentHead";
import { track } from "./analytics";

export default function BookkeeperVsFractionalCFOPage() {
  const finder = useFitFinder();
  useDocumentHead();

  useEffect(() => {
    track("three_way_comparison_viewed");
  }, []);

  return (
    <div className="relative pb-24 lg:pb-0">
      <ThreeWayTopBar />
      <ComparisonHero />
      <FastAnswerCards />
      <RealDifferenceSection />
      <FinancialSupportFitFinder finder={finder} />
      <ThreeWayComparisonTable />
      <MissingMiddleSpectrum />
      <ScenarioRecommendationCards />
      <OwnerFeelingComparison />
      <SampleBriefingProof />
      <PricingValueContext />
      <ComparisonFAQ />
      <DecisionGuideSummary />
      <SoftConversionBridge />
      <FinalComparisonCTA />
      <MobileStickyCTA recommendation={finder.recommendation} />
    </div>
  );
}
