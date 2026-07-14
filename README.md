# hicode Coding Agent Plugin

## 1. 定位

本仓库根目录是 hicode 的设计中心，也是面向 Claude Code 与 Codex 的 plugin root，并提供 OpenCode agents/skills 和 **Moss learned-skills** 安装入口。

hicode 默认面向金融、保险、支付、清结算、账务、计费、订单履约等金融或类金融高严谨业务系统，也适用于其他对业务规则严谨性、逻辑边界、交易或数据一致性、可审计性有同等级要求的系统。

Claude Code 通过 plugin marketplace 安装；OpenCode 通过 `install.sh --opencode` 把 hicode 的 agents 和 skills 转换复制到 OpenCode 用户级或项目级目录；Codex 通过 `install.sh --codex` 把 hicode 作为 `.codex-plugin` plugin bundle 写入本地 marketplace 并执行 `codex plugin add`；**Moss** 通过 `node scripts/install.js --moss` 安装到 Moss 的 learned-skills 目录。

本 plugin 安装动作不执行目标项目初始化，不扫描代码，不生成 `CLAUDE.md`、`AGENTS.md` 或项目本地运行目录。

目标项目初始化由 `hicode:init` 在用户确认写入范围后执行，只创建或补充目标项目入口、上下文和项目规则文档。

---

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

---

## 3. 安装范围

安装器采用跨平台双入口：

1. Linux、macOS、WSL、Git Bash、MSYS 和 Cygwin 使用 `./install.sh`。
2. Windows PowerShell 使用 `pwsh ./install.ps1`。
3. 两个入口都委托 `node scripts/install.js` 执行相同安装逻辑；也可以直接运行 `node scripts/install.js`。

前置条件：本机需可执行 `node`；按安装目标分别需要已安装 `claude`、`codex` 或 OpenCode 对应运行环境。`--dry-run` 不调用目标平台 CLI。

### 支持的安装目标

| 目标 | 参数 | 说明 |
|------|------|------|
| Claude Code | `--claude-code`（默认） | 注册为 hicode Claude Code plugin |
| OpenCode | `--opencode` | 安装 hicode-* Skill 和 Agent 到 OpenCode |
| Codex CLI | `--codex` | 安装为 Codex .codex-plugin bundle |
| Moss | `--moss` | 安装到 Moss learned-skills + 启用 config.yaml |
| 全平台 | `--all` | 以上四个目标同时安装 |

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
3. `./install.sh --all --yes`：同时安装 Claude Code plugin、OpenCode 本地运行资产、Codex plugin 和 Moss。
4. Windows PowerShell 下使用等价参数：`pwsh ./install.ps1 -Codex -Yes`、`pwsh ./install.ps1 -All -Yes`。

Moss 安装使用显式参数：

1. `./install.sh --moss --yes`：将 6 个 Skill + 8 个 Agent 安装到 `~/.moss/agents/zhangdalong/learned-skills/`，并追加到 `config.yaml` 的 `skills.enabled` 列表。
2. `./install.sh --moss --moss-agent-id <id> --yes`：指定 Agent ID（默认 zhangdalong）。
3. `./install.sh --check`：验证 Moss 端 hicode 技能是否已安装并启用。

卸载使用 `--uninstall` 搭配同一组平台和 scope 参数：

1. `./install.sh --uninstall --claude-code --yes`：调用 `claude plugin uninstall hicode@hicode`。
2. `./install.sh --uninstall --opencode --yes`：只删除 OpenCode 目录下安装器生成的 `hicode-*` Skill 和 Agent。
3. `./install.sh --uninstall --codex --yes`：调用 `codex plugin remove hicode@<marketplace>`，并删除本地 marketplace 条目和 `plugins/hicode` bundle。
4. `./install.sh --uninstall --moss --yes`：删除 Moss learned-skills 目录下的 hicode-* 目录，并从 config.yaml 移除对应条目。
5. `./install.sh --uninstall --all --yes`：同时卸载所有平台资产。

Claude Code 或 Codex CLI 返回 plugin 已不存在时，卸载视为幂等成功并继续清理其他 hicode-owned 资产；其他命令错误仍会失败。

