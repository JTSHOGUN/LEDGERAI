#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

chmod +x ./ledgerai-business

echo "================================================================"
echo "   Installing LedgerAI Africa - Business Edition             "
echo "   "Your books, understood."                                  "
echo "================================================================"
echo ""

if [ "$EUID" -eq 0 ]; then
  echo "Installing system-wide to /usr/local/bin/ledgerai-business..."
  cp ./ledgerai-business /usr/local/bin/ledgerai-business
  chmod +x /usr/local/bin/ledgerai-business
  echo "✓ Successfully installed. Run 'ledgerai-business' from anywhere."
else
  echo "Local installation ready in $(pwd)."
  echo "To launch, run: ./run.sh"
fi

echo ""
echo "Installation complete!"
