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

The strict preset also allows build-time injected constants that follow `^__[_A-Z0-9]+__$`, including declared globals and object-literal `define` maps.

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

## Development & Release

### Prerequisites

The ESLint plugin package uses automated release workflows. To publish a release, you must:

1. Ensure the version bump PR is merged to `main`
2. Have npm package version updated in `eslint-plugin/package.json`
3. Have permission to push tags to the repository
4. Have the `npm-publish` GitHub environment configured with:
   - Trusted publishing enabled (OIDC with npm)
   - Appropriate npm permissions for `@sethlivingston/eslint-plugin-typescript-narrows`

### Release Process

The release is triggered by pushing a git tag with the format `eslint-plugin/v{VERSION}`, where `{VERSION}` matches the `version` field in `eslint-plugin/package.json`.

**To release a new version:**

1. Update `eslint-plugin/package.json` with the new version (e.g., `"version": "1.2.0"`)
2. Commit and push the version bump to `main`
3. Create and push a tag: `git tag eslint-plugin/v1.2.0 && git push origin eslint-plugin/v1.2.0`

### Workflows

- **CI Workflow** (`.github/workflows/ci-eslint-plugin.yml`): Runs on pull requests and pushes to main, validating the package builds, passes tests, and typechecks successfully
- **Release Workflow** (`.github/workflows/release-eslint-plugin.yml`): Triggered by tags matching `eslint-plugin/v*`, performs validation and publishes to npm with provenance, then creates a GitHub release with auto-generated release notes

## License

[MIT](LICENSE)
