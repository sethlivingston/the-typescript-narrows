# Project Research Summary

**Project:** The TypeScript Narrows
**Domain:** Opinionated TypeScript guidance ecosystem (Claude skill + ESLint plugin)
**Researched:** 2026-03-16
**Confidence:** HIGH

## Executive Summary

The TypeScript Narrows is a dual-artifact guidance ecosystem: a Claude AI skill (markdown) and an ESLint plugin (npm package) that together provide opinionated, machine-enforceable TypeScript guidance. Experts build this category of tool by establishing a single canonical opinion corpus first, then deriving both the human/AI-readable skill and the machine-enforced lint rules from that corpus. The non-negotiable architectural constraint is that the skill and plugin must never drift apart — each must express the same opinions — and the only sustainable way to guarantee that is a shared source of truth that both artifacts are built from.

The recommended approach is opinion-first development: write the `docs/opinions/` corpus before writing any skill content or ESLint rules. The Claude skill gets a progressive-disclosure structure (SKILL.md under 500 lines as a concise index, `references/*.md` for detailed opinions per topic). The ESLint plugin extends `typescript-eslint` strict-type-checked rather than reinventing covered rules, adding custom rules only for genuine gaps (enum banning, discriminated union enforcement, typed catch clauses). The plugin targets ESLint 10 with flat config exclusively, using `@typescript-eslint/utils` for rule authoring and `@typescript-eslint/rule-tester` for testing.

The primary risks are opinion sprawl (covering everything instead of the 15-25 most impactful decisions), skill-plugin drift (the two artifacts contradicting each other), and false-positive erosion of trust (custom ESLint rules flagging legitimate code). All three are addressable at the foundation: a hard opinion budget, a registry pattern that maps each opinion to its skill representation and ESLint rule (or "not automatable" flag), and a test discipline that requires more valid edge-case tests than invalid-code tests for every rule.

## Key Findings

### Recommended Stack

The ESLint plugin is a TypeScript package built with `tsup` (esbuild-powered bundler), tested with Vitest and `@typescript-eslint/rule-tester`, and published via changesets. TypeScript 5.9.x is the stable target — TS 6.0 is RC-only as of March 2026. The plugin declares `eslint` and `@typescript-eslint/parser` as peer dependencies with a range of `^9.0.0 || ^10.0.0` for broad compatibility, while all plugin source uses only flat-config APIs. The Claude skill is pure markdown with YAML frontmatter — no build step, no dependencies.

**Core technologies:**
- TypeScript ~5.9.3: language for plugin source — latest stable, TS 6.0 is still RC
- ESLint ^10.0.0: linting runtime (flat config only, eslintrc fully removed)
- typescript-eslint ^8.57.0: parser, AST utilities, RuleCreator, rule-tester — mandatory for TS-aware rules
- tsup 8.5.x: CJS+ESM bundling with `.d.ts` generation — zero-config, esbuild-powered
- Vitest 4.1.x: test runner — native TS/ESM, Jest-compatible API
- Node.js ^20.19.0 || ^22.13.0 || >=24: runtime constraint from ESLint 10

### Expected Features

**Must have (table stakes):**
- Claude skill with comprehensive opinions — the core product; covers type vs interface, enum stance, error handling, async, nullability, naming, module organization, advanced pitfalls
- ESLint preset extending typescript-eslint strict-type-checked — opinionated configuration of existing rules bundled as a single import
- Custom rule: enum ban (prefer `as const` + type union) — the single most expected custom rule; no existing plugin covers it
- Custom rule: typed catch clause enforcement — `unknown` in catch blocks; genuinely novel territory
- ESLint flat config export — single-import adoption; non-negotiable for 2026
- npm package publication — installable and versioned

**Should have (competitive):**
- Custom rule: discriminated union discriminant enforcement — novel territory, medium-high complexity
- AI-agent-native skill structure — progressive disclosure, organized by decision point not rule name; primary differentiator vs all competitors
- Error handling pattern guidance (skill) — Result types, discriminated union errors, error hierarchies; major gap in all competitors
- Readonly-by-default opinions — aggressive readonly: readonly params, `ReadonlyArray<T>` in signatures
- Autofix for all custom rules — increases adoption significantly
- "Why" documentation per opinion — rationale in skill + rule messages link to rationale

