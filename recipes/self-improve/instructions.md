### Recipe: Self-Improve

**CRITICAL: YOU ARE PLANNING ONLY. DO NOT IMPLEMENT ANYTHING.**

Your job is to create tasks in `fix_plan.md`. You must NOT fix, change, or implement anything in the parent project. No code changes, no file edits outside this ralph directory. Every improvement will be executed LATER by `npm start`, one task per iteration, in a fresh context. If you implement now, you defeat Ralph's purpose.

**After writing fix_plan.md, STOP. Your work is done.**

---

Read `specs/self-improve-guide.md` for the evaluation criteria, task format, and report template.

Analyze the project in the parent directory. Understand what the user wants to improve based on their prompt.

Create tasks in `fix_plan.md` using this **multi-phase structure**, in this exact order:

#### Phase 1 — Brainstorm

Create ONE task:

- [ ] **Brainstorm improvements**: Read the parent project's codebase, focusing on [USER'S SPECIFIED AREA]. Identify concrete improvement opportunities based on what the user asked to improve. For each candidate, describe: what it is, why it matters, where it applies (file paths), effort (small/medium/large), impact (low/medium/high), and risk (low/medium/high). Write all findings to `specs/improvement-candidates.md` using the candidate format from `specs/self-improve-guide.md`.

Replace `[USER'S SPECIFIED AREA]` with whatever the user asked to improve. Be specific about which files or directories to focus on.

#### Phase 2 — Evaluate & Plan

Create ONE task:

- [ ] **Evaluate and select improvements**: Read `specs/improvement-candidates.md` and `specs/self-improve-guide.md`. Apply the evaluation criteria from the guide. Select only the **clear wins** — discard the rest with a brief reason. Write results to `specs/improvement-evaluation.md`. Then **add a new task** to the `### Implementation` section of this fix_plan.md for each selected improvement, using this format: `- [ ] **Implement: [Short Title]**: Read specs/improvement-evaluation.md section for "[Short Title]". [What to change and how to verify]. After completing the change, append a summary to specs/implementation-log.md.` Order tasks from lowest risk to highest.

#### Phase 3 — Implementation

Add this section header and placeholder:

### Implementation

<!-- Phase 2 will add implementation tasks here at runtime. Do not add tasks manually. -->

#### Phase 4 — Report

Create ONE task (must be the last task in the file):

- [ ] **Write final report**: Read `specs/improvement-candidates.md`, `specs/improvement-evaluation.md`, and `specs/implementation-log.md`. Write a report to `specs/final-report.md` covering: what was analyzed, what was selected and why, what was discarded and why, what was implemented, and follow-up recommendations.

---

**Reminders:**
- DO NOT implement any improvements — only create the fix_plan.md tasks
- Each task must be self-contained with the exact spec files to read and files to write
- Phase 1 and Phase 2 only analyze and write specs — they do NOT touch the parent project
- Only Phase 3 tasks (added dynamically by Phase 2) modify the parent project
- The `### Implementation` section must exist even though it starts empty
