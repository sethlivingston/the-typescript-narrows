# Stack Research

**Domain:** Claude skill (markdown-based AI guidance) + custom ESLint plugin with TypeScript rules
**Researched:** 2026-03-16
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| TypeScript | ~5.9.3 | Language for ESLint plugin source | Latest stable. TS 6.0 is RC only (released 2026-03-06) -- too early to adopt. 5.9 is battle-tested and within typescript-eslint's support window. |
| ESLint | ^10.0.0 | Linting runtime consumers install | Released Feb 2026. Flat config only (legacy eslintrc removed entirely). typescript-eslint v8.56+ supports it. Building for v10 ensures no legacy baggage. |
| typescript-eslint | ^8.57.0 | Parser, utils, rule-tester for custom rules | The standard toolkit for TS-aware ESLint rules. Supports ESLint 8/9/10 and TS 5.x. Provides RuleCreator, AST utilities, and type-checked linting infrastructure. |
| Node.js | ^20.19.0 \|\| ^22.13.0 \|\| >=24 | Runtime | Matches ESLint v10's Node.js requirement. LTS 20 and 22 are both in maintenance/active support. |

### ESLint Plugin Dependencies

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@typescript-eslint/utils` | ^8.57.0 | RuleCreator, ESLintUtils, AST types | Every rule file -- mandatory for creating typed ESLint rules |
| `@typescript-eslint/rule-tester` | ^8.57.0 | RuleTester fork with better types and flat config support | Every rule test file -- strongly recommended over ESLint's built-in RuleTester |
| `@typescript-eslint/parser` | ^8.57.0 | TypeScript parser (peer dependency) | Declared as peer dep so consumers bring their own version |
| `eslint` | ^10.0.0 | ESLint core (peer dependency) | Declared as peer dep; also needed as dev dep for testing |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| tsup 8.5.x | Bundle plugin to CJS+ESM | Zero-config TS bundler powered by esbuild. Generates `.d.ts` files. Standard choice for ESLint plugin distribution. |
| Vitest 4.1.x | Test runner | Native TS/ESM support, Jest-compatible API, fast watch mode. Use with @typescript-eslint/rule-tester for rule tests. |
| changesets | Version management + changelogs | Standard for npm package publishing workflow. Generates changelogs from structured changeset files. |
| prettier | Code formatting | Keep formatting concerns out of ESLint rules. The plugin should not include formatting opinions. |

### Skill Component (No Build Dependencies)

| Component | Format | Purpose | Notes |
|-----------|--------|---------|-------|
| SKILL.md | Markdown + YAML frontmatter | Claude skill definition | Self-contained file. No build step. YAML frontmatter has `name` and `description`. Markdown body contains the opinionated guidance. |
| Supporting .md files | Markdown | Extended reference content | SKILL.md should stay under 500 lines. Reference additional markdown files for detailed pattern guides. |

## Project Structure

```
the-typescript-narrows/
  skill/                      # Claude skill (pure markdown)
    SKILL.md                  # Main skill file with frontmatter
    references/               # Extended guidance docs referenced by SKILL.md
      type-patterns.md
      error-handling.md
      async-patterns.md
      ...
  plugin/                     # ESLint plugin (TypeScript, built to JS)
    src/
      rules/                  # Individual rule implementations
        no-enum.ts
        prefer-unknown.ts
        ...
      configs/                # Shared configs (recommended, strict)
        recommended.ts
      index.ts                # Plugin entry point
    tests/
      rules/                  # One test file per rule
    tsup.config.ts
    tsconfig.json
    package.json              # Published as @the-typescript-narrows/eslint-plugin
  package.json                # Workspace root (if monorepo) or redirect
  vitest.config.ts
```

## Installation

```bash
# Dev dependencies for the ESLint plugin
npm install -D typescript@~5.9.3 eslint@^10.0.0 @typescript-eslint/utils@^8.57.0 @typescript-eslint/parser@^8.57.0

# Testing
npm install -D vitest@^4.1.0 @typescript-eslint/rule-tester@^8.57.0

# Building and publishing
npm install -D tsup@^8.5.0 @changesets/cli@^2.29.0

