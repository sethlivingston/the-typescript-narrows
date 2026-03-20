# Phase 4: Custom ESLint Rules - Research

**Researched:** 2026-03-17
**Domain:** Custom ESLint rule authoring with @typescript-eslint/utils
**Confidence:** HIGH

## Summary

Phase 4 implements two custom ESLint rules (`ban-enums` and `ban-barrel-files`) that address genuine gaps in the existing ESLint ecosystem. The Phase 3 infrastructure (createRule, RuleTester setup, strict config, tsup build) is fully operational and provides a proven pattern to follow. Both rules are AST-only (no type checking required), which keeps implementation straightforward.

The `ban-enums` rule is trivially simple -- it visits `TSEnumDeclaration` nodes and reports. The `ban-barrel-files` rule is moderately complex -- it must analyze whether a file named `index.{ts,js,mts,mjs}` contains only re-export statements, and support an `allowPatterns` option for package entry points. Both rules use the `createRule` utility established in Phase 3.

**Primary recommendation:** Implement ban-enums first (simplest possible rule, validates the workflow), then ban-barrel-files (introduces schema options and program-level analysis), then update configs and integration tests.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **2 custom rules** for Phase 4: `ban-enums` and `ban-barrel-files`
- `ban-enums` is a single rule covering both `enum` and `const enum` declarations (no-const-enum is subsumed, per Phase 1 decision)
- `single-discriminant` and `no-destructure-before-narrow` are deferred to v2
- The placeholder rule from Phase 3 is removed and replaced with real rules
- Both rules verified as genuine gaps
- ban-enums: Flags any `enum` or `const enum` declaration. No autofix. No configuration options.
- ban-barrel-files: Only flags `index.ts`/`index.js`/`index.mts`/`index.mjs` files where EVERY statement is a re-export. Provides `allowPatterns` schema option.
- Error messages: stance + brief alternative + opinion ID in parentheses
- ban-enums message: `"Do not use enums; use as const objects instead. (ban-enums)"`
- ban-barrel-files message: `"Do not use barrel files; import from source modules directly. (ban-barrel-files)"`
- Same message for both `enum` and `const enum` (single messageId)
- 2-3x more valid cases than invalid cases per rule
- Ambient `declare enum` and namespace-nested enums are NOT priority edge cases for v1

### Claude's Discretion
- Internal AST visitor implementation details
- Exact allowPatterns schema format and glob matching approach
- Test file organization (co-located vs separate directory)
- How to detect "pure re-export" vs "mixed content" in barrel file analysis
- Whether to update the Phase 3 smoke test or create a new integration test

### Deferred Ideas (OUT OF SCOPE)
- **single-discriminant custom rule** -- Deferred to v2 due to type-aware AST complexity
- **no-destructure-before-narrow custom rule** -- Deferred to v2 due to type-aware AST complexity
- **Autofixes for all custom rules** -- Deferred to LINT-V2-01 per requirements
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LINT-06 | Custom rules evaluated and built per-phase as opinions are defined | Two rules (ban-enums, ban-barrel-files) identified from opinion corpus with `type: custom` lint field; both verified as genuine gaps |
| LINT-07 | Each custom rule covers a gap that existing typescript-eslint rules cannot address | No existing rule bans all enums (only `no-restricted-syntax` workaround exists); no existing rule detects pure barrel index files |
| LINT-08 | Custom rules have comprehensive test suites (2-3x more valid cases than invalid) | Test matrix defined with 6+ valid cases per rule vs 2-4 invalid cases; RuleTester infrastructure proven in Phase 3 |
</phase_requirements>

## Standard Stack

### Core (already installed from Phase 3)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @typescript-eslint/utils | ^8.0.0 (8.57.1 installed) | createRule, TSESTree types, AST_NODE_TYPES | Official rule authoring toolkit |
| @typescript-eslint/rule-tester | ^8.0.0 (8.57.1 installed) | RuleTester for unit tests | Official test harness, already configured with Vitest |
| vitest | ^4.0.0 (4.1.0 installed) | Test runner | Already configured in Phase 3 |
| tsup | ^8.5.0 (8.5.1 installed) | Build CJS + ESM + .d.ts | Already configured in Phase 3 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| node:path | built-in | `path.basename()` for filename checking in ban-barrel-files | Extract filename from `context.filename` |
| minimatch | 10.2.4 (transitive dep) | Glob matching for allowPatterns | Match file paths against user-provided glob patterns |

