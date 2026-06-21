import { useEffect, useState } from "react";
import FinanceHero from "./components/hero/FinanceHero";
import HomeSchema from "./components/home/HomeSchema";
import PainClarity from "./components/home/PainClarity";
import HowItWorks from "./components/how-it-works/HowItWorks";
import ApplicationFunnel from "./components/apply/ApplicationFunnel";
import SampleBriefingPage from "./components/sample-briefing/SampleBriefingPage";
import PricingPage from "./components/pricing/PricingPage";
import FreeTemplateLibraryPage from "./components/templates/FreeTemplateLibraryPage";
import ComparisonHubPage from "./components/compare/ComparisonHubPage";
import BookkeeperVsFractionalCFOPage from "./components/three-way-compare/BookkeeperVsFractionalCFOPage";
import SecurityFAQPage from "./components/security-faq/SecurityFAQPage";
import CheckoutOverlay from "./components/payments/CheckoutOverlay";
import CheckoutReturnPage from "./components/payments/CheckoutReturnPage";
import BillingPage from "./components/payments/BillingPage";
import PaymentTestModeBanner from "./components/payments/PaymentTestModeBanner";
import GlobalTopBar, { type NavKey } from "./components/nav/GlobalTopBar";
import { useHashRoute } from "./components/apply/hooks/useHashRoute";

function usePathname(): string {
  const [path, setPath] = useState(
    typeof window === "undefined" ? "/" : window.location.pathname,
  );
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  return path;
}

const App = () => {
  const route = useHashRoute();
  const pathname = usePathname();

  // Path-based routes (Stripe's return URL is a real path, not a hash).
  if (pathname === "/checkout/return") return <CheckoutReturnPage />;
  if (pathname === "/billing") {
    return (
      <main className="relative min-h-screen w-screen overflow-x-hidden bg-charcoal-950">
        <PaymentTestModeBanner />
        <GlobalTopBar currentPath="home" />
        <BillingPage />
        <CheckoutOverlay />
      </main>
    );
  }

  const wrap = (key: NavKey, children: React.ReactNode, extraTopPad = false) => (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-charcoal-950">
      <PaymentTestModeBanner />
      <GlobalTopBar currentPath={key} />
      <div className={extraTopPad ? "pt-14" : undefined}>{children}</div>
      <CheckoutOverlay />
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
      <HomeSchema />
      <FinanceHero />
      <PainClarity />
      <HowItWorks />
    </>,
    true,
  );
};

export default App;
