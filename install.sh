#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_PLUGIN_DIR="$SCRIPT_DIR"
MARKETPLACE_NAME="hicode"
PLUGIN_NAME="hicode"
SKILL_NAMES="hi init scope tdd review release"
AGENT_NAMES="requirement-reviewer coding-planner tdd-guide coding-assistant code-reviewer security-reviewer java-reviewer release-reviewer"
HICODE_SKILLS_LABEL="hicode-hi, hicode-init, hicode-scope, hicode-tdd, hicode-review, hicode-release"
INSTALL_SCOPE="user"
OPENCODE_SCOPE="user"
OPENCODE_CONFIG_DIR="${OPENCODE_CONFIG_DIR:-$HOME/.config/opencode}"
OPENCODE_PROJECT_DIR="$PWD"
CODEX_SCOPE="user"
CODEX_USER_MARKETPLACE_PATH="${CODEX_MARKETPLACE_PATH:-$HOME/.agents/plugins/marketplace.json}"
CODEX_USER_PLUGIN_ROOT="${CODEX_PLUGIN_ROOT:-$HOME/plugins}"
CODEX_PROJECT_DIR="$PWD"

INSTALL_CLAUDE=0
INSTALL_OPENCODE=0
INSTALL_CODEX=0
UNINSTALL=0
DRY_RUN=0
YES=0

usage() {
  cat <<'USAGE'
hicode Coding Agent installer

Usage:
  install.sh [--uninstall] [--claude-code] [--opencode] [--codex] [--all] [--scope user|local|project] [--opencode-scope user|project] [--codex-scope user|project] [--dry-run] [--yes]

Options:
  --uninstall           Remove hicode from the selected target platform(s).
  --claude-code          Target the hicode Claude Code plugin.
  --opencode            Target hicode agents and skills for OpenCode.
  --codex               Target the hicode Codex plugin through a local marketplace.
  --all                 Target all supported platforms (Claude Code, OpenCode, Codex).
  --scope               Claude Code scope. Default: user.
  --opencode-scope      OpenCode scope: user or project. Default: user.
  --opencode-config-dir OpenCode user config directory. Default: $OPENCODE_CONFIG_DIR or ~/.config/opencode.
  --opencode-project-dir
                       Target project directory for --opencode-scope project. Default: current directory.
  --codex-scope        Codex plugin scope: user or project. Default: user.
  --codex-project-dir  Target project directory for --codex-scope project. Default: current directory.
  --dry-run             Print the operation plan without changing user configuration.
  --yes                 Run without interactive confirmation. Without platform flags, defaults to Claude Code.
  -h, --help            Show this help.

When no platform flag is specified and --yes is not used, an interactive menu prompts
for platform selection. With --yes and no platform flag, Claude Code is installed by default.

This installer supports Claude Code plugin installation, OpenCode local agents/skills installation,
and Codex plugin installation through a local marketplace. With --uninstall, it removes only
hicode-owned plugin entries, bundles, and hicode-* OpenCode assets.
It exposes only Claude Code plugin assets, Codex plugin skill assets, or transformed OpenCode runtime assets.
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

require_dir() {
  [ -d "$1" ] || die "$2: $1"
}

require_file() {
  [ -f "$1" ] || die "$2: $1"
}

validate_scope() {
  case "$INSTALL_SCOPE" in
    user|local|project) ;;
    *) die "Invalid --scope value: $INSTALL_SCOPE. Expected user, local, or project." ;;
  esac
}

validate_opencode_scope() {
  case "$OPENCODE_SCOPE" in
    user|project) ;;
    *) die "Invalid --opencode-scope value: $OPENCODE_SCOPE. Expected user or project." ;;
  esac
}

validate_codex_scope() {
  case "$CODEX_SCOPE" in
    user|project) ;;
    *) die "Invalid --codex-scope value: $CODEX_SCOPE. Expected user or project." ;;
  esac
}

opencode_targets() {
  validate_opencode_scope
  if [ "$OPENCODE_SCOPE" = "user" ]; then
    OPENCODE_SKILLS_DIR="$OPENCODE_CONFIG_DIR/skills"
    OPENCODE_AGENTS_DIR="$OPENCODE_CONFIG_DIR/agents"
  else
    OPENCODE_SKILLS_DIR="$OPENCODE_PROJECT_DIR/.opencode/skills"
    OPENCODE_AGENTS_DIR="$OPENCODE_PROJECT_DIR/.opencode/agents"
  fi
}

