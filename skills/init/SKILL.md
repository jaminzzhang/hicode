---
description: Use when a target backend application needs guided hicode initialization: use native /init for AGENTS.md or CLAUDE.md, add the hicode entry section, create project rules under docs/rules, assess codebase complexity, and optionally scan complex projects with graphify after user confirmation.
---

# hicode init

## 定位

`hicode:init` 是目标项目初始化入口。它只在用户明确要求初始化、补齐 Coding Agent 入口、初始化规则或梳理代码结构时使用。

初始化采用引导式流程。凡是目标目录、平台入口、规则适用性、写入范围、代码扫描范围或工具安装存在不确定时，一次只问用户一个问题；用户回答后再进入下一步。

## 必读规则

执行前按需读取当前规则目录：

1. `../../references/rules/`
2. `../../references/rules/coding_rules.md`
3. `../../references/templates/project/hicode-entry-section.md`
4. `../../references/templates/project/DOMAIN_KNOWLEDGE.md`
5. `../../references/templates/project/PROJ_CONTEXT.md`
6. `../../references/templates/project/ADR-template.md`

不得把 hicode plugin 内置 Skill、Agent、Rule、Template 或 Hook 复制到目标项目本地运行目录。

## 执行流程

### 1. 确认目标项目和入口类型

1. 确认目标项目根目录，避免把 hicode plugin 仓库当成目标项目。
2. 判断当前平台入口：
   - Codex、OpenCode 和其他使用 AGENTS 约定的平台使用 `AGENTS.md`。
   - Claude Code 使用 `CLAUDE.md`。
   - 无法判断时先问用户一个问题确认目标入口文件。
3. 检查目标项目是否已有对应入口文件。

### 2. 初始化 `AGENTS.md` 或 `CLAUDE.md`

1. 如果对应入口文件不存在，调用当前 Agent 平台的 `/init` 命令生成入口文件。
2. 如果当前平台不支持 `/init`，方可自行生成最小入口文件；最小入口只能包含当前平台入口标题、项目待确认占位和 hicode 补充片段引用内容。
3. 自行生成入口文件时，必须说明 `/init` 不可用的原因，并在写入前确认目标入口类型和写入范围。
4. 如果入口文件已存在，只在后续规则初始化完成后，基于 `hicode-entry-section.md` 补充 hicode section；不得覆盖用户已有内容。
5. `CLAUDE.md` 与 `AGENTS.md` 同时存在时，只处理当前平台入口；是否同步另一个入口必须单独询问用户。

### 3. 初始化 rules

1. 根据当前项目类型、技术栈和风险特征，参考 `references/rules/` 下当前有效规则，判断哪些规则适用于目标项目。
2. 在目标项目 `docs/rules/` 目录下生成对应 rules 文件。
3. 对适用且可直接复用的规则，可以直接从 `references/rules/` 拷贝到 `docs/rules/`。
4. 对只部分适用的规则，应生成项目版规则文件，保留适用条款，并用 `待确认` 标注需要项目负责人确认的差异。
5. 生成或更新规则后，在已有的 `CLAUDE.md` 或 `AGENTS.md` 中补充或更新 hicode section，至少包含：
   - `docs/rules/` 是目标项目规则目录。
   - 编码、测试生成、代码审查和提交检查必须按任务读取适用 rules。
   - 项目 rules 只能补充或加严 hicode 内置规则，不能放宽安全、合规、审计、幂等、事务、状态流转、异常防御和测试要求。
6. 已有 `docs/rules/` 文件优先保留。发现冲突时列出冲突点，未获用户确认前不得覆盖。

### 4. 初始化项目级文档目录

入口文件创建或补充后，检查目标项目级文档目录：

1. `docs/DOMAIN_KNOWLEDGE.md`
2. `docs/PROJ_CONTEXT.md`
3. `docs/adr/`
4. `docs/rules/`

处理规则：

1. 目标文档不存在时，先读取 `../../references/templates/project/` 下对应模板，再按需创建文档。
2. `docs/DOMAIN_KNOWLEDGE.md` 和 `docs/PROJ_CONTEXT.md` 只写已确认事实；未确认内容必须保留为 `待确认` 或输出更新建议。
3. `docs/adr/` 只创建目录，不凭空创建 ADR；只有存在难逆、意外且有真实取舍的决策时，才基于 `ADR-template.md` 生成 ADR 草稿。
4. 创建或确认这些路径后，必须在 `CLAUDE.md` 或 `AGENTS.md` 的 hicode section 中说明项目级共享文档路径和单需求文档路径：
   - 项目级：`docs/DOMAIN_KNOWLEDGE.md`、`docs/PROJ_CONTEXT.md`、`docs/adr/`、`docs/rules/`
   - 单需求：`docs/features/<feature-id>/feature_context.md` 及同目录下的评审、Scope、TDD、Review、Release 报告。
