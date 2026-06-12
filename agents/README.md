# 子 Agent 目录规范

## 1. 目录定位

本目录保存 hicode 子 Agent 源资产，用于为目标项目提供可委托的专门角色入口。

子 Agent 参考 ECC `agents/` 的 subagent delegation 模式，但只吸收适合保险/金融核心系统研发的角色委托、审查纪律和安全边界。子 Agent 不替代 Skill、Rule、Template、人工负责人或生产审批。

子 Agent 的职责是：

1. 定义稳定角色和委托触发条件。
2. 约束必读资产、权限边界和受限命令。
3. 强化 Prompt 防护、风险识别、证据要求和降噪标准。
4. 引导 Agent 按需引用当前 Skill、当前规则和输出模板。

子 Agent 不负责：

1. 复制规则全文。
2. 维护第二套当前规则。
3. 自动合并、自动发布、自动回滚或操作生产。
4. 替代负责人做最终需求、架构、Review、测试、发布或安全决策。

## 2. 目录结构

Agent 源资产采用单文件平铺结构。

```text
agents/
├── README.md
├── _template.md
├── requirement-reviewer.md
├── coding-planner.md
├── tdd-guide.md
├── coding-assistant.md
├── code-reviewer.md
├── security-reviewer.md
├── java-reviewer.md
└── release-reviewer.md
```

当前目录包含规范说明、通用模板和 8 个专业子 Agent。

## 3. 命名规则

1. Agent 文件名使用 kebab-case，例如 `code-reviewer.md`。
2. Agent `name` 必须与文件名去掉 `.md` 后一致。
3. Agent 名称应表达角色，不表达一次性任务。
4. 角色名优先使用研发流程和专业审查语义，例如 `requirement-reviewer`、`java-reviewer`。
5. 不为每个 Agent 创建独立目录；详细规则和输出模板由根目录 `skills/` 与 `skills/_shared/` 承载。

## 4. Frontmatter 规则

Agent 源资产默认只强制两个 frontmatter 字段：

```yaml
---
name: code-reviewer
description: Use when code changes need delegated review against hicode standards, requirements, tests, and insurance-core risks.
---
```

规则：

1. `name` 使用文件名同名 kebab-case。
2. `description` 必须以 `Use when` 开头，只描述触发条件和委托场景。
3. 不在源资产中强制 `tools`、`model`、`allowed-tools`、`hooks` 等平台专属字段。
4. 工具权限、模型建议和 Hook 配置后续由目标平台适配层或人工安装说明处理。
5. 正文必须明确权限边界和受限命令，不得让 frontmatter 替代治理规则。

## 5. Agent 模板结构

每个 Agent 使用 10 段式结构：

1. 角色定位
2. Agent 共性规则
3. 适用委托场景
4. 不适用场景
5. 必读资产
6. 委托执行流程
7. 权限与受限命令
8. 输出要求
9. 质量与降噪标准
10. 安全红线与停止条件

Agent 不单独维护“上下文更新”和“验证要求”章节，但必须在输出要求中包含上下文更新建议，并在执行流程或输出要求中记录验证动作或未执行原因。

## 6. Agent 共性规则

每个 Agent 必须引用 `../skills/_shared/rules/coding_rules.md` 中的 Agent 共性规则，不在 Agent 文件内复制 Prompt 防护、权限与受限命令、通用输出要求、安全红线和停止条件全文。

Agent 文件只维护：

1. 角色定位。
2. 适用和不适用场景。
3. 必读资产。
4. 专项委托流程。
5. 本 Agent 的质量与降噪标准。

## 7. 与 Skill、Rule 和 Template 的关系

Agent 是角色和委托入口，Skill 是可直接执行的流程说明，Rule 是短规则源，Template 是可填写输出骨架。

| 层级 | 职责 |
|---|---|
| Agent | 角色定位、委托触发、专项流程、审查纪律、降噪标准 |
| Skill | 执行步骤、上下文路由、输入准入、验证记录和模板引用 |
| Rule | Agent 共性规则、安全红线、风险基线、场景检查点和停止条件 |
| Template | 报告骨架、字段结构和可验收输出格式 |

Agent 可以引用 Skill、Rule 和 Template，但不得复制规则全文，不得维护第二套执行细则。涉及共性安全、权限、输出和停止条件时，以 `../skills/_shared/rules/coding_rules.md` 为准。

README 只维护映射原则，不维护首批 8 个 Agent 的完整规则副本。

## 8. 权限边界

Agent 默认是委托分析和审查角色，不自动获得本地修改、命令执行、提交、合并或发布权限。

权限边界：

1. 默认只读分析和生成建议。
2. 需要读取文件时，只读取当前委托任务必要上下文。
3. 需要执行命令时，只允许目标项目本地、非生产、低风险命令，并记录命令、范围、结果和未执行原因。
4. 涉及代码修改时，必须回到对应 Skill、TDD 或人工流程，不由审查型 Agent 直接修改。
5. 禁止生产连接、生产 SQL、生产日志读取、生产配置修改、发布、回滚、自动合并、自动提交和删除未确认文件。

## 9. 质量与降噪原则

Agent 输出必须高信号、可追溯、可执行。

通用质量要求：

1. 结论必须引用输入、上下文文档、代码 diff、测试结果、准入检查报告或负责人确认。
2. 风险必须使用 P0/P1/P2/P3 分级。
3. P0/P1 问题必须说明触发条件、失败场景、影响、依据和建议动作。
4. 不确定内容必须标注 `待确认`，不得写成事实。
5. 不制造发现；没有证据的问题应降级、标为待确认或不输出。
6. 不把风格偏好升级为高严重度问题。
7. 输出必须包含建议动作、待确认问题、验证记录或未执行原因、上下文更新建议。

代码审查类 Agent 应额外遵守：

1. 能引用具体文件或位置。
2. 能说明具体失败模式。
3. 已阅读必要上下文或标注上下文缺口。
4. 高严重度问题必须证明现有保护为什么不足。

## 10. 当前 Agent 清单

当前 Agent 只覆盖核心研发链路和 Java 专项：

| Agent | 定位 |
|---|---|
| `requirement-reviewer.md` | 需求评审委托角色 |
| `coding-planner.md` | 编码计划和上下文清晰门槛委托角色 |
| `tdd-guide.md` | TDD 测试先行委托角色 |
| `coding-assistant.md` | 辅助编码委托角色 |
| `code-reviewer.md` | 代码审查委托角色 |
| `security-reviewer.md` | 安全和敏感信息审查委托角色 |
| `java-reviewer.md` | Java/Spring/核心后端专项审查委托角色 |
| `release-reviewer.md` | 发布前证据汇总和发布风险审查委托角色 |

不要在首批引入低频、非核心或与保险核心研发流程无关的通用 Agent。

## 11. 安全红线

所有 Agent 必须遵守 `../skills/_shared/rules/coding_rules.md` 中的 Agent 共性规则。安全红线、权限边界、受限命令、通用输出要求和停止条件只在规则文件维护，Agent README 不复制全文。

## 12. 验收要求

本目录规范完成时应满足：

1. `agents/README.md` 明确目录定位、命名、frontmatter、模板结构和安全边界。
2. `agents/_template.md` 可被用于创建后续 Agent。
3. README 和模板均明确 Agent 不复制规则全文、不维护第二套规则。
4. README 和模板均明确自动化红线。
5. README 不维护完整 Agent/Skill/Rule/Template 映射表。
