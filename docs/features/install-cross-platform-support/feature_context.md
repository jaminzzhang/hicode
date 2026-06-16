# feature_context

## 1. 需求基本信息

| 字段 | 内容 |
|---|---|
| 需求名称 | `install.sh` 增加 Windows 与 Linux 安装支持 |
| 需求编号 | `install-cross-platform-support` |
| 需求链接 | 用户指令：`$hicode-scope 结合各coding agent 的plugin 和 skill 的规范，增加 install.sh 对 windows 和 linux 的支持` |
| 所属版本 | V3-P6 安装边界与一致性验收延伸 |
| 业务负责人 | 不适用，本仓库为 hicode 工程资产仓库 |
| 研发负责人 | 待确认 |
| 测试负责人 | 待确认 |
| 发布负责人 | 待确认 |
| 当前状态 | 已采用推荐方案并完成 TDD 实现，本机健康检查通过；Windows PowerShell 实机验证待补充 |

## 2. 需求目标与范围

| 目标 | 说明 | 验收口径 |
|---|---|---|
| 跨平台安装入口 | 让 hicode 安装流程在 Linux 与 Windows 使用者环境中有明确、可验证、可回滚的安装路径 | Linux shell dry-run 与实际 bundle 写入测试通过；Windows 支持策略有明确命令、路径和限制 |
| 保持 Coding Agent plugin/skill 规范 | Claude Code、Codex、OpenCode 三类安装仍只暴露各平台支持的运行资产 | 不安装仓库 `docs/`、`archive/`，不创建 `.hicode/`，不初始化目标项目 |
| 安装器可重复验证 | 健康检查覆盖跨平台路径、dry-run、安装和卸载边界 | `scripts/health-check.sh` 或新增专项检查覆盖 Linux 与 Windows 兼容路径 |

### 范围内

| 范围项 | 说明 | 依据 |
|---|---|---|
| `install.sh` 平台探测与提示 | 明确 Linux、macOS、WSL、Git Bash/MSYS/Cygwin、原生 Windows 的支持状态 | 当前 `install.sh` 使用 Bash、`$HOME`、`PWD`、Unix 路径和 `mkdir` |
| Claude Code 安装路径 | 保持 `claude plugin validate/marketplace add/plugin install`，按平台处理路径和命令缺失 | `install.sh` 当前实现 |
| OpenCode 安装路径 | 继续通过 `scripts/install-opencode.js` 转换 `skills/` 与 `agents/` | `scripts/install-opencode.js` 当前实现 |
| Codex 安装路径 | 继续通过 local marketplace bundle 安装 `.codex-plugin/` 与 `skills/` | `scripts/install-codex.js` 当前实现 |
| 验证与文档 | 更新健康检查、安装边界说明和 README 使用方式 | `docs/HICODE_HEALTH_CHECK.md`、`docs/V3_INSTALL_BOUNDARY_CHECK.md` |

### 范围外

| 范围项 | 排除原因 | 影响 |
|---|---|---|
| 目标项目初始化 | 安装器边界明确禁止生成 `CLAUDE.md`、`AGENTS.md`、项目 docs 或 `.hicode/` | 仍由 `hicode:init` 处理 |
| 自动启用 Hook | AGENTS 与 V3 计划明确 Hook 不由安装器自动启用 | 用户需另行确认 Hook 配置 |
| 生产环境、生产配置或生产数据操作 | 安全红线禁止 | 不纳入任何安装逻辑 |
| 原生 Windows 是否必须通过 `install.sh` 直接运行 | Bash 脚本无法覆盖 PowerShell/CMD 原生命令语义 | 需要确认采用 PowerShell 包装器还是 Node 核心安装器 |

## 3. 核心规则

