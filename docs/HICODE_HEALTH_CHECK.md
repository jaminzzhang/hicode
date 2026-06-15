# hicode 当前资产健康检查

## 定位

本文档说明当前资产健康检查 Module。健康检查用于重复验证 hicode 当前运行资产是否仍符合 V3 简化后的资产边界、安全红线和安装边界。

健康检查不扫描目标项目，不读取 `.env`、密钥文件、生产配置、生产凭证、未脱敏客户信息或未脱敏生产数据，不连接生产环境。

## 检查入口

```bash
bash scripts/health-check.sh
```

## 覆盖范围

1. 当前运行资产不引用 `archive/` 或旧 `references/` 目录。
2. `.claude-plugin/plugin.json` 必须能被 Claude Code validator 直接校验通过，只声明当前 validator 支持的 `skills/` 路径，不暴露本仓库 `docs/`、`archive/` 或 `references/` 目录；`agents/` 作为 Claude Code plugin root 约定目录保留。
3. `install.sh` 不复制 `.hicode/`，不初始化目标项目，不生成 `CLAUDE.md` 或 `AGENTS.md`。
4. Agent 不复制旧通用规则全文，Agent 共性安全、权限、输出和停止条件写入各 Agent 正文。
5. 当前资产保留安全红线、生产禁止事项、敏感信息保护和人工审批边界。
6. plugin manifest、marketplace manifest 和 Hook 配置能被解析为 JSON，Claude marketplace manifest 也能被 validator 校验通过。
7. `hooks/hook.json` 与 Hook Markdown 说明中的 Hook ID、默认模式、规则依据、blocking 条件和禁止动作保持一致。
8. `install.sh --dry-run --yes`、`install.sh --opencode --dry-run --yes`、`install.sh --codex --dry-run --yes` 和 `install.sh --all --dry-run --yes` 可运行；Claude marketplace 注册和 plugin install 使用一致 scope。
9. `git diff --check` 无空白错误。
10. 6 个场景 Skill 的 `SKILL.md` 不再引用旧共享路径或仓库 `references/`。
11. 非 init Skill 不读取也不携带本地 `coding_rules.md` 种子规则；`skills/init/coding_rules.md` 是唯一内置规则种子，根目录 `references/` 不再存在。
12. Skill 本地模板文档平铺在各自 `skills/<skill>/` 根目录，根目录 `references/` 不再存在；场景 Skill 不携带重复 `README.md` 生命周期说明。
13. `skills/init/hicode-entry-section.md` 承载单需求文档生命周期、写入边界和审批边界，并由 `hicode:init` 写入目标项目入口。
14. 旧共享运行目录已移除；运行资产、安装器和 manifest 不得引用旧共享路径或恢复 `references/` 目录。
15. 未被 Hook 目录使用的 `_hook-template.md` 不再保留。
16. OpenCode 转换后的 Skill frontmatter `name` 必须与安装目录一致；OpenCode Agent 使用文件名作为身份，frontmatter 不写 `name`，并显式写入 `mode: subagent`。
17. Codex 转换后的 Skill 必须安装到 `.agents/skills` 规范目录，且 frontmatter `name` 必须与安装目录一致。

## 失败处理

任一检查失败时，先修复当前资产边界或规则漂移，再更新相关文档。不得通过放宽检查、删除安全规则、隐藏风险或跳过 Review 来推动通过。

## 关系

1. `docs/V3_INSTALL_BOUNDARY_CHECK.md` 和 `docs/V3_PATH_CONSISTENCY_CHECK.md` 是历史验收记录。
2. `scripts/health-check.sh` 是当前可重复运行的健康检查入口。
3. 后续修改 `skills/`、`agents/`、`hooks/`、`.claude-plugin/`、OpenCode 安装转换逻辑或 `install.sh` 后，应重新运行健康检查。