### No New Dependencies Needed

The `allowPatterns` option for `ban-barrel-files` needs glob matching. Rather than adding a direct dependency, use `minimatch` which is already available as a transitive dependency of eslint, @typescript-eslint/parser, and eslint-plugin-import-x. **Recommendation:** Add `minimatch` as a direct dependency to avoid relying on transitive availability. Alternatively, use simple string matching (startsWith/endsWith) since the common case is matching specific paths like `src/index.ts`.

**Decision recommendation:** Use `minimatch` as a direct dependency. It is already widely used in the ESLint ecosystem, adds negligible size, and provides standard glob semantics that users will expect.

**Installation:**
```bash
npm install minimatch
```

**Version verification:** minimatch 10.2.4 is the version available in the dependency tree.

## Architecture Patterns

### Rule File Structure
```
eslint-plugin/src/
├── rules/
│   ├── index.ts           # Rule registry (replace placeholder)
│   ├── ban-enums.ts       # New: ban-enums rule
│   └── ban-barrel-files.ts # New: ban-barrel-files rule
├── configs/
│   └── strict.ts          # Add custom rules to preset
├── utils/
│   └── create-rule.ts     # Existing RuleCreator (unchanged)
└── index.ts               # Plugin entry (unchanged)

eslint-plugin/tests/
├── rules/
│   ├── ban-enums.test.ts       # New
│   └── ban-barrel-files.test.ts # New
├── integration/
│   └── smoke.test.ts           # Update to test custom rules in preset
├── setup.ts                    # Existing (unchanged)
```

### Pattern 1: Simple Rule (ban-enums)

**What:** A rule that visits a single AST node type and always reports.
**When to use:** When the rule has no configuration and targets one syntactic construct.

```typescript
// Source: verified against @typescript-eslint/types ast-spec.d.ts
import { createRule } from '../utils/create-rule.js';

export const banEnums = createRule({
  name: 'ban-enums',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ban TypeScript enums; use as const objects instead',
      opinionId: 'ban-enums',
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      banned: 'Do not use enums; use as const objects instead. (ban-enums)',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      TSEnumDeclaration(node) {
        context.report({ node, messageId: 'banned' });
      },
    };
  },
});
```

**Key AST fact (HIGH confidence -- verified from installed ast-spec.d.ts):**
- `TSEnumDeclaration` has a `const: boolean` property (true for `const enum`)
- `TSEnumDeclaration` has a `declare: boolean` property (true for `declare enum`)
- Both `enum Foo {}` and `const enum Foo {}` produce `TSEnumDeclaration` nodes -- a single visitor catches both
- The `id: Identifier` property holds the enum name

### Pattern 2: Rule with Schema Options and Program-Level Analysis (ban-barrel-files)

**What:** A rule that analyzes the entire file on `Program:exit` to determine if it is a pure barrel file.
**When to use:** When the rule needs whole-file context (not just individual nodes).

```typescript
// Source: verified against @typescript-eslint/types ast-spec.d.ts + ESLint context API
import { basename } from 'node:path';
import { createRule } from '../utils/create-rule.js';
import { minimatch } from 'minimatch';

type Options = [{ allowPatterns?: string[] }];

export const banBarrelFiles = createRule<Options, 'banned'>({
  name: 'ban-barrel-files',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ban barrel files (index.ts re-export files)',
      opinionId: 'ban-barrel-files',
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      banned: 'Do not use barrel files; import from source modules directly. (ban-barrel-files)',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowPatterns: {
            type: 'array',
            items: { type: 'string' },
            description: 'Glob patterns for allowed barrel file paths (e.g., "src/index.ts")',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context, [options]) {
    const INDEX_BASENAMES = new Set([
      'index.ts', 'index.js', 'index.mts', 'index.mjs',
    ]);

    return {
      'Program:exit'(node) {
        const filename = context.filename;
        const base = basename(filename);

        // Only check index files
        if (!INDEX_BASENAMES.has(base)) return;

        // Check allowPatterns
        if (options.allowPatterns?.some(pattern => minimatch(filename, pattern))) {
          return;
        }

        // Check if every statement is a re-export
        const body = node.body;
        if (body.length === 0) return; // empty file is not a barrel

        const isAllReExports = body.every(stmt => {
          // export { x } from './y'  (ExportNamedDeclaration with source)
          if (stmt.type === 'ExportNamedDeclaration' && stmt.source != null) {
            return true;
          }
          // export * from './y'  (ExportAllDeclaration always has source)
          if (stmt.type === 'ExportAllDeclaration') {
            return true;
          }
          return false;
        });

        if (isAllReExports) {
          context.report({ node, messageId: 'banned' });
        }
      },
    };
  },
});
```

