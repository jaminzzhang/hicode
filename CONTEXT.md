# hicode Engineering Context

This context defines the project language for building the hicode engineering system. It is a glossary only; implementation plans, progress, templates, and detailed designs belong in their documented project locations.

## Language

**hicode 工程化体系**:
面向意健险研发团队的 AI 辅助研发工程体系，用于规范 Agent 如何读取上下文、使用模板、执行检查和沉淀资产。
_Avoid_: 保险核心系统、业务系统实现、单一 Prompt 集合

**保险/金融核心系统服务对象**:
hicode 工程化体系的默认服务对象，指保险核心系统及其周边金融研发场景。hicode 不实现这些系统，但其 Prompt、Skill、门禁、测试和发布资产必须服务这些系统的高可靠、高合规、高审计要求。
_Avoid_: 本仓库实现保险核心系统、通用低风险研发工具、营销内容生成

**金融核心系统风险标准**:
后续 hicode 资产设计的默认风险基线，重点关注保险核心业务逻辑严谨性、金额精度、交易一致性、保单/批单状态流转、幂等、权限、审计、客户隐私、监管合规、生产变更、回滚和发布准入。
_Avoid_: 普通 Web 应用风险标准、非生产演示标准、仅代码风格检查

**统一风险分级与场景矩阵**:
面向 Prompt、Skill 和门禁共用的风险口径，用 P0/P1/P2/P3 标识金融核心系统风险等级，并按需求评审、编码计划、TDD、代码审查、提交检查、核心场景测试和发布检查等场景映射必检风险。
_Avoid_: 每个资产重复定义不同风险等级、只罗列风险词但没有分级口径、忽略场景差异

**保险核心业务逻辑严谨性**:
保险核心系统相关规则必须被精确理解、审查和验证，包括投保、批改、退保、核保、理赔前置、收付费、责任判断、保单/批单状态、期间、费率、责任、权益和规则例外等业务逻辑。
_Avoid_: 只做代码风格检查、用泛化金融规则替代保险业务规则、编造未确认业务规则

**需求草案**:
项目原始方案输入，当前指 `docs/研发 AI 工程化方案V1.1.md`。该文件定位为目标项目落地蓝图和 V1 需求来源，会持续调整，不作为 Agent 默认启动必读文件；只有工作包、冲突追溯或用户要求时才按需读取。
_Avoid_: 默认执行基准、项目进度台账、已验收 Harness 资产

**目标项目落地蓝图**:
面向未来试点仓库或目标项目的 Harness 落地说明，描述目标、原则、能力边界、目标项目最终目录、试点运行和验收口径。
_Avoid_: 本仓库执行基准、工作包进度台账、单个资产详细设计

**执行基准**:
Agent 执行当前 Harness 工作时优先读取和对齐的文件组合，包括 `docs/PROGRESS.md` 和当前工作包对应的实施计划。V3 简化重构期间，执行基准为 `docs/PROGRESS.md` 与 `docs/V3_IMPLEMENTATION_PLAN.md`；V1/V2 计划仅作为历史追溯资料按需读取。
_Avoid_: 需求草案、历史讨论、目标项目文档模板

**项目术语上下文**:
根目录 `CONTEXT.md`，只记录本项目的统一术语和概念边界，不记录实施计划、进度或详细设计。
_Avoid_: references/docs/PROJ_CONTEXT.md、需求文档、设计文档

**本仓库 Agent 入口规则**:
根目录 `AGENTS.md`，用于约束开发 Agent 如何在本仓库推进 Harness 工程资产建设。
_Avoid_: 目标项目 Agent 入口模板、试点仓库入口文件

**目标项目 hicode 入口补充片段**:
重构后由 `references/templates/project/hicode-entry-section.md` 承载，用于补充到目标项目已有或由当前 Coding 平台 `/init` 生成的 `AGENTS.md` 或 `CLAUDE.md`。非 Claude Code 平台主要使用 `AGENTS.md`，Claude Code 使用 `CLAUDE.md`；hicode 不再维护完整入口模板，只维护文档路径、Skill 路由、规则目录和安全边界等平台无关补充片段。旧 `references/target-project/` 不再作为当前有效目录。
_Avoid_: 根目录 AGENTS.md、本仓库工作规则、项目进度台账、完整入口模板、长篇领域知识、完整历史缺陷库

**研发上下文文档**:
目标项目中的 `docs/PROJ_CONTEXT.md`，用于沉淀目标项目的模块结构、关键流程、接口、数据、约束和历史风险。重构后本仓库只在 `references/templates/project/PROJ_CONTEXT.md` 维护可复制填写的模板，不再把 `references/docs/PROJ_CONTEXT.md` 作为当前有效资产。
_Avoid_: 根目录 CONTEXT.md、项目术语表、进度台账

**长期上下文与单需求上下文**:
Harness 上下文沉淀分为长期稳定上下文和单需求临时上下文。`DOMAIN_KNOWLEDGE.md` 和 `PROJ_CONTEXT.md` 用于长期稳定领域、项目、模块、流程、接口、数据和历史风险；`feature_context.md` 用于单需求目标、范围、规则、澄清点、风险、测试和发布关注点。未确认内容只能作为更新建议。
_Avoid_: 把单需求临时信息写入长期上下文、把未确认推断写成事实、所有上下文都叫 CONTEXT

**上下文正式沉淀确认**:
Agent 可以生成上下文更新建议或草稿，但正式写入长期领域知识、项目上下文、历史缺陷和 ADR 前必须由对应负责人确认。输出必须区分已确认事实、推断和待确认事项。
_Avoid_: Agent 自动把推断写入长期上下文、无人确认的业务规则沉淀、把 ADR 草稿当成正式架构决策

**项目管理文档目录**:
根目录 `docs/`，用于保存需求源、V1 实施计划、项目进度台账等本仓库管理文档。
_Avoid_: Harness 交付资产目录、试点仓库文档目录

**hicode 设计中心**:
仓库根目录是后续 hicode 资产设计、Claude Code plugin 发布和 Coding Agent 能力组织的中心，直接承载 `.claude-plugin/`、`skills/`、`agents/`、`references/` 和安装入口。
_Avoid_: 把 `harness-assets/plugins/` 继续作为 plugin root、维护 plugin 专用二级副本、把根目录只当项目管理壳

**Harness 产出目录**:
历史上用于保存本项目生成的可交付 Harness 工程资产的目录；在根目录成为 hicode 设计中心后，不再作为 `agents/`、`skills/`、`prompts/`、`gates/`、`schemas/`、`docs/` 等源资产的长期维护中心。
_Avoid_: 与根目录维护两套源资产、作为 Claude Code plugin root、继续承载一等 Skill 或 Agent 源资产

**hicode 根目录源资产**:
仓库根目录下直接维护的 hicode 一等源资产，包括 `skills/`、`agents/`、`references/`、`.claude-plugin/` 和 `install.sh`；这些资产是后续设计、安装和调用的主来源。
_Avoid_: `harness-assets/plugins/` 二级副本、只供 plugin 使用的临时快照、与旧 `harness-assets/` 源资产并行维护

**hicode 根目录资产分层**:
根目录只把 Claude Code 可直接识别或 Coding Agent 会直接调用的入口资产做成一等目录，其中 `skills/` 是直接可调用 Skill，`skills/_shared/` 是随 Skill 安装的运行时共享规则和模板镜像，`agents/` 是子 Agent，`references/` 只承载当前 `rules/`、`templates/` 和 `hooks/` 三类源资产，`archive/` 保存历史追溯材料。
_Avoid_: 把 prompts、gates、schemas 和 docs 全部平铺到根目录、让 Skill 只引用旧 `harness-assets/`、把 references 当成默认全量上下文、把 archive 当成当前规则源

**hicode 当前有效资产**:
hicode 当前执行、安装和 Skill/Agent 路由可引用的资产集合。重构后应只包括根目录 `skills/`、`skills/_shared/`、`agents/` 以及 `references/rules/`、`references/templates/`、`references/hooks/` 等被明确保留的当前目录；归档资产不得再作为当前 Skill 的执行依据或默认检索来源。目标项目执行 Skill 时优先读取 `skills/_shared/` 中的运行时镜像，避免跨 plugin 运行资产边界读取 `references/`。
_Avoid_: 继续引用归档资产、把历史材料当成当前规则源、manifest/profile 参与当前初始化

**hicode 历史归档区**:
根目录 `archive/`，用于保存从 `references/` 移出的历史资产和追溯材料。归档区是非运行、非安装、非默认检索目录，只保留历史追溯价值；当前 Skill、Agent、manifest、profile、入口模板和 README 不应依赖其中内容。
_Avoid_: 当前能力规则源、初始化源资产、默认上下文、可执行 Skill/Gate/Schema 来源

**hicode 统一规则目录**:
`references/rules/`，用于维护当前有效的规则、流程、门禁、Review 细则、结构化输出约束和 Skill/Agent 可引用的执行细则。当前稳定规则 interface 收敛为 `references/rules/coding_rules.md`；目录未来可以扩展，但当前资产不得引用尚不存在的规则子目录。
_Avoid_: 多套规则源并行、引用不存在的规则路径、Prompt/Gate/Schema 独立一级目录继续承载当前规则、按旧资产类型换皮保留复杂度、规则散落在模板或归档区

**hicode 规则按需读取边界**:
`references/rules/` 是当前规则维护源，但不随 plugin 默认全量加载。Claude Code plugin 运行时镜像为 `skills/_shared/rules/`。`hi` 总入口默认只做诊断和路由；`init`、`scope`、`tdd`、`review`、`release` 和专业 Agent 在目标项目执行时只在需要规则依据时读取 `skills/_shared/rules/coding_rules.md`；Hook 说明和维护文档可以引用源文件 `references/rules/coding_rules.md` 作为维护依据。
_Avoid_: 默认读取全部 rules、每个 Skill 都加载不存在的细分规则、Agent 为单一专项任务读取全库规则、把未创建的规则子目录当成当前 interface

**hicode Markdown 结构化输出规则**:
当前用于约束 Skill、Agent、Review 和门禁类输出的 Markdown 规则，记录固定字段、稳定枚举、风险等级、建议结论、问题列表、证据记录和未执行验证原因。旧 JSON Schema 文件不再作为当前有效资产；仍有效的字段和枚举压缩进根目录 Skill、专业 Agent 或 `references/rules/coding_rules.md`。
_Avoid_: 当前 Skill 读取 JSON Schema、为未接入自动校验的结构保留独立 JSON、每个场景自定义冲突字段、把建议结论写成审批状态

**hicode 模板目录**:
`references/templates/`，用于维护目标项目当前可复制、可填写、可落地的模板。模板目录只保存结构化填写骨架，不承载执行规则全文；执行规则应放入 `references/rules/`。当前模板按文档生命周期分为 `project/` 和 `feature/`：`project/` 保存项目全局共享模板，例如入口、领域知识、项目上下文和 ADR；`feature/` 保存单需求或单特性实现模板，例如 `feature_context.md`、需求评审报告、Scope 总结、任务拆分计划、TDD、Review 和 Release 报告。本仓库历史验收清单、试点运营模板、回归样例、旧初始化 manifest/profile 和过去工作包材料应进入 `archive/`。
_Avoid_: 把模板写成规则库、把执行流程藏在模板里、让模板替代 Skill 或 Gate 规则、把单需求报告放入项目全局模板目录、把历史建设过程模板暴露为当前目标项目模板、按旧 docs/prompts/examples 类型散放模板

**单需求特性上下文**:
目标项目 `docs/features/<feature-id>/feature_context.md`，用于记录单个需求或特性的目标、范围、业务规则、澄清点、风险、影响范围、测试和发布关注点。它替代旧命名 `PRD_CONTEXT.md`，以避免与项目级 `PROJ_CONTEXT.md` 混淆；需求完成后，只有经确认的稳定领域知识或项目结构知识才沉淀到 `DOMAIN_KNOWLEDGE.md` 或 `PROJ_CONTEXT.md`。
_Avoid_: 项目级上下文、长期领域知识库、多个需求共用的上下文文件、与 `PROJ_CONTEXT.md` 混用

