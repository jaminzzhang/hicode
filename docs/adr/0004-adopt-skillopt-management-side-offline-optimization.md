# ADR 0004: Adopt SkillOpt as a Management-Side Offline Optimization Loop

## Status

Accepted

## Context

hicode needs a way to evaluate and improve Skill behavior with reproducible evidence, but current V3 boundaries keep runtime assets small: `skills/`, `agents/`, and `hooks/` are the active capability surface, while management documents and historical materials must not be installed into target projects. SkillOpt can train natural-language Skill documents through scored rollouts and validation-gated edits, but it also introduces datasets, evaluator logic, model credentials, outputs, and candidate `best_skill.md` artifacts that would be unsafe to treat as default runtime assets.

## Decision

Introduce SkillOpt as a management-side offline evaluation and optimization loop under root `skill-opt/`, with `docs/`, `scripts/`, and local `outputs/` subdirectories. The first optimization trial targets `hicode:review`; all six hicode Skills remain covered by lightweight trigger-boundary and safety-redline regression checks.

SkillOpt input data must use artificial, desensitized golden samples, not raw real sessions, real MR text, production logs, production configuration, customer data, credentials, or undetermined target-project code. The first `hicode:review` evaluation design uses a custom `hicode_review` adapter shape and a mixed evaluator: rule scoring is the validation-gate basis, while LLM review may only check semantic equivalence of risk detection.

SkillOpt outputs are local by default. Candidate `best_skill.md` files, rollouts, checkpoints, logs, and model trajectories must not be committed as runtime assets and must not automatically overwrite `skills/review/SKILL.md`. Any accepted improvement must go through a human-reviewed patch process, then pass the hicode health check and held-out evaluation before it becomes part of the running Skill.

## Consequences

This preserves the V3 plugin and install boundary while creating a repeatable path for evidence-based Skill improvement. It also means the first delivery is a planning and governance skeleton, not immediate SkillOpt training. Future automation must explicitly keep `skill-opt/` out of plugin manifests and installers, keep `skill-opt/outputs/` out of Git except documentation placeholders, and treat optimized Skill candidates as review inputs rather than published Skills.
