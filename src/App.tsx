import FinanceHero from "./components/hero/FinanceHero";
import HowItWorks from "./components/how-it-works/HowItWorks";

const App = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-charcoal-950">
      <FinanceHero />
      <HowItWorks />
    </main>
  );
};

export default App;

