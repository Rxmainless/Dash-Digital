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

  const altura = Math.max(dados.length * 28, 300);

  return (
    <div className="chart-panel">
      <ResponsiveContainer width="100%" height={altura}>
        <BarChart data={dados} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="primary_area"
            width={220}
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
          <Bar dataKey="total_empresas" fill="var(--accent-primary)" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}