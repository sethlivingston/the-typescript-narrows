---
id: strict-null-checks
title: Enable strictNullChecks (never disable)
severity: bug-prevention
enforcement: skill-only
confidence: strong
tags: [null-handling, tsconfig, strictness]
related: [strict-tsconfig, prefer-nullish-coalescing]
---

## Stance

Never set `strictNullChecks: false`. This flag is included in `strict: true` and must remain enabled.

## Why

Without `strictNullChecks`, every type implicitly includes `null` and `undefined`. The compiler cannot catch null dereference bugs, which are the most common source of runtime crashes in JavaScript and TypeScript applications.

## Do

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Don't

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strictNullChecks": false // Disables null safety
  }
}
```
