#!/usr/bin/env python3
import argparse
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
PYTHON_SRC = SCRIPT_DIR / "python"
sys.path.insert(0, str(PYTHON_SRC))

from hicode_review.runner import ConfigurationError, RunConfig, ReviewEvalRunner  # noqa: E402


ROOT = SCRIPT_DIR.parents[1]


def parse_args(argv):
    parser = argparse.ArgumentParser(description="Run hicode_review P5A eval-only runner.")
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--dataset", default="skill-opt/data/review-golden/items.jsonl")
    parser.add_argument("--skill", default="skills/review/SKILL.md")
    parser.add_argument("--outputs-root", default="skill-opt/outputs")
    parser.add_argument("--docs-runs-dir", default="skill-opt/docs/runs")
    parser.add_argument("--dry-run", action="store_true", default=False)
    parser.add_argument("--no-summary", action="store_true", default=False)
    parser.add_argument("--fail-fast", action="store_true", default=False)
    parser.add_argument("--target-model")
    parser.add_argument("--azure-openai-endpoint")
    parser.add_argument("--azure-openai-api-version")
    parser.add_argument("--base-url")
    parser.add_argument("--api-key-env")
    parser.add_argument("--temperature", type=float, default=0)
    return parser.parse_args(argv)


def resolve(path):
    path = Path(path)
    if path.is_absolute():
        return path
    return ROOT / path


def main(argv=None):
    args = parse_args(argv or sys.argv[1:])
    config = RunConfig(
        run_id=args.run_id,
        dataset_path=resolve(args.dataset),
        skill_path=resolve(args.skill),
        outputs_root=resolve(args.outputs_root),
        docs_runs_dir=resolve(args.docs_runs_dir),
        repo_root=ROOT,
        dry_run=args.dry_run,
        no_summary=args.no_summary,
        fail_fast=args.fail_fast,
        target_model=args.target_model,
        azure_openai_endpoint=args.azure_openai_endpoint,
        azure_openai_api_version=args.azure_openai_api_version,
        base_url=args.base_url,
        api_key_env=args.api_key_env,
        temperature=args.temperature,
    )
    try:
        result = ReviewEvalRunner(config).run()
    except ConfigurationError as error:
        sys.stderr.write(f"configuration error: {error}\n")
        return 2

    sys.stdout.write(
        f"run_id={args.run_id} items={result.item_count} failures={result.failure_count} run_root={result.run_root}\n"
    )
    if result.summary_path:
        sys.stdout.write(f"summary={result.summary_path}\n")
    return result.exit_code


if __name__ == "__main__":
    raise SystemExit(main())
