#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

failures=0

pass() {
  printf 'PASS %s\n' "$1"
}

fail() {
  printf 'FAIL %s\n' "$1" >&2
  failures=$((failures + 1))
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    fail "missing required command: $1"
  else
    pass "found required command: $1"
  fi
}

check_no_match() {
  local label="$1"
  local pattern="$2"
  shift 2

  local output
  set +e
  output="$(rg -n "$pattern" "$@" 2>&1)"
  local status=$?
  set -e

  if [ "$status" -eq 0 ]; then
    fail "$label"
    printf '%s\n' "$output" >&2
  elif [ "$status" -eq 1 ]; then
    pass "$label"
  else
    fail "$label: rg failed"
    printf '%s\n' "$output" >&2
  fi
}

check_match() {
  local label="$1"
  local pattern="$2"
  shift 2

  if rg -n "$pattern" "$@" >/dev/null; then
    pass "$label"
  else
    fail "$label"
  fi
}

check_cmd() {
  local label="$1"
  shift

  if "$@" >/dev/null; then
    pass "$label"
  else
    fail "$label"
  fi
}

require_command rg
require_command node
require_command bash
require_command git

check_no_match \
  "current runtime assets do not reference archive or retired references paths" \
  '(archive/|references/(prompts|skills|gates|schemas|examples|init|target-project)|\.hicode/(prompts|skills|gates|schemas|agents|hooks)|docs/review-rules|AGENT_PROMPT_INTEGRATION)' \
  skills agents references/rules references/templates references/hooks

check_no_match \
  "skill entries do not read shared or repository references directly" \
  '(_shared|hicode-shared|references/(rules|templates))' \
  skills/hi/SKILL.md skills/init/SKILL.md skills/scope/SKILL.md skills/tdd/SKILL.md skills/review/SKILL.md skills/release/SKILL.md

check_no_match \
  "runtime assets do not reference removed shared runtime assets" \
  '(_shared|hicode-shared)' \
  skills agents install.sh .claude-plugin/plugin.json

check_no_match \
  "non-init skill entries do not read local coding_rules seed" \
  'coding_rules\.md' \
  skills/hi/SKILL.md skills/scope/SKILL.md skills/tdd/SKILL.md skills/review/SKILL.md skills/release/SKILL.md

check_no_match \
  "agents do not read repository references directly" \
  'references/(rules|templates)' \
  agents

check_no_match \
  "plugin manifest does not expose docs, archive, or retired references" \
  '("\./docs/?|"docs/"|"\./archive/?|"archive/"|"references/(prompts|skills|gates|schemas|examples|init|target-project))' \
  .claude-plugin/plugin.json

check_no_match \
  "installer does not create .hicode or generate entry files" \
  'mkdir .*\.hicode|touch .*CLAUDE|touch .*AGENTS|cat >.*CLAUDE|cat >.*AGENTS' \
  install.sh

check_no_match \
  "agents do not duplicate old generic rule sections" \
  'Prompt 防护基线|默认权限：|受限命令：|停止推进时必须说明' \
  agents

check_match \
  "current assets retain safety and production red-line language" \
  '安全红线|生产|密钥|客户敏感|自动合并|自动发布' \
  skills agents references/rules references/templates references/hooks

agent_common_count="$(rg -l '^## 2\. Agent 共性规则$' agents/*.md | wc -l | tr -d ' ')"
if [ "$agent_common_count" = "9" ]; then
  pass "all 8 agents and agent template reference Agent common rules"
else
  fail "expected 9 agent common-rule sections, found $agent_common_count"
fi

check_cmd \
  "plugin manifests parse as JSON" \
  node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8')); JSON.parse(require('fs').readFileSync('.claude-plugin/marketplace.json','utf8'))"

check_cmd \
  "plugin manifest exposes only agents and skills runtime assets" \
  node -e "const p=JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8')); if (!Array.isArray(p.skills) || p.skills.length !== 1 || p.skills[0] !== './skills/') process.exit(1); if (!Array.isArray(p.agents) || p.agents.length !== 1 || p.agents[0] !== './agents/') process.exit(1)"

check_cmd \
  "removed shared runtime directory is absent" \
  bash -c "[ ! -e skills/_shared ]"

check_cmd \
  "skill runtime documents are flat under each skill root" \
  bash -c "[ -z \"\$(find skills -mindepth 2 -type d -print -quit)\" ]"

