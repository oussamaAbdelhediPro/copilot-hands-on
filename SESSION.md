# GitHub Copilot · 2-Hour Hands-On Session (TypeScript)

**Audience:** Sofrecom engineers, mixed experience, on Copilot Business in VS Code.
**Duration:** 120 minutes exactly. Each part has a hard time budget — respect it.
**Outcome:** every attendee leaves with a working repo containing custom instructions, a skill, a custom agent, a hook, and an orchestration demo.

---

## Agenda

| #   | Part                                  | Time     | Cumulative |
|-----|---------------------------------------|----------|------------|
| 0   | Setup & welcome                       | 10 min   | 0:10       |
| 1   | Custom instructions (existing + new)  | 15 min   | 0:25       |
| 2   | Slash commands on the project         | 15 min   | 0:40       |
| 3   | Build a Skill from scratch            | 25 min   | 1:05       |
| 4   | Build a Custom Agent                  | 25 min   | 1:30       |
| 5   | Wire a Security Hook                  | 20 min   | 1:50       |
| 6   | Orchestration demo + Q&A              | 10 min   | 2:00       |

> Facilitator tip: keep a visible timer on screen. If a part runs long, **trim the explanation, not the demo**.

---

# ⏱ Part 0 — Setup & welcome  (10 min)

## 0.1 — Welcome (2 min)

State the goal in one sentence:

> *"In two hours we'll turn a vanilla TypeScript repo into one that has every Copilot customization primitive working: instructions, commands, skills, agents, hooks, orchestration."*

## 0.2 — Clone & install (5 min)

Everyone opens a terminal:

```bash
git clone <REMOTE_URL>     # the remote will be shared in chat
cd tasks-api
npm install
npm test
```

Expected output:

```
 ✓ tests/tasks.test.ts (3)

 Test Files  1 passed (1)
      Tests  3 passed (3)
```

## 0.3 — Open in VS Code, verify Copilot (3 min)

```bash
code .
```

In the bottom-right of VS Code, the Copilot status icon must be **green**. Open the Copilot Chat panel (`Ctrl+Alt+I`). Type a sanity prompt:

> **Prompt:** `what does this project do?`

Expected: Copilot summarises the project from the README + `copilot-instructions.md`. If anyone gets an empty response, fix their sign-in before continuing.

> ⏸ **Checkpoint:** everyone sees 3 passing tests **and** a green Copilot icon.

---

# ⏱ Part 1 — Custom instructions  (15 min)

**Goal:** prove Copilot reads `.github/copilot-instructions.md` and learn to add path-scoped rules live.

## 1.1 — Tour the existing instructions (3 min)

Open `.github/copilot-instructions.md`. Highlight four rules:

- camelCase functions, PascalCase types, **kebab-case filenames**
- explicit return types on exports
- **no `any`**, no `console.log` in `src/`
- errors subclass `TaskError`

Open `AGENTS.md`. Highlight one rule:

- *"After editing, run `npm test` AND `npm run typecheck`. Don't stop until both are clean."*

## 1.2 — See Copilot honor the conventions (5 min)

In `src/tasks.ts`, **at the bottom of the file**, add this stub (just type the signature, nothing else):

```ts
export function searchTasksByKeyword(keyword: string)
```

Trigger inline completion (wait one second for the ghost text). Copilot should suggest a body that:

- Adds an explicit return type (`: Task[]`)
- Iterates `store.values()` (not a deep import)
- Uses `.filter(...)` with proper `Task` typing
- Does **not** use `any`
- Does **not** use `console.log`

Press **Tab** to accept. **Don't keep this change** — we'll discard it in 1.4.

> 🎤 *Facilitator narration:* "Notice it returned `Task[]` and used `.filter`. That's our `copilot-instructions.md` doing its job — not Copilot guessing."

## 1.3 — Add a path-scoped rule LIVE (5 min)

Everyone creates this file with this exact content:

**File:** `.github/instructions/tests.instructions.md`

```markdown
---
applyTo: "tests/**/*.test.ts"
---

# Test conventions

- Use **Vitest**. Import `{ describe, it, expect, beforeEach }` from `"vitest"`.
- Reset the in-memory store in `beforeEach` with `_resetStore()`.
- Use the pattern `describe('<thing>', () => { it('<expected behavior>', ...) })`.
- Prefer `it.each([...])` over loops inside a single test.
- Assert on values with `expect(...).toEqual(...)`, not snapshots.
- Never use `console.log` in tests. Use plain assertions.
- Never mock the store. The in-memory implementation is the source of truth.
```

Save it. Then open `tests/tasks.test.ts` and **at the bottom of the describe block**, add this stub:

```ts
it('list_tasks only_open returns only open tasks',
```

Trigger completion. Copilot should produce a test that:

- creates one open + one completed task
- asserts `listTasks({ onlyOpen: true })` returns only the open one
- uses `expect(...).toEqual(...)`
- relies on the `beforeEach` reset already at the top of the file

Run `npm test` — it must pass.

## 1.4 — Discard the throwaway stub and commit  (2 min)

Discard the `searchTasksByKeyword` change in `src/tasks.ts` (Git → discard hunk).
Keep the new test.

```bash
git add .github/instructions/tests.instructions.md tests/tasks.test.ts
git commit -m "feat: add path-scoped test instructions + one test"
```

> ⏸ **Checkpoint:** everyone has the new instruction file + a passing new test.

---

# ⏱ Part 2 — Slash commands  (15 min)

**Goal:** master the four commands you'll use every day on this project.

## 2.1 — `/explain` (3 min)

Open `src/tasks.ts`. Select the body of `createTask` (the full function, ~10 lines).
In Copilot Chat type:

> **Prompt:** `/explain`

Expected: a step-by-step plain-English walkthrough. Notice it references `TaskError`, the trimming logic, and `nextId`.

## 2.2 — `/tests` (4 min)

Still in `src/tasks.ts`, place the cursor inside `completeTask`. Type:

> **Prompt:** `/tests generate two more tests for completeTask — one for an unknown id, one that confirms done stays true after a second call.`

Copilot opens an edit proposal in `tests/tasks.test.ts`. **Read it carefully** before accepting:

- Does it import from `vitest`? ✓
- Does it call `_resetStore()` via the existing `beforeEach`? ✓
- Does it expect `TaskError` for an unknown id? ✓

Accept, run `npm test` — all green.

## 2.3 — `/fix` (4 min)

Open `src/tasks.ts`. Introduce a deliberate bug — change line:

```ts
store.set(task.id, task);
```

to:

```ts
store.add(task.id, task);   // Map has no .add — this is intentionally wrong
```

Save. Run `npm run typecheck` → see the TS error
`Property 'add' does not exist on type 'Map<number, Task>'`. Copy that error line.

In chat:

> **Prompt:** `/fix the typecheck error I just got: Property 'add' does not exist on type 'Map<number, Task>'`

Copilot proposes restoring `store.set(...)`. Accept, re-run `npm run typecheck && npm test` → green.

## 2.4 — `/doc` (2 min)

Open `src/types.ts`. Select the `Task` interface. Type:

> **Prompt:** `/doc add a one-line TSDoc comment for each field`

Copilot inserts field-level TSDoc inline. Accept.

## 2.5 — Commit (2 min)

```bash
git add -A
git commit -m "feat: add tests for completeTask, document Task interface"
```

> ⏸ **Checkpoint:** at least 5 passing tests, `Task` interface documented.

---

# ⏱ Part 3 — Build a Skill from scratch  (25 min)

**Goal:** ship a working skill that everyone can invoke as `/new-action`.

The skill we're building: **new-action** — scaffolds a new typed action function with a matching Vitest test, following the repo's kebab-case + camelCase conventions.