**目标项目文档目录分层**:
目标项目文档分为项目级共享文档和单需求特性文档。项目级共享文档放在 `docs/` 和 `docs/adr/`，包括 `DOMAIN_KNOWLEDGE.md`、`PROJ_CONTEXT.md`、`docs/adr/` 和 `docs/rules/`；单需求特性文档放在 `docs/features/<feature-id>/`，包括 `feature_context.md`、需求评审报告、Scope 总结、任务拆分计划、TDD 报告、Review 报告和 Release 报告。入口文档 `CLAUDE.md` 或 `AGENTS.md` 必须说明这些路径，相关 Skill 在目标文档不存在时先读取 hicode 模板，再按需创建文档。
_Avoid_: 把单需求文档平铺到 `docs/`、入口文件不说明文档路径、Skill 在缺少目标文档时自由生成无模板结构的文档

**单需求文档生命周期规则**:
`references/templates/README.md` 中集中维护的单需求文档创建、更新、缺失材料处理、证据降级和阶段交接规则；运行时镜像为 `skills/_shared/templates/README.md`。`scope`、`tdd`、`review` 和 `release` 只保留本阶段动作，并在目标项目执行时引用运行时镜像。
_Avoid_: 每个 Skill 复制一套 `docs/features/<feature-id>/` 写入规则、缺失材料处理口径不一致、把阶段报告写成审批结论

**hicode 项目模板加载边界**:
`references/templates/project/` 中的项目模板不随 plugin 默认加载，也不在安装时自动写入目标项目。当前 `hicode:init` 初始化入口文件时优先调用平台 `/init`；只有当前平台不支持 `/init` 时，才可以自行生成最小 `AGENTS.md` 或 `CLAUDE.md`。入口文件生成或存在后，hicode 只基于 `hicode-entry-section.md` 补充 hicode section。项目模板只保留为可追溯、可复制填写的支撑材料，是否使用必须由用户明确确认。
_Avoid_: plugin 安装时加载项目模板、非 init 任务默认读取项目模板、无确认写入目标项目、维护完整入口模板、把项目模板等同于本仓库 `docs/`、在 `/init` 可用时绕过 `/init` 自行生成入口文件

**hicode Hook 目录**:
`references/hooks/`，用于维护当前有效的 Hook 行为说明、配置示例、触发条件、阻断建议和审计字段。Hook 目录不依赖旧 `references/init/manifests/hooks.json`，也不由 plugin 安装器自动启用；用户或目标平台需要启用 Hook 时，必须另行确认配置范围。当前 Hook 只能覆盖本地研发流程中的低风险检查和上下文捕获，不自动化生产发布、回滚、生产配置或生产数据相关动作。
_Avoid_: Hook 自动启用、Hook 连接生产环境、通过归档 manifest 启用 Hook、把 Hook 建议写成最终审批

**hicode references 目录契约**:
`references/README.md` 是当前 `references/` 的短入口说明，只维护 `rules/`、`templates/` 和 `hooks/` 三类当前目录的边界、禁止新增旧资产类型一级目录的规则，以及 Skill/Agent 如何读取当前规则和模板。它不再作为 docs/prompts/gates/schemas/examples/init/fine-grained skills 的索引。
_Avoid_: 把 `references/README.md` 写成长篇规则库、继续列旧目录作为当前资产、让 README 替代 Skill 或 Rule

**hicode 场景 Skill**:
根目录 `skills/` 下直接维护的 Claude Code 可调用 Skill，当前固定保留 6 个入口：`hi`、`init`、`scope`、`tdd`、`review` 和 `release`。其中 `hi` 是总入口 Skill；`hicode:init`、`hicode:scope`、`hicode:tdd`、`hicode:review`、`hicode:release` 是用户可见的场景路由表达。这些 Skill 必须直接告诉 Coding Agent 做什么、按什么顺序做、何时停止和如何输出，不能只作为 `references/` 的索引。
_Avoid_: 把根目录 Skill 写成空壳引用、把 8 个细粒度 Skill 全部暴露为顶层入口、让用户在过多 Skill 名称中选择

**hicode Scope 需求澄清与任务拆分**:
`skills/scope/SKILL.md` 承载需求到编码前的澄清、评审、范围收敛和小任务拆分能力。它用于与用户确认目标、边界、模糊点、风险、验收标准和后续 TDD 输入，并把过大的需求拆成可独立理解、验证和移交的小任务；它不生成业务实现代码，不替代 TDD、Review、发布检查或负责人审批。Scope 的核心产物包括需求评审报告、单需求 `feature_context.md` 更新、必要 ADR 草稿或更新、拆分任务计划，以及经确认后可沉淀到 `DOMAIN_KNOWLEDGE.md` 和 `PROJ_CONTEXT.md` 的候选知识。
_Avoid_: 直接编码入口、一次性生成大段实现代码、跳过需求确认的编码计划、最终审批结论

**hicode Release 分支发布分析**:
`skills/release/SKILL.md` 承载发布前的分支分析和发布报告生成能力。它以当前 Git 分支或用户指定分支为发布分析对象，核对分叉时间、分支改动、`docs/features/` 需求文档、已知测试与 Review 证据、SQL/配置/脚本风险、验证计划和回滚计划；它只汇总当前已知信息，不重新设计核心场景测试，不替代发布负责人审批、发布平台或生产验证执行。
_Avoid_: 自动发布、最终发布审批、生产操作、核心场景测试设计、编造测试通过或需求实现证据

**hi 引导型总入口 Skill**:
`skills/hi/SKILL.md` 是 hicode 的导诊入口，负责先判断目标项目是否已有 hicode 上下文资产；若用户只输入 `hi` 且没有其他意图和上下文，应先检测是否需要初始化，并输出 hicode 用法简介。检测到需要初始化或用户要求初始化时，路由到 `hicode:init`；需求目标、范围、业务规则、影响面或编码准入不清时，路由到 `hicode:scope`；需要编码实现、测试先行、失败复现、RED-GREEN-REFACTOR 或受控实现时，路由到 `hicode:tdd`；需要代码审查、提交检查或安全/Java/SQL/保险专项审查时，路由到 `hicode:review`；需要发布检查、生产验证计划或发布风险判断时，路由到 `hicode:release`。
_Avoid_: 未初始化就直接进入实现或 Review、默认全仓扫描、自动生成项目文件、把 plugin 安装和目标项目初始化混为一步

**hicode 初始化引导边界**:
`hi` Skill 默认只诊断目标项目初始化状态、整理初始化输入并路由到 `hicode:init`。`init` 采用引导式初始化，遇到不确定或需要用户决策时一次只问一个问题；目标项目入口文件缺失时优先调用当前 Agent 平台的 `/init` 命令生成 `AGENTS.md` 或 `CLAUDE.md`，当前平台不支持 `/init` 时方可自行生成最小入口文件。入口主体生成或存在后，hicode 只基于 `references/templates/project/hicode-entry-section.md` 补充 hicode section。
_Avoid_: 无确认写文件、全仓扫描、读取敏感配置、把初始化建议当成真实初始化结果、在 `/init` 可用时自行生成入口文件

**hicode 初始化场景 Skill**:
`skills/init/SKILL.md` 是 hicode 的独立目标项目初始化入口，仅在用户明确要求初始化目标项目时触发。它负责检查目标项目入口文件是否存在；入口不存在时优先调用平台 `/init`，当前平台不支持 `/init` 时方可自行生成最小入口文件；入口存在时只在已有文件基础上补充 hicode section。随后根据当前项目适用性参考运行时共享规则镜像，在目标项目 `docs/rules/` 下生成对应规则，适用规则可以直接拷贝。规则和项目文档初始化后评估代码复杂度；复杂度较高且用户同意时，再委托 graphify 梳理代码结构。Agent、Skill、Rule、Template 和 Hook 等标准能力来自 hicode plugin，不复制到目标项目 `.hicode/`，不再执行 manifest/profile 选择性固化。它不替代 `hi` 总入口的诊断和路由职责，也不由 plugin 安装动作自动触发。
_Avoid_: plugin 安装脚本、无确认写入目标项目、默认全仓扫描、生产数据扫描器、把代码图谱推断写成已确认业务事实、在 `/init` 可用时自行生成入口文件、默认创建整套项目文档

**hicode 细粒度 Skill 细则**:
原 `references/skills/` 中维护的细粒度 Skill 规则源，例如需求评审、编码计划、TDD、辅助编码、代码审查、提交检查、核心场景测试和发布检查。重构后不再作为当前规则源目录；仍有效的执行规则应吸收到根目录场景 Skill 或 `references/rules/`，历史形态进入 `archive/`。
_Avoid_: 与根目录场景 Skill 并行维护第二套入口、让历史细则覆盖场景 Skill 的安全边界、把归档细则当成默认全量上下文

**hicode 根目录 Agent 集合**:
根目录 `agents/` 保留 8 个专业子 Agent：`requirement-reviewer`、`coding-planner`、`tdd-guide`、`coding-assistant`、`code-reviewer`、`security-reviewer`、`java-reviewer` 和 `release-reviewer`；它们由场景 Skill 或任务路由按需委托，不收敛成 4 个场景 Agent。
_Avoid_: 把专业 Agent 合并成大而泛的场景 Agent、让所有任务默认运行全部 Agent、让 Agent 替代 Skill 或人工审批

**hicode Agent 重构口径**:
本轮重构需要更新 `agents/` 中旧 `references/prompts/`、`references/skills/`、`references/gates/`、`references/schemas/`、`references/docs/` 和 guide 文件引用。Agent 仍保持短角色入口定位，只维护角色、触发条件、边界、委托流程、输出要求和安全红线；需要规则依据时只引用运行时共享规则镜像 `skills/_shared/rules/coding_rules.md`，必要指南要点应压缩写入 Agent 正文。
_Avoid_: 把 8 个 Agent 改成长规则文档、Agent 继续引用归档路径、Agent 默认读取全部 rules、Agent 引用不存在的规则子目录、Agent 替代 Skill 流程编排

**hicode Agent 共性规则**:
`references/rules/coding_rules.md` 中集中维护的专业 Agent 通用规则，包括 Prompt 防护、权限与受限命令、通用输出要求、安全红线和停止条件；Agent 运行时通过 `skills/_shared/rules/coding_rules.md` 读取镜像，Agent 文件只保留角色差异、适用场景、必读资产、专项流程和质量标准。
_Avoid_: 每个 Agent 复制同一套安全规则、Agent 自行维护第二套权限边界、把共性规则拆回多个未确认规则文件

**hicode 当前资产健康检查 Module**:
`scripts/health-check.sh` 和 `docs/HICODE_HEALTH_CHECK.md` 组成的可重复验证入口，用于检查当前运行资产边界、旧路径依赖、安装边界、Agent 共性规则收敛、安全红线和 JSON/脚本语法。
_Avoid_: 只依赖一次性验收报告、健康检查扫描目标项目、健康检查读取敏感配置或生产数据、通过放宽检查隐藏资产漂移

**hicode Skill-Agent-Rule-Template 新职责关系**:
重构后，根目录 `skills/` 负责直接告诉 Coding Agent 在场景中做什么、按什么顺序做、何时停止和如何输出；根目录 `agents/` 负责高风险或复杂场景下的专项角色委托；`references/rules/` 提供当前有效的规则依据、流程和检查口径；`references/templates/` 提供可填写输出骨架；`references/hooks/` 提供 Hook 行为说明和配置示例。Skill 可以读取 Rule 和 Template，也可以委托 Agent，但不得只引用旧细粒度 Skill 或把执行责任转交给归档资产。
_Avoid_: Skill 作为索引空壳、Agent 替代流程编排、Rule 与 Skill 各写一套冲突规则、Template 承载执行规则、归档资产参与当前执行

**hicode 指南内容整合口径**:
本轮重构不再单独维护 `guide/` 目录，也不把 guide 类长文放入 `references/rules/`。仍然有效的指南性内容应压缩并整合进对应根目录 Skill 或 Agent 正文，只保留执行所需的判断规则、步骤、停止条件和输出要求，避免 Coding Agent 为完成常规任务读取过多支撑文件导致上下文膨胀。
_Avoid_: 独立 guide 当前目录、把长篇指南搬到 rules、Skill/Agent 每次默认读取指南、用指南替代可执行步骤

**hicode 指南归档策略**:
旧 guide 文件迁移时先提炼仍有效的执行要点，并合并进对应根目录 Skill 或 Agent；原 guide 文件随后进入 `archive/` 作为历史追溯材料。迁移完成后，当前 Skill、Agent、Rule、Template 和 Hook 不得引用归档 guide。
_Avoid_: 未吸收要点就直接丢失指南内容、当前资产继续引用归档 guide、把原 guide 原文复制进 Skill 导致上下文膨胀