安装器不修改业务仓库，不读取生产配置，不处理生产数据或客户敏感信息。

目标项目初始化应在业务仓库中显式调用 `hicode:init`。默认只创建或补充 `CLAUDE.md` / `AGENTS.md`、项目上下文和 RULES 文档；不复制 plugin 内置能力到目标项目运行目录。

---

## 4. 使用示例

```bash
# 安装到各平台
./install.sh --dry-run
./install.sh --opencode --dry-run
./install.sh --codex --dry-run
./install.sh --moss --dry-run
./install.sh --all --dry-run
./install.sh --uninstall --all --dry-run
./install.sh --yes
node scripts/install.js --all --dry-run --yes
bash scripts/health-check.sh

# Moss 安装与验证
node scripts/install.js --moss --yes   # 安装
# 重启 Moss server 后...
node scripts/install.js --check        # 验证
```

Windows PowerShell：

```powershell
pwsh ./install.ps1 -DryRun
pwsh ./install.ps1 -OpenCode -DryRun
pwsh ./install.ps1 -Codex -DryRun
pwsh ./install.ps1 -Moss -DryRun
pwsh ./install.ps1 -All -DryRun
pwsh ./install.ps1 -Uninstall -All -DryRun
pwsh ./install.ps1 -Yes
```

不传平台参数时默认安装 Claude Code plugin。

`scripts/health-check.sh` 用于重复验证当前运行资产边界、安装边界、旧路径依赖、安全红线和 Agent 共性规则收敛情况；它不扫描目标项目，不读取敏感配置或生产数据。

---

## 5. Moss 安装备忘

### 前置知识

| 概念 | 说明 |
|---|---|
| **SKILL.md** | 每个技能是一个目录，内含 `SKILL.md` 文件 |
| **目录名 = name 字段** | 目录名必须和 SKILL.md 的 `name` frontmatter 一致 |
| **安装位置** | `~/.moss/agents/<agent-id>/learned-skills/<skill-name>/SKILL.md` |
| **启用开关** | `~/.moss/agents/<agent-id>/config.yaml` 的 `skills.enabled` 列表 |
| **生效条件** | 修改 config.yaml 后必须重启 Moss server |

### 安装命令

```bash
cd /path/to/hicode
node scripts/install.js --moss          # 安装
# 重启 Moss server（关闭桌面端重开，或 kill server 进程）
# kill $(pgrep -f "server/bootstrap.js" | tail -1)
node scripts/install.js --check          # 验证
```

`--moss` 做了三件事：

1. 复制文件到 learned-skills 目录
2. 修正 SKILL.md 的 `name` 字段（目录名 = name）
3. 追加到 config.yaml 的 skills.enabled 列表

> ⚠️ 安装后必须重启 Moss server，否则 config.yaml 的改动用不上。

### 手动安装步骤（备用）

```bash
# 1. 安装 Skill 文件
for skill in hi init scope tdd review release; do
  mkdir -p ~/.moss/agents/zhangdalong/learned-skills/hicode-$skill
  cp -R hicode/skills/$skill/. ~/.moss/agents/zhangdalong/learned-skills/hicode-$skill/
done

for agent in requirement-reviewer coding-planner tdd-guide coding-assistant \
             code-reviewer security-reviewer java-reviewer release-reviewer; do
  mkdir -p ~/.moss/agents/zhangdalong/learned-skills/hicode-agent-$agent
  cp hicode/agents/$agent.md ~/.moss/agents/zhangdalong/learned-skills/hicode-agent-$agent/SKILL.md
done

# 2. 修正 name 字段（目录名必须 = name）
for s in hi init scope tdd review release; do
  sk="$HOME/.moss/agents/zhangdalong/learned-skills/hicode-$s/SKILL.md"
  sed -i '' "s/^name:.*/name: hicode-$s/" "$sk"
done
for a in requirement-reviewer coding-planner tdd-guide coding-assistant \
         code-reviewer security-reviewer java-reviewer release-reviewer; do
  sed -i '' "s/^name:.*/name: hicode-agent-$a/" \
    "$HOME/.moss/agents/zhangdalong/learned-skills/hicode-agent-$a/SKILL.md"
done

# 3. 在 config.yaml 的 skills.enabled 列表添加 14 项
#    hicode-hi, hicode-init, hicode-scope, hicode-tdd, hicode-review, hicode-release,
#    hicode-agent-requirement-reviewer, hicode-agent-coding-planner, ...

# 4. 重启 Moss server
```

