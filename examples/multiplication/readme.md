# Ralph Claude Code Test

Test setup demonstrating the Ralph-style iterative loop where an AI agent directly performs tasks without writing code.

## What This Does

The AI agent will:
1. Read pairs of numbers from `input/` folder
2. Multiply each pair
3. Write results to corresponding files in `output/`

**Key difference**: The AI performs the multiplication directly - no Python script is involved.

## Files

| File | Purpose |
|------|---------|
| `AGENT.md` | Agent instructions and quality standards |
| `PROMPT.md` | Development loop instructions for the AI |
| `fix_plan.md` | Task checklist with pending/completed items |
| `specs/` | Detailed task specifications |
| `input/` | Input files with number pairs |
| `output/` | Output files with results |
| `scripts/` | Helper scripts (output parser) |

## Input Files

| File | Numbers | Expected Output |
|------|---------|-----------------|
| `input/001.txt` | 5, 3 | 15 |
| `input/002.txt` | 7, 4 | 28 |
| `input/003.txt` | 10, 2 | 20 |

## How to Run

### Using run.sh (Recommended)

The `run.sh` script runs Claude Code in an autonomous loop with pretty-printed, colorized output:

```bash
# Run with Claude Code (default 5 iterations, pretty output)
./run.sh claude

# Run with more iterations
./run.sh claude 10

# Run with raw JSON output (no parsing)
./run.sh claude 5 --raw

# Run with OpenCode instead
./run.sh opencode
```

**Requirements:**
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed

### Manual Execution

Point your AI agent (Claude Code, etc.) at this folder and instruct it to:

```
Read PROMPT.md and complete all tasks in fix_plan.md
```

The agent will:
1. Read PROMPT.md for instructions
2. Check fix_plan.md for pending tasks
3. Read specs/ for task details
4. Execute each task (read input, multiply, write output)
5. Mark tasks complete in fix_plan.md

## Verification

Check all outputs are correct:

```bash
cat output/001.txt  # Should be 15
cat output/002.txt  # Should be 28
cat output/003.txt  # Should be 20
```

## References

- [Ralph Repo](https://github.com/snarktank/ralph)
- [Ralph Claude Code Template](https://github.com/frankbria/ralph-claude-code)
