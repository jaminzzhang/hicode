---
description: Use when a target backend application needs guided hicode initialization: use native /init for CLAUDE.md or AGENTS.md, create project rules under docs/rules, and optionally scan code with graphify after user confirmation.
---

# hicode init

## 定位

`hicode:init` 是目标项目初始化入口。它只在用户明确要求初始化、补齐 Coding Agent 入口、初始化规则或梳理代码结构时使用。

初始化采用引导式流程。凡是目标目录、平台入口、规则适用性、写入范围、代码扫描范围或工具安装存在不确定时，一次只问用户一个问题；用户回答后再进入下一步。

## 必读规则

执行前按需读取当前规则目录：

1. `../../references/rules/`
2. `../../references/rules/coding_rules.md`

不得读取归档资产作为当前初始化依据。不得把 hicode plugin 内置 Skill、Agent、Rule、Template 或 Hook 复制到目标项目本地运行目录。

## 执行流程

### 1. 确认目标项目和入口类型

1. 确认目标项目根目录，避免把 hicode plugin 仓库当成目标项目。
2. 判断当前平台入口：
   - Claude Code 使用 `CLAUDE.md`。
   - Codex、OpenCode 和其他使用 AGENTS 约定的平台使用 `AGENTS.md`。
   - 无法判断时先问用户一个问题确认目标入口文件。
3. 检查目标项目是否已有对应入口文件。

### 2. 初始化 `CLAUDE.md` 或 `AGENTS.md`

1. 如果对应入口文件不存在，调用当前 Agent 平台的 `/init` 命令生成入口文件。
2. 如果当前平台不支持 `/init`，方可自行生成 `CLAUDE.md` 或 `AGENTS.md`。
3. 如果入口文件已存在，只在后续规则初始化完成后，在已有文件基础上补充 hicode rules 信息；不得覆盖用户已有内容。
4. `CLAUDE.md` 与 `AGENTS.md` 同时存在时，只处理当前平台入口；是否同步另一个入口必须单独询问用户。

### 3. 初始化 rules

1. 根据当前项目类型、技术栈和风险特征，参考 `references/rules/` 下当前有效规则，判断哪些规则适用于目标项目。
2. 在目标项目 `docs/rules/` 目录下生成对应 rules 文件。
3. 对适用且可直接复用的规则，可以直接从 `references/rules/` 拷贝到 `docs/rules/`。
4. 对只部分适用的规则，应生成项目版规则文件，保留适用条款，并用 `待确认` 标注需要项目负责人确认的差异。
5. 生成或更新规则后，在已有的 `CLAUDE.md` 或 `AGENTS.md` 中补充 rules 信息，至少包含：
   - `docs/rules/` 是目标项目规则目录。
   - 编码、测试生成、代码审查和提交检查必须按任务读取适用 rules。
   - 项目 rules 只能补充或加严 hicode 内置规则，不能放宽安全、合规、审计、幂等、事务、状态流转、异常防御和测试要求。
6. 已有 `docs/rules/` 文件优先保留。发现冲突时列出冲突点，未获用户确认前不得覆盖。

### 4. 询问是否扫描代码

规则初始化完成后，询问用户是否需要扫描代码以梳理代码结构。一次只问这一个问题。

用户同意后：

1. 启动子 Agent 执行代码结构扫描任务。
2. 子 Agent 使用 graphify 工具扫描代码结构；graphify 项目地址为 `https://github.com/safishamsi/graphify`。
3. 扫描前必须确认扫描范围和排除路径。
4. 不扫描 `.env*`、密钥、生产配置、未脱敏数据、构建产物、依赖目录或日志目录。
5. graphify 结果只能作为代码结构证据、推断和待确认项，不得写成已确认业务规则。

用户不同意时：

1. 不启动子 Agent。
2. 不调用 graphify。
3. 输出未扫描原因和后续可执行命令建议。

graphify 不可用时：

1. 不自行联网安装。
2. 一次只问用户一个问题，确认是否允许安装或改用轻量只读目录梳理。

### 5. 停止条件

命中以下情况时停止写入，输出风险和待确认问题：

1. 目标目录不明确。
2. 当前平台入口文件类型不明确且用户未确认。
3. 用户未确认写入 `docs/rules/` 或入口文件补充范围。
4. 已有文件存在冲突且未获确认。
5. 输入或文件包含密钥、生产配置、未脱敏客户信息或未脱敏生产数据。
6. 用户要求复制 plugin 内置能力到目标项目本地运行目录、自动发布、自动合并、自动回滚或操作生产环境。

## 输出要求

初始化输出必须包含：

1. 初始化结论：完成 / 部分完成 / 仅计划 / 阻塞 / 待确认。
2. 目标项目根目录和入口文件判断。
3. `/init` 是否执行；未执行时说明原因。
4. `docs/rules/` 创建、补充、跳过和需确认的文件清单。
5. 已读 hicode rules。
6. 入口文件补充内容摘要。
7. 代码扫描状态：未询问 / 用户拒绝 / 待确认 / graphify 执行中 / graphify 已完成 / 阻塞。
8. 事实、推断和待确认分层。
9. 风险等级。
10. 建议动作。
11. 待确认问题；如需要继续提问，一次只列一个问题。

不得输出最终审批、准许合并、准许发布或可以上线。
