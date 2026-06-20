import FinanceHero from "./components/hero/FinanceHero";
import HowItWorks from "./components/how-it-works/HowItWorks";
import ApplicationFunnel from "./components/apply/ApplicationFunnel";
import SampleBriefingPage from "./components/sample-briefing/SampleBriefingPage";
import PricingPage from "./components/pricing/PricingPage";
import FreeTemplateLibraryPage from "./components/templates/FreeTemplateLibraryPage";
import ComparisonHubPage from "./components/compare/ComparisonHubPage";
import BookkeeperVsFractionalCFOPage from "./components/three-way-compare/BookkeeperVsFractionalCFOPage";
import SecurityFAQPage from "./components/security-faq/SecurityFAQPage";
import GlobalTopBar, { type NavKey } from "./components/nav/GlobalTopBar";
import { useHashRoute } from "./components/apply/hooks/useHashRoute";

const App = () => {
  const route = useHashRoute();

  const wrap = (key: NavKey, children: React.ReactNode, extraTopPad = false) => (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-charcoal-950">
      <GlobalTopBar currentPath={key} />
      <div className={extraTopPad ? "pt-14" : undefined}>{children}</div>
    </main>
  );

  if (route === "apply" || route === "thank-you") {
    return wrap("apply", <ApplicationFunnel />, true);
  }
  if (route === "sample-briefing") {
    return wrap("sample-briefing", <SampleBriefingPage />);
  }
  if (route === "pricing") {
    return wrap("pricing", <PricingPage />);
  }
  if (route === "templates") {
    return wrap("templates", <FreeTemplateLibraryPage />);
  }
  if (route === "three-way-compare") {
    return wrap("compare", <BookkeeperVsFractionalCFOPage />);
  }
  if (route === "compare") {
    return wrap("compare", <ComparisonHubPage />);
  }
  if (route === "security-faq") {
    return wrap("security-faq", <SecurityFAQPage />);
  }

  return wrap(
    "home",
    <>
      <FinanceHero />
      <HowItWorks />
    </>,
    true,
  );
};

export default App;
