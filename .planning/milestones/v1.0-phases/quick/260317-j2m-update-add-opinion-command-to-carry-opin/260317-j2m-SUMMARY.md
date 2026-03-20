---
phase: quick/260317-j2m
plan: 01
subsystem: tooling
tags: [eslint, commands, scaffolding]

requires:
  - phase: 04-custom-eslint-rules
    provides: ESLint plugin structure and rule patterns
provides:
  - Complete add-opinion command with ESLint integration steps
affects: []

tech-stack:
  added: []
  patterns:
    - "Conditional steps in add-opinion command based on enforcement/lint.type"

key-files:
  created: []
  modified:
    - ".claude/commands/add-opinion.md"

key-decisions:
  - "Step 5 handles existing rules (config-only), Step 6 handles custom rules (full scaffolding)"

patterns-established:
  - "Custom rule inference fields: requiresTypeChecking, messageId, message"

requirements-completed: []

duration: 1min
completed: 2026-03-17
---

# Quick Task 260317-j2m: Update add-opinion command Summary

**Added ESLint integration steps (5-6) to add-opinion command for existing and custom rule scaffolding**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-17T18:46:34Z
- **Completed:** 2026-03-17T18:47:49Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Added Step 5 for wiring existing ESLint rules into strict config (conditional on enforcement: both + lint.type: existing)
- Added Step 6 for full custom rule scaffolding: rule file, test file, rules index wiring, strict config (conditional on enforcement: both + lint.type: custom)
- Renumbered old Step 5 (commit) to Step 7 with ESLint file staging awareness
- Extended Step 0 field inference with custom rule fields (requiresTypeChecking, messageId, message)
- Updated Step 0c preview to show custom rule fields when applicable
- Added ESLint-specific notes (reference existing rules, 2x valid/invalid ratio, run vitest)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add ESLint integration steps to add-opinion command** - `618210c` (feat)

## Files Created/Modified
- `.claude/commands/add-opinion.md` - Added Steps 5-6 for ESLint integration, renumbered commit to Step 7, extended inference fields and preview

## Decisions Made
- Step 5 handles existing rules (config-only change to strict.ts), Step 6 handles custom rules (full scaffolding with rule file, test file, wiring, and config)

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The add-opinion command now fully supports all three enforcement paths: skill-only (skips Steps 5-6), both+existing (runs Step 5), both+custom (runs Step 6)

---
*Phase: quick/260317-j2m*
*Completed: 2026-03-17*

## Self-Check: PASSED
