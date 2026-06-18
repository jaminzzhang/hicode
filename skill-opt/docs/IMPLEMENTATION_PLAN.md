# hicode SkillOpt 引入实施计划

## 定位

本计划用于规划 hicode 引入 SkillOpt 的首轮工作。SkillOpt 在本仓库中定位为管理侧离线评估优化链路，用于评估和改进 hicode Skill 文档质量，不属于目标项目默认运行资产，不由 plugin 安装器自动启用。

首轮已落地规划骨架、数据规范、evaluator 规范、人工采纳流程和目录边界。当前已完成 P2/P3/P4A/P4B 的最小可执行离线闭环，并实现 P5A eval-only runner：可生成派生 split、构造 direct chat messages、执行 dry-run wiring 检查，并在真实 eval 时调用模型输出 Review 报告后复用 P4A 摘要脚本。P5B SkillOpt 极小训练 runner 仍未实现；根目录 `pyproject.toml`、`uv.lock` 和 `.python-version` 仅作为 SkillOpt 管理侧 Python 依赖入口，不属于 hicode 运行资产或目标项目初始化资产。

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
8. 真实 SkillOpt 接入采用本仓库本地 runner + adapter、外部可选安装 `skillopt` 包的形态，不 fork、不 vendoring、不修改上游 SkillOpt 源码。
9. 根目录 Python 依赖入口专用于 SkillOpt 管理侧能力，不代表 hicode 项目本身转为 Python 运行项目。
10. `hicode_review` 首版 rollout 使用 direct chat target，不使用 `codex_exec` 或 `claude_code_exec`；真实 agent harness 回归留作后续阶段。
11. 首版模型后端只支持 OpenAI-compatible 或 Azure OpenAI chat；API key 默认来自当前 shell 环境变量，DeepSeek wrapper 可 allowlist 解析 env 文件，配置和摘要不得落密钥。
12. `hicode_review` 的 canonical 数据源是提交的 JSONL；SkillOpt 需要的 split directory 按 run 生成到 `skill-opt/outputs/<run-id>/split/`，不提交派生 `items.json`。
13. P5 拆成 P5A eval-only runner 和 P5B 极小训练 runner；本轮先实现 P5A，P5A baseline 跑通后再接入 P5B 训练。
14. P5 依赖基线固定为 PyPI `skillopt==0.1.0`，不使用上游 `main` 分支依赖。
15. DeepSeek 通过 OpenAI-compatible `base_url` 路径接入；`run-review-eval-deepseek.sh` 可读取当前 shell 环境变量或 allowlist 解析 env 文件，但不得 `source` 整份文件。

## 范围内

1. 创建 `skill-opt/` 目录骨架。
2. 编写 SkillOpt 引入计划、数据集规范、evaluator 规范和采纳流程。
3. 说明未来 `scripts/` 的职责和禁止动作。
4. 说明 `outputs/` 的本地输出和 Git 忽略边界。
5. 更新 `.gitignore`、`AGENTS.md`、`CONTEXT.md`、ADR 和健康检查。
6. 规划 `hicode_review` 自定义 adapter 的输入输出形态，但不实现真实 SkillOpt adapter。
7. 创建 seed JSONL 样例、数据校验脚本和规则 evaluator，用于后续训练前的本地离线评分。
8. 创建 run 汇总脚本，对 `skill-opt/outputs/<run-id>/review-outputs/` 下的保存输出生成脱敏摘要。
9. 创建候选差异摘要脚本，对 `skill-opt/outputs/<run-id>/best_skill.md` 生成人工审查输入，不展示完整候选正文。
10. 实现 P5A `hicode_review` eval-only runner，使其读取脱敏 JSONL、生成 per-run split、构造 direct chat messages、执行 dry-run，并在真实 eval 时保存 Review 输出和 P4A 摘要。
11. 规划 P5B SkillOpt 极小训练 runner，使其后续调用 SkillOpt 训练循环并产出本地候选。

## 范围外

1. 不创建来自真实项目的训练数据集或导入真实项目样例。
2. 不把模型凭证写入仓库文件；除 DeepSeek wrapper 的 allowlist env 文件解析外，不读取密钥文件。
3. 不修改 `skills/review/SKILL.md` 的运行行为。
4. 不修改 plugin manifest 或安装器以暴露 `skill-opt/`。
5. 不提交 SkillOpt 训练输出、rollout、checkpoint、日志或模型轨迹。
6. 不 fork 或 vendoring SkillOpt 上游源码。

## 后续阶段建议

### P1 规划骨架

目标：固化 SkillOpt 引入边界、目录结构、数据格式、evaluator 设计和采纳流程。

输出：

1. `skill-opt/docs/IMPLEMENTATION_PLAN.md`
2. `skill-opt/docs/DATASET_SPEC.md`
3. `skill-opt/docs/EVALUATOR_SPEC.md`
4. `skill-opt/docs/ADOPTION_PROCESS.md`
5. `skill-opt/scripts/README.md`
6. `skill-opt/outputs/README.md`
7. `.gitignore` 与健康检查更新