**hicode Prompt 归档策略**:
旧 `references/prompts/` 不再作为当前资产类型保留。迁移时应将 Prompt 中的执行规则、检查维度和安全边界吸收到对应根目录 Skill 与 `references/rules/`；将输出骨架迁入 `references/templates/`；原 Prompt 文件整体进入 `archive/` 作为历史追溯材料。迁移完成后，当前 Skill、Agent、Rule、Template 和 Hook 不得引用归档 Prompt。
_Avoid_: Prompt 继续作为当前规则源、Skill 为执行任务默认读取旧 Prompt、把 Prompt 原文复制进 Skill 导致冗长、丢失 Prompt 中仍有效的安全和风险规则

**hicode Gate 归档策略**:
旧 `references/gates/` 不再作为当前独立资产层保留。迁移时应将门禁判定规则、准入条件、阻断建议项和风险提示项吸收到根目录 Skill、专业 Agent、Hook 说明或 `references/rules/coding_rules.md`；将门禁报告输出骨架迁入 `references/templates/`；原 Gate 文件整体进入 `archive/`。Skill 输出可以继续使用门禁建议结论，但不得把 Gate 当作独立执行资产或审批层。
_Avoid_: 保留当前 `references/gates/` 目录、Skill 默认读取归档 Gate、把门禁建议写成最终审批、丢失门禁规则中的安全红线和证据要求

**hicode 示例与回归样例归档策略**:
旧 `references/examples/` 和回归样例不再作为当前产品资产保留，应整体进入 `archive/`。本轮重构验收采用轻量检查项，例如路径检查、归档依赖检查、Skill 自包含检查、规则/模板目录检查和安全红线保留检查；不再为了验收保留当前 examples 或 regression 目录。
_Avoid_: 在 `references/` 下保留 examples 作为第四类目录、当前 Skill 读取样例作为规则、用历史样例证明当前能力已运行、为了保留样例扩大上下文

**hicode 项目规则文档拆分策略**:
旧 `references/docs/` 中的项目规则文档，例如编码规范、测试指南、Review 规则和发布指南，迁移时应拆成两类：面向目标项目复制填写的模板版进入 `references/templates/project/`；hicode 当前执行需要的通用规则进入根目录 Skill、专业 Agent 或 `references/rules/coding_rules.md`。原文件进入 `archive/` 或拆解后移除当前路径，避免同一文件同时承担目标项目模板和 hicode 执行规则两种职责。
_Avoid_: 一个文件既是模板又是当前执行规则、Skill 默认读取目标项目模板当规则、项目模板缺少占位和维护说明、执行规则散落在归档文档

**hicode 简化重构实施策略**:
本轮 `references/` 与 `skills/` 简化重构采用先结构迁移、再内容重写的策略。先创建 `archive/`、`references/rules/`、`references/templates/` 并完成文件归位和路径引用修正；再逐个重写 6 个根目录 Skill，使其直接承载执行流程、准入、停止条件和输出要求；最后做路径、一致性和归档依赖验收。
_Avoid_: 边迁移边大幅重写导致路径错误和语义错误混在一起、当前文件继续依赖归档资产、未验收就扩大到新能力设计

**V3 简化重构实施计划**:
`docs/V3_IMPLEMENTATION_PLAN.md`，用于承载本轮 hicode 简化重构的执行计划和工作包拆分。该计划取代 V1/V2 计划作为本轮重构的执行基准，预计覆盖目录结构与归档迁移、rules/templates/hooks 重组、6 个根目录 Skill 直接执行化重写、Agent 引用修正、安装边界和一致性验收。
_Avoid_: 继续用 V1 实施计划指导当前重构、只在进度台账里写详细迁移清单、未拆工作包就直接大规模改文件

**V3 工作包验收机制**:
V3 简化重构继续沿用本仓库工作包状态机制。每个 V3 工作包启动、完成、阻塞、暂缓或提交验收时都必须更新 `docs/PROGRESS.md`；产出完成后先标记为 `待验收`，只有项目负责人确认后才能标记为 `已完成` 并启动下一个工作包。
_Avoid_: 一次性完成全量重构后再补状态、未经验收自动进入下一包、用 V3 计划替代进度台账

**V3-P1-WP1 范围边界**:
V3 第一工作包只负责简化重构计划与入口规则更新，包括创建 `docs/V3_IMPLEMENTATION_PLAN.md`、更新 `docs/PROGRESS.md` 当前状态、更新根目录 `AGENTS.md` 执行基准和目录边界、整理已确认 `CONTEXT.md` 术语、保留 `docs/adr/0003-simplify-hicode-reference-assets-and-direct-skills.md` 决策记录。该工作包不移动 `references/` 文件、不创建 `archive/` 迁移内容、不重写 6 个 Skill。
_Avoid_: 计划尚未验收就开始目录迁移、在第一包混入 Skill 重写、把结构迁移和规则整理混在一起

**hicode Agent 入口规则同步要求**:
本轮简化重构必须同步更新根目录 `AGENTS.md` 的目录边界和工作规则。重构后 `AGENTS.md` 应把 `skills/`、`agents/`、`references/rules/`、`references/templates/`、`references/hooks/` 和根目录 `archive/` 定义为新的资产边界，并移除旧 `references/docs/`、`references/prompts/`、`references/skills/`、`references/gates/`、`references/schemas/`、`references/examples/`、`references/init/` 和 `references/target-project/` 作为当前目录的说明。
_Avoid_: 后续 Agent 按旧目录边界继续新增资产、AGENTS.md 与 CONTEXT.md 冲突、归档目录被当作当前规则源

**目标项目内部文档目录**:
原 `references/docs/` 用于保存未来试点仓库可使用的人可读知识、规范、上下文、ADR、流程和运营支撑模板。重构后当前可复制填写的目标项目文档模板应进入 `references/templates/`，当前有效规则和流程应进入 `references/rules/`，历史建设和运营支撑材料进入 `archive/`。
_Avoid_: 根目录 docs/、项目管理文档目录、项目术语上下文

**Harness 运行资产源目录**:
历史上指 `agents/`、`references/prompts/`、`references/skills/`、`references/gates/`、`references/schemas/` 和 `references/examples/` 等可见目录。重构后当前运行资产源目录应收敛为根目录 `skills/`、`agents/` 和 `references/rules/`、`references/templates/`、`references/hooks/`；不再维护可选固化到目标项目 `.hicode/` 的 manifest/profile 资产链路。
_Avoid_: 根目录 `.hicode/`、目标项目运行目录、旧 `harness-assets/` 源资产目录、归档目录作为当前运行资产源

**hicode 子 Agent**:
面向目标项目可委托执行的专门角色 Agent，源资产目录为 `agents/`，参考 ECC `agents/` 的 subagent delegation 模式，用于把规划、TDD、代码审查、安全审查、Java/SQL/保险业务专项审查、发布检查等高风险任务分配给稳定角色。子 Agent 负责角色边界、触发条件、审查纪律和输出优先级，不替代 Prompt、Skill、门禁、人工负责人或生产审批。
_Avoid_: 把所有 Skill 都改成 Agent、让子 Agent 自动合并或发布、用通用 Web Agent 替代保险核心系统专项 Agent

**Agent 与 Prompt 整合口径**:
hicode 子 Agent 作为可委托角色入口，定义角色、触发条件、工具权限、降噪纪律、证据要求和安全红线。当前规则依据由根目录 Skill、专业 Agent 和 `skills/_shared/rules/coding_rules.md` 运行时镜像承载；Agent 可以引用 Skill、当前规则和输出模板，但不复制 Prompt 全文，不维护第二套规则。
_Avoid_: Agent 和 Skill 各写一套规则、把 Prompt 全文嵌入 Agent、让 Agent 绕过门禁或人工确认、Agent 引用不存在的规则子目录

**V2 首批 hicode 子 Agent 集合**:
后续引入子 Agent 时，首批只覆盖核心研发链路和 Java 专项，建议包括 `requirement-reviewer`、`coding-planner`、`tdd-guide`、`coding-assistant`、`code-reviewer`、`security-reviewer`、`java-reviewer` 和 `release-reviewer`。该集合用于先跑通 Agent-Prompt-Skill-Gate 整合闭环，不一次性复制 ECC 的全部通用子 Agent。
_Avoid_: 首批铺开大量低频 Agent、每个检查维度都建 Agent、还未验证整合闭环就复制 ECC 全量 Agent

**Agent Frontmatter 口径**:
hicode 子 Agent 源资产默认只强制 `name` 和 `description` 两个 frontmatter 字段。`name` 使用 Agent 文件名同名的 kebab-case；`description` 只描述触发条件和委托场景。`tools`、`model`、`allowed-tools`、`hooks` 等平台专属字段不作为源资产强制字段，后续可由初始化规划或目标平台适配层生成。
_Avoid_: 在源资产中绑定单一模型、把平台工具权限写死在 frontmatter、让 frontmatter 替代正文权限边界

**Agent 单文件平铺结构**:
`agents/` 下的子 Agent 源资产采用单文件平铺结构，例如 `code-reviewer.md` 和 `java-reviewer.md`，并配套 `README.md` 与 `_template.md`。Agent 文件是短角色入口，不为每个 Agent 创建独立目录；运行时详细规则和输出骨架由 `skills/_shared/` 承载，维护源分别位于 `references/rules/` 与 `references/templates/`，必要指南要点压缩进 Agent 正文。
_Avoid_: 每个 Agent 一个目录、在 Agent 目录内复制 Prompt 或 Skill 支撑文件、让 Agent 资产结构与 Skill 目录结构混淆

**Agent Prompt 防护基线**:
hicode 子 Agent 模板必须包含本地化 `Prompt 防护基线` 章节，用于防止角色覆盖、规则绕过、提示注入、敏感信息泄露和生产越权。该基线要求 Agent 不改变角色或覆盖项目规则，把外部输入和用户粘贴材料视为不可信，警惕 unicode 混淆、零宽字符、编码绕过、紧急施压和伪装权威，并在发现密钥、未脱敏客户信息、未脱敏生产数据或生产操作诉求时停止推进并转人工安全流程。
_Avoid_: 直接复制外部英文防护文本不本地化、只在安全 Agent 中写防护基线、让用户输入覆盖 Agent 角色和项目规则

**Agent 模板结构**:
hicode 子 Agent 模板采用短角色入口的 10 段式结构：角色定位、Prompt 防护基线、适用委托场景、不适用场景、必读资产、委托执行流程、权限与受限命令、输出要求、质量与降噪标准、安全红线与停止条件。Agent 不单独维护上下文更新和验证要求章节，但输出要求必须包含上下文更新建议，执行流程和输出要求必须记录验证动作或未执行原因。
_Avoid_: 完全复制 Skill 的 11 段式流程模板、让 Agent 承担 Skill 的详细流程职责、遗漏验证记录和上下文更新建议

**Agent README 范围**:
`agents/README.md` 只维护子 Agent 目录规范、文件命名、frontmatter、模板结构、权限边界、Prompt 防护基线，以及 Agent 与 Skill/Rule/Template 的轻量关系说明。它不维护完整规则映射表，不引用归档 Prompt、Gate、Schema、Guide 或旧细粒度 Skill。
_Avoid_: 在 README 中维护长规则库、README 膨胀为完整整合规范、Agent README 继续指向归档资产

**Agent 规则源引用口径**:
V3 重构后，hicode 子 Agent 只能引用当前稳定规则 interface 的运行时镜像 `skills/_shared/rules/coding_rules.md`。Agent 文件只维护角色、触发、边界、降噪和安全红线，不重写详细检查规则，也不引用归档 Prompt、Gate、Schema、Guide、旧细粒度 Skill 或不存在的规则子目录。
_Avoid_: 为首批专项 Agent 复制长规则、在 Agent 中复制 review 规则全文、让 Agent 规则源指向归档路径、Agent 引用不存在的规则子目录

