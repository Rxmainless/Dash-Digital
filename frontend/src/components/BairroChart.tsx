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

interface BairroStat {
  bairro_normalizado: string;
  total_empresas: number;
}

export function BairroChart() {
  const { data: dados, error } = useFetchJSON<BairroStat[]>("/data/stats_por_bairro.json");

  if (error) return <p className="lede">Erro: {error}</p>;
  if (!dados) return <p className="lede">Carregando gráfico...</p>;

  return (
    <div>
      <p className="chart-mini-label">Por bairro</p>
      <div className="chart-panel">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="bairro_normalizado"
              tick={{ fill: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: 10.5 }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: 10.5 }}
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
      <p className="chart-caption">Empresas de tecnologia por bairro no polo.</p>
    </div>
  );
}