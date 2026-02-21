# The llms.txt System: Hierarchical Documentation for AI Agents

## What is llms.txt?

`llms.txt` is a documentation convention designed to make codebases navigable by AI coding agents. Instead of forcing an agent to explore files one by one, `llms.txt` files provide a structured map of the project — what exists, where it lives, and what each part does.

The core idea: **an agent reads one file and knows where to go next**, without guessing or searching.

## The Problem It Solves

AI agents working on a codebase face a cold-start problem. They don't know:

- What the project is or what tech stack it uses
- Where things are located
- Which files are relevant to a given task
- How the codebase is organized

Without guidance, agents resort to brute-force exploration — globbing, grepping, reading random files — which is slow, noisy, and often misses important context. `llms.txt` eliminates this by providing a pre-built navigation layer.

## Core Principles

1. **Read one file, know where to go.** Every `llms.txt` gives enough context to decide the next step without reading source code.
2. **Route, don't duplicate.** Each file links to deeper docs or other `llms.txt` files. It summarizes what's behind each link but doesn't reproduce the content.
3. **Every link gets a one-line description.** A bare link is useless. The description tells the agent *what it will find* before it follows the link.
4. **Depth matches scope.** The root file covers the whole repo at a high level. Deeper files cover narrower scopes in greater detail.

## Hierarchical Structure

The system is organized as a tree. Each level narrows the scope and increases the detail.

```
repo-root/
├── llms.txt                          ← Level 1: Repo-wide orientation
├── frontend/
│   └── docs/
│       ├── llms.txt                  ← Level 2: Domain/subsystem hub
│       ├── conventions.md            ← Leaf doc (linked from Level 2)
│       ├── design.md                 ← Leaf doc
│       └── api.md                    ← Leaf doc
├── backend/
│   └── docs/
│       └── llms.txt                  ← Level 2: Another domain hub
└── some-feature/
    └── llms.txt                      ← Level 3: Feature-level map
```

### Level 1 — Root

**Scope:** The entire repository.

**Purpose:** Orient the agent. Answer: "What is this project? What are its major parts? Where do I go for each?"

**Content:**
- Project name and one-sentence description
- High-level sections (frontend, backend, infrastructure, etc.)
- Links to Level 2 `llms.txt` files or standalone docs for each major area

**Does not contain:** Implementation details, file listings, or code references.

### Level 2 — Domain/Subsystem Hub

**Scope:** One major area of the codebase (e.g., frontend, backend, a microservice).

**Purpose:** Comprehensive orientation for a specific domain. Answer: "What tech stack is used here? What documentation exists? What features have deeper docs?"

**Content:**
- Subsystem name and one-sentence description
- Brief tech stack summary (1-2 paragraphs of prose)
- Links to leaf documentation files (conventions, design system, API patterns, etc.)
- Links to Level 3 `llms.txt` files for complex features

### Level 3 — Feature

**Scope:** A single feature or module.

**Purpose:** Map every file the agent might need to touch. Answer: "What components, hooks, utilities, API routes, and types make up this feature?"

**Content:**
- Feature name and one-sentence description
- Brief context paragraph (what the feature does, key architectural decisions)
- Links to **actual source files** grouped by category (components, hooks, API, types, etc.)
- Each link describes what that specific file does

**Key difference from Level 2:** At this level, links point to source code files, not to other documentation files.

## File Format

Every `llms.txt` follows the same format:

```markdown
# Title

> One-sentence description of what this file covers.

Optional prose paragraph(s) for context — tech stack, key architectural
decisions, or domain knowledge the agent needs before going deeper.

## Section Name

- [Link Text](relative/path/to/target): Description of what the agent will find at this path
- [Another Link](another/path): What this target contains and why it matters

## Another Section

- [More Links](path/to/file): Always with a description
```

### Format Rules

- **Title** (`# H1`): Name of the scope this file covers.
- **Abstract** (`> blockquote`): One sentence. An agent reading only this line should understand the scope.
- **Prose** (optional): 1-2 paragraphs max. Tech stack, key patterns, or domain context.
- **Sections** (`## H2`): Group links by category. Use clear, generic names.
- **Links** (`- [text](path): description`): Every link must have a colon-separated description. The description says *what is inside*, not just the file name.

## Leaf Documentation Files

Not every doc needs to be a `llms.txt`. Terminal documentation files (conventions, design guides, API docs) are regular Markdown files linked from a `llms.txt`. These contain the actual detailed content — rules, patterns, examples, reference tables.

The distinction:
- **`llms.txt`** = navigation node (links to other files)
- **Leaf `.md` files** = content nodes (contain actual documentation)

## Integration with Agent Instructions (CLAUDE.md)

`llms.txt` files are passive — they exist but nothing forces an agent to read them. To make them effective, the agent's instruction file (e.g., `CLAUDE.md`, `.cursorrules`, or equivalent) must enforce a docs-first workflow:

1. The root instruction file tells the agent: "Before any task, read `llms.txt`."
2. It then directs to the relevant domain's `llms.txt` based on the task type.
3. This creates a mandatory read path: **instruction file → root llms.txt → domain llms.txt → leaf docs or feature llms.txt → source code**.

Without this enforcement, the agent may skip the docs entirely.

## When to Create Each Level

| Situation | Action |
|---|---|
| New repository | Create a root `llms.txt` |
| New major subsystem (frontend, backend, service) | Create a Level 2 `llms.txt` in its docs directory |
| Complex feature with 5+ files | Create a Level 3 `llms.txt` at the feature root |
| Simple feature with 1-3 files | Add an inline entry in the parent Level 2 `llms.txt` |
| Cross-cutting concern (conventions, design) | Create a leaf `.md` file linked from Level 2 |

## Keeping It in Sync

The biggest risk with `llms.txt` is staleness. A stale link or missing entry is worse than no docs at all — it actively misleads the agent.

Rules to prevent drift:

1. **After any change that adds, removes, or moves files**, update the relevant `llms.txt` and any leaf docs that reference those files.
2. **After creating a new feature**, decide: does it warrant its own Level 3 file, or should it be an inline entry in Level 2?
3. **Periodically audit links.** Dead links to nonexistent files cause agents to waste turns on errors.
4. **Encode the update rule in the agent's instructions.** For example: "After any task that changes files, update the affected `llms.txt`."

## Common Mistakes

- **Too much content in `llms.txt`.** It should route, not teach. Move detailed content into leaf docs.
- **Links without descriptions.** A bare `[file.ts](path/to/file.ts)` tells the agent nothing. Always add `: what this file does`.
- **Skipping levels.** Don't link from the root directly to source files. Each level should link to the next level down.
- **Forgetting to update.** A moved file with a stale link is the most common failure mode.
- **Duplicating content across levels.** Each level has its own job. If two files say the same thing, one of them is unnecessary.

## Summary

The `llms.txt` system is a tree of navigation files:

```
Root llms.txt         → "What's in this repo?"
  └── Domain llms.txt → "What's in this subsystem?"
        ├── Leaf docs → Detailed reference content
        └── Feature llms.txt → "What files make up this feature?"
              └── Source files
```

Each file answers one question, links to the next level of detail, and describes every link with a one-liner. The agent's instruction file enforces the read order. The result: an agent that can navigate any codebase without brute-force exploration.
