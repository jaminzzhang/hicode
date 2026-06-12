# 编码准入 Hook

## 1. 定位

本文是 `coding-entry-gate-hook` 的当前行为说明，用于描述 Coding Agent 准备修改本地代码前应检查的准入证据、阻断建议和审计字段。

本 Hook 不是平台原生配置，不由 `install.sh` 自动启用，不声明目标安装路径。若目标平台需要自动触发，必须由用户或平台负责人另行确认适配范围。

本 Hook 不替代 `skills/tdd/SKILL.md`、研发负责人、架构负责人、模块 Owner 或技术负责人的最终判断，不自动修改代码，不自动提交、合并、发布、回滚或操作生产。

## 2. 追溯关系

| 项 | 内容 |
|---|---|
| Hook ID | `coding-entry-gate-hook` |
| 行为目录 | `references/hooks/hook.json` |
| 相关 Skill | `skills/tdd/SKILL.md` |
| 规则依据 | `references/rules/coding_rules.md` |
| 默认模式 | `advisory` |
| 建议适配事件 | `before_code_edit`、`before_write`、`before_patch` |

## 3. 触发点

当 Coding Agent 准备执行以下本地动作时，可触发本 Hook：

1. 修改源代码。
2. 新增源代码。
3. 对源代码应用 patch。

不用于限制需求立项、提测审批、发布审批、生产验证或生产配置变更。

## 4. 输入材料

必须检查以下材料是否存在或已有等价证据：

1. 需求范围或编码计划。
2. `docs/features/<feature-id>/feature_context.md` 或等价单需求上下文。
3. `docs/PROJ_CONTEXT.md` 或等价项目上下文。
4. ADR 判断或不适用说明。
5. P0/P1 待确认问题状态。
6. 允许修改范围。
7. TDD 或测试先行证据。

不得要求真实客户敏感信息、未脱敏生产数据、生产配置、生产日志原文、密钥或生产凭证。

## 5. Advisory 输出

提醒型输出应包含：

```json
{
  "hook_id": "coding-entry-gate-hook",
  "mode": "advisory",
  "recommendation": "有条件建议继续",
  "highest_risk_level": "P1",
  "evidence_summary": ["已找到编码计划", "TDD 证据待补齐"],
  "blocking_recommendations": [],
  "risk_notes": ["缺少完整 RED-GREEN-REFACTOR 记录"],
  "recommended_actions": ["补充 TDD 证据后再修改代码"],
  "pending_questions": ["当前修改范围是否包含数据库脚本"],
  "audit_evidence": ["coding plan", "PRD context", "allowed change scope"]
}
```

不得输出“允许开工”“最终审批通过”“可直接修改生产配置”等审批或授权口径。

## 6. Blocking 条件

以下情况可以阻断当前 Coding Agent 修改动作：

1. 缺少需求范围或编码计划仍要修改代码。
2. 缺少 TDD 或测试先行证据仍要修改代码。
3. 试图修改生产配置。
4. 未确认范围时试图修改数据库脚本。
5. 未确认范围时试图修改发布脚本。
6. 发现密钥、Token、未脱敏客户敏感信息或未脱敏生产数据。
7. 用户要求生产操作。
8. 用户要求删除测试或降低断言以推动通过。

普通 P2/P3 提示项不得升级为 blocking。

## 7. 可选适配边界

目标平台若实现自动触发，必须满足：

1. 由用户或平台负责人明确确认启用范围。
2. 只读取本地、非生产、已脱敏证据。
3. 不读取 `.env`、密钥文件、生产配置、生产凭证或生产日志。
4. 不自动修改代码、提交、推送、合并、发布、回滚或连接生产。
5. 缺少适配器时，由 Coding Agent 按本文检查点进行人工式检查并记录未自动执行原因。

## 8. 禁止动作

本 Hook 禁止：

1. 自动修改未确认范围外的文件。
2. 自动提交、推送、合并、发布或回滚。
3. 读取 `.env`、密钥文件、生产配置或生产凭证。
4. 连接生产环境或执行生产 SQL。
5. 删除测试、降低断言或跳过 Review。

## 9. 审计证据

适配层或 Coding Agent 执行本 Hook 语义时应记录：

1. 检查对象和目标文件。
2. 输入材料清单。
3. 缺失输入。
4. blocking 建议和解除条件。
5. 普通风险提示。
6. 人工确认记录。
7. 受限命令记录或未执行原因。
