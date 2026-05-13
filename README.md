# tasks-api · GitHub Copilot Hands-On (TypeScript)

Tiny TypeScript project used as the playground for the
**GitHub Copilot Customization & Orchestration** training.

## Prerequisites

- Node.js **>=20**
- VS Code with the **GitHub Copilot** and **GitHub Copilot Chat** extensions
- Signed into Copilot with your Sofrecom Business seat

## Setup (~30 seconds)

```bash
npm install
npm test
```

You should see **3 passing tests**. If you do, you're ready for the session.

## What's in here

```
tasks-api/
├── src/
│   ├── tasks.ts          # in-memory task store + public API
│   ├── types.ts          # Task interface, TaskError class
│   ├── index.ts          # barrel exports
│   └── actions/          # populated during the session by /new-action
├── tests/
│   └── tasks.test.ts     # 3 baseline tests
├── .github/
│   ├── copilot-instructions.md
│   └── instructions/     # populated during the session
├── AGENTS.md             # agent-mode guide
└── SESSION.md            # ← the 2-hour facilitator script
```

## The session

Open [SESSION.md](./SESSION.md) and follow it top to bottom. Each part has a
time budget, an exact prompt to type into Copilot, and the file you'll create.
