# Agent-Prompt-Skill-Gate 整合规范

## 1. 定位

本文档定义 hicode 子 Agent、Prompt、Skill、门禁、Schema 和输出模板之间的职责关系、引用关系、加载顺序、冲突处理和降级口径。

本规范服务 V2 子 Agent 委托闭环，适用于目标项目安装 `.hicode/agents/`、`.hicode/prompts/`、`.hicode/skills/`、`.hicode/gates/` 和 `.hicode/schemas/` 后的研发辅助流程。

本规范不更新 `harness-assets/AGENTS.md`，不创建初始化清单，不设计 Hook，不新增 Prompt、Skill、门禁或 Schema。

## 2. 分层职责

| 层级 | 职责 | 不负责 |
|---|---|---|
| Agent | 角色定位、委托触发、权限边界、审查纪律、降噪标准、安全红线和输出优先级 | 复制 Prompt 全文、维护第二套场景规则、替代审批 |
| Prompt | 任务目标、必读上下文、检查维度、输出要求和约束 | 角色路由、流程状态管理、门禁审批 |
| Skill | 执行步骤、输入准入、上下文路由、验证记录和模板引用 | 最终审批、自动合并、自动发布 |
| Gate | 阶段准入建议、阻断建议项、普通风险提示项和审计证据 | 自动拦截流程、批准合并或发布 |
| Schema | 结构化输出校验、风险等级、稳定枚举和机器可读字段约束 | 判断业务事实、替代人工 Review |
| 输出模板 | 统一报告形态和归档字段 | 替代 Prompt、Skill 或 Gate 的规则 |

## 3. 委托原则

1. Agent 是可委托角色入口，Prompt 是详细规则源。
2. Agent 可以引用 Prompt、Skill、门禁、Schema 和输出模板，但不得复制全文。
3. Skill 负责流程路由和执行纪律，Prompt 负责本场景检查细节。
4. Gate 只输出建议性质准入结论，不代表负责人审批、CI/CD、发布平台或生产流程批准。
5. Schema 只做结构化约束，不改变风险判断。
6. Agent 输出必须包含结论、依据、委托范围、风险等级、建议动作、待确认问题、验证记录或未执行原因、上下文更新建议。
7. Agent 不得自动合并、自动发布、自动回滚、操作生产、读取密钥或处理未脱敏客户敏感信息。

## 4. 完整映射表

