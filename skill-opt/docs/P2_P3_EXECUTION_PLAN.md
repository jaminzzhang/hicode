# hicode SkillOpt P2/P3 Execution Plan

## Goal

Build the first executable offline loop for the `hicode:review` SkillOpt trial: desensitized golden samples, dataset validation, and a local rule-based evaluator. This plan does not install SkillOpt, call a model backend, implement a real SkillOpt adapter, or adopt candidate Skill changes.

## Architecture

The first executable unit stays inside `skill-opt/`. JSONL samples live under `skill-opt/data/review-golden/`; Node scripts under `skill-opt/scripts/` validate the dataset and score saved Review outputs. Tests under `skill-opt/tests/` exercise the scripts without model calls or secrets.

## Files

1. `skill-opt/data/review-golden/items.jsonl`: artificial desensitized `hicode_review` seed samples.
2. `skill-opt/data/review-golden/README.md`: sample catalog and safety boundary.
3. `skill-opt/scripts/review-dataset.js`: JSONL parser, schema validation, split coverage checks and secret-pattern scan.
4. `skill-opt/scripts/review-evaluator.js`: deterministic rule evaluator for `must_find`, forbidden claims, risk level, evidence, safety redline and output format.
5. `skill-opt/scripts/validate-review-dataset.js`: CLI wrapper for dataset validation.
6. `skill-opt/scripts/evaluate-review-output.js`: CLI wrapper for one sample/output scoring.
7. `skill-opt/tests/review-dataset.test.js`: dataset validator tests.
8. `skill-opt/tests/review-evaluator.test.js`: evaluator tests.
9. `scripts/health-check.sh`: runs syntax checks, unit tests and seed dataset validation.
10. `docs/HICODE_HEALTH_CHECK.md`: records the new checks.

## Tasks

### Task 1: Dataset Validator

1. Write failing tests for JSONL parsing, required fields, split values, secret-pattern rejection and split/tag coverage.
2. Implement `review-dataset.js`.
3. Add `validate-review-dataset.js` CLI.
4. Create seed JSONL samples and README.
5. Verify tests and CLI pass.

### Task 2: Rule Evaluator

1. Write failing tests for successful risk detection, forbidden-claim failure, P0 miss failure and safety-redline handling.
2. Implement `review-evaluator.js`.
3. Add `evaluate-review-output.js` CLI.
4. Verify tests and CLI pass.

### Task 3: Health Check Integration

1. Add Node syntax checks for new scripts.
2. Add `node --test skill-opt/tests/*.test.js`.
3. Add seed dataset validation.
4. Update health-check docs.
5. Run full `bash scripts/health-check.sh`.

## Acceptance

1. `node --test skill-opt/tests/*.test.js` passes.
2. `node skill-opt/scripts/validate-review-dataset.js skill-opt/data/review-golden/items.jsonl` passes.
3. A saved Review output can be scored locally without calling models.
4. `bash scripts/health-check.sh` passes.
5. No SkillOpt dependency, model credential, `.env` access or running Skill mutation is introduced.
