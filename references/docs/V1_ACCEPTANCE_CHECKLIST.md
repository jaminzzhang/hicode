# V1 验收检查清单

> 本清单用于 P5-WP8。它把 V1 验收分为“本仓库可验收项”和“依赖试点运行数据项”。本仓库只能验收 Harness 源资产是否齐备、口径是否一致、示例是否脱敏和风险边界是否明确；试点效果指标必须依赖真实试点数据，不能在本仓库内编造。

## 1. 使用方式

验收时逐项填写：

| 字段 | 说明 |
|---|---|
| 验收状态 | 通过 / 不通过 / 待确认 / 不适用 |
| 证据来源 | 文件路径、报告、样例、统计口径或负责人确认材料 |
| 风险等级 | P0 / P1 / P2 / P3 / 无 |
| 建议动作 | 补资产、补证据、转试点统计、负责人确认或暂缓 |

P0/P1、安全、敏感信息、生产越权、自动合并、自动发布、关键证据缺失等问题不得写成普通风险接受。

## 2. 本仓库可验收项

### 2.1 资产建设验收

| 类别 | 验收项 | 验收标准 | 证据来源 | 验收状态 | 风险等级 | 建议动作 |
|---|---|---|---|---|---|---|
| 入口 | 本仓库 Agent 入口规则 | 根目录 `AGENTS.md` 明确项目定位、默认读取顺序、工作包状态流转、资产目录、安全边界和输出要求 | `AGENTS.md` | 待确认 | P1 | 验收时核对是否仍与 `docs/PROGRESS.md` 一致 |
| 入口 | 目标项目 Agent 入口模板 | `references/target-project/AGENTS.md` 可作为目标项目入口，说明上下文索引、工作流路由、安全边界和输出规范 | `references/target-project/AGENTS.md` | 待确认 | P1 | 目标项目试装前复核路径 |
| 上下文 | 目标项目核心文档模板 | 覆盖领域知识、项目上下文、单需求上下文、编码、测试、Review、发布、缺陷、ADR 和 workflow | `references/docs/` | 待确认 | P1 | 检查文档之间术语和路径是否一致 |
| Prompt | Prompt 模板库 | 覆盖需求评审、编码计划、TDD、辅助编码、代码审查、提交检查、核心场景测试和发布检查 | `references/prompts/` | 待确认 | P1 | 随机抽检 Prompt 是否包含结论、依据、风险、建议动作、待确认问题和验证要求 |
| Skill | V1 核心 Skill | 覆盖需求评审、编码计划、TDD、辅助编码、代码审查、提交检查、核心场景测试和发布检查，不拆成大量细碎 Skill | `references/skills/` | 待确认 | P1 | 检查每个 Skill 是否有 `SKILL.md` 和 `output-template.md` |
| 门禁 | 门禁规则与报告模板 | 覆盖需求准入、编码准入、提测、合并和发布准入；默认提醒型，P0 和敏感信息必须给出阻断建议 | `references/gates/` | 待确认 | P1 | 检查阻断建议项和普通风险提示项是否分离 |
| Schema | 结构化输出 Schema | 覆盖 Review、门禁、风险等级等核心结构化结果，保持 V1 可手工使用，不绑定平台接口 | `references/schemas/` | 待确认 | P2 | 校验 JSON 解析和相对 `$ref` |
| 示例 | Skill 示例案例 | 覆盖 P4 全链路 Skill 示例，且不包含真实客户敏感信息、生产数据、密钥或生产配置 | `references/examples/*.md` | 待确认 | P1 | 做敏感信息扫描和人工抽检 |
| 回归 | 资产回归样例 | 覆盖需求评审、代码审查、发布检查和金融核心高风险样例 | `references/examples/regression/` | 待确认 | P1 | 按回归样例执行轻量回归 |

### 2.2 统一规则验收

