# hicode Archive

## 定位

`archive/` 是 hicode 历史归档区，用于保存从当前资产面移出的历史资料、旧目录结构、旧 Prompt、旧 Gate、旧 Schema、旧示例、旧 manifest/profile 和过去工作包材料。

归档资产只保留追溯价值，不是当前运行资产、安装资产、默认上下文或规则源。

## 使用边界

1. 当前 Skill、Agent、Rule、Template 和 Hook 不得依赖 `archive/` 作为执行依据。
2. `install.sh` 和 `.claude-plugin/plugin.json` 不得安装或暴露 `archive/` 为目标 Coding Agent 运行资产。
3. 不默认搜索或读取 `archive/`。
4. 只有在追溯历史决策、迁移旧内容、核对 V1/V2 来源或用户明确要求时，才按需读取归档资产。
5. 归档内容不得被写成当前审批、发布、合并或生产操作依据。

## 归档规则

1. 迁移历史资产时，尽量保留原始相对路径，便于追溯。
2. 若历史内容仍有当前价值，应先提炼到 `skills/`、`agents/`、`references/rules/`、`references/templates/` 或 `references/hooks/`，再归档原文。
3. 归档材料不得包含未脱敏客户敏感信息、生产数据、密钥、Token、生产地址或生产配置。
4. 归档不是删除；不通过归档隐藏风险、绕过 Review 或弱化安全红线。

## 已归档目录

V3-P2-WP2 已将以下旧 `references/` 一级目录整体迁入 `archive/references/`，并保留原目录名用于追溯：

1. `archive/references/docs/`
2. `archive/references/prompts/`
3. `archive/references/skills/`
4. `archive/references/gates/`
5. `archive/references/schemas/`
6. `archive/references/examples/`
7. `archive/references/init/`
8. `archive/references/target-project/`

这些目录中的内容尚未在本工作包拆解为当前规则或模板；后续 V3 工作包会按计划提炼仍有效内容。
