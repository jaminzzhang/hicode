from __future__ import annotations


MERGE_FAILURE_PROMPT = """You merge failure-driven SkillOpt patches for hicode:review.

Preserve edits that reduce hard failures in financial/insurance code review tasks. Remove duplicates, keep edits concise, and do not add approval-like language. Return only JSON:
{
  "reasoning": "brief merge rationale",
  "edits": [
    {"op": "append", "content": "merged concise Markdown instruction"}
  ]
}
"""


MERGE_SUCCESS_PROMPT = """You merge success-driven SkillOpt patches for hicode:review.

Preserve concise reusable review guardrails, remove duplicates, and do not add approval-like language. Return only JSON:
{
  "reasoning": "brief merge rationale",
  "edits": [
    {"op": "append", "content": "merged concise Markdown instruction"}
  ]
}
"""


MERGE_FINAL_PROMPT = """You combine failure-driven and success-driven SkillOpt patches for hicode:review.

Failure-driven edits have priority. Keep only useful, non-duplicated, reviewable edits. Do not introduce final approval wording, production actions, credential handling, or paths outside hicode's current assets. Return only JSON:
{
  "reasoning": "brief final merge rationale",
  "edits": [
    {"op": "append", "content": "final concise Markdown instruction"}
  ]
}
"""


RANKING_PROMPT = """You rank SkillOpt patch edits for hicode:review.

Select edits that most reduce hard failures while preserving hicode safety boundaries. Return only JSON:
{
  "selected_indices": [0]
}
"""


PROMPT_FALLBACKS = {
    "merge_failure": MERGE_FAILURE_PROMPT,
    "merge_success": MERGE_SUCCESS_PROMPT,
    "merge_final": MERGE_FINAL_PROMPT,
    "merge_failure_rewrite": MERGE_FAILURE_PROMPT,
    "merge_success_rewrite": MERGE_SUCCESS_PROMPT,
    "merge_final_rewrite": MERGE_FINAL_PROMPT,
    "merge_failure_full_rewrite": MERGE_FAILURE_PROMPT,
    "merge_success_full_rewrite": MERGE_SUCCESS_PROMPT,
    "merge_final_full_rewrite": MERGE_FINAL_PROMPT,
    "ranking": RANKING_PROMPT,
    "ranking_rewrite": RANKING_PROMPT,
}


def install_skillopt_prompt_fallbacks() -> None:
    """Patch SkillOpt 0.1.0 prompt loading without editing site-packages."""

    import skillopt.prompts as prompts

    original_load_prompt = prompts.load_prompt

    def load_prompt_with_fallback(name: str, *args, **kwargs):
        try:
            return original_load_prompt(name, *args, **kwargs)
        except FileNotFoundError:
            if name in PROMPT_FALLBACKS:
                return PROMPT_FALLBACKS[name]
            raise

    prompts.load_prompt = load_prompt_with_fallback

    # These modules import load_prompt directly, so patch their bound names too.
    try:
        import skillopt.gradient.aggregate as aggregate

        aggregate.load_prompt = load_prompt_with_fallback
    except Exception:  # noqa: BLE001
        pass

    try:
        import skillopt.optimizer.clip as clip

        clip.load_prompt = load_prompt_with_fallback
    except Exception:  # noqa: BLE001
        pass
