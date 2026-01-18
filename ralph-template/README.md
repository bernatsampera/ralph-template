# Ralph Template

An autonomous AI agent loop. Define tasks in markdown, let the AI execute them.

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) or [OpenCode](https://github.com/sst/opencode) installed

## How It Works

1. You write task specifications in `specs/`
2. You list tasks in `fix_plan.md`
3. Run `./run.sh` — the AI completes tasks one by one until done

## Quick Start

### Step 1: Copy the template

```bash
cp -r ralph-template your-project-ralph
cd your-project-ralph
```

### Step 2: Create a spec file

Create `specs/your-task.md` describing what you want done.

### Step 3: Add tasks to fix_plan.md

Add checkboxes under `## High Priority`:

```markdown
- [ ] Your first task here
- [ ] Your second task here
```

### Step 4: Run it

```bash
./run.sh claude    # Use Claude Code
./run.sh opencode  # Use OpenCode (default)
```

---

## Test It: Multiplication Example

Try this example to verify everything works.

### 1. Create the spec

Create `specs/multiply.md`:

```markdown
# Task: Multiply Numbers

## Input
- File: data/numbers.txt
- Format: Two numbers, one per line

## Output
- File: data/result.txt
- Format: Single line with the product

## Example
Input:
7
6

Output:
42
```

### 2. Create the input file

```bash
mkdir -p data
echo -e "7\n6" > data/numbers.txt
```

### 3. Add the task

Edit `fix_plan.md` and add under `## High Priority`:

```markdown
- [ ] Read data/numbers.txt, multiply the two numbers, write result to data/result.txt
```

### 4. Run

```bash
./run.sh claude
```

### 5. Verify

```bash
cat data/result.txt
# Should output: 42
```

---

## Files

| File | Purpose |
|------|---------|
| `specs/` | Task specifications (what to do) |
| `fix_plan.md` | Task checklist (the AI checks these off) |
| `run.sh` | Runs the autonomous loop |
| `PROMPT.md` | Agent workflow instructions (rarely edit) |
| `AGENT.md` | Quality standards (rarely edit) |

## Tips

- **Be specific**: Include exact file paths in every task
- **One action per task**: Each checkbox = one thing the AI can do in one loop
- **Verify outputs**: Check results after the loop completes
