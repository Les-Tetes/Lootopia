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

## Pre-release versions

Each Pull Request to `develop` gets a pre-release version (`.github/workflows/pre-release.yml`),
shown in the job summary of the `pre-release` check, for example `0.4.0-pr.12.3`
(next version `0.4.0`, PR #12, 3 commits).

Once the other checks are green, semantic-release computes the next version in dry-run mode from the
Conventional Commits since the last `vX.Y.Z` tag: `fix`/`perf` bump the patch, `feat` the minor and
`!` the major version. Nothing is tagged or published. A PR with none of these commits gets no new version.
