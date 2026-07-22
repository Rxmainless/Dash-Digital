import { ThemeToggle } from "./components/ThemeToggle";
import { HeroStats } from "./components/HeroStats";
import { EmpresasSummary } from "./components/EmpresasSummary";
import { BairroChart } from "./components/BairroChart";
import { EmbarcadasSummary } from "./components/EmbarcadasSummary";

function App() {
  return (
    <div className="container-editorial">
      <header className="masthead">
        <div className="azulejo-band" aria-hidden="true" />
        <div className="masthead-row">
          <div>
            <p className="eyebrow">Recife, PE · 8°03'S 34°52'W</p>
            <h1>O ecossistema de tecnologia do Porto Digital</h1>
            <p className="dek">Um levantamento cruzando dados oficiais e dados abertos da cidade.</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <HeroStats />

      <hr className="section-divider" />

      <EmpresasSummary />
      <BairroChart />

      <EmbarcadasSummary />
    </div>
  );
}

export default App;