## 3.1 — Create the skill folder (2 min)

```bash
mkdir -p .github/skills/new-action
```

## 3.2 — Author SKILL.md (10 min)

**File:** `.github/skills/new-action/SKILL.md`

````markdown
---
name: new-action
description: |
  Scaffold a new typed action function for the tasks-api repo.
  Use when the user says "add an action", "scaffold a function for X",
  or describes a new behavior over the task store
  (e.g. "search by keyword", "count open tasks", "next due").
license: MIT
---

# new-action · scaffold a new typed action

When invoked, follow these steps **in order**:

1. Extract a **kebab-case slug** from the user's request
   (e.g. "search by keyword" → `search-by-keyword`).
   Ask the user to confirm the slug if it's ambiguous.

2. Derive the camelCase function name from the slug
   (`search-by-keyword` → `searchByKeyword`).

3. Create the action file: `src/actions/<slug>.ts` with this template:

   ```ts
   import { type Task } from '../types';
   import { listTasks } from '../tasks';

   /**
    * TODO: implement <slug>.
    * @param input describe inputs here
    */
   export function <camelCaseName>(/* TODO inputs */): Task[] {
     // TODO: implement using listTasks() and Task[] filtering/sorting.
     throw new Error('not implemented');
   }
   ```

4. Create the matching test file: `tests/actions/<slug>.test.ts` with:

   ```ts
   import { beforeEach, describe, expect, it } from 'vitest';

   import { <camelCaseName> } from '../../src/actions/<slug>';
   import { _resetStore, createTask } from '../../src/tasks';

   beforeEach(() => {
     _resetStore();
   });

   describe('<camelCaseName>', () => {
     it.todo('implement at least one assertion');
   });
   ```

5. **Do not** modify `src/tasks.ts`, `src/types.ts`, or `src/index.ts`.
6. **Do not** implement the function — leave the TODO. The human writes
   the body, optionally with Copilot's help.
7. End your response with the two file paths you created and one line
   stating "next step: implement the TODO in `src/actions/<slug>.ts`".

## Style rules

- Filenames: kebab-case (`<slug>`).
- Function names: camelCase derived from the slug.
- Always import the `Task` type and `listTasks` (the action will need them).
- Always add a TSDoc block on the exported function.
````

## 3.3 — Reload skills and invoke (5 min)

In VS Code, reload the window so Copilot picks up the new skill:
`Ctrl+Shift+P → Developer: Reload Window`.

Then in Copilot Chat:

> **Prompt:** `/skills`

A skills menu opens. Verify `new-action` appears as **enabled**. If not, click to enable it.

Then run the skill explicitly:

> **Prompt:** `/new-action add an action that searches tasks by a keyword in the title (case-insensitive)`

Copilot should:

1. Pick the slug `search-by-keyword`
2. Create `src/actions/search-by-keyword.ts`
3. Create `tests/actions/search-by-keyword.test.ts`
4. Report both file paths

Open `src/actions/search-by-keyword.ts` and verify the template was used.
**Fill in the TODO** (this is a great moment to ask the room for the implementation):

```ts
import { type Task } from '../types';
import { listTasks } from '../tasks';

/**
 * Return tasks whose title contains `keyword`, case-insensitive.
 * @param keyword substring to look for
 */
export function searchByKeyword(keyword: string): Task[] {
  const needle = keyword.trim().toLowerCase();
  if (!needle) return [];
  return listTasks().filter((t) => t.title.toLowerCase().includes(needle));
}
```

Then fill in the test:

```ts
import { beforeEach, describe, expect, it } from 'vitest';

import { searchByKeyword } from '../../src/actions/search-by-keyword';
import { _resetStore, createTask } from '../../src/tasks';

beforeEach(() => {
  _resetStore();
});

describe('searchByKeyword', () => {
  it('matches a title case-insensitively', () => {
    createTask('Buy milk');
    createTask('Ship release');
    expect(searchByKeyword('MILK').map((t) => t.title)).toEqual(['Buy milk']);
  });

  it('returns [] for empty or whitespace-only keyword', () => {
    createTask('whatever');
    expect(searchByKeyword('   ')).toEqual([]);
  });
});
```

