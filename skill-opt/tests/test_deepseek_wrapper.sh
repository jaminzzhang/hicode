#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

SCRIPT="skill-opt/scripts/run-review-train-deepseek.sh"

[ -f "$SCRIPT" ]
bash -n "$SCRIPT"

tmp="$(mktemp -d)"
cat >"$tmp/official.env" <<'ENV'
AZURE_OPENAI_ENDPOINT=https://official.example.test/v1
AZURE_OPENAI_API_KEY=fake-test-key
AZURE_OPENAI_AUTH_MODE=openai_compatible
TARGET_DEPLOYMENT=DeepSeek-V4-Flash
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://deepseek.example.test/v1
UNRELATED_SECRET=must-not-be-loaded
ENV

HICODE_SKILLOPT_ENV_FILE="$tmp/official.env" \
  bash "$SCRIPT" --run-id deepseek-wrapper-official-dry-run --outputs-root "$tmp/outputs" --dry-run >/dev/null

[ -f "$tmp/outputs/deepseek-wrapper-official-dry-run/split/train/items.json" ]
[ -f "$tmp/outputs/deepseek-wrapper-official-dry-run/train-dry-run.json" ]
[ ! -e "$tmp/outputs/deepseek-wrapper-official-dry-run/review-outputs" ]

node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$tmp/outputs/deepseek-wrapper-official-dry-run/train-dry-run.json', 'utf8'));
if (!data.skillopt_args.includes('--target_model')) process.exit(1);
const targetModel = data.skillopt_args[data.skillopt_args.indexOf('--target_model') + 1];
if (targetModel !== 'deepseek-v4-flash') process.exit(1);
if (!data.skillopt_args.includes('env.split_dir=$tmp/outputs/deepseek-wrapper-official-dry-run/split')) process.exit(1);
"

if env | rg 'UNRELATED_SECRET=must-not-be-loaded' >/dev/null; then
  echo "wrapper leaked env file variable into parent environment" >&2
  exit 1
fi
