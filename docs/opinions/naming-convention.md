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

Use PascalCase for types, interfaces, classes, and enums. Use camelCase for variables, functions, methods, and parameters. Use UPPER_CASE for module-level constants.

## Why

Consistent casing makes it immediately clear whether a symbol is a type or a value. This is the dominant convention in the TypeScript ecosystem. When the entire codebase follows the same rules, you never have to guess whether `UserProfile` is a class or a variable -- the casing tells you.

## Do

```typescript
interface UserProfile {
  displayName: string;
}

const maxRetries = 3;
const MAX_TIMEOUT = 5000;

function formatName(user: UserProfile): string {
  return user.displayName;
}
```

## Don't

```typescript
interface userProfile {
  DisplayName: string;
}

const MaxRetries = 3;
const max_timeout = 5000;
```
