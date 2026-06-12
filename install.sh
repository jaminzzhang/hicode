#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_PLUGIN_DIR="$SCRIPT_DIR"
MARKETPLACE_NAME="hicode"
PLUGIN_NAME="hicode"
INSTALL_SCOPE="user"
OPENCODE_SCOPE="user"
OPENCODE_CONFIG_DIR="${OPENCODE_CONFIG_DIR:-$HOME/.config/opencode}"
OPENCODE_PROJECT_DIR="$PWD"

INSTALL_CLAUDE=0
INSTALL_OPENCODE=0
DRY_RUN=0
YES=0

usage() {
  cat <<'USAGE'
hicode Coding Agent installer

Usage:
  install.sh [--claude-code] [--opencode] [--all] [--scope user|local|project] [--opencode-scope user|project] [--dry-run] [--yes]

Options:
  --claude-code          Install the hicode Claude Code plugin. Default when no platform is specified.
  --opencode            Install hicode agents and skills for OpenCode.
  --all                 Install both Claude Code plugin and OpenCode runtime assets.
  --scope               Claude Code install scope. Default: user.
  --opencode-scope      OpenCode install scope: user or project. Default: user.
  --opencode-config-dir OpenCode user config directory. Default: $OPENCODE_CONFIG_DIR or ~/.config/opencode.
  --opencode-project-dir
                       Target project directory for --opencode-scope project. Default: current directory.
  --dry-run             Print the installation plan without changing user configuration.
  --yes                 Run without interactive confirmation.
  -h, --help            Show this help.

This installer supports Claude Code plugin installation and OpenCode local agents/skills installation.
It exposes only runtime assets declared in .claude-plugin/plugin.json or transformed runtime assets copied from skills/ and agents/.
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

validate_opencode_scope() {
  case "$OPENCODE_SCOPE" in
    user|project) ;;
    *) die "Invalid --opencode-scope value: $OPENCODE_SCOPE. Expected user or project." ;;
  esac
}

