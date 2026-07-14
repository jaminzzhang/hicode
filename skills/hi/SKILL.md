---
name: hi
description: 引导 hicode 目标项目的首次使用诊断、初始化状态检查和场景路由。Use when 用户只输入 hi、询问 hicode 怎么用、首次使用 hicode、检查初始化状态，或不确定应使用 hicode:init、hicode:scope、hicode:tdd、hicode:review 还是 hicode:release。
---

# hi

## 定位

`hi` 是 hicode 的总入口 Skill，负责诊断目标项目是否具备 hicode 使用条件，并把用户意图路由到 `hicode:init`、`hicode:scope`、`hicode:tdd`、`hicode:review` 或 `hicode:release`。

本 Skill 只做诊断、初始化建议、路由、安全边界和下一步建议，不默认读取全部规则，不扫描全仓代码，不生成目标项目文件。

`hi` 是 Skill 名称；`hicode:*` 是用户可见的场景路由表达。不要把 plugin 品牌、场景路由和总入口 Skill 名称混为一体。

## 当前入口

| 入口 | 使用场景 |
|---|---|
| `hi` | 诊断、路由、初始化建议和 hicode 用法简介 |
| `hicode:init` | 创建或补充目标项目入口、上下文和项目规则文档 |
| `hicode:scope` | 需求评审、范围界定、编码计划和编码准入 |
| `hicode:tdd` | 测试先行、RED-GREEN-REFACTOR 和受控实现 |
| `hicode:review` | 代码审查、提交检查和专项审查 |
| `hicode:release` | 发布分析、生产验证计划、回滚方案和发布风险判断 |

## 处理顺序

### 1. 先查安全红线

开始任何 hicode 任务前，先判断用户输入或可见材料是否涉及：

1. 密钥、Token、Cookie、Session、连接串、生产账号、生产 IP、内部密钥、`.env`、生产配置或生产凭证。
2. 未脱敏客户敏感信息、未脱敏生产数据或生产日志原文。
3. 连接生产环境、执行生产 SQL、发布、回滚、修改生产配置、自动合并或自动审批。

命中任一项时，停止推进，输出风险、证据缺口和建议人工安全流程；不得继续路由到实现、Review 或发布检查。

### 2. 识别“只输入 hi”场景

如果用户只输入 `hi`，没有其他意图、上下文、文件、diff、需求或发布材料：

1. 做轻量初始化诊断，只检查必要入口和上下文文件是否存在。
2. 不默认读取业务代码，不全仓扫描，不读取敏感配置。
3. 输出 hicode 用法简介，列出五个场景路由。
4. 如果未初始化或部分初始化，建议先使用 `hicode:init`。
5. 如果已初始化，提示用户可以补充需求、代码变更、Review 范围或发布材料后进入对应路由。

### 3. 做初始化状态诊断

除非用户明确要求只做概念说明，否则先做轻量判断：

1. 是否存在目标项目入口：`AGENTS.md` 或 `CLAUDE.md`。
2. 是否存在项目级共享文档：`docs/PROJ_CONTEXT.md`、`docs/DOMAIN_KNOWLEDGE.md`、`docs/adr/` 或同等文件。
3. 是否存在项目规则：`docs/rules/`、`docs/CODING_RULES.md`、`docs/TESTING_GUIDE.md`、`docs/REVIEW_RULES.md`、`docs/RELEASE_GUIDE.md` 或同等文件。
4. 若用户输入不清晰但像在指代历史需求，是否可以通过 `docs/PROJ_CONTEXT.md` 的 Feature 索引定位候选 `feature-id`。
5. 若任务已指向具体需求，是否存在单需求目录：`docs/features/<feature-id>/feature_context.md` 或同等文件。
6. 是否能识别当前任务属于初始化、需求范围、TDD/实现、Review 或发布检查。

诊断只检查必要文件名、Feature 索引和用户输入。Feature 索引只用于定位候选需求和交接上下文；缺少上下文时，不编造业务规则，不把推断写成事实。

