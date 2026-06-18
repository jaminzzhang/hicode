#!/usr/bin/env node
const path = require("path");
const {
  analyzeCandidate,
  writeCandidateSummary,
} = require("./review-candidate.js");

function parseArgs(argv) {
  const args = {
    baselinePath: "skills/review/SKILL.md",
    outputsRoot: "skill-opt/outputs",
    docsRunsDir: "skill-opt/docs/runs",
    writeSummary: true,
  };
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--baseline") args.baselinePath = argv[++index];
    else if (arg === "--candidate") args.candidatePath = argv[++index];
    else if (arg === "--outputs-root") args.outputsRoot = argv[++index];
    else if (arg === "--docs-runs-dir") args.docsRunsDir = argv[++index];
    else if (arg === "--no-write") args.writeSummary = false;
    else if (!args.runId) args.runId = arg;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.runId) throw new Error("Missing run ID");
  if (!args.candidatePath) args.candidatePath = path.join(args.outputsRoot, args.runId, "best_skill.md");
  return args;
}

function main(argv) {
  let args;
  try {
    args = parseArgs(argv);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.stderr.write("Usage: node skill-opt/scripts/summarize-review-candidate.js <run-id> [--baseline path] [--candidate path] [--outputs-root dir] [--docs-runs-dir dir] [--no-write]\n");
    return 2;
  }

  const report = analyzeCandidate({
    runId: args.runId,
    baselinePath: args.baselinePath,
    candidatePath: args.candidatePath,
  });
  let summaryPath = "";
  if (args.writeSummary) summaryPath = writeCandidateSummary(report, args.docsRunsDir);
  process.stdout.write(`${JSON.stringify({ ...report, summary_path: summaryPath }, null, 2)}\n`);
  return report.recommendation === "REJECT_RECOMMENDED" ? 1 : 0;
}

if (require.main === module) {
  process.exitCode = main(process.argv);
}

module.exports = { main, parseArgs };
