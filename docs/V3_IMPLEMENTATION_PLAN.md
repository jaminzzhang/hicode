# V3 简化重构实施计划

## 1. 计划定位

本计划用于执行 hicode V3 简化重构，将当前 hicode 从 V1/V2 建设期资产库收敛为更小、更清晰的 Claude Code plugin 和 hicode 设计中心。

V3 的核心目标不是新增业务能力，而是降低当前资产目录、Skill 引用链路和目标项目初始化机制的复杂度，让 Coding Agent 使用 hicode 时优先读取直接可执行的 Skill、必要规则和输出模板。

本计划是 V3 重构的执行基准。V1/V2 计划和历史资产只保留追溯价值，不再指导本轮重构。

## 2. 已确认决策

1. `references/` 当前只保留三类目录：`rules/`、`templates/`、`hooks/`。
2. 根目录 `archive/` 是历史归档区，非运行、非安装、非默认检索。
3. 根目录 `skills/` 保留 6 个入口：`hi`、`init`、`scope`、`tdd`、`review`、`release`；其中 `hi` 是总入口，`hicode:init`、`hicode:scope`、`hicode:tdd`、`hicode:review`、`hicode:release` 是场景路由表达。
4. 6 个 Skill 要直接告诉 Coding Agent 做什么、按什么顺序做、何时停止和如何输出，不能只引用旧细粒度 Skill。
5. 根目录 `agents/` 继续保留 8 个专业子 Agent，但保持短角色入口定位。
6. 旧 Prompt、Gate、Schema、Example、Regression、Guide、manifest/profile 和 `DAILY/LIBRARY` 机制不再作为当前资产类型保留。
7. 旧 guide 内容先提炼进 Skill/Agent，再归档原文。
8. 旧 Prompt 内容拆为执行规则、输出骨架和历史原文：规则进 Skill 或 `references/rules/`，输出骨架进 `references/templates/`，原文归档。
9. 旧 Gate 内容拆为判定规则和报告模板：规则进 `references/rules/`，模板进 `references/templates/`，原文归档。
10. 旧 JSON Schema 归档，当前使用 Markdown 结构化输出规则。
11. 目标项目入口补充片段由 `references/templates/project/hicode-entry-section.md` 承载；完整 `AGENTS.md` 或 `CLAUDE.md` 入口主体优先由目标 Coding 平台 `/init` 生成。
12. `hicode:init` 只初始化目标项目入口、上下文和项目规则文档，不复制 hicode plugin 资产到目标项目 `.hicode/`。
13. `.claude-plugin/plugin.json` 和 `install.sh` 不得把本仓库 `docs/`、历史文档或 `archive/` 安装为目标 Coding Agent 运行资产。
14. V3 按工作包推进，工作包完成后先标记为 `待验收`，项目负责人确认后才能进入下一包。

## 3. 范围边界

### 3.1 本轮范围内

1. 更新本仓库入口规则、术语上下文、进度台账和 V3 实施计划。
2. 重组 `references/` 为 `rules/`、`templates/`、`hooks/`。
3. 建立根目录 `archive/` 并归档历史资产。
4. 将旧 Prompt、Gate、Schema、Example、Guide、manifest/profile 中仍有效内容拆解到当前资产。
5. 重写 6 个根目录 Skill，使其成为直接执行型说明。
6. 更新 8 个 Agent 的旧路径引用，保持短角色入口。
7. 检查 `.claude-plugin/plugin.json` 和 `install.sh` 的安装边界。
8. 做路径、一致性、归档依赖和安全红线验收。

### 3.2 本轮范围外

1. 不实现保险核心系统或试点业务系统代码。
2. 不操作生产环境、生产配置、生产数据或生产日志。
3. 不自动合并、发布、回滚或修改生产配置。
4. 不恢复 `.hicode/` 资产固化、manifest/profile 或 `DAILY/LIBRARY` 选择性初始化机制。
5. 不新增自动化 CI/CD、发布平台、指标看板或真实 Hook 执行器。
6. 不把根目录 `docs/` 安装到目标 Coding Agent 作为运行上下文。

## 4. 工作包规则

V3 工作包编号使用 `V3-P<阶段号>-WP<序号>`。

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
| V3-P1 | 规划与入口规则 | 固化 V3 决策、计划和本仓库入口规则 | `docs/V3_IMPLEMENTATION_PLAN.md`、`AGENTS.md`、`docs/PROGRESS.md`、`CONTEXT.md`、ADR 0003 |
| V3-P2 | 目录结构与归档迁移 | 建立新目录骨架并归档历史资产 | `archive/`、`references/rules/`、`references/templates/`、`references/hooks/`、`references/README.md` |
| V3-P3 | 规则与模板重组 | 从旧资产中提炼当前规则和模板 | 场景 rules、项目模板、输出模板、Markdown 结构化输出规则 |
| V3-P4 | Skill 直接执行化 | 重写 6 个根目录 Skill，移除旧引用链路 | `skills/hi`、`init`、`scope`、`tdd`、`review`、`release` |
| V3-P5 | Agent 与 Hook 边界修正 | 修正 Agent 旧路径引用并收敛 Hook 说明 | 8 个 Agent、`references/hooks/` |
| V3-P6 | 安装边界与一致性验收 | 验证当前资产不依赖归档和旧目录 | 检查报告、路径检查、安装边界检查、进度收口 |

