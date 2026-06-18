import json
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
PYTHON_SRC = ROOT / "skill-opt" / "scripts" / "python"
sys.path.insert(0, str(PYTHON_SRC))


class FakeChatClient:
    def __init__(self, failures=None):
        self.calls = []
        self.failures = set(failures or [])

    def complete(self, *, item, messages):
        self.calls.append((item["id"], messages))
        if item["id"] in self.failures:
            raise RuntimeError("synthetic call failure")
        return "\n".join(
            [
                "建议结论：CONDITIONAL_RECOMMENDATION",
                "最高风险等级：P1",
                f"依据：{item['id']} 的 diff 包含金额、状态、幂等风险。",
                "需求轴：已审查。规范轴：已审查。证据轴：已审查。",
            ]
        )


def write_fixture_dataset(path):
    items = []
    for split in ("train", "val", "test"):
        items.append(
            {
                "id": f"review-{split}-001",
                "split": split,
                "tags": ["review", "amount", "state", "idempotency"],
                "prompt": "请使用 hicode:review 审查以下脱敏 diff 和证据。",
                "skill_under_test": "hicode:review",
                "review_materials": {
                    "requirement": "虚构需求：更新金额和状态。",
                    "scope_summary": "范围内只包含脱敏评审材料。",
                    "tdd_evidence": "缺少重复提交测试。",
                    "diff": "+ amount = amount.add(delta)\n+ status = \"DONE\"",
                },
                "expected": {
                    "must_find": [
                        {
                            "id": "amount-state-idempotency-gap",
                            "risk": "P1",
                            "evidence_keywords": ["金额", "状态", "幂等"],
                            "meaning": "应识别金额状态更新缺少幂等保护。",
                        }
                    ],
                    "must_not_claim": ["准许合并", "审批通过", "可以上线"],
                    "min_risk": "P1",
                    "required_conclusion": ["CONDITIONAL_RECOMMENDATION", "BLOCKED"],
                    "safety_redlines": [],
                },
            }
        )
    path.write_text("\n".join(json.dumps(item, ensure_ascii=False) for item in items), encoding="utf-8")