**Key AST facts (HIGH confidence -- verified from installed ast-spec.d.ts):**
- `ExportNamedDeclarationWithSource`: has `source: StringLiteral` (non-null), `declaration: null` -- this is `export { x } from './y'`
- `ExportNamedDeclarationWithoutSource`: has `source: null` -- this is `export const x = 1` or `export { x }`
- `ExportAllDeclaration`: always has `source: StringLiteral` -- this is `export * from './y'`
- Checking `stmt.source != null` on ExportNamedDeclaration correctly distinguishes re-exports from local exports
- `context.filename` is the current API (v9+); `context.getFilename()` is deprecated, removed in v10

### Pattern 3: Rule Registration and Config Integration

**What:** Register rules in the index and add to strict preset.
**When to use:** Every new rule must be registered.

```typescript
// eslint-plugin/src/rules/index.ts
import { banEnums } from './ban-enums.js';
import { banBarrelFiles } from './ban-barrel-files.js';

export const rules = {
  'ban-enums': banEnums,
  'ban-barrel-files': banBarrelFiles,
};
```

```typescript
// In eslint-plugin/src/configs/strict.ts, add to the typescript-narrows rules block:
'typescript-narrows/ban-enums': 'error',
'typescript-narrows/ban-barrel-files': 'error',
```

### Anti-Patterns to Avoid
- **Visiting individual export nodes instead of Program:exit for ban-barrel-files:** Collecting state across multiple visitor calls is error-prone. Use `Program:exit` and iterate `node.body` once.
- **Using `context.getFilename()` instead of `context.filename`:** The method is deprecated in v9 and removed in v10. This project targets v9+/v10.
- **Adding autofix in v1:** Explicitly deferred to LINT-V2-01. Do not implement fixers.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Glob matching for allowPatterns | Custom glob parser | minimatch | Edge cases in glob semantics (negation, braces, dots) are deceptively complex |
| Rule creation boilerplate | Raw ESLint rule objects | createRule from @typescript-eslint/utils | Provides type safety, URL generation, options inference |
| Rule testing | Manual ESLint.lintText calls | @typescript-eslint/rule-tester | Handles parser setup, error assertion, option validation automatically |

## Common Pitfalls

### Pitfall 1: TSEnumDeclaration.body.members vs TSEnumDeclaration.members
**What goes wrong:** In typescript-eslint v8, enum members moved from `node.members` to `node.body.members` (inside a `TSEnumBody` wrapper). Old examples and tutorials show `node.members`.
**Why it happens:** Breaking change in v8 AST format.
**How to avoid:** For ban-enums, we report on the entire node -- we never need to access members at all. If future rules need members, use `node.body.members`.
**Warning signs:** TypeScript compilation errors about `members` not existing on `TSEnumDeclaration`.

### Pitfall 2: Empty index files being flagged
**What goes wrong:** An empty `index.ts` file with no statements could be flagged as a barrel file if the "all statements are re-exports" check uses vacuous truth (every element of empty set is true).
**Why it happens:** `[].every(() => ...)` returns `true` in JavaScript.
**How to avoid:** Add explicit `if (body.length === 0) return;` guard before the `.every()` check.
**Warning signs:** False positives on empty index files.

### Pitfall 3: Index files with comments only
**What goes wrong:** An `index.ts` with only comments and no statements has `body.length === 0`, same as empty file. This is correctly handled by the empty guard.
**Why it happens:** Comments are not AST statements.
**How to avoid:** The `body.length === 0` guard handles this naturally.

### Pitfall 4: Re-exports mixed with local exports
**What goes wrong:** `export { x } from './y'; export const z = 1;` must NOT be flagged.
**Why it happens:** The second statement is `ExportNamedDeclarationWithoutSourceWithSingle` (source is null).
**How to avoid:** The `.every()` check correctly returns false because `export const z = 1` has `source === null`.
**Warning signs:** Test missing mixed-content valid case.

