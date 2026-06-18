from dataclasses import dataclass
import json
from pathlib import Path
import shutil
from urllib.parse import urlparse
from datetime import datetime, timezone

from .dataset import DatasetError, load_jsonl, write_split
from .openai_chat import ChatConfigurationError, OpenAIChatClient
from .prompt import build_messages
from .summary import generate_summary


class ConfigurationError(ValueError):
    pass


@dataclass
class RunConfig:
    run_id: str
    dataset_path: Path
    skill_path: Path
    outputs_root: Path
    dry_run: bool = True
    docs_runs_dir: Path | None = None
    repo_root: Path | None = None
    no_summary: bool = False
    fail_fast: bool = False
    target_model: str | None = None
    azure_openai_endpoint: str | None = None
    azure_openai_api_version: str | None = None
    base_url: str | None = None
    api_key_env: str | None = None
    temperature: float = 0


@dataclass
class RunResult:
    exit_code: int
    run_root: Path
    item_count: int
    failure_count: int = 0
    summary_path: Path | None = None


class ReviewEvalRunner:
    def __init__(self, config, chat_client=None):
        self.config = config
        self.chat_client = chat_client

    def run(self):
        config = self.config
        self._validate_config_shape()

        items = load_jsonl(config.dataset_path)
        skill_text = Path(config.skill_path).read_text(encoding="utf-8")

        if not config.dry_run and self.chat_client is None:
            self.chat_client = self._build_chat_client()

        run_root = Path(config.outputs_root) / config.run_id
        self._prepare_run_root(run_root)
        split_root = run_root / "split"
        write_split(items, split_root)
        self._write_run_metadata(run_root, items)

        if config.dry_run:
            dry_run_items = [
                {
                    "id": item["id"],
                    "split": item["split"],
                    "messages": build_messages(skill_text, item),
                }
                for item in items
            ]
            self._write_json(run_root / "dry-run.json", {"run_id": config.run_id, "items": dry_run_items})
            return RunResult(exit_code=0, run_root=run_root, item_count=len(items))

        failure_count = self._run_eval_items(run_root, skill_text, items)
        summary_path = None
        if not config.no_summary:
            docs_runs_dir = self._docs_runs_dir()
            summary = generate_summary(
                repo_root=self._repo_root(),
                run_id=config.run_id,
                dataset_path=config.dataset_path,
                outputs_root=config.outputs_root,
                docs_runs_dir=docs_runs_dir,
            )
            summary_path = Path(summary["summary_path"])

        return RunResult(
            exit_code=1 if failure_count else 0,
            run_root=run_root,
            item_count=len(items),
            failure_count=failure_count,
            summary_path=summary_path,
        )

    def _validate_config_shape(self):
        config = self.config
        if not config.run_id or "/" in config.run_id or "\\" in config.run_id:
            raise ConfigurationError("run_id must be a non-empty path segment")
        if not Path(config.dataset_path).is_file():
            raise ConfigurationError(f"dataset file not found: {config.dataset_path}")
        if not Path(config.skill_path).is_file():
            raise ConfigurationError(f"skill file not found: {config.skill_path}")
        if not config.dry_run and self.chat_client is None:
            if not config.target_model:
                raise ConfigurationError("target model is required for eval run")
            if not config.azure_openai_endpoint and not config.base_url:
                raise ConfigurationError("azure endpoint or OpenAI-compatible base URL is required for eval run")

    def _build_chat_client(self):
        try:
            return OpenAIChatClient(
                target_model=self.config.target_model,
                api_key_env=self.config.api_key_env,
                azure_openai_endpoint=self.config.azure_openai_endpoint,
                azure_openai_api_version=self.config.azure_openai_api_version,
                base_url=self.config.base_url,
                temperature=self.config.temperature,
            )
        except ChatConfigurationError as error:
            raise ConfigurationError(str(error)) from error

    def _run_eval_items(self, run_root, skill_text, items):
        output_dir = run_root / "review-outputs"
        failure_dir = run_root / "failures"
        failure_count = 0

        for item in items:
            messages = build_messages(skill_text, item)
            try:
                output = self.chat_client.complete(item=item, messages=messages)
            except Exception as error:
                failure_count += 1
                self._write_json(
                    failure_dir / f"{item['id']}.json",
                    {
                        "item_id": item["id"],
                        "error_type": error.__class__.__name__,
                        "error": str(error),
                    },
                )
                if self.config.fail_fast:
                    break
                continue

            output_dir.mkdir(parents=True, exist_ok=True)
            (output_dir / f"{item['id']}.md").write_text(str(output), encoding="utf-8")

        return failure_count

    def _prepare_run_root(self, run_root):
        run_root = Path(run_root)
        for name in ("split", "review-outputs", "failures", "dry-run.json", "run.json"):
            path = run_root / name
            if path.is_symlink() or path.is_file():
                path.unlink()
            elif path.is_dir():
                shutil.rmtree(path)
        run_root.mkdir(parents=True, exist_ok=True)

    def _write_run_metadata(self, run_root, items):
        config = self.config
        metadata = {
            "run_id": config.run_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "dry_run": config.dry_run,
            "dataset_path": str(config.dataset_path),
            "skill_path": str(config.skill_path),
            "item_count": len(items),
            "splits": {split: len([item for item in items if item["split"] == split]) for split in ("train", "val", "test")},
            "target": {
                "model": config.target_model,
                "azure_endpoint_host": self._host(config.azure_openai_endpoint),
                "azure_api_version": config.azure_openai_api_version,
                "base_url_host": self._host(config.base_url),
                "credential_configured": self.chat_client is not None,
            },
        }
        self._write_json(Path(run_root) / "run.json", metadata)

    def _write_json(self, path, payload):
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    def _docs_runs_dir(self):
        if self.config.docs_runs_dir:
            return Path(self.config.docs_runs_dir)
        return self._repo_root() / "skill-opt" / "docs" / "runs"

    def _repo_root(self):
        if self.config.repo_root:
            return Path(self.config.repo_root)
        return Path(__file__).resolve().parents[4]

    def _host(self, value):
        if not value:
            return None
        parsed = urlparse(value)
        return parsed.netloc or parsed.path or None


__all__ = [
    "ConfigurationError",
    "DatasetError",
    "RunConfig",
    "RunResult",
    "ReviewEvalRunner",
]
