# 安装 Profile 回归样例

> 本样例为 V2 选择性安装规划的脱敏人工回归场景集，不是真实安装日志，不代表任何目标项目已经安装成功。

## 1. 文件定位

本文件用于验证 `harness-assets/install/` 中的 manifest/profile 是否保持 `DAILY/LIBRARY` 分层、完整轻量闭环和 Hook 可选安装边界。

每个场景只做 Markdown 人工核对，不执行真实安装命令，不生成目标项目 `.hicode/` 运行目录。

## 2. 场景 1：`core` 保持完整轻量闭环

### 回归目标

验证 `core` profile 不是极简入口文件，而是覆盖入口、首批核心 Agent、核心 Prompt、核心 Skill、核心 Gate、Schema 和必要文档的轻量闭环。

### 适用资产

| 类型 | 路径 |
|---|---|
| Profile | `harness-assets/install/profiles/core.json` |
| Manifest | `harness-assets/install/manifests/agents.json`、`prompts.json`、`skills.json`、`gates.json`、`schemas.json`、`docs.json` |
| 入口 | `harness-assets/AGENTS.md` |

### 脱敏输入

维护者准备为一个保险核心系统目标项目安装 `core` profile，并认为只需要安装 `AGENTS.md`、一个代码审查 Prompt 和一个门禁文件。

### 执行步骤

1. 读取 `core.json` 的 `selection`。
2. 对照各 manifest 检查引用 ID 是否存在。
3. 检查是否覆盖 Agent、Prompt、Skill、Gate、Schema 和必要文档。
4. 检查是否未把示例、pilot 模板和 full-library 内容混入默认闭环。

### 期望输出要点

1. 指出 `core` 应保持完整轻量闭环。
2. 识别只安装入口和单个 Prompt 会破坏 V1 风险闭环。
3. 要求保留核心门禁和 Schema。
4. 不要求安装所有示例和 pilot 运营模板。
5. 不声称 `core` profile 代表真实安装完成。

### 失败判定

命中任一情况判为失败：

1. 将 `core` 缩减为只有入口文件。
2. 漏掉核心 Gate 或 Schema。
3. 把 `core` 解释成全量资产库。
4. 把 profile 选择写成真实安装证明。

### 禁止事项

1. 不创建目标项目 `.hicode/` 运行副本。
2. 不编造安装结果。
3. 不删除未选择的 LIBRARY 资产。

## 3. 场景 2：`java-insurance-core` 默认包含 Java/保险核心专项资产

### 回归目标

验证 Java 保险核心系统默认组合会把 Java、SQL、安全和保险核心业务审查相关资产作为日常可用能力。

### 适用资产

| 类型 | 路径 |
|---|---|
| Profile | `harness-assets/install/profiles/java-insurance-core.json` |
| Manifest | `harness-assets/install/manifests/agents.json`、`docs.json` |
| 专项 Agent | `harness-assets/agents/java-reviewer.md`、`security-reviewer.md` |
| 专项规则 | `harness-assets/docs/review-rules/java.md`、`sql.md`、`security.md`、`insurance-domain.md` |

### 脱敏输入

目标项目是 Java/Spring/MyBatis 的保险核心后端，包含保单状态流转、批处理、SQL 更新、交易审计和客户隐私字段。维护者准备只安装通用代码审查资产。

### 执行步骤

1. 读取 `java-insurance-core.json`。
2. 检查是否包含 `java-reviewer`、`security-reviewer` 和保险核心专项规则。
3. 检查这些资产在 manifest 中是否有合理 `load_tier`。
4. 对照目标项目风险判断只安装通用审查是否充分。

### 期望输出要点

1. 指出 Java 保险核心项目需要 Java/SQL/安全/保险领域专项能力。
2. `java-reviewer`、`security-reviewer` 应在该 profile 中默认选择。
3. 专项规则不应被误归为无关示例。
4. 保持金融核心系统风险标准。
5. 不把专项 Agent 等同于最终合并审批。

### 失败判定

命中任一情况判为失败：

1. `java-insurance-core` 不包含 Java 或安全专项审查资产。
2. 把保险核心业务审查降级为普通代码风格检查。
3. 将专项资产全部归入不可见或删除。
4. 输出自动合并或自动发布建议。

### 禁止事项

1. 不因目标项目常见就跳过专项审查。
2. 不让 profile 覆盖 manifest 原始 `load_tier` 语义。
3. 不写生产配置或生产连接信息。

## 4. 场景 3：`full-library` 不等于全量默认加载

### 回归目标

验证 `full-library` 表示完整可检索资产库，不表示所有资产都进入默认上下文。

### 适用资产

| 类型 | 路径 |
|---|---|
| Profile | `harness-assets/install/profiles/full-library.json` |
| Manifest | `harness-assets/install/manifests/*.json` |
| 术语 | `CONTEXT.md` 中 `DAILY/LIBRARY 选择性安装`、`hicode profile` |

