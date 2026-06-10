---
description: Use when work needs test-first design, RED-GREEN-REFACTOR guidance, controlled implementation readiness, bugfix evidence, or coding-assistant routing.
---

# hicode tdd

## 定位

本 Skill 覆盖 TDD 与辅助编码链路，用于把编码计划转化为测试先行证据、行为切片、最小实现约束和辅助编码输入。

本 Skill 是可直接执行的场景 Skill。引用文件用于补充细则和证据，不是把执行责任转交给 `references/`。

## 必读引用

按需读取：

1. `../../agents/tdd-guide.md`
2. `../../agents/coding-assistant.md`
3. `../../references/skills/tdd/SKILL.md`
4. `../../references/skills/coding-assistant/SKILL.md`
5. `../../references/prompts/tdd.md`
6. `../../references/prompts/coding-assistant.md`
7. `../../references/gates/coding-entry-gate.md`
8. `../../references/gates/coding-to-test-gate.md`
9. `../../references/docs/CODING_RULES.md`
10. `../../references/docs/TESTING_GUIDE.md`
11. `../../references/docs/DEFECT_CASES.md`

## 执行规则

1. 确认是否已有需求上下文、编码计划和测试先行输入。
2. 实现模式必须先有编码计划和 TDD 输入；修复模式必须先有失败用例、复现测试或可验证失败证据。
3. 按一个可观察行为一轮循环推进 RED-GREEN-REFACTOR。
4. 缺少 TDD 证据时，不建议直接实现生产代码。
5. 修改文件前必须确认用户允许修改范围，并记录验证动作或未执行原因。

## 直接执行能力

1. 测试先行设计：把需求或编码计划拆成可观察行为、Given-When-Then、边界、异常和回归场景。
2. RED-GREEN-REFACTOR 路由：要求先确认 RED，再实现最小 GREEN，最后在 GREEN 状态重构。
3. 修复准入：从失败用例、复现测试、缺陷证据或 Review 发现中判断是否足以进入修复。
4. 辅助编码约束：只在测试先行证据、修改范围和用户确认明确时建议实现或修复。
5. 子 Agent 委托：复杂测试设计可委托 `tdd-guide`，受控实现可委托 `coding-assistant`，但最终输出仍由本 Skill 汇总。

## 输出要求

输出应包含：

1. TDD 路由结论。
2. 行为切片和测试设计。
3. RED/GREEN/REFACTOR 状态或计划。
4. 辅助编码准入判断。
5. 风险等级。
6. 验证动作。
7. 待确认问题。
8. 上下文更新建议。

## 安全边界

不得通过删除测试、降低断言、跳过 Review 或隐藏风险推动通过；不得读取密钥、生产配置、未脱敏客户信息或未脱敏生产数据；不得自动合并、发布或操作生产环境。
