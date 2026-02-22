#!/bin/bash
set -e

# Usage: ./run.sh [claude|opencode] [max_iterations] [--raw]
# Examples:
#   ./run.sh claude         # Run with Claude Code (pretty-printed)
#   ./run.sh claude 10      # Run with Claude Code, 10 iterations
#   ./run.sh claude 5 --raw # Run with raw JSON output (no parsing)
#   ./run.sh opencode       # Run with OpenCode

TOOL=${1:-opencode} # Default to OpenCode if no tool specified
MAX_ITERATIONS=${2:-5} # Default to 5 iterations if no max iterations specified
RAW_OUTPUT=${3:-""} # Optional --raw flag

PROMPT="Read PROMPT.md and complete all tasks in fix_plan.md"

INTERRUPTED=0
trap 'INTERRUPTED=1; echo ""; echo "Ctrl+C detected — stopping after this iteration..."' INT

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Build command based on selected tool
case "$TOOL" in
  claude)
    # Use stream-json for structured output with verbose flag
    CMD="claude -p \"$PROMPT\" --dangerously-skip-permissions --print --output-format stream-json --verbose"
    ;;
  opencode)
    CMD="opencode run \"$PROMPT\""
    ;;
  *)
    echo "Usage: ./run.sh [claude|opencode] [max_iterations] [--raw]"
    echo "  claude   - Use Claude Code (with pretty-printed output)"
    echo "  opencode - Use OpenCode (default)"
    echo "  --raw    - Show raw JSON output instead of parsed (claude only)"
    exit 1
    ;;
esac

echo "Starting Ralph Autonomous Loop with $TOOL"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "========================================"
  echo "=== Iteration $i of $MAX_ITERATIONS ==="
  echo "========================================"
  echo ""

  # Create a temp file to store raw output for exit signal detection
  TEMP_OUTPUT=$(mktemp)

  if [ "$TOOL" = "claude" ]; then
    if [ "$RAW_OUTPUT" = "--raw" ]; then
      # Raw JSON output - show and capture
      eval $CMD 2>&1 | tee "$TEMP_OUTPUT" || true
    else
      # Pretty-printed output via parser
      # Capture raw JSON to temp file while piping to parser for display
      eval $CMD 2>&1 | tee "$TEMP_OUTPUT" | bash scripts/parse_claude_output.sh || true
    fi
  else
    eval $CMD 2>&1 | tee "$TEMP_OUTPUT" || true
  fi

  # Check if user pressed Ctrl+C during this iteration
  if [ "$INTERRUPTED" -eq 1 ]; then
    echo ""
    echo "========================================="
    echo "Interrupted by user (Ctrl+C)"
    echo "========================================="
    rm -f "$TEMP_OUTPUT"
    exit 130
  fi

  # Read the output for exit signal detection
  OUTPUT=$(cat "$TEMP_OUTPUT")
  rm -f "$TEMP_OUTPUT"

  # Extract only the LAST status block (in case output contains multiple blocks)
  LAST_STATUS=$(echo "$OUTPUT" | awk '
    /---RALPH_STATUS---/ { block = ""; capturing = 1 }
    capturing { block = block $0 "\n" }
    /---END_RALPH_STATUS---/ { capturing = 0 }
    END { print block }
  ')

  # Check for exit signal in the last status block only
  if echo "$LAST_STATUS" | grep -q 'EXIT_SIGNAL: true\|"EXIT_SIGNAL": true'; then
    echo ""
    echo "========================================="
    echo "EXIT_SIGNAL detected - Tasks complete!"
    echo "========================================="
    exit 0
  fi

  # Also check for the old format
  if echo "$OUTPUT" | grep -q "Ready to exit: yes"; then
    echo ""
    echo "Done!"
    exit 0
  fi

  sleep 2
done

echo ""
echo "Max iterations reached ($MAX_ITERATIONS)"
exit 1
