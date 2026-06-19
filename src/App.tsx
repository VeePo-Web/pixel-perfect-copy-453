import FinanceHero from "./components/hero/FinanceHero";
import HowItWorks from "./components/how-it-works/HowItWorks";
import ApplicationFunnel from "./components/apply/ApplicationFunnel";
import { useHashRoute } from "./components/apply/hooks/useHashRoute";

const App = () => {
  const route = useHashRoute();
  const inFunnel = route === "apply" || route === "thank-you";

  if (inFunnel) {
    return (
      <main className="relative min-h-screen w-screen overflow-x-hidden bg-charcoal-950">
        <ApplicationFunnel />
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
