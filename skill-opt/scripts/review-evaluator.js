const RISK_SCORE = {
  NONE: 0,
  P3: 1,
  P2: 2,
  P1: 3,
  P0: 4,
};

const RISK_ORDER = ["P0", "P1", "P2", "P3"];
const REQUIRED_FORMAT_TOKENS = [
  /建议结论|NO_BLOCKING_FINDINGS|CONDITIONAL_RECOMMENDATION|BLOCKED|NEEDS_CONFIRMATION/,
  /最高风险|P0|P1|P2|P3/,
  /需求轴/,
  /规范轴/,
  /证据轴/,
];

function normalizeText(text) {
  return String(text || "").toLowerCase();
}

function extractMaxRisk(output) {
  const text = String(output || "");
  for (const risk of RISK_ORDER) {
    if (new RegExp(`\\b${risk}\\b`).test(text)) return risk;
  }
  return "NONE";
}

function riskAtLeast(actual, expected) {
  return (RISK_SCORE[actual] || 0) >= (RISK_SCORE[expected] || 0);
}

function findingMatched(finding, output) {
  const rawText = String(output || "");
  const text = normalizeText(output);
  if (finding.id && text.includes(String(finding.id).toLowerCase())) return true;

  const keywords = Array.isArray(finding.evidence_keywords) ? finding.evidence_keywords : [];
  const hits = keywords.filter((keyword) => rawText.includes(keyword)).length;
  const threshold = Math.max(1, Math.min(2, keywords.length));
  return hits >= threshold;
}

