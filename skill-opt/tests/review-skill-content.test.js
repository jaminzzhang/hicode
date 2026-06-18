const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..", "..");
const skillPath = path.join(root, "skills", "review", "SKILL.md");

function readSkill() {
  return fs.readFileSync(skillPath, "utf8");
}

test("review skill stays concise while preserving SkillOpt-proven guardrails", () => {
  const text = readSkill();
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  assert.ok(wordCount <= 260, `review skill should stay token-conscious; got ${wordCount} whitespace-delimited words`);

  for (const required of [
    "hicode:review",
    "review-report.md",
    "docs/rules/",
    "docs/features/<feature-id>/",
    "不得读取 `.env`",
    "NO_BLOCKING_FINDINGS",
    "CONDITIONAL_RECOMMENDATION",
    "BLOCKED",
    "NEEDS_CONFIRMATION",
    "建议结论和阻断建议项分开判断",
    "最低按 P1",
    "不要仅凭表名",
    "停止推进",
    "直接 SQL",
    "需求轴",
    "规范轴",
    "证据轴",
  ]) {
    assert.ok(text.includes(required), `review skill should keep required guardrail: ${required}`);
  }
});