codex_targets() {
  validate_codex_scope
  CODEX_COMMAND_DIR="$PWD"

  if [ "$CODEX_SCOPE" = "user" ]; then
    CODEX_MARKETPLACE_PATH="$CODEX_USER_MARKETPLACE_PATH"
    CODEX_PLUGIN_TARGET="$CODEX_USER_PLUGIN_ROOT/$PLUGIN_NAME"
    CODEX_MARKETPLACE_DEFAULT_NAME="personal"
    CODEX_MARKETPLACE_DISPLAY_NAME="Personal"
  else
    CODEX_MARKETPLACE_PATH="$CODEX_PROJECT_DIR/.agents/plugins/marketplace.json"
    CODEX_PLUGIN_TARGET="$CODEX_PROJECT_DIR/plugins/$PLUGIN_NAME"
    CODEX_MARKETPLACE_DEFAULT_NAME="$PLUGIN_NAME-project"
    CODEX_MARKETPLACE_DISPLAY_NAME="hicode Project"
    CODEX_COMMAND_DIR="$CODEX_PROJECT_DIR"
  fi

  CODEX_MARKETPLACE_NAME="$(read_codex_marketplace_name "$CODEX_MARKETPLACE_PATH" "$CODEX_MARKETPLACE_DEFAULT_NAME")"
}

validate_plugin_assets() {
  require_dir "$CLAUDE_PLUGIN_DIR/.claude-plugin" "Missing Claude plugin manifest directory"
  require_file "$CLAUDE_PLUGIN_DIR/.claude-plugin/plugin.json" "Missing Claude plugin manifest"
  require_file "$CLAUDE_PLUGIN_DIR/.claude-plugin/marketplace.json" "Missing Claude marketplace manifest"
  require_dir "$CLAUDE_PLUGIN_DIR/.codex-plugin" "Missing Codex plugin manifest directory"
  require_file "$CLAUDE_PLUGIN_DIR/.codex-plugin/plugin.json" "Missing Codex plugin manifest"
  require_file "$CLAUDE_PLUGIN_DIR/scripts/install-opencode.js" "Missing OpenCode installer adapter"
  require_file "$CLAUDE_PLUGIN_DIR/scripts/install-codex.js" "Missing Codex installer adapter"

  for skill in $SKILL_NAMES; do
    require_file "$CLAUDE_PLUGIN_DIR/skills/$skill/SKILL.md" "Missing skill entry"
  done

  for path in \
    skills/init/coding_rules.md \
    skills/init/hicode-entry-section.md \
    skills/init/DOMAIN_KNOWLEDGE.md \
    skills/init/PROJ_CONTEXT.md \
    skills/init/ADR-template.md \
    skills/scope/feature_context.md \
    skills/scope/requirement-review-report.md \
    skills/scope/scope-report.md \
    skills/scope/task-split-plan.md \
    skills/scope/ADR-template.md \
    skills/tdd/tdd-report.md \
    skills/review/review-report.md \
    skills/release/release-report.md
  do
    require_file "$CLAUDE_PLUGIN_DIR/$path" "Missing skill-local runtime document"
  done

  for agent in $AGENT_NAMES; do
    require_file "$CLAUDE_PLUGIN_DIR/agents/$agent.md" "Missing agent entry"
  done

}

validate_install_boundary() {
  local plugin_manifest

  for plugin_manifest in \
    "$CLAUDE_PLUGIN_DIR/.claude-plugin/plugin.json" \
    "$CLAUDE_PLUGIN_DIR/.codex-plugin/plugin.json"
  do
    if grep -Eq '("\./docs/?|"docs/"|"\./archive/?|"archive/"|"references/)' "$plugin_manifest"; then
      die "Plugin manifest must not expose repository docs, archive, or references as runtime assets: $plugin_manifest"
    fi
  done
}

