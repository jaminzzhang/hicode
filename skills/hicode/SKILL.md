---
description: Use when a target project needs to understand or start hicode workflows for insurance and financial core system Coding Agent work.
---

# hicode

## 定位

hicode 是面向保险/金融核心系统研发的 Coding Agent 工程化体系。它提供 Agent 入口规则、上下文模板、Prompt、Skill、门禁、Schema、示例、子 Agent 和 Hook 规划资产。

本 plugin 只提供 hicode 入口说明，不执行目标项目初始化。

本 Skill 是 hicode 引导型总入口 Skill，负责先判断目标项目是否具备 hicode 上下文资产，再决定是引导初始化准备，还是路由到 `scope`、`tdd`、`review`、`release` 场景 Skill。它不是普通 README 的复制。

## 能力入口

当前 plugin 提供 5 个 Claude Code Skill 能力入口：

1. `hicode:init`：目标项目初始化，创建或补充 `CLAUDE.md` / `AGENTS.md`、项目上下文和 RULES 文档。
2. `hicode:scope`：需求澄清、范围界定、编码计划和准入证据。
3. `hicode:tdd`：TDD、测试先行和辅助编码准入。
4. `hicode:review`：代码审查、提交检查、安全/Java/SQL 专项审查。
5. `hicode:release`：核心场景测试、发布检查、回滚和发布风险。

这些入口只按需读取 `references/` 支撑文件，不默认加载全部 Harness 资产。

## 首次使用诊断

进入 hicode 任务时，先判断当前目标项目的初始化状态。只做轻量文件存在性和入口信息判断，不进行全仓代码扫描。

检查顺序：

1. 是否存在 Agent 入口文件：`AGENTS.md` 或 `CLAUDE.md`。
2. 是否存在项目术语或上下文入口：`CONTEXT.md`、`docs/PROJ_CONTEXT.md` 或同等项目上下文文档。
3. 是否存在 hicode 运行资产目录：`.hicode/`。
4. 是否能识别项目类型、技术栈、风险等级和当前任务目标。

初始化状态分为：

1. `未初始化`：缺少 Agent 入口文件，且缺少项目上下文入口或 `.hicode/`。
2. `部分初始化`：存在部分入口或上下文，但缺少关键说明、`.hicode/` 资产或 hicode profile 选择记录。
3. `已初始化`：存在 Agent 入口、项目上下文和 hicode 运行资产，且当前任务可找到清晰规则来源。
4. `需修复`：入口、上下文或 `.hicode/` 资产之间存在明显冲突、过期路径或安全边界缺失。

## 未初始化时的默认引导

当目标项目为 `未初始化` 或用户明确表示“不知道该做什么”时，不要直接进入编码、Review 或发布流程。先输出初始化引导：

1. 当前诊断：说明缺少哪些入口或上下文资产。
2. 影响判断：说明缺少上下文会导致需求范围、风险标准、测试准入和 Review 依据不稳定。
3. 建议初始化 profile：
   - `core`：通用轻量闭环，适合先建立入口、上下文和基础门禁。
   - `java-insurance-core`：适合 Java、SQL、保险核心业务和金融核心系统高风险项目。
   - `full-library`：适合需要完整导入 hicode 资产库的试点或治理项目。
4. 初始化输入清单：项目名称、技术栈、核心模块、业务域、风险等级、现有规范路径、是否允许创建 `.hicode/`。
5. 下一步动作：请用户确认是否进入 `hicode:init`，并确认允许写入的文件范围。

未初始化时默认不生成或修改 `AGENTS.md`、`CLAUDE.md`、`CONTEXT.md`、`docs/PROJ_CONTEXT.md` 或 `.hicode/`。

## 初始化写入边界

只有用户明确要求初始化目标项目，并确认写入范围后，才可以协助生成或修改目标项目文件。

允许建议的目标资产包括：