| 规则编号 | 业务域 | 规则说明 | 输入 | 输出 | 边界/例外 | 状态 |
|---|---|---|---|---|---|---|
| R1 | 安装边界 | 安装器不得复制 `.hicode/`、不得初始化目标项目、不得安装仓库 `docs/` 或 `archive/` 为运行资产 | 本仓库 plugin 与 skill 资产 | 平台安装配置或本地 plugin bundle | 不影响 `docs/features/` Scope 文档 | 已确认 |
| R2 | Claude Code | `.claude-plugin/plugin.json` 只声明 `skills: ["./skills/"]`，`agents/` 依赖 Claude Code plugin root 约定 | `.claude-plugin/`、`skills/`、`agents/` | Claude Code plugin 安装 | 不新增 manifest 不支持字段 | 已确认 |
| R3 | Codex | Codex plugin bundle 只包含 `.codex-plugin/` 与 `skills/`，不得复制 `agents/` | `.codex-plugin/`、`skills/` | local marketplace entry 与 plugin bundle | Codex manifest 不支持 agents 时不得绕过 | 已确认 |
| R4 | OpenCode | OpenCode 安装转换为 `hicode-*` skills 与 agents，卸载只删除 hicode-owned 资产 | `skills/`、`agents/` | OpenCode 配置目录或项目 `.opencode/` | 不删除非 hicode 命名资产 | 已确认 |

## 4. 金融核心系统风险基线

| 维度 | 是否涉及 | 已知规则/证据 | 待确认问题 | 风险等级 |
|---|---|---|---|---|
| 保险核心业务逻辑严谨性 | 否 | 本需求为安装器资产改造，不实现业务逻辑 | 无 | NONE |
| 金额精度 | 否 | 不涉及金额计算 | 无 | NONE |
| 交易一致性 | 否 | 不涉及交易处理 | 无 | NONE |
| 状态流转 | 否 | 不涉及业务状态机 | 无 | NONE |
| 幂等与并发 | 是 | 安装/卸载应可重复执行，卸载已包含幂等逻辑 | Windows/Linux 下幂等测试矩阵待确认 | P2 |
| 权限与审计 | 是 | 安装写入用户或项目配置目录，需 dry-run 与确认 | Windows 原生目录映射待确认 | P2 |
| 隐私与监管 | 是 | 安装器不得读取密钥、生产配置、客户敏感信息 | 无 | P2 |
| 生产变更与回滚 | 是 | 安装器不得自动发布或修改生产配置；卸载只删除 hicode-owned 资产 | Windows 卸载路径待验证 | P2 |

## 5. 影响范围

| 类型 | 对象 | 影响说明 | 风险等级 |
|---|---|---|---|
| Shell 入口 | `install.sh` | 增加平台探测、路径处理、帮助文案和跨平台分流 | P2 |
| Node 适配器 | `scripts/install-opencode.js`、`scripts/install-codex.js` | 可能需要增强 Windows 路径、marketplace 相对路径和安全删除校验 | P2 |
| 健康检查 | `scripts/health-check.sh`、`docs/HICODE_HEALTH_CHECK.md` | 增加跨平台 dry-run 与 bundle 写入验证口径 | P2 |
| 文档 | `README.md`、`docs/V3_INSTALL_BOUNDARY_CHECK.md` | 说明 Linux/Windows 支持方式和限制 | P3 |

## 6. 测试与发布关注点

| 关注项 | 类型 | 优先级 | 证据或说明 |
|---|---|---|---|
| Linux Bash dry-run | 自动化 | P1 | `bash install.sh --all --dry-run --yes` |
| Linux project scope bundle | 自动化 | P1 | 临时目录安装 Codex/OpenCode project scope，不生成非目标资产 |
| Windows Git Bash/WSL dry-run | 手工或 CI | P1 | 验证 Bash 入口可运行 |
| Windows 原生 PowerShell | 待确认 | P1 | 若要求原生 Windows，应新增 `install.ps1` 或 Node CLI 入口 |
| 卸载只删除 hicode-owned 资产 | 自动化 | P1 | 当前健康检查已有 OpenCode/Codex 覆盖，需跨平台保留 |

## 7. 待确认问题

| 问题 | 风险等级 | 影响 | 建议确认人 | 期望材料 |
|---|---|---|---|---|
| Windows PowerShell 入口是否需要在真实 Windows 环境或 CI runner 上补充验收？ | P2 | 当前已做语法和参数一致性检查，但未在 Windows 主机运行 | 项目负责人 | Windows 验收环境 |
