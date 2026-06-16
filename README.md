# hicode Coding Agent Plugin

## 1. 定位

本仓库根目录是 hicode 的设计中心，也是面向 Claude Code 与 Codex 的 plugin root，并提供 OpenCode agents/skills 本地安装入口。

Claude Code 通过 plugin marketplace 安装；OpenCode 通过 `install.sh --opencode` 把 hicode 的 agents 和 skills 转换复制到 OpenCode 用户级或项目级目录；Codex 通过 `install.sh --codex` 把 hicode 作为 `.codex-plugin` plugin bundle 写入本地 marketplace 并执行 `codex plugin add`。Codex 当前不支持 plugin agent 声明，Codex bundle 暂只包含 `.codex-plugin/` 和 `skills/`。

本 plugin 安装动作不执行目标项目初始化，不扫描代码，不生成 `CLAUDE.md`、`AGENTS.md` 或项目本地运行目录。

目标项目初始化由 `hicode:init` 在用户确认写入范围后执行，只创建或补充目标项目入口、上下文和项目规则文档。

## 2. 目录结构

```text
/
├── README.md
├── install.sh
├── install.ps1
├── scripts/
│   ├── install.js
│   ├── install-codex.js
│   └── install-opencode.js
├── .claude-plugin/
│   ├── marketplace.json
│   └── plugin.json
├── .codex-plugin/
│   └── plugin.json
├── agents/
├── skills/
│   ├── hi/
│   ├── init/
│   ├── scope/
│   ├── tdd/
│   ├── review/
│   └── release/
└── hooks/
```

## 3. 安装范围

安装器采用跨平台双入口：

1. Linux、macOS、WSL、Git Bash、MSYS 和 Cygwin 使用 `./install.sh`。
2. Windows PowerShell 使用 `pwsh ./install.ps1`。
3. 两个入口都委托 `node scripts/install.js` 执行相同安装逻辑；也可以直接运行 `node scripts/install.js`。

前置条件：本机需可执行 `node`；按安装目标分别需要已安装 `claude`、`codex` 或 OpenCode 对应运行环境。`--dry-run` 不调用目标平台 CLI。

`install.sh` / `install.ps1` 默认执行用户级安装：

1. 注册本地 hicode marketplace。
2. 安装 `hicode` Claude Code plugin。
3. 提供 8 个专业 Agent、`hi` 总入口、`init` 初始化入口和 `scope`、`tdd`、`review`、`release` 四个能力 Skill；场景路由表达保留为 `hicode:init`、`hicode:scope`、`hicode:tdd`、`hicode:review` 和 `hicode:release`。

OpenCode 安装使用显式参数：

1. `./install.sh --opencode --yes`：安装到当前用户 OpenCode 配置目录。
2. `./install.sh --opencode --opencode-scope project --opencode-project-dir /path/to/project --yes`：安装到目标项目 `.opencode/` 目录。
3. Windows PowerShell 下使用等价参数：`pwsh ./install.ps1 -OpenCode -Yes`。

Codex 安装使用显式参数：

1. `./install.sh --codex --yes`：复制 `.codex-plugin/` 和 `skills/` plugin bundle 到 `~/plugins/hicode`，更新 `~/.agents/plugins/marketplace.json`，并执行 `codex plugin add hicode@<marketplace>`。
2. `./install.sh --codex --codex-scope project --codex-project-dir /path/to/project --yes`：复制 `.codex-plugin/` 和 `skills/` plugin bundle 到目标项目 `plugins/hicode`，更新目标项目 `.agents/plugins/marketplace.json`，并在目标项目目录执行 `codex plugin add hicode@<marketplace>`。
3. `./install.sh --all --yes`：同时安装 Claude Code plugin、OpenCode 本地运行资产和 Codex plugin。
4. Windows PowerShell 下使用等价参数：`pwsh ./install.ps1 -Codex -Yes`、`pwsh ./install.ps1 -All -Yes`。