confirm() {
  if [ "$YES" -eq 1 ] || [ "$DRY_RUN" -eq 1 ]; then
    return 0
  fi

  if [ "$UNINSTALL" -eq 1 ]; then
    printf 'Proceed with hicode plugin uninstallation? [y/N] '
  else
    printf 'Proceed with hicode plugin installation? [y/N] '
  fi
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

finish_idempotent_uninstall() {
  local selector="$1"
  local status="$2"
  local output="$3"

  if [ "$status" -eq 0 ]; then
    [ -z "$output" ] || printf '%s\n' "$output"
    return 0
  fi

  if printf '%s\n' "$output" | grep -Eiq 'not found|not installed|not in installed plugins'; then
    [ -z "$output" ] || printf '%s\n' "$output" >&2
    log "+ $selector already absent; continuing"
    return 0
  fi

  [ -z "$output" ] || printf '%s\n' "$output" >&2
  return "$status"
}

run_idempotent_uninstall_cmd() {
  local selector="$1"
  shift

  log "+ $*"
  if [ "$DRY_RUN" -eq 1 ]; then
    return 0
  fi

  local output
  local status
  set +e
  output="$("$@" 2>&1)"
  status=$?
  set -e
  finish_idempotent_uninstall "$selector" "$status" "$output"
}

run_idempotent_uninstall_cmd_in_dir() {
  local dir="$1"
  local selector="$2"
  shift 2

  log "+ (cd \"$dir\" && $*)"
  if [ "$DRY_RUN" -eq 1 ]; then
    return 0
  fi

  local output
  local status
  set +e
  output="$(cd "$dir" && "$@" 2>&1)"
  status=$?
  set -e
  finish_idempotent_uninstall "$selector" "$status" "$output"
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
  log "  Runtime assets: skills/ declared by .claude-plugin/plugin.json; agents/ loaded from Claude Code plugin root conventions"
  log "  Init seed rule: skills/init/coding_rules.md"
  log "  Skill-local documents: concrete templates only; lifecycle rules live in target entry"
  log "  Excluded from runtime: docs/, archive/, references/"
  log "  Action: validate manifests, register local marketplace, install plugin"

  if [ "$DRY_RUN" -eq 1 ]; then
    log "+ claude plugin validate \"$CLAUDE_PLUGIN_DIR/.claude-plugin/plugin.json\""
    log "+ claude plugin validate \"$CLAUDE_PLUGIN_DIR/.claude-plugin/marketplace.json\""
    log "+ claude plugin marketplace add \"$CLAUDE_PLUGIN_DIR\" --scope \"$INSTALL_SCOPE\""
    log "+ claude plugin install \"$PLUGIN_NAME@$MARKETPLACE_NAME\" --scope \"$INSTALL_SCOPE\""
    return 0
  fi

  require_command claude

  run_cmd claude plugin validate "$CLAUDE_PLUGIN_DIR/.claude-plugin/plugin.json"
  run_cmd claude plugin validate "$CLAUDE_PLUGIN_DIR/.claude-plugin/marketplace.json"
  run_cmd claude plugin marketplace add "$CLAUDE_PLUGIN_DIR" --scope "$INSTALL_SCOPE"
  run_cmd claude plugin install "$PLUGIN_NAME@$MARKETPLACE_NAME" --scope "$INSTALL_SCOPE"
}

uninstall_claude_code() {
  validate_scope

  log ""
  log "Claude Code uninstall plan:"
  log "  Plugin: $PLUGIN_NAME@$MARKETPLACE_NAME"
  log "  Scope: $INSTALL_SCOPE"
  log "  Action: uninstall hicode Claude Code plugin from selected scope"

  if [ "$DRY_RUN" -eq 1 ]; then
    log "+ claude plugin uninstall \"$PLUGIN_NAME@$MARKETPLACE_NAME\" --scope \"$INSTALL_SCOPE\""
    return 0
  fi

  require_command claude
  run_idempotent_uninstall_cmd "$PLUGIN_NAME@$MARKETPLACE_NAME" claude plugin uninstall "$PLUGIN_NAME@$MARKETPLACE_NAME" --scope "$INSTALL_SCOPE"
}

install_opencode() {
  validate_plugin_assets
  opencode_targets

  log ""
  log "OpenCode plan:"
  log "  Scope: $OPENCODE_SCOPE"
  log "  Skills target: $OPENCODE_SKILLS_DIR"
  log "  Agents target: $OPENCODE_AGENTS_DIR"
  log "  Skills installed as: $HICODE_SKILLS_LABEL"
  log "  Agents installed as: hicode-<agent-name>.md"
  log "  Excluded from runtime: docs/, archive/, references/"
  log "  Action: copy transformed hicode skills and agents into OpenCode directories"

  if [ "$DRY_RUN" -eq 1 ]; then
    log "+ mkdir -p \"$OPENCODE_SKILLS_DIR\" \"$OPENCODE_AGENTS_DIR\""
    log "+ install transformed skills/{hi,init,scope,tdd,review,release} to \"$OPENCODE_SKILLS_DIR/hicode-*\""
    log "+ install transformed agents/*.md to \"$OPENCODE_AGENTS_DIR/hicode-*.md\""
    return 0
  fi

  run_cmd mkdir -p "$OPENCODE_SKILLS_DIR" "$OPENCODE_AGENTS_DIR"

  node "$SCRIPT_DIR/scripts/install-opencode.js" install "$CLAUDE_PLUGIN_DIR" "$OPENCODE_SKILLS_DIR" "$OPENCODE_AGENTS_DIR"
}

uninstall_opencode() {
  opencode_targets

  log ""
  log "OpenCode uninstall plan:"
  log "  Scope: $OPENCODE_SCOPE"
  log "  Skills target: $OPENCODE_SKILLS_DIR"
  log "  Agents target: $OPENCODE_AGENTS_DIR"
  log "  Skills removed: $HICODE_SKILLS_LABEL"
  log "  Agents removed: hicode-<agent-name>.md"
  log "  Action: remove hicode-owned OpenCode skills and agents only"

  if [ "$DRY_RUN" -eq 1 ]; then
    log "+ remove \"$OPENCODE_SKILLS_DIR/hicode-{hi,init,scope,tdd,review,release}\""
    log "+ remove \"$OPENCODE_AGENTS_DIR/hicode-*.md\""
    return 0
  fi

  node "$SCRIPT_DIR/scripts/install-opencode.js" uninstall "$CLAUDE_PLUGIN_DIR" "$OPENCODE_SKILLS_DIR" "$OPENCODE_AGENTS_DIR"
}

select_platforms() {
  log ""
  if [ "$UNINSTALL" -eq 1 ]; then
    log "Select target platform(s) to uninstall hicode:"
  else
    log "Select target platform(s) to install hicode:"
  fi
  log "  1) Claude Code"
  log "  2) OpenCode"
  log "  3) Codex CLI"
  log "  a) All platforms"
  log ""
  printf 'Enter choice(s), space-separated (e.g. "1 3" for Claude Code + Codex): '
  read -r choices

  for choice in $choices; do
    case "$choice" in
      1) INSTALL_CLAUDE=1 ;;
      2) INSTALL_OPENCODE=1 ;;
      3) INSTALL_CODEX=1 ;;
      a|A)
        INSTALL_CLAUDE=1
        INSTALL_OPENCODE=1
        INSTALL_CODEX=1
        ;;
      *) die "Invalid choice: $choice. Expected 1, 2, 3, or a." ;;
    esac
  done

  if [ "$INSTALL_CLAUDE" -eq 0 ] && [ "$INSTALL_OPENCODE" -eq 0 ] && [ "$INSTALL_CODEX" -eq 0 ]; then
    die "No platform selected."
  fi
}