## 6. V3-P1 规划与入口规则

### V3-P1-WP1 V3 实施计划与入口规则

目标：建立 V3 简化重构执行基准，并同步本仓库入口规则和进度台账。

输入：

1. `AGENTS.md`
2. `CONTEXT.md`
3. `docs/PROGRESS.md`
4. `docs/adr/0003-simplify-hicode-reference-assets-and-direct-skills.md`
5. 本轮 grill-with-docs 已确认决策

输出：

1. `docs/V3_IMPLEMENTATION_PLAN.md`
2. 更新后的 `AGENTS.md`
3. 更新后的 `docs/PROGRESS.md`
4. 已整理 V3 术语边界的 `CONTEXT.md`
5. `docs/adr/0003-simplify-hicode-reference-assets-and-direct-skills.md`

依赖：项目负责人确认启动 V3。

验收标准：

1. V3 计划明确当前资产边界、范围内外、阶段、工作包和验收口径。
2. `AGENTS.md` 的默认读取顺序和目录边界不再把 V1 计划或旧 `references/` 子目录作为当前执行基准。
3. `docs/PROGRESS.md` 当前状态更新为 V3，并记录本工作包为 `待验收`。
4. `CONTEXT.md` 已记录 V3 已确认术语边界。
5. 本工作包不移动 `references/` 文件，不创建归档迁移内容，不重写 6 个 Skill。

## 7. V3-P2 目录结构与归档迁移

### V3-P2-WP1 当前目录骨架与归档目录

目标：建立 V3 当前目录骨架和归档目录说明。

输入：

1. `docs/V3_IMPLEMENTATION_PLAN.md`
2. `CONTEXT.md`
3. `docs/adr/0003-simplify-hicode-reference-assets-and-direct-skills.md`

输出：

1. `archive/README.md`
2. `references/README.md`
3. `references/rules/README.md`
4. `references/templates/README.md`
5. `references/hooks/README.md` 的当前边界修正

依赖：V3-P1-WP1 已完成。

验收标准：

1. `references/README.md` 只说明 `rules/`、`templates/`、`hooks/` 三类当前目录。
2. `archive/README.md` 明确归档资产非运行、非安装、非默认检索。
3. 不新增 `prompts/`、`skills/`、`gates/`、`schemas/`、`examples/`、`init/` 或 `target-project/` 作为当前一级目录。

### V3-P2-WP2 历史资产归档迁移

目标：将不再作为当前目录的旧资产迁入 `archive/`，并保留可追溯路径说明。

输入：

1. V3-P2-WP1 目录骨架
2. 旧 `references/` 目录清单

输出：

1. `archive/references/` 下的历史资产归档
2. 更新后的 `docs/PROGRESS.md`

依赖：V3-P2-WP1 已完成。

验收标准：

1. 旧 `references/docs/`、`references/prompts/`、`references/skills/`、`references/gates/`、`references/schemas/`、`references/examples/`、`references/init/` 和 `references/target-project/` 不再作为当前一级目录存在。
2. 归档资产保留历史追溯价值，但当前入口、Skill、Agent、Rule、Template 和 Hook 不应新增对 `archive/` 的运行依赖。
3. 不在本工作包重写 6 个 Skill。

## 8. V3-P3 规则与模板重组

### V3-P3-WP1 共享规则与结构化输出规则

目标：提炼全场景共用的安全红线、风险分级、建议结论、权限边界和 Markdown 结构化输出规则。

输出：

1. `references/rules/shared/`
2. 必要的共享输出规则文档

验收标准：

1. 不保留当前 JSON Schema。
2. 共享规则短小，不成为长篇指南集合。
3. 覆盖金融核心系统高风险基线。

### V3-P3-WP2 场景规则与模板

目标：按场景建立 `init`、`scope`、`tdd`、`review`、`release` 规则和输出模板。

输出：

1. `references/rules/init/`
2. `references/rules/scope/`
3. `references/rules/tdd/`
4. `references/rules/review/`
5. `references/rules/release/`
6. `references/templates/project/`
7. `references/templates/scope/`
8. `references/templates/tdd/`
9. `references/templates/review/`
10. `references/templates/release/`

验收标准：

1. Prompt、Gate、Guide 和项目规则文档中仍有效的内容已拆解进入规则或模板。
2. 模板只保存可填写骨架，不承载执行规则全文。
3. 目标项目入口补充片段使用平台无关模板，供 `hicode:init` 补充到目标项目 `AGENTS.md` 或 `CLAUDE.md`。

