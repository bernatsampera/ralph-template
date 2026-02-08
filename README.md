# Ralph Template

<video src="assets/RalphVideo.mp4" poster="assets/ralph-thumbnail.jpg" controls width="100%"></video>

Ralph is an autonomous AI agent loop that executes tasks with fresh context. Each task runs in isolation, preventing context pollution that degrades AI performance in long conversations.

## The Problem Ralph Solves

In long AI conversations, agents lose reliability as old instructions and outputs accumulate. By task #15-20, agents become confused and forget original instructions. Ralph fixes this by running each task in a separate invocation with clean context.

## Quick Start

1. **Create Ralph folder in your project**
   ```bash
   npx ralph-template ralph
   cd ralph
   ```

2. **Exclude from git** (recommended)
   ```bash
   echo "ralph/" >> .git/info/exclude
   ```

3. **Set up your tasks** (see "Setting Up Ralph" section below)

Example prompt for claude code: ```Read ralph/blueprint.md and create a ralph setup for the following task bug_fix.md. In fix_plan.md create a section for each folder that needs to be fixed. Create two tasks for each section to fix the bugs. The first task will be to create a specs/folder_name/analyse.md witht he problem and a possible solution. Then the next task will be to read these file just generated and implement the solution. ```

4. **Run the loop**
   ```bash
   npm start 20
   ```
   The number `20` is the maximum iterations (optional, default is 5).

## Core Files

| File | Purpose |
|------|---------|
| `PROMPT.md` | Loop execution instructions. **Do not modify.** |
| `AGENT.md` | Project context, quality standards, and learnings |
| `fix_plan.md` | Task checklist. One checkbox = one iteration |
| `specs/` | Detailed specifications for complex tasks |

## Setting Up Ralph

The easiest way to set up Ralph is to ask Claude Code to generate the files for you. Give Claude a prompt that describes your goal and context.

### Prompt Template

```
Read ralph/blueprint.md to understand how Ralph works.
I want to create a ralph setup for [YOUR GOAL].

[DESCRIBE: files, directories, or problems to work on]

Create tasks in fix_plan.md for [specific objectives].
Add detailed specs in specs/ for each task type.
```

### Example Prompts

**Extracting endpoint information:**
```
Read ralph/blueprint.md. I want to create a ralph setup for extracting
information from @missing_endpoints.json. There is a guide in
ralph/specs/extract_plan.md showing what info is needed. Add tasks
in fix_plan to extract info for each endpoint.
```

**Improving tests:**
```
Read ralph/blueprint.md. I want to create a ralph loop to improve tests
in @test/migration/. Add in fix_plan.md an iterative process that
runs 5-6 iterations, writes findings, then starts a new loop based
on those findings.
```

**Analyzing and fixing errors:**
```
Read ralph/blueprint.md. I get 42 failed tests when running pnpm test.
Create a ralph loop to analyze each failing test. For each test,
create specs/test-name/ with problem.md and solution.md files.
Do not implement fixes during the loop, just document them.
```

**Code quality improvements:**
```
Read ralph/blueprint.md. Create a ralph setup for @docs/improvements.md
which has multiple sections. For each section: first create a task
to write a plan in specs/section_name/plan.md, then a task to
implement it, then a task to run tests.
```

**Multi-step analysis:**
```
Read ralph/blueprint.md. I want to create a ralph setup for src/steps/.
Create an initial task to understand the directory and write findings
to specs/context.md. Then for each step, add a task to analyze it
and write specs/step_name/details.md, followed by a task to
implement improvements.
```

## Best Practices

### Task Design
- **One task = one iteration** - Keep tasks atomic
- **Be specific** - Describe exactly what to read, do, and write
- **Include verification** - How to confirm the task succeeded
- **Use specs/** - Put complex details in spec files, not fix_plan.md

### Task Examples

Good:
```markdown
- [ ] Read config.json, extract the API endpoints, write to specs/endpoints.md
- [ ] Analyze src/auth.js for security issues, document in specs/auth-audit.md
- [ ] Run tests for user module, fix any failures, mark complete when passing
```

Bad:
```markdown
- [ ] Fix everything
- [ ] Improve the code
- [ ] Do the migration
```

### Iterative Patterns

For complex work, use iterative patterns:

```markdown
## Phase 1: Analysis
- [ ] Analyze component A, write findings to specs/a/analysis.md
- [ ] Analyze component B, write findings to specs/b/analysis.md

## Phase 2: Implementation
- [ ] Implement fixes for A based on specs/a/analysis.md
- [ ] Implement fixes for B based on specs/b/analysis.md

## Phase 3: Verification
- [ ] Run tests, document any failures in specs/test-results.md
- [ ] Fix failing tests based on specs/test-results.md
```

## Running Ralph

```bash
# Run with Claude Code (default)
npm start

# Or directly
./run.sh claude

# Specify max iterations
./run.sh claude 20
```

### Understanding Output

Each iteration ends with a status block:

```
---RALPH_STATUS---
STATUS: IN_PROGRESS | COMPLETE | BLOCKED
TASK_COMPLETED: <description>
TASKS_REMAINING: <number>
EXIT_SIGNAL: false | true
---END_RALPH_STATUS---
```

- **IN_PROGRESS**: More tasks remain
- **COMPLETE**: All tasks done, loop will exit
- **BLOCKED**: Needs human intervention

### When to Intervene

- `STATUS: BLOCKED` - Check the error and fix manually
- Tasks stuck in a loop - Clarify the spec or simplify the task
- Wrong output - Update specs/ with clearer instructions

## Configuration Management

Save and restore Ralph configurations:

```bash
# Save current setup
npm run ralph:save -- my-task

# List saved configurations
npm run ralph:list

# Load a saved configuration
npm run ralph:load -- my-task

# Reset to blank template
npm run ralph:new
```
