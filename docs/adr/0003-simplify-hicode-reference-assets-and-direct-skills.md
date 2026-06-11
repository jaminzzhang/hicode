# ADR 0003: Simplify hicode Reference Assets and Direct Skills

## Status

Accepted

## Context

hicode has accumulated a large `references/` tree during V1 and V2: docs, prompts, fine-grained skills, gates, schemas, examples, hooks, initialization manifests and profiles. This structure was useful while building and validating assets, but it now makes the product surface hard to reason about. Current top-level Skills also still depend on older supporting assets, which risks turning them into indexes instead of direct executable guidance.

The project now needs a simpler current asset model. The intended product is a Claude Code plugin and hicode design center, not a historical construction archive or a target-project `.hicode/` asset copier.

## Decision

Simplify current hicode assets around direct Skills, specialist Agents, and three `references/` categories.

Current effective assets are:

1. `skills/`: six direct Claude Code Skill entries: `hicode`, `init`, `scope`, `tdd`, `review`, and `release`.
2. `agents/`: specialist hicode subagents for high-risk or complex delegation.
3. `references/rules/`: current executable rules, flows, gates, review rules, structured output constraints, and shared safety rules.
4. `references/templates/`: current copyable and fillable templates for target projects and Skill outputs.
5. `references/hooks/`: current Hook behavior descriptions, configuration examples, trigger conditions, advisory or blocking criteria, and audit fields.

The Claude Code plugin manifest and installer must not install the repository's project-management `docs/`, ADR history, progress records, or `archive/` as target Coding Agent runtime assets. Those files remain repository governance material.

`references/` should no longer keep `docs/`, `prompts/`, `skills/`, `gates/`, `schemas/`, `examples/`, `init/`, or `target-project/` as current first-level categories. Valid current content from those directories should be absorbed into `rules/`, `templates/`, `hooks/`, top-level `skills/`, or top-level `agents/`.

Historical or no-longer-current assets move to `archive/`. Archived assets are non-running, non-installing, and non-default-search materials. Current Skills, Agents, manifests, templates, and Hook descriptions must not depend on `archive/`.

The target-project `.hicode/` asset solidification model, `references/init/` manifests and profiles, and `DAILY/LIBRARY` selective initialization are retired as current mechanisms. They remain historical design material only. Current `hicode:init` initializes target-project entry files, context documents, and project rule documents; it does not copy hicode plugin assets into a target project `.hicode/` directory.

## Consequences

Positive:

1. The current hicode product surface becomes easier to explain: Skills execute, Agents specialize, Rules govern, Templates structure output, and Hooks describe optional automation.
2. Top-level Skills must become self-contained execution guidance instead of thin wrappers over fine-grained archived Skills.
3. Current references are organized by use, not by historical asset type.
4. Target-project initialization becomes lighter and avoids maintaining a second local copy of hicode assets.

Trade-offs:

1. Existing references from V1/V2 documents, ADRs, manifests, and examples will become historical and must not be followed blindly.
2. Migration requires careful path updates across Skills, Agents, README files, `CONTEXT.md`, `AGENTS.md`, and plugin documentation.
3. Retiring manifests and profiles removes a prior extensibility point; future target-project asset solidification would need a new decision and design.
4. Rules absorbed from prompts, gates, schemas, workflows, and review-rules must be deduplicated rather than mechanically moved.

## Alternatives Considered

1. Keep the existing `references/` structure and only clean up file names.
   - Rejected because it preserves the same cognitive load and lets old asset types remain current rule sources.
2. Move every current asset to the repository root.
   - Rejected because it would blur direct plugin entries with supporting rules, templates, and Hook descriptions.
3. Keep manifest/profile based `.hicode/` asset solidification.
   - Rejected for now because it conflicts with the simpler plugin-as-capability model and keeps too much initialization complexity in the current surface.
4. Remove `agents/` and make Skills handle all responsibilities.
   - Rejected because specialist Agents remain valuable for security, Java/SQL, release, and insurance-core risk review in high-risk financial core system work.