### 当前收敛形态说明

V3 后续维护已将上述 P3 中间目录进一步收敛：

1. 当前稳定规则 interface 为 `references/rules/coding_rules.md`，不再维护 `references/rules/shared/`、`init/`、`scope/`、`tdd/`、`review/` 或 `release/` 作为当前规则目录。
2. 当前模板目录按文档生命周期收敛为 `references/templates/project/` 和 `references/templates/feature/`，不再维护 `references/templates/scope/`、`tdd/`、`review/` 或 `release/` 作为当前目录。
3. `references/templates/README.md` 维护单需求文档生命周期规则，`scope`、`tdd`、`review` 和 `release` Skill 按需引用，不在各 Skill 中复制完整写入规则。
4. 本节保留 P3 原工作包描述作为历史执行计划；当前新资产必须以 `AGENTS.md`、`CONTEXT.md`、`references/README.md` 和实际文件结构为准。

## 9. V3-P4 Skill 直接执行化

### V3-P4-WP1 `hi` 与 `init` Skill 重写

目标：重写总入口和初始化入口，移除 `.hicode` 固化、manifest/profile 和默认加载项目模板的旧口径。

输出：

1. `skills/hi/SKILL.md`
2. `skills/init/SKILL.md`

验收标准：

1. `hi` 只做诊断、路由和安全边界说明，不默认读取全部规则。
2. `init` 只在用户确认写入范围后读取项目模板并生成目标项目入口、上下文和项目规则文档。
3. 两个 Skill 不引用归档资产。

### V3-P4-WP2 `scope` 与 `tdd` Skill 重写

目标：重写需求范围和 TDD/辅助编码入口，使其直接包含执行流程、准入、停止条件和输出要求。

输出：

1. `skills/scope/SKILL.md`
2. `skills/tdd/SKILL.md`

验收标准：

1. Skill 不再引用旧 `references/skills` 或旧 Prompt。
2. 能按需读取对应场景规则和模板。
3. 保留保险/金融核心系统风险标准、测试先行和受限命令边界。

### V3-P4-WP3 `review` 与 `release` Skill 重写

目标：重写 Review 和发布入口，整合代码审查、提交检查、专项审查、核心场景测试、发布检查和回滚风险。

输出：

1. `skills/review/SKILL.md`
2. `skills/release/SKILL.md`

验收标准：

1. Skill 不再引用旧 Gate、Prompt、Schema 或 Example。
2. 输出保持建议性质，不给最终合并或发布审批。
3. 生产操作、生产配置、生产数据和未脱敏客户信息仍为硬性禁止。

## 10. V3-P5 Agent 与 Hook 边界修正

### V3-P5-WP1 Agent 旧路径引用修正

目标：更新 8 个 Agent 的旧路径引用，保持短角色入口。

输出：

1. `agents/*.md`
2. `agents/README.md`
3. `agents/_template.md`

验收标准：

1. Agent 不引用归档 Prompt、Gate、Schema、Guide 或旧 Skill。
2. Agent 只按需引用相关场景规则。
3. Agent 不膨胀为长规则文档。

### V3-P5-WP2 Hook 当前说明收敛

目标：将 Hook 目录收敛为当前有效 Hook 行为说明，不依赖旧 manifest。

输出：

1. `references/hooks/`

验收标准：

1. Hook 不由安装器自动启用。
2. Hook 不连接生产环境、不自动发布、不自动回滚、不修改生产配置。
3. 编码准入、合并门禁和上下文捕获边界清晰。

## 11. V3-P6 安装边界与一致性验收

### V3-P6-WP1 安装边界检查

目标：确认 Claude Code plugin 只暴露必要可调用入口，不安装本仓库管理文档或归档资产。

输出：

1. `.claude-plugin/plugin.json` 检查或修正
2. `install.sh` 检查或修正
3. 安装边界检查记录

验收标准：

1. `plugin.json` 不把根目录 `docs/`、`archive/` 或历史 `references` 目录声明为默认运行资产。
2. `install.sh` 不复制 `.hicode/`、不初始化目标项目、不扫描代码、不安装本仓库 `docs/`。

### V3-P6-WP2 路径与一致性验收

目标：检查当前资产路径、旧目录引用、归档依赖和安全红线一致性。

输出：

1. 路径检查记录
2. 归档依赖检查记录
3. V3 收口更新后的 `docs/PROGRESS.md`

验收标准：

1. 当前 `skills/`、`agents/`、`references/rules/`、`references/templates/`、`references/hooks/` 不引用 `archive/` 作为执行依据。
2. 当前资产不引用旧 `references/prompts/`、`references/skills/`、`references/gates/`、`references/schemas/`、`references/examples/`、`references/init/` 或 `references/target-project/`。
3. 金融核心系统风险标准、安全红线、人工审批边界和生产禁止事项仍然保留。