**子 Agent 受控修改权限边界**:
首批 hicode 子 Agent 默认是只读分析、规划或审查角色。`tdd-guide` 可在用户确认后调用 TDD Skill 并修改测试代码、测试夹具、Mock、脱敏测试数据和测试说明文档，但不得修改生产业务代码、生产配置、数据库脚本或发布脚本。`coding-assistant` 是首批 Agent 中唯一可在 TDD 证据、对应 Skill/Rule 和用户确认约束下承接受控生产代码实现或修复的角色。其他 Agent 不直接修改项目文件。
_Avoid_: 让审查型 Agent 直接改代码、让 tdd-guide 同时改测试和生产实现、绕过 TDD 证据或用户确认进行修改

**专项审查 Agent 触发口径**:
`security-reviewer` 和 `java-reviewer` 是风险或技术栈触发的专项审查 Agent，不是所有变更默认必跑的全流程 Agent。`security-reviewer` 在权限、认证、鉴权、密钥、日志、脱敏、客户隐私、生产数据、外部接口、文件上传下载、加解密、审计、监管或安全红线相关变更中触发；`java-reviewer` 在 Java、Spring、MyBatis/JPA、消息、事务、SQL、批处理或保险核心后端变更中触发。两者不替代 `code-reviewer`、门禁或人工 Review。
_Avoid_: 所有变更强制运行所有专项 Agent、让专项 Agent 给出合并许可、普通代码审查遗漏专项风险转介

**Agent 建议结论口径**:
hicode 子 Agent 输出风险、证据和建议动作，不输出最终准入审批。Agent 可以说明未发现 P0/P1 风险、发现高风险建议修复、存在安全红线建议停止推进或证据不足无法给出低风险建议；不得输出准许合并、准许发布、门禁通过或可以上线等最终审批结论。
_Avoid_: Agent 替代负责人审批、把建议性质门禁写成硬性通过结论、用 AI 输出授权生产发布

**Agent 整合规范边界**:
V2 历史设计中，`references/docs/AGENT_PROMPT_INTEGRATION.md` 与 `references/docs/workflows/agent-delegation.md` 曾用于定义 Agent、Prompt、Skill、门禁、Schema 和输出模板之间的职责关系。V3 重构后，该整合规范不再作为当前规则入口；仍有效内容应拆入根目录 Skill、Agent 正文或 `references/rules/`。
_Avoid_: 当前 Skill 继续读取旧整合规范、提前创建 install manifest、为专项 Agent 新增归档规则源、用旧 workflow 替代当前 Skill 执行流程

**Agent 整合冲突优先级**:
Agent、Skill、Rule、Template、Hook、上下文和用户指令冲突时，优先级依次为：安全红线与禁止事项、用户最新明确指令、目标项目入口规则、当前 Skill/Agent/Rule 本地规则、上下文文档与 ADR、历史对话/外部参考/模型推断。用户最新指令不得覆盖安全红线；Template 不得覆盖 Rule；Hook 建议不得写成最终审批。
_Avoid_: 用用户临时指令覆盖安全红线、让 Template 覆盖 Rule、把 Hook 或门禁建议写成最终审批、用历史对话覆盖已确认资产

**Agent 整合降级口径**:
目标项目缺少某个 Agent、Skill、Rule、Template、Hook 或上下文资产时，可以降级输出，但必须明示缺失资产、降级等级、影响和人工补齐建议。缺 Agent 时由当前 Skill 直接执行并说明未委托专项角色；缺 Rule 时只能输出受限建议；缺 Template 时可按 Skill 输出要求生成报告但说明未套用模板；缺上下文时输出证据缺口和待确认问题。命中安全红线、生产越权、自动合并/发布诉求或无法判断 P0/P1 风险时不得降级推进。
_Avoid_: 悄悄把不完整链路当成完整执行、缺 Rule 仍输出强准入建议、缺上下文时编造业务规则、用降级绕过安全红线

**Agent 委托流程口径**:
Agent 委托流程是当前 Skill 在高风险或复杂场景下选择专业子 Agent 的证据闭环流程，用于识别任务、检查安全红线、固定输入边界、选择 Agent、读取必要规则、执行分析或受控修改、记录验证动作、输出建议结论和上下文更新建议。该流程应体现在 Skill、Agent 和 `references/rules/` 中，不再依赖旧独立 workflow 文件作为当前入口。
_Avoid_: 把 workflow 写成 8 份重复 Agent 说明、让 workflow 替代 Skill 或 AGENTS.md、继续引用归档 workflow

**Agent 层建议结论转换**:
Agent 层输出应统一转换为建议性质结论，并保留底层 Skill 或 Rule 的原始依据。通过类结论转换为未发现 P0/P1 风险或有条件建议继续；不建议类结论转换为发现高风险建议先修复或补证据；待确认转换为证据不足待确认。发布检查的建议发布类结论转换为发布风险建议，不写允许发布、批准发布或可以上线。
_Avoid_: Agent 输出最终审批、抹掉底层规则源原始结论、把建议发布写成允许发布、把门禁建议写成硬性通过

**目标项目入口轻量路由**:
`references/templates/project/hicode-entry-section.md` 是目标项目入口文件的 hicode 补充片段，只维护 hicode 文档路径、核心流程路由、安全边界和输出规范。目标项目入口主体优先由当前 Coding 平台 `/init` 生成；hicode 不再维护完整 `AGENTS.md` 或 `CLAUDE.md` 模板，也不复制完整规则、降级表、冲突优先级或规则全文。
_Avoid_: 把 hicode 入口补充片段写成长篇整合规范、在入口和规则目录维护两份完整映射、把所有 Skill/Rule 细则塞入 AGENTS.md

**高风险优先委托口径**:
目标项目入口中，子 Agent 不是所有任务的强制默认入口。涉及保险核心业务规则、金额、状态、幂等、权限、隐私、监管、SQL、配置、发布、回滚、跨资产证据组织、专项审查、受控文件修改或门禁/Review/发布输入时，优先委托子 Agent；低风险、单一、只读、一次性报告或用户明确指定 Prompt/Skill 时，可以直接使用 Prompt/Skill。
_Avoid_: 所有任务一律委托 Agent 导致上下文噪音、完全绕开 Agent 导致高风险任务缺少角色边界、在未安装 Agent 时声称完成 Agent 委托

**目标项目入口统一建议结论**:
目标项目入口补充片段的对外输出统一使用 Agent 层建议结论，不保留 V1 通过/不通过兼容口径。统一结论包括未发现 P0/P1 风险、有条件建议继续、发现高风险建议先修复或补证据、证据不足待确认、命中安全红线停止推进并转人工流程。门禁原始结论可以作为依据记录，但入口层必须转换为统一建议结论。
_Avoid_: 在入口层输出通过/不通过、把门禁建议通过写成审批通过、把建议发布写成允许发布、同时维护两套结论口径

**DAILY/LIBRARY 选择性初始化**:
V2 历史设计中的目标项目资产固化分层策略。当前重构后不再作为有效初始化机制；相关 manifest/profile 和固化清单应进入 `archive/`，未来如恢复需要重新形成设计决策。
_Avoid_: 在当前 init 中继续选择 DAILY/LIBRARY、用历史分层驱动目标项目写入、让归档 manifest/profile 影响当前 Skill 路由

**hicode 初始化规划目录**:
原 `references/init/` 是 V2 历史设计中的目标项目初始化和可选固化清单源资产目录。当前重构后不再作为有效目录；目标项目初始化由 `skills/init/SKILL.md` 引导执行平台 `/init`、生成 `docs/rules/` 项目规则，并在用户同意后启动子 Agent 调用 graphify 梳理代码结构。历史 manifest/profile 归档到 `archive/`。
_Avoid_: 当前 Skill 继续读取 `references/init/`、安装 plugin 时自动初始化业务项目、把历史初始化规划写成真实初始化结果

**hicode manifest**:
V2 历史设计中的选择性初始化资产清单，用于记录源资产、目标路径、加载分层、适用场景和依赖关系。当前重构后不再作为有效安装或初始化依据，只保留归档追溯价值。
_Avoid_: 当前 init 继续引用 manifest、把 manifest 当作真实初始化证明、用 manifest 授权发布或合并

**hicode profile**:
V2 历史设计中的内部资产组合，用于表达某类目标项目应初始化或保留哪些项目文档和可选固化 manifest 条目。当前重构后不再作为有效初始化选择项，`core`、`java-insurance-core` 和 `full-library` 等 profile 只保留历史追溯价值。
_Avoid_: 当前 init 要求用户选择 profile、用 profile 决定当前写入范围、让归档 profile 覆盖当前目录规则

**hicode init profile 自动选择**:
V2 历史设计中的 init 行为。当前重构后，`init` Skill 不再自动选择 profile；它只基于用户确认的目标、技术栈、风险线索和写入范围生成目标项目入口、上下文和规则文档。
_Avoid_: 让用户先学习 profile 才能初始化、无证据套用 full-library、隐藏实际写入范围、自动覆盖已有项目资产

**hicode init 代码图谱边界**:
`init` Skill 在 rules 初始化完成后先用只读方式判断项目复杂度；只有多模块、多服务、多语言、多入口、依赖关系复杂或用户明确需要代码图谱辅助定位的高复杂度项目，才建议使用 graphify（`https://github.com/safishamsi/graphify`）。用户同意后，启动子 Agent 调用 graphify 生成代码结构证据；扫描前必须确认扫描范围和排除路径。扫描完成后，必须把实际存在的 graphify 结果文件路径补充到目标项目 `CLAUDE.md` 或 `AGENTS.md`，供后续 Agent 查找代码结构、模块关系或调用链时引用。代码图谱结果只能写为结构证据、推断和待确认项，不能写成已确认业务规则。
_Avoid_: 默认全仓扫描、低复杂度项目默认使用 graphify、扫描 `.env` 或密钥/生产配置、跳过用户确认安装 graphify、把图谱推断写成事实、在入口文件中引用不存在的结果文件

**hicode Coding Agent Plugin**:
当前指安装到 Coding Agent 平台的 hicode 运行资产。Claude Code 通过仓库根目录的 `.claude-plugin/`、`agents/` 和 `skills/` 作为 plugin root 安装；OpenCode 通过 `install.sh --opencode` 把 `agents/`、`skills/` 和 `skills/_shared/` 转换复制为 OpenCode 本地 agents/skills。该安装资产不等同于目标项目 `.hicode/` 运行目录，不在安装阶段扫描目标项目代码，不生成 `CLAUDE.md`、`AGENTS.md` 或项目上下文。
_Avoid_: 目标项目初始化结果、业务项目代码扫描器、生产环境插件、把平台插件安装和项目初始化混为一步

**hicode plugin 内部分层**:
当前对外只维护一个 Claude Code 规范的 `hicode plugin`，以仓库根目录作为 plugin root；内部再区分入口层和能力层。入口层提供 hicode 定位、安全边界和后续初始化入口；能力层直接维护可调用的 hicode Skill、Agent、规则和流程入口，不再维护二级 plugin 副本。OpenCode 适配不复用 Claude marketplace 流程，而是由安装器生成 `hicode-*` 本地 Skill/Agent 和 `hicode-shared` 运行时共享资产。
_Avoid_: 混用 Claude Code 与 OpenCode 的 plugin 安装规范、拆成多个对外 plugin 增加安装心智、替代目标项目初始化、全量默认加载所有资产、绕过人工确认或门禁、自动合并发布或操作生产

**hicode plugin 能力场景包**:
hicode plugin 第一版能力层按初始化入口和能力场景打包，而不是把 `references/` 全量作为默认上下文。首批入口包括目标项目初始化，以及需求到编码前链路、TDD 与辅助编码链路、Review 与提交链路、发布与回归链路。每个场景只选择稳定、可直接调用、低噪音且能保留安全红线的 Agent、Skill、规则和流程入口。
_Avoid_: 把 docs/prompts/skills/gates/schemas/examples 整目录默认塞入平台插件、让平台插件替代目标项目初始化、把低频模板和回归样例默认加载进每次会话

**hicode Plugin 安装器**:
仓库根目录 `install.sh`，用于安装 hicode Coding Agent 运行资产。默认安装 Claude Code plugin；显式传入 `--opencode` 时，把 hicode agents/skills 安装到 OpenCode 用户级配置目录或目标项目 `.opencode/` 目录。安装器不执行目标项目初始化、不扫描代码、不生成项目级入口文件或 `.hicode/` 运行资产。
_Avoid_: 目标项目初始化脚本、代码扫描脚本、生产发布脚本、自动修改业务仓库的工具

