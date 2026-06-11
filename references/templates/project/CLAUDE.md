# CLAUDE.md

本文件是目标项目 Claude Code 第一入口。复制到目标项目后，应按真实业务、技术栈、测试方式和发布流程补齐 `待确认`。

## 项目定位

| 项 | 内容 |
|---|---|
| 项目名称 | 待确认 |
| 项目类型 | 待确认 |
| 业务范围 | 待确认 |
| 技术栈 | 待确认 |
| 技术负责人 | 待确认 |
| 测试负责人 | 待确认 |
| 发布负责人 | 待确认 |

Claude Code 只提供研发辅助建议，不替代产品、研发、测试、架构、Review、发布或安全负责人的最终判断。

## 默认风险基线

所有需求、代码、测试和发布检查默认覆盖：

1. 保险核心业务逻辑严谨性。
2. 金额精度。
3. 交易一致性。
4. 状态流转。
5. 幂等与并发。
6. 权限与审计。
7. 客户隐私与监管合规。
8. 生产变更、回滚和发布准入。

## 上下文读取

先读本文件，再按任务读取：

1. `docs/PROJ_CONTEXT.md`
2. `docs/DOMAIN_KNOWLEDGE.md`
3. 当前需求相关 `docs/features/<feature-id>/feature_context.md`
4. 当前需求相关 `docs/features/<feature-id>/` 下的评审、Scope、TDD、Review 和发布报告
5. `docs/rules/`
6. `docs/adr/`

不要为低风险小任务默认加载所有文档。

## 目标项目文档目录

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

## 强制编码规则

编码、测试生成、代码审查和提交检查必须遵循 hicode 内置规则 `references/rules/coding_rules.md`。

目标项目 `docs/CODING_RULES.md` 用于补充本项目技术栈、模块和团队规则；只能补充或加严内置规则，不能放宽入口校验、幂等、事务、外部调用、并发、状态机、异常、安全合规、审计、去魔法值、核心测试、注释和类型控制要求。

## hicode Skill 路由

| 场景 | 推荐 Skill |
|---|---|
| 总入口、首次诊断、用法简介和路由判断 | `hi` |
| 项目初始化 | `hicode:init` |
| 需求到编码前 | `hicode:scope` |
| TDD 与辅助编码 | `hicode:tdd` |
| Review 与提交检查 | `hicode:review` |
| 发布检查、生产验证计划、发布风险判断 | `hicode:release` |

## 禁止事项

禁止读取或输出密钥、生产配置、未脱敏客户信息、未脱敏生产数据；禁止连接生产、自动合并、自动发布、自动回滚、删除测试、降低断言或跳过 Review。

## 输出格式

默认输出建议结论、依据、风险等级、建议动作、待确认问题、验证记录和上下文更新建议。
