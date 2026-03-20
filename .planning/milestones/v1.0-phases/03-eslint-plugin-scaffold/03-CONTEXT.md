# Phase 3: ESLint Plugin Scaffold - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a working ESLint plugin package with build tooling, test infrastructure, flat config exports, and a strict config preset that extends typescript-eslint strict-type-checked with opinionated rule configurations. Prove the entire pipeline works (build, test, config activation) before any real custom rules are written. Custom rules are Phase 4; coverage validation and publishing are Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Package structure
- Plugin code lives in `eslint-plugin/` at repo root (alongside `docs/` and `skill/`)
- npm package name: `eslint-plugin-typescript-narrows`
- Standalone package — no build-time dependency on `docs/opinions/` corpus files
- Opinion IDs are hardcoded in rule configs; Phase 5 (Coverage Validation) verifies completeness via the corpus `lint` field manifest
- Plugin has its own `package.json`, `tsconfig.json`, `src/`, and `tests/` directories

### Config preset design
- Single `strict` preset — no tiers, no recommended/base variants
- Preset includes typescript-eslint `strict-type-checked` config internally — users only import one thing
- User DX: `import tsNarrows from 'eslint-plugin-typescript-narrows'` → `...tsNarrows.configs.strict`
- typescript-eslint rules NOT covered by corpus opinions pass through with their strict-type-checked defaults
- Preset only overrides rules where the corpus has a specific opinion
- Stylistic rules from the corpus are included (consistent-type-imports, prefer-interface, etc.) — eliminating ambiguity is the whole point
- Only opinions tagged `both` (lint-enforceable) appear in the preset; `skill-only` opinions are not configured

### Rule message style
- Custom rules (Phase 4) get Narrows-style messages: opinion stance + opinion ID, e.g., "Avoid explicit `any` — use `unknown` instead. (no-explicit-any)"
- Existing typescript-eslint rules keep their default messages — no overrides
- Opinion ID in parentheses at end of message for easy lookup

### Build & test tooling
- Build: tsup — produces CJS + ESM + .d.ts type declarations
- Test: Vitest + @typescript-eslint/rule-tester (per success criteria)
- Integration smoke test that loads the preset into ESLint flat config, lints a sample .ts file, and verifies expected violations fire
- Placeholder custom rule included to prove rule-writing infrastructure (build pipeline, rule-tester setup, plugin registration) works before Phase 4
- Minimum Node.js version: 18+ (matches ESLint 9's requirement of 18.18+)
- Peer dependencies: eslint ^9 || ^10, @typescript-eslint/parser ^8

### Claude's Discretion
- Exact tsup configuration details
- Placeholder custom rule implementation (trivial rule to prove infrastructure)
- Internal directory structure within `eslint-plugin/src/` (rules/, configs/, etc.)
- Test file organization patterns
- Exact smoke test sample file content

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Opinion corpus (rule manifest)
- `docs/opinions/INDEX.md` — Master registry of all 59 opinions with severity/enforcement tags. The `[both]` tagged opinions define which rules the preset must configure.
- `docs/opinions/README.md` — Frontmatter field reference including the `lint` field schema (`type: existing` + `rule` or `type: custom`)

### Project requirements
- `.planning/REQUIREMENTS.md` — LINT-01 through LINT-05 define ESLint plugin infrastructure requirements
- `.planning/PROJECT.md` — Core value, constraints, key decisions (build on typescript-eslint strict)

### Prior phase context
- `.planning/phases/01-opinion-foundation/01-CONTEXT.md` — Phase 1 decisions on opinion format, lint field schema, enforcement tagging
- `.planning/phases/02-claude-skill/02-CONTEXT.md` — Phase 2 decisions on skill structure (skill serves as behavioral spec for rule behavior in Phase 4)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `docs/opinions/*.md` (59 files) — Each opinion with `lint` frontmatter field specifying `type: existing` + `rule: "<name>"` or `type: custom`. This is the manifest of which rules to configure in the preset.
- `docs/opinions/INDEX.md` — Groups opinions by topic with severity/enforcement tags. Can inform how rules are organized in preset config.

### Established Patterns
- ESLint core rules use unprefixed rule names; import plugin rules use `import/` prefix (Phase 1 decision)
- `no-const-enum` lint field set to `type: custom` since const enum ban is part of broader `ban-enums` custom rule (Phase 1 decision)
- `no-empty-catch` uses ESLint core `no-empty` rule, not `@typescript-eslint` prefix (Phase 1 decision)

### Integration Points
- Plugin preset will configure rules from: ESLint core, @typescript-eslint, eslint-plugin-import (based on corpus lint fields)
- Phase 4 will add custom rules into this scaffold's plugin registration and preset config
- Phase 5 will validate that every `[both]`-tagged opinion has a corresponding rule in the preset

</code_context>

<specifics>
## Specific Ideas

- Coverage validation between corpus and plugin is explicitly deferred to Phase 5 — but the corpus `lint` field serves as the authoritative manifest
- The user wants confirmation that unscoped plugins work in flat config (they do — flat config uses direct module imports)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-eslint-plugin-scaffold*
*Context gathered: 2026-03-17*
