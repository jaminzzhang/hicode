#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const regressionPath = "docs/HICODE_SKILL_TRIGGER_REGRESSION.md";
const skills = [
  { name: "hi", route: "hi" },
  { name: "init", route: "hicode:init" },
  { name: "scope", route: "hicode:scope" },
  { name: "tdd", route: "hicode:tdd" },
  { name: "review", route: "hicode:review" },
  { name: "release", route: "hicode:release" },
];

const requiredSections = {
  SHOULD_TRIGGER: 5,
  SHOULD_NOT_TRIGGER: 5,
  SAFETY_REDLINE: 2,
};

const redlinePattern = /(密钥|Token|连接串|生产|未脱敏|自动合并|自动发布|自动回滚|删除失败测试|降低断言|\.env|\.hicode)/;
const legacyConclusionPatterns = [
  { label: "READY_FOR_TDD", pattern: /\bREADY_FOR_TDD\b/ },
  { label: "CONDITIONAL_PASS", pattern: /\bCONDITIONAL_PASS\b/ },
  { label: "PASS", pattern: /\bPASS\b/ },
  { label: "双轴审查结果", pattern: /双轴审查结果/ },
];

const requiredConclusionTokens = [
  {
    filePath: "skills/init/hicode-entry-section.md",
    tokens: ["TDD_INPUT_READY"],
  },
  {
    filePath: "skills/scope/SKILL.md",
    tokens: ["TDD_INPUT_READY"],
  },
  {
    filePath: "skills/scope/scope-plan.md",
    tokens: ["TDD_INPUT_READY", "NO_BLOCKING_GAPS"],
  },
  {
    filePath: "skills/tdd/SKILL.md",
    tokens: ["LOCAL_VERIFIED", "PARTIAL_VERIFICATION"],
  },
  {
    filePath: "skills/tdd/tdd-report.md",
    tokens: ["LOCAL_VERIFIED", "PARTIAL_VERIFICATION"],
  },
  {
    filePath: "skills/review/SKILL.md",
    tokens: ["NO_BLOCKING_FINDINGS", "CONDITIONAL_RECOMMENDATION"],
  },
  {
    filePath: "skills/review/review-report.md",
    tokens: ["NO_BLOCKING_FINDINGS", "CONDITIONAL_RECOMMENDATION", "三轴审查结果"],
  },
  {
    filePath: "skills/release/SKILL.md",
    tokens: ["NO_BLOCKING_FINDINGS", "CONDITIONAL_RECOMMENDATION"],
  },
  {
    filePath: "skills/release/release-report.md",
    tokens: ["NO_BLOCKING_FINDINGS", "CONDITIONAL_RECOMMENDATION"],
  },
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function extractHeading(text, marker, heading, stopMarkers) {
  const lines = text.split("\n");
  const start = lines.findIndex((line) => line === `${marker} ${heading}`);
  if (start === -1) {
    return null;
  }
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (stopMarkers.some((stopMarker) => lines[i].startsWith(`${stopMarker} `))) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join("\n");
}

function extractBlock(text, heading) {
  return extractHeading(text, "##", heading, ["##"]);
}

function extractSubsection(block, heading) {
  return extractHeading(block, "###", heading, ["##", "###"]);
}

function countListItems(text) {
  return (text.match(/^\d+\.\s+\S/gm) || []).length;
}

function readText(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function listMarkdownFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(entryPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }
  return files;
}

if (!fs.existsSync(regressionPath)) {
  fail(`Missing ${regressionPath}`);
}

const regression = readText(regressionPath);

for (const skill of skills) {
  const skillPath = `skills/${skill.name}/SKILL.md`;
  const skillText = readText(skillPath);
  const description = skillText.match(/^description:\s*(.+)$/m);
  const descriptionText = description ? description[1].trim() : "";
  const triggerIndex = descriptionText.indexOf("Use when ");
  if (triggerIndex <= 0) {
    fail(`${skillPath} description must include a capability sentence before "Use when " trigger text`);
  }
  if (descriptionText.length > 1024) {
    fail(`${skillPath} description exceeds 1024 characters`);
  }
  if (!descriptionText.includes("hicode")) {
    fail(`${skillPath} description must mention hicode trigger context`);
  }

  const block = extractBlock(regression, skill.name);
  if (!block) {
    fail(`${regressionPath} missing section ## ${skill.name}`);
  }
  if (!block.includes(`Route: \`${skill.route}\``)) {
    fail(`${regressionPath} section ${skill.name} missing Route: \`${skill.route}\``);
  }

  for (const [section, minimum] of Object.entries(requiredSections)) {
    const subsection = extractSubsection(block, section);
    if (!subsection) {
      fail(`${regressionPath} section ${skill.name} missing ${section}`);
    }
    const count = countListItems(subsection);
    if (count < minimum) {
      fail(`${regressionPath} section ${skill.name}/${section} has ${count}, expected at least ${minimum}`);
    }
    if (section === "SAFETY_REDLINE" && !redlinePattern.test(subsection)) {
      fail(`${regressionPath} section ${skill.name}/${section} lacks safety red-line vocabulary`);
    }
  }
}

for (const filePath of listMarkdownFiles("skills")) {
  const text = readText(filePath);
  for (const legacy of legacyConclusionPatterns) {
    if (legacy.pattern.test(text)) {
      fail(`${filePath} contains legacy conclusion token: ${legacy.label}`);
    }
  }
}

for (const required of requiredConclusionTokens) {
  const text = readText(required.filePath);
  for (const token of required.tokens) {
    if (!text.includes(token)) {
      fail(`${required.filePath} missing required conclusion token: ${token}`);
    }
  }
}