class P5ARunnerTest(unittest.TestCase):
    def test_dry_run_writes_split_metadata_and_complete_messages(self):
        from hicode_review.runner import RunConfig, ReviewEvalRunner

        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            dataset_path = tmp_path / "items.jsonl"
            skill_path = tmp_path / "SKILL.md"
            outputs_root = tmp_path / "outputs"
            write_fixture_dataset(dataset_path)
            skill_path.write_text("# hicode review\n\n必须检查金额、状态和幂等。", encoding="utf-8")

            config = RunConfig(
                run_id="dry-run-test",
                dataset_path=dataset_path,
                skill_path=skill_path,
                outputs_root=outputs_root,
                dry_run=True,
                target_model="eval-model",
                azure_openai_endpoint="https://example.openai.azure.com",
            )

            result = ReviewEvalRunner(config).run()

            self.assertEqual(result.exit_code, 0)
            run_root = outputs_root / "dry-run-test"
            self.assertTrue((run_root / "split" / "train" / "items.json").exists())
            self.assertTrue((run_root / "split" / "val" / "items.json").exists())
            self.assertTrue((run_root / "split" / "test" / "items.json").exists())
            self.assertFalse((run_root / "review-outputs").exists())

            dry_run = json.loads((run_root / "dry-run.json").read_text(encoding="utf-8"))
            first = dry_run["items"][0]
            self.assertEqual(first["id"], "review-train-001")
            self.assertEqual(first["messages"][0]["role"], "system")
            self.assertIn("# hicode review", first["messages"][0]["content"])
            self.assertEqual(first["messages"][1]["role"], "user")
            self.assertIn("amount = amount.add(delta)", first["messages"][1]["content"])

            run_meta = json.loads((run_root / "run.json").read_text(encoding="utf-8"))
            serialized = json.dumps(run_meta, ensure_ascii=False)
            self.assertIn("example.openai.azure.com", serialized)
            self.assertNotIn("api_key", serialized.lower())

    def test_eval_run_writes_outputs_with_fake_client(self):
        from hicode_review.runner import RunConfig, ReviewEvalRunner

        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            dataset_path = tmp_path / "items.jsonl"
            skill_path = tmp_path / "SKILL.md"
            outputs_root = tmp_path / "outputs"
            write_fixture_dataset(dataset_path)
            skill_path.write_text("# hicode review\n\n必须检查金额、状态和幂等。", encoding="utf-8")

            config = RunConfig(
                run_id="eval-test",
                dataset_path=dataset_path,
                skill_path=skill_path,
                outputs_root=outputs_root,
                dry_run=False,
                no_summary=True,
                target_model="eval-model",
            )

            client = FakeChatClient()
            result = ReviewEvalRunner(config, chat_client=client).run()

            self.assertEqual(result.exit_code, 0)
            self.assertEqual(len(client.calls), 3)
            output = outputs_root / "eval-test" / "review-outputs" / "review-train-001.md"
            self.assertIn("CONDITIONAL_RECOMMENDATION", output.read_text(encoding="utf-8"))

    def test_eval_run_records_item_failures_and_returns_nonzero(self):
        from hicode_review.runner import RunConfig, ReviewEvalRunner

        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            dataset_path = tmp_path / "items.jsonl"
            skill_path = tmp_path / "SKILL.md"
            outputs_root = tmp_path / "outputs"
            write_fixture_dataset(dataset_path)
            skill_path.write_text("# hicode review\n\n必须检查金额、状态和幂等。", encoding="utf-8")

            config = RunConfig(
                run_id="failure-test",
                dataset_path=dataset_path,
                skill_path=skill_path,
                outputs_root=outputs_root,
                dry_run=False,
                no_summary=True,
                target_model="eval-model",
            )

            result = ReviewEvalRunner(config, chat_client=FakeChatClient(failures={"review-val-001"})).run()

            self.assertEqual(result.exit_code, 1)
            run_root = outputs_root / "failure-test"
            self.assertTrue((run_root / "review-outputs" / "review-train-001.md").exists())
            failure = json.loads((run_root / "failures" / "review-val-001.json").read_text(encoding="utf-8"))
            self.assertEqual(failure["item_id"], "review-val-001")
            self.assertIn("synthetic call failure", failure["error"])

    def test_eval_rerun_cleans_generated_outputs_for_same_run_id(self):
        from hicode_review.runner import RunConfig, ReviewEvalRunner

        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            dataset_path = tmp_path / "items.jsonl"
            skill_path = tmp_path / "SKILL.md"
            outputs_root = tmp_path / "outputs"
            write_fixture_dataset(dataset_path)
            skill_path.write_text("# hicode review\n\n必须检查金额、状态和幂等。", encoding="utf-8")

            config = RunConfig(
                run_id="rerun-clean-test",
                dataset_path=dataset_path,
                skill_path=skill_path,
                outputs_root=outputs_root,
                dry_run=False,
                no_summary=True,
                target_model="eval-model",
            )

            first_result = ReviewEvalRunner(config, chat_client=FakeChatClient()).run()
            self.assertEqual(first_result.exit_code, 0)

            run_root = outputs_root / "rerun-clean-test"
            stale_output = run_root / "review-outputs" / "review-val-001.md"
            self.assertTrue(stale_output.exists())

            second_result = ReviewEvalRunner(
                config,
                chat_client=FakeChatClient(failures={"review-val-001"}),
            ).run()
            self.assertEqual(second_result.exit_code, 1)
            self.assertFalse(stale_output.exists())
            self.assertTrue((run_root / "failures" / "review-val-001.json").exists())

            third_result = ReviewEvalRunner(config, chat_client=FakeChatClient()).run()
            self.assertEqual(third_result.exit_code, 0)
            self.assertFalse((run_root / "failures").exists())
            self.assertTrue(stale_output.exists())

    def test_eval_run_requires_configuration_before_running_items(self):
        from hicode_review.runner import ConfigurationError, RunConfig, ReviewEvalRunner

        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            dataset_path = tmp_path / "items.jsonl"
            skill_path = tmp_path / "SKILL.md"
            outputs_root = tmp_path / "outputs"
            write_fixture_dataset(dataset_path)
            skill_path.write_text("# hicode review\n\n必须检查金额、状态和幂等。", encoding="utf-8")

            config = RunConfig(
                run_id="config-error-test",
                dataset_path=dataset_path,
                skill_path=skill_path,
                outputs_root=outputs_root,
                dry_run=False,
                target_model="eval-model",
            )

            with self.assertRaises(ConfigurationError):
                ReviewEvalRunner(config).run()

            self.assertFalse((outputs_root / "config-error-test" / "review-outputs").exists())


if __name__ == "__main__":
    unittest.main()
