# V2 验收检查清单

> 本清单用于验收 hicode V2 仓库资产，不代表真实目标项目已经安装、试点运行或产生效果数据。

## 1. 验收定位

V2 验收只确认本仓库中的 Agent、整合规范、选择性初始化规划、Hook 设计、Coding Agent plugin 安装器、回归样例和安全红线是否齐备、一致、可人工审查。

V2 验收不包含：

1. 真实目标项目安装结果。
2. 真实 CI/CD、MR 平台或发布平台接入。
3. 真实试点覆盖率、采纳率或有效问题率。
4. 自动合并、自动发布、自动回滚或生产操作。

## 2. 目录与资产完整性

| 检查项 | 期望结果 | 证据路径 | 状态 |
|---|---|---|---|
| V2 计划存在 | 有已确认的 V2 实施计划 | `docs/V2_IMPLEMENTATION_PLAN.md` | 待验收 |
| V2 ADR 存在 | 记录 ECC 启发但不复制全量体系的决策 | `docs/adr/0001-adopt-ecc-inspired-hicode-v2-architecture.md` | 待验收 |
| Agent 源目录存在 | 目录、README 和模板齐备 | `agents/` | 待验收 |
| init 源目录存在 | README、manifests、profiles 齐备 | `references/init/` | 待验收 |
| Hook 源目录存在 | README、模板、`hook.json` 和核心 Hook 示例齐备 | `references/hooks/` | 待验收 |
| Plugin 源目录存在 | Claude Code plugin 源资产和安装器齐备 | `./` | 待验收 |
| V2 回归样例存在 | Agent、init、Hook 三类回归样例齐备 | `references/examples/regression/` | 待验收 |

## 3. 子 Agent 验收

| 检查项 | 期望结果 | 证据路径 | 状态 |
|---|---|---|---|
| 首批 8 个 Agent 齐备 | 覆盖需求评审、编码计划、TDD、辅助编码、代码审查、安全审查、Java 审查、发布审查 | `agents/*.md` | 待验收 |
| Agent 不复制 Prompt 全文 | Agent 只作为角色入口，引用 Prompt/Skill/Gate 规则源 | `agents/README.md`、各 Agent 文件 | 待验收 |
| Agent 有安全红线 | 覆盖密钥、客户隐私、生产数据、生产越权、自动合并发布 | 各 Agent 文件 | 待验收 |
| Agent 输出为建议性质 | 不输出最终审批、合并许可或发布许可 | 各 Agent 文件 | 待验收 |
| 受控修改边界明确 | 只有 `coding-assistant` 可在约束下承接生产代码实现；`tdd-guide` 只改测试相关资产 | `CONTEXT.md`、Agent 文件 | 待验收 |

## 4. Agent-Prompt-Skill-Gate 整合验收

| 检查项 | 期望结果 | 证据路径 | 状态 |
|---|---|---|---|
| 职责边界清晰 | Agent 是角色入口，Prompt 是规则源，Skill 是流程路由，Gate 是准入建议，Schema 是结构化校验 | `references/docs/AGENT_PROMPT_INTEGRATION.md` | 待验收 |
| 冲突优先级清晰 | 安全红线优先，其次用户最新明确指令、入口规则和本地资产规则 | `references/docs/AGENT_PROMPT_INTEGRATION.md` | 待验收 |
| 降级口径清晰 | 缺 Agent/Prompt/Skill/Gate/Schema/上下文时明示缺失、影响和补齐建议 | `references/docs/AGENT_PROMPT_INTEGRATION.md` | 待验收 |
| 委托流程可执行 | 有统一任务路由、证据闭环和上下文更新建议 | `references/docs/workflows/agent-delegation.md` | 待验收 |
| 目标项目入口已更新 | 入口包含子 Agent 路由和统一建议结论 | `references/target-project/AGENTS.md` | 待验收 |

## 5. 选择性初始化验收

| 检查项 | 期望结果 | 证据路径 | 状态 |
|---|---|---|---|
| `DAILY/LIBRARY` 口径清晰 | DAILY 表示日常默认可用，LIBRARY 表示可检索按需调用 | `references/init/README.md`、`CONTEXT.md` | 待验收 |
| manifest 字段完整 | 条目包含 `id`、`source`、`target`、`load_tier`、`scenarios`、`requires` | `references/init/manifests/*.json` | 待验收 |
| profile 边界清晰 | `core`、`java-insurance-core`、`full-library` 含义明确 | `references/init/profiles/*.json` | 待验收 |
| profile 不改写分层 | profile 只选择资产，不覆盖 manifest 的 `load_tier` 语义 | `references/init/profiles/*.json` | 待验收 |
| 不生成隐藏源目录 | 本仓库不维护 `根目录 `.hicode/`/` | 仓库目录 | 待验收 |

## 6. Hook 验收

