import { Fragment, useMemo, useState } from "react";
import { useFetchJSON } from "../hooks/useFetchJSON";
import { Skeleton } from "./Skeleton";

interface Embarcada {
  id: number;
  name: string;
  primary_area: string;
  company_type: string;
  description: string;
}

export function EmbarcadasDirectory() {
  const { data: embarcadas, error } = useFetchJSON<Embarcada[]>("/data/embarcadas.json");
  const [busca, setBusca] = useState("");
  const [areaFiltro, setAreaFiltro] = useState("todas");
  const [expandidoId, setExpandidoId] = useState<number | null>(null);

  const areas = useMemo(() => {
    if (!embarcadas) return [];
    return Array.from(new Set(embarcadas.map((e) => e.primary_area))).sort();
  }, [embarcadas]);

  const filtradas = useMemo(() => {
    if (!embarcadas) return [];
    const termo = busca.trim().toLowerCase();
    return embarcadas.filter((e) => {
      const bateBusca = termo === "" || e.name.toLowerCase().includes(termo);
      const bateArea = areaFiltro === "todas" || e.primary_area === areaFiltro;
      return bateBusca && bateArea;
    });
  }, [embarcadas, busca, areaFiltro]);

  if (error) return <p className="lede">Erro ao carregar diretório: {error}</p>;

  if (!embarcadas) {
    return (
      <div className="directory">
        <div className="directory-controls">
          <Skeleton height="2.2rem" width="60%" />
          <Skeleton height="2.2rem" width="35%" />
        </div>
        <div className="skeleton-lines">
          <Skeleton height="2.4rem" />
          <Skeleton height="2.4rem" />
          <Skeleton height="2.4rem" />
          <Skeleton height="2.4rem" />
          <Skeleton height="2.4rem" />
        </div>
      </div>
    );
  }

  function alternarExpandido(id: number) {
    setExpandidoId((atual) => (atual === id ? null : id));
  }

  function handleRowKeyDown(event: React.KeyboardEvent<HTMLTableRowElement>, id: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      alternarExpandido(id);
    }
  }

  return (
    <div className="directory">
      <div className="directory-controls">
        <input
          type="text"
          className="directory-search"
          placeholder="Buscar por nome..."
          aria-label="Buscar startup por nome"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select
          className="directory-filter"
          aria-label="Filtrar por área de atuação"
          value={areaFiltro}
          onChange={(e) => setAreaFiltro(e.target.value)}
        >
          <option value="todas">Todas as áreas ({embarcadas.length})</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      <div className="directory-table-wrap">
        <table className="directory-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Área</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((e) => (
              <Fragment key={e.id}>
                <tr
                  className="directory-table__row"
                  onClick={() => alternarExpandido(e.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, e.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandidoId === e.id}
                  aria-label={`Ver descrição de ${e.name}`}
                >
                  <td><a className="directory-table__name-link" href={`https://embarcadas.portodigital.org/embarcadas/${e.id}`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{e.name}</a></td>
                  <td>{e.primary_area}</td>
                  <td>{e.company_type}</td>
                </tr>
                {expandidoId === e.id && (
                  <tr className="directory-table__detail-row">
                    <td colSpan={3}>
                      {e.description?.trim() || "Sem descrição disponível."}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p className="chart-caption">
        {filtradas.length} de {embarcadas.length} empresas exibidas. Clique no nome
        para abrir o perfil oficial, ou em qualquer outro lugar da linha (ou aperte
        Enter/Espaço com o foco na linha) para ver a descrição completa.
      </p>
    </div>
  );
}