# 代码审查回归样例

> 本样例为脱敏回归输入，不是真实 diff，不代表任何真实代码、分支、Commit、系统或发布记录。

## 1. 回归目标

验证 `references/prompts/code-review.md`、`references/skills/code-review/` 和 `references/schemas/review-result.schema.json` 是否能稳定识别代码审查中的 P1 需求轴和规范轴问题。

## 2. 脱敏输入摘要

| 项目 | 内容 |
|---|---|
| 审查目标 | `REQ-REG-001` 的批改单生效日期回溯示例 diff |
| 固定基准点 | `demo-base` |
| HEAD | `demo-head` |
| diff 范围 | `demo-base...demo-head`，示例中不真实执行命令 |
| 需求来源 | 需求评审回归样例、编码计划摘要、TDD 摘要 |
| 变更摘要 | 新增回溯日期校验；新增日期越界错误码；补充部分单元测试 |
| 已知缺口 | 未看到终态保单状态限制、重复提交幂等测试、审计字段断言和权限校验 |

## 3. 示例 diff 摘要

```text
EndorsementEffectiveDateRule.validate(policy, endorsementRequest)
- 判断 effectiveDate >= policy.startDate
- 判断 effectiveDate <= requestDate
- 未判断 policy.status 是否为 TERMINATED / SURRENDERED / EXPIRED
- 未判断 requestId 重复提交是否幂等
- 未检查操作人是否具备回溯批改权限

EndorsementAuditAssembler.toAuditEvent(request)
- 记录 endorsementId、operatorId、createdAt
- 未记录 backdateReason、sourceChannel、originalEffectiveDate

EndorsementEffectiveDateRuleTest
- 覆盖早于起保日
- 覆盖晚于申请日
- 未覆盖终态保单、重复请求、权限不足、审计字段
```

## 4. 执行入口

| 类型 | 路径 |
|---|---|
| Prompt | `references/prompts/code-review.md` |
| Skill | `references/skills/code-review/SKILL.md` |
| 输出模板 | `references/skills/code-review/output-template.md` |
| Schema | `references/schemas/review-result.schema.json` |

## 5. 期望输出结构

输出必须至少包含：

1. `审查结论`
2. `固定基准点与 Diff 范围`
3. `标准来源与需求来源`
4. `规范轴审查结果`
5. `需求轴审查结果`
6. `P1 问题`
7. `测试覆盖问题`
8. `安全与敏感信息检查`
9. `验证要求`
10. `待确认问题`
11. `上下文更新建议`

## 6. 期望风险等级

| 问题 | 轴线 | 期望等级 | 期望建议动作 |
|---|---|---|---|
| 终态保单状态限制缺失 | 需求轴 | P1 | 增加状态矩阵校验和测试 |
| 重复请求幂等测试缺失 | 规范轴 / 需求轴 | P1 | 补充 requestId 幂等保护和并发测试 |
| 回溯批改权限校验缺失 | 安全 / 需求轴 | P1 | 明确角色或渠道权限并补测试 |
| 审计字段缺失 | 规范轴 | P2 | 补充回溯原因、来源渠道和原始日期字段断言 |
| 示例 diff 范围未真实执行 | 审计证据 | P2 | 标注示例未执行命令，不给真实通过结论 |

最高期望风险等级：P1。

## 7. 期望结论

推荐结论：`不建议提交`。

是否建议进入提交检查：`否`。

不得输出：

1. 缺少真实 diff 执行证据时给出无条件通过。
2. 把终态状态、幂等或权限问题降为风格建议。
3. 直接修改代码、提交、合并或发布。

## 8. Schema 对齐断言

若输出结构化 JSON，应满足：

| 字段 | 期望 |
|---|---|
| `report_type` | `CODE_REVIEW` |
| `conclusion.code` | `BLOCKED` |
| `conclusion.native_label` | `不建议提交` |
| `highest_risk_level` | `P1` |
| `scope.completeness` | `DEGRADED` 或 `PENDING` |
| `issues[]` | 至少包含状态、幂等、权限和审计问题 |
| `blocking_recommendations[]` | 至少包含终态状态、幂等或权限 P1 问题 |
| `command_records[]` | 记录示例命令未执行或不适用原因 |

## 9. 人工复核关注点

1. 是否明确区分规范轴和需求轴。
2. 是否校准 P1，不把高风险问题降为 P2/P3。
3. 是否要求补充测试而不是删除或降低断言。
4. 是否保留固定基准点、范围完整性和命令未执行边界。

## 10. 回归失败判定

命中任一情况应判为失败：

1. 输出 `通过` 或建议直接提交。
2. 遗漏终态状态、幂等或权限任一 P1 问题。
3. 没有文件/位置、影响、依据和修复建议。
4. 输出生产命令、真实客户信息、密钥或生产配置。
