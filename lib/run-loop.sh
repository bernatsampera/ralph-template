#!/bin/bash
set -e

# Usage: run-loop.sh [max_iterations]
# Env: RALPH_LIB_DIR must be set to the lib/ directory

MAX_ITERATIONS=${1:-5}
LIB_DIR="${RALPH_LIB_DIR}"

if [ -z "$LIB_DIR" ]; then
  echo "Error: RALPH_LIB_DIR not set"
  exit 1
fi

PROMPT_FILE="$LIB_DIR/prompt-run.md"
PROMPT=$(cat "$PROMPT_FILE")
PROMPT="$PROMPT

Read ralph.md then complete ONLY the first unchecked task. After completing ONE task, output the RALPH_STATUS block and stop."

INTERRUPTED=0
trap 'INTERRUPTED=1; echo ""; echo "Ctrl+C detected — stopping after this iteration..."' INT

echo "Starting Ralph execution loop"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "========================================"
  echo "=== Iteration $i of $MAX_ITERATIONS ==="
  echo "========================================"
  echo ""

  TEMP_OUTPUT=$(mktemp)

  claude -p "$PROMPT" \
    --dangerously-skip-permissions \
    --print \
    --output-format stream-json \
    --verbose \
    --append-system-prompt "CRITICAL: Complete exactly ONE task from ralph.md per invocation. After marking one checkbox done and outputting RALPH_STATUS, end your response immediately. Do not start the next task." \
    2>&1 | tee "$TEMP_OUTPUT" | bash "$LIB_DIR/parse_claude_output.sh" || true

  # Check Ctrl+C
  if [ "$INTERRUPTED" -eq 1 ]; then
    echo ""
    echo "========================================="
    echo "Interrupted by user (Ctrl+C)"
    echo "========================================="
    rm -f "$TEMP_OUTPUT"
    exit 130
  fi

  OUTPUT=$(cat "$TEMP_OUTPUT")
  rm -f "$TEMP_OUTPUT"

  # Extract last status block
  LAST_STATUS=$(echo "$OUTPUT" | awk '
    /---RALPH_STATUS---/ { block = ""; capturing = 1 }
    capturing { block = block $0 "\n" }
    /---END_RALPH_STATUS---/ { capturing = 0 }
    END { print block }
  ')

  # Check for exit signal
  if echo "$LAST_STATUS" | grep -q 'EXIT_SIGNAL: true\|"EXIT_SIGNAL": true'; then
    echo ""
    echo "========================================="
    echo "EXIT_SIGNAL detected - All tasks complete!"
    echo "========================================="
    exit 0
  fi

  sleep 2
done

echo ""
echo "Max iterations reached ($MAX_ITERATIONS)"
exit 1