**hicode Plugin 安装资产边界**:
`.claude-plugin/plugin.json` 和 `install.sh` 必须避免把本仓库项目管理文档、历史文档或归档材料安装为目标 Coding Agent 的运行资产。当前 plugin manifest 应只暴露根目录 `agents/` 和 `skills/` 作为必要可调用入口；Skill 运行时需要的共享规则和模板放在 `skills/_shared/`，随 `skills/` 一起安装。OpenCode 安装时只复制转换后的 `hicode-*` Agent/Skill 和 `hicode-shared`，不复制 `docs/`、`archive/` 或历史 references。根目录 `docs/`、`archive/` 和本仓库进度/实施计划/ADR 不应作为目标 Coding Agent 默认安装或默认读取内容。
_Avoid_: 把本仓库 `docs/` 当作目标项目知识库安装、把 V1/V2 进度和历史 ADR 暴露为运行规则、安装器复制 archive 或 `.hicode/`

**目标项目 Harness 运行目录**:
目标项目中的 `.hicode/` 是 V2 历史设计中的可选固化目录。当前重构后，hicode 默认不创建、不维护、不复制 `.hicode/` 运行资产；目标项目只沉淀入口文件、项目上下文和项目规则文档，hicode 能力由 plugin 提供。
_Avoid_: 当前初始化生成 `.hicode/`、把 `.hicode/` 当作本仓库源资产目录、通过归档 manifest/profile 复制运行资产

**V1 实施计划**:
将需求文档中的 V1 路线拆成可执行阶段、里程碑、交付物和验收口径的计划文档。
_Avoid_: 详细设计、任务进度、代码实现方案

**实施阶段**:
V1 实施计划中的一级推进顺序，先建立项目入口和进度机制，再建设上下文、Prompt、Skill、门禁和试点运营支撑资产。
_Avoid_: 详细设计阶段、临时任务分组、组织排期

**V1 准备期**:
需求文档第 6.1 节中的第一阶段，目标是建立基础规范和上下文资产；在本仓库的 V1 实施计划中由 P1 项目入口与进度机制和 P2 上下文与规范文档共同覆盖。
_Avoid_: 单独等同于 P1、Skill 建设期、试点运行期

**需求路线与工作包映射**:
需求草案第 6 章的准备期、Skill 建设期、试点运行期和评估推广期是目标项目落地路线；`docs/V1_IMPLEMENTATION_PLAN.md` 的 P1-P6 是本仓库按资产依赖拆分的工作包阶段。两者需要覆盖关系清晰，但不要求阶段名称或边界一一对应。
_Avoid_: 把需求草案阶段直接当作工作包编号、因名称不同误判为范围缺失、用运营路线替代资产建设顺序

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
V1 历史设计中 `references/prompts/` 下的场景化 Prompt 集合，用于约束 Agent 在需求、编码、测试、Review、提交和发布检查中的输入、处理规则、安全边界和输出格式。当前重构后，Prompt 不再作为有效资产类型；仍有效内容应拆入根目录 Skill、`references/rules/` 和 `references/templates/`，原文件进入 `archive/`。
_Avoid_: 当前规则源、Skill 实现、workflow 文档、自由聊天提示语、目标项目 `.hicode/prompts/` 固化来源

**Prompt 模板规范**:
V1 历史设计中由 `references/prompts/README.md` 和 `_template.md` 共同定义的 Prompt 通用结构、语言规则、安全红线和质量口径。当前重构后，其有效内容应吸收到 Skill 写作规则、共享规则或输出模板中，不再维护独立 Prompt 模板规范。
_Avoid_: 当前 Prompt 目录规范、单个场景 Prompt、Skill 输出模板、门禁报告模板

**外部资料设计参考口径**:
NIST、OWASP、CISA、GitHub、GitLab、Superpowers 等外部资料可作为本仓库设计 Prompt、Skill、门禁和规则资产的参考依据，但不作为目标项目 Prompt 的运行时必读上下文。需要强制执行的外部规则应先转化为本地 `references/docs/`、`references/prompts/`、`references/skills/` 或 `references/gates/` 源资产，再由目标项目引用。
_Avoid_: 目标项目 Agent 每次联网读取外部资料、把外部网页当作已审计本地规则、因外部资料版本漂移影响 Prompt 输出

**大型代码库 Agent 工作方法论**:
面向多模块单体、Monorepo、多仓服务群或长期遗留系统的 hicode Agent 使用方法，强调实时代码导航、分层上下文、按需 Skill/Agent、局部命令、Hook 边界、LSP/MCP 工具边界和治理 Owner。重构后不再作为独立 guide 文件维护；仍有效内容应压缩整合进相关 Skill 或 Agent，作为执行步骤、判断规则或停止条件的一部分。
_Avoid_: 全仓盲扫、把所有规则塞入 AGENTS.md、全量默认加载、让所有子 Agent 同时运行、用 Hook/MCP/LSP 替代测试或审批、每次任务默认读取长篇指南

**代码库导航地图**:
目标项目 `docs/PROJ_CONTEXT.md` 中用于帮助 Agent 在大型代码库中先定位再读取的稳定上下文，包括顶层目录、模块职责、关键入口、局部命令、排除路径、代码智能工具、内部工具和 Owner 信息。它服务于缩小搜索范围和降低上下文噪音，不是全量代码索引、自动依赖图或真实运行扫描结果。
_Avoid_: 过期目录清单、全量文件列表、把排除路径用于隐藏安全风险、用导航地图替代代码搜索和验证

**TDD Prompt**:
`references/prompts/tdd.md`，用于在编码前基于需求上下文、编码计划、项目上下文、编码规范和测试规范生成测试设计、测试场景、Given-When-Then 用例、Mock 策略、断言规则和验证要求。V1 允许输出测试代码草案或示例片段，但必须标注为草案，不得声称直接可通过，不得访问真实数据库、真实外部系统、生产配置或敏感数据。
_Avoid_: 只输出测试清单、替代测试负责人确认、自动声称测试通过、访问真实依赖的测试生成 Prompt

**代码修改 TDD 强制口径**:
目标项目中凡是会修改业务代码、测试代码、配置脚本或重构代码行为的任务，都必须遵循 TDD 或测试先行证据；解释模式等纯只读任务不属于代码修改。实现模式必须遵循 RED-GREEN-REFACTOR；修复模式必须先有失败用例、复现测试或可验证失败证据；重构模式必须先有行为保护测试，且不得在 RED 状态重构。
_Avoid_: 无测试先行证据直接编码、把只读解释强行要求 TDD、修复无复现测试、RED 状态重构、用删除测试或降低断言推动通过

**TDD 垂直切片循环**:
TDD 执行应按一个可观察行为一轮循环推进：先写一个通过公开接口验证行为的测试并确认 RED，再写最小实现确认 GREEN，随后在 GREEN 状态下小步重构；不得先批量写完所有测试再批量实现。
_Avoid_: 横向切片、测试私有方法或实现细节、Mock 内部协作者、尚未 GREEN 就重构、为未来需求写投机代码

**公开接口行为测试**:
TDD 中优先使用的测试口径，指测试从调用方可见的 API、命令、服务方法、页面交互、事件或批处理入口进入，断言业务可观察结果，而不是断言私有方法、内部调用顺序或临时数据结构。
_Avoid_: 实现细节测试、私有方法测试、只验证内部调用次数、绕过公开接口证明行为

**系统边界 Mock**:
TDD 中 Mock 的默认边界，指只 Mock 外部 API、第三方 SDK、时间、随机数、文件系统、邮件短信、支付或数据库等系统外部依赖；本项目可控制的内部模块和业务协作者应尽量通过真实代码路径验证。
_Avoid_: Mock 内部协作者、Mock 自己控制的业务模块、用复杂条件 Mock 替代清晰外部接口、连接真实生产依赖

**辅助编码 Prompt**:
`references/prompts/coding-assistant.md`，用于在目标项目本地指导 Agent 基于编码计划和 TDD 输入进行最小范围辅助实现。它可以是受控执行型 Prompt，但必须受需求上下文、编码计划、TDD、编码规范和测试规范约束，不允许超范围修改、删除测试、绕过异常处理、输出敏感信息、操作生产环境、自动合并或自动发布。
_Avoid_: 自由生成完整核心交易代码、替代编码计划、替代 TDD、跨需求重构、生产操作 Prompt

**辅助编码任务模式**:
辅助编码 Prompt 在 V1 中可覆盖实现、修复、重构和解释四种模式。实现模式必须基于需求上下文、编码计划和 TDD；修复模式必须基于失败用例、复现测试或可验证失败证据，Review 问题和缺陷摘要只能作为辅助背景，不能单独作为修复准入依据；重构模式只允许小范围且不改变业务行为；解释模式是只读分析，不修改代码。
_Avoid_: 不分模式的万能编码入口、借修复扩大范围、无失败证据修复、无输入依据的重构、解释模式修改代码

**辅助编码准入条件**:
辅助编码 Prompt 的输入要求按任务模式分级。实现模式必须有编码计划和 TDD 输入；修复模式必须有失败用例、复现测试或可验证失败证据，并优先补测试；Review 问题、缺陷摘要或复现说明可作为定位背景，但不能替代测试先行证据；重构模式必须有明确范围、目标和不改变业务行为的验证方式，核心业务逻辑重构必须有测试保护；解释模式不要求 TDD 且保持只读。
_Avoid_: 所有模式一刀切强制 TDD、实现模式绕过 TDD、无复现依据修复、把 Review 问题或缺陷摘要单独当作修复准入、无测试保护重构核心业务逻辑

**文档驱动追问纪律**:
需求评审和编码计划阶段应先对照长期上下文、单需求上下文、历史缺陷和相关代码证据挑战模糊术语、歧义、冲突和缺口；能从本地文档或代码确认的问题先查证，无法确认的问题输出具体澄清问题、推荐答案和建议确认人。
_Avoid_: 只凭自然语言摘要追问、能本地确认仍反复询问用户、把模糊词当已确认事实、跳过上下文和代码证据直接计划实现

**代码实现前上下文清晰门槛**:
进入 TDD、辅助编码或代码实现前，编码计划 Skill 必须确认需求上下文已经足够清晰、明确、无歧义、无冲突，并能追溯到 `feature_context.md`、需求评审报告、`PROJ_CONTEXT.md`、代码检索或负责人确认；未满足时只能输出澄清问题和上下文补齐动作，不得建议直接实现代码。
_Avoid_: 需求不清仍启动实现、P0/P1 澄清问题未关闭仍建议编码、把推断当已确认业务规则、缺少影响范围仍输出实现步骤

**V1 Prompt 统一骨架**:
V1 Prompt 主干统一使用角色、任务目标、必须读取的上下文、输入材料、检查维度、输出要求、约束和上下文更新八类章节。十二段式中的适用场景、处理规则、安全约束、输出格式、质量标准、待确认问题、上下文更新建议和禁止事项应作为八段式的子项承载，不作为顶层章节分裂。元信息可以保留在标题下，但不能取代主执行结构。输出要求必须包含依据、风险、建议动作、待确认问题和验证要求。
_Avoid_: 每个 Prompt 自定义章节体系、只写一句自然语言指令、无验证要求的模型输出

**Review 规则分层引用**:
代码审查规则采用短总则和分场景细则分离的上下文策略。`docs/REVIEW_RULES.md` 只作为通用总则、风险分级、必检项和加载路由，Java、SQL、安全、保险业务等细则放入 `docs/review-rules/`，由代码审查 Prompt 或 Skill 按 diff 和技术栈按需引用。
_Avoid_: 把所有 Review 规范塞进一个超长文件、把细则全文复制进 Prompt、忽略短指令工具的读取限制

**代码审查 Prompt**:
`references/prompts/code-review.md`，用于在人工 Review 前基于需求、编码计划、TDD、代码 diff、本地 Review 总则和分场景细则输出 AI 代码审查报告。V1 保持本仓库的结论、依据、P0/P1/P2/P3 问题、测试建议、提交检查建议和上下文更新结构，同时吸收 Superpowers 代码审查纪律：基于明确 diff 范围和需求检查，问题必须有文件/位置、影响原因、修复建议和明确结论，严重程度必须校准。
_Avoid_: 替代人工 Reviewer、复制全部 Review 细则、无 diff 范围审查、泛泛反馈、把风格问题标成 P0/P1

