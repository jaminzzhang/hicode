#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
PYTHON_SRC = SCRIPT_DIR / "python"
sys.path.insert(0, str(PYTHON_SRC))

from hicode_review_skillopt import HicodeReviewAdapter  # noqa: E402
from hicode_review_skillopt.data import load_jsonl, write_split  # noqa: E402


ROOT = SCRIPT_DIR.parents[1]
DEFAULT_CONFIG = "skill-opt/configs/review-train-minimal.yaml"
DEFAULT_DATASET = "skill-opt/data/review-golden/items.jsonl"
DEFAULT_OUTPUTS_ROOT = "skill-opt/outputs"


def resolve(path: str | Path) -> Path:
    path = Path(path)
    if path.is_absolute():
        return path
    return ROOT / path


def parse_args(argv: list[str]) -> tuple[argparse.Namespace, list[str]]:
    parser = argparse.ArgumentParser(
        description="Run SkillOpt held-out eval for hicode:review via local adapter registration.",
        allow_abbrev=False,
    )
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--dataset", default=DEFAULT_DATASET)
    parser.add_argument("--skill", required=True)
    parser.add_argument("--outputs-root", default=DEFAULT_OUTPUTS_ROOT)
    parser.add_argument("--config", default=DEFAULT_CONFIG)
    parser.add_argument("--split", default="valid_unseen")
    parser.add_argument("--target-model")
    parser.add_argument("--backend", default="azure_openai")
    parser.add_argument("--target-backend", default="openai_chat")
    parser.add_argument("--dry-run", action="store_true", default=False)
    parser.add_argument("--test-env-num", type=int)
    parser.add_argument("--max-completion-tokens", type=int)
    return parser.parse_known_args(argv)


def env_model(default: str = "deepseek-chat") -> str:
    return normalize_model(
        os.environ.get("TARGET_DEPLOYMENT")
        or os.environ.get("AZURE_OPENAI_TARGET_MODEL")
        or os.environ.get("DEEPSEEK_MODEL")
        or default
    )


def normalize_model(value: str) -> str:
    lower = str(value).lower()
    if lower in {"deepseek-chat", "deepseek-reasoner", "deepseek-v4-flash", "deepseek-v4-pro"}:
        return lower
    return value


def prepare_split(dataset_path: Path, split_root: Path) -> None:
    items = load_jsonl(dataset_path)
    write_split(items, split_root)


def register_eval_adapter() -> None:
    import scripts.eval_only as skillopt_eval

    skillopt_eval._ENV_REGISTRY["hicode_review"] = HicodeReviewAdapter


def build_cfg_options(args: argparse.Namespace, out_root: Path, split_root: Path) -> list[str]:
    options = [
        f"env.repo_root={ROOT}",
        f"env.split_dir={split_root}",
        f"env.out_root={out_root}",
    ]
    if args.test_env_num is not None:
        options.append(f"evaluation.test_env_num={args.test_env_num}")
    if args.max_completion_tokens is not None:
        options.append(f"env.max_completion_tokens={args.max_completion_tokens}")
    return options


def build_skillopt_args(
    args: argparse.Namespace,
    unknown: list[str],
    out_root: Path,
    split_root: Path,
) -> list[str]:
    return [
        "--config",
        str(resolve(args.config)),
        "--env",
        "hicode_review",
        "--backend",
        args.backend,
        "--target_backend",
        args.target_backend,
        "--target_model",
        args.target_model or env_model(),
        "--skill",
        str(resolve(args.skill)),
        "--split",
        args.split,
        "--split_mode",
        "split_dir",
        "--split_dir",
        str(split_root),
        "--out_root",
        str(out_root),
        "--cfg-options",
        *build_cfg_options(args, out_root, split_root),
        *unknown,
    ]


def write_dry_run(args: argparse.Namespace, skillopt_args: list[str], out_root: Path, split_root: Path) -> None:
    out_root.mkdir(parents=True, exist_ok=True)
    payload = {
        "run_id": args.run_id,
        "mode": "dry-run",
        "dataset": str(resolve(args.dataset)),
        "skill": str(resolve(args.skill)),
        "config": str(resolve(args.config)),
        "split": args.split,
        "split_root": str(split_root),
        "out_root": str(out_root),
        "skillopt_args": skillopt_args,
        "notes": [
            "No model call was made.",
            "No credentials or environment variable values are recorded.",
        ],
    }
    (out_root / "eval-dry-run.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main(argv: list[str] | None = None) -> int:
    args, unknown = parse_args(argv or sys.argv[1:])
    out_root = resolve(args.outputs_root) / args.run_id
    split_root = out_root / "split"

    prepare_split(resolve(args.dataset), split_root)
    skillopt_args = build_skillopt_args(args, unknown, out_root, split_root)

    if args.dry_run:
        write_dry_run(args, skillopt_args, out_root, split_root)
        sys.stdout.write(
            f"run_id={args.run_id} mode=dry-run split_root={split_root} out_root={out_root}\n"
        )
        return 0

    register_eval_adapter()

    import scripts.eval_only as skillopt_eval

    old_argv = sys.argv
    try:
        sys.argv = ["skillopt-eval", *skillopt_args]
        skillopt_eval.main()
    finally:
        sys.argv = old_argv
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
