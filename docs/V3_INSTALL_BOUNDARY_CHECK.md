# V3 安装边界检查记录

## 1. 定位

本文件记录 `V3-P6-WP1` 安装边界检查结果，用于确认 hicode Claude Code plugin 只暴露必要可调用入口，不把本仓库管理文档、归档资产或历史 references 目录安装为目标 Coding Agent 运行资产。

本记录只覆盖 `.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json` 和 `install.sh` 的安装边界，不替代后续 `V3-P6-WP2` 全量路径一致性验收。

## 2. 检查结论

结论：`PASS`

依据：

1. `.claude-plugin/plugin.json` 只声明 `skills: ["./skills/"]`。
2. `.claude-plugin/plugin.json` 未声明根目录 `docs/`、`archive/` 或历史 `references/prompts`、`references/skills`、`references/gates`、`references/schemas`、`references/examples`、`references/init`、`references/target-project`。
3. `install.sh` 不复制 `.hicode/`，不初始化目标项目，不扫描代码，不生成 `CLAUDE.md` 或 `AGENTS.md`。
4. `install.sh` 已增加 `validate_install_boundary`，在 plugin manifest 暴露仓库管理文档、归档资产或历史 references 目录时直接失败。
5. `install.sh` 的安装计划明确运行资产只来自 `.claude-plugin/plugin.json` 声明的 `skills/`。

## 3. 检查项

| 检查项 | 结果 | 证据 |
|---|---|---|
| plugin manifest 不声明 `docs/` | PASS | `plugin.json` 只含 `skills: ["./skills/"]` |
| plugin manifest 不声明 `archive/` | PASS | `plugin.json` 只含 `skills: ["./skills/"]` |
| plugin manifest 不声明历史 references 目录 | PASS | `plugin.json` 未出现历史 references 目录 |
| install.sh 不复制 `.hicode/` | PASS | 脚本只调用 `claude plugin validate`、`marketplace add`、`plugin install` |
| install.sh 不初始化目标项目 | PASS | 脚本不生成 `CLAUDE.md`、`AGENTS.md` 或项目 docs |
| install.sh 不扫描代码 | PASS | 脚本不遍历目标项目代码，只校验 plugin 本地资产 |
| install.sh 不安装本仓库 `docs/` 为运行资产 | PASS | 新增 manifest 边界校验和安装计划说明 |

## 4. 残余风险

1. `marketplace.json` 的 `source` 仍指向插件仓库根目录，这是 Claude Code 本地 marketplace 定位插件源的入口，不等同于把所有目录声明为运行资产。
2. 若后续修改 `plugin.json` 增加新的组件类型，必须同步更新本检查记录和 `install.sh` 边界校验。
3. 本记录不检查当前 Skill/Agent/Rule/Template 的全量旧路径依赖；该检查留给 `V3-P6-WP2`。

## 5. 验证命令

本工作包已运行以下验证：

| 命令 | 结果 |
|---|---|
| `node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json','utf8')); JSON.parse(require('fs').readFileSync('.claude-plugin/marketplace.json','utf8')); console.log('plugin manifests ok')"` | PASS，输出 `plugin manifests ok` |
| `bash install.sh --dry-run --yes` | PASS，输出运行资产为 `skills/`，并声明不安装 repository docs/archive、不扫描代码、不生成入口文件、不创建 `.hicode/` |
| `rg -n '("\./docs/?|"docs/"|"\./archive/?|"archive/"|"references/(prompts|skills|gates|schemas|examples|init|target-project))' .claude-plugin/plugin.json` | PASS，无命中 |
| `rg -n '\b(cp|rsync|ditto|tar)\b|mkdir .*\.hicode|touch .*CLAUDE|touch .*AGENTS' install.sh` | PASS，无命中 |
| `bash -n install.sh` | PASS |
| `git diff --check` | PASS |