| 检查项 | 期望结果 | 证据路径 | 状态 |
|---|---|---|---|
| Hook 范围收敛 | 首批只覆盖编码准入门禁 Hook 和合并门禁 Hook | `references/hooks/README.md` | 待验收 |
| Hook 模式清晰 | 默认 advisory；blocking 只用于安全红线、生产越权和流程绕行 | `references/hooks/README.md`、`hook.json` | 待验收 |
| Hook 可审查 | 核心 Hook 示例包含触发点、输入、输出、blocking 条件、禁止动作和审计证据 | `references/hooks/*-hook.md` | 待验收 |
| 平台示例真实可辨 | Claude 和 OpenCode 示例分别说明原生配置形态和边界 | `references/hooks/*-hook.md` | 待验收 |
| Hook 不授权生产操作 | 不自动合并、发布、回滚、连接生产、执行生产 SQL 或读取生产日志 | `references/hooks/README.md`、`CONTEXT.md` | 待验收 |

## 7. 回归样例验收

## 7. Coding Agent Plugin 验收

| 检查项 | 期望结果 | 证据路径 | 状态 |
|---|---|---|---|
| 安装器参数齐备 | 支持 `--dry-run`、`--yes`、`--claude-code` | `install.sh` | 待验收 |
| Claude Code 原生格式有效 | marketplace 和 plugin manifest 可通过 Claude Code validate | `.claude-plugin/` | 待验收 |
| 能力 Skill 齐备 | 提供 `hicode`、`scope`、`tdd`、`review`、`release` 五个 Skill | `skills/` | 待验收 |
| 只安装平台 plugin | 不扫描代码、不生成 `CLAUDE.md`、`AGENTS.md` 或 `.hicode/` | `./README.md`、`install.sh` | 待验收 |
| 用户级安装可审计 | Claude Code 使用本地 marketplace；安装器不修改业务仓库 | `install.sh` | 待验收 |

## 8. 回归样例验收

| 检查项 | 期望结果 | 证据路径 | 状态 |
|---|---|---|---|
| Agent 回归覆盖关键路径 | 覆盖正常委托、Prompt 缺失降级、Gate/Schema 缺失、专项降噪、安全红线 | `references/examples/regression/agent-delegation-regression.md` | 待验收 |
| install 回归覆盖分层风险 | 覆盖 `core`、`java-insurance-core`、`full-library`、`DAILY/LIBRARY` 分类错误和 Hook 可选安装 | `references/examples/regression/install-profile-regression.md` | 待验收 |
| Hook 回归覆盖边界 | 覆盖编码准入 advisory/blocking、合并 advisory/blocking、生产越权拒绝 | `references/examples/regression/hook-gate-regression.md` | 待验收 |
| 回归样例可人工执行 | 包含回归目标、适用资产、脱敏输入、执行步骤、期望输出要点、失败判定和禁止事项 | 三个 V2 回归样例文件 | 待验收 |
| 回归样例不声称真实运行 | 不包含真实安装、真实 Hook 执行或真实试点结果 | 三个 V2 回归样例文件 | 待验收 |

## 9. 安全红线验收

| 检查项 | 期望结果 | 证据路径 | 状态 |
|---|---|---|---|
| 自动合并禁止 | 任何 Agent、Hook、Gate、Checklist 都不得授权自动合并 | `CONTEXT.md`、`agents/`、`skills/`、`references/` | 待验收 |
| 自动发布禁止 | 任何资产都不得授权自动发布、自动回滚 | `CONTEXT.md`、`agents/`、`skills/`、`references/` | 待验收 |
| 生产操作禁止 | 不连接生产、不执行生产 SQL、不读取生产日志原文、不修改生产配置 | `CONTEXT.md`、`agents/`、`skills/`、`references/` | 待验收 |
| 敏感信息禁止 | 不读取、输出或沉淀密钥、Token、未脱敏客户信息和未脱敏生产数据 | `AGENTS.md`、`CONTEXT.md`、`agents/`、`skills/`、`references/` | 待验收 |
| 风险标准不降低 | 金融核心系统风险标准持续覆盖金额、状态、幂等、权限、审计、隐私、监管、回滚 | `CONTEXT.md`、`references/docs/` | 待验收 |

## 10. 验收结论记录

| 项目 | 内容 |
|---|---|
| 验收日期 |  |
| 验收人 |  |
| 验收范围 | V2 仓库资产 |
| 结论 | 通过 / 有条件通过 / 不通过 / 待确认 |
| 未关闭问题 |  |
| 后续动作 |  |

## 11. 禁止事项

1. 不把 V2 仓库资产验收写成真实目标项目安装完成。
2. 不把回归样例通过写成真实试点效果达成。
3. 不把 Hook 设计写成真实平台阻断已经生效。
4. 不为了验收通过降低 P0/P1 风险等级。
5. 不自动合并、自动发布、自动回滚或操作生产环境。
