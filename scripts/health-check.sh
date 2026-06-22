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
require_command uv
require_command claude
require_command codex

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
  skills agents install.sh .claude-plugin/plugin.json .codex-plugin/plugin.json

check_no_match \
  "non-init skill entries do not read local coding_rules seed" \
  'coding_rules\.md' \
  skills/hi/SKILL.md skills/scope/SKILL.md skills/tdd/SKILL.md skills/review/SKILL.md skills/release/SKILL.md

check_no_match \
  "agents do not read repository references directly" \
  'references/' \
  agents

check_no_match \
  "plugin manifests do not expose docs, archive, or retired references" \
  '(\./docs/?|docs/|\./archive/?|archive/|references/)' \
  .claude-plugin/plugin.json .codex-plugin/plugin.json

check_no_match \
  "plugin manifests do not expose skill-opt management assets" \
  'skill-opt' \
  .claude-plugin/plugin.json .codex-plugin/plugin.json

check_no_match \
  "installer does not create .hicode or generate entry files" \
  'mkdir .*\.hicode|touch .*CLAUDE|touch .*AGENTS|cat >.*CLAUDE|cat >.*AGENTS' \
  install.sh

check_no_match \
  "installer does not copy skill-opt management assets" \
  'skill-opt' \
  install.sh scripts/install.js scripts/install-opencode.js scripts/install-codex.js

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
  node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8')); JSON.parse(require('fs').readFileSync('.claude-plugin/marketplace.json','utf8')); JSON.parse(require('fs').readFileSync('.codex-plugin/plugin.json','utf8'))"

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
  "Codex plugin manifest exposes skills through plugin schema" \
  node -e "const p=JSON.parse(require('fs').readFileSync('.codex-plugin/plugin.json','utf8')); if (p.name !== 'hicode' || p.skills !== './skills/') process.exit(1); if (Object.prototype.hasOwnProperty.call(p, 'agents') || Object.prototype.hasOwnProperty.call(p, 'hooks')) process.exit(1); const i=p.interface || {}; for (const key of ['displayName','shortDescription','longDescription','developerName','category']) { if (typeof i[key] !== 'string' || !i[key].trim()) process.exit(1); } if (!Array.isArray(i.capabilities) || i.capabilities.length === 0) process.exit(1); const prompts=i.defaultPrompt || i.default_prompt; if (!Array.isArray(prompts) || prompts.length === 0 || prompts.length > 3) process.exit(1);"

check_no_match \
  "scenario skills do not read root agents support assets" \
  '\.\./\.\./agents/' \
  skills/hi/SKILL.md skills/scope/SKILL.md skills/tdd/SKILL.md skills/review/SKILL.md skills/release/SKILL.md

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
  "hicode entry section carries feature lifecycle and project report rules" \
  node -e "const fs=require('fs'); const s=fs.readFileSync('skills/init/hicode-entry-section.md','utf8'); for (const needle of ['## hicode 单需求文档生命周期','docs/features/<feature-id>/','doc/versions/review-report-<YYYYMMDD-HHmm>.md','doc/versions/release-report-<YYYYMMDD-HHmm>.md','不放入某个 feature 目录','不得编造','不代表最终审批']) { if (!s.includes(needle)) process.exit(1); }"

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
  "skill-opt planning skeleton is present" \
  bash -c "for f in skill-opt/docs/IMPLEMENTATION_PLAN.md skill-opt/docs/DATASET_SPEC.md skill-opt/docs/EVALUATOR_SPEC.md skill-opt/docs/ADOPTION_PROCESS.md skill-opt/scripts/README.md skill-opt/outputs/README.md; do [ -f \"\$f\" ] || exit 1; done"

check_cmd \
  "skill-opt outputs are gitignored except README" \
  bash -c "git check-ignore -q skill-opt/outputs/local-run.log && ! git check-ignore -q skill-opt/outputs/README.md"

check_no_match \
  "skill-opt docs and seed data do not include obvious secret-like examples" \
  '(sk-[A-Za-z0-9]{12,}|AKIA[0-9A-Z]{16}|BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY|password\s*=|jdbc:[^[:space:]]+@|://[^[:space:]]+:[^[:space:]@]+@)' \
  skill-opt/docs skill-opt/data

check_cmd \
  "skill-opt script syntax is valid" \
  bash -c "for f in skill-opt/scripts/*.js; do node --check \"\$f\" || exit 1; done"

