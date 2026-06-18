# AGENTS.md

本文件是目标项目的 Agent 第一入口模板。复制到试点仓库后，应根据该仓库的真实业务、技术栈、测试方式和发布流程补齐 `待确认` 内容。

`AGENTS.md` 只作为项目入口、上下文索引、工作流程路由、安全边界、Skill 调用说明和输出规范，不作为领域知识库、历史缺陷库或长篇规则文档。

## 1. 项目定位

| 项 | 内容 |
|---|---|
| 项目名称 | 待确认 |
| 项目类型 | 金融保险系统相关系统 / 组件 / 工程资产，待确认 |
| 业务范围 | 待确认 |
| 技术栈 | 待确认 |
| 技术负责人 | 待确认 |
| 测试负责人 | 待确认 |
| 发布负责人 | 待确认 |

AI Coding Agent 只能作为研发辅助工具，不能替代产品、研发、测试、架构、Review 或发布负责人的最终判断。

默认服务对象是保险/金融核心系统研发。所有需求评审、编码计划、TDD、辅助编码、代码审查、提交检查、核心场景测试和发布检查，都必须显式关注：

```text
保险核心业务逻辑严谨性
金额精度
交易一致性
状态流转
幂等与并发
权限与审计
客户隐私与监管合规
生产变更、回滚和发布准入
```

业务规则不清晰时，不得编造；必须列为 `待确认`，并建议由对应负责人确认。

## 2. 上下文读取规则

执行任务时先读取本文件，再按场景读取必要上下文。不要为了低风险小任务一次性读取所有文档。

通用索引：

| 文档 | 用途 |
|---|---|
| `docs/DOMAIN_KNOWLEDGE.md` | 领域术语、业务域和高风险规则索引 |
| `docs/PROJ_CONTEXT.md` | 项目模块、关键流程、接口、数据、约束和历史风险 |
| `docs/PRD_CONTEXT.md` | 单需求目标、范围、规则、澄清点、风险、测试和发布关注点 |
| `docs/CODING_RULES.md` | 编码、分层、异常、事务、日志、幂等和安全规则 |
| `docs/TESTING_GUIDE.md` | 单测、集成测试、Mock、断言和测试数据规则 |
| `docs/REVIEW_RULES.md` | 代码审查总则、P0/P1/P2/P3 分级和分场景规则加载路由 |
| `docs/review-rules/` | Java、SQL、安全、保险业务等代码审查细则 |
| `docs/RELEASE_GUIDE.md` | 发布检查、SQL、配置、验证点和回滚规则 |
| `docs/DEFECT_CASES.md` | 已复盘确认的历史缺陷和防范规则 |
| `docs/ADR/` | 架构决策记录和 ADR 模板 |
| `docs/LARGE_CODEBASE_AGENT_GUIDE.md` | 大型代码库 Agent 导航、分层上下文、子 Agent、Hook、LSP/MCP 和治理方法论 |

### 2.1 大型代码库读取与导航

目标项目若是多模块单体、Monorepo、多仓服务群或长期遗留系统，Agent 应遵守：

1. 先读取 `docs/PROJ_CONTEXT.md` 中的模块地图、局部命令、排除目录和工具说明，再搜索代码。
2. 优先在相关模块或服务目录内工作，不从仓库根目录盲目展开。
3. 使用当前工作区的实时文件和搜索结果作为证据，不依赖可能过期的外部索引。
4. 搜索命中太多时先收窄目录、文件类型和关键词；同名类、方法或字段必须结合定义、引用、导入路径或 LSP 结果确认。
5. 复杂或陌生模块先做只读探索，输出模块地图、影响范围、风险和待确认问题，再进入受控修改。
6. 修改后优先运行相关模块的局部测试、lint 或构建命令；无法验证时说明原因和残余风险。

详细方法见 `docs/LARGE_CODEBASE_AGENT_GUIDE.md`。该文档按需读取，不要默认把全文加载进所有会话。

## 3. 子 Agent 委托路由

目标项目安装 V2 hicode 资产后，可按任务风险和复杂度委托 `.hicode/agents/` 下的子 Agent。

优先委托子 Agent 的情况：