read_codex_marketplace_name() {
  local marketplace_path="$1"
  local default_name="$2"

  node - "$marketplace_path" "$default_name" <<'NODE'
const fs = require("fs");

const marketplacePath = process.argv[2];
const defaultName = process.argv[3];
let name = defaultName;

try {
  const marketplace = JSON.parse(fs.readFileSync(marketplacePath, "utf8"));
  if (typeof marketplace.name === "string" && marketplace.name.trim()) {
    name = marketplace.name.trim();
  }
} catch {
  // Missing marketplace files use the installer's default marketplace name.
}

process.stdout.write(name);
NODE
}

run_cmd_in_dir() {
  local dir="$1"
  shift

  log "+ (cd \"$dir\" && $*)"
  if [ "$DRY_RUN" -eq 0 ]; then
    (cd "$dir" && "$@")
  fi
}

run_platform() {
  local enabled="$1"
  local install_fn="$2"
  local uninstall_fn="$3"

  if [ "$enabled" -eq 0 ]; then
    return 0
  fi
  if [ "$UNINSTALL" -eq 1 ]; then
    "$uninstall_fn"
  else
    "$install_fn"
  fi
}

install_codex() {
  validate_plugin_assets
  validate_install_boundary
  codex_targets

  log ""
  log "Codex CLI plan:"
  log "  Scope: $CODEX_SCOPE"
  log "  Marketplace file: $CODEX_MARKETPLACE_PATH"
  log "  Marketplace name: $CODEX_MARKETPLACE_NAME"
  log "  Plugin bundle target: $CODEX_PLUGIN_TARGET"
  log "  Plugin selector: $PLUGIN_NAME@$CODEX_MARKETPLACE_NAME"
  log "  Runtime assets: .codex-plugin/plugin.json and skills/"
  log "  Agents: omitted for Codex because Codex plugin manifests do not support agents"
  log "  Excluded from runtime: docs/, archive/, references/"
  log "  Action: copy hicode Codex plugin bundle, update local marketplace, install plugin"

  if [ "$DRY_RUN" -eq 1 ]; then
    log "+ mkdir -p \"$(dirname "$CODEX_MARKETPLACE_PATH")\" \"$(dirname "$CODEX_PLUGIN_TARGET")\""
    log "+ copy .codex-plugin/ and skills/ to \"$CODEX_PLUGIN_TARGET\""
    log "+ upsert marketplace entry \"$PLUGIN_NAME\" with source.path \"./plugins/$PLUGIN_NAME\""
    if [ "$CODEX_SCOPE" = "user" ]; then
      log "+ codex plugin add \"$PLUGIN_NAME@$CODEX_MARKETPLACE_NAME\""
    else
      log "+ (cd \"$CODEX_COMMAND_DIR\" && codex plugin add \"$PLUGIN_NAME@$CODEX_MARKETPLACE_NAME\")"
    fi
    return 0
  fi

  local generated_marketplace_name
  generated_marketplace_name="$(
    node "$SCRIPT_DIR/scripts/install-codex.js" install "$CLAUDE_PLUGIN_DIR" "$CODEX_PLUGIN_TARGET" "$CODEX_MARKETPLACE_PATH" "$CODEX_MARKETPLACE_DEFAULT_NAME" "$CODEX_MARKETPLACE_DISPLAY_NAME" "$PLUGIN_NAME"
  )"

  log "+ generated Codex marketplace entry: $PLUGIN_NAME@$generated_marketplace_name"

  if [ "${HICODE_CODEX_SKIP_ADD:-0}" = "1" ]; then
    log "+ skip codex plugin add because HICODE_CODEX_SKIP_ADD=1"
    return 0
  fi

  require_command codex
  if [ "$CODEX_SCOPE" = "user" ]; then
    run_cmd codex plugin add "$PLUGIN_NAME@$generated_marketplace_name"
  else
    run_cmd_in_dir "$CODEX_COMMAND_DIR" codex plugin add "$PLUGIN_NAME@$generated_marketplace_name"
  fi
}

