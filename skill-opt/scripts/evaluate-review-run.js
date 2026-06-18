#!/usr/bin/env node
const path = require("path");
const { readJsonlFile, validateDataset } = require("./review-dataset.js");
const { evaluateRun, writeRunSummary } = require("./review-run.js");

function parseArgs(argv) {
  const args = {
    dataset: "skill-opt/data/review-golden/items.jsonl",
    outputsRoot: "skill-opt/outputs",
    docsRunsDir: "skill-opt/docs/runs",
    writeSummary: true,
  };
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dataset") args.dataset = argv[++index];
    else if (arg === "--outputs-root") args.outputsRoot = argv[++index];
    else if (arg === "--docs-runs-dir") args.docsRunsDir = argv[++index];
    else if (arg === "--no-write") args.writeSummary = false;
    else if (!args.runId) args.runId = arg;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.runId) throw new Error("Missing run ID");
  return args;
}

function main(argv) {
  let args;
  try {
    args = parseArgs(argv);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.stderr.write("Usage: node skill-opt/scripts/evaluate-review-run.js <run-id> [--dataset items.jsonl] [--outputs-root dir] [--docs-runs-dir dir] [--no-write]\n");
    return 2;
  }

  const rows = readJsonlFile(args.dataset);
  const datasetItems = rows.map((row) => row.item);
  const validation = validateDataset(datasetItems);
  if (!validation.valid) {
    process.stderr.write(`Dataset validation failed:\n${validation.errors.join("\n")}\n`);
    return 1;
  }

  const runRoot = path.join(args.outputsRoot, args.runId);
  const report = evaluateRun({
    runId: args.runId,
    datasetItems,
    runRoot,
    datasetPath: args.dataset,
  });

  let summaryPath = "";
  if (args.writeSummary) {
    summaryPath = writeRunSummary(report, args.docsRunsDir);
  }

  process.stdout.write(`${JSON.stringify({ ...report, summary_path: summaryPath }, null, 2)}\n`);
  return report.summary.hard_fail_count === 0 ? 0 : 1;
}

if (require.main === module) {
  process.exitCode = main(process.argv);
}

module.exports = { main, parseArgs };
