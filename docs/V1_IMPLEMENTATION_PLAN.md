# V1 开发实施计划

## 1. 计划定位

本计划将 `docs/研发 AI 工程化方案V1.1.md` 中的 V1 路线拆解为本仓库可交付的 Harness 工程资产建设工作包。

本计划只定义阶段、工作包、输入、输出、依赖和验收标准，不展开详细设计。Prompt 文案、Skill 内部规则、Schema 字段、门禁实现细节和试点执行细节，等到具体工作包实施时再单独设计。

## 2. 目标

V1 的目标是建立一套可被开发 Agent 持续读取、执行和更新的 AI Harness 工程化资产，让后续 Agent 能快速理解：

1. 项目为什么建设。
2. V1 要交付哪些资产。
3. 当前推进到哪个工作包。
4. 每个工作包的输入、输出、依赖和验收口径。
5. 哪些事项属于本仓库资产建设，哪些属于外部试点运营依赖。

## 3. 范围边界

### 3.1 本仓库范围内

1. Agent 入口规则和项目术语上下文。
2. V1 实施计划和项目进度台账。
3. `docs/` 下的上下文、规范、流程和模板文档。
4. `.ai-harness/` 下的 Prompt、Skill、门禁、Schema 和示例资产。
5. V1 验收检查清单和试点运营支撑模板。

### 3.2 本仓库范围外

1. 真实试点项目的业务代码改造。
2. 试点人员排班、发布执行和组织运营安排。
3. 生产环境操作、生产配置修改和生产数据处理。
4. 平台化集成、自动化测试平台和监控预警能力，这些属于 V2/V3 或外部平台建设。

## 4. 工作包规则

工作包编号使用 `P<阶段号>-WP<序号>`。

每个工作包必须具备：

1. 目标。
2. 输入。
3. 输出。
4. 依赖。
5. 验收标准。

工作包状态由 `docs/PROGRESS.md` 维护，固定状态为：

1. `未开始`
2. `进行中`
3. `阻塞`
4. `待验收`
5. `已完成`
6. `暂缓`

## 5. 阶段总览

| 阶段 | 名称 | 目标 | 主要交付物 |
|---|---|---|---|
| P1 | 项目入口与进度机制 | 确保每次开发 Agent 都能了解项目全貌和当前进度 | `AGENTS.md`、`CONTEXT.md`、`docs/V1_IMPLEMENTATION_PLAN.md`、`docs/PROGRESS.md` |
| P2 | 上下文与规范文档 | 建立人可读、Agent 可引用的知识和规范资产 | `docs/` 核心文档、ADR 模板、流程文档 |
| P3 | Prompt 模板库 V1 | 为 V1 核心研发场景提供可复用 Prompt | `.ai-harness/prompts/` |
| P4 | Skill 工程资产 V1 | 为 V1 核心能力沉淀 Skill 说明和输出模板 | `.ai-harness/skills/` |
| P5 | 门禁与验收资产 | 建立节点门禁、结构化 Schema 和 V1 验收检查口径 | `.ai-harness/gates/`、`.ai-harness/schemas/`、验收清单 |
| P6 | 试点运营支撑 | 为真实试点运行提供清单、记录和复盘模板 | 试点项目清单、指标采集方案、试点记录、复盘模板 |

## 6. P1 项目入口与进度机制

### P1-WP1 项目入口与术语上下文

目标：建立开发 Agent 的第一入口和项目统一术语。

输入：

1. `docs/研发 AI 工程化方案V1.1.md`
2. 用户确认的项目定位、语言规则和术语边界

输出：

1. `AGENTS.md`
2. 根目录 `CONTEXT.md`

依赖：无。

验收标准：

1. `AGENTS.md` 明确项目目标、需求来源、工作语言、安全边界和输出要求。
2. `CONTEXT.md` 只记录术语和概念边界，不混入实施计划或详细设计。
3. 明确根目录 `CONTEXT.md` 与未来 `docs/PROJ_CONTEXT.md` 的区别。

### P1-WP2 V1 实施计划

目标：把需求文档中的 V1 路线拆成可执行工作包，供后续 Agent 接力推进。

输入：

1. `docs/研发 AI 工程化方案V1.1.md`
2. `AGENTS.md`
3. `CONTEXT.md`

输出：

