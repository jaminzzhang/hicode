# hicode Coding Agent Plugin

## 1. 定位

本目录维护 hicode 面向 Coding Agent 平台的原生 plugin 安装资产。

当前第一版只支持把 hicode 入口 plugin 安装到当前用户的 Claude Code 和 OpenCode 中。它不执行目标项目初始化，不扫描代码，不生成 `CLAUDE.md`、`AGENTS.md` 或 `.hicode/`。

目标项目初始化资产由 `harness-assets/init/` 维护。

## 2. 目录结构

```text
harness-assets/plugins/
├── README.md
├── install.sh
├── claude-code/
│   ├── .claude-plugin/
│   │   ├── marketplace.json
│   │   └── plugin.json
│   └── skills/
│       └── hicode/
│           └── SKILL.md
└── opencode/
    └── hicode.ts
```

## 3. 安装范围

`install.sh` 默认执行用户级安装：

1. Claude Code：注册本地 hicode marketplace，并安装 `hicode` plugin。
2. OpenCode：复制 `hicode.ts` 到用户 OpenCode 插件目录。OpenCode 会在启动时自动加载该目录中的本地插件。

安装器不修改业务仓库，不读取生产配置，不处理生产数据或客户敏感信息。

## 4. 使用示例

```bash
./harness-assets/plugins/install.sh --dry-run --all
./harness-assets/plugins/install.sh --yes --claude-code
./harness-assets/plugins/install.sh --yes --opencode
```

不传平台参数时默认按 `--all` 处理。

## 5. 安全边界

1. 不扫描目标项目代码。
2. 不生成目标项目入口文件。
3. 不生成或复制 `.hicode/` 运行目录。
4. 不安装生产 Hook。
5. 不自动合并、自动发布、自动回滚或修改生产配置。
6. 不读取 `.env`、密钥文件、生产凭证或未脱敏客户数据。

## 6. 官方机制对齐

本目录按以下官方机制组织：

1. Claude Code plugin 使用插件根目录下的 `.claude-plugin/plugin.json` 和 `skills/<name>/SKILL.md`。
2. OpenCode 本地 plugin 使用 `~/.config/opencode/plugins/` 全局插件目录自动加载。
3. OpenCode 的 `opencode.json` `plugin` 数组仅用于 npm plugin，本地文件 plugin 不需要写入该数组。

参考资料：

1. Claude Code Plugins：`https://code.claude.com/docs/en/plugins#create-your-first-plugin`
2. OpenCode Plugins：`https://opencode.ai/docs/zh-cn/plugins/`
