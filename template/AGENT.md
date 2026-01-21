# Agent Instructions

## Project Overview

This is a Ralph-style autonomous agent task. The AI directly performs operations without necessarily writing code - it uses its tools to accomplish tasks.

## Task Type

**Direct Execution** - The AI reads specifications, performs operations, and completes tasks directly using its available tools.

## Key Learnings

- Update this section when you discover new patterns or optimizations
- Document any edge cases encountered
- Keep track of successful strategies

## Quality Standards

### Task Completion Requirements

- **Accuracy**: All operations must produce correct results
- **Completeness**: Every task in fix_plan.md must be addressed
- **Validation**: Verify outputs match expected results before marking tasks complete

### Ralph Integration

- Check @fix_plan.md for current tasks before starting work
- Mark items complete in @fix_plan.md upon completion
- Read @specs/ folder for detailed task specifications
- Follow instructions in @PROMPT.md for the autonomous loop

## Task Completion Checklist

Before marking ANY task as complete, verify:

- [ ] Task requirements understood from specs
- [ ] Operation performed correctly
- [ ] Output/result matches expected value
- [ ] @fix_plan.md task marked as complete

## Workflow

1. Read @PROMPT.md for instructions
2. Check @fix_plan.md for pending tasks
3. Read @specs/ for task details
4. Execute tasks using available tools
5. Update @fix_plan.md upon completion
6. Report status at end of loop
