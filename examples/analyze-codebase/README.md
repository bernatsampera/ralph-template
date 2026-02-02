# Analyze Codebase Example

Autonomous agent that analyzes any codebase and generates structured documentation about its architecture, sections, and overall flow.

## What It Does

1. Scans the repository structure to identify main sections and files
2. Deep-dives into each section to document how it works
3. Synthesizes everything into a comprehensive flow document

## Output

After completion, you'll have:
- `specs/codebase-structure.md` - High-level overview of folders and key files
- `specs/{section_name}/details.md` - Deep analysis of each major section
- `specs/overall-flow.md` - How all parts connect and interact

## Quick Start

1. Copy this folder into your target repository:
   ```bash
   cp -r examples/analyze-codebase /path/to/your/repo/ralph-analyze
   cd /path/to/your/repo/ralph-analyze
   ```

2. Run the agent:
   ```bash
   npm run start
   ```

## Customizing the Analysis

Edit `fix_plan.md` to customize what gets analyzed.

### Example: Analyze a React App

```markdown
# Fix Plan

## High Priority

- [ ] Analyze the current repository structure. Identify the main sections (components, hooks, pages, utils, etc.) and key configuration files. Write findings to `specs/codebase-structure.md`.

- [ ] Read `specs/codebase-structure.md`. Add tasks below for each section that needs detailed analysis.

### Sections

- [ ] **Components**: Analyze `src/components/`. Document component hierarchy, shared components, and patterns used. Write to `specs/components/details.md`.

- [ ] **State Management**: Analyze Redux/Context setup in `src/store/`. Document state shape, actions, and data flow. Write to `specs/state/details.md`.

- [ ] **API Layer**: Analyze `src/api/` and `src/hooks/`. Document API calls, data fetching patterns, and error handling. Write to `specs/api/details.md`.

### Final Task

- [ ] **Create Overall Flow**: Read `specs/flow_blueprint.md` for the template. Read ALL detail files in `specs/*/details.md`. Create a comprehensive flow document showing how components, state, and API layer connect. Write to `specs/overall-flow.md`.

## Completed

## Notes

- Tasks are completed ONE at a time by the agent
- Be specific: describe exactly what to read, what to do, and what to write
- Mark tasks complete with [x] after verification
```

### Example: Analyze a Backend API

```markdown
# Fix Plan

## High Priority

- [ ] Analyze the repository structure. Identify entry points, route handlers, database models, and middleware. Write findings to `specs/codebase-structure.md`.

- [ ] Read `specs/codebase-structure.md`. Add tasks below for each section.

### Sections

- [ ] **Routes & Controllers**: Analyze all route files. Document endpoints, HTTP methods, authentication requirements. Write to `specs/routes/details.md`.

- [ ] **Database Layer**: Analyze models and migrations. Document schema, relationships, and queries. Write to `specs/database/details.md`.

- [ ] **Middleware**: Analyze authentication, validation, and error handling middleware. Write to `specs/middleware/details.md`.

- [ ] **Services**: Analyze business logic layer. Document service patterns and dependencies. Write to `specs/services/details.md`.

### Final Task

- [ ] **Create Overall Flow**: Read `specs/flow_blueprint.md`. Read ALL detail files. Create flow document showing request lifecycle from route to response. Write to `specs/overall-flow.md`.

## Completed

## Notes

- Tasks are completed ONE at a time by the agent
- Be specific: describe exactly what to read, what to do, and what to write
```

## Writing Effective Tasks

Each task should specify:

| Element | Description |
|---------|-------------|
| **What to read** | Source files, directories, or previous specs |
| **What to analyze** | Specific aspects to focus on |
| **What to write** | Output file path and expected content |

### Good Task Examples

```markdown
- [ ] Analyze `src/components/ui/`. Document shared UI components, their props, and usage patterns. Include code snippets of key interfaces. Write to `specs/ui-components/details.md`.

- [ ] Read the authentication flow in `src/auth/`. Trace login from form submission to token storage. Document each step with file references. Write to `specs/auth/details.md`.

- [ ] Analyze `package.json` and config files. Document build process, scripts, and key dependencies. Write to `specs/tooling/details.md`.
```

### Avoid Vague Tasks

```markdown
# Bad - too vague
- [ ] Understand the codebase

# Good - specific
- [ ] Analyze the folder structure. List each top-level directory and its purpose. Identify the main entry point and configuration files. Write to `specs/codebase-structure.md`.
```

## Tips

- Start broad (structure overview) then go deep (section details)
- The agent reads from the parent directory (`../`) to analyze your actual code
- Each task runs in a fresh context, so reference previous output files when building on prior analysis
- The final "Overall Flow" task should read all previous specs to create a unified view
