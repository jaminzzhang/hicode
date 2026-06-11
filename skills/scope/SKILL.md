---
description: Use when a requirement needs clarification, scope control, financial-core risk review, coding-plan readiness, or implementation-entry evidence before coding.
---

# hicode scope

## 定位

`hicode:scope` 覆盖需求到编码前链路。它直接帮助 Coding Agent 澄清需求、界定范围、识别风险、形成编码计划和 TDD 输入。

本 Skill 不生成业务实现代码，不进入 TDD 或本地修改，不输出最终审批。

## 必读规则

执行前按需读取：

1. `../../references/rules/shared/safety-and-risk.md`
2. `../../references/rules/shared/permissions.md`
3. `../../references/rules/shared/output.md`
4. `../../references/rules/scope/README.md`

需要固定报告骨架时读取：

1. `../../references/templates/scope/scope-report.md`

不得读取历史资产原文、历史准入文档、历史结构化校验文件、细粒度历史 Skill 或归档资产作为当前规则源。

## 执行流程

### 1. 固定任务阶段

先判断用户当前要做的是：

1. 需求评审。
2. 范围界定。
3. 编码计划。
4. 编码准入检查。
5. 上下文更新建议。

若用户实际要求实现、测试、Review 或发布检查，应建议转到 `hicode:tdd`、`hicode:review` 或 `hicode:release`。

### 2. 收集输入

确认是否已有：

1. 需求摘要、PRD、故事链接、会议纪要或脱敏材料。
2. `docs/PRD_CONTEXT.md`、`docs/PROJ_CONTEXT.md`、`docs/DOMAIN_KNOWLEDGE.md`、`docs/DEFECT_CASES.md`。
3. 涉及模块、接口、表、配置、SQL、批处理、外部系统或发布范围。
4. 已澄清问题、未澄清问题和负责人确认记录。

缺少输入时，不编造业务规则；输出待确认问题和影响。

### 3. 检查范围和风险

必须检查：

1. 需求目标、范围内、范围外和验收标准是否明确。
2. 业务规则、边界、异常、数据来源和负责人是否可追溯。
3. 保险核心业务逻辑、金额、交易一致性、状态流转、幂等、权限、审计、隐私、监管、生产变更和回滚是否涉及。
4. 影响范围是否定位到模块、接口、类、方法、表、配置、SQL、批处理或外部依赖。
5. 是否需要 ADR。
6. 是否具备 TDD 输入。

### 4. 判断停止条件

命中以下情况时，不得建议进入编码：

1. 需求目标、范围、验收标准或核心业务规则不清。
2. P0/P1 风险未关闭，或无法排除高风险。
3. 影响范围无法定位。
4. 需要 ADR 但未形成决策草案或确认路径。
5. 输入包含未脱敏客户信息、生产数据或密钥。

### 5. 形成编码计划

输入充分时，输出：

1. 改动目标。
2. 影响范围。
3. 建议实现步骤。
4. TDD 测试重点。
5. 核心场景测试建议。
6. 风险清单。
7. ADR 判断。
8. 上下文更新建议。

## 输出要求

默认使用 Markdown，包含：

1. 建议结论：`PASS`、`CONDITIONAL_PASS`、`BLOCKED` 或 `NEEDS_CONFIRMATION`。
2. 最高风险等级。
3. 依据和输入缺口。
4. 需求摘要、范围内和范围外。
5. 影响范围。
6. 风险与阻断建议。
7. TDD 测试重点。
8. ADR 判断。
9. 待确认问题。
10. 上下文更新建议。

不得输出“准许编码”“审批通过”或替代负责人判断。
