# Lootopia

Monorepo for the Lootopia prototype:

- `apps/api`: NestJS API (TypeScript)
- `apps/web`: React + Vite front-end (TypeScript)

## Getting started

Requires Node.js >= 24.15 (see `.nvmrc`).

```bash
npm install
npm run dev:api   # http://localhost:3000/api/health
npm run dev:web   # http://localhost:5173
```

## Scripts

- `npm run lint`: strict ESLint on the whole repository (zero warnings)
- `npm run typecheck`: TypeScript checks
- `npm run build`: production builds
