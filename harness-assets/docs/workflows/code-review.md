# 代码审查工作流

## 1. 触发条件

开发完成后、提交检查前，或人工 Review 前需要先识别常见问题时，触发本工作流。

## 2. 必读上下文

1. `AGENTS.md`
2. `docs/PRD_CONTEXT.md`
3. `docs/PROJ_CONTEXT.md`
4. `docs/CODING_RULES.md`
5. `docs/REVIEW_RULES.md`
6. 根据 diff 按需读取 `docs/review-rules/java.md`
7. 根据 diff 按需读取 `docs/review-rules/sql.md`
8. 根据 diff 按需读取 `docs/review-rules/security.md`
9. 根据 diff 按需读取 `docs/review-rules/insurance-domain.md`
10. `docs/TESTING_GUIDE.md`
11. `docs/DEFECT_CASES.md`
12. 编码计划
13. 单测结果

## 3. 输入材料

| 输入 | 说明 |
|---|---|
| 代码 diff | 本次改动内容 |
| 单测结果 | 测试通过、失败或未执行说明 |
| 编码计划 | 影响范围和风险判断 |

## 4. 执行步骤

1. 先读取 `docs/REVIEW_RULES.md`，确认分级、结论口径和规则加载路由。
2. 根据 diff 判断是否补充读取 Java、SQL、安全或保险业务细则，并在报告中列出已读取文件。
3. 检查需求一致性。
4. 检查架构规范和分层职责。
5. 按金融核心系统风险标准检查保险核心业务逻辑严谨性、金额、交易一致性、状态流转、幂等、权限、审计、隐私、监管、生产变更和回滚。
6. 检查异常处理、日志审计、性能和安全风险。
7. 检查测试覆盖。
8. 匹配历史缺陷模式。
9. 按 P0/P1/P2/P3 输出问题清单。

## 5. 输出

1. AI 代码审查报告。
2. 已读取上下文和分场景规则文件。
3. 需求一致性检查。
4. P0/P1/P2/P3 问题清单。
5. 测试补充建议。
6. 修复建议。
7. 是否建议进入提交检查。

## 6. 质量标准

1. P0 问题必须建议阻断。
2. P1 问题必须建议修复或明确豁免。
3. Review 结论必须有依据。
4. 不把风格建议混同为阻断问题。

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
