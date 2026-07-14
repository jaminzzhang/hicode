# hicode SkillOpt 候选采纳流程

## 定位

本文档定义 SkillOpt 候选 `best_skill.md` 或优化建议如何进入 hicode 运行 Skill。核心原则是：SkillOpt 结果只能作为人工审查输入，不自动覆盖 `skills/review/SKILL.md`。

## 输入

采纳流程需要以下输入：

1. SkillOpt 候选输出路径，例如 `skill-opt/outputs/<run-id>/best_skill.md`。
2. 当前运行 Skill：`skills/review/SKILL.md`。
3. 候选差异摘要。
4. `val` 与 `test` eval 结果。
5. 健康检查结果。

## 流程

### 1. 固定候选范围

记录：

1. 运行 ID。
2. 训练配置摘要。
3. 数据集版本或样例清单摘要。
4. 当前基准 Skill commit。
5. 候选文件路径。

不得把 `skill-opt/outputs/` 原始轨迹直接提交。

### 2. 生成候选差异摘要

差异摘要必须说明：

1. 新增规则。
2. 删除或弱化规则。
3. 输出枚举变化。
4. 安全红线变化。
5. Review 三轴审查变化。
6. 高严谨业务系统风险覆盖变化。
7. 与 `CONTEXT.md`、`AGENTS.md` 或 ADR 的潜在冲突。

### 3. 人工审查

必须人工确认：

1. 不放宽安全红线、生产禁止事项、敏感信息保护和人工审批边界。
2. 不把建议结论写成最终审批、合并许可或发布许可。
3. 不破坏中文文档风格和现有 hicode 术语。
4. 不引入 `archive/`、旧 `references/` 或目标项目 `.hicode/` 依赖。
5. 不让 `review` Skill 依赖 Codex plugin 不支持的 `agents/` 运行资产。
6. 不把模板当成目标项目事实。

若候选与上下文或 ADR 冲突，停止采纳，回到 grill-with-docs 澄清。

### 4. 形成补丁

只把必要片段合入：

1. `skills/review/SKILL.md`
2. `skills/review/review-report.md`
3. 必要时同步 `CONTEXT.md` 术语或 `docs/HICODE_SKILL_TRIGGER_REGRESSION.md`

不得直接复制整个 `best_skill.md` 覆盖运行 Skill。

### 5. 验证

采纳后必须运行：

1. `bash scripts/health-check.sh`
2. 后续实现阶段的 `hicode_review` held-out eval
3. 必要时运行 `git diff --check`

如果健康检查或 held-out eval 失败，必须回滚或修正候选补丁；不得通过放宽检查、删除安全规则或降低断言推动通过。

## 拒绝条件

命中以下任一项，候选必须拒绝：

1. P0/P1 漏报比当前 Skill 增加。
2. 输出禁止结论，例如“准许合并”“审批通过”“可以上线”。
3. 弱化密钥、生产数据、未脱敏客户信息、自动合并或自动发布红线。
4. 删除 Review 三轴审查或证据轴。
5. 增加目标项目运行依赖、`.hicode/` 固化或 installer 复制诉求。
6. 训练分数提升但人工审查无法解释收益。

## 采纳记录

建议后续记录到 `skill-opt/docs/runs/<run-id>.md`，内容包括：

1. 运行 ID 和日期。
2. 数据集版本。
3. 当前 Skill 基准。
4. 候选摘要。
5. eval 结果。
6. 人工审查结论：采纳、部分采纳、拒绝或待确认。
7. 合入文件和验证结果。
8. 残余风险和后续动作。
