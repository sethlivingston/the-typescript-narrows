---
phase: 02-claude-skill
plan: 04
subsystem: skill
tags: [typescript, discriminated-unions, generics, branded-types, variance, tsconfig, conditional-types, claude-skill]

# Dependency graph
requires:
  - phase: 01-opinions
    provides: opinion corpus (source content for reference files)
  - phase: 02-claude-skill
    plan: 01
    provides: SKILL.md index with topic sections linking to reference files
provides:
  - discriminated-unions.md reference file (3 opinions)
  - generics.md reference file (5 opinions including branded types and variance)
  - tsconfig-advanced.md reference file (3 opinions including conditional types)
affects: [02-05-PLAN, 04-rules]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Skill reference file format: H1 title, H2 per opinion, Stance/Why/Do/Don't sections, --- separators"
    - "Merged small topic groups into combined reference files (branded types into generics, tsconfig + conditional types into tsconfig-advanced)"

key-files:
  created:
    - skill/the-typescript-narrows/references/discriminated-unions.md
    - skill/the-typescript-narrows/references/generics.md
    - skill/the-typescript-narrows/references/tsconfig-advanced.md
  modified: []

key-decisions:
  - "Used same skill-optimized format as described in plan: H1 title, H2 per opinion, Stance/Why/Do/Don't sections"
  - "Branded types and variance annotations merged into generics.md per research recommendation"
  - "tsconfig and conditional type safety merged into tsconfig-advanced.md per research recommendation"

patterns-established:
  - "Reference file format: H1 title, H2 per opinion with Stance/Why/Do/Don't/optional Exception, separated by ---"

requirements-completed: [SKIL-12, SKIL-15, SKIL-16, SKIL-17, SKIL-09, SKIL-10]

# Metrics
duration: 2min
completed: 2026-03-17
---

# Phase 2 Plan 4: Advanced References Summary

**11 opinions across discriminated unions, generics (with branded types and variance), and tsconfig/conditional types reference files**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-17T15:28:39Z
- **Completed:** 2026-03-17T15:30:42Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Created discriminated-unions.md with 3 opinions (single-discriminant, no-destructure-before-narrow, exhaustive-discrimination)
- Created generics.md with 5 opinions (constrain-generics, no-unnecessary-generics, prefer-generics-over-overloads, variance-annotations, branded-types)
- Created tsconfig-advanced.md with 3 opinions (strict-tsconfig, no-unchecked-index, conditional-type-safety)
- All 11 opinions have Stance, Why, Do, and Don't sections in skill-optimized format

## Task Commits

Each task was committed atomically:

1. **Task 1: Author discriminated-unions.md reference file** - `a640500` (feat)
2. **Task 2: Author generics.md and tsconfig-advanced.md reference files** - `59a1cae` (feat)

## Files Created/Modified
- `skill/the-typescript-narrows/references/discriminated-unions.md` - 3 discriminated union opinions
- `skill/the-typescript-narrows/references/generics.md` - 5 generics/branded types/variance opinions
- `skill/the-typescript-narrows/references/tsconfig-advanced.md` - 3 tsconfig/conditional type opinions

## Decisions Made
- Used same skill-optimized format as other reference files: H1 title, H2 per opinion, Stance/Why/Do/Don't sections separated by ---
- Branded types and variance annotations merged into generics.md per research recommendation
- tsconfig and conditional type safety merged into tsconfig-advanced.md per research recommendation

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 3 reference files created and linked from SKILL.md index
- Plan 02-05 (verification and polish) can proceed
- 11 opinions authored brings total skill reference content closer to complete coverage

## Self-Check: PASSED

All files verified present. All commit hashes verified in git log.

---
*Phase: 02-claude-skill*
*Completed: 2026-03-17*