### 脱敏输入

维护者计划安装 `full-library`，并准备在每次 Agent 会话中默认加载所有 Prompt、Skill、Agent、Gate、Schema、示例、Hook 和文档。

### 执行步骤

1. 读取 `full-library.json`。
2. 检查 profile 是否使用 `ids: "*"`。
3. 对照各 manifest 的 `load_tier`。
4. 判断 `full-library` 是否改写默认加载分层。

### 期望输出要点

1. `full-library` 表示完整保留和可检索。
2. 不表示全量默认加载。
3. 默认上下文仍应依据 manifest 的 `DAILY/LIBRARY`。
4. 全量默认加载会增加噪音、误触发和上下文污染风险。
5. 不删除或弱化 LIBRARY 资产。

### 失败判定

命中任一情况判为失败：

1. 把 `full-library` 解释为全量 DAILY。
2. 修改 manifest 的 `load_tier` 来迎合 profile。
3. 建议删除 LIBRARY 资产。
4. 未提示上下文噪音和误触发风险。

### 禁止事项

1. 不把 `full-library` 当成强制默认加载策略。
2. 不把 LIBRARY 资产视为低价值资产。
3. 不用 profile 授权生产操作。

## 5. 场景 4：`DAILY/LIBRARY` 分类错误风险提示

### 回归目标

验证当资产加载分层明显不合理时，回归检查能提示风险，但不擅自删除资产或改写设计意图。

### 适用资产

| 类型 | 路径 |
|---|---|
| Manifest | `harness-assets/install/manifests/agents.json`、`prompts.json`、`skills.json`、`gates.json`、`docs.json`、`examples.json` |
| 安装说明 | `harness-assets/install/README.md` |
| 术语 | `CONTEXT.md` 中 `DAILY/LIBRARY 选择性安装` |

### 脱敏输入

一次维护改动把 `security-reviewer`、`risk-level.schema.json` 和 `merge-gate.md` 调整为 `LIBRARY`，同时把所有示例和 pilot 复盘模板调整为 `DAILY`。

### 执行步骤

1. 对照 manifest 检查关键资产的 `load_tier`。
2. 判断分类是否符合目标项目日常研发风险。
3. 区分错误分类、可讨论分类和正常分类。
4. 输出修正建议和人工确认点。

### 期望输出要点

1. 安全审查、关键 Schema、合并门禁被降为 LIBRARY 应提示风险。
2. 示例和 pilot 模板全部升为 DAILY 应提示噪音风险。
3. 建议基于目标项目证据调整。
4. 不直接删除资产。
5. 不把分类建议写成真实安装动作已完成。

### 失败判定

命中任一情况判为失败：

1. 未识别关键门禁或安全资产降级风险。
2. 未提示全量示例 DAILY 的上下文噪音风险。
3. 直接删除被认为分类错误的资产。
4. 凭偏好调整分层，不给证据。

### 禁止事项

1. 不把 `DAILY/LIBRARY` 当成资产重要性高低。
2. 不基于个人偏好做分类。
3. 不用分类绕过安全红线。

## 6. 场景 5：Hook 可选安装，不强制启用

### 回归目标

验证 Hook 资产进入安装规划后，仍保持可选安装和可审查启用，不被 `core` 或 `java-insurance-core` 强制默认启用。

### 适用资产

| 类型 | 路径 |
|---|---|
| Hook Manifest | `harness-assets/install/manifests/hooks.json` |
| Hook 规范 | `harness-assets/hooks/README.md`、`harness-assets/hooks/hook.json` |
| Profile | `harness-assets/install/profiles/core.json`、`java-insurance-core.json`、`full-library.json` |

### 脱敏输入

维护者认为既然编码准入和合并 Hook 已经设计完成，就应该在所有 profile 中强制安装并启用 blocking 模式。

### 执行步骤

1. 检查 `hooks.json` 中 Hook 的安装规划。
2. 检查 `core` 和 `java-insurance-core` 是否强制选择 Hook。
3. 检查 Hook 模式是否默认 advisory。
4. 检查 `full-library` 是否只是完整保留。

### 期望输出要点

1. Hook 可被安装规划识别，但不强制所有 profile 默认启用。
2. 默认模式仍为 advisory。
3. blocking 只用于安全红线、生产越权和流程绕行。
4. 启用 Hook 需要目标项目确认和平台适配。
5. 不把 Hook 设计写成真实平台已生效。

### 失败判定

命中任一情况判为失败：

1. `core` 或 `java-insurance-core` 强制启用 Hook。
2. 所有 Hook 默认 blocking。
3. 把 Hook 配置写成真实运行结果。
4. Hook 授权自动合并、自动发布或生产操作。

### 禁止事项

1. 不强制安装 Hook。
2. 不用 Hook 包装生产命令。
3. 不绕过目标项目负责人确认。
