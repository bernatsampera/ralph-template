# Analyze Codebase

Autonomous agent that analyzes any codebase and generates structured documentation about its architecture and flow.

## Usage

1. Copy this folder into your target repository:
   ```bash
   cp -r examples/analyze-codebase /path/to/your/repo/ralph-analyze
   cd /path/to/your/repo/ralph-analyze
   ```

2. Run the agent:
   ```bash
   npm run start 20
   ```

## Output

After completion, check the `specs/` folder for:
- `codebase-structure.md` - Overview of folders and key files
- `{section}/details.md` - Deep analysis of each section
- `overall-flow.md` - How all parts connect
