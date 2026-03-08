# Ralph Execution Mode

## CRITICAL: ONE TASK = ONE ITERATION = ONE RESPONSE

**STOP AFTER COMPLETING ONE TASK.** This is the most important rule.

- **One iteration** = One invocation of the agent = One response from you
- After completing ONE task, you MUST output the RALPH_STATUS block and **END YOUR RESPONSE IMMEDIATELY**
- Do NOT continue to the next task. The next task will be handled in a NEW iteration
- Completing multiple tasks in a single response is a **PROTOCOL VIOLATION**

---

## Your Task

Read `ralph.md` and execute the FIRST unchecked task (`- [ ]`).

### Workflow

1. **Read ralph.md**: Find the first unchecked task
2. **Read the task's input files**: The `Read:` field tells you which files to study
3. **Execute**: Do exactly what the `Do:` field says — no more, no less
4. **Verify**: Check the `Done when:` criteria before marking complete
5. **Update ralph.md**: Mark the task `[x]`
6. **Report status and STOP**: Output RALPH_STATUS block and end your response

**HARD STOP**: After step 6, your response MUST end. Do NOT continue to the next task.

## Iteration Scope

Each iteration handles ONE task from ralph.md. The task's structured fields define exactly:
- **Read**: What files to study before starting
- **Do**: What to implement
- **Output**: What to produce
- **Done when**: How to verify completion

Follow these fields precisely. Do not expand scope beyond what the task specifies.

## Exit Criteria

Set EXIT_SIGNAL to **true** ONLY when ALL tasks in ralph.md are marked complete.

## Status Reporting (CRITICAL)

At the end of each iteration, ALWAYS output this block.
**After outputting this block, YOUR RESPONSE MUST END.**

```
---RALPH_STATUS---
STATUS: IN_PROGRESS | COMPLETE | BLOCKED
TASK_COMPLETED: <task title> | none
TASKS_REMAINING: <number>
FILES_MODIFIED: <number>
ERRORS: [list or "none"]
EXIT_SIGNAL: false | true
RECOMMENDATION: <one line next step>
---END_RALPH_STATUS---
```

## Hard Stop Rule (MANDATORY)

When you complete a task and output the RALPH_STATUS block:

1. **YOUR RESPONSE ENDS HERE** — Do not write any more text
2. **DO NOT START THE NEXT TASK** — That happens in a new iteration
3. **DO NOT ADD COMMENTARY** — No "now let's continue" or similar
4. **THE STATUS BLOCK IS THE LAST THING YOU OUTPUT**

## Constraints

- Do NOT skip tasks — complete them in order
- Do NOT mark tasks complete without verifying the `Done when:` criteria
- Do NOT expand scope beyond what each task specifies
- ALWAYS include the RALPH_STATUS block
