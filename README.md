# Ralph Template

A simple way to run autonomous AI agent tasks. Copy this into any project, define what you want done in markdown, and let the AI do the work.

Works with [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and [OpenCode](https://github.com/sst/opencode).

![Ralph](assets/ralph.jpg)

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) or [OpenCode](https://github.com/sst/opencode)



---

## What's inside

- **`specs/`** — where you describe what needs to be done
- **`fix_plan.md`** — a checklist of tasks for the AI to complete
- **`run.sh`** — runs a loop that has the AI complete tasks one at a time
- **`scripts/`** — helper scripts (output parser for colorized Claude output)

The AI reads your specs, goes through the checklist, and marks each task done.

---

## Why fresh context matters

Each iteration starts with a clean context. The AI reads your spec fresh, completes one task, and exits. Then the loop starts again.

This prevents context pollution. As conversations grow, AI agents often get confused by accumulated instructions and outputs. By resetting each time, Ralph stays predictable:

- No confusion from previous iterations
- Same spec interpretation every time
- Tasks complete reliably even in long runs

---

## How to use

### 1. Copy the template

```bash
cp -r ralph-template /path/to/your-project/ralph
cd /path/to/your-project/ralph
```

### 2. Add to .gitignore

Add ralph/ to your .gitignore file.

```bash
echo "ralph/" >> .gitignore
```

### 3. Write a spec

Create a file in `specs/` that explains what you want. Describe inputs, outputs, and what the AI should do.

### 4. Add tasks

Open `fix_plan.md` and add tasks under `## High Priority`:

```markdown
- [ ] Read input.txt, do X, write to output.txt
- [ ] Read data.json, do Y, write to result.json
```

Keep tasks specific. One task = one thing.

### 5. Run

```bash
chmod +x run.sh
./run.sh claude         # Claude Code with colorized output
./run.sh claude 10      # Run up to 10 iterations
./run.sh claude 5 --raw # Raw JSON output (no parsing)
./run.sh opencode       # OpenCode
```

The AI goes through your tasks one by one until everything is done. With Claude, you get colorized, human-readable output showing exactly what the AI is doing.

---

## Try the example

There's a working example in `examples/multiplication/`. It multiplies numbers from input files and writes the results.

```bash
cd examples/multiplication
chmod +x run.sh
./run.sh claude
```

Check the results:

```bash
cat output/001.txt  # 15
cat output/002.txt  # 28
cat output/003.txt  # 20
```

Look at the files in that folder to see how specs and tasks are set up.
