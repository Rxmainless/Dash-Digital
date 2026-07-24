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

interface BairroStat {
  bairro_normalizado: string;
  total_empresas: number;
}

export function BairroChart() {
  const { data: dados, error } = useFetchJSON<BairroStat[]>("/data/stats_por_bairro.json");
  const [ativoIndex, setAtivoIndex] = useState<number | null>(null);

  if (error) return <p className="lede">Erro: {error}</p>;
  if (!dados) return <p className="lede">Carregando gráfico...</p>;

  const total = dados.reduce((soma, d) => soma + d.total_empresas, 0);
  const ativo = ativoIndex !== null ? dados[ativoIndex] : null;
  const percentual = ativo ? Math.round((ativo.total_empresas / total) * 100) : null;

  return (
    <div>
      <p className="chart-mini-label">Por bairro</p>
      <div className="chart-panel">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="bairro_normalizado"
              tick={{ fill: "var(--ink)", fontFamily: "var(--font-mono)", fontSize: 11.5 }}
            />
            <YAxis
              allowDecimals={false}
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
              radius={[3, 3, 0, 0]}
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
            <strong>{ativo.bairro_normalizado}</strong> concentra{" "}
            {ativo.total_empresas} empresas — {percentual}% do total no polo.
          </>
        ) : (
          "Empresas de tecnologia por bairro no polo. Passe o mouse sobre uma barra."
        )}
      </p>
    </div>
  );
}