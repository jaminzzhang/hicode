# hicode Coding Agent Plugin

## 1. 定位

本仓库根目录是 hicode 的设计中心，也是面向 Claude Code 的原生 plugin root，并提供 OpenCode agents/skills 本地安装入口。

Claude Code 通过 plugin marketplace 安装；OpenCode 通过 `install.sh --opencode` 把 hicode 的 agents 和 skills 转换复制到 OpenCode 用户级或项目级目录。

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
3. 提供 8 个专业 Agent、`hi` 总入口、`init` 初始化入口和 `scope`、`tdd`、`review`、`release` 四个能力 Skill；场景路由表达保留为 `hicode:init`、`hicode:scope`、`hicode:tdd`、`hicode:review` 和 `hicode:release`。

OpenCode 安装使用显式参数：

1. `./install.sh --opencode --yes`：安装到当前用户 OpenCode 配置目录。
2. `./install.sh --opencode --opencode-scope project --opencode-project-dir /path/to/project --yes`：安装到目标项目 `.opencode/` 目录。
3. `./install.sh --all --yes`：同时安装 Claude Code plugin 和 OpenCode 本地运行资产。

安装器不修改业务仓库，不读取生产配置，不处理生产数据或客户敏感信息。

目标项目初始化应在业务仓库中显式调用 `hicode:init`。默认只创建或补充 `CLAUDE.md` / `AGENTS.md`、项目上下文和 RULES 文档；不复制 plugin 内置能力到目标项目运行目录。

## 4. 使用示例

```bash
./install.sh --dry-run
./install.sh --opencode --dry-run
./install.sh --all --dry-run
./install.sh --yes
bash scripts/health-check.sh
```

不传平台参数时默认安装 Claude Code plugin。

`scripts/health-check.sh` 用于重复验证当前运行资产边界、安装边界、旧路径依赖、安全红线和 Agent 共性规则收敛情况；它不扫描目标项目，不读取敏感配置或生产数据。

## 5. 安全边界

1. 不扫描目标项目代码。
2. 不生成目标项目入口文件。
3. 不生成或复制项目本地运行目录。
4. 不安装生产 Hook。
5. 不自动合并、自动发布、自动回滚或修改生产配置。
6. 不读取 `.env`、密钥文件、生产凭证或未脱敏客户数据。

## 6. 官方机制对齐

本仓库按以下官方机制组织：

1. Claude Code plugin 使用插件根目录下的 `.claude-plugin/plugin.json`、`agents/` 和 `skills/<name>/SKILL.md`。
2. `skills/init/coding_rules.md` 是 `hicode:init` 创建或更新目标项目 `docs/rules/` 的种子规则；其他场景 Skill 遵守目标项目规则文件。
3. 每个 `skills/<skill>/` 目录只使用根目录文件承载本地具体模板和规则种子，不维护 Skill 内部子目录，也不为场景生命周期复制重复 `README.md`。
4. Agent 共性安全、权限、输出和停止条件写入各 Agent 正文，不再通过共享运行目录读取。
5. OpenCode 安装时将场景 Skill 转换为 `hicode-*` Skill，将 `agents/` 转换为 `hicode-*.md` Agent。
6. `references/` 是本仓库维护源，不是目标平台默认上下文。

参考资料：

1. Claude Code Plugins：`https://code.claude.com/docs/en/plugins#create-your-first-plugin`
2. OpenCode Plugins：`https://opencode.ai/docs/zh-cn/plugins/`，本仓库当前采用本地 agents/skills 安装方式，不把 OpenCode plugin 规范混入 Claude Code plugin root。
