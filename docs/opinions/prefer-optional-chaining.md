---
id: prefer-optional-chaining
title: Use optional chaining over manual null checks
severity: style
enforcement: both
confidence: strong
tags: [null-handling, syntax]
related: [prefer-nullish-coalescing, no-non-null-assertion]
lint:
  type: existing
  rule: "@typescript-eslint/prefer-optional-chain"
---

## Stance

Use `?.` optional chaining instead of manual `&&` null checks.

## Why

Optional chaining is more readable, less error-prone, and avoids the truthy/falsy pitfalls of `&&` chains. A single `?.` replaces multiple guard clauses and communicates intent clearly.

## Do

```typescript
const name = user?.profile?.name;
const result = callback?.();
```

## Don't

```typescript
const name = user && user.profile && user.profile.name;
const result = callback ? callback() : undefined;
```
