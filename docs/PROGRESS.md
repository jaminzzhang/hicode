# 项目进度台账

## 1. 当前状态

最近更新时间：2026-06-05
当前阶段：P4 Skill 工程资产 V1
当前工作包：P4-WP1
总体状态：待验收

本台账用于记录 V1 工作包推进状态。每次开发 Agent 开始、完成、阻塞、暂缓或提交工作包验收时，必须同步更新本文件。

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
35. 已根据项目负责人调整，将 Harness 运行资产源目录改为 `harness-assets/prompts/`、`harness-assets/skills/`、`harness-assets/gates/`、`harness-assets/schemas/` 和 `harness-assets/examples/`，不在 `harness-assets/` 下直接维护隐藏 `.ai-harness/` 目录。
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

## 4. 当前阻塞点

暂无阻塞。

## 5. 下一步建议

1. 项目负责人验收 P4-WP1。
2. 验收通过后，将 P4-WP1 状态更新为 `已完成`。
3. 启动 P4-WP2，建立需求评审 Skill。

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
| P4-WP1 | Skill 目录规范 | 待验收 | `harness-assets/skills/README.md`、`harness-assets/skills/_template/SKILL.md`、`harness-assets/skills/_template/output-template.md` | P3-WP1 | 已按 `SKILL.md` 标准入口调整 |
| P4-WP2 | 需求评审 Skill | 未开始 | 无 | P4-WP1、P3-WP2 | 需求阶段核心 Skill |
| P4-WP3 | 编码计划辅助 Skill | 未开始 | 无 | P4-WP1、P3-WP2 | 编码启动核心 Skill |
| P4-WP4 | TDD 与辅助编码 Skill | 未开始 | 无 | P4-WP1、P3-WP3 | 编码阶段核心 Skill |
| P4-WP5 | 代码审查与提交检查 Skill | 未开始 | 无 | P4-WP1、P3-WP4 | 开发侧质量检查 Skill |
| P4-WP6 | 核心场景测试与发布前检查 Skill | 未开始 | 无 | P4-WP1、P3-WP5 | 测试和发布阶段 Skill |
| P4-WP7 | Skill 示例案例 | 未开始 | 无 | P4-WP2 至 P4-WP6 | 示例不得包含敏感信息 |
| P5-WP1 | 门禁目录与报告模板 | 未开始 | 无 | P4-WP5、P4-WP6 | V1 初期提醒型门禁为主 |
| P5-WP2 | 需求与编码准入门禁 | 未开始 | 无 | P5-WP1、P4-WP2、P4-WP3 | 覆盖需求和编码准入 |
| P5-WP3 | 提测与合并门禁 | 未开始 | 无 | P5-WP1、P4-WP4、P4-WP5 | 覆盖提测和 MR 合并 |
| P5-WP4 | 发布准入门禁 | 未开始 | 无 | P5-WP1、P4-WP6 | Agent 不自动发布 |
| P5-WP5 | 工具权限与操作审计矩阵 | 未开始 | 无 | P5-WP1、P4-WP2 至 P4-WP6 | 覆盖只读、建议、本地修改、受限命令和禁止操作 |
| P5-WP6 | 结构化 Schema | 未开始 | 无 | P4-WP5、P5-WP1、P5-WP5 | 为后续工具化预留 |
| P5-WP7 | Harness 资产回归样例 | 未开始 | 无 | P4-WP7、P5-WP4、P5-WP6 | 覆盖需求评审、代码审查、发布检查和高风险样例 |
| P5-WP8 | V1 验收检查清单 | 未开始 | 无 | P5-WP5、P5-WP6、P5-WP7 | 区分仓库可验收项和试点数据项 |
| P6-WP1 | 试点项目清单模板 | 未开始 | 无 | P5-WP8 | 运营支撑，不展开人员排班 |
| P6-WP2 | 基线指标采集方案 | 未开始 | 无 | P5-WP8 | 不编造基线值 |
| P6-WP3 | 试点使用记录模板 | 未开始 | 无 | P4-WP7、P5-WP4 | 不记录客户敏感信息 |
| P6-WP4 | V1 复盘报告模板 | 未开始 | 无 | P6-WP2、P6-WP3 | 区分事实、分析和建议 |

## 7. 最近变更记录

| 日期 | 操作者 | 变更 | 关联工作包 |
|---|---|---|---|
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
| 2026-06-04 | Codex | 全局调整 Harness 源资产路径：本仓库使用可见目录维护，后续由安装脚本放入目标项目 `.ai-harness/` | P3-WP1 |
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
