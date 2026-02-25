# Self-Improvement Guide

This guide covers how to evaluate improvement candidates, how to add tasks dynamically, and the report format.

The user's prompt defines what to improve. Focus on what they asked for. As a general principle, always favor clarity, conciseness, minimal code, and intuitive patterns — but the specific improvements come from the user's direction, not from a predefined checklist.

---

## Candidate Format

Write each candidate in `specs/improvement-candidates.md`:

```
### [NUMBER]. [Short title]

**What:** One sentence.
**Why:** The problem and what improves.
**Where:** File paths affected.
**Effort:** small | medium | large
**Impact:** low | medium | high
**Risk:** low | medium | high
```

---

## Evaluation Criteria

A **clear win** meets these conditions:
- Impact >= medium with effort <= medium
- Risk is low or medium
- Follows existing codebase patterns (no new dependencies or patterns)
- Can be implemented in one isolated task
- Easy to verify

**Discard** if:
- Impact is low regardless of effort
- Risk is high without proportional reward
- Requires new dependencies or changes outside the specified area
- Needs human design decisions (mark as **deferred** instead)

Write results to `specs/improvement-evaluation.md`:

```
## Selected Improvements

### [Title]
**Score:** impact=[H/M/L], effort=[S/M/L], risk=[L/M/H]
**Rationale:** Why this is a clear win.
**Implementation plan:** What to change and how to verify.

## Discarded Improvements

### [Title]
**Reason:** Why it was cut.

## Deferred Improvements

### [Title]
**Reason:** What blocks it.
```

---

## Dynamic Task Creation

After writing the evaluation, Phase 2 adds one task per selected improvement to the `### Implementation` section of `fix_plan.md`.

Task format:

```
- [ ] **Implement: [Short Title]**: Read specs/improvement-evaluation.md section for "[Short Title]". [Which files to change, what to do, how to verify]. After completing, append to specs/implementation-log.md.
```

Rules:
- Each task is independent — no dependencies between implementation tasks
- Each task appends to `specs/implementation-log.md` (never overwrite)
- Order from lowest risk to highest risk
- Insert after `### Implementation` header and before the report task

### Implementation Log

`specs/implementation-log.md` — append-only. First task creates the file.

```
# Implementation Log

### [Short Title]
**Files changed:** list
**What was done:** Brief description.
**Verification:** How it was verified.
```

---

## Report Template

Write `specs/final-report.md`:

```
# Self-Improvement Report

## Target Area
[What the user asked to improve]

## Summary
[How many candidates, how many selected, how many implemented, overall outcome]

## Candidates Identified: [N]
[One-line each]

## Selected: [N]
[Each with scores]

## Discarded: [N]
[Each with reason]

## Deferred: [N]
[Each with what blocks it]

## Implementation Results
[For each, from implementation-log.md: files changed, what was done, verification, outcome]

## Recommendations
[Patterns noticed, recommended follow-ups, areas not covered]
```

---

## Constraints

1. Phase 1 and Phase 2 do NOT modify the parent project — only read it and write to `specs/` and `fix_plan.md`
2. Only Phase 3 implementation tasks modify files in the parent project (`../`)
3. Phase 4 only reads specs and writes the report
4. Each implementation task must be atomic — one focused change
5. Never introduce new dependencies
6. Respect existing code style and patterns
