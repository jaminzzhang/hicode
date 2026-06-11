---
description: Use when a target project needs hicode initialization: create or update CLAUDE.md or AGENTS.md, project context docs, and project rules with explicit write-scope confirmation.
---

# hicode init

## 定位

`hicode:init` 是目标项目初始化入口。它只在用户明确要求初始化、补齐 Coding Agent 入口或创建项目上下文时使用。

初始化目标是让目标项目具备可持续使用 hicode 的入口文件、项目上下文和项目规则文档。hicode 能力来自已安装 plugin，默认不复制 Skill、Agent、Rule、Template 或 Hook 到目标项目本地运行目录。

## 必读规则

执行前按需读取：

1. `../../references/rules/shared/safety-and-risk.md`
2. `../../references/rules/shared/permissions.md`
3. `../../references/rules/shared/output.md`
4. `../../references/rules/init/README.md`

生成文件时按需读取：

1. `../../references/templates/project/AGENTS.md`
2. `../../references/templates/project/CLAUDE.md`
3. `../../references/templates/project/PROJ_CONTEXT.md`
4. `../../references/templates/project/PRD_CONTEXT.md`
5. `../../references/templates/project/DOMAIN_KNOWLEDGE.md`
6. `../../references/templates/project/CODING_RULES.md`
7. `../../references/templates/project/TESTING_GUIDE.md`
8. `../../references/templates/project/REVIEW_RULES.md`
9. `../../references/templates/project/RELEASE_GUIDE.md`
10. `../../references/templates/project/DEFECT_CASES.md`
11. `../../references/templates/project/ADR-template.md`

不得读取归档资产作为当前初始化依据。

## 执行流程

### 1. 确认目标和写入范围

1. 确认目标项目根目录，避免把 hicode plugin 仓库当成目标项目。
2. 识别当前 Coding Agent 平台：
   - Claude Code 使用 `CLAUDE.md`。
   - Codex、OpenCode 和通用 Agent 使用 `AGENTS.md`。
   - 无法确认时优先使用 `AGENTS.md`，并说明判断依据。
3. 列出拟检查、创建或修改的文件。
4. 写入前必须获得用户确认；未确认时只输出初始化计划。

### 2. 检查现有入口和文档

检查目标项目是否已有：

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/PROJ_CONTEXT.md`
4. `docs/PRD_CONTEXT.md`
5. `docs/DOMAIN_KNOWLEDGE.md`
6. `docs/CODING_RULES.md`
7. `docs/TESTING_GUIDE.md`
8. `docs/REVIEW_RULES.md`
9. `docs/RELEASE_GUIDE.md`
10. `docs/DEFECT_CASES.md`
11. `docs/ADR/`

已有文件优先保留。发现冲突时列出冲突点，不自动覆盖。

### 3. 创建或补充目标项目入口

1. 目标入口不存在时，使用对应模板创建 `AGENTS.md` 或 `CLAUDE.md`。
2. 目标入口已存在时，只补充缺失的 hicode 路由、安全边界、上下文索引和输出要求。
3. `AGENTS.md` 与 `CLAUDE.md` 同时存在时，只修改当前平台入口；另一个入口只做冲突提示，除非用户确认同步。

### 4. 创建或补充项目文档

按用户确认范围创建或补充：

1. `docs/PROJ_CONTEXT.md`
2. `docs/PRD_CONTEXT.md`
3. `docs/DOMAIN_KNOWLEDGE.md`
4. `docs/CODING_RULES.md`
5. `docs/TESTING_GUIDE.md`
6. `docs/REVIEW_RULES.md`
7. `docs/RELEASE_GUIDE.md`
8. `docs/DEFECT_CASES.md`
9. `docs/ADR/ADR-template.md`

模板只提供骨架。发现项目真实规则时，必须区分已确认事实、基于证据的推断和待确认问题。

### 5. 代码图谱和项目上下文

如果目标项目已有代码：

1. 先用只读方式识别目录、构建文件和主要模块。
2. 不默认全仓扫描。
3. 需要 graphify 或等效代码图谱时，先向用户确认扫描范围。
4. 不扫描 `.env*`、密钥、生产配置、未脱敏数据、构建产物、依赖目录或日志目录。
5. 代码图谱结果只能作为结构证据，不得写成已确认业务规则。

### 6. 停止条件

命中以下情况时停止写入，输出风险和待确认问题：

1. 目标目录不明确。
2. 用户未确认写入范围。
3. 已有文件存在冲突且未获确认。
4. 输入或文件包含密钥、生产配置、未脱敏客户信息或未脱敏生产数据。
5. 用户要求复制 plugin 内置能力到目标项目本地运行目录、自动发布、自动合并或操作生产环境。

## 输出要求

初始化输出必须包含：

1. 初始化结论：完成 / 部分完成 / 仅计划 / 阻塞 / 待确认。
2. 目标项目根目录和平台判断。
3. 创建、补充、跳过和需确认的文件清单。
4. 已读规则或模板。
5. 代码结构分析方式：未执行 / 轻量只读 / graphify，并说明原因。
6. 事实、推断和待确认分层。
7. 风险等级。
8. 建议动作。
9. 待确认问题。

不得输出最终审批、准许合并、准许发布或可以上线。