check_cmd \
  "scenario skills do not carry duplicated README lifecycle copies" \
  bash -c "for skill in scope tdd review release; do [ ! -e skills/\$skill/README.md ] || exit 1; done"

check_cmd \
  "scenario skill entries do not reference local README lifecycle copies" \
  bash -c "! rg -n 'README\\.md' skills/scope/SKILL.md skills/tdd/SKILL.md skills/review/SKILL.md skills/release/SKILL.md"

check_cmd \
  "hicode entry section carries feature document lifecycle rules" \
  node -e "const fs=require('fs'); for (const f of ['references/templates/project/hicode-entry-section.md','skills/init/hicode-entry-section.md']) { const s=fs.readFileSync(f,'utf8'); for (const needle of ['## hicode 单需求文档生命周期','docs/features/<feature-id>/','不得编造','不代表最终审批']) { if (!s.includes(needle)) process.exit(1); } }"

check_cmd \
  "init seed rule mirrors references source file" \
  bash -c "diff -q references/rules/coding_rules.md skills/init/coding_rules.md >/dev/null"

check_cmd \
  "non-init skills do not carry local coding_rules seed copies" \
  bash -c "for skill in hi scope tdd review release; do [ ! -e skills/\$skill/coding_rules.md ] || exit 1; done"

check_cmd \
  "skill-local template copies mirror references source files" \
  bash -c "diff -q references/templates/project/hicode-entry-section.md skills/init/hicode-entry-section.md >/dev/null && diff -q references/templates/project/DOMAIN_KNOWLEDGE.md skills/init/DOMAIN_KNOWLEDGE.md >/dev/null && diff -q references/templates/project/PROJ_CONTEXT.md skills/init/PROJ_CONTEXT.md >/dev/null && diff -q references/templates/project/ADR-template.md skills/init/ADR-template.md >/dev/null && diff -q references/templates/feature/feature_context.md skills/scope/feature_context.md >/dev/null && diff -q references/templates/feature/requirement-review-report.md skills/scope/requirement-review-report.md >/dev/null && diff -q references/templates/feature/scope-report.md skills/scope/scope-report.md >/dev/null && diff -q references/templates/feature/task-split-plan.md skills/scope/task-split-plan.md >/dev/null && diff -q references/templates/project/ADR-template.md skills/scope/ADR-template.md >/dev/null && diff -q references/templates/feature/tdd-report.md skills/tdd/tdd-report.md >/dev/null && diff -q references/templates/feature/review-report.md skills/review/review-report.md >/dev/null && diff -q references/templates/feature/release-report.md skills/release/release-report.md >/dev/null"

check_cmd "hook config parses as JSON" node -e "JSON.parse(require('fs').readFileSync('references/hooks/hook.json','utf8'))"
check_cmd "hook catalog and documentation stay aligned" node -e "
const fs = require('fs');
const catalog = JSON.parse(fs.readFileSync('references/hooks/hook.json','utf8'));
if (catalog.default_mode !== 'advisory' || catalog.auto_enable !== false) process.exit(1);
const tick = String.fromCharCode(96);
for (const hook of catalog.hooks || []) {
  if (!hook.id || !hook.documentation || !hook.default_mode) process.exit(1);
  const doc = fs.readFileSync(hook.documentation, 'utf8');
  if (!doc.includes('| Hook ID | ' + tick + hook.id + tick + ' |')) process.exit(1);
  if (!doc.includes('| 默认模式 | ' + tick + hook.default_mode + tick + ' |')) process.exit(1);
  for (const rule of hook.rules || []) {
    if (!doc.includes(rule)) process.exit(1);
  }
  if (!doc.includes('Blocking 条件') || !doc.includes('禁止动作')) process.exit(1);
}
"
check_cmd "install.sh shell syntax is valid" bash -n install.sh
check_cmd "install dry-run succeeds without touching target projects" bash install.sh --dry-run --yes
check_cmd "opencode install dry-run succeeds without touching target projects" bash install.sh --opencode --dry-run --yes
check_cmd "dual-platform install dry-run succeeds without touching target projects" bash install.sh --all --dry-run --yes
check_cmd "git diff has no whitespace errors" git diff --check

if [ "$failures" -gt 0 ]; then
  printf '\nhicode health check failed: %s issue(s)\n' "$failures" >&2
  exit 1
fi

printf '\nhicode health check passed\n'
