---
phase: 07-version-sync-and-skill-completeness
plan: 01
subsystem: build, skill
tags: [tsup, esbuild, define, version-injection, skill-index]

# Dependency graph
requires:
  - phase: 05-publish-readiness
    provides: ESLint plugin build pipeline and SKILL.md structure
provides:
  - Build-time version injection from package.json into ESLint plugin meta
  - Complete 59-opinion SKILL.md coverage
  - Correct exhaustive-switch categorization in INDEX.md
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Build-time constant injection via tsup define option"
    - "readFileSync + JSON.parse for package.json version reading in build config"

key-files:
  created: []
  modified:
    - eslint-plugin/tsup.config.ts
    - eslint-plugin/src/index.ts
    - eslint-plugin/vitest.config.ts
    - plugin/the-typescript-narrows/skills/typescript-narrows/SKILL.md
    - docs/opinions/INDEX.md

key-decisions:
  - "Used tsup define option with readFileSync for version injection (not import assertions)"
  - "Added PACKAGE_VERSION define to vitest.config.ts so tests can resolve the build-time constant"

patterns-established:
  - "Version sync: package.json is single source of truth, injected at build time via PACKAGE_VERSION constant"

requirements-completed: [LINT-05, SKIL-19]

# Metrics
duration: 2min
completed: 2026-03-20
---

# Phase 7 Plan 1: Version Sync and Skill Completeness Summary

**Build-time version injection via tsup define, plus 2 missing opinions added to reach 59-bullet SKILL.md coverage**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-20T00:53:55Z
- **Completed:** 2026-03-20T00:56:05Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- ESLint plugin meta.version now reads from package.json at build time (was hardcoded 0.9.0)
- SKILL.md reaches complete 59-opinion coverage with no-const-enum and exhaustive-switch
- exhaustive-switch correctly categorized under Discriminated Unions in INDEX.md

## Task Commits

Each task was committed atomically:

1. **Task 1: Add build-time version injection to ESLint plugin** - `05eac05` (feat)
2. **Task 2: Add missing opinions to SKILL.md and fix INDEX.md categorization** - `135bde3` (feat)

## Files Created/Modified
- `eslint-plugin/tsup.config.ts` - Added readFileSync import, pkg.version read, and define option
- `eslint-plugin/src/index.ts` - Replaced hardcoded version with PACKAGE_VERSION constant
- `eslint-plugin/vitest.config.ts` - Added PACKAGE_VERSION define for test environment
- `plugin/the-typescript-narrows/skills/typescript-narrows/SKILL.md` - Added no-const-enum and exhaustive-switch bullets
- `docs/opinions/INDEX.md` - Moved exhaustive-switch from Null Handling to Discriminated Unions

## Decisions Made
- Used tsup define option with readFileSync + JSON.parse for maximum compatibility (not import assertions)
- Added PACKAGE_VERSION define to vitest.config.ts as well, since vitest imports source directly and needs the constant defined

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added PACKAGE_VERSION define to vitest.config.ts**
- **Found during:** Task 1 (build-time version injection)
- **Issue:** Tests import source directly (not built output), so PACKAGE_VERSION was undefined at test time
- **Fix:** Added matching define block to vitest.config.ts with same readFileSync approach
- **Files modified:** eslint-plugin/vitest.config.ts
- **Verification:** npm test passes (31 tests, 4 suites)
- **Committed in:** 05eac05 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential for test suite to pass with build-time constant. No scope creep.

## Issues Encountered
- Pre-existing typecheck failure in ban-barrel-files.ts (cannot find module 'node:path') -- unrelated to this plan's changes, confirmed by testing against clean main branch

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All gap-closure items addressed
- ESLint plugin version syncs with package.json automatically
- SKILL.md has complete opinion coverage

---
*Phase: 07-version-sync-and-skill-completeness*
*Completed: 2026-03-20*