---

## 6. hicode Skill 速通指南

> 用盖房子的故事，搞懂 6 个 hicode skill 分别干什么、什么时候用、按什么顺序用。

### 6.1 一句话定位

| Skill | 盖房子比喻 | 一句话说明 |
|---|---|---|
| **hi** | 前台接待 | 不知道从哪开始？先找"hi"，它帮你指路 |
| **init** | 打地基、通水电 | 新项目第一次用 hicode，先把基础设施搭好 |
| **scope** | 画图纸、定方案 | 需求还没想清楚？先理清范围、拆成小任务 |
| **tdd** | 一砖一瓦盖房子 | 需求清楚了，开始写代码（先写测试，再实现） |
| **review** | 监理质检 | 代码写完了，检查有没有问题 |
| **release** | 搬家验收 | 要上线了，检查能不能发、出问题了怎么回滚 |

### 6.2 使用顺序

**标准流程（从 0 到上线）：**

```
hi → init → scope → tdd → review → release
```

每一步的输出是下一步的输入：

```
hi 告诉你：项目还没初始化
  ↓
init 做完：项目有了入口和规则
  ↓
scope 做完：需求清楚了，拆成了小任务
  ↓
tdd 做完：代码写好了，测试通过了
  ↓
review 做完：代码审查通过，问题已修复
  ↓
release 做完：发布报告生成，可以上线了
```

**常见场景速查：**

| 你的状态 | 从哪个 skill 开始 |
|---|---|
| 第一次用 hicode，项目是新的 | `hi` → `init` → ... |
| 项目已初始化，来了新需求 | `scope` → `tdd` → `review` |
| 需求很清楚，直接开写 | `tdd` → `review` |
| 代码写完了，想检查一下 | `review` |
| 要上线了，检查风险 | `release` |
| 只想了解 hicode 是什么 | `hi` |

**可以跳过的场景：**

- 只 review，不改代码 → 直接 `review`
- 只做发布检查 → 直接 `release`
- 项目已初始化好 → 跳过 `init`，从 `scope` 或 `tdd` 开始

**不能跳过的场景：**

- 没初始化就想写代码 → 必须 `init`，否则没有上下文和规则
- 需求没想清楚就写代码 → 必须 `scope`，否则容易写偏
- 没测试就 review → 可以 review，但证据轴会降级
- 没 review 就 release → 可以 release，但风险等级会很高

**决策流程图：**

```
你打开一个项目
    │
    ▼
只发了 hi？ ───→ 用 hi → 它帮你判断下一步
    │
    有明确任务？
    │
    ├── 项目没初始化 ─────→ 用 init
    ├── 需求来了但模糊 ───→ 用 scope
    ├── 任务明确了，写代码 ─→ 用 tdd
    ├── 代码写完了，要检查 ─→ 用 review
    └── 准备上线 ────────→ 用 release
```

### 6.3 每个 Skill 详解

#### 6.3.1 `hi` —— 前台接待/导航员

**什么时候找它？**
- 第一次打开项目，不知道 hicode 能不能用
- 只输入了"hi"，想看看 hicode 能干什么
- 不确定该用哪个 skill

**它会做什么？**
- 检查项目有没有初始化（有没有 `AGENTS.md`、`docs/` 等文件）
- 告诉你当前项目状态：未初始化 / 部分初始化 / 已初始化
- 帮你指路：你现在的情况，应该走 `init`、`scope`、`tdd`、`review` 还是 `release`？

> 你说："hi" → 它说："你的项目还没初始化，建议先跑 init。"

---

#### 6.3.2 `init` —— 装修队（打地基、通水电）

