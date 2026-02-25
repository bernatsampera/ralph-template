
# Ralph

AI agent loop. Each task runs in a fresh invocation — no context pollution.

https://github.com/user-attachments/assets/a13c7307-2504-4bb7-82cc-b658d9f9acc0

## 1. Plan

```bash
npx ralph-template ralph
```

Then tell your AI what tasks to create:

```
Read ralph/README.md and create a ralph setup for [YOUR GOAL].
[Describe what needs to be done.]
Do NOT execute any tasks — only create the plan files.
```

This populates `fix_plan.md` with checkbox tasks. That's it — **the AI must not run any task yet**.

## 2. Run

```bash
cd ralph && npm start 20
```

Ralph picks up tasks one by one, each in a fresh invocation. Open `fix_plan.md` to watch them get ticked off.

---

## Files

| File | Purpose |
|------|---------|
| `fix_plan.md` | Task checklist. One `- [ ]` = one iteration |
| `specs/` | Extra context for tasks that need it |
| `AGENT.md` | Project config and quality standards |
| `PROMPT.md` | Loop logic — **don't modify** |
| `README.md` | Setup instructions (for you and the AI) |

## Recipes

Recipes are pre-packaged setups for common tasks. Instead of manually writing specs and describing your goal each time, a recipe scaffolds ralph with everything pre-configured — specs, AI instructions, all of it.

### Using a recipe

```bash
npx ralph-template ralph --recipe llms-txt
```

This creates `ralph/` with the recipe's specs already in `specs/` and recipe-specific instructions baked into `README.md`. Then tell your AI:

```
Read ralph/README.md and create a plan. Do NOT execute any tasks.
```

The AI reads the README, sees the recipe instructions, analyzes your project, and creates `fix_plan.md`. You watch it work, then run `cd ralph && npm start 20`.

To see all available recipes:

```bash
npx ralph-template --list-recipes
```

### Available recipes

| Recipe | Description |
|--------|-------------|
| `llms-txt` | Add hierarchical llms.txt documentation to a project |
| `llms-txt-general` | Create hierarchical llms.txt documentation for any subject (website, book, API, docs, etc.) |
| `self-improve` | Analyze, evaluate, and implement clear-win improvements for any part of a project |

### Creating a new recipe

A recipe is a folder inside `recipes/` with this structure:

```
recipes/my-recipe/
├── recipe.json          # name + description
├── instructions.md      # AI planning instructions (injected into README)
└── specs/               # reference files the AI needs
    └── my-guide.md
```

**Step 1 — Create the folder:**

```bash
mkdir -p recipes/my-recipe/specs
```

**Step 2 — Add `recipe.json`** with a name and description:

```json
{
  "name": "my-recipe",
  "description": "Short description of what this recipe does"
}
```

**Step 3 — Add `instructions.md`** with AI planning instructions. This gets injected into the README's "AI Setup Instructions" section, telling the AI exactly what to plan. Example:

```markdown
### Recipe: My Recipe Name

Read `specs/my-guide.md` to understand the approach.

Analyze the project. Then create tasks in `fix_plan.md` to [describe the goal].

Each task should [describe the task granularity].
```

**Step 4 — Add spec files** to `specs/`. These are reference materials the AI reads while creating the plan (guides, conventions, examples).

**Step 5 (optional) — Add a custom `AGENT.md`** to override the default agent instructions for task execution.

**That's it.** Now `npx ralph-template ralph --recipe my-recipe` will scaffold ralph with your specs and instructions ready to go.

## Config Management

```bash
npm run ralph:save -- my-task     # save
npm run ralph:load -- my-task     # restore
npm run ralph:list                # list all
npm run ralph:new                 # reset to blank
```
