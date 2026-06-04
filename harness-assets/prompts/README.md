# Prompts

## 1. 目录定位

本目录保存 V1 AI Harness Prompt 模板，用于约束 Coding Agent 在需求评审、编码计划、TDD、辅助编码、代码审查、提交检查、核心场景测试和发布检查中的输入、处理规则、安全边界和输出格式。

- 本仓库产出路径：`harness-assets/prompts/`
- 目标项目落地路径：`.ai-harness/prompts/`
- 维护对象：AI 工程化小组、研发负责人、质量负责人
- 主要使用者：开发人员、Coding Agent、节点门禁 Agent
- 更新时机：流程变化、质量规则变化、安全规则变化、Prompt 使用复盘后

Prompt 是 Agent 工作的执行入口之一，但不替代 `AGENTS.md`、`docs/` 上下文文档、人工 Review 或发布审批。本仓库中先使用可见源目录维护资产，后续由安装脚本把 Prompt 放入目标项目的 `.ai-harness/prompts/`。

## 2. 设计原则

1. 中文为主，英文为辅；文件名、路径、代码标识、协议名和通用技术术语可保留英文。
2. Prompt 必须绑定具体研发场景，不写泛化、不可验收的万能 Prompt。
3. Prompt 必须明确输入、处理规则、输出格式和质量标准，避免只给一句自然语言指令。
4. Prompt 只给出辅助分析、计划、建议、检查报告或草稿，不替代负责人最终判断。
5. Prompt 必须引用现有上下文文档，发现缺口时输出更新建议，不把未确认内容当作事实。
6. Prompt 输出不得包含未脱敏客户敏感信息、生产账号、Token、Cookie、Session、连接串、生产 IP 或内部密钥。
7. Prompt 不得要求 Agent 自动合并、自动发布、修改生产配置或直接操作生产环境。

## 3. 命名规则

Prompt 文件使用小写英文短横线命名，和工作流、Skill 名称保持一致。

| 场景 | Prompt 文件 | 对应 workflow | 后续 Skill |
|---|---|---|---|
| 需求评审 | `requirement-review.md` | `docs/workflows/requirement-review.md` | `skills/requirement-review/` |
| 编码计划 | `coding-plan.md` | `docs/workflows/coding-plan.md` | `skills/coding-plan/` |
| TDD | `tdd.md` | `docs/workflows/tdd.md` | `skills/tdd/` |
| 辅助编码 | `coding-assistant.md` | 待确认 | `skills/coding-assistant/` |
| 代码审查 | `code-review.md` | `docs/workflows/code-review.md` | `skills/code-review/` |
| 提交检查 | `pre-commit-check.md` | `docs/workflows/pre-commit-check.md` | `skills/pre-commit-check/` |
| 核心场景测试 | `core-scenario-test.md` | `docs/workflows/core-scenario-test.md` | `skills/core-scenario-test/` |
| 发布检查 | `release-check.md` | `docs/workflows/release-check.md` | `skills/release-check/` |

`coding-assistant.md` 的 workflow 是否独立成文待 P3-WP3 或 P4-WP4 确认；在确认前，辅助编码 Prompt 应引用编码计划、TDD 和编码规范。

## 4. 标准结构

每个 Prompt 必须包含以下章节：

1. 角色：Agent 应扮演的研发职责，不写超出职责的身份。
2. 目标：本次 Prompt 要完成的具体产出。
3. 适用场景：什么时候使用，什么时候不使用。
4. 必读上下文：执行前必须读取的文档或输入。
5. 输入：用户或工具需要提供的信息。
6. 处理规则：Agent 的分析、检查、生成和验证步骤。
7. 安全约束：不可读取、不可输出、不可执行的行为。
8. 输出格式：固定章节、表格或清单。
9. 质量标准：判断输出是否可用的标准。
10. 待确认问题：无法判断时必须抛给人工确认的问题。
11. 上下文更新建议：需要补充到目标项目 `docs/`、目标项目 `.ai-harness/`，或本仓库 `harness-assets/` 源目录的内容。
12. 禁止事项：场景内明确禁止的越权动作。

