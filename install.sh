#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_SRC="$SCRIPT_DIR/plugin/the-typescript-narrows/skills/typescript-narrows"

RUNTIME="${1:-both}"
case "$RUNTIME" in
  claude|copilot|both)
    ;;
  *)
    echo "Usage: $0 [claude|copilot|both]"
    echo ""
    echo "  claude   Install to ~/.claude/skills only"
    echo "  copilot  Install to ~/.copilot/skills only"
    echo "  both     Install to both ~/.claude/skills and ~/.copilot/skills (default)"
    exit 1
    ;;
esac

if [ ! -d "$SKILL_SRC" ]; then
  echo "Error: skill directory not found at $SKILL_SRC"
  exit 1
fi

install_to_destination() {
  local dest_name="$1"
  local skills_dst="$2"
  local target="$skills_dst/typescript-narrows"

  mkdir -p "$skills_dst"
  rm -rf "$target"
  cp -R "$SKILL_SRC" "$target"

  echo "Installed typescript-narrows to $dest_name"
  echo "Done. Skill installed to $target"
}

echo "Installing TypeScript Narrows skill to runtime: $RUNTIME"
echo ""

case "$RUNTIME" in
  claude)
    install_to_destination "Claude" "$HOME/.claude/skills"
    ;;
  copilot)
    install_to_destination "Copilot" "$HOME/.copilot/skills"
    ;;
  both)
    install_to_destination "Claude" "$HOME/.claude/skills"
    echo ""
    install_to_destination "Copilot" "$HOME/.copilot/skills"
    ;;
esac