| Agent | 触发场景 | 主要 Prompt | 主要 Skill | 关联 Gate | 关联 Schema | 专项规则 | 输出去向 | 降级口径 |
|---|---|---|---|---|---|---|---|---|
| `requirement-reviewer` | 需求进入编码计划前，需要识别澄清点、业务风险、测试关注点和需求准入证据 | `.hicode/prompts/requirement-review.md` | `.hicode/skills/requirement-review/SKILL.md` | `.hicode/gates/requirement-entry-gate.md` | `.hicode/schemas/review-result.schema.json` | `docs/DOMAIN_KNOWLEDGE.md`、`docs/DEFECT_CASES.md` | 需求评审报告、澄清问题、PRD 上下文更新建议、需求准入输入 | 缺 Agent 时直接使用 Prompt/Skill；缺 Gate 时不输出需求准入建议；缺上下文时只输出待确认 |
| `coding-planner` | 需求评审后，需要编码计划、影响范围、TDD 重点、ADR 判断和编码准入证据 | `.hicode/prompts/coding-plan.md` | `.hicode/skills/coding-plan/SKILL.md` | `.hicode/gates/coding-entry-gate.md` | 无强制 Schema | `docs/CODING_RULES.md`、`docs/TESTING_GUIDE.md`、`docs/ADR/` | 编码计划、TDD 输入、ADR 判断、编码准入输入 | 缺 Skill 时可用 Prompt 输出计划但说明缺少流程准入；缺 Gate 时不输出编码准入建议 |
| `tdd-guide` | 编码前或编码中，需要测试先行证据、RED-GREEN-REFACTOR、测试代码草案或用户确认后的测试文件修改 | `.hicode/prompts/tdd.md` | `.hicode/skills/tdd/SKILL.md` | `.hicode/gates/coding-to-test-gate.md` | 无强制 Schema | `docs/TESTING_GUIDE.md`、`docs/DEFECT_CASES.md` | TDD 设计报告、测试修改记录、辅助编码输入、提测门禁输入 | 缺 Skill 时可用 Prompt 输出测试设计但说明缺少执行纪律；缺编码计划时不得降级推进 |
| `coding-assistant` | 已有编码计划和 TDD 证据，需要受控实现、修复、小范围重构或只读解释 | `.hicode/prompts/coding-assistant.md`、`.hicode/prompts/tdd.md` | `.hicode/skills/coding-assistant/SKILL.md`、`.hicode/skills/tdd/SKILL.md` | `.hicode/gates/coding-entry-gate.md`、`.hicode/gates/coding-to-test-gate.md` | 无强制 Schema | `docs/CODING_RULES.md`、`docs/TESTING_GUIDE.md` | 修改摘要、验证记录、代码审查输入、提测门禁输入 | 缺 TDD 证据时不得实现；缺 Skill 时只能输出补丁草案或受限建议 |
| `code-reviewer` | 开发完成后、提交检查前或人工 Review 前，需要双轴代码审查和金融核心系统风险识别 | `.hicode/prompts/code-review.md` | `.hicode/skills/code-review/SKILL.md` | `.hicode/gates/merge-gate.md` | `.hicode/schemas/review-result.schema.json` | `docs/review-rules/java.md`、`docs/review-rules/sql.md`、`docs/review-rules/security.md`、`docs/review-rules/insurance-domain.md` | 代码审查报告、专项 Agent 转介建议、提交检查和合并门禁输入 | 缺需求来源时需求轴降级；缺专项规则时只做普通代码审查并建议人工专项审查 |
| `security-reviewer` | 变更涉及权限、认证、密钥、日志、脱敏、客户隐私、生产数据、外部接口、审计或监管 | `.hicode/prompts/code-review.md`、`.hicode/prompts/pre-commit-check.md` | `.hicode/skills/code-review/SKILL.md`、`.hicode/skills/pre-commit-check/SKILL.md` | `.hicode/gates/merge-gate.md` | `.hicode/schemas/review-result.schema.json`、`.hicode/schemas/gate-result.schema.json` | `docs/review-rules/security.md` | 安全专项审查报告、阻断建议、人工安全确认建议 | 缺独立安全 Prompt/Skill 时使用 code-review + security 规则；命中安全红线不得降级 |
| `java-reviewer` | 变更涉及 Java、Spring、事务、SQL、批处理、消息、外部调用或保险核心后端 | `.hicode/prompts/code-review.md` | `.hicode/skills/code-review/SKILL.md` | `.hicode/gates/merge-gate.md` | `.hicode/schemas/review-result.schema.json` | `docs/review-rules/java.md`、`docs/review-rules/sql.md`、`docs/review-rules/insurance-domain.md`、`docs/review-rules/security.md` | Java/SQL/保险后端专项审查报告、代码审查补充输入 | 缺专项规则时降级为 code-reviewer 口径；缺业务规则来源时业务轴待确认 |
| `release-reviewer` | 发布申请前或发布准入门禁前，需要发布范围、证据、SQL、配置、回滚和生产验证计划审查 | `.hicode/prompts/release-check.md` | `.hicode/skills/release-check/SKILL.md` | `.hicode/gates/release-gate.md` | `.hicode/schemas/gate-result.schema.json` | `docs/RELEASE_GUIDE.md`、`docs/DEFECT_CASES.md` | 发布风险审查、发布材料补齐建议、发布准入门禁输入 | 缺发布范围或制品信息时只输出待确认；缺 Gate 时不得输出发布准入建议 |

## 5. 加载顺序

推荐加载顺序：

1. 入口规则：`AGENTS.md`。
2. 当前任务相关长期上下文：`docs/DOMAIN_KNOWLEDGE.md`、`docs/PROJ_CONTEXT.md`、`docs/PRD_CONTEXT.md`。
3. 大型代码库或陌生模块任务：按需读取 `docs/LARGE_CODEBASE_AGENT_GUIDE.md`，并优先使用 `docs/PROJ_CONTEXT.md` 的模块地图、局部命令和排除路径。
4. 角色入口：对应 `.hicode/agents/*.md`。
5. 规则源：对应 `.hicode/prompts/*.md`。
6. 流程源：对应 `.hicode/skills/*/SKILL.md`。
7. 准入建议源：对应 `.hicode/gates/*.md`。
8. 结构化约束：对应 `.hicode/schemas/*.json`。
9. 专项规则：按 diff 或任务风险读取 `docs/review-rules/`、`docs/RELEASE_GUIDE.md`、`docs/DEFECT_CASES.md` 等。

只读取当前任务必要上下文。缺少资产时按降级口径处理，不补编事实。

## 6. 冲突优先级

冲突优先级从高到低：

1. 安全红线与禁止事项。
2. 用户最新明确指令。
3. 目标项目入口规则。
4. Agent / Prompt / Skill / Gate / Schema 本地规则。
5. 上下文文档与 ADR。
6. 历史对话、外部参考和模型推断。

处理规则：

1. 用户最新指令不得覆盖安全红线。
2. Agent 与 Prompt 不一致时，Prompt 作为任务规则源优先，Agent 保留角色和边界。
3. Prompt 与 Skill 不一致时，Prompt 的检查维度优先，Skill 的流程准入和验证记录要求仍需保留。
4. Skill 与 Gate 不一致时，Skill 输出流程结果，Gate 输出准入建议；两者冲突时标注冲突并要求人工确认。
5. Schema 与 Markdown 输出不一致时，应保留 Markdown 证据并说明结构化校验失败或未执行。
6. `CONTEXT.md` 与具体工作包计划冲突时，术语以 `CONTEXT.md` 为准，范围和状态以 `docs/PROGRESS.md` 与实施计划为准。

