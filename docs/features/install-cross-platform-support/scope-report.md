# Scope 需求评审与任务拆分报告

## 1. 建议结论

| 项 | 内容 |
|---|---|
| 建议结论 | READY_FOR_TDD |
| 最高风险等级 | P2 |
| 一句话依据 | 用户已确认采用“Node 核心安装器 + `install.sh`/`install.ps1` 双入口”推荐方案。 |
| 下一步建议 | 已进入 `hicode:tdd` 并完成本地实现；Windows PowerShell 实机验收仍需目标环境补充。 |

## 2. 依据与输入缺口

| 材料 | 来源 | 是否读取 | 关键证据 | 缺口 |
|---|---|---|---|---|
| 入口规则 | `AGENTS.md` | 是 | `install.sh` 只安装 plugin，不初始化目标项目 | 无 |
| V3 计划 | `docs/V3_IMPLEMENTATION_PLAN.md` | 是 | V3-P6 明确安装边界 | 无 |
| 当前安装器 | `install.sh` | 是 | Bash 单入口，已有三平台安装能力 | Windows 原生支持不清 |
| Codex/OpenCode 适配器 | `scripts/install-codex.js`、`scripts/install-opencode.js` | 是 | Node 文件操作更适合跨平台 | 还不是统一 CLI |
| 健康检查 | `scripts/health-check.sh` | 是 | 已覆盖多项 dry-run 和 bundle 写入 | Windows 检查缺失 |

## 3. 需求评审报告

| 项 | 内容 |
|---|---|
| 报告路径或正文 | `docs/features/install-cross-platform-support/requirement-review-report.md` |
| 评审结论 | NEEDS_CONFIRMATION |
| 需求分析输入 | 以安装边界不变为硬约束，围绕 Linux 与 Windows 支持策略拆分任务 |

## 4. 需求分析与范围边界

| 项 | 内容 |
|---|---|
| 需求目标 | 增强 hicode 安装器在 Linux 与 Windows 使用场景中的可用性、可验证性和文档清晰度 |
| 范围内 | `install.sh` 平台探测与 Linux 兼容增强；按确认策略新增 Windows 入口或明确 Git Bash/WSL 支持；更新 Node 适配器、健康检查和文档 |
| 范围外 | 目标项目初始化、Hook 自动启用、生产操作、安装仓库 `docs/`/`archive/`、复制 `.hicode/` |
| 非目标 | 不改变 Claude/Codex/OpenCode plugin manifest 能力模型；不让 Codex bundle 携带 agents |
| 验收标准 | dry-run、临时目录安装/卸载、manifest 边界、hicode-owned 删除校验、跨平台路径输出均可验证 |
| feature_context 更新 | 已创建 |
| ADR 处理 | 不需要；属于安装器实现策略，若选择“Node 核心 + 双入口”可在后续作为轻量设计记录写入 Scope/TDD 报告，不必单独 ADR |

## 5. 澄清问题队列

| 问题 | 状态 | 推荐答案 | 推荐理由 | 影响 | 建议确认人 |
|---|---|---|---|---|---|
| Windows 支持是否要求原生 PowerShell/CMD，还是接受 Git Bash/WSL/MSYS 运行 `install.sh`？ | 已关闭 | 采用“Node 核心安装器 + `install.sh`/`install.ps1` 双入口”。 | 已由用户确认。 | 已决定新增 PowerShell 入口和 Node 核心。 | 项目负责人 |
| Windows PowerShell 入口是否需要实机验收？ | 待负责人确认 | 建议在 Windows 主机或 CI runner 运行 `pwsh ./install.ps1 -All -DryRun` 和临时目录安装/卸载。 | 当前环境为 macOS，只能验证脚本文本、Node 核心和 Bash 入口。 | 决定最终验收证据完整性。 | 项目负责人 |

## 6. 关键规则与影响范围

| 对象 | 影响说明 | 证据来源 | 确认状态 | 风险等级 |
|---|---|---|---|---|
| `install.sh` | 作为 Bash 入口委托 `scripts/install.js` | 当前安装器 | 已实现 | P2 |
| `install.ps1` | 作为 Windows PowerShell 入口委托 `scripts/install.js` | 用户确认的推荐方案 | 已实现，待 Windows 实机验收 | P2 |
| `scripts/install.js` | 新增跨平台 Node 核心，承载原安装/卸载逻辑 | 推荐方案 | 已实现 | P2 |
| `scripts/install-codex.js` | 保留 Codex bundle 写入适配器 | 当前 Node 适配器 | 已验证 | P2 |
| `scripts/install-opencode.js` | 保留 OpenCode 转换适配器 | 当前 Node 适配器 | 已验证 | P2 |
| `scripts/health-check.sh` | 增加跨平台入口和 Node 核心检查 | 健康检查 | 已实现 | P2 |
| `README.md` / 安装边界文档 | 说明平台支持矩阵、命令和限制 | 当前文档 | 已更新 | P3 |

