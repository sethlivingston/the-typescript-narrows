---
id: prefer-nullish-coalescing
title: Use ?? instead of || for nullish fallbacks
severity: bug-prevention
enforcement: both
confidence: strong
tags: [null-handling, syntax]
related: [prefer-optional-chaining, strict-boolean-expressions]
lint:
  type: existing
  rule: "@typescript-eslint/prefer-nullish-coalescing"
---

## Stance

Use `??` (nullish coalescing) instead of `||` (logical OR) for default values.

## Why

`||` falls through on `0`, `""`, and `false`, which are often valid values. `??` only falls through on `null` and `undefined`, preserving intentional falsy values.

## Do

```typescript
const port = config.port ?? 3000;
const name = user.name ?? "Anonymous";
```

## Don't

```typescript
const port = config.port || 3000; // Treats 0 as missing
const name = user.name || "Anonymous"; // Treats "" as missing
```
