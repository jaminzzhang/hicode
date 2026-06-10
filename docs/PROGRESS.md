# 项目进度台账

## 1. 当前状态

最近更新时间：2026-06-10
当前阶段：V2 子 Agent 基础资产
当前工作包：无进行中工作包
总体状态：V1 已完成；V2 实施计划已完成；V2-P1-WP2 已完成

本台账用于记录 V1 工作包推进状态和后续 V2 规划状态。每次开发 Agent 开始、完成、阻塞、暂缓或提交工作包验收时，必须同步更新本文件。

## 2. 状态规则

| 状态 | 含义 | 使用规则 |
|---|---|---|
| 未开始 | 工作包尚未启动 | 只有前置依赖或优先级确认后才启动 |
| 进行中 | Agent 正在处理该工作包 | 开始实施时更新为该状态 |
| 阻塞 | 缺少输入、确认或外部条件 | 必须写明阻塞原因和解除条件 |
| 待验收 | 产出已完成，等待项目负责人确认 | Agent 完成工作包后使用该状态 |
| 已完成 | 项目负责人已确认产出可接受 | 只有确认后才能使用该状态 |
| 暂缓 | 主动推迟，当前不是阻塞 | 必须写明暂缓原因和恢复条件 |

## 3. 本轮已完成的初始化事项

