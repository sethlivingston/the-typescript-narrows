# Phase 7: Version Sync and Skill Completeness - Research

**Researched:** 2026-03-19
**Domain:** Build configuration (tsup), markdown corpus management
**Confidence:** HIGH

## Summary

This phase has two independent workstreams: (1) syncing the ESLint plugin's `meta.version` with `package.json` via build-time injection, and (2) adding 2 missing opinions to SKILL.md plus fixing the `exhaustive-switch` categorization in INDEX.md. Both are straightforward tasks with well-understood tooling.

The version sync uses tsup's `define` option (inherited from esbuild) to replace a constant at build time, eliminating future version drift. The SKILL.md changes are purely additive -- adding two bullets and verifying reference links. The INDEX.md fix moves `exhaustive-switch` from "Null Handling & Narrowing" to "Discriminated Unions".

**Primary recommendation:** Use tsup `define` with a `PACKAGE_VERSION` constant read from `package.json` at build time. Add `no-const-enum` to Type Declarations and `exhaustive-switch` to Discriminated Unions in SKILL.md, matching existing bullet style.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Target version is 1.0.0 (match package.json, which was intentionally bumped)
- Use build-time injection via tsup `define` or similar mechanism so index.ts reads version from package.json automatically
- This prevents future version drift -- no hardcoded version strings in source code
- Add `no-const-enum` as a separate bullet in the Type Declarations section of SKILL.md (not merged into ban-enums)
- Add `exhaustive-switch` as a separate bullet in the Discriminated Unions section of SKILL.md
- Move `exhaustive-switch` from Null Handling to Discriminated Unions in INDEX.md as well
- Each corpus opinion gets a 1:1 bullet in SKILL.md -- no merging related opinions
- While touching SKILL.md, verify all 15 reference file links resolve correctly after the Phase 6 directory rename
- Fix any broken links found

### Claude's Discretion
- Exact tsup configuration for version injection (define, env, or import-based approach)
- Bullet wording for the 2 new SKILL.md entries (match existing style)
- Whether no-const-enum reference links to type-declarations.md or gets its own reference file (follow existing pattern)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LINT-05 | Published on npm as installable package | Version sync ensures `meta.version` matches `package.json` version (1.0.0), prerequisite for correct npm publish. Build-time injection prevents future drift. |
| SKIL-19 | SKILL.md under 500 lines using progressive disclosure (index + reference files) | Adding 2 missing opinions brings SKILL.md to 59 bullets (all corpus opinions). Current line count is 154; adding ~4 lines keeps it well under 500. |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tsup | 8.5.1 | Build/bundle TypeScript | Already installed; has `define` option for build-time constants |

### Supporting
No additional libraries needed. All work uses existing tooling.

**Version verification:** tsup 8.5.1 confirmed installed in `eslint-plugin/node_modules`.

## Architecture Patterns

### Pattern 1: Build-Time Version Injection via tsup `define`

**What:** Use tsup's `define` option (which maps to esbuild's `define`) to replace a global constant with the package.json version string at build time.

**When to use:** Any time you need to embed package metadata in bundled output without hardcoding.

**Implementation approach:**

In `tsup.config.ts`, read version from `package.json` and pass it via `define`:

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  // ... existing config ...
  define: {
    'PACKAGE_VERSION': JSON.stringify(pkg.version),
  },
});
```

In `index.ts`, replace the hardcoded version string:

```typescript
// Replaced at build time by tsup define
declare const PACKAGE_VERSION: string;