**Defer (v2+):**
- Oxlint rule ports — plugin API immature and changing
- IDE extension — VS Code inline skill opinions beyond ESLint
- Migration codemods — automated migration from un-opinionated codebases
- Skill variants for Cursor/Copilot — wait for format standardization

### Architecture Approach

The architecture is a two-artifact system with a shared opinion corpus as the single source of truth. The opinion corpus (`docs/opinions/`) is canonical — changes flow outward to the Claude skill references and ESLint rule implementations, never the other way. At runtime, the skill and plugin are completely independent: different distribution channels, different consumers, zero shared code. A `scripts/` layer can automate synchronization, but manual sync is acceptable for v1. The build order mirrors the dependency graph: opinion corpus first, then skill and plugin skeleton in parallel, then rules, then configs, then publishing.

**Major components:**
1. Opinion Corpus (`docs/opinions/`) — canonical source of every opinion with rationale, "Do/Don't" examples, and automatable/skill-only classification
2. Claude Skill (`skill/SKILL.md` + `skill/references/*.md`) — human/AI-readable guidance; SKILL.md is a concise index under 500 lines; reference files provide progressive disclosure per topic
3. ESLint Plugin (`eslint-plugin/src/`) — machine-enforced rules and preset configs; rules/ for individual rules, configs/ for recommended and recommended-type-checked presets
4. Generation Scripts (`scripts/`) — compile opinion corpus into skill references, sync rule docs; v1 can skip these and sync manually

### Critical Pitfalls

