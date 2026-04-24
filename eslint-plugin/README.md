# @sethlivingston/eslint-plugin-typescript-narrows

Opinionated ESLint plugin for TypeScript

## Install

```bash
npm install --save-dev @sethlivingston/eslint-plugin-typescript-narrows
```

## Quick Start

```js
import tsnarrows from "@sethlivingston/eslint-plugin-typescript-narrows";

export default [
  ...tsnarrows.configs.strict,
  ...tsnarrows.configs.test,
  ...tsnarrows.configs.tooling,
];
```

Use the presets together in that order:

- `strict` for ordinary source files
- `test` for `*.test.*`, `*.spec.*`, `__tests__/`, and `tests/` helpers
- `tooling` for config entrypoints such as `eslint.config.ts`, `vite.config.ts`, `vitest.config.ts`, and `tsup.config.ts`

## Presets

| Preset | Intended files | Notes |
| ------ | -------------- | ----- |
| `configs.strict` | Source code | Main strict preset for production and library code |
| `configs.test` | Test files and test helpers | Relaxes ceremony-heavy rules like explicit return types, readonly parameter types, and `require-await`, while keeping safety rules like `no-floating-promises` |
| `configs.tooling` | Tooling and config entrypoints | Keeps strict behavior but turns off `import/no-default-export` for conventional config files |

## What's Included

- 20+ typescript-eslint rules configured to opinionated defaults
- 3 ESLint core rules
- 3 import-x rules
- 2 custom rules (ban-enums, ban-barrel-files)

30+ rules total, enforcing over half of the project's opinions (some rules cover multiple opinions).

## Custom Rules

| Rule                                  | Description                                                              | Auto-fixable |
| ------------------------------------- | ------------------------------------------------------------------------ | :----------: |
| `typescript-narrows/ban-enums`        | Bans `enum` and `const enum` declarations in favor of `as const` objects |      No      |
| `typescript-narrows/ban-barrel-files` | Bans barrel files (index.ts re-export files)                             |      No      |

## Companion Plugin

This plugin pairs with [The TypeScript Narrows Claude Plugin](../plugin/the-typescript-narrows/skills/typescript-narrows/SKILL.md), which provides all opinions as structured guidance for AI-assisted development. The skill covers the opinions that cannot be enforced through lint rules.

## License

[MIT](LICENSE)
