# Arquitetura e Decisões de Design

Este documento existe para que decisões tomadas ao longo do desenvolvimento não fiquem só na memória de quem construiu o projeto. Cobre o que foi decidido, por quê, e quais alternativas foram descartadas.

---

## 1. Arquitetura de dados

### Por que ETL local gerando JSON estático, e não uma API/backend?

O projeto não precisa de dados em tempo real — o dataset de origem (Prefeitura do Recife) atualiza mensalmente. Um backend rodando 24/7 seria complexidade desnecessária para esse ritmo de atualização. Em vez disso:

CKAN (dados.recife.pe.gov.br)
│
▼
extract.py  →  data/raw/.csv        (snapshot bruto, não versionado)
│
▼
transform.py  →  data/processed/.json (fonte da verdade, versionado)
│
▼
pipeline.py sincroniza →  frontend/public/data/*.json
│
▼
React lê via fetch() estático — sem backend, sem banco de dados

Isso também permite hospedar o frontend gratuitamente em qualquer serviço de arquivos estáticos (Vercel, Netlify, GitHub Pages), sem custo de infraestrutura de backend.

### Por que `data/raw/` não é versionado, mas `data/processed/` é

`data/raw/` contém o CSV bruto (~110MB) — grande demais para o GitHub (limite de 100MB por arquivo) e, mais importante, **reproduzível** a qualquer momento rodando `extract.py`. Não versionar dado reproduzível é prática padrão de ETL.

`data/processed/` é versionado porque é pequeno e é o que o frontend realmente consome — versionar garante que o repositório sempre tem um estado funcional, mesmo que a fonte upstream (CKAN) fique fora do ar temporariamente.

---

## 2. Metodologia de filtro — o que "ecossistema Porto Digital" significa aqui

O dataset da Prefeitura do Recife não tem nenhuma coluna indicando "está no Porto Digital". A aproximação usada combina dois critérios:

1. **CNAE começando em `62` ou `63`** (TI e serviços de informação), restrito a `atividade_principal = 'S'` — evita contar empresas cujo core business é outro, mas que têm alguma atividade acessória de TI cadastrada
2. **Bairro** dentre `Recife (Antigo)`, `Santo Antônio`, `Boa Vista`, `São José` — os bairros que fisicamente compõem a área do polo

### Por que isso não bate com o número oficial de "541 empresas embarcadas"

Nosso filtro (999 empresas) é **quase o dobro** do número oficial. Isso é esperado e intencional, não um erro: "embarcada" é um status contratual (empresa formalmente conveniada com o Porto Digital), enquanto nosso filtro captura **qualquer empresa de tecnologia fisicamente localizada** nesses bairros, esteja ela formalmente embarcada ou não. O dashboard expõe os dois números lado a lado de propósito, para deixar essa diferença visível em vez de escondê-la.

### Duplicatas no dado bruto

O CSV original tem casos de linhas literalmente duplicadas (mesmo `cnpj` + `cnae` repetidos várias vezes — encontramos um caso real com 10 repetições idênticas). Isso foi tratado com `drop_duplicates(subset=["cnpj", "cnae"])`, que remove a sujeira mas preserva empresas com múltiplas atividades tech genuinamente diferentes.

---

## 3. `hero_stats.json` — a exceção manual no pipeline

Diferente dos outros arquivos em `data/processed/`, `hero_stats.json` **não é gerado por `transform.py`** — é escrito manualmente, com valores extraídos e verificados diretamente do site institucional do Porto Digital.

**Por que não automatizar isso também:** os números institucionais (empresas embarcadas, faturamento, colaboradores) não têm uma API pública — só existem em páginas HTML/releases de imprensa, sujeitos a mudança de estrutura a qualquer momento. Automatizar isso exigiria scraping frágil para um dado que muda com pouca frequência (releases de resultado, não em tempo real).

**Processo de verificação usado:** os números foram cruzados contra 6 fontes independentes (release oficial do Porto Digital, Folha PE, Exame, TrendsCE, Movimento Econômico, Investindo Por Aí) antes de entrar no arquivo. Cada atualização futura deve seguir o mesmo padrão de verificação cruzada, não confiar numa fonte única.

O arquivo inclui os campos `fonte_principal` e `data_verificacao` justamente para que essa natureza manual fique rastreável, não escondida.

---

## 4. Becos sem saída (documentados para não serem repetidos)

- **`embarcadas.portodigital.org`** é uma SPA (aplicação client-side) — o HTML vem vazio, os dados reais vêm de uma API JavaScript interna não documentada. Não foi usado como fonte por essa fragilidade.
- **`datastore_search_sql`** (extensão CKAN que permitiria queries tipo SQL) está desabilitada na instância do Recife (`Action name not known`). O plano B — baixar o CSV completo e filtrar localmente com Pandas — acabou sendo mais robusto de qualquer forma, por não depender de uma feature específica do servidor.
- O portal `dados.recife.pe.gov.br` tem `robots.txt` restritivo, o que impede fetch automatizado por ferramentas de terceiros (inclusive assistentes de IA) — mas não impede scripts próprios rodando localmente via `requests`.

---

## 5. Sistema de design

### Conceito

A identidade visual funde duas referências: a genealogia física do lugar (Recife Antigo, azulejaria portuguesa em tons de cobalto/índigo, cartografia náutica de porto) com um tratamento editorial de dados (texto corrido com números embutidos, não um dashboard de KPIs isolados) — e um modo escuro com sensação de "sala de controle" para quem prefere leitura mais técnica.

### Paleta

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--bg` | `#F2E4CE` | `#0B0B0F` | Fundo da página |
| `--surface` | `#FBF3E4` | `#17151C` | Cards, painéis |
| `--ink` | `#0B0B0F` | `#EDEAE2` | Texto principal |
| `--accent-primary` | `#5D4A9C` | `#9B82E0` | Roxo-cobalto — dado principal, links, série do gráfico |
| `--accent-warm` | `#B8752E` | `#E0A64C` | Âmbar — destaques editoriais |

O roxo foi uma escolha de identidade de portfólio pessoal (recorrente em outros projetos do autor), reforçada pela conexão histórica real com o pigmento cobalto usado em azulejaria portuguesa — não é uma cor arbitrária.

### Tipografia

- **Fraunces** (serifada) — títulos e números grandes, caráter de "manchete"
- **IBM Plex Sans** — corpo de texto
- **IBM Plex Mono** — números e dados (`.data-figure`), reforça a leitura tipo "readout" de painel

---

## 6. Decisões de versão de dependências

Registradas aqui porque cada uma envolveu um problema real encontrado durante o desenvolvimento:

- **Vite 7.3, não 8.x** — Vite 8 trouxe reescrita completa do bundler (Rolldown no lugar de Rollup/esbuild); mantivemos 7.3 por maturidade de ecossistema de plugins no momento da escolha
- **`@vitejs/plugin-react` 4.x, não 6.x** — a versão 6 foi desenhada especificamente para a arquitetura interna do Vite 8; usar com Vite 7 causaria incompatibilidade
- **ESLint, não Oxlint** — Oxlint ainda não cobre regras type-aware de TypeScript nem `eslint-plugin-jsx-a11y`, ambas relevantes para este projeto