1. 涉及保险核心业务规则、金额、状态、幂等、权限、隐私、监管、SQL、配置、发布或回滚。
2. 需要跨 Prompt、Skill、门禁和 Schema 组织证据。
3. 需要安全、Java/SQL、保险业务专项审查。
4. 需要受控修改文件。
5. 输出将进入门禁、Review、发布或负责人确认。

可直接使用 Prompt 或 Skill 的情况：

1. 用户明确要求某个 Prompt 或 Skill。
2. 任务低风险、单一、只读或一次性报告。
3. 目标项目未安装对应子 Agent。
4. 只是查阅规则、生成草稿或解释文档。

完整 Agent / Prompt / Skill / Gate / Schema 映射见 `docs/AGENT_PROMPT_INTEGRATION.md`。统一委托流程见 `docs/workflows/agent-delegation.md`。

## 4. 工作流程路由

| 场景 | 推荐 Agent | 最小必读上下文 | Prompt | Skill | Gate / 下一节点 |
|---|---|---|---|---|---|
| 需求评审 | `.hicode/agents/requirement-reviewer.md` | `docs/PRD_CONTEXT.md`、`docs/DOMAIN_KNOWLEDGE.md`、`docs/DEFECT_CASES.md` | `.hicode/prompts/requirement-review.md` | `.hicode/skills/requirement-review/SKILL.md` | `.hicode/gates/requirement-entry-gate.md` |
| 编码计划 | `.hicode/agents/coding-planner.md` | `docs/PRD_CONTEXT.md`、`docs/PROJ_CONTEXT.md`、`docs/CODING_RULES.md`、`docs/TESTING_GUIDE.md` | `.hicode/prompts/coding-plan.md` | `.hicode/skills/coding-plan/SKILL.md` | `.hicode/gates/coding-entry-gate.md` |
| TDD | `.hicode/agents/tdd-guide.md` | `docs/PRD_CONTEXT.md`、编码计划、`docs/TESTING_GUIDE.md` | `.hicode/prompts/tdd.md` | `.hicode/skills/tdd/SKILL.md` | `.hicode/gates/coding-to-test-gate.md` |
| 辅助编码 | `.hicode/agents/coding-assistant.md` | 编码计划、TDD 输出、`docs/CODING_RULES.md`、相关代码 | `.hicode/prompts/coding-assistant.md` | `.hicode/skills/coding-assistant/SKILL.md` | 代码审查 / 提测门禁 |
| 代码审查 | `.hicode/agents/code-reviewer.md` | diff、`docs/PRD_CONTEXT.md`、`docs/PROJ_CONTEXT.md`、`docs/REVIEW_RULES.md`、按需读取 `docs/review-rules/`、`docs/DEFECT_CASES.md`、测试结果 | `.hicode/prompts/code-review.md` | `.hicode/skills/code-review/SKILL.md` | `.hicode/gates/merge-gate.md` |
| 安全专项审查 | `.hicode/agents/security-reviewer.md` | diff、`docs/REVIEW_RULES.md`、`docs/review-rules/security.md`、脱敏安全证据 | `.hicode/prompts/code-review.md`、`.hicode/prompts/pre-commit-check.md` | `.hicode/skills/code-review/SKILL.md`、`.hicode/skills/pre-commit-check/SKILL.md` | 人工安全确认 / 合并门禁 |
| Java 专项审查 | `.hicode/agents/java-reviewer.md` | diff、`docs/CODING_RULES.md`、`docs/REVIEW_RULES.md`、`docs/review-rules/java.md`、`docs/review-rules/sql.md`、`docs/review-rules/insurance-domain.md` | `.hicode/prompts/code-review.md` | `.hicode/skills/code-review/SKILL.md` | 代码审查补充 / 合并门禁 |
| 提交检查 | 按需委托 `code-reviewer` 或 `security-reviewer` | diff、分支信息、编码计划、测试结果、Review 结果、`docs/REVIEW_RULES.md` | `.hicode/prompts/pre-commit-check.md` | `.hicode/skills/pre-commit-check/SKILL.md` | 提测门禁 / 合并门禁 |
| 核心场景测试 | 按需委托 `tdd-guide` 或 `release-reviewer` | `docs/PRD_CONTEXT.md`、`docs/DOMAIN_KNOWLEDGE.md`、`docs/TESTING_GUIDE.md`、`docs/DEFECT_CASES.md` | `.hicode/prompts/core-scenario-test.md` | `.hicode/skills/core-scenario-test/SKILL.md` | 发布检查 |
| 发布前检查 | `.hicode/agents/release-reviewer.md` | 发布清单、测试报告、缺陷状态、SQL/配置摘要、`docs/RELEASE_GUIDE.md` | `.hicode/prompts/release-check.md` | `.hicode/skills/release-check/SKILL.md` | `.hicode/gates/release-gate.md` |

