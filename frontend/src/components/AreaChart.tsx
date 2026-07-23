import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFetchJSON } from "../hooks/useFetchJSON";

interface AreaStat {
  primary_area: string;
  total_empresas: number;
}

export function AreaChart() {
  const { data: dados, error } = useFetchJSON<AreaStat[]>("/data/stats_por_area.json");

  if (error) return <p className="lede">Erro: {error}</p>;
  if (!dados) return <p className="lede">Carregando gráfico...</p>;

  return (
    <div>
      <p className="chart-mini-label">Por área de atuação</p>
      <div className="chart-panel">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={dados} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: 10 }}
            />
            <YAxis
              type="category"
              dataKey="primary_area"
              width={130}
              tick={{ fill: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: 9.5 }}
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
            <Bar dataKey="total_empresas" fill="var(--accent-primary)" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-caption">Startups do diretório por área de atuação (top 19).</p>
    </div>
  );
}