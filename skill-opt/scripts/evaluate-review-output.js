#!/usr/bin/env node
const fs = require("fs");
const { evaluateReviewOutput } = require("./review-evaluator.js");
const { parseJsonl } = require("./review-dataset.js");

function readItem(filePath, itemId) {
  const text = fs.readFileSync(filePath, "utf8");
  if (filePath.endsWith(".jsonl")) {
    const rows = parseJsonl(text);
    const row = itemId ? rows.find((entry) => entry.item.id === itemId) : rows[0];
    if (!row) throw new Error(`Item not found in ${filePath}: ${itemId}`);
    return row.item;
  }
  return JSON.parse(text);
}

function main(argv) {
  const itemPath = argv[2];
  const outputPath = argv[3];
  const itemId = argv[4];
  if (!itemPath || !outputPath) {
    process.stderr.write("Usage: node skill-opt/scripts/evaluate-review-output.js <item.json|items.jsonl> <output.md> [item-id]\n");
    return 2;
  }

  const item = readItem(itemPath, itemId);
  const output = fs.readFileSync(outputPath, "utf8");
  const result = evaluateReviewOutput(item, output);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result.hard_pass ? 0 : 1;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv);
  } catch (error) {
    process.stderr.write(`${error && error.message ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

module.exports = { main, readItem };
