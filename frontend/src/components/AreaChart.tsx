import { useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
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
  const [ativoIndex, setAtivoIndex] = useState<number | null>(null);

  if (error) return <p className="lede">Erro: {error}</p>;
  if (!dados) return <p className="lede">Carregando gráfico...</p>;

  const total = dados.reduce((soma, d) => soma + d.total_empresas, 0);
  const ativo = ativoIndex !== null ? dados[ativoIndex] : null;
  const percentual = ativo ? Math.round((ativo.total_empresas / total) * 100) : null;
  const altura = dados.length * 26;

  return (
    <div>
      <p className="chart-mini-label">Por área de atuação</p>
      <div className="chart-panel chart-panel--scroll">
        <ResponsiveContainer width="100%" height={altura}>
          <BarChart data={dados} layout="vertical" margin={{ left: 8, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="primary_area"
              width={170}
              tick={{ fill: "var(--ink)", fontFamily: "var(--font-mono)", fontSize: 11.5 }}
            />
            <Tooltip
              cursor={{ fill: "var(--accent-primary-soft)" }}
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
              }}
              labelStyle={{ color: "var(--ink)", fontWeight: 500 }}
              itemStyle={{ color: "var(--ink)" }}
            />
            <Bar
              dataKey="total_empresas"
              radius={[0, 3, 3, 0]}
              onMouseEnter={(_, index) => setAtivoIndex(index)}
              onMouseLeave={() => setAtivoIndex(null)}
            >
              {dados.map((_, index) => (
                <Cell
                  key={index}
                  fill={index === ativoIndex ? "var(--accent-warm)" : "var(--accent-primary)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="chart-caption">
        {ativo && percentual !== null ? (
          <>
            <strong>{ativo.primary_area}</strong> reúne {ativo.total_empresas}{" "}
            startups — {percentual}% do diretório.
          </>
        ) : (
          "Startups do diretório por área de atuação (top 19). Passe o mouse sobre uma barra."
        )}
      </p>
    </div>
  );
}