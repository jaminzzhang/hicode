# Shared Rules

## 定位

`references/rules/shared/` 保存所有 hicode 场景共用的短规则。它服务 `hicode`、`init`、`scope`、`tdd`、`review`、`release` Skill 和专业 Agent 的按需读取，不是完整指南库。

共享规则只回答五类问题：

1. 哪些安全红线必须停止推进。
2. 金融核心系统风险基线如何检查。
3. P0/P1/P2/P3 风险如何分级。
4. Agent 能读取、修改和执行命令到什么边界。
5. Markdown 输出应如何保持结构化、可审计和建议性质。

## 文件

| 文件 | 用途 | 读取时机 |
|---|---|---|
| `safety-and-risk.md` | 安全红线、金融核心系统风险基线、风险分级 | 所有高风险、变更、Review、测试、发布和门禁类任务 |
| `permissions.md` | 工具权限、文件修改、受限命令、审计证据 | 需要读取材料、修改文件、执行命令或调用工具时 |
| `output.md` | Markdown 结构化输出、稳定枚举、建议结论 | 需要输出计划、报告、Review、门禁建议或发布检查时 |

## 使用规则

1. 先读取当前 Skill 或 Agent，再按需读取本目录文件。
2. 具体场景规则优先放在 `references/rules/init/`、`scope/`、`tdd/`、`review/`、`release/`。
3. 共享规则与场景规则冲突时，采用更严格的安全边界。
4. 本目录不得引用归档区作为运行依赖。
5. 本目录不得保存输出模板全文；模板属于 `references/templates/`。
