# Phase 2: Claude Skill - Research

**Researched:** 2026-03-17
**Domain:** Agent Skills specification, progressive disclosure, content transformation
**Confidence:** HIGH

## Summary

Phase 2 transforms the 50-opinion corpus (completed in Phase 1) into a Claude skill that AI agents load when writing, refactoring, or reviewing TypeScript code. The skill follows the Agent Skills open standard (agentskills.io), which Claude Code and 30+ other agent products support. The format is straightforward: a `SKILL.md` file with YAML frontmatter (`name` and `description` required) plus markdown instructions, with optional `references/` files for progressive disclosure.

The primary challenge is compression and organization -- 50 opinion files averaging 40 lines each must be distilled into a SKILL.md under 500 lines (the recommended maximum) plus well-structured reference files. The skill must be opinionated and directive, not encyclopedic. Each opinion needs its stance, rationale, and code examples in a format optimized for AI agent scanning rather than human browsing.

The Agent Skills spec is intentionally minimal. The `name` must be lowercase-alphanumeric-hyphens, max 64 chars, matching the parent directory name. The `description` must be non-empty, max 1024 chars, third-person, and include both what the skill does and when to use it. Beyond frontmatter, the markdown body has no format restrictions -- "write whatever helps agents perform the task effectively." Claude Code extends the standard with optional fields like `disable-model-invocation`, `user-invocable`, `context`, and `agent`, but these are not needed for a reference/knowledge skill.

