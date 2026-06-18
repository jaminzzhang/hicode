const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  evaluateRun,
  renderRunSummary,
  writeRunSummary,
} = require("../scripts/review-run.js");

function sample(id, split = "test") {
  return {
    id,
    split,
    tags: ["review", "amount", "state", "idempotency"],
    expected: {
      must_find: [
        {
          id: "amount-state-idempotency-gap",
          risk: "P1",
          evidence_keywords: ["金额", "状态", "幂等"],
          meaning: "应识别金额状态幂等风险",
        },
      ],
      must_not_claim: ["准许合并", "审批通过", "可以上线"],
      min_risk: "P1",
      required_conclusion: ["CONDITIONAL_RECOMMENDATION", "BLOCKED"],
      safety_redlines: [],
    },
  };
}

function makeTempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "hicode-skillopt-run-"));
}

test("evaluateRun scores existing outputs and marks missing outputs", () => {
  const root = makeTempRoot();
  const runRoot = path.join(root, "outputs", "baseline-001");
  const outputDir = path.join(runRoot, "review-outputs");
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, "review-test-001.md"),
    [
      "建议结论：CONDITIONAL_RECOMMENDATION",
      "最高风险等级：P1",
      "依据：diff 中金额、状态、幂等风险需要补测试。",
      "需求轴：范围明确。规范轴：需要补充事务保护。证据轴：测试证据不足。",
    ].join("\n")
  );

  const report = evaluateRun({
    runId: "baseline-001",
    datasetItems: [sample("review-test-001"), sample("review-test-002")],
    runRoot,
  });

  assert.equal(report.summary.total_items, 2);
  assert.equal(report.summary.evaluated_count, 1);
  assert.equal(report.summary.missing_output_count, 1);
  assert.equal(report.items[0].status, "evaluated");
  assert.equal(report.items[0].result.hard_pass, true);
  assert.equal(report.items[1].status, "missing_output");
});

test("renderRunSummary writes aggregate scores without raw Review output", () => {
  const report = {
    run_id: "baseline-001",
    generated_at: "2026-06-17T00:00:00.000Z",
    dataset_path: "skill-opt/data/review-golden/items.jsonl",
    output_dir: "skill-opt/outputs/baseline-001/review-outputs",
    summary: {
      total_items: 2,
      evaluated_count: 1,
      missing_output_count: 1,
      hard_pass_count: 1,
      hard_fail_count: 0,
      average_score: 1,
      by_split: {
        test: {
          total_items: 2,
          evaluated_count: 1,
          missing_output_count: 1,
          hard_pass_count: 1,
          hard_fail_count: 0,
          average_score: 1,
        },
      },
    },
    items: [
      {
        id: "review-test-001",
        split: "test",
        status: "evaluated",
        result: {
          hard_pass: true,
          score: 1,
          max_risk_detected: "P1",
          matched_findings: ["amount-state-idempotency-gap"],
          missed_findings: [],
          forbidden_claims_found: [],
          notes: [],
        },
      },
      {
        id: "review-test-002",
        split: "test",
        status: "missing_output",
      },
    ],
  };

  const markdown = renderRunSummary(report);
  assert.match(markdown, /# hicode SkillOpt Run baseline-001/);
  assert.match(markdown, /missing_output/);
  assert.match(markdown, /average_score/);
  assert.doesNotMatch(markdown, /建议结论：/);
});

test("writeRunSummary creates a run summary under docs runs directory", () => {
  const root = makeTempRoot();
  const report = {
    run_id: "baseline-001",
    generated_at: "2026-06-17T00:00:00.000Z",
    dataset_path: "dataset",
    output_dir: "outputs",
    summary: {
      total_items: 0,
      evaluated_count: 0,
      missing_output_count: 0,
      hard_pass_count: 0,
      hard_fail_count: 0,
      average_score: 0,
      by_split: {},
    },
    items: [],
  };

  const target = writeRunSummary(report, path.join(root, "docs", "runs"));
  assert.equal(path.basename(target), "baseline-001.md");
  assert.match(fs.readFileSync(target, "utf8"), /Run baseline-001/);
});