**Review 范围标识**:
代码审查可以使用固定基准点、`BASE_SHA`、`HEAD_SHA`、MR/PR diff、当前工作区 diff、补丁文件或变更文件列表加关键片段来标识审查范围。V1 推荐固定基准点审查；`BASE_SHA/HEAD_SHA` 属于兼容的明确范围输入。缺少明确 diff 范围时必须标注审查范围不完整，不得给出无条件通过结论。
_Avoid_: 无范围审查、只看自然语言摘要就给通过、把局部片段审查结论扩展为完整 diff 结论、把兼容范围输入误写成唯一首选

**固定基准点审查**:
代码审查的首选范围口径是用户提供一个固定基准点，并审查该基准点到当前 `HEAD` 的变更。基准点可以是分支、commit、tag 或相对引用；未提供时应先追问，不能擅自假设。V1 推荐使用三点 diff 表达分支相对 merge-base 的实际变更，并记录提交列表；无法取得基准点时可降级使用 MR/PR diff、补丁或当前工作区 diff，但必须标注范围边界。
_Avoid_: 未确认基准点就审查、把双点 diff 和三点 diff 混用不说明、缺少提交列表、范围不完整仍给无条件通过

**双轴代码审查**:
代码审查应区分规范轴和需求轴。规范轴检查变更是否符合已文档化的编码、测试、安全、Review、ADR 和项目约定；需求轴检查变更是否符合来源需求、PRD、编码计划和 TDD 证据。两轴结果应分别呈现，再结合风险分级形成建议结论，避免一个维度的通过掩盖另一个维度的问题。
_Avoid_: 只看代码规范不看需求、只看需求实现不看项目标准、把两轴问题混成不可追溯的综合评价

**规范轴标准来源**:
规范轴只依据已文档化标准和已配置工具约束进行审查。固定标准来源包括入口规则、术语上下文、代码审查 workflow、Review 总则、编码规范、测试规范和缺陷案例；按 diff 触发分场景 Review 细则和相关 ADR；机器配置只作为已有工具约束记录，不替代工具执行结果。标准来源不足时必须标注证据缺口，不得凭个人偏好输出高严重度问题。
_Avoid_: 只读 Review 总则忽略其他标准、把机器配置当成人工审查结果、用个人偏好替代文档化规则、无标准依据仍标 P0/P1

**需求轴降级审查**:
双轴代码审查找不到需求、PRD、编码计划、TDD 或其他来源规格时，规范轴仍可继续，但需求轴必须标注无可用需求来源，不得编造需求一致性结论。最终结论不能是无条件通过；涉及金融核心系统高风险变更时，应提示补齐需求来源后重审。
_Avoid_: 没有需求来源仍声称需求一致、用代码行为反推需求、缺少规格仍给无条件通过

**提交检查 Prompt**:
`references/prompts/pre-commit-check.md`，用于在 Git 提交、创建 MR/PR 或进入提测前输出开发侧提醒型检查报告和建议动作。它可以读取 diff、分支、测试、覆盖率、静态扫描、代码审查和 SQL/配置/脚本清单，并可按条件执行本地单测、构建、静态检查、格式检查和敏感信息扫描；不得自动提交、推送、合并、发布、修改代码、连接生产、修改数据库或读取密钥。
_Avoid_: 自动提交 Prompt、自动合并门禁、生产发布检查、替代 CI/CD、读取 `.env` 或密钥文件

**代码审查与提交检查关系**:
代码审查面向 diff 质量，输出规范轴、需求轴、分级问题和是否建议进入提交检查；提交检查面向提交、MR 或提测材料准入，默认消费代码审查结果，并检查分支、需求关联、测试构建扫描、SQL、配置、脚本、敏感信息和 MR/PR 描述。缺少代码审查结果时，提交检查只能标注审查证据缺口，不得给出无条件建议提交。
_Avoid_: 用提交检查替代深度代码审查、用代码审查替代提交材料检查、没有代码审查证据仍建议无条件提交

**提交检查建议结论**:
提交检查 Prompt 只能输出建议性质的结论，包括建议提交、有条件提交、不建议提交和待确认。对敏感信息、密钥、未脱敏生产数据、P0 Review 问题、自动合并/发布或生产越权必须给出不建议提交和阻断建议；不得输出允许提交、批准提交或已通过最终门禁。
_Avoid_: 把 Agent 建议写成最终审批、用允许提交替代负责人决策、把 MR 描述草稿当成正式提交动作

**核心场景测试 Prompt**:
`references/prompts/core-scenario-test.md`，用于在测试阶段围绕保险/金融核心系统变更整理必测场景、回归场景、边界、异常、测试数据、Mock/环境约束、自动化可行性、执行结果记录和缺口风险。它产出的核心场景测试报告可作为发布检查输入证据，但不替代测试负责人最终确认。
_Avoid_: 发布准入门禁、发布审批、只做单元测试设计、替代测试负责人补测决策

**核心场景测试建议结论**:
核心场景测试 Prompt 只能输出建议性质的测试侧结论，包括建议进入发布检查、有条件进入发布检查、不建议进入发布检查和待确认。P0/P1 测试缺口、核心业务场景未覆盖、测试失败未解释、敏感数据或真实依赖风险应输出不建议进入发布检查。
_Avoid_: 测试通过审批、替代测试负责人确认、未执行测试却声称通过、用建议进入发布检查替代发布检查

**发布检查 Prompt**:
`references/prompts/release-check.md`，用于发布前汇总检查需求清单、分支制品、Commit/MR、代码审查、提交检查、核心场景测试、缺陷、SQL、配置、验证点和回滚方案，并输出建议性质的发布检查结论。它可以指出测试证据不足，但不重新设计详细测试用例，不替代发布负责人最终决策。
_Avoid_: 核心场景测试设计、自动发布、生产操作、最终发布审批、替代发布负责人决策

**发布检查建议结论**:
发布检查 Prompt 只能输出建议性质的结论，包括建议发布、有条件发布、不建议发布和待确认。证据不足或范围不明时使用待确认；P0/P1 缺陷未关闭、核心场景缺失、测试失败、SQL/配置/回滚缺失、敏感信息或生产越权风险应输出不建议发布。
_Avoid_: 发布批准、已通过最终发布门禁、自动发布、用建议发布替代负责人审批

**发布材料准入硬门槛**:
发布检查进入可建议状态前，必须具备发布范围、发布需求清单、分支与制品信息，以及可追溯测试证据入口。缺少发布范围、需求清单或制品信息时只能输出待确认；缺少核心场景测试报告时，只能标注测试证据缺口，不得给出无条件建议发布；存在未关闭 P0/P1、核心场景缺失、测试失败未解释、SQL/配置/回滚缺失、敏感信息或生产越权时，应输出不建议发布和阻断建议。
_Avoid_: 发布对象不清仍建议发布、无制品信息仍做发布结论、无核心场景测试证据仍无条件建议发布

**生产验证计划边界**:
发布检查 Prompt 可以输出生产验证点、验证目标、预期结果、观察窗口、负责人角色和人工确认的数据来源类型，但不得输出或执行生产命令、生产 SQL、生产日志查询、生产接口调用、生产配置值或真实客户/保单信息。必须依赖生产数据时，只能提示发布负责人在既有平台中脱敏确认。
_Avoid_: 连接生产环境、读取生产日志、执行发布或回滚、修改生产配置、输出生产账号或密钥、把上线后观察建议写成 Agent 可执行操作

**发布检查受限命令执行**:
发布检查以发布材料汇总为主，默认不执行测试设计或生产相关命令。必要时只允许在目标项目本地、非生产环境中执行低风险核对命令，例如 `git status`、`git log`、`git diff --stat` 或本地构建、测试、静态检查、格式检查结果复核；不得执行发布、回滚、数据库变更、生产连接、生产日志查询、生产接口调用、读取密钥或删除未确认文件。
_Avoid_: 把发布检查变成发布执行、用 Agent 命令替代发布平台或负责人确认、执行可能连接生产的命令、输出生产操作细节

**核心场景测试与发布检查证据关系**:
核心场景测试报告是发布检查的重要输入证据之一；发布检查负责判断证据是否齐备、风险是否可接受和是否需要补充确认。二者是测试证据产出与发布前证据汇总的关系，不是相互替代关系。
_Avoid_: 发布检查重复生成测试用例、没有核心场景测试证据仍给出无条件发布建议、把测试报告当作发布审批

**核心场景测试与发布检查 Skill 边界**:
`core-scenario-test` Skill 面向测试侧证据产出，输出核心场景、回归、边界、异常、数据、Mock、自动化可行性和测试缺口；`release-check` Skill 面向发布前证据汇总，默认消费核心场景测试报告，并核对发布范围、需求清单、分支制品、Commit/MR、代码审查、提交检查、缺陷、SQL、配置、生产验证点和回滚。缺少核心场景测试证据时，发布检查只能标注证据缺口，不得给出无条件建议发布。
_Avoid_: 用发布检查替代测试设计、用核心场景测试替代发布准入汇总、缺少测试证据仍无条件建议发布

**核心场景测试受限命令执行**:
核心场景测试 Prompt 可以在目标项目本地、非生产环境中按已确认命令执行相关单元测试、指定模块测试、回归测试、覆盖率、构建、静态检查或格式检查，并记录命令、范围、结果、失败摘要和验证边界。依赖不明、可能连接真实外部环境或涉及生产数据时，只能输出人工验证建议，不得直接执行。
_Avoid_: 访问真实数据库或真实外部系统、读取生产配置或敏感数据、执行数据库变更、发布、回滚、删除未确认文件、未执行测试却声称通过

**核心场景来源分层**:
核心场景测试 Prompt 生成场景时必须分层引用需求、项目、领域、测试、缺陷和变更证据，不能只凭用户摘要生成。需求层或变更层缺失时只能输出待确认结论，并说明证据缺口对测试覆盖和发布检查的影响。
_Avoid_: 只凭自然语言摘要生成核心场景、缺少需求范围仍建议进入发布检查、缺少变更范围仍声称覆盖充分

**核心场景证据分层准入**:
核心场景测试进入可建议状态前，必须至少具备需求层和变更层证据。需求层说明本次要验证什么，变更层说明本次实际改了什么；项目层、领域层、测试层和缺陷层用于完善覆盖范围、回归和风险判断。缺少需求层或变更层时，只能输出待确认和补证据动作；测试层缺失时，可以输出场景和补测建议，但必须按缺口严重程度给出有条件或不建议进入发布检查。
_Avoid_: 没有需求证据仍生成完整测试结论、没有变更证据仍判断影响范围、把测试层缺失写成已覆盖

**V1 核心 Skill 集合**:
V1 阶段围绕需求评审、编码计划、TDD、辅助编码、代码审查、提交检查、核心场景测试和发布检查等少量核心研发节点建设的 Skill 集合。每个 Skill 应服务一个真实工程闭环节点，并通过上下文、Prompt、门禁和输出模板补足细节。
_Avoid_: 每个检查维度一个 Skill、一次性铺开大量细碎 Skill、与研发流程节点无关的通用闲聊 Skill

**Skill 标准入口文件**:
Harness Skill 目录统一使用 `SKILL.md` 作为 Agent 可发现、可读取的标准入口文件，并在文件头部使用 YAML frontmatter 描述 `name` 和 `description` 等触发信息。后续计划或模板中出现的 `skill.md` 应统一纠正为 `SKILL.md`。
_Avoid_: `skill.md`、多个入口文件、没有触发描述的长说明文档、需要安装时再重命名入口文件

**Skill 三层关系**:
V1 Skill 采用薄 `SKILL.md`、场景 Prompt 和 `output-template.md` 的三层关系。`SKILL.md` 负责触发、上下文路由、执行步骤和权限边界；场景 Prompt 承载详细任务规则；`output-template.md` 承载报告结构，三者互相引用但不复制全文。
_Avoid_: 把 Prompt 全文复制进 Skill、让 Skill 和 Prompt 分别维护两套规则、没有输出模板的自由格式 Skill

**Skill Frontmatter 口径**:
V1 Skill 的 `SKILL.md` 默认只强制 `name` 和 `description` 两个 frontmatter 字段。`name` 使用目录名同名的 kebab-case；`description` 必须以 `Use when...` 开头，只描述触发条件，不摘要执行流程；平台专属字段只在明确需要时使用。
_Avoid_: 在 description 中复述完整流程、默认绑定 Claude 专属 allowed-tools/hooks/model/context 字段、name 与目录名不一致

