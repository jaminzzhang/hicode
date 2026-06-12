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
  "plugin manifest does not expose docs, archive, or retired references" \
  '("\./docs/?|"docs/"|"\./archive/?|"archive/"|"references/(prompts|skills|gates|schemas|examples|init|target-project))' \
  .claude-plugin/plugin.json

check_no_match \
  "installer does not copy assets, create .hicode, or generate entry files" \
  '\b(cp|rsync|ditto|tar)\b|mkdir .*\.hicode|touch .*CLAUDE|touch .*AGENTS' \
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
  "plugin manifest exposes only skills runtime asset" \
  node -e "const p=JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8')); if (!Array.isArray(p.skills) || p.skills.length !== 1 || p.skills[0] !== './skills/') process.exit(1)"

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
check_cmd "git diff has no whitespace errors" git diff --check

if [ "$failures" -gt 0 ]; then
  printf '\nhicode health check failed: %s issue(s)\n' "$failures" >&2
  exit 1
fi

printf '\nhicode health check passed\n'
