import { Fragment } from "react";
import { useFetchJSON } from "../hooks/useFetchJSON";

interface HeroStatsData {
  fonte_principal: string;
  data_verificacao: string;
}

export function PageFooter() {
  const { data: stats } = useFetchJSON<HeroStatsData>("/data/hero_stats.json");

  return (
    <footer className="page-footer">
      <p className="section-label">Fontes</p>
      <ul className="page-footer__list">
        <li>
          Indicadores institucionais:{" "}
          <a href={stats?.fonte_principal ?? "https://www.portodigital.org"} target="_blank" rel="noreferrer">Porto Digital</a>
          {stats && (
            <Fragment> — verificado em {stats.data_verificacao}</Fragment>
          )}
        </li>
        <li>
          Cadastro de empresas ativas:{" "}
          <a href="https://dados.recife.pe.gov.br/dataset/empresas-da-cidade-do-recife" target="_blank" rel="noreferrer">Portal de Dados Abertos do Recife</a>{" "}
          (CKAN)
        </li>
        <li>
          Diretório de startups embarcadas:{" "}
          <a href="https://embarcadas.portodigital.org" target="_blank" rel="noreferrer">embarcadas.portodigital.org</a>
        </li>
      </ul>
      <p className="page-footer__meta">
        Metodologia completa e limitações conhecidas em{" "}
        <a href="https://github.com/Rxmainless/Dash-Digital/blob/main/docs/architecture.md" target="_blank" rel="noreferrer">docs/architecture.md</a>.
      </p>
    </footer>
  );
}