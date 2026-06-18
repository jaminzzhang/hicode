#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

strip_optional_quotes() {
  local value="$1"
  if [[ "$value" == \"*\" && "$value" == *\" ]]; then
    value="${value:1:${#value}-2}"
  elif [[ "$value" == \'*\' && "$value" == *\' ]]; then
    value="${value:1:${#value}-2}"
  fi
  printf '%s' "$value"
}

assign_if_unset() {
  local key="$1"
  local value="$2"
  if [ -z "${!key:-}" ]; then
    printf -v "$key" '%s' "$value"
    export "$key"
  fi
}

load_deepseek_env_file() {
  local env_file="${HICODE_SKILLOPT_ENV_FILE:-.env}"
  [ -f "$env_file" ] || return 0

  local line key value
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      ''|'#'*) continue ;;
    esac
    line="${line#export }"
    case "$line" in
      *=*) ;;
      *) continue ;;
    esac
    key="${line%%=*}"
    value="${line#*=}"
    value="$(strip_optional_quotes "$value")"
    case "$key" in
      DEEPSEEK_API_KEY|DEEPSEEK_BASE_URL|DEEPSEEK_MODEL|DEEPSEEK_API_KEY_ENV)
        assign_if_unset "$key" "$value"
        ;;
    esac
  done < "$env_file"
}

normalize_deepseek_model() {
  local value="$1"
  local lower
  lower="$(printf '%s' "$value" | tr '[:upper:]' '[:lower:]')"
  case "$lower" in
    deepseek-chat|deepseek-reasoner|deepseek-v4-flash|deepseek-v4-pro)
      printf '%s' "$lower"
      ;;
    *)
      printf '%s' "$value"
      ;;
  esac
}

load_deepseek_env_file

base_url="${DEEPSEEK_BASE_URL:-https://api.deepseek.com}"
model="$(normalize_deepseek_model "${DEEPSEEK_MODEL:-deepseek-chat}")"
api_key_env="${DEEPSEEK_API_KEY_ENV:-DEEPSEEK_API_KEY}"

dry_run=false
for arg in "$@"; do
  if [ "$arg" = "--dry-run" ]; then
    dry_run=true
    break
  fi
done

if [ "$dry_run" = false ] && [ -z "${!api_key_env:-}" ]; then
  printf 'Missing required credential environment variable: %s\n' "$api_key_env" >&2
  printf 'Export it in the current shell before running this wrapper.\n' >&2
  exit 2
fi

exec uv run python skill-opt/scripts/run-review-eval.py \
  --base-url "$base_url" \
  --target-model "$model" \
  --api-key-env "$api_key_env" \
  "$@"
