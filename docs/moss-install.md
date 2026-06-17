# hicode 安装指南 for Moss

将 hicode（意健险 AI 辅助研发工程体系）安装到 Moss 平台，让所有 Agent 都能使用。

## 前置知识：Moss Skill 机制

Moss 通过以下机制管理技能：

| 概念 | 说明 |
|---|---|
| **SKILL.md** | 每个技能是一个目录，内含 `SKILL.md` 文件 |
| **目录名 = name 字段** | 目录名必须和 SKILL.md 的 `name` frontmatter 一致 |
| **安装位置** | `~/.moss/agents/<agent-id>/learned-skills/<skill-name>/SKILL.md` |
| **启用开关** | `~/.moss/agents/<agent-id>/config.yaml` 的 `skills.enabled` 列表 |
| **生效条件** | 修改 config.yaml 后必须重启 Moss server |

---

## 一键安装

```bash
cd /path/to/hicode
node scripts/install.js --moss   # 一键安装
# 重启 Moss 后...
node scripts/install.js --check  # 验证
```

也支持通过 `install.sh` 调用（会自动委托到 `scripts/install.js`）：

```bash
cd /path/to/hicode
./install.sh --moss             # 一键安装
./install.sh --check             # 验证
```

**--moss 做了三件事：**
1. 复制文件到 `~/.moss/agents/zhangdalong/learned-skills/hicode-*/`
2. 修正 SKILL.md 的 `name` 字段（目录名 = name）
3. 追加到 `config.yaml` 的 `skills.enabled` 列表

> ⚠️ **安装完成后必须重启 Moss server**（关闭桌面端重开，或 `kill` server 进程）。
> 不重启的话 config.yaml 的改动用不上，技能还是 disabled。

---

## 手动安装步骤

如果你不想用脚本，也可以按以下步骤操作：

### 1. 安装 Skill 文件

```bash
# 安装 6 个 Skill（含辅助文件）
for skill in hi init scope tdd review release; do
  mkdir -p ~/.moss/agents/zhangdalong/learned-skills/hicode-$skill
  cp -R hicode/skills/$skill/. ~/.moss/agents/zhangdalong/learned-skills/hicode-$skill/
done

# 安装 8 个 Agent
for agent in requirement-reviewer coding-planner tdd-guide coding-assistant \
             code-reviewer security-reviewer java-reviewer release-reviewer; do
  mkdir -p ~/.moss/agents/zhangdalong/learned-skills/hicode-agent-$agent
  cp hicode/agents/$agent.md ~/.moss/agents/zhangdalong/learned-skills/hicode-agent-$agent/SKILL.md
done
```

### 2. 修正 name 字段

**必须修改！** SKILL.md 的 `name` frontmatter 必须和**目录名一致**。

```bash
# 6 个 Skill
for s in hi init scope tdd review release; do
  sk="$HOME/.moss/agents/zhangdalong/learned-skills/hicode-$s/SKILL.md"
  if grep -q "^name:" "$sk"; then
    sed -i '' "s/^name:.*/name: hicode-$s/" "$sk"
  else
    awk -v n="hicode-$s" 'NR==1{print; print "name: " n; next}1' "$sk" > "$sk.tmp" && mv "$sk.tmp" "$sk"
  fi
done

# 8 个 Agent
for a in requirement-reviewer coding-planner tdd-guide coding-assistant \
         code-reviewer security-reviewer java-reviewer release-reviewer; do
  sed -i '' "s/^name:.*/name: hicode-agent-$a/" \
    "$HOME/.moss/agents/zhangdalong/learned-skills/hicode-agent-$a/SKILL.md"
done
```

### 3. 启用 Skill

在 `~/.moss/agents/zhangdalong/config.yaml` 中的 `skills.enabled` 列表里，添加以下 14 项：

```yaml
skills:
  enabled:
    # ... 已有项 ...
    - hicode-hi
    - hicode-init
    - hicode-scope
    - hicode-tdd
    - hicode-review
    - hicode-release
    - hicode-agent-requirement-reviewer
    - hicode-agent-coding-planner
    - hicode-agent-tdd-guide
    - hicode-agent-coding-assistant
    - hicode-agent-code-reviewer
    - hicode-agent-security-reviewer
    - hicode-agent-java-reviewer
    - hicode-agent-release-reviewer
```

### 4. 重启 Moss Server

**必须重启！** 只改 config.yaml 不会热生效。

```bash
# 杀死 Moss server 进程（GUI 会自动重启）
kill $(pgrep -f "server/bootstrap.js" | tail -1)
```

等待 3-5 秒，Moss 桌面端会自动重建 server 进程。

---

## 验证安装

重启后，通过 `--check` 验证：

```bash
node scripts/install.js --check
```

或通过 API 手动验证：

```bash
curl -s \
  -H "Authorization: Bearer $(cat ~/.moss/server-info.json | python3 -c 'import json,sys;print(json.load(sys.stdin)["token"])')" \
  "http://localhost:$(cat ~/.moss/server-info.json | python3 -c 'import json,sys;print(json.load(sys.stdin)["port"])')/api/skills?agentId=zhangdalong" \
  | python3 -c '
import json,sys
data = json.load(sys.stdin)
for s in data["skills"]:
    if "hicode" in s["name"]:
        print(f'  {"✅" if s["enabled"] else "❌"}  {s["name"]}'
    )
'
```

全部 14 个 skill 应显示 `✅ ENABLED`。

---

## 安装清单

| # | 步骤 | 说明 | 可脚本化 |
|---|------|------|---------|
| 1 | 复制 Skill 文件 | `skills/<name>/` → `learned-skills/hicode-<name>/` | ✅ |
| 2 | 复制 Agent 文件 | `agents/<name>.md` → `learned-skills/hicode-agent-<name>/SKILL.md` | ✅ |
| 3 | 修正 name 字段 | 目录名 = SKILL.md 中的 `name:` 值 | ✅ |
| 4 | 添加到 config.yaml | `skills.enabled` 列表中加入 skill 名 | ✅ |
| 5 | 重启 Moss server | `kill` server 进程 → GUI 自动重建 | ✅ |

---

## 常见问题

### Q: 为什么需要改 name 字段？
Moss 根据 `SKILL.md` 的 `name` frontmatter 来匹配技能。如果目录名是 `hicode-hi` 但 name 是 `hi`，Moss 会把它们当成不同的技能，导致无法正确加载。

### Q: 为什么改了 config.yaml 还要重启？
Moss server 只在启动时读取一次 `config.yaml`。修改后需要重启 server 才会重新加载配置。

### Q: 重启后 config.yaml 会被重置吗？
不会。Moss 对 `config.yaml` 的修改是持久的，重启后仍然保留。

### Q: 所有 Agent 都能用 hicode 吗？
是的。技能安装到 `zhangdalong` 的 `learned-skills/` 目录下。要让其他 Agent 也能用，需要：
1. 把目录建在对应 Agent 的 `learned-skills/` 下
2. 在对应 Agent 的 `config.yaml` 中启用

### Q: 如果 Moss 版本升级了怎么办？
升级后再跑一次安装脚本即可——会覆盖旧文件重新注册。
