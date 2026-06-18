#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
PYTHON_SRC = SCRIPT_DIR / "python"
sys.path.insert(0, str(PYTHON_SRC))

from hicode_review_skillopt import HicodeReviewAdapter  # noqa: E402
from hicode_review_skillopt.data import load_jsonl, write_split  # noqa: E402
from hicode_review_skillopt.prompt_fallbacks import install_skillopt_prompt_fallbacks  # noqa: E402


ROOT = SCRIPT_DIR.parents[1]
DEFAULT_CONFIG = "skill-opt/configs/review-train-minimal.yaml"
DEFAULT_DATASET = "skill-opt/data/review-golden/items.jsonl"
DEFAULT_SKILL = "skills/review/SKILL.md"
DEFAULT_OUTPUTS_ROOT = "skill-opt/outputs"
DEFAULT_DOCS_RUNS_DIR = "skill-opt/docs/runs"


def resolve(path: str | Path) -> Path:
    path = Path(path)
    if path.is_absolute():
        return path
    return ROOT / path


def parse_args(argv: list[str]) -> tuple[argparse.Namespace, list[str]]:
    parser = argparse.ArgumentParser(
        description="Run SkillOpt train for hicode:review via local adapter registration.",
        allow_abbrev=False,
    )
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--dataset", default=DEFAULT_DATASET)
    parser.add_argument("--skill", default=DEFAULT_SKILL)
    parser.add_argument("--outputs-root", default=DEFAULT_OUTPUTS_ROOT)
    parser.add_argument("--docs-runs-dir", default=DEFAULT_DOCS_RUNS_DIR)
    parser.add_argument("--config", default=DEFAULT_CONFIG)
    parser.add_argument("--optimizer-model")
    parser.add_argument("--target-model")
    parser.add_argument("--backend", default="azure_openai")
    parser.add_argument("--optimizer-backend", default="openai_chat")
    parser.add_argument("--target-backend", default="openai_chat")
    parser.add_argument("--dry-run", action="store_true", default=False)
    parser.add_argument("--no-post-eval", action="store_true", default=False)
    parser.add_argument("--no-candidate-summary", action="store_true", default=False)
    parser.add_argument("--train-size", type=int)
    parser.add_argument("--batch-size", type=int)
    parser.add_argument("--minibatch-size", type=int)
    parser.add_argument("--sel-env-num", type=int)
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


def env_optimizer_model(target_model: str) -> str:
    return normalize_model(
        os.environ.get("OPTIMIZER_DEPLOYMENT")
        or os.environ.get("AZURE_OPENAI_OPTIMIZER_MODEL")
        or os.environ.get("DEEPSEEK_OPTIMIZER_MODEL")
        or target_model
    )


def normalize_model(value: str) -> str:
    lower = str(value).lower()
    if lower in {"deepseek-chat", "deepseek-reasoner", "deepseek-v4-flash", "deepseek-v4-pro"}:
        return lower
    return value


def prepare_split(dataset_path: Path, split_root: Path) -> None:
    items = load_jsonl(dataset_path)
    write_split(items, split_root)


def register_train_adapter() -> None:
    import scripts.train as skillopt_train

    skillopt_train._ENV_REGISTRY["hicode_review"] = HicodeReviewAdapter
    install_skillopt_prompt_fallbacks()


def build_cfg_options(args: argparse.Namespace, out_root: Path, split_root: Path) -> list[str]:
    options = [
        f"env.repo_root={ROOT}",
        f"env.split_dir={split_root}",
        f"env.out_root={out_root}",
    ]
    if args.train_size is not None:
        options.append(f"train.train_size={args.train_size}")
    if args.batch_size is not None:
        options.append(f"train.batch_size={args.batch_size}")
    if args.minibatch_size is not None:
        options.append(f"gradient.minibatch_size={args.minibatch_size}")
    if args.sel_env_num is not None:
        options.append(f"evaluation.sel_env_num={args.sel_env_num}")
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
    target_model = args.target_model or env_model()
    optimizer_model = args.optimizer_model or env_optimizer_model(target_model)

    skillopt_args = [
        "--config",
        str(resolve(args.config)),
        "--env",
        "hicode_review",
        "--backend",
        args.backend,
        "--optimizer_backend",
        args.optimizer_backend,
        "--target_backend",
        args.target_backend,
        "--optimizer_model",
        optimizer_model,
        "--target_model",
        target_model,
        "--skill_init",
        str(resolve(args.skill)),
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
    return skillopt_args


def write_dry_run(args: argparse.Namespace, skillopt_args: list[str], out_root: Path, split_root: Path) -> None:
    out_root.mkdir(parents=True, exist_ok=True)
    payload = {
        "run_id": args.run_id,
        "mode": "dry-run",
        "dataset": str(resolve(args.dataset)),
        "skill": str(resolve(args.skill)),
        "config": str(resolve(args.config)),
        "split_root": str(split_root),
        "out_root": str(out_root),
        "skillopt_args": skillopt_args,
        "notes": [
            "No model call was made.",
            "No credentials or environment variable values are recorded.",
        ],
    }
    (out_root / "train-dry-run.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def summarize_candidate(args: argparse.Namespace, out_root: Path) -> int:
    if args.no_candidate_summary:
        return 0
    candidate = out_root / "best_skill.md"
    if not candidate.exists():
        return 0
    completed = subprocess.run(
        [
            "node",
            str(ROOT / "skill-opt" / "scripts" / "summarize-review-candidate.js"),
            args.run_id,
            "--outputs-root",
            str(resolve(args.outputs_root)),
            "--docs-runs-dir",
            str(resolve(args.docs_runs_dir)),
            "--candidate",
            str(candidate),
            "--baseline",
            str(resolve(args.skill)),
        ],
        check=False,
        text=True,
        capture_output=True,
    )
    sys.stdout.write(completed.stdout)
    if completed.stderr:
        sys.stderr.write(completed.stderr)
    if completed.returncode in (0, 1):
        return 0
    return completed.returncode


def post_eval_candidate(args: argparse.Namespace, out_root: Path) -> int:
    if args.no_post_eval:
        return 0
    candidate = out_root / "best_skill.md"
    if not candidate.exists():
        return 0
    post_run_id = f"{args.run_id}-candidate-eval"
    cmd = [
        sys.executable,
        str(SCRIPT_DIR / "run-review-skillopt-eval.py"),
        "--run-id",
        post_run_id,
        "--dataset",
        str(resolve(args.dataset)),
        "--skill",
        str(candidate),
        "--outputs-root",
        str(resolve(args.outputs_root)),
        "--config",
        str(resolve(args.config)),
        "--split",
        "valid_unseen",
        "--target-model",
        args.target_model or env_model(),
        "--backend",
        args.backend,
        "--target-backend",
        args.target_backend,
    ]
    completed = subprocess.run(cmd, check=False, text=True)
    return completed.returncode


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

    register_train_adapter()

    import scripts.train as skillopt_train

    old_argv = sys.argv
    try:
        sys.argv = ["skillopt-train", *skillopt_args]
        skillopt_train.main()
    finally:
        sys.argv = old_argv

    summary_code = summarize_candidate(args, out_root)
    eval_code = post_eval_candidate(args, out_root)
    return summary_code or eval_code


if __name__ == "__main__":
    raise SystemExit(main())
