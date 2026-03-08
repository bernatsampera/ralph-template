# Ralph Rethink

## Problem 1: Setup is too heavy

**What hurts:** Every time you want to use Ralph, you run `npx ralph-template ralph`, which scaffolds a full directory with `package.json`, `run.sh`, `PROMPT.md`, `AGENT.md`, `README.md`, scripts, etc. Then you `cd` into it, then `npm start`. That's a lot of ceremony for what is essentially "run a checklist of tasks."

**Why it happens:** Ralph was built as a standalone project scaffold. It copies a template directory with all the machinery needed to run the loop. This made sense early on but creates friction for repeated use — especially when you just want to bolt Ralph onto an existing project quickly.

### Solutions

**A. Single config file instead of a directory**
Ralph becomes a single file (e.g. `ralph.yaml` or `ralph.md`) at the project root. It contains the task list, agent instructions, and any specs inline or as references to existing project files. No scaffolding step — you create one file (or the AI creates it) and run `npx ralph run`. The tool reads that file and starts the loop.

**B. Global CLI install with `init` subcommand**
Install Ralph globally (`npm i -g ralph-cli`). Use `ralph init` to drop a minimal config into the current directory (just `ralph.md` or `.ralph/`). Use `ralph run` to start. No `cd`, no nested directory, no `package.json` inside the project. Recipes become flags: `ralph init --recipe llms-txt`.

**C. Inline mode — no files at all**
Ralph runs entirely from the command line: `ralph "Refactor the auth module into separate files"`. It generates the plan internally, shows it to you for approval, then executes. No files on disk except what the tasks produce. The plan lives in Ralph's memory, not in a markdown file. Good for one-off tasks; saved plans become an optional feature.

---

## Problem 2: The AI doesn't respect plan vs execute boundaries

**What hurts:** During setup, you want the AI to *only* create `fix_plan.md` and specs. But despite bold warnings in the README ("Do NOT execute any tasks"), the AI frequently starts implementing tasks right away. You've tried stronger prompting — it doesn't stick reliably.

**Why it happens:** Plan creation and task execution happen in the same conversational context, using the same AI session. The AI sees the codebase, sees what needs to be done, and its instinct is to do it. Prompting can't fully override this — it's fighting the model's nature. The README instructions are just text; there's no structural enforcement.

### Solutions

**A. Structural separation — two distinct tools/commands**
Make planning and execution *physically separate commands* that can't bleed into each other:
- `ralph plan "your goal here"` — launches the AI in a constrained mode that can ONLY write to the plan file and specs. It literally has no write access to anything else. The tool enforces the boundary, not the prompt.
- `ralph run` — executes the plan. Different invocation, different permissions.

The key insight: don't ask the AI to restrain itself. Restrict what tools it has access to.

**B. Human-written plans, AI-executed**
Remove the AI from the planning phase entirely. The human writes `fix_plan.md` (or a simpler format) manually. Ralph's value becomes pure execution — reliable, one-task-at-a-time completion of a human-defined checklist. This sidesteps the problem completely: if the AI never sees the planning phase, it can't get confused.

Optionally, offer a `ralph suggest` command that proposes a plan the human can edit before approving — but the AI never auto-creates the final plan.

**C. Approval gate between phases**
The AI creates the plan, then Ralph *halts and shows the plan to the user*. The user reviews, edits if needed, and explicitly approves (`ralph approve` or pressing Enter). Only after approval does Ralph switch to execution mode. The critical difference from today: the planning AI session ends completely before execution begins. No shared context. The execution phase starts fresh, seeing only the approved plan.

---

## Problem 3: Task definitions are too vague

**What hurts:** Tasks in `fix_plan.md` are free-form checkbox items like `- [ ] Refactor auth module`. There's no structure for: what files to read, what to produce, what counts as done. This leads to the AI misinterpreting scope — doing too much, too little, or the wrong thing entirely.

**Why it happens:** The format is just markdown checkboxes. There's no schema, no required fields, no convention for what a well-formed task looks like. The AI generates tasks in whatever style it wants, and later (in execution) a different AI invocation has to interpret them with minimal context.

### Solutions

**A. Structured task format with required fields**
Define a lightweight schema for tasks. Each task must include specific fields — e.g., a description, input files, expected output, and a done-condition. Still in markdown, but with a clear convention:

```
- [ ] **Refactor auth module**
  - Read: `src/auth/login.js`, `src/auth/session.js`
  - Do: Split into `authenticate()`, `authorize()`, `refreshToken()`
  - Output: Modified files in `src/auth/`
  - Done when: All three functions exist and tests pass
```

Ralph validates this structure before running. Malformed tasks get flagged.

**B. One task = one spec file**
Instead of cramming everything into checkbox text, each task in `fix_plan.md` is just a reference: `- [ ] See specs/003-refactor-auth.md`. The spec file has all the detail — context, files to read, what to do, acceptance criteria. The checkbox is just a pointer and a status tracker. This keeps the plan scannable while giving each task rich context.

**C. Task templates per recipe**
Each recipe defines a task template — a fill-in-the-blanks structure that the planning AI must follow. For example, an `llms-txt` recipe might define that every task must specify: target directory, files to analyze, and output file path. The template constrains the AI during planning, so it can't produce vague tasks. Generic (non-recipe) usage gets a default template with minimal required fields.
