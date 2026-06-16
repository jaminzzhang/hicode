# Scope 需求评审报告

## 1. 评审结论

| 项 | 内容 |
|---|---|
| 评审结论 | NEEDS_CONFIRMATION |
| 最高风险等级 | P1 |
| 一句话依据 | Linux 支持可直接围绕现有 Bash 安装器增强验证；Windows 支持必须先确认是 Bash 兼容环境还是原生 PowerShell/CMD。 |
| 后续输入用途 | 作为 `install.sh` 跨平台支持的范围确认和 TDD 拆分输入 |

## 2. 输入材料

| 材料 | 来源 | 是否读取 | 关键证据 | 缺口 |
|---|---|---|---|---|
| 仓库入口规则 | `AGENTS.md` | 是 | 安装器不初始化目标项目、不复制 `docs/`、不创建 `.hicode/` | 无 |
| 项目术语上下文 | `CONTEXT.md` | 是 | 当前资产边界、安装器边界、Skill/Agent/Template 职责已定义 | 无 |
| V3 实施计划 | `docs/V3_IMPLEMENTATION_PLAN.md` | 是 | V3-P6 覆盖 `.claude-plugin`、`.codex-plugin` 和 `install.sh` 安装边界 | 无 |
| 当前安装器 | `install.sh` | 是 | Bash 脚本，覆盖 Claude Code、OpenCode、Codex，依赖 `$HOME`、`PWD`、`mkdir`、`node`、平台 CLI | Windows 原生语义未覆盖 |
| Node 安装适配器 | `scripts/install-opencode.js`、`scripts/install-codex.js` | 是 | 使用 Node `fs`/`path`，天然更接近跨平台 | Windows 下目标路径与 marketplace 相对路径需验证 |
| Plugin manifest | `.claude-plugin/plugin.json`、`.codex-plugin/plugin.json` | 是 | Claude 只声明 `skills/`；Codex 只声明 `skills: "./skills/"`，不声明 agents | 无 |
| 健康检查 | `scripts/health-check.sh`、`docs/HICODE_HEALTH_CHECK.md` | 是 | 已覆盖 dry-run、安装边界、Codex/OpenCode bundle 和卸载幂等 | 缺少 Windows 明确检查项 |

## 3. 需求目标与验收口径

| 项 | 内容 | 证据来源 | 确认状态 |
|---|---|---|---|
| 需求目标 | 结合 Claude Code、Codex、OpenCode 的 plugin/skill 规范，让 hicode 安装器在 Linux 与 Windows 使用环境中有明确安装路径 | 用户指令、现有 install.sh | 部分确认 |
| 验收标准 | Linux 下 dry-run 与临时目录安装/卸载通过；Windows 支持策略有可执行入口和验证说明；安装边界不回退 | V3-P6、健康检查 | 待补充 Windows 策略 |
| 非目标 | 不初始化目标项目、不安装仓库管理文档、不自动启用 Hook、不操作生产环境 | AGENTS、V3 计划 | 已确认 |

## 4. 清晰度评审

| 检查项 | 结论 | 证据 | 风险等级 | 待确认问题 |
|---|---|---|---|---|
| 目标是否明确 | 部分明确 | 用户要求增加 Windows 与 Linux 支持 | P1 | Windows 原生范围不明确 |
| 范围是否明确 | 部分明确 | Linux 可沿用 Bash；Windows 可能需要 PowerShell 或 Node CLI | P1 | 选择哪种 Windows 支持策略 |
| 核心规则是否可追溯 | 明确 | AGENTS、CONTEXT、V3-P6、健康检查均定义安装边界 | P2 | 无 |
| 验收标准是否可测试 | 部分明确 | Linux 本地可测，Windows 需明确执行环境 | P1 | 是否需要 Windows CI 或手工验收 |
| 术语是否存在冲突 | 无冲突 | “安装器”与“目标项目初始化”边界已定义 | P2 | 无 |

## 5. 金融核心系统风险评审

| 维度 | 是否涉及 | 证据 | 风险等级 | 建议动作 |
|---|---|---|---|---|
| 保险核心业务逻辑严谨性 | 否 | 不实现保险业务功能 | NONE | 无 |
| 金额精度 | 否 | 不涉及金额 | NONE | 无 |
| 交易一致性 | 否 | 不涉及交易 | NONE | 无 |
| 状态流转 | 否 | 不涉及业务状态 | NONE | 无 |
| 幂等与并发 | 是 | 安装/卸载重复执行可能覆盖本地资产 | P2 | 保留 hicode-owned 删除校验，新增跨平台验证 |
| 权限与审计 | 是 | 写入用户或项目配置目录 | P2 | dry-run 默认展示路径，交互确认不可绕过 |
| 隐私与监管 | 是 | 安装器不得读取敏感文件 | P2 | 不扫描目标项目、不读取 `.env` |
| 生产变更与回滚 | 是 | 安装器不得连接生产或自动发布 | P2 | 卸载只删除 hicode-owned 资产 |

## 6. 待确认问题

| 问题 | 推荐答案 | 推荐理由 | 影响 | 建议确认人 | 优先级 |
|---|---|---|---|---|---|
| Windows 支持是否要求原生 PowerShell/CMD，还是接受 Git Bash/WSL/MSYS 运行 `install.sh`？ | 推荐采用“Node 核心安装器 + `install.sh`/`install.ps1` 双入口”，若短期只改 `install.sh` 则明确支持 Git Bash/WSL/MSYS，不承诺 PowerShell 原生。 | Bash 无法在 PowerShell/CMD 原生执行；Node 适配器已存在，更适合作为跨平台核心。 | 决定实现范围、测试矩阵和交付文件。 | 项目负责人 | P1 |

## 7. 进入需求分析的输入

| 输入项 | 内容 | 证据来源 |
|---|---|---|
| 已确认需求摘要 | 增强 hicode 安装入口的 Linux/Windows 兼容性，并保持各 Coding Agent 平台 plugin/skill 安装规范 | 用户指令、现有安装器 |
| 已确认规则 | 不复制 `.hicode/`，不初始化目标项目，不安装 `docs/`/`archive/`，不自动启用 Hook | AGENTS、V3 计划、健康检查 |
| 未关闭问题 | Windows 原生支持策略 | 本报告第 6 节 |
| 分析重点 | 跨平台路径、命令探测、dry-run 输出、幂等卸载、安全删除、验证矩阵 | 当前安装器与健康检查 |