uninstall_codex() {
  codex_targets

  log ""
  log "Codex CLI uninstall plan:"
  log "  Scope: $CODEX_SCOPE"
  log "  Marketplace file: $CODEX_MARKETPLACE_PATH"
  log "  Marketplace name: $CODEX_MARKETPLACE_NAME"
  log "  Plugin bundle target: $CODEX_PLUGIN_TARGET"
  log "  Plugin selector: $PLUGIN_NAME@$CODEX_MARKETPLACE_NAME"
  log "  Action: remove Codex plugin install, marketplace entry, and hicode plugin bundle"

  if [ "$DRY_RUN" -eq 1 ]; then
    if [ "$CODEX_SCOPE" = "user" ]; then
      log "+ codex plugin remove \"$PLUGIN_NAME@$CODEX_MARKETPLACE_NAME\""
    else
      log "+ (cd \"$CODEX_COMMAND_DIR\" && codex plugin remove \"$PLUGIN_NAME@$CODEX_MARKETPLACE_NAME\")"
    fi
    log "+ remove marketplace entry \"$PLUGIN_NAME\" from \"$CODEX_MARKETPLACE_PATH\""
    log "+ remove plugin bundle \"$CODEX_PLUGIN_TARGET\""
    return 0
  fi

  if [ "${HICODE_CODEX_SKIP_REMOVE:-0}" = "1" ]; then
    log "+ skip codex plugin remove because HICODE_CODEX_SKIP_REMOVE=1"
  else
    require_command codex
    if [ "$CODEX_SCOPE" = "user" ]; then
      run_idempotent_uninstall_cmd "$PLUGIN_NAME@$CODEX_MARKETPLACE_NAME" codex plugin remove "$PLUGIN_NAME@$CODEX_MARKETPLACE_NAME"
    else
      run_idempotent_uninstall_cmd_in_dir "$CODEX_COMMAND_DIR" "$PLUGIN_NAME@$CODEX_MARKETPLACE_NAME" codex plugin remove "$PLUGIN_NAME@$CODEX_MARKETPLACE_NAME"
    fi
  fi

  node "$SCRIPT_DIR/scripts/install-codex.js" uninstall "$CLAUDE_PLUGIN_DIR" "$CODEX_PLUGIN_TARGET" "$CODEX_MARKETPLACE_PATH" "$CODEX_MARKETPLACE_DEFAULT_NAME" "$CODEX_MARKETPLACE_DISPLAY_NAME" "$PLUGIN_NAME"
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --uninstall)
      UNINSTALL=1
      ;;
    --claude-code)
      INSTALL_CLAUDE=1
      ;;
    --opencode)
      INSTALL_OPENCODE=1
      ;;
    --codex)
      INSTALL_CODEX=1
      ;;
    --all)
      INSTALL_CLAUDE=1
      INSTALL_OPENCODE=1
      INSTALL_CODEX=1
      ;;
    --scope)
      [ "$#" -ge 2 ] || die "Missing value for --scope"
      INSTALL_SCOPE="$2"
      shift
      ;;
    --opencode-scope)
      [ "$#" -ge 2 ] || die "Missing value for --opencode-scope"
      OPENCODE_SCOPE="$2"
      shift
      ;;
    --opencode-config-dir)
      [ "$#" -ge 2 ] || die "Missing value for --opencode-config-dir"
      OPENCODE_CONFIG_DIR="$2"
      shift
      ;;
    --opencode-project-dir)
      [ "$#" -ge 2 ] || die "Missing value for --opencode-project-dir"
      OPENCODE_PROJECT_DIR="$2"
      shift
      ;;
    --codex-scope)
      [ "$#" -ge 2 ] || die "Missing value for --codex-scope"
      CODEX_SCOPE="$2"
      shift
      ;;
    --codex-project-dir)
      [ "$#" -ge 2 ] || die "Missing value for --codex-project-dir"
      CODEX_PROJECT_DIR="$2"
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

