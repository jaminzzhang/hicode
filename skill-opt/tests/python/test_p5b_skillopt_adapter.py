import json
import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[3]
PYTHON_SRC = ROOT / "skill-opt" / "scripts" / "python"
SCRIPTS_DIR = ROOT / "skill-opt" / "scripts"
sys.path.insert(0, str(PYTHON_SRC))
sys.path.insert(0, str(SCRIPTS_DIR))


def write_split(split_root):
    item = {
        "id": "review-train-001",
        "split": "train",
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
    split_root = Path(split_root)
    for split in ("train", "val", "test"):
        split_dir = split_root / split
        split_dir.mkdir(parents=True, exist_ok=True)
        current = dict(item)
        current["id"] = f"review-{split}-001"
        current["split"] = split
        (split_dir / "items.json").write_text(
            json.dumps([current], ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )


class P5BSkillOptAdapterTest(unittest.TestCase):
    def test_rollout_scores_with_existing_node_evaluator(self):
        from hicode_review_skillopt.adapter import HicodeReviewAdapter

        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            split_root = tmp_path / "split"
            out_root = tmp_path / "out"
            write_split(split_root)

            adapter = HicodeReviewAdapter(
                split_dir=str(split_root),
                split_mode="split_dir",
                repo_root=str(ROOT),
                workers=1,
            )
            adapter.setup({"split_dir": str(split_root), "split_mode": "split_dir", "train_size": 1})
            env = adapter.build_train_env(batch_size=1, seed=42)

            response = "\n".join(
                [
                    "建议结论：CONDITIONAL_RECOMMENDATION",
                    "最高风险等级：P1",
                    "依据：diff 中金额、状态、幂等均存在风险。",
                    "问题：amount-state-idempotency-gap。",
                    "需求轴：需补充边界。规范轴：需幂等保护。证据轴：测试不足。",
                ]
            )
            with patch("hicode_review_skillopt.adapter.chat_target_messages", return_value=(response, {})):
                results = adapter.rollout(env, "# review skill", str(out_root / "rollout"))

            self.assertEqual(len(results), 1)
            self.assertEqual(results[0]["hard"], 1)
            self.assertGreaterEqual(results[0]["soft"], 0.9)
            self.assertTrue((out_root / "rollout" / "predictions" / "review-train-001" / "conversation.json").exists())
            self.assertTrue((out_root / "rollout" / "predictions" / "review-train-001" / "eval_result.json").exists())

    def test_train_wrapper_dry_run_writes_split_and_command(self):
        spec = importlib.util.spec_from_file_location(
            "run_review_train",
            SCRIPTS_DIR / "run-review-train.py",
        )
        run_review_train = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(run_review_train)

        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            dataset = tmp_path / "items.jsonl"
            skill = tmp_path / "SKILL.md"
            outputs = tmp_path / "outputs"
            rows = []
            for split in ("train", "val", "test"):
                rows.append(
                    {
                        "id": f"review-{split}-001",
                        "split": split,
                        "tags": ["review", "amount"],
                        "prompt": "请审查。",
                        "skill_under_test": "hicode:review",
                        "review_materials": {"diff": "+ amount = amount.add(delta)"},
                        "expected": {
                            "must_find": [],
                            "must_not_claim": [],
                            "min_risk": "NONE",
                            "required_conclusion": ["NO_BLOCKING_FINDINGS"],
                            "safety_redlines": [],
                        },
                    }
                )
            dataset.write_text(
                "\n".join(json.dumps(row, ensure_ascii=False) for row in rows),
                encoding="utf-8",
            )
            skill.write_text("# review", encoding="utf-8")

            code = run_review_train.main(
                [
                    "--run-id",
                    "p5b-dry",
                    "--dataset",
                    str(dataset),
                    "--skill",
                    str(skill),
                    "--outputs-root",
                    str(outputs),
                    "--dry-run",
                ]
            )

            self.assertEqual(code, 0)
            run_root = outputs / "p5b-dry"
            self.assertTrue((run_root / "split" / "train" / "items.json").exists())
            dry_run = json.loads((run_root / "train-dry-run.json").read_text(encoding="utf-8"))
            self.assertIn("--config", dry_run["skillopt_args"])
            self.assertIn("hicode_review", dry_run["skillopt_args"])

    def test_skillopt_eval_wrapper_dry_run_writes_split_and_command(self):
        spec = importlib.util.spec_from_file_location(
            "run_review_skillopt_eval",
            SCRIPTS_DIR / "run-review-skillopt-eval.py",
        )
        run_review_skillopt_eval = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(run_review_skillopt_eval)

        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            dataset = tmp_path / "items.jsonl"
            skill = tmp_path / "SKILL.md"
            outputs = tmp_path / "outputs"
            rows = []
            for split in ("train", "val", "test"):
                rows.append(
                    {
                        "id": f"review-{split}-001",
                        "split": split,
                        "tags": ["review", "amount"],
                        "prompt": "请审查。",
                        "skill_under_test": "hicode:review",
                        "review_materials": {"diff": "+ amount = amount.add(delta)"},
                        "expected": {
                            "must_find": [],
                            "must_not_claim": [],
                            "min_risk": "NONE",
                            "required_conclusion": ["NO_BLOCKING_FINDINGS"],
                            "safety_redlines": [],
                        },
                    }
                )
            dataset.write_text(
                "\n".join(json.dumps(row, ensure_ascii=False) for row in rows),
                encoding="utf-8",
            )
            skill.write_text("# review", encoding="utf-8")

            code = run_review_skillopt_eval.main(
                [
                    "--run-id",
                    "p5b-eval-dry",
                    "--dataset",
                    str(dataset),
                    "--skill",
                    str(skill),
                    "--outputs-root",
                    str(outputs),
                    "--dry-run",
                    "--target-model",
                    "smoke-model",
                ]
            )

            self.assertEqual(code, 0)
            run_root = outputs / "p5b-eval-dry"
            self.assertTrue((run_root / "split" / "test" / "items.json").exists())
            dry_run = json.loads((run_root / "eval-dry-run.json").read_text(encoding="utf-8"))
            self.assertIn("--split", dry_run["skillopt_args"])
            self.assertIn("hicode_review", dry_run["skillopt_args"])

    def test_prompt_fallbacks_patch_skillopt_aggregate_loader(self):
        from hicode_review_skillopt.prompt_fallbacks import install_skillopt_prompt_fallbacks
        import skillopt.gradient.aggregate as aggregate

        install_skillopt_prompt_fallbacks()

        prompt = aggregate.load_prompt("merge_failure")
        self.assertIn("hicode:review", prompt)
        self.assertIn("edits", prompt)


if __name__ == "__main__":
    unittest.main()
