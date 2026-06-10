# hicode References

## 定位

本目录保存 hicode 根目录 Skill 和 Agent 按需读取的支撑资产。它不是目标项目 `.hicode/` 运行目录，也不是默认全量上下文。

## 收录原则

第一版按根目录 4 个能力场景组织支撑资产：

1. 需求到编码前链路。
2. TDD 与辅助编码链路。
3. Review 与提交链路。
4. 发布与回归链路。

pilot 模板、验收清单、回归样例、Hook 和初始化规划也保留在本目录下，但只能按任务场景读取。

根目录 `skills/` 和 `agents/` 是一等入口；本目录中的 `docs/`、`prompts/`、`gates/`、`schemas/`、`examples/`、`hooks/`、`init/` 和细粒度 `skills/` 是可追溯规则源和材料库。

## 使用规则

1. Skill 入口先判断任务场景，再按需读取本目录文件。
2. 不要一次性读取全部 references。
3. 发现目标项目已初始化 `.hicode/` 时，应优先使用目标项目本地资产，再用本目录作为缺失资产降级来源。
4. 不把 references 输出为最终审批、合并许可或发布许可。
