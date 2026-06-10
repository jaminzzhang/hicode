# V2 开发实施计划

## 1. 计划定位

本计划记录 hicode 在 V1 已完成基线之上的 V2 演进方向。V2 参考 ECC 的整体设计，但不复制 ECC 全量通用 Agent、Skill、Hook 和安装体系，而是吸收其中适合保险/金融核心系统研发的子 Agent 委托、选择性初始化、门禁 Hook 化和资产健康检查思路。

V2 不回改 V1 已完成工作包状态。V1 的 Prompt、Skill、门禁、Schema、示例和试点运营支撑资产作为已完成基线继续保留；V2 在此基础上新增源资产、整合规范和验收口径。

## 2. 目标

V2 的目标是把 hicode 从 Markdown-first Harness 资产，演进为可选择安装、可委托子 Agent、可 Hook 化触发、可回归验证的保险核心系统研发 Agent Harness。

V2 重点解决：

1. 如何引入 ECC 式子 Agent，但保持保险核心系统垂直风险口径。
2. 如何让 Agent 与现有 Prompt、Skill、门禁和 Schema 整合，不维护重复规则。
3. 如何用 `DAILY/LIBRARY` 分层降低目标项目默认上下文噪音。
4. 如何把已稳定门禁转为 Hook 触发，同时保持建议性质和自动化红线。
5. 如何验证新增 Agent、初始化清单和 Hook 设计不会破坏 V1 资产闭环。

## 3. 范围边界

### 3.1 本仓库范围内

1. `agents/` 子 Agent 源资产。
2. Agent 与 Prompt、Skill、门禁、Schema 的整合规范。
3. `references/init/` 选择性初始化和加载规划资产。
4. 门禁 Hook 化设计资产和示例 Hook 配置。
5. V2 回归样例、验收清单和资产健康检查建议。
6. 与 V2 新术语相关的 `CONTEXT.md` 和 ADR 更新。

### 3.2 本仓库范围外

1. 真实目标项目安装脚本的生产级发布。
2. 接入真实 CI/CD、MR 平台、发布平台或生产平台。
3. 自动合并、自动发布、自动回滚、生产连接、生产 SQL、生产日志读取或生产配置修改。
4. 复制 ECC 全量 64 个子 Agent、261 个 Skill、84 个命令或所有 Hook。
5. 真实试点效果数据采集和组织运营执行。

## 4. 设计基线

V2 必须遵守已确认的设计基线：

1. 子 Agent 源目录为 `agents/`。
2. Agent 是可委托角色入口；Prompt 仍是详细规则源。
3. Agent 可以引用 Prompt、Skill、门禁、Schema 和输出模板，但不得复制 Prompt 全文或维护第二套场景规则。
4. 首批子 Agent 只覆盖 8 个角色：`requirement-reviewer`、`coding-planner`、`tdd-guide`、`coding-assistant`、`code-reviewer`、`security-reviewer`、`java-reviewer` 和 `release-reviewer`。
5. 选择性初始化规划目录为 `references/init/`。
6. 资产加载分层使用 `DAILY` 和 `LIBRARY`。
7. 门禁 Hook 化默认采用 `advisory` 提醒型；只有安全红线、生产越权和流程绕行问题允许 `blocking` 阻断型。
8. 无论是否引入 Agent、初始化清单或 Hook，都不得自动发布、自动合并、自动回滚或操作生产环境。

## 5. 阶段总览

| 阶段 | 名称 | 目标 | 主要交付物 |
|---|---|---|---|
| V2-P1 | 子 Agent 基础资产 | 建立 `agents/` 和首批 8 个子 Agent | Agent 目录规范、8 个 Agent 文件、Agent 输出口径 |
| V2-P2 | Agent-Prompt-Skill-Gate 整合 | 定义 Agent 如何引用 Prompt、Skill、门禁和 Schema | 整合规范、目标项目入口更新、映射表 |
| V2-P3 | 选择性初始化规划 | 建立 `references/init/`、manifest 和 profile | init README、manifests、profiles |
| V2-P4 | 门禁 Hook 化设计 | 将稳定门禁映射为 advisory/blocking Hook 设计 | Hook 规范、Hook 示例、权限边界 |
| V2-P5 | V2 回归与验收 | 验证新增资产与 V1 闭环一致 | 回归样例、健康检查建议、V2 验收清单 |
| V2-P6 | Claude Code Plugin 安装器 | 为 Claude Code 提供用户级 hicode plugin 安装器和能力场景 Skill | `./`、`install.sh`、Claude Code plugin 入口 |

