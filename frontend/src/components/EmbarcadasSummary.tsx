import { useFetchJSON } from "../hooks/useFetchJSON";

interface Embarcada {
  id: number;
  name: string;
  primary_area: string;
  company_type: string;
  description: string;
}

interface AreaStat {
  primary_area: string;
  total_empresas: number;
}

export function EmbarcadasSummary() {
  const { data: embarcadas, error: errorEmbarcadas } = useFetchJSON<Embarcada[]>(
    "/data/embarcadas.json"
  );
  const { data: areas, error: errorAreas } = useFetchJSON<AreaStat[]>(
    "/data/stats_por_area.json"
  );

  if (errorEmbarcadas || errorAreas) {
    return <p>Erro ao carregar dados de embarcadas.</p>;
  }
  if (!embarcadas || !areas) {
    return <p>Carregando...</p>;
  }

  return (
    <div style={{ border: "1px solid red", padding: "1rem", margin: "1rem 0" }}>
      <p>[COMPONENTE CRU — só validação, sem estilo]</p>
      <p>Total de empresas no diretório: {embarcadas.length}</p>
      <p>Total de áreas distintas: {areas.length}</p>

      <p>Top 5 áreas:</p>
      <ul>
        {areas.slice(0, 5).map((a) => (
          <li key={a.primary_area}>
            {a.primary_area}: {a.total_empresas}
          </li>
        ))}
      </ul>

      <p>Amostra de 3 empresas:</p>
      <ul>
        {embarcadas.slice(0, 3).map((e) => (
          <li key={e.id}>
            <strong>{e.name}</strong> — {e.primary_area} ({e.company_type})
          </li>
        ))}
      </ul>
    </div>
  );
}