validate_plugin_assets() {
  [ -d "$CLAUDE_PLUGIN_DIR/.claude-plugin" ] || die "Missing Claude plugin manifest directory: $CLAUDE_PLUGIN_DIR/.claude-plugin"
  [ -f "$CLAUDE_PLUGIN_DIR/.claude-plugin/plugin.json" ] || die "Missing Claude plugin manifest: $CLAUDE_PLUGIN_DIR/.claude-plugin/plugin.json"
  [ -f "$CLAUDE_PLUGIN_DIR/.claude-plugin/marketplace.json" ] || die "Missing Claude marketplace manifest: $CLAUDE_PLUGIN_DIR/.claude-plugin/marketplace.json"

  for skill in hi init scope tdd review release; do
    [ -f "$CLAUDE_PLUGIN_DIR/skills/$skill/SKILL.md" ] || die "Missing skill entry: $CLAUDE_PLUGIN_DIR/skills/$skill/SKILL.md"
  done

  for agent in requirement-reviewer coding-planner tdd-guide coding-assistant code-reviewer security-reviewer java-reviewer release-reviewer; do
    [ -f "$CLAUDE_PLUGIN_DIR/agents/$agent.md" ] || die "Missing agent entry: $CLAUDE_PLUGIN_DIR/agents/$agent.md"
  done

  [ -f "$CLAUDE_PLUGIN_DIR/skills/_shared/rules/coding_rules.md" ] || die "Missing runtime shared rule: $CLAUDE_PLUGIN_DIR/skills/_shared/rules/coding_rules.md"
  [ -f "$CLAUDE_PLUGIN_DIR/skills/_shared/templates/README.md" ] || die "Missing runtime shared template index: $CLAUDE_PLUGIN_DIR/skills/_shared/templates/README.md"
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
  log "  Runtime assets: agents/ and skills/ declared by .claude-plugin/plugin.json"
  log "  Runtime shared assets: skills/_shared/ rules and templates"
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

install_opencode() {
  validate_plugin_assets
  validate_opencode_scope

  local opencode_skills_dir
  local opencode_agents_dir
  if [ "$OPENCODE_SCOPE" = "user" ]; then
    opencode_skills_dir="$OPENCODE_CONFIG_DIR/skills"
    opencode_agents_dir="$OPENCODE_CONFIG_DIR/agents"
  else
    opencode_skills_dir="$OPENCODE_PROJECT_DIR/.opencode/skills"
    opencode_agents_dir="$OPENCODE_PROJECT_DIR/.opencode/agents"
  fi

  log ""
  log "OpenCode plan:"
  log "  Scope: $OPENCODE_SCOPE"
  log "  Skills target: $opencode_skills_dir"
  log "  Agents target: $opencode_agents_dir"
  log "  Skills installed as: hicode-hi, hicode-init, hicode-scope, hicode-tdd, hicode-review, hicode-release"
  log "  Shared runtime assets: hicode-shared"
  log "  Agents installed as: hicode-<agent-name>.md"
  log "  Excluded from runtime: docs/, archive/, historical references/"
  log "  Action: copy transformed hicode skills and agents into OpenCode directories"

  if [ "$DRY_RUN" -eq 1 ]; then
    log "+ mkdir -p \"$opencode_skills_dir\" \"$opencode_agents_dir\""
    log "+ install transformed skills/_shared to \"$opencode_skills_dir/hicode-shared\""
    log "+ install transformed skills/{hi,init,scope,tdd,review,release} to \"$opencode_skills_dir/hicode-*\""
    log "+ install transformed agents/*.md to \"$opencode_agents_dir/hicode-*.md\""
    return 0
  fi

  run_cmd mkdir -p "$opencode_skills_dir" "$opencode_agents_dir"

  node - "$CLAUDE_PLUGIN_DIR" "$opencode_skills_dir" "$opencode_agents_dir" <<'NODE'
const fs = require("fs");
const path = require("path");

const root = process.argv[2];
const skillsOut = process.argv[3];
const agentsOut = process.argv[4];
const skillNames = ["hi", "init", "scope", "tdd", "review", "release"];
const agentNames = [
  "requirement-reviewer",
  "coding-planner",
  "tdd-guide",
  "coding-assistant",
  "code-reviewer",
  "security-reviewer",
  "java-reviewer",
  "release-reviewer",
];

function assertSafeOwnedTarget(target, allowedPrefix) {
  const base = path.basename(target);
  if (base !== allowedPrefix && !base.startsWith(`${allowedPrefix}-`)) {
    throw new Error(`Refusing to replace non-hicode target: ${target}`);
  }
}

function resetTarget(target, allowedPrefix) {
  assertSafeOwnedTarget(target, allowedPrefix);
  fs.rmSync(target, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function upsertFrontmatterName(content, name) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return `---\nname: ${name}\n---\n\n${content}`;

  const body = content.slice(match[0].length);
  const lines = match[1].split("\n").filter((line) => !line.match(/^name\s*:/));
  return `---\nname: ${name}\n${lines.join("\n")}\n---\n${body}`;
}

function transformSkillContent(content, name) {
  return upsertFrontmatterName(content, name).replaceAll("../_shared/", "../hicode-shared/");
}

function transformAgentContent(content, name) {
  let next = upsertFrontmatterName(content, name);
  next = next.replaceAll(
    "../skills/_shared/rules/coding_rules.md",
    path.join(skillsOut, "hicode-shared/rules/coding_rules.md")
  );
  next = next.replaceAll(
    "../skills/_shared/templates/",
    path.join(skillsOut, "hicode-shared/templates") + path.sep
  );
  next = next.replaceAll(
    "references/rules/coding_rules.md",
    path.join(skillsOut, "hicode-shared/rules/coding_rules.md")
  );
  next = next.replaceAll(
    "references/templates/",
    path.join(skillsOut, "hicode-shared/templates") + path.sep
  );
  for (const skill of skillNames) {
    next = next.replaceAll(
      `../skills/${skill}/SKILL.md`,
      path.join(skillsOut, `hicode-${skill}/SKILL.md`)
    );
    next = next.replaceAll(
      `skills/${skill}/SKILL.md`,
      path.join(skillsOut, `hicode-${skill}/SKILL.md`)
    );
  }
  return next;
}

const sharedDest = path.join(skillsOut, "hicode-shared");
resetTarget(sharedDest, "hicode-shared");
copyDir(path.join(root, "skills/_shared"), sharedDest);

for (const skill of skillNames) {
  const dest = path.join(skillsOut, `hicode-${skill}`);
  resetTarget(dest, "hicode");
  copyDir(path.join(root, "skills", skill), dest);
  const skillPath = path.join(dest, "SKILL.md");
  fs.writeFileSync(
    skillPath,
    transformSkillContent(fs.readFileSync(skillPath, "utf8"), `hicode-${skill}`)
  );
}

for (const agent of agentNames) {
  const dest = path.join(agentsOut, `hicode-${agent}.md`);
  assertSafeOwnedTarget(dest, "hicode");
  const source = path.join(root, "agents", `${agent}.md`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(
    dest,
    transformAgentContent(fs.readFileSync(source, "utf8"), `hicode-${agent}`)
  );
}
NODE
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --claude-code)
      INSTALL_CLAUDE=1
      ;;
    --opencode)
      INSTALL_OPENCODE=1
      ;;
    --all)
      INSTALL_CLAUDE=1
      INSTALL_OPENCODE=1
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
fi

log "hicode Coding Agent installer"
log "Dry run: $DRY_RUN"
log "Claude Code: $INSTALL_CLAUDE"
log "Claude Code install scope: $INSTALL_SCOPE"
log "OpenCode: $INSTALL_OPENCODE"
log "OpenCode install scope: $OPENCODE_SCOPE"
log "OpenCode config dir: $OPENCODE_CONFIG_DIR"
log "OpenCode project dir: $OPENCODE_PROJECT_DIR"
log ""
log "This installer exposes only plugin runtime assets declared in .claude-plugin/plugin.json or transformed OpenCode runtime assets."
log "This installer will not install repository docs/archive as runtime assets."
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
  log "hicode installation complete."
fi