5. 已有文档优先保留。发现目标入口文档中的路径说明与实际目录冲突时，列出冲突并等待用户确认。

### 5. 判断是否需要扫描代码

规则初始化完成后，先用只读方式判断当前项目复杂度，再决定是否建议使用 graphify 扫描。

轻量复杂度判断只允许读取目录结构、构建文件、模块清单和入口文件名，不读取敏感配置、生产数据或未脱敏日志。

复杂度较高时才需要建议使用 graphify。高复杂度信号包括：

1. 多模块、多服务或 monorepo 结构。
2. 多语言、多构建系统或多套运行入口。
3. 依赖关系复杂，存在较多跨模块调用、消息消费、定时任务、批处理或外部系统适配。
4. 代码入口分散，无法通过目录结构和构建文件快速判断模块边界。
5. 用户明确表示项目规模大、历史久、模块关系不清或需要代码图谱辅助定位。

复杂度不高时：

1. 不默认使用 graphify。
2. 输出轻量结构判断依据。
3. 只建议在后续定位困难时再补充 graphify 扫描。

复杂度较高时，询问用户是否需要使用 graphify 扫描代码以梳理代码结构。一次只问这一个问题。

用户同意后：

1. 启动子 Agent 执行代码结构扫描任务。
2. 子 Agent 使用 graphify 工具扫描代码结构；graphify 项目地址为 `https://github.com/safishamsi/graphify`。
3. 扫描前必须确认扫描范围和排除路径。
4. 不扫描 `.env*`、密钥、生产配置、未脱敏数据、构建产物、依赖目录或日志目录。
5. graphify 结果只能作为代码结构证据、推断和待确认项，不得写成已确认业务规则。
6. 扫描完成后，必须确认 graphify 结果文件路径。
7. 在目标项目入口文件 `CLAUDE.md` 或 `AGENTS.md` 中补充 graphify 结果文件引用，说明 Agent 查找代码结构、模块关系或调用链时应优先参考该结果文件。
8. 只写入实际存在的结果文件路径；路径不明确时先向用户确认，不得编造。

用户不同意时：

1. 不启动子 Agent。
2. 不调用 graphify。
3. 输出未扫描原因和后续可执行命令建议。

graphify 不可用时：

1. 不自行联网安装。
2. 一次只问用户一个问题，确认是否允许安装或改用轻量只读目录梳理。

### 6. 停止条件

命中以下情况时停止写入，输出风险和待确认问题：

1. 目标目录不明确。
2. 当前平台入口文件类型不明确且用户未确认。
3. 用户未确认写入 `docs/rules/` 或入口文件补充范围。
4. 已有文件存在冲突且未获确认。
5. 输入或文件包含密钥、生产配置、未脱敏客户信息或未脱敏生产数据。
6. graphify 结果文件路径不明确且需要写入入口文件。
7. 用户要求复制 plugin 内置能力到目标项目本地运行目录、自动发布、自动合并、自动回滚或操作生产环境。
8. 用户未确认创建项目级文档目录或入口文档路径说明。

## 输出要求

初始化输出必须包含：

1. 初始化结论：完成 / 部分完成 / 仅计划 / 阻塞 / 待确认。
2. 目标项目根目录和入口文件判断。
3. `/init` 是否执行；未执行时说明原因。
4. `docs/rules/` 创建、补充、跳过和需确认的文件清单。
5. 项目级文档目录创建、补充、跳过和需确认的文件清单。
6. 入口文件中的 hicode section 补充内容摘要，包括项目级文档路径和单需求文档路径说明。
7. 已读 hicode rules 和 templates。
8. 入口文件补充内容摘要。
9. 项目复杂度判断：低 / 中 / 高 / 待确认，并说明依据。
10. 代码扫描状态：未建议 / 用户拒绝 / 待确认 / graphify 执行中 / graphify 已完成 / 阻塞。
11. graphify 结果文件路径及入口文件引用状态：不适用 / 待确认 / 已引用 / 阻塞。
12. 事实、推断和待确认分层。
13. 风险等级。
14. 建议动作。
15. 待确认问题；如需要继续提问，一次只列一个问题。

不得输出最终审批、准许合并、准许发布或可以上线。
