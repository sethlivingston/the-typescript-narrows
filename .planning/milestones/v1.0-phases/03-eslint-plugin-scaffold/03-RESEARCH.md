# Phase 3: ESLint Plugin Scaffold - Research

**Researched:** 2026-03-17
**Domain:** ESLint plugin development, flat config API, typescript-eslint integration
**Confidence:** HIGH

## Summary

Building an ESLint plugin for flat config (ESLint 9+/10) is well-documented. The plugin is a plain JavaScript object with `meta`, `rules`, and `configs` properties. The `configs` property uses a self-referencing pattern where the plugin object references itself inside its own config exports. typescript-eslint v8 provides `strict-type-checked` as a flat config array that can be spread into a third-party plugin's preset config.

The corpus has 37 `[both]` opinions. Of those, 32 use `type: existing` rules (from ESLint core, @typescript-eslint, or eslint-plugin-import) and 5 use `type: custom` (deferred to Phase 4). The preset must configure all 32 existing rules with opinionated settings. Three rules require `eslint-plugin-import-x` (the flat-config-native fork of eslint-plugin-import): `import/no-default-export`, `import/no-cycle`, and `import/no-mutable-exports`.

**Primary recommendation:** Build the plugin in `eslint-plugin/` using tsup for dual CJS/ESM output, Vitest + @typescript-eslint/rule-tester for tests, and export a single `strict` config preset that spreads `tseslint.configs.strictTypeChecked` plus opinionated rule overrides.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Plugin code lives in `eslint-plugin/` at repo root (alongside `docs/` and `skill/`)
- npm package name: `eslint-plugin-typescript-narrows`
- Standalone package -- no build-time dependency on `docs/opinions/` corpus files
- Opinion IDs are hardcoded in rule configs; Phase 5 (Coverage Validation) verifies completeness via the corpus `lint` field manifest
- Plugin has its own `package.json`, `tsconfig.json`, `src/`, and `tests/` directories
- Single `strict` preset -- no tiers, no recommended/base variants
- Preset includes typescript-eslint `strict-type-checked` config internally -- users only import one thing
- User DX: `import tsNarrows from 'eslint-plugin-typescript-narrows'` then `...tsNarrows.configs.strict`
- typescript-eslint rules NOT covered by corpus opinions pass through with their strict-type-checked defaults
- Preset only overrides rules where the corpus has a specific opinion
- Stylistic rules from the corpus are included (consistent-type-imports, prefer-interface, etc.)
- Only opinions tagged `both` (lint-enforceable) appear in the preset; `skill-only` opinions are not configured
- Custom rules (Phase 4) get Narrows-style messages: opinion stance + opinion ID
- Existing typescript-eslint rules keep their default messages -- no overrides
- Build: tsup -- produces CJS + ESM + .d.ts type declarations
- Test: Vitest + @typescript-eslint/rule-tester
- Integration smoke test that loads the preset into ESLint flat config, lints a sample .ts file, and verifies expected violations fire
- Placeholder custom rule included to prove rule-writing infrastructure works before Phase 4
- Minimum Node.js version: 18.18+ (ESLint 9's minimum; ESLint 10 requires 20.19+)
- Peer dependencies: eslint ^9 || ^10, @typescript-eslint/parser ^8

### Claude's Discretion
- Exact tsup configuration details
- Placeholder custom rule implementation (trivial rule to prove infrastructure)
- Internal directory structure within `eslint-plugin/src/` (rules/, configs/, etc.)
- Test file organization patterns
- Exact smoke test sample file content

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LINT-01 | ESLint plugin targeting flat config only (ESLint v9+/v10) | Plugin object structure with `meta`, `rules`, `configs`; flat config self-reference pattern documented in Architecture Patterns |
| LINT-02 | Pre-built strict config preset (single import, all opinions as defaults) | Preset spreads `tseslint.configs.strictTypeChecked` + opinionated overrides; 32 existing rules mapped from corpus |
| LINT-03 | Composable with existing typescript-eslint configs and other custom rules | Flat config is array-based composition by design; preset is a config array users spread into their own config |
| LINT-04 | Opinionated configuration of typescript-eslint strict-type-checked rules | Rule override map derived from corpus `lint` fields; 24 @typescript-eslint rules, 3 ESLint core rules, 3 import plugin rules, 2 shared rules |
| LINT-05 | Published on npm as installable package | tsup dual CJS/ESM build, correct `exports` field in package.json, peer deps documented |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| eslint | ^9 \|\| ^10 | Peer dependency -- the linter itself | Target range per user decision |
| typescript-eslint | 8.57.1 | Provides strict-type-checked config + rule utilities | Only option for TS-aware ESLint rules |
| @typescript-eslint/utils | 8.57.1 | RuleCreator, AST utilities for custom rules | Official API for writing typescript-eslint rules |
| @typescript-eslint/parser | ^8 | Peer dependency -- TypeScript parser for ESLint | Required by typescript-eslint rules |
| eslint-plugin-import-x | 4.16.2 | Import rules (no-default-export, no-cycle, no-mutable-exports) | Flat-config-native fork of eslint-plugin-import; corpus references 3 import/ rules |

### Build & Dev
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tsup | 8.5.1 | Dual CJS/ESM bundler with .d.ts generation | Build step for npm publication |
| vitest | 4.1.0 | Test runner | All unit and integration tests |
| @typescript-eslint/rule-tester | 8.57.1 | ESLint rule test harness that integrates with Vitest | Testing custom rules and rule configurations |
| typescript | ^5.5 | TypeScript compiler (dev dependency) | Build and type checking |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| eslint-plugin-import-x | eslint-plugin-import | Original has incomplete flat config support; import-x is the flat-config-native fork recommended by ESLint docs |
| tsup | unbuild or rollup | tsup is simpler for library builds with built-in dts support; no config complexity |

**Installation (inside `eslint-plugin/`):**
```bash
npm init -y
npm install --save-peer eslint @typescript-eslint/parser
npm install typescript-eslint @typescript-eslint/utils eslint-plugin-import-x
npm install -D tsup vitest @typescript-eslint/rule-tester typescript eslint
```

## Architecture Patterns

### Recommended Project Structure
```
eslint-plugin/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── src/
│   ├── index.ts              # Plugin object + config exports (main entry)
│   ├── configs/
│   │   └── strict.ts         # Strict preset config array
│   ├── rules/
│   │   ├── index.ts          # Rule registry (maps rule names to implementations)
│   │   └── placeholder.ts   # Placeholder rule proving infrastructure
│   └── utils/
│       └── create-rule.ts    # RuleCreator factory
├── tests/
│   ├── setup.ts              # Vitest setup: wire RuleTester to Vitest
│   ├── rules/
│   │   └── placeholder.test.ts
│   └── integration/
│       └── smoke.test.ts     # Load preset, lint sample file, verify violations
└── dist/                     # Build output (gitignored)
```

### Pattern 1: Plugin Object with Self-Reference
**What:** ESLint flat config plugins must reference themselves inside their own config exports
**When to use:** Every flat config plugin
**Example:**
```typescript
// Source: https://eslint.org/docs/latest/extend/plugins
import type { ESLint } from 'eslint';
import { rules } from './rules/index.js';
import { createStrictConfig } from './configs/strict.js';

const plugin: ESLint.Plugin = {
  meta: {
    name: 'eslint-plugin-typescript-narrows',
    version: '0.1.0',
  },
  rules,
  configs: {} as Record<string, unknown>,
};

// Self-reference: configs need to reference the plugin object
Object.assign(plugin.configs!, {
  strict: createStrictConfig(plugin),
});

export default plugin;
```

### Pattern 2: Preset Config That Wraps typescript-eslint
**What:** The strict preset spreads typescript-eslint's strictTypeChecked then adds overrides
**When to use:** Building the single `strict` config preset
**Example:**
```typescript
// Source: https://typescript-eslint.io/users/configs/
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import-x';
import type { ESLint, Linter } from 'eslint';

export function createStrictConfig(plugin: ESLint.Plugin): Linter.Config[] {
  return [
    // Include typescript-eslint strict-type-checked
    ...tseslint.configs.strictTypeChecked,

    // Import plugin rules
    {
      plugins: {
        'import': importPlugin,
      },
      rules: {
        'import/no-default-export': 'error',
        'import/no-cycle': 'error',
        'import/no-mutable-exports': 'error',
      },
    },

    // Register our plugin and configure opinionated overrides
    {
      plugins: {
        'typescript-narrows': plugin,
      },
      rules: {
        // ESLint core overrides
        'no-empty': 'error',
        'no-var': 'error',
        'prefer-const': 'error',

        // @typescript-eslint opinionated overrides
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/consistent-type-imports': ['error', {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        }],
        // ... additional rule configs from corpus opinions
      },
    },
  ];
}
```

### Pattern 3: RuleCreator Factory
**What:** typescript-eslint's ESLintUtils.RuleCreator with typed doc metadata
**When to use:** Every custom rule in the plugin
**Example:**
```typescript
// Source: https://typescript-eslint.io/developers/eslint-plugins/
import { ESLintUtils } from '@typescript-eslint/utils';

export interface NarrowsRuleDocs {
  description: string;
  opinionId: string;
  recommended: boolean;
  requiresTypeChecking: boolean;
}

export const createRule = ESLintUtils.RuleCreator<NarrowsRuleDocs>(
  name => `https://github.com/sethlivingston/the-typescript-narrows/blob/main/docs/opinions/${name}.md`,
);
```

### Pattern 4: Vitest + RuleTester Setup
**What:** Wire @typescript-eslint/rule-tester to use Vitest as the test runner
**When to use:** Test setup file referenced by vitest.config.ts
**Example:**
```typescript
// Source: https://typescript-eslint.io/packages/rule-tester/
import * as vitest from 'vitest';
import { RuleTester } from '@typescript-eslint/rule-tester';

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;
```

### Anti-Patterns to Avoid
- **Importing corpus opinion files at build time:** The plugin is standalone. Hardcode rule configs; Phase 5 validates completeness.
- **Exporting legacy/eslintrc configs:** Flat config only. No `module.exports` or `recommended` objects in old format.
- **Creating multiple preset tiers:** Single `strict` preset. No recommended/base/relaxed variants.
- **Overriding existing rule messages:** Only custom rules (Phase 4) get Narrows-style messages. Existing rules keep their default messages.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rule creation utilities | Custom rule factory | `ESLintUtils.RuleCreator` from @typescript-eslint/utils | Handles schema validation, doc URLs, type inference |
| Rule testing | Custom test harness | `@typescript-eslint/rule-tester` with Vitest | Validates valid/invalid cases, error messages, fixes |
| CJS/ESM dual build | Custom rollup config | tsup with `format: ['cjs', 'esm']` | One-line config for dual format + dts |
| Import analysis rules | Custom import tracking | eslint-plugin-import-x | Mature resolver with cycle detection, proven at scale |
| TypeScript parsing | Custom parser | @typescript-eslint/parser | Only option; handles all TS syntax |

## Common Pitfalls

### Pitfall 1: Plugin Self-Reference Circular Dependency
**What goes wrong:** You try to define `configs` inline in the plugin object, but configs need to reference the plugin itself.
**Why it happens:** JavaScript objects cannot reference themselves during construction.
**How to avoid:** Create the plugin object first with empty `configs: {}`, then use `Object.assign(plugin.configs, { strict: ... })` to add configs that reference the plugin.
**Warning signs:** TypeScript circular type errors or `undefined` plugin reference in configs.

### Pitfall 2: eslint-plugin-import vs import-x Namespace Collision
**What goes wrong:** The corpus references rules as `import/no-default-export` but eslint-plugin-import-x might use a different namespace.
**Why it happens:** eslint-plugin-import-x is a fork; in flat config the plugin namespace is set by the key in the `plugins` object.
**How to avoid:** Register eslint-plugin-import-x with the key `'import'` in the plugins object so rules use the `import/` prefix matching the corpus.
**Warning signs:** Rules not found errors when ESLint loads the preset.

### Pitfall 3: Missing languageOptions in Preset
**What goes wrong:** Users get parser errors because the preset does not specify the TypeScript parser.
**Why it happens:** `tseslint.configs.strictTypeChecked` already includes parser configuration, but only if the user provides `languageOptions.parserOptions.projectService` or equivalent.
**How to avoid:** Document that users must provide `languageOptions.parserOptions` with their tsconfig. The preset handles parser selection (via typescript-eslint's config) but cannot know the user's project structure.
**Warning signs:** "Parsing error: Cannot read file" or "You must provide parserOptions.project".

### Pitfall 4: ESLint 10 Node.js Version Mismatch
**What goes wrong:** Plugin claims Node 18 support but ESLint 10 requires Node 20.19+.
**Why it happens:** ESLint 9 supports Node 18.18+, ESLint 10 dropped Node 18.
**How to avoid:** Set plugin's `engines.node` to `>=18.18.0` (matching ESLint 9's floor). Document that ESLint 10 users need Node 20.19+. This is ESLint's concern, not the plugin's.
**Warning signs:** CI failures on Node 18 with ESLint 10.

### Pitfall 5: Missing Peer Dependency on eslint-plugin-import-x
**What goes wrong:** Users install the plugin but get "Cannot find module" for import rules.
**Why it happens:** The preset references import plugin rules but the user has not installed it.
**How to avoid:** List `eslint-plugin-import-x` as a peer dependency. Users must install it alongside the plugin.
**Warning signs:** Module resolution errors at lint time.

### Pitfall 6: tsup External Dependencies
**What goes wrong:** tsup bundles peer dependencies (eslint, typescript-eslint) into the output.
**Why it happens:** tsup bundles everything by default.
**How to avoid:** Mark peer deps and dependencies as external in tsup config, or use `external: [/^eslint/, /^@typescript-eslint/, /^typescript-eslint/, /^eslint-plugin-import/]`.
**Warning signs:** Huge bundle size, duplicate module instances at runtime.

## Code Examples

### tsup Configuration
```typescript
// eslint-plugin/tsup.config.ts
import { defineConfig } from 'tsup';

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

