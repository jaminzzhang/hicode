# V3 路径与一致性验收记录

## 1. 定位

本文件记录 `V3-P6-WP2` 路径与一致性验收结果，用于确认 hicode 当前运行资产不依赖归档区、历史 references 目录或旧路径链路，并保留金融核心系统风险标准、安全红线、人工审批边界和生产禁止事项。

本记录覆盖当前运行资产：

1. `skills/`
2. `agents/`
3. `references/rules/`
4. `references/templates/`
5. `references/hooks/`

共检查 48 个当前运行资产文件。

## 2. 检查结论

结论：`PASS`

依据：

1. 当前运行资产未引用 `archive/` 作为执行依据。
2. 当前运行资产未引用历史 `references/prompts`、`references/skills`、`references/gates`、`references/schemas`、`references/examples`、`references/init` 或 `references/target-project`。
3. 当前运行资产未引用旧 `.hicode` 运行资产子路径、`docs/review-rules` 或 Agent-Prompt 整合文档。
4. 当前运行资产仍保留安全红线、生产禁止事项、人工审批边界、敏感信息保护和金融核心系统风险基线。
5. `.claude-plugin/plugin.json` 未声明本仓库 `docs/`、`archive/` 或历史 references 目录为运行资产。

## 3. 检查项

| 检查项 | 结果 | 证据 |
|---|---|---|
| 当前运行资产不引用归档区路径 | PASS | 旧路径扫描无命中 |
| 当前运行资产不引用历史 references 目录 | PASS | 旧路径扫描无命中 |
| 当前运行资产不引用旧 `.hicode` 运行资产子路径 | PASS | 旧路径扫描无命中 |
| 当前运行资产不引用旧 review-rules 或 Agent-Prompt 整合文档 | PASS | 旧路径扫描无命中 |
| 当前运行资产不保留旧资产类型作为当前执行依据 | PASS | 旧资产类型字面扫描无命中 |
| 当前运行资产保留安全红线与生产禁止事项 | PASS | 安全边界扫描有覆盖 |
| plugin manifest 不声明管理文档或归档资产为运行资产 | PASS | manifest 禁止项扫描无命中 |

## 4. 残余风险

1. V1/V2 计划和历史 ADR 中仍保留历史路径，属于项目管理追溯材料，不是当前运行资产。
2. `install.sh` 保留 `docs/`、`archive/` 和历史 references 的负向校验表达，属于安装边界防护，不是运行依赖。
3. 若后续新增 Skill、Agent、Rule、Template 或 Hook，必须重新运行本记录中的路径扫描。

## 5. 验证命令

本工作包已运行以下验证：

| 命令 | 结果 |
|---|---|
| `rg -n '(archive/|references/(prompts|skills|gates|schemas|examples|init|target-project)|\.hicode/(prompts|skills|gates|schemas|agents|hooks)|docs/review-rules|AGENT_PROMPT_INTEGRATION)' skills agents references/rules references/templates references/hooks` | PASS，无命中 |
| `rg -n '(references/init|\.hicode|Prompt|Gate|Schema|manifest|profile|archive/)' README.md references/rules references/templates references/hooks skills` | PASS，无命中 |
| `rg -n '("\./docs/?|"docs/"|"\./archive/?|"archive/"|"references/(prompts|skills|gates|schemas|examples|init|target-project))' .claude-plugin/plugin.json` | PASS，无命中 |
| `node -e "JSON.parse(require('fs').readFileSync('references/hooks/hook.json','utf8')); JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8')); console.log('json ok')"` | PASS，输出 `json ok` |