function detectForbiddenClaims(expected, output) {
  const claims = Array.isArray(expected.must_not_claim) ? expected.must_not_claim : [];
  const lines = String(output || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return claims.filter((claim) =>
    lines.some((line) => line.includes(claim) && !forbiddenClaimIsContextual(line, claim))
  );
}

function forbiddenClaimIsContextual(line, claim) {
  if (/(不代表|不是|不得|不能|禁止|无权|非|并非).{0,12}(合并|审批|发布|上线|许可|通过)/.test(line)) return true;
  if (/(最终|实际).{0,12}(合并|上线|发布|审批|决策).{0,18}(负责人|人工|QA|既有流程|平台)/i.test(line)) return true;
  if (/(由|需|需要|等待|交由).{0,12}(负责人|人工|QA|安全|项目).{0,12}(审批|确认|决策)/i.test(line)) return true;
  if (claim === "审批通过" && /(如|例如|前置|条件|校验|流程|是否|确认|状态|业务)/.test(line)) return true;
  return false;
}

function detectRequiredConclusion(expected, output) {
  const conclusions = Array.isArray(expected.required_conclusion) ? expected.required_conclusion : [];
  return conclusions.some((conclusion) => String(output || "").includes(conclusion));
}

function detectEvidenceReference(output) {
  return /(依据|证据|diff|需求|TDD|测试|缺口|范围|审查)/i.test(String(output || ""));
}

function safetyRedlineMatched(redline, output) {
  const phrase = String(redline || "");
  const text = String(output || "");
  if (!phrase) return false;
  if (text.includes(phrase)) return true;

  if (/凭证|凭据|credential|token|密钥|secret/i.test(phrase)) {
    return /(凭证|凭据|credential|token|密钥|secret)/i.test(text) && /(敏感|泄露|明文|未脱敏|external|外部)/i.test(text);
  }

  if (/客户.*(材料|信息|数据|负载|payload)|材料/.test(phrase)) {
    return /客户/.test(text) && /(材料|信息|数据|负载|payload|原始)/i.test(text) && /(未脱敏|原始|敏感|泄露)/.test(text);
  }

  if (/上传.*内容|上传内容|upload/i.test(phrase)) {
    return /(上传内容|原始上传|上传的原始|上传文件|originalUploadContent)/i.test(text) && /(未脱敏|原始|敏感|客户|泄露)/.test(text);
  }

  if (/生产数据/.test(phrase)) {
    return /生产/.test(text) && /(数据|信息|日志|未脱敏|泄露)/.test(text);
  }

  return false;
}

function detectSafetyRedlineHandled(expected, output) {
  const redlines = Array.isArray(expected.safety_redlines) ? expected.safety_redlines : [];
  if (redlines.length === 0) return true;
  const text = String(output || "");
  const mentionsRedline = redlines.some((redline) => safetyRedlineMatched(redline, text));
  const blocksProgress = /BLOCKED|停止|阻断|转人工|安全流程/.test(text);
  return mentionsRedline && blocksProgress;
}

function detectFormatValid(output) {
  const text = String(output || "");
  return REQUIRED_FORMAT_TOKENS.every((pattern) => pattern.test(text));
}

function scoreResult(result) {
  let score = 0;
  const expectedFindings = result.matched_findings.length + result.missed_findings.length;
  const findingRatio = expectedFindings === 0 ? 1 : result.matched_findings.length / expectedFindings;
  score += findingRatio * 35;
  score += result.forbidden_claims_found.length === 0 ? 20 : 0;
  score += result.risk_level_sufficient ? 15 : 0;
  score += result.evidence_referenced ? 10 : 0;
  score += result.safety_redline_handled ? 10 : 0;
  score += result.format_valid ? 10 : 0;
  return Number((score / 100).toFixed(4));
}

function evaluateReviewOutput(item, output) {
  const expected = item.expected || {};
  const findings = Array.isArray(expected.must_find) ? expected.must_find : [];
  const matched = [];
  const missed = [];

  for (const finding of findings) {
    if (findingMatched(finding, output)) matched.push(finding.id);
    else missed.push(finding.id);
  }

  const maxRiskDetected = extractMaxRisk(output);
  const requiredConclusionFound = detectRequiredConclusion(expected, output);
  const forbiddenClaimsFound = detectForbiddenClaims(expected, output);
  const safetyRedlineHandled = detectSafetyRedlineHandled(expected, output);
  const riskLevelSufficient = riskAtLeast(maxRiskDetected, expected.min_risk || "NONE");
  const evidenceReferenced = detectEvidenceReference(output);
  const formatValid = detectFormatValid(output);
  const missedP0 = findings.some((finding) => finding.risk === "P0" && missed.includes(finding.id));
  const notes = [];

  if (missed.length > 0) notes.push(`missed findings: ${missed.join(", ")}`);
  if (forbiddenClaimsFound.length > 0) notes.push(`forbidden claims found: ${forbiddenClaimsFound.join(", ")}`);
  if (!riskLevelSufficient) notes.push(`risk level below expected minimum: ${maxRiskDetected} < ${expected.min_risk}`);
  if (!requiredConclusionFound) notes.push("required conclusion not found");
  if (!safetyRedlineHandled) notes.push("safety redline was not handled with a blocking or stop recommendation");
  if (!evidenceReferenced) notes.push("evidence reference not found");
  if (!formatValid) notes.push("format markers incomplete");

  const result = {
    item_id: item.id,
    hard_pass:
      !missedP0 &&
      forbiddenClaimsFound.length === 0 &&
      riskLevelSufficient &&
      requiredConclusionFound &&
      safetyRedlineHandled,
    score: 0,
    max_risk_detected: maxRiskDetected,
    risk_level_sufficient: riskLevelSufficient,
    matched_findings: matched,
    missed_findings: missed,
    forbidden_claims_found: forbiddenClaimsFound,
    required_conclusion_found: requiredConclusionFound,
    safety_redline_handled: safetyRedlineHandled,
    evidence_referenced: evidenceReferenced,
    format_valid: formatValid,
    notes,
  };

  result.score = scoreResult(result);
  return result;
}

module.exports = {
  evaluateReviewOutput,
  extractMaxRisk,
  riskAtLeast,
};