1. `docs/V1_IMPLEMENTATION_PLAN.md`

依赖：

1. P1-WP1

验收标准：

1. 覆盖 V1 准备期、Skill 建设期、试点运行期和评估推广期。
2. 工作包拆到可交给开发 Agent 独立推进的粒度。
3. 不提前展开 Prompt、Skill、Schema 或门禁详细设计。
4. 明确本仓库范围和外部试点运营依赖。

### P1-WP3 项目进度台账

目标：让每次开发 Agent 都能知道当前阶段、当前任务、已完成事项、阻塞点和下一步。

输入：

1. `docs/V1_IMPLEMENTATION_PLAN.md`
2. `CONTEXT.md`

输出：

1. `docs/PROGRESS.md`

依赖：

1. P1-WP2

验收标准：

1. 以工作包编号跟踪状态。
2. 使用固定状态枚举。
3. 记录当前阶段、当前工作包、已完成事项、阻塞点和下一步。
4. 明确工作包状态变更时必须更新本文件。

## 7. P2 上下文与规范文档

### P2-WP1 `docs/` 目录与基础模板

目标：建立需求文档推荐的核心文档结构。

输入：

1. `docs/研发 AI 工程化方案V1.1.md` 的 3.3、3.4 章节
2. P1 文档

输出：

1. `docs/DOMAIN_KNOWLEDGE.md`
2. `docs/PROJ_CONTEXT.md`
3. `docs/PRD_CONTEXT.md`
4. `docs/CODING_RULES.md`
5. `docs/TESTING_GUIDE.md`
6. `docs/REVIEW_RULES.md`
7. `docs/RELEASE_GUIDE.md`
8. `docs/DEFECT_CASES.md`
9. `docs/ADR/README.md`
10. `docs/ADR/ADR-template.md`
11. `docs/workflows/`

依赖：

1. P1-WP2

验收标准：

1. 文件结构与需求文档推荐目录一致。
2. 每个文档有清晰定位、维护对象、更新时机和占位章节。
3. 文档不复制大段需求正文，只保留可维护模板。

### P2-WP2 领域知识文档初版

目标：沉淀意健险领域术语、核心业务域和高风险规则的初版结构。

输入：

1. 需求文档中的业务域、风险点和核心场景说明
2. P2-WP1 文档模板

输出：

1. `docs/DOMAIN_KNOWLEDGE.md`

依赖：

1. P2-WP1

验收标准：

1. 覆盖投保、批改、退保、核保、理赔前置、收付费、渠道交互等核心域的索引。
2. 标出金额、日期、状态流转、责任判断、权限和客户隐私等高风险主题。
3. 不编造未确认业务规则，未知内容标注 `待确认`。

### P2-WP3 需求与研发上下文模板

目标：建立单需求上下文和仓库/模块上下文模板。

输入：

1. 需求文档 3.4.2、3.4.3 模板
2. P2-WP1 文档模板

输出：

1. `docs/PRD_CONTEXT.md`
2. `docs/PROJ_CONTEXT.md`

依赖：

1. P2-WP1

验收标准：

1. `docs/PRD_CONTEXT.md` 覆盖需求基本信息、目标、范围、规则、流程、数据、澄清点、风险、测试和发布关注点。
2. `docs/PROJ_CONTEXT.md` 明确它是研发上下文文档，不替代根目录术语表。
3. 两个模板都能直接被需求评审、编码计划、TDD 和代码审查工作包引用。

### P2-WP4 编码与测试规范文档

目标：建立辅助编码、TDD、提交检查可引用的编码和测试规范。

输入：

1. 需求文档中的编码、测试、安全和质量要求
2. P2-WP1 文档模板

输出：

1. `docs/CODING_RULES.md`
2. `docs/TESTING_GUIDE.md`

依赖：

1. P2-WP1

验收标准：

1. 编码规则覆盖分层、异常、日志、事务、幂等、金额、日期、外部调用和敏感信息。
2. 测试指南覆盖正常、边界、异常、Mock、断言、测试数据和核心逻辑单测要求。
3. 规则可被 Prompt、Skill 和门禁直接引用。

### P2-WP5 Review、发布和缺陷文档

目标：建立 AI Review、发布前检查和历史缺陷复盘可引用的规则资产。

输入：

1. 需求文档中的 Review、提交检查、发布检查和缺陷防范要求
2. P2-WP1 文档模板

