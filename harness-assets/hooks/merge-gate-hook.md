# 合并门禁 Hook

## 1. 定位

本文是 `merge-gate-hook` 的可审查执行说明，用于说明该 Hook 如何从 `hook.json` 映射到 Coding Agent 平台，并在 Agent 准备提交、推送、创建 MR/PR 或请求合并前执行合并门禁检查。

本 Hook 不替代人工 Reviewer、模块 Owner、研发负责人、质量负责人、CI/CD 或代码托管平台的最终判断，不自动批准、不自动合并、不自动打 Tag、不自动发布。

## 2. 追溯关系

| 项 | 内容 |
|---|---|
| Hook ID | `merge-gate-hook` |
| hicode Hook 规划 | `harness-assets/hooks/hook.json` |
| 目标安装路径 | `.hicode/hooks/hook.json` |
| 关联 Gate | `.hicode/gates/merge-gate.md` |
| 关联 Schema | `.hicode/schemas/gate-result.schema.json` |
| 默认模式 | `advisory` |
| 适配事件 | `before_commit`、`before_push`、`before_merge_request` |

## 3. 触发点

当 Coding Agent 准备执行以下动作时触发：

1. `git commit` 前。
2. `git push` 前。
3. 创建 MR/PR 前。
4. 请求合并前。

本 Hook 只约束合并前证据，不执行合并、不批准 Review、不操作发布流程。

## 4. 输入材料

必须检查以下材料是否存在或已有等价证据：

1. diff 范围。
2. AI Review 报告。
3. 人工 Review 状态。
4. CI 或本地检查结果。
5. 测试证据。
6. 覆盖率结果或不适用说明。
7. P0/P1 问题状态。
8. 提交检查报告或等价材料。
9. 敏感信息扫描结果。

不得要求真实客户敏感信息、未脱敏生产数据、生产配置、生产日志原文、密钥或生产凭证。

## 5. Advisory 输出

`advisory` 模式下，Hook 应输出可归档的提醒型结果：

```json
{
  "hook_id": "merge-gate-hook",
  "mode": "advisory",
  "agent_level_recommendation": "发现高风险，建议先修复或补证据",
  "gate_original_recommendation": "建议阻断",
  "highest_risk_level": "P1",
  "evidence_summary": ["AI Review 已完成", "人工 Review 缺失", "CI 结果缺失"],
  "blocking_recommendations": ["补齐人工 Review 和 CI 结果后再请求合并"],
  "risk_notes": ["当前缺少覆盖率趋势说明"],
  "recommended_actions": ["运行本地测试或等待 CI 完成", "补齐人工 Reviewer 确认"],
  "pending_questions": ["P1 风险是否已有负责人豁免"],
  "audit_evidence": ["diff scope", "AI review report", "test evidence"]
}
```

不得输出“允许合并”“门禁通过”“最终审批通过”等审批口径。

## 6. Blocking 条件

以下情况可以阻断当前 Coding Agent 动作：

1. 用户要求自动合并。
2. 用户要求自动发布。
3. 存在未关闭 P0。
4. 存在未关闭 P1 且无负责人确认。
5. AI Review 缺失或存在阻断结论。
6. 人工 Review 缺失或未通过。
7. CI 失败且无解释。
8. 覆盖率低于硬阈值且无负责人确认。
9. 用户要求跳过 Review。
10. 用户要求删除测试或降低断言以推动通过。
11. 发现密钥、Token、未脱敏客户敏感信息或未脱敏生产数据。
12. 用户要求生产操作。

普通 P2/P3 提示项不得升级为 blocking。

## 7. Claude 原生配置示例

以下示例展示 Claude Code `hooks` 配置形态。命令中的 `hicode-hook-adapter` 是目标项目安装器或平台适配层提供的本地适配命令示例，不是本仓库在 V2-P4-WP2 实现的脚本。

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "description": "hicode merge gate before commit, push or merge request actions",
        "hooks": [
          {
            "type": "command",
            "command": "hicode-hook-adapter --hook-id merge-gate-hook --plan .hicode/hooks/hook.json"
          }
        ]
      }
    ]
  }
}
```

适配器应只匹配提交、推送、创建 MR/PR 或请求合并相关动作。不得自动批准、自动合并或自动发布。

## 8. OpenCode 原生插件示例

OpenCode 使用插件事件。以下示例展示插件式 TypeScript 写法，读取 `.hicode/hooks/hook.json` 并在 `tool.execute.before` 中触发 hicode Hook 语义。

```ts
import type { PluginInput } from "@opencode-ai/plugin"
import * as fs from "fs"
import * as path from "path"

export const HicodeMergeGateHook = async ({ client, directory, worktree }: PluginInput) => {
  const root = worktree || directory
  const hookPlanPath = path.join(root, ".hicode/hooks/hook.json")
  const hookPlan = JSON.parse(fs.readFileSync(hookPlanPath, "utf8"))

  const log = (level: "info" | "warn" | "error", message: string) =>
    client.app.log({ body: { service: "hicode", level, message } })

  return {
    "tool.execute.before": async (input: { tool: string; args?: Record<string, unknown> }) => {
      if (input.tool !== "bash") return

      const command = String(input.args?.command || input.args || "")
      const isMergeRelated =
        /\\bgit\\s+commit\\b/.test(command) ||
        /\\bgit\\s+push\\b/.test(command) ||
        /\\bgh\\s+pr\\s+create\\b/.test(command) ||
        /\\bgh\\s+pr\\s+merge\\b/.test(command)

      if (!isMergeRelated) return

      const hook = hookPlan.hooks.find((item: { id: string }) => item.id === "merge-gate-hook")
      if (!hook) return

      // Adapter should inspect diff scope, review records, CI/test evidence and P0/P1 status.
      // It must not approve or merge PRs, push changes, publish releases or read secrets.
      log("warn", `[hicode] ${hook.id}: run merge gate before merge-related action`)
    }
  }
}
```

完整 blocking 行为由目标项目适配层实现，但不得自动提交、推送、批准、合并、发布或连接生产。

## 9. 禁止动作

本 Hook 禁止：

1. 自动提交、推送、批准、合并、发布或回滚。
2. 修改代码托管平台审批状态。
3. 读取 `.env`、密钥文件、生产配置或生产凭证。
4. 连接生产环境、执行生产 SQL 或读取生产日志。
5. 跳过 AI Review、人工 Review、CI 或覆盖率证据。
6. 删除测试、降低断言或隐藏 P0/P1 风险。

## 10. 审计证据

适配层执行本 Hook 时应记录：

1. 检查对象和 diff 范围。
2. Review 记录。
3. CI 或本地检查记录。
4. 覆盖率记录。
5. blocking 建议和解除条件。
6. 普通风险提示。
7. 人工确认记录。
8. 受限命令记录或未执行原因。

