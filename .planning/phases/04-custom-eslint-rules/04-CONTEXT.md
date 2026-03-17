# Phase 4: Custom ESLint Rules - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement custom ESLint rules covering gaps that no existing plugin addresses, integrate them into the strict preset config, and test comprehensively. Custom rules are limited to patterns that existing typescript-eslint, eslint-plugin-import-x, and ESLint core rules cannot enforce. The two discriminated union rules (single-discriminant, no-destructure-before-narrow) are deferred due to type-aware AST complexity.

</domain>

<decisions>
## Implementation Decisions

### Rule scope
- **2 custom rules** for Phase 4: `ban-enums` and `ban-barrel-files`
- `ban-enums` is a single rule covering both `enum` and `const enum` declarations (no-const-enum is subsumed, per Phase 1 decision)
- `single-discriminant` and `no-destructure-before-narrow` are deferred to v2 — too complex for v1, kept as skill-only guidance
- The placeholder rule from Phase 3 is removed and replaced with real rules
- Both rules verified as genuine gaps — no existing mainstream ESLint rule covers either

### Rule strictness — ban-enums
- Flags any `enum` or `const enum` declaration
- No autofix for v1 (deferred to LINT-V2-01 per requirements)
- No configuration options — all-or-nothing

### Rule strictness — ban-barrel-files
- Only flags `index.ts`/`index.js` files where EVERY statement is a re-export (`export { x } from './y'`)
- Files with any original code (functions, classes, constants, types) are NOT flagged
- Only applies to files named `index.ts`, `index.js`, `index.mts`, `index.mjs` — not arbitrary re-export files
- Provides an `allowPatterns` schema option for paths like package entry points (e.g., `src/index.ts`)

### Error messages
- Format: stance + brief alternative + opinion ID in parentheses
- ban-enums: `"Do not use enums; use as const objects instead. (ban-enums)"`
- ban-barrel-files: `"Do not use barrel files; import from source modules directly. (ban-barrel-files)"`
- Same message for both `enum` and `const enum` (single messageId)

### Test strategy
- 2-3x more valid (should-pass) cases than invalid cases per rule
- ban-enums valid cases: as-const objects, type unions, string literals, const objects, interfaces, classes
- ban-enums invalid cases: basic enum, const enum, string enum, numeric enum
- ban-barrel-files valid cases: index.ts with original code, index.ts as allowed entry point, non-index files with re-exports, index.ts with mixed content
- ban-barrel-files invalid cases: pure re-export index.ts files
- Primary false positive concern: package entry points (covered by allowPatterns option)
- Integration test extending Phase 3 smoke test to verify both custom rules activate in the strict preset

### Claude's Discretion
- Internal AST visitor implementation details
- Exact allowPatterns schema format and glob matching approach
- Test file organization (co-located vs separate directory)
- How to detect "pure re-export" vs "mixed content" in barrel file analysis
- Whether to update the Phase 3 smoke test or create a new integration test

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Opinion corpus (rule definitions)
- `docs/opinions/ban-enums.md` — Enum ban stance, Do/Don't examples, `type: custom` lint field
- `docs/opinions/no-const-enum.md` — Const enum ban (subsumed by ban-enums rule), `type: custom` lint field
- `docs/opinions/ban-barrel-files.md` — Barrel file ban stance, Do/Don't examples, `type: custom` lint field
- `docs/opinions/INDEX.md` — Master registry of all 59 opinions with severity/enforcement tags

### Deferred rules (read for awareness, not implementation)
- `docs/opinions/single-discriminant.md` — Deferred to v2
- `docs/opinions/no-destructure-before-narrow.md` — Deferred to v2

### Plugin infrastructure (Phase 3 output)
- `eslint-plugin/src/utils/create-rule.ts` — RuleCreator utility with NarrowsRuleDocs interface
- `eslint-plugin/src/rules/index.ts` — Rule registration (replace placeholder with real rules)
- `eslint-plugin/src/configs/strict.ts` — Strict preset config (add custom rules here)
- `eslint-plugin/src/index.ts` — Plugin entry point

### Project requirements
- `.planning/REQUIREMENTS.md` — LINT-06, LINT-07, LINT-08 define custom rule requirements
- `.planning/phases/03-eslint-plugin-scaffold/03-CONTEXT.md` — Phase 3 decisions on message format, build tooling, test infrastructure

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `eslint-plugin/src/utils/create-rule.ts`: RuleCreator with `NarrowsRuleDocs` interface (opinionId, recommended, requiresTypeChecking fields)
- `eslint-plugin/src/rules/placeholder.ts`: Example of rule structure using createRule — replace with real rules
- `eslint-plugin/src/configs/strict.ts`: `createStrictConfig()` — add custom rule entries here
- `eslint-plugin/tests/`: Vitest + @typescript-eslint/rule-tester infrastructure proven in Phase 3

### Established Patterns
- Rule messages follow: "Stance + alternative + (opinion-id)" format
- Plugin uses type cast `as unknown as ESLint.Plugin['rules']` to bridge @typescript-eslint/utils and ESLint v10 types
- Config uses self-reference pattern (`plugin.configs!`) for plugin rules in preset
- Build: tsup (CJS + ESM + .d.ts), Test: Vitest

### Integration Points
- `eslint-plugin/src/rules/index.ts` — Register new rules (currently exports placeholder)
- `eslint-plugin/src/configs/strict.ts` — Add `'typescript-narrows/ban-enums': 'error'` and `'typescript-narrows/ban-barrel-files': 'error'` to preset
- Phase 3 smoke test — Extend to verify custom rules fire in preset

</code_context>

<specifics>
## Specific Ideas

- Both rules verified as genuine gaps — no existing typescript-eslint or import plugin rule covers either ban-enums or ban-barrel-files
- The allowPatterns option for ban-barrel-files is specifically for package entry points (the most common false positive)
- User confirmed: ambient `declare enum` and namespace-nested enums are NOT priority edge cases for v1

</specifics>

<deferred>
## Deferred Ideas

- **single-discriminant custom rule** — Deferred to v2 due to type-aware AST complexity. Stays as skill-only guidance.
- **no-destructure-before-narrow custom rule** — Deferred to v2 due to type-aware AST complexity. Stays as skill-only guidance.
- **Autofixes for all custom rules** — Deferred to LINT-V2-01 per requirements.

</deferred>

---

*Phase: 04-custom-eslint-rules*
*Context gathered: 2026-03-17*