输出：

1. `docs/REVIEW_RULES.md`
2. `docs/RELEASE_GUIDE.md`
3. `docs/DEFECT_CASES.md`

依赖：

1. P2-WP1

验收标准：

1. Review 规则覆盖需求一致性、架构规范、业务逻辑、异常、日志、性能、安全、测试和可维护性。
2. 发布指南覆盖需求、分支、提交、SQL、配置、测试、缺陷、验证点和回滚。
3. 缺陷案例文档提供可持续追加的案例格式和防范规则字段。

### P2-WP6 ADR 与流程文档

目标：建立架构决策记录模板和研发流程说明。

输入：

1. 需求文档中的 ADR 判断规则和工作流程
2. P2-WP1 文档模板

输出：

1. `docs/ADR/README.md`
2. `docs/ADR/ADR-template.md`
3. `docs/workflows/requirement-review.md`
4. `docs/workflows/coding-plan.md`
5. `docs/workflows/tdd.md`
6. `docs/workflows/code-review.md`
7. `docs/workflows/pre-commit-check.md`
8. `docs/workflows/core-scenario-test.md`
9. `docs/workflows/release-check.md`

依赖：

1. P2-WP1

验收标准：

1. ADR 模板只用于草稿和确认后的记录，不允许 Agent 自动合入架构决策。
2. 每个 workflow 文档说明触发条件、输入、输出和下一步。
3. workflow 文档与后续 Prompt 和 Skill 工作包一一对应。

## 8. P3 Prompt 模板库 V1

### P3-WP1 Prompt 模板规范

目标：统一 V1 Prompt 的结构、语言、安全约束和输出口径。

输入：

1. `AGENTS.md`
2. P2 核心文档

输出：

1. `.ai-harness/prompts/README.md`
2. `.ai-harness/prompts/_template.md`

依赖：

1. P2-WP4
2. P2-WP5

验收标准：

1. Prompt 统一包含角色、目标、输入、处理规则、安全约束、输出格式和质量标准。
2. 中文为主，英文为辅。
3. 明确不读取密钥、不处理生产数据、不自动发布、不自动合并。

### P3-WP2 需求评审与编码计划 Prompt

目标：建立需求进入开发前的两个核心 Prompt。

输入：

1. P2 上下文文档
2. 需求文档 4.1.2、4.2.1 章节
3. P3-WP1 Prompt 模板规范

输出：

1. `.ai-harness/prompts/requirement-review.md`
2. `.ai-harness/prompts/coding-plan.md`

依赖：

1. P3-WP1

验收标准：

1. 需求评审 Prompt 能输出评审结论、完整性检查、风险、歧义、测试关注点和 `PRD_CONTEXT` 更新建议。
2. 编码计划 Prompt 能输出影响范围、建议步骤、TDD 重点、风险、待确认问题和 ADR 判断。

### P3-WP3 TDD 与辅助编码 Prompt

目标：建立编码阶段测试前置和辅助实现 Prompt。

输入：

1. P2 编码和测试规范
2. 需求文档 4.2.2、4.2.3 章节
3. P3-WP1 Prompt 模板规范

输出：

1. `.ai-harness/prompts/tdd.md`
2. `.ai-harness/prompts/coding-assistant.md`

依赖：

1. P3-WP1
2. P3-WP2

验收标准：

1. TDD Prompt 覆盖测试目标、范围、场景、Given-When-Then、边界、异常、Mock、断言和测试数据。
2. 辅助编码 Prompt 明确必须基于编码计划和 TDD 输入，不允许超范围修改、删除测试、绕过异常处理或输出敏感信息。

### P3-WP4 代码审查与提交检查 Prompt

目标：建立 MR 前质量检查 Prompt。

输入：

1. P2 Review、测试、编码和缺陷文档
2. 需求文档 4.2.4、4.2.5 章节
3. P3-WP1 Prompt 模板规范

输出：

1. `.ai-harness/prompts/code-review.md`
2. `.ai-harness/prompts/pre-commit-check.md`

依赖：

1. P3-WP1
2. P3-WP3

验收标准：

1. 代码审查 Prompt 使用 P0/P1/P2/P3 分级。
2. 提交检查 Prompt 覆盖需求关联、分支、单测、Review、覆盖率、SQL、配置、脚本和敏感信息。