| 类别 | 验收项 | 验收标准 | 证据来源 | 验收状态 | 风险等级 | 建议动作 |
|---|---|---|---|---|---|---|
| 风险 | 统一风险分级 | P0/P1/P2/P3 口径在 Prompt、Skill、门禁、Schema 和回归样例中一致 | `CONTEXT.md`、`references/docs/`、`references/schemas/risk-level.schema.json` | 待确认 | P1 | 抽查高风险样例是否按统一等级输出 |
| Review | Review 分层规则 | Review 总则和 Java、SQL、安全、保险业务细则分离，代码审查按 diff 触发细则 | `references/docs/REVIEW_RULES.md`、`references/docs/review-rules/`、`references/prompts/code-review.md` | 待确认 | P1 | 验收时确认代码审查 Prompt 不复制所有细则全文 |
| Review | 双轴代码审查 | 规范轴和需求轴分别输出，缺少需求来源时需求轴降级，不给无条件通过 | `CONTEXT.md`、`references/prompts/code-review.md`、`references/skills/code-review/output-template.md` | 待确认 | P1 | 用代码审查回归样例检查 |
| 权限 | 工具权限与操作审计矩阵 | 明确 L0-L4 权限等级、只读、建议、本地修改、受限命令和禁止操作 | `references/docs/TOOL_PERMISSION_AUDIT_MATRIX.md` | 待确认 | P0 | 验收时确认不授权生产操作和自动发布 |
| 门禁 | 阻断建议项 | P0/P1、敏感信息、密钥、未脱敏生产数据、生产越权、自动合并/发布、关键证据缺失进入阻断建议 | `references/gates/README.md`、`references/gates/_gate-template.md` | 待确认 | P0 | 抽检门禁文件 |
| Schema | 稳定枚举代码 | 机器枚举使用英文稳定代码，中文原文作为标签或摘要 | `CONTEXT.md`、`references/schemas/` | 待确认 | P2 | 校验枚举是否跨文件一致 |

## 3. 研发流程验收项

### 3.1 需求与编码

| 类别 | 验收项 | 验收标准 | 证据来源 | 验收状态 | 风险等级 | 建议动作 |
|---|---|---|---|---|---|---|
| 需求 | 需求评审能力 | 能识别背景、目标、范围、流程、业务规则、验收标准、负责人缺口和金融核心风险 | `references/prompts/requirement-review.md`、`references/skills/requirement-review/` | 待确认 | P1 | 用需求评审回归样例验证 |
| 需求 | 需求准入门禁 | 缺少 P0/P1 澄清、核心业务规则、验收标准或敏感信息风险时不得建议通过 | `references/gates/requirement-entry-gate.md` | 待确认 | P1 | 抽查门禁建议结论规则 |
| 编码 | 编码计划能力 | 进入编码前必须确认上下文清晰、范围明确、无歧义、无冲突，并给出 ADR 判断 | `references/prompts/coding-plan.md`、`references/skills/coding-plan/` | 待确认 | P1 | 检查上下文清晰门槛 |
| 编码 | TDD 与辅助编码 | 代码修改必须有 TDD 或测试先行证据；不得删除测试、降低断言或 RED 状态重构 | `references/prompts/tdd.md`、`references/prompts/coding-assistant.md`、`references/skills/tdd/`、`references/skills/coding-assistant/` | 待确认 | P1 | 抽查 TDD 示例和 Skill 模板 |
| 编码 | 编码准入门禁 | 编码计划、上下文清晰门槛、ADR 判断和 P0 问题关闭证据齐备 | `references/gates/coding-entry-gate.md` | 待确认 | P1 | 用编码计划示例核对 |

### 3.2 Review、测试和发布

