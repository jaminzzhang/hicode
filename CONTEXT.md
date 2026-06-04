# AI Harness Engineering Context

This context defines the project language for building the AI Harness engineering system. It is a glossary only; implementation plans, progress, templates, and detailed designs belong in their documented project locations.

## Language

**AI Harness 工程化体系**:
面向意健险研发团队的 AI 辅助研发工程体系，用于规范 Agent 如何读取上下文、使用模板、执行检查和沉淀资产。
_Avoid_: 保险核心系统、业务系统实现、单一 Prompt 集合

**保险/金融核心系统服务对象**:
AI Harness 工程化体系的默认服务对象，指保险核心系统及其周边金融研发场景。Harness 不实现这些系统，但其 Prompt、Skill、门禁、测试和发布资产必须服务这些系统的高可靠、高合规、高审计要求。
_Avoid_: 本仓库实现保险核心系统、通用低风险研发工具、营销内容生成

**金融核心系统风险标准**:
后续 Harness 资产设计的默认风险基线，重点关注保险核心业务逻辑严谨性、金额精度、交易一致性、保单/批单状态流转、幂等、权限、审计、客户隐私、监管合规、生产变更、回滚和发布准入。
_Avoid_: 普通 Web 应用风险标准、非生产演示标准、仅代码风格检查

**保险核心业务逻辑严谨性**:
保险核心系统相关规则必须被精确理解、审查和验证，包括投保、批改、退保、核保、理赔前置、收付费、责任判断、保单/批单状态、期间、费率、责任、权益和规则例外等业务逻辑。
_Avoid_: 只做代码风格检查、用泛化金融规则替代保险业务规则、编造未确认业务规则

**需求草案**:
项目原始方案输入，当前指 `docs/研发 AI 工程化方案V1.1.md`。该文件会持续调整，不作为 Agent 默认启动必读文件；只有工作包、冲突追溯或用户要求时才按需读取。
_Avoid_: 默认执行基准、项目进度台账、已验收 Harness 资产

**执行基准**:
Agent 执行当前 Harness 工作时优先读取和对齐的文件组合，包括 `docs/PROGRESS.md` 和 `docs/V1_IMPLEMENTATION_PLAN.md`。
_Avoid_: 需求草案、历史讨论、目标项目文档模板

**项目术语上下文**:
根目录 `CONTEXT.md`，只记录本项目的统一术语和概念边界，不记录实施计划、进度或详细设计。
_Avoid_: harness-assets/docs/PROJ_CONTEXT.md、需求文档、设计文档

**本仓库 Agent 入口规则**:
根目录 `AGENTS.md`，用于约束开发 Agent 如何在本仓库推进 Harness 工程资产建设。
_Avoid_: 目标项目 Agent 入口模板、试点仓库入口文件

**目标项目 Agent 入口模板**:
`harness-assets/AGENTS.md`，用于作为未来试点仓库或目标项目可复用的 Agent 第一入口模板。
_Avoid_: 根目录 AGENTS.md、本仓库工作规则、项目进度台账

**研发上下文文档**:
未来的 `harness-assets/docs/PROJ_CONTEXT.md`，用于沉淀 Harness 或试点仓库的模块结构、关键流程、接口、数据、约束和历史风险。
_Avoid_: 根目录 CONTEXT.md、项目术语表、进度台账

**项目管理文档目录**:
根目录 `docs/`，用于保存需求源、V1 实施计划、项目进度台账等本仓库管理文档。
_Avoid_: Harness 交付资产目录、试点仓库文档目录

**Harness 产出目录**:
根目录 `harness-assets/`，用于保存本项目生成的可交付 Harness 工程资产。该目录下使用可见源目录维护资产，例如 `docs/`、`prompts/`、`skills/`、`gates/`、`schemas/` 和 `examples/`。
_Avoid_: 根目录 docs/、根目录 .ai-harness/、临时输出目录

**目标项目内部文档目录**:
`harness-assets/docs/`，用于保存未来试点仓库可使用的人可读知识、规范、上下文、ADR、流程和运营支撑模板。
_Avoid_: 根目录 docs/、项目管理文档目录、项目术语上下文

**Harness 运行资产源目录**:
`harness-assets/prompts/`、`harness-assets/skills/`、`harness-assets/gates/`、`harness-assets/schemas/` 和 `harness-assets/examples/` 等可见目录，用于维护未来会安装到目标项目 `.ai-harness/` 下的 Prompt、Skill、门禁、Schema 和示例资产。
_Avoid_: harness-assets/.ai-harness/、目标项目运行目录、根目录 .ai-harness/

**目标项目 Harness 运行目录**:
目标项目中的 `.ai-harness/`，由后续安装脚本根据 `harness-assets/` 下的可见源目录生成或复制，不在本仓库作为源产出目录直接维护。
_Avoid_: harness-assets/prompts/、harness-assets/skills/、本仓库源资产目录

**V1 实施计划**:
将需求文档中的 V1 路线拆成可执行阶段、里程碑、交付物和验收口径的计划文档。
_Avoid_: 详细设计、任务进度、代码实现方案

**实施阶段**:
V1 实施计划中的一级推进顺序，先建立项目入口和进度机制，再建设上下文、Prompt、Skill、门禁和试点运营支撑资产。
_Avoid_: 详细设计阶段、临时任务分组、组织排期