Run `npm test` — should now show **at least 7 passing tests** (3 baseline + 2 from Part 1/2 + 2 new).

## 3.4 — Commit (3 min)

```bash
git add .github/skills/new-action src/actions tests/actions
git commit -m "feat: add new-action skill and search-by-keyword action"
```

> ⏸ **Checkpoint:** `/new-action` works, new files exist, tests pass.

---

# ⏱ Part 4 — Build a Custom Agent  (25 min)

**Goal:** create a read-only `reviewer` agent and invoke it on the diff we just made.

## 4.1 — Create the agents folder (1 min)

```bash
mkdir -p .github/agents
```

## 4.2 — Author the agent file (12 min)

**File:** `.github/agents/reviewer.agent.md`

```markdown
---
name: reviewer
description: |
  Reviews TypeScript pull requests and uncommitted changes for the
  tasks-api repo. Focuses on correctness, conventions, and dangerous
  patterns. Strictly read-only — never edits files.
tools:
  - view
  - grep
  - glob
target: github-copilot
---

# Reviewer · tasks-api

You are a senior TypeScript reviewer for the `tasks-api` repository.

## What you check, in order

1. **Conventions** (from `.github/copilot-instructions.md`):
   - camelCase functions, PascalCase types, kebab-case filenames
   - explicit return types on exported functions
   - no `any`, no `console.log` in `src/`
   - errors subclass `TaskError`
   - imports use relative paths

2. **Correctness**:
   - Strict null handling (no non-null `!` without justification).
   - Immutability: prefer `readonly` properties and spread updates.
   - `Map` / `Set` usage: correct method names (`.set`, `.get`, `.has`).
   - Exhaustive type narrowing in `switch` over union types.

3. **Dangerous patterns**:
   - `eval`, `Function(...)`, `process.exit` in `src/`.
   - `// @ts-ignore`, `// @ts-expect-error` without an issue link.
   - `rm -rf`, `git push --force`, `--no-verify` mentioned anywhere.

## Output format — always

Emit a Markdown table:

| File | Line | Severity | Finding | Suggested fix |
|------|------|----------|---------|---------------|

Severity: `critical` · `high` · `low`.

End with a verdict line:

- ✅ **No blocking issues** — if you found nothing critical or high.
- 🛑 **Blocking issues found** — if there is at least one critical or high.

## Hard rules

- You are **read-only**. You have no `edit`, `create`, or `bash` tool.
- Never propose a patch — only describe the fix in the "Suggested fix" column.
- Never approve or merge anything.
```

## 4.3 — Invoke the agent (8 min)

In Copilot Chat, switch to the agent picker (the dropdown at the top of the chat panel) and select **reviewer**. Then ask:

> **Prompt:** `Review the changes since the previous commit. Focus on src/actions/search-by-keyword.ts and the new-action skill.`

Copilot should respond with the reviewer's table format. Likely findings on this commit:

- The action correctly uses `Task[]` as return type.
- The action does **not** use `console.log` → ✓.
- The test file uses the `beforeEach` reset pattern → ✓.

If the reviewer flags anything legitimate, **fix it inline**, re-run, and confirm the verdict flips to ✅.

## 4.4 — Commit (4 min)

```bash
git add .github/agents/reviewer.agent.md
git commit -m "feat: add read-only reviewer agent"
```

> ⏸ **Checkpoint:** the reviewer agent runs, produces a markdown table, and reaches a verdict.

---

# ⏱ Part 5 — Wire a Security Hook  (20 min)

**Goal:** make Copilot refuse to run `rm -rf`, force-pushes, and `--no-verify` via a `preToolUse` hook.

## 5.1 — Create the hook directories (1 min)

```bash
mkdir -p .github/hooks/scripts
```

## 5.2 — Author the hook config (4 min)

**File:** `.github/hooks/security.json`

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "matcher": "bash",
        "bash": "./.github/hooks/scripts/deny-dangerous.sh",
        "timeoutSec": 5
      },
      {
        "type": "command",
        "matcher": "powershell",
        "powershell": "powershell -File ./.github/hooks/scripts/deny-dangerous.ps1",
        "timeoutSec": 5
      }
    ]
  }
}
```

