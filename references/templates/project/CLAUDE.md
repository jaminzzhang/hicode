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
2. `docs/PRD_CONTEXT.md`
3. `docs/DOMAIN_KNOWLEDGE.md`
4. `docs/CODING_RULES.md`
5. `docs/TESTING_GUIDE.md`
6. `docs/REVIEW_RULES.md`
7. `docs/RELEASE_GUIDE.md`
8. `docs/DEFECT_CASES.md`
9. `docs/ADR/`

不要为低风险小任务默认加载所有文档。

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