# Formatting
npm install -D prettier
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| tsup | unbuild, rollup | If you need more granular control over output; tsup's zero-config approach is sufficient for an ESLint plugin |
| Vitest | Jest 30 | If the project already uses Jest. For greenfield TS projects, Vitest is the 2026 default -- native ESM/TS, faster cold starts. |
| changesets | semantic-release | If you want fully automated releases from commit messages. Changesets gives more human control over changelogs, better for a single-package project. |
| ESLint 10 | ESLint 9 | If you need to support users still on ESLint 9. Peer dep range `^9.0.0 \|\| ^10.0.0` is possible since typescript-eslint supports both. Start with v10 patterns, test against v9. |
| Flat config only | Support legacy eslintrc | Never. ESLint v10 removed eslintrc entirely. All new plugins should be flat-config-native. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| TypeScript 6.0 RC | Release candidate only (2026-03-06). Not production-stable. Last JS-based release before TS 7 (Go rewrite). | TypeScript ~5.9.3 (latest stable) |
| ESLint's built-in RuleTester | Weaker types, no flat config support, fewer features for TS rules | @typescript-eslint/rule-tester |
| `@typescript-eslint/eslint-plugin` as a dependency | Your plugin should not depend on the main plugin package -- only on `@typescript-eslint/utils` for rule utilities | `@typescript-eslint/utils` |
| tsc for building | Too slow, no bundling, no dual CJS/ESM output | tsup (esbuild-powered, generates .d.ts) |
| Webpack/Rollup | Overkill for a library. ESLint plugins are simple packages, not apps. | tsup |
| eslintrc config format | Removed in ESLint v10. Dead format. | Flat config with `defineConfig()` or `tseslint.config()` |
| Oxlint | Explicitly out of scope per PROJECT.md. Deferred to v2 after ESLint plugin is proven. | ESLint |

## Stack Patterns by Variant

**If rules need type information (type-checked linting):**
- Use `@typescript-eslint/utils` with `getParserServices()` in rule `create()` method
- Export separate configs: `recommended` (no type info) and `recommended-type-checked`
- Require `parserOptions.projectService: true` in the type-checked config
- This is the modern approach (projectService replaces the older `project` option)

**If rules are AST-only (no type information):**
- Use `@typescript-eslint/utils` RuleCreator without `getParserServices()`
- Simpler setup, faster linting, no tsconfig requirement
- Sufficient for pattern-matching rules like "no enums", "prefer const assertions"

**For the Claude skill:**
- Pure markdown, no build step, no dependencies
- SKILL.md with YAML frontmatter (`name`, `description`)
- Keep under 500 lines; use reference files for detailed guidance
- Test by loading into Claude Code and verifying behavior

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| typescript-eslint@^8.57.0 | ESLint ^8.57.0 \|\| ^9.0.0 \|\| ^10.0.0 | Broad ESLint support. Plugin should declare `eslint` as peer dep with range `^9.0.0 \|\| ^10.0.0` (skip v8 for new plugins). |
| typescript-eslint@^8.57.0 | TypeScript >=4.8.4 (but only <2yr-old versions officially) | In practice, target TS ~5.8+ since that's what users have in 2026. |
| ESLint 10 | Node.js ^20.19.0 \|\| ^22.13.0 \|\| >=24 | This is the binding constraint on Node.js version. |
| Vitest 4.x | Node.js >=20 | Aligns with ESLint 10's Node requirement. |
| tsup 8.x | Node.js >=18 | No conflict with the above constraints. |

## Key Technical Decisions

### Peer Dependencies for the Published Plugin

```json
{
  "peerDependencies": {
    "eslint": "^9.0.0 || ^10.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "typescript": ">=5.5.0"
  }
}
```

Supporting ESLint 9 and 10 gives broad compatibility. The plugin code itself should use only flat-config APIs (no eslintrc patterns).

### Plugin Entry Point Pattern

Export the plugin as a default export object with `rules` and `configs` properties, following ESLint's flat config plugin convention. Use `tseslint.config()` for composable shared configs.

### Monorepo vs Single Package

Single package for the ESLint plugin. The skill is pure markdown and can live in the same repo without a separate package. No need for workspace tooling or monorepo complexity.

## Sources

- [typescript-eslint Dependency Versions](https://typescript-eslint.io/users/dependency-versions/) -- peer dep ranges, ESLint/TS/Node compatibility (HIGH confidence)
- [typescript-eslint ESLint Plugins Guide](https://typescript-eslint.io/developers/eslint-plugins/) -- plugin structure, RuleCreator, peer deps (HIGH confidence)
- [typescript-eslint Custom Rules](https://typescript-eslint.io/developers/custom-rules/) -- rule creation patterns (HIGH confidence)
- [@typescript-eslint/rule-tester](https://typescript-eslint.io/packages/rule-tester/) -- testing rules with flat config (HIGH confidence)
- [ESLint v10.0.0 Release](https://eslint.org/blog/2026/02/eslint-v10.0.0-released/) -- breaking changes, Node.js requirements (HIGH confidence)
- [ESLint v10 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0) -- API removals affecting plugin authors (HIGH confidence)
- [Anthropic Skills Repository](https://github.com/anthropics/skills) -- skill format, SKILL.md structure (HIGH confidence)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) -- skill activation, frontmatter (HIGH confidence)
- [TypeScript 6.0 RC Announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0-rc/) -- TS 6.0 status, not yet stable (HIGH confidence)
- [tsup npm](https://www.npmjs.com/package/tsup) -- v8.5.1, bundler for TS libraries (MEDIUM confidence)
- [Vitest](https://vitest.dev/) -- v4.1.0, testing framework (MEDIUM confidence)
- [changesets](https://github.com/changesets/changesets) -- versioning and changelog management (MEDIUM confidence)

---
*Stack research for: TypeScript opinionated guidance skill + ESLint plugin*
*Researched: 2026-03-16*