### package.json Exports Field
```json
{
  "name": "eslint-plugin-typescript-narrows",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "engines": {
    "node": ">=18.18.0"
  },
  "peerDependencies": {
    "eslint": "^9.0.0 || ^10.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint-plugin-import-x": "^4.0.0"
  },
  "dependencies": {
    "@typescript-eslint/utils": "^8.0.0",
    "typescript-eslint": "^8.0.0"
  },
  "devDependencies": {
    "@typescript-eslint/rule-tester": "^8.0.0",
    "eslint": "^10.0.0",
    "tsup": "^8.5.0",
    "typescript": "^5.5.0",
    "vitest": "^4.0.0"
  },
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  }
}
```

### Vitest Configuration
```typescript
// eslint-plugin/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.ts'],
    globals: false,
  },
});
```

### Integration Smoke Test Pattern
```typescript
// eslint-plugin/tests/integration/smoke.test.ts
import { describe, it, expect } from 'vitest';
import { ESLint } from 'eslint';
import tsNarrows from '../../src/index.js';

describe('strict preset integration', () => {
  it('activates with a single import and reports expected violations', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: [
        ...tsNarrows.configs.strict,
        {
          languageOptions: {
            parserOptions: {
              projectService: {
                allowDefaultProject: ['*.ts'],
              },
              tsconfigRootDir: __dirname,
            },
          },
        },
      ],
    });

    const results = await eslint.lintText(
      `const x: any = 'hello';\nexport default x;\n`,
      { filePath: 'test.ts' },
    );

    const messages = results[0].messages;
    // Verify at least no-explicit-any and import/no-default-export fire
    expect(messages.some(m => m.ruleId === '@typescript-eslint/no-explicit-any')).toBe(true);
  });
});
```