if [ "$INSTALL_CLAUDE" -eq 0 ] && [ "$INSTALL_OPENCODE" -eq 0 ] && [ "$INSTALL_CODEX" -eq 0 ]; then
  if [ "$YES" -eq 1 ]; then
    INSTALL_CLAUDE=1
  else
    select_platforms
  fi
fi

log "hicode Coding Agent installer"
log "Mode: $([ "$UNINSTALL" -eq 1 ] && printf 'uninstall' || printf 'install')"
log "Dry run: $DRY_RUN"
log "Claude Code: $INSTALL_CLAUDE"
log "Claude Code scope: $INSTALL_SCOPE"
log "OpenCode: $INSTALL_OPENCODE"
log "OpenCode scope: $OPENCODE_SCOPE"
log "OpenCode config dir: $OPENCODE_CONFIG_DIR"
log "OpenCode project dir: $OPENCODE_PROJECT_DIR"
log "Codex: $INSTALL_CODEX"
log "Codex scope: $CODEX_SCOPE"
log "Codex user marketplace: $CODEX_USER_MARKETPLACE_PATH"
log "Codex user plugin root: $CODEX_USER_PLUGIN_ROOT"
log "Codex project dir: $CODEX_PROJECT_DIR"
log ""
log "This installer exposes only Claude Code/Codex plugin runtime assets or transformed OpenCode runtime assets."
log "This installer will not install repository docs/archive as runtime assets."
log "This installer will not scan code, generate CLAUDE.md, generate AGENTS.md, or create .hicode/."

confirm

run_platform "$INSTALL_CLAUDE" install_claude_code uninstall_claude_code
run_platform "$INSTALL_OPENCODE" install_opencode uninstall_opencode
run_platform "$INSTALL_CODEX" install_codex uninstall_codex

log ""
if [ "$DRY_RUN" -eq 1 ]; then
  log "Dry run complete. No files or user configuration were changed."
elif [ "$UNINSTALL" -eq 1 ]; then
  log "hicode uninstallation complete."
else
  log "hicode installation complete."
fi
