# ⚡ Auto Prime Estética Automotiva

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge&logo=github" alt="Status"/>
  <img src="https://img.shields.io/badge/Sprint-3-orange?style=for-the-badge" alt="Sprint"/>
  <img src="https://img.shields.io/badge/Faculdade-Univi%C3%A7osa-blue?style=for-the-badge" alt="Univiçosa"/>
</p>

> **Auto Prime Estética** é uma solução web moderna desenvolvida para aproximar clientes e serviços automotivos premium. O principal objetivo do projeto é facilitar a vida dos usuários através de uma interface simples, elegante e um sistema prático de agendamento online.

---

## 💻 Sobre o Projeto

O site conta com uma Landing Page institucional de alto impacto visual, detalhando os serviços oferecidos (como Lavagem Completa, Detalhada e Polimento Técnico) e um sistema interativo em JavaScript que valida dados, mascara campos de texto (como telefones) e verifica a disponibilidade de horários em tempo real integrando-se a uma API.

### 🚀 Funcionalidades Principais
* **Agendamento Inteligente:** Bloqueio dinâmico de horários já ocupados para evitar conflitos.
* **Indicador de Passos (Steps):** Feedback visual para o usuário conforme ele preenche o formulário.
* **Máscaras de Input:** Formatação automática do campo de telefone em tempo real `(DD) XXXXX-XXXX`.
* **Integração de Notificações:** Sistema de *Toasts* personalizados para avisos de sucesso ou falha.
* **Atalho para WhatsApp:** Geração automática de mensagens estruturadas com os dados do agendamento para contato rápido.
* **Design Responsivo Premium:** Layout adaptável para smartphones, tablets e desktops utilizando fontes modernas e transições fluidas.

---

## 🛠️ Tecnologias Utilizadas

O ecossistema do projeto foi dividido de forma organizada entre tecnologias de Front-end e dependências de Back-end:

### Front-end
* **HTML5 & CSS3:** Estrutura semântica e estilização moderna baseada em variáveis CSS (modo escuro com detalhes em dourado).
* **JavaScript (ES6+):** Manipulação assíncrona do DOM, validações de formulário e consumo de API via `fetch`.
* **Google Fonts:** Utilização das famílias *Barlow* e *Barlow Condensed* para uma identidade visual esportiva e robusta.

### Back-end & Dependências
* **Node.js:** Ambiente de execução para o servidor.
* **Express:** Framework minimalista para criação das rotas da API (`/api/agendamentos` e `/api/horarios-ocupados`).
* **MySQL2:** Driver para conexão e persistência de dados no banco de dados relacional.
* **CORS:** Gerenciamento de permissões para requisições cruzadas entre o navegador e o servidor.
* **Nodemon (Dev):** Reinicialização automática do servidor durante o desenvolvimento.

---

## 📂 Estrutura de Arquivos Principais

```text
├── index.html               # Página principal (Landing Page)
├── style2.css               # Estilização completa e responsividade do ecossistema
├── firebase.json            # Configurações de hospedagem Firebase Hosting
├── package.json             # Manifesto do projeto e dependências do Node.js
├── package-lock.json        # Árvore exata de dependências instaladas
├── firestore.rules          # Regras de segurança de banco de dados
└── pages/
    ├── agendamento.html     # Página de formulário de agendamento
    └── agendamento.js       # Lógica do front-end, máscaras e consumo da API
