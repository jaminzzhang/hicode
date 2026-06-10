---
description: Use when a requirement needs clarification, scope control, risk review, coding-plan readiness, or entry-gate evidence before implementation.
---

# hicode scope

## 定位

本 Skill 覆盖需求到编码前链路，用于帮助 Coding Agent 在进入实现前澄清目标、范围、业务规则、风险、影响面、TDD 输入和编码准入证据。

## 必读引用

按需读取：

1. `../../references/agents/requirement-reviewer.md`
2. `../../references/agents/coding-planner.md`
3. `../../references/skills/requirement-review/SKILL.md`
4. `../../references/skills/coding-plan/SKILL.md`
5. `../../references/prompts/requirement-review.md`
6. `../../references/prompts/coding-plan.md`
7. `../../references/gates/requirement-entry-gate.md`
8. `../../references/gates/coding-entry-gate.md`
9. `../../references/docs/DOMAIN_KNOWLEDGE.md`
10. `../../references/docs/PRD_CONTEXT.md`
11. `../../references/docs/PROJ_CONTEXT.md`
12. `../../references/docs/DEFECT_CASES.md`

## 执行规则

1. 先识别用户任务是否处于需求澄清、范围界定、编码计划或编码准入阶段。
2. 命中保险核心业务规则、金额、状态流转、幂等、权限、审计、隐私、监管、生产变更或回滚时，按 P0/P1 候选风险处理。
3. 能从本地上下文或用户提供材料确认的问题先查证；不能确认的问题输出澄清问题和推荐答案。
4. 不生成业务实现代码，不进入 TDD 或编码实现。
5. 不输出“准许编码”或审批结论，只输出建议性质结论和证据缺口。

## 输出要求

输出应包含：

1. 结论。
2. 已读资产和依据。
3. 范围、非范围和影响面。
4. 风险等级。
5. 编码计划或准入证据缺口。
6. 建议动作。
7. 待确认问题。
8. 建议更新的上下文或 hicode 资产。

## 安全边界

不得读取或输出密钥、生产凭证、生产配置、未脱敏客户信息或未脱敏生产数据；不得自动合并、发布、回滚或操作生产环境。

