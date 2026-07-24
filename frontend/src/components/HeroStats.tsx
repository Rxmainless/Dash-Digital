import { useFetchJSON } from "../hooks/useFetchJSON";
import { AnimatedNumber } from "./AnimatedNumber";
import { Skeleton } from "./Skeleton";

interface HeroStatsData {
  fonte_principal: string;
  data_verificacao: string;
  empresas_embarcadas: number;
  colaboradores: number;
  faturamento_2025: string;
  crescimento_faturamento_2025: string;
  ano_fundacao: number;
  territorio_hectares: number;
}

export function HeroStats() {
  const { data: stats, error } = useFetchJSON<HeroStatsData>("/data/hero_stats.json");

  if (error) return <p className="lede">Erro ao carregar indicadores: {error}</p>;
  if (!stats) {
  return (
    <>
      <p className="section-label">Registro oficial</p>
      <div className="skeleton-lines">
        <Skeleton height="1.4rem" width="90%" />
        <Skeleton height="1.4rem" width="75%" />
        <Skeleton height="1.4rem" width="60%" />
      </div>
    </>
  );
}

  const anos = new Date().getFullYear() - stats.ano_fundacao;

  return (
    <>
      <p className="section-label">Registro oficial</p>
      <p className="lede">
        Segundo o próprio Porto Digital, o ecossistema soma{" "}
        <AnimatedNumber value={stats.empresas_embarcadas} /> empresas embarcadas e{" "}
        <AnimatedNumber value={stats.colaboradores} /> colaboradores, responsáveis
        por <span className="data-figure">{stats.faturamento_2025}</span> em
        faturamento em 2025 — crescimento de{" "}
        <span className="data-figure">{stats.crescimento_faturamento_2025}</span>{" "}
        em relação ao ano anterior. O distrito ocupa{" "}
        <AnimatedNumber value={stats.territorio_hectares} /> hectares no centro do
        Recife há <AnimatedNumber value={anos} /> anos.
      </p>
    </>
  );
}