# Ralph Template

[![npm version](https://img.shields.io/npm/v/ralph-template.svg)](https://www.npmjs.com/package/ralph-template)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Run long AI task lists without context pollution.**

![Ralph](assets/ralph.jpg)

---

## The Problem

AI agents lose their mind in long conversations. By task #15, your agent is confused, hallucinating, and forgetting your original instructions. Why? Because old instructions, outputs, and context pile up and pollute the conversation.

## The Solution

Ralph uses one simple trick: **fresh context for every task**.

Instead of one long conversation where the AI completes 50 tasks, Ralph runs 50 separate conversations—one per task. Each task starts clean, with no leftover confusion from previous work.

**Result**: Task #50 runs just as reliably as task #1.

---

## Quick Start

```bash
# 1. Create a new Ralph project
npx ralph-template my-project

# 2. Enter the project
cd my-project

# 3. Run the AI
npm start
```

That's it. Ralph will process your tasks one by one with fresh context each time.

---

## Requirements

- Node.js 14+
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) or [OpenCode](https://github.com/sst/opencode)

---

## How It Works (Step by Step)

### Step 1: Create Your Project

```bash
npx ralph-template my-project
cd my-project
```

**What you get:**
```
my-project/
├── specs/           # Describe WHAT you want done
├── fix_plan.md      # List of tasks for the AI
├── input/           # Your input files
├── output/          # Where results go
├── AGENT.md         # Instructions for the AI
└── run.sh           # The loop that runs everything
```

### Step 2: Write a Spec

Create a file in `specs/` that explains your task. This is the "instruction manual" the AI reads before working.

**Example:** `specs/multiplication-task.md`
```markdown
# Multiplication Task

Read two numbers from input files, multiply them, write the result.

## Input Format
- Location: `input/` folder
- Content: Two integers, one per line

## Output Format
- Location: `output/` folder
- Content: Single integer (the product)
```

**Why this matters:** A clear spec means the AI knows exactly what to do. Vague specs = vague results.

### Step 3: Add Your Input Files

Put your data in the `input/` folder.

**Example:** `input/001.txt`
```
5
3
```

### Step 4: Create Your Task List

Open `fix_plan.md` and add tasks under `## High Priority`:

```markdown
## High Priority

- [ ] Read input/001.txt, multiply 5 x 3, write 15 to output/001.txt
- [ ] Read input/002.txt, multiply 7 x 4, write 28 to output/002.txt
- [ ] Read input/003.txt, multiply 10 x 2, write 20 to output/003.txt
```

**Why this matters:** Each `- [ ]` is a separate task. The AI completes one, marks it `[x]`, exits, and starts fresh for the next one. No context pollution.

**Tips for good tasks:**
- One task = one action
- Be specific ("multiply 5 x 3") not vague ("do the math")
- Include expected output so the AI can verify its work

### Step 5: Run

```bash
npm start               # Claude Code (default)
npm run opencode        # OpenCode
npm run start:raw       # Raw JSON output (no formatting)
```

The AI processes tasks one by one until everything is marked `[x]` done.

---

## Try the Example

There's a working example you can run right now:

```bash
cd examples/multiplication
npm start
```

Watch the AI:
1. Read `input/001.txt` (contains 5 and 3)
2. Multiply: 5 × 3 = 15
3. Write `15` to `output/001.txt`
4. Mark the task done, exit
5. Start fresh for the next task

Check the results:
```bash
cat output/001.txt  # 15
cat output/002.txt  # 28
cat output/003.txt  # 20
```

---

## Saving and Loading Configurations

Ralph lets you save your work and switch between different projects. This is useful when you're working on multiple things or want to save your progress.

### Available Commands

| Command | What it does |
|---------|--------------|
| `npm run ralph:save -- <name>` | Save your current setup with a name |
| `npm run ralph:load -- <name>` | Load a previously saved setup |
| `npm run ralph:list` | See all your saved configurations |
| `npm run ralph:current` | Check what configuration you're using |
| `npm run ralph:new` | Start fresh with a blank template |

### What Gets Saved

When you save, Ralph copies these files:
- `AGENT.md` — Your AI instructions
- `fix_plan.md` — Your task list
- `specs/` — Your specification files
- `input/` — Your input files
- `output/` — Your output files

### Example Workflow

```bash
# You're working on a feature
npm run ralph:save -- user-auth

# Need to switch to a different project
npm run ralph:load -- data-migration

# Work on data-migration tasks...
npm start

# Later, go back to your original work
npm run ralph:load -- user-auth

# See all your saved configurations
npm run ralph:list

# Check if you have unsaved changes
npm run ralph:current

# Start completely fresh
npm run ralph:new
```

### Where Are Configurations Stored?

- Saved configs: `.ralph-versions/` folder (each config gets its own subfolder)
- Current active config: `.ralph-current` file

---

## Advanced Usage


### Use with Different AI Agents

```bash
npm start           # Claude Code
npm run opencode    # OpenCode
```

---

## Why "Ralph"?

Because sometimes you just need a simple worker who does one thing at a time and doesn't get distracted. Ralph doesn't try to be clever—he just processes your tasks, one by one, reliably.
