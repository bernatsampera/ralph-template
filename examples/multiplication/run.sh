#!/bin/bash
# Thin wrapper - delegates to shared lib
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LIB_DIR="$SCRIPT_DIR/../../lib"
exec "$LIB_DIR/run.sh" "$SCRIPT_DIR" "$@"
