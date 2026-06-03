# AGENTS.md

## 1. Project Purpose

This project builds an AI Harness engineering system for the Yijianxian R&D team.

The current goal is to turn the requirement document `docs/研发 AI 工程化方案V1.1.md` into maintainable engineering assets for agent-assisted software delivery, including:

1. Project-level agent entry rules.
2. Context documents for business, architecture, coding, testing, review, release, and defects.
3. Prompt and Skill templates for recurring R&D workflows.
4. Gate rules for requirement, coding, test, merge, and release checkpoints.
5. Security and governance rules for controlled AI-assisted development.

This project is not an insurance core system implementation. It is the engineering harness used to standardize how Coding Agents assist work around those systems.

## 2. Current Source Of Truth

The authoritative requirement input is:

1. `docs/研发 AI 工程化方案V1.1.md`

Before making project-structure, documentation, prompt, skill, or governance changes, read this document first and align the work to it.

If the implementation later creates `docs/`, `.ai-harness/`, or other structured assets, those files may become the operational source of truth for their own area. Until then, the requirement document remains the main reference.

## 3. Agent Responsibilities

Agents working in this project may assist with:

1. Extracting requirements and implementation scope from the requirement document.
2. Designing the Harness directory structure.
3. Creating and maintaining context documents.
4. Creating Prompt and Skill templates for AI-assisted R&D workflows.
5. Creating gate and checklist templates.
6. Reviewing consistency between generated assets and the requirement document.
7. Identifying gaps, risks, unclear requirements, and missing governance rules.

Agents must treat AI output as an engineering aid. Final decisions about process, architecture, security policy, and rollout remain with the project owner or responsible team lead.

## 4. Working Language

The project's primary working and output language is Chinese, with English used as supplementary support.

Agents should:

1. Use Chinese as the default language for explanations, plans, reviews, summaries, and user-facing deliverables.
2. Use English only when it improves precision, such as file names, code identifiers, protocol names, tool names, commit messages, or widely used technical terms.
3. Preserve existing English names for project assets, paths, commands, schemas, and templates unless the user explicitly requests translation.
4. Prefer bilingual wording only when a term is ambiguous or when English terminology is the accepted engineering convention.

## 5. Expected Workflows

### 5.1 Requirement Analysis

When asked to analyze or refine the Harness requirements:

1. Read `docs/研发 AI 工程化方案V1.1.md`.
2. Summarize the relevant requirement scope.
3. Identify assumptions, risks, and unclear points.
4. Propose concrete next actions or document updates.

### 5.2 Harness Structure Design

When asked to design or expand the project structure:

1. Prefer the structure recommended in the requirement document.
2. Keep generated files focused and maintainable.
3. Separate human-readable documents under `docs/` from machine-oriented Harness assets under `.ai-harness/`.
4. Do not create broad scaffolding unless the user requests it.

### 5.3 Prompt And Skill Template Work

When asked to create Prompt or Skill templates:

1. Align each template to a specific R&D workflow.
2. Define the input, processing rules, output format, and quality criteria.
3. Include safety and review constraints where relevant.
4. Avoid embedding large duplicate sections from the requirement document when a concise reference is enough.

### 5.4 Review And Validation

When asked to review generated Harness assets:

1. Check consistency with the requirement document.
2. Check whether the asset has a clear owner, scope, input, output, and update rule.
3. Flag missing safety constraints.
4. Flag vague language, duplicated rules, and untestable acceptance criteria.

## 6. Safety Rules

Agents must not:

1. Read or output production accounts, passwords, tokens, keys, or secrets.
2. Read `.env`, secret files, production configuration files, or credential files unless the user explicitly confirms a safe, non-production context.
3. Submit customer-sensitive information to external services.
4. Directly operate production environments.
5. Automatically merge code.
6. Automatically publish or release systems.
7. Modify production configuration.
8. Execute destructive commands without explicit user approval.
9. Delete unconfirmed code, tests, configuration, scripts, or documents.

Sensitive data must be masked before it appears in prompts, reports, examples, or generated assets. This includes names, identity numbers, phone numbers, bank card numbers, policy numbers, customer IDs, addresses, email addresses, tokens, cookies, sessions, database connection strings, production IPs, and internal keys.

## 7. Documentation Rules

When new knowledge, decisions, risks, or workflow rules are discovered:

1. Prefer proposing a targeted document update instead of silently spreading the knowledge across unrelated files.
2. Mark uncertain content as `待确认`.
3. Keep generated documents concise and structured.
4. Avoid copying large sections from `docs/研发 AI 工程化方案V1.1.md` unless the target file is explicitly meant to be a template or reference.
5. For architecture or governance decisions, create a draft and ask for confirmation before treating it as accepted.

## 8. Output Requirements

For analysis, review, planning, testing, or release-related work, include:

1. Conclusion.
2. Evidence or source basis.
3. Risk level.
4. Recommended actions.
5. Questions requiring confirmation.
6. Suggested context or Harness asset updates.

Use Chinese as the primary output language and English as supplementary support, unless the user explicitly asks for another language.

Keep outputs direct and actionable. Prefer concrete file paths, checklist items, and acceptance criteria over broad recommendations.

## 9. Current Initialization State

The current initialization scope is intentionally minimal:

1. `AGENTS.md` exists as the project-level Agent entry file.
2. `docs/研发 AI 工程化方案V1.1.md` remains the only requirement source currently present under `docs/`.
3. The full `.ai-harness/` structure and supporting Harness documents described in the requirement document have not yet been generated.

When expanding the project, preserve this distinction:

1. Requirement source: `docs/研发 AI 工程化方案V1.1.md`
2. Agent entry and operating rules: `AGENTS.md`
3. Human-readable requirements and future knowledge base: `docs/`
4. Future Harness runtime/config assets: `.ai-harness/`
