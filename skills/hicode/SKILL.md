---
description: Use when a target project needs to understand or start hicode workflows for insurance and financial core system Coding Agent work.
---

# hicode

## 定位

hicode 是面向保险/金融核心系统研发的 Coding Agent 工程化体系。它提供 Agent 入口规则、上下文模板、Prompt、Skill、门禁、Schema、示例、子 Agent 和 Hook 规划资产。

本 plugin 只提供 hicode 入口说明，不执行目标项目初始化。

本 Skill 是 hicode 总入口 Skill，负责识别任务场景、选择合适的场景 Skill、说明安全边界和处理初始化请求。它不是普通 README 的复制。

## 能力入口

当前 plugin 提供 4 个 Claude Code Skill 能力入口：

1. `hicode:scope`：需求澄清、范围界定、编码计划和准入证据。
2. `hicode:tdd`：TDD、测试先行和辅助编码准入。
3. `hicode:review`：代码审查、提交检查、安全/Java/SQL 专项审查。
4. `hicode:release`：核心场景测试、发布检查、回滚和发布风险。

这些入口只按需读取 `references/` 支撑文件，不默认加载全部 Harness 资产。

## 路由规则

1. 需求不清、范围不清、编码前计划或准入证据不足时，转 `hicode:scope`。
2. 需要测试先行、TDD、修复复现、受控实现或辅助编码时，转 `hicode:tdd`。
3. 需要代码审查、提交检查、安全/Java/SQL 专项审查或合并证据时，转 `hicode:review`。
4. 需要核心场景测试、发布材料、回滚、生产变更风险或发布准入证据时，转 `hicode:release`。
5. 用户明确要求初始化目标项目 hicode 时，先说明 plugin 安装与项目初始化不同，再按需读取 `references/init/`。

## 使用边界

使用本入口时必须遵守：

1. 不扫描目标项目代码，除非用户在后续初始化或任务中明确要求。
2. 不生成 `CLAUDE.md`、`AGENTS.md` 或 `.hicode/`，除非进入后续 hicode init 流程。
3. 不读取 `.env`、密钥文件、生产配置、生产凭证或未脱敏客户数据。
4. 不操作生产环境，不自动合并、自动发布、自动回滚或修改生产配置。
5. 涉及保险核心业务规则、金额、状态流转、幂等、权限、审计、隐私、监管、生产变更或回滚时，按高风险任务处理。

## 后续初始化

若用户要求在某个目标项目中初始化 hicode，应先确认初始化范围，再使用 hicode 仓库中的 `references/init/` 规划资产。

初始化流程应单独执行，不由本 plugin 安装动作自动触发。

## 输出要求

回答 hicode 相关问题时，默认包含：

1. 结论。
2. 依据或证据来源。
3. 风险等级。
4. 建议动作。
5. 待确认问题。
6. 建议更新的上下文或 hicode 资产。