1. 已初始化 git 仓库。
2. 已创建 `.gitignore`。
3. 已移动需求文档到 `docs/研发 AI 工程化方案V1.1.md`。
4. 已创建并提交 `AGENTS.md` 初版。
5. 已记录项目工作语言：中文为主，英文为辅。
6. 已创建根目录 `CONTEXT.md` 作为项目术语上下文。
7. 已确认 V1 实施计划和项目进度台账的文档入口。
8. 已确认工作包粒度、范围边界、实施顺序、编号规则和状态流转。
9. 已创建 `docs/V1_IMPLEMENTATION_PLAN.md`。
10. 已创建 `docs/PROGRESS.md`。
11. 已更新 `AGENTS.md`，要求后续开发 Agent 固定读取 `CONTEXT.md`、需求文档、V1 实施计划和项目进度台账。
12. 项目负责人已确认 P1-WP1、P1-WP2、P1-WP3 验收通过。
13. 已启动 P2-WP1：`harness-assets/` 目录与基础模板。
14. 已确认 Harness 交付资产统一放入 `harness-assets/`，不混入根目录 `docs/`。
15. 已确认目标项目入口模板为 `harness-assets/AGENTS.md`，根目录 `AGENTS.md` 只保留为本仓库 Agent 规则。
16. 已创建 P2-WP1 基础模板文件，并提交项目负责人验收。
17. 项目负责人已确认 P2-WP1 验收通过。
18. 已启动 P2-WP2：领域知识文档初版。
19. 已补充 `harness-assets/docs/DOMAIN_KNOWLEDGE.md` 初版，并提交项目负责人验收。
20. 项目负责人已确认 P2-WP2 验收通过。
21. 已启动 P2-WP3：需求与研发上下文模板。
22. 已完善 `harness-assets/docs/PRD_CONTEXT.md` 和 `harness-assets/docs/PROJ_CONTEXT.md`，并提交项目负责人验收。
23. 项目负责人已确认 P2-WP3 验收通过。
24. 已启动 P2-WP4：编码与测试规范文档。
25. 已完善 `harness-assets/docs/CODING_RULES.md` 和 `harness-assets/docs/TESTING_GUIDE.md`，并提交项目负责人验收。
26. 项目负责人已确认 P2-WP4 验收通过。
27. 已启动 P2-WP5：Review、发布和缺陷文档。
28. 已完善 `harness-assets/docs/REVIEW_RULES.md`、`harness-assets/docs/RELEASE_GUIDE.md` 和 `harness-assets/docs/DEFECT_CASES.md`，并提交项目负责人验收。
29. 项目负责人已确认 P2-WP5 验收通过。
30. 已启动 P2-WP6：ADR 与流程文档。
31. 已完善 `harness-assets/docs/ADR/` 和 `harness-assets/docs/workflows/`，并提交项目负责人验收。
32. 项目负责人已确认 P2-WP6 验收通过，P2 上下文与规范文档阶段完成。
33. 已启动 P3-WP1：Prompt 模板规范。
34. 已创建 `harness-assets/prompts/README.md` 和 `_template.md`，并提交项目负责人验收。
35. 已根据项目负责人调整，将 Harness 运行资产源目录改为 `harness-assets/prompts/`、`harness-assets/skills/`、`harness-assets/gates/`、`harness-assets/schemas/` 和 `harness-assets/examples/`，不在 `harness-assets/` 下直接维护隐藏 `.hicode/` 目录。
36. 已优化根目录 `AGENTS.md`，将需求草案从默认必读调整为按需读取，并聚焦 Coding Agent 执行 Harness 工程资产建设。
37. 已确认 Harness 工程体系默认服务对象为保险/金融核心系统研发，后续资产设计需按金融核心系统风险标准处理，并将保险核心业务逻辑严谨性列为默认必检项。
38. 已将金融核心系统风险标准和保险核心业务逻辑严谨性补充到 `harness-assets/prompts/README.md` 和 `_template.md`，作为后续 Prompt 的固定检查基线。
39. 已基于金融核心系统背景补强 P1/P2 文档，将统一风险基线和保险核心业务逻辑严谨性同步到目标项目入口、上下文、规范、ADR 和 workflow 文档。
40. 已将 `docs/V1_IMPLEMENTATION_PLAN.md` 对齐需求草案和上下文，补充阶段映射、Review 分层规则、权限审计矩阵和资产回归样例工作包。
41. 项目负责人已确认继续启动下一个工作包，P3-WP1 视为验收通过。
42. 已启动 P3-WP2：需求评审与编码计划 Prompt。
43. 已创建 `harness-assets/prompts/requirement-review.md` 和 `harness-assets/prompts/coding-plan.md`，并提交项目负责人验收。
44. 已收到项目负责人关于 V1 Prompt 统一骨架的验收反馈，P3-WP2 进入返工调整。
45. 已按统一 Prompt 骨架调整 `harness-assets/prompts/README.md`、`_template.md`、`requirement-review.md` 和 `coding-plan.md`，并重新提交 P3-WP2 验收。
46. 项目负责人已确认采用八段式主骨架，并吸收十二段式语义作为子项，P3-WP2 验收通过。
47. 已启动 P3-WP3：TDD 与辅助编码 Prompt。
48. 已创建 `harness-assets/prompts/tdd.md` 和 `harness-assets/prompts/coding-assistant.md`，并提交项目负责人验收。
49. 项目负责人已确认 P3-WP3 验收通过。
50. 已启动 P3-WP4：代码审查与提交检查 Prompt。
51. 已创建 `harness-assets/prompts/code-review.md` 和 `harness-assets/prompts/pre-commit-check.md`，并提交项目负责人验收。
52. 项目负责人已确认 P3-WP4 验收通过。
53. 已启动 P3-WP5：核心场景测试与发布检查 Prompt。
54. 已创建 `harness-assets/prompts/core-scenario-test.md` 和 `harness-assets/prompts/release-check.md`，并同步修正相关 workflow 上下文。
55. 项目负责人已确认 P3-WP5 验收通过，P3 Prompt 模板库 V1 阶段完成。
56. 已启动 P4-WP1：Skill 目录规范。
57. 已创建 `harness-assets/skills/README.md`、`harness-assets/skills/_template/SKILL.md` 和 `harness-assets/skills/_template/output-template.md`，并将 Skill 入口统一为 `SKILL.md`。
58. 项目负责人已确认继续下一工作包，P4-WP1 视为验收通过。
59. 已启动 P4-WP2：需求评审 Skill。
60. 已创建 `harness-assets/skills/requirement-review/SKILL.md` 和 `harness-assets/skills/requirement-review/output-template.md`，并提交项目负责人验收。
61. 已同步修正需求草案中的 Skill 入口路径，将 `skill.md` 统一为 `SKILL.md`。
62. 项目负责人已确认 P4-WP2 验收通过。
63. 已启动 P4-WP3：编码计划辅助 Skill，并参考 `grill-with-docs` 的文档驱动追问纪律强化代码实现前上下文清晰门槛。
64. 已创建 `harness-assets/skills/coding-plan/SKILL.md` 和 `harness-assets/skills/coding-plan/output-template.md`，并提交项目负责人验收。
65. 项目负责人已确认 P4-WP3 验收通过。
66. 已启动 P4-WP4：TDD 与辅助编码 Skill。
67. 已参考 Matt Pocock `tdd` Skill，将所有代码修改必须使用 TDD 或测试先行证据的口径沉淀到 `CONTEXT.md`。
68. 已创建 `harness-assets/skills/tdd/SKILL.md`、`harness-assets/skills/tdd/output-template.md`、`harness-assets/skills/coding-assistant/SKILL.md` 和 `harness-assets/skills/coding-assistant/output-template.md`。
69. 已对 `harness-assets/prompts/tdd.md`、`harness-assets/prompts/coding-assistant.md` 和 `harness-assets/docs/workflows/tdd.md` 做最小一致性修正，补充 RED-GREEN-REFACTOR、行为测试和测试先行准入。
70. 项目负责人已确认 P4-WP4 验收通过。
71. 已启动 P4-WP5：代码审查与提交检查 Skill，并开始参考 Matt Pocock `review` Skill 设计双轴审查口径。
72. 已创建 `harness-assets/skills/code-review/SKILL.md`、`harness-assets/skills/code-review/output-template.md`、`harness-assets/skills/pre-commit-check/SKILL.md` 和 `harness-assets/skills/pre-commit-check/output-template.md`。
73. 已对 `harness-assets/prompts/code-review.md` 和 `harness-assets/docs/workflows/code-review.md` 做最小一致性修正，补充固定基准点、三点 diff、双轴代码审查和需求轴降级口径。
74. 项目负责人已确认 P4-WP5 验收通过。
75. 已启动 P4-WP6：核心场景测试与发布前检查 Skill 设计。
76. 已创建 `harness-assets/skills/core-scenario-test/SKILL.md`、`harness-assets/skills/core-scenario-test/output-template.md`、`harness-assets/skills/release-check/SKILL.md` 和 `harness-assets/skills/release-check/output-template.md`。
77. 已对核心场景测试和发布检查 Prompt、workflow 及 `CONTEXT.md` 做最小一致性修正，补充证据分层准入、发布材料硬门槛、受限命令边界和生产验证计划边界。
78. 已将 P4-WP6 提交项目负责人验收。
79. 项目负责人已确认 P4-WP6 验收通过。
80. 已启动 P4-WP7：Skill 示例案例，并确认示例覆盖 P4 全链路 8 个 Skill。
81. 已创建 P4-WP7 的 8 个脱敏 Skill 示例案例，覆盖需求评审、编码计划、TDD、辅助编码、代码审查、提交检查、核心场景测试和发布检查。
82. 已同步 `docs/V1_IMPLEMENTATION_PLAN.md` 和 `CONTEXT.md` 中的 Skill 示例覆盖口径，并将 P4-WP7 提交项目负责人验收。
83. 项目负责人已确认 P4-WP7 验收通过，P4 Skill 工程资产 V1 阶段完成。
84. 已启动 P5-WP1：门禁目录与报告模板，并通过 grill-with-docs 确认 V1 门禁采用建议性质结论、阻断建议项与风险提示项分离、默认不执行命令和审计证据记录口径。
85. 已创建 `harness-assets/gates/README.md` 和 `harness-assets/gates/_gate-template.md`。
86. 已同步 `CONTEXT.md` 的门禁建议结论、阻断建议项与风险提示项、门禁审计证据等术语口径，并将 P5-WP1 提交项目负责人验收。
87. 项目负责人已确认 P5-WP1 验收通过。
88. 已启动 P5-WP2：需求与编码准入门禁。
89. 已创建 `harness-assets/gates/requirement-entry-gate.md` 和 `harness-assets/gates/coding-entry-gate.md`。
90. 已同步 `CONTEXT.md` 的需求准入门禁和编码准入门禁术语口径，并将 P5-WP2 提交项目负责人验收。
91. 项目负责人已确认 P5-WP2 验收通过。
92. 已启动 P5-WP3：提测与合并门禁。
93. 已创建 `harness-assets/gates/coding-to-test-gate.md` 和 `harness-assets/gates/merge-gate.md`。
94. 已同步 `CONTEXT.md` 的提测门禁和合并门禁术语口径，并将 P5-WP3 提交项目负责人验收。
95. 项目负责人已确认 P5-WP3 验收通过。
96. 已启动 P5-WP4：发布准入门禁。
97. 已创建 `harness-assets/gates/release-gate.md`。
98. 已同步 `CONTEXT.md` 的发布准入门禁术语口径，并将 P5-WP4 提交项目负责人验收。
99. 项目负责人已确认 P5-WP4 验收通过。
100. 已启动 P5-WP5：工具权限与操作审计矩阵，并通过 grill-with-docs 确认矩阵边界、权限分级、场景粒度、本地修改权限和高风险操作禁止边界。
101. 已创建 `harness-assets/docs/TOOL_PERMISSION_AUDIT_MATRIX.md`。
102. 已同步 `CONTEXT.md` 的工具权限与操作审计矩阵、V1 工具权限等级、本地修改权限和高风险操作禁止边界术语口径，并将 P5-WP5 提交项目负责人验收。
103. 项目负责人已确认 P5-WP5 验收通过。
104. 已启动 P5-WP6：结构化 Schema。
105. 已确认 P5-WP6 的 V1 结构化输出 Schema、稳定枚举代码、Schema 引用结构和问题分层口径。
106. 已创建 `harness-assets/schemas/review-result.schema.json`、`harness-assets/schemas/gate-result.schema.json` 和 `harness-assets/schemas/risk-level.schema.json`，并将 P5-WP6 提交项目负责人验收。
107. 项目负责人已确认 P5-WP6 验收通过。
108. 已启动 P5-WP7：Harness 资产回归样例。
109. 已创建 `harness-assets/examples/regression/README.md`、`requirement-review-regression.md`、`code-review-regression.md`、`release-check-regression.md` 和 `high-risk-cases.md`。
110. 已将 P5-WP7 提交项目负责人验收，并按项目负责人同轮实施 P5 剩余工作要求启动 P5-WP8。
111. 已创建 `harness-assets/docs/V1_ACCEPTANCE_CHECKLIST.md`。
112. 已将 P5-WP8 提交项目负责人验收。
113. 项目负责人已确认 P5-WP7 和 P5-WP8 验收通过。
114. P5 门禁与验收资产阶段已完成。
115. 已启动 P6-WP1：试点项目清单模板。
116. 已通过 grill-with-docs 确认 P6 阶段只交付试点运营支撑模板，不记录真实试点结果；P6-WP1 定位为候选评估和选择建议模板，不作为真实试点执行台账。
117. 已创建 `harness-assets/docs/pilot/PILOT_PROJECTS.md`，覆盖候选项目、风险等级、团队角色、适用场景、排除原因和敏感信息禁止边界。
118. 已将 P6-WP1 提交项目负责人验收。
119. 项目负责人已确认 P6-WP1 验收通过。
120. 已启动 P6-WP2：基线指标采集方案。
121. 已创建 `harness-assets/docs/pilot/BASELINE_METRICS_PLAN.md`，覆盖效率、质量、过程和安全指标，并明确数据来源、采集周期、统计口径、责任角色和缺失数据处理方式。
122. 已将 P6-WP2 提交项目负责人验收。
123. 项目负责人已确认 P6-WP2 验收通过。
124. 已启动 P6-WP3：试点使用记录模板。
125. 已创建 `harness-assets/docs/pilot/PILOT_USAGE_LOG.md`，覆盖使用场景、输入来源、输出结论、采纳情况、问题和改进建议，并禁止记录客户敏感信息、生产密钥和原始交互全文。
126. 已将 P6-WP3 提交项目负责人验收。
127. 项目负责人已确认 P6-WP3 验收通过。
128. 已启动 P6-WP4：V1 复盘报告模板。
129. 已创建 `harness-assets/docs/pilot/V1_REVIEW_REPORT_TEMPLATE.md`，覆盖有效场景、无效场景、Prompt 优化、规则优化、安全问题、V2 建议和推广计划，并区分事实数据、分析判断和建议动作。
130. 已将 P6-WP4 提交项目负责人验收。
131. 项目负责人已确认 P6-WP4 验收通过。
132. P6 试点运营支撑阶段已完成。
133. 已根据项目负责人指令，将项目名称统一调整为 `hicode`。
134. 已根据项目负责人指令，将目标项目运行目录统一调整为 `.hicode/`；`harness-assets/` 作为本仓库源资产目录暂不变更。
135. 已通过 ECC 对标确认 V2 演进方向：引入 `harness-assets/agents/` 子 Agent、Agent 与 Prompt 整合、`DAILY/LIBRARY` 选择性安装、`harness-assets/install/` 和门禁 Hook 化。
136. 已创建 `docs/adr/0001-adopt-ecc-inspired-hicode-v2-architecture.md`，记录采用 ECC 启发但不复制 ECC 全量通用体系的架构决策。
137. 已创建 `docs/V2_IMPLEMENTATION_PLAN.md`，将 V2 拆分为子 Agent、整合规范、选择性安装、Hook 化和回归验收五个阶段，并提交项目负责人验收。
138. 项目负责人已确认 `V2-PLAN` 验收通过，并允许后续从 `V2-P1-WP1` 子 Agent 目录规范开始实施。
139. 已根据项目负责人指令启动 `V2-P1-WP1` 子 Agent 目录规范，开始对照 V2 计划、`CONTEXT.md` 和 ECC Agent 结构确认目录规范。
140. 已通过 grill-with-docs 确认 Agent frontmatter、单文件平铺结构、Prompt 防护基线、10 段式模板结构和 README 范围边界。
141. 已创建 `harness-assets/agents/README.md` 和 `harness-assets/agents/_template.md`，并将 `V2-P1-WP1` 提交项目负责人验收。
142. 项目负责人已确认 `V2-P1-WP1` 验收通过，子 Agent 目录规范工作包完成。
143. 已根据项目负责人指令启动 `V2-P1-WP2` 首批 8 个子 Agent 设计和实施，进入 grill-with-docs 设计确认。
144. 已通过 grill-with-docs 确认首批 8 个 Agent 名单、规则源引用、短角色入口、受控修改权限、专项审查触发和建议结论口径。
145. 已创建 `requirement-reviewer`、`coding-planner`、`tdd-guide`、`coding-assistant`、`code-reviewer`、`security-reviewer`、`java-reviewer` 和 `release-reviewer` 8 个 Agent 文件，并将 `V2-P1-WP2` 提交项目负责人验收。
146. 项目负责人已确认 `V2-P1-WP2` 验收通过，首批 8 个子 Agent 工作包完成。

