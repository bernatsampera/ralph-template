# Ralph Blueprint

Ralph is an autonomous agent loop that executes tasks one at a time using fresh context per iteration.

## File Reference

| File | Purpose |
|------|---------|
| `AGENT.md` | Project configuration: structure, commands, quality standards |
| `fix_plan.md` | Task checklist with priorities and categories |
| `specs/` | Detailed specifications for each task |
| `PROMPT.md` | Ralph loop logic (rarely needs changes) |

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

---

## specs/ - Task Specifications

Each spec file contains details for a specific task or feature.

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

## PROMPT.md - Ralph Logic

Controls the iteration loop, status reporting, and exit criteria. Rarely needs modification.

**What it defines:**
- One task per iteration workflow
- RALPH_STATUS block format
- Exit triggers and completion criteria
- Constraints to prevent infinite loops

---

## Quick Start

1. Copy `ralph-template/` to your project
2. Add to `.gitignore` (optional)
3. Configure `AGENT.md` for your project
4. Write specs in `specs/`
5. Add tasks to `fix_plan.md`
6. Run `./run.sh claude`

## Running Commands

```bash
./run.sh claude         # Run with Claude Code (default 5 iterations)
./run.sh claude 10      # Run up to 10 iterations
./run.sh claude 5 --raw # Raw JSON output
./run.sh opencode       # Use OpenCode instead
```

## Requirements

- Claude Code or OpenCode CLI installed
