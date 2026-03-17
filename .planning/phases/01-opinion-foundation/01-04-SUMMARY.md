---
phase: 01-opinion-foundation
plan: 04
subsystem: docs
tags: [markdown, yaml-frontmatter, opinion-corpus, typescript, immutability, modules, discriminated-unions, generics, branded-types]

# Dependency graph
requires:
  - phase: 01-01
    provides: "docs/opinions/ directory, README.md, INDEX.md with all 50 opinion slugs"
provides:
  - "17 opinion files covering immutability, module organization, discriminated unions, generics, and branded types"
  - "3 custom lint opinions (ban-barrel-files, single-discriminant, no-destructure-before-narrow) for Phase 4 custom rule development"
  - "Complete 50-opinion corpus in docs/opinions/"
affects: [02-skill, 03-scaffold, 04-rules]

# Tech tracking
tech-stack:
  added: []
  patterns: [custom-lint-opinion-format, skill-only-opinion-format]

key-files:
  created:
    - docs/opinions/prefer-const.md
    - docs/opinions/no-var.md
    - docs/opinions/prefer-readonly.md
    - docs/opinions/prefer-readonly-params.md
    - docs/opinions/no-mutable-exports.md
    - docs/opinions/named-exports-only.md
    - docs/opinions/ban-barrel-files.md
    - docs/opinions/explicit-imports.md
    - docs/opinions/no-circular-deps.md
    - docs/opinions/single-discriminant.md
    - docs/opinions/no-destructure-before-narrow.md
    - docs/opinions/exhaustive-discrimination.md
    - docs/opinions/constrain-generics.md
    - docs/opinions/no-unnecessary-generics.md
    - docs/opinions/prefer-generics-over-overloads.md
    - docs/opinions/variance-annotations.md
    - docs/opinions/branded-types.md
  modified: []

key-decisions:
  - "ESLint core rules (prefer-const, no-var) use unprefixed rule names in lint field"
  - "eslint-plugin-import rules (no-mutable-exports, no-default-export, no-cycle) use import/ prefix"
  - "Skill-only opinions omit the lint field entirely rather than including an empty one"

patterns-established:
  - "Custom lint opinions use type: custom with no rule field"
  - "Skill-only opinions have enforcement: skill-only and no lint section"
  - "Related fields cross-reference valid opinion IDs from INDEX.md"

requirements-completed: [OPIN-02, OPIN-03]

# Metrics
duration: 3min
completed: 2026-03-17
---

# Phase 01 Plan 04: Immutability, Modules, Unions, Generics & Branded Types Summary

**17 opinion files completing the 50-opinion corpus: immutability (5), module organization (4), discriminated unions (3), generics (4), and branded types (1)**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-17T13:51:16Z
- **Completed:** 2026-03-17T13:54:40Z
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments
- Authored 9 immutability and module organization opinions including ESLint core rules (prefer-const, no-var), import plugin rules, and the custom ban-barrel-files opinion
- Authored 8 discriminated union, generics, and branded types opinions including 2 custom lint opinions (single-discriminant, no-destructure-before-narrow) for Phase 4
- Completed the full 50-opinion corpus in docs/opinions/ with correct frontmatter, body sections, and cross-references

## Task Commits

Each task was committed atomically:

1. **Task 1: Author Immutability & Const opinions (5) and Module Organization opinions (4)** - `7e12a17` (feat)
2. **Task 2: Author Discriminated Unions (3), Generics (4), and Branded Types (1) opinions** - `1be5fbf` (feat)

## Files Created/Modified
- `docs/opinions/prefer-const.md` - Use const by default; let only when reassigned
- `docs/opinions/no-var.md` - Never use var
- `docs/opinions/prefer-readonly.md` - Mark class properties readonly when not reassigned
- `docs/opinions/prefer-readonly-params.md` - Use Readonly<T> and ReadonlyArray<T> in function params
- `docs/opinions/no-mutable-exports.md` - Do not export mutable bindings
- `docs/opinions/named-exports-only.md` - Use named exports; ban default exports
- `docs/opinions/ban-barrel-files.md` - Do not use barrel files (custom lint)
- `docs/opinions/explicit-imports.md` - Import from the source module (skill-only)
- `docs/opinions/no-circular-deps.md` - Avoid circular dependencies
- `docs/opinions/single-discriminant.md` - Use a single type/kind field as discriminant (custom lint)
- `docs/opinions/no-destructure-before-narrow.md` - Do not destructure before narrowing (custom lint)
- `docs/opinions/exhaustive-discrimination.md` - Always handle all variants of a discriminated union
- `docs/opinions/constrain-generics.md` - Always constrain generic type parameters (skill-only)
- `docs/opinions/no-unnecessary-generics.md` - Do not add type parameters used only once
- `docs/opinions/prefer-generics-over-overloads.md` - Use generics instead of overloads (skill-only)
- `docs/opinions/variance-annotations.md` - Use in/out variance annotations (skill-only)
- `docs/opinions/branded-types.md` - Use branded types for domain IDs (skill-only)

## Decisions Made
- ESLint core rules (prefer-const, no-var) use unprefixed rule names -- not @typescript-eslint/ prefixed
- eslint-plugin-import rules use import/ prefix (no-mutable-exports, no-default-export, no-cycle)
- Skill-only opinions omit the lint field entirely for clean frontmatter

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Full 50-opinion corpus is complete in docs/opinions/
- 3 custom lint opinions (ban-barrel-files, single-discriminant, no-destructure-before-narrow) ready for Phase 4 custom rule development
- All opinion frontmatter has correct lint mappings for Phase 3 ESLint plugin configuration
- No blockers for Phase 2 (Skill) or Phase 3 (Scaffold)

## Self-Check: PASSED

All 17 opinion files verified present. Both task commits (7e12a17, 1be5fbf) verified in git log.

---
*Phase: 01-opinion-foundation*
*Completed: 2026-03-17*
