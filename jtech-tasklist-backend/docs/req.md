# Requisitos de Backend: JTech Tasklist API (Spring Boot 3 + Java 21)

Este documento lista as responsabilidades e requisitos para o módulo de Backend (`jtech-tasklist-backend`), focado na criação da API REST, gerenciamento de persistência, lógica de segurança e validações de regras de negócio.

---

## Fase 1: Fundação, Setup e Autenticação

### Objetivo: Estabelecer a segurança JWT e o acesso básico.

* **Configuração Inicial:** Verificar configuração do Maven, H2 e JWT (jjwt).
* **Modelo de Dados:** Implementar o **Modelo `User` (JPA)** e seu repositório correspondente.
* **Endpoints de Autenticação:** Criar os endpoints de **Registro** e **Login**, responsáveis pela validação de credenciais e **emissão do JWT**.
* **Segurança:** Configurar o **Spring Security** para autenticar requisições usando o JWT recebido.
* **Proteção de Rotas:** Proteger todas as rotas da API, exceto as de registro e login.
* **Testes:** Desenvolver testes unitários para os serviços críticos (`UserService` e `JwtService`).
* **Documentação:** Garantir que o **Swagger/OpenAPI** esteja online e acessível.

---

## Fase 2: Pastas (Folders) - CRUD Básico

### Objetivo: Criar a estrutura básica de pastas e controle de propriedade.

* **Modelo de Dados:** Implementar o **Modelo `Folder` (JPA)** com relacionamento um para um com `User` (proprietário/Owner).
* **CRUD:** Implementar o CRUD completo (Create, Read, Update, Delete) para o recurso `Folder`.
* **Regra de Negócio/Segurança:** Aplicar a regra de segurança onde apenas o `owner` da pasta pode criá-la, listá-la, editá-la e deletá-la.

---

## Fase 3: Tarefas (Tasks) - O Core

### Objetivo: Implementar a funcionalidade principal de gerenciamento de tarefas.

* **Modelo de Dados:** Implementar o **Modelo `Task` (JPA)**, associado à `Folder`, incluindo campos como `title`, `description` e `is_completed`.
* **CRUD:** Implementar o CRUD completo de Tarefas, tipicamente aninhado nos endpoints de `Folder` (ex: `/folders/{folderId}/tasks`).
* **Status:** Criar um endpoint específico para **marcar uma tarefa como concluída/pendente**.
* **Regra de Negócio/Segurança:** Manter a regra de segurança: a manipulação de `Tasks` é permitida apenas se o usuário for o `owner` da `Folder` associada.

---

## Fase 4: Compartilhamento de Pastas (Folders)

### Objetivo: Introduzir a lógica de colaboração e atualizar permissões.

* **Chave de Acesso:** Adicionar o campo **`joinKey`** (chave de acesso pública) ao **Modelo `Folder`**.
* **Gerenciamento de Membros:** Implementar o **Modelo `FolderMember`** (relacionamento M:N entre User e Folder) para rastrear membros participantes.
* **Endpoints de Membros:** Criar endpoints para que o `owner` possa **listar e remover membros** da pasta.
* **REVISÃO CRÍTICA DE SEGURANÇA:** Atualizar as regras de segurança em **todas as rotas de Task e Tag** (futuramente) para permitir acesso/manipulação se o usuário for **Owner OU Member** da pasta.
* **Testes:** Desenvolver testes de integração robustos para as novas regras de permissão de compartilhamento.

---

## Fase 5: Microtarefas (Subtasks) e Tags

### Objetivo: Adicionar recursos de organização e aninhamento.

* **Microtasks (Subtasks):**
    * Ajustar o **Modelo `Task`** para incluir um relacionamento `parentTask` (autorelacionamento) para representar subtarefas.
    * Implementar o CRUD para Subtasks.
    * **Validação de Negócio:** Implementar a validação na API para limitar a **5 subtarefas por tarefa**.
* **Tags:**
    * Implementar o **Modelo `Tag`** (ligado à `Folder`) e a tabela M:N de associação `TaskTag`.
    * Implementar o CRUD de Tags por pasta.
    * Criar endpoints para **associar e desassociar Tags** a uma `Task`.

---

## Fase 6: Observabilidade e Finalização

### Objetivo: Polimento e garantia da qualidade do ambiente de desenvolvimento.

* **Ambiente Dev:** Confirmar a disponibilidade do console H2 (`/h2-console`) e ajustar os níveis de logs.
* **CORS:** Revisar e manter a configuração de CORS liberada (`allowedOriginPatterns=*`) para o ambiente de desenvolvimento.
* **Documentação:** Revisar e completar a documentação de todos os endpoints e modelos no Swagger/OpenAPI.
* **Testes:** Garantir alta cobertura de testes, incluindo testes de integração e segurança.

---

## Fase 7: Próximos Passos (Roadmap)

### Objetivo: Ações futuras para evolução do projeto.

* Adicionar papéis (roles) com granularidade de permissões por pasta/tarefa.
* Implementar notificações em tempo real (via WebSockets ou SSE) para updates de tarefas em pastas compartilhadas.