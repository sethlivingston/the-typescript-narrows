# Phase 6: Fix Skill Rename Cascade - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Commit the skill directory rename from `the-typescript-narrows` to `typescript-narrows` and fix all broken paths, links, and scripts that cascaded from it. The rename is already done in the working tree — this phase makes it official and ensures nothing is broken.

</domain>

<decisions>
## Implementation Decisions

### Path audit scope
- Fix runtime/build files and developer-facing workflow files (README.md, generate-traceability.mjs, CLAUDE.md, skill definitions, plugin files)
- DO NOT update planning docs (.planning/ CONTEXT.md files, ROADMAP.md) — leave as historical record
- Include CLAUDE.md and any skill/command definitions that reference old paths (e.g., `/add-opinion` workflow) so developer workflows stay functional

### Traceability reverification
- After fixing `generate-traceability.mjs` path, regenerate `docs/TRACEABILITY.md` and validate output
- If regeneration reveals coverage gaps (opinions not mapped to artifacts), fix them in this phase since COVR-01/02/03 are assigned here
- Script must exit cleanly with no errors on the new directory structure (success criterion #2)

### Atomicity
- All path fixes and the directory rename committed atomically (success criterion #1)
- Single logical commit: rename + all cascading path updates together

### Claude's Discretion
- Order of file edits within the atomic commit
- Exact grep/search strategy to find all broken references
- Whether to add a comment in generate-traceability.mjs noting the path convention

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Skill directory (new location)
- `plugin/the-typescript-narrows/skills/typescript-narrows/SKILL.md` — Renamed skill index file
- `plugin/the-typescript-narrows/skills/typescript-narrows/references/` — 15 reference files (all already moved)

### Plugin metadata
- `plugin/the-typescript-narrows/.claude-plugin/plugin.json` — Already updated: name field is `typescript-narrows`

### Known broken files
- `scripts/generate-traceability.mjs` line 113 — References old `skills/the-typescript-narrows/references` path
- `README.md` line 27 — References old `skills/the-typescript-narrows/SKILL.md` path
- `CLAUDE.md` — May reference old `skill/` paths in repo layout or `/add-opinion` instructions

### Coverage validation
- `docs/opinions/INDEX.md` — Master registry of all 59 opinions (source of truth for traceability)
- `docs/TRACEABILITY.md` — Must be regenerated after script fix

</canonical_refs>

<code_context>
## Existing Code Insights

### Current State
- `plugin/the-typescript-narrows/skills/typescript-narrows/` — New directory, untracked in git, contains SKILL.md + 15 reference files
- `plugin/the-typescript-narrows/skills/the-typescript-narrows/` — Old directory, files show as deleted (unstaged)
- `plugin.json` name field already updated to `typescript-narrows` (staged change)
- `eslint-plugin/package.json` and `eslint-plugin/README.md` have staged changes (from prior quick task scoping)

### Integration Points
- `scripts/generate-traceability.mjs` — Reads skill reference files to build traceability matrix; path on line 113 must be updated
- `README.md` — Project landing page links to SKILL.md; path must be updated
- `CLAUDE.md` — Developer workflow file; repo layout section and add-opinion skill may reference old paths

</code_context>

<specifics>
## Specific Ideas

- The git status already shows the rename as delete-old + add-new; `git add` both old and new paths so git detects it as a rename
- `eslint-plugin/README.md` and `eslint-plugin/package.json` already have staged changes from a prior quick task — be careful not to mix unrelated changes into the atomic commit

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-fix-skill-rename-cascade*
*Context gathered: 2026-03-19*
