# Porto Digital — Dashboard do Ecossistema

Um levantamento de dados que cruza os números oficiais do Porto Digital com dados abertos da Prefeitura do Recife e o diretório público de startups embarcadas, pra entender melhor o tamanho real do ecossistema de tecnologia da cidade.

> Projeto de portfólio pessoal — construído para o [Porto Digital](https://www.portodigital.org), o distrito de inovação de Recife/PE.

---

## Por que esse projeto existe

O Porto Digital divulga números oficiais fortes: **541 empresas embarcadas**, **24 mil colaboradores**, **R$ 7,4 bilhões de faturamento**. Mas esses números respondem só à pergunta "quantas empresas assinaram convênio com o distrito?" — não "quantas empresas de tecnologia existem de fato naquela região?".

Este projeto cruza o retrato oficial com duas fontes independentes: o dataset público de empresas ativas da Prefeitura do Recife (filtrado por CNAE de tecnologia e localização geográfica) e o diretório público de startups embarcadas do próprio Porto Digital — pra mostrar essas leituras lado a lado. As diferenças entre elas contam uma história própria sobre como o ecossistema tecnológico do Recife transborda os limites administrativos do polo.

## Fontes de dados

| Fonte | O que fornece | Frequência |
|---|---|---|
| [Portal de Dados Abertos do Recife](https://dados.recife.pe.gov.br) (CKAN) | Cadastro de empresas ativas por CNAE, bairro e situação | Mensal (upstream) |
| [embarcadas.portodigital.org](https://embarcadas.portodigital.org) (via API pública/Supabase) | Diretório de startups embarcadas (nome, área de atuação, tipo, descrição) | Dinâmico — ver limitações conhecidas |
| [portodigital.org](https://www.portodigital.org) | Indicadores institucionais oficiais (empresas embarcadas, faturamento, colaboradores) | Atualizado manualmente neste projeto — ver `docs/architecture.md` |

Todos os números institucionais citados foram cruzados com múltiplas fontes independentes (releases oficiais, cobertura de imprensa) antes de entrar no projeto — não vieram de uma única leitura.

## Metodologia (resumo)

**Empresas de tecnologia (Prefeitura do Recife):**
1. Baixa o dataset completo de empresas ativas do Recife (~407 mil linhas, ~95 mil empresas únicas)
2. Filtra por CNAE começando em `62` ou `63` (TI e serviços de informação), restrito a atividade **principal** (não secundária)
3. Remove duplicatas literais de linha (sujeira conhecida do dado bruto da prefeitura)
4. Marca quais empresas estão fisicamente nos bairros que compõem a área do Porto Digital (Recife Antigo, Santo Antônio, Boa Vista, São José)
5. Agrega por bairro para visualização

**Diretório de startups embarcadas:**
1. Baixa o diretório completo via a API pública que a página `embarcadas.portodigital.org` usa internamente
2. Valida schema e normaliza campos (ex: categoria de empresa ausente vira "Não informado", não é descartada)
3. Agrega por área de atuação para visualização

**Importante:** o recorte geográfico por bairro é uma aproximação do "ecossistema Porto Digital", não uma lista oficial de empresas embarcadas. O diretório de startups (398 registros) também não corresponde ao número oficial de 541 empresas embarcadas — a causa exata dessa diferença não foi determinada. Detalhes completos de ambas as limitações em [`docs/architecture.md`](docs/architecture.md).

## Stack técnica

- **ETL:** Python 3.14 · Pandas · pytest
- **Frontend:** React 19 · TypeScript · Vite · Recharts
- **Dados:** JSON estático, gerado pelo pipeline e servido pelo frontend (sem backend/banco de dados)
- **CI/CD:** GitHub Actions (lint + testes a cada push, atualização semanal automática dos dados)

## Estrutura do projeto

```bash
porto-digital-dashboard/
├── etl/                              # Pipeline de dados em Python
│   ├── src/
│   │   ├── extract.py                # Baixa o dataset de empresas (CKAN)
│   │   ├── extract_embarcadas.py     # Baixa o diretório de startups embarcadas
│   │   ├── transform.py              # Filtra, limpa e agrega empresas por bairro
│   │   ├── transform_embarcadas.py   # Filtra, limpa e agrega embarcadas por área
│   │   └── pipeline.py               # Orquestra: extract → transform → sync
│   └── tests/                        # Testes de caracterização (casos reais encontrados)
│
├── data/
│   ├── raw/                          # Snapshots brutos (não versionados no git)
│   └── processed/                    # JSONs processados (fonte da verdade)
│
├── frontend/                         # React + TypeScript
│   └── src/
│       ├── components/
│       ├── hooks/
│       └── theme/                    # Sistema de tema claro/escuro
│
├── docs/
│   └── architecture.md               # Decisões de design e limitações conhecidas
│
├── .github/workflows/
│   ├── ci.yml                        # Lint + testes a cada push
│   └── etl-refresh.yml               # Atualização semanal automática dos dados
│
└── README.md
```

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
- O diretório de startups embarcadas (398 registros) não corresponde ao número oficial de 541 empresas embarcadas — causa não determinada, ver `docs/architecture.md`, seção 3.1
- `hero_stats.json` é atualizado manualmente, não faz parte do pipeline automatizado — decisão consciente documentada em `docs/architecture.md`

## Roadmap

- [ ] Interação gráfico ↔ texto (hover destaca o parágrafo correspondente)
- [ ] Vagas por área como terceira fonte de dado
- [ ] Deploy em produção

## Licença

MIT — ver [`LICENSE`](LICENSE).