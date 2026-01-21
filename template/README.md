# Ralph Project

An autonomous AI agent loop. Define tasks in markdown, let the AI execute them.

## Quick Start

1. Write task specs in `specs/`
2. Add tasks to `fix_plan.md`
3. Run: `./run.sh claude`

## Running Commands

```bash
./run.sh claude         # Claude Code (default 5 iterations)
./run.sh claude 10      # Run up to 10 iterations
./run.sh opencode       # Use OpenCode instead
```

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) or [OpenCode](https://github.com/sst/opencode)

## Documentation

See [BLUEPRINT.md](BLUEPRINT.md) for detailed templates and examples of each file.