| 类别 | 验收项 | 验收标准 | 证据来源 | 验收状态 | 风险等级 | 建议动作 |
|---|---|---|---|---|---|---|
| Review | 代码审查能力 | 基于明确 diff 范围输出规范轴、需求轴、P0/P1/P2/P3 问题、测试建议和上下文更新建议 | `references/prompts/code-review.md`、`references/skills/code-review/` | 待确认 | P1 | 用代码审查回归样例验证 |
| Review | 提交检查能力 | 消费代码审查结果，检查分支、需求关联、测试构建扫描、SQL、配置、脚本、敏感信息和 MR/PR 描述 | `references/prompts/pre-commit-check.md`、`references/skills/pre-commit-check/` | 待确认 | P1 | 抽查是否缺少 Review 时不得无条件建议提交 |
| 测试 | 核心场景测试能力 | 输出必测、回归、边界、异常、安全、隐私、数据、Mock 和自动化可行性，不替代测试负责人确认 | `references/prompts/core-scenario-test.md`、`references/skills/core-scenario-test/` | 待确认 | P1 | 检查证据分层准入 |
| 门禁 | 提测门禁 | 编译、单测、TDD 证据、AI Review、提交检查、核心场景和敏感信息风险齐备后才建议通过 | `references/gates/coding-to-test-gate.md` | 待确认 | P1 | 抽查 P0/P1 处理规则 |
| 门禁 | 合并门禁 | AI Review、人工 Review、CI、覆盖率、未关闭 P0/P1 和敏感信息风险齐备后才建议进入人工合并 | `references/gates/merge-gate.md` | 待确认 | P1 | 确认不授权自动合并 |
| 发布 | 发布检查能力 | 汇总发布范围、需求清单、分支制品、测试、缺陷、SQL、配置、生产验证点和回滚方案 | `references/prompts/release-check.md`、`references/skills/release-check/` | 待确认 | P1 | 用发布检查回归样例验证 |
| 发布 | 发布准入门禁 | 发布范围、需求、制品、测试、缺陷、SQL、配置、回滚和生产验证点齐备后才建议通过 | `references/gates/release-gate.md` | 待确认 | P1 | 确认不授权自动发布或生产操作 |

## 4. 安全与合规验收项

| 类别 | 验收项 | 验收标准 | 证据来源 | 验收状态 | 风险等级 | 建议动作 |
|---|---|---|---|---|---|---|
| 安全 | 敏感信息禁止 | Prompt、Skill、门禁、示例和回归样例不得包含真实客户敏感信息、生产数据、密钥或生产配置 | 全部 hicode 根目录源资产 | 待确认 | P0 | 执行敏感信息扫描并人工抽检 |
| 安全 | 生产操作禁止 | Agent 不得连接生产、查生产日志、执行生产 SQL、调用生产接口、修改生产配置、发布或回滚 | `AGENTS.md`、`TOOL_PERMISSION_AUDIT_MATRIX.md`、各 Prompt / Skill / Gate | 待确认 | P0 | 抽检发布检查和门禁 |
| 安全 | 自动合并和自动发布禁止 | 所有资产只给建议，不替代负责人、审批流、CI/CD 或发布平台 | `AGENTS.md`、`references/gates/`、`references/prompts/` | 待确认 | P0 | 检查是否出现批准、最终通过、自动发布等表述 |
| 合规 | 审计证据 | Prompt、Skill 和门禁输出应记录输入材料、检查范围、结论依据、命令记录、阻断建议和上下文更新建议 | `TOOL_PERMISSION_AUDIT_MATRIX.md`、`references/gates/_gate-template.md` | 待确认 | P1 | 抽检输出模板 |
| 合规 | 金融核心风险基线 | 明确覆盖保险核心业务逻辑、金额、交易一致性、状态流转、幂等、权限、审计、隐私、监管、生产变更和回滚 | `CONTEXT.md`、`references/docs/`、`references/prompts/README.md` | 待确认 | P1 | 用高风险回归样例验证 |

## 5. 依赖试点运行数据项

以下项目不能在本仓库内直接判定达成，只能在真实试点运行后由负责人基于数据验收。

