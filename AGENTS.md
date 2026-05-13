# Agent guide · tasks-api

This file is read by GitHub Copilot CLI, the cloud coding agent, and VS Code
agent mode. It complements `.github/copilot-instructions.md` with rules
specific to autonomous, multi-step work.

## Before editing

1. Run `npm test` to confirm the baseline is green.
2. Read the file you are about to change end-to-end.

## After editing

1. Run `npm test` again. **Do not stop** until tests pass.
2. Run `npm run typecheck`. **Do not stop** until it's clean.
3. If you added a new exported function, add at least one Vitest test for it.
4. Paste the final `npm test` summary in your last message.

## Safety rules — agent must never

- Run `rm -rf`, `git push --force`, or `git reset --hard`.
- Bypass git hooks (`--no-verify`).
- Add an npm dependency without asking the user.
- Delete tests to make a build green.
- Disable TypeScript strictness or add `// @ts-ignore`.

## Style for generated code

- camelCase functions, PascalCase types, kebab-case filenames.
- Explicit return types on exports.
- Errors subclass `TaskError`.
- No `any`, no `console.log` in `src/`.
