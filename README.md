
# Ralph

AI agent loop. Each task runs in a fresh invocation — no context pollution.

https://github.com/user-attachments/assets/a13c7307-2504-4bb7-82cc-b658d9f9acc0

## Install

```bash
npm install -g ralphmd
```

## Getting Started

1. **Initialize** — drop a config file in your project:

```bash
cd your-project
ralphmd init
```

2. **Plan** — describe what you want and the AI creates structured tasks:

```bash
ralphmd plan "Refactor the auth module into separate files"
```

3. **Run** — execute tasks one at a time in fresh AI invocations:

```bash
ralphmd run
```

Open `ralph.md` to watch tasks get checked off as they complete. That's it — no directory scaffolding, no scripts, no boilerplate.

## How It Works

### 1. Init — drop a config file

```bash
ralphmd init
ralphmd init --recipe llms-txt
```

Creates a single `ralph.md` file in your project root. No subdirectory, no `package.json`, no scripts.

### 2. Plan — AI creates structured tasks (planning only)

```bash
ralphmd plan "Add error handling to all API endpoints"
```

The AI analyzes your codebase and populates `ralph.md` with structured tasks. It runs in **restricted mode** — it can only read your code and write to `ralph.md`. No Bash, no Edit, no file modifications. The boundary between planning and execution is enforced structurally, not by prompting.

### 3. Run — AI executes tasks one at a time

```bash
ralphmd run
ralphmd run --max 20
```

Ralph reads `ralph.md`, validates the task format, then executes tasks one per iteration in fresh AI invocations. Open `ralph.md` to watch tasks get checked off.

---

## Structured Task Format

Every task in `ralph.md` must follow this format:

```markdown
- [ ] **Task title**
  - Read: `src/auth/login.js`, `src/auth/session.js`
  - Do: Split into separate authenticate(), authorize(), refreshToken() functions
  - Output: Modified files in `src/auth/`
  - Done when: All three functions exist and tests pass
```

| Field | Required | Purpose |
|-------|----------|---------|
| **Title** | Yes | Bold, concise description |
| **Read** | Recommended | Files the AI should study before starting |
| **Do** | Yes | Specific instructions — unambiguous enough for a fresh AI session |
| **Output** | Recommended | What files or changes this task produces |
| **Done when** | Yes | Concrete acceptance criteria |

`ralphmd validate` checks this format before running. Malformed tasks are flagged.

## Recipes

Recipes are pre-packaged setups for common tasks.

```bash
ralphmd init --recipe llms-txt
ralphmd plan
```

Available recipes:

| Recipe | Description |
|--------|-------------|
| `llms-txt` | Add hierarchical llms.txt documentation to a project |
| `llms-txt-general` | Create hierarchical llms.txt documentation for any subject (website, book, API, docs, etc.) |
| `self-improve` | Analyze, evaluate, and implement clear-win improvements for any part of a project |

List all: `ralphmd list-recipes`

### Creating a recipe

```
recipes/my-recipe/
├── recipe.json          # name + description
├── instructions.md      # AI planning instructions (injected into ralph.md)
└── specs/               # reference files the AI needs
    └── my-guide.md
```

## Commands

```bash
ralphmd init [--recipe <name>]     # Create ralph.md in current directory
ralphmd plan "<goal>"              # AI creates tasks (restricted mode)
ralphmd run [--max <n>]            # Execute tasks one at a time
ralphmd validate                   # Check task format
ralphmd list-recipes               # Show available recipes
```