| 类别 | 验收项 | 目标建议 | 证据来源 | 当前状态 | 风险等级 | 建议动作 |
|---|---|---|---|---|---|---|
| 需求 | 需求评审覆盖 | 重点需求 >=80% | 需求系统、评审报告统计 | 待试点数据 | P2 | P6 指标采集方案定义统计口径 |
| 编码 | 编码计划覆盖 | 重点需求 >=70% | 编码计划报告统计 | 待试点数据 | P2 | 区分高风险和普通需求 |
| 编码 | ADR 判断覆盖 | 已生成编码计划的需求 100% 给出 ADR 判断 | 编码计划报告、ADR 记录或确认材料 | 待试点数据 | P2 | ADR 是否正式记录由技术负责人确认 |
| 编码 | AI Review 覆盖 | 试点 MR >=80% | MR/PR 记录、AI Review 报告 | 待试点数据 | P2 | 不替代人工 Review |
| 编码 | 提交前检查覆盖 | 试点项目 >=80% | 提交检查报告、MR/PR 材料 | 待试点数据 | P2 | V1 可人工执行 |
| 测试 | 核心场景沉淀 | 至少沉淀 20 个核心场景 | 核心场景测试报告、测试负责人确认 | 待试点数据 | P2 | 区分场景建议和已执行用例 |
| 发布 | 发布前检查覆盖 | 试点发布 100% 覆盖 | 发布检查报告、发布负责人确认 | 待试点数据 | P1 | 不自动发布 |
| 质量 | 有效问题率 | AI Review 有效问题率 >=60% | 人工抽样确认、Review 复盘 | 待试点数据 | P2 | 记录样本口径和误报漏报 |
| 质量 | 误报 / 漏报记录 | 持续记录并复盘 | 回归记录、复盘报告 | 待试点数据 | P2 | 用于 Prompt / Skill 优化 |
| 安全 | 敏感信息泄露 | 0 | 输入输出抽检、安全负责人确认 | 待试点数据 | P0 | 发现即阻断并复盘 |
| 安全 | 未经 Review 的 AI 代码合入 | 0 | MR/PR 审计、人工 Review 记录 | 待试点数据 | P0 | AI 生成代码必须人工 Review |
| 运营 | 试点复盘 | 输出 V1 评估报告 | 复盘报告、负责人确认 | 待试点数据 | P2 | 区分事实、分析、建议和待确认事项 |

## 6. 建议验收流程

1. 先按第 2 至第 4 节完成仓库资产验收。
2. 对任一 P0/P1 不通过项，先补资产或补证据，不进入 P5 阶段完成结论。
3. 对依赖试点运行数据项，仅记录统计口径和当前缺口，不写成已达成。
4. 完成仓库资产验收后，进入 P6 试点运营支撑资产建设。
5. 真实试点结束后，再用第 5 节数据项补充 V1 试点运行效果验收。

## 7. P5 阶段收口检查

| 检查项 | 期望结果 | 证据来源 | 状态 |
|---|---|---|---|
| 门禁目录和模板齐备 | 是 | `references/gates/README.md`、`_gate-template.md` | 待确认 |
| 五类节点门禁齐备 | 是 | `requirement-entry-gate.md`、`coding-entry-gate.md`、`coding-to-test-gate.md`、`merge-gate.md`、`release-gate.md` | 待确认 |
| 权限审计矩阵齐备 | 是 | `references/docs/TOOL_PERMISSION_AUDIT_MATRIX.md` | 待确认 |
| 结构化 Schema 齐备 | 是 | `references/schemas/` | 待确认 |
| 回归样例齐备 | 是 | `references/examples/regression/` | 待确认 |
| V1 验收清单齐备 | 是 | `references/docs/V1_ACCEPTANCE_CHECKLIST.md` | 待确认 |

## 8. 禁止误用

1. 不把本清单中的待试点数据项写成当前已达成。
2. 不用本清单替代研发负责人、测试负责人、安全负责人、发布负责人或业务负责人的最终确认。
3. 不为了收口降低 P0/P1、敏感信息、生产越权、SQL、配置或回滚风险。
4. 不把门禁建议写成最终审批、自动合并或自动发布。