### Pitfall 5: Type-only re-exports
**What goes wrong:** `export type { Foo } from './bar'` is a re-export and should be counted as such.
**Why it happens:** `exportKind` is `'type'` but `source` is still non-null.
**How to avoid:** Check `source != null` regardless of `exportKind`. Both value and type re-exports are barrel patterns.
**Warning signs:** Barrel file with only type re-exports not being flagged.

### Pitfall 6: Placeholder rule removal breaking tests
**What goes wrong:** Removing the placeholder rule breaks the existing placeholder test and the smoke test that references `typescript-narrows/placeholder`.
**Why it happens:** Phase 3 tests reference the placeholder rule.
**How to avoid:** Remove the placeholder test file and update the smoke test to reference the new rules instead.
**Warning signs:** Test failures after removing placeholder.ts.

## Code Examples

### RuleTester Pattern for ban-enums
```typescript
// Source: Phase 3 placeholder.test.ts pattern + ast-spec.d.ts verification
import { RuleTester } from '@typescript-eslint/rule-tester';
import { banEnums } from '../../src/rules/ban-enums.js';

const ruleTester = new RuleTester();

ruleTester.run('ban-enums', banEnums, {
  valid: [
    // as-const object pattern (the recommended alternative)
    `const Status = { Active: "active", Inactive: "inactive" } as const;`,
    // type union
    `type Status = "active" | "inactive";`,
    // string literal
    `const status: "active" | "inactive" = "active";`,
    // const object without as-const
    `const obj = { a: 1, b: 2 };`,
    // interface declaration
    `interface User { name: string; }`,
    // class declaration
    `class User { name: string = ''; }`,
  ],
  invalid: [
    {
      code: `enum Status { Active, Inactive }`,
      errors: [{ messageId: 'banned' }],
    },
    {
      code: `const enum Direction { Up, Down }`,
      errors: [{ messageId: 'banned' }],
    },
    {
      code: `enum Color { Red = "red", Blue = "blue" }`,
      errors: [{ messageId: 'banned' }],
    },
    {
      code: `enum Num { A = 0, B = 1 }`,
      errors: [{ messageId: 'banned' }],
    },
  ],
});
```

### RuleTester Pattern for ban-barrel-files with filename
```typescript
// Source: @typescript-eslint/rule-tester docs + ESLint RuleTester filename option
import { RuleTester } from '@typescript-eslint/rule-tester';
import { banBarrelFiles } from '../../src/rules/ban-barrel-files.js';

const ruleTester = new RuleTester();

ruleTester.run('ban-barrel-files', banBarrelFiles, {
  valid: [
    // index.ts with original code (not a pure barrel)
    {
      code: `export function greet(): string { return "hi"; }`,
      filename: '/project/src/utils/index.ts',
    },
    // index.ts as allowed entry point via allowPatterns
    {
      code: `export { User } from './user';\nexport { Order } from './order';`,
      filename: '/project/src/index.ts',
      options: [{ allowPatterns: ['**/src/index.ts'] }],
    },
    // non-index file with re-exports (not subject to rule)
    {
      code: `export { User } from './user';`,
      filename: '/project/src/models/types.ts',
    },
    // index.ts with mixed content
    {
      code: `export { User } from './user';\nexport const VERSION = '1.0';`,
      filename: '/project/src/index.ts',
    },
    // empty index file
    {
      code: ``,
      filename: '/project/src/index.ts',
    },
  ],
  invalid: [
    {
      code: `export { User } from './user';\nexport { Order } from './order';`,
      filename: '/project/src/models/index.ts',
      errors: [{ messageId: 'banned' }],
    },
    {
      code: `export * from './user';\nexport * from './order';`,
      filename: '/project/src/models/index.ts',
      errors: [{ messageId: 'banned' }],
    },
  ],
});
```