## 4. 当前阻塞点

暂无阻塞。

## 5. 下一步建议

1. V1 仓库资产建设和 P6 试点运营支撑阶段已完成。
2. `docs/V2_IMPLEMENTATION_PLAN.md` 已确认验收通过。
3. `V2-P1-WP1` 子 Agent 目录规范已确认验收通过。
4. 本工作包只创建 `harness-assets/agents/README.md` 和 `_template.md`，未创建首批 8 个子 Agent。
5. `V2-P1-WP2` 首批 8 个子 Agent 已确认验收通过。
6. 下一步可由项目负责人明确启动 `V2-P2-WP1` Agent-Prompt-Skill-Gate 整合规范。
7. 后续若启动 V2 工作包，必须以 V2 计划为准，并保持 V1 已完成基线不回改。
8. 后续若进入真实试点运行效果验收，必须基于真实试点数据补充，不能用本仓库模板资产替代。
9. 不得把 P6 模板资产验收写成真实试点运行效果已达成。

## 6. 工作包状态表

| 工作包编号 | 工作包名称 | 状态 | 当前产出 | 依赖 | 备注 |
|---|---|---|---|---|---|
| P1-WP1 | 项目入口与术语上下文 | 已完成 | `AGENTS.md`、`CONTEXT.md` | 无 | 项目负责人已确认验收通过 |
| P1-WP2 | V1 实施计划 | 已完成 | `docs/V1_IMPLEMENTATION_PLAN.md` | P1-WP1 | 项目负责人已确认验收通过 |
| P1-WP3 | 项目进度台账 | 已完成 | `docs/PROGRESS.md` | P1-WP2 | 项目负责人已确认验收通过 |
| P2-WP1 | `harness-assets/` 目录与基础模板 | 已完成 | `harness-assets/AGENTS.md`、`harness-assets/docs/` 基础模板、`harness-assets/docs/ADR/`、`harness-assets/docs/workflows/README.md` | P1-WP2、P1-WP3 | 项目负责人已确认验收通过 |
| P2-WP2 | 领域知识文档初版 | 已完成 | `harness-assets/docs/DOMAIN_KNOWLEDGE.md` | P2-WP1 | 项目负责人已确认验收通过 |
| P2-WP3 | 需求与研发上下文模板 | 已完成 | `harness-assets/docs/PRD_CONTEXT.md`、`harness-assets/docs/PROJ_CONTEXT.md` | P2-WP1 | 项目负责人已确认验收通过 |
| P2-WP4 | 编码与测试规范文档 | 已完成 | `harness-assets/docs/CODING_RULES.md`、`harness-assets/docs/TESTING_GUIDE.md` | P2-WP1 | 项目负责人已确认验收通过 |
| P2-WP5 | Review、发布和缺陷文档 | 已完成 | `harness-assets/docs/REVIEW_RULES.md`、`harness-assets/docs/review-rules/`、`harness-assets/docs/RELEASE_GUIDE.md`、`harness-assets/docs/DEFECT_CASES.md` | P2-WP1 | 项目负责人已确认验收通过 |
| P2-WP6 | ADR 与流程文档 | 已完成 | `harness-assets/docs/ADR/README.md`、`harness-assets/docs/ADR/ADR-template.md`、`harness-assets/docs/workflows/` | P2-WP1 | 项目负责人已确认验收通过 |
| P3-WP1 | Prompt 模板规范 | 已完成 | `harness-assets/prompts/README.md`、`harness-assets/prompts/_template.md` | P2-WP4、P2-WP5 | 项目负责人已确认验收通过 |
| P3-WP2 | 需求评审与编码计划 Prompt | 已完成 | `harness-assets/prompts/requirement-review.md`、`harness-assets/prompts/coding-plan.md` | P3-WP1 | 项目负责人已确认验收通过 |
| P3-WP3 | TDD 与辅助编码 Prompt | 已完成 | `harness-assets/prompts/tdd.md`、`harness-assets/prompts/coding-assistant.md` | P3-WP1、P3-WP2 | 项目负责人已确认验收通过 |
| P3-WP4 | 代码审查与提交检查 Prompt | 已完成 | `harness-assets/prompts/code-review.md`、`harness-assets/prompts/pre-commit-check.md` | P3-WP1、P3-WP3 | 项目负责人已确认验收通过 |
| P3-WP5 | 核心场景测试与发布检查 Prompt | 已完成 | `harness-assets/prompts/core-scenario-test.md`、`harness-assets/prompts/release-check.md` | P3-WP1、P2-WP5 | 项目负责人已确认验收通过 |
| P4-WP1 | Skill 目录规范 | 已完成 | `harness-assets/skills/README.md`、`harness-assets/skills/_template/SKILL.md`、`harness-assets/skills/_template/output-template.md` | P3-WP1 | 项目负责人已确认继续下一工作包 |
| P4-WP2 | 需求评审 Skill | 已完成 | `harness-assets/skills/requirement-review/SKILL.md`、`harness-assets/skills/requirement-review/output-template.md` | P4-WP1、P3-WP2 | 项目负责人已确认验收通过 |
| P4-WP3 | 编码计划辅助 Skill | 已完成 | `harness-assets/skills/coding-plan/SKILL.md`、`harness-assets/skills/coding-plan/output-template.md` | P4-WP1、P3-WP2 | 项目负责人已确认验收通过 |
| P4-WP4 | TDD 与辅助编码 Skill | 已完成 | `harness-assets/skills/tdd/SKILL.md`、`harness-assets/skills/tdd/output-template.md`、`harness-assets/skills/coding-assistant/SKILL.md`、`harness-assets/skills/coding-assistant/output-template.md` | P4-WP1、P3-WP3 | 项目负责人已确认验收通过 |
| P4-WP5 | 代码审查与提交检查 Skill | 已完成 | `harness-assets/skills/code-review/SKILL.md`、`harness-assets/skills/code-review/output-template.md`、`harness-assets/skills/pre-commit-check/SKILL.md`、`harness-assets/skills/pre-commit-check/output-template.md` | P4-WP1、P3-WP4 | 项目负责人已确认验收通过 |
| P4-WP6 | 核心场景测试与发布前检查 Skill | 已完成 | `harness-assets/skills/core-scenario-test/SKILL.md`、`harness-assets/skills/core-scenario-test/output-template.md`、`harness-assets/skills/release-check/SKILL.md`、`harness-assets/skills/release-check/output-template.md` | P4-WP1、P3-WP5 | 项目负责人已确认验收通过 |
| P4-WP7 | Skill 示例案例 | 已完成 | `harness-assets/examples/requirement-review-example.md`、`harness-assets/examples/coding-plan-example.md`、`harness-assets/examples/tdd-example.md`、`harness-assets/examples/coding-assistant-example.md`、`harness-assets/examples/code-review-example.md`、`harness-assets/examples/pre-commit-check-example.md`、`harness-assets/examples/core-scenario-test-example.md`、`harness-assets/examples/release-check-example.md` | P4-WP2 至 P4-WP6 | 项目负责人已确认验收通过 |
| P5-WP1 | 门禁目录与报告模板 | 已完成 | `harness-assets/gates/README.md`、`harness-assets/gates/_gate-template.md` | P4-WP5、P4-WP6 | 项目负责人已确认验收通过 |
| P5-WP2 | 需求与编码准入门禁 | 已完成 | `harness-assets/gates/requirement-entry-gate.md`、`harness-assets/gates/coding-entry-gate.md` | P5-WP1、P4-WP2、P4-WP3 | 项目负责人已确认验收通过 |
| P5-WP3 | 提测与合并门禁 | 已完成 | `harness-assets/gates/coding-to-test-gate.md`、`harness-assets/gates/merge-gate.md` | P5-WP1、P4-WP4、P4-WP5 | 项目负责人已确认验收通过 |
| P5-WP4 | 发布准入门禁 | 已完成 | `harness-assets/gates/release-gate.md` | P5-WP1、P4-WP6 | 项目负责人已确认验收通过 |
| P5-WP5 | 工具权限与操作审计矩阵 | 已完成 | `harness-assets/docs/TOOL_PERMISSION_AUDIT_MATRIX.md` | P5-WP1、P4-WP2 至 P4-WP6 | 项目负责人已确认验收通过 |
| P5-WP6 | 结构化 Schema | 已完成 | `harness-assets/schemas/review-result.schema.json`、`harness-assets/schemas/gate-result.schema.json`、`harness-assets/schemas/risk-level.schema.json` | P4-WP5、P5-WP1、P5-WP5 | 项目负责人已确认验收通过 |
| P5-WP7 | Harness 资产回归样例 | 已完成 | `harness-assets/examples/regression/README.md`、`requirement-review-regression.md`、`code-review-regression.md`、`release-check-regression.md`、`high-risk-cases.md` | P4-WP7、P5-WP4、P5-WP6 | 项目负责人已确认验收通过 |
| P5-WP8 | V1 验收检查清单 | 已完成 | `harness-assets/docs/V1_ACCEPTANCE_CHECKLIST.md` | P5-WP5、P5-WP6、P5-WP7 | 项目负责人已确认验收通过 |
| P6-WP1 | 试点项目清单模板 | 已完成 | `harness-assets/docs/pilot/PILOT_PROJECTS.md` | P5-WP8 | 项目负责人已确认验收通过 |
| P6-WP2 | 基线指标采集方案 | 已完成 | `harness-assets/docs/pilot/BASELINE_METRICS_PLAN.md` | P5-WP8 | 项目负责人已确认验收通过 |
| P6-WP3 | 试点使用记录模板 | 已完成 | `harness-assets/docs/pilot/PILOT_USAGE_LOG.md` | P4-WP7、P5-WP4 | 项目负责人已确认验收通过 |
| P6-WP4 | V1 复盘报告模板 | 已完成 | `harness-assets/docs/pilot/V1_REVIEW_REPORT_TEMPLATE.md` | P6-WP2、P6-WP3 | 项目负责人已确认验收通过 |

