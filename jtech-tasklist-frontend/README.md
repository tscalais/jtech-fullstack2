
# jtech-tasklist

Sistema TODO List Multi-usuário com Arquitetura Avançada

---

## 1. Visão Geral da Arquitetura

O projeto segue uma arquitetura modular baseada em Vue 3 (Composition API), com separação clara entre views, components, stores (Pinia), composables e plugins. O estado global é persistido via Pinia + localStorage. O roteamento é protegido por guards e a interface utiliza Vuetify para Material Design responsivo.

## 2. Stack Tecnológica

- **Vue 3 (Composition API):** Base do frontend, permite componentização avançada e reatividade moderna.
- **TypeScript:** Tipagem robusta em toda a aplicação.
- **Pinia:** Gerenciamento de estado global, persistido em localStorage.
- **Vue Router 4:** Roteamento com guards para autenticação.
- **Vuetify:** UI premium baseada em Material Design.
- **Vitest:** Testes unitários (a implementar).

**Justificativa:** Todas as escolhas visam escalabilidade, manutenibilidade e experiência do usuário premium.

## 3. Como Rodar Localmente

```sh
git clone <repo-url>
cd jtech-tasklist-frontend
npm install
npm run dev
```
Acesse http://localhost:5173

## 4. Como Rodar os Testes

```sh
npm run test:unit
```
> Os testes unitários devem ser implementados em breve para stores e components principais.

## 5. Estrutura de Pastas Detalhada

```
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

## 6. Decisões Técnicas Aprofundadas

- **Persistência:** Todo o estado é salvo em localStorage via composable, garantindo experiência contínua.
- **Guards de Rota:** Usuário não autenticado é redirecionado para login.
- **Componentização:** Componentes desacoplados, com props tipadas e eventos claros.
- **Validações:** Prevenção de duplicatas e campos obrigatórios em listas/tarefas.
- **Feedback:** Snackbars, loaders e confirmações para todas as ações relevantes.
- **Simulação de Backend:** Autenticação e dados são mockados, conforme escopo do desafio.

## 7. Melhorias e Roadmap

- [ ] Implementar testes unitários com Vitest para stores e components
- [ ] Melhorar animações e microinterações para experiência ainda mais premium
- [ ] Adicionar internacionalização (i18n)
- [ ] Permitir múltiplos perfis de usuário (mock)
- [ ] Refatorar para cobertura 100% de TypeScript
- [ ] Documentação técnica detalhada dos stores e composables

---

**Desafio JTech - Solução desenvolvida para avaliação de arquitetura frontend.**
