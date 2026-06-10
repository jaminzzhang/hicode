# 初始化规划目录

## 1. 定位

`references/init/` 用于维护 hicode 源资产到目标项目的选择性初始化和加载规划。

该目录只描述规划，不代表真实初始化结果，不执行初始化动作，也不保存目标项目运行副本。

目标项目的运行目录是 `.hicode/`。本仓库只维护根目录源资产和 `references/` 支撑资产，不维护本仓库内的 `.hicode/` 运行副本。

## 2. 目录结构

V2-P3-WP1 只建立目录规范和空目录：

```text
references/init/
├── README.md
├── manifests/
│   └── .gitkeep
└── profiles/
    └── .gitkeep
```

后续 V2-P3-WP2 再创建具体 JSON 清单和初始化 profile。

## 3. DAILY 与 LIBRARY

`DAILY` 与 `LIBRARY` 是目标项目初始化 hicode 资产后的加载分层，用于降低上下文噪音和误触发风险。

| 分层 | 含义 | 适用资产 | 使用边界 |
|---|---|---|---|
| `DAILY` | 目标项目日常会话默认可用 | 项目入口、当前技术栈规则、核心 Agent、核心 Prompt、核心 Skill、关键门禁和必要上下文索引 | 必须有目标项目证据支撑，例如语言、框架、构建测试工具、模块风险、团队工作流或已确认高频场景 |
| `LIBRARY` | 保留为可检索、可按需调用的参考资产 | 专项规则、示例、扩展 Skill、低频 Agent、补充文档和历史参考资产 | 不默认加载，不表示删除、不重要或不可用；需要通过搜索、路由或人工指定调用 |

分类时不得凭偏好决定。每个 `DAILY` 决策应能说明具体证据；证据不足时先放入 `LIBRARY` 或标注 `待确认`。

## 4. Manifest 与 Profile

`manifest` 是资产清单，描述某一类源资产如何映射到目标项目路径，以及建议加载分层。它不是安装日志，不表示文件已经被安装。

`profile` 是初始化组合，引用多个 manifest 条目，表达某类目标项目应选择哪些资产。

计划中的 manifest 文件包括：

1. `manifests/agents.json`
2. `manifests/prompts.json`
3. `manifests/skills.json`
4. `manifests/gates.json`
5. `manifests/hooks.json`
6. `manifests/schemas.json`
7. `manifests/docs.json`
8. `manifests/examples.json`

`manifests/hooks.json` 描述 `references/hooks/hook.json` 中的可初始化 Hook 条目。Hook 初始化由用户在初始化 hicode 资产时选择，不强制进入 `core` 或 `java-insurance-core` profile。

计划中的 profile 文件包括：

1. `profiles/core.json`：完整轻量 hicode 闭环，覆盖入口、首批核心 Agent、核心 Prompt、核心 Skill、核心 Gate、Schema 和必要文档。
2. `profiles/java-insurance-core.json`：面向 Java 保险核心系统的默认组合，在 `core` 基础上把 Java、SQL、安全和保险业务专项 Agent 与规则作为 `DAILY` 资产。
3. `profiles/full-library.json`：完整可检索资产库，保留 manifest 原始 `load_tier`，不代表全量默认加载。

## 5. Manifest 字段规划

V2-P3-WP2 创建具体 manifest 时，每条资产记录至少应包含：

| 字段 | 含义 |
|---|---|
| `id` | 稳定资产标识，建议使用 kebab-case |
| `source` | 本仓库源资产路径，例如 `agents/code-reviewer.md` |
| `target` | 目标项目规划路径，例如 `.hicode/agents/code-reviewer.md` |
| `load_tier` | `DAILY` 或 `LIBRARY` |
| `scenarios` | 触发或使用场景列表 |
| `requires` | 依赖的上下文、Prompt、Skill、门禁、Schema 或目标项目证据 |

建议字段包括：

| 字段 | 含义 |
|---|---|
| `asset_type` | `agent`、`prompt`、`skill`、`gate`、`hook`、`schema`、`doc` 或 `example` |
| `description` | 资产用途简述 |
| `risk_tags` | 金融核心系统风险标签，例如金额、状态流转、幂等、权限、审计、隐私、监管、发布 |
| `evidence` | 设为 `DAILY` 的证据来源 |
| `notes` | 待确认事项或安装限制 |

## 6. 源到目标路径规划

默认路径规划如下，具体 profile 可按目标项目证据调整：

| 源资产 | 目标路径规划 | 说明 |
|---|---|---|
| `references/target-project/AGENTS.md` | `AGENTS.md` | 目标项目 Agent 第一入口模板 |
| `agents/*.md` | `.hicode/agents/*.md` | 子 Agent 源资产 |
| `references/prompts/*.md` | `.hicode/prompts/*.md` | Prompt 源资产 |
| `references/skills/*/` | `.hicode/skills/*/` | Skill 源资产 |
| `references/gates/*.md` | `.hicode/gates/*.md` | 门禁源资产 |
| `references/schemas/*.json` | `.hicode/schemas/*.json` | 结构化输出 Schema |
| `references/examples/` | `.hicode/examples/` | 脱敏示例和回归样例 |
| `references/docs/` | `docs/` 或 `.hicode/docs/` | 人读文档默认进入目标项目 `docs/`；若仅供 Agent 检索，可由 profile 映射到 `.hicode/docs/` |

## 7. 安全与自动化边界

初始化规划必须遵守以下边界：

1. 不读取、记录或输出生产账号、密码、Token、Cookie、Session、连接串、生产 IP 或内部密钥。
2. 不读取 `.env`、密钥文件、生产配置文件或生产凭证。
3. 不处理未脱敏客户敏感信息或未脱敏生产数据。
4. 不向外部服务提交客户敏感信息、生产数据或密钥。
5. 不直接操作生产环境。
6. 不自动合并 MR / PR。
7. 不自动发布、自动回滚或修改生产配置。
8. 不把 manifest/profile 写成审批结果或真实初始化证明。

## 8. 与 ECC 的参考关系

hicode 只吸收 ECC 中适合本项目的思路：

1. 用 `DAILY/LIBRARY` 区分默认加载和按需检索资产。
2. 用 manifest 描述资产到目标路径的规划。
3. 用 profile 组合目标项目需要的资产集合。

hicode 不复制 ECC 的全量通用组件、自动发布能力或生产操作能力。保险/金融核心系统风险标准始终优先。

## 9. 本工作包验收口径

V2-P3-WP1 只在以下条件满足时视为可提交验收：

1. `references/init/README.md` 已说明目录定位、`DAILY/LIBRARY`、manifest/profile 和路径规划边界。
2. `references/init/manifests/` 已存在，但不包含具体 JSON 清单。
3. `references/init/profiles/` 已存在，但不包含具体 profile JSON。
4. 本仓库未创建根目录 `.hicode/`。
