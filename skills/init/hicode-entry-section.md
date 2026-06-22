# hicode 入口补充片段

本片段用于补充到目标项目 `AGENTS.md` 或 `CLAUDE.md`。Coding Agent 处理研发任务时，应先用本节判断是否需要 hicode Skill、读取哪些项目材料、把报告写到哪里，以及哪些动作必须停止。

## hicode 使用顺序

1. 先判断目标项目是否已初始化：入口文件是否有本 hicode section，`docs/rules/`、`docs/DOMAIN_KNOWLEDGE.md`、`docs/PROJ_CONTEXT.md` 是否存在。
2. 未初始化或入口缺失时，优先使用 `hi` 诊断；用户明确要求初始化时使用 `hicode:init`。
3. 已初始化时，按任务意图选择一个 hicode Skill 执行；意图不清时只问一个问题，不猜测业务规则。
4. 执行 Skill 前读取目标项目事实文档；目标文档缺失时标注证据缺口，不用模板当事实。
5. 输出只给建议、证据、风险和下一步动作，不给审批、合并、发布或生产操作许可。

## hicode Skill 路由

| 用户意图或任务信号 | 使用 Skill | 主要产物 |
|---|---|---|
| 首次使用、状态诊断、不确定用哪个 hicode 能力 | `hi` | 初始化状态、路由建议 |
| 初始化入口、补齐项目规则、创建项目上下文 | `hicode:init` | 入口 hicode section、`docs/rules/`、项目级上下文 |
| 需求评审、范围界定、澄清问题、任务拆分 | `hicode:scope` | `docs/features/<feature-id>/` 下的 Scope 产物 |
| TDD、测试先行、复现 bug、受控实现 | `hicode:tdd` | `docs/features/<feature-id>/tdd-report.md` |
| 代码审查、diff/MR/PR/提交前检查、专项风险审查 | `hicode:review` | `doc/versions/review-report-<YYYYMMDD-HHmm>.md` |
| 分支发布分析、验证计划、回滚计划、发布风险判断 | `hicode:release` | `doc/versions/release-report-<YYYYMMDD-HHmm>.md` |

## hicode 读取材料

按任务读取，不默认全量加载：

1. 项目规则：目标项目入口文件和 `docs/rules/`。
2. 长期上下文：`docs/DOMAIN_KNOWLEDGE.md`、`docs/PROJ_CONTEXT.md`、`docs/adr/`。
3. 单需求上下文：`docs/features/<feature-id>/`；`feature-id` 不明确时先查 `docs/PROJ_CONTEXT.md` 的 Feature 索引。
4. Review/Release 证据：相关 diff、分支、Commit、MR/PR、测试、CI、SQL、配置、脚本、缺陷和既有 `doc/versions/` 报告。

不得读取 `.env`、密钥文件、生产配置、生产凭证、未脱敏客户信息、未脱敏生产数据或生产日志原文。

## hicode 文档路径

项目级共享文档：

| 路径 | 用途 |
|---|---|
| `docs/DOMAIN_KNOWLEDGE.md` | 领域术语、业务域、保险核心场景、可复用业务规则 |
| `docs/PROJ_CONTEXT.md` | 项目定位、Feature 索引、模块结构、核心流程、接口依赖、历史风险 |
| `docs/adr/` | 架构、治理或难逆决策记录 |
| `docs/rules/` | 目标项目本地规则，只能补充或加严 hicode 规则 |

## hicode 单需求文档生命周期

单需求目录固定为 `docs/features/<feature-id>/`。`feature-id` 不明确时先查 Feature 索引；仍不明确时问用户，不得编造。

| 阶段 | 入口 | 可创建或更新 | 缺失材料处理 |
|---|---|---|---|
| Scope | `hicode:scope` | `feature_context.md`、`requirement-review-report.md`、`scope-report.md`、`task-split-plan.md` | 缺少目标、范围、规则、验收标准或 P0/P1 风险证据时，不输出 `TDD_INPUT_READY` |
| TDD | `hicode:tdd` | `tdd-report.md`，必要时补充 `feature_context.md` 的过程证据 | 缺少 Scope 产物、任务范围或测试重点时，说明缺口并回到 `hicode:scope` 或只做测试设计 |

## hicode Review 与 Release 报告

Review 和 Release 报告可以覆盖一个或多个 feature、分支、MR/PR、提交范围或发布版本，是项目级或分支级证据，不放入某个 feature 目录，统一写入 `doc/versions/`。

报告文件名必须在 `review-report` 或 `release-report` 后追加本地日期时间戳，格式为 `YYYYMMDD-HHmm`，例如 `review-report-20260622-1620.md`。若用户指定报告时间，以用户指定时间为准。

| 阶段 | 入口 | 可创建或更新 | 缺失材料处理 |
|---|---|---|---|
| Review | `hicode:review` | `doc/versions/review-report-<YYYYMMDD-HHmm>.md` | 缺少需求、Scope、TDD、diff 或验证结果时，标注需求轴或证据轴降级 |
| Release | `hicode:release` | `doc/versions/release-report-<YYYYMMDD-HHmm>.md` | 缺少发布范围、分支基准、需求证据、测试/Review 证据、验证计划或回滚计划时，标注证据缺口 |

## hicode 写入与安全边界

1. 只写已确认事实、证据、待确认问题、风险判断、真实命令和真实结果。
2. 未确认内容写 `待确认`；长期上下文、Feature 索引和正式 ADR 只能在负责人确认后更新。
3. 阶段报告可以记录证据缺口和风险建议，不代表最终审批、合并许可、发布许可或生产操作授权。
4. 禁止读取或输出密钥、Token、Cookie、Session、连接串、生产账号、生产 IP、生产配置、生产凭证、未脱敏客户信息、未脱敏生产数据或生产日志原文。
5. 禁止连接生产、执行生产 SQL、修改生产配置、自动提交、自动推送、自动合并、自动发布、自动回滚、删除测试、降低断言、跳过 Review 或替代负责人审批。