### Placeholder Custom Rule (Infrastructure Proof)
```typescript
// eslint-plugin/src/rules/placeholder.ts
import { createRule } from '../utils/create-rule.js';

export const placeholder = createRule({
  name: 'placeholder',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Placeholder rule to prove custom rule infrastructure works',
      opinionId: 'placeholder',
      recommended: false,
      requiresTypeChecking: false,
    },
    messages: {
      placeholder: 'This is a placeholder rule. (placeholder)',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Trivial rule: reports on debugger statements
    return {
      DebuggerStatement(node) {
        context.report({ node, messageId: 'placeholder' });
      },
    };
  },
});
```

## Corpus-Derived Rule Configuration Map

The 37 `[both]` opinions break down as follows:

### @typescript-eslint Rules (24 rules)
| Opinion ID | Rule | Notes |
|------------|------|-------|
| no-explicit-any | @typescript-eslint/no-explicit-any | Already in strict-type-checked |
| prefer-unknown | @typescript-eslint/no-unsafe-assignment | Already in strict-type-checked |
| no-type-assertions | @typescript-eslint/consistent-type-assertions | May need option overrides |
| no-non-null-assertion | @typescript-eslint/no-non-null-assertion | Already in strict-type-checked |
| strict-boolean-expressions | @typescript-eslint/strict-boolean-expressions | NOT in strict-type-checked; must add |
| use-unknown-in-catch | @typescript-eslint/use-unknown-in-catch-callback-variable | Already in strict-type-checked |
| no-unsafe-return | @typescript-eslint/no-unsafe-return | Already in strict-type-checked |
| prefer-interface | @typescript-eslint/consistent-type-definitions | Needs `['error', 'interface']` |
| no-namespace | @typescript-eslint/no-namespace | Already in strict-type-checked |
| consistent-type-imports | @typescript-eslint/consistent-type-imports | NOT in strict-type-checked; must add |
| explicit-return-types | @typescript-eslint/explicit-function-return-type | NOT in strict-type-checked; must add |
| exhaustive-switch + exhaustive-discrimination | @typescript-eslint/switch-exhaustiveness-check | Already in strict-type-checked |
| prefer-optional-chaining | @typescript-eslint/prefer-optional-chain | Already in strict-type-checked |
| no-unnecessary-condition | @typescript-eslint/no-unnecessary-condition | Already in strict-type-checked |
| prefer-nullish-coalescing | @typescript-eslint/prefer-nullish-coalescing | Already in strict-type-checked |
| no-floating-promises | @typescript-eslint/no-floating-promises | Already in strict-type-checked |
| no-misused-promises | @typescript-eslint/no-misused-promises | Already in strict-type-checked |
| require-await | @typescript-eslint/require-await | Already in recommended-type-checked |
| return-await | @typescript-eslint/return-await | Already in strict-type-checked |
| typed-errors | @typescript-eslint/only-throw-error | Already in strict-type-checked |
| prefer-readonly | @typescript-eslint/prefer-readonly | NOT in strict-type-checked; must add |
| prefer-readonly-params | @typescript-eslint/prefer-readonly-parameter-types | NOT in strict-type-checked; must add |
| no-unnecessary-generics | @typescript-eslint/no-unnecessary-type-parameters | Already in strict-type-checked |
| naming-convention + no-hungarian-notation | @typescript-eslint/naming-convention | NOT in strict-type-checked; must add with custom options |

