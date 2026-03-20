# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-20
**Phases:** 7 | **Plans:** 19

### What Was Built
- 59-opinion TypeScript corpus with severity tiers, rationale, and code examples
- Claude skill with progressive disclosure (SKILL.md index + 15 reference files)
- ESLint plugin with strict preset, 2 custom rules (ban-enums, ban-barrel-files), CJS/ESM builds
- Full traceability matrix mapping all opinions to skill sections and/or lint rules
- Automated version injection, publish-ready packaging for both artifacts

### What Worked
- Opinion corpus as single source of truth worked exceptionally well — skill and plugin derived cleanly
- 4-day timeline for full v1 (opinion definition through publish-ready packaging)
- Parallel execution of Phases 2 and 3 (skill and scaffold have no dependency on each other)
- Gap closure phases (6-7) caught real integration issues that would have been embarrassing post-publish

### What Was Inefficient
- ROADMAP.md phase checkboxes got out of sync with actual completion (Phases 2, 3, 5 show incomplete in roadmap despite having all summaries)
- Skill directory rename cascaded across many files — should have locked naming earlier
- Traceability script's 3-word heading-overlap heuristic proved fragile (5 false attributions)

### Patterns Established
- Opinion file format: YAML frontmatter with stance, rationale, severity, enforcement, code examples
- Progressive disclosure skill structure: index + reference files
- tsup define for build-time version injection
- Flat config only (no legacy .eslintrc support)

### Key Lessons
1. Lock naming conventions before building multiple artifacts that reference each other
2. Gap closure phases are worth the overhead — catching INT issues before release prevents cascading fixes
3. Traceability should use exact slug matching, not fuzzy heuristics

### Cost Observations
- Model mix: primarily opus for planning/execution, sonnet for research agents
- Notable: 19 plans completed in ~4 days with minimal rework

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 7 | 19 | First milestone — established corpus-first workflow |

### Cumulative Quality

| Milestone | Tests | Coverage | Custom Rules |
|-----------|-------|----------|-------------|
| v1.0 | 37 (vitest) | 59/59 opinions traced | 2 (ban-enums, ban-barrel-files) |

### Top Lessons (Verified Across Milestones)

1. Lock naming and directory structure before building cross-referencing artifacts
2. Gap closure phases catch real issues — budget time for them
