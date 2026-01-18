#!/bin/bash
set -e

# Usage: ./run.sh [claude|opencode] [max_iterations]
# Examples:
#   ./run.sh claude      # Run with Claude Code
#   ./run.sh opencode    # Run with OpenCode
#   ./run.sh claude 10   # Run with Claude Code, 10 iterations

TOOL=${1:-opencode} # Default to OpenCode if no tool specified
MAX_ITERATIONS=${2:-5} # Default to 5 iterations if no max iterations specified
PROMPT="Read PROMPT.md and complete all tasks in fix_plan.md"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Build command based on selected tool
case "$TOOL" in
  claude)
    CMD="claude -p \"$PROMPT\" --dangerously-skip-permissions --print --output-format text"
    ;;
  opencode)
    CMD="opencode run \"$PROMPT\""
    ;;
  *)
    echo "Usage: ./run.sh [claude|opencode] [max_iterations]"
    echo "  claude   - Use Claude Code"
    echo "  opencode - Use OpenCode (default)"
    exit 1
    ;;
esac

echo "Starting Ralph Autonomous Loop with $TOOL"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo "=== Iteration $i ==="

  OUTPUT=$(eval $CMD 2>&1 | tee /dev/stderr) || true

  if echo "$OUTPUT" | grep -q "Ready to exit: yes"; then
    echo "Done!"
    exit 0
  fi

  sleep 2
done

echo "Max iterations reached"
exit 1