## 7. V2 规划状态表

| 工作包编号 | 工作包名称 | 状态 | 当前产出 | 依赖 | 备注 |
|---|---|---|---|---|---|
| V2-PLAN | V2 实施计划 | 已完成 | `docs/V2_IMPLEMENTATION_PLAN.md`、`docs/adr/0001-adopt-ecc-inspired-hicode-v2-architecture.md`、`CONTEXT.md` V2 术语 | V1 已完成、ECC 对标确认 | 项目负责人已确认验收通过 |
| V2-P1-WP1 | 子 Agent 目录规范 | 已完成 | `harness-assets/agents/README.md`、`harness-assets/agents/_template.md` | V2-PLAN | 项目负责人已确认验收通过 |
| V2-P1-WP2 | 首批 8 个子 Agent | 已完成 | `harness-assets/agents/requirement-reviewer.md`、`harness-assets/agents/coding-planner.md`、`harness-assets/agents/tdd-guide.md`、`harness-assets/agents/coding-assistant.md`、`harness-assets/agents/code-reviewer.md`、`harness-assets/agents/security-reviewer.md`、`harness-assets/agents/java-reviewer.md`、`harness-assets/agents/release-reviewer.md` | V2-P1-WP1 | 项目负责人已确认验收通过 |
| V2-P2-WP1 | Agent-Prompt-Skill-Gate 整合规范 | 未开始 | 待创建 | V2-P1 | 不自动启动，需项目负责人确认 |
| V2-P2-WP2 | 目标项目入口更新 | 未开始 | 待创建 | V2-P2-WP1 | 不自动启动，需项目负责人确认 |
| V2-P3-WP1 | 安装规划目录 | 未开始 | 待创建 | V2-P1、V2-P2 | 不自动启动，需项目负责人确认 |
| V2-P3-WP2 | manifests 与 profiles 初版 | 未开始 | 待创建 | V2-P3-WP1 | 不自动启动，需项目负责人确认 |
| V2-P4-WP1 | Hook 规范 | 未开始 | 待创建 | V2-P3 | 不自动启动，需项目负责人确认 |
| V2-P4-WP2 | 核心 Hook 示例 | 未开始 | 待创建 | V2-P4-WP1 | 不自动启动，需项目负责人确认 |
| V2-P5-WP1 | V2 回归样例 | 未开始 | 待创建 | V2-P1 至 V2-P4 | 不自动启动，需项目负责人确认 |
| V2-P5-WP2 | V2 验收检查清单 | 未开始 | 待创建 | V2-P5-WP1 | 不自动启动，需项目负责人确认 |