**Skill 支撑目录**:
V1 Skill 最小目录只包含 `SKILL.md` 和 `output-template.md`；需要长参考、脱敏样例、本地辅助脚本或静态模板时，可按需增加 `references/`、`examples/`、`scripts/` 和 `assets/`。P4-WP1 只定义可选目录规则，不提前创建空支撑目录。
_Avoid_: 空目录铺开、联网读取外部网页作为运行时依赖、脚本缺少权限边界、样例包含真实客户敏感信息或生产数据

**Skill 标准执行流程**:
V1 Skill 统一采用入口路由、读取对应 Prompt 与上下文、检查输入准入、执行场景分析或检查、套用输出模板、记录验证动作、输出上下文更新建议的流程。敏感信息、生产越权或 P0/P1 风险出现时，Skill 应停止推进并给出阻断或人工确认建议。
_Avoid_: Skill 绕过 Prompt 自行定义规则、缺少输入准入检查、未验证却声称完成、自动执行生产或发布动作

**Skill 验证样例边界**:
P4-WP1 只定义每个 Skill 必须具备可验证要求、压力场景或脱敏输入输出样例的规则，不产出具体示例。具体 Skill 示例统一在 P4-WP7 放入 `references/examples/`，避免把目录规范工作包扩大成示例建设工作包。
_Avoid_: P4-WP1 提前创建具体示例、未脱敏样例、把示例输出冒充真实试点结果、没有验证要求的 Skill

**Skill 示例案例覆盖口径**:
P4-WP7 的 Skill 示例案例用于帮助试点人员理解 V1 核心 Skill 的输入、处理重点、示例输出结构、人工复核点和禁止误用边界。示例覆盖需求评审、编码计划、TDD、辅助编码、代码审查、提交检查、核心场景测试和发布检查 8 个 Skill；示例只说明结构，不冒充真实试点结果，不包含真实客户敏感信息、生产数据、密钥或生产配置。
_Avoid_: 只覆盖部分核心 Skill、把示例当真实执行报告、在示例中放入真实客户或生产信息、把 P4 示例与 P5 回归样例混为一类

**OpenCode 优先兼容策略**:
V1 阶段以 OpenCode 试点落地为主，资产采用 `AGENTS.md`、目标项目 `docs/` 和目标项目 `.hicode/` 等通用 Markdown 结构；Codex、Claude Code、Copilot 等资料用于设计参考和兼容映射，不作为 V1 第一验收目标。
_Avoid_: V1 同时深度适配所有 Agent、把 Claude/Codex/Copilot 专属插件或 Hook 作为首批必交付、忽略 OpenCode 约束

**工具权限与操作审计矩阵**:
V1 治理资产中用于说明不同 Agent、Skill 或门禁在读文件、改文件、执行命令、访问外部工具和输出报告时的权限边界与审计证据要求。矩阵应区分只读分析、生成建议、本地修改、受限命令和禁止操作。
_Avoid_: 只写抽象禁止事项、让所有 Skill 默认拥有同等权限、无审计证据的高风险操作

**受限命令执行**:
V1 中允许在目标项目本地、非生产环境下按条件执行的低风险验证命令，例如相关单元测试、构建、静态检查和格式检查。Prompt 应把受限命令作为条件能力：能执行时记录命令和结果，不能执行时说明原因、风险和人工验证动作；不得连接生产、修改数据库、发布、回滚、读取密钥或删除未确认文件。
_Avoid_: 默认拥有任意 shell 权限、生产命令执行、数据库变更、发布回滚、用命令执行替代人工审批

**渐进式上下文策略**:
V1 资产设计采用短入口、按需加载和结构化输出。`AGENTS.md` 负责入口和边界，Prompt 与 Skill 只读取当前场景必要上下文，并用固定结构输出结论、依据、风险、建议动作、待确认问题和上下文更新建议。
_Avoid_: 一次性读取所有文档、把长篇知识库塞进入口文件、重复复制大段规则、无结构自由输出

**模型适配策略**:
Prompt、Skill 和门禁设计必须考虑 OpenCode 与 DeepSeek V4 Flash 等受限模型的稳定性，优先使用短指令、单一场景、表格或清单输出、明确依据和待确认问题；高风险结论必须要求人工确认。
_Avoid_: 单个 Prompt 执行全流程、长篇复杂指令、无依据高风险结论、用模型自信表达替代验证

**需求文档生成前置能力**:
由公司既有 AI 工具或需求管理流程提供的 PRD 草稿生成能力。V1 Harness 消费其输出，并聚焦需求评审、澄清问题和 `feature_context.md` 上下文沉淀。
_Avoid_: 本仓库自动生成正式 PRD、把 PRD 生成作为 V1 Harness 核心验收项、替代业务负责人确认需求

**V1 提醒型门禁策略**:
V1 门禁默认输出提醒型检查报告和建议动作；对敏感信息泄露、密钥或 Token、未脱敏生产数据、AI 直接生产操作、自动合并或发布、P0 业务或安全风险，门禁报告必须给出阻断建议，实际阻断由既有流程或负责人决策。
_Avoid_: V1 初期全量强制阻断、把 AI 门禁当作最终审批、对敏感信息或 P0 风险只做普通提醒

**门禁建议结论**:
V1 门禁报告只能输出建议性质的结论，包括建议通过、有条件通过、建议阻断和待确认。建议通过表示当前证据未发现阻断项；有条件通过表示存在需补充确认、补测或补材料的问题；建议阻断表示存在 P0/P1、高风险安全、敏感信息、生产越权、自动合并/发布或关键证据缺失等不应继续推进的问题；待确认表示检查对象、范围或证据不足，不能形成有效建议。
_Avoid_: 批准通过、最终通过、强制拦截、用“通过”替代负责人决策、证据不足仍建议通过

**门禁阻断建议项与风险提示项**:
V1 门禁报告应区分阻断建议项和普通风险提示项。阻断建议项用于 P0/P1、高风险安全、敏感信息、密钥、未脱敏生产数据、生产越权、自动合并/发布、关键证据缺失等不应继续推进的问题，并要求给出解除条件和建议确认人；普通风险提示项用于 P2/P3、材料补充、验证增强或可接受风险说明。
_Avoid_: 把 P0/P1 或敏感信息问题混入普通风险、只给风险不写解除条件、把风险接受写成 Agent 自行批准

**门禁审计证据**:
V1 门禁报告必须记录可归档审计证据，包括检查时间、检查人或 Agent、检查对象、输入材料、证据来源、受限命令执行记录、人工确认人和证据归档位置。审计证据用于说明门禁建议如何形成，不代表审批已完成，也不授权 Agent 自动合并、发布或操作生产环境。
_Avoid_: 只输出结论不留证据、把命令结果当人工审批、用无法追溯的口头描述替代证据来源、记录生产密钥或未脱敏生产数据

**需求准入门禁**:
需求准入门禁用于判断需求或故事是否可以进入开发。建议通过必须至少具备明确检查对象、需求评审 Skill 报告且结论为通过或有条件通过、无未关闭 P0 澄清问题、核心业务规则和验收标准明确，以及 `docs/features/<feature-id>/feature_context.md` 或等价单需求上下文材料。存在未关闭 P0、核心规则缺失、验收标准缺失、敏感信息或生产越权时，应输出建议阻断或待确认。
_Avoid_: 没有需求评审报告仍建议通过、P0 澄清未关闭仍进入开发、核心业务规则缺失仍放行、把等价材料当作长期免除 `feature_context.md`

**编码准入门禁**:
编码准入门禁用于判断已完成需求准入的需求或故事是否可以开始编码。建议通过必须至少具备需求准入门禁建议通过或有条件通过且条件不阻塞编码、编码计划 Skill 报告且结论为建议启动编码或有条件启动编码、上下文清晰门槛为充足或有条件充足、无未关闭 P0 待确认问题，以及 ADR 判断已给出。上下文清晰门槛不足、P0 未关闭、ADR 判断缺失且涉及难逆决策时，应输出建议阻断。
_Avoid_: 需求未准入仍开始编码、没有编码计划仍建议通过、上下文不足仍启动实现、ADR 判断缺失仍推进难逆变更

**提测门禁**:
提测门禁用于判断开发完成后的分支、Commit 或 MR 是否可以交付测试。建议通过必须至少具备明确变更范围、编译或构建通过、单元测试通过、TDD 或测试先行证据可追溯、AI Review 无未关闭 P0/P1 阻断项、提交检查不阻塞提测、核心测试场景已生成，以及无敏感信息或生产越权。编译失败、单测失败未解释、P0/P1 未处理、核心场景缺失、敏感信息或绕过测试/Review 时，应输出建议阻断或待确认。
_Avoid_: 代码不能编译仍提测、单测失败仍放行、缺少 AI Review 或提交检查仍建议通过、用测试负责人后补确认替代核心场景生成、隐藏敏感信息风险

**合并门禁**:
合并门禁用于判断 MR 或 PR 是否可以进入人工合并决策。建议通过必须至少具备明确 MR/PR 范围、AI Review 已完成且无未关闭 P0/P1 阻断项、人工 Review 已按项目规则完成、CI 通过、覆盖率满足项目阈值或无未解释下降，以及无未关闭 P0/P1、敏感信息或生产越权。本门禁只给合并建议，不授权 Agent 自动批准或合并。
_Avoid_: 跳过人工 Review、CI 失败仍合并、覆盖率低于硬阈值无确认仍放行、P0/P1 未关闭仍合并、把门禁建议写成自动合并许可

**发布准入门禁**:
发布准入门禁用于判断发布申请是否具备进入人工发布审批的证据。建议通过必须至少具备明确发布范围、完整发布需求清单、分支和制品一致、发布检查 Skill 结论可映射为建议通过、测试和核心场景证据齐备、无未关闭 P0/P1 缺陷、SQL 和配置齐备或明确不适用、回滚方案明确、生产验证点明确，以及无敏感信息或生产越权。它只输出门禁建议，不授权 Agent 自动发布、回滚、连接生产、读取生产日志或修改生产配置。
_Avoid_: 发布范围不清仍建议通过、无制品信息仍放行、测试失败或核心场景缺失仍发布、SQL/配置/回滚缺失仍进入发布、把生产验证点写成生产命令、把门禁建议写成最终发布审批

**工具权限与操作审计矩阵**:
工具权限与操作审计矩阵用于定义 Harness Prompt、Skill 和门禁在各研发场景下的能力边界、禁止操作和可归档审计证据，包括只读分析、生成建议、本地修改、受限命令和禁止操作。它不定义目标项目用户 RBAC、组织审批流、生产发布权限模型或人员职责分配。
_Avoid_: 人员权限系统、审批流设计、生产账号授权、组织角色排班、把 Agent 建议写成负责人审批

**V1 工具权限等级**:
V1 工具权限等级用于描述 Harness 资产可触达的操作能力。L0 为只读分析；L1 为生成建议、计划、草稿或补丁建议；L2 为在本地修改代码、测试或文档；L3 为执行本地非生产受限命令；L4 为接入 CI/CD 或发布平台。V1 默认控制在 L0-L2，L3 只能作为受限命令能力按条件开放并记录审计证据，L4 不作为 V1 默认能力。
_Avoid_: 把 L4 当作默认能力、把 L3 扩展为生产操作、用权限等级替代人工审批、把本地修改权限解释为可超范围改动

**本地修改权限**:
本地修改权限指 Agent 在目标项目工作区内修改代码、测试或必要文档的能力。V1 中该能力只默认授予辅助编码场景，且必须受需求范围、编码准入、TDD 或测试先行证据、受限命令边界和人工确认约束；其他场景即使输出补丁、模板、测试代码草案或上下文更新建议，也只属于生成建议，不自动获得落盘修改权限。
_Avoid_: 需求评审直接改需求文档、代码审查直接修代码、TDD 草案自动落盘、发布检查修改发布材料、门禁报告自动改流程配置

**高风险操作禁止边界**:
高风险操作禁止边界指 V1 Harness 中 Agent 不得执行的操作集合，包括删除或覆盖未确认文件、生产连接、生产 SQL、生产日志查询、生产接口调用、生产配置修改、数据库变更、发布、回滚、自动提交、自动推送和自动合并。需要这些动作时，Agent 只能给出风险、证据缺口和转既有人工流程或平台流程的建议。
_Avoid_: 审批后由 Agent 直接执行生产动作、把 L4 写成 V1 可用能力、用受限命令包装高风险操作、为通过门禁删除测试或隐藏风险