**V1 准备期**:
需求文档第 6.1 节中的第一阶段，目标是建立基础规范和上下文资产；在本仓库的 V1 实施计划中由 P1 项目入口与进度机制和 P2 上下文与规范文档共同覆盖。
_Avoid_: 单独等同于 P1、Skill 建设期、试点运行期

**工作包**:
V1 实施计划中的最小可交付任务单元，可交给开发 Agent 独立推进，包含目标、输入、输出、依赖、验收标准和建议顺序。
_Avoid_: 详细设计、代码任务、临时待办

**工作包编号**:
工作包的稳定引用标识，格式为 `P<阶段号>-WP<序号>`，例如 `P1-WP2`。
_Avoid_: 临时标题、自然语言简称、文件名代号

**Harness 工程资产**:
本仓库负责建设和维护的资产集合，包括文档、Prompt、Skill、门禁规则、模板、示例、进度台账和验收检查清单。
_Avoid_: 试点项目业务代码、人员排班、发布执行、组织运营计划

**Prompt 模板库**:
`harness-assets/prompts/` 下的 V1 场景化 Prompt 集合，用于约束 Agent 在需求、编码、测试、Review、提交和发布检查中的输入、处理规则、安全边界和输出格式；未来安装到目标项目后位于 `.ai-harness/prompts/`。
_Avoid_: Skill 实现、workflow 文档、自由聊天提示语

**Prompt 模板规范**:
`harness-assets/prompts/README.md` 和 `_template.md` 共同定义的 Prompt 通用结构、语言规则、安全红线和质量口径。
_Avoid_: 单个场景 Prompt、Skill 输出模板、门禁报告模板

**运营工作包**:
V1 实施计划中依赖真实试点项目和团队协同推进的事项，只记录目标、依赖和验收口径，不在本仓库展开详细执行计划。
_Avoid_: Harness 工程资产、代码实现任务、仓库内开发计划

**项目进度台账**:
记录当前阶段、正在进行的任务、已完成事项、阻塞点和下一步动作的动态文档。
_Avoid_: 需求文档、实施计划、详细设计

**工作包状态**:
项目进度台账中用于表示工作包推进状态的固定枚举，包括 `未开始`、`进行中`、`阻塞`、`待验收`、`已完成`、`暂缓`。
_Avoid_: done、todo、处理中、完成了一半

**开发 Agent**:
参与本项目文档、模板、规则或工程资产开发的 Coding Agent。
_Avoid_: 生产运维 Agent、自动发布 Agent、最终决策人

## Flagged Ambiguities

**“第一阶段”**:
在需求文档中指 `V1 准备期`；在 `docs/V1_IMPLEMENTATION_PLAN.md` 中 `P1` 指 `项目入口与进度机制`。后续启动实现时应优先使用工作包编号，例如 `P2-WP1`，避免只说“第一阶段”。

**`docs/`**:
单独写 `docs/` 时默认指根目录项目管理文档目录；交付给试点仓库使用的文档必须明确写作 `harness-assets/docs/`。

**`AGENTS.md`**:
单独写 `AGENTS.md` 时默认指根目录本仓库 Agent 入口规则；交付给试点仓库使用的入口模板必须明确写作 `harness-assets/AGENTS.md`。

**`.ai-harness/`**:
单独写 `.ai-harness/` 时默认指目标项目安装后的 Harness 运行目录；本仓库源产出必须使用 `harness-assets/prompts/`、`harness-assets/skills/`、`harness-assets/gates/`、`harness-assets/schemas/` 等可见目录。

## Example Dialogue

开发 Agent：我开始任务前应该先读哪些内容？

项目负责人：默认先读 `AGENTS.md`、`CONTEXT.md`、`docs/PROGRESS.md` 和 `docs/V1_IMPLEMENTATION_PLAN.md`。需求草案不是默认必读，只有当前工作包需要追溯原始方案或用户要求时再读。

开发 Agent：我拿到一个工作包后，是否需要直接写详细设计？

项目负责人：不需要。工作包只定义目标、输入、输出、依赖和验收标准；详细设计等到具体实现该功能或资产时再展开。

开发 Agent：V1 实施计划是否要覆盖真实试点项目的人员安排和运营动作？

项目负责人：不展开。V1 实施计划以本仓库的 Harness 工程资产建设为主，试点运行、人员安排、指标采集和复盘只作为运营工作包或外部依赖记录。

开发 Agent：V1 应该按什么顺序推进？

项目负责人：先建立项目入口和进度机制，再补上下文与规范文档，然后建设 Prompt、Skill、门禁与验收资产，最后提供试点运营支撑。

开发 Agent：后续资产应该按什么风险标准设计？

项目负责人：默认按保险/金融核心系统服务对象设计。即使本仓库不实现核心系统，Prompt、Skill、门禁、测试和发布资产也要覆盖保险核心业务逻辑严谨性、金额、交易一致性、状态流转、幂等、权限、审计、隐私、监管、生产变更和回滚等高风险点。

开发 Agent：我应该如何稳定引用一个工作包？

项目负责人：使用工作包编号，格式为 `P<阶段号>-WP<序号>`。进度台账也用这个编号跟踪状态，不依赖标题匹配。

开发 Agent：我什么时候可以把工作包标记为已完成？

项目负责人：先在产出完成后标记为 `待验收`，由项目负责人确认后再标记为 `已完成`。缺少输入或外部条件时标记为 `阻塞`，主动推迟但不是阻塞时标记为 `暂缓`。