## 8. 最近变更记录

| 日期 | 操作者 | 变更 | 关联工作包 |
|---|---|---|---|
| 2026-06-10 | Codex | 根据项目负责人确认，将 `V2-P1-WP2` 首批 8 个子 Agent 更新为已完成 | V2-P1-WP2 |
| 2026-06-10 | Codex | 创建首批 8 个子 Agent，覆盖需求评审、编码计划、TDD、辅助编码、代码审查、安全审查、Java 专项审查和发布审查，并提交 `V2-P1-WP2` 待验收 | V2-P1-WP2 |
| 2026-06-10 | Codex | 根据项目负责人指令启动 `V2-P1-WP2` 首批 8 个子 Agent 设计和实施 | V2-P1-WP2 |
| 2026-06-10 | Codex | 根据项目负责人确认，将 `V2-P1-WP1` 子 Agent 目录规范更新为已完成 | V2-P1-WP1 |
| 2026-06-10 | Codex | 创建子 Agent 目录规范和模板，覆盖 frontmatter、单文件平铺、Prompt 防护基线、10 段式模板、安全红线和 README 范围边界，并提交 `V2-P1-WP1` 待验收 | V2-P1-WP1 |
| 2026-06-09 | Codex | 根据项目负责人确认，将 `V2-PLAN` 更新为已完成，并记录后续可从 `V2-P1-WP1` 子 Agent 目录规范开始实施 | V2-PLAN、V2-P1-WP1 |
| 2026-06-09 | Codex | 根据项目负责人指令启动 `V2-P1-WP1`，开始确认子 Agent 目录规范 | V2-P1-WP1 |
| 2026-06-09 | Codex | 参考本地 ECC 确认 V2 采用子 Agent、Agent-Prompt 整合、DAILY/LIBRARY 选择性安装、门禁 Hook 化和自动化红线；创建 V2 ADR 和 V2 实施计划，并提交待验收 | V2-PLAN |
| 2026-06-03 | Codex | 创建 `AGENTS.md`，初始化 git，移动需求文档到 `docs/`，补充中文为主的语言规则 | P1-WP1 |
| 2026-06-03 | Codex | 通过 grill-with-docs 确认 V1 实施计划文档、进度台账、工作包粒度、范围、顺序、编号和状态规则 | P1-WP1、P1-WP2、P1-WP3 |
| 2026-06-03 | Codex | 创建 `CONTEXT.md`、`docs/V1_IMPLEMENTATION_PLAN.md`、`docs/PROGRESS.md` | P1-WP1、P1-WP2、P1-WP3 |
| 2026-06-03 | Codex | 更新 `AGENTS.md`，加入固定上下文读取顺序、工作包执行规则和进度台账更新要求 | P1-WP1、P1-WP3 |
| 2026-06-03 | Codex | 明确未来研发上下文文档命名为 `harness-assets/docs/PROJ_CONTEXT.md`，避免与根目录术语表混淆 | P2-WP3 |
| 2026-06-03 | Codex | 根据项目负责人确认，将 P1-WP1、P1-WP2、P1-WP3 更新为已完成，并启动 P2-WP1 | P1-WP1、P1-WP2、P1-WP3、P2-WP1 |
| 2026-06-03 | Codex | 确认 Harness 交付资产统一放入 `harness-assets/`，并同步更新入口规则、术语边界和实施计划路径 | P2-WP1 |
| 2026-06-03 | Codex | 确认目标项目入口模板为 `harness-assets/AGENTS.md`，根目录 `AGENTS.md` 保留为本仓库规则 | P2-WP1 |
| 2026-06-03 | Codex | 创建 `harness-assets/AGENTS.md` 和 P2-WP1 基础文档模板，并将 P2-WP1 提交待验收 | P2-WP1 |
| 2026-06-03 | Codex | 根据项目负责人确认，将 P2-WP1 更新为已完成，并启动 P2-WP2 | P2-WP1、P2-WP2 |
| 2026-06-03 | Codex | 补充 `harness-assets/docs/DOMAIN_KNOWLEDGE.md` 初版，并将 P2-WP2 提交待验收 | P2-WP2 |
| 2026-06-03 | Codex | 根据项目负责人确认，将 P2-WP2 更新为已完成，并启动 P2-WP3 | P2-WP2、P2-WP3 |
| 2026-06-03 | Codex | 完善 `harness-assets/docs/PRD_CONTEXT.md` 和 `harness-assets/docs/PROJ_CONTEXT.md`，并将 P2-WP3 提交待验收 | P2-WP3 |
| 2026-06-03 | Codex | 完善 `harness-assets/docs/CODING_RULES.md` 和 `harness-assets/docs/TESTING_GUIDE.md`，并将 P2-WP4 提交待验收 | P2-WP4 |
| 2026-06-03 | Codex | 根据项目负责人确认，将 P2-WP4 更新为已完成，并启动 P2-WP5 | P2-WP4、P2-WP5 |
| 2026-06-03 | Codex | 完善 `harness-assets/docs/REVIEW_RULES.md`、`harness-assets/docs/RELEASE_GUIDE.md` 和 `harness-assets/docs/DEFECT_CASES.md`，并将 P2-WP5 提交待验收 | P2-WP5 |
| 2026-06-03 | Codex | 根据项目负责人确认，将 P2-WP5 更新为已完成，并启动 P2-WP6 | P2-WP5、P2-WP6 |
| 2026-06-04 | Codex | 完善 `harness-assets/docs/ADR/` 和 `harness-assets/docs/workflows/`，并将 P2-WP6 提交待验收 | P2-WP6 |
| 2026-06-04 | Codex | 根据项目负责人确认，将 P2-WP6 更新为已完成，并启动 P3-WP1 | P2-WP6、P3-WP1 |
| 2026-06-04 | Codex | 创建 `harness-assets/prompts/README.md` 和 `_template.md`，并将 P3-WP1 提交待验收 | P3-WP1 |
| 2026-06-04 | Codex | 全局调整 Harness 源资产路径：本仓库使用可见目录维护，后续由安装脚本放入目标项目 `.hicode/` | P3-WP1 |
| 2026-06-04 | Codex | 优化根目录 `AGENTS.md`，默认读取执行基准，需求草案改为按需读取 | 项目入口规则 |
| 2026-06-04 | Codex | 记录 Harness 默认服务对象为保险/金融核心系统研发，并将金融核心系统风险标准和保险核心业务逻辑严谨性作为后续资产设计背景 | 项目背景 |
| 2026-06-04 | Codex | 将金融核心系统风险标准和保险核心业务逻辑严谨性补入 Prompt 模板规范 | P3-WP1 |
| 2026-06-04 | Codex | 基于金融核心系统背景补强 P1/P2 文档，统一风险基线和保险核心业务逻辑严谨性检查口径 | P1、P2 |
| 2026-06-03 | Codex | 根据项目负责人确认，将 P2-WP3 更新为已完成，并启动 P2-WP4 | P2-WP3、P2-WP4 |
| 2026-06-04 | Codex | 对齐 V1 实施计划与需求草案和上下文，补充需求路线映射、Review 分层规则、P5 权限审计矩阵和回归样例工作包 | P1-WP2、P5 |
| 2026-06-04 | Codex | 根据项目负责人确认，将 P3-WP1 更新为已完成，并启动 P3-WP2 | P3-WP1、P3-WP2 |
| 2026-06-04 | Codex | 创建需求评审与编码计划 Prompt，并将 P3-WP2 提交待验收 | P3-WP2 |
| 2026-06-04 | Codex | 收到项目负责人验收反馈，按统一 Prompt 骨架调整 P3-WP2 | P3-WP2 |
| 2026-06-04 | Codex | 将 Prompt 模板规范和 P3-WP2 Prompt 调整为统一骨架，并重新提交待验收 | P3-WP1、P3-WP2 |
| 2026-06-04 | Codex | 根据项目负责人确认，采用八段式主骨架并将十二段式语义收敛为子项，P3-WP2 更新为已完成 | P3-WP1、P3-WP2 |
| 2026-06-05 | Codex | 根据项目负责人确认，启动 P3-WP3 并明确 TDD、辅助编码、受限命令和任务模式边界 | P3-WP3 |
| 2026-06-05 | Codex | 创建 TDD 与辅助编码 Prompt，并将 P3-WP3 提交待验收 | P3-WP3 |
| 2026-06-05 | Codex | 根据项目负责人确认，将 P3-WP3 更新为已完成，并启动 P3-WP4 | P3-WP3、P3-WP4 |
| 2026-06-05 | Codex | 参考 NIST、OWASP、CISA、GitHub、GitLab 和 Superpowers 代码审查资料，确认 P3-WP4 设计边界 | P3-WP4 |
| 2026-06-05 | Codex | 创建代码审查与提交检查 Prompt，并将 P3-WP4 提交待验收 | P3-WP4 |
| 2026-06-05 | Codex | 根据项目负责人确认，将 P3-WP4 更新为已完成 | P3-WP4 |
| 2026-06-05 | Codex | 根据项目负责人指令，启动 P3-WP5：核心场景测试与发布检查 Prompt | P3-WP5 |
| 2026-06-05 | Codex | 创建核心场景测试与发布检查 Prompt，并同步修正相关 workflow 上下文，将 P3-WP5 提交待验收 | P3-WP5 |
| 2026-06-05 | Codex | 根据项目负责人确认，将 P3-WP5 更新为已完成，并启动 P4-WP1 | P3-WP5、P4-WP1 |
| 2026-06-05 | Codex | 参考 Claude Skills、Agent Skills Specification、Superpowers 和 Matt Pocock Skills，创建 Skill 目录规范和模板，并将 P4-WP1 提交待验收 | P4-WP1 |
| 2026-06-08 | Codex | 根据项目负责人继续下一工作包的指令，将 P4-WP1 更新为已完成，并启动 P4-WP2 | P4-WP1、P4-WP2 |
| 2026-06-08 | Codex | 创建需求评审 Skill 和输出模板，并将 P4-WP2 提交待验收 | P4-WP2 |
| 2026-06-08 | Codex | 同步修正需求草案中的 Skill 入口路径，保持与 P4-WP1 `SKILL.md` 标准一致 | P4-WP1、P4-WP2 |
| 2026-06-08 | Codex | 根据项目负责人确认，将 P4-WP2 更新为已完成，并启动 P4-WP3 | P4-WP2、P4-WP3 |
| 2026-06-08 | Codex | 参考 `grill-with-docs` 的文档驱动追问纪律，创建编码计划辅助 Skill 和输出模板，并将 P4-WP3 提交待验收 | P4-WP3 |
| 2026-06-08 | Codex | 根据项目负责人确认，将 P4-WP3 更新为已完成，并启动 P4-WP4 | P4-WP3、P4-WP4 |
| 2026-06-08 | Codex | 参考 Matt Pocock `tdd` Skill，创建 TDD 与辅助编码 Skill，并将 P4-WP4 提交待验收 | P4-WP4 |
| 2026-06-08 | Codex | 根据项目负责人确认，将 P4-WP4 更新为已完成，并启动 P4-WP5 设计 | P4-WP4、P4-WP5 |
| 2026-06-08 | Codex | 参考 Matt Pocock `review` Skill，创建代码审查与提交检查 Skill，并将 P4-WP5 提交待验收 | P4-WP5 |
| 2026-06-08 | Codex | 根据项目负责人确认，将 P4-WP5 更新为已完成 | P4-WP5 |
| 2026-06-08 | Codex | 根据项目负责人继续下一工作包的指令，启动 P4-WP6 设计 | P4-WP6 |
| 2026-06-08 | Codex | 创建核心场景测试与发布前检查 Skill，补齐 Prompt、workflow 和上下文一致性，并将 P4-WP6 提交待验收 | P4-WP6 |
| 2026-06-08 | Codex | 根据项目负责人确认，将 P4-WP6 更新为已完成 | P4-WP6 |
| 2026-06-08 | Codex | 根据项目负责人指令，启动 P4-WP7 并确认覆盖 P4 全链路 8 个 Skill 示例 | P4-WP7 |
| 2026-06-08 | Codex | 创建 8 个脱敏 Skill 示例案例，同步计划和上下文口径，并将 P4-WP7 提交待验收 | P4-WP7 |
| 2026-06-08 | Codex | 根据项目负责人确认，将 P4-WP7 更新为已完成，P4 Skill 工程资产 V1 阶段完成 | P4-WP7 |
| 2026-06-08 | Codex | 根据项目负责人指令，启动 P5-WP1 并确认门禁目录与报告模板设计口径 | P5-WP1 |
| 2026-06-08 | Codex | 创建门禁目录规范和通用报告模板，同步门禁术语上下文，并将 P5-WP1 提交待验收 | P5-WP1 |
| 2026-06-08 | Codex | 根据项目负责人确认，将 P5-WP1 更新为已完成，并启动 P5-WP2 | P5-WP1、P5-WP2 |
| 2026-06-08 | Codex | 创建需求准入门禁和编码准入门禁，同步门禁术语上下文，并将 P5-WP2 提交待验收 | P5-WP2 |
| 2026-06-08 | Codex | 根据项目负责人确认，将 P5-WP2 更新为已完成，并启动 P5-WP3 | P5-WP2、P5-WP3 |
| 2026-06-08 | Codex | 创建提测门禁和合并门禁，同步门禁术语上下文，并将 P5-WP3 提交待验收 | P5-WP3 |
| 2026-06-09 | Codex | 根据项目负责人确认，将 P5-WP3 更新为已完成，并启动 P5-WP4 | P5-WP3、P5-WP4 |
| 2026-06-09 | Codex | 创建发布准入门禁，同步门禁术语上下文，并将 P5-WP4 提交待验收 | P5-WP4 |
| 2026-06-09 | Codex | 根据项目负责人确认，将 P5-WP4 更新为已完成，并启动 P5-WP5 | P5-WP4、P5-WP5 |
| 2026-06-09 | Codex | 通过 grill-with-docs 确认工具权限矩阵边界，创建工具权限与操作审计矩阵，并将 P5-WP5 提交待验收 | P5-WP5 |
| 2026-06-09 | Codex | 根据项目负责人确认，将 P5-WP5 更新为已完成，并启动 P5-WP6 | P5-WP5、P5-WP6 |
| 2026-06-09 | Codex | 创建 Review、门禁和共享风险等级结构化 Schema，并将 P5-WP6 提交待验收 | P5-WP6 |
| 2026-06-09 | Codex | 根据项目负责人确认，将 P5-WP6 更新为已完成，并启动 P5-WP7 | P5-WP6、P5-WP7 |
| 2026-06-09 | Codex | 创建 Harness 资产回归样例，并将 P5-WP7 提交待验收 | P5-WP7 |
| 2026-06-09 | Codex | 创建 V1 验收检查清单，并将 P5-WP8 提交待验收 | P5-WP8 |
| 2026-06-09 | Codex | 根据项目负责人确认，将 P5-WP7 和 P5-WP8 更新为已完成，P5 阶段收口 | P5-WP7、P5-WP8 |
| 2026-06-09 | Codex | 启动 P6-WP1，创建试点项目候选评估和选择建议模板，并将 P6-WP1 提交待验收 | P6-WP1 |
| 2026-06-09 | Codex | 根据项目负责人确认，将 P6-WP1 更新为已完成，并创建基线指标采集方案提交 P6-WP2 待验收 | P6-WP1、P6-WP2 |
| 2026-06-09 | Codex | 根据项目负责人确认，将 P6-WP2 更新为已完成，并创建试点使用记录模板提交 P6-WP3 待验收 | P6-WP2、P6-WP3 |
| 2026-06-09 | Codex | 根据项目负责人确认，将 P6-WP3 更新为已完成，并创建 V1 复盘报告模板提交 P6-WP4 待验收 | P6-WP3、P6-WP4 |
| 2026-06-09 | Codex | 根据项目负责人确认，将 P6-WP4 更新为已完成，P6 试点运营支撑阶段完成 | P6-WP4 |
| 2026-06-09 | Codex | 根据项目负责人指令，将项目名称统一调整为 `hicode` | 项目命名维护 |
| 2026-06-09 | Codex | 根据项目负责人指令，将目标项目运行目录统一调整为 `.hicode/`，本仓库源资产目录 `harness-assets/` 暂不变更 | 项目命名维护 |
