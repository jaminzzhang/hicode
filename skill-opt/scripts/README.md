# skill-opt scripts

## 定位

本目录用于放置 SkillOpt 管理侧离线评估优化脚本。当前实现 P2/P3 的本地 JSONL 数据集校验和规则 evaluator、P4A 的离线 run 汇总、P4B 的候选 `best_skill.md` 差异摘要，以及 P5A eval-only direct chat runner。P5A 可 dry-run，也可在显式模型配置和 shell 环境凭证存在时调用模型；仍不实现 P5B 训练 runner，不自动采纳候选。

## 当前脚本

1. `review-dataset.js`：解析 JSONL、校验 `hicode_review` 样例 schema、split 覆盖和明显密钥模式。
2. `validate-review-dataset.js`：命令行数据集校验入口。
3. `review-evaluator.js`：对保存的 Review 输出执行本地规则判分。
4. `evaluate-review-output.js`：命令行 Review 输出评分入口。
5. `review-run.js`：汇总一个 run 下多个样例输出的评分结果，并生成脱敏 Markdown 摘要。
6. `evaluate-review-run.js`：命令行 run 评分入口。
7. `review-candidate.js`：比较当前 `skills/review/SKILL.md` 与候选 `best_skill.md`，生成风险摘要。
8. `summarize-review-candidate.js`：命令行候选摘要入口。
9. `run-review-eval.py`：P5A eval-only direct chat runner 入口。
10. `python/hicode_review/`：P5A Python 模块，包含数据读取、split 生成、prompt 拼接、模型调用、Node 摘要封装和 runner。
11. `run-review-eval-deepseek.sh`：DeepSeek OpenAI-compatible shell wrapper，读取当前 shell 环境变量，或 allowlist 解析 env 文件中的 DeepSeek 变量。

## P4A run 目录约定

Run 输出默认放在本地忽略目录：

```text
skill-opt/outputs/<run-id>/
└── review-outputs/
    ├── <sample-id>.md
    └── ...
```

执行：

```bash
node skill-opt/scripts/evaluate-review-run.js <run-id>
```

脚本会读取 `skill-opt/data/review-golden/items.jsonl`，对存在的 `review-outputs/<sample-id>.md` 评分，并把摘要写入：

```text
skill-opt/docs/runs/<run-id>.md
```

缺少输出文件的样例会标记为 `missing_output`，不会伪造通过。摘要不包含原始 Review 输出、模型轨迹、生产数据或客户信息。

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

## 后续脚本范围

后续可继续规划：

1. P5B SkillOpt 极小训练 runner。
2. 候选 `best_skill.md` 生成后的摘要和人工采纳记录封装。
3. 真实 agent harness 回归，例如后续 `codex_exec` 或 `claude_code_exec`。

P5A Python runner 目录约定：

```text
skill-opt/scripts/
├── run-review-eval.py
└── python/
    └── hicode_review/
        ├── __init__.py
        ├── dataset.py
        ├── prompt.py
        ├── openai_chat.py
        ├── summary.py
        └── runner.py
```

执行入口使用：

```bash
uv run python skill-opt/scripts/run-review-eval.py --run-id <run-id> --dry-run
```

DeepSeek wrapper 使用当前 shell 环境变量：

```bash
export DEEPSEEK_API_KEY="..."
export DEEPSEEK_BASE_URL="https://api.deepseek.com"
export DEEPSEEK_MODEL="deepseek-chat"
bash skill-opt/scripts/run-review-eval-deepseek.sh --run-id <run-id>
```

`DEEPSEEK_BASE_URL` 默认值为 `https://api.deepseek.com`，`DEEPSEEK_MODEL` 默认值为 `deepseek-chat`，API key 变量名默认 `DEEPSEEK_API_KEY`。如需使用其他变量名，可设置 `DEEPSEEK_API_KEY_ENV`。

该 wrapper 默认会检查仓库根目录 `.env`，也可通过 `HICODE_SKILLOPT_ENV_FILE=/path/to/file` 指定 env 文件。它只解析 `DEEPSEEK_API_KEY`、`DEEPSEEK_BASE_URL`、`DEEPSEEK_MODEL` 和 `DEEPSEEK_API_KEY_ENV`，不会 `source` 整份文件，不会加载无关变量，也不会打印凭证。

`--dry-run` 输出：

1. `skill-opt/outputs/<run-id>/split/{train,val,test}/items.json`
2. `skill-opt/outputs/<run-id>/run.json`
3. `skill-opt/outputs/<run-id>/dry-run.json`，默认包含完整 direct chat messages

`--dry-run` 不调用模型、不要求 API key、不生成 `review-outputs/*.md`，也不生成 P4A 评分摘要。

`dry-run.json` 只保存在 ignored 的 `skill-opt/outputs/<run-id>/` 下，不转写到 `docs/runs/` 摘要；不得包含 API key、环境变量值或凭证。

非 `--dry-run` 默认行为：

1. 调用 direct chat target 生成 `skill-opt/outputs/<run-id>/review-outputs/<sample-id>.md`
2. 调用现有 Node 脚本 `skill-opt/scripts/evaluate-review-run.js <run-id>` 自动生成 P4A 脱敏运行摘要 `skill-opt/docs/runs/<run-id>.md`
3. 样例调用失败时记录失败或缺失，不伪造通过
4. 可提供 `--no-summary` 调试选项，但默认不建议使用

失败策略：

1. 配置级错误，例如缺少 API key、endpoint、model 或数据校验失败，直接失败且不运行样例。
2. 单样例模型调用失败时，写入 `skill-opt/outputs/<run-id>/failures/<sample-id>.json` 并继续后续样例。
3. 任一样例失败时，CLI 最终退出码非 0。
4. 可提供 `--fail-fast` 调试选项，但默认不启用。

## 禁止动作

脚本不得：

1. 读取密钥文件、生产配置、生产凭证或连接串；DeepSeek wrapper 仅允许 allowlist 解析 env 文件中的 DeepSeek 变量。
2. 连接生产环境、调用生产接口、读取生产日志或执行生产 SQL。
3. 处理未脱敏客户信息、未脱敏生产数据或真实 MR 原文。
4. 自动覆盖 `skills/review/SKILL.md`。
5. 修改 plugin manifest 或安装器，把 `skill-opt/` 暴露为运行资产。
6. 自动提交、推送、合并、发布或回滚。

## 依赖边界

根目录 `pyproject.toml`、`uv.lock` 和 `.python-version` 是 SkillOpt 管理侧 runner、adapter 和数据处理脚本的本地 Python 依赖入口。它们不属于 hicode 运行资产，不安装到目标项目，也不得保存模型凭证或生产连接信息。

P5 首版依赖基线固定为 PyPI `skillopt==0.1.0`。不得直接依赖上游 `main` 分支；若该版本无法满足外部 env 接入，需要另行记录原因并 pin 到明确 Git commit。
