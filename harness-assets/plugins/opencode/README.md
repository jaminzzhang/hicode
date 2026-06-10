# OpenCode Plugin

## 定位

本目录是 OpenCode 的 hicode plugin 源资产。

安装入口：

```bash
../install.sh --opencode
```

安装后，OpenCode 会从用户级插件目录自动加载 `hicode.ts`，并暴露 `hicode` 工具入口。

## 原生格式

OpenCode 会自动加载用户级插件目录中的 JavaScript 或 TypeScript 文件。安装器会：

1. 复制 `hicode.ts` 到 `~/.config/opencode/plugins/hicode.ts`。

安装器不会修改 `~/.config/opencode/opencode.json`。`opencode.json` 的 `plugin` 数组用于 npm plugin，不用于本地文件 plugin。

## 不做的事

1. 不生成目标项目 `CLAUDE.md`。
2. 不生成目标项目 `AGENTS.md`。
3. 不生成 `.hicode/`。
4. 不扫描代码。
5. 不修改生产配置或生产数据。
