const fs = require("fs");
const path = require("path");

const FORBIDDEN_CLAIMS = [
  "准许合并",
  "审批通过",
  "可以上线",
  "允许发布",
  "发布许可",
  "门禁通过",
  "最终审批",
];
const REQUIRED_TERMS = [
  "安全红线",
  "生产",
  "密钥",
  "未脱敏",
  "自动合并",
  "自动发布",
  "需求轴",
  "规范轴",
  "证据轴",
  "NO_BLOCKING_FINDINGS",
  "CONDITIONAL_RECOMMENDATION",
  "BLOCKED",
  "NEEDS_CONFIRMATION",
  "金额",
  "状态",
  "幂等",
  "权限",
  "审计",
  "回滚",
];
const FORBIDDEN_PATH_PATTERNS = [
  /archive\//,
  /references\//,
  /\.hicode\//,
  /\.\.\/\.\.\/agents\//,
];

function unique(values) {
  return [...new Set(values)];
}

function linesOf(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function diffLines(baselineText, candidateText) {
  const baselineLines = linesOf(baselineText);
  const candidateLines = linesOf(candidateText);
  const baselineSet = new Set(baselineLines);
  const candidateSet = new Set(candidateLines);
  return {
    added_lines: candidateLines.filter((line) => !baselineSet.has(line)),
    removed_lines: baselineLines.filter((line) => !candidateSet.has(line)),
  };
}

function forbiddenClaimIsContextual(line, claim) {
  if (/(不代表|不是|不得|不能|禁止|无权|非).{0,16}(合并|审批|发布|上线|许可|通过)/.test(line)) return true;
  if (/(禁止|不得|不能).{0,12}(输出|写出|声称|给出).{0,12}/.test(line)) return true;
  if (/(最终|实际).{0,12}(合并|上线|发布|审批|决策).{0,18}(负责人|人工|QA|既有流程|平台)/i.test(line)) return true;
  if (/(由|需|需要|等待|交由).{0,12}(负责人|人工|QA|安全|项目).{0,12}(审批|确认|决策)/i.test(line)) return true;
  if (claim === "审批通过" && /(如|例如|前置|条件|校验|流程|是否|确认|状态|业务)/.test(line)) return true;
  return false;
}

function detectForbiddenClaims(lines) {
  const hits = [];
  for (const line of lines) {
    for (const claim of FORBIDDEN_CLAIMS) {
      if (line.includes(claim) && !forbiddenClaimIsContextual(line, claim)) hits.push(claim);
    }
  }
  return hits;
}

function detectRemovedRequiredTerms(baselineText, candidateText) {
  return REQUIRED_TERMS.filter((term) => baselineText.includes(term) && !candidateText.includes(term));
}

function detectForbiddenPaths(text) {
  const matches = [];
  for (const pattern of FORBIDDEN_PATH_PATTERNS) {
    if (pattern.test(text)) matches.push(pattern.source);
  }
  return matches;
}

function recommendationFor(risks, candidateExists) {
  if (!candidateExists) return "WAIT_FOR_CANDIDATE";
  if (
    risks.forbidden_claims.length > 0 ||
    risks.removed_required_terms.length > 0 ||
    risks.forbidden_paths.length > 0
  ) {
    return "REJECT_RECOMMENDED";
  }
  return "HUMAN_REVIEW_REQUIRED";
}

function analyzeCandidate({
  runId,
  baselinePath = "skills/review/SKILL.md",
  candidatePath,
  generatedAt = new Date().toISOString(),
}) {
  if (!runId) throw new Error("runId is required");
  if (!baselinePath) throw new Error("baselinePath is required");
  if (!candidatePath) throw new Error("candidatePath is required");

  const baselineText = fs.readFileSync(baselinePath, "utf8");
  if (!fs.existsSync(candidatePath)) {
    return {
      run_id: runId,
      generated_at: generatedAt,
      baseline_path: baselinePath,
      candidate_path: candidatePath,
      status: "missing_candidate",
      recommendation: "WAIT_FOR_CANDIDATE",
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
  }

  const candidateText = fs.readFileSync(candidatePath, "utf8");
  const lineDiff = diffLines(baselineText, candidateText);
  const risks = {
    forbidden_claims: unique(detectForbiddenClaims(lineDiff.added_lines)),
    removed_required_terms: unique(detectRemovedRequiredTerms(baselineText, candidateText)),
    forbidden_paths: unique(detectForbiddenPaths(candidateText)),
  };
  const recommendation = recommendationFor(risks, true);

  return {
    run_id: runId,
    generated_at: generatedAt,
    baseline_path: baselinePath,
    candidate_path: candidatePath,
    status: recommendation === "REJECT_RECOMMENDED" ? "candidate_flagged" : "candidate_present",
    recommendation,
    diff: {
      added_line_count: lineDiff.added_lines.length,
      removed_line_count: lineDiff.removed_lines.length,
      added_lines: lineDiff.added_lines.slice(0, 20),
      removed_lines: lineDiff.removed_lines.slice(0, 20),
    },
    risks,
  };
}

function renderCsvList(values) {
  return values && values.length > 0 ? values.join(", ") : "-";
}

function renderLineSamples(title, lines) {
  const output = [];
  output.push(`### ${title}`);
  output.push("");
  if (!lines || lines.length === 0) {
    output.push("无。");
    output.push("");
    return output;
  }
  lines.slice(0, 10).forEach((line, index) => {
    const hits = [...FORBIDDEN_CLAIMS, ...REQUIRED_TERMS].filter((term) => line.includes(term));
    output.push(`${index + 1}. 长度 ${line.length}，关键词：${renderCsvList(hits)}`);
  });
  output.push("");
  return output;
}

function renderCandidateSummary(report) {
  const lines = [];
  lines.push(`# hicode SkillOpt Candidate ${report.run_id}`);
  lines.push("");
  lines.push("## 定位");
  lines.push("");
  lines.push("本报告是 SkillOpt 候选 Skill 的管理侧差异摘要，只用于人工审查，不代表采纳、不覆盖运行 Skill，也不包含完整候选正文。");
  lines.push("");
  lines.push("## 元信息");
  lines.push("");
  lines.push(`- Run ID: \`${report.run_id}\``);
  lines.push(`- 生成时间: \`${report.generated_at}\``);
  lines.push(`- 当前基准: \`${report.baseline_path}\``);
  lines.push(`- 候选文件: \`${report.candidate_path}\``);
  lines.push(`- 状态: \`${report.status}\``);
  lines.push(`- 建议: \`${report.recommendation}\``);
  lines.push("");
  lines.push("## 风险摘要");
  lines.push("");
  lines.push("| 风险项 | 命中 |");
  lines.push("|---|---|");
  lines.push(`| 禁止结论 | ${renderCsvList(report.risks.forbidden_claims)} |`);
  lines.push(`| 被移除关键术语 | ${renderCsvList(report.risks.removed_required_terms)} |`);
  lines.push(`| 禁止路径依赖 | ${renderCsvList(report.risks.forbidden_paths)} |`);
  lines.push("");
  lines.push("## 差异摘要");
  lines.push("");
  lines.push(`- 新增非空行数：${report.diff.added_line_count}`);
  lines.push(`- 删除非空行数：${report.diff.removed_line_count}`);
  lines.push("");
  lines.push(...renderLineSamples("新增行抽样", report.diff.added_lines));
  lines.push(...renderLineSamples("删除行抽样", report.diff.removed_lines));
  lines.push("## 建议动作");
  lines.push("");
  if (report.recommendation === "WAIT_FOR_CANDIDATE") {
    lines.push("1. 等待真实 `best_skill.md` 候选出现后重新生成摘要。");
  } else if (report.recommendation === "REJECT_RECOMMENDED") {
    lines.push("1. 当前候选命中高风险差异，建议拒绝或要求重新训练。");
    lines.push("2. 如仍需采纳，必须先回到人工审查和 grill-with-docs 澄清。");
  } else {
    lines.push("1. 当前摘要未发现硬性拒绝项，但仍必须人工审查。");
    lines.push("2. 不得直接复制候选覆盖 `skills/review/SKILL.md`。");
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function writeCandidateSummary(report, docsRunsDir) {
  fs.mkdirSync(docsRunsDir, { recursive: true });
  const target = path.join(docsRunsDir, `${report.run_id}-candidate.md`);
  fs.writeFileSync(target, renderCandidateSummary(report), "utf8");
  return target;
}

module.exports = {
  FORBIDDEN_CLAIMS,
  REQUIRED_TERMS,
  analyzeCandidate,
  renderCandidateSummary,
  writeCandidateSummary,
};
