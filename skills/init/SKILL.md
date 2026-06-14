---
description: 初始化目标后端项目的 hicode 使用入口，优先使用 Agent 可执行初始化能力生成 AGENTS.md 或 CLAUDE.md；OpenCode TUI /init 需用户手工执行，Agent 不能代替调用。随后补充 hicode section、项目规则、上下文文档，并按需建议 graphify 代码结构扫描。Use when 用户要求初始化 hicode、补齐 AGENTS.md/CLAUDE.md、创建 docs/rules、建立项目上下文，或准备目标项目进入 hicode 工作流。
---

# hicode init

## 定位

`hicode:init` 是目标项目初始化入口，只在用户明确要求初始化、补齐 Coding Agent 入口、初始化项目规则、建立项目上下文或梳理代码结构时使用。

初始化目标是让目标项目具备 hicode 可用的最小上下文：

1. 目标项目根目录明确。
2. 当前 Coding 平台入口文件存在，例如 `AGENTS.md` 或 `CLAUDE.md`。
3. 入口文件包含 hicode section，能指向项目文档、规则目录和 hicode Skill 路由。
4. `docs/rules/`、`docs/DOMAIN_KNOWLEDGE.md`、`docs/PROJ_CONTEXT.md`、`docs/adr/` 等项目级文档路径明确。
5. 复杂项目在用户确认后可生成或引用 graphify 代码结构结果。

本 Skill 不安装 hicode plugin，不复制 plugin 内置 Skill、Agent、Rule、Template 或 Hook 到目标项目本地运行目录，不创建 `.hicode/`，不扫描生产数据，不操作生产环境。

## 必读材料

按当前步骤读取必要材料，不默认全量读取：

1. `coding_rules.md`
2. `hicode-entry-section.md`
3. `DOMAIN_KNOWLEDGE.md`
4. `PROJ_CONTEXT.md`
5. `ADR-template.md`

目标项目中已有的 `AGENTS.md`、`CLAUDE.md`、`docs/rules/`、`docs/DOMAIN_KNOWLEDGE.md`、`docs/PROJ_CONTEXT.md` 和 `docs/adr/` 必须优先保留。发现冲突时先列出冲突，不得直接覆盖。

## 快速示例

用户说：“在这个业务仓库初始化 hicode。”

执行顺序：

1. 确认当前目录是否是目标业务仓库，而不是 hicode plugin 仓库。
2. 判断当前平台应使用 `AGENTS.md` 还是 `CLAUDE.md`。
3. 若入口缺失，优先使用 Agent 可执行初始化能力；若当前只有用户手工 TUI `/init`，说明不能代替执行，并推荐在用户确认后生成最小入口。
4. 将 `hicode-entry-section.md` 中的 hicode section 补充到入口文件。
5. 创建或更新 `docs/rules/` 和项目级上下文文档。
6. 判断是否需要 graphify；只有复杂项目且用户同意时才扫描。
7. 输出初始化结论、写入清单、未执行原因、风险和下一步问题。

## 执行流程

### 1. 确认目标项目与入口类型

先确认目标项目根目录，避免把 hicode plugin 仓库当成业务项目初始化。

入口类型按平台判断：

| 平台 | 入口文件 |
|---|---|
| Codex、OpenCode、其他 AGENTS 约定平台 | `AGENTS.md` |
| Claude Code | `CLAUDE.md` |

如果平台或目标目录不明确，只问一个问题并停止推进。

如果 `AGENTS.md` 和 `CLAUDE.md` 同时存在，只处理当前平台入口；是否同步另一个入口必须单独询问用户。

### 2. 初始化或补充入口文件

入口文件缺失时：

1. 优先使用当前 Agent 可执行初始化能力生成入口主体，例如平台暴露给 Agent 的初始化工具、CLI 或等价能力。
2. 如果当前平台只有用户手工 TUI `/init`，例如 OpenCode，则不得声称已执行 `/init`；应说明用户可在终端手工输入 `/init` 后再继续，并把“确认后由 hicode 生成最小入口文件”作为推荐继续路径。
3. 如果没有 Agent 可执行初始化能力，只能在用户确认后生成最小入口文件；必须说明该文件不是平台原生 `/init` 的项目分析结果。
4. 最小入口文件只能包含标题、项目占位信息和 hicode section，不得手写一份完整平台入口来替代平台原生初始化。

入口文件已存在时：

1. 保留用户已有内容和平台生成内容。
2. 基于 `hicode-entry-section.md` 补充或刷新 hicode section。
3. hicode section 应说明项目文档路径、`docs/rules/`、单需求目录和推荐 hicode Skill。

