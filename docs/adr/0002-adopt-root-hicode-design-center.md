# ADR 0002: Adopt Root hicode Design Center

## Status

Accepted

## Context

hicode initially kept reusable Harness assets under `harness-assets/` and later added a Claude Code plugin under a nested plugin directory. That created two competing centers: the original Harness source tree and the plugin packaging tree. As hicode moves toward being directly installed and used by Coding Agents, keeping the plugin as a second-level copy increases path confusion, duplicated rules, and drift between source assets and packaged assets.

Claude Code plugins also expect a clear plugin root containing `.claude-plugin/` and `skills/`. If hicode keeps those under a nested packaging directory, future maintainers must constantly distinguish “project source,” “plugin source,” and “target project initialization output,” even though the intended product is the hicode agent capability itself.

## Decision

Use the repository root as the hicode design center and Claude Code plugin root.

The root now directly owns:

1. `.claude-plugin/` for Claude Code plugin metadata.
2. `install.sh` for current-user Claude Code plugin installation.
3. `skills/` for top-level hicode scenario Skills: `hicode`, `scope`, `tdd`, `review`, and `release`.
4. `agents/` for the 8 professional hicode subagents.
5. `references/` for supporting docs, prompts, gates, schemas, examples, hooks, initialization manifests/profiles, and fine-grained Skill rules.

`harness-assets/` is no longer the long-term source asset center. The plugin installer still does not initialize a business project, scan code, generate `CLAUDE.md` or `AGENTS.md`, or create a target project `.hicode/` directory.

## Consequences

Positive:

1. Claude Code can treat the repository root as the plugin root without nested packaging paths.
2. hicode has one source asset center instead of a source tree plus plugin snapshot.
3. Top-level Skills become directly callable hicode capabilities rather than thin references to another asset tree.
4. Supporting materials remain available under `references/` without becoming default context.

Trade-offs:

1. Historical V1/V2 documents and progress records may mention old `harness-assets/` paths as historical context.
2. Initialization manifests must be updated to refer to root source paths.
3. Any future OpenCode or other platform adaptation must be designed separately instead of sharing this Claude Code root model.

## Alternatives Considered

1. Keep `harness-assets/plugins/` as the Claude Code plugin root.
   - Rejected because it preserves a nested packaging center and encourages duplicated reference assets.
2. Move every asset directory to root, including `prompts/`, `gates/`, `schemas/`, and `docs/`.
   - Rejected because it makes the root noisy and blurs directly callable assets with supporting materials.
3. Keep both root plugin assets and `harness-assets/` source assets.
   - Rejected because two live source trees would drift and make future maintenance ambiguous.

