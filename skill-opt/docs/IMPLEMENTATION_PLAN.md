# hicode SkillOpt 引入实施计划

## 定位

本计划用于维护 hicode 引入 SkillOpt 的当前实施口径。SkillOpt 在本仓库中定位为管理侧离线评估优化链路，用于评估和改进 hicode Skill 文档质量，不属于目标项目默认运行资产，不由 plugin 安装器自动启用。

当前执行链路已收敛为基于 SkillOpt CLI 的 `hicode_review` train/eval：本地 wrapper 注册 `HicodeReviewAdapter`，调用 SkillOpt train/eval CLI，产出候选 `best_skill.md`、候选差异摘要和 held-out eval 输出。根目录 `pyproject.toml`、`uv.lock` 和 `.python-version` 仅作为 SkillOpt 管理侧 Python 依赖入口，不属于 hicode 运行资产或目标项目初始化资产。

参考资料：

1. SkillOpt 官方指南：`https://microsoft.github.io/SkillOpt/docs/guideline.html`
2. SkillOpt GitHub：`https://github.com/microsoft/SkillOpt`
3. 本仓库 ADR：`docs/adr/0004-adopt-skillopt-management-side-offline-optimization.md`

## 已确认决策

1. SkillOpt 作为 hicode 管理侧离线评估优化链路，不进入目标项目默认运行上下文。
2. 首批训练优化对象只选择 `hicode:review`，6 个 hicode Skill 继续保留轻量触发边界和安全红线回归。
3. 首批数据只使用人工构造、脱敏的金标准样例，不直接采集真实会话、真实 MR、真实项目代码、生产日志、生产配置、客户信息或密钥。
4. `hicode:review` 评估采用规则判分为主、LLM 语义复核为辅的混合 evaluator。
5. SkillOpt 相关资产集中放在根目录 `skill-opt/` 下，分为 `docs/`、`scripts/`、`outputs/`。
6. `skill-opt/outputs/` 是本地输出目录，默认不提交，只保留 `README.md` 说明。
7. SkillOpt 产出的候选 `best_skill.md` 不自动覆盖 `skills/review/SKILL.md`，只能通过人工审查后的补丁流程采纳。
8. 真实 SkillOpt 接入采用本仓库本地 wrapper + adapter、外部安装 `skillopt` 包的形态，不 fork、不 vendoring、不修改上游 SkillOpt 源码。
9. `hicode_review` rollout 使用 direct chat target，不使用 `codex_exec` 或 `claude_code_exec`；真实 agent harness 回归留作后续阶段。
10. 模型后端只支持 OpenAI-compatible 或 Azure OpenAI chat；SkillOpt train/eval 按官方 `.env` 和 `AZURE_OPENAI_*` 约定加载模型配置，配置和摘要不得落密钥。
11. `hicode_review` 的 canonical 数据源是提交的 JSONL；SkillOpt 需要的 split directory 按 run 生成到 `skill-opt/outputs/<run-id>/split/`，不提交派生 `items.json`。
12. 依赖基线固定为 PyPI `skillopt==0.1.0`，不使用上游 `main` 分支依赖。
13. DeepSeek 通过 OpenAI-compatible 路径接入，并按 SkillOpt 官方 `AZURE_OPENAI_ENDPOINT`、`AZURE_OPENAI_API_KEY`、`AZURE_OPENAI_AUTH_MODE=openai_compatible` 处理。

## 范围内

1. 维护 `skill-opt/` 目录骨架、规划文档、数据规范、evaluator 规范和采纳流程。
2. 维护 `skill-opt/data/review-golden/items.jsonl` 人工脱敏样例、数据校验脚本和本地规则 evaluator。
3. 维护 `hicode_review` 自定义 SkillOpt adapter，把脱敏 Review 样例映射为 rollout、反思和评分结果。
4. 维护 SkillOpt train wrapper：`skill-opt/scripts/run-review-train.py`、`skill-opt/scripts/run-review-train-deepseek.sh`。
5. 维护 SkillOpt eval wrapper：`skill-opt/scripts/run-review-skillopt-eval.py`，用于候选 held-out eval。
6. 维护候选差异摘要脚本，对 `skill-opt/outputs/<run-id>/best_skill.md` 生成人工审查输入，不展示完整候选正文。
7. 维护健康检查，确保 `skill-opt/` 不被 plugin manifest 或安装器暴露。

## 范围外

