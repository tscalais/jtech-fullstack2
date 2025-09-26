# jtech-tasklist

Sistema TODO List Multi-usuário com Arquitetura Avançada

![coverage](https://img.shields.io/badge/coverage-89%25-green)

---

## 1. Visão Geral da Arquitetura

Esta aplicação segue uma arquitetura modular em camadas sobre Vue 3 (Composition API) com foco em: previsibilidade de
estado, testabilidade, separação de responsabilidades e baixo acoplamento. Os principais blocos são:

Fluxo:

1. Usuário autentica (store `auth`) — estado persistido em localStorage.
2. Guard de rota verifica `auth.autenticado` antes de acessar `/tarefas`.
3. `PainelTarefasView` compõe dois agregadores: `GerenciadorLista` (orquestra listas) e `GerenciadorTarefas` (tarefas
   filtradas pela lista ativa).
4. Eventos de UI (ex: `renomear:lista`, `adicionar:tarefa`) disparam mutações em stores `lists` e `tasks`.
5. Stores usam estruturas simples (arrays/dicionários) e validam duplicidade antes de mutar; atualizações disparam
   persistência reativa via watchers.

Princípios adotados:

- Single Source of Truth: stores Pinia centralizam estado e regras.
- Side-effects isolados: persistência local ocorre via watchers, não polui chamadas de mutação.
- Simplicidade sobre abstração prematura: ausência de camadas artificiais (ex: services) dado escopo.
- Erros como controle de fluxo para validações críticas (duplicidade) — geram feedback imediato na UI.
- Componentes container vs. componentes de apresentação (views agregam; componentes focam em render + emissão de
  eventos).

Decisões de design relevantes:

- Persistência local em vez de backend real (escopo do desafio) facilita testes determinísticos.
- ID incremental simples em memória: suficiente enquanto não há simultaneidade multi-cliente.
- Vuetify escolhido para consistência visual e acessibilidade pré-integrada (focus rings, temas, densidade).
- Testes distribuídos por camada (stores, componentes, integração, router) garantem cobertura de fluxo.

## 2. Stack Tecnológica

| Tecnologia               | Papel                    | Justificativa / Trade-offs                                                                          |
|--------------------------|--------------------------|-----------------------------------------------------------------------------------------------------|
| Vue 3 (Composition API)  | Framework UI             | Reatividade explícita, melhor fatoração de lógica reutilizável, tipagem aprimorada                  |
| TypeScript               | Tipagem estática         | Reduz regressões; facilita refactors em stores e eventos de componentes                             |
| Pinia                    | State Management         | API simples, integração natural com Vue DevTools, granularidade de reatividade superior ao Vuex 3/4 |
| Vue Router 4             | Navegação + guard        | Hooks claros (`beforeEach`), lazy-loading viável futuramente                                        |
| Vuetify 3                | UI Kit Material          | Componentes acessíveis, tokens de design, evita retrabalho de estilização base                      |
| Vite                     | Dev server / build       | HMR rápido, build mais simples vs. Webpack, config mínima                                           |
| Vitest + @vue/test-utils | Testes                   | Integração nativa com Vite, snapshots rápidos, JSDOM estável                                        |
| @vitest/coverage-v8      | Cobertura                | Relatório rápido usando engine V8 nativa                                                            |
| ESLint + (config local)  | Qualidade                | Uniformiza padrões e evita code smells cedo                                                         |
| LocalStorage (web API)   | Persistência client-side | Simples, suficiente para estado não sensível; substituível por backend/IndexedDB no futuro          |

Critérios de escolha: velocidade de iteração, curva de aprendizado baixa para nova equipe, testabilidade e possibilidade
de evolução incremental (ex: trocar persistência local por API REST futuramente sem quebrar contrato de componentes).

## 3. Como Rodar Localmente

Pré-requisitos:

- Node >= 18 LTS (recomendado 18.18+)
- npm >= 9

Passos:

```sh
git clone https://github.com/tscalais/jtech-fullstack2.git
cd jtech-tasklist-frontend
npm install
npm run dev
```

Aplicação: <http://localhost:5173>

Build de produção:

```sh
npm run build
```

Pré-visualização do build:

```sh
npm run preview
```

Lint (quando configurado):

```sh
npm run lint
```

## 4. Como Rodar os Testes

Comandos principais:

```sh
# Modo watch interativo
npm run test:unit

# Uma passada única (CI friendly)
npm run test:unit -- --run

# Com relatório de cobertura
npm run test:coverage
```

Estrutura e escopo atual coberto:

| Categoria       | O que é testado                                                                                              | Arquivos exemplo                            |
|-----------------|--------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| Stores (Pinia)  | Auth, Listas, Tarefas: CRUD, validações, alternância, persistência                                           | `tests/unit/*.spec.ts`                      |
| Componentes UI  | GerenciadorLista (CRUD visual + eventos), GerenciadorTarefas (render + alternar + adicionar/validar/excluir) | `tests/component/*.spec.ts`                 |
| Composables     | Persistência reativa localStorage                                                                            | `tests/composables/useLocalStorage.spec.ts` |
| Views / Fluxo   | Login (validação, falha, sucesso)                                                                            | `tests/integration/LoginView.spec.ts`       |
| Router / Guards | Proteção de rota autenticada                                                                                 | `tests/router/guard.spec.ts`                |

Estrutura final de testes:

```text
tests/
  unit/          # stores (auth, lists, tasks)
  component/     # componentes isolados (GerenciadorLista, GerenciadorTarefas)
  integration/   # fluxo/Login
  router/        # guard de autenticação
  composables/   # useLocalStorage
```

Políticas adotadas:

- Isolamento de estado de stores via `vi.resetModules()` quando necessário.
- Mock limpo de `localStorage` a cada teste para garantir determinismo.
- Uso de `data-testid` mínimo apenas onde o seletor semântico seria frágil.
- Inline de dependências Vuetify no Vitest para evitar falhas de transformação.

### Cobertura de Testes

Resumo atual (gerado via `npm run test:coverage`):

| Métrica    | Percentual |
|------------|------------|
| Statements | 89.32%     |
| Branches   | 93.26%     |
| Functions  | 79.06%     |
| Lines      | 89.32%     |

Áreas com gaps:

- `App.vue` e `main.ts`: não exercitados (bootstrap). Poderíamos criar smoke test montando `App`.
- `GerenciadorLista.vue`: linhas 86-91, 94-95, 110-111 (ramos não acionados ou caminhos de edição cancelada).
- `LoginView.vue`: linhas 30-33 (provavelmente validação alternativa / mensagens não exibidas em fluxo feliz).
- Tipos (`src/types`) intencionalmente não cobertos.

Meta sugerida: manter >= 85% statements / branches; elevar Functions para > 85% cobrindo cenários de edição cancelada e
smoke do App.

Como gerar localmente:

```sh
npm run test:coverage
```

![coverage](https://img.shields.io/badge/coverage-89%25-green)

## 5. Estrutura de Pastas Detalhada

```text
src/
  App.vue                # Componente raiz
  main.ts                # Bootstrap da aplicação
  assets/                # Estilos e imagens
  components/            # Componentes reutilizáveis (GerenciadorLista, GerenciadorTarefas)
  composables/           # Funções reutilizáveis (ex: useLocalStorage)
  plugins/               # Configuração de plugins (ex: Vuetify)
  router/                # Rotas e guards
  stores/                # Estado global (auth, lists, tasks)
  types/                 # Tipos TypeScript globais
  views/                 # Telas principais (LoginView, PainelTarefasView)
```

### Mapa de Diretórios (Tabela)

| Caminho                | Tipo             | Descrição                                     |
|------------------------|------------------|-----------------------------------------------|
| `index.html`           | HTML Entry       | Ponto de entrada Vite / injeção raiz do app   |
| `vite.config.ts`       | Config build     | Alias `@`, otimizações e integração test/dev  |
| `vitest.config.ts`     | Config testes    | Include de pastas, setup Vuetify, inline deps |
| `tsconfig.json`        | TS Root          | Base de compilação compartilhada              |
| `tsconfig.app.json`    | TS App           | Escopo de build para aplicação                |
| `tsconfig.vitest.json` | TS Test          | Inclui `tests/**` para tipagem em specs       |
| `eslint.config.ts`     | Lint             | Regras de estilo/qualidade                    |
| `src/main.ts`          | Bootstrap        | Cria app, registra Pinia, Router, Vuetify     |
| `src/App.vue`          | Shell            | Layout e slot inicial para rotas              |
| `src/components/`      | UI               | Componentes funcionais reutilizáveis          |
| `src/views/`           | Pages            | Composição de componentes e lógica de fluxo   |
| `src/stores/`          | Estado           | Pinia stores (auth, lists, tasks)             |
| `src/composables/`     | Reuso lógico     | Funções utilitárias (ex: persistência)        |
| `src/router/`          | Navegação        | Definição de rotas e guard global             |
| `src/plugins/`         | Plugins          | Setup Vuetify e futuros plugins               |
| `src/types/`           | Tipos globais    | Interfaces e DTOs locais                      |
| `tests/unit/`          | Specs unidade    | Stores + composables                          |
| `tests/component/`     | Specs componente | Interação isolada UI                          |
| `tests/integration/`   | Specs integração | Fluxos (ex: login)                            |
| `tests/router/`        | Specs roteamento | Guard de autenticação                         |
| `tests/composables/`   | Specs reuso      | Testes de hooks utilitários                   |

## 6. Decisões Técnicas Aprofundadas

- **Persistência:** Todo o estado é salvo em localStorage via composable (`useLocalStorage`), garantindo experiência
  contínua e simples restauração.
- **Guards de Rota:** Usuário não autenticado é redirecionado para login.
- **Componentização:** Componentes desacoplados, com props tipadas e eventos claros.
- **Validações:** Prevenção de duplicatas e campos obrigatórios em listas/tarefas.
- **Feedback:** Snackbars, loaders e confirmações para todas as ações relevantes.
- **Simulação de Backend:** Autenticação e dados são mockados, conforme escopo do desafio.

### Padrões de Código e Qualidade

- Convenção de imports: alias `@` para `src/` evitando caminhos relativos longos.
- Mutations de estado centralizadas em stores — componentes apenas emitem eventos.
- Persistência desacoplada via watcher (evita acoplamento a cada mutação individual).
- Evita-se sobrescrever estado inteiro quando possível (mutação granular preserva reatividade).
- Testes: granularidade 4 camadas (unit, component, integration, router) — evita overlap redundante.
- Tratamento de erros: validações de duplicidade lançam `Error` — UI pode capturar e exibir.
- IDs numéricos simples (incremental) — suficientes sem concorrência distribuída; futura troca por UUID não quebra API.
- Sem utilização de mixins — preferido Composition API (mais explícito e tree-shakable).

### Metas de Qualidade

- Coverage alvo mínimo: 85% statements / branches; functions > 85% (atual 79.06%).
- Zero erros de lint antes de cada PR.
- Build sem warnings críticos.
- Tempo de feedback local (test + dev server) < 2s após alteração incremental típica (Vite + HMR).

### Evolução Futuras Arquiteturais

- Backend real (REST ou GraphQL) substituindo localStorage mantendo mesma API de componente.
- Camada de service / repository para isolar I/O.
- Cache TTL configurável para dados não críticos.
- Feature flags (ex: toggles para dark mode, i18n).
- SSR ou pré-render estático para melhor SEO (caso escopo mude) usando `vite-ssg` ou Nuxt alternativa.

## 7. Melhorias e Roadmap

### Testes

- [x] Ampliar testes de `GerenciadorTarefas` (adicionar/editar/excluir tarefas na UI)
- [ ] Mensagens de erro (duplicidade listas/tarefas) exibidas na UI
- [ ] Estados vazios (placeholders listas/tarefas)
- [ ] Smoke test `App.vue` e bootstrap (`main.ts`)
- [ ] Acessibilidade básica (axe-core) em componentes críticos

### Qualidade / Observabilidade

- [x] Relatório de cobertura e meta
- [ ] Badge dinâmico via CI (Codecov / SonarCloud)
- [ ] Lint + type-check em pipeline CI
- [ ] Monitoramento de performance inicial (Core Web Vitals) opcional

### Arquitetura / Estado

- [ ] Extrair camada de serviços futura (REST/API)
- [ ] Suporte a múltiplos espaços de trabalho / multi-tenant
- [ ] Persistência alternativa (IndexedDB) para volumes maiores

### UX / UI

- [ ] Mensagens de confirmação
- [ ] Possibilidade de Arquivar Listas
- [ ] Lixeira das tarefas
- [ ] Mover tarefa concluida para o final da lista
- [ ] possibilidade de reativar tarefa ao tentar incluir novamente.
- [ ] Microinterações e transições sutis (entradas de lista/tarefa)
- [ ] Feedback visual para erros de duplicidade (snackbar/toast padronizado)
- [ ] Internacionalização (i18n) com fallback

### Escalabilidade / Futuro

- [ ] Feature flags (habilitar/desabilitar módulos)
- [ ] SSR / pré-render opcional
- [ ] Modularização por domínio (ex: `domains/tasks`)

## 9. Como Contribuir (Opcional)

1. Fork e branch a partir de `desafio/todo-list-multiusuario`.
2. Criar branch feature: `feat/nome-curto`.
3. Rodar: `npm run test:unit -- --run` e `npm run test:coverage` (garantir metas).
4. Abrir PR descrevendo motivação + screenshots quando UI.
5. Aguardar revisão e squash merge.

## 10. Licença

Projeto desenvolvido para fins de avaliação técnica (não licenciado formalmente). Adicionar licença se for aberto ao
público.

---

**Desafio JTech - Solução desenvolvida para avaliação de arquitetura frontend.**
