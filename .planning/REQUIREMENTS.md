# Requirements: The TypeScript Narrows

**Defined:** 2026-03-16
**Core Value:** Eliminate the "5 ways to skin a cat" problem in TypeScript by providing a single, well-reasoned opinion for every common decision point

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Opinion Corpus

- [x] **OPIN-01**: Enumerate the top 50 TypeScript "multiple ways to do it" ambiguities and gotchas as the canonical opinion list
- [x] **OPIN-02**: Each opinion has a clear stance, rationale ("because X"), and severity tier (bug prevention > maintenance > style)
- [x] **OPIN-03**: Each opinion is tagged as skill-only, lint-enforceable, or both
- [x] **OPIN-04**: Up to 50 opinions for v1 if the enumeration surfaces enough that warrant attention; no artificial cap

### Claude Skill — Table Stakes Opinions

- [x] **SKIL-01**: Type vs interface opinion (interfaces for object shapes, types for unions/intersections/utilities)
- [x] **SKIL-02**: Enum stance (ban enums, prefer `as const` object + type union)
- [x] **SKIL-03**: `any` elimination (`unknown` everywhere, migration guidance)
- [x] **SKIL-04**: Type assertion restrictions (when assertions are legitimate, when not)
- [x] **SKIL-05**: Strict null handling and narrowing patterns (guard functions, exhaustive checks)
- [x] **SKIL-06**: Promise/async discipline (floating promises, misused promises, return-await)
- [x] **SKIL-07**: `const` by default, naming conventions (camelCase, PascalCase rules)
- [x] **SKIL-08**: Named exports only (ban default exports, rationale)
- [x] **SKIL-09**: Strict tsconfig recommendations (`strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- [x] **SKIL-10**: "Why" rationale included per opinion so AI agents can relay reasoning

### Claude Skill — Differentiator Opinions

- [x] **SKIL-11**: Error handling patterns (Result types, discriminated union errors, error hierarchies, when to throw vs return)
- [x] **SKIL-12**: Discriminated union best practices (single discriminant field, exhaustive handling, narrowing-safe patterns)
- [x] **SKIL-13**: Readonly-by-default patterns (readonly params, ReadonlyArray, Readonly utility type)
- [x] **SKIL-14**: Module organization (ban barrel files, re-export patterns, import organization)
- [x] **SKIL-15**: Generic constraint patterns (generics vs overloads, tight constraints, avoid unnecessary type params)
- [x] **SKIL-16**: Branded/nominal type guidance (when to use, how to create, runtime validation at boundaries)
- [x] **SKIL-17**: Variance and conditional type pitfalls (distribution, `infer` patterns, variance annotations)

### Claude Skill — Format & Distribution

- [x] **SKIL-18**: Skill is pure markdown with YAML frontmatter following Anthropic skill spec
- [x] **SKIL-19**: SKILL.md under 500 lines using progressive disclosure (index + reference files)
- [x] **SKIL-20**: Framework and platform agnostic — no React, Next, Express, etc. opinions
- [x] **SKIL-21**: Publishable to Claude skill registry/marketplace

### ESLint Plugin — Infrastructure

- [ ] **LINT-01**: ESLint plugin targeting flat config only (ESLint v9+/v10)
- [ ] **LINT-02**: Pre-built strict config preset (single import, all opinions as defaults)
- [ ] **LINT-03**: Composable with existing typescript-eslint configs and other custom rules
- [ ] **LINT-04**: Opinionated configuration of typescript-eslint strict-type-checked rules (naming-convention, consistent-type-definitions, no-explicit-any, etc.)
- [ ] **LINT-05**: Published on npm as installable package

### ESLint Plugin — Custom Rules

- [ ] **LINT-06**: Custom rules evaluated and built per-phase as opinions are defined (not pre-committed to specific rules)
- [ ] **LINT-07**: Each custom rule covers a gap that existing typescript-eslint rules cannot address
- [ ] **LINT-08**: Custom rules have comprehensive test suites (2-3x more valid cases than invalid to prevent false positives)

### Coverage Validation

- [ ] **COVR-01**: All 50 enumerated TS ambiguities/gotchas from OPIN-01 are addressed by either the skill, a lint rule, or both
- [ ] **COVR-02**: Each item in the 50-item list has a traceability entry showing which artifact(s) address it
- [ ] **COVR-03**: Lint rules only exist where static analysis makes sense — no forced automation of guidance-only opinions

## v2 Requirements

### ESLint Enhancements

- **LINT-V2-01**: Autofix for all custom rules
- **LINT-V2-02**: Rule documentation site with examples, rationale, links to skill sections
- **LINT-V2-03**: Migration codemods from "unopinionated" codebases

### Oxlint

- **OX-01**: Port proven ESLint rules to Oxlint once plugin API stabilizes

### Skill Enhancements

- **SKIL-V2-01**: Skill variants for other AI platforms (Cursor, Copilot) if they adopt skill-like standards
- **SKIL-V2-02**: IDE extension surfacing skill opinions inline

## Out of Scope

| Feature | Reason |
|---------|--------|
| Project scaffolding / code generation | Skill is reference/guidance only — the AI agent IS the generator |
| Framework-specific opinions (React, Next, Express) | Must remain agnostic; framework plugins already exist |
| Runtime type validation tooling | Zod/Valibot already excellent; skill provides usage guidance only |
| Formatting rules (semicolons, quotes, indentation) | Solved by Prettier/Biome; ESLint deprecated formatting rules |
| Oxlint rules (v1) | Plugin API immature; prove opinions in ESLint first |
| Exhaustive rule configurability | Defeats the purpose — one preset, all-or-nothing by default |
| tsconfig.json management/generation | Different tool category; `@tsconfig/strictest` exists |
| Type-level computation lint rules | AST analysis of type-level code is too fragile |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| OPIN-01 | Phase 1 | Complete |
| OPIN-02 | Phase 1 | Complete |
| OPIN-03 | Phase 1 | Complete |
| OPIN-04 | Phase 1 | Complete |
| SKIL-01 | Phase 2 | Complete |
| SKIL-02 | Phase 2 | Complete |
| SKIL-03 | Phase 2 | Complete |
| SKIL-04 | Phase 2 | Complete |
| SKIL-05 | Phase 2 | Complete |
| SKIL-06 | Phase 2 | Complete |
| SKIL-07 | Phase 2 | Complete |
| SKIL-08 | Phase 2 | Complete |
| SKIL-09 | Phase 2 | Complete |
| SKIL-10 | Phase 2 | Complete |
| SKIL-11 | Phase 2 | Complete |
| SKIL-12 | Phase 2 | Complete |
| SKIL-13 | Phase 2 | Complete |
| SKIL-14 | Phase 2 | Complete |
| SKIL-15 | Phase 2 | Complete |
| SKIL-16 | Phase 2 | Complete |
| SKIL-17 | Phase 2 | Complete |
| SKIL-18 | Phase 2 | Complete |
| SKIL-19 | Phase 2 | Complete |
| SKIL-20 | Phase 2 | Complete |
| SKIL-21 | Phase 2 | Complete |
| LINT-01 | Phase 3 | Pending |
| LINT-02 | Phase 3 | Pending |
| LINT-03 | Phase 3 | Pending |
| LINT-04 | Phase 3 | Pending |
| LINT-05 | Phase 3 | Pending |
| LINT-06 | Phase 4 | Pending |
| LINT-07 | Phase 4 | Pending |
| LINT-08 | Phase 4 | Pending |
| COVR-01 | Phase 5 | Pending |
| COVR-02 | Phase 5 | Pending |
| COVR-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 36 total
- Mapped to phases: 36
- Unmapped: 0

---
*Requirements defined: 2026-03-16*
*Last updated: 2026-03-16 after roadmap creation*
