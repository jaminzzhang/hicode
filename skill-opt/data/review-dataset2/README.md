# hicode_review Dataset 2

## 定位

本目录保存 `hicode:review` 的第二组公开来源训练样本。数据用于 SkillOpt 管理侧离线训练和评估，不属于 hicode plugin 运行资产，不安装到目标项目。

本数据集是公开 Code Review 数据层，目标是让 `hicode:review` 继续学习真实 PR review comment 的 diff 定位、问题表达、Java/Spring/MyBatis/RocketMQ 代码语境和建议性结论约束。它不能替代公司内部已脱敏金融保险 MR、缺陷或事故样本。

## 文件

1. `items.jsonl`：300 条源样本，每行一条 JSON，兼容本仓库现有 `hicode_review` dataset validator。
2. `train/items.json`：180 条训练 split。
3. `val/items.json`：60 条验证 split。
4. `test/items.json`：60 条 held-out split。
5. `source-manifest.json`：公开来源、抓取时间、实际 repo 分布和类别分布。

## 实际来源

样本来自 GitHub 官方 Pull Request Review Comments API 的公开仓库评论，均保留每条记录的 `api_url`、`html_url`、`pull_request_url`、`comment_id`、`commit_id`、`created_at` 和 `retrieved_at`。

GitHub 官方文档说明 Pull Request Review Comments 是针对 PR unified diff 某一部分的评论，仓库级接口可以列出公开仓库的 PR review comments，并返回 `diff_hunk`、`path`、`line`、`body`、`html_url`、`pull_request_url` 等字段；公开资源可匿名读取，但匿名请求会受 GitHub REST API 限流约束。

实际入库分布：

| repo | license | 条数 | 主要技术栈 |
|---|---|---:|---|
| `apache/rocketmq` | Apache-2.0 | 128 | Java、RocketMQ、Netty、JUnit |
| `mybatis/mybatis-3` | Apache-2.0 | 121 | Java、MyBatis、SQL、JUnit |
| `mybatis/spring` | Apache-2.0 | 19 | Java、Spring、MyBatis、事务 |
| `spring-projects/spring-boot` | Apache-2.0 | 32 | Java、Spring Boot、配置、测试 |

匿名 GitHub API 抓取在后续仓库上触发限流，因此 `source-manifest.json` 中保留了原计划的候选来源清单，但 `actual_counts_by_repo` 才是本次 300 条真实使用来源。

## 已核验但未直接入库的数据源

这些来源适合后续扩展，但本次 dataset2 未直接下载或混入：

| 数据源 | 可靠性 | 本次处理 |
|---|---|---|
| CodeReviewQA / Hugging Face | MIT License，900 条人工整理高质量样例，覆盖 9 种语言，字段含 `old`、`new`、`review`、`lang` | 页面要求登录并同意共享联系信息后访问文件；未在当前自动流程中抓取 |
| CodeReviewer / Zenodo 6900648 | Zenodo DOI `10.5281/zenodo.6900648`，CC-BY-4.0，包含 Diff Quality Estimation、Comment Generation、Code Refinement 三类数据 | 数据包较大，`Comment_Generation.zip` 约 846.6 MB，未下载到仓库 |
| CROP: Code Review Open Platform | 开源 code review 数据平台，链接 review 数据与当时完整代码版本，页面标称 50,959 次 review、144,906 次 revision | 适合作为后续批量离线数据工程来源；本次只记录候选，不下载大型压缩包 |

## 样本形态

每条样本是用户样式和本仓库 SkillOpt adapter schema 的超集：

1. 用户样式字段：`language`、`tech_stack`、`change_summary`、`diff`、`context`、`expected_findings`、`negative_findings`、`source`。
2. 本地 evaluator 字段：`split`、`tags`、`prompt`、`skill_under_test`、`review_materials`、`expected`。

`expected_findings` 由公开 reviewer comment 转换而来；`expected.must_find` 用于现有规则 evaluator 检查风险类别、证据关键词、最低风险等级和禁止输出。

## 筛选与转换规则

构建脚本：`skill-opt/scripts/build-review-dataset2.js`

筛选规则：

1. 只保留带 `diff_hunk`、文件路径、HTML URL 和 reviewer comment 的记录。
2. 只保留 Java 相关代码、SQL、XML、YAML、Properties、Gradle 等文件。
3. 过滤 `LGTM`、`thanks`、纯 `nit`、空白行、排版、拼写、`@since` 等低价值评论。
4. 过滤 review reply，只保留根 review comment。
5. 根据评论和 diff 关键词归类为 `security`、`idempotency`、`transaction_consistency`、`sql`、`exception_handling`、`test_gap`、`cache_lock`、`java_spring` 或 `maintainability`。
6. 将公开数据风险映射为 hicode 的建议性训练标签；公开 P1/P2/P3 风险不代表金融保险真实生产风险结论。

脱敏规则：

1. 私网 IP、示例 access key、secret key、password、token 等值统一替换为 `<REDACTED_...>`。
2. 不写入 GitHub 用户信息，不保存生产账号、生产配置、客户信息、生产日志或真实内部 MR。
3. 每条样本保留公开来源 URL 以便追溯，不把公开项目评论误写为内部金融保险真实缺陷。

## 验证

已运行：

```bash
node skill-opt/scripts/validate-review-dataset.js skill-opt/data/review-dataset2/items.jsonl
node --test skill-opt/tests/review-dataset.test.js
```

结果：300 条通过 schema 校验，`train`/`val`/`test` 均满足现有 validator 的 split 覆盖要求。
