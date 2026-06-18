from __future__ import annotations

import json
import os
import re
import traceback
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any

from skillopt.datasets.base import BatchSpec
from skillopt.envs.base import EnvAdapter
from skillopt.gradient.reflect import run_minibatch_reflect
from skillopt.model import chat_target_messages

from hicode_review_skillopt.dataloader import HicodeReviewDataLoader
from hicode_review_skillopt.prompt import build_messages
from hicode_review_skillopt.scoring import ReviewScoringError, evaluate_with_node


ERROR_MINIBATCH_PROMPT = """You are optimizing the hicode:review Skill for a financial/insurance core-system code review task.

Use only the failed trajectories, hidden reference criteria, evaluator notes, and target prompts shown to you. Improve the Skill so future review reports identify high-risk issues in amount precision, transaction consistency, state transitions, idempotency, permissions, audit, privacy, regulatory constraints, production change safety, rollback, SQL/config/script risk, and Java/Spring transaction behavior.

Hard constraints:
- Do not produce final approval wording such as allowing merge, approving release, or saying production is safe.
- Do not ask the target agent to read real repositories, .env files, production configs, logs, customer data, credentials, or external systems.
- Keep the Skill as an actionable Chinese Markdown instruction for Coding Agents.
- Prefer small, reviewable edits. Do not rewrite unrelated sections.
- Preserve hicode's advisory conclusion vocabulary: BLOCKED, NEEDS_CONFIRMATION, CONDITIONAL_RECOMMENDATION, NO_BLOCKING_FINDINGS.

Return only JSON in this format:
{
  "patch": {
    "reasoning": "brief diagnosis of the recurring failure pattern",
    "failure_summary": [
      {"failure_type": "short-name", "description": "what the current Skill missed"}
    ],
    "edits": [
      {"op": "append", "content": "concise Markdown instruction to append to the Skill"}
    ]
  }
}
"""


SUCCESS_MINIBATCH_PROMPT = """You are optimizing the hicode:review Skill using successful trajectories.

Identify reusable patterns that made the successful reviews safe and evidence-based. Keep suggestions concise, preserve Chinese Markdown style, and avoid adding approval-like language or production-action instructions.

Return only JSON in this format:
{
  "patch": {
    "reasoning": "brief reusable success pattern",
    "edits": [
      {"op": "append", "content": "concise Markdown instruction to append to the Skill"}
    ]
  }
}
"""


def _repo_root_from_file() -> Path:
    return Path(__file__).resolve().parents[4]


def _safe_id(value: Any) -> str:
    safe = re.sub(r"[^A-Za-z0-9_.-]+", "_", str(value or "")).strip("_")
    return safe[:100] or "item"


