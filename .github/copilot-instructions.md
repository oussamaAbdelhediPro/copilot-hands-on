# Repository: tasks-api

Tiny TypeScript tasks API used as a Copilot training playground.

## Stack

- Node.js **>=20**
- TypeScript **5.4+** (`strict: true`, `noUncheckedIndexedAccess: true`)
- Vitest for tests
- **In-memory store only** — no database, no ORM

## Commands

| Action     | Command           |
|------------|-------------------|
| Install    | `npm install`     |
| Test       | `npm test`        |
| Typecheck  | `npm run typecheck` |
| Watch tests| `npm run test:watch` |

## Conventions

- **camelCase** for variables and functions, **PascalCase** for types/classes.
- File names: **kebab-case** (e.g. `search-by-keyword.ts`).
- Always add explicit return types on exported functions.
- Use `interface` for object shapes, `type` for unions/aliases.
- Prefer `readonly` properties and immutable update patterns.
- Never use `any`. If `unknown` won't do, ask before reaching for `any`.
- Never use `console.log` in `src/`. We'll wire a logger later.
- All errors thrown from `src/` must subclass `TaskError`.
- Imports: use relative paths (`./types`, `../types`). No path aliases yet.

## Don't

- Don't add runtime dependencies without a PR discussion.
- Don't introduce an ORM or a real database.
- Don't write tests that hit the network or the filesystem.
