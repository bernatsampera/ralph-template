#!/bin/bash
# Parse Claude stream-json output into human-readable format with colors
# Pure bash implementation - no dependencies required

# Colors
RESET="\033[0m"
BOLD="\033[1m"
DIM="\033[2m"
RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
MAGENTA="\033[35m"
CYAN="\033[36m"
WHITE="\033[37m"
BRIGHT_RED="\033[91m"
BRIGHT_GREEN="\033[92m"
BRIGHT_YELLOW="\033[93m"
BRIGHT_BLUE="\033[94m"
BRIGHT_MAGENTA="\033[95m"

# Extract JSON string value: extract_value '{"key":"value"}' 'key' -> value
extract_value() {
  echo "$1" | sed -n 's/.*"'"$2"'"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1
}

# Extract JSON number value
extract_number() {
  echo "$1" | sed -n 's/.*"'"$2"'"[[:space:]]*:[[:space:]]*\([0-9.]*\).*/\1/p' | head -1
}

# Check if line contains a key
has_key() {
  echo "$1" | grep -q "\"$2\""
}

# Print colored text
print_color() {
  printf "${1}${2}${RESET}"
}

print_header() {
  printf "${BRIGHT_BLUE}============================================================${RESET}\n"
}

print_separator() {
  printf "${DIM}----------------------------------------${RESET}\n"
}

# Print tool action in compact format: |  ToolName   description
print_tool_action() {
  local tool="$1"
  local desc="$2"
  local color

  case "$tool" in
    Read|Glob|Grep) color="$BLUE" ;;
    Write) color="$GREEN" ;;
    Edit) color="$YELLOW" ;;
    Bash) color="$RED" ;;
    *) color="$CYAN" ;;
  esac

  printf "${color}|${RESET}  ${DIM}%-8s${RESET} %s\n" "$tool" "$desc"
}

