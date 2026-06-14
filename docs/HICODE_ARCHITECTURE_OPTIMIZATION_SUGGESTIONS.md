# hicode 架构优化建议

## 结论

本次只分析当前有效资产，排除 `archive/`。当前 hicode 已完成 V3 简化，主干方向正确：`skills/` 直接执行并承载必要规则种子和模板文档，`agents/` 专项委托，`hooks/` 只保留 Hook 说明。

主要优化空间不在新增资产类型，而在提升几个现有 Module 的 Depth：把重复安全规则、场景文档生命周期、Hook 语义和治理验收集中到更小的 Interface 后面，提升 Leverage 和 Locality。

2026-06-12 更新：候选 1 已按 grill-with-docs 确认实施。Agent 共性规则曾收敛进稳定规则 Interface，后续已进一步吸收到 Agent 正文和 `skills/init/coding_rules.md` 生成口径。

2026-06-12 更新：候选 5 已按 grill-with-docs 确认实施。当前资产健康检查已脚本化为 `scripts/health-check.sh`，说明文档为 `docs/HICODE_HEALTH_CHECK.md`。

2026-06-12 更新：候选 2 和 6 已按 grill-with-docs 继续实施。单需求文档生命周期规则曾集中到模板索引，后续已上移到 `skills/init/hicode-entry-section.md`，由 `hicode:init` 写入目标项目入口。

2026-06-12 更新：候选 3 和 4 已完成低风险收敛。`coding_rules.md` 已在单一稳定 Interface 内区分编码强制规则与 Review/测试证据规则；Hook 目录一致性已纳入 `scripts/health-check.sh`。

2026-06-14 更新：V3-MAINT-WP30 已删除 `references/rules/`、`references/templates/` 和未再引用的 Hook 模板。当前 `references/` 只保留 Hook 行为说明和目录索引；规则种子与模板文档以 `skills/<skill>/` 根目录为准。

2026-06-14 更新：V3-MAINT-WP31 已将 Hook 行为说明提升到根目录 `hooks/`，并删除根目录 `references/`。

## 依据

1. `AGENTS.md`：当前资产只包括 `skills/`、`agents/`、`hooks/`，`archive/` 非运行、非安装、非默认检索。
2. `CONTEXT.md`：已定义 hicode 当前有效资产、Skill 本地运行资产、Hook 目录和 V3 简化重构口径。
3. `docs/adr/0003-simplify-hicode-reference-assets-and-direct-skills.md`：已接受直接 Skill、专业 Agent、三类 `references/` 的架构决策。
4. 扫描命令：`rg` 检查当前运行资产未命中 `archive/`、旧 `references/prompts`、旧 `references/skills`、旧 `references/gates`、旧 `references/schemas`、旧 `references/examples`、旧 `references/init`、旧 `references/target-project`。
5. 规模信号：`skills`、`agents`、`hooks` 是当前主要资产目录，其中 8 个 Agent 与模板共约 1420 行，存在明显重复章节。

## 优化候选

### 1. 收敛 Agent 共性规则 Module

状态：已实施。

**Files**

`agents/*.md`、`agents/_template.md`、`agents/README.md`、`skills/init/coding_rules.md`

**Problem**

8 个 Agent 都复制了 Prompt 防护基线、权限与受限命令、输出要求、安全红线和停止条件。删除任一 Agent 后，这些复杂度不会消失，只会继续散落在其他 Agent 中。当前 Agent Module 偏 Shallow：每个 Interface 都要求维护者理解大量相同规则，Implementation 变化也要多处同步。

**Solution**

保留 Agent 的角色、触发条件、专项流程和输出差异，把共性安全、权限、受限命令、输出枚举和停止条件写入 Agent 正文，并让 `skills/init/coding_rules.md` 负责目标项目规则种子。Agent 不再通过 `references/` 读取共性规则。

**Benefits**

Locality：安全红线和输出口径只需一处修改，减少漂移。