**Primary recommendation:** Create `skill/SKILL.md` as a concise index with a 10-20 line preamble, then list all 50 opinions grouped by topic with one-sentence stances. Move full opinion details (stance, why, do, don't) into `skill/references/*.md` files organized by topic group, keeping each reference file focused and independently loadable.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- SKILL.md is a concise index listing all 50 opinions with their one-sentence stance
- SKILL.md includes a brief usage guide preamble (10-20 lines) explaining what the skill is, how to apply opinions, severity tiers, and the global exception clause
- All opinions treated equally in the index -- no special highlight section for bug-prevention tier
- Reference files contain the full opinion details (stance, rationale, examples)
- Opinions are not treated as individual files in the skill -- they are grouped for AI agent consumption
- Skill-optimized format, not verbatim copies from the corpus -- tighter prose, imperative voice, structured for agent scanning
- The corpus (`docs/opinions/`) remains the source of truth; skill files are a derivative tailored for AI agents
- Include "Why" rationale per opinion (required by SKIL-10)
- Include both Do and Don't code examples
- Skill activates when the AI agent is writing, refactoring, or reviewing TypeScript code
- Claude-specific YAML frontmatter following the Anthropic skill spec
- Skill name: "The TypeScript Narrows"
- Tagline should convey the core value: eliminating the "multiple ways to do it" problem
- Skill files live in `skill/` directory at repo root: `skill/SKILL.md` + `skill/references/*.md`
- Phase 2 creates the files only -- no installation setup, no registry publishing (Phase 5)

### Claude's Discretion
- How to split opinions across reference files (one per topic group vs. other groupings -- optimize for AI agent retrieval)
- Which opinion exceptions to include vs. omit (balance between directive tone and preventing rigid application)
- Exact tagline wording
- Exact preamble content and length within the 10-20 line budget

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SKIL-01 | Type vs interface opinion | Opinion `prefer-interface` exists in corpus; skill must include stance + rationale + examples |
| SKIL-02 | Enum stance | Opinion `ban-enums` + `no-const-enum` exist; skill must cover both |
| SKIL-03 | `any` elimination | Opinions `no-explicit-any`, `prefer-unknown`, `no-unsafe-return` cover this; skill must consolidate |
| SKIL-04 | Type assertion restrictions | Opinion `no-type-assertions` exists; skill must include |
| SKIL-05 | Strict null handling and narrowing | Opinions `strict-null-checks`, `use-type-narrowing`, `exhaustive-switch`, `prefer-optional-chaining`, `no-unnecessary-condition`, `prefer-nullish-coalescing` cover this |
| SKIL-06 | Promise/async discipline | Opinions `no-floating-promises`, `no-misused-promises`, `require-await`, `return-await`, `prefer-async-await` cover this |
| SKIL-07 | `const` by default, naming conventions | Opinions `prefer-const`, `no-var`, `naming-convention`, `no-hungarian-notation`, `boolean-naming` cover this |
| SKIL-08 | Named exports only | Opinion `named-exports-only` + `ban-barrel-files` + `explicit-imports` cover this |
| SKIL-09 | Strict tsconfig recommendations | Opinions `strict-tsconfig`, `no-unchecked-index` cover this |
| SKIL-10 | "Why" rationale per opinion | Spec requirement -- each opinion in skill must include a "why" section; corpus already has Why sections |
| SKIL-11 | Error handling patterns | Opinions `typed-errors`, `result-over-throw`, `error-discrimination`, `no-empty-catch` cover this |
| SKIL-12 | Discriminated union best practices | Opinions `single-discriminant`, `no-destructure-before-narrow`, `exhaustive-discrimination` cover this |
| SKIL-13 | Readonly-by-default patterns | Opinions `prefer-readonly`, `prefer-readonly-params`, `no-mutable-exports` cover this |
| SKIL-14 | Module organization | Opinions `named-exports-only`, `ban-barrel-files`, `explicit-imports`, `no-circular-deps` cover this |
| SKIL-15 | Generic constraint patterns | Opinions `constrain-generics`, `no-unnecessary-generics`, `prefer-generics-over-overloads` cover this |
| SKIL-16 | Branded/nominal type guidance | Opinion `branded-types` covers this |
| SKIL-17 | Variance and conditional type pitfalls | Opinions `variance-annotations`, `conditional-type-safety` cover this |
| SKIL-18 | Pure markdown with YAML frontmatter | Agent Skills spec defines the format; research documents exact fields and constraints |
| SKIL-19 | SKILL.md under 500 lines with progressive disclosure | Spec recommends < 500 lines; reference files handle overflow |
| SKIL-20 | Framework and platform agnostic | Corpus is already agnostic; skill must not introduce framework opinions |
| SKIL-21 | Publishable to Claude skill registry | Agent Skills spec compliance ensures publishability; `name` field must match directory name |
</phase_requirements>

## Standard Stack

This phase produces pure markdown files -- no libraries, no build tools, no runtime dependencies.

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Agent Skills spec | 1.0 | Skill format standard | Open standard supported by Claude Code, Cursor, VS Code Copilot, Gemini CLI, and 30+ agent products |
| Markdown + YAML | N/A | Content format | Required by Agent Skills spec |

### Supporting
| Tool | Purpose | When to Use |
|------|---------|-------------|
| `skills-ref` CLI | Validate skill format | After creating SKILL.md to verify frontmatter compliance |

**Installation (validation only):**
```bash
# Optional -- for validation during development
npx skills-ref validate ./skill
```

## Architecture Patterns

### Required File Layout
```
skill/
├── SKILL.md              # Index + preamble (under 500 lines)
└── references/
    ├── type-safety.md           # Type Safety opinions
    ├── type-declarations.md     # Type Declarations opinions
    ├── null-handling.md         # Null Handling & Narrowing opinions
    ├── async-promises.md        # Async & Promises opinions
    ├── error-handling.md        # Error Handling opinions
    ├── immutability.md          # Immutability & Const opinions
    ├── modules.md               # Module Organization opinions
    ├── naming.md                # Naming Conventions opinions
    ├── discriminated-unions.md  # Discriminated Unions opinions
    ├── generics.md              # Generics & Advanced Types opinions
    ├── branded-types.md         # Branded & Nominal Types opinions
    └── tsconfig-advanced.md     # tsconfig + Conditional Types opinions
```

### Pattern 1: SKILL.md Structure (Index + Preamble)

**What:** SKILL.md serves as a table of contents with inline one-sentence stances, following the Agent Skills progressive disclosure model.

**When to use:** Always -- this is the locked decision from CONTEXT.md.

**Example:**
```yaml
---
name: the-typescript-narrows
description: Provides a single, well-reasoned TypeScript opinion for every common decision point. Eliminates ambiguity when writing, refactoring, or reviewing TypeScript code. Use when generating TypeScript, reviewing TypeScript PRs, or when a TypeScript pattern decision has multiple valid approaches.
---

# The TypeScript Narrows

[10-20 line preamble: what this is, how to use it, severity tiers, exception clause]

## Type Safety

- **Never use explicit `any`** -- use `unknown` and narrow before use
- **Use `unknown` for uncertain types** -- forces callers to narrow
- **Restrict type assertions** -- only proven-safe patterns
- **Ban `!` postfix operator** -- use proper null checks
- **Require explicit boolean comparisons** -- no truthy/falsy shortcuts
- **Type catch variables as `unknown`** -- never assume error shape
- **Never return unsafe `any` values** -- preserves type safety across boundaries

For full details with rationale and examples: [references/type-safety.md](references/type-safety.md)

## Type Declarations
...
```

### Pattern 2: Reference File Structure (Opinion Details)

**What:** Each reference file contains all opinions for a topic group in a skill-optimized format: imperative voice, tighter prose, structured for AI agent scanning.

**When to use:** For every topic group. Each file should be independently useful -- an agent should be able to load just one reference file and get complete guidance for that topic.

**Example:**
```markdown
# Type Safety

## Never use explicit `any`

**Stance:** Never use `any` as a type annotation. Use `unknown` instead and narrow before use.

**Why:** `any` disables the type checker for that value. It silently accepts every operation without verification. If the runtime value doesn't match assumptions, you get a crash with no compile-time warning.

**Do:**
\`\`\`typescript
function processInput(input: unknown): string {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  throw new TypeError("Expected a string");
}
\`\`\`

**Don't:**
\`\`\`typescript
function processInput(input: any): string {
  return input.toUpperCase(); // No error, no safety
}
\`\`\`

**Exception:** Third-party libraries with incomplete type definitions may require `any` at integration boundaries. Prefer `as unknown as ExpectedType` over `as any`.

---

## Use `unknown` for values of uncertain type
...
```

### Pattern 3: Frontmatter Compliance

**What:** The YAML frontmatter MUST follow the Agent Skills spec exactly.

**Constraints verified from official spec:**
- `name`: Required. Max 64 chars. Lowercase letters, numbers, hyphens only. No consecutive hyphens. Must match parent directory name.
- `description`: Required. Max 1024 chars. Non-empty. Third-person voice. Should include what the skill does AND when to use it.
- `name` value `the-typescript-narrows` is valid (38 chars, lowercase, hyphens, no consecutive hyphens).
- The parent directory must also be named `the-typescript-narrows` for spec compliance.

**IMPORTANT CONSTRAINT:** The spec requires `name` to match the parent directory name. The CONTEXT.md says skill files live in `skill/`. This creates a conflict: either the directory must be `the-typescript-narrows/` (matching the name) or the name must be `skill` (matching the directory).

**Resolution options:**
1. Directory: `skill/the-typescript-narrows/SKILL.md` -- nested skill directory with matching name
2. Directory: `the-typescript-narrows/SKILL.md` at repo root -- matching name but changes decided layout
3. Directory: `skill/SKILL.md` with name: `skill` -- matches but wrong skill name

**Recommendation:** Use option 1: `skill/the-typescript-narrows/SKILL.md` with `skill/the-typescript-narrows/references/*.md`. This satisfies both the spec (name matches directory) and the user decision (files under `skill/`). However, note that Claude Code discovers skills from `.claude/skills/` directories -- the `skill/` directory is for the publishable artifact, not for local auto-discovery. Users would install by copying/symlink into `.claude/skills/` or via a plugin.

### Anti-Patterns to Avoid
- **Verbatim corpus copying:** The skill format must be tighter than the corpus. Rewrite in imperative voice, trim explanatory prose.
- **Individual opinion files in references/:** User decided opinions are grouped, not individual. Never create one-opinion-per-file.
- **Framework-specific examples:** No React, Next.js, Express patterns anywhere in skill files. All examples must be pure TypeScript.
- **Deeply nested references:** The spec says "keep file references one level deep from SKILL.md." No `references/subfolder/file.md`.
- **Overly long reference files:** Keep each reference file focused. An agent loading `references/type-safety.md` should get ~7 opinions, not 50.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Skill format validation | Custom YAML/frontmatter validator | `skills-ref validate` CLI | Official validator handles all spec edge cases |
| Opinion grouping logic | Complex algorithm | The 12 existing topic groups from INDEX.md | Groups already defined in Phase 1, battle-tested |
| Progressive disclosure | Custom include/partial system | Agent Skills native reference file pattern | Agents natively resolve relative markdown links |

**Key insight:** This phase is a content transformation task, not a software engineering task. The output is markdown files. The only technical constraint is Agent Skills spec compliance.

## Common Pitfalls

### Pitfall 1: SKILL.md Exceeds 500 Lines
**What goes wrong:** Trying to include too much detail in SKILL.md makes it bloated, consuming excessive context window tokens.
**Why it happens:** 50 opinions with even 3 lines each = 150 lines, plus headers and preamble. Adding examples or rationale to SKILL.md pushes past 500 quickly.
**How to avoid:** SKILL.md contains ONLY: frontmatter, preamble (10-20 lines), and opinion index (one-sentence stances with topic group headers). All details go to references/*.md.
**Warning signs:** SKILL.md approaching 400 lines during authoring.

### Pitfall 2: Name/Directory Mismatch
**What goes wrong:** Agent Skills spec requires `name` field to match the parent directory name. If they differ, `skills-ref validate` fails and some agent products won't load the skill.
**Why it happens:** Easy to overlook when the directory structure was decided before the spec was fully understood.
**How to avoid:** Directory must be named `the-typescript-narrows` to match the `name` frontmatter field.
**Warning signs:** Running `skills-ref validate` after creating the skill.

### Pitfall 3: Description Too Vague for Discovery
**What goes wrong:** Claude never auto-loads the skill because the description doesn't match TypeScript-related prompts.
**Why it happens:** Writing a description focused on what the skill IS rather than WHEN to use it.
**How to avoid:** Description must include trigger keywords: "TypeScript", "writing", "refactoring", "reviewing", "generating", "code review", "type", "interface", "enum", etc.
**Warning signs:** Testing the skill in Claude Code and it doesn't activate on TypeScript prompts.

### Pitfall 4: Including Framework-Specific Content
**What goes wrong:** Examples mention React hooks, Express middleware, Next.js patterns, violating SKIL-20.
**Why it happens:** Many TypeScript patterns are commonly taught in framework contexts.
**How to avoid:** All examples must use plain TypeScript -- functions, classes, types, interfaces, modules. No JSX, no framework imports.
**Warning signs:** Any `import` from `react`, `express`, `next`, `@angular/*`, etc. in code examples.

### Pitfall 5: Losing Opinion Coverage
**What goes wrong:** Some opinions from the 50-item corpus are accidentally omitted during transformation.
**Why it happens:** Grouping and condensing can cause opinions to fall through the cracks.
**How to avoid:** Cross-reference every opinion in `docs/opinions/INDEX.md` against the final SKILL.md index. All 50 must appear.
**Warning signs:** A count of opinions in SKILL.md index not equaling 50.

### Pitfall 6: Inconsistent Severity/Enforcement Metadata
**What goes wrong:** The skill loses the severity and enforcement metadata that downstream phases (3, 4, 5) depend on.
**Why it happens:** Skill format focuses on guidance, not machine-readable metadata.
**How to avoid:** Include severity tier indicators in the SKILL.md index or reference files. Not every opinion needs frontmatter-level metadata, but the information must be recoverable.
**Warning signs:** Phase 5 (Coverage Validation) can't determine which opinions are lint-enforceable from skill files alone.

## Code Examples

### Example 1: Valid SKILL.md Frontmatter
```yaml
---
name: the-typescript-narrows
description: Provides a single, well-reasoned TypeScript opinion for every common decision point. Eliminates the "multiple ways to do it" problem when writing, refactoring, or reviewing TypeScript code. Use when generating TypeScript, performing TypeScript code review, or deciding between multiple valid TypeScript patterns.
---
```
Source: Agent Skills spec (agentskills.io/specification) -- verified HIGH confidence

### Example 2: Preamble Structure (10-20 lines)
```markdown
# The TypeScript Narrows

A single, well-reasoned opinion for every common TypeScript decision point. When there
are five valid ways to do something, this skill picks one and explains why.

## How to use this skill

Apply these opinions when writing new TypeScript code, refactoring existing code, or
reviewing pull requests. Each opinion has a stance (what to do), a rationale (why), and
examples (do/don't).

**Severity tiers** indicate impact:
- **Bug prevention** -- can cause runtime errors or silent wrong behavior
- **Maintenance** -- makes code harder to understand or refactor
- **Style** -- consistency with no functional impact

**Exception clause:** All opinions allow exceptions when there is no other viable
alternative. If you must deviate, explain why in a code comment. Convenience alone
is not a valid exception.
```

### Example 3: Index Entry Format
```markdown
## Error Handling

- **Throw only Error subclasses** -- never throw strings, numbers, or plain objects [B]
- **Prefer Result types for expected failures** -- reserve throw for bugs [M]
- **Use discriminated union errors** -- not string messages for error categories [M]
- **Never swallow errors** -- empty catch blocks hide bugs [B]

For rationale and examples: [references/error-handling.md](references/error-handling.md)
```

### Example 4: Reference File Opinion Format
```markdown
## Throw only Error subclasses

**Stance:** Always throw Error subclasses, never primitives.

**Why:** Non-Error values lose stack traces, making debugging nearly impossible.
`catch (e)` has no useful information when `e` is a string.

**Do:**
\`\`\`typescript
throw new Error("User not found");
// Or custom subclass:
class NotFoundError extends Error {
  constructor(entity: string) {
    super(`${entity} not found`);
    this.name = "NotFoundError";
  }
}
\`\`\`

**Don't:**
\`\`\`typescript
throw "User not found";
throw 404;
throw { message: "fail" };
\`\`\`
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `.claude/commands/*.md` (Claude Code only) | Agent Skills open standard (agentskills.io) | 2025-2026 | Skills work across 30+ agent products, not just Claude Code |
| Flat instruction files | Progressive disclosure (SKILL.md + references/) | Agent Skills spec | Efficient context window usage -- agents load only what's needed |
| Custom frontmatter | Standardized YAML (`name`, `description` required) | Agent Skills spec | Cross-platform compatibility, automated validation |

**Important note on publishing:** SKIL-21 requires publishability. The Agent Skills spec itself does not define a "registry" -- publishing mechanisms are platform-specific. Claude Code supports skills via `.claude/skills/` directories and plugins. The actual publishing step is deferred to Phase 5, but the skill must be spec-compliant to be publishable.

## Open Questions

1. **Directory naming: `skill/` vs `skill/the-typescript-narrows/`**
   - What we know: Agent Skills spec requires `name` to match parent directory name. User decided `skill/` as the top-level directory.
   - What's unclear: Whether to use `skill/SKILL.md` (name would need to be `skill`) or `skill/the-typescript-narrows/SKILL.md` (name matches but adds nesting).
   - Recommendation: Use `skill/the-typescript-narrows/SKILL.md` for spec compliance. The `skill/` directory is the category, `the-typescript-narrows/` is the skill directory per spec. This also allows future skills to coexist under `skill/`.

2. **Whether to merge small topic groups into combined reference files**
   - What we know: There are 12 topic groups, but 2 are very small (Branded Types: 1 opinion, tsconfig: 2 opinions, Conditional Types: 1 opinion).
   - What's unclear: Whether tiny reference files (1-2 opinions) are worth the file overhead.
   - Recommendation: Combine small groups. Merge "Branded & Nominal Types" into generics.md. Merge "tsconfig Strictness" and "Conditional Types & Advanced Pitfalls" into a single `tsconfig-advanced.md`. This reduces to ~10 reference files, each with 3-7 opinions -- better for agent retrieval.

3. **Severity indicators in the index**
   - What we know: User decided all opinions treated equally in the index. But severity metadata is useful for downstream phases.
   - What's unclear: Whether to include [B]/[M]/[S] tags in the SKILL.md index entries.
   - Recommendation: Include severity tags using the same compact notation from INDEX.md ([B]/[M]/[S]). This doesn't create a highlight section for bug-prevention -- it simply annotates each opinion inline, treating them equally while preserving useful metadata.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Shell-based validation (no test framework needed) |
| Config file | none |
| Quick run command | `npx skills-ref validate ./skill/the-typescript-narrows` |
| Full suite command | Manual checklist (content validation) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SKIL-18 | Valid YAML frontmatter | unit | `npx skills-ref validate ./skill/the-typescript-narrows` | Wave 0 |
| SKIL-19 | SKILL.md under 500 lines | unit | `wc -l skill/the-typescript-narrows/SKILL.md` | Wave 0 |
| SKIL-20 | No framework references | unit | `grep -ri "react\|next\|express\|angular\|vue" skill/` (expect no matches) | Wave 0 |
| SKIL-21 | Spec-compliant structure | unit | `npx skills-ref validate ./skill/the-typescript-narrows` | Wave 0 |
| SKIL-01 to SKIL-09, SKIL-11 to SKIL-17 | Opinion content present | unit | `grep -c "##" skill/the-typescript-narrows/references/*.md` (verify opinion headings) | Wave 0 |
| SKIL-10 | "Why" rationale per opinion | unit | `grep -c "\\*\\*Why:\\*\\*" skill/the-typescript-narrows/references/*.md` (count matches = 50) | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx skills-ref validate ./skill/the-typescript-narrows && wc -l skill/the-typescript-narrows/SKILL.md`
- **Per wave merge:** Full suite: validate + line count + framework grep + opinion count
- **Phase gate:** All validation commands pass before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `skill/the-typescript-narrows/` directory -- needs creation
- [ ] `skills-ref` availability -- verify `npx skills-ref validate` works (may need npm install)
- [ ] Validation script: simple shell script to count opinions, check for framework references, verify line count

## Sources

### Primary (HIGH confidence)
- Agent Skills spec (agentskills.io/specification) -- complete format specification, frontmatter fields, directory structure, progressive disclosure
- Claude Code skills docs (code.claude.com/docs/en/skills) -- Claude Code extensions to the spec, frontmatter reference, supporting files pattern
- Anthropic skill authoring best practices (platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) -- progressive disclosure patterns, naming conventions, description writing, anti-patterns

### Secondary (MEDIUM confidence)
- Agent Skills overview (agentskills.io) -- ecosystem adoption (30+ tools), open standard status
- Anthropic example skills repo (github.com/anthropics/skills) -- real-world skill structure examples

### Tertiary (LOW confidence)
- None -- all findings verified against official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Agent Skills spec is well-documented with official sources
- Architecture: HIGH - Progressive disclosure pattern is prescribed by the spec; file layout follows user decisions
- Pitfalls: HIGH - Derived from spec constraints (name/dir matching, 500-line limit) and project requirements (50-opinion coverage, framework agnosticism)
- Content transformation: MEDIUM - Exact formatting of opinion content in skill-optimized format is discretionary; examples provided as guidance

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (Agent Skills spec is stable; unlikely to change significantly in 30 days)