## 5.3 — Author the bash gate (5 min)

**File:** `.github/hooks/scripts/deny-dangerous.sh`

```bash
#!/usr/bin/env bash
# preToolUse hook · denies destructive shell commands.

set -u
input=$(cat)
cmd=$(printf '%s' "$input" | grep -oE '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | sed -E 's/.*"command"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/')

deny() {
  reason=$1
  cat <<EOF
{
  "permissionDecision": "deny",
  "permissionDecisionReason": "$reason"
}
EOF
  exit 0
}

case "$cmd" in
  *"rm -rf"*)              deny "Policy: rm -rf is blocked." ;;
  *"git push --force"*)    deny "Policy: force push is blocked." ;;
  *"git push -f"*)         deny "Policy: force push is blocked." ;;
  *"git reset --hard"*)    deny "Policy: hard reset is blocked." ;;
  *"--no-verify"*)         deny "Policy: bypassing git hooks is blocked." ;;
  *"npm publish"*)         deny "Policy: npm publish is blocked from the agent." ;;
esac

# Allow everything else by emitting an explicit allow.
echo '{"permissionDecision":"allow"}'
```

Make it executable (mac/linux):

```bash
chmod +x .github/hooks/scripts/deny-dangerous.sh
```

## 5.4 — Author the powershell gate (3 min)

**File:** `.github/hooks/scripts/deny-dangerous.ps1`

```powershell
# preToolUse hook · denies destructive shell commands (Windows).
$payload = [Console]::In.ReadToEnd() | ConvertFrom-Json
$cmd = ""
if ($payload.toolArgs.command) { $cmd = $payload.toolArgs.command }

function Deny($reason) {
  @{ permissionDecision = "deny"; permissionDecisionReason = $reason } |
    ConvertTo-Json -Compress
  exit 0
}

switch -Wildcard ($cmd) {
  "*Remove-Item -Recurse -Force*" { Deny "Policy: recursive force-delete is blocked." }
  "*rm -rf*"                       { Deny "Policy: rm -rf is blocked." }
  "*git push --force*"             { Deny "Policy: force push is blocked." }
  "*git push -f*"                  { Deny "Policy: force push is blocked." }
  "*git reset --hard*"             { Deny "Policy: hard reset is blocked." }
  "*--no-verify*"                  { Deny "Policy: bypassing git hooks is blocked." }
  "*npm publish*"                  { Deny "Policy: npm publish is blocked from the agent." }
}

@{ permissionDecision = "allow" } | ConvertTo-Json -Compress
```

## 5.5 — Manually verify the hook script (3 min)

Test the script with a fake payload before relying on Copilot.

On macOS / Linux / Git Bash:

```bash
# Should print deny:
echo '{"toolArgs":{"command":"rm -rf /"}}' | ./.github/hooks/scripts/deny-dangerous.sh

# Should print allow:
echo '{"toolArgs":{"command":"ls"}}' | ./.github/hooks/scripts/deny-dangerous.sh
```

On Windows PowerShell:

```powershell
'{"toolArgs":{"command":"rm -rf /"}}' | powershell -File .\.github\hooks\scripts\deny-dangerous.ps1
'{"toolArgs":{"command":"ls"}}'       | powershell -File .\.github\hooks\scripts\deny-dangerous.ps1
```

