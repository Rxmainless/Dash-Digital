import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BairroStat {
  bairro_normalizado: string;
  total_empresas: number;
}

export function BairroChart() {
  const [dados, setDados] = useState<BairroStat[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/stats_por_bairro.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ao carregar dados: ${res.status}`);
        return res.json();
      })
      .then((data: BairroStat[]) => setDados(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="lede">Erro: {error}</p>;
  if (dados.length === 0) return <p className="lede">Carregando gráfico...</p>;

  return (
    <>
      <p className="section-label">Distribuição geográfica</p>
      <div className="chart-panel">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="bairro_normalizado"
              tick={{ fill: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: 11 }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                fontFamily: "var(--font-mono)",
                color: "var(--ink)",
              }}
            />
            <Bar dataKey="total_empresas" fill="var(--accent-primary)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-caption">
        Empresas de tecnologia por bairro, dentro da área do polo Porto Digital.
      </p>
    </>
  );
}