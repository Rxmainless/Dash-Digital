import { EmpresasSummary } from "./components/EmpresasSummary";
import { BairroChart } from "./components/BairroChart";
import { HeroStats } from "./components/HeroStats";

function App() {
  return (
    <div>
      <HeroStats />
      <EmpresasSummary />
      <BairroChart />
      
    </div>
  );
}

export default App;