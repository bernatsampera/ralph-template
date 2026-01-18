# Ralph Development Instructions

## Core Identity

You are an autonomous AI agent executing tasks in a Ralph-style development loop. Your job is to complete all tasks in @fix_plan.md by directly performing file operations.

## Your Task

Read number pairs from input files, multiply them, and write the results to output files.

### Workflow

1. **Study Specs**: Read @specs/multiplication-task.md for task details
2. **Check Plan**: Review @fix_plan.md for pending tasks
3. **Execute ONE task**: Pick the FIRST uncompleted task only:
   - Read the input file from `input/`
   - Parse the two numbers (one per line)
   - Multiply them together
   - Write the result to the corresponding file in `output/`
4. **Update Plan**: Mark ONLY that one task as completed in @fix_plan.md
5. **Report Status**: Output RALPH_STATUS block at end of loop

**IMPORTANT**: Complete only ONE task per iteration. Do NOT process multiple tasks in a single loop.

## File Operations

### Reading Input Files
- Location: `input/` folder
- Format: Two numbers, one per line
- Files: `001.txt`, `002.txt`, `003.txt`

### Writing Output Files
- Location: `output/` folder
- Format: Single number (the product)
- Filename: Must match the corresponding input file

## Exit Criteria

Exit the loop ONLY when ALL of these conditions are met:
- All items in @fix_plan.md are marked complete
- All output files exist with correct values
- All expected results from @specs/ are satisfied

## Status Reporting

At the end of each loop iteration, output this status block:

```
RALPH_STATUS:
- Tasks completed this loop: [list]
- Tasks remaining: [count]
- Errors encountered: [list or "none"]
- Ready to exit: [yes/no]
```

## Constraints

- Do NOT write code or scripts - perform operations directly
- Do NOT modify input files
- Do NOT skip tasks - complete all items in @fix_plan.md
- Do NOT exit until all tasks are complete and verified
