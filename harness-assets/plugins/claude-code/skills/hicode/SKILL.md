---
description: Use when a target project needs to understand or start hicode workflows for insurance and financial core system Coding Agent work.
---

# hicode

## 定位

hicode 是面向保险/金融核心系统研发的 Coding Agent 工程化体系。它提供 Agent 入口规则、上下文模板、Prompt、Skill、门禁、Schema、示例、子 Agent 和 Hook 规划资产。

本 plugin 只提供 hicode 入口说明，不执行目标项目初始化。

## 使用边界

使用本入口时必须遵守：

1. 不扫描目标项目代码，除非用户在后续初始化或任务中明确要求。
2. 不生成 `CLAUDE.md`、`AGENTS.md` 或 `.hicode/`，除非进入后续 hicode init 流程。
3. 不读取 `.env`、密钥文件、生产配置、生产凭证或未脱敏客户数据。
4. 不操作生产环境，不自动合并、自动发布、自动回滚或修改生产配置。
5. 涉及保险核心业务规则、金额、状态流转、幂等、权限、审计、隐私、监管、生产变更或回滚时，按高风险任务处理。

## 后续初始化

若用户要求在某个目标项目中初始化 hicode，应先确认初始化范围，再使用 hicode 仓库中的 `harness-assets/init/` 规划资产。

初始化流程应单独执行，不由本 plugin 安装动作自动触发。

## 输出要求

回答 hicode 相关问题时，默认包含：

1. 结论。
2. 依据或证据来源。
3. 风险等级。
4. 建议动作。
5. 待确认问题。
6. 建议更新的上下文或 hicode 资产。