def _json_dump(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def _write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def _response_text(value: Any) -> str:
    if isinstance(value, str):
        return value
    if isinstance(value, dict):
        content = value.get("content")
        if isinstance(content, str):
            return content
    content = getattr(value, "content", None)
    if isinstance(content, str):
        return content
    return "" if value is None else str(value)


def _task_type(item: dict) -> str:
    for tag in item.get("tags") or []:
        if str(tag).strip() and str(tag).strip() != "review":
            return str(tag).strip()
    return "hicode_review"


def _task_description(item: dict) -> str:
    tags = ", ".join(str(tag) for tag in item.get("tags") or [])
    return f"{item.get('id', 'unknown')} {tags}".strip()


def _reference_text(item: dict) -> str:
    expected = item.get("expected") or {}
    lines = ["Hidden evaluator criteria for hicode:review:"]
    for finding in expected.get("must_find") or []:
        if not isinstance(finding, dict):
            continue
        keywords = ", ".join(str(k) for k in finding.get("evidence_keywords") or [])
        lines.append(
            "- must_find "
            f"{finding.get('id')}: risk={finding.get('risk')} "
            f"keywords=[{keywords}] meaning={finding.get('meaning', '')}"
        )
    if expected.get("must_not_claim"):
        lines.append("must_not_claim: " + ", ".join(expected["must_not_claim"]))
    if expected.get("min_risk"):
        lines.append(f"min_risk: {expected['min_risk']}")
    if expected.get("required_conclusion"):
        lines.append("required_conclusion: " + ", ".join(expected["required_conclusion"]))
    if expected.get("safety_redlines"):
        lines.append("safety_redlines: " + ", ".join(expected["safety_redlines"]))
    return "\n".join(lines)


def _fail_reason(eval_result: dict) -> str:
    if eval_result.get("hard_pass"):
        return ""
    notes = eval_result.get("notes") or []
    if notes:
        return "; ".join(str(note) for note in notes)
    missed = eval_result.get("missed_findings") or []
    if missed:
        return "missed findings: " + ", ".join(str(item) for item in missed)
    return "hard_pass=false"


class HicodeReviewAdapter(EnvAdapter):
    """SkillOpt adapter that trains/evaluates hicode:review on golden items."""

    def __init__(
        self,
        split_dir: str = "",
        data_path: str = "",
        split_mode: str = "split_dir",
        split_ratio: str = "2:1:7",
        split_seed: int = 42,
        split_output_dir: str = "",
        max_turns: int = 1,
        exec_timeout: int = 180,
        workers: int = 1,
        analyst_workers: int = 1,
        failure_only: bool = True,
        minibatch_size: int = 3,
        edit_budget: int = 2,
        seed: int = 42,
        limit: int = 0,
        max_completion_tokens: int = 4096,
        repo_root: str = "",
        evaluator_script: str = "",
    ) -> None:
        self.max_turns = int(max_turns)
        self.exec_timeout = int(exec_timeout)
        self.workers = max(1, int(workers))
        self.max_completion_tokens = int(max_completion_tokens)
        self.analyst_workers = max(1, int(analyst_workers))
        self.failure_only = bool(failure_only)
        self.minibatch_size = int(minibatch_size)
        self.edit_budget = int(edit_budget)
        self.repo_root = Path(repo_root).resolve() if repo_root else _repo_root_from_file()
        self.evaluator_script = evaluator_script
        self.dataloader = HicodeReviewDataLoader(
            split_dir=split_dir,
            data_path=data_path,
            split_mode=split_mode,
            split_ratio=split_ratio,
            split_seed=split_seed,
            split_output_dir=split_output_dir,
            seed=seed,
            limit=limit,
        )

    def setup(self, cfg: dict) -> None:
        super().setup(cfg)
        if cfg.get("repo_root") and not self.repo_root:
            self.repo_root = Path(str(cfg["repo_root"])).resolve()
        self.dataloader.setup(cfg)

    def get_dataloader(self):
        return self.dataloader

    def build_reference_text(self, item: dict) -> str:
        return _reference_text(item)

    def build_env_from_batch(self, batch: BatchSpec, **kwargs):
        return list(batch.payload or [])

    def build_train_env(self, batch_size: int, seed: int, **kwargs):
        batch = self.dataloader.build_train_batch(batch_size=batch_size, seed=seed, **kwargs)
        return self.build_env_from_batch(batch, **kwargs)

    def build_eval_env(self, env_num: int, split: str, seed: int, **kwargs):
        batch = self.dataloader.build_eval_batch(env_num=env_num, split=split, seed=seed, **kwargs)
        return self.build_env_from_batch(batch, **kwargs)

    def _rollout_one(self, item: dict, skill_content: str, prediction_dir: Path) -> dict:
        item_id = _safe_id(item.get("id"))
        item_dir = prediction_dir / item_id
        item_dir.mkdir(parents=True, exist_ok=True)

        messages = build_messages(skill_content, item)
        _json_dump(item_dir / "item.json", item)
        _write_text(item_dir / "target_system_prompt.txt", messages[0]["content"])
        _write_text(item_dir / "target_user_prompt.txt", messages[1]["content"])

        try:
            raw_response, usage = chat_target_messages(
                messages,
                max_completion_tokens=self.max_completion_tokens,
                retries=3,
                stage="hicode_review_target",
                timeout=self.exec_timeout,
            )
            response = _response_text(raw_response)
            _write_text(item_dir / "response.md", response)
            _json_dump(item_dir / "usage.json", usage or {})

            eval_result = evaluate_with_node(
                repo_root=self.repo_root,
                item_path=item_dir / "item.json",
                output_path=item_dir / "response.md",
            )
            _json_dump(item_dir / "eval_result.json", eval_result)

            conversation = [
                messages[0],
                messages[1],
                {"role": "assistant", "content": response},
                {"role": "system", "content": "Evaluation: " + json.dumps(eval_result, ensure_ascii=False)},
            ]
            _json_dump(item_dir / "conversation.json", conversation)

            hard = 1 if eval_result.get("hard_pass") else 0
            soft = float(eval_result.get("score", 0.0) or 0.0)
            return {
                "id": item_id,
                "original_id": item.get("id"),
                "hard": hard,
                "soft": soft,
                "n_turns": 1,
                "task_type": _task_type(item),
                "task_description": _task_description(item),
                "fail_reason": _fail_reason(eval_result),
                "reference_text": _reference_text(item),
                "target_system_prompt": messages[0]["content"],
                "target_user_prompt": messages[1]["content"],
                "response_path": str(item_dir / "response.md"),
                "eval_result": eval_result,
                "max_risk_detected": eval_result.get("max_risk_detected"),
                "matched_findings": eval_result.get("matched_findings", []),
                "missed_findings": eval_result.get("missed_findings", []),
                "forbidden_claims_found": eval_result.get("forbidden_claims_found", []),
                "required_conclusion_found": eval_result.get("required_conclusion_found"),
            }
        except (ReviewScoringError, Exception) as error:  # noqa: BLE001
            error_text = f"{type(error).__name__}: {error}"
            _json_dump(
                item_dir / "error.json",
                {"item_id": item.get("id"), "error": error_text, "traceback": traceback.format_exc()},
            )
            _json_dump(
                item_dir / "conversation.json",
                [
                    messages[0],
                    messages[1],
                    {"role": "system", "content": "Rollout failed: " + error_text},
                ],
            )
            return {
                "id": item_id,
                "original_id": item.get("id"),
                "hard": 0,
                "soft": 0.0,
                "n_turns": 1,
                "task_type": _task_type(item),
                "task_description": _task_description(item),
                "fail_reason": error_text,
                "reference_text": _reference_text(item),
                "target_system_prompt": messages[0]["content"],
                "target_user_prompt": messages[1]["content"],
            }

    def rollout(
        self,
        env_manager,
        skill_content: str,
        out_dir: str,
        **kwargs,
    ) -> list[dict]:
        items: list[dict] = list(env_manager or [])
        prediction_dir = Path(out_dir) / "predictions"
        prediction_dir.mkdir(parents=True, exist_ok=True)

        if self.workers <= 1 or len(items) <= 1:
            return [self._rollout_one(item, skill_content, prediction_dir) for item in items]

        results: list[dict | None] = [None] * len(items)
        with ThreadPoolExecutor(max_workers=self.workers) as executor:
            futures = {
                executor.submit(self._rollout_one, item, skill_content, prediction_dir): index
                for index, item in enumerate(items)
            }
            for future in as_completed(futures):
                results[futures[future]] = future.result()
        return [result for result in results if result is not None]

    def reflect(
        self,
        results: list[dict],
        skill_content: str,
        out_dir: str,
        **kwargs,
    ) -> list[dict | None]:
        prediction_dir = kwargs.get("prediction_dir", os.path.join(out_dir, "predictions"))
        patches_dir = kwargs.get("patches_dir", os.path.join(out_dir, "patches"))
        return run_minibatch_reflect(
            results=results,
            skill_content=skill_content,
            prediction_dir=prediction_dir,
            patches_dir=patches_dir,
            workers=self.analyst_workers,
            failure_only=self.failure_only,
            minibatch_size=self.minibatch_size,
            edit_budget=self.edit_budget,
            random_seed=kwargs.get("random_seed"),
            error_system=self.get_error_minibatch_prompt(),
            success_system=self.get_success_minibatch_prompt(),
            step_buffer_context=kwargs.get("step_buffer_context", ""),
            meta_skill_context=kwargs.get("meta_skill_context", ""),
            update_mode=getattr(self, "_cfg", {}).get("skill_update_mode", "patch"),
        )

    def get_error_minibatch_prompt(self) -> str | None:
        return ERROR_MINIBATCH_PROMPT

    def get_success_minibatch_prompt(self) -> str | None:
        return SUCCESS_MINIBATCH_PROMPT

    def get_task_types(self) -> list[str]:
        tags: list[str] = []
        for split_name in ("train", "val", "test"):
            for item in self.dataloader.get_split_items(split_name):
                task_type = _task_type(item)
                if task_type not in tags:
                    tags.append(task_type)
        return tags or ["hicode_review"]
