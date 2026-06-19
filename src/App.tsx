import FinanceHero from "./components/hero/FinanceHero";
import HowItWorks from "./components/how-it-works/HowItWorks";
import ApplicationFunnel from "./components/apply/ApplicationFunnel";
import SampleBriefingPage from "./components/sample-briefing/SampleBriefingPage";
import { useHashRoute } from "./components/apply/hooks/useHashRoute";

const App = () => {
  const route = useHashRoute();

  if (route === "apply" || route === "thank-you") {
    return (
      <main className="relative min-h-screen w-screen overflow-x-hidden bg-charcoal-950">
        <ApplicationFunnel />
      </main>
    );
  }

  if (route === "sample-briefing") {
    return (
      <main className="relative min-h-screen w-screen overflow-x-hidden bg-charcoal-950">
        <SampleBriefingPage />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-charcoal-950">
      <FinanceHero />
      <HowItWorks />
    </main>
  );
};

export default App;
