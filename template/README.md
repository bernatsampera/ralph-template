# Ralph

AI agent loop. Each task runs in a fresh invocation — no context pollution.

## 1. Plan

Tell your AI what tasks to create:

```
Read ralph/README.md and create a ralph setup for [YOUR GOAL].
[Describe what needs to be done.]
Do NOT execute any tasks — only create the plan files.
```

This populates `fix_plan.md` with checkbox tasks. That's it — **the AI must not run any task yet**.

## 2. Run

```bash
npm start 20
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

## Config Management

```bash
npm run ralph:save -- my-task     # save
npm run ralph:load -- my-task     # restore
npm run ralph:list                # list all
npm run ralph:new                 # reset to blank
```

---

<!-- Everything below is for the AI setting up Ralph, not for the human. -->

## AI Setup Instructions

**STOP: YOUR ROLE IS PLANNING ONLY.**

You are setting up Ralph, not running it. **Create configuration files. Nothing else.**

<!-- RECIPE_INSTRUCTIONS_START -->
### You MUST:
1. Read the project's codebase to understand what needs to be done
2. Create tasks in `fix_plan.md` as checkbox items (`- [ ]`)
3. Create at most 1 spec file in `specs/` with context the tasks will need
4. Optionally update `AGENT.md` with project-specific configuration
<!-- RECIPE_INSTRUCTIONS_END -->

### You must NOT:
- Execute, implement, or start working on any task in fix_plan.md
- Modify any files outside the ralph/ directory
- Run tests, builds, or any project commands
- Run `npm start` or `./run.sh`
- Read or modify `PROMPT.md`

### Why:
Tasks are executed LATER by `npm start`, one per iteration, with fresh context each time. If you execute them now, you defeat Ralph's entire purpose.

**After creating fix_plan.md, STOP. Your work is done.**

### Setup Checklist
- [ ] `fix_plan.md` has specific, actionable checkbox tasks
- [ ] Each task describes what to read, do, and write
- [ ] At most 1 spec file in `specs/`
- [ ] All checkboxes are still unchecked — no tasks executed
- [ ] No files outside `ralph/` modified
- [ ] `PROMPT.md` untouched
