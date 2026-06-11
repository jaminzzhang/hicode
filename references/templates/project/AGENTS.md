# AGENTS.md

本文件是目标项目 Coding Agent 第一入口。复制到目标项目后，应按真实业务、技术栈、测试方式和发布流程补齐 `待确认`。

## 1. 项目定位

| 项 | 内容 |
|---|---|
| 项目名称 | 待确认 |
| 项目类型 | 待确认 |
| 业务范围 | 待确认 |
| 技术栈 | 待确认 |
| 技术负责人 | 待确认 |
| 测试负责人 | 待确认 |
| 发布负责人 | 待确认 |

AI Coding Agent 只提供分析、计划、实现辅助、Review、测试和发布检查建议，不替代负责人最终判断。

默认按保险/金融核心系统风险标准处理：保险核心业务逻辑严谨性、金额、交易一致性、状态流转、幂等、权限、审计、客户隐私、监管合规、生产变更、回滚和发布准入。

## 2. 上下文读取顺序

1. `AGENTS.md`
2. `docs/PROJ_CONTEXT.md`
3. `docs/DOMAIN_KNOWLEDGE.md`
4. 当前需求相关 `docs/features/<feature-id>/feature_context.md`
5. 按任务读取 `docs/features/<feature-id>/` 下的评审、Scope、TDD、Review 和发布报告
6. 按任务读取 `docs/rules/`、`docs/adr/` 和其他项目规则文档

不要一次性读取全部文档；按任务范围读取必要材料。

## 3. 目标项目文档目录

项目级共享文档：

| 路径 | 用途 | 维护规则 |
|---|---|---|
| `docs/DOMAIN_KNOWLEDGE.md` | 领域术语、业务域、保险核心场景和可复用业务规则 | 负责人确认后写入 |
| `docs/PROJ_CONTEXT.md` | 项目定位、模块结构、核心流程、接口依赖、数据状态、局部命令和历史风险 | 负责人确认后写入 |
| `docs/adr/` | 架构、治理或难逆决策记录 | 决策人确认后写入 |
| `docs/rules/` | 目标项目本地规则 | 只能补充或加严 hicode 内置规则 |

单需求或单特性文档：

| 路径 | 用途 | 生成入口 |
|---|---|---|
| `docs/features/<feature-id>/feature_context.md` | 单需求目标、范围、规则、风险、影响范围、测试和发布关注点 | `hicode:scope` |
| `docs/features/<feature-id>/requirement-review-report.md` | 需求评审报告 | `hicode:scope` |
| `docs/features/<feature-id>/scope-report.md` | Scope 总结报告 | `hicode:scope` |
| `docs/features/<feature-id>/task-split-plan.md` | 拆分任务计划 | `hicode:scope` |
| `docs/features/<feature-id>/tdd-report.md` | TDD 和受控实现记录 | `hicode:tdd` |
| `docs/features/<feature-id>/review-report.md` | Review 和专项审查报告 | `hicode:review` |
| `docs/features/<feature-id>/release-report.md` | 发布检查和回滚风险报告 | `hicode:release` |

当目标文档不存在时，对应 Skill 应先读取 hicode 模板，再按需创建文档；不得编造需求编号、负责人、业务规则或验证结果。

## 4. 强制编码规则

编码、测试生成、代码审查和提交检查必须遵循 hicode 内置规则 `references/rules/coding_rules.md`。

目标项目 `docs/CODING_RULES.md` 用于补充本项目技术栈、模块和团队规则；只能补充或加严内置规则，不能放宽入口校验、幂等、事务、外部调用、并发、状态机、异常、安全合规、审计、去魔法值、核心测试、注释和类型控制要求。

## 5. 推荐 hicode Skill

| 场景 | 推荐 Skill |
|---|---|
| 总入口、首次诊断、用法简介和路由判断 | `hi` |
| 首次初始化或补齐项目上下文 | `hicode:init` |
| 需求评审、范围界定、编码计划 | `hicode:scope` |
| TDD、测试先行、辅助编码 | `hicode:tdd` |
| 代码审查、提交检查、专项审查 | `hicode:review` |
| 发布检查、生产验证计划、发布风险判断 | `hicode:release` |

## 6. 安全边界

Agent 禁止：

1. 读取或输出密钥、Token、Cookie、Session、连接串、生产账号、生产 IP 或内部密钥。
2. 读取 `.env`、生产配置、生产凭证或未脱敏生产日志。
3. 处理未脱敏客户敏感信息或未脱敏生产数据。
4. 直接操作生产环境、生产数据库、发布、回滚或生产配置。
5. 自动提交、推送、合并、发布或替代负责人审批。
6. 删除测试、降低断言、跳过 Review 或隐藏风险。

## 7. 输出要求

分析、计划、测试、Review 和发布类输出应包含：

1. 建议结论。
2. 依据或证据来源。
3. 最高风险等级。
4. 建议动作。
5. 待确认问题。
6. 验证动作或未执行原因。
7. 上下文更新建议。
