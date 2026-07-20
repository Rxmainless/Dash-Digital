# Porto Digital — Dashboard do Ecossistema

Um levantamento de dados que cruza os números oficiais do Porto Digital com dados abertos da Prefeitura do Recife, pra entender melhor o tamanho real do ecossistema de tecnologia da cidade.

> Projeto de portfólio pessoal — construído para o [Porto Digital](https://www.portodigital.org), o distrito de inovação de Recife/PE.

---

## Por que esse projeto existe

O Porto Digital divulga números oficiais fortes: **541 empresas embarcadas**, **24 mil colaboradores**, **R$ 7,4 bilhões de faturamento**. Mas esses números respondem só à pergunta "quantas empresas assinaram convênio com o distrito?" — não "quantas empresas de tecnologia existem de fato naquela região?".

Este projeto cruza o retrato oficial com o dataset público de empresas ativas da Prefeitura do Recife, filtrado por CNAE de tecnologia (62/63) e localização geográfica, pra mostrar as duas leituras lado a lado — e a diferença entre elas conta uma história própria sobre como o ecossistema tecnológico do Recife transborda os limites administrativos do polo.

## Fontes de dados

| Fonte | O que fornece | Frequência |
|---|---|---|
| [Portal de Dados Abertos do Recife](https://dados.recife.pe.gov.br) (CKAN) | Cadastro de empresas ativas por CNAE, bairro e situação | Mensal (upstream) |
| [portodigital.org](https://www.portodigital.org) | Indicadores institucionais oficiais (empresas embarcadas, faturamento, colaboradores) | Atualizado manualmente neste projeto — ver `docs/architecture.md` |

Todos os números institucionais citados foram cruzados com múltiplas fontes independentes (releases oficiais, cobertura de imprensa) antes de entrar no projeto — não vieram de uma única leitura.

## Metodologia (resumo)

1. Baixa o dataset completo de empresas ativas do Recife (~407 mil linhas, ~95 mil empresas únicas)
2. Filtra por CNAE começando em `62` ou `63` (TI e serviços de informação), restrito a atividade **principal** (não secundária)
3. Remove duplicatas literais de linha (sujeira conhecida do dado bruto da prefeitura)
4. Marca quais empresas estão fisicamente nos bairros que compõem a área do Porto Digital (Recife Antigo, Santo Antônio, Boa Vista, São José)
5. Agrega por bairro para visualização

**Importante:** o recorte geográfico por bairro é uma aproximação do "ecossistema Porto Digital", não uma lista oficial de empresas embarcadas — mais detalhes em [`docs/architecture.md`](docs/architecture.md).

## Stack técnica

- **ETL:** Python 3.14 · Pandas · pytest
- **Frontend:** React 19 · TypeScript · Vite · Recharts
- **Dados:** JSON estático, gerado pelo pipeline e servido pelo frontend (sem backend/banco de dados)

## Estrutura do projeto
```bash
porto-digital-dashboard/
├── etl/                          # Pipeline de dados em Python
│   ├── src/
│   │   ├── extract.py            # Baixa o dataset bruto do CKAN
│   │   ├── transform.py          # Filtra, limpa e agrega os dados
│   │   └── pipeline.py           # Orquestra: extract → transform → sync
│   └── tests/                    # Testes de caracterização (casos reais encontrados)
│
├── data/
│   ├── raw/                      # Snapshots brutos (não versionados no git)
│   └── processed/                # JSONs processados (fonte da verdade)
│
├── frontend/                     # React + TypeScript
│   └── src/
│       ├── components/
│       ├── hooks/
│       └── theme/                # Sistema de tema claro/escuro
│
├── docs/
│   └── architecture.md           # Decisões de design e limitações conhecidas
│
└── README.md

## Como rodar localmente

### Pré-requisitos
- Python 3.13+
- Node.js 24+

### Pipeline de dados
```bash
cd etl
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
python src\pipeline.py        # extrai, transforma e sincroniza com o frontend
```

### Testes do ETL
```bash
cd etl
pytest -v
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Decisões de design

O projeto usa uma identidade visual própria — tema claro ("Relatório") e escuro ("Sala de Controle"), com tratamento editorial dos dados em vez de um dashboard genérico de KPIs. As decisões completas de paleta, tipografia e motivo visual estão documentadas em [`docs/architecture.md`](docs/architecture.md).

## Limitações conhecidas

- O recorte por bairro é uma aproximação geográfica, não uma lista oficial de empresas embarcadas (ver Metodologia acima)
- `hero_stats.json` é atualizado manualmente, não faz parte do pipeline automatizado — decisão consciente documentada em `docs/architecture.md`
- O dataset de empresas da Prefeitura atualiza mensalmente; o pipeline não roda automaticamente ainda (na fila do roadmap)

## Roadmap

- [ ] Automação do pipeline via GitHub Actions
- [ ] Interação gráfico ↔ texto (hover destaca o parágrafo correspondente)
- [ ] Expansão para novas fontes (vagas por área, diretório de embarcadas)

## Licença

MIT — ver [`LICENSE`](LICENSE).