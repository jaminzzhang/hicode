# Scope 拆分任务计划

## 1. 计划结论

| 项 | 内容 |
|---|---|
| 计划结论 | READY_FOR_TDD |
| 需求来源 | 用户指令、`install.sh`、V3-P6 安装边界 |
| 最高风险等级 | P1 |
| 下一步路由 | 已进入 `hicode:tdd` 并完成本地实现 |

## 2. 拆分依据

| 依据 | 来源 | 关键结论 | 影响 |
|---|---|---|---|
| 安装边界 | `AGENTS.md`、`docs/V3_IMPLEMENTATION_PLAN.md` | 安装器不得初始化目标项目、不得复制 `.hicode/`、不得安装 `docs/`/`archive/` | 所有任务必须保留边界检查 |
| 当前实现 | `install.sh` | Bash 单入口，已支持 Claude Code、OpenCode、Codex 三平台 | Linux 可直接增强；Windows 需策略确认 |
| 平台适配器 | `scripts/install-opencode.js`、`scripts/install-codex.js` | Node 文件操作已承担一部分安装逻辑 | 推荐演进为跨平台核心 |
| 健康检查 | `scripts/health-check.sh` | 已有 dry-run、bundle、卸载幂等检查 | 新增或调整跨平台检查 |

## 3. 任务总览

| 任务 | 目标 | 依赖 | 风险等级 | TDD 优先级 |
|---|---|---|---|---|
| Task 1 | 增强 `install.sh` 的 Linux/Unix Bash 平台探测、依赖提示和 dry-run 输出 | 无 | P2 | 已完成 |
| Task 2 | 抽出或增强 Node 安装核心，统一 Codex/OpenCode 跨平台路径与安全删除规则 | Task 1 | P2 | 已完成 |
| Task 3 | 按确认策略实现 Windows 支持入口 | 用户确认 Windows 策略 | P2 | 已完成，待 Windows 实机验收 |
| Task 4 | 更新健康检查和安装文档，覆盖跨平台支持矩阵 | Task 1-3 | P2 | 已完成 |

## 4. 任务明细

### Task 1: Linux/Unix Bash 入口增强

- 目标：让 `install.sh` 在 Linux、macOS、WSL、Git Bash/MSYS/Cygwin 下清晰识别平台、输出支持状态并保持现有安装功能。
- 输入：`install.sh`、V3-P6 安装边界、当前健康检查。
- 范围内：平台探测函数、依赖检查文案、`--help` 支持矩阵、dry-run 输出中的平台信息、Linux shell 语法验证。
- 范围外：PowerShell 原生入口、目标项目初始化、Hook 自动启用。
- 涉及对象：`install.sh`、`scripts/health-check.sh`。
- TDD 起点：先增加脚本 dry-run 断言，验证 `--help` 与 `--all --dry-run --yes` 包含平台支持信息且不触碰目标目录。
- 验证方式：`bash -n install.sh`、`bash install.sh --all --dry-run --yes`、健康检查。
- 停止条件：发现平台支持需要改变 plugin manifest 或安装边界时回到 Scope。
- 可交付物：更新后的 `install.sh` 与健康检查断言。

### Task 2: Node 安装核心跨平台增强

- 目标：复用现有 Node 适配器，统一处理 Codex/OpenCode 的复制、删除、marketplace 更新和 Windows/Linux 路径差异。
- 输入：`scripts/install-opencode.js`、`scripts/install-codex.js`、当前健康检查中的临时目录测试。
- 范围内：路径规范化、安全删除校验、相对路径生成、错误信息、Node `--check` 与临时目录安装/卸载测试。
- 范围外：Claude CLI 行为模拟、平台 CLI 安装。
- 涉及对象：`scripts/install-opencode.js`、`scripts/install-codex.js`，必要时新增 `scripts/install-core.js`。
- TDD 起点：先为临时目录安装/卸载增加断言，确保 Windows 风格路径策略不导致复制 `docs/`、`archive/` 或 `agents/` 到 Codex bundle。
- 验证方式：`node --check`、Codex/OpenCode project scope 临时目录安装/卸载检查。
- 停止条件：需要引入第三方依赖或改变 plugin manifest schema 时回到 Scope。
- 可交付物：跨平台 Node 安装逻辑与测试覆盖。

