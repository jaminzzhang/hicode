#!/usr/bin/env bash
# ============================================
# hicode → Moss 一键安装脚本
# 用法：bash install-moss.sh
#        bash install-moss.sh --check   验证
# 说明：将 hicode 的 6 个 Skill + 8 个 Agent
#       安装到 Moss 的 zhangdalong Agent
# ============================================
set -euo pipefail

HICODE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENT_ID="${AGENT_ID:-zhangdalong}"
MOSS_SKILLS_DIR="$HOME/.moss/agents/$AGENT_ID/learned-skills"
MOSS_CONFIG="$HOME/.moss/agents/$AGENT_ID/config.yaml"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
ok()   { echo -e "  ${GREEN}✅${NC} $1"; }
info() { echo -e "  ${YELLOW}ℹ️${NC}  $1"; }
fail() { echo -e "  ${RED}❌${NC} $1"; exit 1; }

# ========== --check 验证模式 ==========
if [ "${1:-}" = "--check" ]; then
  SERVER_INFO="$HOME/.moss/server-info.json"
  [ ! -f "$SERVER_INFO" ] && fail "Moss 未运行（未找到 server-info.json）"

  TOKEN=$(python3 -c "import json; print(json.load(open('$SERVER_INFO'))['token'])")
  PORT=$(python3 -c "import json; print(json.load(open('$SERVER_INFO'))['port'])")

  echo "检查 Moss Server (端口 $PORT)..."
  SKILLS=$(curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:$PORT/api/skills?agentId=$AGENT_ID" 2>/dev/null || echo "")

  if [ -z "$SKILLS" ]; then
    fail "Moss API 无响应，是否重启了 server？"
  fi

  echo ""
  echo "hicode 技能状态："
  echo "$SKILLS" | python3 -c "
import json, sys
data = json.load(sys.stdin)
hicode = [s for s in data['skills'] if s['name'].startswith('hicode')]
for s in hicode:
    status = '✅' if s['enabled'] else '❌'
    src = s.get('source', '-')
    print(f'  {status} {s[\"name\"]}  (source={src})')
disabled = [s for s in hicode if not s['enabled']]
print()
if disabled:
    print(f'  ⚠️  有 {len(disabled)} 个技能未启用')
    exit(1)
else:
    print(f'  ✅ 全部 {len(hicode)} 个 hicode 技能已启用！')
"
  exit 0
fi

# ========== 前置检查 ==========
echo "=========================================="
echo "  hicode → Moss 安装脚本"
echo "=========================================="
echo ""

[ ! -d "$HICODE_DIR/skills" ] && fail "未找到 skills/ 目录，请确认在 hicode 仓库根目录执行"
[ ! -d "$HICODE_DIR/agents" ] && fail "未找到 agents/ 目录"
[ ! -f "$MOSS_CONFIG" ] && fail "未找到 Moss config.yaml ($MOSS_CONFIG)"

echo "  仓库: $HICODE_DIR"
echo "  目标 Agent: $AGENT_ID"
echo "  目标目录: $MOSS_SKILLS_DIR"
echo ""

# ========== 1. 安装 Skill ==========
echo "[1/4] 安装 6 个 hicode Skill..."

for skill in hi init scope tdd review release; do
  target_dir="$MOSS_SKILLS_DIR/hicode-$skill"
  rm -rf "$target_dir"
  mkdir -p "$target_dir"
  cp -R "$HICODE_DIR/skills/$skill/." "$target_dir/"
  ok "hicode-$skill"
done

# ========== 2. 安装 Agent ==========
echo "[2/4] 安装 8 个 hicode Agent..."

for agent in requirement-reviewer coding-planner tdd-guide coding-assistant \
             code-reviewer security-reviewer java-reviewer release-reviewer; do
  target_dir="$MOSS_SKILLS_DIR/hicode-agent-$agent"
  rm -rf "$target_dir"
  mkdir -p "$target_dir"
  cp "$HICODE_DIR/agents/$agent.md" "$target_dir/SKILL.md"
  ok "hicode-agent-$agent"
done

# ========== 3. 修正 name 字段 ==========
echo "[3/4] 修正 SKILL.md name 字段（目录名 = name）..."

for skill in hi init scope tdd review release; do
  sk="$MOSS_SKILLS_DIR/hicode-$skill/SKILL.md"
  if grep -q "^name:" "$sk"; then
    sed -i '' "s/^name:.*/name: hicode-$skill/" "$sk"
  else
    awk -v n="hicode-$skill" 'NR==1{print; print "name: " n; next}1' "$sk" > "$sk.tmp" && mv "$sk.tmp" "$sk"
  fi
  ok "hicode-$skill"
done

for agent in requirement-reviewer coding-planner tdd-guide coding-assistant \
             code-reviewer security-reviewer java-reviewer release-reviewer; do
  sk="$MOSS_SKILLS_DIR/hicode-agent-$agent/SKILL.md"
  sed -i '' "s/^name:.*/name: hicode-agent-$agent/" "$sk"
  ok "hicode-agent-$agent"
done

# ========== 4. 启用 Skill ==========
echo "[4/4] 启用 hicode Skill（写入 config.yaml）..."

HICODE_SKILLS=(
  hicode-hi hicode-init hicode-scope hicode-tdd hicode-review hicode-release
  hicode-agent-requirement-reviewer hicode-agent-coding-planner
  hicode-agent-tdd-guide hicode-agent-coding-assistant
  hicode-agent-code-reviewer hicode-agent-security-reviewer
  hicode-agent-java-reviewer hicode-agent-release-reviewer
)

if grep -qE "^skills:" "$MOSS_CONFIG"; then
  for s in "${HICODE_SKILLS[@]}"; do
    if ! grep -qE "^    - $s\$" "$MOSS_CONFIG"; then
      last_line=$(grep -nE "^- " "$MOSS_CONFIG" | tail -1 | cut -d: -f1)
      if [ -n "$last_line" ]; then
        sed -i '' "${last_line}a\\
    - $s" "$MOSS_CONFIG"
      else
        sed -i '' "/^skills:/a\\
  enabled:\\
    - $s" "$MOSS_CONFIG"
      fi
      ok "+ $s"
    else
      ok "$s (已存在)"
    fi
  done
else
  {
    echo ""
    echo "skills:"
    echo "  enabled:"
    for s in "${HICODE_SKILLS[@]}"; do
      echo "    - $s"
    done
  } >> "$MOSS_CONFIG"
  for s in "${HICODE_SKILLS[@]}"; do
    ok "+ $s"
  done
fi

# ========== 完成 ==========
echo ""
echo "=========================================="
echo "  ✅ 安装完成！"
echo "=========================================="
echo ""
echo "下一步：重启 Moss server"
echo ""
echo "  方式一（推荐）：关闭 Moss 桌面端再重新打开"
echo ""
echo "  方式二：杀死 server 进程（GUI 会自动重启）"
echo "    kill \$(pgrep -f \"server/bootstrap.js\" | tail -1)"
echo ""
echo "重启后验证："
echo "    bash install-moss.sh --check"
echo "=========================================="
