import { ThemeToggle } from "./components/ThemeToggle";
import { HeroStats } from "./components/HeroStats";
import { EmpresasSummary } from "./components/EmpresasSummary";
import { BairroChart } from "./components/BairroChart";
import { AreaChart } from "./components/AreaChart";
import { EmbarcadasDirectory } from "./components/EmbarcadasDirectory";
import { SectionNav } from "./components/SectionNav";
import { PageFooter } from "./components/PageFooter";

function App() {
  return (
    <>
      <SectionNav />
      <div className="container-editorial">
        <header className="masthead">
          <div className="azulejo-band" aria-hidden="true" />
          <div className="masthead-row">
            <div>
              <p className="eyebrow">Recife, PE · 8°03'S 34°52'W</p>
              <h1>O ecossistema de tecnologia do Porto Digital</h1>
              <p className="dek">
                Um levantamento cruzando dados oficiais e dados abertos da cidade.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <section id="registro-oficial" className="page-section">
          <HeroStats />
        </section>

        <hr className="section-divider" />

        <section id="levantamento-campo" className="page-section">
          <EmpresasSummary />

          <p className="lede">
            O Porto Digital também mantém um diretório público de startups embarcadas —
            398 registros na última atualização, a maioria (95,7%) classificada como
            "Startup". Esse número é menor que o total oficial de 541 empresas
            embarcadas: a diferença provavelmente reflete que esse diretório prioriza
            startups sobre outras categorias de empresa conveniada, mas a causa exata
            não foi confirmada.
          </p>

          <div className="charts-grid">
            <BairroChart />
            <AreaChart />
          </div>
        </section>

        <hr className="section-divider" />

        <section id="diretorio" className="page-section">
          <p className="section-label">Diretório de startups embarcadas</p>
          <p className="lede">
            Consulte as <span className="data-figure">398</span> startups do diretório
            público, buscando por nome ou filtrando por área de atuação.
          </p>
          <EmbarcadasDirectory />
        </section>

        <PageFooter />
      </div>
    </>
  );
}

export default App;