1. 不创建来自真实项目的训练数据集或导入真实项目样例。
2. 不把模型凭证写入仓库文件、运行摘要或候选 Skill；SkillOpt wrapper 只按官方 `.env`/环境变量约定加载模型配置。
3. 不自动修改 `skills/review/SKILL.md` 的运行行为。
4. 不修改 plugin manifest 或安装器以暴露 `skill-opt/`。
5. 不提交 SkillOpt 训练输出、rollout、checkpoint、日志或模型轨迹。
6. 不 fork 或 vendoring SkillOpt 上游源码。

## 当前执行链路

### 数据与 evaluator

1. JSONL 数据源：`skill-opt/data/review-golden/items.jsonl`。
2. 数据校验：`node skill-opt/scripts/validate-review-dataset.js skill-opt/data/review-golden/items.jsonl`。
3. 单条输出评分：`node skill-opt/scripts/evaluate-review-output.js <item.json|items.jsonl> <output.md> [item-id]`。
4. Python split 生成和 prompt 构造位于 `skill-opt/scripts/python/hicode_review_skillopt/`，与 SkillOpt adapter 同 Module 维护。

### SkillOpt train

默认入口：

```bash
bash skill-opt/scripts/run-review-train-deepseek.sh --run-id <run-id>
```

dry-run wiring 检查：

```bash
bash skill-opt/scripts/run-review-train-deepseek.sh --run-id <run-id> --dry-run
```

输出：

1. `skill-opt/outputs/<run-id>/split/{train,val,test}/items.json`
2. `skill-opt/outputs/<run-id>/summary.json`
3. `skill-opt/outputs/<run-id>/best_skill.md`
4. `skill-opt/docs/runs/<run-id>-candidate.md`
5. `skill-opt/outputs/<run-id>-candidate-eval/`

### 候选采纳

候选文件默认位于：

```text
skill-opt/outputs/<run-id>/best_skill.md
```

候选摘要入口：

```bash
node skill-opt/scripts/summarize-review-candidate.js <run-id>
```

候选摘要只记录新增/删除行数量、关键词信号、禁止结论、关键术语缺失和禁止路径依赖，不包含完整候选正文。缺少候选时输出 `WAIT_FOR_CANDIDATE`；命中禁止结论、关键术语缺失或旧路径依赖时输出 `REJECT_RECOMMENDED`。

## 验收标准

1. `skill-opt/` 目录边界写入 `AGENTS.md` 和 `CONTEXT.md`。
2. `docs/adr/0004-adopt-skillopt-management-side-offline-optimization.md` 记录关键决策。
3. 健康检查覆盖 `skill-opt/` 不被 plugin manifest 或安装器暴露。
4. `skill-opt/outputs/` 默认被 Git 忽略，但 `README.md` 可提交。
5. `uv run python -m unittest discover -s skill-opt/tests/python` 通过。
6. `node --test skill-opt/tests/*.test.js` 通过。
7. `bash scripts/health-check.sh` 通过。

## 风险

| 风险 | 等级 | 控制措施 |
|---|---|---|
| 训练数据夹带敏感信息 | P0 | 只允许人工构造脱敏样例；禁止真实会话、真实 MR、生产日志和客户信息 |
| 候选 Skill 自动覆盖运行资产 | P0 | 只允许人工采纳补丁流程；健康检查和 held-out eval 后才能合入 |
| evaluator 只追求格式不识别高风险 | P1 | 必须包含 `must_find`、`must_not_claim`、`min_risk` 和安全红线判分 |
| SkillOpt 输出被提交到 Git | P1 | `skill-opt/outputs/` 默认 gitignore，只保留 README |
| `skill-opt/` 被安装到目标项目 | P1 | 健康检查约束 manifest 和安装器不得引用或复制该目录 |
| 首版 rollout 误用真实 agent harness | P1 | 当前只用 direct chat target；exec 后端留作后续回归 |
| 模型凭证泄露到仓库或摘要 | P0 | API key 只走当前 shell 环境变量或 SkillOpt 官方 `.env` 约定；禁止命令行 key、输出打印和 tracked 配置落密钥 |
| JSONL 与 split 双维护导致数据漂移 | P2 | 只提交 JSONL，split directory 每次按 run 生成到本地输出 |
| 训练失败难定位 | P2 | 保留 train dry-run、极小训练参数、per-run 输出目录和运行摘要 |
| 上游 SkillOpt 接口漂移 | P2 | 首版固定 PyPI `skillopt==0.1.0`；不依赖 main 分支 |

## 建议动作

1. 下一轮优化优先补充更高区分度的脱敏 train/val 样例。
2. 候选采纳前必须复跑健康检查和 held-out eval。
3. 若需要真实 agent harness 回归，应新增独立阶段和 ADR，不混入当前 direct chat train 链路。
