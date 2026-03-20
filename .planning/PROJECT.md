# The TypeScript Narrows

## What This Is

An opinionated TypeScript guidance ecosystem shipped as two independent artifacts: a Claude skill (59 opinions in progressive-disclosure markdown) that AI coding agents consult when generating or refactoring TypeScript, plus an ESLint plugin (`@sethlivingston/eslint-plugin-typescript-narrows`) that mechanically enforces the 35 automatable opinions via a strict preset built on typescript-eslint. Framework and platform agnostic.

## Core Value

Eliminate the "5 ways to skin a cat" problem in TypeScript by providing a single, well-reasoned opinion for every common decision point, so AI agents produce consistent, idiomatic, pitfall-free code.

## Requirements

### Validated

- ✓ 59-opinion TypeScript corpus with severity tiers and enforcement tags — v1.0
- ✓ Claude skill with comprehensive TypeScript opinions (SKILL.md + 15 reference files) — v1.0
- ✓ ESLint plugin enforcing the automatable subset of skill opinions — v1.0
- ✓ Lint rules composable with other custom rules (standard ESLint plugin architecture) — v1.0
- ✓ Building on typescript-eslint strict config as a foundation — v1.0
- ✓ Custom ban-enums and ban-barrel-files rules covering gaps no existing plugin addresses — v1.0
- ✓ Full traceability matrix mapping all 59 opinions to skill sections and/or lint rules — v1.0
- ✓ Skill and plugin paths consistent after directory restructuring — v1.0
- ✓ ESLint plugin meta.version synced with package.json via build-time injection — v1.0
- ✓ SKILL.md covers all 59 corpus opinions — v1.0

### Active

- [ ] Skill publishable to Claude skill registry/marketplace
- [ ] Lint rules publishable on npm

### Out of Scope

- Project scaffolding or code generation — the skill is reference/guidance only, not a generator
- Oxlint rules — deferred until ESLint plugin is proven (v2)
- Framework-specific opinions (React, Next.js, Express, etc.) — must remain agnostic
- Runtime type validation (Zod, io-ts) — opinions on usage but no custom runtime tooling

## Context

Shipped v1.0 with 553 LOC TypeScript, 61 opinion corpus files, 17 plugin markdown files.
Tech stack: TypeScript, tsup, Vitest, ESLint v10, @typescript-eslint v8.
Both artifacts are structured for independent release: plugin via prefixed git tags (`plugin/v*`) and eslint-plugin via npm (`eslint-plugin/v*`).

Known cosmetic tech debt:
- Plugin README npm URL uses unscoped package name
- Traceability script attributes 5 opinions to wrong skill reference file (coverage status correct)
- Dead code in generate-traceability.mjs line 227

## Constraints

- **Platform**: Must work with any claude-skill-compatible AI coding tool, not just Claude Code
- **Distribution**: Dual distribution — skill on Claude registry, ESLint plugin on npm
- **Compatibility**: ESLint plugin must work alongside existing ESLint configs and custom rules
- **Agnostic**: No framework, runtime, or platform assumptions in opinions or rules

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| No scaffolding — guidance only | Skill should shape AI behavior, not generate boilerplate | ✓ Good |
| ESLint before Oxlint | ESLint has broader adoption; prove opinions first, then port | ✓ Good |
| Build on typescript-eslint strict | Don't reinvent existing good opinions; extend and fill gaps | ✓ Good |
| Comprehensive v1 | Full opinion set + matching lint rules for all automatable opinions | ✓ Good |
| Opinion corpus as single source of truth | Both skill and plugin derive from docs/opinions/ | ✓ Good |
| Progressive disclosure in skill | SKILL.md index + 15 reference files keeps main file under 500 lines | ✓ Good |
| tsup define for version injection | Build-time constant avoids runtime file reads | ✓ Good |
| Flat config only (ESLint v9+/v10) | No legacy .eslintrc support reduces maintenance burden | ✓ Good |
| Skill-only for non-automatable opinions | 24 opinions marked skill-only where static analysis impractical | ✓ Good |

---
*Last updated: 2026-03-20 after v1.0 milestone*
