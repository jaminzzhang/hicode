# Claude Code Plugin

## 定位

本目录是 Claude Code 的 hicode 本地 marketplace 和 plugin 源资产。

安装入口：

```bash
../install.sh --claude-code
```

安装后，Claude Code 可通过 hicode skill 了解 hicode 的边界和后续初始化入口。

## 原生格式

1. `.claude-plugin/marketplace.json`：本地 marketplace 清单。
2. `.claude-plugin/plugin.json`：hicode plugin 清单。
3. `skills/hicode/SKILL.md`：Claude Code 可加载的 hicode 入口 Skill。

## 不做的事

1. 不生成目标项目 `CLAUDE.md`。
2. 不生成目标项目 `AGENTS.md`。
3. 不生成 `.hicode/`。
4. 不扫描代码。
5. 不修改生产配置或生产数据。

