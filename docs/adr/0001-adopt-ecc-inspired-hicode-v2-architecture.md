# Adopt ECC-Inspired hicode V2 Architecture

Status: accepted

hicode will evolve toward an ECC-inspired, insurance-core-focused architecture: introduce delegated subagents under `harness-assets/agents/`, integrate each subagent with existing Prompt/Skill/Gate/Schema assets, add `harness-assets/install/` for DAILY/LIBRARY selective installation, and plan for advisory-first gate Hook integration. We will not copy ECC's full generic agent catalog; hicode remains a vertical harness for insurance and financial core system development, with strict boundaries against automatic release, automatic merge, production operations, production configuration changes, production SQL, production log access, and unmasked production or customer data.

**Considered Options**

1. Keep V1 as Prompt/Skill/Gate assets only.
2. Copy ECC's broad multi-agent, multi-skill, hook, rule, and installer surface wholesale.
3. Adopt selected ECC patterns while preserving hicode's insurance-core risk model.

We chose option 3. V1 already has a coherent industry risk and evidence chain, so replacing it with generic ECC surfaces would dilute the insurance-core controls. At the same time, ECC's delegated subagents, selective installation, hookable checks, and harness-health patterns solve real scaling problems that hicode will face as assets grow.

**Consequences**

- The first hicode subagent batch should stay small and map to the existing core workflow: `requirement-reviewer`, `coding-planner`, `tdd-guide`, `coding-assistant`, `code-reviewer`, `security-reviewer`, `java-reviewer`, and `release-reviewer`.
- Agents are role and delegation entry points; Prompts remain the detailed rule source. Agents may reference Prompts, Skills, Gates, Schemas, and output templates, but should not copy Prompt bodies or maintain duplicate rules.
- `harness-assets/install/` becomes the future source location for profiles and manifests that classify assets as DAILY or LIBRARY.
- Gate Hook integration should default to advisory mode. Blocking mode is reserved for hard red lines such as secrets, unmasked customer or production data, production overreach, automatic merge/release/rollback, deleting tests, weakening assertions, or bypassing Review.