while IFS= read -r line; do
  # Skip empty lines
  [ -z "$line" ] && continue

  # Detect message type
  if echo "$line" | grep -q '"type"[[:space:]]*:[[:space:]]*"system"' && echo "$line" | grep -q '"subtype"[[:space:]]*:[[:space:]]*"init"'; then
    # Session init
    model=$(extract_value "$line" "model")
    session=$(extract_value "$line" "session_id")
    session_short="${session:0:8}..."

    # Count tools (rough count of items in tools array)
    tools_count=$(echo "$line" | grep -o '"tools"' | wc -l)
    if echo "$line" | grep -q '"tools"[[:space:]]*:\['; then
      tools_count=$(echo "$line" | sed 's/.*"tools":\[//' | sed 's/\].*//' | tr ',' '\n' | wc -l)
    fi

    print_header
    printf "${BOLD}${BRIGHT_BLUE}CLAUDE SESSION STARTED${RESET}\n"
    printf "  Model: ${CYAN}%s${RESET}\n" "$model"
    printf "  Session: ${DIM}%s${RESET}\n" "$session_short"
    printf "  Tools: ${GREEN}%s${RESET} available\n" "$tools_count"
    print_header
    echo

  elif echo "$line" | grep -q '"type"[[:space:]]*:[[:space:]]*"assistant"'; then
    # Assistant message - check for tool_use or text

    if echo "$line" | grep -q '"type"[[:space:]]*:[[:space:]]*"tool_use"'; then
      # Tool use
      tool_name=$(echo "$line" | sed -n 's/.*"tool_use".*"name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
      if [ -z "$tool_name" ]; then
        tool_name=$(echo "$line" | sed -n 's/.*"name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*"type"[[:space:]]*:[[:space:]]*"tool_use".*/\1/p')
      fi
      # Try another pattern
      if [ -z "$tool_name" ]; then
        tool_name=$(echo "$line" | grep -o '"name":"[^"]*"' | head -1 | sed 's/"name":"\([^"]*\)"/\1/')
      fi

      # Build description based on tool type
      desc=""

      # Extract file_path if present
      file_path=$(echo "$line" | grep -o '"file_path":"[^"]*"' | head -1 | sed 's/"file_path":"\([^"]*\)"/\1/')
      if [ -n "$file_path" ]; then
        desc="$file_path"
      fi

      # Extract command description if Bash tool
      if [ "$tool_name" = "Bash" ]; then
        # Try to get description first
        bash_desc=$(echo "$line" | grep -o '"description":"[^"]*"' | head -1 | sed 's/"description":"\([^"]*\)"/\1/')
        if [ -n "$bash_desc" ]; then
          desc="$bash_desc"
        else
          # Fall back to command (truncated)
          cmd=$(echo "$line" | grep -o '"command":"[^"]*"' | head -1 | sed 's/"command":"\([^"]*\)"/\1/' | sed 's/\\"/"/g')
          if [ -n "$cmd" ]; then
            # Truncate long commands
            if [ ${#cmd} -gt 50 ]; then
              desc="${cmd:0:47}..."
            else
              desc="$cmd"
            fi
          fi
        fi
      fi

      # Extract pattern if Glob/Grep
      if [ "$tool_name" = "Glob" ] || [ "$tool_name" = "Grep" ]; then
        pattern=$(echo "$line" | grep -o '"pattern":"[^"]*"' | head -1 | sed 's/"pattern":"\([^"]*\)"/\1/')
        if [ -n "$pattern" ]; then
          desc="$pattern"
        fi
      fi

      print_tool_action "$tool_name" "$desc"

    elif echo "$line" | grep -q '"type"[[:space:]]*:[[:space:]]*"text"'; then
      # Text content
      # Extract text - this is tricky with nested JSON, get content after "text":"
      text=$(echo "$line" | sed 's/.*"text"[[:space:]]*:[[:space:]]*"//' | sed 's/"[[:space:]]*}.*$//' | sed 's/\\n/\n/g' | sed 's/\\"/"/g')

      if [ -n "$text" ] && [ "$text" != "$line" ]; then
        printf "%s\n" "$text"
      fi
    fi

  elif echo "$line" | grep -q '"type"[[:space:]]*:[[:space:]]*"user"'; then
    # Tool result - only show errors
    if echo "$line" | grep -q '"type"[[:space:]]*:[[:space:]]*"tool_result"'; then
      if echo "$line" | grep -q "tool_use_error"; then
        printf "${RED}|${RESET}  ${BRIGHT_RED}Error${RESET}   (see output)\n"
      fi
      # Success results are silent
    fi

  elif echo "$line" | grep -q '"type"[[:space:]]*:[[:space:]]*"result"'; then
    # Final result
    subtype=$(extract_value "$line" "subtype")
    duration_ms=$(extract_number "$line" "duration_ms")
    num_turns=$(extract_number "$line" "num_turns")
    cost=$(extract_number "$line" "total_cost_usd")

    # Calculate duration in seconds
    if [ -n "$duration_ms" ]; then
      duration_s=$(echo "scale=1; $duration_ms / 1000" | bc 2>/dev/null || echo "$duration_ms ms")
      [ "$duration_s" != "$duration_ms ms" ] && duration_s="${duration_s}s"
    else
      duration_s="unknown"
    fi

    # Format cost
    if [ -n "$cost" ]; then
      cost_fmt=$(printf "%.4f" "$cost" 2>/dev/null || echo "$cost")
    else
      cost_fmt="unknown"
    fi

    # Status color
    if [ "$subtype" = "success" ]; then
      status_color="$BRIGHT_GREEN"
    else
      status_color="$BRIGHT_RED"
    fi

    print_header
    printf "${BOLD}${BRIGHT_BLUE}SESSION COMPLETE${RESET}\n"
    printf "  Status: ${status_color}%s${RESET}\n" "$subtype"
    printf "  Duration: ${CYAN}%s${RESET}\n" "$duration_s"
    printf "  Turns: ${CYAN}%s${RESET}\n" "$num_turns"
    printf "  Cost: ${YELLOW}\$%s${RESET}\n" "$cost_fmt"

    # Extract final result text
    result=$(extract_value "$line" "result")
    if [ -n "$result" ]; then
      print_separator
      printf "${BOLD}${BRIGHT_GREEN}FINAL RESULT:${RESET}\n"
      printf "${WHITE}%s${RESET}\n" "$(echo "$result" | sed 's/\\n/\n/g')"
    fi
    print_header
  fi
done
