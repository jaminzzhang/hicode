# TDD 与辅助编码报告

## 1. 建议结论

| 项 | 内容 |
|---|---|
| 建议结论 | CONDITIONAL_PASS |
| 最高风险等级 | P2 |
| 模式 | 本地修改 |

## 2. 测试目标与范围

| 项 | 内容 |
|---|---|
| 测试目标 | 验证 hicode 安装器采用跨平台 Node 核心，并提供 Linux/Unix Bash 与 Windows PowerShell 双入口，同时保持安装边界不扩大。 |
| 测试范围 | `install.sh`、`install.ps1`、`scripts/install.js`、`scripts/health-check.sh`、README 和 feature 文档。 |
| 不覆盖范围 | 未在真实 Windows 主机运行 PowerShell 安装；不自动安装 Claude/Codex/OpenCode CLI；不测试生产环境或目标项目初始化。 |

## 3. 测试场景

| 编号 | 场景 | 类型 | 优先级 | 风险等级 |
|---|---|---|---|---|
| T1 | Bash 入口 dry-run 输出 host platform 并委托 Node 核心 | 行为测试 | P1 | P2 |
| T2 | Node 核心 `--all --dry-run --yes` 不触碰目标配置 | 行为测试 | P1 | P2 |
| T3 | PowerShell 入口存在并委托 Node 核心，参数覆盖 Claude/OpenCode/Codex | 静态检查 | P1 | P2 |
| T4 | Codex/OpenCode 临时目录安装和卸载仍只处理 hicode-owned 资产 | 集成检查 | P1 | P2 |
| T5 | 健康检查整体通过 | 回归检查 | P1 | P2 |

## 4. Given-When-Then 用例

| 编号 | Given | When | Then |
|---|---|---|---|
| G1 | 本仓库 hicode plugin 资产存在 | 运行 `bash install.sh --all --dry-run --yes` | 输出 `Host platform:`，展示 Claude/OpenCode/Codex 三类安装计划，不写入目标目录。 |
| G2 | 本仓库 hicode plugin 资产存在 | 运行 `node scripts/install.js --all --dry-run --yes` | 输出与 Bash 入口一致的安装计划。 |
| G3 | Windows PowerShell 用户入口文件存在 | 检查 `install.ps1` | 文件声明 `-ClaudeCode`、`-OpenCode`、`-Codex`、`-All` 等参数，并调用 `scripts/install.js`。 |
| G4 | 临时目录作为目标项目 | 健康检查执行 Codex/OpenCode 安装与卸载用例 | Codex bundle 不复制 `agents/`、`docs/`、`archive/`；OpenCode 卸载不删除非 hicode 资产。 |

## 5. Mock、数据与断言

| 项 | 规则 | 风险 |
|---|---|---|
| CLI 依赖 | dry-run 不调用真实 CLI；幂等卸载测试使用临时 stub | 避免修改用户真实安装状态 |
| 临时目录 | 使用 `mktemp -d` 作为 Codex/OpenCode project scope 目标 | 避免触碰业务项目 |
| 敏感信息 | 不读取 `.env`、密钥文件、生产配置或生产数据 | 符合安全红线 |

## 6. RED-GREEN-REFACTOR 记录

| 步骤 | 行为 | 文件 | 结果 |
|---|---|---|---|
| RED | 先在健康检查中增加 `scripts/install.js`、`install.ps1` 和 host platform dry-run 断言 | `scripts/health-check.sh` | 首次运行失败，缺少 `scripts/install.js` 与 `install.ps1` |
| GREEN | 新增跨平台 Node 核心，`install.sh` 与 `install.ps1` 委托同一核心 | `scripts/install.js`、`install.sh`、`install.ps1` | `bash -n`、`node --check`、dry-run 通过 |
| GREEN | 修正健康检查 PowerShell 参数匹配转义 | `scripts/health-check.sh` | `bash scripts/health-check.sh` 通过 |
| RECORD | 更新 README、健康检查说明和 feature 文档 | `README.md`、`docs/HICODE_HEALTH_CHECK.md`、`docs/features/install-cross-platform-support/*` | 文档与实现一致 |

## 7. 修改文件清单

| 文件 | 修改类型 | 说明 |
|---|---|---|
| `install.sh` | 重构 | Bash 入口改为委托 `scripts/install.js` |
| `install.ps1` | 新增 | Windows PowerShell 入口，参数映射到 Node 核心 |
| `scripts/install.js` | 新增 | 跨平台安装核心，承载 Claude/OpenCode/Codex 安装与卸载逻辑 |
| `scripts/health-check.sh` | 更新 | 增加 Node 核心、PowerShell 入口和 host platform dry-run 检查 |
| `README.md` | 更新 | 增加跨平台安装入口和 PowerShell 示例 |
| `docs/HICODE_HEALTH_CHECK.md` | 更新 | 增加跨平台安装健康检查口径 |
| `docs/features/install-cross-platform-support/*.md` | 新增/更新 | Scope 与 TDD 记录 |

## 8. 受限命令执行记录

| 命令 | 范围 | 是否执行 | 结果 | 未执行原因 |
|---|---|---|---|---|
| `bash -n install.sh` | Bash 语法 | 是 | PASS | 不适用 |
| `node --check scripts/install.js` | Node 语法 | 是 | PASS | 不适用 |
| `bash install.sh --all --dry-run --yes` | Bash dry-run | 是 | PASS | 不适用 |
| `node scripts/install.js --all --dry-run --yes` | Node dry-run | 是 | PASS | 不适用 |
| `bash scripts/health-check.sh` | 全量健康检查 | 是 | PASS | 不适用 |
| `pwsh ./install.ps1 -All -DryRun` | Windows PowerShell 实机验证 | 否 | 未执行 | 当前运行环境不是 Windows，且未确认可用 PowerShell runner |

## 9. 风险与待确认问题

| 问题 | 等级 | 影响 | 建议动作 | 建议确认人 |
|---|---|---|---|---|
| Windows PowerShell 未做实机验证 | P2 | 语法和参数映射已静态检查，但仍缺少 Windows 文件路径与 PowerShell 运行证据 | 在 Windows 主机或 CI runner 运行 `pwsh ./install.ps1 -All -DryRun` 和临时目录安装/卸载 | 项目负责人 |

## 10. 上下文更新建议

| 建议位置 | 类型 | 内容摘要 | 原因 |
|---|---|---|---|
| `CONTEXT.md` | 候选术语 | `hicode 跨平台安装入口`：Linux/Unix Bash 与 Windows PowerShell 入口共享 Node 安装核心，只安装 plugin/runtime 资产，不做目标项目初始化。 | 若后续多次引用跨平台安装能力，可沉淀为稳定术语。 |