## 6. V2-P1 子 Agent 基础资产

### V2-P1-WP1 子 Agent 目录规范

目标：建立 `agents/` 的目录规则、文件格式、frontmatter 口径、角色边界和安全基线。

输入：

1. `CONTEXT.md`
2. `docs/adr/0001-adopt-ecc-inspired-hicode-v2-architecture.md`
3. ECC 本地仓库 `agents/` 的参考模式
4. V1 `references/skills/README.md`

输出：

1. `agents/README.md`
2. `agents/_template.md`

依赖：V2 规划确认。

验收标准：

1. 明确 Agent 与 Prompt、Skill、门禁、Schema 的边界。
2. 明确 Agent 不复制 Prompt 全文。
3. 明确子 Agent 不自动合并、发布、回滚或操作生产。
4. 明确输出必须包含依据、风险等级、建议动作、待确认问题和上下文更新建议。

### V2-P1-WP2 首批 8 个子 Agent

目标：创建首批核心子 Agent，覆盖 V1 核心研发链路和 Java 专项审查。

输入：

1. `agents/README.md`
2. 对应 V1 Prompt、Skill、门禁和输出模板
3. ECC `code-reviewer`、`tdd-guide`、`security-reviewer`、`java-reviewer` 等参考 Agent

输出：

1. `agents/requirement-reviewer.md`
2. `agents/coding-planner.md`
3. `agents/tdd-guide.md`
4. `agents/coding-assistant.md`
5. `agents/code-reviewer.md`
6. `agents/security-reviewer.md`
7. `agents/java-reviewer.md`
8. `agents/release-reviewer.md`

依赖：V2-P1-WP1。

验收标准：

1. 每个 Agent 有明确触发条件、职责边界、必读资产引用、工具权限、安全红线和输出要求。
2. 每个 Agent 都引用对应 Prompt 或 Skill，不复制全文。
3. `code-reviewer` 和 `java-reviewer` 吸收 ECC 的降噪和高严重度证明门槛。
4. `security-reviewer` 明确客户隐私、密钥、生产数据和生产越权为高风险红线。
5. `release-reviewer` 不输出生产命令，不授权发布。

## 7. V2-P2 Agent-Prompt-Skill-Gate 整合

### V2-P2-WP1 整合规范

目标：定义 Agent、Prompt、Skill、门禁、Schema 和输出模板之间的引用关系、加载顺序和冲突处理规则。

输入：

1. `CONTEXT.md`
2. V2-P1 Agent 资产
3. V1 Prompt、Skill、门禁和 Schema

输出：

1. `references/docs/AGENT_PROMPT_INTEGRATION.md`
2. `references/docs/workflows/agent-delegation.md`

依赖：V2-P1。

验收标准：

1. 明确 Agent 是角色入口，Prompt 是规则源，Skill 是流程路由，门禁是准入建议，Schema 是结构化校验。
2. 明确冲突优先级：用户最新指令和安全红线优先，其次目标项目入口、Prompt/Skill/Gate 本地规则和上下文文档。
3. 明确 Agent 缺少对应 Prompt 或 Skill 时的降级输出方式。
4. 明确 Agent 不得绕过门禁或人工确认。

### V2-P2-WP2 目标项目入口更新

目标：更新目标项目入口模板，让目标项目知道何时委托子 Agent、何时直接使用 Prompt/Skill。

输入：

1. `references/target-project/AGENTS.md`
2. V2-P2-WP1 整合规范
3. 首批 8 个子 Agent

输出：

1. 更新后的 `references/target-project/AGENTS.md`
2. Agent/Prompt/Skill/Gate 映射表

依赖：V2-P2-WP1。

验收标准：

1. 入口模板增加子 Agent 路由，但不膨胀为长篇规则库。
2. 对 8 个核心场景给出 Agent、Prompt、Skill、Gate 和 Schema 映射。
3. 保持金融核心系统风险标准和自动化红线。

## 8. V2-P3 选择性初始化规划

