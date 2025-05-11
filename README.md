# Turborepo Monorepo Boilerplate

[![Turborepo](https://img.shields.io/badge/-Turborepo-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/repo)
[![Bun](https://img.shields.io/badge/-Bun-000000?logo=bun&logoColor=white)](https://bun.sh)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Opinionated** monorepo starter using **Turborepo** and **Bun**.
Built for **full-stack TypeScript** with shared tooling, packages, and blazing-fast performance.

> [!IMPORTANT]  
> This is a work in progress and is not ready for use

## ✨ Features
- 🚀 **Full-Stack TypeScript** with shared `Zod` schemas
- ⚡ **Blazing-fast** builds with Turborepo caching
- 🔋 **Bun-powered** runtime and package management
- 📦 **Pre-configured Apps**
  - 🔌 API – Hono backend for Cloudflare Workers
  - 🌐 Web – React + Vite frontend
- 🧩 **Shared Packages**
  - 🗃️ Database – Drizzle ORM + Cloudflare D1
  - 📝 Logger – Context-aware logging
  - ⚙️ Types – Shared type definitions
  - 🎨 UI – Component library (Storybook-ready)
- 🔧 **Modern Tooling**:
  - [Biome](https://biomejs.dev) for linting/formatting
  - [Husky](https://typicode.github.io/husky) for Git hooks
  - [Lint-staged](https://github.com/okonet/lint-staged) for linting staged files
  - [Mise](https://mise.jdx.dev) for package management
  - [TypeScript](https://www.typescriptlang.org) for type checking
  - [Turbo](https://turbo.build/repo) for monorepo management


## 📂 Structure

```
monorepo/
├── apps/
│ ├── web/ # Vite + React
│ └── api/ # Hono (Cloudflare Workers)
└── packages/
  ├── database/ # Drizzle ORM
  ├── logger/   # Context-aware logging
  ├── types/    # Shared Zod schemas
  └── web-ui/   # Component library
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
  - `tsconfig` – Shared TypeScript config
  - `web-ui` – Component library with Shadcn UI as base

## 🚀 Quick Start

1. **Install [Mise](https://mise.jdx.dev/getting-started.html)** (tool version manager)
2. **Install tools**
  ```bash
  mise install
  ```
3. **Install packages**
  ```bash
  bun install
  ```
4. **Run dev server**
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
