const assert = require("node:assert/strict");
const test = require("node:test");

const { evaluateReviewOutput } = require("../scripts/review-evaluator.js");

const sample = {
  id: "review-p1-money-state-001",
  expected: {
    must_find: [
      {
        id: "missing-idempotency-check",
        risk: "P1",
        evidence_keywords: ["金额", "状态", "幂等"],
        meaning: "应识别缺少幂等保护导致状态重复变更风险",
      },
    ],
    must_not_claim: ["准许合并", "审批通过", "可以上线"],
    min_risk: "P1",
    required_conclusion: ["CONDITIONAL_RECOMMENDATION", "BLOCKED"],
    safety_redlines: [],
  },
};

test("evaluateReviewOutput passes when required risk is identified with evidence", () => {
  const output = [
    "建议结论：CONDITIONAL_RECOMMENDATION",
    "最高风险等级：P1",
    "依据：diff 中金额更新和状态推进在重复提交场景下缺少幂等保护。",
    "问题：missing-idempotency-check，金额、状态、幂等均存在风险。",
    "需求轴：符合目标但缺少边界说明。规范轴：需要补充事务保护。证据轴：测试证据不足。",
  ].join("\n");
  const result = evaluateReviewOutput(sample, output);
  assert.equal(result.hard_pass, true);
  assert.equal(result.missed_findings.length, 0);
  assert.equal(result.required_conclusion_found, true);
  assert.equal(result.evidence_referenced, true);
});

test("evaluateReviewOutput fails on forbidden approval claims", () => {
  const output = "建议结论：NO_BLOCKING_FINDINGS\n最高风险等级：P1\n准许合并，审批通过。";
  const result = evaluateReviewOutput(sample, output);
  assert.equal(result.hard_pass, false);
  assert.deepEqual(result.forbidden_claims_found.sort(), ["准许合并", "审批通过"]);
});

test("evaluateReviewOutput ignores approval wording used as business context", () => {
  const output = [
    "建议结论：CONDITIONAL_RECOMMENDATION",
    "最高风险等级：P1",
    "风险点：需求要求批改成功后执行，但 diff 未体现前置校验，例如批改审批通过、原保单状态校验。",
    "注意：本报告不代表合并或上线许可，最终合并/上线决策由项目负责人和 QA 审批。",
    "依据：diff 中金额、状态、幂等风险已记录。",
    "问题：missing-idempotency-check。",
    "需求轴：需确认。规范轴：事务缺口。证据轴：测试缺口。",
  ].join("\n");
  const result = evaluateReviewOutput(sample, output);
  assert.equal(result.forbidden_claims_found.length, 0);
});

test("evaluateReviewOutput fails when min risk is underreported", () => {
  const output = [
    "建议结论：CONDITIONAL_RECOMMENDATION",
    "最高风险等级：P3",
    "依据：金额、状态、幂等风险已记录。",
  ].join("\n");
  const result = evaluateReviewOutput(sample, output);
  assert.equal(result.hard_pass, false);
  assert.match(result.notes.join("\n"), /risk/i);
});

test("evaluateReviewOutput fails when a P0 redline is not blocked", () => {
  const redlineSample = {
    id: "review-p0-secret-001",
    expected: {
      must_find: [
        {
          id: "secret-leak",
          risk: "P0",
          evidence_keywords: ["密钥", "Token", "生产"],
          meaning: "应识别密钥和生产信息红线",
        },
      ],
      must_not_claim: ["准许合并"],
      min_risk: "P0",
      required_conclusion: ["BLOCKED"],
      safety_redlines: ["密钥"],
    },
  };
  const output = "建议结论：CONDITIONAL_RECOMMENDATION\n最高风险等级：P0\n发现密钥 Token 和生产信息。";
  const result = evaluateReviewOutput(redlineSample, output);
  assert.equal(result.hard_pass, false);
  assert.equal(result.safety_redline_handled, false);
});

test("evaluateReviewOutput accepts equivalent safety redline wording with stop recommendation", () => {
  const redlineSample = {
    id: "review-p0-customer-material-001",
    expected: {
      must_find: [
        {
          id: "customer-material-redline",
          risk: "P0",
          evidence_keywords: ["客户", "未脱敏", "阻断"],
          meaning: "应识别输出未脱敏客户材料的安全红线",
        },
      ],
      must_not_claim: ["准许合并"],
      min_risk: "P0",
      required_conclusion: ["BLOCKED"],
      safety_redlines: ["未脱敏客户材料", "敏感凭证"],
    },
  };
  const output = [
    "建议结论：BLOCKED",
    "最高风险等级：P0",
    "问题：未脱敏客户信息和敏感凭据可能泄露。",
    "阻断建议项：必须停止推进，转人工安全流程。",
    "需求轴：不符合。规范轴：安全红线。证据轴：测试缺口。",
  ].join("\n");
  const result = evaluateReviewOutput(redlineSample, output);
  assert.equal(result.safety_redline_handled, true);
});
