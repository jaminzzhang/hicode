# hicode SkillOpt Run deepseek-p5a-001

## 定位

本报告是 SkillOpt 管理侧离线评估摘要，只记录脱敏评分结果和缺口，不包含原始 Review 输出、模型轨迹、生产数据或客户信息。

## 元信息

- Run ID: `deepseek-p5a-001`
- 生成时间: `2026-06-18T02:12:48.436Z`
- 数据集: `/Users/jamin/Dev/PA/harness/skill-opt/data/review-golden/items.jsonl`
- 输出目录: `/Users/jamin/Dev/PA/harness/skill-opt/outputs/deepseek-p5a-001/review-outputs`

## 汇总

| 指标 | 值 |
|---|---:|
| `total_items` | 9 |
| `evaluated_count` | 9 |
| `missing_output_count` | 0 |
| `hard_pass_count` | 9 |
| `hard_fail_count` | 0 |
| `average_score` | 1 |

## Split 汇总

| Split | total_items | evaluated_count | missing_output_count | hard_pass_count | hard_fail_count | average_score |
|---|---:|---:|---:|---:|---:|---:|
| `train` | 3 | 3 | 0 | 3 | 0 | 1 |
| `val` | 3 | 3 | 0 | 3 | 0 | 1 |
| `test` | 3 | 3 | 0 | 3 | 0 | 1 |

## 样例结果

| 样例 | Split | 状态 | hard_pass | score | max_risk | matched_findings | missed_findings | forbidden_claims | notes |
|---|---|---|---:|---:|---|---|---|---|---|
| `review-train-safety-format-001` | `train` | `evaluated` | true | 1 | `P0` | safety-redline-not-blocked | - | - | - |
| `review-train-money-state-001` | `train` | `evaluated` | true | 1 | `P1` | amount-state-idempotency-gap | - | - | - |
| `review-train-evidence-java-sql-001` | `train` | `evaluated` | true | 1 | `P1` | scope-evidence-transaction-gap | - | - | - |
| `review-val-safety-format-001` | `val` | `evaluated` | true | 1 | `P0` | customer-material-redline | - | - | - |
| `review-val-money-state-001` | `val` | `evaluated` | true | 1 | `P1` | reserve-concurrency-idempotency-gap | - | - | - |
| `review-val-evidence-java-sql-001` | `val` | `evaluated` | true | 1 | `P1` | config-sql-evidence-gap | - | - | - |
| `review-test-safety-format-001` | `test` | `evaluated` | true | 1 | `P0` | raw-upload-log-redline | - | - | - |
| `review-test-money-state-001` | `test` | `evaluated` | true | 1 | `P1` | batch-billing-idempotency-gap | - | - | - |
| `review-test-evidence-java-sql-001` | `test` | `evaluated` | true | 1 | `P1` | retry-job-transaction-script-gap | - | - | - |

## 建议动作

3. 当前已评估输出未触发硬失败，但仍不得作为合并或发布审批。

