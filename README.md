
# Ralph

AI agent loop. Each task runs in a fresh invocation — no context pollution.

https://github.com/user-attachments/assets/a13c7307-2504-4bb7-82cc-b658d9f9acc0

## 1. Plan

```bash
npx ralph-template ralph
```

Then tell your AI what tasks to create:

```
Read ralph/blueprint.md and create a ralph setup for [YOUR GOAL].
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
| `BLUEPRINT.md` | What the AI reads during setup |

## Config Management

```bash
npm run ralph:save -- my-task     # save
npm run ralph:load -- my-task     # restore
npm run ralph:list                # list all
npm run ralph:new                 # reset to blank
```
