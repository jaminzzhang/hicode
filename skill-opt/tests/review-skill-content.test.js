const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..", "..");
const skillPath = path.join(root, "skills", "review", "SKILL.md");

function readSkill() {
  return fs.readFileSync(skillPath, "utf8");
}

function readDescription(text) {
  const match = text.match(/^description:\s*(.+)$/m);
  assert.ok(match, "review skill should declare a description");
  return match[1];
}

test("review skill stays concise while preserving SkillOpt-proven guardrails", () => {
  const text = readSkill();
  const description = readDescription(text);
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  assert.ok(wordCount <= 260, `review skill should stay token-conscious; got ${wordCount} whitespace-delimited words`);
  assert.ok(description.includes("。Use when "), "description should keep a short capability sentence before trigger text");
  assert.ok(!description.includes("基于 diff"), "description should not summarize workflow or body identity");
  assert.ok(!text.includes("RocketMQ"), "review skill should not hard-code public-source training project names");

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
    "证据升级规则",
    "公开 reviewer 评论",
    "check-then-act",
    "可观测性",
    "生成文件",
    "权限映射",
  ]) {
    assert.ok(text.includes(required), `review skill should keep required guardrail: ${required}`);
  }
});
