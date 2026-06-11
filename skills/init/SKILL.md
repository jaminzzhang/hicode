---
description: Use when a target project needs hicode initialization: create or update CLAUDE.md or AGENTS.md, install project context and RULES docs, and derive PROJ_CONTEXT.md from an existing codebase.
---

# hicode init

## 定位

本 Skill 是 hicode 的目标项目初始化入口。仅在用户明确要求初始化项目、补齐 hicode 上下文或创建 Coding Agent 入口时使用。

初始化目标是让目标项目具备可持续使用 hicode plugin 的入口文件、项目上下文和规则文档。hicode plugin 已内置 Agent、Prompt、Skill、Gate 和 Schema 能力；默认不把这些能力资产复制到目标项目 `.hicode/`。

## 必读引用

按需读取：

1. `../../references/target-project/AGENTS.md`
2. `../../references/docs/PROJ_CONTEXT.md`
3. `../../references/docs/DOMAIN_KNOWLEDGE.md`
4. `../../references/docs/CODING_RULES.md`
5. `../../references/docs/TESTING_GUIDE.md`
6. `../../references/docs/REVIEW_RULES.md`
7. `../../references/docs/RELEASE_GUIDE.md`
8. `../../references/docs/DEFECT_CASES.md`
9. `../../references/docs/LARGE_CODEBASE_AGENT_GUIDE.md`
10. `../../docs/references/How Claude Code works in large codebases Best practices and where to start.md`
11. `../../references/init/README.md`
12. `../../references/init/manifests/docs.json`

## 初始化原则

1. 先判断目标项目根目录，不要把 hicode plugin 仓库误当成目标项目。
2. 先读已有入口和文档，再决定补充内容；已有项目规则优先于 hicode 模板。
3. 默认不覆盖文件；只新增缺失文件、补充缺失章节或输出冲突让用户确认。
4. 默认不创建 `.hicode/`，不复制 plugin 内置的 Agent、Prompt、Skill、Gate 或 Schema。
5. 只有用户明确要求离线固化、本地锁版本或项目内自定义 hicode 能力时，才可按 `references/init/` manifest 规划创建 `.hicode/` 快照。
6. 初始化中发现密钥、生产凭证、生产配置、未脱敏客户信息或未脱敏生产数据时，停止读取相关内容并转人工安全流程。

## 执行流程

### 1. 确认目标项目与平台

1. 确认当前工作目录是否为目标项目根目录。
2. 识别当前 Coding Agent 平台：
   - Claude Code：入口文件使用 `CLAUDE.md`。
   - OpenCode、Codex 或其他 Coding Agent：入口文件使用 `AGENTS.md`。
3. 若平台无法确认，优先使用 `AGENTS.md`，并在输出中说明判断依据。
4. 检查 `CLAUDE.md` 和 `AGENTS.md` 是否存在。

### 2. 创建或补充入口文件

1. 若目标入口文件不存在，基于 `../../references/target-project/AGENTS.md` 的结构创建对应入口：
   - Claude Code 场景写入 `CLAUDE.md`。
   - 其他 Coding Agent 场景写入 `AGENTS.md`。
2. 若目标入口文件已存在，先读取内容，保留原有规则，只补充缺失的 hicode 内容：
   - hicode plugin 能力入口。
   - 项目上下文索引。
   - RULES 文档索引。
   - graphify / 大型代码库导航说明。
   - 安全边界和输出规范。
3. 若 `CLAUDE.md` 与 `AGENTS.md` 同时存在，读取当前平台对应文件，并检查另一个文件是否有冲突规则；发现冲突时列出冲突点，不自动合并。

### 3. 初始化项目文档

按目标项目证据自动选择需要的文档，不要求用户选择 profile。

默认创建或补充：

1. `docs/PROJ_CONTEXT.md`
2. `docs/DOMAIN_KNOWLEDGE.md`
3. `docs/CODING_RULES.md`
4. `docs/TESTING_GUIDE.md`
5. `docs/REVIEW_RULES.md`
6. `docs/RELEASE_GUIDE.md`
7. `docs/DEFECT_CASES.md`
8. `docs/LARGE_CODEBASE_AGENT_GUIDE.md`

Java、SQL、安全或保险核心业务证据明确时，补充：

1. `docs/review-rules/java.md`
2. `docs/review-rules/sql.md`
3. `docs/review-rules/security.md`
4. `docs/review-rules/insurance-domain.md`

文档来源和目标路径以 `../../references/init/manifests/docs.json` 为准。

### 4. 已有代码库分析

若目标项目已有代码库，先做轻量检测：

1. 使用 `rg --files`、目录结构和构建文件识别技术栈、模块和入口。
2. 常见证据包括 `pom.xml`、`build.gradle`、`package.json`、`pyproject.toml`、`go.mod`、`src/`、`app/`、`lib/`、`cmd/`。
3. 默认排除 `.git/`、`.env*`、密钥文件、生产配置、依赖目录、构建产物、日志、大文件目录和未脱敏数据目录。

代码库证据明确时：

1. 检查 graphify 是否可用。
2. graphify 可用时，向用户确认扫描范围后再运行。
3. graphify 不可用时，询问用户是否安装 graphify。
4. 用户拒绝安装或无法安装时，降级为轻量结构分析。

参考 `../../docs/references/How Claude Code works in large codebases Best practices and where to start.md` 和 `../../references/docs/LARGE_CODEBASE_AGENT_GUIDE.md`，把代码结构证据写入 `docs/PROJ_CONTEXT.md`。

写入时必须区分：

1. 已确认事实。
2. 基于代码结构的推断。
3. 待确认架构信息。
4. 待补充的局部命令和验证方式。

不得把 graphify 或轻量分析结果写成已确认业务规则。

### 5. 覆盖与冲突处理

1. 文件不存在：可创建。
2. 文件存在且缺少 hicode 章节：可最小追加。
3. 文件存在且内容冲突：列出冲突点，等待用户确认。
4. 需要覆盖已有文件：必须二次确认，并列出文件清单。
5. `.hicode/` 已存在：默认不改；只报告现状和建议。

## 输出要求

初始化输出必须包含：

1. 结论：初始化完成、部分完成、阻塞或需确认。
2. 目标项目根目录和当前 Coding Agent 平台判断。
3. 创建、补充、跳过和需确认的文件清单。
4. 已读资产和依据。
5. 代码库分析方式：graphify、轻量分析或未执行原因。
6. `docs/PROJ_CONTEXT.md` 中新增内容的事实 / 推断 / 待确认分层。
7. 风险等级。
8. 建议动作。
9. 待确认问题。
10. 建议更新的 hicode 资产。

## 安全边界

不得读取或输出密钥、生产凭证、生产配置、未脱敏客户信息或未脱敏生产数据；不得自动合并、发布、回滚、修改生产配置或操作生产环境。

初始化不等于项目准入、合并准入或发布准入。不得输出“允许上线”“准许合并”“门禁通过”等最终审批结论。