Leverage：所有 Agent 通过同一个小 Interface 继承一致的高风险处理纪律。

测试改进：后续验收可以用一次扫描确认所有 Agent 引用同一规则 Module，并只检查 Agent 自身差异是否完整。

### 2. 深化场景文档生命周期 Module

状态：已实施。

**Files**

`skills/init/hicode-entry-section.md`、`skills/scope/SKILL.md`、`skills/tdd/SKILL.md`、`skills/review/SKILL.md`、`skills/release/SKILL.md`

**Problem**

Scope、TDD、Review、Release 都在各自 Skill 中描述 `docs/features/<feature-id>/`、报告创建、缺失材料处理、证据降级和上下文更新。当前规则可读，但生命周期知识分散。删除这些重复描述后，复杂度会在四个 Skill 中重新出现。

**Solution**

把单需求特性文档的生命周期规则沉淀成一个更深的规则 Module：定义 feature 文档清单、创建时机、缺失材料处理、可写事实范围、证据降级和各阶段交接关系。当前已集中到 `skills/init/hicode-entry-section.md`，由 `hicode:init` 写入目标项目入口；`scope`、`tdd`、`review` 和 `release` Skill 只保留本阶段动作并读取目标项目入口中的 hicode section。

**Benefits**

Locality：文档路径、状态和写入纪律集中维护。

Leverage：新场景 Skill 或 Agent 可以复用同一套文档生命周期，而不用复制流程。

测试改进：可增加路径一致性检查，验证 Skill 与模板目录的文档名、阶段关系和输出报告一致。

### 3. 拆分编码规则与金融核心风险规则

状态：已实施为内部结构收敛，未拆分文件。

**Files**

`skills/init/coding_rules.md`、`skills/tdd/SKILL.md`、`skills/review/SKILL.md`、`agents/java-reviewer.md`、`agents/security-reviewer.md`

**Problem**

`coding_rules.md` 同时承载后端编码强制规则、金融核心系统风险基线、测试要求、Review 分级和输出证据要求。它很短，但 Interface 偏混合：调用者无法清晰区分“编码时必须遵守”和“审查时如何判级”。后续继续扩展会让规则 Module 变成高频冲突点。

**Solution**

保持一个稳定入口规则文件，并在内部明确分区：Agent 共性规则、编码强制规则、Review 与测试证据规则。当前不恢复旧多目录体系。

**Benefits**

Locality：不同类型规则的维护位置更清楚。

Leverage：TDD、Review、Agent 可以只读取本任务需要的规则段，降低上下文噪音。

测试改进：可以按规则编号检查 Skill 输出是否覆盖对应规则，而不是只检查是否引用整个文件。

### 4. 收敛 Hook 语义与适配说明

状态：已实施。

**Files**

`hooks/*.md`、`hooks/hook.json`、`install.sh`、`.claude-plugin/plugin.json`

**Problem**

Hook 说明已经明确不自动启用、不连接生产、不替代审批，但 Markdown 说明和 `hook.json` 并行维护。Hook 的 Interface 目前既包含行为语义，也包含示例字段和适配提醒。后续增加 Hook 时，容易出现 JSON 与说明文档漂移。

**Solution**

明确 `hook.json` 是 Hook 清单与机器可读字段，Markdown 是人可读行为说明；已在 `scripts/health-check.sh` 中加入最小一致性验收项，检查 Hook ID、规则依据、默认模式、blocking 条件和禁止动作。

**Benefits**

Locality：Hook 适配时知道哪个文件是事实来源。

Leverage：未来接入真实平台 Adapter 时，不需要重新解释每个 Hook 的语义。

测试改进：可增加轻量脚本或手工检查清单，对比 `hook.json` 与 Markdown 的 Hook ID、模式和规则依据。

### 5. 建立当前资产健康检查 Module

状态：已实施。

**Files**

