# Phase 1: Opinion Foundation - Research

**Researched:** 2026-03-17
**Domain:** TypeScript opinion corpus design and enumeration
**Confidence:** HIGH

## Summary

Phase 1 is a content authoring phase, not a code implementation phase. The deliverable is a set of markdown files with YAML frontmatter in `docs/opinions/`, plus an INDEX.md and README.md. No TypeScript code, no npm packages, no build tooling. The research domain is: (1) what TypeScript ambiguities warrant opinions, (2) how to structure each opinion file for downstream consumption by the Claude Skill (Phase 2) and ESLint Plugin (Phases 3-4), and (3) how to classify opinions by severity and enforcement type.

The user has made detailed decisions about file format, frontmatter fields, severity tiers, enforcement tagging, and file organization. These are locked. Research focuses on the opinion enumeration itself -- which TypeScript ambiguities meet the inclusion bar -- and on ensuring the frontmatter schema is complete enough for downstream phases.

**Primary recommendation:** Build the INDEX.md master list first by enumerating all candidate opinions, then author individual opinion files in batches grouped by topic area. The `lint` field in frontmatter is critical for Phase 3/4 planning -- every lint-enforceable opinion must specify whether it maps to an existing typescript-eslint rule or needs a custom rule.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Format: Markdown files with YAML frontmatter
- ID format: slug-based (e.g., `no-explicit-any`, `prefer-interface`, `ban-enums`)
- Frontmatter fields: `id`, `title`, `severity`, `enforcement`, `confidence`, `tags`, `related`, `lint` (for lint-enforceable opinions)
- Body sections: Stance, Why, Do (one or more), Don't (one or more), Exceptions (optional)
- Code examples: minimal 3-8 line snippets as default, but opinions may include multiple Do and/or Don't blocks when the pattern has distinct variations
- Cross-references: explicit `related` field in frontmatter linking to other opinion IDs
- Exceptions: explicit optional Exceptions section per opinion, plus a corpus-level preamble stating that all opinions allow exceptions when there is no other viable alternative
- Confidence: two levels -- `strong` (community consensus or well-proven) and `moderate` (reasonable people disagree but we're picking a side)
- Tags: freeform tags (not single-category), e.g., `[type-system, generics, variance]`
- No external references field -- opinions are self-contained
- No external links to docs, blog posts, or StackOverflow
- Research-driven enumeration from multiple sources: typescript-eslint rule list, TypeScript FAQ/common errors, StackOverflow top questions, Matt Pocock's content, team experience
- Inclusion bar: any recurring ambiguity where two reasonable TypeScript developers would do it differently
- Master list (INDEX.md) created first before authoring individual opinion files
- Master list grouped by tags, unranked within groups (severity on each opinion captures importance)
- Three severity tiers: bug prevention, maintenance, style
- Three enforcement tags: skill-only, lint-enforceable, both
- For lint-enforceable opinions, frontmatter includes a `lint` field specifying: `type: existing` + `rule: "<rule-name>"` for existing typescript-eslint rules, or `type: custom` for opinions needing new custom rules
- All opinion files in `docs/opinions/` (flat directory, no subdirectories)
- One markdown file per opinion, named by slug
- `docs/opinions/INDEX.md` -- master registry listing all opinions grouped by tags
- `docs/opinions/README.md` -- corpus preamble
- Only `docs/opinions/` directory created in Phase 1 -- `skill/` and `eslint-plugin/` created by their respective phases

### Claude's Discretion
- Exact tag taxonomy (which tags emerge from the enumeration)
- Order of opinions within the master list
- Exact wording of the global exception clause in README.md
- How to handle edge cases where an opinion spans multiple severity tiers

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| OPIN-01 | Enumerate the top 50 TypeScript "multiple ways to do it" ambiguities and gotchas as the canonical opinion list | Candidate opinion enumeration below provides 40-50 opinions organized by topic, sourced from typescript-eslint rules, FEATURES.md research, and common TS decision points |
| OPIN-02 | Each opinion has a clear stance, rationale ("because X"), and severity tier (bug prevention > maintenance > style) | Opinion file template and severity classification guidance provided; frontmatter schema locked by user |
| OPIN-03 | Each opinion is tagged as skill-only, lint-enforceable, or both | Enforcement mapping for each candidate opinion provided, with lint field details for existing vs custom rules |
| OPIN-04 | Up to 50 opinions for v1 if the enumeration surfaces enough that warrant attention; no artificial cap | Candidate list contains ~45 opinions; planner should evaluate each against inclusion bar during authoring |

</phase_requirements>

## Standard Stack

This phase produces no code. The "stack" is the file format and tooling for authoring structured markdown.

### Core
| Tool | Purpose | Why Standard |
|------|---------|--------------|
| Markdown with YAML frontmatter | Opinion file format | Universally parseable, human-readable, consumed by both Claude Skill and potential build scripts |
| Flat file directory (`docs/opinions/`) | Opinion storage | Simple, version-controlled, no database needed for 50 files |

### Supporting
| Tool | Purpose | When to Use |
|------|---------|-------------|
| Any YAML linter | Validate frontmatter syntax | Optional -- catch YAML errors before downstream phases parse the files |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Markdown + YAML | JSON or YAML-only files | Markdown provides readable prose sections (Stance, Why, Do/Don't) that pure data formats lack |
| Flat directory | Nested subdirectories by category | Flat is simpler; tags in frontmatter provide virtual categorization without directory structure |

## Architecture Patterns

### Recommended Project Structure (Phase 1 scope only)
```
the-typescript-narrows/
├── docs/
│   └── opinions/
│       ├── README.md              # Corpus preamble: philosophy, structure, severity tiers, exception clause
│       ├── INDEX.md               # Master registry: all opinions grouped by tags with one-line descriptions
│       ├── no-explicit-any.md     # Individual opinion file
│       ├── prefer-interface.md
│       ├── ban-enums.md
│       └── ...                    # Up to 50 opinion files
└── .planning/                     # Existing planning directory
```

### Pattern 1: Opinion File Template

**What:** Standard template for every opinion markdown file
**When to use:** Every opinion authored in this phase

```markdown
---
id: no-explicit-any
title: Never use explicit any
severity: bug-prevention
enforcement: both
confidence: strong
tags: [type-safety, any]
related: [prefer-unknown, use-type-narrowing]
lint:
  type: existing
  rule: "@typescript-eslint/no-explicit-any"
---

## Stance

Never use `any` as a type annotation. Use `unknown` instead and narrow the type before use.

## Why

`any` disables TypeScript's type checker for that value, allowing silent runtime errors. `unknown` preserves type safety by requiring narrowing before the value can be used.

## Do

```typescript
function parse(input: unknown): string {
  if (typeof input === "string") return input;
  throw new TypeError("Expected string");
}
```

## Don't

```typescript
function parse(input: any): string {
  return input; // No error, no safety
}
```

## Exceptions

Third-party libraries with incomplete type definitions may require `any` at integration boundaries. Prefer `as unknown as ExpectedType` over `as any` when a type assertion is unavoidable.
```

### Pattern 2: INDEX.md Structure

**What:** Master registry grouped by tags with links and one-line descriptions
**When to use:** Created before individual opinion files; updated as opinions are authored

```markdown
# Opinion Index

## Type Safety
- [no-explicit-any](no-explicit-any.md) - Never use explicit `any`; use `unknown` instead
- [prefer-unknown](prefer-unknown.md) - Default to `unknown` for values of uncertain type
...

## Type Declarations
- [prefer-interface](prefer-interface.md) - Use interfaces for object shapes, types for unions/intersections
- [ban-enums](ban-enums.md) - Ban enums; use `as const` objects with type unions
...
```

### Pattern 3: Severity-Based Tier Assignment

**What:** Decision framework for assigning severity tiers consistently
**When to use:** When classifying each opinion

| Tier | Test | Examples |
|------|------|----------|
| bug-prevention | Can cause runtime errors, data corruption, or silent wrong behavior? | `no-explicit-any`, `no-floating-promises`, `use-unknown-in-catch` |
| maintenance | Makes code harder to understand, refactor, or extend over time? | `prefer-interface`, `ban-barrel-files`, `prefer-readonly` |
| style | Consistency and readability with no functional impact? | `prefer-const`, `naming-convention`, `consistent-type-imports` |

**Edge case guidance (Claude's discretion):** When an opinion spans tiers, assign the highest applicable tier. Example: `ban-enums` is maintenance (enums are harder to refactor than const objects) but some enum edge cases cause runtime bugs (const enums in declaration files) -- classify as bug-prevention.

### Anti-Patterns to Avoid
- **Over-scoping opinions:** Each opinion should cover one decision point, not a cluster. "Prefer strict null handling" is too broad; "use exhaustive switch for discriminated unions" is right-sized.
- **Duplicate coverage:** If two candidate opinions cover the same decision point from different angles, merge them into one opinion with multiple Do/Don't blocks.
- **Vague stances:** "Consider using X" is not an opinion. "Use X. Do not use Y." is an opinion.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| YAML frontmatter parsing | Custom parser | `gray-matter` npm package (in Phase 2+) | Handles edge cases in YAML parsing, widely used in static site generators |
| Opinion validation schema | Manual checking | JSON Schema or Zod schema (in Phase 2+) | Ensures every opinion file conforms to the required frontmatter structure |
| Lint rule mapping | Hardcoded list | The `lint` field in each opinion's frontmatter | Distributed knowledge -- each opinion declares its own lint mapping |

**Key insight:** Phase 1 produces content, not code. "Don't hand-roll" primarily applies to downstream phases that will consume these files. However, the frontmatter schema designed now determines what those downstream tools can do.

## Common Pitfalls

### Pitfall 1: Opinion Sprawl
**What goes wrong:** Trying to cover every possible TypeScript decision results in a bloated, unfocused corpus that dilutes high-value opinions.
**Why it happens:** The inclusion bar ("any recurring ambiguity where two reasonable TypeScript developers would do it differently") is broad. Many niche patterns qualify technically.
**How to avoid:** Apply a second filter: "Does this opinion prevent a real, recurring problem or eliminate a common ambiguity?" Niche edge cases that rarely occur in practice should be excluded even if they qualify technically.
**Warning signs:** More than 50 opinions; opinions requiring paragraphs of context just to explain the problem.

### Pitfall 2: Inconsistent Severity Classification
**What goes wrong:** Similar opinions get different severity tiers because classification was done ad hoc rather than systematically.
**Why it happens:** Severity is somewhat subjective. Without a consistent framework, opinions classified early in the process may use different mental models than those classified later.
**How to avoid:** Classify all opinions in a single pass after enumeration is complete, not during authoring. Use the tier test (bug-prevention = runtime impact, maintenance = refactoring impact, style = cosmetic) consistently.
**Warning signs:** Two opinions with similar impact but different tiers; "bug-prevention" opinions that cannot cause actual bugs.

### Pitfall 3: Lint Field Inaccuracy
**What goes wrong:** An opinion is marked `lint-enforceable` with `type: existing` but the referenced typescript-eslint rule does not actually enforce the opinion's stance, or it enforces a different interpretation.
**Why it happens:** Surface-level matching of opinion names to rule names without verifying the rule's actual behavior and configuration options.
**How to avoid:** For every `type: existing` mapping, verify: (1) the rule exists in typescript-eslint, (2) the rule can be configured to match the opinion's stance, (3) the rule is in the strict-type-checked config or can be added independently.
**Warning signs:** Downstream Phase 3/4 discovers that a "simple configuration" actually requires a custom rule.

### Pitfall 4: Code Examples That Don't Compile
**What goes wrong:** Do/Don't code snippets contain syntax errors, reference undefined types, or demonstrate patterns that do not actually work as claimed.
**Why it happens:** Snippets are written in isolation without being type-checked. The 3-8 line constraint makes it tempting to omit necessary context.
**How to avoid:** Every code snippet should be mentally (or actually) type-checked. Include necessary imports or type declarations as comments if they help clarity. The "Do" example should compile clean; the "Don't" example should demonstrate the actual problem.
**Warning signs:** Code snippets that require more than 8 lines of hidden context to compile.

### Pitfall 5: Roadmap Inconsistency on Directory Structure
**What goes wrong:** Phase 1 creates directories beyond `docs/opinions/` that should be created by later phases.
**Why it happens:** The roadmap success criteria mention "docs/opinions/, skill/, and eslint-plugin/ directories" but the CONTEXT.md (user decisions) explicitly states only `docs/opinions/` is created in Phase 1.
**How to avoid:** Follow CONTEXT.md -- only create `docs/opinions/`. Phases 2 and 3 create their own directories.
**Warning signs:** Creating `skill/` or `eslint-plugin/` directories in Phase 1.

## Candidate Opinion Enumeration

This is the core research output: the candidate list of TypeScript ambiguities and gotchas that should form the opinion corpus. Each candidate includes a recommended severity, enforcement type, and lint mapping where applicable.

### Type Safety (7 opinions)

| # | Slug | Title | Severity | Enforcement | Lint Mapping | Confidence |
|---|------|-------|----------|-------------|--------------|------------|
| 1 | `no-explicit-any` | Never use explicit `any` | bug-prevention | both | existing: `@typescript-eslint/no-explicit-any` | strong |
| 2 | `prefer-unknown` | Use `unknown` for values of uncertain type | bug-prevention | both | existing: `@typescript-eslint/no-unsafe-*` family | strong |
| 3 | `no-type-assertions` | Restrict type assertions to proven-safe patterns | bug-prevention | both | existing: `@typescript-eslint/consistent-type-assertions`, `@typescript-eslint/no-unsafe-type-assertion` | strong |
| 4 | `no-non-null-assertion` | Do not use the `!` postfix operator | bug-prevention | both | existing: `@typescript-eslint/no-non-null-assertion` | strong |
| 5 | `strict-boolean-expressions` | Require explicit boolean comparisons | bug-prevention | both | existing: `@typescript-eslint/strict-boolean-expressions` | moderate |
| 6 | `use-unknown-in-catch` | Type catch clause variables as `unknown` | bug-prevention | both | existing: `@typescript-eslint/use-unknown-in-catch-callback-variable` + `useUnknownInCatchVariables` tsconfig | strong |
| 7 | `no-unsafe-return` | Do not return unsafe `any`-typed values | bug-prevention | both | existing: `@typescript-eslint/no-unsafe-return` | strong |

### Type Declarations (5 opinions)

| # | Slug | Title | Severity | Enforcement | Lint Mapping | Confidence |
|---|------|-------|----------|-------------|--------------|------------|
| 8 | `prefer-interface` | Use interfaces for object shapes, types for unions/intersections/utilities | maintenance | both | existing: `@typescript-eslint/consistent-type-definitions` | moderate |
| 9 | `ban-enums` | Ban enums; use `as const` objects with type unions | maintenance | both | custom | strong |
| 10 | `no-namespace` | Do not use TypeScript namespaces | maintenance | both | existing: `@typescript-eslint/no-namespace` | strong |
| 11 | `consistent-type-imports` | Use `import type` for type-only imports | style | both | existing: `@typescript-eslint/consistent-type-imports` | strong |
| 12 | `no-const-enum` | Never use `const enum` | bug-prevention | both | existing: can configure via `no-restricted-syntax` or custom | strong |

### Null Handling & Narrowing (6 opinions)

| # | Slug | Title | Severity | Enforcement | Lint Mapping | Confidence |
|---|------|-------|----------|-------------|--------------|------------|
| 13 | `exhaustive-switch` | Handle all cases in discriminated union switches | bug-prevention | both | existing: `@typescript-eslint/switch-exhaustiveness-check` | strong |
| 14 | `prefer-optional-chaining` | Use optional chaining over manual null checks | style | both | existing: `@typescript-eslint/prefer-optional-chain` | strong |
| 15 | `no-unnecessary-condition` | Do not write conditions that are always true or false | bug-prevention | both | existing: `@typescript-eslint/no-unnecessary-condition` | strong |
| 16 | `prefer-nullish-coalescing` | Use `??` instead of `||` for nullish fallbacks | bug-prevention | both | existing: `@typescript-eslint/prefer-nullish-coalescing` | strong |
| 17 | `use-type-narrowing` | Narrow types with guards instead of assertions | bug-prevention | skill-only | N/A | strong |
| 18 | `strict-null-checks` | Enable `strictNullChecks` (never disable) | bug-prevention | skill-only | N/A (tsconfig, not lintable) | strong |

### Async & Promises (5 opinions)

| # | Slug | Title | Severity | Enforcement | Lint Mapping | Confidence |
|---|------|-------|----------|-------------|--------------|------------|
| 19 | `no-floating-promises` | Always handle Promise rejections | bug-prevention | both | existing: `@typescript-eslint/no-floating-promises` | strong |
| 20 | `no-misused-promises` | Do not pass Promises where void is expected | bug-prevention | both | existing: `@typescript-eslint/no-misused-promises` | strong |
| 21 | `require-await` | Do not mark functions `async` unless they use `await` | maintenance | both | existing: `@typescript-eslint/require-await` | moderate |
| 22 | `return-await` | Always `return await` in try/catch blocks | bug-prevention | both | existing: `@typescript-eslint/return-await` | strong |
| 23 | `prefer-async-await` | Use async/await over `.then()` chains | maintenance | skill-only | N/A | moderate |

### Error Handling (4 opinions)

| # | Slug | Title | Severity | Enforcement | Lint Mapping | Confidence |
|---|------|-------|----------|-------------|--------------|------------|
| 24 | `typed-errors` | Throw only Error subclasses, never primitives | bug-prevention | both | existing: `@typescript-eslint/only-throw-error` | strong |
| 25 | `result-over-throw` | Prefer Result types for expected failures, throw for bugs | maintenance | skill-only | N/A | moderate |
| 26 | `error-discrimination` | Use discriminated union errors, not string messages | maintenance | skill-only | N/A | moderate |
| 27 | `no-empty-catch` | Do not silently swallow errors with empty catch blocks | bug-prevention | both | existing: `no-empty` (ESLint core) + custom guidance | strong |

### Immutability & Const (5 opinions)

| # | Slug | Title | Severity | Enforcement | Lint Mapping | Confidence |
|---|------|-------|----------|-------------|--------------|------------|
| 28 | `prefer-const` | Use `const` by default; `let` only when reassigned | style | both | existing: `prefer-const` (ESLint core) | strong |
| 29 | `no-var` | Never use `var` | style | both | existing: `no-var` (ESLint core) | strong |
| 30 | `prefer-readonly` | Mark class properties `readonly` when not reassigned | maintenance | both | existing: `@typescript-eslint/prefer-readonly` | moderate |
| 31 | `prefer-readonly-params` | Use `Readonly<T>` and `ReadonlyArray<T>` in function params | maintenance | both | existing: `@typescript-eslint/prefer-readonly-parameter-types` | moderate |
| 32 | `no-mutable-exports` | Do not export mutable bindings | maintenance | both | existing: `import/no-mutable-exports` | strong |

### Module Organization (4 opinions)

| # | Slug | Title | Severity | Enforcement | Lint Mapping | Confidence |
|---|------|-------|----------|-------------|--------------|------------|
| 33 | `named-exports-only` | Use named exports; ban default exports | maintenance | both | existing: `import/no-default-export` | strong |
| 34 | `ban-barrel-files` | Do not use barrel files (index.ts re-exports) | maintenance | both | custom | moderate |
| 35 | `explicit-imports` | Import from the source module, not through re-exports | maintenance | skill-only | N/A | moderate |
| 36 | `no-circular-deps` | Avoid circular dependencies | bug-prevention | both | existing: `import/no-cycle` | strong |

### Naming Conventions (3 opinions)

| # | Slug | Title | Severity | Enforcement | Lint Mapping | Confidence |
|---|------|-------|----------|-------------|--------------|------------|
| 37 | `naming-convention` | PascalCase types, camelCase values, UPPER_CASE constants | style | both | existing: `@typescript-eslint/naming-convention` | strong |
| 38 | `no-hungarian-notation` | Do not prefix type names (no `IUser`, `TConfig`, `EStatus`) | style | both | existing: configurable via `@typescript-eslint/naming-convention` | strong |
| 39 | `boolean-naming` | Prefix booleans with `is`, `has`, `should`, `can` | style | skill-only | N/A | moderate |

### Discriminated Unions (3 opinions)

| # | Slug | Title | Severity | Enforcement | Lint Mapping | Confidence |
|---|------|-------|----------|-------------|--------------|------------|
| 40 | `single-discriminant` | Use a single `type` or `kind` field as discriminant | maintenance | both | custom | moderate |
| 41 | `no-destructure-before-narrow` | Do not destructure discriminated unions before narrowing | bug-prevention | both | custom | strong |
| 42 | `exhaustive-discrimination` | Always handle all variants of a discriminated union | bug-prevention | both | existing: `@typescript-eslint/switch-exhaustiveness-check` (partial, overlaps with #13) | strong |

### Generics & Advanced Types (4 opinions)

| # | Slug | Title | Severity | Enforcement | Lint Mapping | Confidence |
|---|------|-------|----------|-------------|--------------|------------|
| 43 | `constrain-generics` | Always constrain generic type parameters | maintenance | skill-only | N/A | moderate |
| 44 | `no-unnecessary-generics` | Do not add type parameters used only once | maintenance | both | existing: `@typescript-eslint/no-unnecessary-type-parameters` | strong |
| 45 | `prefer-generics-over-overloads` | Use generics instead of function overloads when possible | maintenance | skill-only | N/A | moderate |
| 46 | `variance-annotations` | Use `in`/`out` variance annotations on generic classes | maintenance | skill-only | N/A | moderate |

### Branded & Nominal Types (1 opinion)

| # | Slug | Title | Severity | Enforcement | Lint Mapping | Confidence |
|---|------|-------|----------|-------------|--------------|------------|
| 47 | `branded-types` | Use branded types for domain IDs and value objects | maintenance | skill-only | N/A | moderate |

### tsconfig Strictness (2 opinions)

| # | Slug | Title | Severity | Enforcement | Lint Mapping | Confidence |
|---|------|-------|----------|-------------|--------------|------------|
| 48 | `strict-tsconfig` | Enable `strict: true` and all strict family flags | bug-prevention | skill-only | N/A (tsconfig, not lintable) | strong |
| 49 | `no-unchecked-index` | Enable `noUncheckedIndexedAccess` | bug-prevention | skill-only | N/A (tsconfig, not lintable) | strong |

### Conditional Types & Advanced Pitfalls (1 opinion)

| # | Slug | Title | Severity | Enforcement | Lint Mapping | Confidence |
|---|------|-------|----------|-------------|--------------|------------|
| 50 | `conditional-type-safety` | Wrap conditional types to prevent unintended distribution | bug-prevention | skill-only | N/A | moderate |

### Summary Statistics

| Category | Count | Bug Prevention | Maintenance | Style |
|----------|-------|---------------|-------------|-------|
| Type Safety | 7 | 7 | 0 | 0 |
| Type Declarations | 5 | 1 | 3 | 1 |
| Null Handling & Narrowing | 6 | 4 | 0 | 2 |
| Async & Promises | 5 | 3 | 2 | 0 |
| Error Handling | 4 | 2 | 2 | 0 |
| Immutability & Const | 5 | 0 | 3 | 2 |
| Module Organization | 4 | 1 | 3 | 0 |
| Naming Conventions | 3 | 0 | 0 | 3 |
| Discriminated Unions | 3 | 2 | 1 | 0 |
| Generics & Advanced | 4 | 0 | 4 | 0 |
| Branded Types | 1 | 0 | 1 | 0 |
| tsconfig | 2 | 2 | 0 | 0 |
| Conditional Types | 1 | 1 | 0 | 0 |
| **Total** | **50** | **23** | **19** | **8** |

| Enforcement | Count |
|-------------|-------|
| both (skill + lint) | 33 |
| skill-only | 17 |
| lint-enforceable only | 0 |

| Lint Mapping | Count |
|--------------|-------|
| existing typescript-eslint rule | 27 |
| custom rule needed | 4 |
| ESLint core rule | 2 |
| not lintable (skill-only) | 17 |

## Code Examples

### Frontmatter Schema (complete)

```yaml
---
id: slug-based-id                   # Required. Matches filename (without .md)
title: Human-readable title          # Required. Short, imperative.
severity: bug-prevention             # Required. One of: bug-prevention, maintenance, style
enforcement: both                    # Required. One of: skill-only, lint-enforceable, both
confidence: strong                   # Required. One of: strong, moderate
tags: [type-safety, any]             # Required. Freeform array, at least one tag
related: [prefer-unknown]            # Optional. Array of other opinion IDs
lint:                                # Required if enforcement != skill-only
  type: existing                     # One of: existing, custom
  rule: "@typescript-eslint/no-explicit-any"  # Required if type: existing
---
```

### README.md Corpus Preamble (skeleton)

```markdown
# The TypeScript Narrows - Opinions

## Philosophy

This corpus provides a single, well-reasoned opinion for every common TypeScript
decision point. When two reasonable developers would do it differently, we pick
a side and explain why.

## How Opinions Are Structured

Each opinion file contains:
- **Frontmatter**: Machine-readable metadata (severity, enforcement, tags, lint mapping)
- **Stance**: The opinion in one sentence
- **Why**: The rationale -- what goes wrong without this opinion
- **Do**: Code showing the preferred pattern (3-8 lines)
- **Don't**: Code showing the discouraged pattern (3-8 lines)
- **Exceptions** (optional): When the opinion does not apply

## Severity Tiers

| Tier | Meaning |
|------|---------|
| bug-prevention | Can cause runtime errors, data corruption, or silent wrong behavior |
| maintenance | Makes code harder to understand, refactor, or extend over time |
| style | Consistency and readability with no functional impact |

## Global Exception Clause

All opinions allow exceptions when there is no other viable alternative.
If you must deviate, document why in a code comment. The goal is consistency,
not dogma.

## For AI Agents

When consulted, provide the opinion's stance and rationale. If the developer
asks why, explain using the Why section. If they push back with a valid
exception, acknowledge it -- these opinions are strong defaults, not absolute rules.
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Monolithic style guide documents | Structured opinion files with machine-readable frontmatter | 2024-2025 (AI skill era) | Enables both human reading and AI agent consumption |
| typescript-eslint recommended config | strict-type-checked config as baseline | typescript-eslint v6+ (2023) | More opinions enforced by default; less to configure manually |
| ESLint legacy config (.eslintrc) | ESLint flat config (eslint.config.ts) | ESLint v9 (2024), mandatory in v10 (2026) | Plugins export config objects, not string-based extends |
| TypeScript enums | `as const` objects + type unions | Community consensus ~2023-2024 | Enums have edge cases (const enum, declaration merging) that const objects avoid |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | N/A -- Phase 1 produces markdown content, not code |
| Config file | none |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements to Test Map

Phase 1 deliverables are markdown files, not executable code. Validation is structural, not test-based.

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| OPIN-01 | 40-50 opinion files exist in docs/opinions/ | smoke | `ls docs/opinions/*.md \| wc -l` | Wave 0 |
| OPIN-02 | Every opinion has severity in frontmatter | smoke | `grep -L "^severity:" docs/opinions/*.md` (should return empty) | Wave 0 |
| OPIN-03 | Every opinion has enforcement tag | smoke | `grep -L "^enforcement:" docs/opinions/*.md` (should return empty) | Wave 0 |
| OPIN-04 | Opinion count is within budget (up to 50) | smoke | `ls docs/opinions/*.md \| grep -v INDEX \| grep -v README \| wc -l` | Wave 0 |

### Sampling Rate
- **Per task commit:** Visual review of authored opinions for format compliance
- **Per wave merge:** Shell commands to count files and verify frontmatter fields present
- **Phase gate:** All opinion files have valid frontmatter with required fields; INDEX.md lists all opinions

### Wave 0 Gaps
- [ ] `docs/opinions/` directory does not exist yet -- must be created
- [ ] No validation script exists -- simple shell one-liners suffice for this phase
- [ ] INDEX.md and README.md must be created before individual opinions

## Open Questions

1. **Merge or split overlapping opinions?**
   - What we know: `exhaustive-switch` (#13) and `exhaustive-discrimination` (#42) overlap significantly. Both enforce handling all cases of discriminated unions.
   - What's unclear: Whether these are distinct enough to warrant separate opinion files or should be merged.
   - Recommendation: Merge into a single opinion (`exhaustive-discrimination`) that covers both switch exhaustiveness and other narrowing patterns. Remove the duplicate from the final list.

2. **How strict should `prefer-readonly-params` be?**
   - What we know: `@typescript-eslint/prefer-readonly-parameter-types` is notoriously noisy -- it flags parameters that are technically mutable but never mutated, creating false positives with third-party types.
   - What's unclear: Whether to recommend this rule at all, or to recommend it as skill-only guidance.
   - Recommendation: Keep as `both` enforcement but note in the opinion's Exceptions section that third-party types may need exemption. Downstream phases can adjust.

3. **Should `strict-tsconfig` be a single opinion or broken into per-flag opinions?**
   - What we know: The user mentioned `strict: true`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` specifically.
   - What's unclear: Whether to have one catch-all tsconfig opinion or separate opinions for each notable flag.
   - Recommendation: Two opinions as listed (`strict-tsconfig` for the `strict` family, `no-unchecked-index` for the additional flag). `exactOptionalPropertyTypes` can be covered within `strict-tsconfig` since it is part of the strict family recommendation.

## Sources

### Primary (HIGH confidence)
- [typescript-eslint Rules Overview](https://typescript-eslint.io/rules/) - Full rule list with config membership
- [typescript-eslint Shared Configs](https://typescript-eslint.io/users/configs/) - Config hierarchy (recommended, strict, stylistic)
- `.planning/research/FEATURES.md` - Project-specific feature analysis with table stakes and differentiators
- `.planning/research/ARCHITECTURE.md` - Architecture patterns including opinion-first development
- `.planning/research/PITFALLS.md` - Known pitfalls including opinion sprawl and skill-plugin drift

### Secondary (MEDIUM confidence)
- [Total TypeScript - Type vs Interface](https://www.totaltypescript.com/type-vs-interface-which-should-you-use) - Community consensus on interface vs type
- [TypeScript Playground - Types vs Interfaces](https://www.typescriptlang.org/play/typescript/language-extensions/types-vs-interfaces.ts.html) - Official TypeScript comparison

### Tertiary (LOW confidence)
- [Top 16 TypeScript Mistakes](https://dev.to/leapcell/top-16-typescript-mistakes-developers-make-and-how-to-fix-them-4p9a) - Common mistakes list (verified against project research)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - File format is locked by user decisions; no ambiguity
- Architecture: HIGH - File structure is locked by user decisions; patterns derived from project research
- Opinion enumeration: MEDIUM - Candidate list is comprehensive but final inclusion depends on authoring-time evaluation against inclusion bar
- Pitfalls: HIGH - Well-documented in project's own PITFALLS.md research

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable -- this is content design, not library versioning)
