---
phase: 01-opinion-foundation
plan: 03
subsystem: docs
tags: [markdown, yaml-frontmatter, opinion-corpus, typescript, null-handling, async, error-handling, conditional-types]

# Dependency graph
requires:
  - "01-01: docs/opinions/ directory, README.md, INDEX.md"
provides:
  - "16 opinion files: null handling (6), async (5), error handling (4), conditional types (1)"
  - "Runtime safety opinion batch covering the patterns most likely to prevent production bugs"
affects: [01-04, 02-skill, 03-scaffold, 04-rules]

# Tech tracking
tech-stack:
  added: []
  patterns: [opinion-file-format, severity-tiers, enforcement-tagging]

key-files:
  created:
    - docs/opinions/exhaustive-switch.md
    - docs/opinions/prefer-optional-chaining.md
    - docs/opinions/no-unnecessary-condition.md
    - docs/opinions/prefer-nullish-coalescing.md
    - docs/opinions/use-type-narrowing.md
    - docs/opinions/strict-null-checks.md
    - docs/opinions/no-floating-promises.md
    - docs/opinions/no-misused-promises.md
    - docs/opinions/require-await.md
    - docs/opinions/return-await.md
    - docs/opinions/prefer-async-await.md
    - docs/opinions/typed-errors.md
    - docs/opinions/result-over-throw.md
    - docs/opinions/error-discrimination.md
    - docs/opinions/no-empty-catch.md
    - docs/opinions/conditional-type-safety.md
  modified: []

key-decisions:
  - "Enforcement count is 10 both / 6 skill-only (plan verification text said 11/5 but per-opinion specs total 10/6)"
  - "no-empty-catch uses ESLint core 'no-empty' rule rather than a @typescript-eslint rule"

patterns-established:
  - "Skill-only opinions omit the lint field entirely (no empty lint block)"
  - "Result<T, E> pattern defined in result-over-throw.md as canonical error handling approach"
  - "Conditional type wrapping pattern ([T] extends [string]) established for preventing unintended distribution"

requirements-completed: [OPIN-02, OPIN-03]

# Metrics
duration: 3min
completed: 2026-03-17
---

# Phase 01 Plan 03: Runtime Safety Opinions Summary

**16 opinion files covering null handling, async patterns, error handling, and conditional types with severity-based enforcement tagging**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-17T13:51:06Z
- **Completed:** 2026-03-17T13:54:22Z
- **Tasks:** 2
- **Files modified:** 16

## Accomplishments
- Authored 6 null handling & narrowing opinions covering exhaustive switches, optional chaining, unnecessary conditions, nullish coalescing, type narrowing guards, and strictNullChecks
- Authored 5 async & promises opinions covering floating promises, misused promises, require-await, return-await, and async/await preference
- Authored 4 error handling opinions covering typed errors, Result types, error discrimination, and empty catch blocks
- Authored 1 conditional types opinion covering distributive conditional type prevention

## Task Commits

Each task was committed atomically:

1. **Task 1: Author Null Handling & Async opinions (11)** - `2412e5e` (feat)
2. **Task 2: Author Error Handling & Conditional Types opinions (5)** - `cf75f28` (feat)

## Files Created/Modified
- `docs/opinions/exhaustive-switch.md` - Handle all cases in discriminated union switches
- `docs/opinions/prefer-optional-chaining.md` - Use optional chaining over manual null checks
- `docs/opinions/no-unnecessary-condition.md` - Do not write conditions that are always true or false
- `docs/opinions/prefer-nullish-coalescing.md` - Use ?? instead of || for nullish fallbacks
- `docs/opinions/use-type-narrowing.md` - Narrow types with guards instead of assertions
- `docs/opinions/strict-null-checks.md` - Enable strictNullChecks (never disable)
- `docs/opinions/no-floating-promises.md` - Always handle Promise rejections
- `docs/opinions/no-misused-promises.md` - Do not pass Promises where void is expected
- `docs/opinions/require-await.md` - Do not mark functions async unless they use await
- `docs/opinions/return-await.md` - Always return await in try/catch blocks
- `docs/opinions/prefer-async-await.md` - Use async/await over .then() chains
- `docs/opinions/typed-errors.md` - Throw only Error subclasses, never primitives
- `docs/opinions/result-over-throw.md` - Prefer Result types for expected failures, throw for bugs
- `docs/opinions/error-discrimination.md` - Use discriminated union errors, not string messages
- `docs/opinions/no-empty-catch.md` - Do not silently swallow errors with empty catch blocks
- `docs/opinions/conditional-type-safety.md` - Wrap conditional types to prevent unintended distribution

## Decisions Made
- Enforcement count is 10 both / 6 skill-only (plan verification text said 11/5 but per-opinion specifications in the plan body total 10/6 -- followed per-opinion specs)
- no-empty-catch uses ESLint core "no-empty" rule rather than a @typescript-eslint/ prefixed rule, as specified in the plan

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 16 runtime safety opinions authored and committed
- Ready for Plan 01-04 (remaining opinion batches) or downstream phases
- Cross-references in `related` fields link to opinions from other plans (01-02)
- No blockers for subsequent plans

## Self-Check: PASSED

- All 16 opinion files exist in docs/opinions/
- Commit 2412e5e (Task 1) verified
- Commit cf75f28 (Task 2) verified
- SUMMARY.md exists at expected path

---
*Phase: 01-opinion-foundation*
*Completed: 2026-03-17*
