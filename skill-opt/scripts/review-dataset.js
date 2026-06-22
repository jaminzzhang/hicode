const fs = require("fs");

const SPLITS = ["train", "val", "test"];
const RISK_LEVELS = ["P0", "P1", "P2", "P3", "NONE"];
const CONCLUSIONS = [
  "NO_BLOCKING_FINDINGS",
  "CONDITIONAL_RECOMMENDATION",
  "BLOCKED",
  "NEEDS_CONFIRMATION",
];
const REQUIRED_TAGS = [
  "safety-redline",
  "amount",
  "state",
  "idempotency",
  "evidence-gap",
  "sql-config-script",
  "java-spring",
  "scope-missing",
  "format-output",
];

const SECRET_LIKE_PATTERNS = [
  /sk-[A-Za-z0-9]{12,}/,
  /AKIA[0-9A-Z]{16}/,
  /BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY/,
  /password\s*=/i,
  /jdbc:[^\s]+@/i,
  /:\/\/[^\s:]+:[^\s@]+@/,
];

function parseJsonl(text) {
  const rows = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    try {
      rows.push({ lineNumber: index + 1, item: JSON.parse(line) });
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      throw new Error(`Invalid JSONL at line ${index + 1}: ${message}`);
    }
  });
  return rows;
}

function readJsonlFile(filePath) {
  return parseJsonl(fs.readFileSync(filePath, "utf8"));
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireString(errors, item, path, value) {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${item.id || "<unknown>"} missing required string: ${path}`);
  }
}

function requireStringArray(errors, item, path, value) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string" || !entry.trim())) {
    errors.push(`${item.id || "<unknown>"} missing required string array: ${path}`);
  }
}

function validateFinding(errors, item, finding, index) {
  if (!isObject(finding)) {
    errors.push(`${item.id || "<unknown>"} expected.must_find[${index}] must be an object`);
    return;
  }
  requireString(errors, item, `expected.must_find[${index}].id`, finding.id);
  if (!RISK_LEVELS.includes(finding.risk) || finding.risk === "NONE") {
    errors.push(`${item.id || "<unknown>"} invalid expected.must_find[${index}].risk`);
  }
  requireStringArray(errors, item, `expected.must_find[${index}].evidence_keywords`, finding.evidence_keywords);
  requireString(errors, item, `expected.must_find[${index}].meaning`, finding.meaning);
}

function scanSecretLikeContent(item) {
  const serialized = JSON.stringify(item);
  return SECRET_LIKE_PATTERNS.some((pattern) => pattern.test(serialized));
}

function validateItem(item, errors, seenIds, coverage) {
  if (!isObject(item)) {
    errors.push("dataset item must be an object");
    return;
  }

  requireString(errors, item, "id", item.id);
  if (typeof item.id === "string") {
    if (seenIds.has(item.id)) errors.push(`${item.id} duplicate id`);
    seenIds.add(item.id);
  }

  if (!SPLITS.includes(item.split)) {
    errors.push(`${item.id || "<unknown>"} invalid split: ${item.split}`);
  }

  requireStringArray(errors, item, "tags", item.tags);
  if (Array.isArray(item.tags) && SPLITS.includes(item.split)) {
    for (const tag of item.tags) coverage.bySplit[item.split].tags.add(tag);
  }

  requireString(errors, item, "prompt", item.prompt);
  if (item.skill_under_test !== "hicode:review") {
    errors.push(`${item.id || "<unknown>"} skill_under_test must be hicode:review`);
  }

  if (!isObject(item.review_materials)) {
    errors.push(`${item.id || "<unknown>"} missing review_materials`);
  } else {
    requireString(errors, item, "review_materials.diff", item.review_materials.diff);
  }

  if (!isObject(item.expected)) {
    errors.push(`${item.id || "<unknown>"} missing expected`);
  } else {
    if (!Array.isArray(item.expected.must_find)) {
      errors.push(`${item.id || "<unknown>"} missing expected.must_find`);
    } else {
      item.expected.must_find.forEach((finding, index) => validateFinding(errors, item, finding, index));
    }
    requireStringArray(errors, item, "expected.must_not_claim", item.expected.must_not_claim);
    if (!RISK_LEVELS.includes(item.expected.min_risk)) {
      errors.push(`${item.id || "<unknown>"} invalid expected.min_risk`);
    }
    if (
      !Array.isArray(item.expected.required_conclusion) ||
      item.expected.required_conclusion.some((entry) => !CONCLUSIONS.includes(entry))
    ) {
      errors.push(`${item.id || "<unknown>"} invalid expected.required_conclusion`);
    }
    requireStringArray(errors, item, "expected.safety_redlines", item.expected.safety_redlines);
  }

  if (scanSecretLikeContent(item)) {
    errors.push(`${item.id || "<unknown>"} contains secret-like content`);
  }
}

function validateCoverage(errors, coverage) {
  for (const split of SPLITS) {
    const splitCoverage = coverage.bySplit[split];
    splitCoverage.missingTags = new Set(REQUIRED_TAGS.filter((tag) => !splitCoverage.tags.has(tag)));
    if (splitCoverage.tags.size === 0) {
      errors.push(`missing split: ${split}`);
    }
    for (const tag of splitCoverage.missingTags) {
      errors.push(`split ${split} missing required tag: ${tag}`);
    }
  }
}

function validateDataset(items) {
  const errors = [];
  const seenIds = new Set();
  const coverage = {
    bySplit: Object.fromEntries(
      SPLITS.map((split) => [split, { tags: new Set(), missingTags: new Set(REQUIRED_TAGS) }])
    ),
  };

  if (!Array.isArray(items) || items.length === 0) {
    errors.push("dataset must contain at least one item");
  } else {
    items.forEach((item) => validateItem(item, errors, seenIds, coverage));
  }

  validateCoverage(errors, coverage);
  return {
    valid: errors.length === 0,
    errors,
    coverage,
  };
}

function coverageForJson(coverage) {
  return {
    bySplit: Object.fromEntries(
      SPLITS.map((split) => [
        split,
        {
          tags: [...coverage.bySplit[split].tags].sort(),
          missingTags: [...coverage.bySplit[split].missingTags].sort(),
        },
      ])
    ),
  };
}

module.exports = {
  CONCLUSIONS,
  REQUIRED_TAGS,
  RISK_LEVELS,
  SECRET_LIKE_PATTERNS,
  SPLITS,
  coverageForJson,
  parseJsonl,
  readJsonlFile,
  validateDataset,
};
