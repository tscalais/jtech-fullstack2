# Desafio Técnico Fullstack Pleno - JTech

## Sistema TODO List Multi-usuário Seguro e Completo

### Contextualização e Objetivo

A **JTech** busca desenvolvedores fullstack experientes capazes de projetar e implementar sistemas completos, seguros e escaláveis. Este desafio avalia sua competência em integração de tecnologias, implementação de segurança robusta e arquitetura de aplicações complexas.

**Objetivo:** Desenvolver uma aplicação TODO List multi-usuário completa, integrando backend seguro com autenticação JWT e frontend moderno, demonstrando expertise em desenvolvimento end-to-end e boas práticas de segurança.

## Especificações Técnicas

### Backend - API Segura e Robusta

#### Sistema de Autenticação Empresarial

1. **Autenticação JWT Completa**:
   * Sistema completo de registro e login de usuários
   * Implementação de tokens JWT com refresh token
   * Hash seguro de senhas utilizando bcrypt
2. **Endpoints de Autenticação**:
   * `POST /auth/register`: Cadastro com validação de dados
   * `POST /auth/login`: Autenticação com geração de tokens
   * `POST /auth/refresh`: Renovação de tokens expirados

#### API de Tarefas com Controle de Acesso

1. **CRUD Protegido de Tarefas**:
   * Todos os endpoints protegidos por autenticação JWT
   * Validação rigorosa de propriedade dos recursos
   * Controle granular de acesso por usuário
2. **Arquitetura SOLID**: Implementação rigorosa dos princípios SOLID em todas as camadas
3. **Tratamento de Exceções**: Sistema centralizado e robusto de exception handling

#### Qualidade e Testabilidade

1. **Testes Unitários**: Cobertura completa da camada de serviço
2. **Testes de Integração**: Validação end-to-end dos fluxos com segurança
3. **Testes de Segurança**: Validação de cenários de acesso negado e autorização

### Frontend - Interface Moderna e Segura

#### Fluxo de Autenticação Completo

1. **Telas de Autenticação**:
   * Interface de login responsiva e intuitiva
   * Tela de registro com validação em tempo real
   * Gerenciamento de estados de carregamento e erro
2. **Segurança Frontend**:
   * Armazenamento seguro de tokens JWT
   * Interceptação automática de requisições HTTP
   * Redirecionamento automático em caso de token expirado

#### Aplicação Principal Integrada

1. **Interface Completa**: Consumo total da API backend para CRUD de tarefas
2. **Gerenciamento de Estado**: Pinia para controle de autenticação e dados da aplicação
3. **Rotas Protegidas**: Guards de rota para usuários não autenticados
4. **Experiência do Usuário**: Interface responsiva com feedback visual adequado

### Stack Tecnológica Obrigatória

**Backend:**

* Linguagem: Java 17+
* Framework: Spring Boot, Spring Security
* Persistência: Spring Data JPA com Hibernate
* Banco de Dados: PostgreSQL
* Segurança: JWT, BCrypt
* Testes: JUnit 5, Mockito, Spring Boot Test

**Frontend:**

* Framework: Vue 3 (Composition API)
* Roteamento: Vue Router 4
* Gerenciamento de Estado: Pinia
* UI Framework: Material Design (Vuetify ou similar)
* HTTP Client: Axios com interceptadores
* Testes: Vitest

## Critérios de Avaliação

* **Aplicação de SOLID**: Implementação correta dos princípios no backend (critério fundamental)
* **Segurança End-to-End**: Fluxo completo de autenticação e autorização implementado corretamente
* **Arquitetura e Qualidade**: Código limpo, modular e bem documentado em ambas as camadas
* **Integração Seamless**: Comunicação fluida e segura entre frontend e backend
* **Qualidade dos Testes**: Cobertura abrangente em ambas as camadas da aplicação
* **Experiência do Usuário**: Interface intuitiva com tratamento adequado de erros e estados

## Expectativa de Entrega

* **Prazo**: Até 3 dias corridos a partir do recebimento.
* **Formato**: Repositório Git único com pastas `frontend` e `backend`, incluindo `README.md` na raiz.

### Estrutura Obrigatória do `README.md`

1. **Visão Geral da Arquitetura**: Descrição completa da aplicação e integração entre camadas
2. **Stack Tecnológica**: Lista detalhada de todas as tecnologias utilizadas
3. **Como Rodar Localmente**: Instruções completas para configuração de banco, backend e frontend
4. **Como Rodar os Testes**: Comandos separados para testes de backend e frontend
5. **Arquitetura e Princípios SOLID**: Documentação específica da aplicação dos princípios no backend
6. **Fluxo de Segurança**: Explicação detalhada do sistema de autenticação implementado
7. **Decisões Técnicas**: Justificativas aprofundadas para escolhas de design e tecnologia
8. **Melhorias e Roadmap**: Propostas técnicas para evolução e escalabilidade

---

**Boa sorte! A JTech espera uma solução que demonstre excelência técnica e visão arquitetural completa.**
