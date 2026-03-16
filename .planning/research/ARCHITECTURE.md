# Architecture Research

**Domain:** TypeScript opinionated guidance ecosystem (Claude skill + ESLint plugin)
**Researched:** 2026-03-16
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Shared Opinion Corpus                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Canonical opinion definitions (what + why + examples)    │   │
│  └──────────────┬───────────────────────┬───────────────────┘   │
│                 │                       │                        │
├─────────────────┼───────────────────────┼────────────────────────┤
│                 ▼                       ▼                        │
│  ┌──────────────────────┐  ┌───────────────────────────────┐    │
│  │   Claude Skill        │  │   ESLint Plugin                │    │
│  │   (Markdown artifact) │  │   (npm package artifact)       │    │
│  │                       │  │                                │    │
│  │  SKILL.md             │  │  src/rules/*.ts                │    │
│  │  references/*.md      │  │  src/configs/*.ts              │    │
│  │                       │  │  src/index.ts                  │    │
│  └──────────────────────┘  └───────────────────────────────┘    │
│         │                           │                            │
│         ▼                           ▼                            │
│  Claude skill registry       npm registry                       │
│  + project .claude/skills    + user eslint.config.ts             │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Opinion Corpus | Canonical source of every TypeScript opinion with rationale | Markdown files in `docs/opinions/` organized by category |
| Claude Skill | Human-readable guidance AI agents consult when writing TS | `SKILL.md` + reference files following Agent Skills standard |
| ESLint Plugin | Machine-enforced subset of opinions as lint rules | TypeScript package using `@typescript-eslint/utils` RuleCreator |
| Shared Tests/Examples | Code examples validating opinions across both artifacts | TypeScript snippets used in both skill examples and rule tests |
| Documentation Site | Public docs for humans adopting the opinions | Generated from opinion corpus, optional v2 concern |

## Recommended Project Structure

```
the-typescript-narrows/
├── skill/                          # Claude Skill artifact
│   ├── SKILL.md                    # Entry point (<500 lines, frontmatter + overview)
│   ├── references/                 # Progressive disclosure reference files
│   │   ├── type-patterns.md        # Type system opinions
│   │   ├── code-structure.md       # Code organization opinions
│   │   ├── async-patterns.md       # Async/await opinions
│   │   ├── error-handling.md       # Error handling opinions
│   │   └── module-organization.md  # Module/import opinions
│   └── examples/                   # Code examples Claude can reference
│       └── *.ts
├── eslint-plugin/                  # ESLint Plugin artifact (npm package root)
│   ├── package.json                # Published as eslint-plugin-typescript-narrows
│   ├── tsconfig.json
│   ├── tsup.config.ts              # Build config (tsup for simplicity)
│   ├── src/
│   │   ├── index.ts                # Plugin entry: exports meta, rules, configs
│   │   ├── utils.ts                # RuleCreator factory + shared utilities
│   │   ├── rules/                  # One file per rule
│   │   │   ├── prefer-unknown-over-any.ts
│   │   │   ├── no-enum-declaration.ts
│   │   │   ├── prefer-strict-equality.ts
│   │   │   └── ...
│   │   └── configs/                # Preset configurations
│   │       ├── recommended.ts      # Rules that don't need type info
│   │       └── recommended-type-checked.ts  # Rules requiring type info
│   ├── tests/
│   │   └── rules/                  # Mirrors src/rules/
│   │       ├── prefer-unknown-over-any.test.ts
│   │       └── ...
│   └── docs/
│       └── rules/                  # Auto-generated rule docs
│           └── *.md
├── docs/                           # Shared opinion corpus (source of truth)
│   └── opinions/
│       ├── type-system.md          # Type patterns: unknown vs any, assertions, etc.
│       ├── code-structure.md       # Enums vs const objects, interface vs type, etc.
│       ├── async.md                # Promise patterns, error propagation
│       ├── error-handling.md       # Result types, thrown errors, validation
│       └── modules.md              # Import style, barrel files, re-exports
├── scripts/                        # Build/generation scripts
│   ├── generate-skill.ts           # Compiles opinion corpus into SKILL.md refs
│   └── sync-docs.ts               # Keeps rule docs in sync with opinions
├── package.json                    # Root workspace config
├── tsconfig.json                   # Root TS config
└── .github/
    └── workflows/
        ├── ci.yml                  # Test + lint
        └── publish.yml             # npm publish for plugin, skill packaging
```

### Structure Rationale

- **`docs/opinions/`:** Single source of truth for every opinion. Both the skill references and ESLint rule documentation derive from these files. Prevents drift between what the skill tells AI agents and what the linter enforces.
- **`skill/`:** Standalone directory matching the Agent Skills standard. Can be copied directly into `.claude/skills/` or published to the skill registry. Keeps SKILL.md under 500 lines with progressive disclosure via `references/`.
- **`eslint-plugin/`:** Self-contained npm package with its own package.json. Uses the standard ESLint plugin structure: `src/rules/`, `src/configs/`, `tests/rules/`. Published independently to npm.
- **Root workspace:** Not a monorepo tool like Turborepo or Nx. A simple npm/pnpm workspace is sufficient for two packages. The root coordinates builds and tests.
- **`scripts/`:** Generation scripts that compile the opinion corpus into skill references and sync rule docs. This is the glue that keeps the two artifacts consistent.

## Architectural Patterns

### Pattern 1: Opinion-First Development

**What:** Define every opinion in `docs/opinions/` first, then implement both the skill reference and ESLint rule from that definition. The opinion doc is the spec.
**When to use:** Every new opinion or rule addition.
**Trade-offs:** Adds a small overhead step before implementation, but prevents the skill and linter from diverging. Worth it because divergence is the primary architectural risk.

**Example opinion definition:**
```markdown
<!-- docs/opinions/type-system.md -->

## Prefer `unknown` over `any`

**Opinion:** Use `unknown` instead of `any` for values of uncertain type.

**Why:** `any` disables type checking entirely. `unknown` forces you to narrow
the type before use, catching errors at compile time.

**Do:**
```typescript
function parse(input: unknown): string {
  if (typeof input === "string") return input;
  throw new TypeError("Expected string");
}
```

**Don't:**
```typescript
function parse(input: any): string {
  return input; // No error, no safety
}
```

**Automatable:** Yes
**ESLint rule:** `typescript-narrows/prefer-unknown-over-any`
**Severity:** error
```

### Pattern 2: Flat Config Plugin Architecture

**What:** Export the plugin as a single object with `meta`, `rules`, and `configs` keys. Configs reference the plugin object directly (not by string name). Support both recommended and recommended-type-checked presets.
**When to use:** This is the only way to structure the plugin. Flat config is the current ESLint standard; legacy `.eslintrc` is deprecated.
**Trade-offs:** Simpler than legacy format. The `Object.assign` pattern for configs referencing the plugin is slightly awkward but is the official recommendation.

**Example:**
```typescript
// src/index.ts
import type { ESLint } from "eslint";
import { rules } from "./rules";

const plugin: ESLint.Plugin = {
  meta: {
    name: "eslint-plugin-typescript-narrows",
    version: "0.1.0",
  },
  rules,
  configs: {},
};

// Assign after declaration so configs can reference `plugin`
Object.assign(plugin.configs!, {
  recommended: {
    plugins: { "typescript-narrows": plugin },
    rules: {
      "typescript-narrows/no-enum-declaration": "error",
      "typescript-narrows/prefer-strict-equality": "error",
      // ...rules that don't need type info
    },
  },
  "recommended-type-checked": {
    plugins: { "typescript-narrows": plugin },
    rules: {
      "typescript-narrows/prefer-unknown-over-any": "error",
      // ...rules that need type info
    },
  },
});

export default plugin;
```

### Pattern 3: Progressive Disclosure Skill Structure

**What:** SKILL.md is a concise entry point (<500 lines) with frontmatter. Detailed opinions live in `references/*.md` files that Claude loads on demand. References are one level deep from SKILL.md (never nested references pointing to more references).
**When to use:** Always for this project. The full opinion set will far exceed 500 lines.
**Trade-offs:** Requires thoughtful information architecture so Claude finds the right reference file. The description in frontmatter and the reference index in SKILL.md are critical for discovery.

**Example SKILL.md structure:**
```yaml
---
name: typescript-narrows
description: Opinionated TypeScript guidance for AI coding agents. Provides
  strong opinions on type patterns, code structure, async patterns, error
  handling, and module organization. Use when writing or refactoring TypeScript
  code to produce consistent, idiomatic, pitfall-free output.
---

# The TypeScript Narrows

Opinionated TypeScript guidance. When writing TypeScript, follow these opinions.

## Quick Reference

- **Type system:** Prefer `unknown` over `any`, avoid type assertions,
  use discriminated unions over type guards when possible
- **Code structure:** Use const objects over enums, prefer `type` over
  `interface` unless extending, avoid classes for data
- **Async:** Always handle rejections, prefer async/await over .then chains
- **Errors:** Use typed error results for expected failures, throw for bugs
- **Modules:** Named exports only, no barrel files, explicit imports

## Detailed Opinions

- Type patterns and type system: see [references/type-patterns.md](references/type-patterns.md)
- Code structure and declarations: see [references/code-structure.md](references/code-structure.md)
- Async and concurrency: see [references/async-patterns.md](references/async-patterns.md)
- Error handling strategies: see [references/error-handling.md](references/error-handling.md)
- Module organization and imports: see [references/module-organization.md](references/module-organization.md)
```

## Data Flow

### Opinion Authoring Flow

```
Author writes opinion
       ↓
docs/opinions/*.md  (canonical source of truth)
       ↓
  ┌────┴────────────────────┐
  ↓                         ↓
skill/references/*.md    eslint-plugin/src/rules/*.ts
(human-readable guide)   (machine-enforced rule)
  ↓                         ↓
skill/SKILL.md           eslint-plugin/src/configs/*.ts
(entry point index)      (preset bundles)
  ↓                         ↓
Skill registry           npm registry
```

### Consumer Usage Flows

**AI Agent Flow:**
```
Developer asks AI to write TypeScript
    ↓
AI agent detects TypeScript context
    ↓
Claude loads skill description from context
    ↓
Skill triggers → SKILL.md loaded
    ↓
AI reads relevant reference file (e.g., references/type-patterns.md)
    ↓
AI generates code following opinions
    ↓
ESLint plugin catches any remaining violations
```

**Linter Flow:**
```
Developer runs ESLint (or CI runs it)
    ↓
eslint.config.ts imports plugin
    ↓
Plugin provides rules + preset config
    ↓
ESLint + typescript-eslint parser analyze AST
    ↓
Plugin rules flag violations with fix suggestions
    ↓
Developer (or AI agent) applies fixes
```

### Key Data Flows

1. **Opinion-to-artifact:** Opinions in `docs/opinions/` flow outward to both the skill references and ESLint rules. Changes start in the opinion corpus and propagate to both artifacts.
2. **Build-time generation:** Scripts in `scripts/` can automate propagation (generating skill references from opinion docs, syncing rule docs), but this is an optimization, not a requirement for v1. Manual sync is acceptable initially.
3. **Runtime independence:** The skill and ESLint plugin have zero runtime coupling. They never import each other, never share code at runtime, and are distributed through entirely different channels. Their only connection is the shared opinion corpus at authorship time.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| <20 opinions | Manual sync between opinion corpus and artifacts is fine. Single maintainer. |
| 20-50 opinions | Generation scripts become necessary to prevent drift. Rule naming conventions matter. |
| 50+ opinions | Consider categorized config presets beyond just recommended (e.g., strict, stylistic). Community contributions need contribution guides. |

### Scaling Priorities

1. **First bottleneck:** Skill reference files exceeding useful size. Split references into finer-grained categories when any single file exceeds ~300 lines. Claude handles many small files better than a few huge ones.
2. **Second bottleneck:** Rule maintenance burden. As rule count grows, invest in `eslint-doc-generator` for automated rule docs and config tables. Add a CI check that every rule in `src/rules/` has a test file and doc file.

## Anti-Patterns

### Anti-Pattern 1: Coupling Skill and Plugin at Runtime

**What people do:** Import shared TypeScript modules between the skill and plugin, or make the skill reference the plugin's rule names dynamically.
**Why it's wrong:** The skill is markdown consumed by AI agents. The plugin is a JS package consumed by ESLint. They have completely different runtimes, consumers, and distribution channels. Any coupling creates a fragile build that breaks one artifact when the other changes.
**Do this instead:** Share opinions at the documentation layer only. Both artifacts read from `docs/opinions/` at authorship/build time. At runtime they are independent.

### Anti-Pattern 2: Putting All Opinions in SKILL.md

**What people do:** Write a single massive SKILL.md with every opinion inline.
**Why it's wrong:** Claude's skill system loads the full SKILL.md when triggered. A 2000-line file wastes context window tokens and competes with conversation history. The official best practice is to keep SKILL.md under 500 lines.
**Do this instead:** Use progressive disclosure. SKILL.md is a concise index with quick-reference summaries. Detailed opinions live in `references/*.md` files that Claude reads on demand.

### Anti-Pattern 3: Legacy ESLint Config Format

**What people do:** Export configs in the `.eslintrc` format (using `extends` strings, `env`, `parserOptions`).
**Why it's wrong:** ESLint flat config is the standard since ESLint v9. The legacy format is deprecated. New plugins should only support flat config.
**Do this instead:** Export configs as flat config objects with the plugin directly in the `plugins` key. Use the `Object.assign` pattern to reference the plugin object from configs.

### Anti-Pattern 4: Duplicating typescript-eslint Rules

**What people do:** Re-implement rules that typescript-eslint already provides (like `no-explicit-any`, `strict-boolean-expressions`).
**Why it's wrong:** Duplicated rules conflict with existing configs, confuse users, and create maintenance burden. The project explicitly builds on typescript-eslint strict config.
**Do this instead:** The ESLint plugin only contains rules for opinions NOT already covered by typescript-eslint. The skill can reference typescript-eslint rules in its guidance. The recommended config can re-export or extend typescript-eslint strict where appropriate.

### Anti-Pattern 5: Framework-Specific Opinions

**What people do:** Include opinions about React hooks, Next.js routing, Express middleware patterns.
**Why it's wrong:** The project is explicitly framework-agnostic. Framework opinions fragment the audience and create maintenance burden across framework version changes.
**Do this instead:** Keep all opinions at the TypeScript language level. The skill and rules should work identically whether the user is building a React app, a CLI tool, or a server.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| npm registry | Standard `npm publish` from `eslint-plugin/` | Package name: `eslint-plugin-typescript-narrows` |
| Claude skill registry | Publish `skill/` directory | Follows Agent Skills open standard |
| typescript-eslint | Peer dependency for parser + utils | Pin to same major version (v8+) |
| ESLint | Peer dependency, flat config only | Minimum ESLint v9 |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Opinion corpus to Skill | Build-time file generation or manual copy | One-directional: opinions flow to skill |
| Opinion corpus to Plugin | Developer reads opinion, writes rule | One-directional: opinions inform rules |
| Skill to Plugin | None at runtime | Completely independent artifacts |
| Plugin rules to Plugin configs | Direct import within package | Configs reference rule names |

## Build Order (Dependency Graph for Phases)

The components have a clear dependency ordering that should inform roadmap phase structure:

```
1. Opinion Corpus (docs/opinions/)
   ↓ depends on nothing
2. Claude Skill (skill/)
   ↓ depends on: opinion corpus
3. ESLint Plugin skeleton (eslint-plugin/ with build + test infrastructure)
   ↓ depends on nothing (but opinions inform what rules to write)
4. ESLint Rules (eslint-plugin/src/rules/)
   ↓ depends on: plugin skeleton + opinion corpus
5. ESLint Configs (eslint-plugin/src/configs/)
   ↓ depends on: rules being defined
6. Generation scripts (scripts/)
   ↓ depends on: opinion corpus + both artifacts existing
7. Publishing + distribution
   ↓ depends on: everything above
```

**Key insight:** The opinion corpus and skill can be built in parallel with the ESLint plugin skeleton. Rules and configs follow. Generation scripts and publishing are last-mile concerns.

## Sources

- [typescript-eslint ESLint Plugins guide](https://typescript-eslint.io/developers/eslint-plugins/) -- Plugin structure, RuleCreator, dependencies
- [ESLint Plugin Migration to Flat Config](https://eslint.org/docs/latest/extend/plugin-migration-flat-config) -- Flat config plugin object structure, meta/configs/rules exports
- [Claude Code Skills documentation](https://code.claude.com/docs/en/skills) -- SKILL.md format, frontmatter, directory layout, discovery
- [Claude Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) -- Progressive disclosure, conciseness, naming, evaluation
- [ESLint flat config extends (March 2025)](https://eslint.org/blog/2025/03/flat-config-extends-define-config-global-ignores/) -- defineConfig and extends pattern
- [TypeScript ESLint Plugin template](https://github.com/kotarella1110/typescript-template-eslint-plugin) -- Reference implementation for plugin structure

---
*Architecture research for: TypeScript opinionated guidance ecosystem*
*Researched: 2026-03-16*
