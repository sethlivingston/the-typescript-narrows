# The TypeScript Narrows

## What This Is

An opinionated TypeScript guidance ecosystem for AI coding agents. It consists of a Claude skill that AI agents consult when generating or refactoring TypeScript code — providing strong opinions on patterns, pitfalls, and practices — plus an ESLint plugin that mechanically enforces the automatable subset of those opinions. Framework and platform agnostic.

## Core Value

Eliminate the "5 ways to skin a cat" problem in TypeScript by providing a single, well-reasoned opinion for every common decision point, so AI agents produce consistent, idiomatic, pitfall-free code.

## Requirements

### Validated

- [x] Claude skill with comprehensive TypeScript opinions — Validated in Phases 1-2
- [x] ESLint plugin enforcing the automatable subset of skill opinions — Validated in Phases 3-5
- [x] Lint rules composable with other custom rules (standard ESLint plugin architecture) — Validated in Phase 3
- [x] Building on typescript-eslint strict config as a foundation — Validated in Phase 3
- [x] Skill and plugin paths consistent after directory restructuring — Validated in Phase 6
- [x] ESLint plugin meta.version synced with package.json via build-time injection — Validated in Phase 7
- [x] SKILL.md covers all 59 corpus opinions — Validated in Phase 7

### Active

- [ ] Skill publishable to Claude skill registry/marketplace
- [ ] Lint rules publishable on npm

### Out of Scope

- Project scaffolding or code generation — the skill is reference/guidance only, not a generator
- Oxlint rules — deferred until ESLint plugin is proven (v2)
- Framework-specific opinions (React, Next.js, Express, etc.) — must remain agnostic
- Runtime type validation (Zod, io-ts) — opinions on usage but no custom runtime tooling

## Context

- The TypeScript ecosystem suffers from too many valid approaches to the same problem (interfaces vs types, enums vs const objects, namespace patterns, error handling styles, etc.)
- AI coding agents amplify this inconsistency because they draw from diverse training data and produce different patterns across sessions
- A Claude skill is a markdown-based instruction set that AI agents load when relevant, shaping how they write code
- typescript-eslint's strict config provides a solid foundation but doesn't cover all the opinion areas needed
- Matt Pocock's ts-reset is adjacent art (fixes TS built-in types) but different in scope — this project is about coding patterns and practices, not type definitions

## Constraints

- **Platform**: Must work with any claude-skill-compatible AI coding tool, not just Claude Code
- **Distribution**: Dual distribution — skill on Claude registry, ESLint plugin on npm
- **Compatibility**: ESLint plugin must work alongside existing ESLint configs and custom rules
- **Agnostic**: No framework, runtime, or platform assumptions in opinions or rules

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| No scaffolding — guidance only | Skill should shape AI behavior, not generate boilerplate | — Pending |
| ESLint before Oxlint | ESLint has broader adoption; prove opinions first, then port | — Pending |
| Build on typescript-eslint strict | Don't reinvent existing good opinions; extend and fill gaps | — Pending |
| Comprehensive v1 | Full opinion set + matching lint rules for all automatable opinions | — Pending |

---
*Last updated: 2026-03-19 after Phase 7 completion*
