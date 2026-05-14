# CLAUDE.md

Guidance for Claude when working on this codebase.

## How Claude Should Work Here

- Follow existing architecture and patterns — don't introduce new frameworks, libraries, or state solutions.
- Prefer small, focused changes over large refactors unless explicitly requested.
- Search for existing patterns before introducing a new approach; be consistent with the surrounding code.
- Keep types and contracts in sync across backend, Prisma schema, and `libs/track-shared`.
- Always update or add tests when changing backend logic, API contracts, or React components.
- If behavior is unclear (e.g. expected API shape, validation rules), ask rather than guess.
- Do not use `// @ts-ignore` or `// eslint-disable` unless absolutely required — fix the underlying issue instead.

## Project Overview

ProTrack: Full-stack project tracking app using NX Workspace monorepo, TypeScript, React 19, and NestJS 11.

**Frontend:** Vite • React Router • React Query • Zustand • Tailwind • HeroUI • Axios • React Hook Form • Zod
**Backend:** NestJS • Prisma • SQLite
**Testing:** Jest • Vitest • Playwright
**Environment:** Node v20+ (via `.nvmrc`). Package manager: npm.

## Setup & Development

```bash
nvm use && npm install

# Copy env files (first time)
cp apps/track-api/.env.example apps/track-api/.env
cp apps/track-web/.env.example apps/track-web/.env.local

# Run database migrations (first time)
cd apps/track-api && npx prisma migrate dev --name init && cd ../..

# Run both frontend (4200) and backend (3000)
npm run dev

# Or run individually
npm run dev:web    # Frontend only (wraps nx serve track-web)
npm run dev:api    # Backend only  (wraps nx serve track-api)
```

### Environment Variables

`apps/track-api/.env` — required, not committed:

| Variable       | Description         | Example         |
| -------------- | ------------------- | --------------- |
| `DATABASE_URL` | SQLite DB file path | `file:./dev.db` |

## Key Commands

```bash
# Development
npx nx lint [project]              # Lint project or all
npx nx build [project]             # Build project
npx nx test [project]              # Run tests (Jest or Vitest depending on project)
npx nx e2e track-web-e2e           # E2E tests (Playwright)

# Database
cd apps/track-api
npx prisma migrate dev --name feature_name   # New migration
npx prisma studio                            # View DB GUI

# Shared library (rebuild after any changes to libs/track-shared)
npx nx build track-shared

# NX cache (run if builds/tests return stale or unexpected results)
npx nx reset
```

## Project Structure

```text
apps/
├── track-api/            # Backend: NestJS app, port 3000, /api prefix
│   ├── src/app/          # Feature modules (controller + service + module per domain)
│   │   └── prisma.service.ts
│   └── src/main.ts       # Entry point, sets /api prefix
├── track-web/            # Frontend: React + Vite, port 4200
│   ├── src/app/          # Feature-based components
│   └── src/main.tsx      # Entry point
└── track-web-e2e/        # Playwright E2E tests

libs/
└── track-shared/         # Shared types & utilities (used by both apps)

prisma/schema.prisma      # Database schema (SQLite)
```

## Architecture

### Backend (NestJS)

- One NestJS module per domain/resource (feature-based)
- Controllers handle routing only — no business logic
- Services contain all business logic and call `PrismaService` for DB access
- All routes are prefixed with `/api`
- REST conventions: `GET /api/<resource>`, `POST /api/<resource>`, `PATCH /api/<resource>/:id`, `DELETE /api/<resource>/:id`
- Use NestJS built-in exception classes (`NotFoundException`, `BadRequestException`, etc.) — a global exception filter is not yet set up
- Testing: Jest, files named `*.spec.ts`

### Frontend (React)

- Components in `apps/track-web/src/app/` (feature-based)
- Routing: React Router v6
- Styling: Tailwind CSS with HeroUI components — prefer HeroUI primitives before writing custom components
- Testing: Vitest + Testing Library, files named `*.test.ts(x)`

### State Management

- **Server state**: React Query — all API data fetching, caching, and mutations
- **Client state**: Zustand — local UI and global client-side state not tied to the server

State follows the **DUCK pattern** under `store/<entity>/` — see an existing entity for reference. React Query entities use `query.ts`, `mutation.ts`, and `types.ts`; Zustand entities use `store.ts`, `selector.ts`, and `types.ts`.

### Shared Library

