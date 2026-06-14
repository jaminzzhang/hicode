# hicode Templates

## 定位

本文件说明 hicode 当前可复制、可填写的模板。模板分为项目全局共享模板和单需求特性模板，不承载执行规则全文。

执行规则必须进入根目录 Skill、专业 Agent 或当前规则目录。

在 `references/templates/` 维护源中，模板按 `project/` 和 `feature/` 分类保存。`project/hicode-entry-section.md` 同步到 `skills/init/hicode-entry-section.md`，并由 `hicode:init` 写入目标项目 `AGENTS.md` 或 `CLAUDE.md`；场景报告模板同步到对应 Skill 根目录。

## 维护源分类

| 分类 | 用途 | 目标项目建议位置 |
|---|---|---|
| `project` | 项目全局共享模板，用于 hicode 入口补充片段、长期领域知识、项目结构上下文和 ADR | 项目根目录、`docs/`、`docs/adr/` |
| `feature` | 单需求或单特性实现模板，用于需求上下文、评审、Scope、TDD、Review 和发布报告 | `docs/features/<feature-id>/` |

当前已落地模板：

| 分类 | 文件 |
|---|---|
| `project` | `hicode-entry-section.md`、`DOMAIN_KNOWLEDGE.md`、`PROJ_CONTEXT.md`、`ADR-template.md` |
| `feature` | `feature_context.md`、`requirement-review-report.md`、`scope-report.md`、`task-split-plan.md`、`tdd-report.md`、`review-report.md`、`release-report.md` |

## 文档关系

| 文档 | 层级 | 说明 | 正式写入规则 |
|---|---|---|---|
| `hicode-entry-section.md` | 项目全局 | 补充到 Agent 可执行初始化能力或用户手工初始化后生成的 `AGENTS.md` 或 `CLAUDE.md`，提供 hicode 文档路径、Skill 路由、规则目录和安全边界 | 初始化或负责人确认后写入入口文件 |
| `DOMAIN_KNOWLEDGE.md` | 项目全局 | 领域术语、业务域、保险核心场景和可复用业务规则 | 负责人确认后写入 |
| `PROJ_CONTEXT.md` | 项目全局 | 项目定位、模块结构、核心流程、接口依赖、数据状态、局部命令和历史风险 | 负责人确认后写入 |
| `docs/adr/*.md` | 项目全局 | 难逆、意外且有真实取舍的架构或治理决策 | 决策人确认后写入或更新 |
| `feature_context.md` | 单需求特性 | 当前需求目标、范围、规则、风险、影响范围、测试和发布关注点 | Scope 过程中按需生成或更新 |
| `requirement-review-report.md` | 单需求特性 | 需求评审结论、清晰度、风险和待确认问题 | Scope 需求评审结束后生成 |
| `scope-report.md` | 单需求特性 | Scope 总结，汇总评审、分析、拆分、ADR 和上下文沉淀 | Scope 结束时生成 |
| `task-split-plan.md` | 单需求特性 | 可移交 TDD 的小任务拆分计划 | Scope 拆分计划结束后生成 |
| `tdd-report.md` | 单需求特性 | 测试先行、RED-GREEN-REFACTOR、验证和修改记录 | TDD 过程生成 |
| `review-report.md` | 单需求特性 | 代码审查、专项审查、证据缺口和风险建议 | Review 过程生成 |
| `release-report.md` | 单需求特性 | 发布分支范围、主要实现需求、测试结论、SQL/配置/脚本风险、验证计划、发布建议和回滚计划 | Release 过程生成 |

## 单需求文档约定

单需求文档生命周期、阶段写入边界、缺失材料处理和报告审批边界统一维护在 `project/hicode-entry-section.md`。该片段会写入目标项目入口文件，因此 `hicode:scope`、`hicode:tdd`、`hicode:review` 和 `hicode:release` 运行时应读取目标项目入口规则，不再携带各自的 `README.md` 副本。

修改单需求文档约定时，必须同步 `references/templates/project/hicode-entry-section.md` 和 `skills/init/hicode-entry-section.md`，并运行 `bash scripts/health-check.sh`。

## 使用规则

1. `project/` 模板只由 `hicode:init` 或需要沉淀项目全局上下文的场景在用户确认后按需读取。
2. `feature/` 模板由 `hicode:scope`、`hicode:tdd`、`hicode:review` 和 `hicode:release` 在当前需求目录下按需生成；生命周期和写入边界以目标项目入口文件中的 hicode section 为准。
3. 目标项目入口文件主体优先由当前 Agent 可执行初始化能力生成；OpenCode TUI `/init` 等用户手工命令不能由 Agent 代替执行，hicode 只用 `hicode-entry-section.md` 补充必要入口片段。
4. 模板必须保留占位项、填写说明和安全约束。
5. 模板不得包含长篇执行规则；规则应引用或对应当前规则目录。
6. 模板不得包含真实客户信息、生产数据、生产地址、密钥、Token 或生产配置。

## 禁止事项

1. 不把模板作为默认上下文加载。
2. 不把模板写成规则库。
3. 不把单需求实现报告放入项目全局模板目录。
4. 不在安装器中自动写入目标项目。
