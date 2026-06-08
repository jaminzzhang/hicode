# 代码审查工作流

## 1. 触发条件

开发完成后、提交检查前，或人工 Review 前需要先识别常见问题时，触发本工作流。审查应优先基于固定基准点和三点 diff，并按规范轴、需求轴分别输出结果。

## 2. 必读上下文

1. `AGENTS.md`
2. `CONTEXT.md`
3. `docs/PRD_CONTEXT.md`
4. `docs/PROJ_CONTEXT.md`
5. `docs/CODING_RULES.md`
6. `docs/REVIEW_RULES.md`
7. 根据 diff 按需读取 `docs/review-rules/java.md`
8. 根据 diff 按需读取 `docs/review-rules/sql.md`
9. 根据 diff 按需读取 `docs/review-rules/security.md`
10. 根据 diff 按需读取 `docs/review-rules/insurance-domain.md`
11. 相关 ADR，如涉及架构、模块边界或技术选型
12. `docs/TESTING_GUIDE.md`
13. `docs/DEFECT_CASES.md`
14. 编码计划
15. TDD 报告或辅助编码结果，如已有
16. 单测结果

## 3. 输入材料

| 输入 | 说明 |
|---|---|
| 固定基准点 | 分支、commit、tag、`main` 或 `HEAD~N` |
| 代码 diff | 本次改动内容 |
| 提交列表 | 固定基准点到 `HEAD` 的提交 |
| 需求来源 | PRD、Issue、编码计划、TDD 或辅助编码结果 |
| 单测结果 | 测试通过、失败或未执行说明 |
| 编码计划 | 影响范围和风险判断 |

## 4. 执行步骤

1. 固定审查范围：优先使用 `git diff <fixed-point>...HEAD`、`git diff --stat <fixed-point>...HEAD` 和 `git log <fixed-point>..HEAD --oneline`；缺少基准点时先追问。
2. 识别规范轴标准来源：读取入口规则、术语上下文、`docs/REVIEW_RULES.md`、编码规范、测试规范、缺陷案例、按需 Review 细则、相关 ADR 和机器配置约束。
3. 识别需求轴来源：查找 PRD、Issue、需求摘要、编码计划、TDD 报告或辅助编码结果；找不到时标注需求轴降级。
4. 根据 diff 判断是否补充读取 Java、SQL、安全或保险业务细则，并在报告中列出已读取文件。
5. 执行规范轴审查，检查文档化标准、架构规范、分层职责、异常处理、日志审计、性能、安全和测试标准。
6. 执行需求轴审查，检查需求一致性、缺失实现、实现偏差和范围蔓延。
7. 按金融核心系统风险标准检查保险核心业务逻辑严谨性、金额、交易一致性、状态流转、幂等、权限、审计、隐私、监管、生产变更和回滚。
8. 检查测试覆盖。
9. 匹配历史缺陷模式。
10. 按 P0/P1/P2/P3 输出统一问题清单。

## 5. 输出

1. AI 代码审查报告。
2. 固定基准点、diff 范围和提交列表。
3. 已读取上下文、标准来源、需求来源和分场景规则文件。
4. 规范轴审查结果。
5. 需求轴审查结果。
6. P0/P1/P2/P3 问题清单。
7. 测试补充建议。
8. 修复建议。
9. 是否建议进入提交检查。

## 6. 质量标准

1. P0 问题必须建议阻断。
2. P1 问题必须建议修复或明确豁免。
3. Review 结论必须有依据。
4. 不把风格建议混同为阻断问题。
5. 缺少固定基准点、完整 diff 或需求来源时，必须标注范围或需求轴降级，不得给出无条件通过。

## 7. 安全约束

1. 不输出敏感信息、密钥、Token、连接串或生产 IP。
2. 不自动修改代码。
3. 不替代人工 Reviewer 的最终判断。

## 8. 下一步

1. 修复 P0/P1 问题后重新 Review。
2. Review 通过或有条件通过后，进入 `pre-commit-check.md`。
3. 发现通用审查规则时，输出 `docs/REVIEW_RULES.md` 更新建议；经技术负责人确认后再沉淀。
4. 发现 Java、SQL、安全或保险业务细则时，输出 `docs/review-rules/` 对应文件更新建议；经对应负责人确认后再沉淀。
5. 发现历史缺陷模式时，输出 `docs/DEFECT_CASES.md` 更新建议；经测试和研发共同确认后再沉淀。