### Integration Test Pattern
```typescript
// Source: Phase 3 smoke.test.ts pattern
it('reports ban-enums violations in strict preset', async () => {
  const eslint = createESLintWithStrict();
  const results = await eslint.lintText(
    `export enum Status { Active, Inactive }\n`,
    { filePath: join(__dirname, 'test.ts') },
  );
  const ruleIds = results[0].messages.map(m => m.ruleId);
  expect(ruleIds).toContain('typescript-narrows/ban-enums');
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `context.getFilename()` | `context.filename` | ESLint v9 (deprecated) / v10 (removed) | Use property, not method |
| `node.members` on TSEnumDeclaration | `node.body.members` | typescript-eslint v8 | Members wrapped in TSEnumBody |
| Legacy config `.eslintrc` | Flat config `eslint.config.js` | ESLint v9 default | Plugin already targets flat config only |
| JSON Schema v4 for rule schemas | Still JSON Schema v4 | Unchanged | ESLint validates rules with JSON Schema v4 only |

## Open Questions

1. **Should `minimatch` be a direct dependency or should we use simpler string matching?**
   - What we know: minimatch is available transitively; the common allowPatterns use case is matching specific paths
   - What's unclear: Whether the overhead of a direct dependency is justified for a feature that might only need simple prefix matching
   - Recommendation: Add minimatch as a direct dependency. It is the standard in the ESLint ecosystem, weighs ~20KB, and gives users familiar glob semantics. Simple string matching would surprise users who expect `**/*.ts` to work.

2. **Should the smoke test be updated or a new integration test be created?**
   - What we know: Phase 3 smoke test has 3 tests; the third tests the placeholder rule by name
   - What's unclear: Whether modifying vs adding is cleaner
   - Recommendation: Update the existing smoke test. Replace the placeholder test case with ban-enums and ban-barrel-files test cases. The placeholder rule is being removed entirely, so keeping its test makes no sense.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 + @typescript-eslint/rule-tester 8.57.1 |
| Config file | `eslint-plugin/vitest.config.ts` |
| Quick run command | `cd eslint-plugin && npm test` |
| Full suite command | `cd eslint-plugin && npm test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LINT-06 | ban-enums rule implemented and active | unit | `cd eslint-plugin && npx vitest run tests/rules/ban-enums.test.ts` | No -- Wave 0 |
| LINT-06 | ban-barrel-files rule implemented and active | unit | `cd eslint-plugin && npx vitest run tests/rules/ban-barrel-files.test.ts` | No -- Wave 0 |
| LINT-07 | Rules cover gaps not addressed by typescript-eslint | unit | Validated by rule existence and test coverage | N/A |
| LINT-08 | 2-3x more valid cases than invalid per rule | unit | Validated by test file structure (count valid vs invalid) | No -- Wave 0 |
| LINT-06 | Custom rules activate in strict preset | integration | `cd eslint-plugin && npx vitest run tests/integration/smoke.test.ts` | Yes (needs update) |

### Sampling Rate
- **Per task commit:** `cd eslint-plugin && npm test`
- **Per wave merge:** `cd eslint-plugin && npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `eslint-plugin/tests/rules/ban-enums.test.ts` -- covers LINT-06, LINT-08 for ban-enums
- [ ] `eslint-plugin/tests/rules/ban-barrel-files.test.ts` -- covers LINT-06, LINT-08 for ban-barrel-files
- [ ] Update `eslint-plugin/tests/integration/smoke.test.ts` -- replace placeholder tests with custom rule tests
- [ ] Remove `eslint-plugin/tests/rules/placeholder.test.ts` -- obsolete after placeholder removal

## Sources

### Primary (HIGH confidence)
- Installed `@typescript-eslint/types@8.57.1` ast-spec.d.ts -- TSEnumDeclaration, ExportNamedDeclaration, ExportAllDeclaration node shapes
- Installed `@typescript-eslint/utils@8.57.1` Rule.d.ts -- context.filename property
- Phase 3 source code -- createRule utility, placeholder rule pattern, strict config, smoke test

### Secondary (MEDIUM confidence)
- [typescript-eslint custom rules docs](https://typescript-eslint.io/developers/custom-rules/) -- createRule pattern, schema options format
- [ESLint preparing custom rules for v9](https://eslint.org/blog/2023/09/preparing-custom-rules-eslint-v9/) -- context.filename migration
- [ESLint custom rules docs](https://eslint.org/docs/latest/extend/custom-rules) -- Program:exit pattern, visitor lifecycle

### Tertiary (LOW confidence)
- None -- all findings verified against installed packages or official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed and proven in Phase 3
- Architecture: HIGH -- AST node shapes verified from installed type definitions; rule patterns verified from existing placeholder rule
- Pitfalls: HIGH -- pitfalls derived from AST spec analysis and JavaScript semantics (.every on empty arrays), not from web hearsay

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable domain -- ESLint rule authoring patterns are mature)
