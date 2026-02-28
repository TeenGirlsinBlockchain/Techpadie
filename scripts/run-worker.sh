#!/bin/bash
# FILE: scripts/run-worker.sh — Run the job worker with auto-restart
# Usage: chmod +x scripts/run-worker.sh && ./scripts/run-worker.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "📂 Working directory: $PROJECT_DIR"

# Load .env if it exists
if [ -f .env ]; then
  echo "📄 Loading .env"
  set -a
  source .env
  set +a
fi

MAX_RESTARTS=10
RESTART_COUNT=0
RESTART_DELAY=5

echo "🚀 Starting Techpadie Job Worker..."
echo ""

while [ $RESTART_COUNT -lt $MAX_RESTARTS ]; do
  npx tsx scripts/worker.ts
  EXIT_CODE=$?

  if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Worker exited cleanly."
    exit 0
  fi

  RESTART_COUNT=$((RESTART_COUNT + 1))
  echo ""
  echo "⚠️  Worker exited with code $EXIT_CODE (restart $RESTART_COUNT/$MAX_RESTARTS)"
  echo "   Restarting in ${RESTART_DELAY}s..."
  sleep $RESTART_DELAY

  # Exponential backoff on restarts (5s, 10s, 20s, 40s...)
  RESTART_DELAY=$((RESTART_DELAY * 2))
done

echo "💀 Worker exceeded max restarts ($MAX_RESTARTS). Giving up."
exit 1