**什么时候找它？**
- 一个新项目，第一次要用 hicode
- 缺少 Coding Agent 的入口文件（`AGENTS.md` / `CLAUDE.md`）
- 缺少项目上下文文档、规则文档

**它会做什么？**
- 创建或补充入口文件（`AGENTS.md` / `CLAUDE.md`）
- 建立项目文档目录（`docs/rules/`、`docs/DOMAIN_KNOWLEDGE.md`、`docs/PROJ_CONTEXT.md`）
- 让项目具备被 hicode 理解和操作的基础
- 判断项目复杂度，建议是否需要代码结构扫描
- **不会**碰生产环境、不会读密钥、不会改你的业务代码

> 你说："在这个仓库初始化 hicode" → 它会创建必要的骨架文件。

---

#### 6.3.3 `scope` —— 设计师（画图纸、定方案）

**什么时候找它？**
- 需求来了，但描述模糊（比如"做个用户系统"）
- 需求太大，不知道怎么拆成小任务
- 不确定验收标准是什么
- 准备编码前，想先理清思路

**它会做什么？**
- 评审需求：目标清楚吗？验收标准可测试吗？边界在哪？
- 追问模糊点：一次只问一个关键问题，帮你把需求想透
- 对比方案：给出 2-3 种实现路径，说明利弊
- 拆任务：把大需求拆成可独立验证的小任务
- 输出编码准入判断："可以开始写了"还是"还需要再想想"

> 你说："帮我梳理这个需求，拆成可编码任务" → 它会输出 `scope-plan.md`，包含设计树方案和 TDD 任务计划。

---

#### 6.3.4 `tdd` —— 施工队（一砖一瓦盖房子）

**什么时候找它？**
- 任务已经拆好了（来自 scope），可以开始写代码了
- 需要修复一个 bug，需要先复现再修复
- 需要重构代码，但需要有测试保护

**它会做什么？**
- 按 **RED → GREEN → REFACTOR** 循环工作
- 一次只做一个行为，小步快跑，不贪多
- 测试验证公开接口的行为，不绑内部实现
- 每完成一个行为就验证一次
- 记录每轮的修改和结果

> 你说："按 TDD 实现 task 1" → 它会先写失败测试 → 跑测试确认失败 → 写最小实现 → 跑测试确认通过 → 记录 → 进入下一轮。

---

#### 6.3.5 `review` —— 监理质检员

**什么时候找它？**
- 代码写完了，准备提交合并请求（MR/PR）
- 想检查代码有没有安全问题、性能问题
- 需要专项审查（Java 专项、SQL 审查、安全审查、保险业务审查）

**它会做什么？**
- **三轴审查**：需求轴（实现是否符合需求？）、规范轴（编码/安全规范？）、证据轴（测试/CI 是否足够？）
- 专项检查：Java、SQL、权限、保险业务等
- 按严重程度（P0~P3）列出问题清单
- 给出阻断建议：哪些问题必须修了才能合并

> 你说："review 当前改动" → 它会分析 diff，输出问题清单和严重度排序。

---

#### 6.3.6 `release` —— 搬家验收员

**什么时候找它？**
- 准备发布上线了
- 需要评估本次发布的风险
- 需要制定验证计划和回滚方案

**它会做什么？**
- 分析分支改动：这次改了哪些代码、配置、SQL？
- 核对需求文档和实现是否一致
- 汇总验证证据：测试通过了没有？Review 过了没有？
- 检查 SQL/配置/脚本风险：有没有幂等？能不能回滚？
- 生成发布报告：包含风险等级、验证计划、回滚方案

> 你说："分析当前分支的发布风险" → 它会输出发布报告，告诉你能不能发、有什么风险、出了问题怎么回滚。

---

### 6.4 8 个专业 Agent

这些 Agent 不需要手动调用——场景 Skill 会在需要时自动调派它们。