const plugin: ESLint.Plugin = {
  meta: {
    name: '@sethlivingston/eslint-plugin-typescript-narrows',
    version: PACKAGE_VERSION,
  },
  // ...
};
```

**Confidence:** HIGH -- tsup's `define` option is typed as `Record<string, string>` in the tsup type definitions (verified in `node_modules/tsup/dist/index.d.ts` line 369). This is a direct passthrough to esbuild's `define`, which performs string replacement at build time.

**Note on import assertion syntax:** The project targets Node 18+. Use `with { type: 'json' }` (import attributes, the current standard) if the TypeScript version supports it; otherwise fall back to `assert { type: 'json' }` or `createRequire`. The implementer should check which syntax the project's TypeScript config supports. Alternatively, use `fs.readFileSync` + `JSON.parse` for maximum compatibility.

### Pattern 2: SKILL.md Bullet Style

**What:** Each opinion gets exactly one bullet in its section, following this pattern:

```markdown
- [Opinion description in imperative mood]. [Severity tag]
```

**Existing examples from Type Declarations section:**
- `- Ban enums (including \`const enum\`); use \`as const\` objects with type unions instead. [B]`
- `- Do not use TypeScript namespaces; use ES modules. [M]`

**New bullets should match this style exactly.**

### Pattern 3: INDEX.md Entry Style

```markdown
- [opinion-id](opinion-file.md) -- Description [Severity] [Enforcement]
```

### Anti-Patterns to Avoid
- **Hardcoding version strings in source:** The whole point of this phase is to eliminate this. Never put a version literal in `index.ts`.
- **Merging related opinions into one bullet:** CONTEXT.md explicitly forbids this. `no-const-enum` gets its own bullet even though `ban-enums` parenthetical mentions const enum.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Version injection | Manual version sync script | tsup `define` option | Zero-maintenance, runs automatically on every build |

## Common Pitfalls

### Pitfall 1: JSON.stringify for define values
**What goes wrong:** Forgetting to `JSON.stringify` the version string in the `define` option, resulting in the replacement being treated as an identifier instead of a string literal.
**Why it happens:** esbuild's `define` does literal text replacement. `define: { X: "1.0.0" }` replaces `X` with the identifier `1.0.0`, not the string `"1.0.0"`.
**How to avoid:** Always wrap with `JSON.stringify()`: `define: { PACKAGE_VERSION: JSON.stringify(pkg.version) }`
**Warning signs:** Runtime error "PACKAGE_VERSION is not defined" or version shows as `undefined`.

### Pitfall 2: Forgetting the `declare const` in source
**What goes wrong:** TypeScript compilation fails because it doesn't know about the build-time constant.
**Why it happens:** `define` is a build-time feature; TypeScript type-checker runs before bundling.
**How to avoid:** Add `declare const PACKAGE_VERSION: string;` in the source file or in a `.d.ts` file.

### Pitfall 3: SKILL.md line count regression
**What goes wrong:** Adding bullets pushes SKILL.md over 500 lines (SKIL-19 requirement).
**Why it happens:** Not checking line count after changes.
**How to avoid:** Current count is 154 lines. Adding 2 bullets adds ~2 lines. Well within budget. Verify after edit.

### Pitfall 4: Forgetting to move exhaustive-switch in INDEX.md
**What goes wrong:** INDEX.md and SKILL.md categorize exhaustive-switch differently.
**Why it happens:** Two files to update, easy to miss one.
**How to avoid:** Update both files in the same task.

## Code Examples

### Version injection in tsup.config.ts

```typescript
// Source: tsup type definitions + esbuild documentation
import { defineConfig } from 'tsup';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  target: 'node18',
  platform: 'node',
  splitting: false,
  sourcemap: false,
  define: {
    PACKAGE_VERSION: JSON.stringify(pkg.version),
  },
  external: [
    'eslint',
    /^@typescript-eslint/,
    /^typescript-eslint/,
    /^eslint-plugin-import/,
    'typescript',
  ],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
});
```

### Updated index.ts

```typescript
import type { ESLint } from 'eslint';
import { rules } from './rules/index.js';
import { createStrictConfig } from './configs/strict.js';

declare const PACKAGE_VERSION: string;

const plugin: ESLint.Plugin = {
  meta: {
    name: '@sethlivingston/eslint-plugin-typescript-narrows',
    version: PACKAGE_VERSION,
  },
  rules: rules as unknown as ESLint.Plugin['rules'],
  configs: {},
};

Object.assign(plugin.configs!, {
  strict: createStrictConfig(plugin),
});

export default plugin;
```

### New SKILL.md bullet for no-const-enum (Type Declarations section)

```markdown
- Never use `const enum`; they break isolatedModules and have cross-project pitfalls. [B]
```

### New SKILL.md bullet for exhaustive-switch (Discriminated Unions section)

```markdown
- Handle all cases in discriminated union switches; use a `never` default to catch missing variants. [B]
```

## Current State Analysis

### Files to modify

| File | Change | Lines affected |
|------|--------|---------------|
| `eslint-plugin/tsup.config.ts` | Add `define` option with PACKAGE_VERSION | ~3 lines added |
| `eslint-plugin/src/index.ts` | Replace hardcoded `'0.9.0'` with `PACKAGE_VERSION`, add `declare const` | ~2 lines changed |
| `plugin/.../SKILL.md` | Add 2 bullets (no-const-enum, exhaustive-switch) | ~2 lines added |
| `docs/opinions/INDEX.md` | Move exhaustive-switch from Null Handling to Discriminated Unions | ~2 lines moved |

### Reference file link verification

All 15 reference files exist in `plugin/the-typescript-narrows/skills/typescript-narrows/references/`:
- async-promises.md, control-flow.md, discriminated-unions.md, error-handling.md, functions.md, generics.md, immutability.md, iteration.md, modules.md, naming.md, null-handling.md, resource-management.md, tsconfig-advanced.md, type-declarations.md, type-safety.md

The Phase 6 rename was from `skill/` to `plugin/`. All 15 links in SKILL.md use relative paths (`references/filename.md`) which are relative to SKILL.md's location, so the directory rename should not have broken them. Verification during implementation should confirm.

### no-const-enum reference file placement

Following existing patterns: `no-const-enum` has `tags: [type-declarations, enums]` in its corpus frontmatter. The Type Declarations section already links to `references/type-declarations.md`. Since the existing pattern is one reference file per section (not per opinion), `no-const-enum` should be covered by the existing `type-declarations.md` reference file. The implementer should verify that `type-declarations.md` mentions const enum content.

### exhaustive-switch reference file placement

`exhaustive-switch` has `tags: [null-handling, narrowing, discriminated-unions]`. Moving it to Discriminated Unions means it should be covered by `references/discriminated-unions.md`. The implementer should verify that file covers exhaustive switch content.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.x |
| Config file | `eslint-plugin/vitest.config.ts` |
| Quick run command | `cd eslint-plugin && npm test` |
| Full suite command | `cd eslint-plugin && npm test && npm run typecheck` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LINT-05 | meta.version matches package.json version | integration | `cd eslint-plugin && npm run build && node -e "const p=require('./dist/index.cjs');const pkg=require('./package.json');if(p.default.meta.version!==pkg.version)throw new Error('mismatch')"` | Wave 0 |
| SKIL-19 | SKILL.md lists all 59 corpus opinions | smoke | `node -e "const fs=require('fs');const s=fs.readFileSync('plugin/the-typescript-narrows/skills/typescript-narrows/SKILL.md','utf-8');const c=s.match(/^- /gm).length;if(c!==59)throw new Error(c+' bullets, expected 59')"` | Wave 0 |

### Sampling Rate
- **Per task commit:** `cd eslint-plugin && npm run build && npm test`
- **Per wave merge:** `cd eslint-plugin && npm run build && npm test && npm run typecheck`
- **Phase gate:** Full suite green + version match + 59 bullet count verified

### Wave 0 Gaps
None -- existing test infrastructure covers build verification. The version match and bullet count checks are simple one-liners that can be run as post-implementation verification commands.

## Sources

### Primary (HIGH confidence)
- tsup type definitions (`node_modules/tsup/dist/index.d.ts` line 369) -- confirmed `define?: { [k: string]: string }` option exists
- Direct file inspection of all files to be modified -- confirmed current state
- npm registry (tsup 8.5.1 installed) -- confirmed version

### Secondary (MEDIUM confidence)
- [tsup documentation](https://tsup.egoist.dev/) -- general documentation (page didn't render full API)
- [esbuild define docs](https://esbuild.github.io/api/#define) -- tsup `define` passes through to esbuild

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, only using existing tsup `define` feature
- Architecture: HIGH -- both workstreams are simple, well-understood modifications
- Pitfalls: HIGH -- pitfalls are well-known esbuild/tsup patterns

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable domain, no fast-moving dependencies)
