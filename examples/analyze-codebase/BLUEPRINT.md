# Ralph Blueprint

Ralph is an autonomous agent loop that executes tasks one at a time using fresh context per iteration.

---

## STOP: YOUR ROLE IS PLANNING ONLY

You are being asked to **set up** Ralph, not to **run** it.

**Your job is to create configuration files. Nothing else.**

### What you MUST do:
1. Read the project's codebase to understand what needs to be done
2. Create tasks in `fix_plan.md` as checkbox items (`- [ ]`)
3. Create at most 1 spec file in `specs/` with context the tasks will need
4. Optionally update `AGENT.md` with project-specific configuration

### What you must NOT do:
- Execute, implement, or start working on any task listed in fix_plan.md
- Modify, fix, or change any files outside the ralph/ directory
- Run tests, build commands, or any project commands
- Run `npm start`, `./run.sh`, or trigger the Ralph loop
- Read or modify `PROMPT.md` (that file is for execution, not setup)

### Why this matters:
The tasks you write will be executed LATER by the Ralph loop (`npm start`), one task per iteration, with fresh AI context each time. Ralph exists specifically to prevent context degradation — if you execute tasks now in a long conversation, quality degrades after 15-20 tasks. **If you execute tasks during setup, you defeat Ralph's entire purpose.**

**After creating fix_plan.md (and optionally specs/ and AGENT.md), STOP. Your work is done.**

---

## File Reference

| File | Purpose | Setup role |
|------|---------|------------|
| `fix_plan.md` | Task checklist with priorities and categories | **Create/populate** |
| `specs/` | Detailed specifications for tasks | **Create at most 1 file** |
| `AGENT.md` | Project configuration: structure, commands, quality standards | **Optionally update** |
| `PROMPT.md` | Ralph loop logic (execution instructions) | **Do not touch** |

---

## fix_plan.md - Task Tracking

Tasks structured with checkboxes, ordered by priority, grouped into categories.

```markdown
# Fix Plan

## High Priority

### [Category Name]
- [ ] Task 1 description
- [ ] Task 2 description

### [Another Category]
- [ ] Task description

## Medium Priority
- [ ] Task description

## Low Priority
- [ ] Task description

## Completed
- [x] Completed task

## Notes
- Tasks are completed ONE at a time
- Be specific: describe exactly what to do
- Mark tasks complete with [x] after verification
```

### Writing good tasks:
- **Be specific**: "Read src/auth.js, find the JWT validation function, fix the expiry check" not "Fix auth"
- **One action per task**: Each checkbox = one Ralph iteration
- **Include file paths**: Tell the AI exactly which files to read and modify
- **Include verification**: How to confirm the task succeeded

---

## specs/ - Task Specifications

Create spec files when tasks need detailed context that does not fit in a checkbox description.

```markdown
# [Task Name] Spec

## Overview
[What needs to be done]

## Requirements
1. [Requirement 1]
2. [Requirement 2]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

---

## AGENT.md - Project Configuration

Contains repository config, available commands, and quality standards.

```markdown
# Agent Instructions

## Project Overview
[What this project does]

## Structure
[Key directories and their purpose]

## Commands
[Available commands to run]

## Quality Standards
[Validation requirements for this project]

## Task Completion Checklist
- [ ] Task requirements understood
- [ ] Operation performed correctly
- [ ] Output verified
- [ ] fix_plan.md updated
```

---

## PROMPT.md - Ralph Logic

Controls the iteration loop, status reporting, and exit criteria during execution.
**This file is used by `npm start`. Do not read or modify it during setup.**

---

## Setup Complete Checklist

Before you finish, verify:
- [ ] `fix_plan.md` has specific, actionable checkbox tasks (`- [ ]`)
- [ ] Each task describes exactly what to read, do, and write
- [ ] At most 1 spec file exists in `specs/` (if needed)
- [ ] No tasks have been executed — all checkboxes are still unchecked
- [ ] No files outside `ralph/` have been modified
- [ ] `PROMPT.md` has not been modified

**You are done. STOP HERE. The user will run `npm start` to execute the tasks.**