| Agent | 盖楼里的角色 | 负责什么 | 何时被调派 |
|---|---|---|---|
| `coding-assistant` | 全能工人 | 写代码、修 bug、重构 | `tdd` 需要实际改代码时 |
| `coding-planner` | 施工规划师 | 制定实现计划 | scope 之后要写代码方案时 |
| `code-reviewer` | 质检员 | 通用代码审查 | `review` 需要详细审查时 |
| `java-reviewer` | Java 专家 | Java/Spring/SQL 专项 | 审查 Java 代码时 |
| `security-reviewer` | 安检员 | 安全专项审查 | 发现安全风险时 |
| `requirement-reviewer` | 产品经理 | 需求合理性审查 | scope 需要深度需求评审时 |
| `tdd-guide` | TDD 教练 | 测试设计和测试代码 | `tdd` 需要设计测试时 |
| `release-reviewer` | 发布管家 | 发布前综合检查 | `release` 需要详细分析时 |

---

### 6.5 注意事项

1. **每个 Skill 都有安全红线：** 不看生产数据、不碰密钥、不自动发布、不自动合并。
2. **输出都是建议，不是审批：** review 不替代人工审批，release 不代替发布决策。
3. **高严谨业务系统默认更严格：** 金融、保险、支付、清结算、账务、计费、订单履约等金融或类金融场景，以及其他涉及关键数值、状态流转、幂等、并发、交易或数据一致性的系统，风险评级默认更高。
4. **所有文档只记录事实：** 不编造测试结果、不编造业务规则、不编造结论。

---

## 7. 安全边界

1. 不扫描目标项目代码。
2. 不生成目标项目入口文件。
3. 不生成或复制项目本地运行目录。
4. 不安装生产 Hook。
5. 不自动合并、自动发布、自动回滚或修改生产配置。
6. 不读取 `.env`、密钥文件、生产凭证或未脱敏客户数据。

---

## 8. 官方机制对齐

本仓库按以下官方机制组织：

1. Claude Code plugin 使用插件根目录下的 `.claude-plugin/plugin.json`、`agents/` 和 `skills/<name>/SKILL.md`；当前 manifest 只声明 validator 支持的 `skills` 路径，`agents/` 作为 plugin root 约定目录保留。
2. `skills/init/coding_rules.md` 是 `hicode:init` 创建或更新目标项目 `docs/rules/` 的种子规则；其他场景 Skill 遵守目标项目规则文件。
3. 每个 `skills/<skill>/` 目录只使用根目录文件承载本地具体模板和规则种子，不维护 Skill 内部子目录，也不为场景生命周期复制重复 `README.md`。
4. Agent 共性安全、权限、输出和停止条件写入各 Agent 正文，不再通过共享运行目录读取。
5. OpenCode 安装时将场景 Skill 转换为 `hicode-*` Skill，将 `agents/` 转换为 `hicode-*.md` Agent，Agent 文件名即 OpenCode agent name。
6. Codex 安装时使用 `.codex-plugin/plugin.json` 和本地 marketplace；manifest 只声明 `skills: "./skills/"`，不声明 Codex manifest 不支持的 `agents` 字段，也暂不复制根目录 `agents/`。
7. Codex 安装不复制 `docs/`、`archive/`、`agents/` 或历史资料。
8. 卸载只移除 hicode 明确拥有的插件、bundle、marketplace 条目和 `hicode-*` OpenCode/Moss 资产，不删除目标项目入口、上下文文档、规则文档或业务代码。
9. `hooks/` 只保留 Hook 行为说明和目录索引，不是目标平台默认上下文，也不维护与 `skills/` 重复的规则或模板源。
10. Moss 安装在每个 Agent 的 `learned-skills/` 目录下创建 `hicode-*` 目录，内含 `SKILL.md` 及辅助文件；`name` frontmatter 必须和目录名一致；启用状态通过 `config.yaml` 的 `skills.enabled` 控制。

参考资料：

1. Claude Code Plugins：`https://code.claude.com/docs/en/plugins#create-your-first-plugin`
2. OpenCode Agent Skills：`https://opencode.ai/docs/skills/`
3. Codex Plugins：`https://developers.openai.com/codex/plugins`
4. Codex Build Plugins：`https://developers.openai.com/codex/plugins/build`
