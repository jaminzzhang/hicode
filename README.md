# hicode Coding Agent Plugin

## 1. 定位

本仓库根目录是 hicode 的设计中心，也是面向 Claude Code 的原生 plugin root。

当前第一版只支持 Claude Code plugin 规范。OpenCode plugin 机制与 Claude Code plugin 机制不同，不纳入本仓库第一版交付。

本 plugin 安装动作不执行目标项目初始化，不扫描代码，不生成 `CLAUDE.md`、`AGENTS.md` 或项目本地运行目录。

目标项目初始化由 `hicode:init` 在用户确认写入范围后执行，只创建或补充目标项目入口、上下文和项目规则文档。

## 2. 目录结构

```text
/
├── README.md
├── install.sh
├── .claude-plugin/
│   ├── marketplace.json
│   └── plugin.json
├── agents/
├── skills/
│   ├── hi/
│   ├── init/
│   ├── scope/
│   ├── tdd/
│   ├── review/
│   └── release/
└── references/
```

## 3. 安装范围

`install.sh` 默认执行用户级安装：

1. 注册本地 hicode marketplace。
2. 安装 `hicode` Claude Code plugin。
3. 提供 `hi` 总入口、`init` 初始化入口和 `scope`、`tdd`、`review`、`release` 四个能力 Skill；场景路由表达保留为 `hicode:init`、`hicode:scope`、`hicode:tdd`、`hicode:review` 和 `hicode:release`。

安装器不修改业务仓库，不读取生产配置，不处理生产数据或客户敏感信息。

目标项目初始化应在业务仓库中显式调用 `hicode:init`。默认只创建或补充 `CLAUDE.md` / `AGENTS.md`、项目上下文和 RULES 文档；不复制 plugin 内置能力到目标项目运行目录。

## 4. 使用示例

```bash
./install.sh --dry-run
./install.sh --yes
```

不传平台参数时默认安装 Claude Code plugin。

## 5. 安全边界

1. 不扫描目标项目代码。
2. 不生成目标项目入口文件。
3. 不生成或复制项目本地运行目录。
4. 不安装生产 Hook。
5. 不自动合并、自动发布、自动回滚或修改生产配置。
6. 不读取 `.env`、密钥文件、生产凭证或未脱敏客户数据。

## 6. 官方机制对齐

本仓库按以下官方机制组织：

1. Claude Code plugin 使用插件根目录下的 `.claude-plugin/plugin.json` 和 `skills/<name>/SKILL.md`。
2. `skills/` 下每个目录都是一个 Claude Code Skill。
3. `references/` 是 Skill 按需读取的支撑文件，不是默认上下文。

参考资料：

1. Claude Code Plugins：`https://code.claude.com/docs/en/plugins#create-your-first-plugin`
2. OpenCode Plugins：`https://opencode.ai/docs/zh-cn/plugins/`，仅作后续独立适配参考，不混入本仓库第一版。