## 7. 降级口径

| 缺失资产 | 允许动作 | 必须说明 | 不得做 |
|---|---|---|---|
| Agent | 直接使用对应 Prompt/Skill | 未进行子 Agent 委托，缺少角色边界和降噪约束 | 声称已完成 Agent 委托 |
| Prompt | 使用 Skill 和上下文输出受限建议 | 缺少详细规则源，输出可信度下降 | 声称按完整 Prompt 执行 |
| Skill | 使用 Prompt 生成报告 | 缺少流程路由、输入准入和验证记录约束 | 声称完成完整 Skill 流程 |
| Gate | 输出风险和建议动作 | 未形成准入建议结论 | 输出建议通过、建议阻断等门禁结论 |
| Schema | 输出 Markdown 报告 | 未做结构化校验 | 声称通过 Schema 校验 |
| 上下文文档 | 输出证据缺口和待确认问题 | 缺少事实来源和影响范围 | 编造业务规则或系统行为 |
| 专项规则 | 降级为普通审查或建议人工专项审查 | 缺少专项规则源 | 输出高确定性的专项结论 |

命中以下情况不得降级推进：

1. 输入包含未脱敏客户敏感信息、生产数据、密钥、`.env`、生产配置或生产凭证。
2. 用户要求生产操作、自动合并、自动发布、自动回滚或修改生产配置。
3. 用户要求删除测试、降低断言、跳过 Review、隐藏风险或绕过门禁。
4. 缺少关键输入导致无法判断 P0/P1 风险。

## 8. Agent 层建议结论转换

Agent 层必须保留底层规则源原始结论，并转换为建议性质结论。

| 原始结论类型 | Agent 层表达 |
|---|---|
| Prompt 输出通过 / 建议启动 / 建议进入下一步 | 未发现 P0/P1 风险，建议进入下一流程 |
| Prompt 输出有条件通过 / 有条件启动 | 有条件建议继续，并列出条件、风险和确认人 |
| Prompt 输出不建议 / 不建议进入下一步 | 发现高风险，建议先修复、补证据或补确认 |
| Prompt 输出待确认 | 证据不足待确认 |
| Gate 输出建议通过 | 门禁建议结论为建议通过，不代表审批通过 |
| Gate 输出有条件通过 | 门禁建议结论为有条件通过，不代表负责人接受风险 |
| Gate 输出建议阻断 | 门禁建议结论为建议阻断，需按解除条件处理 |
| Release 输出建议发布 | 发布风险建议为可进入人工发布审批，不代表允许发布 |
| Release 输出不建议发布 | 发布风险建议为暂缓发布申请或补齐阻断证据 |

禁止使用：

1. 准许合并。
2. 准许发布。
3. 门禁通过。
4. 可以上线。
5. 最终审批通过。

## 9. 门禁与人工确认

Agent 不得绕过门禁或人工确认。

必须转人工确认的场景：

1. P0/P1 风险是否接受或豁免。
2. 需求、业务规则、金额、状态、权限、监管或客户权益存在未确认。
3. 人工 Review、测试负责人、安全负责人、发布负责人或业务负责人确认缺失。
4. 发布范围、SQL、配置、回滚、生产验证计划不完整。
5. Skill 输出和 Gate 建议冲突。
6. Agent 执行降级后仍需进入下一流程。

## 10. 安全红线

所有整合链路必须遵守：

1. 不读取或输出生产账号、密码、Token、Cookie、Session、连接串、生产 IP 或内部密钥。
2. 不读取 `.env`、密钥文件、生产配置文件或生产凭证。
3. 不处理未脱敏客户敏感信息或未脱敏生产数据。
4. 不向外部服务提交客户敏感信息、生产数据或密钥。
5. 不直接操作生产环境。
6. 不自动提交、自动推送、自动合并、自动发布或自动回滚。
7. 不自动修改生产配置。
8. 不通过删除测试、降低断言、跳过 Review 或隐藏风险推动流程通过。

## 11. 维护规则

1. 新增 Agent 时，必须补充本文件映射表或说明不纳入 V2 首批映射。
2. 新增 Prompt、Skill、Gate 或 Schema 时，应检查是否影响现有 Agent 引用关系。
3. 修改门禁建议结论时，必须同步检查 Agent 层建议结论转换。
4. 修改安全红线、生产操作边界或自动化边界时，必须同步检查所有 Agent、Prompt、Skill、Gate 和 workflow。
5. 大型代码库导航、局部命令、排除路径、LSP/MCP 和治理 Owner 变化时，应同步检查 `docs/PROJ_CONTEXT.md`、`docs/LARGE_CODEBASE_AGENT_GUIDE.md` 和目标项目入口。
6. 真实目标项目安装差异由后续 `harness-assets/init/` manifest/profile 描述，不在本文件维护。
7. `context-capture-hook`（上下文捕获 Hook）在 Agent 会话结束时提出上下文更新建议，属于纯 advisory 模式，不自动写入任何长期上下文文件。建议归档后由 hicode Owner 人工确认归并。