### V2-P3-WP1 初始化规划目录

目标：建立 `references/init/` 的目录规范和 manifest/profile 结构。

输入：

1. `CONTEXT.md`
2. ECC `skills/agent-sort/SKILL.md`
3. ECC `manifests/` 和初始化规划参考

输出：

1. `references/init/README.md`
2. `references/init/manifests/`
3. `references/init/profiles/`

依赖：V2-P1、V2-P2。

验收标准：

1. 明确 `DAILY` 与 `LIBRARY` 的含义和使用边界。
2. 明确 manifest 只描述源资产到目标项目路径的规划，不代表真实初始化结果。
3. 明确不在本仓库维护根目录 `.hicode/`。

### V2-P3-WP2 manifests 与 profiles 初版

目标：为 Agent、Prompt、Skill、门禁、Hook、Schema、文档和示例建立选择性初始化清单。

输入：

1. hicode 根目录源资产和 `references/` 支撑资产列表
2. V2-P3-WP1 目录规范
3. 目标项目 Java 保险核心系统默认场景

输出：

1. `references/init/manifests/agents.json`
2. `references/init/manifests/prompts.json`
3. `references/init/manifests/skills.json`
4. `references/init/manifests/gates.json`
5. `references/init/manifests/hooks.json`
6. `references/init/manifests/schemas.json`
7. `references/init/manifests/docs.json`
8. `references/init/manifests/examples.json`
9. `references/init/profiles/core.json`
10. `references/init/profiles/java-insurance-core.json`
11. `references/init/profiles/full-library.json`

依赖：V2-P3-WP1。

验收标准：

1. 每个 manifest 条目至少包含 `id`、`source`、`target`、`load_tier`、`scenarios` 和 `requires`。
2. `hooks.json` 在 V2-P4 Hook 源资产创建前只保留规划占位，不提前创建虚假 Hook 条目。
3. `core` profile 覆盖 hicode 完整轻量闭环，包括入口、首批核心 Agent、核心 Prompt、核心 Skill、核心 Gate、Schema 和必要文档。
4. `java-insurance-core` profile 覆盖 Java、SQL、安全和保险核心业务审查，并将对应专项 Agent 与专项规则作为 `DAILY` 资产。
5. `full-library` profile 保留完整可检索资产，不改写 manifest 条目的 `load_tier`，也不表示全量默认加载。

## 9. V2-P4 门禁 Hook 化设计

### V2-P4-WP1 Hook 规范

目标：定义门禁如何从 Markdown 报告模板和 Schema 映射到 Hook 触发点。

输入：

1. V1 门禁资产
2. V1 Schema
3. `references/docs/TOOL_PERMISSION_AUDIT_MATRIX.md`
4. ECC `hooks/` 参考

输出：

1. `references/hooks/README.md`
2. `references/hooks/_hook-template.md`
3. `references/hooks/hook.json`
4. Hook 触发点与门禁映射表

依赖：V2-P3。

验收标准：

1. 明确 `advisory` 和 `blocking` 两种 Hook 模式。
2. 默认使用 `advisory`。
3. `blocking` 只用于安全红线、生产越权和流程绕行。
4. 明确 Hook 不执行发布、回滚、生产连接、生产 SQL 或生产日志读取。
5. 首批 Hook 只覆盖编码准入门禁 Hook 和合并门禁 Hook。
6. `hook.json` 使用 hicode 自定义可安装 Hook 规划格式，目标安装路径为 `.hicode/hooks/hook.json`。

### V2-P4-WP2 核心 Hook 示例

目标：为首批编码准入门禁 Hook 和合并门禁 Hook 提供可审查的示例配置或伪配置。

输入：

1. V2-P4-WP1 Hook 规范
2. V1 门禁资产
3. V2 manifests

输出：

1. `references/hooks/coding-entry-gate-hook.md`
2. `references/hooks/merge-gate-hook.md`

依赖：V2-P4-WP1。

验收标准：

1. Hook 示例只描述触发、输入、输出、风险结论和禁止动作。
2. Hook 示例不包含真实 CI/CD 平台密钥、生产配置或生产命令。
3. Hook 示例能追溯到对应门禁和 Schema。
4. Hook 示例不覆盖需求准入、提测准入或发布准入。

## 10. V2-P5 回归与验收

