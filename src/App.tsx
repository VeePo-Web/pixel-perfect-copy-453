import { useEffect, useState } from "react";
import HomeSchema from "./components/home/HomeSchema";
import HomeHero from "./components/home/HomeHero";
import PainClarity from "./components/home/PainClarity";
import VaultPreview from "./components/home/VaultPreview";
import EpiphanyBridge from "./components/home/EpiphanyBridge";
import FounderTrustStrip from "./components/home/FounderTrustStrip";
import ClosingBaitCTA from "./components/home/ClosingBaitCTA";
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
import GoldFinFooter from "./components/footer/GoldFinFooter";
import { useHashRoute } from "./components/apply/hooks/useHashRoute";
import PortalRouter, { isPortalRoute } from "./portal/PortalRouter";

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

  // Portal + legal pages live entirely outside the marketing chrome.
  if (isPortalRoute(pathname)) return <PortalRouter pathname={pathname} />;

  // Path-based routes (Stripe's return URL is a real path, not a hash).
  if (pathname === "/checkout/return") return <CheckoutReturnPage />;
  if (pathname === "/billing") {
    return (
      <main className="relative min-h-screen w-screen overflow-x-hidden bg-charcoal-950">
        <PaymentTestModeBanner />
        <GlobalTopBar currentPath="home" />
        <BillingPage />
        <GoldFinFooter />
        <CheckoutOverlay />
      </main>
    );
  }

  const wrap = (key: NavKey, children: React.ReactNode, extraTopPad = false) => (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-charcoal-950">
      <PaymentTestModeBanner />
      <GlobalTopBar currentPath={key} />
      <div
        id="main-content"
        tabIndex={-1}
        className={`focus:outline-none${extraTopPad ? " pt-14" : ""}`}
      >
        {children}
      </div>
      <GoldFinFooter />
      <CheckoutOverlay />
    </main>
  );

  // Apply is a focused conversion funnel. It ships its own minimal header
  // (ApplicationHeader), so it must NOT also render the marketing GlobalTopBar —
  // that produced two stacked nav bars. Dropping the marketing nav + footer also
  // removes escape links that leak funnel conversions (CXL / Brunson).
  if (route === "apply" || route === "thank-you") {
    return <ApplicationFunnel />;
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
      <HomeHero />
      <PainClarity />
      <VaultPreview />
      <EpiphanyBridge />
      <FounderTrustStrip />
      <ClosingBaitCTA />
    </>,
    true,
  );
};

export default App;
