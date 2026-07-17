import { useEffect, useState } from "react";

interface Empresa {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string | null;
  nome_bairro: string;
  desc_atividade: string;
  esta_no_polo_porto_digital: boolean;
}

export function EmpresasSummary() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/empresas_tech.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ao carregar dados: ${res.status}`);
        return res.json();
      })
      .then((data: Empresa[]) => setEmpresas(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p>Erro: {error}</p>;

  const noPolo = empresas.filter((e) => e.esta_no_polo_porto_digital).length;

  return (
    <div>
      <h2>Empresas de Tecnologia no Recife</h2>
      <p>Total no dataset filtrado: {empresas.length}</p>
      <p>Fisicamente na região do Porto Digital: {noPolo}</p>
    </div>
  );
}