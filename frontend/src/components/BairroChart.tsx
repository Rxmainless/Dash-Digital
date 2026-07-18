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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/stats_por_bairro.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ao carregar dados: ${res.status}`);
        return res.json();
      })
      .then((data: BairroStat[]) => setDados(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando gráfico...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <h2>Empresas de Tecnologia por Bairro (Polo Porto Digital)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bairro_normalizado" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="total_empresas" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}