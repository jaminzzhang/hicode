---
description: Use when a target project needs to understand, diagnose, initialize, or route hicode workflows for insurance and financial core system Coding Agent work.
---

# hicode

## 定位

`hicode` 是总入口 Skill，负责诊断目标项目是否具备 hicode 使用条件，并把任务路由到 `init`、`scope`、`tdd`、`review` 或 `release`。

本 Skill 只做诊断、路由、安全边界和下一步建议，不默认读取全部规则，不扫描全仓代码，不生成目标项目文件。

## 当前入口

| 入口 | 使用场景 |
|---|---|
| `hicode` | 诊断、路由、初始化建议和安全边界说明 |
| `hicode:init` | 创建或补充目标项目入口、上下文和项目规则文档 |
| `hicode:scope` | 需求评审、范围界定、编码计划和编码准入 |
| `hicode:tdd` | 测试先行、RED-GREEN-REFACTOR 和受控实现 |
| `hicode:review` | 代码审查、提交检查和专项审查 |
| `hicode:release` | 核心场景测试、发布检查、回滚和发布风险 |

## 快速诊断

开始 hicode 任务时，先做轻量判断：

1. 是否存在目标项目入口：`AGENTS.md` 或 `CLAUDE.md`。
2. 是否存在项目上下文：`docs/PROJ_CONTEXT.md`、`docs/PRD_CONTEXT.md`、`docs/DOMAIN_KNOWLEDGE.md` 或同等文件。
3. 是否能识别当前任务属于初始化、需求范围、TDD/实现、Review 或发布检查。
4. 是否命中安全红线：密钥、生产配置、未脱敏客户信息、未脱敏生产数据、生产操作、自动合并、自动发布或回滚。

诊断只检查必要文件和用户输入，不默认全仓扫描。

## 初始化状态

| 状态 | 判断 | 默认动作 |
|---|---|---|
| 未初始化 | 缺少 `AGENTS.md` / `CLAUDE.md`，也缺少项目上下文 | 建议进入 `hicode:init` |
| 部分初始化 | 有入口或上下文，但缺少关键风险、规则或输出边界 | 输出补齐建议，必要时进入 `hicode:init` |
| 已初始化 | 入口、上下文和当前任务规则足以支撑执行 | 路由到对应场景 Skill |
| 需修复 | 入口、上下文或安全边界冲突 | 先列出冲突和修复建议 |

## 路由规则

1. 用户要求初始化、补齐项目入口或创建项目文档时，使用 `hicode:init`。
2. 需求目标、范围、业务规则、影响面或编码准入不清时，使用 `hicode:scope`。
3. 需要测试先行、失败复现、RED-GREEN-REFACTOR 或受控实现时，使用 `hicode:tdd`。
4. 需要代码审查、提交检查、安全/Java/SQL/保险专项审查时，使用 `hicode:review`。
5. 需要核心场景测试、发布材料检查、回滚、生产验证计划或发布风险判断时，使用 `hicode:release`。

## 需要读取的规则

默认不读取所有规则。只有当前回答需要具体依据时，按需读取：

1. 共享安全和输出边界：`../../references/rules/shared/`
2. 初始化规则：`../../references/rules/init/`
3. 场景规则：`../../references/rules/scope/`、`tdd/`、`review/`、`release/`

不得把归档资产作为当前执行依据。

## 安全边界

始终禁止：

1. 读取或输出密钥、Token、Cookie、Session、连接串、生产账号、生产 IP、内部密钥、`.env`、生产配置或生产凭证。
2. 处理未脱敏客户敏感信息、未脱敏生产数据或生产日志原文。
3. 连接生产环境、执行生产 SQL、发布、回滚或修改生产配置。
4. 自动提交、推送、合并、发布、回滚或替代负责人审批。
5. 删除测试、降低断言、跳过 Review 或隐藏 P0/P1 风险。

命中安全红线时，停止推进，输出风险、证据缺口和建议人工流程。

## 输出要求

回答 hicode 入口类问题时，输出：

1. 诊断结论。
2. 初始化状态。
3. 建议路由。
4. 依据或缺口。
5. 风险等级。
6. 建议动作。
7. 待确认问题。

不要输出最终审批、准许合并、准许发布或可以上线。
