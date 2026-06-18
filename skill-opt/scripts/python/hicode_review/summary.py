import subprocess
from pathlib import Path


class SummaryError(RuntimeError):
    pass


def generate_summary(*, repo_root, run_id, dataset_path, outputs_root, docs_runs_dir):
    repo_root = Path(repo_root)
    command = [
        "node",
        str(repo_root / "skill-opt" / "scripts" / "evaluate-review-run.js"),
        run_id,
        "--dataset",
        str(dataset_path),
        "--outputs-root",
        str(outputs_root),
        "--docs-runs-dir",
        str(docs_runs_dir),
    ]
    completed = subprocess.run(
        command,
        cwd=repo_root,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    # evaluate-review-run.js returns 1 when the evaluated output has hard failures.
    # That is a scoring result, not a runner infrastructure failure.
    summary_path = Path(docs_runs_dir) / f"{run_id}.md"
    if completed.returncode not in (0, 1):
        raise SummaryError(completed.stderr.strip() or completed.stdout.strip() or "summary command failed")
    if not summary_path.exists():
        raise SummaryError(completed.stderr.strip() or completed.stdout.strip() or "summary file was not generated")
    return {
        "return_code": completed.returncode,
        "stdout": completed.stdout,
        "stderr": completed.stderr,
        "summary_path": str(summary_path),
    }
