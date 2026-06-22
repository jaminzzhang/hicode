# skill-opt scripts

## 定位

本目录用于放置 SkillOpt 管理侧离线评估优化脚本。当前执行链路已收敛为基于 SkillOpt CLI 的 `hicode_review` train/eval：本地 JSONL 数据集校验、规则 evaluator、SkillOpt adapter、训练 wrapper、候选 `best_skill.md` 差异摘要和 held-out eval。训练只产出候选与验证摘要，不自动采纳候选。

## 当前脚本

1. `review-dataset.js`：解析 JSONL、校验 `hicode_review` 样例 schema、split 覆盖和明显密钥模式。
2. `validate-review-dataset.js`：命令行数据集校验入口。
3. `review-evaluator.js`：对保存的 Review 输出执行本地规则判分。
4. `evaluate-review-output.js`：命令行 Review 输出评分入口。
5. `review-candidate.js`：比较当前 `skills/review/SKILL.md` 与候选 `best_skill.md`，生成风险摘要。
6. `summarize-review-candidate.js`：命令行候选摘要入口。
7. `run-review-train.py`：训练 wrapper，生成派生 split，注册本地 `HicodeReviewAdapter`，再调用 SkillOpt train CLI。
8. `run-review-skillopt-eval.py`：SkillOpt eval wrapper，注册本地 adapter 后调用 SkillOpt eval CLI。
9. `run-review-train-deepseek.sh`：DeepSeek/OpenAI-compatible shell wrapper，按 SkillOpt 官方 `.env` 处理方式加载 `AZURE_OPENAI_*` 配置后启动训练。
10. `python/hicode_review_skillopt/`：SkillOpt adapter、数据读取、split 生成、prompt 拼接、评分映射和 prompt fallback；复用 Node evaluator，把 `hard_pass`/`score` 映射为 SkillOpt `hard`/`soft`。

## P4B 候选摘要约定

候选文件默认位置：

```text
skill-opt/outputs/<run-id>/best_skill.md
```

执行：

```bash
node skill-opt/scripts/summarize-review-candidate.js <run-id>
```

脚本会比较当前 `skills/review/SKILL.md` 和候选文件，并把摘要写入：

```text
skill-opt/docs/runs/<run-id>-candidate.md
```

摘要只记录新增/删除行数量、关键词信号、禁止结论、关键术语缺失和禁止路径依赖，不包含完整候选正文。缺少候选时输出 `WAIT_FOR_CANDIDATE`，不会伪造采纳结论。命中禁止结论、关键术语缺失或旧路径依赖时输出 `REJECT_RECOMMENDED`。

## SkillOpt train runner

默认训练入口：

```bash
bash skill-opt/scripts/run-review-train-deepseek.sh --run-id <run-id>
```

dry-run wiring 检查：

```bash
bash skill-opt/scripts/run-review-train-deepseek.sh --run-id <run-id> --dry-run
```

训练 wrapper 会：

1. 从 `skill-opt/data/review-golden/items.jsonl` 生成 `skill-opt/outputs/<run-id>/split/{train,val,test}/items.json`。
2. 把本地 `HicodeReviewAdapter` 注入 SkillOpt 0.1.0 CLI registry 的 `hicode_review` env。
3. 调用 SkillOpt train CLI，默认使用 `skill-opt/configs/review-train-minimal.yaml`。
4. 训练输出写入 `skill-opt/outputs/<run-id>/`，候选 Skill 为 `best_skill.md`。
5. 若生成候选，默认运行候选差异摘要并写入 `skill-opt/docs/runs/<run-id>-candidate.md`。
6. 若生成候选，默认对候选跑 held-out eval，输出到 `skill-opt/outputs/<run-id>-candidate-eval/`。

默认配置是极小闭环：`num_epochs=1`、`train_size=6`、`batch_size=3`、`minibatch_size=3`、`learning_rate=2`、`sel_env_num=6`、`test_env_num=6`、`failure_only=true`、低并发，并禁用 slow/meta update。该配置用于验证训练链路，不表示最终调参结论。

训练使用 SkillOpt 官方 OpenAI-compatible/Azure OpenAI 环境变量，DeepSeek 推荐 `.env` 形态：

```bash
AZURE_OPENAI_ENDPOINT=https://api.deepseek.com
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_AUTH_MODE=openai_compatible
TARGET_DEPLOYMENT=deepseek-chat
OPTIMIZER_DEPLOYMENT=deepseek-chat
```

`run-review-train-deepseek.sh` 会按官方 `set -a; source .env; set +a` 方式加载配置，不会打印或落盘密钥。

失败策略：

1. 配置级错误，例如缺少 API key、endpoint、model 或数据校验失败，直接失败且不运行样例。
2. 单样例模型调用失败时，由 `HicodeReviewAdapter` 在对应 prediction 目录写入 `error.json`，并将该样例计为 hard=0。
3. 候选摘要命中拒绝建议时，不代表 wrapper 执行失败；候选仍需人工审查。

## 后续脚本范围

后续可继续规划：

1. 更高区分度的脱敏样例增强。
2. 候选人工采纳记录封装。
3. SkillOpt prediction 目录的脱敏 aggregate summary。
4. 真实 agent harness 回归，例如后续 `codex_exec` 或 `claude_code_exec`。

## 禁止动作

脚本不得：

1. 读取生产配置、生产凭证或连接串；模型配置只允许通过当前 shell 环境或 SkillOpt 官方 `.env` 方式进入 wrapper，且不得打印或写入 tracked 文件。
2. 连接生产环境、调用生产接口、读取生产日志或执行生产 SQL。
3. 处理未脱敏客户信息、未脱敏生产数据或真实 MR 原文。
4. 自动覆盖 `skills/review/SKILL.md`。
5. 修改 plugin manifest 或安装器，把 `skill-opt/` 暴露为运行资产。
6. 自动提交、推送、合并、发布或回滚。

## 依赖边界

根目录 `pyproject.toml`、`uv.lock` 和 `.python-version` 是 SkillOpt 管理侧 runner、adapter 和数据处理脚本的本地 Python 依赖入口。它们不属于 hicode 运行资产，不安装到目标项目，也不得保存模型凭证或生产连接信息。

P5 首版依赖基线固定为 PyPI `skillopt==0.1.0`。不得直接依赖上游 `main` 分支；若该版本无法满足外部 env 接入，需要另行记录原因并 pin 到明确 Git commit。
