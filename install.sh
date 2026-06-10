#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_PLUGIN_DIR="$SCRIPT_DIR"

INSTALL_CLAUDE=0
DRY_RUN=0
YES=0

usage() {
  cat <<'USAGE'
hicode Claude Code plugin installer

Usage:
  install.sh [--claude-code] [--dry-run] [--yes]

Options:
  --claude-code   Install the hicode Claude Code plugin for the current user. Default.
  --dry-run       Print the installation plan without changing user configuration.
  --yes           Run without interactive confirmation.
  -h, --help      Show this help.

This installer only installs the hicode Claude Code plugin.
It does not scan projects, generate CLAUDE.md or AGENTS.md, or create .hicode/.
USAGE
}

log() {
  printf '%s\n' "$*"
}

die() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || die "Required command not found: $1"
}

confirm() {
  if [ "$YES" -eq 1 ] || [ "$DRY_RUN" -eq 1 ]; then
    return 0
  fi

  printf 'Proceed with hicode plugin installation? [y/N] '
  read -r answer
  case "$answer" in
    y|Y|yes|YES) ;;
    *) die "Installation cancelled" ;;
  esac
}

run_cmd() {
  log "+ $*"
  if [ "$DRY_RUN" -eq 0 ]; then
    "$@"
  fi
}

install_claude_code() {
  require_command claude

  [ -d "$CLAUDE_PLUGIN_DIR/.claude-plugin" ] || die "Missing Claude plugin manifest directory: $CLAUDE_PLUGIN_DIR/.claude-plugin"

  log ""
  log "Claude Code plan:"
  log "  Marketplace path: $CLAUDE_PLUGIN_DIR"
  log "  Plugin: hicode"
  log "  Action: register local marketplace and install hicode for current user"

  run_cmd claude plugin validate "$CLAUDE_PLUGIN_DIR/.claude-plugin/marketplace.json"
  run_cmd claude plugin marketplace add "$CLAUDE_PLUGIN_DIR"
  run_cmd claude plugin install "hicode@hicode"
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --claude-code)
      INSTALL_CLAUDE=1
      ;;
    --dry-run)
      DRY_RUN=1
      ;;
    --yes)
      YES=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      die "Unknown option: $1"
      ;;
  esac
  shift
done

if [ "$INSTALL_CLAUDE" -eq 0 ]; then
  INSTALL_CLAUDE=1
fi

log "hicode Claude Code plugin installer"
log "Scope: current user"
log "Dry run: $DRY_RUN"
log "Claude Code: $INSTALL_CLAUDE"
log ""
log "This installer will not scan code, generate CLAUDE.md, generate AGENTS.md, or create .hicode/."

confirm

if [ "$INSTALL_CLAUDE" -eq 1 ]; then
  install_claude_code
fi

log ""
if [ "$DRY_RUN" -eq 1 ]; then
  log "Dry run complete. No files or user configuration were changed."
else
  log "hicode plugin installation complete."
fi
