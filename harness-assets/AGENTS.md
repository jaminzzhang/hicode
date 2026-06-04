# AGENTS.md

本文件是目标项目的 Agent 第一入口模板。复制到试点仓库后，应根据该仓库的真实业务、技术栈、测试方式和发布流程补齐占位内容。

## 1. 项目说明

- 项目名称：待确认
- 项目类型：意健险研发相关系统 / 组件 / 工程资产，待确认
- 业务范围：待确认
- 技术负责人：待确认
- 测试负责人：待确认
- 发布负责人：待确认

AI Coding Agent 在本项目中只能作为研发辅助工具，不能替代产品、研发、测试、架构或发布负责人的最终判断。

## 2. 必须优先读取的上下文

执行任何研发任务前，优先读取：

1. `docs/DOMAIN_KNOWLEDGE.md`
2. `docs/PROJ_CONTEXT.md`
3. `docs/CODING_RULES.md`
4. `docs/TESTING_GUIDE.md`
5. `docs/REVIEW_RULES.md`
6. `docs/DEFECT_CASES.md`

如果任务与具体需求相关，还必须读取：

1. `docs/PRD_CONTEXT.md`

如果任务涉及发布，还必须读取：

1. `docs/RELEASE_GUIDE.md`

如果任务涉及架构决策，还必须读取：

1. `docs/ADR/README.md`
2. `docs/ADR/ADR-template.md`
3. 相关历史 ADR

## 3. 工作流程入口

| 场景 | 优先读取 | 建议使用 |
|---|---|---|
| 需求评审 | `docs/PRD_CONTEXT.md` | `.ai-harness/prompts/requirement-review.md` |
| 编码计划 | `docs/PRD_CONTEXT.md`、`docs/PROJ_CONTEXT.md` | `.ai-harness/prompts/coding-plan.md` |
| TDD | `docs/TESTING_GUIDE.md` | `.ai-harness/prompts/tdd.md` |
| 辅助编码 | `docs/CODING_RULES.md`、编码计划、TDD 输出 | `.ai-harness/prompts/coding-assistant.md` |
| 代码审查 | `docs/REVIEW_RULES.md`、`docs/DEFECT_CASES.md` | `.ai-harness/prompts/code-review.md` |
| 提交检查 | 编码计划、测试结果、Review 结果 | `.ai-harness/prompts/pre-commit-check.md` |
| 核心场景测试 | `docs/DOMAIN_KNOWLEDGE.md`、`docs/TESTING_GUIDE.md` | `.ai-harness/prompts/core-scenario-test.md` |
| 发布前检查 | `docs/RELEASE_GUIDE.md` | `.ai-harness/prompts/release-check.md` |

## 4. 安全规则

Agent 禁止执行以下行为：

1. 读取或输出生产账号、密码、Token、密钥。
2. 读取 `.env`、生产配置文件、密钥文件。
3. 向外部模型提交客户敏感信息。
4. 直接操作生产环境。
5. 自动合并 MR / PR。
6. 自动发布。
7. 自动修改生产配置。
8. 执行破坏性命令。
9. 删除未确认的代码、测试、配置、脚本或文档。

涉及姓名、身份证号、手机号、银行卡号、保单号、客户号、地址、邮箱、Token、Cookie、Session、数据库连接串、生产 IP、内部密钥等信息时，必须先脱敏。

## 5. 上下文更新规则

当任务产生新的领域知识、业务规则、关键流程、历史风险或技术决策时，应提出文档更新建议。

允许建议更新：

1. `docs/DOMAIN_KNOWLEDGE.md`
2. `docs/PROJ_CONTEXT.md`
3. `docs/PRD_CONTEXT.md`
4. `docs/CODING_RULES.md`
5. `docs/TESTING_GUIDE.md`
6. `docs/REVIEW_RULES.md`
7. `docs/RELEASE_GUIDE.md`
8. `docs/DEFECT_CASES.md`
9. `docs/ADR/`

更新原则：

1. 不直接覆盖重要内容。
2. 标明新增、修改或废弃。
3. 对不确定内容标注 `待确认`。
4. 涉及架构决策时，只生成 ADR 草稿，不自动合入。

## 6. 输出要求

所有审查、计划、测试、发布类输出应包含：

1. 结论
2. 依据
3. 风险等级
4. 建议动作
5. 待确认问题
6. 后续应更新的上下文
