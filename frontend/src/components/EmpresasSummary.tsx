import { useFetchJSON } from "../hooks/useFetchJSON";
import { AnimatedNumber } from "./AnimatedNumber";

interface Empresa {
  cnpj: string;
  esta_no_polo_porto_digital: boolean;
}

export function EmpresasSummary() {
  const { data: empresas, error } = useFetchJSON<Empresa[]>("/data/empresas_tech.json");

  if (error) return <p className="lede">Erro ao carregar dados: {error}</p>;
  if (!empresas) return <p className="lede">Carregando levantamento de campo...</p>;

  const noPolo = empresas.filter((e) => e.esta_no_polo_porto_digital).length;

  return (
    <>
      <p className="section-label">Levantamento de campo</p>
      <p className="lede">
        Cruzando esse retrato oficial com os dados públicos da Prefeitura do Recife,
        mapeamos <AnimatedNumber value={empresas.length} /> empresas ativas na cidade
        cuja atividade principal é tecnologia. Restringindo à área geográfica do polo,
        esse número cai para <AnimatedNumber value={noPolo} /> — quase o dobro das
        empresas oficialmente embarcadas, sinal de que o ecossistema tecnológico do
        Recife transborda os limites administrativos do Porto Digital.
      </p>
    </>
  );
}