**节点门禁 Agent 的 V1 口径**:
需求草案中的节点门禁 Agent 在 V1 中落为可人工执行、可审计的 Markdown 门禁规则和报告模板，用于形成标准化检查依据；不作为独立自动化 Agent、CI/CD 插件或流程平台审批人。
_Avoid_: 自动流转审批、自动合并、自动发布、把 AI 门禁当最终负责人

**门禁 Hook 化**:
hicode 后续集成方向之一，指将已稳定的 Markdown 门禁规则、报告模板和 Schema 转化为本地开发流程或代码托管流程中的 Hook 检查点，用于自动触发检查、生成报告、提醒阻断建议和归档审计证据。Hook 化只改变触发和执行载体，不改变门禁建议性质，也不授权自动发布、自动合并或生产操作。
_Avoid_: 把 Hook 等同于最终审批、Hook 自动合并或发布、Hook 连接生产环境、未稳定的门禁规则直接工具化

**hicode Hook 分层策略**:
hicode Hook 默认采用提醒型 `advisory` 模式，用于自动触发检查、生成报告和提示建议结论；只有密钥、Token、未脱敏客户敏感信息、未脱敏生产数据、生产越权、自动合并/发布/回滚、删除测试、降低断言或跳过 Review 等安全红线和流程绕行问题，才允许使用阻断型 `blocking` 模式。阻断型 Hook 只阻断高风险动作，不替代负责人最终审批。
_Avoid_: 所有门禁一开始强制阻断、用 Hook 替代人工审批、把 P2/P3 建议类问题升级为硬阻断

**首批 hicode 门禁 Hook 范围**:
当前首批 Hook 只覆盖 Coding Agent 可在本地研发流程中合理约束的编码准入、合并门禁和上下文捕获。需求准入、提测准入和发布准入继续保留为规则、人工流程或后续平台集成方向，不进入当前自动 Hook 范围；生产发布、回滚、生产配置和生产数据相关 Hook 不做自动化。
_Avoid_: 在 Coding Agent 层限制需求立项或发布审批、把提测/发布流程误写成本地 Hook 强制阻断、首批 Hook 范围膨胀为全流程平台治理、生产类动作 Hook 自动化

**Hook 可审查执行说明**:
围绕单个 hicode Hook 条目编写的落地说明，用于让安装器、平台适配层和人工 Review 理解该 Hook 的触发点、输入、输出、blocking 条件、禁止动作、审计证据以及 Claude/OpenCode 等目标平台的原生配置示例。它不是泛泛使用示例，也不是完整平台适配器实现。
_Avoid_: 只写概念说明、生成不可追溯到 `hook.json` 的示例、在说明中实现完整适配器或夹带生产命令

**上下文捕获 Hook**:
`context-capture-hook` 是当前保留的持续改进类 Hook，用于在 Agent 会话结束时提出 `AGENTS.md`、`docs/PROJ_CONTEXT.md`、子目录上下文文件、排除路径、局部命令和风险规则的更新建议。它不关联 Gate，不产生 blocking，不自动写入长期上下文，必须等待 hicode Owner 或项目负责人确认后归并。
_Avoid_: 把上下文捕获 Hook 当作门禁阻断、自动修改长期上下文、自动提交上下文更新、用会话发现替代负责人确认

**hicode 自动化红线**:
hicode 即使引入子 Agent、Hook、选择性初始化和自动触发，也不得自动发布、自动合并、自动回滚、连接生产环境、修改生产配置、执行生产 SQL、读取生产日志原文或处理未脱敏生产数据。涉及这些动作时只能输出风险、证据缺口、阻断建议和转人工或既有平台流程的建议。
_Avoid_: 以审批后执行为理由让 Agent 操作生产、用 Hook 包装生产命令、把门禁建议写成自动化许可

**上线后验证门禁的 V1 口径**:
需求草案中的上线后验证门禁在 V1 中只沉淀为发布检查和发布准入门禁里的生产验证点、上线后观察建议和异常反馈检查项，不授权 Agent 连接生产环境、读取生产日志原文或执行上线后操作。
_Avoid_: 生产操作工作包、自动监控预警、未脱敏生产日志分析、替代发布负责人验证

**V1 结构化输出 Schema**:
V1 历史设计中用于约束 AI Review 报告、门禁报告和风险等级的 JSON 输出结构，曾服务后续工具化校验和归档。当前重构后 JSON Schema 不再作为有效运行资产，原文件进入 `archive/`；仍有效的字段、枚举和输出约束应转化为 Markdown 结构化输出规则。
_Avoid_: 当前运行 Schema、平台接口契约、数据库模型、流程审批状态机、替代 Markdown 报告、绑定特定工具平台

**Schema 稳定枚举代码**:
原 V1 结构化输出 Schema 中用于机器校验的枚举值，采用稳定英文代码表示结论、风险等级、确认状态、检查结果和命令执行状态。当前重构后，可继续作为 Markdown 结构化输出规则中的稳定枚举使用，但不要求保留独立 JSON Schema。
_Avoid_: 用中文展示文案作为机器枚举、每个场景自定义一套枚举、把枚举代码解释成平台审批状态、为了枚举保留独立 JSON Schema

**Harness 资产回归评估**:
用于验证 Prompt、Skill、门禁和 Schema 是否持续有效的样例与检查机制，包括示例输入、期望输出、高风险场景样例、误报/漏报记录和修改后的轻量回归。
_Avoid_: 只凭主观体验判断资产有效、修改 Prompt/Skill 后不复测、没有金融核心高风险样例

**V2 回归样例口径**:
V2 回归样例按场景集组织，不是单一 happy path 示例。每个样例文件应围绕一类 V2 能力覆盖多个验收场景，并采用可人工执行验收的 Markdown 结构，明确回归目标、适用资产、脱敏输入、执行步骤、期望输出要点、失败判定和禁止事项，用于验证 Agent 委托、选择性初始化、Hook advisory/blocking 边界、缺失资产降级、安全红线、生产越权拒绝和金融核心高风险标准是否保持一致。
_Avoid_: 每个文件只写一个正常流程、写成泛化说明文档、引入真实安装脚本、Hook 执行脚本、自动化测试或 CI 配置、用回归样例证明真实安装或真实运行效果、包含未脱敏生产数据、为通过样例降低风险标准

**V1 分层验收**:
V1 验收分为仓库资产验收和试点运行效果验收。仓库资产验收关注目录、模板、Prompt、Skill、门禁、Schema、示例、风险矩阵、权限矩阵和回归样例是否齐备；试点运行效果验收关注覆盖率、采纳率、有效问题率、误报漏报、效率质量指标和复盘报告。
_Avoid_: 用本仓库资产建设替代真实试点效果、把未采集的试点数据写成已达成、把运营指标混入单个资产验收

**V2 演进边界**:
ECC 对标后确认的 `agents/`、Agent 与 Prompt 整合、`DAILY/LIBRARY` 选择性初始化、`references/init/` 和门禁 Hook 化属于 V2 演进方向，不回改 V1 已完成工作包状态。V1 作为已完成基线保留；V2 应另行形成规划、工作包和验收口径。
_Avoid_: 把 V2 新方向写成 V1 未完成、为引入新资产重开 V1 工作包、混用 V1 验收台账和 V2 规划

**Markdown-first Harness**:
V1 优先交付可人工执行、可审计、可复制的 Markdown 工程资产，包括 `AGENTS.md`、目标项目 `docs/`、Prompt、Skill、门禁、Schema、示例、检查报告模板和回归样例。Git Hook、流程平台、MR 自动评论、指标看板、自动安装和多 Agent 编排属于后续集成方向。
_Avoid_: V1 变成平台集成项目、把自动化 Hook 或看板作为首批验收目标、未有稳定资产就先做工具化封装

**轻量运营治理**:
V1 运营机制只保留资产维护责任、高风险内容确认责任、试点复盘节奏和复盘对象，不在本仓库制定具体人员名单、排班、发布窗口或组织绩效规则。
_Avoid_: 人员排班、组织绩效规则、替代负责人决策、把运营安排写成仓库内开发任务

**P6 试点运营支撑资产**:
P6 交付给真实试点使用的运营支撑模板，用于记录候选试点项目、基线指标采集口径、试点使用记录和 V1 复盘报告。它只提供模板和统计口径，不记录真实客户数据、生产数据、真实试点结果，也不编造覆盖率、有效问题率或推广结论。
_Avoid_: 执行真实试点、安排人员排班、发布窗口管理、记录生产数据、编造试点指标、替代负责人复盘结论

**P6 统一追溯 ID**:
P6 试点运营支撑资产之间用于脱敏关联记录的项目内编号，包括 `pilot_project_id`、`metric_id`、`usage_record_id` 和 `review_item_id`。这些 ID 只用于模板内追溯，不等同于真实项目编号、需求编号、客户编号、保单号、人员工号或生产系统标识。
_Avoid_: 真实客户或保单标识、生产系统主键、人员工号、内部项目敏感编号、无法脱敏的外部链接

**试点项目清单模板**:
P6-WP1 交付的候选试点项目评估与选择建议模板，用于脱敏记录候选项目的适配场景、风险等级、角色要求、证据准备情况、排除原因和选择建议。它不是试点执行台账，不记录真实人员名单、生产地址、生产系统编号、客户信息、保单号、密钥或真实试点执行结果。
_Avoid_: 真实试点执行清单、项目花名册、生产系统清单、客户或保单数据台账、试点效果报告

**基线指标采集方案**:
P6-WP2 交付的指标字典、采集计划和空值记录模板，用于定义 V1 试点前后效率、质量、过程和安全指标的数据来源、采集周期、统计口径、责任角色和缺失数据处理方式。它不记录未采集的实际指标值，不把 V1 参考阈值写成试点已达成结果。
_Avoid_: 试点效果结论、编造基线值、编造采纳率或覆盖率、把目标阈值当成实际结果、无口径的数据表

**试点使用记录模板**:
P6-WP3 交付的脱敏使用事件台账，用于按次记录 V1 Prompt、Skill 和门禁在试点中的使用场景、资产名称、输入来源类型、输出结论摘要、人工采纳情况、问题和改进建议。它不保存完整 Prompt、完整模型输出、原始代码 diff、生产日志、客户材料或生产密钥。
_Avoid_: 原始交互全文、生产日志摘录、客户敏感材料、未脱敏代码或配置、把使用记录写成效果结论

**V1 复盘报告模板**:
P6-WP4 交付的基于证据的 V1 复盘报告模板，用于汇总试点使用记录和基线指标采集结果，区分事实数据、分析判断和建议动作，并提出继续试点、条件推广、不建议推广或补充证据的建议结论。它不替代负责人验收、推广审批或组织决策，不把未采集数据写成已达成指标。
_Avoid_: 推广审批结论、验收证书、编造试点效果、把建议动作写成已执行、替代负责人最终决策

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
单独写 `docs/` 时默认指根目录项目管理文档目录；目标项目可复制填写的文档模板必须明确写作 `references/templates/project/`。

**`AGENTS.md`**:
单独写 `AGENTS.md` 时默认指根目录本仓库 Agent 入口规则；目标项目实际入口文件写作目标项目根目录 `AGENTS.md`。hicode 当前只维护 `references/templates/project/hicode-entry-section.md` 作为可补充到目标项目入口文件的片段，不再维护完整 `AGENTS.md` 模板。

**`.hicode/`**:
单独写 `.hicode/` 时默认指 V2 历史设计中的目标项目可选固化目录。当前重构后，默认项目初始化不创建该目录，hicode 也不再复制 plugin 内置资产到目标项目 `.hicode/`；本仓库当前源资产必须使用 `skills/`、`agents/`、`references/rules/`、`references/templates/` 和 `references/hooks/`。

## Example Dialogue

开发 Agent：我开始任务前应该先读哪些内容？

项目负责人：默认先读 `AGENTS.md`、`CONTEXT.md`、`docs/PROGRESS.md` 和当前工作包对应的实施计划。V3 简化重构期间读取 `docs/V3_IMPLEMENTATION_PLAN.md`。需求草案不是默认必读，只有当前工作包需要追溯原始方案或用户要求时再读。

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