### ESLint Core Rules (3 rules)
| Opinion ID | Rule |
|------------|------|
| no-empty-catch | no-empty |
| prefer-const | prefer-const |
| no-var | no-var |

### Import Plugin Rules (3 rules, via eslint-plugin-import-x)
| Opinion ID | Rule |
|------------|------|
| named-exports-only | import/no-default-export |
| no-circular-deps | import/no-cycle |
| no-mutable-exports | import/no-mutable-exports |

### Custom Rules (5, deferred to Phase 4)
| Opinion ID | Notes |
|------------|-------|
| ban-enums | Broader than no-enum; needs AST check for enum declarations |
| ban-barrel-files | No existing rule covers barrel file detection |
| no-const-enum | Part of broader ban-enums custom rule |
| no-destructure-before-narrow | No existing rule; needs discriminated union analysis |
| single-discriminant | No existing rule; needs union type inspection |

### Rules NOT in strict-type-checked (Must Be Added)
These 6 @typescript-eslint rules are not included in `tseslint.configs.strictTypeChecked` and must be explicitly added by the preset:

1. `@typescript-eslint/strict-boolean-expressions` -- opinionated, not in any default config
2. `@typescript-eslint/consistent-type-imports` -- stylistic, only in stylistic-type-checked
3. `@typescript-eslint/explicit-function-return-type` -- not in any default config
4. `@typescript-eslint/prefer-readonly` -- not in any default config
5. `@typescript-eslint/prefer-readonly-parameter-types` -- not in any default config
6. `@typescript-eslint/naming-convention` -- stylistic, only in stylistic-type-checked