Expected first output: `"permissionDecision": "deny"`.
Expected second output: `"permissionDecision": "allow"`.

## 5.6 — Trigger it through Copilot (2 min)

Restart VS Code (hooks are picked up at session start). Open Copilot Chat in **agent mode** and ask:

> **Prompt:** `clean up the project by running rm -rf node_modules && rm -rf coverage`

Expected behavior: agent attempts the shell call → hook returns `deny` → chat shows *"Policy: rm -rf is blocked."* No deletion happens.

> 🎤 *Facilitator narration:* "This isn't a feature of Copilot — this is our policy file. We could deny anything: production URLs, sudo, `kubectl apply` in a prod context, you name it."

## 5.7 — Commit (2 min)

```bash
git add .github/hooks
git commit -m "feat: add preToolUse security hook (deny rm -rf, force push, --no-verify, npm publish)"
```

> ⏸ **Checkpoint:** Copilot refuses the `rm -rf` command with our exact reason string.

---

# ⏱ Part 6 — Orchestration demo + wrap-up  (10 min)

**Goal:** show how a *supervisor* agent delegates to specialists. Demo only — too long to live-author. Files below are pre-built; paste them in.

## 6.1 — Add the test-writer agent (2 min)

**File:** `.github/agents/test-writer.agent.md`

```markdown
---
name: test-writer
description: |
  Writes Vitest tests for a target file in the tasks-api repo.
  Respects the conventions from .github/instructions/tests.instructions.md.
tools:
  - view
  - grep
  - glob
  - create
  - edit
target: github-copilot
---

# Test-writer · tasks-api

When invoked with a target file (e.g. "write tests for src/tasks.ts"):

1. Read the target file and `tests/tasks.test.ts` for context and fixture usage.
2. Identify untested exported functions.
3. Append new tests to `tests/<module>.test.ts` (create the file if missing,
   mirroring the source path under `tests/`).
4. Always import `_resetStore` and call it in `beforeEach`.
5. Use `it.each([...])` when relevant.
6. End by listing the new test names.

Never modify files in `src/`. Never delete existing tests.
```

## 6.2 — Add the supervisor agent (2 min)

**File:** `.github/agents/supervisor.agent.md`

```markdown
---
name: supervisor
description: |
  Plans multi-step tasks for the tasks-api repo and delegates to
  the right specialist agent. Does not write code itself.
tools:
  - task
  - view
  - glob
  - grep
target: github-copilot
---

# Supervisor · tasks-api

You are a coordinator. You **never** edit code yourself.

## Routing table

| Intent                                          | Delegate to    |
|-------------------------------------------------|----------------|
| "review", "check", "audit"                      | `reviewer`     |
| "add tests", "increase coverage", "tests for X" | `test-writer`  |
| Anything else                                   | Ask the user.  |

## Workflow

1. Identify one primary intent from the user's request.
2. Use the `task` tool to invoke the matching specialist with a focused brief.
3. After the specialist returns, inspect its output. If incomplete, re-invoke
   it once with a clarifying brief. Stop after at most two iterations.
4. Emit a final summary: who did what, what file paths changed, what's left
   for the human.

Never call more than two specialists in one turn unless the user asked you to.
```

## 6.3 — Add the orchestration audit hook (2 min)

**File:** `.github/hooks/orchestration.json`

```json
{
  "version": 1,
  "hooks": {
    "subagentStart": [
      {
        "type": "command",
        "bash": "echo \"[orchestration] subagent started\" >> .copilot-audit.log",
        "powershell": "Add-Content -Path .copilot-audit.log -Value '[orchestration] subagent started'"
      }
    ],
    "subagentStop": [
      {
        "type": "command",
        "bash": "echo \"[orchestration] subagent finished\" >> .copilot-audit.log",
        "powershell": "Add-Content -Path .copilot-audit.log -Value '[orchestration] subagent finished'"
      }
    ]
  }
}
```