- Types and utilities shared between frontend and backend go in `libs/track-shared`
- Run `npx nx build track-shared` after any change before using in either app
- Import via the path alias defined in `tsconfig.base.json`

### Monorepo (NX)

- NX caches build and test outputs — run `npx nx reset` if you get stale or unexpected results
- Each app is independently buildable and testable

## Coding Standards

### TypeScript

- Avoid `any` — use proper types or `unknown` with narrowing
- Never suppress type errors with `@ts-ignore` or `@ts-expect-error` — fix the root cause; if truly unavoidable, add a comment explaining why
- Cross-layer contracts (request/response shapes) belong in `libs/track-shared`

### Naming

- Resource names: plural in routes (`/api/tasks`), singular in model/service names (`Task`, `TasksService`)
- Components: `PascalCase.tsx`
- Hooks: `useX.ts`
- Utilities: `camelCase.ts`
- Tests: `*.spec.ts` (backend), `*.test.ts(x)` (frontend)

### Error Handling

- Backend: throw NestJS HTTP exceptions (`NotFoundException`, `BadRequestException`, etc.)
- Frontend: surface API errors via React Query and display user-friendly messages (toast/alert)

### Comments

- Do not write comments by default
- Comments are only allowed for public APIs and complex logic that would take a human more than 2 minutes to understand
- Never describe what the code does — explain why it does it, if that why is non-obvious

### Linting

- Never disable ESLint rules with `// eslint-disable` without a comment explaining why it's unavoidable
- Fix the root cause instead of suppressing the warning

## Preferred Patterns

### API Calls

- All API calls belong in React Query hooks (`query.ts` / `mutation.ts`)
- Use Axios for HTTP requests — do not use `fetch` directly

### Forms

- Prefer React Hook Form for form state
- Use Zod for validation schemas

### Styling

- Prefer Tailwind utility classes
- Use HeroUI composition before writing custom components
- Avoid inline styles

### Libraries We Avoid

- No Redux or Redux Toolkit — use Zustand
- No Context API for global state — use Zustand
- No styled-components or CSS-in-JS — use Tailwind
- No Moment.js — use `date-fns` if date handling is needed
- No class components

## Development Workflow

### Branches

Format: `<type>/issue-<number>-<short-description>`

```text
feat/issue-42-add-task-assignments
fix/issue-17-due-date-validation
chore/issue-8-update-dependencies
refactor/issue-31-extract-auth-service
```

Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`

### Commits

Use **Conventional Commits**:

```text
feat: add task assignment endpoint
fix: correct due date timezone handling
chore: update prisma to v6
refactor: extract pagination logic into shared util
test: add service-level tests for task creation
docs: update API error handling in CLAUDE.md
```

- One logical change per commit
- Use imperative mood ("add", not "added" or "adds")
- Keep the subject line under 72 characters

### Pull Requests

- Keep PRs focused on a single concern
- Include tests for new or changed behavior
- Avoid unrelated refactors in the same PR
- Update shared types and docs when the API contract changes

## Do Nots

- **Don't modify ESLint or Prettier config files** — never edit `.eslintrc.*`, `eslint.config.*`, `.prettierrc.*`, `prettier.config.*`, or any per-project ESLint/Prettier overrides; raise a question if a lint or format rule is blocking progress
- **Don't put business logic in controllers** — controllers route requests, services own the logic
- **Don't access Prisma directly** — always go through `PrismaService` in `apps/track-api/src/app/prisma.service.ts`
- **Don't add shared types inline** — if a type is used by both apps, add it to `libs/track-shared`
- **Don't use React Query for client-only state** — use Zustand for UI state that has no server counterpart
- **Don't write custom UI components for things HeroUI covers** — check HeroUI docs first
- **Don't use `@ts-ignore` or `eslint-disable`** — fix the underlying issue; suppress only as a last resort with an explanation

## Adding a New Feature

When adding a new resource (e.g. `tasks`):

1. **Backend**: create `apps/track-api/src/app/tasks/` with `tasks.module.ts`, `tasks.controller.ts`, `tasks.service.ts`; register the module in `app.module.ts`
2. **Database**: add the model to `prisma/schema.prisma`, then run `npx prisma migrate dev --name add_tasks`
3. **Shared types**: add request/response types to `libs/track-shared`, rebuild with `npx nx build track-shared`
4. **Frontend state**: create `store/tasks/` following the DUCK pattern above
5. **Frontend UI**: add components under `apps/track-web/src/app/tasks/`