check_cmd \
  "skill-opt shell script syntax is valid" \
  bash -c "for f in skill-opt/scripts/*.sh skill-opt/tests/*.sh; do bash -n \"\$f\" || exit 1; done"

check_cmd \
  "skill-opt unit tests pass" \
  node --test skill-opt/tests/*.test.js

check_cmd \
  "skill-opt Python runner syntax is valid" \
  bash -c "uv run python -m py_compile skill-opt/scripts/run-review-train.py skill-opt/scripts/run-review-skillopt-eval.py skill-opt/scripts/python/hicode_review_skillopt/*.py"

check_cmd \
  "skill-opt Python runner unit tests pass" \
  uv run python -m unittest discover -s skill-opt/tests/python

check_cmd \
  "skill-opt review seed dataset validates" \
  node skill-opt/scripts/validate-review-dataset.js skill-opt/data/review-golden/items.jsonl

check_cmd \
  "skill-opt candidate summary handles missing candidate" \
  bash -c "tmp=\"\$(mktemp -d)\"; node skill-opt/scripts/summarize-review-candidate.js health-check-missing --outputs-root \"\$tmp/outputs\" --docs-runs-dir \"\$tmp/docs/runs\" >/dev/null; rg 'WAIT_FOR_CANDIDATE' \"\$tmp/docs/runs/health-check-missing-candidate.md\" >/dev/null"

check_cmd \
  "skill-opt train dry-run writes split and SkillOpt args without model calls" \
  bash -c "tmp=\"\$(mktemp -d)\"; uv run python skill-opt/scripts/run-review-train.py --run-id health-check-train-dry-run --outputs-root \"\$tmp/outputs\" --dry-run --target-model smoke-model >/dev/null && [ -f \"\$tmp/outputs/health-check-train-dry-run/split/train/items.json\" ] && [ -f \"\$tmp/outputs/health-check-train-dry-run/train-dry-run.json\" ] && [ ! -e \"\$tmp/outputs/health-check-train-dry-run/review-outputs\" ] && node -e \"const fs=require('fs'); const p='\$tmp/outputs/health-check-train-dry-run/train-dry-run.json'; const d=JSON.parse(fs.readFileSync(p,'utf8')); if (!Array.isArray(d.skillopt_args) || !d.skillopt_args.includes('hicode_review')) process.exit(1);\""

check_cmd \
  "skill-opt DeepSeek train wrapper dry-run uses official SkillOpt env" \
  bash skill-opt/tests/test_deepseek_wrapper.sh

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
check_cmd "cross-platform Node installer syntax is valid" node --check scripts/install.js
check_cmd "skill trigger regression checker syntax is valid" node --check scripts/check-skill-trigger-regression.js
check_cmd "skill description and trigger regression contract is complete" node scripts/check-skill-trigger-regression.js
check_cmd "PowerShell installer delegates to Node core" bash -c "[ -f install.ps1 ] && rg 'scripts/install\\.js' install.ps1 >/dev/null"
check_cmd "installer node adapters are syntactically valid" node --check scripts/install-opencode.js
check_cmd "codex installer node adapter is syntactically valid" node --check scripts/install-codex.js
check_cmd "install dry-run succeeds without touching target projects" bash install.sh --dry-run --yes
check_cmd "Node installer dry-run succeeds without touching target projects" node scripts/install.js --all --dry-run --yes
check_cmd "install dry-run reports host platform support" bash -c "bash install.sh --all --dry-run --yes | rg 'Host platform:' >/dev/null"
check_cmd "PowerShell installer keeps platform flags aligned" bash -c "rg 'Param\\(' install.ps1 >/dev/null && rg '\\[switch\\]\\\$Codex' install.ps1 >/dev/null && rg '\\[switch\\]\\\$OpenCode' install.ps1 >/dev/null && rg '\\[switch\\]\\\$ClaudeCode' install.ps1 >/dev/null"
check_cmd "opencode install dry-run succeeds without touching target projects" bash install.sh --opencode --dry-run --yes
check_cmd "dual-platform install dry-run succeeds without touching target projects" bash install.sh --all --dry-run --yes
check_cmd "uninstall dry-run succeeds without touching target projects" bash install.sh --uninstall --all --dry-run --yes
check_cmd "interactive uninstall prompt uses uninstall wording" bash -c "printf 'a\n' | bash install.sh --uninstall --dry-run | rg 'Select target platform\\(s\\) to uninstall hicode' >/dev/null"
check_cmd "Claude uninstall dry-run scopes plugin uninstall consistently" bash -c "bash install.sh --uninstall --claude-code --scope project --dry-run --yes | rg 'claude plugin uninstall \"hicode@hicode\" --scope \"project\"' >/dev/null"
check_cmd "Claude uninstall is idempotent when plugin is already absent" bash -c "tmp=\"\$(mktemp -d)\"; printf '%s\n' '#!/usr/bin/env bash' 'echo \"Failed to uninstall plugin hicode@hicode: Plugin hicode@hicode not found in installed plugins\" >&2' 'exit 1' > \"\$tmp/claude\"; chmod +x \"\$tmp/claude\"; PATH=\"\$tmp:\$PATH\" bash install.sh --uninstall --claude-code --yes 2>/dev/null | rg 'already absent; continuing' >/dev/null"
check_cmd "codex install dry-run uses marketplace-backed plugin install" bash -c "out=\"\$(bash install.sh --codex --dry-run --yes)\"; printf '%s\n' \"\$out\" | rg 'Marketplace file: .*/\\.agents/plugins/marketplace\\.json' >/dev/null && printf '%s\n' \"\$out\" | rg 'Plugin bundle target: .*/plugins/hicode' >/dev/null && printf '%s\n' \"\$out\" | rg 'copy \\.codex-plugin/ and skills/ to' >/dev/null && printf '%s\n' \"\$out\" | rg 'codex plugin add \"hicode@' >/dev/null && ! printf '%s\n' \"\$out\" | rg 'Skills target|\\.agents/skills|copy .+agents/' >/dev/null"
check_cmd "codex uninstall dry-run uses marketplace-backed plugin remove" bash -c "out=\"\$(bash install.sh --uninstall --codex --dry-run --yes)\"; printf '%s\n' \"\$out\" | rg 'Marketplace file: .*/\\.agents/plugins/marketplace\\.json' >/dev/null && printf '%s\n' \"\$out\" | rg 'Plugin bundle target: .*/plugins/hicode' >/dev/null && printf '%s\n' \"\$out\" | rg 'codex plugin remove \"hicode@' >/dev/null && printf '%s\n' \"\$out\" | rg 'remove marketplace entry \"hicode\"' >/dev/null && printf '%s\n' \"\$out\" | rg 'remove plugin bundle' >/dev/null"
check_cmd "codex uninstall is idempotent when plugin is already absent" bash -c "tmp=\"\$(mktemp -d)\"; mkdir -p \"\$tmp/project\"; printf '%s\n' '#!/usr/bin/env bash' 'echo \"Plugin hicode@hicode-project not found\" >&2' 'exit 1' > \"\$tmp/codex\"; chmod +x \"\$tmp/codex\"; PATH=\"\$tmp:\$PATH\" bash install.sh --uninstall --codex --codex-scope project --codex-project-dir \"\$tmp/project\" --yes 2>/dev/null | rg 'hicode@hicode-project already absent; continuing' >/dev/null"
check_cmd "codex project install dry-run uses repo marketplace path" bash -c "tmp=\"\$(mktemp -d)\"; out=\"\$(bash install.sh --codex --codex-scope project --codex-project-dir \"\$tmp\" --dry-run --yes)\"; printf '%s\n' \"\$out\" | rg \"Marketplace file: \$tmp/.agents/plugins/marketplace.json\" >/dev/null && printf '%s\n' \"\$out\" | rg \"Plugin bundle target: \$tmp/plugins/hicode\" >/dev/null && printf '%s\n' \"\$out\" | rg \"cd \\\"\$tmp\\\" && codex plugin add \\\"hicode@\" >/dev/null"
check_cmd "codex project plugin install writes marketplace-backed bundle" bash -c "tmp=\"\$(mktemp -d)\"; HICODE_CODEX_SKIP_ADD=1 bash install.sh --codex --codex-scope project --codex-project-dir \"\$tmp\" --yes >/dev/null; node -e \"const fs=require('fs'),path=require('path'); const root=process.argv[1]; const market=JSON.parse(fs.readFileSync(path.join(root,'.agents/plugins/marketplace.json'),'utf8')); const entry=market.plugins.find(p=>p.name==='hicode'); if (!entry || entry.source.source !== 'local' || entry.source.path !== './plugins/hicode') process.exit(1); if (!entry.policy || entry.policy.installation !== 'AVAILABLE' || entry.policy.authentication !== 'ON_INSTALL') process.exit(1); const pluginRoot=path.join(root,'plugins/hicode'); const manifest=JSON.parse(fs.readFileSync(path.join(pluginRoot,'.codex-plugin/plugin.json'),'utf8')); if (manifest.name !== 'hicode' || manifest.skills !== './skills/' || Object.prototype.hasOwnProperty.call(manifest,'agents')) process.exit(1); if (!fs.existsSync(path.join(pluginRoot,'skills/init/SKILL.md'))) process.exit(1); if (fs.existsSync(path.join(pluginRoot,'agents')) || fs.existsSync(path.join(pluginRoot,'docs')) || fs.existsSync(path.join(pluginRoot,'archive'))) process.exit(1);\" \"\$tmp\""
check_cmd "codex project plugin uninstall removes marketplace-backed bundle" bash -c "tmp=\"\$(mktemp -d)\"; HICODE_CODEX_SKIP_ADD=1 bash install.sh --codex --codex-scope project --codex-project-dir \"\$tmp\" --yes >/dev/null; HICODE_CODEX_SKIP_REMOVE=1 bash install.sh --uninstall --codex --codex-scope project --codex-project-dir \"\$tmp\" --yes >/dev/null; node -e \"const fs=require('fs'),path=require('path'); const root=process.argv[1]; const market=JSON.parse(fs.readFileSync(path.join(root,'.agents/plugins/marketplace.json'),'utf8')); if ((market.plugins || []).some(p => p && p.name === 'hicode')) process.exit(1); if (fs.existsSync(path.join(root,'plugins/hicode'))) process.exit(1);\" \"\$tmp\""
check_cmd "opencode transformed skill frontmatter names match directories" bash -c "tmp=\"\$(mktemp -d)\"; bash install.sh --opencode --opencode-config-dir \"\$tmp\" --yes >/dev/null; node -e \"const fs=require('fs'),path=require('path'); const dir=process.argv[1]; for (const entry of fs.readdirSync(dir,{withFileTypes:true})) { if (!entry.isDirectory()) continue; const skill=path.join(dir,entry.name,'SKILL.md'); const text=fs.readFileSync(skill,'utf8'); const match=text.match(/^---\\n([\\s\\S]*?)\\n---/); if (!match || !match[1].split('\\n').some(line => line.trim() === 'name: '+entry.name)) process.exit(1); }\" \"\$tmp/skills\""
check_cmd "opencode transformed agents use filename identity and subagent mode" bash -c "tmp=\"\$(mktemp -d)\"; bash install.sh --opencode --opencode-config-dir \"\$tmp\" --yes >/dev/null; node -e \"const fs=require('fs'),path=require('path'); const dir=process.argv[1]; for (const entry of fs.readdirSync(dir,{withFileTypes:true})) { if (!entry.isFile() || !entry.name.endsWith('.md')) continue; const text=fs.readFileSync(path.join(dir,entry.name),'utf8'); const match=text.match(/^---\\n([\\s\\S]*?)\\n---/); if (!match) process.exit(1); const lines=match[1].split('\\n').map(line => line.trim()); if (lines.some(line => line.startsWith('name:'))) process.exit(1); if (!lines.includes('mode: subagent')) process.exit(1); }\" \"\$tmp/agents\""
check_cmd "opencode uninstall removes transformed hicode assets only" bash -c "tmp=\"\$(mktemp -d)\"; mkdir -p \"\$tmp/skills/not-hicode\" \"\$tmp/agents\"; printf 'keep' > \"\$tmp/agents/not-hicode.md\"; bash install.sh --opencode --opencode-config-dir \"\$tmp\" --yes >/dev/null; bash install.sh --uninstall --opencode --opencode-config-dir \"\$tmp\" --yes >/dev/null; node -e \"const fs=require('fs'),path=require('path'); const root=process.argv[1]; for (const skill of ['hi','init','scope','tdd','review','release']) { if (fs.existsSync(path.join(root,'skills','hicode-'+skill))) process.exit(1); } for (const agent of ['requirement-reviewer','coding-planner','tdd-guide','coding-assistant','code-reviewer','security-reviewer','java-reviewer','release-reviewer']) { if (fs.existsSync(path.join(root,'agents','hicode-'+agent+'.md'))) process.exit(1); } if (!fs.existsSync(path.join(root,'skills/not-hicode')) || !fs.existsSync(path.join(root,'agents/not-hicode.md'))) process.exit(1);\" \"\$tmp\""
check_cmd "git diff has no whitespace errors" git diff --check

if [ "$failures" -gt 0 ]; then
  printf '\nhicode health check failed: %s issue(s)\n' "$failures" >&2
  exit 1
fi

printf '\nhicode health check passed\n'
