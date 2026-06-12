---
description: Use when the current or specified Git branch needs release analysis, release-report generation, SQL/config/script risk review, validation planning, rollback planning, or release-readiness evidence without granting approval.
---

# hicode release

## 定位

`hicode:release` 以当前 Git 分支或用户指定分支为主线，分析本次分支改动、对应需求文档、已知测试与 Review 证据、SQL/配置/脚本风险、验证计划和回滚计划，并生成发布报告。

本 Skill 只输出发布风险建议和证据缺口，不替代发布负责人、测试负责人、审批流程、CI/CD、发布平台、生产验证或回滚执行。

## 必读材料

执行前按需读取：

1. `../../references/rules/coding_rules.md`
2. `../../references/templates/feature/release-report.md`

同时读取目标项目中与本次发布直接相关的材料：`AGENTS.md` 或 `CLAUDE.md`、`docs/DOMAIN_KNOWLEDGE.md`、`docs/PROJ_CONTEXT.md`、`docs/rules/`、`docs/adr/`、`docs/features/<feature-id>/` 下的 feature 上下文和各阶段报告，以及分支、Commit、MR/PR、CI、测试、缺陷、SQL、配置、脚本、制品和发布材料。

若 `feature-id` 不明确，不得编造；可以先基于分支和 diff 输出临时报告，并把“需求目录未确认”列为证据缺口。需要落盘到 `docs/features/<feature-id>/release-report.md` 时，必须先确认 `feature-id`。

不得读取 `.env`、密钥文件、生产配置、生产凭证、未脱敏客户信息、未脱敏生产数据或生产日志原文。

## 执行流程

### 1. 固定发布分支范围

优先分析当前工作区所在分支；用户指定代码分支时，切换为分析该分支的可见 Git 对象和 diff，不自动 checkout。

必须记录：

1. 当前分支、用户指定分支、对比基准分支或基准 commit。
2. 是否在 `main`、`master` 或受保护主干上直接分析；若是，提示代码管理风险。
3. 分叉点：优先用目标分支与 `origin/main`、`main` 或用户指定基准的 `merge-base`。
4. 分叉点 commit 日期；距离当前日期超过 1 个月时，提示长期分支风险和 rebase/merge 复核建议。
5. 工作区未提交变更、未跟踪文件和本地领先/落后状态。

范围不清、基准不存在或分支不可解析时，输出 `NEEDS_CONFIRMATION`，不要给低风险发布建议。

### 2. 分析分支改动

读取 Git diff、commit 列表和变更文件清单，按业务代码、测试代码、接口、批处理、消息、任务、前端、SQL/DDL/DML/数据修复、配置、开关、权限、网关、CI/CD、构建、容器、部署、定时任务、文档和发布材料归类。

结合 `docs/features/` 中相关需求文档核对：本次改动是否能追溯到需求目标、范围、验收口径、风险基线和测试发布关注点。缺少对应需求文档、实现过程证据或需求与 diff 不匹配时，明确列为遗漏、错误或范围不明确风险。

### 3. 汇总已知验证信息

只汇总当前已知测试和验证证据，不重新设计“核心场景测试”。

必须区分已实际运行并有命令/报告/CI 链接的测试、文档声明但缺少证据的测试、未执行/失败/待确认的验证，以及 Review、提交检查、缺陷关闭、风险接受和人工确认材料。

缺少测试证据时，输出验证缺口和发布影响；不得声称测试通过或核心场景已覆盖。

### 4. 检查 SQL、配置和脚本风险

重点检查 SQL 是否具备影响范围、执行顺序、幂等/可重复执行、数据量、锁表风险、回滚或补偿方案；配置和开关是否具备默认值、环境差异、兼容性、权限、审计和回滚方式；脚本、批处理、迁移、部署和 CI/CD 是否具备执行边界、失败处理、重入安全和人工确认点；外部接口、消息、定时任务、缓存、异步补偿是否具备兼容和回滚说明。

涉及保险核心业务、金额、交易一致性、状态流转、幂等、权限、审计、隐私、监管、生产变更或回滚且证据不足时，最高风险不得低于 P1。

### 5. 生成发布报告

默认在回复中生成 Markdown 发布报告。若用户要求写入文件且 `feature-id` 已确认，基于 `../../references/templates/feature/release-report.md` 创建或更新 `docs/features/<feature-id>/release-report.md`。

报告必须包含：

1. 发布建议结论：`PASS`、`CONDITIONAL_PASS`、`BLOCKED` 或 `NEEDS_CONFIRMATION`。
2. 最高风险等级和一句话依据。
3. 发布分支范围、分叉时间、主干风险和未提交变更。
4. 主要实现需求分析：需求文档、实现过程证据、diff 对应关系、遗漏/错误/范围不明确。
5. 测试结论：仅汇总已知测试、CI、Review、缺陷和未验证项。
6. SQL、配置、脚本、接口和外部依赖检查情况。
7. 验证计划：发布前补证据、人工验证点、生产验证点、观察窗口和建议确认人。
8. 发布建议和阻断建议。
9. 回滚计划：触发条件、回滚对象、回滚动作类型、数据补偿、负责人和待确认事项。
10. 受限命令执行记录或未执行原因。
11. 本次创建、更新、跳过或缺失的 feature 文档清单。

## 禁止事项

始终禁止：

1. 自动发布、自动回滚、自动合并、自动提交或替代审批。
2. checkout、reset、rebase、merge、push、删除文件或修改生产发布材料，除非用户明确要求且风险可控。
3. 连接生产、执行生产 SQL、读取生产日志原文、调用生产接口或修改生产配置。
4. 输出生产操作命令、生产配置值、生产凭证或未脱敏客户/保单/支付数据。
5. 为推动发布隐藏 P0/P1 风险、忽略测试缺口、弱化 SQL/配置/脚本风险或编造验证结果。

不得输出“准许发布”“发布审批通过”“门禁通过”“可以上线”或生产执行命令。