验收标准：

1. `skill-opt/` 目录边界已写入 `AGENTS.md` 和 `CONTEXT.md`。
2. `docs/adr/0004-adopt-skillopt-management-side-offline-optimization.md` 已记录关键决策。
3. 健康检查覆盖 `skill-opt/` 不被 plugin manifest 或安装器暴露。
4. `skill-opt/outputs/` 默认被 Git 忽略，但 `README.md` 可提交。
5. 健康检查仍能通过。

### P2 脱敏金标准样例设计

目标：设计首批 `hicode_review` JSONL 样例集合。

输出：

1. `skill-opt/docs/review-golden-catalog.md`
2. `skill-opt/data/review-golden/items.jsonl`
3. train/val/test split 检查脚本草案

验收标准：

1. 样例只使用人工构造的脱敏材料。
2. 每个 split 覆盖安全红线、金额/状态/幂等、测试证据缺口、SQL/配置/脚本、Java/Spring 事务异常和无需求证据降级。
3. 同一业务故事变体不跨 train 和 test。

### P3 evaluator 与 adapter 原型

目标：实现最小可运行的 `hicode_review` 数据校验和本地规则 evaluator 原型。

输出：

1. 数据校验脚本。
2. 规则判分 evaluator。
3. 本地 dry-run 示例。
4. 后续 SkillOpt adapter 的输入输出约束。

验收标准：

1. 不读取 `.env` 或仓库外敏感配置。
2. 默认离线运行规则判分。
3. LLM 复核必须显式配置且不作为单独放行依据。

### P4 首次离线评估与人工采纳

目标：基于脱敏样例评估当前 `skills/review/SKILL.md`，再评估 SkillOpt 候选产物。

输出：

1. P4A 脱敏运行摘要。
2. P4B 候选差异摘要。
3. P4B 人工采纳记录或拒绝记录。

验收标准：

1. 候选改动不自动覆盖运行 Skill。
2. 人工采纳后复跑健康检查和 held-out eval。
3. 未通过安全红线或格式门禁的候选必须拒绝。

### P4A 当前可执行范围

当前已实现 P4A 的本地离线 run 汇总：

1. 保存 Review 输出到 `skill-opt/outputs/<run-id>/review-outputs/<sample-id>.md`。
2. 执行 `node skill-opt/scripts/evaluate-review-run.js <run-id>`。
3. 脚本会生成 `skill-opt/docs/runs/<run-id>.md`。
4. 缺失输出会标记为 `missing_output`，不会伪造通过。
5. 摘要不包含原始 Review 输出或模型轨迹。

### P4B 当前可执行范围

当前已实现 P4B 的候选差异摘要：

1. 候选文件默认位于 `skill-opt/outputs/<run-id>/best_skill.md`。
2. 执行 `node skill-opt/scripts/summarize-review-candidate.js <run-id>`。
3. 脚本会生成 `skill-opt/docs/runs/<run-id>-candidate.md`。
4. 缺少候选会标记为 `WAIT_FOR_CANDIDATE`。
5. 命中禁止结论、关键术语缺失或旧路径依赖会标记为 `REJECT_RECOMMENDED`。
6. 摘要不包含完整候选正文，也不自动覆盖运行 Skill。

P5A eval-only runner 已实现；P5B SkillOpt 训练运行仍未实现。P4B 继续只处理已有候选的人工审查输入。

### P5A eval-only runner

目标：实现首版 `hicode_review` 基线评估 runner，使用 direct chat target 在脱敏样例上运行当前 `skills/review/SKILL.md`。

输出：

1. Python split 转换、dataloader、direct chat rollout 和 eval-only runner，代码位于 `skill-opt/scripts/python/hicode_review/`。
2. CLI 入口 `skill-opt/scripts/run-review-eval.py`，以及 `hicode_review` eval 配置文件或等价 CLI 参数封装。
3. `skill-opt/outputs/<run-id>/split/` 派生 split。
4. `--dry-run` 生成 `skill-opt/outputs/<run-id>/run.json` 和 `skill-opt/outputs/<run-id>/dry-run.json`；`dry-run.json` 默认保存完整 direct chat messages。
5. 真实 eval 生成 `skill-opt/outputs/<run-id>/review-outputs/<sample-id>.md` 样例输出。
6. 真实 eval 的单样例失败记录 `skill-opt/outputs/<run-id>/failures/<sample-id>.json`。
7. 真实 eval 默认生成 P4A 脱敏运行摘要 `skill-opt/docs/runs/<run-id>.md`。
8. 同一 `run-id` 重跑前清理 runner 生成的 `split/`、`review-outputs/`、`failures/`、`run.json` 和 `dry-run.json`，避免旧输出污染新摘要。