1. `AGENTS.md` 或 `CLAUDE.md`：目标项目 Coding Agent 入口。Claude Code 使用 `CLAUDE.md`；OpenCode、Codex 和其他 Coding Agent 使用 `AGENTS.md`。
2. `CONTEXT.md`：目标项目术语和概念边界。
3. `docs/PROJ_CONTEXT.md`：项目结构、模块、流程、接口、数据和历史风险上下文。
4. 项目规则文档：`docs/CODING_RULES.md`、`docs/TESTING_GUIDE.md`、`docs/REVIEW_RULES.md`、`docs/RELEASE_GUIDE.md` 等。
5. `.hicode/`：仅在用户明确要求离线固化、本地锁版本或项目内自定义 hicode 能力时，才按 `references/init/` manifest 规划创建。

初始化前必须说明：

1. Claude Code plugin 安装和目标项目 hicode 初始化是两个动作。
2. `install.sh` 只安装当前用户 Claude Code plugin，不扫描目标项目，不生成目标项目文件。
3. hicode init 需要单独确认目标目录、profile 和写入文件范围。

## 路由规则

1. 目标项目 `未初始化`、`部分初始化` 或 `需修复` 时，先完成初始化引导或修复建议，再进入场景 Skill。
2. 用户明确要求初始化目标项目 hicode 时，转 `hicode:init`。
3. 需求不清、范围不清、编码前计划或准入证据不足时，转 `hicode:scope`。
4. 需要测试先行、TDD、修复复现、受控实现或辅助编码时，转 `hicode:tdd`。
5. 需要代码审查、提交检查、安全/Java/SQL 专项审查或合并证据时，转 `hicode:review`。
6. 需要核心场景测试、发布材料、回滚、生产变更风险或发布准入证据时，转 `hicode:release`。

## 使用边界

使用本入口时必须遵守：

1. 不扫描目标项目代码，除非用户在后续初始化或任务中明确要求。
2. 不生成 `CLAUDE.md`、`AGENTS.md`、`CONTEXT.md`、`docs/PROJ_CONTEXT.md` 或 `.hicode/`，除非用户明确进入 `hicode:init` 并确认写入范围。
3. 不读取 `.env`、密钥文件、生产配置、生产凭证或未脱敏客户数据。
4. 不操作生产环境，不自动合并、自动发布、自动回滚或修改生产配置。
5. 涉及保险核心业务规则、金额、状态流转、幂等、权限、审计、隐私、监管、生产变更或回滚时，按高风险任务处理。

## 后续初始化

若用户要求在某个目标项目中初始化 hicode，应转入 `hicode:init`。初始化默认写入目标项目入口文件和项目文档，不复制 plugin 内置的 Agent、Prompt、Skill、Gate 或 Schema 到 `.hicode/`。

如用户明确要求固化 hicode 能力快照，应先确认初始化范围，再使用 hicode 仓库中的 `references/init/` 规划资产：

1. 读取 `references/init/README.md`，确认初始化规划口径。
2. 根据目标项目风险选择 `references/init/profiles/` 下的 profile。
3. 根据 profile 引用的 manifest 确认源资产和目标路径。
4. 只在用户确认后写入目标项目文件。

初始化流程应单独执行，不由本 plugin 安装动作自动触发。

## 输出要求

回答 hicode 相关问题时，默认包含：

1. 结论。
2. 依据或证据来源。
3. 风险等级。
4. 建议动作。
5. 待确认问题。
6. 建议更新的上下文或 hicode 资产。

未初始化引导输出必须包含：

1. 初始化状态：`未初始化`、`部分初始化`、`已初始化` 或 `需修复`。
2. 缺失资产：列出缺失或冲突的入口、上下文和 `.hicode/` 资产。
3. 推荐 profile：说明推荐 `core`、`java-insurance-core` 或 `full-library` 的理由。
4. 写入边界：列出需要用户确认的目标文件范围。
5. 下一步确认项：用具体问题确认是否进入 hicode init。