如果对应 Prompt 或 Skill 尚未安装，按本表的最小上下文和输出规范生成人工可审阅的报告。

如果对应 Agent 尚未安装，可直接使用对应 Prompt 或 Skill，并在输出中说明未进行子 Agent 委托。需要结构化输出或 Schema 校验时，按 `docs/AGENT_PROMPT_INTEGRATION.md` 查询对应 Schema。

## 5. 权限与安全边界

门禁默认采用建议性质结论。对敏感信息、密钥、未脱敏生产数据、AI 直接生产操作、自动合并或发布、P0 业务或安全风险，必须给出阻断建议；实际阻断由既有流程或负责人决策。

Agent 禁止：

1. 读取或输出生产账号、密码、Token、Cookie、Session、连接串、生产 IP 或内部密钥。
2. 读取 `.env`、密钥文件、生产配置文件或生产凭证。
3. 处理未脱敏客户敏感信息或未脱敏生产数据。
4. 向外部模型提交客户敏感信息、生产数据或密钥。
5. 直接操作生产环境。
6. 自动合并 MR / PR。
7. 自动发布。
8. 自动修改生产配置。
9. 执行删除、覆盖、生产连接、生产库变更等高风险命令。
10. 删除未确认的代码、测试、配置、脚本或文档。
11. 用删除测试、降低断言、跳过 Review 或隐藏风险的方式推动通过。

涉及姓名、身份证号、手机号、银行卡号、保单号、客户号、地址、邮箱、Token、Cookie、Session、数据库连接串、生产 IP、内部密钥等信息时，必须先脱敏。

## 6. 上下文更新规则

Agent 可以提出上下文更新建议或草稿，但正式写入长期领域知识、项目上下文、历史缺陷和 ADR 前，必须由对应负责人确认。

允许提出更新建议的位置：

1. `docs/DOMAIN_KNOWLEDGE.md`
2. `docs/PROJ_CONTEXT.md`
3. `docs/PRD_CONTEXT.md`
4. `docs/CODING_RULES.md`
5. `docs/TESTING_GUIDE.md`
6. `docs/REVIEW_RULES.md`
7. `docs/review-rules/`
8. `docs/RELEASE_GUIDE.md`
9. `docs/DEFECT_CASES.md`
10. `docs/ADR/`

更新建议必须区分：

```text
已确认事实
基于现有输入的推断
待确认问题
建议新增 / 修改 / 废弃的内容
```

涉及架构决策时，只生成 ADR 草稿或 ADR 触发判断，不自动合入正式 ADR。

## 7. 输出规范

审查、计划、测试、提交和发布类输出必须包含：

1. Agent 层建议结论，只能使用以下口径：
   - 未发现 P0/P1 风险。
   - 有条件建议继续。
   - 发现高风险，建议先修复或补证据。
   - 证据不足待确认。
   - 命中安全红线，停止推进并转人工流程。
2. 依据：引用输入、上下文文档、代码 diff、测试结果或检查结果。
3. 风险等级：使用 P0 / P1 / P2 / P3。
4. 建议动作：具体到文件、模块、测试、检查项或负责人角色。
5. 待确认问题：列出缺失输入、业务规则缺口和负责人。
6. 底层规则源原始结论：如 Prompt、Skill 或 Gate 已输出原始结论，必须作为依据保留，但不得写成最终审批。
7. 验证动作、受限命令执行记录或未执行原因。
8. 上下文更新建议：说明建议更新位置、内容和原因。

门禁原始结论必须转换为 Agent 层建议结论。不得输出“通过 / 不通过 / 准许合并 / 准许发布 / 门禁通过 / 可以上线 / 最终审批通过”等入口层结论。

不得把不确定事项写成事实，不得把 AI 输出描述为最终决策。
