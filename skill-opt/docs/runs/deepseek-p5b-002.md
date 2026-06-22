# hicode SkillOpt Train Run deepseek-p5b-002

## 结论

本次 P5B 真实 SkillOpt train runner 使用 DeepSeek/Azure OpenAI 兼容配置完成训练、测试、候选摘要和候选评估闭环。主训练未产生可采纳优化候选；`best_skill.md` 与当前 `skills/review/SKILL.md` 无内容差异。

## 依据

- 运行入口：`bash skill-opt/scripts/run-review-train-deepseek.sh --run-id deepseek-p5b-002`
- 输出目录：`skill-opt/outputs/deepseek-p5b-002/`
- 训练配置：`skill-opt/configs/review-train-minimal.yaml`
- 训练摘要：`skill-opt/outputs/deepseek-p5b-002/summary.json`
- 候选摘要：`skill-opt/docs/runs/deepseek-p5b-002-candidate.md`
- 候选评估输出：`skill-opt/outputs/deepseek-p5b-002-candidate-eval/`

## 结果摘要

| 项目 | 结果 |
|---|---|
| best selection hard | 1.0000 |
| step 数 | 2 |
| accept / reject / skip | 0 / 0 / 2 |
| best step | 0 |
| baseline test hard / soft | 1.0000 / 1.0000 |
| best test hard / soft | 1.0000 / 1.0000 |
| test delta hard | 0.0000 |
| token calls | 18 |
| total tokens | 84,475 |
| wall time | 573s |

## 诊断

训练入口、adapter 注册、split 生成、SkillOpt train CLI、prompt fallback、测试集评估、候选 `best_skill.md` 生成、候选摘要和候选评估均已跑通。

两步训练 rollout 均为 hard=1.0000、soft=1.0000，`failure_only=true` 下没有失败样例可供 reflection 生成补丁，因此两步都按 `skip_no_patches` 跳过，best skill 保持为初始 `skills/review/SKILL.md`。

候选摘要显示新增非空行 0、删除非空行 0，且未命中禁止审批语言、移除关键术语或禁止路径依赖风险。

候选评估结果为 hard=0.8333、soft=1.0000。唯一 hard fail 样例是 `review-test-eleinvoice-verify-out-of-order-001`，原因是输出建议结论为 `NEEDS_CONFIRMATION`，未命中样例期望的 `CONDITIONAL_RECOMMENDATION` 或 `BLOCKED`；该响应仍命中 P1、finding、证据引用、格式和安全红线检查。因此这是结论枚举稳定性问题，不是核心风险漏识别。

## 风险等级

P2：训练链路已经接通，但当前数据集在训练样例上过易，导致 SkillOpt 没有失败样例驱动优化；候选评估暴露了建议结论枚举的模型措辞波动。

## 建议动作

1. 不采纳本次候选覆盖 `skills/review/SKILL.md`，因为候选与当前 skill 无差异。
2. 下一轮训练应补充更难的 train/val 样例，尤其覆盖 P1 状态/幂等风险下 `NEEDS_CONFIRMATION` 与 `CONDITIONAL_RECOMMENDATION` 的边界。
3. 保持 P0 安全红线样例继续只接受 `BLOCKED`，不要为了提高分数放宽安全红线。
4. 评估是否在 `skills/review/SKILL.md` 中进一步压缩并强化结论矩阵：当需求、Scope 和 diff 足以识别 P1 金额/状态/幂等风险时，优先输出 `CONDITIONAL_RECOMMENDATION`，不要只因完整代码或 CI 缺失降级为 `NEEDS_CONFIRMATION`。

## 待确认问题

1. P1 状态/幂等类样例中，`NEEDS_CONFIRMATION` 是否应视为 hard fail，还是只作为 soft penalty。
2. 下一轮 SkillOpt 是否启用更大 train set 或引入专门的结论枚举 consistency split。

## 建议更新的 Harness 资产

1. `skill-opt/data/review-golden/items.jsonl`：补充 P1 结论边界样例，避免训练集全 1.0 导致无补丁。
2. `skill-opt/scripts/run-review-skillopt-eval.py`：候选评估建议写出顶层 summary，避免只在 stdout 中保留 aggregate。
