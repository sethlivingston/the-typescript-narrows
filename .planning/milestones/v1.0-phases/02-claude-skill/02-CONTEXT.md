# Phase 2: Claude Skill - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Author the complete AI-agent-readable Claude skill from the 50-opinion corpus. Transform opinions into a skill-optimized format with SKILL.md as the index (under 500 lines) and reference files for detailed content. No ESLint work, no publishing, no coverage validation — those are Phases 3-5.

</domain>

<decisions>
## Implementation Decisions

### Skill structure & progressive disclosure
- SKILL.md is a concise index listing all 50 opinions with their one-sentence stance
- SKILL.md includes a brief usage guide preamble (10-20 lines) explaining what the skill is, how to apply opinions, severity tiers, and the global exception clause
- All opinions treated equally in the index — no special highlight section for bug-prevention tier
- Reference files contain the full opinion details (stance, rationale, examples)
- Opinions are not treated as individual files in the skill — they are grouped for AI agent consumption

### Opinion presentation format
- Skill-optimized format, not verbatim copies from the corpus — tighter prose, imperative voice, structured for agent scanning
- The corpus (`docs/opinions/`) remains the source of truth; skill files are a derivative tailored for AI agents
- Include "Why" rationale per opinion (required by SKIL-10 — agents must relay reasoning to developers)
- Include both Do and Don't code examples (most actionable part for AI pattern-matching)

### Activation & frontmatter
- Skill activates when the AI agent is writing, refactoring, or reviewing TypeScript code
- Claude-specific YAML frontmatter following the Anthropic skill spec (other platform variants deferred to v2 per SKIL-V2-01)
- Skill name: "The TypeScript Narrows" — the "narrows" is a play on "Deathly Hallows" and refers to narrowing TypeScript down to a consistent, manageable language for AI agents
- Tagline should convey the core value: eliminating the "multiple ways to do it" problem

### File layout
- Skill files live in `skill/` directory at repo root: `skill/SKILL.md` + `skill/references/*.md`
- Clean separation from corpus (`docs/opinions/`) and future ESLint plugin (`eslint-plugin/`)
- Phase 2 creates the files only — no installation setup, no registry publishing (Phase 5)

### Claude's Discretion
- How to split opinions across reference files (one per topic group vs. other groupings — optimize for AI agent retrieval)
- Which opinion exceptions to include vs. omit (balance between directive tone and preventing rigid application)
- Exact tagline wording
- Exact preamble content and length within the 10-20 line budget

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Opinion corpus (source of truth)
- `docs/opinions/README.md` — Corpus philosophy, opinion structure, frontmatter field reference, severity tiers, global exception clause
- `docs/opinions/INDEX.md` — Master registry of all 50 opinions grouped by topic with severity/enforcement tags

### Project requirements
- `.planning/REQUIREMENTS.md` — SKIL-01 through SKIL-21 define all Claude Skill requirements
- `.planning/PROJECT.md` — Core value, constraints, key decisions, agnostic requirement

### Prior phase context
- `.planning/phases/01-opinion-foundation/01-CONTEXT.md` — Phase 1 decisions on opinion format, severity tiers, enforcement tagging, file organization

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `docs/opinions/*.md` (50 files) — Complete opinion corpus with YAML frontmatter and Stance/Why/Do/Don't/Exceptions sections. These are the source material for skill authoring.
- `docs/opinions/INDEX.md` — Master opinion list organized into 12 topic groups. Can inform reference file structure.
- `docs/opinions/README.md` — Corpus preamble with philosophy and structure docs. Useful as a starting point for the skill's usage guide preamble.

### Established Patterns
- Opinion frontmatter schema: `id`, `title`, `severity`, `enforcement`, `confidence`, `tags`, `related`, `lint` — skill can reference these fields
- 12 topic groups: Type Safety, Type Declarations, Null Handling & Narrowing, Async & Promises, Error Handling, Immutability & Const, Module Organization, Naming Conventions, Discriminated Unions, Generics & Advanced Types, Branded & Nominal Types, tsconfig Strictness, Conditional Types & Advanced Pitfalls
- Code examples are minimal 3-8 line snippets with Do/Don't blocks

### Integration Points
- Skill files will be consumed by Phase 5 (Coverage Validation) to verify all opinions are covered
- Skill serves as the behavioral spec for Phase 4 (Custom ESLint Rules) — rule behavior should match skill guidance
- `skill/` directory is a new top-level directory alongside `docs/`

</code_context>

<specifics>
## Specific Ideas

- "The Narrows" naming is a play on "Harry Potter and the Deathly Hallows" — the skill "narrows" TypeScript down to a consistent, manageable subset for AI agents
- The skill should feel like an authoritative, opinionated guide — not a reference manual or style guide

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-claude-skill*
*Context gathered: 2026-03-17*