通用模板见 `_template.md`。

## 5. 必读上下文规则

Prompt 模板应优先引用目标项目中的以下文档：

1. `AGENTS.md`
2. `docs/DOMAIN_KNOWLEDGE.md`
3. `docs/PRD_CONTEXT.md`
4. `docs/PROJ_CONTEXT.md`
5. `docs/CODING_RULES.md`
6. `docs/TESTING_GUIDE.md`
7. `docs/REVIEW_RULES.md`
8. `docs/RELEASE_GUIDE.md`
9. `docs/DEFECT_CASES.md`
10. `docs/ADR/`
11. `docs/workflows/`

具体 Prompt 只列出本场景需要的上下文，不要求每次读取所有文档。涉及发布时必须读取 `docs/RELEASE_GUIDE.md`；涉及 Review 或合并前检查时必须读取 `docs/REVIEW_RULES.md`；涉及编码和测试时必须读取 `docs/CODING_RULES.md` 和 `docs/TESTING_GUIDE.md`。

## 6. 输入规则

Prompt 不应假设上下文已经完整。输入不足时必须输出“待确认问题”，而不是补编业务规则。

常见输入包括：

1. 需求文档、需求编号或需求摘要。
2. 相关代码范围、模块名、接口名或 diff 摘要。
3. 编码计划、测试计划、TDD 输出或 Review 报告。
4. CI、测试、静态扫描、缺陷、发布申请或变更清单。
5. 已脱敏的日志摘要、错误码、调用链摘要或测试数据。

不得要求输入真实客户数据、生产日志原文、生产连接串、密钥文件、`.env`、生产配置文件或未脱敏凭证。

## 7. 安全红线

所有 Prompt 必须显式包含以下安全约束：

1. 不读取密钥、Token、Cookie、Session、连接串、生产账号、生产 IP 或内部密钥。
2. 不读取 `.env`、密钥文件、生产配置文件或生产凭证。
3. 不处理未脱敏真实客户数据或未脱敏生产数据。
4. 不把客户姓名、证件号、手机号、银行卡号、保单号、客户号、地址、邮箱等敏感信息输出到报告、示例或测试数据中。
5. 不直接操作生产环境。
6. 不自动合并 MR / PR。
7. 不自动发布。
8. 不自动修改生产配置。
9. 不为了通过检查而删除断言、绕过测试、降低质量门禁或隐瞒风险。

发现输入中包含敏感信息时，Prompt 应要求先脱敏，并仅基于脱敏后的摘要继续处理。

## 8. 输出规则

除非具体 Prompt 有更细结构，审查、计划、测试和发布类输出应至少包含：

1. 结论。
2. 依据或证据来源。
3. 风险等级。
4. 建议动作。
5. 待确认问题。
6. 建议更新的上下文或 Harness 资产。

输出应直接、可执行、可验收。不得只输出笼统建议。

## 9. 质量标准

可交付 Prompt 应满足：

1. 能让不同 Agent 在同一场景下产出结构一致的结果。
2. 能明确区分事实、推断、风险和待确认事项。
3. 能引用对应上下文文档和 workflow。
4. 能覆盖关键安全红线。
5. 能产出可用于人工 Review、提交检查、测试补充或发布审批的材料。
6. 不复制大段需求正文，只保留必要规则和引用。

## 10. 维护规则

1. 新增或修改 Prompt 前，先确认对应 workflow、上下文文档和安全规则。
2. Prompt 使用复盘后，如果发现缺口，应优先补充本目录模板或对应场景 Prompt。
3. 如果变更涉及跨场景规则，应同步检查 `_template.md`。
4. 如果变更涉及流程或责任边界，应同步检查 `docs/workflows/` 或 ADR。
5. 如果发现新业务风险或历史缺陷，应输出 `docs/DEFECT_CASES.md` 更新建议。
