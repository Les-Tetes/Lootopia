# Lootopia

Prototype (MVP) of a platform to create and play geolocated treasure hunts, built for Out of Cache.

## Stack

| Area     | Choice                                           |
| -------- | ------------------------------------------------ |
| Front    | React + Vite + TypeScript, as a PWA (`apps/web`) |
| Back     | NestJS + TypeScript (`apps/api`)                 |
| Tests    | Vitest (unit), Playwright (end-to-end, later)    |
| Quality  | ESLint (strict, type-aware), Prettier, SonarQube |
| Workflow | npm workspaces, Husky, lint-staged, commitlint   |

## Requirements

- Node.js `>= 24.15` (see `.nvmrc`; with nvm: `nvm install` then `nvm use`)
- npm `>= 11`

## Getting started

```bash
npm install        # also installs the Git hooks
npm run dev:api    # http://localhost:3000/api/health
npm run dev:web    # http://localhost:5173 (proxies /api to the API)
```

## Scripts

| Script              | Description                                 |
| ------------------- | ------------------------------------------- |
| `npm run lint`      | ESLint on the whole monorepo, zero warnings |
| `npm run lint:fix`  | ESLint with autofix                         |
| `npm run format`    | Prettier write                              |
| `npm run typecheck` | TypeScript checks for every workspace       |
| `npm test`          | Unit tests for every workspace              |
| `npm run build`     | Production builds                           |
| `npm run check`     | Everything above, as run by the CI          |

## Code standards

- Code, identifiers and comments are written in English.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and are checked by
  commitlint (`commit-msg` hook and CI).
- The ESLint configuration (`eslint.config.ts`) is deliberately strict to match the SonarQube
  quality gate (no code smell, A ratings, duplication < 3 %):
  - `typescript-eslint` `strictTypeChecked` + `stylisticTypeChecked`, plus extra rules
    (explicit return types, strict boolean expressions, exhaustive switches, naming convention,
    no enums, no magic numbers…);
  - SonarJS, Unicorn, import-x (ordering, no cycles, no default exports), security, promise,
    regexp;
  - API: Node rules (`process.env` only in bootstrap/config modules);
  - Web: `@eslint-react` strict, React Hooks, React Refresh, and `jsx-a11y` strict for
    accessibility;
  - tests: Vitest rules;
  - every `eslint-disable` needs a `-- reason`, and unused ones are errors.
- Git hooks: `pre-commit` runs lint-staged, `commit-msg` runs commitlint, `pre-push` runs the
  typecheck and the tests.
