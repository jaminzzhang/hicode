# Init Rules

## 定位

本目录保存 `hicode:init` 的目标项目初始化规则。初始化只生成或补充目标项目入口、上下文和项目规则文档，不复制 hicode plugin 内置 Skill、Agent、Rule、Template 或 Hook 到目标项目 `.hicode/`。

## 准入条件

1. 用户明确要求初始化目标项目。
2. 已确认目标项目路径、当前 Coding Agent 平台和允许写入范围。
3. 已检查目标项目是否已有 `AGENTS.md`、`CLAUDE.md`、`CONTEXT.md` 或 `docs/` 上下文文档。
4. 写入前必须说明将创建或修改的文件，等待用户确认。

## 初始化范围

| 类型 | 规则 |
|---|---|
| 入口文件 | Codex、OpenCode 和通用 Agent 使用 `AGENTS.md`；Claude Code 使用 `CLAUDE.md` |
| 项目上下文 | 按确认范围创建 `docs/PROJ_CONTEXT.md`、`docs/PRD_CONTEXT.md`、`docs/DOMAIN_KNOWLEDGE.md` 等模板 |
| 项目规则 | 按确认范围创建编码、测试、Review、发布、缺陷和 ADR 模板 |
| 代码图谱 | 只有用户确认扫描范围后，才可使用 graphify 或等效代码图谱结果补充项目上下文 |
| hicode 能力 | 来自已安装 plugin；不要默认复制到目标项目 `.hicode/` |

## 禁止事项

1. 不在 plugin 安装时自动初始化目标项目。
2. 不默认全仓扫描，不读取 `.env`、密钥、生产配置或未脱敏数据。
3. 不把代码图谱推断写成已确认业务事实。
4. 不安装本仓库 `docs/`、历史文档或归档资产到目标 Coding Agent。
5. 不覆盖目标项目已有入口或规则文件；只能合并、补充或输出差异建议。

## 输出要求

初始化输出必须包含：

1. 初始化结论。
2. 已检查的现有文件。
3. 建议创建或修改的文件清单。
4. 未写入原因或用户确认记录。
5. 安全与敏感信息检查结果。
6. 后续建议进入的 hicode Skill。