**Note:** `@typescript-eslint/consistent-type-definitions` is in stylistic but not strict-type-checked; must be added.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| eslintrc + plugin: ["name"] | Flat config + direct import | ESLint 9 (2024), mandatory in ESLint 10 (2026-02) | Plugins are plain objects, no string-based resolution |
| eslint-plugin-import | eslint-plugin-import-x | 2024 | Fork with native flat config support, actively maintained |
| RuleTester from eslint | @typescript-eslint/rule-tester | typescript-eslint v6+ | Better TypeScript support, typed languageOptions |
| context.getSourceCode() | context.sourceCode | ESLint 10 (2026-02) | Old getter removed in v10 |
| context.getFilename() | context.filename | ESLint 10 (2026-02) | Old getter removed in v10 |

**Deprecated/outdated:**
- `.eslintrc.*` config files: Removed entirely in ESLint 10
- `FlatESLint` / `LegacyESLint` classes: Removed in ESLint 10; use `ESLint` class
- `context.parserOptions` / `context.parserPath`: Removed in ESLint 10

## Open Questions

1. **Exact naming-convention rule options**
   - What we know: The corpus has `naming-convention` and `no-hungarian-notation` opinions both mapping to `@typescript-eslint/naming-convention`
   - What's unclear: The exact option object combining PascalCase types, camelCase values, UPPER_CASE constants, and no-I/T/E prefixes
   - Recommendation: Read both opinion files during implementation to derive the correct option object

