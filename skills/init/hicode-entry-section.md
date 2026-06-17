# hicode 入口补充片段

本片段用于补充到目标项目已有的 `AGENTS.md` 或 `CLAUDE.md`。入口文件主体应优先由当前 Agent 可执行初始化能力生成；若目标平台只有用户手工 TUI `/init`，例如 OpenCode，则需用户手工执行或确认由 hicode 生成最小入口。hicode 只补充项目文档路径、Skill 路由、规则目录和安全边界。

## hicode 文档路径

项目级共享文档：

| 路径 | 用途 | 维护规则 |
|---|---|---|
| `docs/DOMAIN_KNOWLEDGE.md` | 领域术语、业务域、保险核心场景和可复用业务规则 | 负责人确认后写入 |
| `docs/PROJ_CONTEXT.md` | 项目定位、模块结构、核心流程、接口依赖、数据状态、局部命令和历史风险 | 负责人确认后写入 |
| `docs/adr/` | 架构、治理或难逆决策记录 | 决策人确认后写入 |
| `docs/rules/` | 目标项目本地规则 | 只能补充或加严 hicode 内置规则 |

单需求或单特性文档：

| 路径 | 生成入口 |
|---|---|
| `docs/features/<feature-id>/feature_context.md` | `hicode:scope` |
| `docs/features/<feature-id>/requirement-review-report.md` | `hicode:scope` |
| `docs/features/<feature-id>/scope-report.md` | `hicode:scope` |
| `docs/features/<feature-id>/task-split-plan.md` | `hicode:scope` |
| `docs/features/<feature-id>/tdd-report.md` | `hicode:tdd` |
| `docs/features/<feature-id>/review-report.md` | `hicode:review` |
| `docs/features/<feature-id>/release-report.md` | `hicode:release` |

## hicode 单需求文档生命周期

单需求目录固定为 `docs/features/<feature-id>/`。`feature-id` 不明确时先问用户，不得编造。

| 阶段 | 负责入口 | 可创建或更新 | 写入边界 | 缺失材料处理 |
|---|---|---|---|---|
| Scope | `hicode:scope` | `feature_context.md`、`requirement-review-report.md`、`scope-report.md`、`task-split-plan.md` | 只写已确认事实、证据、待确认问题、范围边界、风险判断、ADR 草稿和拆分任务 | 缺少目标、范围、规则、验收标准或 P0/P1 风险证据时，不输出 `TDD_INPUT_READY` |
| TDD | `hicode:tdd` | `tdd-report.md`，必要时补充 `feature_context.md` 的过程证据 | 只写真实测试设计、命令、结果、修改文件、风险和待确认问题 | 缺少 Scope 产物、任务范围或测试重点时，说明缺口并回到 `hicode:scope` 或只做测试设计 |
| Review | `hicode:review` | `review-report.md` | 只写真 diff、审查证据、问题、命令结果、未覆盖范围和待确认问题 | 缺少需求、Scope、TDD、diff 或验证结果时，标注需求轴或证据轴降级 |
| Release | `hicode:release` | `release-report.md` | 只汇总已知分支范围、需求证据、测试/Review 证据、SQL/配置/脚本风险、验证计划和回滚计划 | `feature-id` 不明确时只能输出临时报告；落盘前必须确认目录 |

通用写入规则：

1. 任何阶段都不得编造负责人、业务规则、验收结论、测试通过、发布许可或验证结果。
2. 未确认内容写入 `待确认`，不能沉淀为长期事实。
3. `DOMAIN_KNOWLEDGE.md`、`PROJ_CONTEXT.md` 和正式 ADR 只能在负责人确认后更新。
4. 涉及未脱敏客户信息、生产数据、密钥、生产配置、生产凭证或生产日志原文时停止写入并转人工安全流程。
5. 阶段报告可以记录证据缺口和风险建议，不代表最终审批、合并许可、发布许可或生产操作授权。

## hicode Skill 路由

| 场景 | 推荐 Skill |
|---|---|
| 总入口、首次诊断、用法简介和路由判断 | `hi` |
| 初始化或补齐项目上下文 | `hicode:init` |
| 需求评审、范围界定、任务拆分 | `hicode:scope` |
| TDD、测试先行、受控实现 | `hicode:tdd` |
| 代码审查、提交检查、专项审查 | `hicode:review` |
| 分支发布分析、验证计划、回滚计划 | `hicode:release` |

## hicode 规则与安全边界

编码、测试生成、代码审查和提交检查必须按任务读取 `docs/rules/` 中的适用规则。目标项目规则只能补充或加严 hicode 内置规则，不能放宽入口校验、幂等、事务、外部调用、并发、状态机、异常防御、安全合规、审计、测试、注释和类型控制要求。

禁止读取或输出密钥、Token、Cookie、Session、连接串、生产账号、生产 IP、内部密钥、生产配置、生产凭证、未脱敏客户信息、未脱敏生产数据或生产日志原文。禁止连接生产、执行生产 SQL、修改生产配置、自动提交、自动推送、自动合并、自动发布、自动回滚、删除测试、降低断言、跳过 Review 或替代负责人审批。

分析、计划、测试、Review 和发布类输出应包含建议性质结论、依据或证据来源、最高风险等级、建议动作、待确认问题、验证动作或未执行原因，以及上下文更新建议；建议性质结论不得写成审批通过、允许合并、允许发布或可以上线。
