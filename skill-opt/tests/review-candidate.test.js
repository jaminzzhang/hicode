const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  analyzeCandidate,
  renderCandidateSummary,
  writeCandidateSummary,
} = require("../scripts/review-candidate.js");

const baseline = [
  "# hicode review",
  "建议结论：NO_BLOCKING_FINDINGS、CONDITIONAL_RECOMMENDATION、BLOCKED 或 NEEDS_CONFIRMATION",
  "必须保留安全红线、生产禁止、密钥、未脱敏客户信息、自动合并、自动发布。",
  "必须执行需求轴、规范轴、证据轴三轴审查。",
  "必须检查金额、状态、幂等、权限、审计、隐私、监管和回滚。",
].join("\n");

function makeTempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "hicode-skillopt-candidate-"));
}

test("analyzeCandidate reports missing candidate without modifying baseline", () => {
  const root = makeTempRoot();
  const baselinePath = path.join(root, "review.md");
  const candidatePath = path.join(root, "missing-best_skill.md");
  fs.writeFileSync(baselinePath, baseline);

  const report = analyzeCandidate({
    runId: "candidate-missing",
    baselinePath,
    candidatePath,
  });

  assert.equal(report.status, "missing_candidate");
  assert.equal(report.recommendation, "WAIT_FOR_CANDIDATE");
  assert.equal(fs.readFileSync(baselinePath, "utf8"), baseline);
});

test("analyzeCandidate flags forbidden approval claims", () => {
  const root = makeTempRoot();
  const baselinePath = path.join(root, "review.md");
  const candidatePath = path.join(root, "best_skill.md");
  fs.writeFileSync(baselinePath, baseline);
  fs.writeFileSync(
    candidatePath,
    `${baseline}\n候选新增：审查后可以输出准许合并和审批通过。`
  );

  const report = analyzeCandidate({
    runId: "candidate-forbidden",
    baselinePath,
    candidatePath,
  });

  assert.equal(report.status, "candidate_flagged");
  assert.equal(report.recommendation, "REJECT_RECOMMENDED");
  assert.deepEqual(report.risks.forbidden_claims, ["准许合并", "审批通过"]);
});

test("analyzeCandidate ignores forbidden words in prohibition context", () => {
  const root = makeTempRoot();
  const baselinePath = path.join(root, "review.md");
  const candidatePath = path.join(root, "best_skill.md");
  fs.writeFileSync(baselinePath, baseline);
  fs.writeFileSync(
    candidatePath,
    `${baseline}\n新增要求：不得输出准许合并、审批通过或可以上线等最终审批语言。`
  );

  const report = analyzeCandidate({
    runId: "candidate-contextual-forbidden",
    baselinePath,
    candidatePath,
  });

  assert.equal(report.status, "candidate_present");
  assert.equal(report.recommendation, "HUMAN_REVIEW_REQUIRED");
  assert.deepEqual(report.risks.forbidden_claims, []);
});

test("analyzeCandidate does not flag unchanged baseline prohibition wording", () => {
  const root = makeTempRoot();
  const baselinePath = path.join(root, "review.md");
  const candidatePath = path.join(root, "best_skill.md");
  const withProhibition = `${baseline}\n禁止输出准许合并、审批通过、可以上线。`;
  fs.writeFileSync(baselinePath, withProhibition);
  fs.writeFileSync(candidatePath, withProhibition);

  const report = analyzeCandidate({
    runId: "candidate-unchanged",
    baselinePath,
    candidatePath,
  });

  assert.equal(report.status, "candidate_present");
  assert.equal(report.recommendation, "HUMAN_REVIEW_REQUIRED");
  assert.deepEqual(report.risks.forbidden_claims, []);
});

test("analyzeCandidate flags changed approval wording even when baseline prohibited it", () => {
  const root = makeTempRoot();
  const baselinePath = path.join(root, "review.md");
  const candidatePath = path.join(root, "best_skill.md");
  fs.writeFileSync(baselinePath, `${baseline}\n禁止输出准许合并。`);
  fs.writeFileSync(candidatePath, `${baseline}\n候选新增：审查后可以输出准许合并。`);

  const report = analyzeCandidate({
    runId: "candidate-changed-approval",
    baselinePath,
    candidatePath,
  });

  assert.equal(report.status, "candidate_flagged");
  assert.equal(report.recommendation, "REJECT_RECOMMENDED");
  assert.deepEqual(report.risks.forbidden_claims, ["准许合并"]);
});

test("analyzeCandidate marks safe-looking candidate as needs human review", () => {
  const root = makeTempRoot();
  const baselinePath = path.join(root, "review.md");
  const candidatePath = path.join(root, "best_skill.md");
  fs.writeFileSync(baselinePath, baseline);
  fs.writeFileSync(
    candidatePath,
    `${baseline}\n新增要求：问题必须写明解除条件和建议确认人。`
  );

  const report = analyzeCandidate({
    runId: "candidate-review",
    baselinePath,
    candidatePath,
  });

  assert.equal(report.status, "candidate_present");
  assert.equal(report.recommendation, "HUMAN_REVIEW_REQUIRED");
  assert.equal(report.risks.forbidden_claims.length, 0);
  assert.ok(report.diff.added_lines.length > 0);
});

test("renderCandidateSummary omits candidate body and records risks", () => {
  const report = {
    run_id: "candidate-forbidden",
    generated_at: "2026-06-17T00:00:00.000Z",
    baseline_path: "skills/review/SKILL.md",
    candidate_path: "skill-opt/outputs/candidate-forbidden/best_skill.md",
    status: "candidate_flagged",
    recommendation: "REJECT_RECOMMENDED",
    diff: {
      added_line_count: 1,
      removed_line_count: 0,
      added_lines: ["候选新增：审查后可以输出准许合并。"],
      removed_lines: [],
    },
    risks: {
      forbidden_claims: ["准许合并"],
      removed_required_terms: [],
      forbidden_paths: [],
    },
  };
  const markdown = renderCandidateSummary(report);
  assert.match(markdown, /REJECT_RECOMMENDED/);
  assert.match(markdown, /准许合并/);
  assert.doesNotMatch(markdown, /候选新增：审查后可以输出/);
});

test("writeCandidateSummary creates a candidate summary file", () => {
  const root = makeTempRoot();
  const report = {
    run_id: "candidate-review",
    generated_at: "2026-06-17T00:00:00.000Z",
    baseline_path: "baseline",
    candidate_path: "candidate",
    status: "candidate_present",
    recommendation: "HUMAN_REVIEW_REQUIRED",
    diff: {
      added_line_count: 0,
      removed_line_count: 0,
      added_lines: [],
      removed_lines: [],
    },
    risks: {
      forbidden_claims: [],
      removed_required_terms: [],
      forbidden_paths: [],
    },
  };

  const target = writeCandidateSummary(report, path.join(root, "runs"));
  assert.equal(path.basename(target), "candidate-review-candidate.md");
  assert.match(fs.readFileSync(target, "utf8"), /Candidate candidate-review/);
});
