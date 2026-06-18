#!/usr/bin/env node
const {
  coverageForJson,
  readJsonlFile,
  validateDataset,
} = require("./review-dataset.js");

function main(argv) {
  const filePath = argv[2];
  if (!filePath) {
    process.stderr.write("Usage: node skill-opt/scripts/validate-review-dataset.js <items.jsonl>\n");
    return 2;
  }

  const rows = readJsonlFile(filePath);
  const result = validateDataset(rows.map((row) => row.item));
  const output = {
    valid: result.valid,
    item_count: rows.length,
    errors: result.errors,
    coverage: coverageForJson(result.coverage),
  };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  return result.valid ? 0 : 1;
}

if (require.main === module) {
  process.exitCode = main(process.argv);
}

module.exports = { main };