### 3. 初始化项目规则

根据目标项目类型、技术栈和风险特征判断适用规则。

处理规则：

1. 在目标项目 `docs/rules/` 下创建或更新项目规则。
2. 适用且无需改写的规则可以从 `coding_rules.md` 复制。
3. 只部分适用的规则应生成项目版，并用 `待确认` 标注差异。
4. 项目规则只能补充或加严 hicode 内置规则，不能放宽安全、合规、审计、幂等、事务、状态流转、异常防御、测试和回滚要求。
5. 已有 `docs/rules/` 文件优先保留；冲突未确认前不得覆盖。

### 4. 初始化项目级文档

检查并按需创建：

1. `docs/DOMAIN_KNOWLEDGE.md`
2. `docs/PROJ_CONTEXT.md`
3. `docs/adr/`
4. `docs/rules/`

创建规则：

1. 缺少 `DOMAIN_KNOWLEDGE.md` 时，先读取模板，再写入已确认领域术语、业务域和可复用规则；未知内容写 `待确认`。
2. 缺少 `PROJ_CONTEXT.md` 时，先读取模板，再写入已确认项目定位、模块结构、核心流程、接口依赖和历史风险；未知内容写 `待确认`。
3. `docs/adr/` 可以只创建目录。只有存在难逆、意外且有真实取舍的决策时，才基于 `ADR-template.md` 生成 ADR 草稿。
4. 单需求文档目录统一使用 `docs/features/<feature-id>/`，入口 hicode section 应指向该路径。

不得把推断写成事实。上下文正式沉淀需要负责人确认。

### 5. 判断是否需要 graphify

规则和项目文档处理完成后，再判断是否建议代码结构扫描。

先用只读、低风险信号判断复杂度：

1. 目录结构。
2. 构建文件。
3. 模块名称。
4. 服务入口或批处理入口文件名。

不得读取 `.env*`、密钥、生产配置、生产凭证、未脱敏客户信息、未脱敏生产数据、生产日志、构建产物、依赖目录或日志目录。

只有命中以下复杂度信号时，才建议 graphify：

1. 多模块、多服务或 monorepo。
2. 多语言或多构建系统。
3. 入口分散，模块边界不清。
4. 存在较多消息、批处理、定时任务或外部系统适配。
5. 用户明确表示项目历史久、规模大或调用关系难以理解。

如果用户同意：

1. 确认扫描范围和排除路径。
2. 委托 graphify 执行代码结构扫描。
3. graphify 结果只能作为结构证据、推断和待确认项。
4. 记录实际结果文件路径，并在入口 hicode section 中补充引用。

如果 graphify 不可用，不自行联网安装；一次只问用户是否允许安装或改用轻量目录梳理。

## 停止条件

命中以下情况时停止，输出 `待确认` 或 `阻塞`：

1. 目标项目根目录不明确。
2. 当前平台入口类型不明确。
3. 用户未确认写入入口文件、`docs/rules/` 或项目级文档。
4. 已有文件与拟写内容冲突且未获确认。
5. 输入或文件包含密钥、生产配置、生产凭证、未脱敏客户信息或未脱敏生产数据。
6. graphify 扫描范围、排除路径或结果文件路径不明确。
7. 用户要求复制 hicode plugin 内置运行资产到目标项目、创建 `.hicode/`、连接生产、发布、回滚、合并、推送或修改生产配置。

## 输出要求

默认输出 Markdown，包含：

1. 初始化结论：`完成` / `部分完成` / `仅计划` / `阻塞` / `待确认`
2. 目标项目根目录、平台和入口文件。
3. Agent 可执行初始化能力状态；若未执行 `/init`，说明它是用户手工 TUI 命令、平台不支持或用户未确认。
4. hicode section 创建、更新或跳过情况。
5. `docs/rules/` 创建、更新、跳过和冲突清单。
6. `DOMAIN_KNOWLEDGE.md`、`PROJ_CONTEXT.md`、`docs/adr/` 处理清单。
7. 已读取的 hicode 规则和模板。
8. 项目复杂度判断：低 / 中 / 高 / 待确认。
9. graphify 状态：不建议 / 待确认 / 已执行 / 跳过 / 阻塞。
10. 事实、推断和待确认分层。
11. 风险等级、建议动作和受限操作未执行原因。
12. 如需继续，只问一个问题。

不得输出最终审批、合并许可、发布许可、生产命令或生产验证结果。
