# 合并前检查 Hook

## 1. 定位

本文是 `merge-gate-hook` 的当前行为说明，用于描述 Coding Agent 准备提交、推送、创建 MR/PR 或请求合并前应检查的 Review、测试、敏感信息和 P0/P1 风险证据。

本 Hook 不是平台原生配置，不由 `install.sh` 自动启用，不声明目标安装路径。若目标平台需要自动触发，必须由用户或平台负责人另行确认适配范围。

本 Hook 不替代 `skills/review/SKILL.md`、人工 Reviewer、模块 Owner、研发负责人、质量负责人、CI/CD 或代码托管平台的最终判断，不自动批准、不自动提交、不自动推送、不自动合并、不自动打 Tag、不自动发布。

## 2. 追溯关系

| 项 | 内容 |
|---|---|
| Hook ID | `merge-gate-hook` |
| 行为目录 | `hooks/hook.json` |
| 相关 Skill | `skills/review/SKILL.md` |
| 规则依据 | `skills/init/coding_rules.md`、`target-project:docs/rules/` |
| 默认模式 | `advisory` |
| 建议适配事件 | `before_commit`、`before_push`、`before_merge_request` |

## 3. 触发点

当 Coding Agent 准备执行以下本地动作时，可触发本 Hook：

1. `git commit` 前。
2. `git push` 前。
3. 创建 MR/PR 前。
4. 请求合并前。

本 Hook 只约束合并前证据，不执行合并、不批准 Review、不操作发布流程。

## 4. 输入材料

必须检查以下材料是否存在或已有等价证据：

1. diff 范围。
2. AI Review 报告。
3. 人工 Review 状态。
4. CI 或本地检查结果。
5. 测试证据。
6. 覆盖率结果或不适用说明。
7. P0/P1 问题状态。
8. 敏感信息扫描结果。

不得要求真实客户敏感信息、未脱敏生产数据、生产配置、生产日志原文、密钥或生产凭证。

## 5. Advisory 输出

提醒型输出应包含：

```json
{
  "hook_id": "merge-gate-hook",
  "mode": "advisory",
  "recommendation": "发现高风险，建议先修复或补证据",
  "highest_risk_level": "P1",
  "evidence_summary": ["AI Review 已完成", "人工 Review 缺失", "CI 结果缺失"],
  "blocking_recommendations": ["补齐人工 Review 和 CI 结果后再请求合并"],
  "risk_notes": ["当前缺少覆盖率趋势说明"],
  "recommended_actions": ["运行本地测试或等待 CI 完成", "补齐人工 Reviewer 确认"],
  "pending_questions": ["P1 风险是否已有负责人确认"],
  "audit_evidence": ["diff scope", "AI review report", "test evidence"]
}
```

不得输出“允许合并”“最终审批通过”“允许发布”或“可以上线”等审批口径。

## 6. Blocking 条件

以下情况可以阻断当前 Coding Agent 动作：

1. 用户要求自动合并。
2. 用户要求自动发布。
3. 存在未关闭 P0。
4. 存在未关闭 P1 且无负责人确认。
5. AI Review 缺失或存在阻断建议。
6. 人工 Review 缺失或未通过。
7. CI 失败且无解释。
8. 覆盖率低于硬阈值且无负责人确认。
9. 用户要求跳过 Review。
10. 用户要求删除测试或降低断言以推动通过。
11. 发现密钥、Token、未脱敏客户敏感信息或未脱敏生产数据。
12. 用户要求生产操作。

普通 P2/P3 提示项不得升级为 blocking。

## 7. 可选适配边界

目标平台若实现自动触发，必须满足：

1. 由用户或平台负责人明确确认启用范围。
2. 只匹配提交、推送、创建 MR/PR 或请求合并相关动作。
3. 只读取本地、非生产、已脱敏证据。
4. 不读取 `.env`、密钥文件、生产配置、生产凭证或生产日志。
5. 不自动批准、提交、推送、合并、发布、回滚或连接生产。
6. 缺少适配器时，由 Coding Agent 按本文检查点进行人工式检查并记录未自动执行原因。

## 8. 禁止动作

本 Hook 禁止：

1. 自动提交、推送、批准、合并、发布或回滚。
2. 修改代码托管平台审批状态。
3. 读取 `.env`、密钥文件、生产配置或生产凭证。
4. 连接生产环境、执行生产 SQL 或读取生产日志。
5. 跳过 AI Review、人工 Review、CI 或覆盖率证据。
6. 删除测试、降低断言或隐藏 P0/P1 风险。

## 9. 审计证据

适配层或 Coding Agent 执行本 Hook 语义时应记录：

1. 检查对象和 diff 范围。
2. Review 记录。
3. CI 或本地检查记录。
4. 覆盖率记录。
5. blocking 建议和解除条件。
6. 普通风险提示。
7. 人工确认记录。
8. 受限命令记录或未执行原因。