`docs/V3_PATH_CONSISTENCY_CHECK.md`、`docs/V3_INSTALL_BOUNDARY_CHECK.md`、`install.sh`、`.claude-plugin/plugin.json`

**Problem**

当前已有路径一致性和安装边界检查报告，但它们是一次性验收材料。仓库后续维护时，是否重新执行检查取决于人工记忆。删除这些报告不会删除检查知识，但检查步骤会重新分散到人脑和历史文档。

**Solution**

把路径一致性、归档依赖、安装边界和敏感目录禁止项收敛成一个可重复运行的健康检查 Module。当前已脚本化为 `scripts/health-check.sh`，并用 `docs/HICODE_HEALTH_CHECK.md` 说明覆盖范围和失败处理。

**Benefits**

Locality：当前资产健康判断集中在一个地方。

Leverage：每次变更 Skill、Agent、Rule、Template、Hook 或安装器时，都能复用同一套验收入口。

测试改进：从“报告曾经 PASS”升级为“当前工作树可复跑检查”。

### 6. 清理 V3 计划与当前文件结构的漂移

状态：已实施。

**Files**

`docs/V3_IMPLEMENTATION_PLAN.md`、`docs/PROGRESS.md`、`hooks/`

**Problem**

V3 计划和进度中仍记录曾创建 `references/rules/shared/`、`references/rules/init/`、`references/rules/scope/`、`references/rules/tdd/`、`references/rules/review/`、`references/rules/release/` 以及 `references/templates/scope|tdd|review|release/`，但当前文件结构已进一步收敛为 `skills/<skill>/` 根目录文档和根目录 `hooks/`。这不影响运行资产，但会增加新 Agent 理解项目历史时的跳转成本。

**Solution**

补一段“当前已收敛形态说明”到 V3 计划，明确这些目录是历史中间态，当前稳定 Interface 已收敛为 `skills/init/coding_rules.md`、`skills/init/hicode-entry-section.md`、各场景 Skill 根目录模板和根目录 `hooks/`。

**Benefits**

Locality：当前结构和历史计划之间的解释集中，不需要维护者反复追溯。

Leverage：新 Agent 可以更快判断哪些路径是当前可用资产。

测试改进：路径检查结果与计划说明一致，减少误报和误读。

## 风险等级

整体风险：P2。

原因：这些问题主要影响维护成本、规则漂移和 Agent 可导航性；当前未发现运行资产依赖 `archive/` 或旧 references 目录，也未发现安装器暴露 `docs/` 或 `archive/` 的直接风险。

## 建议动作

1. 已完成候选 1：Agent 共性规则收敛。
2. 已完成候选 5：当前资产健康检查 Module。
3. 已完成候选 2 和 6：文档生命周期与计划漂移收敛。
4. 已完成候选 3 和 4 的低风险收敛。

## 待确认问题

1. 已确认：Agent 共性规则写入 Agent 正文，目标项目规则种子由 `skills/init/coding_rules.md` 承载，不恢复 `references/rules/`。
2. 已确认：健康检查直接脚本化，入口为 `scripts/health-check.sh`。
3. 已处理：V3 计划中的历史中间态不修订原文，只追加当前收敛形态说明。

## 建议更新的上下文或资产

1. 已更新 `CONTEXT.md` 的 `hicode Agent 共性规则` 术语。
2. 已更新 `skills/init/coding_rules.md` 和 Agent 正文，承载当前规则种子与 Agent 共性安全、权限、输出和停止规则。
3. 已新增 `hicode 当前资产健康检查 Module` 术语和 `docs/HICODE_HEALTH_CHECK.md`。
4. 已新增 `单需求文档生命周期规则` 术语，更新 `skills/init/hicode-entry-section.md`、相关 Skill 和 `docs/V3_IMPLEMENTATION_PLAN.md`。

## 下一步

剩余候选 3 和 4 建议等规则或 Hook 实际变更时再处理。
当前 6 个候选均已处理；后续优化建议进入新的架构分析轮次。
