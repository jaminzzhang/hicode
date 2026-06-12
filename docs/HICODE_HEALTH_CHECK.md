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
2. `.claude-plugin/plugin.json` 只暴露 `agents/` 和 `skills/`，不暴露本仓库 `docs/`、`archive/` 或历史 references 目录。
3. `install.sh` 不复制 `.hicode/`，不初始化目标项目，不生成 `CLAUDE.md` 或 `AGENTS.md`。
4. Agent 不复制旧通用规则全文，统一引用 `references/rules/coding_rules.md` 中的 Agent 共性规则。
5. 当前资产保留安全红线、生产禁止事项、敏感信息保护和人工审批边界。
6. plugin manifest、marketplace manifest 和 Hook 配置能被解析为 JSON。
7. `references/hooks/hook.json` 与 Hook Markdown 说明中的 Hook ID、默认模式、规则依据、blocking 条件和禁止动作保持一致。
8. `install.sh --dry-run --yes`、`install.sh --opencode --dry-run --yes` 和 `install.sh --all --dry-run --yes` 可运行。
9. `git diff --check` 无空白错误。
10. `skills/` 和 `agents/` 运行时入口不再直接读取仓库 `references/rules` 或 `references/templates`。
11. `skills/_shared/` 中的规则和模板镜像与 `references/` 源文件保持一致。

## 失败处理

任一检查失败时，先修复当前资产边界或规则漂移，再更新相关文档。不得通过放宽检查、删除安全规则、隐藏风险或跳过 Review 来推动通过。

## 关系

1. `docs/V3_INSTALL_BOUNDARY_CHECK.md` 和 `docs/V3_PATH_CONSISTENCY_CHECK.md` 是历史验收记录。
2. `scripts/health-check.sh` 是当前可重复运行的健康检查入口。
3. 后续修改 `skills/`、`agents/`、`references/`、`.claude-plugin/`、OpenCode 安装转换逻辑或 `install.sh` 后，应重新运行健康检查。