## 初始化状态

| 状态 | 判断 | 默认动作 |
|---|---|---|
| 未初始化 | 缺少 `AGENTS.md` / `CLAUDE.md`，也缺少项目上下文 | 建议进入 `hicode:init` |
| 部分初始化 | 有入口或上下文，但缺少关键风险、规则或输出边界 | 输出补齐建议，必要时进入 `hicode:init` |
| 已初始化 | 入口、上下文和当前任务规则足以支撑执行 | 路由到对应场景 Skill |
| 需修复 | 入口、上下文或安全边界冲突 | 先列出冲突和修复建议 |

## 路由规则

按以下优先级路由：

1. 检测到需要初始化，或用户要求初始化、补齐项目入口、创建项目上下文或项目规则文档时，使用 `hicode:init`。
2. 想要梳理分析需求、评审需求、根据需求制定计划，或者想要编码实现但需求目标、范围、业务规则、影响面或编码准入不清时，使用 `hicode:scope`。
3. 需要编码实现、测试先行、失败复现、RED-GREEN-REFACTOR、缺陷修复证据或受控实现时，使用 `hicode:tdd`。
4. 需要代码审查、提交检查、安全、Java、SQL 或高严谨领域业务等专项审查时，使用 `hicode:review`。
5. 需要发布分析、生产验证计划、回滚方案或发布风险判断时，使用 `hicode:release`。

如果多个路由同时命中，按风险和依赖顺序处理：先 `init` 补足入口和上下文，再 `scope` 澄清需求与准入，再 `tdd` 实现和验证，再 `review` 审查，最后 `release` 汇总发布风险。

## hicode 用法简介

回答“只输入 hi”或“hicode 怎么用”时，给出短说明：

1. `hi`：先诊断项目是否初始化，并告诉用户下一步该走哪个 hicode 场景。
2. `hicode:init`：初始化或补齐目标项目入口、上下文和项目规则。
3. `hicode:scope`：澄清需求、评审范围、形成编码计划和 TDD 输入。
4. `hicode:tdd`：按测试先行和 RED-GREEN-REFACTOR 做受控实现或修复。
5. `hicode:review`：做代码审查、提交检查和专项风险审查。
6. `hicode:release`：做发布分析、生产验证计划、回滚方案和发布风险判断。

简介必须短，不要复制长规则全文。

## 需要读取的规则

默认不读取所有规则。只有当前回答需要具体依据、风险分级或输出口径时，按需读取目标项目规则：

1. `docs/rules/` 下由 `hicode:init` 创建或更新的项目规则文件。
2. 目标项目已有的 `docs/CODING_RULES.md`、`docs/TESTING_GUIDE.md`、`docs/REVIEW_RULES.md`、`docs/RELEASE_GUIDE.md` 或同等规则文件。

缺少目标项目规则时，不读取本仓库 Hook 说明或其他 Skill 内置文件替代；应将初始化状态标记为未完成，并建议进入 `hicode:init`。

## 安全边界

始终禁止：

1. 读取或输出密钥、Token、Cookie、Session、连接串、生产账号、生产 IP、内部密钥、`.env`、生产配置或生产凭证。
2. 处理未脱敏客户敏感信息、未脱敏生产数据或生产日志原文。
3. 连接生产环境、执行生产 SQL、发布、回滚或修改生产配置。
4. 自动提交、推送、合并、发布、回滚或替代负责人审批。
5. 删除测试、降低断言、跳过 Review 或隐藏 P0/P1 风险。

命中安全红线时，停止推进，输出风险、证据缺口和建议人工流程。

## 输出要求

回答 `hi` 入口类问题时，输出：

1. 诊断结论。
2. 初始化状态。
3. 建议路由。
4. 依据或缺口。
5. 风险等级。
6. 建议动作。
7. 待确认问题。
8. 建议更新的上下文或 hicode 资产。

不要输出最终审批、准许合并、准许发布或可以上线。
