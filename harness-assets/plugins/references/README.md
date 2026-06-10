# hicode Plugin References

## 定位

本目录保存 Claude Code `hicode` plugin 的按需支撑文件。它不是目标项目 `.hicode/` 运行目录，也不是 `harness-assets/` 的完整镜像。

## 收录原则

第一版只收录 4 个能力场景需要直接引用的稳定资产：

1. 需求到编码前链路。
2. TDD 与辅助编码链路。
3. Review 与提交链路。
4. 发布与回归链路。

不默认收录 pilot 模板、验收清单、回归样例和模板编写辅助材料。

本目录是面向 Claude Code plugin 的发布快照。源资产仍以 `harness-assets/agents/`、`harness-assets/prompts/`、`harness-assets/skills/`、`harness-assets/gates/`、`harness-assets/schemas/` 和 `harness-assets/docs/` 为准；更新源资产后，应按当前 4 个能力场景重新筛选并同步本目录。

## 使用规则

1. Skill 入口先判断任务场景，再按需读取本目录文件。
2. 不要一次性读取全部 references。
3. 发现目标项目已初始化 `.hicode/` 时，应优先使用目标项目本地资产，再用 plugin references 作为缺失资产降级来源。
4. 不把 references 输出为最终审批、合并许可或发布许可。
