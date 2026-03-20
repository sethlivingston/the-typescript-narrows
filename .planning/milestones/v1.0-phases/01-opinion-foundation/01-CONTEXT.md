# Phase 1: Opinion Foundation - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Define the canonical opinion corpus (up to 50 opinions) that serves as the single source of truth for both the Claude skill and ESLint plugin. Establish the opinion format, enumerate TypeScript ambiguities/gotchas, and author all opinion files. No skill authoring, no ESLint work -- those are Phases 2-4.

</domain>

<decisions>
## Implementation Decisions

### Opinion structure
- Format: Markdown files with YAML frontmatter
- ID format: slug-based (e.g., `no-explicit-any`, `prefer-interface`, `ban-enums`)
- Frontmatter fields: `id`, `title`, `severity`, `enforcement`, `confidence`, `tags`, `related`, `lint` (for lint-enforceable opinions)
- Body sections: Stance, Why, Do (one or more), Don't (one or more), Exceptions (optional)
- Code examples: minimal 3-8 line snippets as default, but opinions may include multiple Do and/or Don't blocks when the pattern has distinct variations
- Cross-references: explicit `related` field in frontmatter linking to other opinion IDs
- Exceptions: explicit optional Exceptions section per opinion, plus a corpus-level preamble stating that all opinions allow exceptions when there is no other viable alternative
- Confidence: two levels -- `strong` (community consensus or well-proven) and `moderate` (reasonable people disagree but we're picking a side)
- Tags: freeform tags (not single-category), e.g., `[type-system, generics, variance]`
- No external references field -- opinions are self-contained
- No external links to docs, blog posts, or StackOverflow

### Enumeration approach
- Research-driven enumeration from multiple sources: typescript-eslint rule list, TypeScript FAQ/common errors, StackOverflow top questions, Matt Pocock's content, team experience
- Inclusion bar: any recurring ambiguity where two reasonable TypeScript developers would do it differently
- Master list (INDEX.md) created first before authoring individual opinion files
- Master list grouped by tags, unranked within groups (severity on each opinion captures importance)

### Severity tiers
- Three tiers, impact-based definitions:
  - **Bug prevention**: can cause runtime errors, data corruption, or silent wrong behavior
  - **Maintenance**: makes code harder to understand, refactor, or extend over time
  - **Style**: consistency and readability with no functional impact

### Enforcement tagging
- Three tags as specified in requirements: `skill-only`, `lint-enforceable`, `both`
- For lint-enforceable opinions, frontmatter includes a `lint` field specifying:
  - `type: existing` + `rule: "<rule-name>"` for opinions mapping to existing typescript-eslint rules
  - `type: custom` for opinions needing new custom rules
- This lint mapping drives Phase 3/4 planning -- clear manifest of what to configure vs. build

### File organization
- All opinion files in `docs/opinions/` (flat directory, no subdirectories)
- One markdown file per opinion, named by slug (e.g., `no-explicit-any.md`)
- `docs/opinions/INDEX.md` -- master registry listing all opinions grouped by tags with one-line descriptions
- `docs/opinions/README.md` -- corpus preamble (philosophy, how opinions are structured, severity tiers, global exception clause, how AI agents should use it)
- Only `docs/opinions/` directory created in Phase 1 -- `skill/` and `eslint-plugin/` created by their respective phases

### Claude's Discretion
- Exact tag taxonomy (which tags emerge from the enumeration)
- Order of opinions within the master list
- Exact wording of the global exception clause in README.md
- How to handle edge cases where an opinion spans multiple severity tiers

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project requirements
- `.planning/REQUIREMENTS.md` -- OPIN-01 through OPIN-04 define the opinion corpus requirements
- `.planning/PROJECT.md` -- Core value, constraints, key decisions

### Research
- `.planning/research/FEATURES.md` -- Feature analysis from project research
- `.planning/research/ARCHITECTURE.md` -- Architecture patterns from research
- `.planning/research/PITFALLS.md` -- Known pitfalls identified during research

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None -- greenfield project with no existing code

### Established Patterns
- None -- first phase establishes the foundational patterns

### Integration Points
- Opinion files will be consumed by Phase 2 (Claude Skill) and Phase 3/4 (ESLint Plugin)
- The `lint` field in frontmatter directly feeds Phase 3/4 rule configuration and custom rule development

</code_context>

<specifics>
## Specific Ideas

No specific requirements -- open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 01-opinion-foundation*
*Context gathered: 2026-03-17*