1. **Opinion sprawl** — Start with 15-25 core opinions, not 60+. Each opinion must clear the bar: "Does this prevent a real, recurring problem?" Tier opinions by impact: (1) prevent bugs, (2) prevent maintenance problems, (3) stylistic. Tier 3 is skill-only soft guidance or omitted entirely.
2. **Skill-plugin drift** — Maintain a structured opinion registry (YAML/JSON or structured markdown) before writing any content. Each opinion gets an ID, rationale, skill guidance text, and lint rule reference or "not automatable" flag. CI enforces the mapping.
3. **False positive erosion of trust** — Every rule requires 2-3x more "valid" test cases than "invalid" cases. Ship new rules as `warn` severity; promote to `error` only after real-world validation. Provide clear fix-suggestion messages and documented escape hatches.
4. **Context window toxicity** — SKILL.md must stay under 500 lines (Anthropic's limit). Progressive disclosure is non-negotiable. Never explain things Claude already knows; every line must justify its token cost.
5. **ESLint version targeting** — Target ESLint 10 minimum. Use only flat-config APIs. Test against ESLint 10 in CI from day one. The `@typescript-eslint/rule-tester` must be configured with flat config options.

## Implications for Roadmap

Based on research, the architecture's own build-order dependency graph (see ARCHITECTURE.md) suggests the following phase structure:

### Phase 1: Opinion Foundation
**Rationale:** The opinion corpus is the dependency for everything else. Defining what to enforce — and what not to enforce — before writing any skill content or ESLint code prevents the two most expensive pitfalls (opinion sprawl and skill-plugin drift). This phase is foundational; getting it wrong means rework across both artifacts.
**Delivers:** Structured opinion registry (15-25 opinions), each classified as lint-enforceable or skill-only, with rationale and Do/Don't examples. Establishes the project structure including `docs/opinions/`, `skill/`, and `eslint-plugin/` directories.
**Addresses:** Type vs interface, enum stance, unknown over any, type assertions, strict null handling, async discipline, named exports, naming conventions, const by default, tsconfig recommendations
**Avoids:** Opinion sprawl (hard budget established here), skill-plugin drift (registry established here)

### Phase 2: Claude Skill
**Rationale:** The skill is the primary value delivery and can be authored independently of any build infrastructure. It is also the spec that informs how ESLint rules should behave and what their error messages should say. Authoring it before rules ensures rules implement what the skill teaches.
**Delivers:** Complete `SKILL.md` (under 500 lines) with YAML frontmatter, plus `references/*.md` for each opinion category (type-patterns, code-structure, async-patterns, error-handling, module-organization). Includes before/after code examples per opinion.
**Addresses:** All P1 features from the feature matrix related to skill content; error handling guidance; discriminated union best practices; advanced TS pitfalls (variance, conditional types, branded types)
**Avoids:** Context window toxicity (progressive disclosure from the start), opinion drift (skill directly reflects opinion corpus)

### Phase 3: ESLint Plugin Scaffold
**Rationale:** Infrastructure before rules. The plugin skeleton — build tooling, test runner, peer dep configuration, plugin entry point structure — should be proven before writing any rules. This is the cheapest phase to get wrong and cheapest to fix.
**Delivers:** Working `eslint-plugin/` package with tsup build, Vitest + rule-tester configured, flat config plugin export pattern, peer dependency declarations (eslint `^9||^10`, @typescript-eslint/parser `^8`), CI running ESLint 10 tests.
**Uses:** tsup 8.5.x, Vitest 4.1.x, @typescript-eslint/utils ^8.57.0, @typescript-eslint/rule-tester ^8.57.0
**Avoids:** ESLint version targeting problems (ESLint 10 CI established here, deprecated API patterns caught early)

### Phase 4: Core ESLint Rules
**Rationale:** With opinions defined, skill authored, and plugin scaffold proven, custom rules have a clear spec and a working harness. This phase implements the custom rules that existing plugins cannot provide — the rules that distinguish the plugin from "just configure typescript-eslint strict."
**Delivers:** 3-5 custom rules: `no-enum-declaration` (enum ban, prefer `as const` + type union), `require-typed-catch` (unknown in catch), `require-discriminant` (DU discriminant field), plus configured typescript-eslint strict rules in the plugin. All rules have 2-3x valid vs invalid test cases.
**Implements:** `eslint-plugin/src/rules/`, `eslint-plugin/src/configs/recommended.ts`, `eslint-plugin/src/configs/recommended-type-checked.ts`
**Avoids:** False positive erosion (valid edge-case test discipline enforced), type-aware performance traps (each rule classified as AST-only vs type-aware)

### Phase 5: Publishing and Distribution
**Rationale:** Last-mile concerns after all content and rules are verified. Changesets workflow, npm publication, skill registry publication if the registry is ready.
**Delivers:** Published `eslint-plugin-typescript-narrows` on npm with semantic versioning via changesets. SKILL.md deployable to `.claude/skills/` or skill registry. README with installation instructions and migration guide.
**Addresses:** npm publication (P1), skill registry publication (P2), flat config install example

### Phase Ordering Rationale

- Phase 1 before everything: both the skill and ESLint rules derive from opinions; defining opinions first prevents rework
- Phase 2 (skill) before Phase 4 (rules): the skill is the spec for rule behavior and error messages; authoring skill first ensures consistency
- Phase 3 (scaffold) can overlap with Phase 2: build infrastructure does not depend on opinion content; running in parallel saves time
- Phase 4 before Phase 5: nothing to publish until rules are written and tested
- This ordering directly follows the build-order dependency graph documented in ARCHITECTURE.md

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4 (Core ESLint Rules):** The discriminated union discriminant rule requires deep AST analysis and type-aware linting; the specific AST selectors and type checker calls need per-rule research. The error handling rules (if included) require careful design to avoid false positives on legitimate throw patterns.
- **Phase 1 (Opinion Foundation):** The opinion registry format (YAML vs JSON vs structured markdown) and the specific CI enforcement mechanism are design decisions with multiple valid approaches; a brief research spike on how similar projects (e.g., microsoft/TypeScript, xojs/xo) structure their configs is worthwhile.

Phases with standard patterns (skip research-phase):
- **Phase 2 (Claude Skill):** Skill format is fully documented by Anthropic. Structure, frontmatter, and progressive disclosure patterns are well-established.
- **Phase 3 (Plugin Scaffold):** The flat config plugin pattern is fully documented by typescript-eslint and ESLint. The tsup + Vitest setup is standard for TS library projects.
- **Phase 5 (Publishing):** Changesets + npm publish is a well-documented, solved problem.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All sources are official documentation (typescript-eslint, ESLint, Anthropic). Version compatibility table verified against official docs. |
| Features | HIGH | Feature set derived from competitor analysis (typescript-eslint strict, XO, Google TS guide, ts-reset) plus the Claude skill format docs. Clear gaps identified. |
| Architecture | HIGH | Plugin architecture pattern is the official typescript-eslint recommendation. Skill structure follows Anthropic's documented best practices. Two-artifact model with shared corpus is the natural design. |
| Pitfalls | HIGH | Pitfalls sourced from official performance docs, ESLint v9 retrospective, real-world linter adoption research, and the specific ESLint 10 migration guide. All are verified, non-speculative risks. |

**Overall confidence:** HIGH

### Gaps to Address

- **Opinion selection:** The research identifies 15-25 opinions as the right budget but does not enumerate exactly which 15-25. The Phase 1 planning task must finalize the opinion list against the "prevents real, recurring problems" bar before any authoring begins.
- **Custom rule complexity for DU enforcement:** Whether the discriminated union discriminant rule is achievable with acceptable false-positive rates depends on real AST experimentation. This is an implementation-time question that research cannot fully resolve; design the rule in Phase 4 with an explicit "ship as warn first" policy.
- **Skill discovery validation:** The optimal SKILL.md description for triggering Claude on TypeScript tasks has not been empirically tested. Phase 2 should include multi-model testing (Haiku, Sonnet, Opus) before the skill is considered done.
- **Performance budget on type-aware rules:** The "under 10 seconds for a 500-file project" budget is the stated target; actual feasibility depends on which rules need type information. Establish the performance baseline in Phase 3 before writing type-aware rules in Phase 4.

## Sources

### Primary (HIGH confidence)
- [typescript-eslint Dependency Versions](https://typescript-eslint.io/users/dependency-versions/) — peer dep ranges, ESLint/TS/Node compatibility
- [typescript-eslint ESLint Plugins Guide](https://typescript-eslint.io/developers/eslint-plugins/) — plugin structure, RuleCreator, peer deps
- [typescript-eslint Custom Rules](https://typescript-eslint.io/developers/custom-rules/) — rule creation patterns, type-aware rules
- [@typescript-eslint/rule-tester](https://typescript-eslint.io/packages/rule-tester/) — testing rules with flat config
- [ESLint v10.0.0 Release](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/) — breaking changes, Node.js requirements, flat config only
- [ESLint v10 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0) — API removals affecting plugin authors
- [Anthropic Skills Repository](https://github.com/anthropics/skills) — skill format, SKILL.md structure
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) — skill activation, frontmatter
- [Anthropic Skill Authoring Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) — context window budgets, progressive disclosure
- [typescript-eslint Typed Linting Performance](https://typescript-eslint.io/troubleshooting/typed-linting/performance/) — performance profiling guidance
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) — competitor feature analysis
- [ESLint Plugin Migration to Flat Config](https://eslint.org/docs/latest/extend/plugin-migration-flat-config) — flat config plugin object structure

### Secondary (MEDIUM confidence)
- [tsup npm](https://www.npmjs.com/package/tsup) — v8.5.1 bundler for TS libraries
- [Vitest](https://vitest.dev/) — v4.1.0 test framework
- [changesets](https://github.com/changesets/changesets) — versioning and changelog management
- [XO ESLint wrapper](https://github.com/xojs/xo) — competitor feature analysis
- [ts-reset by Matt Pocock](https://github.com/mattpocock/ts-reset) — competitor feature analysis
- [ESLint v9.0.0 Retrospective](https://eslint.org/blog/2025/05/eslint-v9.0.0-retrospective/) — lessons from breaking changes
- [Why Developers Hate Linters (CodeRabbit)](https://www.coderabbit.ai/blog/why-developers-hate-linters) — false positive erosion research

---
*Research completed: 2026-03-16*
*Ready for roadmap: yes*
