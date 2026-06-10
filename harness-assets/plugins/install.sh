#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_PLUGIN_DIR="$SCRIPT_DIR/claude-code"
OPENCODE_PLUGIN_SRC="$SCRIPT_DIR/opencode/hicode.ts"

INSTALL_CLAUDE=0
INSTALL_OPENCODE=0
DRY_RUN=0
YES=0

usage() {
  cat <<'USAGE'
hicode Coding Agent plugin installer

Usage:
  install.sh [--all] [--claude-code] [--opencode] [--dry-run] [--yes]

Options:
  --all           Install Claude Code and OpenCode plugins. Default when no platform is selected.
  --claude-code   Install the hicode Claude Code plugin for the current user.
  --opencode      Install the hicode OpenCode plugin for the current user.
  --dry-run       Print the installation plan without changing user configuration.
  --yes           Run without interactive confirmation.
  -h, --help      Show this help.

This installer only installs the hicode plugin into Coding Agent platforms.
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

install_opencode() {
  require_command node

  [ -f "$OPENCODE_PLUGIN_SRC" ] || die "Missing OpenCode plugin source: $OPENCODE_PLUGIN_SRC"

  local config_home="${XDG_CONFIG_HOME:-$HOME/.config}"
  local opencode_dir="$config_home/opencode"
  local plugin_dir="$opencode_dir/plugins"
  local plugin_dst="$plugin_dir/hicode.ts"

  log ""
  log "OpenCode plan:"
  log "  Plugin source: $OPENCODE_PLUGIN_SRC"
  log "  Plugin target: $plugin_dst"
  log "  Config file: $opencode_dir/opencode.json (not modified for local plugins)"
  log "  Action: copy plugin to the user-level OpenCode plugins directory"

  if [ "$DRY_RUN" -eq 1 ]; then
    log "+ mkdir -p $plugin_dir"
    log "+ cp $OPENCODE_PLUGIN_SRC $plugin_dst"
    return 0
  fi

  mkdir -p "$plugin_dir"
  cp "$OPENCODE_PLUGIN_SRC" "$plugin_dst"
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --all)
      INSTALL_CLAUDE=1
      INSTALL_OPENCODE=1
      ;;
    --claude-code)
      INSTALL_CLAUDE=1
      ;;
    --opencode)
      INSTALL_OPENCODE=1
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

if [ "$INSTALL_CLAUDE" -eq 0 ] && [ "$INSTALL_OPENCODE" -eq 0 ]; then
  INSTALL_CLAUDE=1
  INSTALL_OPENCODE=1
fi

log "hicode Coding Agent plugin installer"
log "Scope: current user"
log "Dry run: $DRY_RUN"
log "Claude Code: $INSTALL_CLAUDE"
log "OpenCode: $INSTALL_OPENCODE"
log ""
log "This installer will not scan code, generate CLAUDE.md, generate AGENTS.md, or create .hicode/."

confirm

if [ "$INSTALL_CLAUDE" -eq 1 ]; then
  install_claude_code
fi

if [ "$INSTALL_OPENCODE" -eq 1 ]; then
  install_opencode
fi

log ""
if [ "$DRY_RUN" -eq 1 ]; then
  log "Dry run complete. No files or user configuration were changed."
else
  log "hicode plugin installation complete."
fi
