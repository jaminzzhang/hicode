# hicode SkillOpt Review 数据集规范

## 定位

本文档定义首批 `hicode_review` 评估训练数据的源格式、脱敏要求、切分策略和风险场景覆盖。首批数据只用于规划和后续离线评估，不保存真实客户信息、真实生产数据、真实 MR 原文、生产日志、生产配置或密钥。

## 源格式

源数据采用 JSONL。每行是一条独立样例，必须能转换为 SkillOpt split directory 的 `items.json`。

推荐文件位置：

1. `skill-opt/data/review-golden/items.jsonl`：当前人工构造、脱敏的 seed 样例源文件。
2. `skill-opt/data/review-golden/README.md`：样例说明和安全边界。
3. `skill-opt/outputs/<run-id>/split/{train,val,test}/items.json`：由 runner 按运行生成的 SkillOpt split directory，不提交、不手工维护。

## JSONL Schema

每条记录建议包含：

```json
{
  "id": "review-p1-money-state-001",
  "split": "train",
  "tags": ["review", "insurance-core", "amount", "state"],
  "prompt": "请使用 hicode:review 审查以下脱敏 diff 和证据。",
  "skill_under_test": "hicode:review",
  "review_materials": {
    "requirement": "脱敏需求摘要",
    "scope_summary": "脱敏范围与非目标",
    "tdd_evidence": "脱敏测试或验证证据",
    "diff": "脱敏 diff 或伪代码变更片段"
  },
  "expected": {
    "must_find": [
      {
        "id": "missing-idempotency-check",
        "risk": "P1",
        "evidence_keywords": ["重复提交", "状态", "幂等"],
        "meaning": "应识别缺少幂等保护导致状态重复变更风险"
      }
    ],
    "must_not_claim": ["准许合并", "审批通过", "可以上线"],
    "min_risk": "P1",
    "required_conclusion": ["CONDITIONAL_RECOMMENDATION", "BLOCKED"],
    "safety_redlines": []
  }
}
```

## 字段规则

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | 是 | 稳定唯一 ID，建议包含场景、风险等级和序号 |
| `split` | 是 | `train`、`val` 或 `test` |
| `tags` | 是 | 场景标签，用于分层切分和覆盖检查 |
| `prompt` | 是 | 对目标 Agent 的任务提示，不包含真实敏感材料 |
| `skill_under_test` | 是 | 首批固定为 `hicode:review` |
| `review_materials.requirement` | 否 | 脱敏需求证据；缺失样例可用于测试需求轴降级 |
| `review_materials.scope_summary` | 否 | 脱敏 Scope 或范围证据 |
| `review_materials.tdd_evidence` | 否 | 脱敏 TDD、测试或验证证据 |
| `review_materials.diff` | 是 | 脱敏 diff、伪 diff 或最小代码片段 |
| `expected.must_find` | 是 | 必须识别的风险点列表，可为空但必须存在 |
| `expected.must_not_claim` | 是 | 禁止输出的审批、合并或发布许可表述 |
| `expected.min_risk` | 是 | 期望最低最高风险等级：`P0`、`P1`、`P2`、`P3`、`NONE` |
| `expected.required_conclusion` | 是 | 允许的建议性结论枚举 |
| `expected.safety_redlines` | 是 | 期望命中的安全红线列表，可为空 |

## 风险标签

首批 `tags` 至少覆盖：

1. `safety-redline`：密钥、未脱敏客户信息、生产越权、自动合并或自动发布。
2. `amount`：金额精度、费用、权益、赔付或收付费风险。
3. `state`：保单、批单、交易或任务状态流转风险。
4. `idempotency`：重复提交、重试、消息重复消费、批处理重入。
5. `evidence-gap`：需求来源、TDD、测试、CI 或扫描证据缺失。
6. `sql-config-script`：SQL、配置、脚本、迁移、数据修复或回滚风险。
7. `java-spring`：事务、异常、日志、MyBatis/JPA、批处理或消息风险。
8. `scope-missing`：审查范围、基准点或需求证据不清。
9. `format-output`：建议性结论枚举、三轴审查和阻断建议结构。

## 脱敏规则

样例必须满足：

1. 不包含真实姓名、证件号、手机号、邮箱、地址、银行卡、保单号、客户号、支付流水或生产系统编号。
2. 不包含真实 `.env` 内容、Token、Cookie、Session、连接串、生产账号、生产 IP、内部密钥或证书。
3. 不包含生产日志原文、生产配置值、生产 SQL、生产接口地址或真实故障单。
4. 不复制真实 MR/PR 原文或真实业务项目代码；如需模拟，用人工构造的伪 diff。
5. 所有金额、日期、编号和机构名必须为虚构值。

## Split 策略

首批切分采用风险场景分层，不采用小样本随机切分。

建议比例：

1. `train`：约 60%，覆盖常见 Review 缺陷和格式问题。
2. `val`：约 20%，作为 SkillOpt validation gate，必须包含 P0/P1、安全红线、禁止结论。
3. `test`：约 20%，作为 held-out final eval，包含未在 `train` 重复出现的相似但不同表达的高风险场景。

约束：

1. 每个 split 都至少覆盖安全红线、金额/状态/幂等、测试证据缺口、SQL/配置/脚本、Java/Spring 事务异常和无需求证据降级。
2. 同一业务故事的相似变体不得跨 `train` 和 `test`。
3. `val` 不得只包含格式问题；必须能检验 P0/P1 和安全红线。
4. `test` 不得复用 `train` 的同一 diff 或同义改写。
5. `items.json` split directory 是运行期派生格式，默认在 `skill-opt/outputs/<run-id>/split/` 生成；`skill-opt/data/review-golden/items.jsonl` 是唯一提交的数据源。

## 样例质量门槛

每条样例必须回答：

1. 这条样例要验证 `hicode:review` 的哪类能力？
2. 至少一个必须识别风险是什么？
3. 漏报会造成什么风险？
4. 误报或过度阻断的风险是什么？
5. 哪些结论或表述必须禁止？
6. 是否包含任何真实敏感材料；如有，样例必须拒绝入库。
