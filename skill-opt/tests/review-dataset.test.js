const assert = require("node:assert/strict");
const test = require("node:test");

const {
  parseJsonl,
  validateDataset,
  REQUIRED_TAGS,
} = require("../scripts/review-dataset.js");

function item(overrides = {}) {
  return {
    id: "review-train-safety-001",
    split: "train",
    tags: ["review", "safety-redline", "format-output"],
    prompt: "请使用 hicode:review 审查以下脱敏 diff 和证据。",
    skill_under_test: "hicode:review",
    review_materials: {
      requirement: "脱敏需求：批改提交前检查权限和审计。",
      scope_summary: "只评审权限和审计，不处理发布。",
      tdd_evidence: "已提供脱敏测试摘要。",
      diff: "diff --git a/src/PolicyService.java b/src/PolicyService.java",
    },
    expected: {
      must_find: [
        {
          id: "secret-redline",
          risk: "P0",
          evidence_keywords: ["密钥", "未脱敏", "停止"],
          meaning: "应识别敏感信息红线并停止推进",
        },
      ],
      must_not_claim: ["准许合并", "审批通过", "可以上线"],
      min_risk: "P0",
      required_conclusion: ["BLOCKED"],
      safety_redlines: ["密钥"],
    },
    ...overrides,
  };
}

function coveredDataset() {
  const splits = ["train", "val", "test"];
  return splits.flatMap((split) => [
    item({
      id: `review-${split}-safety-001`,
      split,
      tags: ["review", "safety-redline", "format-output"],
    }),
    item({
      id: `review-${split}-money-state-001`,
      split,
      tags: ["review", "amount", "state", "idempotency"],
      expected: {
        ...item().expected,
        must_find: [
          {
            id: "amount-state-idempotency",
            risk: "P1",
            evidence_keywords: ["金额", "状态", "幂等"],
            meaning: "应识别金额状态变更缺少幂等保护",
          },
        ],
        min_risk: "P1",
        required_conclusion: ["CONDITIONAL_RECOMMENDATION", "BLOCKED"],
        safety_redlines: [],
      },
    }),
    item({
      id: `review-${split}-evidence-java-001`,
      split,
      tags: ["review", "evidence-gap", "sql-config-script", "java-spring", "scope-missing"],
      expected: {
        ...item().expected,
        must_find: [
          {
            id: "evidence-and-transaction-gap",
            risk: "P1",
            evidence_keywords: ["证据", "SQL", "事务"],
            meaning: "应识别证据不足和 SQL/事务风险",
          },
        ],
        min_risk: "P1",
        required_conclusion: ["NEEDS_CONFIRMATION", "CONDITIONAL_RECOMMENDATION"],
        safety_redlines: [],
      },
    }),
  ]);
}

test("parseJsonl ignores blank lines and reports line numbers", () => {
  const rows = parseJsonl(`${JSON.stringify(item())}\n\n${JSON.stringify(item({ id: "review-train-safety-002" }))}\n`);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].lineNumber, 1);
  assert.equal(rows[1].lineNumber, 3);
});

test("validateDataset accepts a risk-layered covered dataset", () => {
  const result = validateDataset(coveredDataset());
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
  for (const split of ["train", "val", "test"]) {
    assert.deepEqual([...result.coverage.bySplit[split].missingTags].sort(), []);
  }
});

test("validateDataset rejects missing required fields", () => {
  const broken = item({ expected: { ...item().expected, must_not_claim: undefined } });
  const result = validateDataset([broken]);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /expected\.must_not_claim/);
});

test("validateDataset rejects obvious secret-like examples", () => {
  const broken = item({
    review_materials: {
      ...item().review_materials,
      diff: "const token = 'sk-1234567890abcdef';",
    },
  });
  const result = validateDataset([broken]);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /secret-like/);
});

test("validateDataset reports missing split coverage", () => {
  const result = validateDataset([item()]);
  assert.equal(result.valid, false);
  for (const tag of REQUIRED_TAGS) {
    if (!item().tags.includes(tag)) {
      assert.match(result.errors.join("\n"), new RegExp(tag));
      break;
    }
  }
});