验收标准：

1. 不读取真实目标项目仓库、`.env`、生产配置、生产日志、生产数据或未脱敏客户材料。
2. 不使用 `codex_exec` 或 `claude_code_exec` 作为首版 target 后端。
3. 默认提供 `--dry-run`，可校验数据、配置、输出目录和 adapter wiring，且不调用模型、不要求 API key。
4. runner 不读取 `.env`，不接受命令行 API key 参数，不在日志、配置、摘要或输出中打印密钥值。
5. 输出只进入 `skill-opt/outputs/<run-id>/`，不得自动覆盖 `skills/review/SKILL.md`。
6. P5A 不产生 `best_skill.md`，不进入候选采纳。
7. `skill-opt/outputs/<run-id>/split/` 只能由源 JSONL 派生，不作为长期维护源提交。
8. 依赖解析使用 `skillopt==0.1.0` 的锁定版本。
9. 不在仓库根目录新增 `src/` 或 hicode 应用入口。
10. `--dry-run` 不生成 `review-outputs/*.md`，也不生成 P4A 评分摘要。
11. 非 dry-run 默认生成 P4A 摘要；样例调用失败时只能记录失败或缺失，不得伪造通过。
12. 非 dry-run 对单样例失败采用 best effort 继续运行；任一样例失败时 CLI 最终退出码非 0。
13. 配置级错误直接失败，不运行任何样例；可提供 `--fail-fast` 调试选项，但默认不启用。
14. `dry-run.json` 可保存完整 messages，但只在 ignored outputs 下保存，不转写到 tracked 摘要，不包含 API key、环境变量值或凭证。
15. P5A 复用现有 Node evaluator 和 `evaluate-review-run.js`，不重写 Python evaluator。
16. DeepSeek wrapper 可解析 env 文件中的 DeepSeek allowlist 变量，但不得 `source` 整份文件、不得加载无关变量、不得打印或落盘凭证。
17. DeepSeek wrapper 应将已知 DeepSeek 模型名规范化为 API 接受的小写形式，例如 `DeepSeek-V4-Flash` 转为 `deepseek-v4-flash`；未知模型名保持原样透传。

### P5B 极小训练 runner

目标：在 P5A baseline 跑通后接入 SkillOpt 训练循环，产出首个候选 `best_skill.md`。

输出：

1. SkillOpt adapter 和训练 runner。
2. 极小训练配置，建议从 `num_epochs=1`、`batch_size=3`、`learning_rate=2`、`use_slow_update=false`、`use_meta_skill=false` 起步。
3. `skill-opt/outputs/<run-id>/best_skill.md` 候选文件。
4. P4B 候选差异摘要和人工采纳记录或拒绝记录。

验收标准：

1. P5A baseline 已生成可评分摘要。
2. 训练输出只进入 `skill-opt/outputs/<run-id>/`。
3. 候选进入人工采纳流程前必须生成 P4A/P4B 摘要。
4. 不因训练分数提升自动采纳候选。

## 风险

| 风险 | 等级 | 控制措施 |
|---|---|---|
| 训练数据夹带敏感信息 | P0 | 只允许人工构造脱敏样例；禁止真实会话、真实 MR、生产日志和客户信息 |
| 候选 Skill 自动覆盖运行资产 | P0 | 只允许人工采纳补丁流程；健康检查和 held-out eval 后才能合入 |
| evaluator 只追求格式不识别高风险 | P1 | 必须包含 `must_find`、`must_not_claim`、`min_risk` 和安全红线判分 |
| SkillOpt 输出被提交到 Git | P1 | `skill-opt/outputs/` 默认 gitignore，只保留 README |
| `skill-opt/` 被安装到目标项目 | P1 | 健康检查约束 manifest 和安装器不得引用或复制该目录 |
| 首版 rollout 误用真实 agent harness | P1 | P5 首版只用 direct chat target；exec 后端留作后续回归 |
| 模型凭证泄露到仓库或摘要 | P0 | API key 只走当前 shell 环境变量或 DeepSeek wrapper allowlist env 文件解析；禁止命令行 key、输出打印和 tracked 配置落密钥 |
| JSONL 与 split 双维护导致数据漂移 | P2 | 只提交 JSONL，split directory 每次按 run 生成到本地输出 |
| 训练失败难定位 | P2 | 先跑 P5A eval-only baseline，再接入 P5B 极小训练 |
| 上游 SkillOpt 接口漂移 | P2 | 首版固定 PyPI `skillopt==0.1.0`；不依赖 main 分支 |

## 建议动作

1. 先完成 P1 规划骨架验收。
2. 再由负责人确认是否进入 P2 数据样例设计。
3. P3 之后才考虑本地 SkillOpt 依赖和运行环境。
4. 每次采纳候选 Skill 改动前，必须复跑健康检查和 held-out eval。
