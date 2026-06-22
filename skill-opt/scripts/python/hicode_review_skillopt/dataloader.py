from __future__ import annotations

from skillopt.datasets.base import SplitDataLoader


class HicodeReviewDataLoader(SplitDataLoader):
    """SplitDataLoader with optional train split truncation for tiny runs."""

    def setup(self, cfg: dict) -> None:
        super().setup(cfg)

        configured_train_size = int(cfg.get("train_size", 0) or 0)
        if configured_train_size <= 0:
            return

        train_items = list(self._splits.get("train", []))
        actual = len(train_items)
        if configured_train_size > actual:
            raise ValueError(
                "Configured train_size="
                f"{configured_train_size} exceeds loaded train split size={actual}."
            )
        if configured_train_size < actual:
            self._splits["train"] = train_items[:configured_train_size]
            print(
                "  [HicodeReviewDataLoader] "
                f"train split truncated {actual}->{configured_train_size}"
            )