### V2-P5-WP1 V2 回归样例

目标：验证 Agent、选择性初始化和 Hook 化不会破坏 V1 风险闭环。

输入：

1. V1 回归样例
2. V2 Agent、init 和 Hook 资产

输出：

1. `references/examples/regression/agent-delegation-regression.md`
2. `references/examples/regression/install-profile-regression.md`
3. `references/examples/regression/hook-gate-regression.md`

依赖：V2-P1 至 V2-P4。

验收标准：

1. 覆盖正常委托、Prompt 缺失降级、误报降噪、红线阻断和生产越权拒绝。
2. 覆盖 `DAILY/LIBRARY` 分类错误的风险提示。
3. 覆盖 Hook advisory 与 blocking 的边界。

### V2-P5-WP2 V2 验收检查清单

目标：形成 V2 仓库资产验收口径。

输入：

1. V2 全部资产
2. V1 验收检查清单
3. ADR 与上下文

输出：

1. `references/docs/V2_ACCEPTANCE_CHECKLIST.md`

依赖：V2-P5-WP1。

验收标准：

1. 覆盖目录、Agent、整合规范、init、Hook、回归样例和安全红线。
2. 明确 V2 只验收仓库资产，不声称真实目标项目安装或试点效果达成。
3. 明确仍不得自动发布、自动合并或操作生产。

## 11. V2-P6 Coding Agent Plugin 安装器

### V2-P6-WP1 Claude Code 原生 plugin 安装器

目标：为 Claude Code 提供用户级 hicode plugin 安装器，让 Claude Code 获得 hicode 总入口和能力场景 Skill。

输入：

1. `CONTEXT.md`
2. `agents/`、`references/skills/` 和 `references/init/` 的边界口径
3. Claude Code plugin marketplace、plugin manifest 和 Skill 目录格式
4. hicode 4 个能力场景包：`scope`、`tdd`、`review`、`release`

输出：

1. `./README.md`
2. `install.sh`
3. `.claude-plugin/marketplace.json`
4. `.claude-plugin/plugin.json`
5. `skills/hicode/SKILL.md`
6. `skills/scope/SKILL.md`
7. `skills/tdd/SKILL.md`
8. `skills/review/SKILL.md`
9. `skills/release/SKILL.md`
10. `references/`

依赖：V2-P1 至 V2-P5。

验收标准：

1. 安装器默认用户级安装，并支持 `--dry-run`、`--yes` 和 `--claude-code`。
2. Claude Code 安装走本地 marketplace 和 `hicode` plugin，不伪造目标项目初始化结果。
3. `./` 直接作为 Claude Code plugin root，不额外嵌套 `claude-code/`。
4. plugin 提供 `hicode` 总入口和 `scope`、`tdd`、`review`、`release` 4 个能力场景 Skill。
5. `references/` 只作为 Skill 按需读取的支撑文件，不默认全量加载。
6. 安装动作不扫描代码、不生成 `CLAUDE.md`、`AGENTS.md` 或 `.hicode/`。
7. 安装器不读取生产配置、生产凭证、密钥文件或未脱敏客户数据。

## 12. 建议执行顺序

1. V2-P1-WP1
2. V2-P1-WP2
3. V2-P2-WP1
4. V2-P2-WP2
5. V2-P3-WP1
6. V2-P3-WP2
7. V2-P4-WP1
8. V2-P4-WP2
9. V2-P5-WP1
10. V2-P5-WP2
11. V2-P6-WP1

## 13. 验收总口径

V2 完成时应满足：

1. 首批 8 个子 Agent 可被目标项目入口路由。
2. Agent 与 Prompt、Skill、门禁和 Schema 的关系清晰，不重复维护规则。
3. `references/init/` 能表达核心、Java 保险核心和完整库三种初始化/加载策略。
4. 门禁 Hook 化有清晰触发点和 advisory/blocking 边界。
5. 所有新增资产仍遵守金融核心系统风险标准。
6. 所有新增资产仍禁止自动发布、自动合并、生产操作和未脱敏敏感数据处理。
7. V2 回归样例能覆盖关键成功路径和红线失败路径。
8. `./` 能为 Claude Code 提供 plugin 入口安装器和能力场景 Skill，且不混淆 plugin 安装与目标项目初始化。
