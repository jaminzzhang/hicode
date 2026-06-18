from __future__ import annotations

import json
import subprocess
from pathlib import Path


class ReviewScoringError(RuntimeError):
    pass


def evaluate_with_node(
    *,
    repo_root: Path,
    item_path: Path,
    output_path: Path,
) -> dict:
    """Run the existing Node evaluator and return its JSON result."""

    script = repo_root / "skill-opt" / "scripts" / "evaluate-review-output.js"
    completed = subprocess.run(
        ["node", str(script), str(item_path), str(output_path)],
        check=False,
        text=True,
        capture_output=True,
    )

    stdout = completed.stdout.strip()
    if completed.returncode not in (0, 1):
        raise ReviewScoringError(
            "review evaluator failed: "
            f"exit={completed.returncode} stderr={completed.stderr.strip()}"
        )
    if not stdout:
        raise ReviewScoringError("review evaluator produced empty stdout")

    try:
        return json.loads(stdout)
    except json.JSONDecodeError as error:
        raise ReviewScoringError(f"review evaluator produced invalid JSON: {error}") from error