卸载使用 `--uninstall` 搭配同一组平台和 scope 参数：

1. `./install.sh --uninstall --claude-code --yes`：调用 `claude plugin uninstall hicode@hicode`。
2. `./install.sh --uninstall --opencode --yes`：只删除 OpenCode 目录下安装器生成的 `hicode-*` Skill 和 Agent。
3. `./install.sh --uninstall --codex --yes`：调用 `codex plugin remove hicode@<marketplace>`，并删除本地 marketplace 条目和 `plugins/hicode` bundle。
4. `./install.sh --uninstall --all --yes`：同时卸载三类平台资产。

Claude Code 或 Codex CLI 返回 plugin 已不存在时，卸载视为幂等成功并继续清理其他 hicode-owned 资产；其他命令错误仍会失败。

安装器不修改业务仓库，不读取生产配置，不处理生产数据或客户敏感信息。

目标项目初始化应在业务仓库中显式调用 `hicode:init`。默认只创建或补充 `CLAUDE.md` / `AGENTS.md`、项目上下文和 RULES 文档；不复制 plugin 内置能力到目标项目运行目录。

## 4. 使用示例

```bash
./install.sh --dry-run
./install.sh --opencode --dry-run
./install.sh --codex --dry-run
./install.sh --all --dry-run
./install.sh --uninstall --all --dry-run
./install.sh --yes
node scripts/install.js --all --dry-run --yes
bash scripts/health-check.sh
```

Windows PowerShell：

```powershell
pwsh ./install.ps1 -DryRun
pwsh ./install.ps1 -OpenCode -DryRun
pwsh ./install.ps1 -Codex -DryRun
pwsh ./install.ps1 -All -DryRun
pwsh ./install.ps1 -Uninstall -All -DryRun
pwsh ./install.ps1 -Yes
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

1. Claude Code plugin 使用插件根目录下的 `.claude-plugin/plugin.json`、`agents/` 和 `skills/<name>/SKILL.md`；当前 manifest 只声明 validator 支持的 `skills` 路径，`agents/` 作为 plugin root 约定目录保留。
2. `skills/init/coding_rules.md` 是 `hicode:init` 创建或更新目标项目 `docs/rules/` 的种子规则；其他场景 Skill 遵守目标项目规则文件。
3. 每个 `skills/<skill>/` 目录只使用根目录文件承载本地具体模板和规则种子，不维护 Skill 内部子目录，也不为场景生命周期复制重复 `README.md`。
4. Agent 共性安全、权限、输出和停止条件写入各 Agent 正文，不再通过共享运行目录读取。
5. OpenCode 安装时将场景 Skill 转换为 `hicode-*` Skill，将 `agents/` 转换为 `hicode-*.md` Agent，Agent 文件名即 OpenCode agent name。
6. Codex 安装时使用 `.codex-plugin/plugin.json` 和本地 marketplace；manifest 只声明 `skills: "./skills/"`，不声明 Codex manifest 不支持的 `agents` 字段，也暂不复制根目录 `agents/`。
7. Codex 安装不复制 `docs/`、`archive/`、`agents/` 或历史资料。
8. 卸载只移除 hicode 明确拥有的插件、bundle、marketplace 条目和 `hicode-*` OpenCode 资产，不删除目标项目入口、上下文文档、规则文档或业务代码。
9. `hooks/` 只保留 Hook 行为说明和目录索引，不是目标平台默认上下文，也不维护与 `skills/` 重复的规则或模板源。

参考资料：

1. Claude Code Plugins：`https://code.claude.com/docs/en/plugins#create-your-first-plugin`
2. OpenCode Agent Skills：`https://opencode.ai/docs/skills/`
3. Codex Plugins：`https://developers.openai.com/codex/plugins`
4. Codex Build Plugins：`https://developers.openai.com/codex/plugins/build`