### P3-WP5 核心场景测试与发布检查 Prompt

目标：建立测试和发布阶段 Prompt。

输入：

1. P2 测试、发布、缺陷和领域知识文档
2. 需求文档 4.3.1、4.4.1 章节
3. P3-WP1 Prompt 模板规范

输出：

1. `.ai-harness/prompts/core-scenario-test.md`
2. `.ai-harness/prompts/release-check.md`

依赖：

1. P3-WP1
2. P2-WP5

验收标准：

1. 核心场景测试 Prompt 能输出必测场景、回归场景、边界、异常、测试数据和自动化可行性。
2. 发布检查 Prompt 能输出发布结论、范围、需求清单、分支制品、SQL、配置、测试、缺陷、验证点、回滚和风险。

## 9. P4 Skill 工程资产 V1

### P4-WP1 Skill 目录规范

目标：统一 Skill 的目录结构、说明格式和输出模板命名。

输入：

1. P3 Prompt 模板库
2. 需求文档 3.3.2 目录结构

输出：

1. `.ai-harness/skills/README.md`
2. `.ai-harness/skills/_template/skill.md`
3. `.ai-harness/skills/_template/output-template.md`

依赖：

1. P3-WP1

验收标准：

1. Skill 模板包含定位、适用场景、输入、执行步骤、输出、质量标准和安全约束。
2. 每个 Skill 目录都能独立被 Agent 读取。

### P4-WP2 需求评审 Skill

目标：沉淀需求评审能力的 Skill 资产。

输入：

1. `.ai-harness/prompts/requirement-review.md`
2. 需求文档 4.1.2 章节
3. P2 上下文文档

输出：

1. `.ai-harness/skills/requirement-review/skill.md`
2. `.ai-harness/skills/requirement-review/output-template.md`

依赖：

1. P4-WP1
2. P3-WP2

验收标准：

1. 覆盖完整性、一致性、明确性、可开发性、可测试性、业务风险、系统影响、非功能和历史缺陷匹配。
2. 输出模板与需求文档中的需求评审报告结构一致。

### P4-WP3 编码计划辅助 Skill

目标：沉淀轻量编码计划和 ADR 判断能力。

输入：

1. `.ai-harness/prompts/coding-plan.md`
2. 需求文档 4.2.1 章节
3. P2 上下文和规范文档

输出：

1. `.ai-harness/skills/coding-plan/skill.md`
2. `.ai-harness/skills/coding-plan/output-template.md`

依赖：

1. P4-WP1
2. P3-WP2

验收标准：

1. 能给出需求摘要、影响范围、建议步骤、TDD 重点、核心场景建议、风险、待确认问题和 ADR 判断。
2. 明确 ADR 只做判断和草稿建议，不自动合入。

### P4-WP4 TDD 与辅助编码 Skill

目标：沉淀测试前置和辅助实现能力。

输入：

1. `.ai-harness/prompts/tdd.md`
2. `.ai-harness/prompts/coding-assistant.md`
3. 需求文档 4.2.2、4.2.3 章节

输出：

1. `.ai-harness/skills/tdd/skill.md`
2. `.ai-harness/skills/tdd/output-template.md`
3. `.ai-harness/skills/coding-assistant/skill.md`
4. `.ai-harness/skills/coding-assistant/output-template.md`

依赖：

1. P4-WP1
2. P3-WP3

验收标准：

1. TDD Skill 明确测试场景、Given-When-Then、边界、异常、Mock、断言和测试数据输出。
2. 辅助编码 Skill 明确必须受需求上下文、编码计划、TDD 和安全规则约束。

### P4-WP5 代码审查与提交检查 Skill

目标：沉淀开发侧质量检查能力。

输入：

1. `.ai-harness/prompts/code-review.md`
2. `.ai-harness/prompts/pre-commit-check.md`
3. 需求文档 4.2.4、4.2.5 章节

输出：

1. `.ai-harness/skills/code-review/skill.md`
2. `.ai-harness/skills/code-review/output-template.md`
3. `.ai-harness/skills/pre-commit-check/skill.md`
4. `.ai-harness/skills/pre-commit-check/output-template.md`

依赖：

1. P4-WP1
2. P3-WP4

验收标准：

