# 辅助编码 Skill 示例案例

> 本示例为 P4-WP7 脱敏结构示例，不是真实试点结果，不代表任何真实客户、保单、系统、分支或发布记录。

## 1. 适用 Skill

`harness-assets/skills/coding-assistant/SKILL.md`

## 2. 脱敏输入摘要

任务模式：实现

输入材料：

1. 编码计划示例：批改单生效日期规则调整。
2. TDD 示例：已设计日期边界、状态限制和审计行为测试。
3. 允许修改范围：示例规则类、示例错误码映射、示例审计事件组装。
4. 禁止修改范围：数据库结构、发布配置、真实接口鉴权、生产脚本。

示例目标：输出补丁草案，说明如何以最小实现满足第 1 轮和第 2 轮 TDD 行为。

## 3. 处理重点

1. 必须先检查编码计划和 TDD 输入。
2. 只围绕允许修改范围输出最小实现草案。
3. 修改说明必须对应 RED-GREEN-REFACTOR 证据。
4. 示例不在本仓库真实修改业务代码。

## 4. 示例输出片段

### 4.1 结论

结论：已输出补丁草案

任务模式：实现

说明：示例基于已确认编码计划和 TDD 设计输出最小补丁草案。未在本仓库执行真实业务代码修改。

### 4.2 准入与 TDD 证据

| 项目 | 结论 | 依据 | 不满足时动作 |
|---|---|---|---|
| 任务模式明确 | 通过 | 用户指定实现模式 | 不适用 |
| 编码计划存在 | 通过 | 编码计划示例 | 不适用 |
| TDD 输入存在 | 通过 | TDD 示例 | 不适用 |
| RED 证据 | 待确认 | 示例未在真实目标项目执行 | 真实执行前不得声称通过 |
| GREEN 证据 | 待确认 | 示例未在真实目标项目执行 | 真实执行后补记录 |
| 允许修改范围明确 | 通过 | 示例规则类和错误码映射 | 不适用 |
| P0/P1 待确认问题关闭 | 通过 | 示例假设已关闭 | 不适用 |

### 4.3 修改文件清单

| 文件 | 修改内容 | 原因 | 是否在范围内 |
|---|---|---|---|
| `demo/EndorsementEffectiveDateRule.java` | 增加日期闭区间校验 | 满足 B1/B2 行为 | 是 |
| `demo/EndorsementErrorCode.java` | 增加日期越界错误码 | 支持明确断言 | 是 |

### 4.4 RED-GREEN-REFACTOR 执行记录

| 循环 | 行为 | RED 结果 | GREEN 结果 | REFACTOR 结果 | 证据 |
|---|---|---|---|---|---|
| 1 | 允许边界内日期 | 示例未执行 | 示例未执行 | 不适用 | 真实项目需补充命令输出 |
| 2 | 拒绝早于起保日 | 示例未执行 | 示例未执行 | 不适用 | 真实项目需补充命令输出 |

### 4.5 核心逻辑说明

补丁草案应只做三件事：

1. 当批改原因不在允许清单内时，沿用原规则。
2. 当批改原因在允许清单内时，校验生效日期位于保单起保日和申请日期的闭区间内。
3. 日期越界时返回稳定错误码，供接口层和测试断言使用。

### 4.6 示例补丁草案

说明：以下为结构示例，不是真实项目代码。

```java
ValidationResult validate(EndorsementRequest request, PolicySnapshot policy) {
    if (!allowedBackdateReasons.contains(request.reason())) {
        return validateByOriginalRule(request, policy);
    }

    if (request.effectiveDate().isBefore(policy.startDate())) {
        return ValidationResult.reject("EFFECTIVE_DATE_BEFORE_POLICY_START");
    }

    if (request.effectiveDate().isAfter(request.applyDate())) {
        return ValidationResult.reject("EFFECTIVE_DATE_AFTER_APPLY_DATE");
    }

    return ValidationResult.ok();
}
```

### 4.7 受限命令执行记录

| 命令 | 是否执行 | 结果 | 未执行原因或风险 |
|---|---|---|---|
| `mvn test -Dtest=EndorsementEffectiveDateRuleTest` | 否 | 未执行 | 本文件是 Harness 示例，不在真实目标项目中运行 |

## 5. 人工复核关注点

1. 真实实现时是否已有 RED 失败证据。
2. 最小实现是否超出编码计划范围。
3. 错误码、日志、审计字段是否符合目标项目规范。

## 6. 禁止误用说明

1. 不得把补丁草案当作已完成真实代码修改。
2. 不得删除测试或降低断言来取得 GREEN。
3. 不得修改数据库、发布配置、生产脚本或真实密钥文件。
