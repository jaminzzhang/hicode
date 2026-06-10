---
description: Use when code changes need review, security review, Java or SQL review, pre-commit checks, merge-gate evidence, or high-risk issue triage.
---

# hicode review

## 定位

本 Skill 覆盖 Review 与提交链路，用于执行代码审查、提交检查、安全专项审查、Java/SQL/保险核心后端专项审查和合并前风险证据整理。

本 Skill 是可直接执行的场景 Skill。引用文件用于补充细则和证据，不是把执行责任转交给 `references/`。

## 必读引用

按需读取：

1. `../../agents/code-reviewer.md`
2. `../../agents/security-reviewer.md`
3. `../../agents/java-reviewer.md`
4. `../../references/skills/code-review/SKILL.md`
5. `../../references/skills/pre-commit-check/SKILL.md`
6. `../../references/prompts/code-review.md`
7. `../../references/prompts/pre-commit-check.md`
8. `../../references/gates/merge-gate.md`
9. `../../references/schemas/review-result.schema.json`
10. `../../references/schemas/gate-result.schema.json`
11. `../../references/docs/REVIEW_RULES.md`
12. `../../references/docs/review-rules/java.md`
13. `../../references/docs/review-rules/sql.md`
14. `../../references/docs/review-rules/security.md`
15. `../../references/docs/review-rules/insurance-domain.md`

## 执行规则

1. 先确认 diff、基准点、需求来源、测试证据和审查范围。
2. 代码审查优先输出 bug、风险、行为回归和缺失测试，不把风格偏好升级为高严重度。
3. 命中权限、密钥、隐私、生产数据、审计、监管、Java 事务、SQL、金额或保险核心后端风险时，转入专项审查口径。
4. 缺少需求来源时说明需求轴降级；缺少专项规则时说明降级影响。
5. 不输出合并许可或最终审批。

## 直接执行能力

1. 代码审查：围绕明确 diff 输出 bug、行为回归、缺失测试、风险等级和修复建议。
2. 提交检查：检查需求关联、测试证据、构建/扫描结果、SQL/配置/脚本、敏感信息和 MR/PR 材料。
3. 专项审查：按触发条件委托或套用安全、Java、SQL、保险核心业务专项规则。
4. 合并证据：整理 AI Review、人工 Review、CI、覆盖率、P0/P1 关闭证据和风险缺口。
5. 子 Agent 委托：可按风险委托 `code-reviewer`、`security-reviewer` 或 `java-reviewer`，但最终输出仍由本 Skill 汇总。

## 输出要求

输出应包含：

1. 发现列表，按严重度排序。
2. 文件或证据位置。
3. 具体失败场景和影响。
4. 风险等级。
5. 建议修复或补证据动作。
6. 未覆盖范围。
7. 待确认问题。
8. 上下文更新建议。

## 安全边界

不得读取或输出密钥、生产凭证、生产配置、未脱敏客户信息或未脱敏生产数据；不得自动提交、推送、合并、发布或修改生产配置。
