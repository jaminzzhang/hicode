# hicode Templates

## 定位

`references/templates/` 保存 hicode 当前可复制、可填写的模板。模板用于生成目标项目入口、项目上下文、项目规则文档和场景报告骨架，不承载执行规则全文。

执行规则必须进入根目录 Skill、专业 Agent 或 `references/rules/`。

## 目录规划

| 目录 | 用途 |
|---|---|
| `project/` | 目标项目入口、上下文、领域知识、项目规则和 ADR 模板 |
| `scope/` | 需求澄清、范围界定、编码计划和准入报告模板 |
| `tdd/` | TDD 计划、测试用例、复现记录和受控实现记录模板 |
| `review/` | 代码审查、提交检查、安全/Java/SQL/保险专项报告模板 |
| `release/` | 核心场景测试、发布检查、回滚计划和发布风险报告模板 |

当前已落地模板：

| 目录 | 文件 |
|---|---|
| `project/` | `AGENTS.md`、`CLAUDE.md`、`DOMAIN_KNOWLEDGE.md`、`PRD_CONTEXT.md`、`PROJ_CONTEXT.md`、`CODING_RULES.md`、`TESTING_GUIDE.md`、`REVIEW_RULES.md`、`RELEASE_GUIDE.md`、`DEFECT_CASES.md`、`ADR-template.md` |
| `scope/` | `scope-report.md` |
| `tdd/` | `tdd-report.md` |
| `review/` | `review-report.md` |
| `release/` | `release-report.md` |

当前已落地模板：

| 目录 | 文件 |
|---|---|
| `project/` | `AGENTS.md`、`CLAUDE.md`、`DOMAIN_KNOWLEDGE.md`、`PRD_CONTEXT.md`、`PROJ_CONTEXT.md`、`CODING_RULES.md`、`TESTING_GUIDE.md`、`REVIEW_RULES.md`、`RELEASE_GUIDE.md`、`DEFECT_CASES.md`、`ADR-template.md` |
| `scope/` | `scope-report.md` |
| `tdd/` | `tdd-report.md` |
| `review/` | `review-report.md` |
| `release/` | `release-report.md` |

## 使用规则

1. `project/` 模板只由 `hicode:init` 在用户确认目标项目写入范围后按需读取。
2. 场景模板只由对应 Skill 在需要输出报告时按需读取。
3. 模板必须保留占位项、填写说明和安全约束。
4. 模板不得包含长篇执行规则；规则应引用或对应 `references/rules/`。
5. 模板不得包含真实客户信息、生产数据、生产地址、密钥、Token 或生产配置。

## 禁止事项

1. 不把模板作为默认上下文加载。
2. 不把模板写成规则库。
3. 不把历史验收清单、试点运营模板、回归样例或旧初始化清单放入当前模板目录。
4. 不在安装器中自动写入目标项目。
