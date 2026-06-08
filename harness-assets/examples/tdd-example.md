# TDD Skill 示例案例

> 本示例为 P4-WP7 脱敏结构示例，不是真实试点结果，不代表任何真实客户、保单、系统、分支或发布记录。

## 1. 适用 Skill

`harness-assets/skills/tdd/SKILL.md`

## 2. 脱敏输入摘要

需求编号：`REQ-DEMO-2026-001`

编码计划结论：建议启动编码

目标行为：指定批改原因允许回溯生效日期，但不得早于保单起保日、晚于申请日期；指定终态保单不允许回溯。

示例公开入口：

1. 规则入口：`EndorsementEffectiveDateRule.validate(request, policySnapshot)`
2. 接口入口：`POST /demo/endorsements`

## 3. 处理重点

1. 每一轮 TDD 只覆盖一个可观察行为。
2. 测试使用虚构日期和虚构状态。
3. Mock 外部保单查询和审计客户端，不连接真实数据库或真实外部系统。
4. 未实际执行的命令必须标注为示例未执行。

## 4. 示例输出片段

### 4.1 结论

结论：建议进入辅助编码

说明：编码计划、上下文清晰门槛和影响范围均已明确，可以按 RED-GREEN-REFACTOR 进行实现。示例命令未在本仓库执行。

### 4.2 TDD 准入检查

| 检查项 | 结果 | 依据 | 不满足时动作 |
|---|---|---|---|
| 编码计划存在 | 通过 | 编码计划示例已给出 | 不适用 |
| 上下文清晰门槛满足 | 通过 | 需求、范围、状态限制已确认 | 不适用 |
| P0/P1 待确认问题关闭 | 通过 | 示例假设已关闭 | 不适用 |
| 影响范围足以设计测试 | 通过 | 规则类和接口入口明确 | 不适用 |
| 测试框架或验证方式明确 | 通过 | 示例使用 JUnit 5 | 不适用 |

### 4.3 行为清单与优先级

| 编号 | 可观察行为 | 公开接口或入口 | 优先级 | 风险等级 |
|---|---|---|---|---|
| B1 | 允许起保日至申请日期之间的日期 | 规则入口 | P0 | P1 |
| B2 | 拒绝早于起保日的日期 | 规则入口 | P0 | P1 |
| B3 | 拒绝晚于申请日期的日期 | 规则入口 | P0 | P1 |
| B4 | 拒绝终态保单回溯批改 | 规则入口 | P0 | P1 |
| B5 | 回溯时写入审计事件 | 接口入口 | P1 | P2 |

### 4.4 RED-GREEN-REFACTOR 循环计划

| 循环 | 行为 | RED 测试 | GREEN 最小实现边界 | REFACTOR 条件 | 验证命令 |
|---|---|---|---|---|---|
| 1 | 允许边界内日期 | `allows_effective_date_between_policy_start_and_apply_date` | 只实现日期闭区间判断 | 测试通过后再抽取日期比较函数 | `mvn test -Dtest=EndorsementEffectiveDateRuleTest` |
| 2 | 拒绝早于起保日 | `rejects_effective_date_before_policy_start` | 增加下界错误 | GREEN 后整理错误码命名 | 同上 |
| 3 | 拒绝晚于申请日期 | `rejects_effective_date_after_apply_date` | 增加上界错误 | GREEN 后去重日期校验 | 同上 |
| 4 | 拒绝终态保单 | `rejects_backdated_change_for_closed_policy` | 增加状态集合判断 | GREEN 后整理状态枚举 | 同上 |

### 4.5 Given-When-Then 用例

| 编号 | Given | When | Then | 断言重点 |
|---|---|---|---|---|
| G1 | 保单起保日为 `2026-01-01`，申请日为 `2026-02-01` | 生效日选择 `2026-01-15` | 校验通过 | 闭区间内允许 |
| G2 | 同上 | 生效日选择 `2025-12-31` | 校验失败 | 错误码为日期早于起保日 |
| G3 | 同上 | 生效日选择 `2026-02-02` | 校验失败 | 错误码为日期晚于申请日 |
| G4 | 保单状态为 `TERMINATED` | 选择回溯日期 | 校验失败 | 错误码为状态不允许 |

### 4.6 测试代码草案

说明：以下内容为示例片段，未执行前不得视为已通过。

```java
@Test
void rejectsEffectiveDateBeforePolicyStart() {
    var request = demoRequest("ADDRESS_CHANGE", LocalDate.of(2025, 12, 31));
    var policy = demoPolicy("IN_FORCE", LocalDate.of(2026, 1, 1));

    var result = rule.validate(request, policy);

    assertThat(result.errorCode()).isEqualTo("EFFECTIVE_DATE_BEFORE_POLICY_START");
}
```

### 4.7 受限命令执行记录

| 命令 | 是否执行 | 结果 | 未执行原因或风险 |
|---|---|---|---|
| `mvn test -Dtest=EndorsementEffectiveDateRuleTest` | 否 | 未执行 | 本文件是 Harness 示例，不在真实目标项目中运行 |

## 5. 人工复核关注点

1. 测试是否通过公开入口验证行为，而不是测试私有方法。
2. Mock 是否只替代外部依赖，不隐藏核心规则。
3. RED 和 GREEN 证据是否在真实目标项目中实际产生。

## 6. 禁止误用说明

1. 不得把示例测试代码当作已执行结果。
2. 不得连接真实数据库、真实外部系统或生产环境补充测试数据。
3. 不得在 RED 状态做重构。
