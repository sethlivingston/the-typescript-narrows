# @sethlivingston/eslint-plugin-typescript-narrows

Opinionated ESLint plugin for TypeScript -- one opinion per decision point.

## Install

```bash
npm install --save-dev @sethlivingston/eslint-plugin-typescript-narrows
```

## Quick Start

```js
import tsnarrows from '@sethlivingston/eslint-plugin-typescript-narrows';

export default [
  ...tsnarrows.configs.strict,
  // your overrides
];
```

## What's Included

- 20+ typescript-eslint rules configured to opinionated defaults
- 3 ESLint core rules
- 3 import-x rules
- 2 custom rules (ban-enums, ban-barrel-files)

30+ rules total, enforcing over half of the project's opinions (some rules cover multiple opinions).

## Custom Rules

| Rule | Description | Auto-fixable |
|------|-------------|:------------:|
| `typescript-narrows/ban-enums` | Bans `enum` and `const enum` declarations in favor of `as const` objects | No |
| `typescript-narrows/ban-barrel-files` | Bans barrel files (index.ts re-export files) | No |

## Companion Plugin

This plugin pairs with [The TypeScript Narrows Claude Plugin](../plugin/the-typescript-narrows/skills/the-typescript-narrows/SKILL.md), which provides all opinions as structured guidance for AI-assisted development. The skill covers the opinions that cannot be enforced through lint rules.

## License

[MIT](LICENSE)
