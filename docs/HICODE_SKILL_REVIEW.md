# hicode Skill 专项评审与改造建议

## 定位

本文档记录当前 6 个 hicode Skill 的专项评审结论和改造建议。它是本仓库管理侧文档，不属于目标项目默认运行上下文，不安装到目标项目。

## 总体结论

当前 Skill 体系的方向正确：以 `hi` 作为入口，以 `init`、`scope`、`tdd`、`review`、`release` 覆盖目标项目初始化、需求收敛、受控实现、审查和发布分析的主流程。

主要问题不在功能缺失，而在 Agent 触发和执行边界：

1. description 原本在“能力说明”和“触发条件”之间不够均衡，不利于 Agent 稳定识别 Skill 适用时机。
2. 部分 Skill 使用 `PASS`、`READY_FOR_TDD` 等词，容易被理解成审批、合并或发布许可。
3. “必读材料”表述偏重，容易让 Agent 在不必要场景加载模板或规则，增加上下文成本。
4. Skill 与专业子 Agent 的关系不够明确，Codex plugin 环境下无法依赖 `agents/` 时缺少降级说明。
5. 缺少触发边界回归样例，后续修改容易让路由语义、输出枚举和安全红线漂移。

## 分项评审

| Skill | 风险等级 | 主要问题 | 改造建议 |
| --- | --- | --- | --- |
| `hi` | 中 | 入口定位正确，但 description 需要同时表达能力边界和路由触发条件。 | 保持总入口，不承接具体执行；强化 `hicode`、首次使用、初始化检查和场景路由关键词。 |
| `init` | 中 | 初始化边界清晰，但“必读材料”容易诱导过度加载；Agent 委托和不可用降级不明确。 | 改为按需加载；说明 `graphify` / 结构扫描可降级；继续禁止复制 `.hicode/` 和旧共享资产。 |
| `scope` | 高 | `READY_FOR_TDD` 容易被误解为批准编码；需求评审、拆分和 ADR 草稿之间边界需要更明确。 | 改为 `TDD_INPUT_READY`；明确它只是进入 TDD 的证据建议；补充 requirement-reviewer / coding-planner 委托与降级。 |
| `tdd` | 高 | 直接实现请求下的授权边界容易过窄或过宽；`PASS` 类结论容易被误读成合并许可。 | 明确清晰范围下可执行本地代码、测试和文档改动；结论改为 `LOCAL_VERIFIED` / `PARTIAL_VERIFICATION`，并声明不代表合并或发布许可。 |
| `review` | 高 | 原“双轴”表述不足以覆盖高严谨领域业务、安全和交易一致性风险；`PASS` 类结论有审批误导。 | 改为三轴审查；结论改为 `NO_BLOCKING_FINDINGS` / `CONDITIONAL_RECOMMENDATION`；强调不自动合并、不替代人工审批。 |
| `release` | 高 | 发布建议容易被误读成上线许可；生产变更、回滚和证据缺口需要更强停止条件。 | 使用建议性结论；增加停止条件；明确 release 只做风险分析、验证计划和回滚建议，不执行发布或回滚。 |

## 已落地改造

1. 6 个 Skill 的 description 已统一改为“能力边界短句 + `Use when ...` 触发语”的两句式。
2. 关键模板中的 `PASS`、`CONDITIONAL_PASS`、`READY_FOR_TDD` 已替换为建议性枚举。
3. `review` 模板已由“双轴审查”调整为“三轴审查”。
4. `init`、`scope`、`tdd`、`review`、`release` 已补充专项 Agent 委托和降级说明。
5. `.codex-plugin/plugin.json` 默认 prompt 已显式使用 `hicode:*` 路由表达。
6. 新增 `docs/HICODE_SKILL_TRIGGER_REGRESSION.md`，记录 6 个 Skill 的应触发、不应触发和安全红线样例。
7. 新增 `scripts/check-skill-trigger-regression.js`，并接入 `scripts/health-check.sh`。

## 最终改造原则

1. description 第一短句写能力边界，第二句用 `Use when ...` 写触发条件；不复述完整流程，避免 Agent 只读 description 后跳过 Skill 正文。
2. Skill 正文保留核心步骤、停止条件、输出要求和安全约束；模板和种子规则按需加载。
3. 所有结论使用建议性枚举，不使用容易被误解为审批结果的 `PASS`。
4. Skill 可以声明专业子 Agent 委托，但必须提供不可用时的主 Agent 降级路径。
5. 触发边界、建议结论和安全红线必须进入可重复健康检查。

## 待确认问题

1. 是否在具备多 Agent 能力的环境中执行真实前向测试，以验证 description 触发和 Skill 正文执行效果。
2. 是否在未来破坏性版本中重命名目录或 Skill 名称；当前 V3 和安装器依赖固定 6 个目录，不建议现在改名。
3. 是否基于真实脱敏使用记录扩展触发回归样例，替代当前人工构造样例。