### Task 3: Windows 支持入口

- 目标：根据用户确认的策略提供 Windows 可执行安装路径。
- 输入：用户对 Windows 原生支持策略的确认、Task 1/2 结果。
- 范围内：若确认原生支持，新增 `install.ps1` 或 Node CLI 入口并保持与 `install.sh` 参数一致；若确认 Bash 兼容支持，则在 `install.sh` 中明确 Git Bash/WSL/MSYS 支持和 PowerShell 不支持提示。
- 范围外：自动安装 Claude/Codex/OpenCode CLI、修改系统 PATH、写入生产配置。
- 涉及对象：`install.sh`、可能新增 `install.ps1` 或 `scripts/install.js`、`README.md`。
- TDD 起点：先写 Windows 支持策略的命令输出断言或 PowerShell 语法/参数测试。
- 验证方式：Windows 环境手工验证或 CI runner；无 Windows 环境时必须在报告中标注未执行。
- 停止条件：无法获得 Windows 运行环境且用户要求实机验证时暂停实现验收。
- 可交付物：Windows 安装入口、使用说明和验证记录。

### Task 4: 文档与健康检查更新

- 目标：把跨平台支持矩阵、命令、限制和验证命令写入当前 Harness 资产，并纳入可重复检查。
- 输入：Task 1-3 实现结果。
- 范围内：`README.md` 安装命令、`docs/HICODE_HEALTH_CHECK.md` 覆盖范围、`docs/V3_INSTALL_BOUNDARY_CHECK.md` 或新检查记录。
- 范围外：更新需求草案、生成发布审批结论。
- 涉及对象：`README.md`、`docs/HICODE_HEALTH_CHECK.md`、`docs/features/install-cross-platform-support/`。
- TDD 起点：先更新检查脚本或文档断言，再补文档。
- 验证方式：`bash scripts/health-check.sh`、`git diff --check`。
- 停止条件：文档需要承诺未验证平台能力时回到 Scope。
- 可交付物：更新后的说明和检查记录。

## 5. TDD 移交清单

| 任务 | 先写测试 | 测试数据 | Mock/依赖隔离 | 关键断言 |
|---|---|---|---|---|
| Task 1 | 是 | 无 | dry-run 模式 | 输出平台支持信息；不触碰目标目录 |
| Task 2 | 是 | 临时目录 | `HICODE_CODEX_SKIP_ADD/REMOVE`、临时 CLI stub | 只复制允许资产；卸载只删 hicode-owned |
| Task 3 | 是 | Windows 临时目录或命令输出 | CLI stub | Windows 入口参数与 `install.sh` 一致；不扩大安装边界 |
| Task 4 | 是 | 本仓库资产 | 无 | 健康检查通过；文档支持矩阵与实现一致 |

## 6. 暂不纳入本轮的事项

| 事项 | 排除原因 | 后续处理建议 |
|---|---|---|
| 自动安装 Claude/Codex/OpenCode CLI | 超出 hicode 安装器职责，涉及用户环境和权限 | 只提示缺失命令和官方安装前置 |
| 自动启用 Hook | V3 决策明确不由安装器启用 | 另开需求确认 Hook 配置 |
| 目标项目初始化 | 由 `hicode:init` 负责 | 用户需要时转 `hicode:init` |

## 7. 上下文沉淀清单

| 目标文档 | 更新类型 | 内容摘要 | 是否已确认 | 处理方式 |
|---|---|---|---|---|
| `CONTEXT.md` | 候选术语 | `hicode 跨平台安装入口` | 否 | 用户确认后再写 |
| `docs/HICODE_HEALTH_CHECK.md` | 检查项更新 | 增加跨平台安装支持矩阵与验证 | 否 | TDD 阶段同步 |
| `README.md` | 使用说明 | 增加 Linux/Windows 命令与限制 | 否 | TDD 阶段同步 |