Add `.copilot-audit.log` to `.gitignore`:

```bash
echo ".copilot-audit.log" >> .gitignore
```

## 6.4 — Demo the orchestration (3 min)

Switch to the **supervisor** agent. Ask:

> **Prompt:** `Please add tests for src/actions/search-by-keyword.ts and then review the result.`

Expected sequence (visible in chat):

1. Supervisor announces it will delegate to `test-writer`.
2. `test-writer` appends to `tests/actions/search-by-keyword.test.ts`.
3. Supervisor delegates to `reviewer`.
4. `reviewer` produces its table → verdict.
5. Supervisor summarises both outputs.

Check the audit log:

```bash
cat .copilot-audit.log
```

You should see two `subagent started` / `subagent finished` lines for each specialist.

Run `npm test && npm run typecheck` — everything should still pass.

## 6.5 — Commit & close (1 min)

```bash
git add .github/agents/test-writer.agent.md .github/agents/supervisor.agent.md \
        .github/hooks/orchestration.json .gitignore tests/
git commit -m "feat: orchestration — supervisor delegates to test-writer + reviewer"
```

Show the final `git log --oneline` — seven commits, each representing one Copilot primitive:

```
feat: orchestration — supervisor delegates to test-writer + reviewer
feat: add preToolUse security hook (deny rm -rf, force push, --no-verify, npm publish)
feat: add read-only reviewer agent
feat: add new-action skill and search-by-keyword action
feat: add tests for completeTask, document Task interface
feat: add path-scoped test instructions + one test
chore: initial project (tasks-api playground, TypeScript)
```

---

# 🎓 Take-aways (the 5 things to remember)

1. **Instructions** ride along automatically. Author one `copilot-instructions.md` per repo and one `AGENTS.md` for agent mode. Path-scoped rules sharpen the focus.
2. **Skills** = a folder with one `SKILL.md`. The `description` field is the matcher — be specific.
3. **Custom agents** = a `.agent.md` file with a `tools:` allowlist. Read-only by default; grant `edit`/`bash` only when needed.
4. **Hooks** are the only enforcement seam. `preToolUse` can deny dangerous commands; test the script before trusting it.
5. **Orchestration** = a supervisor agent that owns the `task` tool. Specialists carry the smallest tool sets they need.

---

# 📦 Homework (1 PR per attendee, within 1 week)

Pick **one** of:

- Replace the `new-action` skill with one specific to your team's stack (`new-endpoint` for an Express route, `new-component` for a React component, etc.).
- Add a `commit-message` skill that drafts a conventional-commit message from the current `git diff --staged`.
- Add a new agent: `migrator` that converts a sample function from callback-style to async/await.
- Extend the security hook with one rule that makes sense for your stack
  (e.g. block `kubectl apply` against a prod context, or `npm install <pkg>` without a PR).

Open a PR titled `[copilot-training] <your-name>`. Tag the facilitator.

---

# 🆘 If a step fails — quick triage

| Symptom                              | Fix                                                                  |
|--------------------------------------|----------------------------------------------------------------------|
| `npm test` shows 0 tests             | Run from the repo root. Verify `vitest.config.ts` is at the root.    |
| `Cannot find module 'vitest'`        | Re-run `npm install`. Confirm `node --version` ≥ 20.                 |
| `/new-action` not in `/skills`       | Reload VS Code window (`Ctrl+Shift+P → Reload Window`).              |
| Custom agent missing from picker     | Same — reload window. Ensure `target: github-copilot` is set.        |
| Hook never fires                     | Verify the JSON parses (`node -e "JSON.parse(require('fs').readFileSync('.github/hooks/security.json','utf8'))"`) and reload window. |
| Hook script gets `permission denied` | `chmod +x` on the script.                                            |
| Reviewer agent tries to edit         | Remove `edit` / `create` from its `tools:` list. Re-test.            |

---

*End of session. Time to push the branch and pour a coffee.*
