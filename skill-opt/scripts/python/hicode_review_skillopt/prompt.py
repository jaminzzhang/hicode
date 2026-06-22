from __future__ import annotations


def build_messages(skill_text: str, item: dict) -> list[dict[str, str]]:
    materials = item.get("review_materials", {})
    user_content = "\n\n".join(
        [
            item.get("prompt", "").strip(),
            "以下是人工构造的脱敏评审材料。只能基于这些材料输出 hicode:review 报告；不得编造外部仓库、生产环境或未提供证据。",
            f"需求证据：\n{materials.get('requirement', '')}",
            f"Scope 证据：\n{materials.get('scope_summary', '')}",
            f"TDD/验证证据：\n{materials.get('tdd_evidence', '')}",
            f"脱敏 diff：\n```diff\n{materials.get('diff', '')}\n```",
        ]
    )
    system_content = "\n\n".join(
        [
            "你正在执行下面的 hicode Skill。输出必须遵守 Skill 文档中的安全边界、建议性结论和 Markdown 结构要求。",
            skill_text,
        ]
    )
    return [
        {"role": "system", "content": system_content},
        {"role": "user", "content": user_content},
    ]
