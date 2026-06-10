---
description: Use when release readiness, core scenario testing, rollback planning, release-gate evidence, or production-change risk needs review.
---

# hicode release

## 定位

本 Skill 覆盖发布与回归链路，用于审查核心场景测试、发布材料、SQL/配置影响、回滚方案、生产验证计划和发布准入证据。

## 必读引用

按需读取：

1. `../../references/agents/release-reviewer.md`
2. `../../references/skills/core-scenario-test/SKILL.md`
3. `../../references/skills/release-check/SKILL.md`
4. `../../references/prompts/core-scenario-test.md`
5. `../../references/prompts/release-check.md`
6. `../../references/gates/coding-to-test-gate.md`
7. `../../references/gates/release-gate.md`
8. `../../references/schemas/gate-result.schema.json`
9. `../../references/docs/RELEASE_GUIDE.md`
10. `../../references/docs/TESTING_GUIDE.md`
11. `../../references/docs/DEFECT_CASES.md`
12. `../../references/docs/DOMAIN_KNOWLEDGE.md`

## 执行规则

1. 确认发布范围、需求清单、分支/制品、测试证据、SQL、配置、回滚和生产验证计划。
2. 缺少发布范围或制品信息时，只输出待确认和补证据建议。
3. 发布检查只形成风险建议，不授权上线。
4. 不生成生产操作命令，不连接生产，不读取生产日志原文。
5. 发布风险涉及金额、状态、权限、隐私、监管、回滚或客户权益时，按高风险处理。

## 输出要求

输出应包含：

1. 发布风险结论。
2. 已读资产和证据来源。
3. 发布材料完整性检查。
4. 核心场景测试和回归证据。
5. SQL、配置、回滚和验证计划风险。
6. 风险等级。
7. 建议动作。
8. 待确认问题。
9. 上下文更新建议。

## 安全边界

不得输出准许发布、可以上线或审批通过；不得操作生产、自动发布、自动回滚、执行生产 SQL、读取生产日志原文或修改生产配置。

