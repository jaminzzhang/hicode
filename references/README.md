# hicode References

## 定位

`references/` 保存 hicode 当前可按需维护的支撑资产源文件。它不是目标项目 `.hicode/` 运行目录，不随 plugin 默认全量加载，也不保存本仓库历史建设过程。

根目录 `skills/` 和 `agents/` 是一等入口；`references/` 只提供规则、模板和 Hook 说明。

Claude Code plugin 运行时，`hicode:init` 使用 `skills/init/coding_rules.md` 作为创建或更新目标项目 `docs/rules/` 的种子规则。其他场景 Skill 不读取本仓库规则副本，而是读取并遵守目标项目中由 `hicode:init` 创建或维护的 `docs/rules/` 文件。

各 Skill 的本地模板文档平铺在对应 `skills/<skill>/` 根目录，只保留创建目标项目草稿所需的具体模板。单需求文档生命周期、写入边界和审批边界由 `hicode:init` 写入目标项目 `AGENTS.md` 或 `CLAUDE.md`，不再在每个场景 Skill 下维护重复 `README.md`。

Agent 共性安全、权限、输出和停止条件写入各 Agent 正文，不再维护共享运行镜像。

## 当前目录

| 目录 | 定位 | 读取边界 |
|---|---|---|
| `rules/` | 当前有效的规则维护源和 `hicode:init` 目标项目规则种子来源 | 由 `hicode:init` 通过本地副本使用，不由其他场景 Skill 直接读取 |
| `templates/` | 目标项目可复制填写模板和场景输出模板 | 由 `init` 或相关场景 Skill 按需读取，不承载执行规则全文 |
| `hooks/` | Hook 行为说明、配置示例、触发条件、阻断建议和审计字段 | 不由安装器自动启用，不连接生产环境 |

## 禁止新增的当前一级目录

以下旧目录不再作为当前 `references/` 一级目录新增或维护：

1. `docs/`
2. `prompts/`
3. `skills/`
4. `gates/`
5. `schemas/`
6. `examples/`
7. `init/`
8. `target-project/`

旧目录已在 V3-P2-WP2 迁入 `archive/references/`。当前 Skill、Agent、Rule、Template 和 Hook 不得新增对旧目录或归档目录的运行依赖。

## 使用规则

1. 先由根目录 Skill 判断任务场景；`init` 可以读取本 Skill 目录下的规则种子和项目模板，其他场景 Skill 读取目标项目入口规则、`docs/rules/` 和本 Skill 本地模板。
2. 当前稳定规则源文件是 `references/rules/coding_rules.md`；`init` 运行副本位于 `skills/init/coding_rules.md`。不得引用尚不存在的规则子目录。
3. 模板只保存可填写骨架；执行规则必须进入 `rules/` 或 Skill/Agent 正文。
4. Hook 说明只提供可选配置和审计边界，不代表自动启用。
5. 历史材料进入根目录 `archive/`，不得作为当前执行依据。
6. 不把 references 输出为最终审批、合并许可、发布许可或生产操作授权。
7. 修改 `references/rules/` 后必须同步 `skills/init/coding_rules.md`；修改 `references/templates/project/hicode-entry-section.md` 后必须同步 `skills/init/hicode-entry-section.md`；修改场景输出模板后必须同步相关 `skills/<skill>/` 根目录文件，并运行 `bash scripts/health-check.sh` 验证一致。
