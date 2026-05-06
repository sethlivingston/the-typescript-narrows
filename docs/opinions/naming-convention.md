---
id: naming-convention
title: "PascalCase types, camelCase values, UPPER_CASE constants"
severity: style
enforcement: both
confidence: strong
tags: [naming, conventions]
related: [no-hungarian-notation]
lint:
  type: existing
  rule: "@typescript-eslint/naming-convention"
---

## Stance

Use PascalCase for types, interfaces, classes, and enums. Use camelCase for variables, functions, methods, and parameters. Use UPPER_CASE for module-level constants. PascalCase is also allowed for variables that represent namespace-style const objects (e.g., `const Body = { none, json } as const`). For build-time injected constants supplied by tooling, `__NAME__` is also allowed.

## Why

Consistent casing makes it immediately clear whether a symbol is a type or a value. This is the dominant convention in the TypeScript ecosystem. When the entire codebase follows the same rules, you never have to guess whether `UserProfile` is a class or a variable — the casing tells you.

PascalCase namespace objects (analogous to built-ins like `Math`, `JSON`, `Array`) are a recognized TypeScript idiom for grouping related values. Banning PascalCase for all variables would force awkward renames like `body` or `BODY` for objects that are conceptually namespace-like.

## Do

```typescript
interface UserProfile {
  displayName: string;
}

const maxRetries = 3;
const MAX_TIMEOUT = 5000;
declare const __APP_RUNTIME_TARGET__: 'browser' | 'node';

// Namespace-style const object — PascalCase is allowed
const Body = { none: 'none', json: 'json', text: 'text' } as const;
type Body = (typeof Body)[keyof typeof Body];

function formatName(user: UserProfile): string {
  return user.displayName;
}
```

## Don't

```typescript
interface userProfile {
  DisplayName: string;
}

// PascalCase for a plain scalar — use camelCase or UPPER_CASE instead
const MaxRetries = 3;
const max_timeout = 5000;
```