1. 代码审查 Skill 使用 P0/P1/P2/P3 问题分级。
2. 提交检查 Skill 明确 V1 初期以提醒为主，敏感信息和 P0 问题建议阻断。

### P4-WP6 核心场景测试与发布前检查 Skill

目标：沉淀测试和发布阶段的检查能力。

输入：

1. `.ai-harness/prompts/core-scenario-test.md`
2. `.ai-harness/prompts/release-check.md`
3. 需求文档 4.3.1、4.4.1 章节

输出：

1. `.ai-harness/skills/core-scenario-test/skill.md`
2. `.ai-harness/skills/core-scenario-test/output-template.md`
3. `.ai-harness/skills/release-check/skill.md`
4. `.ai-harness/skills/release-check/output-template.md`

依赖：

1. P4-WP1
2. P3-WP5

验收标准：

1. 核心场景测试 Skill 支持沉淀必测场景、回归场景和测试数据建议。
2. 发布前检查 Skill 覆盖需求、分支、提交、SQL、配置、测试、缺陷、验证点和回滚。

### P4-WP7 Skill 示例案例

目标：提供 V1 Skill 的最小可读示例，帮助试点人员理解输入和输出。

输入：

1. P4-WP2 至 P4-WP6 的 Skill 资产

输出：

1. `.ai-harness/examples/requirement-review-example.md`
2. `.ai-harness/examples/coding-plan-example.md`
3. `.ai-harness/examples/tdd-example.md`
4. `.ai-harness/examples/code-review-example.md`
5. `.ai-harness/examples/release-check-example.md`

依赖：

1. P4-WP2
2. P4-WP3
3. P4-WP4
4. P4-WP5
5. P4-WP6

验收标准：

1. 示例不包含真实客户敏感信息。
2. 示例能体现输入、处理结果和输出格式。
3. 示例用于说明结构，不冒充真实试点结果。

## 10. P5 门禁与验收资产

### P5-WP1 门禁目录与报告模板

目标：建立节点门禁资产的目录和统一报告格式。

输入：

1. 需求文档 4.5.1 章节
2. P4 Skill 资产

输出：

1. `.ai-harness/gates/README.md`
2. `.ai-harness/gates/_gate-template.md`

依赖：

1. P4-WP5
2. P4-WP6

验收标准：

1. 门禁模板包含检查对象、检查项、结论、阻断问题、风险提示和下一步建议。
2. 明确 V1 初期以提醒型门禁为主，P0 和敏感信息问题可建议阻断。

### P5-WP2 需求与编码准入门禁

目标：建立需求进入开发和编码开始前的门禁规则。

输入：

1. 需求评审 Skill
2. 编码计划 Skill
3. 需求文档 4.5.1 需求准入、编码准入门禁

输出：

1. `.ai-harness/gates/requirement-entry-gate.md`
2. `.ai-harness/gates/coding-entry-gate.md`

依赖：

1. P5-WP1
2. P4-WP2
3. P4-WP3

验收标准：

1. 需求准入门禁覆盖需求评审、P0 澄清点、核心业务规则、验收标准和 `PRD_CONTEXT`。
2. 编码准入门禁覆盖编码计划、ADR 判断和 P0 待确认问题。

### P5-WP3 提测与合并门禁

目标：建立开发完成后进入提测和 MR 合并前的门禁规则。

输入：

1. TDD Skill
2. 代码审查 Skill
3. 提交检查 Skill
4. 需求文档 4.5.1 提测门禁、合并门禁

输出：

1. `.ai-harness/gates/coding-to-test-gate.md`
2. `.ai-harness/gates/merge-gate.md`

依赖：

1. P5-WP1
2. P4-WP4
3. P4-WP5

验收标准：

1. 提测门禁覆盖编译、单测、AI Review、提交检查、核心测试场景和敏感信息。
2. 合并门禁覆盖 AI Review、人工 Review、CI、覆盖率和未关闭 P0/P1 问题。

### P5-WP4 发布准入门禁

目标：建立发布申请前的门禁规则。

输入：

1. 发布前检查 Skill
2. `docs/RELEASE_GUIDE.md`
3. 需求文档 4.5.1 发布准入门禁

输出：

1. `.ai-harness/gates/release-gate.md`

依赖：

1. P5-WP1
2. P4-WP6

验收标准：

