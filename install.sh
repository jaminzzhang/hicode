#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_PLUGIN_DIR="$SCRIPT_DIR"
MARKETPLACE_NAME="hicode"
PLUGIN_NAME="hicode"
INSTALL_SCOPE="user"

INSTALL_CLAUDE=0
DRY_RUN=0
YES=0

usage() {
  cat <<'USAGE'
hicode Claude Code plugin installer

Usage:
  install.sh [--claude-code] [--scope user|local|project] [--dry-run] [--yes]

Options:
  --claude-code   Install the hicode Claude Code plugin for the current user. Default.
  --scope         Claude Code install scope. Default: user.
  --dry-run       Print the installation plan without changing user configuration.
  --yes           Run without interactive confirmation.
  -h, --help      Show this help.

This installer only installs the hicode Claude Code plugin.
It exposes only runtime assets declared in .claude-plugin/plugin.json.
It does not install this repository's docs/ or archive/ as runtime assets.
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

validate_scope() {
  case "$INSTALL_SCOPE" in
    user|local|project) ;;
    *) die "Invalid --scope value: $INSTALL_SCOPE. Expected user, local, or project." ;;
  esac
}

validate_plugin_assets() {
  [ -d "$CLAUDE_PLUGIN_DIR/.claude-plugin" ] || die "Missing Claude plugin manifest directory: $CLAUDE_PLUGIN_DIR/.claude-plugin"
  [ -f "$CLAUDE_PLUGIN_DIR/.claude-plugin/plugin.json" ] || die "Missing Claude plugin manifest: $CLAUDE_PLUGIN_DIR/.claude-plugin/plugin.json"
  [ -f "$CLAUDE_PLUGIN_DIR/.claude-plugin/marketplace.json" ] || die "Missing Claude marketplace manifest: $CLAUDE_PLUGIN_DIR/.claude-plugin/marketplace.json"

  for skill in hi init scope tdd review release; do
    [ -f "$CLAUDE_PLUGIN_DIR/skills/$skill/SKILL.md" ] || die "Missing skill entry: $CLAUDE_PLUGIN_DIR/skills/$skill/SKILL.md"
  done
}

validate_install_boundary() {
  local plugin_manifest="$CLAUDE_PLUGIN_DIR/.claude-plugin/plugin.json"

  if grep -Eq '("\./docs/?|"docs/"|"\./archive/?|"archive/"|"references/(prompts|skills|gates|schemas|examples|init|target-project))' "$plugin_manifest"; then
    die "Plugin manifest must not expose repository docs, archive, or historical references as runtime assets"
  fi
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
  validate_plugin_assets
  validate_install_boundary
  validate_scope

  log ""
  log "Claude Code plan:"
  log "  Marketplace root: $CLAUDE_PLUGIN_DIR"
  log "  Marketplace manifest: $CLAUDE_PLUGIN_DIR/.claude-plugin/marketplace.json"
  log "  Plugin: $PLUGIN_NAME@$MARKETPLACE_NAME"
  log "  Scope: $INSTALL_SCOPE"
  log "  Runtime assets: skills/ declared by .claude-plugin/plugin.json"
  log "  Excluded from runtime: docs/, archive/, historical references/"
  log "  Action: validate manifests, register local marketplace, install plugin"

  if [ "$DRY_RUN" -eq 1 ]; then
    log "+ claude plugin validate \"$CLAUDE_PLUGIN_DIR/.claude-plugin/marketplace.json\""
    log "+ claude plugin marketplace add \"$CLAUDE_PLUGIN_DIR\""
    log "+ claude plugin install \"$PLUGIN_NAME@$MARKETPLACE_NAME\" --scope \"$INSTALL_SCOPE\""
    return 0
  fi

  require_command claude

  run_cmd claude plugin validate "$CLAUDE_PLUGIN_DIR/.claude-plugin/marketplace.json"
  run_cmd claude plugin marketplace add "$CLAUDE_PLUGIN_DIR"
  run_cmd claude plugin install "$PLUGIN_NAME@$MARKETPLACE_NAME" --scope "$INSTALL_SCOPE"
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --claude-code)
      INSTALL_CLAUDE=1
      ;;
    --scope)
      [ "$#" -ge 2 ] || die "Missing value for --scope"
      INSTALL_SCOPE="$2"
      shift
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
log "Installer target: Claude Code $INSTALL_SCOPE scope"
log "Dry run: $DRY_RUN"
log "Claude Code: $INSTALL_CLAUDE"
log "Claude Code install scope: $INSTALL_SCOPE"
log ""
log "This installer exposes only plugin runtime assets declared in .claude-plugin/plugin.json."
log "This installer will not install repository docs/archive as runtime assets."
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
