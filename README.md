# Turborepo Monorepo Boilerplate

[![Turborepo](https://img.shields.io/badge/-Turborepo-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/repo)
[![Bun](https://img.shields.io/badge/-Bun-000000?logo=bun&logoColor=white)](https://bun.sh)
[![Biome](https://img.shields.io/badge/-Biome-000000?logo=biome&logoColor=white)](https://biomejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Opinionated** monorepo starter using **Turborepo** and **Bun**.
Built for **full-stack TypeScript** with shared tooling and packages.

> [!IMPORTANT]  
> This is a work in progress and is not ready for use

## ✨ Features
- 🚀 **Full-Stack TypeScript** with shared `Zod` schemas
- ⚡ **Blazing-fast** builds with Turborepo caching
- 🔋 **Bun-powered** package management
- 📦 **Pre-configured Apps**
  - 🔌 API – Hono backend for Cloudflare Workers
  - 🌐 Web – React + Vite frontend
- 🧩 **Shared Packages**
  - 🗃️ Database – Drizzle ORM + Cloudflare D1
  - 📝 Logger – Context-aware logger
  - ⚙️ Types – Shared type definitions
  - 🎨 UI – Shadcn/ui component library
- 🔧 **Modern Tooling**:
  - [Biome](https://biomejs.dev) for linting/formatting
  - [Husky](https://typicode.github.io/husky) for Git hooks
  - [Lint-staged](https://github.com/okonet/lint-staged) for linting staged files
  - [Commitlint](https://commitlint.js.org) for linting commits with [Conventional Commits](https://www.conventionalcommits.org)
  - [Mise](https://mise.jdx.dev) for tools version management
  - [TypeScript](https://www.typescriptlang.org) for type checking
  - [Turbo](https://turbo.build/repo) for monorepo management


## 📂 Structure

```
/
├── apps/
│ └── api/ # Backend
│ ├── web/ # Frontend
└── packages/
  ├── database/ # Drizzle ORM
  ├── logger/   # Context-aware logger
  ├── types/    # Shared types & schemas
  └── web-ui/   # Shadcn/ui component library
```

📂 **Apps**
  - `api` – backend with
    - `hono` (Cloudflare Workers)
    - `drizzle-orm`
    - `openapi`
  - `web`- frontend with
    - `vite`
    - `react`
    - `tanstack-router`
    - `tailwindcss`
    - `shadcn-ui`

📦 **Packages**
  - `database` – Drizzle ORM for Cloudflare D1
  - `logger` – Simple logger with context awareness
  - `types` – Shared types & Zod schemas
  - `web-ui` – Component library with Shadcn UI as base

## 🚀 Quick Start

1. **Install tools with [Mise](https://mise.jdx.dev/getting-started.html)** (optional)
  ```bash
  mise install
  ```
2. **Install dependencies**
  ```bash
  bun install
  ```
3. **Run dev server**
  ```bash
  bun run dev
  ```

### 🏗 Deploy

1. **Setup environment variables**
  ```bash
  cp .env.sample .env
  ```
1. **Deploy**
  ```bash
  mise run deploy
  ```

> **NOTE**: the first deploy may be required to run the commands manually

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
