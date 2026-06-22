#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

load_skillopt_env_file() {
  local env_file="${HICODE_SKILLOPT_ENV_FILE:-.env}"
  [ -f "$env_file" ] || return 0

  set -a
  # shellcheck disable=SC1090
  . "$env_file"
  set +a
}

load_skillopt_env_file

dry_run=false
for arg in "$@"; do
  if [ "$arg" = "--dry-run" ]; then
    dry_run=true
    break
  fi
done

if [ "$dry_run" = false ]; then
  if [ -z "${AZURE_OPENAI_ENDPOINT:-}" ]; then
    printf 'Missing required SkillOpt environment variable: AZURE_OPENAI_ENDPOINT\n' >&2
    exit 2
  fi
  if [ -z "${AZURE_OPENAI_API_KEY:-}" ] && [ "${AZURE_OPENAI_AUTH_MODE:-}" = "openai_compatible" ]; then
    printf 'Missing required SkillOpt environment variable: AZURE_OPENAI_API_KEY\n' >&2
    exit 2
  fi
fi

exec uv run python skill-opt/scripts/run-review-train.py "$@"
