# 编码准入门禁 Hook

## 1. 定位

本文是 `coding-entry-gate-hook` 的可审查执行说明，用于说明该 Hook 如何从 `hook.json` 映射到 Coding Agent 平台，并在 Agent 准备修改生产代码前执行编码准入检查。

本 Hook 不替代研发负责人、架构负责人、模块 Owner 或技术负责人的最终判断，不自动修改代码，不自动提交、合并、发布或操作生产。

## 2. 追溯关系

| 项 | 内容 |
|---|---|
| Hook ID | `coding-entry-gate-hook` |
| hicode Hook 规划 | `harness-assets/hooks/hook.json` |
| 目标安装路径 | `.hicode/hooks/hook.json` |
| 关联 Gate | `.hicode/gates/coding-entry-gate.md` |
| 关联 Schema | `.hicode/schemas/gate-result.schema.json` |
| 默认模式 | `advisory` |
| 适配事件 | `before_code_edit`、`before_write`、`before_patch` |

## 3. 触发点

当 Coding Agent 准备执行以下动作时触发：

1. 修改生产代码。
2. 新增生产代码。
3. 对生产代码应用 patch。

不用于限制需求立项、提测准入或发布准入。

## 4. 输入材料

必须检查以下材料是否存在或已有等价证据：

1. 需求准入门禁报告。
2. 编码计划报告。
3. `docs/PRD_CONTEXT.md` 或等价单需求上下文。
4. `docs/PROJ_CONTEXT.md` 或等价项目上下文。
5. ADR 判断或不适用说明。
6. P0/P1 待确认问题状态。
7. 允许修改范围。
8. TDD 或测试先行证据。

不得要求真实客户敏感信息、未脱敏生产数据、生产配置、生产日志原文、密钥或生产凭证。

## 5. Advisory 输出

`advisory` 模式下，Hook 应输出可归档的提醒型结果：

```json
{
  "hook_id": "coding-entry-gate-hook",
  "mode": "advisory",
  "agent_level_recommendation": "有条件建议继续",
  "gate_original_recommendation": "有条件通过",
  "highest_risk_level": "P1",
  "evidence_summary": ["已找到编码计划", "TDD 证据待补齐"],
  "blocking_recommendations": [],
  "risk_notes": ["缺少完整 RED-GREEN-REFACTOR 记录"],
  "recommended_actions": ["补充 TDD 证据后再修改生产代码"],
  "pending_questions": ["当前修改范围是否包含数据库脚本"],
  "audit_evidence": ["coding-plan report", "PRD context", "allowed change scope"]
}
```

不得输出“允许开工”“门禁通过”“最终审批通过”等审批口径。

## 6. Blocking 条件

以下情况可以阻断当前 Coding Agent 修改动作：

1. 缺少编码计划仍要修改生产代码。
2. 缺少 TDD 或测试先行证据仍要修改生产代码。
3. 试图修改生产配置。
4. 未确认范围时试图修改数据库脚本。
5. 未确认范围时试图修改发布脚本。
6. 发现密钥、Token、未脱敏客户敏感信息或未脱敏生产数据。
7. 用户要求生产操作。
8. 用户要求删除测试或降低断言以推动通过。

普通 P2/P3 提示项不得升级为 blocking。

## 7. Claude 原生配置示例

以下示例展示 Claude Code `hooks` 配置形态。命令中的 `hicode-hook-adapter` 是目标项目安装器或平台适配层提供的本地适配命令示例，不是本仓库在 V2-P4-WP2 实现的脚本。

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "description": "hicode coding-entry gate before source code changes",
        "hooks": [
          {
            "type": "command",
            "command": "hicode-hook-adapter --hook-id coding-entry-gate-hook --plan .hicode/hooks/hook.json"
          }
        ]
      }
    ]
  }
}
```

适配器必须只读取本地非生产证据，不得读取 `.env`、密钥文件、生产配置或生产日志。

## 8. OpenCode 原生插件示例

OpenCode 使用插件事件。以下示例展示插件式 TypeScript 写法，读取 `.hicode/hooks/hook.json` 并在 `tool.execute.before` 中触发 hicode Hook 语义。

```ts
import type { PluginInput } from "@opencode-ai/plugin"
import * as fs from "fs"
import * as path from "path"

export const HicodeCodingEntryHook = async ({ client, directory, worktree }: PluginInput) => {
  const root = worktree || directory
  const hookPlanPath = path.join(root, ".hicode/hooks/hook.json")
  const hookPlan = JSON.parse(fs.readFileSync(hookPlanPath, "utf8"))

  const log = (level: "info" | "warn" | "error", message: string) =>
    client.app.log({ body: { service: "hicode", level, message } })

  return {
    "tool.execute.before": async (input: { tool: string; args?: Record<string, unknown> }) => {
      const isCodeWrite = ["edit", "write", "multiedit"].includes(input.tool)
      if (!isCodeWrite) return

      const hook = hookPlan.hooks.find((item: { id: string }) => item.id === "coding-entry-gate-hook")
      if (!hook) return

      // Adapter should inspect allowed change scope, coding plan, TDD evidence and target file.
      // It must not read secrets, production config or production logs.
      log("info", `[hicode] ${hook.id}: run coding entry gate before code change`)
    }
  }
}
```

完整 blocking 行为由目标项目适配层实现，但不得自动修改代码、提交、合并、发布或连接生产。

## 9. 禁止动作

本 Hook 禁止：

1. 自动修改未确认范围外的文件。
2. 自动提交、推送、合并、发布或回滚。
3. 读取 `.env`、密钥文件、生产配置或生产凭证。
4. 连接生产环境或执行生产 SQL。
5. 删除测试、降低断言或跳过 Review。

## 10. 审计证据

适配层执行本 Hook 时应记录：

1. 检查对象和目标文件。
2. 输入材料清单。
3. 缺失输入。
4. blocking 建议和解除条件。
5. 普通风险提示。
6. 人工确认记录。
7. 受限命令记录或未执行原因。

