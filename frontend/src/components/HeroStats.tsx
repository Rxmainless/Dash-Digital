import { useEffect, useState } from "react";

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
  const [stats, setStats] = useState<HeroStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/hero_stats.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ao carregar dados: ${res.status}`);
        return res.json();
      })
      .then((data: HeroStatsData) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando indicadores oficiais...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!stats) return null;

  const anosDeHistoria = new Date().getFullYear() - stats.ano_fundacao;

  return (
    <div>
      <h2>Porto Digital — Números Oficiais</h2>
      <p>{stats.empresas_embarcadas} empresas embarcadas</p>
      <p>{stats.colaboradores.toLocaleString("pt-BR")} colaboradores</p>
      <p>
        {stats.faturamento_2025} de faturamento em 2025 (crescimento de{" "}
        {stats.crescimento_faturamento_2025})
      </p>
      <p>{anosDeHistoria} anos de história ({stats.territorio_hectares} hectares de território)</p>
      <p>
        <small>
          Fonte:{" "}
          <a href={stats.fonte_principal} target="_blank" rel="noreferrer">
            Porto Digital
          </a>{" "}
          — verificado em {stats.data_verificacao}
        </small>
      </p>
    </div>
  );
}