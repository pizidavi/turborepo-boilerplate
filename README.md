# Monorepo with Turborepo

This is an starter Turborepo

## What's inside?

### Apps and Packages

- `api`: a vanilla [hono](https://hono.dev) ts backend for Cloudflare Workers
- `web`: a vanilla [vite](https://vitejs.dev) ts react app
- `@repo/logger`: a simple logger shared by the applications, with context support
- `@repo/type`: types & `zod` schema shared by the applications
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@repo/ui`: a stub component library shared by the applications

### Utilities

- [Turbo](https://turbo.build/repo) for monorepo management
- [Biome](https://biomejs.dev) for code linting
- [Husky](https://github.com/typicode/husky) for git hooks
- [Mise](https://github.com/jdx/mise) for dev tools version management
