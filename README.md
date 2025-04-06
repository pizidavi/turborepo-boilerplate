# Monorepo with Turborepo

Opinionated Turborepo starter template

> [!IMPORTANT]  
> This is a work in progress and is not ready for use

## What's inside?

### Apps and Packages

- `api`: a vanilla [hono](https://hono.dev) ts backend for Cloudflare Workers
- `web`: a vanilla [vite](https://vitejs.dev) ts react app
- `@repo/database`: a [drizzle-orm](https://drizzle-orm.org) database connected to Cloudflare D1
- `@repo/logger`: a simple logger shared by the applications, with context support
- `@repo/type`: types & `zod` schema shared by the applications
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@repo/ui`: a stub component library shared by the applications

### Utilities

- [Biome](https://biomejs.dev) for code linting
- [Husky](https://github.com/typicode/husky) for git hooks
- [Lint-staged](https://github.com/okonet/lint-staged) for linting staged files
- [Mise](https://github.com/jdx/mise) for dev tools version management
- [Turbo](https://turbo.build/repo) for monorepo management
