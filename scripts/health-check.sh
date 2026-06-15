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
require_command claude

check_no_match \
  "current runtime assets do not reference archive or retired references paths" \
  '(archive/|references/|\.hicode/(prompts|skills|gates|schemas|agents|hooks)|docs/review-rules|AGENT_PROMPT_INTEGRATION)' \
  skills agents hooks

check_no_match \
  "skill entries do not read shared or repository references directly" \
  '(_shared|hicode-shared|references/)' \
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
  'references/' \
  agents

check_no_match \
  "plugin manifest does not expose docs, archive, or retired references" \
  '(\./docs/?|docs/|\./archive/?|archive/|references/)' \
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
  skills agents hooks

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
  "Claude plugin manifest validates directly" \
  claude plugin validate .claude-plugin/plugin.json

check_cmd \
  "Claude marketplace manifest validates" \
  claude plugin validate .claude-plugin/marketplace.json

check_cmd \
  "plugin manifest exposes only supported runtime path declarations" \
  node -e "const p=JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8')); if (!Array.isArray(p.skills) || p.skills.length !== 1 || p.skills[0] !== './skills/') process.exit(1); if (Object.prototype.hasOwnProperty.call(p, 'agents')) process.exit(1);"

check_cmd \
  "Claude install dry-run scopes marketplace registration and plugin install consistently" \
  bash -c "bash install.sh --claude-code --scope project --dry-run --yes | rg 'claude plugin marketplace add .+ --scope \"project\"' >/dev/null && bash install.sh --claude-code --scope project --dry-run --yes | rg 'claude plugin install \"hicode@hicode\" --scope \"project\"' >/dev/null"

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
  node -e "const fs=require('fs'); const s=fs.readFileSync('skills/init/hicode-entry-section.md','utf8'); for (const needle of ['## hicode 单需求文档生命周期','docs/features/<feature-id>/','不得编造','不代表最终审批']) { if (!s.includes(needle)) process.exit(1); }"

check_cmd \
  "init seed rule exists only under init skill root" \
  bash -c "[ -f skills/init/coding_rules.md ] && [ ! -e references ]"

check_cmd \
  "non-init skills do not carry local coding_rules seed copies" \
  bash -c "for skill in hi scope tdd review release; do [ ! -e skills/\$skill/coding_rules.md ] || exit 1; done"

check_cmd \
  "skill-local runtime documents are present and duplicate references directory is absent" \
  bash -c "for f in skills/init/hicode-entry-section.md skills/init/DOMAIN_KNOWLEDGE.md skills/init/PROJ_CONTEXT.md skills/init/ADR-template.md skills/scope/feature_context.md skills/scope/requirement-review-report.md skills/scope/scope-report.md skills/scope/task-split-plan.md skills/scope/ADR-template.md skills/tdd/tdd-report.md skills/review/review-report.md skills/release/release-report.md; do [ -f \"\$f\" ] || exit 1; done; [ ! -e references ]"

check_cmd \
  "unreferenced hook template is absent" \
  bash -c "[ ! -e hooks/_hook-template.md ]"

check_cmd "hook config parses as JSON" node -e "JSON.parse(require('fs').readFileSync('hooks/hook.json','utf8'))"
check_cmd "hook catalog and documentation stay aligned" node -e "
const fs = require('fs');
const catalog = JSON.parse(fs.readFileSync('hooks/hook.json','utf8'));
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
check_cmd "codex install dry-run targets global agent skills directory" bash -c "bash install.sh --codex --dry-run --yes | rg \"Skills target: $HOME/.agents/skills\" >/dev/null"
check_cmd "codex project install dry-run targets project agent skills directory" bash -c "tmp=\"\$(mktemp -d)\"; bash install.sh --codex --codex-scope project --codex-project-dir \"\$tmp\" --dry-run --yes | rg \"Skills target: \$tmp/.agents/skills\" >/dev/null"
check_cmd "opencode transformed skill frontmatter names match directories" bash -c "tmp=\"\$(mktemp -d)\"; bash install.sh --opencode --opencode-config-dir \"\$tmp\" --yes >/dev/null; node -e \"const fs=require('fs'),path=require('path'); const dir=process.argv[1]; for (const entry of fs.readdirSync(dir,{withFileTypes:true})) { if (!entry.isDirectory()) continue; const skill=path.join(dir,entry.name,'SKILL.md'); const text=fs.readFileSync(skill,'utf8'); const match=text.match(/^---\\n([\\s\\S]*?)\\n---/); if (!match || !match[1].split('\\n').some(line => line.trim() === 'name: '+entry.name)) process.exit(1); }\" \"\$tmp/skills\""
check_cmd "opencode transformed agents use filename identity and subagent mode" bash -c "tmp=\"\$(mktemp -d)\"; bash install.sh --opencode --opencode-config-dir \"\$tmp\" --yes >/dev/null; node -e \"const fs=require('fs'),path=require('path'); const dir=process.argv[1]; for (const entry of fs.readdirSync(dir,{withFileTypes:true})) { if (!entry.isFile() || !entry.name.endsWith('.md')) continue; const text=fs.readFileSync(path.join(dir,entry.name),'utf8'); const match=text.match(/^---\\n([\\s\\S]*?)\\n---/); if (!match) process.exit(1); const lines=match[1].split('\\n').map(line => line.trim()); if (lines.some(line => line.startsWith('name:'))) process.exit(1); if (!lines.includes('mode: subagent')) process.exit(1); }\" \"\$tmp/agents\""
check_cmd "codex transformed skill frontmatter names match directories" bash -c "tmp=\"\$(mktemp -d)\"; bash install.sh --codex --codex-scope project --codex-project-dir \"\$tmp\" --yes >/dev/null; node -e \"const fs=require('fs'),path=require('path'); const dir=process.argv[1]; for (const entry of fs.readdirSync(dir,{withFileTypes:true})) { if (!entry.isDirectory()) continue; const skill=path.join(dir,entry.name,'SKILL.md'); const text=fs.readFileSync(skill,'utf8'); const match=text.match(/^---\\n([\\s\\S]*?)\\n---/); if (!match || !match[1].split('\\n').some(line => line.trim() === 'name: '+entry.name)) process.exit(1); }\" \"\$tmp/.agents/skills\""
check_cmd "git diff has no whitespace errors" git diff --check

if [ "$failures" -gt 0 ]; then
  printf '\nhicode health check failed: %s issue(s)\n' "$failures" >&2
  exit 1
fi

printf '\nhicode health check passed\n'
