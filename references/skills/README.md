# Skill 目录规范

## 1. 目录定位

本目录保存 V1 hicode Skill 源资产，用于把已确认的 Prompt、workflow、上下文文档和输出模板组织成可被 Agent 读取和执行的工程化能力。

Skill 不替代 Prompt、门禁、人工负责人或发布审批。Skill 的职责是完成入口路由、上下文读取、执行步骤、权限边界、验证记录和输出模板引用。

## 2. 设计参考

以下资料只作为本仓库 Skill 资产设计参考，不作为目标项目运行时必读上下文：

1. Claude Code Skills：`SKILL.md`、YAML frontmatter、按需支撑文件、保持主入口精简。
2. Agent Skills Specification：以 Skill 目录和 `SKILL.md` 作为可发现入口。
3. Superpowers：`description` 只描述触发条件，Skill 应可验证并能抵抗流程绕行。
4. Matt Pocock Skills：Skill 应服务明确工程动作，并依赖仓库上下文、领域文档和既有协作流程。

若以上外部资料中的规则需要强制执行，必须先转化为本目录下的本地规范、模板或具体 Skill。

## 3. 最小目录结构

每个 Skill 目录必须能独立被 Agent 读取。

```text
references/skills/
├── README.md
├── _template/
│   ├── SKILL.md
│   └── output-template.md
└── skill-name/
    ├── SKILL.md
    └── output-template.md
```

目录命名规则：

1. Skill 目录名使用 kebab-case，例如 `requirement-review`。
2. `SKILL.md` 是标准入口文件，必须大写。
3. `output-template.md` 是该 Skill 的默认输出结构。
4. 后续安装到目标项目后，路径为 `.hicode/skills/skill-name/SKILL.md`。

## 4. 可选支撑目录

只有确有需要时才创建可选目录，不创建空目录。

```text
skill-name/
├── references/
├── examples/
├── scripts/
└── assets/
```

| 目录 | 用途 | 约束 |
|---|---|---|
| `references/` | 长规则、外部资料本地化摘要、细分规范 | 不把外部网页作为运行时必读上下文 |
| `examples/` | 脱敏输入输出样例或压力场景 | 不包含真实客户敏感信息或生产数据 |
| `scripts/` | 可审计的本地辅助脚本 | 必须说明权限、输入、输出和禁止操作 |
| `assets/` | 静态模板、表格、检查清单 | 不放密钥、生产配置或真实数据 |

## 5. `SKILL.md` 规范

`SKILL.md` 默认使用以下 frontmatter：

```yaml
---
name: skill-name
description: Use when the user needs ...
---
```

规则：

1. `name` 必须与目录名一致。
2. `description` 必须以 `Use when` 开头，只写触发条件，不摘要执行流程。
3. 默认不使用 `allowed-tools`、`hooks`、`model`、`context` 等平台专属字段。
4. 只有必须人工显式触发的 Skill，才可在确认后使用 `disable-model-invocation: true`。

`SKILL.md` 必须包含：

1. 定位。
2. 适用场景。
3. 不适用场景。
4. 必读上下文。
5. 输入材料。
6. 执行步骤。
7. 输出。
8. 质量标准。
9. 安全约束。
10. 验证要求。
11. 上下文更新。

## 6. 与 Prompt 和输出模板的关系

V1 Skill 采用三层关系：

| 层级 | 文件 | 职责 |
|---|---|---|
| Skill 入口 | `SKILL.md` | 触发、路由、上下文读取、执行步骤、权限边界 |
| 场景 Prompt | 源资产为 `references/prompts/*.md`，安装后为 `.hicode/prompts/*.md` | 详细任务目标、检查维度、输出要求和约束 |
| 输出模板 | `output-template.md` | 固定报告结构，便于复用和检查 |

禁止把对应 Prompt 全文复制进 `SKILL.md`。Skill 应按需引用 Prompt、workflow、规范文档和输出模板。

## 7. 标准执行流程

每个 Skill 默认按以下流程执行：

1. 判断是否适用；不适用时路由到正确 Prompt、Skill 或人工流程。
2. 读取 `AGENTS.md`、对应 workflow、对应 Prompt 和必要 `docs/` 上下文。
3. 检查输入材料是否满足准入条件。
4. 按对应 Prompt 的检查维度执行分析、生成或检查。
5. 使用本目录的 `output-template.md` 输出报告。
6. 记录验证动作、受限命令执行结果或未执行原因。
7. 输出上下文更新建议。
8. 遇到敏感信息、生产越权或 P0/P1 风险时停止推进，并给出阻断或人工确认建议。

## 8. 安全边界

Skill 禁止：

1. 读取或输出密钥、Token、Cookie、Session、连接串、生产账号、生产 IP 或内部密钥。
2. 读取 `.env`、密钥文件、生产配置文件或生产凭证。
3. 处理未脱敏真实客户数据或未脱敏生产数据。
4. 自动提交、自动合并、自动发布、自动回滚或自动修改生产配置。
5. 执行数据库变更、生产连接、发布、回滚或删除未确认文件。
6. 通过删除测试、降低断言、跳过 Review 或隐藏风险推动流程通过。

## 9. 验证要求

每个具体 Skill 后续应至少具备一种验证材料：

1. 脱敏输入输出样例。
2. 压力场景。
3. 本地结构检查。
4. 受限命令执行记录。
5. 人工验收记录。

P4-WP1 只定义验证要求，不创建具体示例。具体示例由 P4-WP7 放入 `references/examples/`。

## 10. P4 计划中的 Skill 清单

| 场景 | Skill 目录 | 对应 Prompt |
|---|---|---|
| 需求评审 | `requirement-review/` | `references/prompts/requirement-review.md` |
| 编码计划 | `coding-plan/` | `references/prompts/coding-plan.md` |
| TDD | `tdd/` | `references/prompts/tdd.md` |
| 辅助编码 | `coding-assistant/` | `references/prompts/coding-assistant.md` |
| 代码审查 | `code-review/` | `references/prompts/code-review.md` |
| 提交检查 | `pre-commit-check/` | `references/prompts/pre-commit-check.md` |
| 核心场景测试 | `core-scenario-test/` | `references/prompts/core-scenario-test.md` |
| 发布检查 | `release-check/` | `references/prompts/release-check.md` |
