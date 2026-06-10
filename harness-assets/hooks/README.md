# hicode Hook 规范

## 1. 定位

`harness-assets/hooks/` 维护 hicode 门禁 Hook 源资产，用于把已稳定的 Markdown 门禁、Schema 和权限边界转成目标项目可选择安装的 Hook 规划。

本目录不是平台原生 Hook 配置目录。`hook.json` 是 hicode 自定义可安装 Hook 规划格式，默认安装目标为 `.hicode/hooks/hook.json`，后续由安装器或平台适配层转换为具体 Coding Agent 平台支持的配置。

Hook 只改变门禁触发和执行载体，不改变门禁建议性质，不替代人工 Review、负责人审批、CI/CD、发布平台或生产流程。

## 2. 首批范围

V2-P4 首批 Hook 只覆盖 Coding Agent 可在本地研发流程中合理约束的两个门禁：

| Hook | 关联门禁 | 触发点 | 默认模式 |
|---|---|---|---|
| `coding-entry-gate-hook` | `.hicode/gates/coding-entry-gate.md` | Coding Agent 准备修改生产代码前 | `advisory` |
| `merge-gate-hook` | `.hicode/gates/merge-gate.md` | Coding Agent 准备提交、推送、创建 MR/PR 或请求合并前 | `advisory` |

不进入首批 Hook 的门禁：

1. 需求准入门禁：需求立项和需求准入不应由 Coding Agent 本地 Hook 限制。
2. 提测门禁：暂不在首批本地 Hook 中约束，保留为 Markdown 门禁或后续平台集成。
3. 发布准入门禁：发布审批、发布验证和回滚不得由 Coding Agent Hook 执行或限制。

## 3. Hook 模式

| 模式 | 含义 | 使用边界 |
|---|---|---|
| `advisory` | 提醒型，生成报告、风险提示、阻断建议和审计证据 | 默认模式；不直接替代流程状态 |
| `blocking` | 阻断型，阻止当前高风险动作继续执行 | 只用于安全红线、生产越权、流程绕行或已确认的高风险缺口 |

`blocking` 只能阻断当前 Coding Agent 动作，不代表负责人审批结论，也不授权自动修复、自动提交、自动合并或自动发布。

## 4. Hook 触发点与门禁映射

| Hook | 建议适配事件 | 必需输入 | 关联 Gate | 关联 Schema | Blocking 条件 |
|---|---|---|---|---|---|
| `coding-entry-gate-hook` | `before_code_edit`、`before_write`、`before_patch` | 需求准入结果、编码计划、TDD 或测试先行证据、允许修改范围、目标文件 | `.hicode/gates/coding-entry-gate.md` | `.hicode/schemas/gate-result.schema.json` | 无编码计划仍要改生产代码；无 TDD 证据仍要改生产代码；试图改生产配置、数据库脚本或发布脚本；命中密钥、未脱敏客户信息、未脱敏生产数据或生产越权 |
| `merge-gate-hook` | `before_commit`、`before_push`、`before_merge_request` | diff 范围、测试证据、AI Review、人工 Review 状态、P0/P1 状态、敏感信息扫描结果 | `.hicode/gates/merge-gate.md` | `.hicode/schemas/gate-result.schema.json` | 自动合并或自动发布诉求；未关闭 P0/P1；跳过 Review；删除测试或降低断言；敏感信息、密钥、未脱敏生产数据或生产越权 |

适配事件是平台适配建议，不是单一平台事实。安装器可按目标平台能力映射成 Claude、OpenCode、Cursor、Kiro 或其他 Coding Agent 平台的原生事件。

## 5. 输入与输出

Hook 输入可以来自用户任务、目标项目上下文、Agent 执行状态、diff、测试结果、Review 报告、门禁报告或人工确认记录。

Hook 输出必须包含：

1. Hook ID 和触发点。
2. 关联 Gate 和 Schema。
3. 运行模式：`advisory` 或 `blocking`。
4. Agent 层建议结论。
5. 门禁原始建议结论，如已执行。
6. 依据和证据来源。
7. 风险等级。
8. 阻断建议项和普通风险提示项。
9. 建议动作。
10. 待确认问题。
11. 审计证据和受限命令记录。

输出不得写成最终审批、允许合并、允许发布、门禁通过或可以上线。

## 6. 禁止动作

Hook 禁止：

1. 自动提交、自动推送、自动合并、自动发布或自动回滚。
2. 批准 MR / PR、打 Tag 或修改代码托管平台状态。
3. 连接生产环境。
4. 执行生产 SQL、数据库变更、发布命令或回滚命令。
5. 读取生产日志原文、生产配置、`.env`、密钥文件或生产凭证。
6. 处理未脱敏客户敏感信息或未脱敏生产数据。
7. 为了通过门禁删除测试、降低断言、跳过 Review 或隐藏风险。

## 7. 维护规则

1. 新增 Hook 前必须先有稳定 Gate、Schema 和权限边界。
2. 修改 Hook blocking 条件时，必须同步检查对应 Gate、`CONTEXT.md` 和安装 manifest。
3. Hook 安装必须可选，不强制进入 `core` 或 `java-insurance-core` profile。
4. 目标平台适配文件不得反向覆盖本目录源资产语义。

