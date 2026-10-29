#!/bin/bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"
chmod +x ./ledgerai-business
PORT=${PORT:-5173}
HOST=${HOST:-0.0.0.0}
echo "================================================================"
echo "   LedgerAI Africa - Business Edition                        "
echo "   "Your books, understood."                                  "
echo "================================================================"
echo "   Starting on http://${HOST}:${PORT}/"
echo "   Access in browser: http://localhost:${PORT}/"
echo "   Press Ctrl+C to stop."
echo "================================================================"
echo ""
exec ./ledgerai-business --port "$PORT" --host "$HOST" "$@"
