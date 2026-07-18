import { ThemeToggle } from "./components/ThemeToggle";
import { HeroStats } from "./components/HeroStats";
import { EmpresasSummary } from "./components/EmpresasSummary";
import { BairroChart } from "./components/BairroChart";

function App() {
  return (
    <div className="container-editorial">
      <header className="masthead">
        <div>
          <p className="eyebrow">Recife, PE · 8°03'S 34°52'W</p>
          <h1>O ecossistema de tecnologia do Porto Digital</h1>
          <p className="dek">Um levantamento cruzando dados oficiais e dados abertos da cidade.</p>
        </div>
        <ThemeToggle />
      </header>

      <HeroStats />

      <hr className="section-divider" />

      <EmpresasSummary />
      <BairroChart />
    </div>
  );
}

export default App;