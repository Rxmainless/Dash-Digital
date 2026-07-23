import { ThemeToggle } from "./components/ThemeToggle";
import { HeroStats } from "./components/HeroStats";
import { EmpresasSummary } from "./components/EmpresasSummary";
import { BairroChart } from "./components/BairroChart";
import { AreaChart } from "./components/AreaChart";
import { EmbarcadasDirectory } from "./components/EmbarcadasDirectory";

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

      <hr className="section-divider" />

      <p className="section-label">Diretório de startups embarcadas</p>
      <p className="lede">
        O Porto Digital também mantém um diretório público de startups embarcadas —
        398 registros no momento da última atualização, a maioria (95,7%) classificada
        como "Startup". Esse número é menor que o total oficial de 541 empresas
        embarcadas: a diferença provavelmente reflete que esse diretório prioriza
        startups sobre outras categorias de empresa conveniada, mas a causa exata não
        foi confirmada.
      </p>
      <AreaChart />
      <EmbarcadasDirectory />
    </div>
  );
}

export default App;