1. 覆盖发布需求清单、分支、制品、测试、缺陷、SQL、配置、回滚和生产验证点。
2. 明确 Agent 不自动发布，只提供检查结论和风险建议。

### P5-WP5 结构化 Schema

目标：为后续工具化和平台化预留结构化输出约束。

输入：

1. P4 Skill 输出模板
2. P5 门禁模板

输出：

1. `.ai-harness/schemas/review-result.schema.json`
2. `.ai-harness/schemas/gate-result.schema.json`
3. `.ai-harness/schemas/risk-level.schema.json`

依赖：

1. P4-WP5
2. P5-WP1

验收标准：

1. Schema 覆盖风险等级、结论、问题清单、建议动作和待确认问题。
2. 不绑定具体平台实现，保持 V1 可手工使用。

### P5-WP6 V1 验收检查清单

目标：把需求文档第 7 章验收标准转成可执行检查清单。

输入：

1. 需求文档第 7 章
2. P2 至 P5 资产

输出：

1. `docs/V1_ACCEPTANCE_CHECKLIST.md`

依赖：

1. P5-WP5

验收标准：

1. 覆盖资产建设、需求、编码、测试、发布、质量、安全和运营验收项。
2. 区分本仓库可验收项和依赖试点运行的数据项。
3. 每个验收项有证据来源字段。

## 11. P6 试点运营支撑

### P6-WP1 试点项目清单模板

目标：提供选择 1-2 个试点项目时使用的记录模板。

输入：

1. 需求文档 6.1、6.3 章节
2. P5 验收清单

输出：

1. `docs/pilot/PILOT_PROJECTS.md`

依赖：

1. P5-WP6

验收标准：

1. 记录候选项目、风险等级、团队角色、适用场景和排除原因。
2. 不记录生产敏感信息。

### P6-WP2 基线指标采集方案

目标：提供 V1 试点前后的指标采集模板。

输入：

1. 需求文档 2.1、6.3、7 章
2. P5 验收清单

输出：

1. `docs/pilot/BASELINE_METRICS_PLAN.md`

依赖：

1. P5-WP6

验收标准：

1. 覆盖效率、质量、过程和安全指标。
2. 明确数据来源、采集周期、统计口径和责任角色。
3. 对暂无数据的指标标注采集方式，不编造基线值。

### P6-WP3 试点使用记录模板

目标：记录 V1 Skill、Prompt 和门禁在真实试点中的使用情况。

输入：

1. P3 Prompt 模板
2. P4 Skill 资产
3. P5 门禁资产

输出：

1. `docs/pilot/PILOT_USAGE_LOG.md`

依赖：

1. P4-WP7
2. P5-WP4

验收标准：

1. 能记录使用场景、输入来源、输出结论、采纳情况、问题和改进建议。
2. 不记录客户敏感信息和生产密钥。

### P6-WP4 V1 复盘报告模板

目标：为 V1 评估推广期提供复盘和推广方案模板。

输入：

1. `docs/pilot/PILOT_USAGE_LOG.md`
2. `docs/pilot/BASELINE_METRICS_PLAN.md`
3. 需求文档 6.4、7 章

输出：

1. `docs/pilot/V1_REVIEW_REPORT_TEMPLATE.md`

依赖：

1. P6-WP2
2. P6-WP3

验收标准：

1. 覆盖有效场景、无效场景、Prompt 优化、规则优化、安全问题、V2 建议和推广计划。
2. 区分事实数据、分析判断和建议动作。

## 12. 推进建议

建议每次只启动一个工作包，完成后更新 `docs/PROGRESS.md`，再进入下一个工作包。

默认推进顺序：

1. 完成 P1 的入口、计划和进度机制。
2. 进入 P2，先建立 `docs/` 基础模板，再逐步补齐核心文档。
3. 完成 P2 后再进入 P3，避免 Prompt 缺少上下文和规范依据。
4. 完成 P3 后进入 P4，让 Skill 复用 Prompt 和输出模板。
5. 完成 P4 后进入 P5，把 Skill 组合成节点门禁和验收资产。
6. P6 作为试点运营支撑，在 P5 验收资产稳定后启动。

## 13. 当前优先级

当前优先完成 P1：

1. P1-WP1 项目入口与术语上下文。
2. P1-WP2 V1 实施计划。
3. P1-WP3 项目进度台账。

P1 通过后，再启动 P2-WP1。