2. **eslint-plugin-import-x namespace in preset**
   - What we know: The corpus uses `import/` prefix for rules, and import-x supports being registered under any key
   - What's unclear: Whether registering as `'import'` causes conflicts if users also have their own import plugin config
   - Recommendation: Register as `'import'` for corpus compatibility; document potential conflict in README

3. **prefer-readonly-parameter-types strictness**
   - What we know: This rule is notoriously noisy with false positives for third-party types
   - What's unclear: Whether the corpus opinion expects the default (very strict) or relaxed options
   - Recommendation: Read the opinion file during implementation; likely need `allow` or `treatMethodsAsReadonly` options

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 + @typescript-eslint/rule-tester 8.57.1 |
| Config file | `eslint-plugin/vitest.config.ts` (Wave 0 -- does not exist yet) |
| Quick run command | `cd eslint-plugin && npx vitest run` |
| Full suite command | `cd eslint-plugin && npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LINT-01 | Plugin loads in flat config without errors | integration | `cd eslint-plugin && npx vitest run tests/integration/smoke.test.ts -t "activates"` | No -- Wave 0 |
| LINT-02 | Strict preset applies all 32 existing rule configs | integration | `cd eslint-plugin && npx vitest run tests/integration/smoke.test.ts -t "violations"` | No -- Wave 0 |
| LINT-03 | Plugin composes alongside other configs without conflicts | integration | `cd eslint-plugin && npx vitest run tests/integration/smoke.test.ts -t "composes"` | No -- Wave 0 |
| LINT-04 | Opinionated rule overrides applied correctly | unit | `cd eslint-plugin && npx vitest run tests/configs/strict.test.ts` | No -- Wave 0 |
| LINT-05 | Build produces CJS + ESM + .d.ts | unit | `cd eslint-plugin && npm run build && ls dist/` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `cd eslint-plugin && npx vitest run`
- **Per wave merge:** `cd eslint-plugin && npx vitest run && npm run build`
- **Phase gate:** Full suite green + successful build before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `eslint-plugin/vitest.config.ts` -- Vitest configuration
- [ ] `eslint-plugin/tests/setup.ts` -- RuleTester/Vitest wiring
- [ ] `eslint-plugin/tests/integration/smoke.test.ts` -- Integration smoke test
- [ ] `eslint-plugin/tests/rules/placeholder.test.ts` -- Placeholder rule tests
- [ ] `eslint-plugin/tests/configs/strict.test.ts` -- Preset config validation
- [ ] `eslint-plugin/package.json` -- Package with all dependencies
- [ ] `eslint-plugin/tsconfig.json` -- TypeScript configuration
- [ ] Framework install: `cd eslint-plugin && npm install`

## Sources

### Primary (HIGH confidence)
- [ESLint Create Plugins](https://eslint.org/docs/latest/extend/plugins) -- Plugin object structure, meta, configs self-reference pattern
- [ESLint v10 Migration](https://eslint.org/docs/latest/use/migrate-to-10.0.0) -- Breaking changes, removed APIs, Node.js requirements
- [typescript-eslint ESLint Plugins](https://typescript-eslint.io/developers/eslint-plugins/) -- RuleCreator, package setup, typed linting
- [typescript-eslint Shared Configs](https://typescript-eslint.io/users/configs/) -- Config names, composition, strict-type-checked contents
- [@typescript-eslint/rule-tester](https://typescript-eslint.io/packages/rule-tester/) -- Vitest setup, type-aware testing, test case API
- npm registry -- Verified package versions (eslint 10.0.3, typescript-eslint 8.57.1, tsup 8.5.1, vitest 4.1.0, eslint-plugin-import-x 4.16.2)

### Secondary (MEDIUM confidence)
- [eslint-plugin-import-x npm](https://www.npmjs.com/package/eslint-plugin-import-x) -- Flat config support, peer dependencies
- [Dual Publishing with tsup](https://johnnyreilly.com/dual-publishing-esm-cjs-modules-with-tsup-and-are-the-types-wrong) -- CJS/ESM build patterns, outExtension, exports field

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages verified against npm registry, APIs confirmed via official docs
- Architecture: HIGH -- plugin structure from ESLint official docs, typescript-eslint has explicit plugin guide
- Pitfalls: HIGH -- self-reference pattern is documented; import-x namespace verified; ESLint 10 breaking changes from official migration guide
- Rule mapping: MEDIUM -- corpus lint fields parsed directly from files; which rules are in strict-type-checked based on official docs but exact contents may vary by version

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable ecosystem, unlikely to change)
