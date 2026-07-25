import { ThemeToggle } from "./components/ThemeToggle";
import { HeroStats } from "./components/HeroStats";
import { EmpresasSummary } from "./components/EmpresasSummary";
import { BairroChart } from "./components/BairroChart";
import { AreaChart } from "./components/AreaChart";
import { EmbarcadasDirectory } from "./components/EmbarcadasDirectory";
import { SectionNav } from "./components/SectionNav";
import { PageFooter } from "./components/PageFooter";
import { AnimatedNumber } from "./components/AnimatedNumber";
import { Skeleton } from "./components/Skeleton";
import { useFetchJSON } from "./hooks/useFetchJSON";

interface Embarcada {
  id: number;
  company_type: string;
}

function DiretorioIntro() {
  const { data: embarcadas, error } = useFetchJSON<Embarcada[]>("/data/embarcadas.json");

  if (error) return <p className="lede">Erro ao carregar dados: {error}</p>;

  if (!embarcadas) {
    return (
      <div className="skeleton-lines">
        <Skeleton height="1.4rem" width="90%" />
        <Skeleton height="1.4rem" width="60%" />
      </div>
    );
  }

  const total = embarcadas.length;
  const startups = embarcadas.filter((e) => e.company_type === "Startup").length;
  const percentualStartup = Math.round((startups / total) * 100);

  return (
    <p className="lede">
      O Porto Digital também mantém um diretório público de startups embarcadas —{" "}
      <AnimatedNumber value={total} /> registros na última atualização, a maioria (
      {percentualStartup}%) classificada como "Startup". Esse número é menor que o
      total oficial de 541 empresas embarcadas: a diferença provavelmente reflete
      que esse diretório prioriza startups sobre outras categorias de empresa
      conveniada, mas a causa exata não foi confirmada.
    </p>
  );
}

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

          <DiretorioIntro />

          <div className="charts-grid">
            <BairroChart />
            <AreaChart />
          </div>
        </section>

        <hr className="section-divider" />

        <section id="diretorio" className="page-section">
          <p className="section-label">Diretório de startups embarcadas</p>
          <EmbarcadasDirectory />
        </section>

        <PageFooter />
      </div>
    </>
  );
}

export default App;