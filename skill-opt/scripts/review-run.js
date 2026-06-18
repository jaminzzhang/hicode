const fs = require("fs");
const path = require("path");
const { evaluateReviewOutput } = require("./review-evaluator.js");

function emptySplitSummary() {
  return {
    total_items: 0,
    evaluated_count: 0,
    missing_output_count: 0,
    hard_pass_count: 0,
    hard_fail_count: 0,
    average_score: 0,
  };
}

function updateSummary(summary, itemResult) {
  summary.total_items += 1;
  if (itemResult.status === "missing_output") {
    summary.missing_output_count += 1;
    return;
  }
  summary.evaluated_count += 1;
  if (itemResult.result.hard_pass) summary.hard_pass_count += 1;
  else summary.hard_fail_count += 1;
  summary._score_total = (summary._score_total || 0) + itemResult.result.score;
}

function finalizeSummary(summary) {
  const scoreTotal = summary._score_total || 0;
  delete summary._score_total;
  summary.average_score = summary.evaluated_count === 0 ? 0 : Number((scoreTotal / summary.evaluated_count).toFixed(4));
  return summary;
}

function evaluateRun({ runId, datasetItems, runRoot, datasetPath = "", generatedAt = new Date().toISOString() }) {
  if (!runId) throw new Error("runId is required");
  if (!Array.isArray(datasetItems)) throw new Error("datasetItems must be an array");
  if (!runRoot) throw new Error("runRoot is required");

  const outputDir = path.join(runRoot, "review-outputs");
  const summary = emptySplitSummary();
  const bySplit = {};
  const items = [];

  for (const item of datasetItems) {
    const split = item.split || "unknown";
    if (!bySplit[split]) bySplit[split] = emptySplitSummary();
    const outputPath = path.join(outputDir, `${item.id}.md`);
    let itemResult;

    if (!fs.existsSync(outputPath)) {
      itemResult = {
        id: item.id,
        split,
        status: "missing_output",
        output_path: outputPath,
      };
    } else {
      const output = fs.readFileSync(outputPath, "utf8");
      itemResult = {
        id: item.id,
        split,
        status: "evaluated",
        output_path: outputPath,
        result: evaluateReviewOutput(item, output),
      };
    }

    updateSummary(summary, itemResult);
    updateSummary(bySplit[split], itemResult);
    items.push(itemResult);
  }

  Object.keys(bySplit).forEach((split) => finalizeSummary(bySplit[split]));

  return {
    run_id: runId,
    generated_at: generatedAt,
    dataset_path: datasetPath,
    output_dir: outputDir,
    summary: {
      ...finalizeSummary(summary),
      by_split: bySplit,
    },
    items,
  };
}

function formatList(values) {
  if (!values || values.length === 0) return "-";
  return values.join(", ");
}

function renderRunSummary(report) {
  const lines = [];
  lines.push(`# hicode SkillOpt Run ${report.run_id}`);
  lines.push("");
  lines.push("## 定位");
  lines.push("");
  lines.push("本报告是 SkillOpt 管理侧离线评估摘要，只记录脱敏评分结果和缺口，不包含原始 Review 输出、模型轨迹、生产数据或客户信息。");
  lines.push("");
  lines.push("## 元信息");
  lines.push("");
  lines.push(`- Run ID: \`${report.run_id}\``);
  lines.push(`- 生成时间: \`${report.generated_at}\``);
  lines.push(`- 数据集: \`${report.dataset_path || "-"}\``);
  lines.push(`- 输出目录: \`${report.output_dir || "-"}\``);
  lines.push("");
  lines.push("## 汇总");
  lines.push("");
  lines.push("| 指标 | 值 |");
  lines.push("|---|---:|");
  for (const key of [
    "total_items",
    "evaluated_count",
    "missing_output_count",
    "hard_pass_count",
    "hard_fail_count",
    "average_score",
  ]) {
    lines.push(`| \`${key}\` | ${report.summary[key]} |`);
  }
  lines.push("");
  lines.push("## Split 汇总");
  lines.push("");
  lines.push("| Split | total_items | evaluated_count | missing_output_count | hard_pass_count | hard_fail_count | average_score |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|");
  for (const [split, summary] of Object.entries(report.summary.by_split || {})) {
    lines.push(
      `| \`${split}\` | ${summary.total_items} | ${summary.evaluated_count} | ${summary.missing_output_count} | ${summary.hard_pass_count} | ${summary.hard_fail_count} | ${summary.average_score} |`
    );
  }
  lines.push("");
  lines.push("## 样例结果");
  lines.push("");
  lines.push("| 样例 | Split | 状态 | hard_pass | score | max_risk | matched_findings | missed_findings | forbidden_claims | notes |");
  lines.push("|---|---|---|---:|---:|---|---|---|---|---|");
  for (const item of report.items) {
    if (item.status === "missing_output") {
      lines.push(`| \`${item.id}\` | \`${item.split}\` | \`missing_output\` | - | - | - | - | - | - | 缺少输出文件 |`);
      continue;
    }
    const result = item.result;
    lines.push(
      `| \`${item.id}\` | \`${item.split}\` | \`evaluated\` | ${result.hard_pass} | ${result.score} | \`${result.max_risk_detected}\` | ${formatList(result.matched_findings)} | ${formatList(result.missed_findings)} | ${formatList(result.forbidden_claims_found)} | ${formatList(result.notes)} |`
    );
  }
  lines.push("");
  lines.push("## 建议动作");
  lines.push("");
  if (report.summary.missing_output_count > 0) {
    lines.push("1. 补齐缺失样例输出后重新运行评估。");
  }
  if (report.summary.hard_fail_count > 0) {
    lines.push("2. 对 hard_fail 样例进行人工复核，判断是 Skill 输出问题、样例期望问题还是 evaluator 规则问题。");
  }
  if (report.summary.evaluated_count > 0 && report.summary.hard_fail_count === 0) {
    lines.push("3. 当前已评估输出未触发硬失败，但仍不得作为合并或发布审批。");
  }
  if (report.summary.evaluated_count === 0) {
    lines.push("1. 当前没有可评估输出，本报告只能作为缺口记录。");
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function writeRunSummary(report, docsRunsDir) {
  fs.mkdirSync(docsRunsDir, { recursive: true });
  const target = path.join(docsRunsDir, `${report.run_id}.md`);
  fs.writeFileSync(target, renderRunSummary(report), "utf8");
  return target;
}

module.exports = {
  evaluateRun,
  renderRunSummary,
  writeRunSummary,
};
