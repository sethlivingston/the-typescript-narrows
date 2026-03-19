# Phase 7: Version Sync and Skill Completeness - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Sync the ESLint plugin meta.version with package.json, and add the 2 missing opinions to SKILL.md so it lists all 59 corpus opinions. Also move exhaustive-switch from Null Handling to Discriminated Unions in INDEX.md for correct categorization.

</domain>

<decisions>
## Implementation Decisions

### Version sync
- Target version is 1.0.0 (match package.json, which was intentionally bumped)
- Use build-time injection via tsup `define` or similar mechanism so index.ts reads version from package.json automatically
- This prevents future version drift — no more hardcoded version strings in source code

### Missing opinion placement
- Add `no-const-enum` as a separate bullet in the Type Declarations section of SKILL.md (not merged into ban-enums)
- Add `exhaustive-switch` as a separate bullet in the Discriminated Unions section of SKILL.md
- Move `exhaustive-switch` from Null Handling to Discriminated Unions in INDEX.md as well (it's not a null handling concern)
- Each corpus opinion gets a 1:1 bullet in SKILL.md — no merging related opinions

### Reference file link verification
- While touching SKILL.md, verify all 15 reference file links resolve correctly after the Phase 6 directory rename
- Fix any broken links found

### Claude's Discretion
- Exact tsup configuration for version injection (define, env, or import-based approach)
- Bullet wording for the 2 new SKILL.md entries (match existing style)
- Whether no-const-enum reference links to type-declarations.md or gets its own reference file (follow existing pattern)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### ESLint plugin (version sync)
- `eslint-plugin/package.json` — Source of truth for version (currently 1.0.0)
- `eslint-plugin/src/index.ts` — Plugin entry point with hardcoded meta.version (currently 0.9.0)
- `eslint-plugin/tsup.config.ts` — Build config where version injection would be added (if exists)

### Opinion corpus and skill
- `docs/opinions/INDEX.md` — Master registry of all 59 opinions; exhaustive-switch needs to move from Null Handling to Discriminated Unions
- `plugin/the-typescript-narrows/skills/typescript-narrows/SKILL.md` — Skill index (currently 57 bullets, needs 59)
- `plugin/the-typescript-narrows/skills/typescript-narrows/references/` — 15 reference files (verify links)

### Corpus files for missing opinions
- `docs/opinions/no-const-enum.md` — Corpus entry for the missing no-const-enum opinion
- `docs/opinions/exhaustive-switch.md` — Corpus entry for the missing exhaustive-switch opinion

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- SKILL.md follows a consistent pattern: one bullet per opinion, severity tag in brackets, "For rationale and examples:" link to reference file per section
- INDEX.md uses `- [opinion-name](file.md) -- Description [severity] [enforcement]` format

### Established Patterns
- Build: tsup (CJS + ESM + .d.ts) configured in eslint-plugin/
- Version 0.9.0 was set in Phase 5 as pre-1.0; package.json was subsequently bumped to 1.0.0
- ban-enums bullet currently reads "Ban enums (including `const enum`)" — the parenthetical covers const enum but no-const-enum should still be a separate bullet

### Integration Points
- `eslint-plugin/src/index.ts` line 10 — hardcoded `version: '0.9.0'` to be replaced with build-time injected value
- `eslint-plugin/package.json` — version source of truth
- tsup build pipeline — where version injection config goes

</code_context>

<specifics>
## Specific Ideas

- The user originally merged enum-related opinions but considers that a mistake in retrospect — this phase corrects that by giving no-const-enum its own bullet
- exhaustive-switch is semantically about discriminated unions, not null handling — fix the categorization in both INDEX.md and SKILL.md

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-version-sync-and-skill-completeness*
*Context gathered: 2026-03-19*
