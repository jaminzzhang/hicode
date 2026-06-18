#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

SCRIPT="skill-opt/scripts/run-review-eval-deepseek.sh"

[ -f "$SCRIPT" ]
bash -n "$SCRIPT"

if rg -n '(^|[[:space:]])(source|\.)[[:space:]]+|dotenv' "$SCRIPT" >/dev/null; then
  echo "wrapper must parse env files without source/dotenv" >&2
  exit 1
fi

tmp="$(mktemp -d)"
cat >"$tmp/deepseek.env" <<'ENV'
DEEPSEEK_MODEL=DeepSeek-V4-Flash
DEEPSEEK_BASE_URL=https://deepseek.example.test/v1
DEEPSEEK_API_KEY=fake-test-key
UNRELATED_SECRET=must-not-be-loaded
ENV

HICODE_SKILLOPT_ENV_FILE="$tmp/deepseek.env" \
  bash "$SCRIPT" --run-id deepseek-wrapper-dry-run --outputs-root "$tmp/outputs" --dry-run >/dev/null

[ -f "$tmp/outputs/deepseek-wrapper-dry-run/split/train/items.json" ]
[ -f "$tmp/outputs/deepseek-wrapper-dry-run/run.json" ]
[ -f "$tmp/outputs/deepseek-wrapper-dry-run/dry-run.json" ]
[ ! -e "$tmp/outputs/deepseek-wrapper-dry-run/review-outputs" ]

node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$tmp/outputs/deepseek-wrapper-dry-run/run.json', 'utf8'));
if (data.target.model !== 'deepseek-v4-flash') process.exit(1);
if (data.target.base_url_host !== 'deepseek.example.test') process.exit(1);
"

if env | rg 'UNRELATED_SECRET=must-not-be-loaded' >/dev/null; then
  echo "wrapper leaked unrelated env file variable into parent environment" >&2
  exit 1
fi
