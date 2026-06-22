from __future__ import annotations

import json
from pathlib import Path


SPLITS = ("train", "val", "test")


class DatasetError(ValueError):
    pass


def load_jsonl(path: str | Path) -> list[dict]:
    path = Path(path)
    items: list[dict] = []
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError as error:
            raise DatasetError(f"Invalid JSONL at line {line_number}: {error}") from error
        items.append(item)
    validate_items(items)
    return items


def validate_items(items: list[dict]) -> None:
    if not items:
        raise DatasetError("dataset must contain at least one item")

    seen: set[str] = set()
    for index, item in enumerate(items):
        item_id = item.get("id")
        if not isinstance(item_id, str) or not item_id.strip():
            raise DatasetError(f"item {index + 1} missing id")
        if item_id in seen:
            raise DatasetError(f"duplicate item id: {item_id}")
        seen.add(item_id)

        split = item.get("split")
        if split not in SPLITS:
            raise DatasetError(f"{item_id} invalid split: {split}")
        if item.get("skill_under_test") != "hicode:review":
            raise DatasetError(f"{item_id} skill_under_test must be hicode:review")
        if not isinstance(item.get("prompt"), str) or not item["prompt"].strip():
            raise DatasetError(f"{item_id} missing prompt")

        materials = item.get("review_materials")
        if not isinstance(materials, dict):
            raise DatasetError(f"{item_id} missing review_materials")
        diff = materials.get("diff")
        if not isinstance(diff, str) or not diff.strip():
            raise DatasetError(f"{item_id} missing review_materials.diff")


def write_split(items: list[dict], split_root: str | Path) -> None:
    split_root = Path(split_root)
    for split in SPLITS:
        split_dir = split_root / split
        split_dir.mkdir(parents=True, exist_ok=True)
        split_items = [item for item in items if item.get("split") == split]
        (split_dir / "items.json").write_text(
            json.dumps(split_items, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
