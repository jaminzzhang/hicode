---
description: Use when work needs test-first design, RED-GREEN-REFACTOR guidance, controlled implementation, bugfix evidence, or local verification before review.
---

# hicode tdd

## 定位

`hicode:tdd` 覆盖测试先行、RED-GREEN-REFACTOR、修复复现和受控本地实现。它把明确需求或编码计划转化为可验证行为和最小修改。

本 Skill 可以在用户确认范围后修改本地代码、测试或必要文档，但不得跳过测试先行证据。

## 必读规则

执行前按需读取：

1. `../../references/rules/shared/safety-and-risk.md`
2. `../../references/rules/shared/permissions.md`
3. `../../references/rules/shared/output.md`
4. `../../references/rules/tdd/README.md`

需要固定报告骨架时读取：

1. `../../references/templates/tdd/tdd-report.md`

不得读取历史资产原文、历史准入文档、历史结构化校验文件、细粒度历史 Skill 或归档资产作为当前规则源。

## 执行流程

### 1. 判断任务模式

先确认任务属于哪一类：

1. 测试设计：只输出测试计划、场景、Mock、数据和断言。
2. 修复复现：先建立失败用例或可验证失败证据。
3. 受控实现：在已有编码计划和 TDD 输入下修改本地文件。
4. 只读解释：解释代码、测试、失败或风险，不修改文件。

范围不清或 P0/P1 待确认问题未关闭时，只能做只读分析或测试前置建议。

### 2. 检查准入

进入本地修改前必须满足：

1. 需求范围、编码计划或修复目标明确。
2. 用户确认允许修改的文件范围。
3. 测试目标、行为切片和预期结果明确。
4. 测试数据已脱敏或使用虚构数据。
5. 不涉及密钥、生产配置、生产数据、未脱敏客户信息或生产操作。

缺少任一条件时，输出待确认问题，不直接实现生产代码。

### 3. RED-GREEN-REFACTOR

按一个可观察行为一轮推进：

1. RED：先写失败测试，或在无法写测试时说明失败证据和缺口。
2. GREEN：只做最小实现让当前测试通过。
3. REFACTOR：在测试保护下整理代码，保持行为不变。
4. RECORD：记录修改文件、命令、结果和未验证原因。

不得为了通过测试删除测试、降低断言、跳过 Review 或隐藏风险。

### 4. 测试设计

测试设计必须覆盖：

1. 正常、边界、异常、历史缺陷和安全场景。
2. 金额、日期、状态、责任、权限、外部调用、幂等和审计。
3. Mock 策略：单元测试不得访问真实数据库、真实外部系统、真实账号、Cookie、Session 或生产配置。
4. 测试数据：客户、保单、账号、Token、生产响应必须脱敏或虚构。
5. 断言：金额、日期、状态、异常、外部调用和审计字段要明确。

### 5. 本地验证

优先运行与修改范围最接近的本地非生产命令：

1. 单元测试。
2. 指定模块测试。
3. 构建、静态检查或格式检查。
4. 敏感信息扫描。

命令必须来自项目已有脚本、文档、工具配置或用户确认。无法执行时说明原因和残余风险。

## 输出要求

默认使用 Markdown，包含：

1. 建议结论：`PASS`、`CONDITIONAL_PASS`、`BLOCKED` 或 `NEEDS_CONFIRMATION`。
2. 任务模式和最高风险等级。
3. 测试目标与范围。
4. 测试场景和 Given-When-Then。
5. Mock、测试数据和断言规则。
6. RED-GREEN-REFACTOR 记录。
7. 修改文件清单。
8. 受限命令执行记录。
9. 风险、待确认问题和上下文更新建议。

不得输出最终合并、发布或上线审批结论。
