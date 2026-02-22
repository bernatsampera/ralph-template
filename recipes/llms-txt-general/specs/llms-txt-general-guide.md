# The llms.txt System: Hierarchical Documentation for Any Subject

## What is llms.txt?

`llms.txt` is a documentation convention that creates a structured, navigable map of any subject. Instead of presenting a flat wall of text, `llms.txt` files provide a hierarchical index — what exists, how it is organized, and where to go for details.

The core idea: **read one file and know where to go next**, without searching or guessing.

## The Problem It Solves

When an AI agent (or human) encounters a large body of knowledge — a documentation site, a book, an API reference, a framework — they face a navigation problem:

- What does this subject cover?
- How is it organized?
- Where is the information I need?
- What are the major sections and how do they relate?

Without structure, the reader must scan everything linearly or guess where to look. `llms.txt` eliminates this by providing a pre-built navigation layer.

## Core Principles

1. **Read one file, know where to go.** Every `llms.txt` gives enough context to decide the next step without reading the underlying content.
2. **Route, don't duplicate.** Each file links to deeper docs or other `llms.txt` files. It summarizes what is behind each link but does not reproduce the content.
3. **Every link gets a one-line description.** A bare link is useless. The description tells the reader *what they will find* before they follow the link.
4. **Depth matches scope.** The root file covers the entire subject at a high level. Deeper files cover narrower topics in greater detail.

## Hierarchical Structure

The system is organized as a tree. Each level narrows the scope and increases the detail.

```
subject-root/
├── llms.txt                           ← Level 1: Subject-wide orientation
├── getting-started/
│   ├── llms.txt                       ← Level 2: Major topic hub
│   ├── installation.md                ← Leaf doc (linked from Level 2)
│   └── configuration.md              ← Leaf doc
├── core-concepts/
│   ├── llms.txt                       ← Level 2: Another major topic
│   └── topic-a/
│       ├── llms.txt                   ← Level 3: Detailed sub-topic
│       └── details.md                ← Leaf doc
└── reference/
    └── llms.txt                       ← Level 2: Reference hub
```

### Level 1 — Root

**Scope:** The entire subject.

**Purpose:** Orient the reader. Answer: "What is this subject about? What are its major parts? Where do I go for each?"

**Content:**
- Subject name and one-sentence description
- High-level sections (major topics, chapters, categories)
- Links to Level 2 `llms.txt` files or standalone docs for each major area

**Does not contain:** Detailed content, deep explanations, or exhaustive listings.

### Level 2 — Major Topic Hub

**Scope:** One major area of the subject (e.g., a chapter, a section, a core concept area).

**Purpose:** Comprehensive orientation for a specific topic. Answer: "What does this area cover? What sub-topics exist? Where is the detailed content?"

**Content:**
- Topic name and one-sentence description
- Brief context paragraph (1-2 paragraphs of prose)
- Links to leaf documentation files (detailed explanations, reference content, examples)
- Links to Level 3 `llms.txt` files for complex sub-topics

### Level 3 — Sub-topic

**Scope:** A single sub-topic or detailed area.

**Purpose:** Map every piece of detailed content within this area. Answer: "What specific resources, references, or content items exist here?"

**Content:**
- Sub-topic name and one-sentence description
- Brief context paragraph (what this area covers, key distinctions)
- Links to specific content files grouped by category
- Each link describes what that specific resource contains

## File Format

Every `llms.txt` follows the same format:

```markdown
# Title

> One-sentence description of what this file covers.

Optional prose paragraph(s) for context — key concepts, important
distinctions, or domain knowledge the reader needs before going deeper.

## Section Name

- [Link Text](relative/path/to/target): Description of what the reader will find at this path
- [Another Link](another/path): What this target contains and why it matters

## Another Section

- [More Links](path/to/file): Always with a description
```

### Format Rules

- **Title** (`# H1`): Name of the scope this file covers.
- **Abstract** (`> blockquote`): One sentence. A reader seeing only this line should understand the scope.
- **Prose** (optional): 1-2 paragraphs max. Key concepts, important patterns, or domain context.
- **Sections** (`## H2`): Group links by category. Use clear, descriptive names.
- **Links** (`- [text](path): description`): Every link must have a colon-separated description. The description says *what is inside*, not just the file name.

## Leaf Documentation Files

Not every doc needs to be a `llms.txt`. Terminal documentation files (detailed explanations, reference tables, examples, how-tos) are regular Markdown files linked from a `llms.txt`. These contain the actual detailed content.

The distinction:
- **`llms.txt`** = navigation node (links to other files)
- **Leaf `.md` files** = content nodes (contain actual documentation)

## Adapting to Different Subject Types

### Documentation Sites / Frameworks
- Root llms.txt maps to the docs homepage
- Level 2 maps to major doc sections (Getting Started, API Reference, Guides, etc.)
- Level 3 maps to complex sub-sections
- Leaf files contain summarized reference content, key patterns, and examples

### Books
- Root llms.txt maps to the table of contents
- Level 2 maps to parts or major chapters
- Level 3 maps to individual chapters or sub-chapters
- Leaf files contain chapter summaries, key concepts, and notable examples

### API References
- Root llms.txt maps to the API overview
- Level 2 maps to resource groups or major endpoint categories
- Level 3 maps to individual resources with multiple endpoints
- Leaf files contain endpoint details, request/response schemas, and examples

### Websites / Knowledge Bases
- Root llms.txt maps to the site's overall purpose and structure
- Level 2 maps to major content areas or categories
- Level 3 maps to detailed sub-categories
- Leaf files contain summarized content from key pages

## When to Create Each Level

| Situation | Action |
|---|---|
| Starting documentation for a new subject | Create a root `llms.txt` |
| Major topic area with multiple sub-topics | Create a Level 2 `llms.txt` |
| Complex sub-topic with 5+ content items | Create a Level 3 `llms.txt` |
| Simple sub-topic with 1-3 items | Add inline entries in the parent `llms.txt` |
| Detailed content (explanations, references) | Create a leaf `.md` file linked from the nearest `llms.txt` |

## Common Mistakes

- **Too much content in `llms.txt`.** It should route, not teach. Move detailed content into leaf docs.
- **Links without descriptions.** A bare `[topic](path/to/file)` tells the reader nothing. Always add `: what this file contains`.
- **Skipping levels.** Do not link from the root directly to leaf content files. Each level should link to the next level down.
- **Duplicating content across levels.** Each level has its own job. If two files say the same thing, one of them is unnecessary.
- **Too many leaf files for simple subjects.** Not every topic needs its own file. For small subjects, fewer levels with more inline content is better.

## Summary

The `llms.txt` system is a tree of navigation files:

```
Root llms.txt              → "What is this subject about?"
  └── Topic llms.txt       → "What does this area cover?"
        ├── Leaf docs      → Detailed reference content
        └── Sub-topic llms.txt → "What specific content exists here?"
              └── Leaf docs
```

Each file answers one question, links to the next level of detail, and describes every link with a one-liner. The result: any reader (human or AI) can navigate the subject efficiently without linear scanning.
