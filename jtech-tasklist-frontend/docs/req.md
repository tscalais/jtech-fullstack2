# Requisitos de Frontend: JTech Tasklist SPA (Vue 3 + TS + Tailwind)

Este documento lista as responsabilidades e requisitos para o módulo de Frontend (`jtech-tasklist-frontend`), focado na interface de usuário (UI), experiência de usuário (UX), gestão de estado (Pinia) e consumo da API.

---

## Fase 1: Fundação, Setup e Autenticação

### Objetivo: Configurar o ambiente e implementar o fluxo de login/registro.

* **Setup:** Configurar o projeto **Vue 3** (Composition API), Vite, TypeScript e Tailwind CSS v4.

* **Estado:** Configurar o **Pinia Store** para gerenciar o estado de autenticação e informações do usuário.

* **UI de Autenticação:** Implementar formulários reativos de **Login e Registro**.

* **Comunicação com API:** Criar o **API Client** (`src/lib/api/client.ts`) para lidar com as requisições e **injetar o header `Authorization: Bearer`** com o JWT.

* **Roteamento:** Configurar o **Vue Router** para gerenciar as rotas e implementar a lógica de rotas protegidas (redirecionar se o token não estiver presente).

* **Testes:** Desenvolver testes unitários para o `AuthStore` do Pinia.

---

## Fase 2: Pastas (Folders) - CRUD Básico

### Objetivo: Implementar a navegação e gestão de pastas.

* **Listagem:** Criar o **Componente `FolderList`** para exibir as pastas pertencentes ao usuário.

* **Criação/Edição:** Criar o **Componente `FolderForm`** para criação e edição de pastas.

* **Integração:** Integrar o CRUD da interface de Pastas com os endpoints correspondentes da API.

---

## Fase 3: Tarefas (Tasks) - O Core

### Objetivo: Implementar a visualização e manipulação de tarefas.

* **Visualização:** Criar o **Componente `TaskList`**, exibido dentro da visualização da pasta, para listar as tarefas.

* **CRUD UI:** Desenvolver componentes modais ou in-line para adicionar, editar e excluir tarefas.

* **Interação:** Implementar a funcionalidade de **toggle de status de conclusão** para tarefas.

* **Reatividade:** Desenvolver a lógica de estado no Pinia para garantir que a lista de tarefas seja listada e atualizada de forma reativa.

---

## Fase 4: Compartilhamento de Pastas (Folders)

### Objetivo: Implementar a interface para colaboração.

* **Chave de Acesso:** Implementar uma UI clara para o proprietário **exibir a chave de acesso** (`joinKey`) da pasta.

* **Entrar na Pasta:** Desenvolver a funcionalidade **"Join Folder"** onde o usuário insere a chave para se tornar um membro.

* **Gestão de Membros:** Criar o **Componente `MemberList`** (acessível apenas ao proprietário) com a funcionalidade de listar e remover membros.

* **Permissões:** Ajustar a interface (UI/UX) para que os membros (além do owner) possam ver e manipular as tarefas da pasta, refletindo a nova regra de segurança do backend.

---

## Fase 5: Microtarefas (Subtasks) e Tags

### Objetivo: Adicionar a interface para organização avançada.

* **Microtarefas (Subtasks):**

  * Implementar a UI para **visualizar e adicionar subtasks** dentro de uma tarefa pai.

  * Desenvolver o **toggle de conclusão** para subtasks.

* **Tags:**

  * Criar um componente de gerenciamento para a **criação e remoção de Tags** por pasta.

  * Implementar a UI para **associar Tags** às tarefas e exibi-las de forma visualmente agradável (e.g., badges).

---

## Fase 6: Observabilidade e Finalização

### Objetivo: Polimento visual e qualidade do código frontend.

* **Estilo:** Implementar o design final utilizando o **Tailwind CSS**, garantindo um layout **totalmente responsivo** e acessível.

* **Testes:** Garantir a cobertura de testes de componentes utilizando **Vitest** e `@vue/test-utils`.

---

## Fase 7: Próximos Passos (Roadmap)

### Objetivo: Ações futuras para evolução do projeto.

* Configurar variável de ambiente para a `BASE_URL` da API via injeção no processo de build (Vite).

* Implementar internacionalização (i18n) no frontend para suportar múltiplos idiomas.