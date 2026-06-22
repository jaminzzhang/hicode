---
name: init
description: 初始化 hicode 目标项目入口、规则和上下文。Use when 用户要求初始化 hicode、补齐 AGENTS.md/CLAUDE.md hicode section、创建 docs/rules 或项目上下文，或 hi 路由到 hicode:init。
---

# hicode init

## 定位

`hicode:init` 只处理目标项目初始化：补齐 Coding Agent 入口、写入 hicode section、建立项目规则和项目级上下文。若项目复杂，可在用户同意后引导 graphify 生成代码结构证据。

完成条件：

1. 已确认目标项目根目录和入口文件类型。
2. `AGENTS.md` 或 `CLAUDE.md` 存在，并包含基于 `hicode-entry-section.md` 写入的 hicode section。
3. `docs/rules/`、`docs/DOMAIN_KNOWLEDGE.md`、`docs/PROJ_CONTEXT.md` 和 `docs/adr/` 已创建、已跳过或已列出冲突原因。
4. graphify 状态明确：不建议、待确认、已执行、跳过或阻塞。

本 Skill 不安装 hicode plugin，不复制内置 Skill、Agent、Rule、Template 或 Hook 到目标项目，不创建 `.hicode/`，不读取生产数据或敏感配置，不操作生产环境。

## 按需加载材料

只在步骤需要时读取材料：

1. 补入口时读取 `hicode-entry-section.md`。
2. 建规则时读取 `coding_rules.md`。
3. 创建缺失项目文档时读取 `DOMAIN_KNOWLEDGE.md`、`PROJ_CONTEXT.md` 或 `ADR-template.md`。

目标项目已有入口、规则和文档优先保留；覆盖、重写、删除或放宽规则前必须先停下并列出冲突。

## 工作流

### 1. 固定目标项目

确认当前目录是否为目标业务项目，而不是 hicode plugin 仓库。入口文件按平台选择：

| 平台 | 入口文件 |
|---|---|
| Codex、OpenCode、其他 AGENTS 约定平台 | `AGENTS.md` |
| Claude Code | `CLAUDE.md` |

完成条件：目标根目录、平台和入口文件已确认。若不明确，只问一个问题并停止。

### 2. 补齐入口

入口缺失时，优先使用当前 Agent 可执行初始化能力。若当前平台只有用户手工 TUI `/init`，说明不能代替执行，并推荐用户手工 `/init` 后继续；若用户确认由 hicode 生成最小入口，只写标题、项目占位信息和 hicode section。

入口已存在时，保留已有内容，只补充或刷新 hicode section。若 `AGENTS.md` 和 `CLAUDE.md` 同时存在，只处理当前平台入口；同步另一个入口需单独确认。

完成条件：入口文件包含 hicode section，或已记录缺失能力、用户未确认、文件冲突等阻塞原因。

### 3. 建立项目规则

在目标项目 `docs/rules/` 下创建或更新项目规则。适用且无需改写的规则可从 `coding_rules.md` 复制；部分适用的规则生成项目版并标注 `待确认`。

项目规则只能补充或加严 hicode 内置规则，不得放宽安全、合规、审计、幂等、事务、状态流转、异常防御、测试或回滚要求。已有规则冲突未确认前不得覆盖。

完成条件：`docs/rules/` 处理结果已列明为创建、更新、跳过或冲突。

### 4. 建立项目上下文

按需创建：

1. `docs/DOMAIN_KNOWLEDGE.md`
2. `docs/PROJ_CONTEXT.md`
3. `docs/adr/`
4. `docs/rules/`

写入规则：

1. 缺少项目文档时，读取对应模板，只写已确认事实；未知内容写 `待确认`。
2. `PROJ_CONTEXT.md` 可维护 Feature 索引；已有 `docs/features/<feature-id>/` 只有在用户确认可纳入交接上下文时，才写路径、状态和脱敏摘要。
3. `docs/adr/` 可只创建目录。只有存在难逆、意外且有真实取舍的决策时，才基于 `ADR-template.md` 生成 ADR 草稿。
4. 不得把推断写成事实；长期上下文正式沉淀需要负责人确认。

完成条件：项目级文档和目录已创建、已保留、已跳过或已列出冲突。

### 5. 判断 graphify

规则和项目文档处理完成后，再判断是否建议代码结构扫描。只用低风险只读信号：目录结构、构建文件、模块名称、服务入口或批处理入口文件名。

不得读取 `.env*`、密钥、生产配置、生产凭证、未脱敏客户信息、未脱敏生产数据、生产日志、构建产物、依赖目录或日志目录。

命中以下信号才建议 graphify：多模块、多服务、monorepo、多语言、多构建系统、入口分散、模块边界不清、存在较多消息/批处理/定时任务/外部系统适配，或用户明确表示项目历史久、规模大、调用关系难理解。

用户同意后，确认扫描范围和排除路径，再委托 graphify。结果只能作为结构证据、推断和待确认项；记录实际结果文件路径，并按需补充到入口 hicode section。graphify 不可用时，不自行联网安装；只问用户是否允许安装或改用轻量目录梳理。

完成条件：graphify 状态和原因已记录。

### 6. 输出结果

默认 Markdown，包含：

1. 初始化结论：`完成` / `部分完成` / `仅计划` / `阻塞` / `待确认`
2. 目标项目根目录、平台和入口文件。
3. Agent 可执行初始化能力状态；若未执行 `/init`，说明原因。
4. hicode section、`docs/rules/`、`DOMAIN_KNOWLEDGE.md`、`PROJ_CONTEXT.md`、`docs/adr/` 的处理清单。
5. 已读取的 hicode 规则和模板。
6. 项目复杂度和 graphify 状态。
7. 事实、推断、待确认问题、最高风险等级、建议动作和未执行原因。
8. 如需继续，只问一个问题。

不得输出最终审批、合并许可、发布许可、生产命令或生产验证结果。

## 停止条件

命中以下情况时停止，并输出 `待确认` 或 `阻塞`：

1. 目标项目根目录不明确。
2. 当前平台入口类型不明确。
3. 用户未确认写入缺失入口文件、`docs/rules/` 或项目级文档。
4. 已有文件与拟写内容冲突，且未获确认。
5. 输入或文件包含密钥、生产配置、生产凭证、未脱敏客户信息或未脱敏生产数据。
6. graphify 扫描范围、排除路径或结果文件路径不明确。
7. 用户要求复制 hicode plugin 内置运行资产到目标项目、创建 `.hicode/`、连接生产、发布、回滚、合并、推送或修改生产配置。