## 7. 风险与阻断建议

| 风险 | 等级 | 证据 | 建议动作 | 建议确认人 |
|---|---|---|---|---|
| Windows 支持口径被误解 | P1 | `install.sh` 是 Bash 脚本，不能在 PowerShell/CMD 原生直接运行 | 先确认 Windows 原生支持策略 | 项目负责人 |
| 安装边界回退 | P2 | 跨平台改造可能扩大复制范围 | 所有实现必须保留 manifest 与 bundle 边界检查 | 研发负责人 |
| 路径与删除安全 | P2 | Windows 路径分隔符和用户目录不同 | 删除前继续校验 basename，只删除 hicode-owned 资产 | 研发负责人 |
| CLI 依赖缺失 | P3 | Claude/Codex/OpenCode 环境可能未安装对应命令 | dry-run 不依赖 CLI；实际安装前逐项提示缺失命令 | 研发负责人 |

## 8. 推荐方案与取舍

| 方案 | 是否推荐 | 适用条件 | 收益 | 代价或风险 | 不选原因 |
|---|---|---|---|---|---|
| Node 核心安装器 + `install.sh`/`install.ps1` 双入口 | 推荐 | 需要承诺 Windows 原生 PowerShell 与 Linux Bash 都可安装 | 跨平台路径处理更可靠，可复用现有 Node 适配器，用户入口清晰 | 改动较大，需要新增 PowerShell 入口和更多测试 | 不适用时仅因为本轮要求严格限制为 `install.sh` |
| 增强 `install.sh`，Windows 仅支持 Git Bash/WSL/MSYS | 可选 | 短期只允许修改 `install.sh`，不要求 PowerShell 原生 | 改动小，Linux 支持最直接 | 不是真正 Windows 原生；用户必须有 Bash 环境 | 若目标用户是 Windows 原生环境，不建议 |
| 仅补文档说明 Linux/Windows 限制 | 不推荐 | 只需要说明，不要求能力增强 | 成本最低 | 不满足“增加支持”的目标，无法改善安装体验 | 功能价值不足 |

## 9. 拆分任务计划

| 项 | 内容 |
|---|---|
| 计划路径或正文 | `docs/features/install-cross-platform-support/task-split-plan.md` |
| 计划结论 | NEEDS_CONFIRMATION |
| 下一步路由 | 确认 Windows 策略后进入 `hicode:tdd` |

## 10. TDD 输入与测试重点

| 场景 | 类型 | 优先级 | 数据要求 | 对应任务 |
|---|---|---|---|---|
| Linux dry-run 与帮助输出 | 脚本测试 | P1 | 无敏感数据 | Task 1 |
| Codex project scope bundle | 临时目录集成测试 | P1 | `mktemp` 临时目录 | Task 2 |
| OpenCode project/user scope 转换 | 临时目录集成测试 | P1 | `mktemp` 临时目录 | Task 2 |
| Windows 原生入口 | 待确认 | P1 | Windows PowerShell 或 CI runner | Task 3 |
| 安装边界健康检查 | 回归测试 | P1 | 本仓库资产 | Task 4 |

## 11. ADR 判断

| 项 | 内容 |
|---|---|
| 是否需要 ADR | 否 |
| 判断理由 | 不改变 hicode 资产架构和治理决策；只是安装器实现策略。若选择 Node 核心安装器，可在实现报告中记录取舍。 |
| 涉及决策点 | Windows 支持策略 |

## 12. 知识沉淀与上下文更新

| 目标文档 | 更新类型 | 内容摘要 | 处理方式 | 确认状态 |
|---|---|---|---|---|
| `CONTEXT.md` | 待确认建议 | 可增加“hicode 跨平台安装入口”术语，说明安装器只是 plugin/runtime 资产安装，不是项目初始化 | 用户确认后再写入 | 待确认 |
| `docs/HICODE_HEALTH_CHECK.md` | 后续实现更新 | 增加跨平台安装检查项 | TDD 实现时更新 | 待确认 |
| `README.md` | 后续实现更新 | 增加 Linux/Windows 安装命令矩阵 | TDD 实现时更新 | 待确认 |
