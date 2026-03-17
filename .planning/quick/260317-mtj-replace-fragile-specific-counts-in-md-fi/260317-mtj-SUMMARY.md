---
phase: quick/260317-mtj
plan: 01
subsystem: docs
tags: [markdown, documentation, maintenance]

requires: []
provides:
  - Consumer-facing .md files with durable approximate counts
affects: []

tech-stack:
  added: []
  patterns:
    - "Use approximate counts (over 50, 20+, 30+) in consumer-facing docs instead of specific numbers"

key-files:
  created: []
  modified:
    - README.md
    - eslint-plugin/README.md
    - skill/the-typescript-narrows/README.md
    - docs/opinions/INDEX.md

key-decisions:
  - "INDEX.md summary section simplified to list categories without counts, since the full list is visible above"

patterns-established:
  - "Approximate counts in docs: use 'over 50', '20+', '30+', 'over half' instead of exact numbers"

requirements-completed: []

duration: 1min
completed: 2026-03-17
---

# Quick Task 260317-mtj: Replace Fragile Specific Counts Summary

**Replaced all hardcoded opinion/rule counts in four consumer-facing .md files with approximate language (over 50, 20+, 30+, over half)**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-17T21:27:45Z
- **Completed:** 2026-03-17T21:29:10Z
- **Tasks:** 1
- **Files modified:** 4

## Accomplishments
- Replaced 59/35/32/24 specific counts with approximate language across all four consumer-facing .md files
- Simplified INDEX.md summary section to remove decorative counts
- All prose reads naturally with approximate language

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace fragile counts in all consumer-facing .md files** - `dddb747` (fix)

## Files Created/Modified
- `README.md` - Replaced "59 opinions" with "over 50 opinions", removed specific counts from artifact descriptions
- `eslint-plugin/README.md` - Replaced "24 rules" with "20+", "32 rules" with "30+", removed specific opinion counts
- `skill/the-typescript-narrows/README.md` - Replaced "59 guidelines" with "over 50", "35 of" with "over half of"
- `docs/opinions/INDEX.md` - Removed count from header line, simplified summary to categories only

## Decisions Made
- INDEX.md summary section: removed all specific counts (59, 25, 25, 9, 35, 24) and simplified to just list the category names, since the reader can see the full categorized list directly above

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Also replaced counts in INDEX.md summary section**
- **Found during:** Task 1
- **Issue:** Plan only mentioned INDEX.md line 3, but lines 119-121 also contained hardcoded counts (59, 25, 25, 9, 35, 24) that would break when opinions change
- **Fix:** Simplified summary section to list category names without specific counts
- **Files modified:** docs/opinions/INDEX.md
- **Verification:** grep confirms no specific counts remain
- **Committed in:** dddb747

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Essential for meeting success criteria of zero specific counts in consumer-facing files. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
N/A - standalone quick task.

---
*Quick Task: 260317-mtj*
*Completed: 2026-03-17*
