# TaskManager Frontend

Este é o frontend da aplicação TaskManager, uma interface moderna e responsiva construída para interagir com a API do TaskManager Backend. A aplicação permite que os usuários se autentiquem e gerenciem suas tarefas de forma intuitiva, oferecendo uma experiência de usuário fluida e segura.

---

## Funcionalidades

- **Autenticação de Usuários:** Oferece uma experiência de login e registro segura, interagindo diretamente com os endpoints de autenticação JWT do backend.
- **Gerenciamento de Tarefas (CRUD):** Permite criar, ler, atualizar e deletar tarefas de forma dinâmica, com uma interface que reflete o status de cada tarefa.
- **Design Moderno:** A interface foi construída com componentes **Radix UI** e estilizada com **Tailwind CSS**, garantindo um design consistente, acessível e responsivo em todos os dispositivos.
- **Validação de Formulários:** Utiliza o **React Hook Form** e **Zod** para uma validação de formulários robusta e eficiente, melhorando a confiabilidade das interações do usuário.
- **Gerenciamento de Estado:** A aplicação gerencia o estado da autenticação e das tarefas, proporcionando uma experiência de navegação e uso sem interrupções.

---

## Tecnologias Utilizadas

- **[Next.js 15](https://nextjs.org/)** - Framework React para aplicações web de alto desempenho.
- **[React 19](https://react.dev/)** - Biblioteca JavaScript para a construção de interfaces de usuário.
- **[TypeScript 5](https://www.typescriptlang.org/)** - Linguagem de programação que adiciona tipagem estática ao JavaScript.
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework de CSS utilitário para estilização rápida.
- **[Radix UI](https://www.radix-ui.com/)** - Biblioteca de componentes headless para criar sistemas de design acessíveis.
- **[React Hook Form](https://react-hook-form.com/)** - Biblioteca para gerenciamento de formulários.
- **[Zod](https://zod.dev/)** - Biblioteca de validação de esquemas de tipagem para TypeScript.
- **[Axios](https://axios-http.com/)** - Cliente HTTP para realizar requisições à API do backend.
- **[JWT-decode](https://github.com/auth0/jwt-decode)** - Biblioteca para decodificar tokens JWT no cliente.
- **[Lucide React](https://lucide.dev/)** - Coleção de ícones para a interface.

---

## Como Executar o Projeto

Para rodar o projeto do frontend, é necessário ter um ambiente de desenvolvimento Node.js e o backend em execução.

### Pré-requisitos

- **[Node.js](https://nodejs.org/en)** (versão recomendada: 20 ou superior)
- **[npm](https://www.npmjs.com/)** ou **[Yarn](https://yarnpkg.com/)**
- **TaskManager Backend** em execução (para que o frontend possa se comunicar com a API).

### Instalação

1. Clone o repositório do frontend para a sua máquina:
   ```bash
  https://github.com/biancadearaujo/task-manager-frontend.git
```
```
cd TaskManager-Frontend
npm install
```
```
npm run dev
```
