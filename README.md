# Ralph Template

[![npm version](https://img.shields.io/npm/v/ralph-template.svg)](https://www.npmjs.com/package/ralph-template)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Run long AI task lists without context pollution.**

Define tasks in markdown. Ralph runs them one at a time with fresh context, so your agent stays reliable even on task #50.

Works with [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and [OpenCode](https://github.com/sst/opencode).

![Ralph](assets/ralph.jpg)

## Why Ralph?

AI agents get confused in long conversations. Old instructions pile up, outputs from earlier tasks leak into later ones, and by task #15, your agent is hallucinating.

Ralph fixes this with one dumb trick: **fresh context every task.**

- One task runs, agent exits
- Next iteration starts clean
- No accumulated confusion
- Predictable behavior on task #1 and task #100

## Quick Start

```bash
npx ralph-template my-project
cd my-project
npm start
```

## Requirements

- Node.js 14+
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) or [OpenCode](https://github.com/sst/opencode)



---

## What's inside

- **`specs/`** — where you describe what needs to be done
- **`fix_plan.md`** — a checklist of tasks for the AI to complete
- **`run.sh`** — runs a loop that has the AI complete tasks one at a time
- **`scripts/`** — helper scripts (output parser for colorized Claude output)

The AI reads your specs, goes through the checklist, and marks each task done.

---

## How to use

### 1. Create a project

```bash
npx ralph-template my-project
cd my-project
```

### 2. Write a spec

Create a file in `specs/` that explains what you want. Describe inputs, outputs, and what the AI should do.

### 3. Add tasks

Open `fix_plan.md` and add tasks under `## High Priority`:

```markdown
- [ ] Read input.txt, do X, write to output.txt
- [ ] Read data.json, do Y, write to result.json
```

Keep tasks specific. One task = one thing.

### 4. Run

```bash
npm start               # Claude Code (default, colorized output)
npm run opencode        # OpenCode
npm run start:raw       # Raw JSON output (no parsing)
```

Or use the shell script directly for more control:

```bash
./run.sh claude 10      # Run up to 10 iterations
./run.sh claude 5 --raw # Raw JSON output (no parsing)
```

The AI goes through your tasks one by one until everything is done. With Claude, you get colorized, human-readable output showing exactly what the AI is doing.

---

## Try the example

There's a working example in `examples/multiplication/`. It multiplies numbers from input files and writes the results.

```bash
cd examples/multiplication
npm start
```

Check the results:

```bash
cat output/001.txt  # 15
cat output/002.txt  # 28
cat output/003.txt  # 20
```

Look at the files in that folder to see how specs and tasks are set up.
